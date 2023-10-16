document.addEventListener("DOMContentLoaded", function () {
    let sharkImages= document.querySelectorAll("img[src='icea.png']");
    let score = 0;
    let gameOver = false;
    let timeLeft = 10; // Initial time in seconds
    const sound = new Audio("smash.mp3");
    let highScore = 0;
    let timerElement;
    let sharkInterval;
    let isPaused = false;
    let p = document.getElementById("pause-button");

    if (p) {
        p.addEventListener("click", togglePause);
    }
    window.onload = function () {
        setGame();
    };

    function setGame() {
        // Start the timer
        startTimer();

        // Set sharks
        sharkInterval = setInterval(moveSharks, 1000);
    }

    function togglePause() {
        console.log("Pause button clicked");
        if (isPaused) {
            // If the game is paused, resume it
            isPaused = false;
            p.textContent = "Pause";
            resumeGame();
        } else {
            // If the game is not paused, pause it
            isPaused = true;
            p.textContent = "Resume";
            pauseGame();
        }
    }

    function pauseGame() {
        // Stop the shark intervals and the timer to pause the game
        clearInterval(sharkInterval);
        clearInterval(timerInterval);
    }

    function resumeGame() {
        if (!gameOver) {
            // Start the shark interval and resume the game
            sharkInterval = setInterval(moveSharks, 1000);
            if (!isPaused) {
                startTimer();
            }
        }
    }

    function startTimer() {
        timerElement = document.getElementById("timer");
        if (timerElement) {
            timerElement.innerText = `Time Left: ${timeLeft} seconds`;

            timerInterval = setInterval(function () {
                if (isPaused) {
                    // If the game is paused, do nothing
                    return;
                }

                timeLeft--;
                if (timerElement) {
                    timerElement.innerText = `Time Left: ${timeLeft} seconds`;
                }

                if (timeLeft === 0) {
                    gameOver = true;
                    clearInterval(timerInterval);
                    document.getElementById("score").innerText = score;
                    if (score >= 10) {
                        showCongratulationsScreen();
                    } else {
                        showGameOverScreen();
                    }
                }
            }, 1000);
        }
    }

    function moveSharks() {
        if (gameOver) {
            return;
        }
        clearSharkImages();
           
            let sharkImage = document.createElement("img");
            sharkImage.src =  "icea.png";
            sharkImage.style.position = "absolute";
            sharkImage.style.width = "200px";
            sharkImage.style.height = "200px";

            const randomX = Math.floor(Math.random() * window.innerWidth);
            const randomY = Math.floor(Math.random() * window.innerHeight);

            sharkImage.style.left = randomX + "px";
            sharkImage.style.top = randomY + "px";

            sharkImage.addEventListener("click", selectShark);

           document.body.appendChild(sharkImage);

            //sharkImages.push(sharkImage);
        
    }

   function selectShark() {
    if (isPaused || gameOver) {
        return;
    }

    score += 10;
    sound.play();

    this.src = "b1.png";

    setTimeout(() => {
        this.remove();
        //sharkImages.splice(sharkImages.indexOf(this), 1);
    }, 1000);

    document.getElementById("score").innerText = score.toString();
    localStorage.setItem('userScore', score);

    localStorage.setItem('level4Score', score); // Add this line to store the Level 2 score

    // Check userScore and enable subsequent levels
    if (score >= 500) {
        document.getElementById('playLevel3').classList.remove('disabled');
    }
    // Check userScore and enable subsequent levels
    if (score >= 900) {
        document.getElementById('playLevel3').classList.remove('disabled');
    }
}
function clearSharkImages() {
     const iceaImages = document.querySelectorAll("img[src='icea.png']");
    iceaImages.forEach(iceaImage => {
        iceaImage.remove();
    });
}

    function showCongratulationsScreen() {
        const congratulationsScreen = document.getElementById("congratulations-screen");
        const congratulationsFinalScore = document.getElementById("congratulations-final-score");
        const congratulationsHighScore = document.getElementById("congratulations-high-score");
        const restartButtonCongratulations = document.getElementById("restart-button-congratulations");
        const homeButtonCongratulations = document.getElementById("home-button-congratulations");
        const nextLevelButton = document.getElementById("next-level-button");

        // Hide the timer and pause button
        timerElement.style.display = "none";
        p.style.display = "none";

        // Show the congratulations screen
        congratulationsScreen.style.display = "block";
        congratulationsFinalScore.textContent = score;
         clearSharkImages();
        // Update the highest score
        if (score > highScore) {
            highScore = score;
            congratulationsHighScore.textContent = highScore;
        }

        // Add event listeners to buttons
        restartButtonCongratulations.addEventListener("click", restartGame);
        homeButtonCongratulations.addEventListener("click", returnToHome);
        nextLevelButton.addEventListener("click", goToNextLevel);
    }

    function showGameOverScreen() {
        const gameOverScreen = document.getElementById("game-over-screen");
        const finalScore = document.getElementById("final-score");
        const highScoreElement = document.getElementById("high-score");
        const restartButton = document.getElementById("restart-button");
        const homeButton = document.getElementById("home-button");

        // Hide the timer and pause button
        timerElement.style.display = "none";
        p.style.display = "none";

        // Show the game over screen
        gameOverScreen.style.display = "block";
        finalScore.textContent = score;

        // Update the highest score
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
        }
        clearSharkImages();
        // Add event listeners to buttons
        restartButton.addEventListener("click", restartGame);
        homeButton.addEventListener("click", returnToHome);
    }

    function restartGame() {
        // Reset the game variables and screen
        score = 0;
       document.getElementById("score").innerText = score;
        timeLeft = 10;
        gameOver = false;
        p.style.display = "block";
        clearInterval(timerInterval);
        clearInterval(sharkInterval);

        // Reset and display the timer
        timerElement.style.display = 'block';
        timerElement.textContent = `Time Left: ${timeLeft} seconds`;

        clearSharkImages();
        // Hide the game over or congratulations screen
        const gameOverScreen = document.getElementById("game-over-screen");
        gameOverScreen.style.display = "none";

        const congratulationsScreen = document.getElementById("congratulations-screen");
        congratulationsScreen.style.display = "none";

        // Start a new game
        setGame();
    }

    function returnToHome() {
        // Redirect to home.html or the desired home page
        window.location.href = "try1.html";
    }

    function goToNextLevel() {
        window.location.href = "5round.html";
    }
});