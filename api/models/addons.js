const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db/index');
const { ADDONS_TABLE } = require('../../nuxt.config').privateRuntimeConfig;

exports.getListOfActiveAddons = async (storeId, productId = null) => {
  let sqlQuery = knex(ADDONS_TABLE)
    .select('*')
    .where('store_id', Number(storeId))
    .andWhere({ is_active: true })
    .orderBy('ui_order', 'desc');

  if (productId !== null) {
    sqlQuery = sqlQuery.andWhereRaw(`${productId} = ANY(product_ids)`);
  }

  const response = await runQuery(sqlQuery.toString());
  return response.rows;
};

exports.getAddonsByStore = async (storeId) => {
  const sqlQuery = knex(ADDONS_TABLE)
    .select('*')
    .where('store_id', storeId)
    .orderBy('ui_order', 'desc')
    .toString();

  const response = await runQuery(await sqlQuery);

  return response.rows;
};

exports.fetchPartialListOfAddonsByStore = async (storeId, limit = 50, offset = 0) => {
  const sqlQuery = knex(ADDONS_TABLE)
    .select('*')
    .where('store_id', storeId)
    .orderBy('ui_order', 'desc')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows;
};

exports.createAddons = async (payload) => {
  const sqlQuery = knex(ADDONS_TABLE)
    .insert(payload)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.updateAddons = async (addonsId, updateFields) => {
  const sqlQuery = knex(ADDONS_TABLE)
    .update(updateFields)
    .where('addons_id', addonsId)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};
