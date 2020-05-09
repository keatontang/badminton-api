const Player = require('./../models/playerModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/APIFeatures');

exports.getPlayers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Player.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const players = await features.query;
  res.status(200).json({
    status: 'success',
    msg: 'got da players tho',
    length: players.length,
    players: players,
  });
});

exports.createPlayer = catchAsync(async (req, res, next) => {
  const newPlayer = await Player.create(req.body);

  res.status(200).json({
    status: 'success',
    msg: 'created player tho',
    player: newPlayer,
  });
});

exports.deletePlayer = catchAsync(async (req, res, next) => {
  const player = await Player.findByIdAndDelete(req.params.id);

  if (!player) {
    return next(
      new Error(`No such player with ID ${req.params.id} exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    msg: 'deleted player tho',
    player: player,
  });
});

exports.getPlayer = catchAsync(async (req, res, next) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    return next(
      new Error(`No such player with ID ${req.params.id} exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    msg: 'got player',
    player: player,
  });
});
