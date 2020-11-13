/**
 * This will tests
 * - User signup
 * - User authentications
 */
const {
  expect
} = require('chai');
const request = require('supertest');
const sinon = require('sinon');

// internals
const storeModel = require('../../../../api/models/stores');

describe('Shopping Flow', () => {
  describe('Get all stores', () => {
    beforeEach(() => {
    });

    describe('[GET] /shop/stores?limit=100&offset=100', () => {
      let app = null;
      beforeEach(function () {
        sinon.stub(storeModel, 'getAllStores')
          .returns(Promise.resolve([
            {
              store_id: 1
            }, {
              store_id: 2
            }]
          ));
        sinon.stub(storeModel, 'getStoreAndActiveProductsByStoreSlug')
          .returns(Promise.resolve({
            store: {},
            products: {}
          }));
      });

      afterEach(function () {
        sinon.restore();
      });

      it('Should return list of stores', (done) => {
        app = require('../../../../api/index.js').handler;
        request(app)
          .get('/stores')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.body.stores).to.deep.equal([
              {
                store_id: 1
              },
              {
                store_id: 2
              }
            ]);
            done();
          });
      });

      it('Should return list of stores', (done) => {
        app = require('../../../../api/index.js').handler;
        request(app)
          .get('/stores?limit=50&offset=100')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.body.stores).to.deep.equal([
              {
                store_id: 1
              },
              {
                store_id: 2
              }
            ]);
            done();
          });
      });

      it('Should return a store along with its associated products', (done) => {
        app = require('../../../../api/index.js').handler;
        request(app)
          .get('/stores/slug/test_store')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.body.store).to.deep.equal({
              store: {},
              products: {}
            });
            done();
          });
      });
    });
  });
});
