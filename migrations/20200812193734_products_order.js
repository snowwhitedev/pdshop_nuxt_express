const { PRODUCTS_TABLE } = require("../nuxt.config").privateRuntimeConfig;


/**
 *
 * Order products based on number
 * This will let the merchant the ability
 * to order the products
 */
exports.up = function(knex) {
  return knex.schema.hasTable(PRODUCTS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(PRODUCTS_TABLE, table => {
        table.integer('ui_order').unsigned().notNullable().defaultTo(0);
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(PRODUCTS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(PRODUCTS_TABLE, table => {
        table.dropColumn('ui_order');
      });
    }
  });
};
