/**
 * This test update subscription record in the database
 */

const sinon = require('sinon');
const request = require('supertest');
const { expect } = require('chai');

// Internals
const subscriptionModel = require('../../../../api/models/subscriptions');
const { getJWTToken } = require('../../../../api/models/auth.js');

describe('Update subscription record', () => {
  describe('Update subscription [PUT] /api/shop/stores/:store_id/subscriptions/:subscription_id', () => {
    let token;
    beforeEach(() => {
      delete require.cache[require.resolve('../../../../api/index.js')];
    });

    describe('when subscription with specified id exists', () => {
      beforeEach(async () => {
        sinon.stub(subscriptionModel, 'updateExistingSubscription')
          .returns(Promise.resolve({
            subscription_id: 1,
            store_id: 1,
            user_id: 1,
            product_id: 1,
            addon_id: 1,
            stripe_price_id: 'price_id'
          }));
        const user = { user_id: 1, role: 'public', email: 'test_user@per-diem.co' };
        token = await getJWTToken(user);
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return 200 and a subscription object', (done) => {
        const app = require('../../../../api/index').handler;
        request(app)
          .put('/shop/subscriptions/1')
          .send({
            subscription_id: 1,
            store_id: 1,
            user_id: 1,
            product_id: 1,
            addon_id: 1,
            stripe_price_id: 'price_id'
          })
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json')
          .set('x-access-token', token)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body.subscription).to.deep.equal({
              subscription_id: 1,
              user_id: 1,
              store_id: 1,
              product_id: 1,
              addon_id: 1,
              stripe_price_id: 'price_id'
            });

            done();
          });
      });
    });
  });
});
