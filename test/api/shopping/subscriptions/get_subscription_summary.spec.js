/**
 * This test gets subscriptions from the database
 */

const sinon = require('sinon');
const request = require('supertest');
const { expect } = require('chai');

// Internals
const subscriptionModel = require('../../../../api/models/subscriptions');
const { getJWTToken } = require('../../../../api/models/auth.js');

describe('Get subscription from DB', () => {
  describe('Get subscription [GET]', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../../../../api/index.js')];
    });

    describe('when subscription exists in database', () => {
      const jwtToken = getJWTToken({ user_id: 1, email: 'test@per-diem.co', user_type: 'public' });
      beforeEach(() => {
        sinon.stub(subscriptionModel, 'getSubscriptionSummary')
          .returns(Promise.resolve({
            product: {},
            price: {},
            addons: {},
            pickup: {}
          }));
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return subscriptions object based on associated user and store ids', (done) => {
        const app = require('../../../../api/index').handler;
        request(app)
          .get('/shop/subscriptions/1')
          .expect(200)
          .set('Authorization', jwtToken)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body.summary).to.deep.equal({
              product: {},
              price: {},
              addons: {},
              pickup: {}
            });

            done();
          });
      });
    });
  });
});
