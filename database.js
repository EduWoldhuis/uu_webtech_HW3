//All function that send or retreive data from the database
var fs = require("fs");
var path = require("path");
var file = "test.db";
var exists = fs.existsSync(file);
var crypto = require("crypto");
const { rejects } = require("assert");

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
          hobbies TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `, (err) => {if (err) {console.error('Error creating table User.')}});  

  db.run(`
          CREATE TABLE IF NOT EXISTS Course (
          name TEXT NOT NULL PRIMARY KEY,
          professor TEXT NOT NULL,
          description TEXT NOT NULL
      );
  `, (err) => { if (err) { console.error('Error creating table Course.' + err) } }); 

  db.run(`
          CREATE TABLE IF NOT EXISTS Major (
          name TEXT NOT NULL PRIMARY KEY,
          description TEXT NOT NULL
      );
  `, (err) => { if (err) { console.error('Error creating table Major.' + err) } }); 

  db.run(`
          CREATE TABLE IF NOT EXISTS Message (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id_1 TEXT NOT NULL,
          user_id_2 TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id_1) REFERENCES User(id),
          FOREIGN KEY (user_id_2) REFERENCES User(id)
        );
    `, (err) => {if (err) {console.error('Error creating table Message.' + err)}});

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

//register new user
function createUser(username, password, first_name, last_name, major, email, hobbies, age, image, callback) {
    //validate input
    validate = validateInput(username, first_name, last_name, major, email, hobbies, age, image)
    if (!(image.name.endsWith(".png") || image.name.endsWith(".jpg"))) {
        return "Invalid image type. We only accept PNG and JPG";
    }
    if (validate === true) {
        // SHA512 to prevent easy bruteforcing
        let error;
        var password = crypto.createHash('sha512').update(password).digest('hex');
        const insertQuery = db.prepare("INSERT INTO User (username, password, first_name, last_name, age, email, hobbies, major) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        insertQuery.run([username, password, first_name, last_name, age, email, hobbies, major], (err) => {
            if (image.name.endsWith(".png")) {
                image.mv(path.join(__dirname, 'public', 'images', 'userimages', `${username}.png`));
            }
            else if (image.name.endsWith(".jpg") || image.name.endsWith(".jpeg")) {
                image.mv(path.join(__dirname, 'public', 'images', 'userimages', `${username}.jpg`));
            }
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
        insertQuery.finalize();
    } else {
        callback(validate);
    }
}

//validate input using regex
function validateInput(username, first_name, last_name, major, email, hobbies, age, image) {
  if (image) {
    if (!(image.name.endsWith(".png") || image.name.endsWith(".jpg") || image.name.endsWith(".jpeg"))) {
      return "Invalid image type. We only accept PNG and JPG/JPEG.";
    }
  }
  if (!/^[A-Za-z][A-Za-z0-9_]{2,9}$/.test(username)) {
    return "Invalid username! It should start with a letter and be 3-10 characters long.";
  }
  if (!/^[A-Za-z, ]+$/.test(hobbies)) {
    console.log("hobbies: " + hobbies);
    return "Invalid hobbies. Only letters and ,";
  }
  if (!/^[A-Za-z]+$/.test(first_name)) {
    return "Invalid first name! It should only include letters.";
  }
  if (!/^[A-Za-z]+$/.test(last_name)) {
    return "Invalid first name! It should only include letters.";
  }
  if (!/^[A-Za-z\s]+$/.test(major)) {
    return "Invalid major!";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {   //regex from https://stackoverflow.com/questions/46155/
    return "Invalid email!";
  };
  if (age < 0 || age > 100) {
    return "Invalid age! It should be 0-100";
  };

  return true;
}

function createMessage(currentUserId, otherUserId, message, callback) {
  // Todo: XSS validation
    //console.log(currentUserId, otherUserId, "id" + otherUserId.id);
  const insertQuery = db.prepare("INSERT INTO Message (user_id_1, user_id_2, message) VALUES (?, ?, ?)");
  insertQuery.run([currentUserId, otherUserId, message], (err) => {if (err) {return callback(err)}});
  callback(null);
}

function getMessage(since, currentUserId, otherUserId) {
  // promises will handle the async stuff
    let otherUserID = otherUserId[0].id;
    return new Promise((resolve, reject) => {
    const query = `SELECT m.id, m.message, u.username 
                   FROM Message m 
                   JOIN User u ON u.id = m.user_id_1
                   WHERE (m.id > ?)
                   AND (m.user_id_1 = ?
                   AND m.user_id_2 = ? 
                   OR m.user_id_1 = ?
                   AND m.user_id_2 = ?)`
    db.all(query, [since, currentUserId, otherUserID, otherUserID, currentUserId], (err, rows) => {
      if (err) {
        reject("Error getting messages." + err);
      } else {
          resolve(rows);
      }
    });
  });
}

//Get all data from all friends
function getAllFriendData(user_id) {
  return new Promise((resolve, reject) => {
      db.all(`SELECT *
              FROM User
              WHERE User.id
              IN (  SELECT Friend.user_id_1
                    FROM Friend
                    WHERE Friend.user_id_2 = ?
                  UNION
                    SELECT Friend.user_id_2
                    FROM Friend
                    WHERE Friend.user_id_1 = ?)
              ORDER BY User.id`, [user_id, user_id], (err, rows) => {

            if (err) {
                console.error("Database Error:", err.message);
                reject(err);
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
    db.all(`SELECT DISTINCT u.username, ff.user_id, ff.course, u.first_name, u.last_name 
            FROM Follows fu 
            JOIN Follows ff 
                ON ff.course = fu.course AND ff.user_id != fu.user_id
            JOIN User u 
                ON ff.user_id = u.id
            WHERE fu.user_id = ?
            AND NOT EXISTS (
              SELECT *
              FROM Friend f
              WHERE (f.user_id_1 = fu.user_id AND f.user_id_2 = ff.user_id)
              OR (f.user_id_1 = ff.user_id AND f.user_id_2 = fu.user_id)
            )
            ORDER BY ff.course;
            `, [user_id], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
      }
    });
  });
}

function getMajors() {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    db.all("SELECT * from Major", (err, rows) => {
      if (err) {
        reject("Error getting Majors data.");
      } else {
        resolve(rows);
      }
    });
  });
}

function getCourses() {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    db.all("SELECT * from Course", (err, rows) => {
      if (err) {
        reject("Error getting Course data.");
      } else {
        resolve(rows);
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

function getUserCourses(user_id) {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    db.all("SELECT * from Follows WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) {
        reject("Error getting follow data.");
      } else {
        resolve(rows);
      }
    });
  });
}

//Update the data of an existing usre
function updateUserData(user_id, username, first_name, last_name, age, email, major, courses, hobbies, callback) {
    let inputValidation = validateInput(username, first_name, last_name, major, email, hobbies, age, null)

    if (inputValidation !== true) {
        console.log("validation failed: " + inputValidation);
        return inputValidation;
    }

  // First, delete all the information, then insert it again, for if courses are unfollowed.
  const deleteQuery = db.prepare("DELETE FROM FOLLOWS WHERE user_id = ?");
  deleteQuery.run([user_id], (err) => {
    if (err) {
      console.error("error following course:" + err); 
      callback(err);
    }
  });
  const followsQuery = db.prepare("INSERT INTO FOLLOWS (user_id, course) VALUES (?, ?)");
    courses.forEach(course => {
    if (!course.match("^[A-Za-z][A-Za-z0-9_ ]{3,60}$")) { 
      callback("Invalid course! It should start with a letter and be 4-60 characters long.");
    }
    followsQuery.run([user_id, course], (err) => {
      if (err) {
        console.error("error following course:" + err); 
        callback(err);
      }
    })
    });
  new Promise((resolve, reject) => {db.get("SELECT username from User WHERE id = ?", [user_id], (err, row) => {
      if (err) {
        reject("Error getting userdata");
      } else {
        console.log(`ROW: ${row.username}`)
        if (row.username != username) {
          if (fs.existsSync(`public/images/userimages/${row.username}.png`)) {
            fs.rename(`public/images/userimages/${row.username}.png`, `public/images/userimages/${username}.png`, (err) => { if (err) throw err; });
          }
          else if (fs.existsSync(`public/images/userimages/${row.username}.jpg`)) {
            fs.rename(`public/images/userimages/${row.username}.jpg`, `public/images/userimages/${username}.jpg`, (err) => { if (err) throw err; });
          }
          else {
            console.log("FILE NOT FOUND.")
          }
          
          resolve("changed file.");
        }
      }
  })});

    const updateQuery = db.prepare(`UPDATE User 
                                  SET username = ?, first_name = ?, last_name = ?, age = ?, email = ?, major = ?
                                  WHERE id = ?`);
    updateQuery.run([username, first_name, last_name, age, email, major, user_id], (err) => 
    {
      if (err) {
        console.error("error updating user:" + err);
        callback(err);
      }
    });
    updateQuery.finalize();
    return true;
}

function authorizeUser(username, password) {
  // promises will handle the async stuff
  var password = crypto.createHash('sha512').update(password).digest('hex');
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

function getUsername(user_id) {
    return new Promise((resolve, reject) => {
        db.all("SELECT username FROM User WHERE id = ?", [user_id], (err, rows) => {
            if (err) {
                reject("Error getting username");
            } else {
                resolve(rows);
            }
        })
    });
}

function getUserId(Username) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM User WHERE Username = ?", [Username], (err, rows) => {
            if (err) {
                reject("Error getting username");
            } else {
                resolve(rows);
            }
        })
    });
}

function getFriendRequests(user_id) {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    // Select all users that aren't the original user and courses that follow the same course as the input user.
    db.all(`SELECT user_id_sender 
            FROM FriendRequest
            WHERE user_id_reciever = ?`, [user_id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getOutgoingFriendRequests(user_id) {
  // promises will handle the async stuff
  return new Promise((resolve, reject) => {
    // Select all users that aren't the original user and courses that follow the same course as the input user.
    db.all(`SELECT user_id_reciever 
            FROM FriendRequest
            WHERE user_id_sender = ?`, [user_id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function createFriendRequest(user_id_sender, user_id_reciever, callback) {
  const insertQuery = db.prepare("INSERT INTO FriendRequest (user_id_sender, user_id_reciever) VALUES (?, ?)");
  insertQuery.run([user_id_sender, user_id_reciever], (err) => {
      if (err) {
          callback(err);
      } else {
          callback(null);
      }
  });
  insertQuery.finalize();
}

function createNewFriend(userId1, userId2, callback) {
  let deleting;
  let inserting;
  //Remove friendrequest 
  db.run("DELETE FROM FriendRequest WHERE user_id_sender = ? AND user_id_reciever = ? OR user_id_sender = ? AND user_id_reciever = ?",
  [userId1, userId2, userId2, userId1], (err) => {
      if (err) {
          console.log(err);
          deleting = false;
      } else {
          deleting = true;
      }
  });

  //add new friend
  db.run("INSERT INTO Friend (user_id_1, user_id_2) VALUES (?, ?)", [userId1, userId2], (err) => {
      if (err) {
          console.log(err);
          deleting = false;
      } else {
          deleting = true;
      }
  });

  callback(deleting && inserting);
}


function closeDB() {
  db.close();
}


module.exports = {
    createUser,
    createMessage,
    getMessage,
    getMajors,
    getCourses,
    getUserdata,
    getUserCourses,
    getUsername,
    getPotentialFriends,
    authorizeUser,
    getUserdata,
    updateUserData,
    closeDB,
    getUserId,
    getAllFriendData,
    getFriendRequests,
    createFriendRequest,
    getOutgoingFriendRequests,
    createNewFriend
}