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
const emailCommon = require('../../../../api/common/mails/welcome');
const storeModel = require('../../../../api/models/stores');
const StripeClient = require('../../../../api/models/stripe');

describe('Shopping Flow', () => {
  describe('User Creation [POST] /api/shop/stores/:store_id/user', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../../../../api/index.js')];
    });

    describe('When the user doesn\'t already exist', () => {
      let app = null;
      beforeEach(function () {
        sinon.stub(StripeClient.prototype, 'createCustomer').returns(
          Promise.resolve({
            customerId: 'stripe_customer_id'
          })
        );
        sinon.stub(userModel, 'getUserByEmail')
          .returns(Promise.resolve(null));
        sinon.stub(userModel, 'createNewPublicUser')
          .returns(Promise.resolve({
            JWTToken: '123',
            userRecord: {
              user_id: 1,
              email: 'test@test.com',
              user_type: 'public'
            },
            tmpPassword: '123456'
          }));
        sinon.stub(storeModel, 'getStoreById')
          .returns(Promise.resolve({
            store_id: 1,
            is_production: false
          }));
        sinon.stub(emailCommon, 'sendWelcomeEmail')
          .returns(true);
      });

      afterEach(function () {
        sinon.restore();
      });

      it('Should return 201', (done) => {
        app = require('../../../../api/index.js').handler;
        request(app)
          .post('/shop/users/1/register')
          .send({
            email: 'test@example.com'
          })
          .type('form')
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json')
          .expect(201)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.body).to.deep.equal({
              code: 'UserRegister',
              userRecord: {
                user_id: 1,
                email: 'test@test.com',
                user_type: 'public'
              }
            });
            done();
          });
      });
    });
  });
});
