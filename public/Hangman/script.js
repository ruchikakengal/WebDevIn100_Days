// Hangman Game JavaScript
// Clean, well-commented, easy to customize

const wordList = [
  { word: "elephant", category: "Animal", hint: "Largest land mammal" },
  { word: "giraffe", category: "Animal", hint: "Tallest animal" },
  { word: "kangaroo", category: "Animal", hint: "Jumps and has a pouch" },
  { word: "dolphin", category: "Animal", hint: "Intelligent sea mammal" },
  {
    word: "penguin",
    category: "Animal",
    hint: "Bird that can't fly, lives in cold",
  },
  { word: "rhinoceros", category: "Animal", hint: "Has a horn on its nose" },
  {
    word: "alligator",
    category: "Animal",
    hint: "Large reptile, lives in water",
  },
  { word: "cheetah", category: "Animal", hint: "Fastest land animal" },
  { word: "squirrel", category: "Animal", hint: "Loves nuts, bushy tail" },
  { word: "ostrich", category: "Animal", hint: "Largest bird, can't fly" },
  {
    word: "pineapple",
    category: "Fruit",
    hint: "Tropical fruit, spiky outside",
  },
  {
    word: "strawberry",
    category: "Fruit",
    hint: "Red fruit with seeds outside",
  },
  {
    word: "watermelon",
    category: "Fruit",
    hint: "Big green fruit, red inside",
  },
  {
    word: "blueberry",
    category: "Fruit",
    hint: "Small blue fruit, used in muffins",
  },
  { word: "mango", category: "Fruit", hint: "King of fruits in India" },
  { word: "papaya", category: "Fruit", hint: "Orange tropical fruit" },
  {
    word: "apricot",
    category: "Fruit",
    hint: "Small orange fruit, fuzzy skin",
  },
  {
    word: "coconut",
    category: "Fruit",
    hint: "Hard shell, white inside, tropical",
  },
  {
    word: "kiwifruit",
    category: "Fruit",
    hint: "Brown fuzzy outside, green inside",
  },
  {
    word: "pomegranate",
    category: "Fruit",
    hint: "Red fruit, many seeds inside",
  },
  {
    word: "brazil",
    category: "Country",
    hint: "Largest country in South America",
  },
  {
    word: "canada",
    category: "Country",
    hint: "Second largest country, maple leaf",
  },
  { word: "germany", category: "Country", hint: "Country of beer and cars" },
  {
    word: "australia",
    category: "Country",
    hint: "Country and continent, kangaroos",
  },
  { word: "sweden", category: "Country", hint: "Scandinavian, IKEA" },
  { word: "egypt", category: "Country", hint: "Pyramids and Nile" },
  { word: "japan", category: "Country", hint: "Land of the rising sun" },
  {
    word: "finland",
    category: "Country",
    hint: "Northern Europe, lots of lakes",
  },
  { word: "mexico", category: "Country", hint: "Tacos and sombreros" },
  {
    word: "turkey",
    category: "Country",
    hint: "Country in both Europe and Asia",
  },
];

const maxWrong = 6;
let chosenWord = "";
let chosenCategory = "";
let chosenHint = "";
let guessedLetters = [];
let wrongLetters = [];
let gameActive = true;

const wordArea = document.querySelector(".word-area");
const wrongLettersDiv = document.getElementById("wrong-letters");
const keyboardDiv = document.querySelector(".keyboard");
const restartBtn = document.getElementById("restart-btn");
const gameMessage = document.getElementById("game-message");
const hangmanSVG = document.getElementById("hangman-svg");
const confettiCanvas = document.getElementById("confetti-canvas");
const hintBtn = document.getElementById("hint-btn");
const hintText = document.getElementById("hint-text");

// Google Fonts loaded via HTML

// Utility: pick random word object
function pickWordObj() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

// Draw hangman step-by-step using SVG
function drawHangman(wrongCount) {
  hangmanSVG.innerHTML = "";
  // Base
  hangmanSVG.innerHTML +=
    '<line x1="20" y1="230" x2="180" y2="230" stroke="#a084e8" stroke-width="6" />';
  // Pole
  hangmanSVG.innerHTML +=
    '<line x1="60" y1="230" x2="60" y2="40" stroke="#a084e8" stroke-width="6" />';
  hangmanSVG.innerHTML +=
    '<line x1="60" y1="40" x2="140" y2="40" stroke="#a084e8" stroke-width="6" />';
  hangmanSVG.innerHTML +=
    '<line x1="140" y1="40" x2="140" y2="70" stroke="#a084e8" stroke-width="6" />';
  if (wrongCount > 0) {
    // Head
    hangmanSVG.innerHTML +=
      '<circle cx="140" cy="90" r="20" stroke="#a084e8" stroke-width="4" fill="#f7d9e3" />';
    hangmanSVG.innerHTML += '<circle cx="134" cy="86" r="2" fill="#6f61c0" />';
    hangmanSVG.innerHTML += '<circle cx="146" cy="86" r="2" fill="#6f61c0" />';
  }
  if (wrongCount > 1) {
    // Body
    hangmanSVG.innerHTML +=
      '<line x1="140" y1="110" x2="140" y2="170" stroke="#a084e8" stroke-width="4" />';
  }
  if (wrongCount > 2) {
    // Left arm
    hangmanSVG.innerHTML +=
      '<line x1="140" y1="130" x2="110" y2="150" stroke="#a084e8" stroke-width="4" />';
  }
  if (wrongCount > 3) {
    // Right arm
    hangmanSVG.innerHTML +=
      '<line x1="140" y1="130" x2="170" y2="150" stroke="#a084e8" stroke-width="4" />';
  }
  if (wrongCount > 4) {
    // Left leg
    hangmanSVG.innerHTML +=
      '<line x1="140" y1="170" x2="120" y2="210" stroke="#a084e8" stroke-width="4" />';
  }
  if (wrongCount > 5) {
    // Right leg
    hangmanSVG.innerHTML +=
      '<line x1="140" y1="170" x2="160" y2="210" stroke="#a084e8" stroke-width="4" />';
  }
  if (!gameActive && wrongCount >= maxWrong) {
    // Sad face
    hangmanSVG.innerHTML +=
      '<ellipse cx="140" cy="100" rx="8" ry="4" fill="#ff6f91" />';
  }
}

