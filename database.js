var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var crypto = require("crypto");

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


  db.run(`
          CREATE TABLE IF NOT EXISTS Friend (
          username1 TEXT NOT NULL,
          username2 TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (username1, username2)
        );
    `, (err) => {if (err) {console.og(error);}});
});

function createUser(username, password) {
  // Rein todo: username validation
  // SHA512 to prevent easy bruteforcing
  var password = crypto.createHash('sha512').update(password).digest('hex');
  const insertQuery = db.prepare("INSERT INTO User (username, password) VALUES (?, ?)");
  insertQuery.run([username, password], (err) => {if (err) {console.error("error inserting new user:" + err);}});
  insertQuery.finalize();
}

function createMessage(username, message) {
  // Todo: XSS validation
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

function authorizeUser(username, password) {
  // promises will handle the async stuff
  var password = crypto.createHash('sha512').update(password).digest('hex');
  console.log("username:" + username + "Password:" + password)
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM User WHERE username = ? AND password = ?", [username, password], (err, rows) => {
      if (err) {
        reject("Error getting user.");
      } else {
        resolve(rows);
      }
    })
  });
}

function closeDB() {
  db.close();
}



module.exports = {
  createUser,
  createMessage,
  getMessage,
  authorizeUser,
  closeDB
}
