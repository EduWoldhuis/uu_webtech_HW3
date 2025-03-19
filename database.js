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

  db.run(`
          CREATE TABLE IF NOT EXISTS Message (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `, (err) => {if (err) {console.error('Error creating table Message.')}});

});

function createUser(username, password) {
  const insertQuery = db.prepare("INSERT INTO User (username, password) VALUES (?, ?)");
  insertQuery.run([username, password], (err) => {if (err) {console.error("error inserting");}});
  insertQuery.finalize();
}

function createMessage(username, message) {
  const insertQuery = db.prepare("INSERT INTO Message (username, message) VALUES (?, ?)");
  insertQuery.run([username, message], (err) => {if (err) {console.error("error inserting");}});
  insertQuery.finalize();
}

function getMessage() {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Message", (err, rows) => {
      if (err) {
        reject("Error getting messages.");
      } else {
        resolve(rows);
      }
    });
  });
}
function closeDB() {
  db.close();
}

module.exports = {
  createUser,
  createMessage,
  getMessage,
  closeDB
}
