const {
  createCoupon,
  fetchCouponByCode,
  fetchCouponsByStoreId,
  fetchPartialListOfCouponsByStoreId,
  updateCoupon,
  deleteCoupon
} = require('../models/coupons');

const {
  getStoreById
} = require('../models/stores');

const StripeClient = require('../models/stripe');

exports.handleCreateCoupon = async (req, res) => {
  const { store_id } = req.params;
  const store = await getStoreById(store_id);
  const data = req.body;
  const stripe = new StripeClient(store_id, store);

  try {
    const stripePayload = data.stripePayload;
    const internalPayload = data.internalPayload;

    if (internalPayload.isPercent && parseInt(internalPayload.amount) > 100) {
      return res.status(422).json({
        error:
            'Invalid amount, must not be greater than 100 when using percentage.'
      });
    }

    await stripe.createCoupon(stripePayload);

    const coupon = await createCoupon(internalPayload);
    if (coupon) {
      return res.status(200).json({ coupon });
    } else {
      return res.status(400).json({ error: 'Bad Arguments!' });
    }
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleFetchCouponByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const coupon = await fetchCouponByCode(code);

    return res.status(200).json({ coupon });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'Coupon not found.' });
  }
};

exports.handleFetchCouponByStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const coupons = await fetchCouponsByStoreId(store_id);
    return res.status(200).json({ coupons });
  } catch (error) {
    req.log.error(error);
    return res.status(404).json({ error: 'Coupon not found.' });
  }
};

exports.handleFetchPartialListOfCouponsByStore = async (req, res) => {
  const { store_id } = req.params;
  const { limit, offset } = req.query;

  try {
    const coupons = await fetchPartialListOfCouponsByStoreId(store_id, limit, offset);

    return res.status(200).json({ coupons });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'Error fetching coupons.' });
  }
};

exports.handleCouponUpdate = async (req, res) => {
  const { payload } = req.body;
  try {
    req.log.info(`Update Coupon id: ${payload.id}`);
    const coupon = await updateCoupon(payload.id, payload.updateFields);
    return res.status(200).json({ coupon });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'Error updating coupons.' });
  }
};

exports.handleDeleteCoupon = async (req, res) => {
  const { coupon_id } = req.params;

  try {
    req.log.info(`Delete Coupon with id: ${coupon_id}`);
    await deleteCoupon(coupon_id);
    return res.status(206).json(true);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};
