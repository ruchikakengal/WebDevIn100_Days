const form = document.getElementById("bmi-form");
const resultBox = document.getElementById("result-box");
const bmiValue = document.getElementById("bmi-value");
const bmiStatus = document.getElementById("bmi-status");
const themeToggle = document.getElementById("theme-toggle");

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Handle form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const height = parseFloat(document.getElementById("height").value) / 100;
  const weight = parseFloat(document.getElementById("weight").value);

  if (!height || !weight || height <= 0 || weight <= 0) {
    alert("Please enter valid height and weight!");
    return;
  }

  const bmi = (weight / (height * height)).toFixed(2);
  bmiValue.textContent = bmi;

  let status = "";
  if (bmi < 18.5) status = "Underweight";
  else if (bmi < 24.9) status = "Normal weight";
  else if (bmi < 29.9) status = "Overweight";
  else status = "Obese";

  bmiStatus.textContent = status;
  resultBox.classList.remove("hidden");
});
