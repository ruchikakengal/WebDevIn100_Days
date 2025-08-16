const form = document.getElementById('trackerForm');
const stepsInput = document.getElementById('steps');
const waterInput = document.getElementById('water');
const toggleModeBtn = document.getElementById('toggleMode');

// Keys to store logs
const STORAGE_KEY = 'fitnessTrackerData';
let trackerData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Chart.js instances
let stepsChart, waterChart;

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  renderCharts();
  applyTheme();

  toggleModeBtn.addEventListener('click', toggleMode);
  form.addEventListener('submit', handleFormSubmit);
});

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const steps = parseInt(stepsInput.value);
  const water = parseInt(waterInput.value);

  // Input validation
  if (isNaN(steps) || isNaN(water) || steps <= 0 || steps > 50000 || water <= 0 || water > 5000) {
    alert("Please enter realistic values:\n- Steps: 1 to 50,000\n- Water: 1 to 5000 ml");
    return;
  }

  const today = new Date().toLocaleDateString();

  // Check if today's entry exists
  const existing = trackerData.find(d => d.date === today);
  if (existing) {
    existing.steps = steps;
    existing.water = water;
  } else {
    trackerData.push({ date: today, steps, water });
  }

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerData));

  // Clear form
  form.reset();

  // Re-render charts
  renderCharts();
}

// Render charts
function renderCharts() {
  const labels = trackerData.map(d => d.date);
  const stepsData = trackerData.map(d => d.steps);
  const waterData = trackerData.map(d => d.water);

  const stepsCtx = document.getElementById('stepsChart').getContext('2d');
  const waterCtx = document.getElementById('waterChart').getContext('2d');

  // Destroy previous charts if exist
  if (stepsChart) stepsChart.destroy();
  if (waterChart) waterChart.destroy();

  stepsChart = new Chart(stepsCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Steps Walked',
        data: stepsData,
        backgroundColor: '#0d6efd',
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  waterChart = new Chart(waterCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Water Intake (ml)',
        data: waterData,
        borderColor: '#20c997',
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Toggle Light/Dark Mode
function toggleMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Apply theme on load
function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
}
