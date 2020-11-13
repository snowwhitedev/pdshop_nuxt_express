const express = require('express');

const router = express.Router();

const { isAuthValidAll } = require('../../middlewares/index').auth;

const {
  validateGetSubscriptionByUserIdAndStoreId
} = require('../../middlewares/validations/subscriptions');

const {
  handlerGetSubscriptionsByUserAndStore,
  handleGetPartialSubscriptions
} = require('../../handlers/subscriptions');

// get partial subscription record
router.get(
  '/:store_id/subscriptions',
  isAuthValidAll,
  handleGetPartialSubscriptions
);

// stores/subscriptions/:store_id
router.get(
  '/:store_id',
  validateGetSubscriptionByUserIdAndStoreId,
  isAuthValidAll,
  handlerGetSubscriptionsByUserAndStore
);

module.exports = router;
