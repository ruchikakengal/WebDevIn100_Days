const target = document.getElementById("target");
const gameArea = document.getElementById("gameArea");
const reactionTimeEl = document.getElementById("reactionTime");
const avgTimeEl = document.getElementById("avgTime");
const bestTimeEl = document.getElementById("bestTime");
const roundCountEl = document.getElementById("roundCount");
const totalRoundsEl = document.getElementById("totalRounds");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const difficultyEl = document.getElementById("difficulty");
const roundsEl = document.getElementById("rounds");

let startTime;
let times = [];
let round = 0;
let totalRounds = 10;
let delayRange = [];
let targetSize = 45;
let timer;
let bestTime = null;

function getRandomPosition(size) {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;
    const x = Math.random() * (areaWidth - size);
    const y = Math.random() * (areaHeight - size);
    return { x, y };
}

function setDifficultySettings() {
    const level = difficultyEl.value;
    if (level === "easy") {
        delayRange = [1500, 2200];
        targetSize = 60;
    } else if (level === "medium") {
        delayRange = [1000, 1500];
        targetSize = 45;
    } else {
        delayRange = [500, 1000];
        targetSize = 30;
    }
}

function showTarget() {
    const { x, y } = getRandomPosition(targetSize);
    target.style.width = `${targetSize}px`;
    target.style.height = `${targetSize}px`;
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    target.style.display = "block";
    target.classList.add("pulse");
    startTime = Date.now();
}

function hideTarget() {
    target.style.display = "none";
    target.classList.remove("pulse");
}

function resetTimer() {
    times = [];
    bestTime = null;
    reactionTimeEl.textContent = "-";
    avgTimeEl.textContent = "-";
    bestTimeEl.textContent = "-";
    roundCountEl.textContent = 0;
    totalRoundsEl.textContent = "-";
}

function startGame() {
    round = 0;
    times = [];
    bestTime = null;
    setDifficultySettings();
    totalRounds = parseInt(roundsEl.value);
    totalRoundsEl.textContent = totalRounds;
    roundCountEl.textContent = 0;
    reactionTimeEl.textContent = "-";
    avgTimeEl.textContent = "-";
    bestTimeEl.textContent = "-";

    startBtn.disabled = true;
    stopBtn.disabled = false;
    nextRound();
}

function stopGame() {
    hideTarget();
    clearTimeout(timer);
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function nextRound() {
    if (round >= totalRounds) {
        stopGame();
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        document.getElementById("finalStats").innerHTML = `Average Time: <strong>${avg} ms</strong><br>Best Time: <strong>${bestTime} ms</strong>`;
        document.getElementById("gameOverModal").style.display = "flex";
        return;
    }

    hideTarget();
    const delay = Math.random() * (delayRange[1] - delayRange[0]) + delayRange[0];
    timer = setTimeout(() => {
        showTarget();
    }, delay);
}

target.addEventListener("click", () => {
    const clickTime = Date.now();
    const reactionTime = clickTime - startTime;
    times.push(reactionTime);
    round++;
    roundCountEl.textContent = round;
    reactionTimeEl.textContent = reactionTime;

    if (bestTime === null || reactionTime < bestTime) {
        bestTime = reactionTime;
        bestTimeEl.textContent = bestTime;
    }

    const average = times.reduce((a, b) => a + b, 0) / times.length;
    avgTimeEl.textContent = Math.round(average);

    nextRound();
});

function closeModal() {
    document.getElementById("gameOverModal").style.display = "none";
}

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
resetBtn.addEventListener("click", resetTimer);
