var http = require('http');
var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var sqlite3 = require('sqlite3').verbose();

var db = require("./database");

const app = express();

app.use(
  bodyParser.urlencoded({extended: true})
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

app.listen(8080, "127.0.0.1");
