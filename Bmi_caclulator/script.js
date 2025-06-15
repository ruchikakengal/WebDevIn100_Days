window.onload = function () {
  loadHistory();
  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
    document.getElementById("darkToggle").checked = true;
  }
};

// Toggle between metric and imperial inputs
function toggleUnits() {
  const isImperial = document.getElementById("unitToggle").checked;
  document.getElementById("metricInputs").style.display = isImperial ? "none" : "block";
  document.getElementById("imperialInputs").style.display = isImperial ? "block" : "none";
  clearFields();
}

function toggleDarkMode() {
  const isDark = document.getElementById("darkToggle").checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("dark", isDark);
}

function calculateBMI() {
  const isImperial = document.getElementById("unitToggle").checked;
  let bmi = 0;

  if (!isImperial) {
    const heightCm = parseFloat(document.getElementById("heightCm").value);
    const weightKg = parseFloat(document.getElementById("weightKg").value);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      showResult("Please enter valid height and weight.", true);
      return;
    }

    const heightM = heightCm / 100;
    bmi = weightKg / (heightM * heightM);
  } else {
    const feet = parseFloat(document.getElementById("heightFt").value);
    const inches = parseFloat(document.getElementById("heightIn").value);
    const weightLb = parseFloat(document.getElementById("weightLb").value);

    const totalInches = (feet * 12) + inches;

    if (!feet || !inches || !weightLb || totalInches <= 0 || weightLb <= 0) {
      showResult("Please enter valid height and weight.", true);
      return;
    }

    bmi = (weightLb / (totalInches * totalInches)) * 703;
  }

  const roundedBMI = bmi.toFixed(1);
  const category = getBMICategory(bmi);
  const message = `Your BMI is ${roundedBMI} (${category})`;
  showResult(message, false);
  saveToHistory(roundedBMI, category);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal weight";
  if (bmi < 29.9) return "Overweight";
  return "Obese";
}

function showResult(msg, isError) {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = msg;
  resultDiv.style.color = isError ? "red" : "var(--text-color)";
}

function clearFields() {
  ["heightCm", "weightKg", "heightFt", "heightIn", "weightLb"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("result").textContent = "";
}

// --- History Handling ---
function saveToHistory(bmi, category) {
  const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  history.unshift({ bmi, category, date: new Date().toLocaleString() });
  localStorage.setItem("bmiHistory", JSON.stringify(history.slice(0, 10))); // Limit to 10
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("bmiHistory") || "[]");
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.date} — BMI: ${entry.bmi} (${entry.category})`;
    list.appendChild(li);
  });
}

