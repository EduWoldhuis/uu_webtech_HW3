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
  cookieParser()
);

app.get("/",function (req, res) {
  res.sendFile(__dirname + "/test.html");
});

app.post("/api/register",
  function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    res.send("received:" + username + password);

    db.createUser(username, password, (err) => {
      if (err) {
        console.error("Error inserting:", err.message);
        res.status(500).send("Failed to create user: " + err.message);
      } else {
        res.send("User created successfully: " + username);
      }
    });
  }
);

app.post("/api/message",
  function (req, res) {
    let username = req.body.username;
    let message = req.body.message;
    res.send("received:" + username + message);

    db.createMessage(username, message, (err) => {
      if (err) {
        console.error("Error inserting:", err.message);
        res.status(500).send("Failed to create message: " + err.message);
      } else {
        res.send("Message created successfully: " + message);
      }
    });
  }
);

app.get("/api/message",
  function (req, res) {
  // We have to use promises because sqlite3 is built asyncronously.
  db.getMessage().then((messages) => {
      res.send(messages)
    })
    .catch((error) => {
      console.error(error);
    });
  }
);

app.post("/api/authorize",
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
    //if (!user || (typeof user === 'string' && user === "[]")) {
    //  res.status(401).send("Authentication failed. no user with that name.");
    //  return;
    //}
    console.log("username:" + user[0].username);
    const token = jwt.sign({username: user[0].username}, 'secretKeyWebtech', {expiresIn: '1h',});
    res.cookie('authorization', token)
    res.status(200).json({token})
    
    }).catch((error) => {console.error("Auth error:" + error); res.status(500).send(error)} );
  }
);

app.get("/api/test",
  function (req, res) {
    try {
      const decoded = jwt.verify(req.cookies.authorization, 'secretKeyWebtech');
      res.status(200).send(decoded.username)
    } catch (error) {
      res.status(400).send(error);
    }

    
  }
)


app.listen(8080, "127.0.0.1");
