const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db/index');
const {
  SUBSCRIPTIONS_TABLE,
  ORDERS_TABLE,
  PRODUCTS_TABLE,
  PICKUPS_TABLE,
  ADDONS_TABLE
} = require('../../nuxt.config').privateRuntimeConfig;

exports.getSubscriptionsByUserIdAndStoreId = async (storeId, userId, isFull = false) => {
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .select('*')
    .where('store_id', Number(storeId))
    .andWhere('user_id', Number(userId))
    .toString();

  const response = await runQuery(sqlQuery);

  if (!response || response.rowCount === 0) {
    return [];
  }

  const subscriptions = response.rows;

  if (!isFull) {
    return subscriptions;
  }
  // Fetch products
  const productIds = subscriptions.map(x => x.product_id).filter(x => x);

  const productsSqlQuery = knex(PRODUCTS_TABLE)
    .select('*')
    .whereIn('product_id', productIds)
    .toString();
  const products = await runQuery(productsSqlQuery).rows;

  if (products && products.length > 0) {
    subscriptions.forEach((subscription, _idx) => {
      subscription.product = products.find(el => el.product_id === subscription.product_id);
    });
  }

  return subscriptions;
};

exports.getSubscriptionsByUserId = async (userId) => {
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .select('*')
    .where('user_id', Number(userId))
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows;
};

// get partial subscriptions record
exports.getSubscriptionsByStore = async (storeId, limit, offset) => {
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .select('*')
    .where('store_id', Number(storeId))
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};

// Get orders by subscriptions id
exports.getSubscriptionsWithAllOrders = async (subscriptionId) => {
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .select('*')
    .where('subscription_id', Number(subscriptionId))
    .limit(1)
    .toString();
  const response = await runQuery(sqlQuery);
  if (response.rows.length === 0) {
    return {};
  }

  const subscription = response.rows[0];
  const ordersSqlQuery = knex(ORDERS_TABLE)
    .select('*')
    .where('subscription_id', Number(subscriptionId))
    .toString();
  const { rows } = await runQuery(ordersSqlQuery);
  if (rows.length > 0) {
    subscription.orders = rows;
  } else {
    subscription.orders = [];
  }

  return subscription;
};

// Create a new subscription
exports.createNewSubscription = async (payload) => {
  const sqlQuery = knex.insert(payload)
    .into(SUBSCRIPTIONS_TABLE)
    .returning(['subscription_id', 'store_id'])
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

// update subscription
exports.updateExistingSubscription = async (subscriptionId, payload) => {
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .update(payload)
    .where('subscription_id', Number(subscriptionId))
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

// Get subscription summary for checkout
exports.getSubscriptionSummary = async (subscriptionId, userId) => {
  const summary = {};
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .select('*')
    .where('subscription_id', Number(subscriptionId))
    .andWhere('user_id', Number(userId))
    .limit(1)
    .toString();

  const subscription = await runQuery(sqlQuery);

  if (subscription.rows[0].product_id != null) {
    const productsQuery = knex(PRODUCTS_TABLE)
      .select('*')
      .where('product_id', Number(subscription.rows[0].product_id))
      .limit(1)
      .toString();

    const product = await runQuery(productsQuery);

    summary.product = product.rows[0];
    summary.price = summary.product.prices.find(price => price.price_id == subscription.rows[0].stripe_price_id);
  }

  if (subscription.rows[0].addons_ids != null) {
    const addonsQuery = knex(ADDONS_TABLE)
      .select('*')
      .whereIn('addons_id', subscription.rows[0].addons_ids)
      .toString();

    const addons = await runQuery(addonsQuery);
    summary.addons = addons.rows;
  }

  if (subscription.rows[0].pickup_id != null) {
    const pickupsQuery = knex(PICKUPS_TABLE)
      .select('*')
      .where('pickup_id', Number(subscription.rows[0].pickup_id))
      .limit(1)
      .toString();
    const pickup = await runQuery(pickupsQuery);
    summary.pickup = pickup.rows[0];
  }

  return summary;
};

exports.deleteSubscriptionRecord = async (stripePriceId) => {
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .where({ stripe_price_id: stripePriceId })
    .del()
    .toString();

  const response = await runQuery(sqlQuery);
  return response;
};

exports.fetchSubscriptionByCouponAndUser = async (couponId, userId) => {
  const sqlQuery = knex(SUBSCRIPTIONS_TABLE)
    .select('*')
    .where('coupon_id', couponId)
    .andWhere('user_id', userId)
    .limit(1)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows[0];
};
