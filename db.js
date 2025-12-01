const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12810047",
  password: "9i16yc4kXX",
  database: "sql12810047"
});

module.exports = pool;
