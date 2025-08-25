// Toggle dark/light mode
const modeToggle = document.getElementById('modeToggle');
modeToggle.addEventListener('change', function(){
  document.body.classList.toggle('dark', this.checked);
});

// Show image preview
function showImage(event) {
  const file = event.target.files[0];
  const previewBox = document.getElementById('previewBox');
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewBox.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" />`;
    };
    reader.readAsDataURL(file);
  } else {
    previewBox.innerHTML = "";
  }
}

// Dummy emotion detection (replace with real API call)
function detectEmotions() {
  const file = document.getElementById('imageInput').files[0];
  const resultBox = document.getElementById('result');
  if (!file) {
    resultBox.innerHTML = "Please upload an image!";
    return;
  }
  // Simulate loading
  resultBox.innerHTML = "<span style='font-style:italic'>Detecting emotions...</span>";
  setTimeout(() => {
    // Demo result, replace with real API integration
    resultBox.innerHTML = `
      <div style="font-size:2.1em; margin-bottom: 10px;">😃</div>
      <strong>Emotion Detected: Happy</strong><br/>
      <span style="font-size:0.94em; color:gray;">(demo — connect to API for real detection)</span>
    `;
  }, 1200);
}
