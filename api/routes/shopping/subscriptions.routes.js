const express = require('express');

const router = express.Router();

const { isAuthValidAll } = require('../../middlewares/index').auth;

const {
  validateGetSubscriptionByUserIdAndStoreId,
  validateSubscriptionParams
} = require('../../middlewares/validations/subscriptions');

const {
  handleNewSubscriptionByStore,
  handleUpdateSubscriptionByStore,
  handlerGetSubscriptionSummaryByStore,
  handleDeleteSubscription,
  handleFetchSubscriptionsByCouponAnduser
} = require('../../handlers/subscriptions');

// get Subscription Summary for Checkout
// should return only subscription by user id
router.get(
  '/:subscription_id',
  validateSubscriptionParams,
  isAuthValidAll,
  handlerGetSubscriptionSummaryByStore
);

router.get(
  '/:subscription_id/coupon',
  isAuthValidAll,
  handleFetchSubscriptionsByCouponAnduser
);

// Create a new subscription
router.post(
  '/:store_id',
  validateGetSubscriptionByUserIdAndStoreId,
  isAuthValidAll,
  handleNewSubscriptionByStore
);

// Update subscription
router.put(
  '/:subscription_id',
  validateSubscriptionParams,
  isAuthValidAll,
  handleUpdateSubscriptionByStore
);

// delete subscription record from database
router.delete('/:stripe_price_id', isAuthValidAll, handleDeleteSubscription);

module.exports = router;
