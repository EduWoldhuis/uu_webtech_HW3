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
    let username = req.body.username;
    let password = req.body.password;
    //res.send("received:" + username + password);

    db.createUser(username, password, (err) => {
      if (err) {
        console.error("Error inserting:", err.message);
        res.status(500).send("Failed to create user: " + err.message);
      } else {
        res.send("User created successfully: " + username);
      }
    });
    res.redirect("/login");
  }
);

app.post("/api/message",
  function (req, res) {
    let message = req.body.message;
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      let username = decoded.username;

      db.createMessage(username, message, (err) => {
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
    if (!user) {
      res.status(401).send("Authentication failed. no user with that name.");
      return;
    }
    console.log("username:" + user[0].username);
    const token = jwt.sign({username: user[0].username}, 'secretKeyWebtech', {expiresIn: '1h',});
    res.cookie('authorization', token)
    res.redirect('/home')
    //res.status(200).json({token})
    
    }).catch((error) => {console.error("Auth error:" + error); res.status(500).send(error)} );
  }
);

app.get("/api/test",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.status(200).send(decoded.username)
    } catch (error) {
      res.status(401).send("Unauthorized.");
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
)

app.listen(8080, "127.0.0.1");
