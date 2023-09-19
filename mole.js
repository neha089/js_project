let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
const sound=new Audio("smash.mp3");
window.onload = function() {
    setGame();
}

function setGame() {
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, 1000); // 1000 miliseconds = 1 second, every 1 second call setMole
    setInterval(setPlant, 2000); // 2000 miliseconds = 2 seconds, every 2 second call setPlant
}

function getRandomTile() {
    //math.random --> 0-1 --> (0-1) * 9 = (0-9) --> round down to (0-8) integers
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }

    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./x1.png";
    mole.style.width = "200px"; // Set the width to 200 pixels
    mole.style.height = "200px"; // Set the height to 200 pixels

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == currMoleTile) {
        score += 10;
        sound.play();
        currMoleTile.innerHTML = ""; // Clear the current mole tile
        let mole = document.createElement("img");
        mole.src = 'x3.png';
        mole.style.width = "200px";
        mole.style.height = "200px";
        currMoleTile.appendChild(mole);

        setTimeout(() => {
            currMoleTile.innerHTML = ""; // Remove the mole after a delay
            setMole(); // Continue the game
        }, 3000); // Change mole back to x1.png after 1 second (adjust the delay as needed)
        
        document.getElementById("score").innerText = score.toString(); //update score html
    }
    else if (this == currPlantTile) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString(); //update score html
        gameOver = true;
        document.body.style.backgroundImage = "none"; // Stop the background GIF
    }
}
