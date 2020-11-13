const { SUBSCRIPTIONS_TABLE } = require("../nuxt.config").privateRuntimeConfig;

/**
 *
 * Add coupon_id to each subscription if it exists
 */
exports.up = function(knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
        table.integer("coupon_id");
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
        table.dropColumn("coupon_id");
      });
    }
  });
};
