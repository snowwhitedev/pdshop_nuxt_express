/**
 * This tests for the creating and fetching coupons
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const couponsModel = require('../../../api/models/coupons');
const storesModel = require('../../../api/models/stores');
const StripeClient = require('../../../api/models/stripe');
const { STRIPE_SECRET_KEY } = require('../../../nuxt.config').privateRuntimeConfig;

const { getJWTToken } = require('../../../api/models/auth');

describe('Coupons', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });
  beforeEach(() => {
    delete require.cache[require.resolve('../../../api/index.js')];

    sinon.stub(storesModel, 'getStoreById').returns(Promise.resolve({ is_production: false }));
    sinon.stub(StripeClient.prototype, 'createCoupon').resolves(null);
    sinon.stub(couponsModel, 'createCoupon')
      .callsFake((payload) => {
        return payload;
      });
    sinon.stub(couponsModel, 'fetchCouponByCode')
      .callsFake(function (payload) {
        return Promise.resolve(Object.assign({}, { coupon_id: 1 }, payload));
      });

    sinon.stub(couponsModel, 'fetchPartialListOfCouponsByStoreId')
      .callsFake(function (payload) {
        return Promise.resolve(Object.assign({}, { coupon_id: 1 }, payload));
      });

    sinon.stub(couponsModel, 'updateCoupon').callsFake((payload) => {
      return payload;
    });

    sinon.stub(couponsModel, 'deleteCoupon').returns(null);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('When a merchant create a coupon on a different store id', () => {
    it('should return an error', (done) => {
      const app = require('../../../api/index').handler;
      request(app)
        .post('/onboarding/stores/1/coupon')
        .type('form')
        .set('Accept', /json/)
        .send({
          stripePayload: {
            percent_off: 10,
            duration: 'repeating',
            duration_in_months: 3,
            currency: 'usd',
            id: 'test-coupon'
          },
          internalPayload: {
            name: 'test-coupon',
            amount: 10,
            store_id: 1,
            isPercent: true,
            is_active: true,
            expires: '2020-09-10 18:58:38'
          }
        })
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('Authorization', `bearer ${STRIPE_SECRET_KEY}`)
        .expect(401, (err) => {
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  describe('When a merchant user create a coupon', () => {
    describe('[POST] /onboarding/store/:store_id/coupon', () => {
      it('Should create a coupon', (done) => {
        const app = require('../../../api/index').handler;
        request(app)
          .post('/onboarding/stores/1/coupon')
          .type('form')
          .set('Accept', /json/)
          .send({
            stripePayload: {
              percent_off: 10,
              duration: 'repeating',
              duration_in_months: 3,
              currency: 'usd',
              id: 'test-coupon'
            },
            internalPayload: {
              name: 'test-coupon',
              code: 'test-code',
              amount: 10,
              store_id: 1,
              isPercent: true,
              is_active: true,
              expires: '2020-09-10 18:58:38'
            }
          })
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('x-access-token', jwtToken)
          .set('Authorization', `bearer ${STRIPE_SECRET_KEY}`)
          .expect(200, (err, res) => {
            if (err) {
              throw err;
            }

            expect(res.body.coupon.name).equal('test-coupon');
            expect(res.body.coupon.store_id).equal(1);

            done();
          });
      });
    });

    describe('[POST] /onboarding/store/:store_id/coupon', () => {
      it('Should create a coupon', (done) => {
        const app = require('../../../api/index').handler;
        request(app)
          .post('/onboarding/stores/1/coupon')
          .type('form')
          .set('Accept', /json/)
          .send({
            stripePayload: {
              percent_off: 10,
              duration: 'repeating',
              duration_in_months: 3,
              currency: 'usd',
              id: 'test-coupon'
            },
            internalPayload: {
              name: 'test-coupon',
              code: 'test_code',
              amount: 10,
              store_id: 1,
              isPercent: true,
              is_active: true,
              expires: '2020-09-10 18:58:38'
            }
          })
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('x-access-token', jwtToken)
          .set('Authorization', `bearer ${STRIPE_SECRET_KEY}`)
          .expect(200, (err, res) => {
            if (err) {
              throw err;
            }

            expect(res.body.coupon.name).equal('test-coupon');
            expect(res.body.coupon.store_id).equal(1);

            done();
          });
      });
    });
  });

  describe('when user is merchant and store exists', () => {
    it('should return 200 and a coupon object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .get('/onboarding/stores/1/coupons?limit=10&offset=0')
        .set('x-access-token', jwtToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('update coupon when user is a merchant and store exists', () => {
    it('Should update a coupon', (done) => {
      const app = require('../../../api/index').handler;
      request(app)
        .put('/onboarding/stores/1/coupons/1')
        .set('Accept', /json/)
        .send({
          payload: { amount: 10 }
        })
        .set('Content-Type', 'application/json; charset=utf-8')
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

  describe('when user is a merchant on store', () => {
    it('should return 200', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .delete('/onboarding/stores/1/coupons/1')
        .set('x-access-token', jwtToken)
        .expect(206, (err, _) => {
          if (err) {
            throw err;
          }

          done();
        });
    });
  });
});
