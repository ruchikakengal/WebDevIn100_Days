document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9]([a-zA-Z0-9_-]{1,13}[a-zA-Z0-9])?$/;
    if (regex.test(username)) return true;
    alert("Invalid username");
    return false;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch user details");
      }
      const parseData = await response.json();
      console.log("Logging data:", parseData);
      displayUserData(parseData);
    } catch (error) {
      console.error(error);
      statsContainer.innerHTML = `<p class="error">Data not found</p>`;
      statsContainer.style.display = "block";
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function getTotalSubmissions(submissionCalendar) {
    const values = Object.values(submissionCalendar);
    let totalSubmissions = 0;
    for (let i = 0; i < values.length; i++) {
      totalSubmissions += values[i];
    }
    console.log("Total submissions:", totalSubmissions);
    return totalSubmissions;
  }

  function displayUserData(parseData) {
    const totalQues = parseData.totalQuestions;
    const totalEasyQues = parseData.totalEasy;
    const totalMediumQues = parseData.totalMedium;
    const totalHardQues = parseData.totalHard;
    const solvedTotalQues = parseData.totalSolved;
    const solvedTotalEasyQues = parseData.easySolved;
    const solvedTotalMediumQues = parseData.mediumSolved;
    const solvedTotalHardQues = parseData.hardSolved;

    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle
    );
    updateProgress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle
    );
    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle
    );

    const submissions = parseData.submissionCalendar;
    const cardsData = [
      { label: "Overall Solved", value: parseData.totalSolved },
      { label: "Ranking", value: parseData.ranking },
      { label: "Total Submissions", value: getTotalSubmissions(submissions) },
      { label: "Acceptance Rate", value: `${parseData.acceptanceRate}%` },
      {
        label: "Contribution Points",
        value: parseData.contributionPoints || 0,
      },
      { label: "Reputation", value: parseData.reputation || 0 },
    ];

    cardStatsContainer.innerHTML = cardsData
      .map((data, index) => {
        return `
                        <div class="card" style="animation-delay: ${
                          index * 0.1
                        }s">
                            <h4>${data.label}</h4>
                            <p>${data.value}</p>
                        </div>
                    `;
      })
      .join("");

    statsContainer.style.display = "block";
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Logging username:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
