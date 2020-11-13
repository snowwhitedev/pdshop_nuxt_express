// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.PG_URL || 'postgres://postgres:pass123@localhost:5432/perdiem',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.PG_URL || process.env.POSTGRESQL_URL || 'postgres://postgres:pass123@localhost:5432/perdiem',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
