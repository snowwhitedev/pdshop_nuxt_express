/**
 *
 *  Orders -> per_orders
 *
 * A subscription can have 1-many orders
 * A store sell subscription to user.
 * Subscription have one store, one user, one product and many orders.
 *
 */

const { ORDERS_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(ORDERS_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(ORDERS_TABLE, (table) => {
        table.increments('order_id').primary();
        table.integer('subscription_id');
        // adding pickup_id in case the user would like to change
        // a specific order to a different pickup location
        table.integer('pickup_id').defaultTo(-1);

        table.boolean('paid');
        table.float('price');

        table.enu('fulfillment_option', ['pickup', 'shipping']);
        table.boolean('fulfilled').defaultTo(false);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        // indexes
        table.index('subscription_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(ORDERS_TABLE);
};
