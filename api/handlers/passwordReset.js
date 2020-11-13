const jwt = require('jsonwebtoken');
const { getPasswordHash } = require('../models/auth');
const { sendResetPasswordMail } = require('../common/mails/welcome');
const {
  getUserByEmail,
  updateUserRecord
} = require('../models/users');
const {
  JWT_SECRET,
  USERS_TYPES
} = require('../../nuxt.config').privateRuntimeConfig;

exports.handleSendResetMail = async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (user) {
    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
      expiresIn: '2h'
      // expiresIn: '120000'
    });

    let send;
    if (user.user_type === USERS_TYPES.PUBLIC) {
      const { slug } = req.query;
      send = sendResetPasswordMail(email, token, slug);
    }

    if (user.user_type === USERS_TYPES.MERCHANT) {
      send = sendResetPasswordMail(email, token);
    }

    if (send) {
      return res
        .status(200)
        .json({ success: 'Mail sent successfully, magic link expires in two hours' });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
  return res.status(404).json({ error: 'Email does not exist!' });
};

exports.handlePasswordReset = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    await jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: `An error occurred - ${err}` });
      }

      updateUserRecord(decoded.id, { password: getPasswordHash(newPassword) })
        .then((resp) => {
          if (resp !== undefined || null) {
            return res
              .status(200)
              .send(`Password reset for ${resp.email} successful.`);
          }
          return res.status(404).json({ error: `Error updating password ${resp}` });
        })
        .catch((error) => {
          return res.status(500).json({ error });
        });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
