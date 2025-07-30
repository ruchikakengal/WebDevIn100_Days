// --- Timer Logic ---
let timerInterval;
let timerMode = 'pomodoro';
let durations = { pomodoro: 25, short: 5, long: 15 };
let timeLeft = durations.pomodoro * 60;
let isRunning = false;

const timerLabel = document.getElementById('timer-label');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const tabs = document.querySelectorAll('.tab');

function updateTimerDisplay() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

let quoteInterval = null;
let breakTipInterval = null;
const quotes = [
  "Stay focused and keep going!",
  "Small steps every day lead to big results.",
  "Your only limit is your mind.",
  "Progress, not perfection.",
  "Discipline is the bridge between goals and accomplishment.",
  "You are capable of amazing things."
];
const breakTips = [
  "Stand up and stretch!",
  "Drink a glass of water.",
  "Look away from the screen for a minute.",
  "Take a few deep breaths.",
  "Walk around the room.",
  "Relax your shoulders."
];
const quoteDiv = document.getElementById('quote');
const breakTipDiv = document.getElementById('break-tip');

function clearQuoteAndTipIntervals() {
  if (quoteInterval) clearInterval(quoteInterval);
  if (breakTipInterval) clearInterval(breakTipInterval);
  quoteInterval = null;
  breakTipInterval = null;
}

function showRandomQuote() {
  const idx = Math.floor(Math.random() * quotes.length);
  quoteDiv.textContent = quotes[idx];
  breakTipDiv.textContent = '';
}

function showRandomBreakTip() {
  const idx = Math.floor(Math.random() * breakTips.length);
  breakTipDiv.textContent = breakTips[idx];
  quoteDiv.textContent = '';
}

function startPomodoroQuotes() {
  showRandomQuote();
  clearQuoteAndTipIntervals();
  quoteInterval = setInterval(showRandomQuote, 3 * 60 * 1000);
}

function startBreakTips() {
  showRandomBreakTip();
  clearQuoteAndTipIntervals();
  breakTipInterval = setInterval(showRandomBreakTip, 60 * 1000);
}

// Update setMode to clear intervals and hide quotes/tips
function setMode(mode) {
  timerMode = mode;
  tabs.forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab[data-mode="${mode}"]`).classList.add('active');
  timerLabel.textContent = mode === 'pomodoro' ? 'Focus Time' : (mode === 'short' ? 'Short Break' : 'Long Break');
  timeLeft = durations[mode] * 60;
  updateTimerDisplay();
  stopTimer();
  clearQuoteAndTipIntervals();
  quoteDiv.textContent = '';
  breakTipDiv.textContent = '';
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.textContent = '⏸ Pause';
  if (timerMode === 'pomodoro') {
    startPomodoroQuotes();
  } else {
    startBreakTips();
  }
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      stopTimer();
      clearQuoteAndTipIntervals();
      // Optionally: play sound or show notification
    }
  }, 1000);
}

function stopTimer() {
  isRunning = false;
  startBtn.textContent = '▶ Start';
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  timeLeft = durations[timerMode] * 60;
  updateTimerDisplay();
  clearQuoteAndTipIntervals();
  quoteDiv.textContent = '';
  breakTipDiv.textContent = '';
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => setMode(tab.dataset.mode));
});
startBtn.addEventListener('click', () => {
  if (isRunning) stopTimer();
  else startTimer();
});
resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();

// --- Task Management ---
const taskNameInput = document.getElementById('task-name');
const taskPomodorosInput = document.getElementById('task-pomodoros');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const noTasks = document.getElementById('no-tasks');

let tasks = [];

function renderTasks() {
  tasksList.innerHTML = '';
  if (tasks.length === 0) {
    noTasks.style.display = 'block';
    return;
  }
  noTasks.style.display = 'none';
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${task.name} <small>(${task.pomodoros}x)</small></span>
      <button onclick="removeTask(${idx})" style="background:none;border:none;color:#fff;cursor:pointer;font-size:1.1rem;">✕</button>`;
    tasksList.appendChild(li);
  });
}
window.removeTask = function(idx) {
  tasks.splice(idx, 1);
  renderTasks();
};

addTaskBtn.addEventListener('click', () => {
  const name = taskNameInput.value.trim();
  const pomodoros = parseInt(taskPomodorosInput.value, 10);
  if (!name || pomodoros < 1) return;
  tasks.push({ name, pomodoros });
  taskNameInput.value = '';
  taskPomodorosInput.value = 1;
  renderTasks();
});
renderTasks();

// --- Settings Modal ---
const settingsModal = document.getElementById('settings-modal');
const openSettings = document.getElementById('open-settings');
const closeSettings = document.getElementById('close-settings');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const fontFamilySelect = document.getElementById('font-family');
const colorBtns = document.querySelectorAll('.color-btn');
const customColorInput = document.getElementById('custom-color');
const pomodoroDurationInput = document.getElementById('pomodoro-duration');
const shortDurationInput = document.getElementById('short-duration');
const longDurationInput = document.getElementById('long-duration');
const saveSettingsBtn = document.getElementById('save-settings');

openSettings.addEventListener('click', () => settingsModal.classList.add('show'));
closeSettings.addEventListener('click', () => settingsModal.classList.remove('show'));

let selectedColor = '#f66b6b';

colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    colorBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (btn.dataset.color === 'custom') {
      selectedColor = customColorInput.value;
    } else {
      selectedColor = btn.dataset.color;
    }
    document.documentElement.style.setProperty('--accent', selectedColor);
  });
});

customColorInput.addEventListener('input', (e) => {
  selectedColor = e.target.value;
  document.documentElement.style.setProperty('--accent', selectedColor);
  colorBtns.forEach(b => b.classList.remove('selected'));
  document.querySelector('.color-btn[data-color="custom"]').classList.add('selected');
});

saveSettingsBtn.addEventListener('click', () => {
  // Theme
  if (darkModeToggle.checked) {
    document.body.style.background = '#222';
    document.body.style.color = '#fff';
  } else {
    document.body.style.background = '';
    document.body.style.color = '';
  }
  // Font
  document.body.style.fontFamily = fontFamilySelect.value;
  // Accent
  document.documentElement.style.setProperty('--accent', selectedColor);
  // Durations
  durations.pomodoro = parseInt(pomodoroDurationInput.value, 10);
  durations.short = parseInt(shortDurationInput.value, 10);
  durations.long = parseInt(longDurationInput.value, 10);
  setMode(timerMode);
  settingsModal.classList.remove('show');
});

// Dark mode toggle: add/remove dark-mode class on body
darkModeToggle.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
// Also update theme-toggle in header
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', function() {
  darkModeToggle.checked = this.checked;
  if (this.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

// Close modal on outside click
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) settingsModal.classList.remove('show');
});
