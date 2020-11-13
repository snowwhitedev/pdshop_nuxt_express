const AWS = require('aws-sdk');

const {
  IAM_ACCESS_KEY,
  IAM_SECRET_KEY
} = require('../../nuxt.config').privateRuntimeConfig;

module.exports = new AWS.S3({
  accesskeyId: IAM_ACCESS_KEY,
  secretAccessKey: IAM_SECRET_KEY
});
