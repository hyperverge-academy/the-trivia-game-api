document.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('start-game-btn');
    const selectCategoryBtn = document.getElementById('select-category-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const endGameBtn = document.getElementById('end-game-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const selectAnotherCategoryBtn = document.getElementById('select-another-category-btn');


    let gameId;
    let gamePlayers;
    let currentPlayerIndex = 0;
    let currentDifficulty = 'easy';
    let player1Name
    let player2Name

    startGameBtn.addEventListener('click', startGame);
    selectCategoryBtn.addEventListener('click', selectCategory);
    nextQuestionBtn.addEventListener('click', getNextQuestion);
    selectAnotherCategoryBtn.addEventListener('click', selectAnotherCategory);
    endGameBtn.addEventListener('click', endGame);
    playAgainBtn.addEventListener('click', () => location.reload());

    function startGame() {
        player1Name = document.getElementById('player1Name').value;
        player2Name = document.getElementById('player2Name').value;

        if (player1Name || player2Name) {
            document.getElementById('player-setup').classList.add('hidden');
            document.getElementById('category-selection').classList.remove('hidden');
            document.getElementById('select-category-btn').classList.remove('hidden');

        }
        else {
            alert('Please enter both player names.');
        }

    }

    function selectCategory() {
        const category = document.getElementById('category').value;

        fetch('http://localhost:5000/api/game/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player1Name: player1Name,
                player2Name: player2Name,
                category: category
            }),
        })
            .then(response => response.json())
            .then(data => {
                gameId = data.game._id;
                gamePlayers = data.game.players;
                document.getElementById('category-selection').classList.add('hidden');
                document.getElementById('game-play').classList.remove('hidden');
                getNextQuestion();

            });

    }

    function getNextQuestion() {
        fetch('http://localhost:5000/api/game/next-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gameId: gameId,
                difficulty: currentDifficulty,
                playerIndex: currentPlayerIndex
            }),
        })
            .then(response => response.json())
            .then(data => {

                const currentPlayerName = document.getElementById('current-player-name')
                const questionText = document.getElementById('question-text');
                const answersList = document.getElementById('answers-list');

                currentPlayerName.textContent = "Question for " + data.player.name
                questionText.textContent = data.question.question;
                answersList.innerHTML = '';

                const allAnswers = [data.question.correctAnswer, ...data.question.incorrectAnswers];
                allAnswers.sort(() => Math.random() - 0.5);

                allAnswers.forEach(answer => {
                    const li = document.createElement('li');
                    li.textContent = answer;
                    li.addEventListener('click', () => checkAnswer(answer, data.question.correctAnswer));
                    answersList.appendChild(li);
                });
            });
    }


    function checkAnswer(selectedAnswer, correctAnswer) {
        const isCorrect = selectedAnswer === correctAnswer;
        updateScore(isCorrect);

        currentPlayerIndex = (currentPlayerIndex + 1) % 2;
        if (currentPlayerIndex === 0) {
            if (currentDifficulty === 'easy') currentDifficulty = 'medium';
            else if (currentDifficulty === 'medium') currentDifficulty = 'hard';
            else if (currentDifficulty === 'hard') selectAnotherCategory()

        }

        nextQuestionBtn.classList.remove('hidden');
    }

    function updateScore(isCorrect) {
        fetch('http://localhost:5000/api/game/update-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerId: gamePlayers[currentPlayerIndex],
                correct: isCorrect,
                difficulty: currentDifficulty
            }),
        })
            .then(() => {
                nextQuestionBtn.classList.add('hidden');
                getNextQuestion();
            });
    }

    function endGame() {
        fetch('http://localhost:5000/api/game/end', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gameId: gameId,
            }),
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('game-play').classList.add('hidden');
                document.getElementById('category-selection').classList.add('hidden');
                document.getElementById('game-end').classList.remove('hidden');
                document.getElementById('winner-text').textContent = `Congratulations, ${data.winner.name}! You won with ${data.winner.score} points.`;
            });
    }

    function selectAnotherCategory() {

        document.getElementById('game-play').classList.add('hidden');
        document.getElementById('category-selection').classList.remove('hidden');
        document.getElementById('select-category-btn').classList.add('hidden');
        document.getElementById('or-option').classList.remove('hidden');
        document.getElementById('select-another-category-btn').classList.remove('hidden');
        document.getElementById('end-game-btn').classList.remove('hidden');

        const category = document.getElementById('category').value;
        const err = document.getElementById('err-msg');

        fetch('http://localhost:5000/api/game/another-category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category: category,
                gameId: gameId,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.message === 'No more categories available') {
                    endGame();
                }
                else if (data.message === "Another category selected.") {
                    currentDifficulty = 'easy'

                    document.getElementById('category-selection').classList.add('hidden');
                    document.getElementById('game-play').classList.remove('hidden');
                    getNextQuestion();

                }
                else if (!err.value) {
                    err.textContent = " This category has  already been chosen."
                    err.style.color = "red";

                }

            });

    }


});
