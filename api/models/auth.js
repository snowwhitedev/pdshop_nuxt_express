const Crypto = require('crypto');
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const SALT_ROUNDS = 10;

const {
  JWT_SECRET,
  JWT_AUTH_EXPIRED
} = require('../../nuxt.config').privateRuntimeConfig;

exports.compareUserPassword = (user, passwordText) => {
  return Bcrypt.compareSync(passwordText, user.password);
};

exports.getPasswordHash = (password) => {
  return Bcrypt.hashSync(password, SALT_ROUNDS);
};

exports.getJWTToken = (user) => {
  const { store_id, user_id, email, user_type } = user;
  const token = JWT.sign({
    user_id,
    email,
    user_type,
    store_id
  }, JWT_SECRET, {
    expiresIn: JWT_AUTH_EXPIRED
  });

  return token;
};

exports.generateRandomSalt = (stringLength = 16) => {
  return Crypto.randomBytes(64).toString('base64').substr(0, stringLength);
};
