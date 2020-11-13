const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db/index');
const { STORES_TABLE, PRODUCTS_TABLE } = require('../../nuxt.config').privateRuntimeConfig;

exports.createStore = async (storeData) => {
  try {
    const sqlQuery = knex
      .insert(storeData)
      .into(STORES_TABLE)
      .returning('*')
      .toString();

    const response = await runQuery(sqlQuery);
    return response.rows[0];
  } catch (error) {
    return error;
  }
};

exports.updateStoreRecord = async (storeId, updateFields) => {
  const sqlQuery = knex(STORES_TABLE)
    .update(updateFields)
    .where('store_id', parseInt(storeId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getStoreById = async (storeId) => {
  const sqlQuery = knex(STORES_TABLE)
    .select('*')
    .where('store_id', storeId)
    .limit(1)
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getStoreByStripeAccount = async (stripe_acct_id) => {
  const sqlQuery = knex(STORES_TABLE)
    .select('*')
    .where('stripe_user_id', stripe_acct_id)
    .limit(1)
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getStoreBySlug = async (slug) => {
  const sqlQuery = knex(STORES_TABLE)
    .select('*')
    .where('slug', slug)
    .limit(1)
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getStoreAndActiveProductsByStoreSlug = async (slug) => {
  const store = await this.getStoreBySlug(slug);

  const sqlQuery = knex(PRODUCTS_TABLE)
    .select('*')
    .where(`${PRODUCTS_TABLE}.store_id`, store.store_id)
    .andWhere(`${PRODUCTS_TABLE}.is_active`, true)
    .toString();

  const { rows } = await runQuery(sqlQuery);
  store.products = rows;
  return store;
};

exports.getStoreAndActiveProductsByStoreId = async (storeId) => {
  const sqlQuery = knex(STORES_TABLE)
    .join(PRODUCTS_TABLE, `${STORES_TABLE}.store_id`, '=', `${PRODUCTS_TABLE}.store_id`)
    .select('*')
    .where(`${STORES_TABLE}.store_id`, Number(storeId))
    .andWhere(`${PRODUCTS_TABLE}.is_active`, true)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};

exports.getAllStores = async (limit, offset) => {
  const sqlQuery = knex(STORES_TABLE)
    .select('*')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};
