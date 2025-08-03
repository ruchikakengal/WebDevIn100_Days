const gameArea = document.getElementById("game-area");
const hitsDisplay = document.getElementById("hits");
const timeLeftDisplay = document.getElementById("time-left");
const avgTimeDisplay = document.getElementById("avg-time");
const levelDisplay = document.getElementById("level");

const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const gameOverScreen = document.getElementById("game-over-screen");
const finalLevel = document.getElementById("final-level");
const finalHits = document.getElementById("final-hits");
const finalAvg = document.getElementById("final-avg");

let gameInterval;
let spawnInterval;
let timeLeft = 30;
let hits = 0;
let totalReactionTime = 0;
let currentTargetAppearedAt = 0;
let level = 1;
let targetSpeed = 1000;

function getRandomPosition() {
  const maxX = gameArea.clientWidth - 60;
  const maxY = gameArea.clientHeight - 60;
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  return { x, y };
}

function spawnTarget() {
  const target = document.createElement("div");
  target.classList.add("target");
  const { x, y } = getRandomPosition();
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  currentTargetAppearedAt = Date.now();

  target.addEventListener("click", () => {
    const reactionTime = Date.now() - currentTargetAppearedAt;
    totalReactionTime += reactionTime;
    hits++;
    hitsDisplay.textContent = hits;
    avgTimeDisplay.textContent = Math.round(totalReactionTime / hits);
    target.remove();
  });

  gameArea.appendChild(target);

  setTimeout(() => {
    if (gameArea.contains(target)) target.remove();
  }, targetSpeed);
}

function startGame() {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  level = 1;
  hits = 0;
  timeLeft = 10;
  totalReactionTime = 0;
  targetSpeed = 1000;
  updateDisplays();
  gameArea.innerHTML = "";

  spawnInterval = setInterval(spawnTarget, 800);

  gameInterval = setInterval(() => {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;

    if (timeLeft % 10 === 0 && timeLeft !== 0) {
      level++;
      levelDisplay.textContent = level;
      targetSpeed = Math.max(300, targetSpeed - 100);
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function updateDisplays() {
  hitsDisplay.textContent = hits;
  timeLeftDisplay.textContent = timeLeft;
  avgTimeDisplay.textContent = 0;
  levelDisplay.textContent = level;
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  gameContainer.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalLevel.textContent = level;
  finalHits.textContent = hits;
  finalAvg.textContent = Math.round(totalReactionTime / hits || 0);
}

function restartGame() {
  gameOverScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}
