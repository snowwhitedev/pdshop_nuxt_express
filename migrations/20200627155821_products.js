/**
 *
 * PRODUCTS
 */

const { PRODUCTS_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(PRODUCTS_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(PRODUCTS_TABLE, (table) => {
        table.increments('product_id').primary();
        table.string('stripe_product_id');
        table.integer('store_id');

        table.string('name');
        table.string('title');
        table.text('description');

        table.boolean('is_active').defaultTo(true);

        /**
                 *  [{
                 *      price_id: Number,
                 *      interval: 'weekly/monthly/yearly',
                 *      price: Number
                 *  }]
                 */
        table.jsonb('prices');

        // shipping / pickup
        table.enu('frequency', ['week', 'month', 'year']);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index('store_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(PRODUCTS_TABLE);
};
