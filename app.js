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

app.listen(8080, "127.0.0.1");
