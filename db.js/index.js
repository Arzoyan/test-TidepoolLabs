const pgp = require("pg-promise")();
const connectionString =
  "postgres://postgres:Admin2020@localhost:5432/universities";

const db = pgp(connectionString);

module.exports = db;
