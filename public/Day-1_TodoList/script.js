const taskInput = document.getElementById('taskInput');
const taskDateTime = document.getElementById('taskDateTime');
const taskTag = document.getElementById('taskTag');
const taskList = document.getElementById('taskList');
const modeToggle = document.getElementById('modeToggle');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const nextTaskText = document.getElementById('nextTaskText');
const countdown = document.getElementById('countdown');

let isDarkMode = localStorage.getItem('theme') === 'dark';
document.body.classList.toggle('dark', isDarkMode);
modeToggle.textContent = isDarkMode ? '☀️' : '🌙';

// Sound alert
const alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');

// Request notification permission once on load
if ("Notification" in window) {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

// Store reminder timeout IDs keyed by task unique ID (timestamp + text)
const reminderTimeouts = new Map();

function saveTasks() {
  localStorage.setItem('tasks', taskList.innerHTML);
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    taskList.innerHTML = saved;
    Array.from(taskList.children).forEach(li => {
      updateTaskButtons(li);
      scheduleTaskReminderFromLi(li);
    });
  }
  sortTasks();
}

function updateTaskButtons(li) {
  li.querySelector('[complete-task]')?.addEventListener('click', () => completeTask(li));
  li.querySelector('[edit-task]')?.addEventListener('click', () => editTask(li));
  li.querySelector('[delete-task]')?.addEventListener('click', () => deleteTask(li));
}

modeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  isDarkMode = !isDarkMode;
  modeToggle.textContent = isDarkMode ? '☀️' : '🌙';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  Array.from(taskList.children).forEach(li => {
    if (isDarkMode) li.classList.add('dark');
    else li.classList.remove('dark');
  });
};

addTaskBtn.addEventListener('click', () => {
  if (!taskInput.value.trim()) return;

  const li = document.createElement('li');
  li.className = 'task';
  if (isDarkMode) li.classList.add('dark');

  const due = taskDateTime.value;
  const tag = taskTag.value;
  const dueTime = due ? `⏰ ${new Date(due).toLocaleString()}` : '';
  const dataAttr = due ? `data-datetime="${due}"` : '';
  const tagDisplay = tag ? `<span class='tag'>🏷️ ${tag}</span>` : '';

  li.innerHTML = `
    <span ${dataAttr}>
      <strong>${taskInput.value}</strong>
      <small style="display:block;">${dueTime} ${tagDisplay}</small>
    </span>
    <span>
      <button complete-task aria-label="Complete task">✅</button>
      <button edit-task aria-label="Edit task">✏️</button>
      <button delete-task aria-label="Delete task">🗑️</button>
    </span>
  `;

  updateTaskButtons(li);
  taskList.appendChild(li);
  scheduleTaskReminderFromLi(li);
  saveTasks();
  sortTasks();

  taskInput.value = '';
  taskDateTime.value = '';
  taskTag.value = '';
});

clearTasksBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    // Clear all pending reminders
    reminderTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    reminderTimeouts.clear();

    taskList.innerHTML = '';
    saveTasks();
    updateCountdown();
  }
});

function completeTask(li) {
  li.classList.toggle('completed');
  // Clear reminder if completed
  if (li.classList.contains('completed')) {
    clearReminderTimeout(li);
  } else {
    // If task is marked incomplete again, reschedule reminder
    scheduleTaskReminderFromLi(li);
  }
  saveTasks();
}

function deleteTask(li) {
  clearReminderTimeout(li);
  li.remove();
  saveTasks();
}

function editTask(li) {
  const taskText = li.querySelector('strong');
  const newText = prompt("Edit task:", taskText.textContent);
  if (newText) {
    taskText.textContent = newText;
    saveTasks();
  }
}

function clearReminderTimeout(li) {
  const taskId = getTaskId(li);
  if (taskId && reminderTimeouts.has(taskId)) {
    clearTimeout(reminderTimeouts.get(taskId));
    reminderTimeouts.delete(taskId);
  }
}

