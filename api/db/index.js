const { Pool } = require('pg');
const { PG_URL } = require('../../nuxt.config').privateRuntimeConfig;
const pool = new Pool({
  connectionString: PG_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000, // 10 seconds
  max: 20
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

exports.runQuery = async (query) => {
  // Get a pool connection
  const client = await pool.connect();
  let results;
  try {
    results = await client.query(query);
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    client.release();
  }
  return results;
};
