/* modules used */
const mysql = require("mysql");

/* modules used */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs",
});

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected as id " + db.threadId);
  }
});

module.exports = db;
