const { Pool } = require("pg");
const dotenv = require("dotenv");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});
module.exports = pool;
