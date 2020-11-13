/**
 *
 * PICKUPS_TABLE
 */

const { PICKUPS_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(PICKUPS_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(PICKUPS_TABLE, (table) => {
        table.increments('pickup_id').primary();
        table.integer('store_id');
        // List of products
        table.specificType('product_ids', 'INT[]');

        table.string('name');
        table.string('title');
        table.text('description');
        table.enu('day_of_week', [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday']);
        table.string('start_time'); // HH:MM
        table.string('end_time'); // HH:MM
        /**
         * {
         *  country: 'US'
         *  state: 'XX'
         *  city: 'XXX
         *  address: '123 XXX'
         *  zip: 'XXXXX'
         * }
        **/
        table.jsonb('location');

        table.boolean('is_active').defaultTo(true);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index('store_id');
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(PICKUPS_TABLE);
};
