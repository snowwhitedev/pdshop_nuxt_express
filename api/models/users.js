const knex = require('knex')({
  client: 'pg'
});

const { USERS_TABLE, USERS_TYPES } = require('../../nuxt.config').privateRuntimeConfig;

const { runQuery } = require('../db/index');
const {
  compareUserPassword,
  getPasswordHash,
  getJWTToken,
  generateRandomSalt
} = require('./auth');

exports.getUserByEmail = async (email, active = true) => {
  const sqlQuery = knex(USERS_TABLE)
    .select('*')
    .where('email', email)
    .andWhere('active', active)
    .limit(1)
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getUserByUserId = async (userId, active = true) => {
  const sqlQuery = knex(USERS_TABLE)
    .select('*')
    .where('user_id', Number(userId))
    .andWhere('active', active)
    .limit(1)
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getUserByStoreId = async (storeId, active = true) => {
  const sqlQuery = knex(USERS_TABLE)
    .select('*')
    .where('store_id', storeId)
    .andWhere('active', active)
    .limit(1)
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.createMerchant = async (userData) => {
  try {
    userData.password = getPasswordHash(userData.password);
    // Insert record to database
    const sqlQuery = knex(USERS_TABLE)
      .insert(userData)
      .returning(['first_name', 'last_name', 'user_id', 'email', 'phone', 'user_type', 'store_id'])
      .toString();
    const response = await runQuery(sqlQuery);
    return response.rows[0];
  } catch (error) {
    return error;
  }
};

exports.inviteUser = async (payload) => {
  try {
    const password = await generateRandomSalt(12);
    payload.password = getPasswordHash(password);
    // Insert record to database
    const sqlQuery = knex
      .insert(payload)
      .into(USERS_TABLE)
      .returning(['user_id', 'email'])
      .toString();

    const response = await runQuery(sqlQuery);
    const token = await getJWTToken(response.rows[0]);

    return {
      tempPass: password,
      user: response.rows[0],
      token
    };
  } catch (error) {
    return error;
  }
};

exports.createNewPublicUser = async (email, stripeCustomerId) => {
  try {
    const tmpPassword = await generateRandomSalt(12);

    const userObj = {
      email,
      stripe_customer_id: stripeCustomerId,
      password: getPasswordHash(tmpPassword),
      user_type: USERS_TYPES.PUBLIC,
      active: true
    };

    // Insert record to database
    const sqlQuery = knex
      .insert(userObj)
      .into(USERS_TABLE)
      .returning(['user_id', 'email', 'stripe_customer_id'])
      .toString();

    const response = await runQuery(sqlQuery);
    const JWTToken = getJWTToken(response.rows[0]);

    return {
      userRecord: response.rows[0],
      tmpPassword,
      JWTToken
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

// return JWT token
exports.authenticateUser = async (email, password) => {
  try {
    const user = await this.getUserByEmail(email, true);
    if (compareUserPassword(user, password)) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.updateUserRecord = async (userId, updateFields) => {
  const sqlQuery = knex(USERS_TABLE)
    .update(updateFields)
    .where('user_id', parseInt(userId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};
