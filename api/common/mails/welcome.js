const pino = require('pino')();
const { PERDIEM_DOMAIN, STRIPE_CONNECT_URL } = require('../../../nuxt.config').publicRuntimeConfig;
const { EMAIL_TEMPLATES } = require('../../../nuxt.config').privateRuntimeConfig;
const { getUserByEmail } = require('../../models/users');
const { getStoreBySlug } = require('../../models/stores');

const { sendEmail } = require('./index.js');

const DEFAULT_FROM = 'support@per-diem.co';

exports.sendWelcomeEmail = async (user, merchant, plainPassword) => {
  const msg = {
    to: user.email,
    from: DEFAULT_FROM,
    templateId: EMAIL_TEMPLATES.WELCOME_SHOPPER,
    dynamic_template_data: {
      merchant: {
        name: merchant.name,
        website: merchant.website
      },
      customer: {
        name: `${user.first_name} ${user.last_name}`,
        username: user.email,
        password: plainPassword
      },
      action_url: `${PERDIEM_DOMAIN}/m/${merchant.slug}/subscriptions/`,
      login_url: `${PERDIEM_DOMAIN}/m/${merchant.slug}/`
    }
  };
  await sendEmail(msg);
  return true;
};

exports.sendInviteEmail = async (user, merchant, plainPassword, token) => {
  const activationLink = `${PERDIEM_DOMAIN}/onboarding?activate=true&token=${token}`;
  const msg = {
    to: user.email,
    from: DEFAULT_FROM,
    subject: 'Hello from Per Diem',
    html: `
        <h1>Welcome to <a href="${PERDIEM_DOMAIN}">PerDiem.co</a></h1>
        <p>We are so happy you joined us!</p>
        <p>You have been invited to collaborate on ${merchant.first_name}, ${merchant.last_name}'s store!</p>
        <p>Here is your temporary password:  ${plainPassword}</p>
        <p>click on this link to activate your account and login:  <a href="${activationLink}">Activate your account</a></p>
        <p>You can reset your password using the reset password link below the login form anytime.</p>
        Subscribe & Save <a href="${PERDIEM_DOMAIN}">Per-Diem</a>.
        `
  };
  await sendEmail(msg);
  return true;
};

exports.sendWelcomeEmailMerchant = async (user, merchant) => {
  const msg = {
    to: user.email,
    from: DEFAULT_FROM,
    templateId: EMAIL_TEMPLATES.WELCOME_MERCHANT,
    dynamic_template_data: {
      merchant: {
        name: merchant.name,
        website: merchant.website
      },
      action_url: `${PERDIEM_DOMAIN}/onboarding/`,
      products_url: `${PERDIEM_DOMAIN}/onboarding/products`,
      pickup_locations_url: `${PERDIEM_DOMAIN}/onboarding/pickups`,
      promotions_url: `${PERDIEM_DOMAIN}/onboarding/coupons`,
      stripe_account_url: `${STRIPE_CONNECT_URL}&stripe_user[email]=${merchant.email}&stripe_user[business_name]=${merchant.name}`
    }
  };
  await sendEmail(msg);
  return true;
};

exports.sendResetPasswordMail = async (email, token, slug = '') => {
  const publicLink = `${PERDIEM_DOMAIN}/m/${slug}/passwordReset?token=${token}`;
  const merchantLink = `${PERDIEM_DOMAIN}/onboarding?resetPassword=true&token=${token}`;
  try {
    const merchant = await getStoreBySlug(slug);
    const user = await getUserByEmail(email);
    const msg = {
      to: user.email,
      from: DEFAULT_FROM,
      templateId: EMAIL_TEMPLATES.RESET_PASSWORD,
      dynamic_template_data: {
        merchant: {
          name: merchant ? merchant.name : 'Per Diem',
          website: merchant ? merchant.website : 'https://per-diem.co/'
        },
        customer: {
          name: merchant ? user.email : `${user.first_name} ${user.last_name}`
        },
        action_url: user.user_type === 'public' ? publicLink : merchantLink
      }
    };
    await sendEmail(msg);
  } catch (error) {
    pino.error(error);
  }
  return true;
};
