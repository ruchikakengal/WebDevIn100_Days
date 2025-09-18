const size = 5;
const gameBoard = document.getElementById("gameBoard");
const resetBtn = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");
const status = document.getElementById("status");
const instructions = document.getElementById("instructions");
const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
let tiles = [];

// Build the game board
function createBoard() {
  gameBoard.innerHTML = "";
  tiles = [];

  for (let r = 0; r < size; r++) {
    let row = [];
    for (let c = 0; c < size; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.row = r;
      tile.dataset.col = c;

      if (Math.random() > 0.5) {
        tile.classList.add("active");
      }

      tile.addEventListener("click", () => toggle(r, c));
      gameBoard.appendChild(tile);
      row.push(tile);
    }
    tiles.push(row);
  }
}

function toggle(r, c) {
  const positions = [
    [r, c],
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ];

  positions.forEach(([nr, nc]) => {
    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
      tiles[nr][nc].classList.toggle("active");
    }
  });

  checkWin();
}

function checkWin() {
  const allActive = tiles.flat().every(t => t.classList.contains("active"));
  const allInactive = tiles.flat().every(t => !t.classList.contains("active"));

  if (allActive || allInactive) {
    status.textContent = "🎉 You solved the puzzle!";
  } else {
    status.textContent = "";
  }
}

resetBtn.addEventListener("click", createBoard);
themeToggle.addEventListener("click", () => document.body.classList.toggle("dark"));

startBtn.addEventListener("click", () => {
  instructions.classList.add("hidden");
  gameArea.classList.remove("hidden");
  createBoard();
});
