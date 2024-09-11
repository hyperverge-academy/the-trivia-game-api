const express = require('express');
const { startGame, getNextQuestion, updateScore, endGame } = require('../controllers/gameController')
const router = express.Router();

router.post('/start', startGame);
router.post('/next-question', getNextQuestion);
router.post('/update-score', updateScore);
router.post('/end', endGame);

module.exports = router;