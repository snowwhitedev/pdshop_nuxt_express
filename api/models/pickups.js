const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db/index');
const { PICKUPS_TABLE } = require('../../nuxt.config').privateRuntimeConfig;

exports.createPickup = async (payload) => {
  const sqlQuery = knex
    .insert(payload)
    .into(PICKUPS_TABLE)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.updatePickupRecord = async (pickupId, updateFields) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .update(updateFields)
    .where('pickup_id', parseInt(pickupId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getPickupById = async (pickupId) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where('pickup_id', parseInt(pickupId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getListOfPickupsByStore = async (storeId, isActive = true) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where({ store_id: Number(storeId) })
    .andWhere({ is_active: isActive })
    .orderBy('ui_order', 'desc')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows || [];
};

exports.getListOfPickupsByStoreAndProductId = async (storeId, productId) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where({ store_id: Number(storeId) })
    .andWhere({ is_active: true })
    .andWhereRaw(`${productId} = ANY(product_ids)`)
    .orderBy('ui_order', 'desc')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows || [];
};

exports.getPartialListOfPickupsByStore = async (storeId, limit, offset) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where('store_id', parseInt(storeId))
    .orderBy('ui_order', 'desc')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};

exports.deletePickupRecord = async (pickupId) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .where({ pickup_id: pickupId })
    .del()
    .toString();

  const response = await runQuery(sqlQuery);
  return response;
};
