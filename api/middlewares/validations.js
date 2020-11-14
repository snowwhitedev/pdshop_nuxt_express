const Joi = require('@hapi/joi');

const { USERS_TYPES } = require('../../nuxt.config').privateRuntimeConfig;
const { WEEK_DAYS } = require('../../store/contants');

exports.validateUsersRegisterAuth = async (req, _res, next) => {
  // validate email and password
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }).unknown(true);

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateStoreSlug = async (req, _res, next) => {
  // validate slug
  const schema = Joi.object({
    slug: Joi.string().required()
  }).unknown(true);

  try {
    await schema.validateAsync(req.params);
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateStoreIdParams = async (req, _res, next) => {
  const schema = Joi.object({
    store_id: Joi.number().integer().required()
  }).unknown(true);

  try {
    await schema.validateAsync(req.params);
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateProductShopping = async (req, _res, next) => {
  // body
  const schema = Joi.object({
    product_id: Joi.number().integer().required(),
    pricing_id: Joi.number().integer().required(),
    store_id: Joi.number().integer().required()
  }).unknown(true);

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateNewUserStep = async (req, _res, next) => {
  // body
  const schema = Joi.object({
    email: Joi.string().email().required()
  }).unknown(true);

  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateNewStorePayload = async (req, _, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    business_type: Joi.string().allow('individual', 'non-profit', 'corporation'),
    slug: Joi.string().lowercase().required().regex(/^[a-zA-Z0-9-_]+$/),
    email: Joi.string().email().required(),
    phone: Joi.number().required(),
    website: Joi.string().allow('').optional(),
    logo: Joi.string().allow('').optional(),
    background_image: Joi.string().allow('').optional(),
    description: Joi.string().allow('').optional(),
    active: Joi.boolean().default(true)
  });

  try {
    // check if request is sent for new store creation
    if (!req.body.userId) {
      return next();
    }
    await schema.validateAsync(req.body.payload);
    return next();
  } catch (error) {
    const errMsg = new Error('InvalidPayload');
    req.log.error(errMsg);
    return next(errMsg);
  }
};

exports.validateLocationQueryArgs = async (req, _, next) => {
  const schema = Joi.object({
    limit: Joi.number().integer().min(1).default(100),
    offset: Joi.number().integer().min(0).default(0)
  });

  try {
    await schema.validateAsync(req.query);
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateCouponFields = async (req, _, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    isPercent: Joi.boolean().default(false),
    is_active: Joi.boolean().default(true),
    amount: Joi.number().required(),
    expires: Joi.date().required(),
    store_id: Joi.number()
      .integer()
      .required()
  });

  try {
    await schema.validateAsync(req.body.internalPayload);
    return next();
  } catch (error) {
    req.log.error(error);
    return next(error);
  }
};

exports.validateUserMerchantRegistration = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required()
  });

  try {
    await schema.validateAsync(req.body);
    // set user type and active
    req.body.active = true;
    req.body.user_type = USERS_TYPES.MERCHANT;
    return next();
  } catch (error) {
    req.log.error(error);
    return res.status(400).send({ error: 'Wrong/Missing Payload' });
  }
};

exports.validateUniqueSlug = async (req, res, next) => {
  const schema = Joi.object({
    slug: Joi.string().regex(/^[a-zA-Z0-9-_]+$/).required()
  });

  try {
    await schema.validateAsync(req.params);
    return next();
  } catch (error) {
    req.log.error(error);
    return res.status(400).send({ error: 'Slug is required and must be letters or numbers with `_` or `-`' });
  }
};

exports.validatePaginationQueryArgs = async (req, _, next) => {
  // validate limit and offset
  const queryStringSchema = Joi.object({
    limit: Joi.number()
      .integer()
      .min(1)
      .default(50),
    offset: Joi.number()
      .integer()
      .min(0)
      .default(0)
  });

  try {
    await queryStringSchema.validateAsync(req.query);
    return next();
  } catch (error) {
    req.log.error(error);
    return next(error);
  }
};

exports.validatePickupQueryArgs = async (req, _, next) => {
  // validate PickupQueryArgs
  const schema = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    store_id: Joi.number().integer().required()
  }).unknown(true);

  //validate days_of_week
  const validateDaysOfWeek = (items) => {
    if (items.length === 0) {
      return false;
    }
    const selectedDays = [];
    for (const item of items) {
      if (!item.day_of_week || !WEEK_DAYS.includes(item.day_of_week)) {
        return false;
      }
      selectedDays.push(item.day_of_week);
    }
    const daySet = new Set(selectedDays);
    if (selectedDays.length != daySet.size) {
      return false;
    }
    return true;
  }

  try {
    await schema.validateAsync(req.body);
    if (!validateDaysOfWeek(req.body.days_of_week)) {
      throw Error({ message: `Unkown day of the week, can be only one of ${WEEK_DAYS}`});
    }
    return next();
  } catch (error) {
    req.log.error(error);
    return next(error);
  }
};

