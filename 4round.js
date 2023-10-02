const molePaths = ["icea.png", "icea.png", "icea.png"];
const intervals=[1600, 1300, 1000, 700, 550];
const mole = document.getElementById("mole");
const background = document.getElementById("background");
const shotsLabel = document.getElementById("shots");
const missesLabel = document.getElementById("misses");
const pointsLabel = document.getElementById("points");
const boom=document.getElementById("boomImage");

let isMoleClicked = false, wasGameOver = false, alreadyMissed = false, wasGameEnded = false;
let timer;
let points = 0, misses = 0, shots = 0;

let minWidth = 0;//=10;
let maxWidth = 0;//=background.clientWidth-10-mole.clientWidth;
let minHeight = 0;//=70;
let maxHeight = 0;//=background.clientHeight-10-mole.clientHeight;

background.classList.add("playgroundIdle");
disableEnd();

mole.addEventListener("mousedown", (e) => {
    isMoleClicked = true;
    shots++;
    if (mole.src.includes("mole1")) {
        points += 1;
    }
    else if (mole.src.includes("mole2")) {
        points += 2;
    }
    else if (mole.src.includes("mole3")) {
        points += 3;
    }
    shotsLabel.innerText = shots;
    pointsLabel.innerText = points;
    boom.style.left=e.x-10+"px";
    boom.style.top=e.y-10+"px";
    boom.classList.remove("invisibleBoom");
    boom.classList.add("boom");
    mole.remove();
});

document.getElementById("newGame").addEventListener("click", () => {
    disableSettings();
    enableEnd();
    if (background.classList.contains("playgroundIdle"))
        background.classList.remove("playgroundIdle");
    if (!background.classList.contains("playgroundActive"))
        background.classList.add("playgroundActive");

    if (wasGameOver || wasGameEnded)
        background.lastElementChild.remove();

    if (background.childElementCount === 0)
        background.appendChild(mole);

    mole.classList.remove("invisibleImg");
    mole.classList.add("moleImg");

    resetStats();
    minWidth = 10;
    maxWidth = background.clientWidth - 10 - mole.clientWidth;
    minHeight = 70;
    maxHeight = background.clientHeight - 10 - mole.clientHeight;

    wasGameOver = false;
    wasGameEnded = false;
    if (timer !== undefined)
        clearInterval(timer);
    let diff = document.getElementById("difficulty").value;
    
    timer = setInterval(() => {
        isMoleClicked = false,
        alreadyMissed = false,
        boom.classList.remove("boom"),
        boom.classList.add("invisibleBoom"),
        generateMole()
    }, intervals[diff]);

    /*
    console.log(`minWidth= ${minWidth}`);
    console.log(`maxWidth ${maxWidth}`);
    console.log(`minHeight ${minHeight}`);
    console.log(`maxHeight ${maxHeight}`);

    console.log(`background.clientWidth ${background.clientWidth}`);
    console.log(`background.clientHeight ${background.clientHeight}`);
    console.log(`mole.clientWidth ${mole.clientWidth}`);
    console.log(`mole.clientHeight ${mole.clientHeight}`);
    */
});

document.getElementById("endGame").addEventListener("click", () => {
    disableEnd();
    enableSettings();
    clearInterval(timer);
    wasGameEnded = true;
    mole.classList.remove("moleImg");
    mole.classList.add("invisibleImg");
    addText(`You ended the game and scored ${points} points!`);
});

document.getElementById("background").addEventListener("click", () => {
    if (!isMoleClicked && !alreadyMissed) {
        mole.remove();

        misses++;
        alreadyMissed = true;
        if (misses <= 10 && !wasGameEnded) {
            missesLabel.innerText = misses;
        }

        if (misses === 10) {
            disableEnd();
            enableSettings();
            clearInterval(timer);
            wasGameOver = true;
            mole.classList.remove("moleImg");
            mole.classList.add("invisibleImg");
            addText(`You missed 10 times and lose!\nYour score: ${points} points`);
        }
    }
});

window.onresize = () => {
    maxWidth = background.clientWidth - 10 - mole.clientWidth;
    maxHeight = background.clientHeight - 10 - mole.clientHeight;
}

function generateMole() {
    let x = Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth;
    let y = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    mole.style.left = x + "px";
    mole.style.top = y + "px";
    mole.src = molePaths[Math.floor(Math.random() * molePaths.length)];
    background.appendChild(mole);
}

function resetStats() {
    shots = misses = points = 0;
    shotsLabel.innerText = shots;
    pointsLabel.innerText = points;
    missesLabel.innerText = misses;
}

function disableSettings() {
    document.getElementById("newGame").disabled = true;
    document.getElementById("newGame").style.backgroundColor = "#EEE";
    document.getElementById("difficulty").disabled = true;
}
function enableSettings() {
    document.getElementById("newGame").disabled = false;
    document.getElementById("newGame").style.backgroundColor = "#BCD33D";
    document.getElementById("difficulty").disabled = false;
}

function addText(text) {
    const h2 = document.createElement("h2");
    h2.classList = "loseGame";
    h2.innerText = text;
    background.appendChild(h2);
}

function disableEnd() {
    document.getElementById("endGame").disabled = true;
    document.getElementById("endGame").style.backgroundColor = "#EEE";
}

function enableEnd() {
    document.getElementById("endGame").disabled = false;
    document.getElementById("endGame").style.backgroundColor = "#fc4c3f";
}