const express = require('express');

const router = express.Router();

const { isAuthValidAll } = require('../../middlewares/index').auth;
const {
  validateGetActiveAddonsQueryArgs
} = require('../../middlewares/validations/addons');

const { handleGetActiveAddonsByStoreId } = require('../../handlers/addons');

// Get addons by store id (filter by product id) ?product_id=<product_id>
router.get(
  '/:store_id',
  isAuthValidAll,
  validateGetActiveAddonsQueryArgs,
  handleGetActiveAddonsByStoreId
);

module.exports = router;
