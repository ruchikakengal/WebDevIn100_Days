let launchDate = null;

document.getElementById("setTimerBtn").addEventListener("click", function () {
  const input = document.getElementById("dateInput").value;
  if (!input) {
    alert("Please select a valid date and time.");
    return;
  }
  launchDate = new Date(input).getTime();
});

function updateCountdown() {
  const now = new Date().getTime();

  if (!launchDate || isNaN(launchDate)) {
    document.getElementById("countdown").innerText = "0 Days, 0 Hours, 0 Minutes, 0 Seconds";
    return;
  }

  const distance = launchDate - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerText = "🎉 Event has started!";
    document.querySelector(".banner h1").innerText = "✅ Launched";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerText = `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
}

// Run the countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();