const previewImage = document.getElementById("previewImage");
const originalImage = document.getElementById("originalImage");
const imageUpload = document.getElementById("imageUpload");
const currentModeText = document.getElementById("currentMode");
const dropZone = document.getElementById("drop-zone");
const viewToggle = document.getElementById("viewToggle");

let originalImageSrc = "";

imageUpload.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      originalImageSrc = reader.result;
      displayImages();
    };
    reader.readAsDataURL(file);
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#d0f0e0";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.backgroundColor = "#f1f8f9";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.backgroundColor = "#f1f8f9";
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function () {
      originalImageSrc = reader.result;
      displayImages();
    };
    reader.readAsDataURL(file);
  }
});

function displayImages() {
  previewImage.src = originalImageSrc;
  originalImage.src = originalImageSrc;

  previewImage.style.display = "block";
  originalImage.style.display = "none";
  applyVision("normal");
  viewToggle.value = "filtered";
  updateView("filtered");
}

function applyVision(type) {
  let filterValue = "none";
  let modeName = "";

  switch (type) {
    case "normal":
      filterValue = "none";
      modeName = "Normal";
      break;
    case "protanopia":
      filterValue =
        "grayscale(20%) sepia(100%) hue-rotate(-50deg) saturate(400%)";
      modeName = "Protanopia";
      break;
    case "deuteranopia":
      filterValue =
        "grayscale(30%) sepia(100%) hue-rotate(-20deg) saturate(300%)";
      modeName = "Deuteranopia";
      break;
    case "tritanopia":
      filterValue =
        "grayscale(40%) sepia(100%) hue-rotate(80deg) saturate(300%)";
      modeName = "Tritanopia";
      break;
    case "achromatopsia":
      filterValue = "grayscale(100%)";
      modeName = "Achromatopsia";
      break;
    case "reset":
      filterValue = "none";
      modeName = "Normal (Reset)";
      break;
  }

  previewImage.style.filter = filterValue;
  currentModeText.innerText = `Current Mode: ${modeName}`;
}

function toggleView(viewType) {
  if (!originalImageSrc) return;

  if (viewType === "filtered") {
    previewImage.style.display = "block";
    originalImage.style.display = "none";
  } else if (viewType === "original") {
    previewImage.style.display = "none";
    originalImage.style.display = "block";
  } else if (viewType === "side-by-side") {
    previewImage.style.display = "block";
    originalImage.style.display = "block";
  }
}

viewToggle.addEventListener("change", (e) => {
  toggleView(e.target.value);
});

function toggleView(viewType) {
    if (!originalImageSrc) return;
  
    const previewSection = document.querySelector(".preview-section");

    previewImage.style.display = "none";
    originalImage.style.display = "none";
    previewSection.classList.remove("side-by-side");
  
    if (viewType === "filtered") {
      previewImage.style.display = "block";
    } else if (viewType === "original") {
      originalImage.style.display = "block";
    } else if (viewType === "side-by-side") {
      previewImage.style.display = "block";
      originalImage.style.display = "block";
      previewSection.classList.add("side-by-side"); 
    }
  }
  