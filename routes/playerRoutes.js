// Require modules
const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();

router.route('/').get(playerController.getPlayers);

router.route('/').post(playerController.createPlayer);

router
  .route('/:id')
  .delete(playerController.deletePlayer)
  .get(playerController.getPlayer)
  .patch(playerController.updatePlayer);

module.exports = router;
