const {
  getStoreBySlug,
  getStoreAndActiveProductsByStoreSlug,
  createStore,
  updateStoreRecord,
  getStoreById
} = require('../models/stores');
const { getJWTToken } = require('../models/auth');

const {
  getListOfPickupsByStoreAndProductId,
  createPickup,
  getListOfPickupsByStore,
  getPartialListOfPickupsByStore,
  deletePickupRecord,
  updatePickupRecord,
  getPickupById
} = require('../models/pickups');
const { authenticateUser, updateUserRecord } = require('../models/users');
const {
  COOKIE_EXPIRATION,
  IS_PROD
} = require('../../nuxt.config').privateRuntimeConfig;

exports.handleFileUpload = (req, res, next) => {
  if (!req.file) {
    req.log.error('Error uploading a file');
    return next('BadArguments');
  }
  return res.status(200).json({ success: true, data: req.file });
};

exports.handleCreateNewStore = async (req, res) => {
  const { userId, payload } = req.body;
  try {
    const store = await createStore(payload);
    try {
      await updateUserRecord(userId, { store_id: parseInt(store.store_id) });
      return res.status(200).json({ store });
    } catch (err) {
      req.log.error(err);
      return res
        .status(409)
        .json({ error: "Error! You can't register duplicate stores" });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Error' });
  }
};

exports.handleUpdateStoreRecord = async (req, res) => {
  const { store_id } = req.params;
  const { payload } = req.body;

  try {
    const store = await updateStoreRecord(store_id, payload);
    return res.status(200).json({ store });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.getStoreInfoBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const store = await getStoreBySlug(slug);
    return res.status(200).json({ store });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handleGetStoreById = async (req, res) => {
  const { store_id } = req.params;
  try {
    const store = await getStoreById(store_id);
    return res.status(200).json({ store });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handleGetStoreAndProductsBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const storeWithProducts = await getStoreAndActiveProductsByStoreSlug(slug);
    return res.status(200).json({ store: storeWithProducts });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handleUserRegisterAuth = async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({
      error: 'WrongCredentials'
    });
  }

  const token = getJWTToken(user);
  const userRecord = {
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  };
  return res
    .status(200)
    .cookie('token', token, {
      expires: new Date(Date.now() + COOKIE_EXPIRATION),
      secure: IS_PROD,
      httpOnly: true
    })
    .json({ code: 'UserLogin', userRecord });
};

exports.handleProductShopping = (res) => {
  /* const { product_id, store_id, pricing_id } = req.body; */
  return res.status(201).json({
    code: 'ok'
  });
};

exports.handlerGetPickupsByStoreAndProduct = async (req, res) => {
  const productId = req.query.product_id || null;
  const storeId = Number(req.params.store_id);
  try {
    const pickups = await getListOfPickupsByStoreAndProductId(
      storeId,
      productId
    );

    return res.status(200).json({ pickups });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handlerGetPickupsByStore = async (req, res) => {
  const storeId = Number(req.params.store_id);
  try {
    const pickups = await getListOfPickupsByStore(storeId);
    return res.status(200).json({ pickups });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handleGetPickupById = async (req, res) => {
  const pickupId = Number(req.params.pickup_id);
  try {
    const pickup = await getPickupById(pickupId);
    return res.status(200).json({ pickup });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handleCreatePickup = async (req, res) => {
  try {
    req.body.location = JSON.stringify(req.body.location);
    req.body.days_of_week = JSON.stringify(req.body.days_of_week);
    const pickup = await createPickup(req.body);
    return res.status(200).json({ pickup });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Error' + error });
  }
};

exports.handleGetPartialListOfPickups = async (req, res) => {
  const { limit, offset } = req.query;
  const { store_id } = req.params;

  try {
    const pickups = await getPartialListOfPickupsByStore(store_id, limit, offset);
    return res.status(200).json({ pickups });
  } catch (error) {
    return res.status(500).json({ error: `Error - ${error}` });
  }
};

exports.handleDeletePickup = async (req, res) => {
  const { pickup_id } = req.params;
  try {
    await deletePickupRecord(pickup_id);
    return res.status(200).json({ deleted: true });
  } catch (error) {
    return res.status(500).json({ error: `Error - ${error}` });
  }
};

exports.handleUpdatePickupRecord = async (req, res) => {
  const { pickup_id } = req.params;
  try {
    req.body.location = JSON.stringify(req.body.location);
    req.body.days_of_week = JSON.stringify(req.body.days_of_week);
    const pickup = await updatePickupRecord(pickup_id, req.body);
    return res.status(200).json({ pickup });
  } catch (error) {
    return res.status(500).json({ error: `Error - ${error}` });
  }
};

// return true if slug is unique
exports.isSlugUnique = async (req, res) => {
  const { slug } = req.params;
  try {
    const store = await getStoreBySlug(slug);
    if (store) {
      return res.status(409).json({ unique: false });
    }
    return res.status(200).json({ unique: true });
  } catch (error) {
    return res.status(200).json({ unique: true });
  }
};
