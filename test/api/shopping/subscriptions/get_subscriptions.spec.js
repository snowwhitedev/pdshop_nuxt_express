/**
 * This test gets subscriptions from the database
 */

const sinon = require('sinon');
const request = require('supertest');
const { expect } = require('chai');

// Internals
const subscriptionModel = require('../../../../api/models/subscriptions');
const { getJWTToken } = require('../../../../api/models/auth.js');

describe('Get Subscriptions', () => {
  let token;
  beforeEach(() => {
    delete require.cache[require.resolve('../../../../api/index.js')];
  });

  describe('when subscription exists in database and the user_id owns the subscription', () => {
    beforeEach(async () => {
      sinon.stub(subscriptionModel, 'getSubscriptionsByUserIdAndStoreId')
        .returns(Promise.resolve({
          subscription_id: 1,
          store_id: 1,
          user_id: 1
        }));
      sinon
        .stub(subscriptionModel, 'getSubscriptionsByStore')
        .returns(
          Promise.resolve({
            subscription_id: 1,
            store_id: 1,
            user_id: 1
          }));
      const user = { user_id: 1, role: 'public', email: 'test_user@per-diem.co' };
      token = await getJWTToken(user);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return subscriptions object based on associated user and store ids', (done) => {
      const app = require('../../../../api/index').handler;
      request(app)
        .get('/stores/subscriptions/1')
        .expect(200)
        .set('Authorization', token)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.subscriptions).to.deep.equal({
            subscription_id: 1,
            store_id: 1,
            user_id: 1
          });

          done();
        });
    });

    it('should return partial subscriptions object based on store ids', (done) => {
      const app = require('../../../../api/index').handler;
      request(app)
        .get('/stores/subscriptions/1/subscriptions?limit=10&offset=0')
        .expect(200)
        .set('Authorization', token)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.subscriptions).to.deep.equal({
            subscription_id: 1,
            store_id: 1,
            user_id: 1
          });

          done();
        });
    });
  });
});
