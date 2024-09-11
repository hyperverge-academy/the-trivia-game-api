const express = require('express');
const { startGame, getNextQuestion, updateScore,getAnotherCategory, endGame } = require('../controllers/gameController')
const router = express.Router();

router.post('/start', startGame);
router.post('/next-question', getNextQuestion);
router.post('/update-score', updateScore);
router.post('/another-category', getAnotherCategory);
router.post('/end', endGame);

module.exports = router;