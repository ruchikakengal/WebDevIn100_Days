const WORD_BANK = [
  "apple", "plant", "ghost", "sugar", "train",
  "bride", "grape", "lemon", "flame", "wrist",
  "glass", "mouse", "chair", "blaze", "drain",
  "quiet", "speak", "storm", "water", "beach"
];

const HINTS = {
  apple: "Common fruit, keeps doctors away",
  plant: "Grows in a pot or the ground",
  ghost: "Spooky, invisible, says 'boo'",
  sugar: "Sweet and bad for your teeth",
  train: "Moves on rails, not a car",
  bride: "She wears white, says 'I do'",
  grape: "Tiny fruit, sometimes makes wine",
  lemon: "Sour yellow fruit",
  flame: "Hot and bright, not just a vibe",
  wrist: "Between hand and arm",
  glass: "Clear material you can see through",
  mouse: "Tiny squeaker or computer buddy",
  chair: "You sit on it. Hopefully comfy.",
  blaze: "Big fire, sounds cool",
  drain: "Where water disappears",
  quiet: "Not loud at all",
  speak: "Use your voice",
  storm: "Rain + thunder = ⚡️",
  water: "Clear, drinkable life juice",
  beach: "Sand, waves, good vibes"
};

// 🔀 Pick a random word and hint
const randomWord = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
const WORD = randomWord.toUpperCase();
const HINT = HINTS[randomWord] || "No hint available 🤷";

let currentRow = 0;
let currentGuess = "";

const rows = 6;
const cols = 5;

const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");
const hintBox = document.getElementById("hint");
hintBox.textContent = `Hint: ${HINT}`;

// Build grid
for (let r = 0; r < rows * cols; r++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  grid.appendChild(cell);
}

// Build keyboard
const keys = [
  ..."QWERTYUIOP",
  ..."ASDFGHJKL",
  "Enter", ..."ZXCVBNM", "←"
];

keys.forEach(k => {
  const key = document.createElement("button");
  key.textContent = k;
  key.classList.add("key");
  if (k === "Enter" || k === "←") key.classList.add("wide");
  key.addEventListener("click", () => handleKey(k));
  keyboard.appendChild(key);
});

// Listen to physical keyboard
document.addEventListener("keydown", (e) => {
  let key = e.key.toUpperCase();
  if (key === "BACKSPACE") key = "←";
  if (key === "ENTER" || /^[A-Z]$/.test(key) || key === "←") {
    handleKey(key);
  }
});

function handleKey(key) {
  if (key === "Enter") {
    if (currentGuess.length !== 5) return;

    const guess = currentGuess.toUpperCase();
    checkGuess(guess);
    currentGuess = "";
    currentRow++;
  } else if (key === "←") {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      updateCell(currentRow, currentGuess.length, "");
    }
  } else if (/^[A-Z]$/.test(key)) {
    if (currentGuess.length < 5) {
      updateCell(currentRow, currentGuess.length, key);
      currentGuess += key;
    }
  }
}

function updateCell(row, col, letter) {
  const index = row * cols + col;
  const cell = grid.children[index];
  cell.textContent = letter;
}

function checkGuess(guess) {
  const guessLetters = guess.split("");
  const wordLetters = WORD.split("");
  const result = Array(5).fill("absent");

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === wordLetters[i]) {
      result[i] = "correct";
      wordLetters[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const idx = wordLetters.indexOf(guessLetters[i]);
    if (idx !== -1) {
      result[i] = "present";
      wordLetters[idx] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    const index = currentRow * cols + i;
    const cell = grid.children[index];
    cell.classList.add(result[i]);
  }

  if (guess === WORD) {
    setTimeout(() => alert("🎉 You got it!"), 200);
  } else if (currentRow === 5) {
    setTimeout(() => alert(`💀 Game over. The word was ${WORD}`), 200);
  }
}
