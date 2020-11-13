/**
 * This tests for the creation of a new store
 * on the system
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

// Internals
const storeModel = require('../../../api/models/stores');
const userModel = require('../../../api/models/users');
const { getJWTToken } = require('../../../api/models/auth.js');

describe('Onboarding a new store', () => {
  describe('Create store [POST] /api/onboarding/store/create', () => {
    const jwtToken = getJWTToken({ user_id: 1, email: 'test@per-diem.co', user_type: 'merchant' });
    beforeEach(() => {
      delete require.cache[require.resolve('../../../api/index')];
      // stub store model create a store
      sinon.stub(storeModel, 'createStore')
        .callsFake(function fakeFn (payload) {
          return Promise.resolve(Object.assign({}, { store_id: 1 }, payload));
        });
      // Stub updateUserRecord
      sinon.stub(userModel, 'updateUserRecord')
        .returns(Promise.resolve(null));
    });

    afterEach(() => {
      sinon.restore();
    });

    describe('When the store doesn\'t already exist', () => {
      it('it should return 200', (done) => {
        const app = require('../../../api/index').handler;
        request(app)
          .post('/onboarding/stores')
          .send({
            payload: {
              name: 'test name',
              title: 'test title',
              business_type: 'individual',
              slug: 'test_test-test',
              email: 'test@per-diem.co',
              phone: 5105650086
            }
          })
          .set('x-access-token', jwtToken)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.body.store.store_id).to.equal(1);
            expect(res.body.store.title).to.equal('test title');
            expect(res.body.store.slug).to.equal('test_test-test');
            done();
          });
      });
    });

    describe('Create a store with special chars in the name `Dorons&sons`', () => {
      it('Should return an error', (done) => {
        const app = require('../../../api/index').handler;
        request(app)
          .post('/onboarding/stores')
          .send({
            payload: {
              name: 'testStore',
              business_type: 'Test',
              slug: 'Doron\'s&&&Sons',
              title: 'test store',
              email: 'store@test.com',
              phone: 1234567
            },
            userId: 1
          })
          .set('x-access-token', jwtToken)
          .expect(500)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.statusCode).to.equal(500);
            done();
          });
      });
    });
  });
});
