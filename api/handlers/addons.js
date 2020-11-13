const {
  createAddons,
  getListOfActiveAddons,
  getAddonsByStore,
  fetchPartialListOfAddonsByStore,
  updateAddons
} = require('../models/addons');

exports.handleCreateAddons = async (req, res) => {
  const payload = req.body;

  try {
    const addon = await createAddons(payload);
    return res.status(201).json({ addon });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleGetActiveAddonsByStoreId = async (req, res) => {
  // Get list of addons by store id (filter by product id is optional)
  const storeId = req.params.store_id;
  const productId = req.query.product_id;

  try {
    // get list of addons by store id
    const addons = await getListOfActiveAddons(storeId, productId);
    return res.status(200).json({ addons });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleGetAddonsByStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const addons = await getAddonsByStore(store_id);

    return res.status(200).json({ addons });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleFetchListOfAddonsByStore = async (req, res) => {
  const { store_id } = req.params;
  const { limit, offset } = req.query;

  try {
    const addons = await fetchPartialListOfAddonsByStore(store_id, limit, offset);

    return res.status(200).json({ addons });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleUpdateAddons = async (req, res) => {
  const { addons_id } = req.params;

  try {
    const addon = await updateAddons(addons_id, req.body);

    return res.status(200).json({ addon });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};
