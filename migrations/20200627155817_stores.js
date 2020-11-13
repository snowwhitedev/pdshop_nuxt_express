/**
 *
 * STORES_TABLE
 */

const { STORES_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(STORES_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(STORES_TABLE, (table) => {
        table.increments('store_id').primary();
        table.string('name', 256).unique();
        table.string('email', 256).unique();
        table.string('slug', 256).unique();
        table.enu('business_type', ['non-profit', 'corporation', 'individual']);

        table.string('phone', 256);
        table.string('website', 256);

        // theme
        table.text('logo');
        table.string('title');
        table.string('sub_title');
        table.text('description');
        table.string('primary_color');
        table.string('secondary_color');

        // Activation will be via an email
        table.boolean('active').defaultTo(false);
        table.timestamp('activated_at');

        // Stripe user id -> connect standard
        // https://stripe.com/docs/connect/standard-accounts
        table.string('stripe_user_id');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        // indexes
        table.index('slug');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(STORES_TABLE);
};
