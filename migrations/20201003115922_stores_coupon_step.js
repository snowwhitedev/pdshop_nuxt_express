const { STORES_TABLE } = require("../nuxt.config").privateRuntimeConfig;

/**
 *
 * Add column to control availability of coupon feature
 */
exports.up = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.boolean("coupons_enabled").defaultTo(false);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.dropColumn("coupons_enabled");
      });
    }
  });
};
