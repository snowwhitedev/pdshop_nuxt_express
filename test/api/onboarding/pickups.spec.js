/**
 * This test suite contains all tests for pickups in onboarding flow
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const pickupsModel = require('../../../api/models/pickups');
const { getJWTToken } = require('../../../api/models/auth');

describe('pickups', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });
  beforeEach(() => {
    delete require.cache[require.resolve('../../../api/index.js')];

    sinon.stub(pickupsModel, 'createPickup').callsFake(function (payload) {
      return payload;
    });

    sinon.stub(pickupsModel, 'updatePickupRecord').callsFake(function (payload) {
      return payload;
    });

    sinon.stub(pickupsModel, 'deletePickupRecord').returns(Promise.resolve(null));

    sinon.stub(pickupsModel, 'getPartialListOfPickupsByStore').returns(Promise.resolve({
      pickup_id: 1,
      name: 'test-pickup',
      title: 'test-title',
      description: 'test-description',
      location: {
        zip: 1234,
        state: 'test',
        city: 'test',
        country: 'test'
      }
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when user is merchant and store exists', () => {
    it('should return 200 and a new pickup object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .post('/onboarding/stores/1/pickups')
        .send({
          name: 'test-pickup',
          title: 'test-title',
          description: 'test-description',
          location: {
            zip: 1234,
            state: 'test',
            city: 'test',
            country: 'test'
          }
        })
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

  describe('when user is a merchant and store exists', () => {
    it('should return 200 and a pickups object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .put('/onboarding/stores/1/pickups/1')
        .set('Accept', /json/)
        .send({
          name: 'test'
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

  describe('when user is a merchant and store exists', () => {
    it('should return 200 and a pickups object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .get('/onboarding/stores/1/pickups?limit=10&offset=0')
        .set('x-access-token', jwtToken)
        .expect(200, (err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.pickups.pickup_id).equal(1);

          done();
        });
    });
  });

  describe('when user is a merchant and store exists', () => {
    it('should return 200', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .delete('/onboarding/stores/1/pickup/1')
        .set('x-access-token', jwtToken)
        .expect(200, (err, _) => {
          if (err) {
            throw err;
          }

          done();
        });
    });
  });
});
