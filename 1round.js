document.addEventListener('DOMContentLoaded', function () {
    const cursor = document.querySelector('.cursor');
    const holes = [...document.querySelectorAll('.hole')];
    const scoreEl = document.querySelector('.score span');
    const timerEl = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
    const gameOverContainer = document.querySelector('.game-over-container');
    
    let score = 0;
    let gameTimer;
    let timeLeft = 60;
    let gameStarted = false;
    let gameOver = false;
    const sound = new Audio("smash.mp3");

    startButton.addEventListener('click', startGame);

    function updateTimer() {
        if (timeLeft > 0 && gameStarted) {
            timeLeft--;
            timerEl.textContent = timeLeft;
            setTimeout(updateTimer, 1000);
        } else {
            endGame();
        }
    }

    function run() {
        if (!gameStarted) return;

        const i = Math.floor(Math.random() * holes.length);
        const hole = holes[i];
        let timer = null;

        const img = document.createElement('img');
        img.classList.add('mole');
        img.src = 'mole.png';

        img.addEventListener('click', () => {
            score += 10;
            sound.play();
            scoreEl.textContent = score;
            img.src = 'mole-whacked.png';
            clearTimeout(timer);
            setTimeout(() => {
                hole.removeChild(img);
                run();
            }, 500);
        });

        hole.appendChild(img);

        timer = setTimeout(() => {
            hole.removeChild(img);
            run();
        }, 1500);
    }

    const startGameCard = document.querySelector('.start-game-card');
    const gameOverCard = document.querySelector('.game-over-card');
    const finalScoreElement = document.getElementById('final-score');
    const highestScoreElement = document.getElementById('highest-score');

    function displayStartGameCard() {
        startGameCard.style.display = 'block';
        gameOverCard.style.display = 'none';
    }

    function startGame() {
        gameStarted = true;
        gameOver = false;
        startGameCard.style.display = 'none';
        gameOverCard.style.display = 'none';
        run();
        updateTimer();
    }

    function updateHighestScore() {
        const currentHighestScore = localStorage.getItem('highestScore') || 0;
        if (score > currentHighestScore) {
            localStorage.setItem('highestScore', score);
        }
        highestScoreElement.textContent = localStorage.getItem('highestScore');
    }

   function endGame() {
    if (gameOver) return;
    clearTimeout(gameTimer);
    gameOver = true;
    gameOverCard.style.display = 'block';
    finalScoreElement.textContent = score;
    updateHighestScore();
    
    // Remove any existing "Restart" button before adding a new one
    const existingRestartButton = gameOverContainer.querySelector('.restart-button');
    if (existingRestartButton) {
        gameOverContainer.removeChild(existingRestartButton);
    }

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.classList.add('restart-button'); // Add a class to the button
    restartButton.onclick = restartGame;
    gameOverContainer.appendChild(restartButton);
}

    function restartGame() {
        score = 0;
        scoreEl.textContent = '00';
        timeLeft = 60;
        timerEl.textContent = timeLeft;

        gameOverCard.style.display = 'none';

        gameStarted = true;
        gameOver = false;
        run();
        updateTimer();
    }

    displayStartGameCard();

    window.addEventListener('mousemove', e => {
        moveCursor(e); // Call the moveCursor function here
    });

    window.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });

    function moveCursor(e) {
        cursor.style.top = e.pageY + 'px';
        cursor.style.left = e.pageX + 'px';
    }

    startButton.addEventListener('click', () => {
        window.addEventListener('mousemove', moveCursor);
        startGame();
    });
});