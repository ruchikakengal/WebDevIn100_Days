const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing speed is calculated in words per minute.",
  "Practice makes perfect, especially in coding.",
  "JavaScript powers the dynamic behavior of websites.",
  "Fast typing helps you become a more productive developer.",
  "Debugging is like being the detective in a crime movie where you are also the murderer."
];

const quoteEl = document.getElementById("quote");
const typedEl = document.getElementById("typed-text");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let quote = "";
let startTime = null;
let interval = null;
let isTypingStarted = false;

function loadRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  quote = quotes[index];
  quoteEl.textContent = quote;
}

function startTest() {
  loadRandomQuote();
  typedEl.value = "";
  typedEl.disabled = false;
  typedEl.focus();
  startBtn.disabled = true;
  restartBtn.disabled = false;
  timerEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100";
  isTypingStarted = false;
}

function updateStats() {
  const typed = typedEl.value;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerEl.textContent = elapsed;

  const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = Math.round((wordsTyped / elapsed) * 60);
  wpmEl.textContent = isFinite(wpm) ? wpm : "0";

  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === quote[i]) correctChars++;
  }
  const accuracy = Math.round((correctChars / quote.length) * 100);
  accuracyEl.textContent = isFinite(accuracy) ? accuracy : "100";

  if (typed.trim() === quote.trim()) {
    clearInterval(interval);
    typedEl.disabled = true;
  }
}

typedEl.addEventListener("input", () => {
  if (!isTypingStarted) {
    startTime = Date.now();
    interval = setInterval(updateStats, 1000);
    isTypingStarted = true;
  }
  updateStats();
});

startBtn.addEventListener("click", startTest);

restartBtn.addEventListener("click", () => {
  clearInterval(interval);
  startTest();
});
