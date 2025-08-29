let isRunning = false;
let playerScore;
let livesRemaining;
let dropRate;
let gameInterval;
const fruitTypes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

$(function () {
  // Show initial welcome screen
  $("#front").show();

  // Handle game start or reset
  $("#startReset").click(function () {
    if (isRunning) {
      // Reload to reset game
      window.location.reload();
    } else {
      // Initiate new game
      $("#front").hide();
      $("#score").show();
      isRunning = true;
      playerScore = 0;
      $("#scoreValue").html(playerScore);

      // Display lives
      $("#trialsleft").show();
      livesRemaining = 3;
      updateLives();

      // Hide game over message
      $("#gameOver").hide();

      // Update button text
      $("#startReset").html("Reset Game");

      // Start fruit movement
      startFruitDrop();
    }
  });

  // Handle fruit slicing
  $("#fruit1").mouseover(function () {
    playerScore++;
    $("#scoreValue").html(playerScore);

    // Stop current fruit
    clearInterval(gameInterval);

    // Animate slice effect
    $("#fruit1").hide("explode", 500);

    // Trigger next fruit after delay
    setTimeout(startFruitDrop, 500);
  });

  // Helper functions

  // Update lives display
  function updateLives() {
    $("#trialsleft").empty();
    for (let i = 0; i < livesRemaining; i++) {
      $("#trialsleft").append(
        '<img src="https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/wrong.png" class="life">'
      );
    }
  }

  // Begin fruit dropping sequence
  function startFruitDrop() {
    $("#fruit1").show();
    selectFruit();
    $("#fruit1").css({
      left: Math.round(550 * Math.random()),
      top: -50,
    });
    dropRate = 1 + Math.round(5 * Math.random());

    gameInterval = setInterval(function () {
      $("#fruit1").css("top", $("#fruit1").position().top + dropRate);

      // Check if fruit is too low
      if ($("#fruit1").position().top > $("#fruitcontainer").height() - 50) {
        if (livesRemaining > 1) {
          // Spawn new fruit
          $("#fruit1").show();
          selectFruit();
          $("#fruit1").css({
            left: Math.round(550 * Math.random()),
            top: -50,
          });
          dropRate = 1 + Math.round(5 * Math.random());
          livesRemaining--;
          updateLives();
        } else {
          // End game
          isRunning = false;
          $("#score").hide();
          $("#startReset").html("Start Game");
          $("#gameOver").show();
          $("#gameOver").html(
            "<p>Game Over!</p><p>Your score: " + playerScore + "</p>"
          );

          // Save to leaderboard
          saveScore(playerScore);

          $("#trialsleft").hide();
          stopFruitDrop();
        }
      }
    }, 10);
  }

  // Choose random fruit image
  function selectFruit() {
    $("#fruit1").attr(
      "src",
      "https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/" +
      fruitTypes[Math.round(9 * Math.random())] +
      ".png"
    );
  }

  // Halt fruit movement
  function stopFruitDrop() {
    clearInterval(gameInterval);
    $("#fruit1").hide();
  }

  // ----- Leaderboard Functions -----

  // Save score to leaderboard (top 5 stored in localStorage)
  function saveScore(score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push(score);

    // Sort descending & keep top 5
    leaderboard.sort((a, b) => b - a);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard();
  }

  // Display leaderboard on screen
  function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    $("#leaderboardList").empty();
    leaderboard.forEach((s, i) => {
      $("#leaderboardList").append(`<li>#${i + 1} - ${s} pts</li>`);
    });
  }

  // Call this at page load
  displayLeaderboard();

  // Toggle leaderboard visibility
  $("#showLeaderboardBtn").click(function () {
    $("#leaderboard").fadeToggle(500);
    // Update text on button
    if ($("#leaderboard").is(":visible")) {
      $(this).text("Hide Leaderboard");
    } else {
      $(this).text("Show Leaderboard");
    }
  });

  // Leaderboard modal controls
  $("#showLeaderboardBtn").click(function () {
    $("#leaderboardModal").fadeIn(300).css("display", "flex");
  });

  $("#closeLeaderboard").click(function () {
    $("#leaderboardModal").fadeOut(300);
  });

  // Close modal when clicking outside content
  $(window).click(function (e) {
    if ($(e.target).is("#leaderboardModal")) {
      $("#leaderboardModal").fadeOut(300);
    }
  });

});