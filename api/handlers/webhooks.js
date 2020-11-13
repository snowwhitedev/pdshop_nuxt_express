const { WEBHOOK_SECRET, STRIPE_SECRET_KEY } = require('../../nuxt.config').privateRuntimeConfig;
// eslint-disable-next-line import/order
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const { getStoreByStripeAccount } = require('../models/stores');
const { fetchCouponByName, createCoupon } = require('../models/coupons');
const {
  createProduct,
  updateProductRecord,
  getProductByStripeId,
  deleteProductRecord
} = require('../models/products');

const { deleteSubscriptionRecord } = require('../models/subscriptions');

exports.handleStripeProductsWebhook = async function (req, res) {
  let stripe_event;
  const signature = req.headers['stripe-signature'];
  try {
    stripe_event = stripe.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).json({ webhook_error: `Error - ${error}` });
  }

  const store = await getStoreByStripeAccount(stripe_event.account);
  switch (stripe_event.type) {
    case 'product.created':
      try {
        const product = await getProductByStripeId(stripe_event.data.object.id);
        if (product) {
          req.log.info('Notification: ');
        } else {
          await createProduct({
            name: stripe_event.data.object.name,
            title: stripe_event.data.object.name,
            description: stripe_event.data.object.description,
            stripe_product_id: stripe_event.data.object.id,
            store_id: store.store_id
          });
        }

        req.log.info('New product created');
      } catch (error) {
        req.log.error(error);
        return res.status(500).json('error - ' + error);
      }
      break;
    case 'product.updated':
      try {
        const product = await getProductByStripeId(stripe_event.data.object.id);
        await updateProductRecord(product.product_id, {
          name: stripe_event.data.object.name,
          title: stripe_event.data.object.name,
          description: stripe_event.data.object.description,
          stripe_product_id: stripe_event.data.object.id,
          store_id: store.store_id
        });
        req.log.info(`Product with id: ${stripe_event.data.object.id} updated`);
      } catch (error) {
        return res.status(500).json('error - ' + error);
      }
      break;
    case 'product.deleted':
      try {
        const product = await getProductByStripeId(stripe_event.data.object.id);
        await deleteProductRecord(product.product_id);
        req.log.info(`Product with id: ${stripe_event.data.object.id} deleted`);
      } catch (error) {
        return res.status(500).json('error - ' + error);
      }
      break;
    case 'price.created':
      try {
        const product = await getProductByStripeId(
          stripe_event.data.object.product
        );
        const amount = stripe_event.data.object.unit_amount;
        const price = {
          price_id: stripe_event.data.object.id,
          interval:
            stripe_event.data.object.type === 'one-time'
              ? 'day'
              : stripe_event.data.object.recurring.interval,
          price: parseInt(amount) / 100
        };
        const newPrice = product.prices;
        if (newPrice !== null) {
          const priceCheck = newPrice.find(item => item.price_id === price.price_id);
          if (priceCheck === undefined) {
            newPrice.push(price);
            await updateProductRecord(product.product_id, {
              prices: JSON.stringify(newPrice)
            });
          }
        } else {
          const price = [{
            price_id: stripe_event.data.object.id,
            interval:
            stripe_event.data.object.type === 'one-time'
              ? 'day'
              : stripe_event.data.object.recurring.interval,
            price: parseInt(amount) / 100
          }];
          await updateProductRecord(product.product_id, {
            prices: JSON.stringify(price)
          });
        }
        req.log.info('New Price created');
      } catch (error) {
        return res.status(500).json('error - ' + error);
      }
      break;
    case 'price.updated':
      try {
        const product = await getProductByStripeId(
          stripe_event.data.object.product
        );
        const amount = stripe_event.data.object.unit_amount;
        const initialPrices = product.prices;
        initialPrices.forEach(async (price, index) => {
          if (price.price_id === stripe_event.data.object.id) {
            price.price_id = stripe_event.data.object.id;
            price.interval = stripe_event.data.object.type === 'one-time' ? 'day' : stripe_event.data.object.recurring.interval;
            price.price = parseInt(amount) / 100;
            const priceObj = {
              price_id: price.price_id,
              interval: price.interval,
              price: price.price
            };
            initialPrices.splice(index, 1, priceObj);
            await updateProductRecord(product.product_id, { prices: JSON.stringify(initialPrices) });
            req.log.info(`Price with id: ${stripe_event.data.object.id} updated`);
          }
        });
      } catch (error) {
        return res.status(500).json('error - ' + error);
      }
      break;
    case 'price.deleted':
      try {
        const product = await getProductByStripeId(
          stripe_event.data.object.product
        );
        const initialPrices = product.prices;
        initialPrices.forEach(async (price, index) => {
          if (price.price_id === stripe_event.data.object.id) {
            initialPrices.splice(index, 1);
            await updateProductRecord(product.product_id, {
              prices: JSON.stringify(initialPrices)
            });
            req.log.info(
              `Price with id: ${stripe_event.data.object.id} deleted`
            );
          }
        });
      } catch (error) {
        return res.status(500).json('error - ' + error);
      }
      break;
    case 'customer.subscription.deleted':
      try {
        const stripe_price_id = stripe_event.data.object.plan.id;
        await deleteSubscriptionRecord(stripe_price_id);
        req.log.info(`Subscription with subscription id: ${stripe_event.data.object.id} deleted`);
      } catch (error) {
        return res.status(500).json({ error: `Error - ${error}` });
      }
      break;
    case 'customer.subscription.updated':
      try {
        req.log.info('subscription updated');
      } catch (error) {
        return res.status(500).json({ error: `Error - ${error}` });
      }
      break;
    case 'coupon.created':
      try {
        const coupon = await fetchCouponByName(stripe_event.data.object.id);
        if (!coupon) {
          const store = await getStoreByStripeAccount(stripe_event.account);
          const codeLength = 13;
          let generatedCode = 'PD-';

          const charPool = 'abcdefghijklmnopqrstuvwxyz0123456789';
          for (let i = 0; i < codeLength; i++) {
            generatedCode += charPool.charAt(Math.floor(Math.random() * charPool.length));
          }

          const payload = {
            name: stripe_event.data.object.id,
            code: generatedCode,
            expires: new Date(stripe_event.data.object.redeem_by * 1000),
            isPercent: stripe_event.data.object.percent_off !== null,
            amount: stripe_event.data.object.percent_off || stripe_event.data.object.amount_off / 100,
            store_id: store.store_id
          };

          await createCoupon(payload);
        } else {
          req.log.info('Notification: ');
        }

        req.log.info('Coupon created');
      } catch (error) {
        return res.status(500).json({ error: `Error - ${error}` });
      }
      break;
    default:
      req.log.info(stripe_event.type);
      break;
  }

  return res.status(200).json({ received: true });
};
