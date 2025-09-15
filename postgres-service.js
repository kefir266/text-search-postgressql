require('dotenv').config();
const { Pool } = require('pg');
const { getVectorsOr } = require('./lib/getVectorsOr');
const { clearName } = require('./lib/clearName');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
});

async function findOrganization(name) {
  if (!name?.length) {
    return Promise.resolve([]);
  }
  const tsVector = getVectorsOr(name);
  if (!tsVector?.length) {
    return Promise.resolve([]);
  }

  let res;
  try {
    res = await pool.query(
      `
      select name
      from organizations, to_tsquery(unaccent($1)) query
      where organizations.name_vectors_unaccent @@ query
        and ts_rank_cd(organizations.name_vectors_unaccent, query) > 0.3 
        OR organizations.name ILIKE '%' || $2 || '%';
`,
      [tsVector, name],
    );

    return res;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
}

async function addOrganization(name) {
  if (!name?.length) {
    console.error('Empty name');
    return;
  }
  await pool.query(
    `
  insert into organizations (name) values ($1)`,
    [clearName(name)],
  );
}

module.exports = { findOrganization, addOrganization };
