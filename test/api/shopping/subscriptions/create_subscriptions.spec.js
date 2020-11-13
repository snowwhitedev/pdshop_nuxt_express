/**
 * This test creates a new subscription for a shopping customer
 */

const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Internals
const validation = require('../../../../api/middlewares/auth');
const subscriptionModel = require('../../../../api/models/subscriptions');
const { getJWTToken } = require('../../../../api/models/auth.js');

describe('Create a new subscription for customer', () => {
  describe('create subscription [POST] /api/shop/stores/:store_id/subscriptions', () => {
    const jwtToken = getJWTToken({ user_id: 1, email: 'test@per-diem.co', user_type: 'public' });
    beforeEach(() => {
      sinon.stub(validation, 'getUserObjectFromRequest').returns(() => { return { user_id: 1 }; });
      delete require.cache[require.resolve('../../../../api/index.js')];
    });

    describe('When no subscription with same id exists.', () => {
      beforeEach(() => {
        sinon.stub(subscriptionModel, 'createNewSubscription')
          .returns(Promise.resolve({
            subscription_id: 1
          }));
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return 200 and a subscriptions object', (done) => {
        const app = require('../../../../api/index').handler;
        request(app)
          .post('/shop/subscriptions/1')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('x-access-token', jwtToken)
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
