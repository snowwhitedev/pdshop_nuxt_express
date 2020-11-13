const sgMail = require('@sendgrid/mail');
const pino = require('pino')();
const { SENDGRID_API_KEY } = require('../../../nuxt.config').privateRuntimeConfig;

sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendEmail = async (msg) => {
  try {
    await sgMail.send(msg);
  } catch (error) {
    pino.error(`error emailing ${msg}`);
    pino.error(error);
    if (error.response) {
      pino.error(error.response.body);
    }
  }
};
