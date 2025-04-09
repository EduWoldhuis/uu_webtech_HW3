GroupId: 31
Authors: Boaz Roskam (7262329), Edu Woldhuis (), Rein Spaan ()
Link: http://webtech.science.uu.nl/group31/

Explenation: 
We created a website to meet new students online! You first need to register and fill out all your information, like name, email, major and a profile picture. Than you can log in. On the home page you can add new friends that followed the courses as you did. You can also view the profiles of your friends or send them a chat message. If you take on more courses you can add them on the profile menu or change anything you want. Check out our website now!

Files structure:
Register.html: register page
Login.html: login page
Home.html: home page, within are buttons to toggle all menu's, so everything is on this page

test.db: database file where all data gets stored

app.js: main server file where the server runs and the requests are handled
database.js: file that contains all functions related to the database

public/
navigation.js: file that contains all functions related to the navigation bar that manages the menu's
chat.js: file that contains all functions related to the chat
friendsMenu.js: file that contains all functions related to the friends menu
potentialFriendsMenu: file that contains all functions related to the users you can add that followed the same courses
profile.js:  file that contains all functions related to the viewing and changing your profile information

css/
home.css: file that contains all css code for the home page
login.css: file that contains all css code for the login page
register.css: file that contains all css code for the register page


SQL database definitions:
          
CREATE TABLE IF NOT EXISTS User(
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
       
CREATE TABLE IF NOT EXISTS Hobby(
user_id INTEGER NOT NULL,
hobby TEXT NOT NULL,
FOREIGN KEY(user_id) REFERENCES User(id)
    
CREATE TABLE IF NOT EXISTS Course(
name TEXT NOT NULL PRIMARY KEY,
professor TEXT NOT NULL,
description TEXT NOT NULL
  
CREATE TABLE IF NOT EXISTS Major(
name TEXT NOT NULL PRIMARY KEY,
description TEXT NOT NULL
     
CREATE TABLE IF NOT EXISTS Message(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id_1 TEXT NOT NULL,
user_id_2 TEXT NOT NULL,
message TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(user_id_1) REFERENCES User(id),
FOREIGN KEY(user_id_2) REFERENCES User(id)
      
CREATE TABLE IF NOT EXISTS Follows(
user_id TEXT NOT NULL,
course TEXT NOT NULL,
FOREIGN KEY(course) REFERENCES Course(name),
FOREIGN KEY(user_id) REFERENCES User(id)

CREATE TABLE IF NOT EXISTS FriendRequest(
user_id_sender TEXT NOT NULL,
user_id_reciever TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(user_id_sender) REFERENCES User(id),
FOREIGN KEY(user_id_reciever) REFERENCES User(id),
PRIMARY KEY(user_id_sender, user_id_reciever)

CREATE TABLE IF NOT EXISTS Friend(
user_id_1 TEXT NOT NULL,
user_id_2 TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(user_id_1) REFERENCES User(id),
FOREIGN KEY(user_id_2) REFERENCES User(id),
PRIMARY KEY(user_id_1, user_id_2)