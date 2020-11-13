/**
 * This test fetches the addons and pickup locations of associated products
 */

const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');

// Internals
const addonsModel = require('../../../../api/models/addons');
const pickupsModel = require('../../../../api/models/pickups');
const { getJWTToken } = require('../../../../api/models/auth');

describe('Get pickups and addons from database', () => {
  describe('Get pickups and addons [GET] /api/stores/:store_id/addons and /api/stores/:store_id/pickups', () => {
    const jwtToken = getJWTToken({
      user_id: 1,
      email: 'test@per-diem.co',
      user_type: 'merchant',
      store_id: 1
    });

    beforeEach(() => {
      delete require.cache[require.resolve('../../../../api/index.js')];
    });

    describe('When associated product exist', () => {
      beforeEach(() => {
        sinon.stub(addonsModel, 'getListOfActiveAddons')
          .returns(Promise.resolve({
            addons_id: 1,
            store_id: 1,
            name: 'test_addon'
          }));

        sinon.stub(pickupsModel, 'getListOfPickupsByStoreAndProductId')
          .returns({
            pickup_id: 1,
            store_id: 1,
            name: 'test_pickup'
          });

        sinon
          .stub(pickupsModel, 'getListOfPickupsByStore')
          .returns({
            pickup_id: 1,
            store_id: 1,
            name: 'test_pickup'
          });
      });

      afterEach(() => {
        sinon.restore();
      });

      it('should return 200 and an addons object', (done) => {
        const app = require('../../../../api/index').handler;
        request(app)
          .get('/shop/addons/:store_id')
          .set('x-access-token', jwtToken)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body.addons).to.deep.equal({
              addons_id: 1,
              store_id: 1,
              name: 'test_addon'
            });

            done();
          });
      });

      it('should return 200 and a pickups object', (done) => {
        const app = require('../../../../api/index').handler;
        request(app)
          .get('/shop/pickups/singleProduct/:store_id')
          .set('x-access-token', jwtToken)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }

            expect(res.body.pickups).to.deep.equal({
              pickup_id: 1,
              store_id: 1,
              name: 'test_pickup'
            });

            done();
          });
      });
    });
  });
});
