const gameArea = document.getElementById('game-area');
const message = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const lastTimeEl = document.getElementById('last-time');
avgTimeEl = document.getElementById('avg-time');
bestTimeEl = document.getElementById('best-time');

let waiting = false;
let green = false;
let startTime = 0;
let timeoutId = null;
let reactionTimes = [];
let bestTime = null;

// Load from localStorage
function loadStats() {
  const stored = JSON.parse(localStorage.getItem('reflex_stats') || '{}');
  reactionTimes = stored.reactionTimes || [];
  bestTime = stored.bestTime || null;
  updateStats();
}

function saveStats() {
  localStorage.setItem('reflex_stats', JSON.stringify({
    reactionTimes,
    bestTime
  }));
}

function updateStats() {
  if (reactionTimes.length > 0) {
    lastTimeEl.textContent = reactionTimes[reactionTimes.length - 1];
    const avg = Math.round(reactionTimes.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, reactionTimes.length));
    avgTimeEl.textContent = avg;
  } else {
    lastTimeEl.textContent = '–';
    avgTimeEl.textContent = '–';
  }
  bestTimeEl.textContent = bestTime !== null ? bestTime : '–';
}

function setGameAreaState(state) {
  gameArea.classList.remove('active', 'false-start');
  if (state === 'green') gameArea.classList.add('active');
  if (state === 'false') gameArea.classList.add('false-start');
}

function startTest() {
  waiting = true;
  green = false;
  setGameAreaState();
  message.textContent = 'Wait for Green…';
  startBtn.style.display = 'none';
  // Random delay 2-5s
  const delay = 2000 + Math.random() * 3000;
  timeoutId = setTimeout(() => {
    green = true;
    waiting = false;
    setGameAreaState('green');
    message.textContent = 'GO! Tap now!';
    startTime = Date.now();
  }, delay);
}

function handleUserReact(e) {
  // Ignore clicks/taps on the start/try again button
  if (e && e.target === startBtn) return;
  if (waiting && !green) {
    // False start
    clearTimeout(timeoutId);
    setGameAreaState('false');
    message.textContent = '⛔ Too Soon! Wait for green.';
    startBtn.style.display = 'block';
    startBtn.textContent = 'Try Again';
    waiting = false;
    green = false;
    return;
  }
  if (green) {
    const reaction = Date.now() - startTime;
    reactionTimes.push(reaction);
    if (reactionTimes.length > 20) reactionTimes = reactionTimes.slice(-20);
    if (bestTime === null || reaction < bestTime) bestTime = reaction;
    updateStats();
    saveStats();
    setGameAreaState();
    message.textContent = `⏱️ ${reaction} ms!`;
    startBtn.style.display = 'block';
    startBtn.textContent = 'Go Again';
    green = false;
    waiting = false;
  }
}

startBtn.addEventListener('click', startTest);
gameArea.addEventListener('click', handleUserReact);
gameArea.addEventListener('touchstart', function(e) {
  // Prevent 300ms delay on mobile
  e.preventDefault();
  handleUserReact(e);
}, {passive: false});

// Prevent scrolling on mobile during game
window.addEventListener('touchmove', function(e) {
  if (waiting || green) e.preventDefault();
}, {passive: false});

// On load
loadStats();
updateStats(); 