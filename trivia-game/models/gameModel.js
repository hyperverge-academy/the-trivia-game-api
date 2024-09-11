const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        },
    ],
    category: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    },

});

module.exports = mongoose.model('Game', gameSchema);