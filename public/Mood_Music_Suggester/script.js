document.addEventListener("DOMContentLoaded", function () {
  const moodToVideo = {
    energetic: "https://www.youtube.com/embed/8afBXZawfQw", // Energetic
    sad: "https://www.youtube.com/embed/z-diRlyLGzo", // Sad
    romantic: "https://www.youtube.com/embed/M5JlyBqdyWA",    // Romantic
    happy: "https://www.youtube.com/embed/l2dL5SN5jO4",  // Happy
    relaxed: "https://www.youtube.com/embed/I3OJUwILelU"
    
  };

  const moodSelect = document.getElementById("mood-select");
  const suggestBtn = document.getElementById("suggest-btn");
  const videoFrame = document.getElementById("video-frame");

  suggestBtn.addEventListener("click", function () {
    const selectedMood = moodSelect.value;

    if (moodToVideo[selectedMood]) {
      // Embed the video using iframe-compatible format
      videoFrame.src = `${moodToVideo[selectedMood]}?autoplay=1&rel=0`;
    } else {
      videoFrame.src = "";
      alert("Please select a mood from the list.");
    }
  });
});
