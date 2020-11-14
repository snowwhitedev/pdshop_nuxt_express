/**
 *
 * This migration will create a `days_of_week` column and drop 'day_of_week', 'start_time', 'end_time' column
 * the `steps` column is a JSONB column
 * [
 *  {
 *    day_of_week: String //['monday', 'tuesday'...],
 *    start_time: String, //HH:mm
 *    end_time: String,  //
 *  }
 * ]
 */

const { PICKUPS_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function(knex) {
  return knex.schema.hasTable(PICKUPS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(PICKUPS_TABLE, table => {
        table.jsonb('days_of_week');
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(PICKUPS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(PICKUPS_TABLE, table => {
        table.dropColumns(['day_of_week', 'start_time', 'end_time']);
      });
    }
  });
};
