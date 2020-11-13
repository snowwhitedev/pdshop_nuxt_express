const Joi = require('@hapi/joi');

exports.validateShippingPayload = async (req, res, next) => {
  const schema = Joi.object({
    store_id: Joi.number().integer().required(),
    product_ids: Joi.array().items(
      Joi.number().integer()
    ),
    description: Joi.string().required(),
    price: Joi.number().integer().required()
  });

  try {
    await schema.validateAsync(req.body);
    req.body.is_active = true;
    return next();
  } catch (error) {
    req.log.error(error);
    return res.status(400).send({ error: 'invalid Payload' });
  }
};
