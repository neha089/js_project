document.addEventListener('DOMContentLoaded', function () {
    const cursor = document.querySelector('.cursor');
    const holes = [...document.querySelectorAll('.hole')];
    const scoreEl = document.querySelector('.score span');
    const timerEl = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
    const gameOverContainer = document.querySelector('.game-over-container');
    const pauseButton = document.getElementById('pause-button');
    const startGameCard = document.querySelector('.start-game-card');
    const gameOverCard = document.querySelector('.game-over-card');
    const congratulationCard = document.querySelector('.congratulation-card');
    const finalScoreElement = document.getElementById('final-score');
    const highestScoreElement = document.getElementById('highest-score');
    const restartButtonCongratulation = document.getElementById('restart-button-congratulation');
    const homeButton = document.getElementById('home-button');
    const Home_Button = document.getElementById('Home_button');
    const nextLevelButton = document.getElementById('next-level-button');
    const restartButton = document.getElementById('restart-button');
  // const hammer = document.getElementById('hammer');
    // Hide the game over card initially
    gameOverCard.style.display = 'none';
    congratulationCard.style.display = 'none';

    let score = 0;
    let gameTimer;
    let timeLeft = 10;
    let gameStarted = false;
    let gameOver = false;
    let moleInterval;
    const sound = new Audio("smash.mp3");
    let paused = false;
    let gamePausedAt;
    // Add click event listener to the pause button
    pauseButton.addEventListener('click', togglePause);

    function togglePause() {
        if (gameOver) return; // Do nothing if the game is already over

        if (paused) {
            paused = false;
            pauseButton.textContent = 'Pause'; // Change button text to "Pause"
            updateTimer();
            moleInterval = setInterval(run, 1500); // Restart mole spawning interval
        } else {
            paused = true;
            pauseButton.textContent = 'Resume'; // Change button text to "Resume"
            clearInterval(moleInterval); // Clear the mole spawning interval
        }
    }

    function updateTimer() {
        if (gameOver) return;

        if (timeLeft > 0 && gameStarted && !paused) {
            timeLeft--;
            timerEl.textContent = timeLeft;
           //gameTimer = setTimeout(updateTimer, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
    }

   function run() {
    if (!gameStarted || gameOver || congratulationCard.style.display === 'block') return;

    if (!paused) {
        const activeMoles = document.querySelectorAll('.mole');
        if (activeMoles.length < 2) {
            // Generate two random hole indices
            const holeIndices = [];
            while (holeIndices.length < 2) {
                const index = Math.floor(Math.random() * holes.length);
                if (!holeIndices.includes(index)) {
                    holeIndices.push(index);
                }
            }

            holeIndices.forEach(index => {
                const hole = holes[index];
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
                  
                })
                localStorage.setItem('userScore', score);
                localStorage.setItem('level1Score', score);

                // Check userScore and enable subsequent levels
                if (score >= 300) {
                    document.getElementById('playLevel2').classList.remove('disabled');
                }
                hole.appendChild(img);

                timer = setTimeout(() => {
                    hole.removeChild(img);
                    run();
                }, 1500);
            });
        }
    }
    
}

    function displayStartGameCard() {
        startGameCard.style.display = 'block';
        gameOverCard.style.display = 'none';
        congratulationCard.style.display = 'none';
    }

   function startGame() {
    gameStarted = true;
    gameOver = false;
    startGameCard.style.display = 'none';
    gameOverCard.style.display = 'none';
    congratulationCard.style.display = 'none';
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pause';
    // Set the initial timeLeft value to 10 and update the timer
    timeLeft = 10;
    timerEl.textContent = timeLeft;
    updateTimer(); // Add this line to start the timer
    run();
}


function endGame() {
        if (gameOver) return;

        // Clear the game timer
        clearTimeout(gameTimer);

        // Set the gameOver flag
        gameOver = true;

        // Display the final score
        finalScoreElement.textContent = score;

        if (score >= 10) {
            const currentHighestScore = localStorage.getItem('highestScore') || 0;
            highestScoreElement.textContent = currentHighestScore;
            congratulationCard.style.display = 'block';
            document.getElementById('final-score-congratulation').textContent = score;
            document.getElementById('highest-score-congratulation').textContent = currentHighestScore;
        } else {
            congratulationCard.style.display = 'none';
            gameOverCard.style.display = 'block'; // Show the regular game over card
            document.getElementById('final-score').textContent = score;
            document.getElementById('highest-score').textContent = localStorage.getItem('highestScore');
        }

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.classList.add('restart-button');
        restartButton.onclick = restartGame;
        gameOverContainer.appendChild(restartButton);
    }

    function restartGame() {
        // Reset game variables
        score = 0;
        scoreEl.textContent = '00';
        timeLeft = 10;
        timerEl.textContent = timeLeft;
        gameOverCard.style.display = 'none';
        congratulationCard.style.display = 'none';
        gameStarted = false;
        gameOver = false;

        // Clear the existing moleInterval
        clearInterval(moleInterval);

        // Start a new game
        startGame();
    }

    // Ensure you call the function to display the start game card
    displayStartGameCard();

    // Other parts of your code

    // Add a click event listener to the start button to start the game
    startButton.addEventListener('click', () => {
       
        window.addEventListener('mousemove', moveCursor);
        startGame();
       gameTimer = setInterval(updateTimer, 1000);
    });

    window.addEventListener('mousemove', e => {
        moveCursor(e);
    });

    window.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });

    function moveCursor(e) {
        // Check if the congratulation card is displayed
        if (congratulationCard.style.display === 'block'|| !gameStarted ) {
            cursor.style.display = 'none'; // Hide the cursor
        } else {
            cursor.style.display = 'block'; // Show the cursor
            cursor.style.top = e.pageY + 'px';
            cursor.style.left = e.pageX + 'px';
        }
    }


    homeButton.addEventListener('click', () => {
        // Redirect to the home.html file
        window.location.href = 'try1.html';
    });
   Home_Button.addEventListener('click', () => {
        // Redirect to the home.html file
        window.location.href = 'try1.html';
    });

    nextLevelButton.addEventListener('click', () => {
        window.location.href = '2round.html';
    });

    restartButtonCongratulation.addEventListener('click', () => {
        // Restart the game from the congratulation card
        score = 0;
        scoreEl.textContent = '00';
        timeLeft = 10;
        timerEl.textContent = timeLeft;
        congratulationCard.style.display = 'none';
        gameOverCard.style.display = 'none';
        startGame();
        gameTimer = setInterval(updateTimer, 1000);
    });
 restartButton.addEventListener('click', () => {
        // Reset game variables and start a new game
        score = 0;
        scoreEl.textContent = '00';
        timeLeft = 10;
        timerEl.textContent = timeLeft;
        gameOverCard.style.display = 'none';
        congratulationCard.style.display = 'none';
        gameStarted = false;
        gameOver = false;
        
        // Clear the existing moleInterval
        clearInterval(moleInterval);
         gameTimer = setInterval(updateTimer, 1000);
        // Start a new game
        startGame();
        var userScore = localStorage.getItem('userScore');

    if (userScore >= 300) {
        document.getElementById('playLevel2').classList.remove('disabled');
    }
    });

});