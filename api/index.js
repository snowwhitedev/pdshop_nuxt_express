const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const basePino = require('pino')({
  prettyPrint: true
});

const pino = require('express-pino-logger')({
  logger: basePino,
  autoLogging: {
    ignorePaths: ['/health', '/api/health']
  },
  serializers: {
    req: ({ method, url }) => ({ method, url })
  }
});

const pkg = require('../package.json');

const app = express()
// secure the app by setting various HTTP headers
  .use(helmet())
// pino logger
  .use(pino)
// compress responses
  .use(compression())
// parse cookies
  .use(cookieParser())
// parse application/x-www-form-urlencoded
  .use(bodyParser.urlencoded({ extended: false }))
// parse application/json
  .use((req, res, next) => {
    if (req.originalUrl === '/api/stripe/webhook') {
      req.log.info(`incoming ${req.originalUrl}`);
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  })
  // routes
  .use('/health', (_, res) => {
    return res.status(200).json({
      version: pkg.version,
      code: 'ok'
    });
  })
  .use('/onboarding', require('./routes/onboarding/index'))
  .use('/shop', require('./routes/shopping/index'))
  .use('/stripe', require('./routes/stripe/index'))
  .use('/stores', require('./routes/stores/index'));

module.exports = { path: '/api', handler: app };
