const jwt = require('jsonwebtoken');
const {
  getUserByEmail,
  createMerchant,
  createNewPublicUser,
  inviteUser,
  getUserByStoreId,
  updateUserRecord
} = require('../models/users');
const { compareUserPassword, getJWTToken } = require('../models/auth');
const { getStoreById, createStore } = require('../models/stores');
const {
  sendWelcomeEmail,
  sendInviteEmail
} = require('../common/mails/welcome');

const {
  COOKIE_EXPIRATION,
  IS_PROD,
  JWT_SECRET
} = require('../../nuxt.config').privateRuntimeConfig;
const StripeClient = require('../models/stripe');

exports.handleCreateMerchant = async (req, res) => {
  // Check if user exist
  let user;
  try {
    user = await getUserByEmail(req.body.email);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }

  if (!user) {
    try {
      // Create store
      const storeRecord = await createStore({});
      // set store id in req.body
      req.body.store_id = storeRecord.store_id;
      // Create user
      const userRecord = await createMerchant(req.body);
      const token = getJWTToken(userRecord);

      return res.status(200).json({ UserRecord: userRecord, token, storeRecord });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    // should not register existing user
    return res.status(409).json({ error: 'User Exists' });
  }
};

exports.handleInvite = async (req, res) => {
  // Check if user exist
  let user;
  try {
    user = await getUserByEmail(req.body.email);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }

  if (!user) {
    try {
      const merchant = await getUserByStoreId(req.body.store_id);
      const { user, token, tempPass } = await inviteUser(req.body);
      await sendInviteEmail(user, merchant, tempPass, token);
      return res.status(200).json({ user, token, tempPass });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    return res.status(200).json({ userExist: true });
  }
};

exports.activateAccount = async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    await jwt.verify(token, JWT_SECRET, async (err, decodedData) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized!' });
      }

      const user = await getUserByEmail(decodedData.email, false);
      if (!user) {
        return res.status(400).json({ error: 'Bad arguments' });
      }

      await updateUserRecord(decodedData.user_id, { active: true });
      return res.status(200).json({ valid: true });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.handleNewUserStepOne = async (req, res) => {
  const { email } = req.body;
  const storeId = req.params.store_id;
  req.log.info(`Getting store by id: ${storeId}`);
  const store = await getStoreById(storeId);

  const stripe = new StripeClient(storeId, store);

  // Check if user exist
  let user;
  try {
    user = await getUserByEmail(email);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
  if (!user) {
    try {
      // Create stripe customer account
      const customer = await stripe.createCustomer({ email });
      // Create user
      const {
        JWTToken,
        userRecord,
        tmpPassword
      } = await createNewPublicUser(email, customer.customerId);
      const storeRecord = await getStoreById(storeId);

      try {
        // email the user
        await sendWelcomeEmail(userRecord, storeRecord, tmpPassword);
      } catch (error) {
        req.log.error('Error sending email!');
      }

      return res
        .status(201)
        .cookie('token', JWTToken, {
          expires: new Date(Date.now() + COOKIE_EXPIRATION),
          secure: IS_PROD,
          httpOnly: true
        })
        .json({ code: 'UserRegister', userRecord });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    // UI: show password
    return res.status(200).json({
      code: 'UserExist'
    });
  }
};

exports.authenticateMerchantOnboarding = async (req, res) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await getUserByEmail(email);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: 'Internal Error' });
  }

  // return 400 bad arguments user not found.
  if (!user) {
    return res.status(400).send('Bad Arguments');
  }

  // check if user is non merchant user
  if (user.user_type !== 'merchant') {
    return res.status(403).send('Unauthorized access.');
  }

  if (compareUserPassword(user, password)) {
    const token = getJWTToken(user);
    const store = await getStoreById(user.store_id);
    return res.status(200).json({ UserRecord: user, token, store });
  } else {
    return res.status(404).json({ error: 'Invalid login.' });
  }
};
