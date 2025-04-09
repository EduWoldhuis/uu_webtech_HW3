const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

// Maak de database aan (of open deze)
const db = new sqlite3.Database('test.db');

// Creëer de tabel als deze nog niet bestaat
const createTableQuery = `
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
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Fout bij het aanmaken van de tabel:', err.message);
    } else {
        console.log('Tabel User aangemaakt of al aanwezig.');
    }
});

// Functie om wachtwoord te hashen
function hashPassword(password) {
    return crypto.createHash('sha512').update(password).digest('hex');
}

// Functie om een nieuwe gebruiker toe te voegen
function addUser(username, password, firstName, lastName, age, email, major, hobbies) {
    const hashedPassword = hashPassword(password);

    const insertQuery = `
  INSERT INTO User (username, password, first_name, last_name, age, email, major, hobbies)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

    db.run(insertQuery, [username, hashedPassword, firstName, lastName, age, email, major, hobbies], function (err) {
        if (err) {
            console.error('Fout bij het toevoegen van de gebruiker:', err.message);
        } else {
            console.log(`Gebruiker toegevoegd met id: ${this.lastID}`);
        }
    });
}

// Voeg een testgebruiker toe
addUser('johndoe', 'ww123', 'John', 'Doe', 30, 'johndoe@example.com', 'Informatica', 'lezen, gamen');
addUser('janedoe', 'pw456', 'Jane', 'Doe', 28, 'janedoe@example.com', 'Wiskunde', 'yoga, lezen');
addUser('alice123', 'password789', 'Alice', 'Johnson', 25, 'alice.johnson@example.com', 'Psychologie', 'films, wandelen');
addUser('bob456', 'secret101', 'Bob', 'Smith', 32, 'bob.smith@example.com', 'Informatica', 'voetbal, muziek');
addUser('charlie789', '12345password', 'Charlie', 'Brown', 27, 'charlie.brown@example.com', 'Wiskunde', 'hardlopen, koken');
addUser('david001', 'davidpass', 'David', 'Wilson', 22, 'david.wilson@example.com', 'Psychologie', 'reizen, lezen');
addUser('emily987', 'emilypass', 'Emily', 'Davis', 29, 'emily.davis@example.com', 'Informatica', 'schrijven, lezen');
addUser('frank222', 'frankpassword', 'Frank', 'Moore', 31, 'frank.moore@example.com', 'Wiskunde', 'hiken, films');
addUser('grace333', 'gracepass', 'Grace', 'Taylor', 26, 'grace.taylor@example.com', 'Psychologie', 'wandelen, lezen');
addUser('henry444', 'henrypass', 'Henry', 'Anderson', 33, 'henry.anderson@example.com', 'Informatica', 'fitness, lezen');
addUser('isabel555', 'isabel123', 'Isabel', 'Martinez', 24, 'isabel.martinez@example.com', 'Wiskunde', 'social media, schilderen');
addUser('jack666', 'jack4567', 'Jack', 'Garcia', 27, 'jack.garcia@example.com', 'Psychologie', 'muziek, lezen');
addUser('karen777', 'karenpass123', 'Karen', 'Rodriguez', 35, 'karen.rodriguez@example.com', 'Informatica', 'wandelen, schilderen');
addUser('leo888', 'leopassword', 'Leo', 'Hernandez', 21, 'leo.hernandez@example.com', 'Wiskunde', 'voetbal, lezen');
addUser('maria999', 'mariapassword', 'Maria', 'Lopez', 29, 'maria.lopez@example.com', 'Psychologie', 'schilderen, lezen');
addUser('nathan101', 'nathanpass101', 'Nathan', 'Gonzalez', 26, 'nathan.gonzalez@example.com', 'Informatica', 'gaming, lezen');
addUser('olivia202', 'oliviapass202', 'Olivia', 'Miller', 32, 'olivia.miller@example.com', 'Wiskunde', 'leiden, films');
addUser('peter303', 'peterpassword303', 'Peter', 'Martinez', 34, 'peter.martinez@example.com', 'Psychologie', 'films, wandelen');
addUser('quincy404', 'quincy404pass', 'Quincy', 'Clark', 30, 'quincy.clark@example.com', 'Informatica', 'gaming, lezen');
addUser('rachel505', 'rachelpass505', 'Rachel', 'Lewis', 26, 'rachel.lewis@example.com', 'Wiskunde', 'reizen, lezen');
addUser('steven606', 'stevenpass606', 'Steven', 'Walker', 28, 'steven.walker@example.com', 'Psychologie', 'schrijven, lezen');
addUser('tina707', 'tinapassword707', 'Tina', 'Hall', 29, 'tina.hall@example.com', 'Informatica', 'schrijven, yoga');
addUser('victor808', 'victorpassword808', 'Victor', 'Young', 23, 'victor.young@example.com', 'Wiskunde', 'fitness, lezen');
addUser('wendy909', 'wendypassword909', 'Wendy', 'Allen', 31, 'wendy.allen@example.com', 'Psychologie', 'hiken, koken');
addUser('xander010', 'xanderpassword010', 'Xander', 'Scott', 24, 'xander.scott@example.com', 'Informatica', 'gamen, lezen');
addUser('yasmine111', 'yasminepass111', 'Yasmine', 'King', 32, 'yasmine.king@example.com', 'Wiskunde', 'reizen, lezen');
addUser('zachary122', 'zacharypassword122', 'Zachary', 'Wright', 27, 'zachary.wright@example.com', 'Psychologie', 'hardlopen, gamen');
addUser('adeline133', 'adelinepass133', 'Adeline', 'Green', 28, 'adeline.green@example.com', 'Informatica', 'wandelen, fietsen');
addUser('bradley144', 'bradleypass144', 'Bradley', 'Lopez', 30, 'bradley.lopez@example.com', 'Wiskunde', 'leiden, gamen');
addUser('carla155', 'carlapassword155', 'Carla', 'Perez', 26, 'carla.perez@example.com', 'Psychologie', 'koken, lezen');
addUser('dylan166', 'dylanpassword166', 'Dylan', 'Taylor', 23, 'dylan.taylor@example.com', 'Informatica', 'gaming, reizen');
addUser('ella177', 'ellapassword177', 'Ella', 'Adams', 31, 'ella.adams@example.com', 'Wiskunde', 'schilderen, gamen');
addUser('freddie188', 'freddie188pass', 'Freddie', 'Nelson', 29, 'freddie.nelson@example.com', 'Psychologie', 'fitness, muziek');
addUser('georgia199', 'georgiapassword199', 'Georgia', 'Carter', 32, 'georgia.carter@example.com', 'Informatica', 'leiden, yoga');
addUser('hannah200', 'hannahpassword200', 'Hannah', 'Mitchell', 25, 'hannah.mitchell@example.com', 'Wiskunde', 'koken, gamen');
addUser('ian211', 'ianpassword211', 'Ian', 'Roberts', 24, 'ian.roberts@example.com', 'Psychologie', 'schrijven, muziek');
addUser('julia222', 'juliapassword222', 'Julia', 'Harris', 23, 'julia.harris@example.com', 'Informatica', 'gaming, lezen');
addUser('kyle233', 'kylepassword233', 'Kyle', 'Young', 31, 'kyle.young@example.com', 'Wiskunde', 'reizen, koken');
addUser('lily244', 'lilypassword244', 'Lily', 'King', 28, 'lily.king@example.com', 'Psychologie', 'fitness, lezen');
addUser('michael255', 'michaelpassword255', 'Michael', 'Wells', 33, 'michael.wells@example.com', 'Informatica', 'hiken, films');
addUser('nancy266', 'nancypass266', 'Nancy', 'Baker', 27, 'nancy.baker@example.com', 'Wiskunde', 'hiken, lezen');
addUser('olga277', 'olgapassword277', 'Olga', 'Garcia', 26, 'olga.garcia@example.com', 'Psychologie', 'schrijven, gamen');
addUser('paul288', 'paulpassword288', 'Paul', 'Morris', 29, 'paul.morris@example.com', 'Informatica', 'reizen, lezen');
addUser('quinn299', 'quinnpassword299', 'Quinn', 'Taylor', 30, 'quinn.taylor@example.com', 'Wiskunde', 'schilderen, gamen');
addUser('riley300', 'rileypass300', 'Riley', 'Wood', 28, 'riley.wood@example.com', 'Psychologie', 'wandelen, gamen');
addUser('sophia311', 'sophiapass311', 'Sophia', 'Knight', 24, 'sophia.knight@example.com', 'Informatica', 'schrijven, muziek');
addUser('thomas322', 'thomaspass322', 'Thomas', 'Hill', 31, 'thomas.hill@example.com', 'Wiskunde', 'films, wandelen');
addUser('ursula333', 'ursulapassword333', 'Ursula', 'Roberts', 27, 'ursula.roberts@example.com', 'Psychologie', 'gamen, lezen');
addUser('victoria344', 'victoriapassword344', 'Victoria', 'Lopez', 29, 'victoria.lopez@example.com', 'Informatica', 'fitness, gamen');
addUser('william355', 'williampassword355', 'William', 'Miller', 28, 'william.miller@example.com', 'Wiskunde', 'wandelen, lezen');

// Sluit de database wanneer het script klaar is
db.close((err) => {
    if (err) {
        console.error('Fout bij het sluiten van de database:', err.message);
    } else {
        console.log('Database gesloten.');
    }
});
