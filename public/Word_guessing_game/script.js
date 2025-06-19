const inputs = document.querySelector(".inputs"),
  hintTag = document.querySelector(".hint span"),
  guessLeft = document.querySelector(".guess-left span"),
  wrongLetter = document.querySelector(".wrong-letter span"),
  resetBtn = document.querySelector(".reset-btn"),
  typingInput = document.querySelector(".typing-input"),
  scoreDisplay = document.getElementById("score"),
  winsDisplay = document.getElementById("wins"),
  lossesDisplay = document.getElementById("losses"),
  hangmanCanvas = document.getElementById("hangman");

let word, maxGuesses, incorrectLetters = [], correctLetters = [];
let score = 0, wins = 0, losses = 0;
const maxParts = 6;

function drawHangman(stage) {
  const ctx = hangmanCanvas.getContext("2d");
  ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);

  // Base
  ctx.strokeStyle = "#4a4e69";
  ctx.lineWidth = 3;
  // Draw gallows
  ctx.beginPath();
  ctx.moveTo(20, 200); ctx.lineTo(160, 200); // base
  ctx.moveTo(50, 200); ctx.lineTo(50, 30); // pole
  ctx.lineTo(120, 30); // top
  ctx.lineTo(120, 50); // rope
  ctx.stroke();

  // Draw hangman parts (head, body, left arm, right arm, left leg, right leg)
  if (stage > 0) { // head
    ctx.beginPath();
    ctx.arc(120, 70, 20, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (stage > 1) { // body
    ctx.beginPath();
    ctx.moveTo(120, 90); ctx.lineTo(120, 140);
    ctx.stroke();
  }
  if (stage > 2) { // left arm
    ctx.beginPath();
    ctx.moveTo(120, 100); ctx.lineTo(95, 120);
    ctx.stroke();
  }
  if (stage > 3) { // right arm
    ctx.beginPath();
    ctx.moveTo(120, 100); ctx.lineTo(145, 120);
    ctx.stroke();
  }
  if (stage > 4) { // left leg
    ctx.beginPath();
    ctx.moveTo(120, 140); ctx.lineTo(100, 180);
    ctx.stroke();
  }
  if (stage > 5) { // right leg
    ctx.beginPath();
    ctx.moveTo(120, 140); ctx.lineTo(140, 180);
    ctx.stroke();
  }
}

function updateScore(points) {
  score += points;
  if (score < 0) score = 0;
  scoreDisplay.textContent = score;
}

function randomWord() {
  let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
  word = ranItem.word;
  maxGuesses = maxParts;
  correctLetters = [];
  incorrectLetters = [];
  hintTag.innerText = ranItem.hint;
  guessLeft.innerText = maxGuesses;
  wrongLetter.innerText = "";
  let html = "";
  for (let i = 0; i < word.length; i++) {
    html += `<input type="text" disabled>`;
  }
  inputs.innerHTML = html;
  drawHangman(0);
}

function initGame(e) {
  let key = e.target.value.toLowerCase();
  if (key.match(/^[a-z]$/) && !incorrectLetters.includes(key) && !correctLetters.includes(key)) {
    if (word.includes(key)) {
      let found = false;
      for (let i = 0; i < word.length; i++) {
        if (word[i] === key) {
          correctLetters.push(key);
          inputs.querySelectorAll("input")[i].value = key;
          found = true;
        }
      }
      if (found) updateScore(10); // +10 for each correct letter
    } else {
      maxGuesses--;
      incorrectLetters.push(key);
      updateScore(-5); // -5 for wrong guess
      drawHangman(maxParts - maxGuesses);
    }
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters.join(", ");
  }
  typingInput.value = "";

  setTimeout(() => {
    let allInputs = inputs.querySelectorAll("input");
    let isWinner = true;
    for (let i = 0; i < word.length; i++) {
      if (allInputs[i].value !== word[i]) {
        isWinner = false;
        break;
      }
    }
    if (isWinner) {
      updateScore(20); // +20 for winning
      wins++;
      winsDisplay.textContent = wins;
      setTimeout(() => {
        alert(`🎉 Congrats! You found the word "${word.toUpperCase()}"`);
        randomWord();
      }, 200);
    } else if (maxGuesses < 1) {
      losses++;
      lossesDisplay.textContent = losses;
      setTimeout(() => {
        alert(`😢 Game over! The word was "${word.toUpperCase()}"`);
        for (let i = 0; i < word.length; i++) {
          allInputs[i].value = word[i];
        }
        drawHangman(maxParts);
      }, 200);
    }
  }, 100);
}

resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());

window.addEventListener("DOMContentLoaded", () => {
  randomWord();
  updateScore(0); // initialize score
});
