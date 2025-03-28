var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);
var crypto = require("crypto");

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(__dirname + "/test.db")

db.serialize(() => {
  db.run(`
          CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          age INTEGER NOT NULL,
          email TEXT NOT NULL,
          major TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `, (err) => {if (err) {console.error('Error creating table User.')}}); 

    db.run(`
        CREATE TABLE IF NOT EXISTS Hobby (
        user_id INTEGER NOT NULL,
        hobby TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(id)
        );
    `, (err) => { if (err) { console.error('Error creating table Hobby.' + err) } }); 
    
    db.run(`
        CREATE TABLE IF NOT EXISTS Course (
        name TEXT NOT NULL,
        professor TEXT NOT NULL,
        description TEXT NOT NULL
        );
    `, (err) => { if (err) { console.error('Error creating table Course.' + err) } }); 


  db.run(`
          CREATE TABLE IF NOT EXISTS Message (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES User(id)
        );
    `, (err) => {if (err) {console.error('Error creating table Message.')}});

  db.run(`
          CREATE TABLE IF NOT EXISTS DirectMessage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id_sender TEXT NOT NULL,
          user_id_reciever TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id_sender) REFERENCES User(id),
          FOREIGN KEY (user_id_reciever) REFERENCES User(id)
        );
    `, (err) => {if (err) {console.error('Error creating table DirectMessage.')}});

  db.run(`
          CREATE TABLE IF NOT EXISTS Follows (
          user_id TEXT NOT NULL,
          course TEXT NOT NULL, 
          FOREIGN KEY (course) REFERENCES Course(name),
          FOREIGN KEY (user_id) REFERENCES User(id)
        )
    `, (err) => {if (err) {console.error('Error creating table Follows.')}});

  db.run(`
          CREATE TABLE IF NOT EXISTS FriendRequest (
          user_id_sender TEXT NOT NULL,
          user_id_reciever TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id_sender) REFERENCES User(id),
          FOREIGN KEY (user_id_reciever) REFERENCES User(id),
          PRIMARY KEY (user_id_sender, user_id_reciever)
        );
    `, (err) => {if (err) {console.error('Error creating table FriendRequest.')}});


  db.run(`
          CREATE TABLE IF NOT EXISTS Friend (
          user_id_1 TEXT NOT NULL,
          user_id_2 TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id_1) REFERENCES User(id),
          FOREIGN KEY (user_id_2) REFERENCES User(id),
          PRIMARY KEY (user_id_1, user_id_2)
        );
    `, (err) => {if (err) {console.error('Error creating table Friend.')}});
});

function createUser(username, password, first_name, last_name, age, email, major) {
  if(validateInput(username, first_name, last_name, age, email, major)) {
    // SHA512 to prevent easy bruteforcing
    var password = crypto.createHash('sha512').update(password).digest('hex');
    const insertQuery = db.prepare("INSERT INTO User (username, password, first_name, last_name, age, email, major) VALUES (?, ?, ?, ?, ?, ?, ?)");
    insertQuery.run([username, password, first_name, last_name, age, email, major], (err) => {if (err) {console.error("error inserting new user:" + err);}});
    insertQuery.finalize();
  }
  else {
    console.error("Formatting error");
  }
}

function validateInput(username, first_name, last_name, age, email, major) {
  if (!/^[A-Za-z][A-Za-z0-9_]{2,9}$/.test(username)) {
    console.error("Invalid username! It should start with a letter and be 3-10 characters long.");
    return false;
  }
  if (!/^[A-Za-z]+$/.test(first_name)) {
    console.error("Invalid first name! It should only include letters.");
    return false;
  }
  if (!/^[A-Za-z]+$/.test(last_name)) {
    console.error("Invalid first name! It should only include letters.");
    return false;
  }
  if (age < 0 || age > 100) {
    console.error("Invalid age! It should be 0-100");
    return false;
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {   //regex from https://stackoverflow.com/questions/46155/
    console.error("Invalid email!");
    return false;
  };
  if (!/^[A-Za-z\s]+$/.test(major)) {
    console.error("Invalid major!");
    return false;
  }

  return true;
}

function createMessage(user_id, message, callback) {
  // Todo: XSS validation
  const insertQuery = db.prepare("INSERT INTO Message (user_id, message) VALUES (?, ?)");
  insertQuery.run([user_id, message], (err) => {if (err) {return callback(err)}});
  callback(null);
}

function getMessage() {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    db.all("SELECT m.message, u.username FROM Message m JOIN User u ON u.id = m.user_id", (err, rows) => {
      if (err) {
        reject("Error getting messages.");
      } else {
          resolve(rows);
      }
    });
  });
}

function getPotentialFriends(user_id) {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    // Select all users that aren't the original user and courses that follow the same course as the input user.
    db.all(`SELECT ff.user_id, ff.course, u.first_name, u.last_name 
            FROM Follows fu JOIN Follows ff JOIN User u 
            ON fu.user_id = ? AND ff.course = fu.course AND ff.user_id != ? AND ff.user_id = u.id
            ORDER BY ff.course`, [user_id, user_id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getCourses() {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    db.get("SELECT * from Course", (err, row) => {
      if (err) {
        reject("Error getting Course data.");
      } else {
        resolve(row);
      }
    });
  });
}

function getUserdata(user_id) {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    db.get("SELECT * from User WHERE id = ?", [user_id], (err, row) => {
      if (err) {
        reject("Error getting userdata.");
      } else {
        resolve(row);
      }
    });
  });
}

function updateUserdata(user_id, username, password, first_name, last_name, age, email, major, callback) {
  if (!username.match("^[A-Za-z][A-Za-z0-9_]{2,9}$")) { //regex from https://laasyasettyblog.hashnode.dev/validating-username-using-regex
    console.error("Invalid username! It should start with a letter and be 3-10 characters long.");
    return;
  }
  // SHA512 to prevent easy bruteforcing
  var password = crypto.createHash('sha512').update(password).digest('hex');
  const updateQuery = db.prepare(`UPDATE User 
                                  SET username = ?, password = ?, first_name = ?, last_name = ?, age = ?, email = ?, major = ?
                                  WHERE id = ?`);
  updateQuery.run([username, password, first_name, last_name, age, email, major, user_id], (err) => 
    {
      if (err) {
        console.error("error updating user:" + err);
        callback(err);
      }
      else {
        callback(null)
      }
    });

  updateQuery.finalize();
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
  getCourses,
  getUserdata,
  getPotentialFriends,
  authorizeUser,
  getUserdata,
  updateUserdata,
  closeDB
}
