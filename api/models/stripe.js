/**
 * Stripe model
 *
 */

const pino = require('pino')();

const {
  PERDIEM_DOMAIN
} = require('../../nuxt.config').publicRuntimeConfig;
const {
  STRIPE_LIVE_SECRET_KEY,
  STRIPE_TEST_SECRET_KEY
} = require('../../nuxt.config').privateRuntimeConfig;
// eslint-disable-next-line import/order
const Stripe = require('stripe');
const {
  getStoreById
} = require('./stores');

/**
 *
 * Stripe class
 *
 * Returns Stripe object according to the stripe method called.
 *
 */

class StripeClient {
  // Public
  userId = null;
  storeId = null;

  constructor (storeId, store = null) {
    this.storeId = storeId;
    this.stripe = Stripe(store.is_production ? STRIPE_LIVE_SECRET_KEY : STRIPE_TEST_SECRET_KEY);
  }

  // Fetch stripe account id from the database
  async getStoreStripeAccountId () {
    // Call to the db and get the stripe id
    pino.info(`looking up stripe connected account id using the store id: ${this.storeId}`);

    try {
      const store = await getStoreById(this.storeId);
      return { stripeAccount: store.stripe_user_id };
    } catch (err) {
      pino.error(`error fetching stripe account for store id: ${this.storeId}`);
      pino.error(err);
      throw err;
    }
  }

  // create connected account with stripe
  async completeOAuth (code) {
    try {
      const stripeResponse = await this.stripe.oauth.token({
        grant_type: 'authorization_code',
        code
      });
      return stripeResponse.stripe_user_id;
    } catch (err) {
      pino.error(err);
      return err;
    }
  }

  // Create customer before creating the subscription
  async createCustomer (customerPayload) {
    const stripe_id = await this.getStoreStripeAccountId();
    return new Promise((resolve, reject) => {
      this.stripe.customers.create(customerPayload, stripe_id, function (
        err,
        customer
      ) {
        if (err) {
          pino.error(err);
          return reject(err);
        }
        const result = { customerId: customer.id };
        pino.info(`Create customer successfully ${result}`);
        return resolve(result);
      });
    });
  }

  // create a new stripe product for a merchant
  async createProduct (name, description, store_id) {
    const stripe_id = await this.getStoreStripeAccountId();
    return new Promise((resolve, reject) => {
      this.stripe.products.create(
        {
          name,
          description,
          metadata: { store_id }
        },
        stripe_id,
        function (err, product) {
          if (err) {
            pino.error(err);
            return reject(err);
          }
          pino.info(`Create product successfully! product: ${product}`);
          return resolve(product);
        }
      );
    });
  }

  // get a stripe product with associated product id
  async getProduct (productId) {
    console.log(`Get Product from Stripe, productId: ${productId}`);
    const stripe_id = await this.getStoreStripeAccountId();

    return new Promise((resolve, reject) => {
      this.stripe.products.retrieve(productId, stripe_id, (err, product) => {
        if (err) {
          pino.error(`error retrieve product from stripe ${err}`);
          pino.error(err);
          return reject(err);
        }
        pino.info(product);
        return resolve(product);
      });
    });
  }

  // get all products on stripe
  async getProductList (limit = 50) {
    const stripe_id = await this.getStoreStripeAccountId();
    return new Promise((resolve, reject) => {
      this.stripe.products.list(
        {
          limit
        },
        stripe_id,
        function (err, products) {
          if (err) {
            pino.error(err);
            return reject(err);
          }

          return resolve(products);
        }
      );
    });
  }

  async createPrice (productId, amount, interval) {
    const stripe_id = await this.getStoreStripeAccountId();
    return new Promise((resolve, reject) => {
      this.stripe.prices.create(
        {
          unit_amount: amount, // integer cents
          currency: 'usd', // iso 3 lowercase letters
          recurring: {
            interval // string day, week, month or year.
          },
          product: productId,
          metadata: {
            productId,
            addonsIds: [],
            storeId: this.storeId,
            createdBy: null
          }
        },
        stripe_id,
        (err, price) => {
          if (err) {
            pino.error(err);
            return reject(err);
          }
          return resolve(price);
        }
      );
    });
  }

  async getPrice (priceId) {
    const stripe_id = await this.getStoreStripeAccountId();
    return new Promise((resolve, reject) => {
      this.stripe.prices.retrieve(priceId, stripe_id, function (err, price) {
        if (err) {
          pino.error('error fetching price from Stripe');
          pino.error(err);
          reject(err);
        }

        resolve(price);
      });
    });
  }

  async createCheckoutSession (payload) {
    const stripe_id = await this.getStoreStripeAccountId();
    try {
      const { slug } = payload;
      const subscription_data = {
        application_fee_percent: payload.application_fee
      };

      if (payload.coupon) {
        subscription_data.coupon = payload.coupon;
      }

      const session = this.stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          line_items: payload.lineItems,
          mode: 'subscription',
          subscription_data,
          success_url: `${PERDIEM_DOMAIN}/m/${slug}/subscriptions?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${PERDIEM_DOMAIN}/m/${slug}/subscriptions?Error=error`
        },
        stripe_id
      );

      return session;
    } catch (err) {
      pino.error(err);
      return err;
    }
  }

  async createPaymentIntent (amount_total) {
    const stripe_id = await this.getStoreStripeAccountId();
    try {
      const paymentIntent = await this.stripe.paymentIntents.create(
        {
          amount: amount_total * 100,
          application_fee_amount: amount_total,
          currency: 'usd'
        },
        stripe_id
      );

      return paymentIntent.client_secret;
    } catch (err) {
      pino.error(err);
      return err;
    }
  }

  async createSubscription (payload) {
    const stripe_id = await this.getStoreStripeAccountId();

    try {
      // Attach payment method (card) to the customer for future usage
      await this.stripe.paymentMethods.attach(
        payload.payment_method_id,
        {
          customer: payload.stripe_customer_id
        },
        stripe_id
      );
    } catch (err) {
      pino.error(err);
      return err;
    }

    try {
      // Update the customer's record on stripe with the new payment method
      await this.stripe.customers.update(payload.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: payload.payment_method_id
        }
      }, stripe_id);

      // create new subscription for the customer on connected account
      const subscription = this.stripe.subscriptions.create({
        customer: payload.stripe_customer_id,
        items: [
          {
            price: payload.stripe_price_id
          }
        ],
        expand: ['latest_invoice.payment_intent'],
        application_fee_percent: 1
      }, stripe_id);

      return subscription;
    } catch (err) {
      pino.error(err);
      return err;
    }
  }

  async createCoupon (payload) {
    const stripe_id = await this.getStoreStripeAccountId();

    return new Promise((resolve, reject) => {
      if (payload.isPercent) {
        this.stripe.coupons
          .create(
            {
              duration: payload.duration,
              duration_in_months: payload.duration_in_months,
              currency: 'usd',
              id: payload.id,
              percent_off: Number(payload.amount),
              redeem_by: payload.expires
            },
            stripe_id
          )
          .then((coupon) => {
            resolve(coupon);
          })
          .catch((err) => {
            pino.error(err);
            reject(err);
          });
      } else {
        this.stripe.coupons
          .create(
            {
              duration: payload.duration,
              duration_in_months: payload.duration_in_months,
              currency: 'usd',
              id: payload.id,
              amount_off: payload.amount
            },
            stripe_id
          )
          .then((coupon) => {
            resolve(coupon);
          })
          .catch((err) => {
            pino.error(err);
            reject(err);
          });
      }
    });
  }
}

module.exports = StripeClient;
