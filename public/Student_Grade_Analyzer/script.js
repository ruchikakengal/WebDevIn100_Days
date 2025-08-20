const form = document.getElementById("marksForm");
const results = document.getElementById("results");
const displayName = document.getElementById("displayName");
const gpaSpan = document.getElementById("gpa");
const gradeSpan = document.getElementById("grade");
const subjectsContainer = document.getElementById("subjectsContainer");
const addSubject = document.getElementById("addSubject");
const themeToggle = document.getElementById("themeToggle");
const themeInfo = document.getElementById("themeInfo");

let chart; // global for Chart.js

addSubject.addEventListener("click", () => {
  const entry = document.createElement("div");
  entry.className = "subject-entry";
  entry.innerHTML = `
    <input type="text" placeholder="Subject Name" class="subjectName" required />
    <input type="number" placeholder="Marks" class="subjectMark" min="0" max="100" required />
  `;
  subjectsContainer.appendChild(entry);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentName = document.getElementById("studentName").value;
  const subjectNames = [...document.querySelectorAll(".subjectName")].map(i => i.value.trim());
  const subjectMarks = [...document.querySelectorAll(".subjectMark")].map(i => parseInt(i.value));

  if (subjectNames.length !== subjectMarks.length || subjectNames.includes("") || subjectMarks.some(isNaN)) {
    alert("Please fill out all subjects and marks.");
    return;
  }

  const total = subjectMarks.reduce((sum, val) => sum + val, 0);
  const avg = total / subjectMarks.length;
  const gpa = (avg / 10).toFixed(2);

  let grade = "";
  if (avg >= 90) grade = "A+";
  else if (avg >= 80) grade = "A";
  else if (avg >= 70) grade = "B";
  else if (avg >= 60) grade = "C";
  else if (avg >= 50) grade = "D";
  else grade = "F";

  displayName.textContent = studentName;
  gpaSpan.textContent = gpa;
  gradeSpan.textContent = grade;
  results.classList.remove("hidden");

  // Draw bar graph
  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy(); // Clear old chart

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: subjectNames,
      datasets: [{
        label: "Marks",
        data: subjectMarks,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Marks"
          }
        },
        x: {
          title: {
            display: true,
            text: "Subjects"
          }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: `Performance Graph of ${studentName}`
        }
      }
    }
  });
});

// Toggle Theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeInfo.textContent = document.body.classList.contains("dark") ? "Dark Mode" : "Light Mode";
});
