const { SUBSCRIPTIONS_TABLE } = require("../nuxt.config").privateRuntimeConfig;

/**
 *
 * Add coupon_id to each subscription if it exists
 */
exports.up = function(knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
        table.jsonb("addons_stripe_price_ids");
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
        table.dropColumn("addons_stripe_price_ids");
      });
    }
  });
};
