// For the authorization we will use JWT.
// Encryption for password will be SHA512
var http = require('http');
var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");

var db = require("./database");

const app = express();

app.use(
  bodyParser.urlencoded({extended: true}),
  express.static(__dirname + '/public'),
  cookieParser()
);

app.get("/",function (req, res) {
  res.sendFile(__dirname + "/register.html");
});

app.get("/home", function (req, res) {
    res.sendFile(__dirname + "/home.html");
})

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/login.html");
})


app.post("/api/register",
  function (req, res) {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let major = req.body.major;
    let email = req.body.email;
    let age = req.body.age;


    console.log(username, password, first_name, last_name, major, email, age);
    db.createUser(username, password, first_name, last_name, major, email, age, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Failed to create user: " + err);
      } else {
          res.redirect("/login");
      }
    }); 
  }
);

app.post("/api/message",
  function (req, res) {
    let message = req.body.message;
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
        let uid = decoded.id;

      db.createMessage(uid, message, (err) => {
        if (err) {
          console.error("Error inserting:", err.message);
          res.status(500).send("Failed to create message: " + err.message);
        } else {
          res.status(200).send("Message created successfully: " + message);
        }
      });
    } catch (error) {
      res.status(401).send("Unauthorized.");      
    }

  }
);

app.get("/",function (req, res) {
  res.sendFile(__dirname + "/register.html");
});


app.get("/api/message",
  function (req, res) {
  // We have to use promises because sqlite3 is built asyncronously.
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      db.getMessage().then((messages) => {
        res.send(messages)
        }).catch((error) => {
          console.error(error);
      });
    } catch (error) {
      res.status(401).send("Unauthorized.");
    }
  }
);

app.post("/api/login",
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
    console.log("Users found:");
    console.log(user);
    if (user.length == 0) {
      res.redirect('/login');
      return;
    }
    console.log("uid:" + user[0].id);
    const token = jwt.sign({id: user[0].id}, 'secretKeyWebtech', {expiresIn: '1h',});
    res.cookie('authorization', token);
    res.cookie('username', username);
    res.redirect('/home') 
    }).catch((error) => {console.error("Auth error:" + error); res.status(500).send(error)} );
  }
);

app.get("/api/userdata",
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

app.get("/profile",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.sendFile(__dirname + "/profile.html");
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
  }
);

app.get("/courses",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.sendFile(__dirname + "/courses.html");
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
  }
);

app.get("/api/potentialFriends",
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

app.get("/api/courses",
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

app.post("/profile",
  function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let age = req.body.age;
    let email = req.body.email;
    let major = req.body.major;
    // We have to use promises because sqlite3 is built asyncronously.
    try {
      // Check for authorization
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      db.updateUserdata(decoded.id, username, password, first_name, last_name, age, email, major, (err) => {
        if (err) {
          console.error("Error inserting:", err.message);
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

app.get("/api/courses",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.status(200).send()
    } catch (error) {
      res.status(401).send(error);
    }
  }
)
app.get("/api/test",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.status(200).send({string: decoded.id})
    } catch (error) {
      res.status(401).send(error);
    }
  }
)

app.get("/chat",
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

app.listen(8080, "127.0.0.1");
