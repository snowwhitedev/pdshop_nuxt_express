/**
 * /stores/:store_id/pickups
 *
 */
// external
const express = require('express');
const router = express.Router();

// internal
const {
  isAuthValidAll,
  isUserMerchantOnStore
} = require('../../middlewares/auth');

const {
  handlerGetPickupsByStoreAndProduct,
  handleDeletePickup,
  handleGetPickupById
} = require('../../handlers/index');

// get all pickups for a particular product
router.get('/singleProduct/:store_id',
  isAuthValidAll,
  handlerGetPickupsByStoreAndProduct
);

// get pickup by id
// full url: /shop/pickups/:pickup_id
router.get('/:pickup_id',
  isAuthValidAll,
  handleGetPickupById
);

router.patch('/:store_id/:pickup_id',
  isAuthValidAll,
  isUserMerchantOnStore,
  handleDeletePickup
);

module.exports = router;
