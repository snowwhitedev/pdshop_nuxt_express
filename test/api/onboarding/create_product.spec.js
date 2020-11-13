/**
 * This tests for creating a new product item by a merchant
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

// Internals
const ProductModel = require('../../../api/models/products');
const storesModel = require('../../../api/models/stores');
const StripeClient = require('../../../api/models/stripe');
const { STRIPE_SECRET_KEY } = require('../../../nuxt.config').privateRuntimeConfig;
const { getJWTToken } = require('../../../api/models/auth.js');

describe('Creating a new product', () => {
  describe('Create product [POST] /api/onboarding/stores/:store_id/products', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../../../api/index.js')];
    });

    describe('save product to database', () => {
      beforeEach(() => {
        sinon.stub(storesModel, 'getStoreById').returns(Promise.resolve({ is_production: false }));
        sinon.stub(StripeClient.prototype, 'getStoreStripeAccountId').resolves(null);
        sinon.stub(StripeClient.prototype, 'createProduct').resolves('id');
        sinon.stub(StripeClient.prototype, 'createPrice').resolves('id');
        sinon.stub(ProductModel, 'createProduct').returns(
          Promise.resolve({
            product_id: 1,
            stripe_product_id: null,
            store_id: 1,
            name: 'test product',
            title: 'test title',
            description: 'test description',
            is_active: true,
            prices: [
              { price_id: null, price: 5, interval: 'month' },
              { price_id: null, price: 10, interval: 'year' }
            ],
            frequency: 'month'
          })
        );
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return 200 and a product object', (done) => {
        const app = require('../../../api/index').handler;
        const jwtToken = getJWTToken({
          user_id: 1,
          email: 'test@per-diem.co',
          user_type: 'merchant',
          store_id: 1
        });
        request(app)
          .post('/onboarding/stores/1/products')
          .send({
            store_id: 1,
            name: 'test product',
            title: 'test title',
            description: 'test description',
            is_active: true,
            prices: JSON.stringify([
              { price_id: null, price: 5, interval: 'month' },
              { price_id: null, price: 10, interval: 'year' }
            ]),
            frequency: 'month'
          })
          .type('form')
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json')
          .set('x-access-token', jwtToken)
          .set('Authorization', `bearer ${STRIPE_SECRET_KEY}`)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body).to.be.an('object');

            done();
          });
      });
    });
  });
});
