/**
 *
 * PRODUCTS
 */

const { ADDONS_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(ADDONS_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(ADDONS_TABLE, (table) => {
        table.increments('addons_id').primary();
        table.integer('store_id');
        table.string('name');
        table.string('title');
        table.text('description');

        table.boolean('is_active').defaultTo(true);
        table.float('price');
        // List of products that the addons is compatible with
        table.specificType('product_ids', 'INT[]');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index('store_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(ADDONS_TABLE);
};
