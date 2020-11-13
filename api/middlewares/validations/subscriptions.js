const Joi = require('@hapi/joi');

exports.validateGetSubscriptionByUserIdAndStoreId = async (req, _res, next) => {
  // validate email and password
  const paramsSchema = Joi.object({
    store_id: Joi.number().integer().required()
  }).unknown(true);

  try {
    await paramsSchema.validateAsync(req.params);
    return next();
  } catch (error) {
    req.log.error(error);
    return next(error);
  }
};

exports.validateSubscriptionParams = async (req, _res, next) => {
  // validate email and password
  const paramsSchema = Joi.object({
    subscription_id: Joi.number()
      .integer()
      .required()
  }).unknown(true);

  try {
    await paramsSchema.validateAsync(req.params);
    return next();
  } catch (error) {
    req.log.error(error);
    return next(error);
  }
};
