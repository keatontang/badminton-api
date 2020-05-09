const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.route('/').get(viewsController.getOverview);
router.route('/players').get(viewsController.getPlayers);
router.route('/players/:id').get(viewsController.getPlayer);

module.exports = router;
