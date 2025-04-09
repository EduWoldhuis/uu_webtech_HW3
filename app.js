//The main server file
// For the authorization we will use JWT.
// Encryption for password will be SHA512
var http = require('http');
var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var path = require("path");
var fileUpload = require("express-fileupload");

var db = require("./database");
const { userInfo } = require('os');

const app = express();

const date = new Date().toLocaleDateString("nl-NL");
const logStream = fs.createWriteStream(path.join(__dirname, "logs", date), { flags: 'a' });

app.use(
    bodyParser.urlencoded({extended: true}),
    express.static(__dirname + '/public'),
    fileUpload(),
    cookieParser(),
    morgan('combined', {stream: logStream})
);

app.get("/group31/", function (req, res) {
    res.sendFile(__dirname + "/register.html");
});

app.get("/group31/getUsername", function (req, res){
  const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
  let uid = decoded.id;
    db.getUsername(uid).then((username) => {
        res.send(username)
    }).catch((error) => {
        console.error(error);
    });
});

app.get("/group31/home", function (req, res) {
    res.sendFile(__dirname + "/home.html");
})

app.get("/group31/login", function (req, res) {
    res.sendFile(__dirname + "/login.html");
})

//request to change information when user sends a form with changed profile information
app.post("/group31/api/changeInformation", async function (req, res){
    let user_id = req.cookies.id;
    let username = req.body.username;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let age = req.body.age;
    let email = req.body.email;
    let major = req.body.major;
    let hobbies = req.body.hobbies;
    let courses;
    if (req.body.courses == "") {
      courses = [];
    } else {
        courses = req.body.courses.split(",");
    }
    console.log("COURSES: " + courses);

    const updateUserDataDone = db.updateUserData(user_id, username, first_name, last_name, age, email, major, courses, hobbies, console.log);
    if (updateUserDataDone !== true) {
        res.status(405);
    } else {
  
    }

    res.redirect("/group31/home")
})

app.post("/group31/api/register",
  function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let major = req.body.major;
    let email = req.body.email;
    let age = req.body.age;
    let hobbies = req.body.hobbies;
    let image = req.files.user_image


    db.createUser(username, password, first_name, last_name, major, email, hobbies, age, image, (err) => {
      if (err) {
        console.log(err);
        res.send("Failed to create user: " + err);
      } else {
          res.redirect("/group31/login");
      }
    }); 
  }
);

app.post("/group31/api/message",
    function (req, res) {
        let message = req.body.message;
        let otherUsername = req.body.otherUsername;
        try {
            //verify user
            const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
            let uid = decoded.id;

            //Wait until the promise is returned of getUserId, than create a message and send a response arrordingly
            db.getUserId(otherUsername).then(otherUser =>
                db.createMessage(uid, otherUser[0].id, message, (err) => {
                    if (err) {
                        console.error("Error inserting:", err.message);
                        res.status(500).send("Failed to create message: " + err.message);
                    } else {
                        res.status(200).send("Message created successfully: " + message);
                    }
                })
            ).catch((error) => {
                console.log(error);
            });
    } catch (error) {
      res.status(401).send("Unauthorized.");      
    }
  }
);

app.get("/group31/",function (req, res) {
  res.sendFile(__dirname + "/register.html");
});


app.get("/group31/api/message",
    function (req, res) {
  // We have to use promises because sqlite3 is built asyncronously.
        const since = parseInt(req.query.since) || 0;
        const otherUsername = req.query.otherUsername;
        try {
            // Check for authorization
            const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
            db.getUserId(otherUsername).then(otherUser => {
                if (otherUser.length == 0) {;
                    console.log("no friend selected");
                }
                db.getMessage(since, req.cookies.id, otherUser).then((messages) => {
                    res.send(messages)
                }).catch((error) => {
                    console.error(error);
                    res.status(500);
                })
            }
            ).catch((error) => {
                console.log(error);
                res.status(500);
            });
        } catch (error) {
            res.status(401).send("Unauthorized.");
        }
    }
);

app.post("/group31/api/login",
  function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    db.authorizeUser(username, password, (err) => {
      if (err) {
        res.status(500).send("Failed to authorize: " + err.message);
      } else {
        console.log("authorization successful.")
      }
    }).then((user) => {
    console.log(user);
    if (user.length == 0) {
        res.redirect('/group31/login');
      return;
    }
    const token = jwt.sign({id: user[0].id}, 'secretKeyWebtech', {expiresIn: '1h',});
    res.cookie('authorization', token);
    res.cookie('id', user[0].id);
    res.redirect('/group31/home') 
    }).catch((error) => {console.error("Auth error:" + error); res.status(500).send(error)} );
  }
);

