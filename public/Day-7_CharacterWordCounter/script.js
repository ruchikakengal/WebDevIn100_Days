const textarea = document.getElementById("text-input");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");

textarea.addEventListener("input", () => {
  const text = textarea.value;
  charCount.textContent = `Characters: ${text.length}`;

  const words = text.trim().split(/\s+/).filter(word => word !== "");
  wordCount.textContent = `Words: ${words.length}`;
});

clearBtn.addEventListener("click", () => {
  textarea.value = "";
  charCount.textContent = "Characters: 0";
  wordCount.textContent = "Words: 0";
  textarea.focus();
});
