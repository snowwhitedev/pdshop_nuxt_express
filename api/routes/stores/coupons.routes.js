const express = require('express');
const router = express.Router();

const { handleFetchCouponByStore } = require('../../handlers/coupons');
const { isAuthValidAll } = require('../../middlewares/index').auth;

router.get('/:store_id', isAuthValidAll, handleFetchCouponByStore);

module.exports = router;