function scheduleTaskReminderFromLi(li) {
  clearReminderTimeout(li); // Clear old timeout first

  if (li.classList.contains('completed')) return; // No reminder if completed

  const span = li.querySelector('span[data-datetime]');
  if (!span) return;

  const datetime = span.getAttribute('data-datetime');
  if (!datetime) return;

  const taskText = li.querySelector('strong').textContent;
  const taskId = getTaskId(li);
  const time = new Date(datetime).getTime() - Date.now();
  if (time <= 0) return; // Don't schedule past reminders

  const timeoutId = setTimeout(() => {
    alertSound.play();
    if (Notification.permission === "granted") {
      new Notification('Task Reminder', {
        body: taskText,
        icon: 'https://cdn-icons-png.flaticon.com/512/2331/2331947.png'
      });
    } else {
      alert('⏰ Reminder: ' + taskText);
    }
    reminderTimeouts.delete(taskId);
  }, time);

  reminderTimeouts.set(taskId, timeoutId);
}

function getTaskId(li) {
  // Unique id per task for reminder tracking - combine task text + datetime
  const span = li.querySelector('span[data-datetime]');
  const datetime = span ? span.getAttribute('data-datetime') : '';
  const taskText = li.querySelector('strong').textContent;
  return taskText + '|' + datetime;
}

// Sort tasks by due date/time ascending, tasks without date go last
function sortTasks() {
  const tasks = Array.from(taskList.children);
  tasks.sort((a, b) => {
    const aDate = new Date(a.querySelector('span[data-datetime]')?.getAttribute('data-datetime') || 0);
    const bDate = new Date(b.querySelector('span[data-datetime]')?.getAttribute('data-datetime') || 0);
    if (aDate == 0) return 1;
    if (bDate == 0) return -1;
    return aDate - bDate;
  });
  tasks.forEach(task => taskList.appendChild(task));
  saveTasks();
}

// Get next upcoming task with datetime > now
function getNextTask() {
  const tasks = Array.from(taskList.children);
  const now = new Date();
  let upcoming = null;

  tasks.forEach(li => {
    if (li.classList.contains('completed')) return; // ignore completed

    const span = li.querySelector('span[data-datetime]');
    const datetime = span?.getAttribute('data-datetime');
    if (datetime) {
      const date = new Date(datetime);
      if (date > now && (!upcoming || date < upcoming.time)) {
        upcoming = {
          time: date,
          name: li.querySelector('strong').textContent
        };
      }
    }
  });

  return upcoming;
}

// Update countdown timer every second
function updateCountdown() {
  const next = getNextTask();

  if (next) {
    const now = new Date();
    const diff = next.time - now;
    if (diff <= 0) {
      nextTaskText.textContent = "No upcoming tasks";
      countdown.textContent = "";
      return;
    }
    const seconds = Math.floor(diff / 1000);
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const timeLeft = `${hrs}h ${mins % 60}m ${seconds % 60}s`;

    // Format next.time to include day and month name
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = next.time.toLocaleString(undefined, options);

    nextTaskText.textContent = `${next.name} at ${formattedDate}`;
    countdown.textContent = `⏳ Time left: ${timeLeft}`;
  } else {
    nextTaskText.textContent = "No upcoming tasks";
    countdown.textContent = "";
  }
}

// Keyboard Enter to add task
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTaskBtn.click();
  }
});

loadTasks();
updateCountdown();
setInterval(updateCountdown, 1000);

function setMinDateTime() {
  const now = new Date();
  // Format to "YYYY-MM-DDTHH:MM" (no seconds)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  const minDateTime = `${year}-${month}-${day}T${hour}:${minute}`;
  taskDateTime.min = minDateTime;
}

// Call once on load
setMinDateTime();

// Optional: update min on every focus in case user keeps page open for hours
taskDateTime.addEventListener('focus', setMinDateTime
);