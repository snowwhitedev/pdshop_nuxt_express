/**
 * This test suite contains the tests for coupons enpoints
 * on the shopping flow
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const couponsModel = require('../../../../api/models/coupons');
const { getJWTToken } = require('../../../../api/models/auth');

describe('coupons', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });

  beforeEach(() => {
    delete require.cache[require.resolve('../../../../api/index.js')];

    sinon.stub(couponsModel, 'fetchCouponByCode').returns(Promise.resolve({
      coupon_id: 1,
      code: 'fake-code',
      name: 'test coupon'
    }));

    sinon.stub(couponsModel, 'fetchCouponsByStoreId').returns(Promise.resolve({
      coupon_id: 2,
      code: 'fake-code',
      name: 'test coupon'
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when coupon exists', () => {
    it('should return 200 and a coupon object', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .get('/shop/coupons/fake-code')
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

  describe('when coupon exists', () => {
    it('should return 200 and a coupon object', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .get('/shop/coupons/1')
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
});
