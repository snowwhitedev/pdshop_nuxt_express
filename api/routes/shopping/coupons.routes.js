const express = require('express');
const router = express.Router();

const { handleFetchCouponByCode } = require('../../handlers/coupons');
const { isAuthValidAll } = require('../../middlewares/index').auth;

router.get('/:code', isAuthValidAll, handleFetchCouponByCode);

module.exports = router;
