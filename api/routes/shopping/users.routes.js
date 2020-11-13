const express = require('express');

const router = express.Router();

const {
  handleNewUserStepOne
} = require('../../handlers/users');

const {
  handleUserRegisterAuth
} = require('../../handlers/index');

const {
  handleSendResetMail,
  handlePasswordReset
} = require('../../handlers/passwordReset');

const {
  validateUsersRegisterAuth,
  validateNewUserStep
} = require('../../middlewares/index').validations;

// create user by email
router.post(
  '/:store_id/register',
  validateNewUserStep,
  handleNewUserStepOne
);

// if user exist try to login
router.post(
  '/auth',
  validateUsersRegisterAuth,
  handleUserRegisterAuth
);

// send reset password email
router.post('/auth/reset', handleSendResetMail);

// reset password
router.post('/auth/reset/:token', handlePasswordReset);

module.exports = router;
