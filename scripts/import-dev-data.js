const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });
const fs = require('fs');
const Player = require('./../models/playerModel');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log('DB connection successful'));

// Read JSON file

const players = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/player-data.json`)
);

// Import data into database

const importData = async () => {
  try {
    await Player.create(players);
    console.log('Loaded JSON data into database.');
    process.exit();
  } catch (err) {
    console.log(err);
    return;
  }
};

// Delete all data in the DB

const deleteData = async () => {
  try {
    await Player.deleteMany();
    console.log('Database cleared.');
    process.exit();
  } catch (err) {
    console.log(err);
    return;
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
