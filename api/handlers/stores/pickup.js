/**
 * Stores/Pickup Handler
 */

const {
  getListOfPickupsByStoreAndProductId
} = require('../../models/pickups');

exports.handlerGetPickupsByStoreAndProduct = async (req, res) => {
  const productId = req.query.product_id || null;
  const storeId = req.params.store_id;
  try {
    const pickups = await getListOfPickupsByStoreAndProductId(
      Number(storeId),
      Number(productId)
    );
    return res.status(200).json({ pickups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};
