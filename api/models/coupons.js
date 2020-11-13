const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db');

const { COUPONS_TABLE } = require('../../nuxt.config').privateRuntimeConfig;

exports.createCoupon = async function (payload) {
  const sqlQuery = knex(COUPONS_TABLE)
    .insert(payload)
    .limit(1)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.fetchCouponByCode = async function (couponCode) {
  const sqlQuery = knex(COUPONS_TABLE)
    .select('*')
    .where('code', couponCode)
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.fetchCouponByName = async function (name) {
  const sqlQuery = knex(COUPONS_TABLE)
    .select('*')
    .where('name', name)
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.fetchCouponsByStoreId = async function (storeId, isActive = true) {
  const sqlQuery = knex(COUPONS_TABLE)
    .select('*')
    .where('store_id', storeId)
    .andWhere('is_active', isActive)
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows;
};

exports.fetchPartialListOfCouponsByStoreId = async (storeId, limit, offset) => {
  const sqlQuery = knex(COUPONS_TABLE)
    .select('*')
    .where('store_id', storeId)
    .orderBy('coupon_id', 'desc')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows;
};

exports.updateCoupon = async function (couponId, updateFields) {
  const sqlQuery = knex(COUPONS_TABLE)
    .update(updateFields)
    .where('coupon_id', couponId)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.deleteCoupon = async function (couponId) {
  const sqlQuery = knex(COUPONS_TABLE)
    .where({ coupon_id: couponId })
    .del()
    .toString();

  const response = await runQuery(sqlQuery);

  return response;
};
