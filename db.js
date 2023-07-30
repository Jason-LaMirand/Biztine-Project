/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI;

DB_URI = "postgresql:///biztime";

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;