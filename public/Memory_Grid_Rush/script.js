// ==== DOM Elements ====
const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const messageEl = document.getElementById("message");
const instructionsScreen = document.getElementById("instructions-screen");
const levelScreen = document.getElementById("level-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const finalScoreEl = document.getElementById("finalScore");
const toggleThemeBtn = document.getElementById("toggleTheme");

// ==== Game Variables ====
let gridRows = 3, gridCols = 3;
let pattern = [];
let userInputs = [];
let accepting = false;
let difficulty = "easy";
let score = 0;
let level = 1;
let gridMatrix = [];
let theme = "light"; // default

// ==== Screen Switch ====
function switchScreen(hide, show) {
  hide.classList.remove("active");
  show.classList.add("active");
}

// ==== Create Cells ====
function createCells() {
  grid.innerHTML = "";
  gridMatrix = [];
  grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
  for (let r = 0; r < gridRows; r++) {
    let rowArr = [];
    for (let c = 0; c < gridCols; c++) {
      let cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = () => handleCellClick(r, c, cell);
      grid.appendChild(cell);
      rowArr.push(cell);
    }
    gridMatrix.push(rowArr);
  }
}

// ==== Pattern & Flash ====
function generatePattern() {
  pattern = [];
  let steps = 2 + level;
  let totalCells = gridRows * gridCols;
  for (let i = 0; i < steps; i++) {
    let idx = Math.floor(Math.random() * totalCells);
    let row = Math.floor(idx / gridCols);
    let col = idx % gridCols;
    pattern.push([row, col]);
  }
}

function flashPattern() {
  accepting = false;
  setMessage("Watch closely...");
  pattern.forEach(([r, c], i) => {
    setTimeout(() => gridMatrix[r][c].classList.add("lit"), 700 * i);
    setTimeout(() => gridMatrix[r][c].classList.remove("lit"), 700 * i + 500);
  });
  setTimeout(() => {
    setMessage("Your turn!");
    accepting = true;
    userInputs = [];
  }, 700 * pattern.length);
}

// ==== Click Handling ====
function handleCellClick(r, c, cell) {
  if (!accepting) return;
  userInputs.push([r, c]);
  let [tr, tc] = pattern[userInputs.length - 1] || [];
  if (r === tr && c === tc) {
    cell.classList.add("correct");
    setTimeout(() => cell.classList.remove("correct"), 300);
    if (userInputs.length === pattern.length) {
      accepting = false;
      score += 10;
      level++;
      updateHUD();
      setTimeout(startGame, 800);
    }
  } else {
    cell.classList.add("wrong");
    setTimeout(() => cell.classList.remove("wrong"), 500);
    accepting = false;
    gameOver();
  }
}

// ==== HUD ====
function updateHUD() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
}
function setMessage(msg) {
  messageEl.textContent = msg;
}

// ==== Start & End ====
function startGame(isNew = false) {
  if (isNew) {
    level = 1;
    score = 0;
  }
  if (difficulty === "easy") { gridRows = 3; gridCols = 3; }
  if (difficulty === "medium") { gridRows = 4; gridCols = 4; }
  if (difficulty === "hard") { gridRows = 5; gridCols = 5; }

  updateHUD();
  createCells();
  generatePattern();
  flashPattern();
}

function gameOver() {
  finalScoreEl.textContent = `Your Score: ${score} (Reached Level ${level})`;
  switchScreen(gameScreen, endScreen);
}

// ==== Theme Toggle ====
toggleThemeBtn.onclick = () => {
  theme = theme === "light" ? "dark" : "light";
  document.body.setAttribute("data-theme", theme);
  toggleThemeBtn.textContent = theme === "light" ? "🌙" : "☀️";
};

// ==== Event Listeners ====
document.getElementById("nextToLevel").onclick = () => switchScreen(instructionsScreen, levelScreen);

document.querySelectorAll(".level-card").forEach(btn => {
  btn.onclick = () => {
    difficulty = btn.dataset.diff;
    switchScreen(levelScreen, gameScreen);
    startGame(true);
  };
});

document.getElementById("playAgain").onclick = () => switchScreen(endScreen, levelScreen);
document.getElementById("replayBtn").onclick = () => startGame(true);
