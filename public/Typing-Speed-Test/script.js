let timer;
let timeLeft;
let isRunning = false;
let currentQuote = "";

// DOM references
const timeSelect = document.getElementById("timeSelect");
const restartBtn = document.getElementById("restartBtn");
const quoteDisplay = document.getElementById("quoteDisplay");
const inputBox = document.getElementById("inputBox");
const timeLeftEl = document.getElementById("timeLeft");
const wpmEl = document.getElementById("wpm");
const cpmEl = document.getElementById("cpm");
const accuracyEl = document.getElementById("accuracy");
const errorsEl = document.getElementById("errors");

// Quotes array (no authors)
const quotes = [
  "The best way to get started is to quit talking and begin doing.",
  "Don't let yesterday take up too much of today.",
  "It's not whether you get knocked down, it's whether you get up.",
  "If you are working on something exciting, it will keep you motivated.",
  "Success is not in what you have, but who you are.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't watch the clock; do what it does. Keep going.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Stay positive, work hard, make it happen.",
  "Do something today that your future self will thank you for.",
  "Don't stop when you're tired. Stop when you're done.",
  "Success doesn't just find you. You have to go out and get it.",
  "The key to success is to focus on goals, not obstacles.",
  "Hard work beats talent when talent doesn't work hard.",
  "Believe you can and you're halfway there."
];

// Fetch random quote from local array
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Set new quote
function setNewQuote() {
  currentQuote = getRandomQuote();
  quoteDisplay.innerText = currentQuote;
  inputBox.value = "";
  inputBox.disabled = false;
  resetStats();
}

// Reset stats
function resetStats() {
  timeLeft = parseInt(timeSelect.value);
  timeLeftEl.textContent = timeLeft + "s";
  wpmEl.textContent = "0";
  cpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  errorsEl.textContent = "0";
  clearInterval(timer);
  isRunning = false;
}

// Start timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

// End test
function endTest() {
  clearInterval(timer);
  inputBox.disabled = true;
}

// Calculate stats on input
inputBox.addEventListener("input", () => {
  startTimer();

  const typedText = inputBox.value;
  const errors = calculateErrors(currentQuote, typedText);

  const cpm = typedText.length;
  const wpm = Math.round((cpm / 5) / ((parseInt(timeSelect.value) - timeLeft) / 60 || 1));
  const accuracy = typedText.length > 0 
    ? Math.max(0, ((typedText.length - errors) / typedText.length) * 100).toFixed(1)
    : 100;

  errorsEl.textContent = errors;
  cpmEl.textContent = cpm;
  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy + "%";
});

// Character-by-character error calculation
function calculateErrors(original, typed) {
  let errors = 0;
  for (let i = 0; i < Math.min(typed.length, original.length); i++) {
    if (typed[i] !== original[i]) errors++;
  }
  return errors;
}

// Restart button
restartBtn.addEventListener("click", () => {
  setNewQuote();
});

// Init
setNewQuote();
