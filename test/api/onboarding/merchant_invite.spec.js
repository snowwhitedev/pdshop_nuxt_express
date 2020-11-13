/**
 * This test suite contains the test for inviting collaborating merchants
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const userModel = require('../../../api/models/users');
const mailer = require('../../../api/common/mails/welcome');
const { getJWTToken } = require('../../../api/models/auth');

describe('invite merchant', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });

  beforeEach(() => {
    delete require.cache[require.resolve('../../../api/index.js')];

    sinon.stub(userModel, 'inviteUser').callsFake(function (payload) {
      return payload;
    });

    sinon.stub(mailer, 'sendInviteEmail').returns(null);

    sinon.stub(userModel, 'getUserByEmail').callsFake(function (payload) {
      return payload;
    });

    sinon.stub(userModel, 'getUserByStoreId').callsFake(function (payload) {
      return payload;
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when store exists', () => {
    it('should return 200 and a new user object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .post('/onboarding/stores/1/invite')
        .send({
          email: 'test@per-diem.co',
          store_id: 1
        })
        .set('x-access-token', jwtToken)
        .set('Content-Type', 'application/json; charset=utf-8')
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
