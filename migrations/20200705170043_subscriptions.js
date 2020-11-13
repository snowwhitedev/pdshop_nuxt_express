/**
 *
 * SUBSCRIPTIONS_TABLE => per_subscriptions
 */

const { SUBSCRIPTIONS_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(SUBSCRIPTIONS_TABLE, (table) => {
        table.increments('subscription_id').primary();
        table.integer('store_id');
        table.integer('user_id');
        table.integer('product_id');
        table.integer('pickup_id');
        // List of addons
        table.specificType('addons_ids', 'INT[]');
        table.enu('frequency', ['week', 'month', 'year']);
        table.float('price');
        table.jsonb('stipe');

        table.boolean('is_active').defaultTo(true);
        // Only after the transaction is complete it will be true
        table.boolean('is_complete').defaultTo(false);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index('store_id', 'product_id');
        table.index('user_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(PICKUPS_TABLE);
};
