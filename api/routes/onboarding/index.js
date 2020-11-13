/**
 * Onboarding Routes
 *
 */
// external
const express = require('express');

const {
  validateUsersRegisterAuth,
  validateNewStorePayload,
  validateCouponFields,
  validateUserMerchantRegistration,
  validateUniqueSlug,
  validatePaginationQueryArgs
} = require('../../middlewares/index').validations;

const {
  isAuthValidAll,
  isUserMerchantOnStore
} = require('../../middlewares/index').auth;

const {
  validateAddonsFields
} = require('../../middlewares/validations/addons');

const {
  handleCreateMerchant,
  authenticateMerchantOnboarding,
  handleInvite,
  activateAccount
} = require('../../handlers/users');

const {
  handleCreateProduct,
  handleGetPartialListOfProducts,
  handleUpdateProductRecord,
  handleDeleteProduct
} = require('../../handlers/product');

const {
  handleCreateCoupon,
  handleFetchPartialListOfCouponsByStore,
  handleCouponUpdate,
  handleDeleteCoupon
} = require('../../handlers/coupons');

const {
  handleCreateNewStore,
  isSlugUnique,
  handleCreatePickup,
  handleCreateMDPickup,
  handleGetPartialListOfPickups,
  handleUpdateStoreRecord,
  handleUpdatePickupRecord,
  handleFileUpload,
  handleDeletePickup
} = require('../../handlers/index');

const {
  handleCreateAddons,
  handleUpdateAddons,
  handleFetchListOfAddonsByStore
} = require('../../handlers/addons');

const router = express.Router();

const {
  uploadStoreLogo,
  uploadStoreBackgroundImage
} = require('../../middlewares/uploadS3');

// create merchant + store
router.post(
  '/users/register',
  validateUserMerchantRegistration,
  handleCreateMerchant
);

// login
router.post(
  '/users/auth',
  validateUsersRegisterAuth,
  authenticateMerchantOnboarding
);

// create store
router.post('/stores', validateNewStorePayload, handleCreateNewStore);

// update store record
router.put(
  '/stores/:store_id',
  isUserMerchantOnStore,
  validateNewStorePayload,
  handleUpdateStoreRecord
);

// upload store logo
router.post(
  '/stores/:store_id/logo',
  isUserMerchantOnStore,
  uploadStoreLogo.single('logo'),
  handleFileUpload
);

// upload cover image for shopping experience
router.post(
  '/stores/:store_id/background_image',
  isUserMerchantOnStore,
  uploadStoreBackgroundImage.single('bgImage'),
  handleFileUpload
);

// create product
router.post(
  '/stores/:store_id/products',
  isUserMerchantOnStore,
  handleCreateProduct
);

// update product record
router.put(
  '/stores/:store_id/products/:product_id',
  isUserMerchantOnStore,
  handleUpdateProductRecord
);

// get paginated result of products
router.get(
  '/stores/:store_id/products',
  isAuthValidAll,
  validatePaginationQueryArgs,
  handleGetPartialListOfProducts
);

// delete product record from database
router.delete(
  '/stores/:store_id/product/:product_id',
  isUserMerchantOnStore,
  handleDeleteProduct
);

// create pickups
router.post(
  '/stores/:store_id/pickups',
  isUserMerchantOnStore,
  handleCreatePickup
);

//create mutiple days pickups
router.post(
  '/stores/:store_id/mdpickups',
  isUserMerchantOnStore,
  handleCreateMDPickup
);

// update pickup record
router.put(
  '/stores/:store_id/pickups/:pickup_id',
  isUserMerchantOnStore,
  handleUpdatePickupRecord
);

// get paginated result of pickups
router.get(
  '/stores/:store_id/pickups',
  isAuthValidAll,
  validatePaginationQueryArgs,
  handleGetPartialListOfPickups
);

// Delete pickup by id
router.delete(
  '/stores/:store_id/pickup/:pickup_id',
  isUserMerchantOnStore,
  handleDeletePickup
);

// create new user record based on invite
router.post('/stores/:store_id/invite', isUserMerchantOnStore, handleInvite);

// verify token gotten from invite link
router.get('/stores/verify', activateAccount);

// create coupon
router.post(
  '/stores/:store_id/coupon',
  isAuthValidAll,
  isUserMerchantOnStore,
  validateCouponFields,
  handleCreateCoupon
);

// fetch partial list of coupons
router.get(
  '/stores/:store_id/coupons',
  isAuthValidAll,
  isUserMerchantOnStore,
  validatePaginationQueryArgs,
  handleFetchPartialListOfCouponsByStore
);

// update coupon record
router.put(
  '/stores/:store_id/coupons/:coupon_id',
  isUserMerchantOnStore,
  handleCouponUpdate
);

// delete coupon record
router.delete(
  '/stores/:store_id/coupons/:coupon_id',
  isUserMerchantOnStore,
  handleDeleteCoupon
);

// create addons
router.post(
  '/stores/:store_id/addons',
  isUserMerchantOnStore,
  validateAddonsFields,
  handleCreateAddons
);

// get paginated list of addons by store
router.get(
  '/stores/:store_id/addons',
  isUserMerchantOnStore,
  validatePaginationQueryArgs,
  handleFetchListOfAddonsByStore
);

// update addons
router.put(
  '/stores/:store_id/addons/:addons_id',
  isUserMerchantOnStore,
  handleUpdateAddons
);

// Check if store id is unique
router.get('/validate/slug/:slug',
  isAuthValidAll,
  validateUniqueSlug,
  isSlugUnique
);

// Export routes
module.exports = router;
