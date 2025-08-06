let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let laps = [];

const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

function timeToString(time) {
  const totalMs = Math.abs(time);
  
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = Math.floor(totalMs % 1000);

  const formattedHours = hours > 0 ? hours.toString().padStart(2, '0') + ':' : '';
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMs = milliseconds.toString().padStart(3, '0');

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}.${formattedMs}`;
}

function updateDisplay() {
  timeDisplay.textContent = timeToString(elapsedTime);
}

function start() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
  
  showButton('PAUSE');
}

function pause() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  showButton('START');
}

function reset() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  elapsedTime = 0;
  laps = [];
  updateDisplay();
  renderLaps();
  showButton('START');
}

function lap() {
  if (elapsedTime > 0) {
    laps.push(elapsedTime);
    renderLaps();
  }
}

function renderLaps() {
  if (laps.length === 0) {
    lapsList.innerHTML = '<div class="empty-state">No laps recorded yet</div>';
    return;
  }
  
  lapsList.innerHTML = '';
  laps.forEach((lapTime, index) => {
    const lapElement = document.createElement('div');
    lapElement.classList.add('lap');
    
    const lapNumber = document.createElement('span');
    lapNumber.classList.add('lap-number');
    lapNumber.textContent = `Lap ${index + 1}`;
    
    const lapTimeSpan = document.createElement('span');
    lapTimeSpan.classList.add('lap-time');
    lapTimeSpan.textContent = timeToString(lapTime);
    
    lapElement.appendChild(lapNumber);
    lapElement.appendChild(lapTimeSpan);
    
    // Add to the beginning for reverse chronological order
    lapsList.insertBefore(lapElement, lapsList.firstChild);
  });
}

function showButton(buttonKey) {
  const hasElapsedTime = elapsedTime > 0;
  
  switch(buttonKey) {
    case 'START':
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = !hasElapsedTime;
      lapBtn.disabled = !hasElapsedTime;
      break;
    case 'PAUSE':
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      resetBtn.disabled = false;
      lapBtn.disabled = false;
      break;
  }
}

// Event listeners with proper cleanup
function addEventListeners() {
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);
  lapBtn.addEventListener('click', lap);
}

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Prevent shortcuts when typing in input fields
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return;
  }
  
  switch(event.code) {
    case 'Space':
      event.preventDefault();
      if (!startBtn.disabled) {
        start();
      } else if (!pauseBtn.disabled) {
        pause();
      }
      break;
    case 'KeyR':
      event.preventDefault();
      if (!resetBtn.disabled) {
        reset();
      }
      break;
    case 'KeyL':
      event.preventDefault();
      if (!lapBtn.disabled) {
        lap();
      }
      break;
  }
});

// Initialize
addEventListeners();
updateDisplay();
showButton('START');

// Cleanup function for proper resource management
window.addEventListener('beforeunload', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});