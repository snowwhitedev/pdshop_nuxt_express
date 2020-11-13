const { STORES_TABLE } = require("../nuxt.config").privateRuntimeConfig;


/**
 *
 * Adding subscription_fee to each store
 */
exports.up = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.integer('subscription_fee').defaultTo(1);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.dropColumn('subscription_fee');
      });
    }
  });
};
