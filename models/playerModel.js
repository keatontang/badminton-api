const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A player must have a name'],
    trim: true,
    unique: [true, 'A player must have a unique name'],
  },
  country: {
    type: String,
    required: [true, 'A player must have a country'],
    trim: true,
  },
  discipline: {
    type: String,
    required: [true, 'A player must have a discipline'],
    enum: {
      values: ["MEN'S SINGLES", "WOMEN'S SINGLES"],
      message: 'A player must play either MS or WS.',
    },
    trim: true,
  },
  rank: {
    type: Number,
    required: [true, 'A player must have a rank'],
    min: [1, "Ranking can't be higher than 1"],
    unique: [true, 'Ranking must be unique'],
  },
  wins: {
    type: Number,
    required: [true, 'A player must have wins'],
  },
  losses: {
    type: Number,
    required: [true, 'A player must have losses'],
  },
  prizeMoney: {
    type: Number,
    min: [0, `Prize money can't be less than 0`],
    required: [true, `A player must have prize money`],
  },
  points: {
    type: Number,
    min: [0, `Points can't be less than 0`],
    required: [true, `A player must have player points`],
  },
  lastUpdated: {
    type: Number,
    required: [true, 'We require the last time this player data was updated'],
  },
  DOB: {
    type: Date,
    required: [true, 'A player must have a date of birth'],
  },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
