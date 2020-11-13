const {
  createNewSubscription,
  updateExistingSubscription,
  getSubscriptionsByUserIdAndStoreId,
  getSubscriptionSummary,
  getSubscriptionsByStore,
  deleteSubscriptionRecord,
  fetchSubscriptionByCouponAndUser
} = require('../models/subscriptions');
const { getUserObjectFromRequest } = require('../middlewares/auth');

exports.handlerGetSubscriptionsByUserAndStore = async (req, res) => {
  const storeId = req.params.store_id;
  let userId = null;

  try {
    const userObj = await getUserObjectFromRequest(req);
    userId = Number(userObj.user_id);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      code: error
    });
  }
  try {
    const isFull = req.query.type === 'full';
    // get list of subscriptions using store_id and user_id
    const subscriptions = await getSubscriptionsByUserIdAndStoreId(storeId, userId, isFull);
    return res.status(200).json({ subscriptions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 'InternalError',
      message: error
    });
  }
};

/**
 *
 * Create a new subscription
 *
 */
exports.handleNewSubscriptionByStore = async (req, res) => {
  const userObj = await getUserObjectFromRequest(req);
  const storeId = req.params.store_id;
  // Validate payload
  try {
    // get list of subscriptions using store_id and user_id
    const subscription = await createNewSubscription({ store_id: storeId, user_id: userObj.user_id });
    return res.status(200).json({
      subscription
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

exports.handleUpdateSubscriptionByStore = async (req, res) => {
  // Validate payload && update subscription
  const { subscription_id } = req.params;
  try {
    // get list of subscriptions using store_id and user_id
    const subscription = await updateExistingSubscription(subscription_id, req.body);
    return res.status(200).json({ subscription });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 'InternalError',
      message: error
    });
  }
};

exports.handlerGetSubscriptionSummaryByStore = async (req, res) => {
  try {
    const subscriptionId = Number(req.params.subscription_id);
    // Get the user id
    const userObj = await getUserObjectFromRequest(req);
    const userId = Number(userObj.user_id);
    const summary = await getSubscriptionSummary(subscriptionId, userId);
    return res.status(200).json({ summary });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 'InternalError',
      message: error
    });
  }
};

exports.handleGetPartialSubscriptions = async (req, res) => {
  const { limit, offset } = req.query;
  const { store_id } = req.params;
  try {
    const subscriptions = await getSubscriptionsByStore(store_id, limit, offset);
    return res.status(200).json({ subscriptions });
  } catch (error) {
    return res.status(500).json({ eroor: `Error - ${error}` });
  }
};

exports.handleDeleteSubscription = async (req, res) => {
  const { stripe_price_id } = req.params;
  try {
    await deleteSubscriptionRecord(stripe_price_id);
    return res.status(200).json({ deleted: true });
  } catch (error) {
    return res.status(500).json({ error: `Error - ${error}` });
  }
};

exports.handleFetchSubscriptionsByCouponAnduser = async (req, res) => {
  const { user_id, coupon_id } = req.query;

  try {
    const subscription = await fetchSubscriptionByCouponAndUser(coupon_id, user_id);
    return res.status(200).json({ subscription });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
