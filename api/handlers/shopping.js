'use strict';

const { getAllStores } = require('../models/stores');

/**
 *
 * @param {Express Request Object} req
 * @param {Express Response Object} res
 *
 * Create a new user if not exist
 * Set a cookie with a JWT inside
 */

exports.getStores = async (req, res) => {
  const { query } = req;
  const { limit = 100, offset = 0 } = query;
  try {
    // get list of addons by store id
    const stores = await getAllStores(limit, offset);
    return res.status(200).json({ stores });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 'InternalError'
    });
  }
};
