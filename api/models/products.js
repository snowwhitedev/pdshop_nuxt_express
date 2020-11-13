const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db/index');
const { PRODUCTS_TABLE } = require('../../nuxt.config').privateRuntimeConfig;

exports.createProduct = async (productData) => {
  const sqlQuery = knex
    .insert(productData)
    .into(PRODUCTS_TABLE)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.getListOfProductsByStoreId = async (storeId) => {
  const sqlQuery = knex(PRODUCTS_TABLE)
    .select('*')
    .where('store_id', parseInt(storeId))
    .andWhere('is_active', true)
    .orderBy('ui_order', 'desc')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows;
};

exports.updateProductRecord = async (productId, updateFields) => {
  const sqlQuery = knex(PRODUCTS_TABLE)
    .update(updateFields)
    .where('product_id', parseInt(productId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getProductByStripeId = async (stripe_id) => {
  const sqlQuery = knex(PRODUCTS_TABLE)
    .select('*')
    .where('stripe_product_id', stripe_id)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getPartialListOfProductsByStore = async (storeId, limit, offset) => {
  const sqlQuery = knex(PRODUCTS_TABLE)
    .select('*')
    .where('store_id', parseInt(storeId))
    .orderBy('ui_order', 'desc')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};

exports.deleteProductRecord = async (productId) => {
  const sqlQuery = knex(PRODUCTS_TABLE)
    .where({ product_id: productId })
    .del()
    .toString();

  const response = await runQuery(sqlQuery);
  return response;
};
