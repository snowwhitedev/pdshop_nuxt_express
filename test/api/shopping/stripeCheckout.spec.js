/**
 * This test checks out a user on subscribing to a product through stripe
 */

const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');

// Internals
const storeModel = require('../../../api/models/stores');
const StripeClient = require('../../../api/models/stripe');
const { getJWTToken } = require('../../../api/models/auth.js');

describe('Create a session for checkout on stripe', () => {
  describe('create checkout session [POST] /api/stripe/stripeSession/create/:store_id', () => {
    const jwtToken = getJWTToken({
      user_id: 1,
      email: 'test@per-diem.co',
      user_type: 'public'
    });

    beforeEach(() => {
      delete require.cache[require.resolve('../../../api/index.js')];
    });

    describe('when shopping order is complete', () => {
      beforeEach(() => {
        sinon.stub(storeModel, 'getStoreById').returns(Promise.resolve({ is_production: false }));
        sinon.stub(StripeClient.prototype, 'createCheckoutSession')
          .returns(Promise.resolve({
            session_id: 'stripe_session_id'
          }));
      });

      it('should return a stripe session id', (done) => {
        const app = require('../../../api/index').handler;
        request(app)
          .post('/stripe/stores/1/stripeSession')
          .send({
            slug: 'test-store',
            lineItems: {}
          })
          .set('x-access-token', jwtToken)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body).to.deep.equal({
              session_id: 'stripe_session_id'
            });

            done();
          });
      });
    });
  });
});