app.get("/group31/api/userdata",
  function (req, res) {
    // We have to use promises because sqlite3 is built asyncronously.
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      db.getUserdata(decoded.id).then((userdata) => {
        res.send(userdata)
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      res.status(401).send(error);
    }
  }
);

app.get("/group31/courses", function (req, res) {
    db.getCourses().then(courses => {
        res.send(courses)
    }).catch(error => {
        console.log(error);
    });
});

app.get("/group31/profile",
    function (req, res) {
        try {
          const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
          res.sendFile(__dirname + "/profile.html");
        } catch (error) {
          res.status(401).send("Unauthorized");
        }
    }
);

app.get("/group31/courses",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.sendFile(__dirname + "/courses.html");
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
  }
);

app.get("/group31/api/potentialFriends",
  function (req, res) {
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      db.getPotentialFriends(decoded.id).then((potentialFriends) => {
        res.status(200).send(potentialFriends);
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      res.status(401).send(error);
    }
  }
);

app.get("/group31/api/friendRequests",
  function (req, res) {
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      db.getFriendRequests(decoded.id).then((friendRequests) => {
        res.status(200).send(friendRequests);
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      res.status(401).send(error);
    }
  }
);

app.get("/group31/api/outgoingFriendRequests",
  function (req, res) {
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      db.getOutgoingFriendRequests(decoded.id).then((friendRequests) => {
        res.status(200).send(friendRequests);
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      res.status(401).send(error);
    }
  }
);

app.get("/group31/api/allFriends", function (req, res) {
    db.getAllFriendData(req.cookies.id).then((friends) => { res.send(friends) }).catch((error) => console.log(error));
});

app.get("/group31/api/majors",
  function (req, res) {
      db.getMajors().then((majors) => {
        res.send(majors)
      }).catch((error) => {
        console.error(error);
      });
  }
);

app.get("/group31/api/courses",
  function (req, res) {
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      db.getCourses().then((courses) => {
        res.send(courses)
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      res.status(401).send("Unauthorized.");
    }
  }
);

//Get all the courses that the user had followed
app.get("/group31/api/follows",
  function (req, res) {
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');

      if (req.query.id) {
        uid = req.query.id;
      } else {
        uid = decoded.id;
      }
      db.getUserCourses(uid).then((courses) => {
        res.send(courses)
      }).catch((error) => {
        console.error(error);
      });
    } catch (error) {
      res.status(401).send("Unauthorized.");
    }
  }
);

app.post("/group31/profile",
  function (req, res) {

    let username = req.body.username;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let age = req.body.age;
    let email = req.body.email;
    let major = req.body.major;
    let hobbies = req.body.hobbies;
    let courses = req.body.courses;
    // cooked
    if (!Array.isArray(courses)) {
        courses = courses ? [courses] : [];
    }

    // We have to use promises because sqlite3 is built asyncronously.
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');

      db.updateUserdata(decoded.id, username, first_name, last_name, age, email, major, courses, hobbies, (err) => {
        if (err) {
          console.error("Error inserting:", err);
          res.status(500).send("Failed to update: " + err.message);
        } else {
          res.status(200).send("Updated successfully.");
        }
      });
    } catch (error) {
      res.status(401).send(error);
    }
  }
);

app.get("/group31/api/test",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.status(200).send({string: decoded.id})
    } catch (error) {
      res.status(401).send(error);
    }
  }
)

app.get("/group31/chat",
    function (req, res) {
        try {
            // Check for authorization
            const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
            
            res.sendFile(__dirname + "/chat.html")
        }
        catch (error) {
            res.status(401).send("Unauthorized.");
        }
    }
);

app.post("/group31/api/createFriendRequest",
  function (req, res) {
    const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
    let user_id_reciever = parseInt(req.query.friendid);
    let user_id_sender = decoded.id;

    db.createFriendRequest(user_id_sender, user_id_reciever, (err) => {
      if (err) {
        console.log(err);
        res.send("Failed to create friend request: " + err);
      } else {
        res.status(200).send("Friend request created successfully")
      }
    }); 
  }
);

app.post("/group31/api/acceptFriendRequest",
  function (req, res) {
    const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
    let user_id_reciever = parseInt(req.query.friendid);
    let user_id_sender = decoded.id;
    db.createNewFriend(user_id_sender, user_id_reciever, (err) => {
      if (err) {
        console.log(err);
        res.send("Failed to create friend: " + err);
      } else {
        res.status(200).send("Friend created successfully")
      }
    }); 
  }
);

app.listen(8080, "127.0.0.1");
