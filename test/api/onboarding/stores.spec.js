/**
 * This file contains several tests for onboarding stores endpoints
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const storesModel = require('../../../api/models/stores');
const { getJWTToken } = require('../../../api/models/auth');

describe('stores', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../../api/index.js')];

    sinon.stub(storesModel, 'updateStoreRecord').callsFake(function (payload) {
      return payload;
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when store exists and user is a merchant', () => {
    it('should return 200 and updated store record', (done) => {
      const jwtToken = getJWTToken({
        user_id: 1,
        email: 'test@per-diem.co',
        user_type: 'merchant',
        store_id: 1
      });
      const app = require('../../../api/index').handler;

      request(app)
        .put('/onboarding/stores/1')
        .set('Accept', /json/)
        .send({
          payload: {
            title: 'test-title',
            name: 'test-store'
          }
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
