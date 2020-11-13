const { STORES_TABLE } = require("../nuxt.config").privateRuntimeConfig;


/**
 *
 * Adding background_image
 */
exports.up = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.string('background_image').defaultTo(null);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.dropColumn('background_image');
      });
    }
  });
};
