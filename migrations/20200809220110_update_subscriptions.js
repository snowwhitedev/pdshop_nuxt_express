const { SUBSCRIPTIONS_TABLE } = require("../nuxt.config").privateRuntimeConfig;

exports.up = function(knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
        table.dropColumn("price");
        table.string("stripe_price_id");
      });
    }
  });
};

exports.down = function(knex) {
  table.float("price");
  table.dropColumn("stripe_price_id");
};
