const express = require('express');
const router = express.Router();

router.use(require('./stripe.routes'));

module.exports = router;
