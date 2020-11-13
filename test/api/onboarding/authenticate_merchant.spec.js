/**
 * This tests for the authentication of a merchant
 * before granting access to the system
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

// internals
const userModel = require('../../../api/models/users');
const { getJWTToken } = require('../../../api/models/auth.js');
const authModel = require('../../../api/models/auth');
const storeModel = require('../../../api/models/stores');

describe('Merchant authentication for onboarding', () => {
  describe('Authenticate merchant [POST] /api/onboarding/users/auth', () => {
    getJWTToken({
      user_id: 1,
      email: 'test@per-diem.co',
      user_type: 'merchant'
    });
    beforeEach(() => {
      delete require.cache[require.resolve('../../../api/index.js')];
    });

    describe('when user is a merchant', () => {
      beforeEach(function () {
        sinon.stub(userModel, 'getUserByEmail')
          .callsFake((payload) => {
            return Promise.resolve({ email: payload, user_type: 'merchant', user_id: 1 });
          });
        sinon.stub(storeModel, 'getStoreById')
          .returns(Promise.resolve(null));
        sinon.stub(authModel, 'compareUserPassword')
          .returns('pass');
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return 200', (done) => {
        const app = require('../../../api/index').handler;
        request(app)
          .post('/onboarding/users/auth')
          .send({
            email: 'test@per-diem.co',
            password: 'pass'
          })
          .type('form')
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body.UserRecord.email).equal('test@per-diem.co');

            done();
          });
      });
    });
  });
});