// Display word with underscores and reveal letters
function displayWord() {
  wordArea.innerHTML = "";
  for (let i = 0; i < chosenWord.length; i++) {
    const letter = chosenWord[i];
    const span = document.createElement("span");
    span.classList.add("letter");
    if (letter === " ") {
      span.classList.add("space");
      span.textContent = " ";
    } else if (guessedLetters.includes(letter)) {
      span.textContent = letter.toUpperCase();
      span.classList.add("visible");
    } else {
      span.textContent = "_";
    }
    wordArea.appendChild(span);
  }
}

// Display wrong guesses
function displayWrongLetters() {
  wrongLettersDiv.innerHTML = "";
  wrongLetters.forEach((l) => {
    const span = document.createElement("span");
    span.className = "wrong-letter strike";
    span.textContent = l.toUpperCase();
    wrongLettersDiv.appendChild(span);
  });
}

// Generate on-screen keyboard
function generateKeyboard() {
  keyboardDiv.innerHTML = "";
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  letters.forEach((l) => {
    const btn = document.createElement("button");
    btn.className = "key-btn";
    btn.textContent = l.toUpperCase();
    btn.disabled =
      guessedLetters.includes(l) || wrongLetters.includes(l) || !gameActive;
    btn.addEventListener("click", () => handleGuess(l));
    keyboardDiv.appendChild(btn);
  });
}

// Handle guess
function handleGuess(letter) {
  if (!gameActive) return;
  if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) return;
  if (chosenWord.includes(letter)) {
    guessedLetters.push(letter);
    displayWord();
    checkWin();
  } else {
    wrongLetters.push(letter);
    drawHangman(wrongLetters.length);
    displayWrongLetters();
    checkLose();
  }
  generateKeyboard();
}

// Check win
function checkWin() {
  let won = true;
  for (let l of chosenWord) {
    if (!guessedLetters.includes(l)) {
      won = false;
      break;
    }
  }
  if (won) {
    gameActive = false;
    gameMessage.textContent = "🎉 You Win!";
    showConfetti();
    generateKeyboard();
  }
}

// Check lose
function checkLose() {
  if (wrongLetters.length >= maxWrong) {
    gameActive = false;
    gameMessage.textContent = `😢 Game Over! Word was: ${chosenWord.toUpperCase()}`;
    drawHangman(maxWrong);
    generateKeyboard();
  }
}

// Restart game
function restartGame() {
  const wordObj = pickWordObj();
  chosenWord = wordObj.word;
  chosenCategory = wordObj.category;
  chosenHint = wordObj.hint;
  guessedLetters = [];
  wrongLetters = [];
  gameActive = true;
  gameMessage.textContent = "";
  drawHangman(0);
  displayWord();
  displayWrongLetters();
  generateKeyboard();
  clearConfetti();
  hintText.textContent = "";
  hintText.classList.remove("visible");
  hintBtn.disabled = false;
}

restartBtn.addEventListener("click", () => {
  restartBtn.classList.add("rotating");
  setTimeout(() => restartBtn.classList.remove("rotating"), 600);
  restartGame();
});

// Hint button logic
hintBtn.addEventListener("click", () => {
  hintText.textContent = `${chosenCategory} Hint: ${chosenHint}`;
  hintText.classList.add("visible");
  hintBtn.disabled = true;
});

// Confetti animation
function showConfetti() {
  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  let confetti = [];
  for (let i = 0; i < 80; i++) {
    confetti.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      r: Math.random() * 8 + 4,
      d: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360},80%,80%)`,
    });
  }
  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
      c.y += c.d + Math.sin(frame / 10 + c.x / 50) * 2;
      c.x += Math.sin(frame / 10 + c.y / 50) * 2;
      if (c.y > confettiCanvas.height) c.y = -10;
    });
    frame++;
    if (!gameActive) requestAnimationFrame(animate);
  }
  animate();
}
function clearConfetti() {
  confettiCanvas.width = 0;
  confettiCanvas.height = 0;
}

// Responsive confetti canvas
window.addEventListener("resize", () => {
  if (!gameActive) showConfetti();
});

// Start game on load
window.onload = restartGame;

// Touch support for mobile
keyboardDiv.addEventListener("touchstart", function (e) {
  if (e.target.classList.contains("key-btn")) {
    e.target.click();
  }
});

// Optional: allow physical keyboard input
window.addEventListener("keydown", function (e) {
  if (!gameActive) return;
  const letter = e.key.toLowerCase();
  if (/^[a-z]$/.test(letter)) {
    handleGuess(letter);
  }
});

// Fun restart button animation
const style = document.createElement("style");
style.innerHTML = `.restart-btn.rotating { animation: rotateRestart 0.6s; } @keyframes rotateRestart { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);
