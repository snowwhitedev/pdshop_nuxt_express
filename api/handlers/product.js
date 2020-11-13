const {
  createProduct,
  getListOfProductsByStoreId,
  getPartialListOfProductsByStore,
  deleteProductRecord,
  updateProductRecord
} = require('../models/products');
const { getStoreById } = require('../models/stores');
const StripeClient = require('../models/stripe');

exports.handleCreateProduct = async (req, res) => {
  const { store_id } = req.params;
  const store = await getStoreById(store_id);
  const { name, description } = req.body;
  console.log(`Creating a product for store: ${store_id}`);
  const stripe = new StripeClient(store_id, store);

  try {
    // create stripe product
    const stripe_product = await stripe.createProduct(name, description, store_id);
    req.body.stripe_product_id = stripe_product.id;

    // create product prices on stripe
    const prices = JSON.parse(req.body.prices);
    for (let i = 0; i < prices.length; i++) {
      const price = prices[i].price * 100;
      const stripe_price = await stripe.createPrice(stripe_product.id, price, prices[i].interval);
      prices[i].price_id = stripe_price.id;
    }

    // parse price object
    req.body.prices = JSON.stringify(prices);

    // create Product on perdiem database
    const product = await createProduct(req.body);
    return res.status(200).json(product);
  } catch (error) {
    console.log('error creating product');
    console.log(error);
    return res.status(500).json({ error: `Error - ${error}` });
  }
};

exports.handleUpdateProductRecord = async (req, res) => {
  const { product_id } = req.params;
  try {
    const product = await updateProductRecord(product_id, req.body);
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ error: `Error - ${error}` });
  }
};

exports.getProductsByStoreId = async (req, res) => {
  try {
    const products = await getListOfProductsByStoreId(req.params.store_id);
    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Error' });
  }
};

exports.handleGetPartialListOfProducts = async (req, res) => {
  const { limit, offset } = req.query;
  const { store_id } = req.params;

  try {
    const products = await getPartialListOfProductsByStore(store_id, limit, offset);
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: `Error - ${error}` });
  }
};

exports.handleDeleteProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    await deleteProductRecord(product_id);
    return res.status(200).json({ deleted: true });
  } catch (error) {
    return res.status(500).json({ error: `Error - ${error}` });
  }
};
