// Helper to get the editable div
const textInput = document.getElementById("text-input");

function getText() {
  return textInput.innerText;
}

function setText(newText) {
  textInput.innerText = newText;
  updatePreviewAndSummary();
}

// 1. UPPERCASE
function convertToUpper() {
  setText(getText().toUpperCase());
}

// 2. lowercase
function convertToLower() {
  setText(getText().toLowerCase());
}

// 3. Remove Spaces
function removeSpaces() {
  setText(getText().replace(/\s+/g, ' ').trim());
}

// 4. Copy
function copyText() {
  navigator.clipboard.writeText(getText()).then(() => alert("Copied!"));
}

// 5. Clear
function clearText() {
  setText("");
}

// 6. Speak
function SpeakText() {
  const msg = new SpeechSynthesisUtterance(getText());
  speechSynthesis.speak(msg);
}

// 7-9. Formatting
function wrapSelectedText(tag) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const wrapper = document.createElement(tag);
  range.surroundContents(wrapper);
  updatePreviewAndSummary();
}

function makeBold() {
  textInput.classList.toggle("bold-text");
}

function makeItalic() {
  textInput.classList.toggle("italic-text");
}
function makeUnderline() {
   textInput.classList.toggle("underline-text");
}


// 10. Aestheticify
function aestheticifyText() {
  let newText = getText().split('').join(' ');
  setText(newText);
}

// 11. Date Extractor
function extractDates() {
  const regex = /\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g;
  const matches = getText().match(regex);
  alert(matches ? matches.join("\n") : "No dates found");
}

// 12. Capitalize First Letters
function capitalizeFirstLetters() {
  let newText = getText().replace(/\b\w/g, char => char.toUpperCase());
  setText(newText);
}

// 13. Palindrome Checker
function checkPalindrome() {
  const text = getText().toLowerCase().replace(/[^a-z0-9]/g, "");
  const isPalindrome = text === text.split("").reverse().join("");
  alert(isPalindrome ? "It's a palindrome!" : "Not a palindrome.");
}

// 14-15 Undo/Redo
let history = [], redoStack = [];

function saveState() {
  history.push(getText());
  if (history.length > 50) history.shift(); // limit
}

function undoAction() {
  if (history.length) {
    redoStack.push(getText());
    setText(history.pop());
  }
}

function redoAction() {
  if (redoStack.length) {
    saveState();
    setText(redoStack.pop());
  }
}

function searchAndHighlight() {
  const inputText = document.getElementById("text-input");
  const searchWord = document.getElementById("search-word").value.trim().toLowerCase();

  const originalText = inputText.innerText;
  if (!searchWord) {
    inputText.innerHTML = originalText; // Reset
    alert("Please enter a word to search.");
    return;
  }

  const regex = new RegExp(`(${searchWord})`, "gi");
  const matches = originalText.match(regex);

  if (matches) {
    const highlightedText = originalText.replace(regex, `<mark>$1</mark>`);
    inputText.innerHTML = highlightedText;
  } else {
    alert("❌ Word not found!");
    inputText.innerHTML = originalText; // Reset to original if not found
  }
}


// Word, character count, reading time, preview
function updatePreviewAndSummary() {
  const text = getText();
  document.getElementById("word-count").innerText = `Words: ${text.trim().split(/\s+/).filter(Boolean).length}`;
  document.getElementById("char-count").innerText = `Characters: ${text.length}`;
  document.getElementById("reading-time").innerText = `Reading Time: ${Math.ceil(text.length / 200)} mins`;
  document.getElementById("preview-text").innerText = text || "Nothing to preview";
}

// Save initial state
textInput.addEventListener("input", saveState);
textInput.addEventListener("input", updatePreviewAndSummary);
document.addEventListener("DOMContentLoaded", () => {
  saveState();
  updatePreviewAndSummary();
});
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// 🔁 1. Check localStorage and apply mode on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    enableDarkMode();
  }
});

// 🔄 2. Toggle Theme and Save to localStorage
themeToggle.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

// ✅ Enable Dark Mode
function enableDarkMode() {
  body.classList.add("dark-mode");
  document.querySelector(".navbar").classList.add("dark-mode");
  document.getElementById("text-input").classList.add("dark-mode");

  document.querySelectorAll("button").forEach((btn) => {
    btn.classList.add("dark-mode");
  });

  document.querySelectorAll("input").forEach((input) => {
    input.classList.add("dark-mode");
  });

  themeToggle.textContent = "☀️";
  localStorage.setItem("theme", "dark");
}

// 🚫 Disable Dark Mode
function disableDarkMode() {
  body.classList.remove("dark-mode");
  document.querySelector(".navbar").classList.remove("dark-mode");
  document.getElementById("text-input").classList.remove("dark-mode");

  document.querySelectorAll("button").forEach((btn) => {
    btn.classList.remove("dark-mode");
  });

  document.querySelectorAll("input").forEach((input) => {
    input.classList.remove("dark-mode");
  });

  themeToggle.textContent = "🌙";
  localStorage.setItem("theme", "light");
}
document.getElementById("feedback-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const feedbackText = document.getElementById("feedback-text").value.trim();

  if (feedbackText === "") {
    alert("Please enter feedback before submitting.");
    return;
  }

  // Load existing feedbacks or initialize an empty array
  let feedbackList = JSON.parse(localStorage.getItem("feedbacks")) || [];

  // Add new feedback
  feedbackList.push({
    text: feedbackText,
    timestamp: new Date().toLocaleString(),
  });

  // Save back to localStorage
  localStorage.setItem("feedbacks", JSON.stringify(feedbackList));

  alert("🎉 Feedback submitted successfully!");
  document.getElementById("feedback-form").reset();
});