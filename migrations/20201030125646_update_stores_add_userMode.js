const { STORES_TABLE } = require("../nuxt.config").privateRuntimeConfig;

/**
 *
 * Add column to use system in either test mode or live mode
 */
exports.up = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.boolean("is_production").defaultTo(false);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.dropColumn("is_production");
      });
    }
  });
};
