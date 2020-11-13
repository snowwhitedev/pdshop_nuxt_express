/**
 *
 * STORES_SHIPPING_TABLE
 *
 * Adding shipping support
 * - Adding shipping table
 * - Adding store flag if shipping is enabled
 * - Adding shipping id to the subscription table
 *
 * SUBSCRIPTIONS_TABLE
 * - add shipping_id
 */

const { STORES_SHIPPING_TABLE,
  SUBSCRIPTIONS_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  Promise.all([
    knex.schema.hasTable(STORES_SHIPPING_TABLE).then((exists) => {
      if (!exists) {
        return knex.schema.createTable(STORES_SHIPPING_TABLE, (table) => {
          table.increments('store_shipping_id').primary();
          table.integer('store_id');

          // List of products - by default have all products
          // if empty use it for all products
          table.specificType('product_ids', 'INT[]');
          table.text('description');
          table.integer('price').comment('price is in usd and it is fixed');
          table.boolean('is_active').defaultTo(true);

          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());

          table.index('store_id');
        });
      }
    }),
    knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
      if (exists) {
        return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
          // Add store_shipping_id and stripe_price_id for shipping to the subscription table
          table.integer('store_shipping_id');
          table.string('shipping_stripe_price_id')
        });
      }
    })
  ]);
};

exports.down = function (knex) {
  return knex.schema.dropTable(STORES_SHIPPING_TABLE);
};
