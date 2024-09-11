const Player = require('../models/playerModel');
const Game = require('../models/gameModel');
const { fetchQuestions } = require('./questionController');


const startGame = async (req, res) => {
    const { player1Name, player2Name, category } = req.body

    const player1 = await Player.create({ name: player1Name });
    const player2 = await Player.create({ name: player2Name });

    const game = await Game.create({
        players: [player1._id, player2._id],
        category: category,
    })

    res.json({ game, player1, player2 });
}


const getNextQuestion = async (req, res) => {
    const { gameId, difficulty, playerIndex } = req.body;
    const game = await Game.findById(gameId);

    if (gameId.completed) {
        return res.status(400).json({ message: 'Game is already completed.' })

    }

    const questions = await fetchQuestions(game.category, difficulty);

    const player = await Player.findById(game.players[playerIndex]);
    res.json({ question: questions[0], player });

}


const updateScore = async (req, res) => {
    const { playerId, correct, difficulty } = req.body;

    const scoreIncrement = difficulty === 'easy' ? 10 :
        difficulty === 'medium' ? 15 : 20;

    if (correct) {
        const player = await Player.findById(playerId);
        player.score += scoreIncrement;
        await player.save();
    }
    res.json({ message: 'Score update.' })

}


const endGame = async (req, res) => {
    const { gameId } = req.body;
    const game = await Game.findById(gameId).populate('players');

    const winner = game.players.reduce((winner, player) => {
        return player.score > (winner.score || 0) ? player : winner;

    }, {});

    game.completed = true;
    await game.save();

    res.json({ winner, message: 'Game over!' });
}


module.exports = { startGame, getNextQuestion, updateScore, endGame };