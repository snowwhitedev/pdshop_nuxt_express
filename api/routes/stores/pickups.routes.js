const express = require('express');
const router = express.Router();

// internal
const {
  isAuthValidAll
} = require('../../middlewares/auth');

const {
  handlerGetPickupsByStore
} = require('../../handlers/index');

// Get all pickups
// /stores/:store_id/pickups
router.get('/:store_id',
  isAuthValidAll,
  handlerGetPickupsByStore
);

module.exports = router;
