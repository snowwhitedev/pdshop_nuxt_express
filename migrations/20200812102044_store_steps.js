const { STORES_TABLE } = require("../nuxt.config").privateRuntimeConfig;


/**
 *
 * This migration will create a `steps` column
 * the `steps` column is a JSONB column
 * [
 *  {
 *    type: String [products, addons, pickup, shipping, checkout],
 *    icon: String,
 *    icon_title: String,
 *    active: true,
 *    title: String,
 *    sub_title: String
 *  }
 * ]
 */
exports.up = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        // based on the category we know which photos to show
        table.string('category');
        table.jsonb('steps').defaultTo(JSON.stringify([
            {
              type: 'products',
              order: 1,
              icon: 'shopping-bag',
              icon_title: 'Share Size',
              active: true,
              title: 'Select a Share',
              sub_title: 'Change your share any time.'
            },
            {
              type: 'addons',
              order: 2,
              icon: 'cart-plus',
              icon_title: 'Addons',
              active: false,
              title: 'Addons',
              sub_title: 'Select the addons available for your product.'
            },
            {
              type: 'pickup',
              order: 3,
              icon: 'map-marker-alt',
              icon_title: 'Pickups',
              active: true,
              title: 'Location and Time',
              sub_title: 'Change your pickup spot and time throughout the season.'
            },
            {
              type: 'shipping',
              order: 4,
              icon: 'map-marker-alt',
              icon_title: 'Shipping',
              active: false,
              title: 'Shipping',
              sub_title: 'No need to pick it up we can send it to you'
            },
            {
              type: 'checkout',
              order: 5,
              icon: 'cash-register',
              icon_title: 'Checkout',
              active: true,
              title: 'Checkout',
              sub_title: 'Thanks for letting us take care of you.'
            }
          ]))
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(STORES_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, table => {
        table.dropColumn('steps');
      });
    }
  });
};
