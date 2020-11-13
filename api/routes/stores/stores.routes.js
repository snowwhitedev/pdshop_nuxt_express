const express = require('express');

const router = express.Router();

const {
  validateStoreSlug,
  validateLocationQueryArgs,
  validatePaginationQueryArgs,
  validateStoreIdParams
} = require('../../middlewares/index').validations;

const {
  isAuthValidAll,
  isUserMerchantOnStore
} = require('../../middlewares/index').auth;

const {
  validateShippingPayload
} = require('../../middlewares/validations/shipping');

const { getStores } = require('../../handlers/shopping');

const { handleGetAddonsByStore } = require('../../handlers/addons');

const {
  handleCreateShipping,
  handleGetShippingById,
  handleGetShippingByStore,
  handleGetPartialListOfShippingByStore,
  handleUpdateShipping
} = require('../../handlers/shipping');

const { handleGetStoreAndProductsBySlug, handleGetStoreById } = require('../../handlers/index');

const {
  getProductsByStoreId
} = require('../../handlers/product');

// get store information by id
router.get(
  '/:store_id',
  validateStoreIdParams,
  handleGetStoreById
);

// get store information by slug
router.get(
  '/slug/:slug',
  validateStoreSlug,
  handleGetStoreAndProductsBySlug
);

// Get store by location / category
router.get('', validateLocationQueryArgs, getStores);

// get products by store id
router.get('/:store_id/products', isAuthValidAll, validateStoreIdParams, getProductsByStoreId);

// get addons by store
router.get(
  '/:store_id/addons',
  isAuthValidAll,
  validateStoreIdParams,
  handleGetAddonsByStore
);

/**
 * SHIPPING ROUTES
 *  formed stores/<store_id>/shipping/<optional params>
 */

// create shipping on store
router.post(
  '/:store_id/shipping',
  isUserMerchantOnStore,
  validateStoreIdParams,
  validateShippingPayload,
  handleCreateShipping
);

// update shipping records on store
router.put(
  '/:store_id/shipping',
  isUserMerchantOnStore,
  validateStoreIdParams,
  handleUpdateShipping
);

// fetch shipping records by store id
router.get(
  '/:store_id/shippings',
  isAuthValidAll,
  validateStoreIdParams,
  handleGetShippingByStore
);

// fetch shipping records by shipping id
router.get(
  '/:store_id/shipping/:shipping_id',
  isAuthValidAll,
  validateStoreIdParams,
  handleGetShippingById
);

// fetch paginated shipping records by store id
router.get(
  '/:store_id/shipping',
  isUserMerchantOnStore,
  validateStoreIdParams,
  validatePaginationQueryArgs,
  handleGetPartialListOfShippingByStore
);

module.exports = router;
