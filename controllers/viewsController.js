const Players = require('../models/playerModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const players = await Players.find();

  res.status(200).render('overview', {
    title: 'badminton-api',
    players,
  });
});
