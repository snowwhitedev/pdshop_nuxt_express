/**
 * /shopping Routes
 *
 */
// external
const express = require('express');

const router = express.Router();

router.use('/products', require('./products.routes'));
router.use('/subscriptions', require('./subscriptions.routes'));
router.use('/pickups', require('./pickups.routes'));
router.use('/users', require('./users.routes'));
router.use('/coupons', require('./coupons.routes'));
router.use('/addons', require('./addons.routes'));

module.exports = router;
