const Joi = require('@hapi/joi');

exports.validateGetActiveAddonsQueryArgs = async (req, _, next) => {
  // validate limit and offset
  const schema = Joi.object({
    product_id: Joi.number()
      .integer()
      .default(null).optional()
  });

  try {
    await schema.validateAsync(req.query);
    return next();
  } catch (error) {
    req.log.error(error);
    return next(error);
  }
};

exports.validateAddonsFields = async (req, _, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    product_ids: Joi.array().items(
      Joi.number()
        .integer()
        .min(1)
    ),
    store_id: Joi.number()
      .integer()
      .required()
  }).unknown(true);

  try {
    await schema.validateAsync(req.body);
    req.body.is_active = true;
    return next();
  } catch (error) {
    req.log.error(error);
    return next(error);
  }
};
