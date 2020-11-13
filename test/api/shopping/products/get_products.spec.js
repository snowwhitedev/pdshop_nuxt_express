/**
 * This test contains test suites for retrieving products
 */

const sinon = require('sinon');
const request = require('supertest');
const { expect } = require('chai');

// Internals
const productsModel = require('../../../../api/models/products');
const { getJWTToken } = require('../../../../api/models/auth');

describe('Get products from database', () => {
  describe('get products from API [GET]', () => {
    const jwtToken = getJWTToken({
      user_id: 1,
      email: 'test@per-diem.co',
      user_type: 'merchant',
      store_id: 1
    });

    beforeEach(() => {
      delete require.cache[require.resolve('../../../../api/index.js')];
    });

    describe('When products exist', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'getListOfProductsByStoreId')
          .returns(Promise.resolve({
            product_id: 1,
            name: 'test product'
          }));
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return list of products by associated store id', (done) => {
        const app = require('../../../../api/index').handler;
        request(app)
          .get('/shop/products/1')
          .set('x-access-token', jwtToken)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body.products).to.deep.equal({
              product_id: 1,
              name: 'test product'
            });

            done();
          });
      });
    });
  });
});
