const Players = require('../models/playerModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/APIFeatures');

exports.getOverview = catchAsync(async (req, res, next) => {
  const wsPlayers = new APIFeatures(Players.find(), {
    discipline: "WOMEN'S SINGLES",
  })
    .filter()
    .sort()
    .paginate();
  const msPlayers = new APIFeatures(Players.find(), {
    discipline: "MEN'S SINGLES",
  })
    .filter()
    .sort()
    .paginate();

  const WS = await wsPlayers.query;
  const MS = await msPlayers.query;

  res.status(200).render('overview', {
    title: 'badminton-api',
    WS,
    MS,
  });
});

exports.getPlayers = catchAsync(async (req, res, next) => {
  const allPlayers = new APIFeatures(Players.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const players = await allPlayers.query;

  res
    .status(200)
    .render('players', { title: 'badminton-api', players, request: req });
});

exports.getPlayer = catchAsync(async (req, res, next) => {
  const player = await Players.findById(req.params.id);

  res
    .status(200)
    .render('profile', { title: 'badminton-api', player, request: req });
});
