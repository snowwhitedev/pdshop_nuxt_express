const JWT = require('jsonwebtoken');
const { JWT_SECRET, USERS_TYPES } = require('../../nuxt.config').privateRuntimeConfig;

const getToken = (req, _res) => {
  return (
    req.query.token ||
    req.headers['x-access-token'] ||
    req.headers.authorization ||
    req.cookies.token
  );
};

module.exports = {

  getUserObjectFromRequest: (req, _res) => {
    return new Promise((resolve, reject) => {
      const token = getToken(req);
      if (!token) {
        return reject('Token Required');
      }
      JWT.verify(token, JWT_SECRET, (error, decodedUser) => {
        if (error) {
          console.error(error);
          return reject('Unauthorized');
        }
        return resolve(decodedUser);
      });
    });
  },

  isAuthValidAll: (req, res, next) => {
    const token = getToken(req);
    if (!token) {
      return res.status(401).send({ error: 'Token required' });
    }

    JWT.verify(token, JWT_SECRET, (error, _decodedUser) => {
      if (error) {
        console.error(error);
        return res.status(401).send({ error: 'Unauthorized' });
      }
      return next();
    });
  },

  isTokenAdmin: (req, res, next) => {
    const token = getToken(req);
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    JWT.verify(token, JWT_SECRET, (error, decodedUser) => {
      if (error || decodedUser.role !== USERS_TYPES.ADMIN) {
        console.error(error);
        return res.status(401).send({ error: 'Unauthorized' });
      }
      return next();
    });
  },

  isUserMerchantOnStore: (req, res, next) => {
    const { store_id } = req.params;
    const token = getToken(req);
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    JWT.verify(token, JWT_SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(500).send({ error: 'InternalError' });
      } else if (decodedUser.user_type !== USERS_TYPES.MERCHANT) {
        console.log(`isUserMerchantOnStore: User is not merchant! ${decodedUser.user_type}`);
        return res.status(401).send({ error: 'Unauthorized user' });
      } else if (Number(decodedUser.store_id) !== Number(store_id)) {
        console.log(`Wrong store id! expected: ${store_id}, got: ${decodedUser.store_id}`);
        return res.status(401).send({ error: 'Unauthorized user' });
      }
      return next();
    });
  }
};
