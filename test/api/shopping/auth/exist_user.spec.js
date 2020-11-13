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
const userModel = require('../../../../api/models/users');
const storeModel = require('../../../../api/models/stores');
const StripeClient = require('../../../../api/models/stripe');

describe('Shopping Flow', () => {
  describe('User Creation [POST] /api/shop/stores/:store_id/user', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../../../../api/index.js')];
    });

    describe('When user already exist', () => {
      beforeEach(function () {
        sinon.stub(storeModel, 'getStoreById')
          .returns(Promise.resolve({
            is_production: false
          }));
        sinon.stub(StripeClient.prototype, 'createCustomer').returns(
          Promise.resolve({
            customerId: 'stripe_customer_id'
          })
        );
        sinon.stub(userModel, 'getUserByEmail')
          .returns(Promise.resolve({
            user_id: 1,
            email: 'test@test.com'
          }));
      });

      afterEach(function () {
        sinon.restore();
      });

      it('Should return 200', (done) => {
        const app = require('../../../../api/index.js').handler;
        request(app)
          .post('/shop/users/1/register')
          .send({
            email: 'test@example.com'
          })
          .type('form')
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.body).to.deep.equal({
              code: 'UserExist'
            });
            done();
          });
      });
    });
  });
});
