/**
 * This file contains tests for products endpoint in the onboarding flow
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const productsModel = require('../../../api/models/products');
const { getJWTToken } = require('../../../api/models/auth');

describe('products', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });

  beforeEach(() => {
    delete require.cache[require.resolve('../../../api/index.js')];

    sinon.stub(productsModel, 'getListOfProductsByStoreId').returns(Promise.resolve({
      product_id: 1,
      store_id: 1,
      name: 'test-product',
      prices: [{
        price_id: 1,
        interval: 'weekly',
        price: '50'
      }]
    }));

    sinon.stub(productsModel, 'getPartialListOfProductsByStore').returns(Promise.resolve({
      product_id: 1,
      store_id: 1,
      name: 'test-product',
      prices: [{
        price_id: 1,
        interval: 'weekly',
        price: '50'
      }]
    }));

    sinon.stub(productsModel, 'deleteProductRecord').returns(null);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when store exists and user is a merchant', () => {
    it('should return 200 and a products object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .get('/stores/1/products')
        .set('x-access-token', jwtToken)
        .expect(200, (err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.products.store_id).equal(1);

          done();
        });
    });
  });

  describe('when products exist and user is a merchant', () => {
    it('should return 200 and paginated results', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .get('/onboarding/stores/1/products?limit=10&offset=0')
        .set('x-access-token', jwtToken)
        .expect(200, (err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).to.be.an('object');

          done();
        });
    });
  });

  describe('when user is a merchant and has store', () => {
    it('should return 200', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .delete('/onboarding/stores/1/product/1')
        .set('x-access-token', jwtToken)
        .expect(200, (err, _) => {
          if (err) {
            throw err;
          }

          done();
        });
    });
  });
});
