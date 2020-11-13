const { PICKUPS_TABLE, ADDONS_TABLE } = require("../nuxt.config").privateRuntimeConfig;

/**
 *
 * Add column to use system in either test mode or live mode
 */
exports.up = function(knex) {
  Promise.all([
    knex.schema.hasTable(PICKUPS_TABLE).then(exists => {
      if (exists) {
        return knex.schema.table(PICKUPS_TABLE, table => {
          table
            .integer("ui_order")
            .unsigned()
            .notNullable()
            .defaultTo(0);
        });
      }
    }),

    
    knex.schema.hasTable(ADDONS_TABLE).then(exists => {
      if (exists) {
        return knex.schema.table(ADDONS_TABLE, table => {
          table
            .integer("ui_order")
            .unsigned()
            .notNullable()
            .defaultTo(0);
        });
      }
    })
  ])
};

exports.down = function(knex) {
  Promise.all([
    knex.schema.hasTable(PICKUPS_TABLE).then(exists => {
      if (exists) {
        return knex.schema.table(PICKUPS_TABLE, table => {
          table.dropColumn("ui_order");
        });
      }
    }),

    knex.schema.hasTable(ADDONS_TABLE).then(exists => {
      if (exists) {
        return knex.schema.table(ADDONS_TABLE, table => {
          table.dropColumn("ui_order");
        });
      }
    })
  ])
};
