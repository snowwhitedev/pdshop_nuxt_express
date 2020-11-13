/**
 *
 * USERS_TABLE
 */

const {
  USERS_TABLE,
  USERS_TYPES
} = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(USERS_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(USERS_TABLE, (table) => {
        table.increments('user_id').primary();
        table.enu('user_type', Object.values(USERS_TYPES));
        table.string('email', 256).unique();
        table.string('phone', 256);
        table.string('first_name', 256);
        table.string('last_name', 256);

        table.jsonb('billing_address');
        table.jsonb('shipping_address');

        table.string('password').notNullable();

        // Activation will be via an email
        table.boolean('active').defaultTo(false);
        table.timestamp('activated_at');

        // when on boarding a new user we need to call strip API
        // To create a new stripe customer.
        table.string('stripe_customer_id').defaultTo(null);

        // if the user_type === 'merchant'
        table.integer('store_id').defaultTo(null);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(USERS_TABLE);
};
