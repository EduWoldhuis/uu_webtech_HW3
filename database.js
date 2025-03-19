var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./test.db")

db.serialize(() => {
  db.run(`
          CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `, (err) => {if (err) {console.error('Error creating table User.')}});

});

function createUser(username, password) {
  const insertQuery = db.prepare("INSERT INTO User (username, password) VALUES (?, ?)");
  insertQuery.run([username, password], (err) => {if (err) {console.error("error inserting");}});
  insertQuery.finalize();
}

function closeDB() {
  db.close();
}

module.exports = {
  createUser,
  closeDB
}
