const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const winSound = document.getElementById("win-sound");

let rows = 21;
let cols = 21;
let wallChance = 0.2;
let cells = [];
let playerPos = { r: 0, c: 0 };
let timer = 0;
let moves = 0;
let timerInterval;

function updateStats() {
  timerDisplay.textContent = timer;
  movesDisplay.textContent = moves;
}

function createGrid() {
  clearInterval(timerInterval);
  timer = 0;
  moves = 0;
  updateStats();
  grid.innerHTML = '';
  cells = [];

  grid.style.gridTemplateColumns = `repeat(${cols}, 20px)`;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      grid.appendChild(cell);
      row.push(cell);
    }
    cells.push(row);
  }

  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function generateMaze() {
  const difficulty = document.getElementById("difficulty").value;
  
  if (difficulty === "easy") {
    rows = cols = 11;
  } else if (difficulty === "medium") {
    rows = cols = 21;
  } else if (difficulty === "hard") {
    rows = cols = 31;
  }

    if (rows % 2 === 0) rows++;
    if (cols % 2 === 0) cols++;

      generatePerfectMaze();
    } while (!checkSolvable());


function generateRandomMaze() {
  let solvable = false;
  while (!solvable) {
    createGrid();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isStartOrEnd = (r <= 1 && c <= 1) || (r >= rows - 2 && c >= cols - 2);
        if (!isStartOrEnd && Math.random() < wallChance) {
          cells[r][c].classList.add("wall");
        }
      }
    }

    cells[0][0].classList.remove("wall");
    cells[rows - 1][cols - 1].classList.remove("wall");

    solvable = checkSolvable();
  }

  setPlayer();
}

function generatePerfectMaze() {
  createGrid();

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const stack = [[0, 0]];
  visited[0][0] = true;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells[r][c].classList.add("wall");
    }
  }

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    cells[r][c].classList.remove("wall");

    const neighbors = shuffle([
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2]
    ]);

    for (const [nr, nc] of neighbors) {
      if (
        nr >= 0 && nc >= 0 && nr < rows && nc < cols &&
        !visited[nr][nc]
      ) {
        visited[nr][nc] = true;
        cells[(r + nr) / 2][(c + nc) / 2].classList.remove("wall");
        stack.push([nr, nc]);
      }
    }
  }

  cells[0][0].classList.remove("wall");
  cells[rows - 1][cols - 1].classList.remove("wall");

  setPlayer();
}

function setPlayer() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells[r][c].classList.remove("player", "start", "end");
    }
  }

  playerPos = { r: 0, c: 0 };
  cells[0][0].classList.add("start", "player");
  cells[rows - 1][cols - 1].classList.add("end");
  cells[0][0].classList.remove("wall");
  cells[rows - 1][cols - 1].classList.remove("wall");
}

function resetMaze() {
  createGrid();
  setPlayer();
}

function checkSolvable() {
  const queue = [[0, 0]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[0][0] = true;

  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
  ];

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (r === rows - 1 && c === cols - 1) return true;

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nc >= 0 && nr < rows && nc < cols &&
        !visited[nr][nc] &&
        !cells[nr][nc].classList.contains("wall")
      ) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }

  return false;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function movePlayer(dr, dc) {
  const newR = playerPos.r + dr;
  const newC = playerPos.c + dc;

  if (
    newR >= 0 && newR < rows &&
    newC >= 0 && newC < cols &&
    !cells[newR][newC].classList.contains("wall")
  ) {
    cells[playerPos.r][playerPos.c].classList.remove("player");
    playerPos = { r: newR, c: newC };
    cells[newR][newC].classList.add("player");

    moves++;
    updateStats();

    if (newR === rows - 1 && newC === cols - 1) {
      winSound.play();
      clearInterval(timerInterval);
      setTimeout(() => alert(`🎉 You won in ${moves} moves and ${timer} seconds!`), 100);
    }
  }
}

document.addEventListener("keydown", (e) => {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];
  if (keys.includes(e.key)) {
    e.preventDefault();
  }

  switch (e.key) {
    case "ArrowUp": case "w": movePlayer(-1, 0); break;
    case "ArrowDown": case "s": movePlayer(1, 0); break;
    case "ArrowLeft": case "a": movePlayer(0, -1); break;
    case "ArrowRight": case "d": movePlayer(0, 1); break;
  }
});

// Initial load
generateMaze();
