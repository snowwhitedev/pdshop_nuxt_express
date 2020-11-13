/**
 * This will test
 * - creation and updating of shipping records
 * - fetching shipping records
 */
const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

// internals
const shippingModel = require('../../../../api/models/shipping');
const { getJWTToken } = require('../../../../api/models/auth.js');

describe('shipping', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });

  beforeEach(() => {
    delete require.cache[require.resolve('../../../../api/index.js')];
    sinon.stub(shippingModel, 'createShipping').callsFake((payload) => {
      return payload;
    });

    sinon.stub(shippingModel, 'updateShipping').callsFake((payload) => {
      return payload;
    });

    sinon.stub(shippingModel, 'getPartialListOfShippingByStore').returns(
      Promise.resolve([
        {
          store_shipping_id: 1,
          store_id: 1,
          price: 50,
          product_ids: [1, 2, 3],
          description: 'test',
          is_active: true
        }
      ])
    );

    sinon.stub(shippingModel, 'getShippingByStore').returns(
      Promise.resolve([
        {
          store_shipping_id: 1,
          store_id: 1,
          price: 50,
          product_ids: [1, 2, 3],
          description: 'test',
          is_active: true
        }
      ])
    );

    sinon.stub(shippingModel, 'getShippingById').returns(
      Promise.resolve({
        store_shipping_id: 1,
        store_id: 1,
        price: 50,
        product_ids: [1, 2, 3],
        description: 'test',
        is_active: true
      })
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('create shipping', () => {
    it('should return 201 and a shipping object', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .post('/stores/1/shipping')
        .send({
          store_id: 1,
          price: 50,
          product_ids: [1, 2, 3],
          description: 'test'
        })
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .expect(201)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.shipping).to.deep.equal({
            store_id: 1,
            price: 50,
            product_ids: [1, 2, 3],
            description: 'test',
            is_active: true
          });
          done();
        });
    });
  });

  describe('update shipping', () => {
    it('should return 200 and an updated shipping object', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .put('/stores/1/shipping')
        .send({
          description: 'testing'
        })
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('Accept', 'application/json')
        .set('x-access-token', jwtToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.shipping).to.deep.equal({
            description: 'testing'
          });
          done();
        });
    });
  });

  describe('Get shipping records', () => {
    it('should return 200 and an array of shipping objects', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .get('/stores/1/shippings')
        .set('x-access-token', jwtToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.shipping).to.deep.equal([
            {
              store_shipping_id: 1,
              store_id: 1,
              price: 50,
              product_ids: [1, 2, 3],
              description: 'test',
              is_active: true
            }
          ]);
          done();
        });
    });
  });

  describe('Get paginated list of shipping records', () => {
    it('should return 200 and an array of shipping objects', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .get('/stores/1/shipping?limit=50&offset=0')
        .set('x-access-token', jwtToken)
        .expect(206)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.shipping).to.deep.equal([
            {
              store_shipping_id: 1,
              store_id: 1,
              price: 50,
              product_ids: [1, 2, 3],
              description: 'test',
              is_active: true
            }
          ]);
          done();
        });
    });
  });

  describe('Get shipping record by id', () => {
    it('should return 200 and a shipping object', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .get('/stores/1/shipping/1')
        .set('x-access-token', jwtToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body.shipping).to.deep.equal({
            store_shipping_id: 1,
            store_id: 1,
            price: 50,
            product_ids: [1, 2, 3],
            description: 'test',
            is_active: true
          });
          done();
        });
    });
  });
});
