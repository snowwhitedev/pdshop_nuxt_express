const express = require('express');

const router = express.Router();

const {
  getProductsByStoreId
} = require('../../handlers/product');

const { isAuthValidAll } = require('../../middlewares/index').auth;

const {
  validateStoreIdParams
} = require('../../middlewares/index').validations;

// Get (active) products by store id (optional, should get it from load merchant)
router.get(
  '/:store_id',
  isAuthValidAll,
  validateStoreIdParams,
  getProductsByStoreId
);

module.exports = router;
