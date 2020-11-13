const {
  createShipping,
  getShippingById,
  getShippingByStore,
  getPartialListOfShippingByStore,
  updateShipping
} = require('../models/shipping');

exports.handleCreateShipping = async (req, res) => {
  const payload = req.body;

  try {
    const shipping = await createShipping(payload);

    return res.status(201).json({ shipping });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleGetShippingByStore = async (req, res) => {
  const { store_id } = req.params;

  try {
    const shipping = await getShippingByStore(store_id);

    return res.status(200).json({ shipping });
  } catch (error) {
    req.log.error(error);

    return res.status(500).json({ error });
  }
};

exports.handleGetPartialListOfShippingByStore = async (req, res) => {
  const { store_id } = req.params;
  const { limit, offset } = req.query;

  try {
    const shipping = await getPartialListOfShippingByStore(store_id, limit, offset);

    return res.status(206).json({ shipping });
  } catch (error) {
    req.log.error(error);

    return res.status(500).json({ error });
  }
};

exports.handleGetShippingById = async (req, res) => {
  const { shipping_id } = req.params;

  try {
    const shipping = await getShippingById(shipping_id);

    return res.status(200).json({ shipping });
  } catch (error) {
    req.log.error(error);

    return res.status(200).json({ error });
  }
};

exports.handleUpdateShipping = async (req, res) => {
  const updateFields = req.body;
  const { store_id } = req.params;

  try {
    const shipping = await updateShipping(updateFields, store_id);

    return res.status(200).json({ shipping });
  } catch (error) {
    req.log.error(error);

    return res.status(500).json({ error });
  }
};
