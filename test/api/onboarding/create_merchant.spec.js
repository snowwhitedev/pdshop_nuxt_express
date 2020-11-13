/**
 * This tests the creation
 * of a new merchant in the system
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

// internals
const { STRIPE_SECRET_KEY } = require('../../../nuxt.config').privateRuntimeConfig;
const userModel = require('../../../api/models/users');
const storeModel = require('../../../api/models/stores');
const authModel = require('../../../api/models/auth');
const StripeClient = require('../../../api/models/stripe');
const { getJWTToken } = require('../../../api/models/auth.js');
const mailClient = require('../../../api/common/mails/welcome');

describe('Onboarding merchants', () => {
  describe('Create new Merchant [POST] /api/onboarding/users/create', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../../../api/index.js')];

      sinon.stub(storeModel, 'getStoreById').returns(Promise.resolve({ is_production: false }));
      sinon.stub(StripeClient.prototype, 'completeOAuth').resolves('stripe_user_id');
      sinon.stub(mailClient, 'sendWelcomeEmailMerchant').returns(Promise.resolve(null));
      sinon.stub(userModel, 'getUserByStoreId')
        .returns(Promise.resolve({
          user_id: 1
        }));
      sinon.stub(storeModel, 'updateStoreRecord')
        .returns(null);
      sinon.stub(userModel, 'getUserByEmail')
        .callsFake(() => {
          return Promise.resolve(null);
        });
      sinon.stub(authModel, 'getPasswordHash')
        .returns(null);
      sinon.stub(storeModel, 'createStore')
        .returns({ store_id: 99 });
      sinon.stub(userModel, 'createMerchant')
        .callsFake(function (payload) {
          return Promise.resolve(Object.assign({}, payload, { user_id: 1 }));
        });
    });

    afterEach(() => {
      sinon.restore();
    });

    describe('With invalid payload', () => {
      describe('When a payload is missing email', () => {
        it('Should return an error', (done) => {
          const app = require('../../../api/index').handler;
          request(app)
            .post('/onboarding/users/register')
            .send({
              first_name: 'test',
              last_name: 'test',
              phone: '1234567',
              password: 'pass1234'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(400)
            .end(function (err) {
              if (err) {
                throw err;
              }
              done();
            });
        });
      });
    });

    describe('With a valid payload', () => {
      it('Should create a store and then create a user', (done) => {
        const app = require('../../../api/index').handler;
        request(app)
          .post('/onboarding/users/register')
          .send({
            first_name: 'test',
            last_name: 'test',
            phone: '1234567',
            password: 'pass1234',
            email: 'test@per-diem.co'
          })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body.UserRecord).to.deep.equal({
              user_id: 1,
              first_name: 'test',
              last_name: 'test',
              phone: '1234567',
              password: 'pass1234',
              email: 'test@per-diem.co',
              user_type: 'merchant',
              active: true,
              store_id: 99
            });

            done();
          });
      });
    });

    describe('Stripe', () => {
      const jwtToken = getJWTToken({ user_id: 1, email: 'test@per-diem.co', user_type: 'merchant' });

      it('should return 200 and stripe user id', (done) => {
        const app = require('../../../api/index').handler;

        request(app)
          .post('/stripe/connect/1')
          .send({
            code: 'fake code'
          })
          .set('x-access-token', jwtToken)
          .set('Authorization', `bearer ${STRIPE_SECRET_KEY}`)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.body.user).to.deep.equal({
              user_id: 1
            });
            done();
          });
      });
    });
  });
});
