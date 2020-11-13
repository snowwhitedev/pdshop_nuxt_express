const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();

const {
  completeStripeConnect,
  StripeCheckoutSession,
  createStripePaymentIntent,
  handleCreateSubscription,
  handleCreateStripePrice
} = require('../../handlers/stripe');

const { handleStripeProductsWebhook } = require('../../handlers/webhooks');

const { isAuthValidAll } = require('../../middlewares/index').auth;

router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  handleStripeProductsWebhook
);

// create stripe session for checkout
router.post(
  '/stores/:store_id/stripeSession',
  isAuthValidAll,
  StripeCheckoutSession
);

// create stripe payment intent object for accepting card payments
router.post(
  '/stores/:store_id/paymentIntent',
  isAuthValidAll,
  createStripePaymentIntent
);

// create subscription for a customer on stripe
router.post(
  '/stores/:store_id/subscription',
  isAuthValidAll,
  handleCreateSubscription
);

// complete stripe connection and get user stripe id
router.post('/connect/:store_id', isAuthValidAll, completeStripeConnect);

// create price object
router.post(
  '/stores/:store_id/prices',
  isAuthValidAll,
  handleCreateStripePrice
);

module.exports = router;
