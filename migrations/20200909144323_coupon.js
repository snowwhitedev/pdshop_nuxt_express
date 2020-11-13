const { COUPONS_TABLE } = require('../nuxt.config').privateRuntimeConfig
exports.up = function(knex) {
  return knex.schema.hasTable(COUPONS_TABLE).then((exists) => {
    if (!exists) {
      return knex.schema.createTable(COUPONS_TABLE, (table) => {
        table.increments('coupon_id').primary();
        table.string('code').unique();
        table.string('name').unique();

        // if true, amount must be < 100, if false, amount must be <= product price
        table.boolean('isPercent');
        table.float('amount');

        // time when coupon becomes invalid
        table.timestamp('expires');
        table.boolean('is_active').defaultTo(true);

        // table.integer('product_id');
        table.integer('store_id');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index('store_id');
      })
    }
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable(COUPONS_TABLE);
};
