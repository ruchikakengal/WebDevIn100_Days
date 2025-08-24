// Morph counters for each facial feature
const features = {
  eyeLeft: 0,
  eyeRight: 0,
  mouth: 0,
  eyebrows: 0,
};
const featureMaxShape = 3;

// Element selectors
const faceParts = {
  eyeLeft: document.getElementById("eye-left"),
  eyeRight: document.getElementById("eye-right"),
  mouth: document.getElementById("mouth"),
  eyebrows: document.getElementById("eyebrows"),
};

// Initial classes
for (const part in faceParts) {
  faceParts[part].classList.add("feature");
  faceParts[part].classList.add(part.toLowerCase());
  faceParts[part].classList.add("shape-0");
}

// Change morph/shape on click & key
function cycleShape(part) {
  features[part]++;
  if (features[part] >= featureMaxShape) features[part] = 0;
  Array.from(faceParts[part].classList).forEach(cls => {
    if (cls.startsWith("shape-")) faceParts[part].classList.remove(cls);
  });
  faceParts[part].classList.add(`shape-${features[part]}`);
}

for (const part in faceParts) {
  faceParts[part].addEventListener("click", () => cycleShape(part));
  faceParts[part].addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cycleShape(part);
    }
  });
}

// Hidden "emotion" the user must match (customize or randomize for each round)
const hiddenEmotion = "happy";

// Feature shape maps for each emotion
const emotionMap = {
  happy:    { eyeLeft: 0, eyeRight: 0, mouth: 0, eyebrows: 0 },
  sad:      { eyeLeft: 1, eyeRight: 1, mouth: 1, eyebrows: 1 },
  angry:    { eyeLeft: 2, eyeRight: 2, mouth: 1, eyebrows: 2 },
  surprised:{ eyeLeft: 2, eyeRight: 2, mouth: 2, eyebrows: 0 },
  neutral:  { eyeLeft: 0, eyeRight: 0, mouth: 0, eyebrows: 1 },
};

const resultMessage = document.getElementById("result-message");
const submitButton = document.getElementById("submit-btn");
const guessSelect = document.getElementById("emotion-guess");

function evaluateGuess() {
  const guess = guessSelect.value;
  if (!guess) {
    resultMessage.textContent = "Please select an emotion to guess.";
    resultMessage.style.color = "#d22";
    return;
  }
  const correctEmotion = guess === hiddenEmotion;
  const featuresMatch =
    features.eyeLeft === emotionMap[hiddenEmotion].eyeLeft &&
    features.eyeRight === emotionMap[hiddenEmotion].eyeRight &&
    features.mouth === emotionMap[hiddenEmotion].mouth &&
    features.eyebrows === emotionMap[hiddenEmotion].eyebrows;
  if (correctEmotion && featuresMatch) {
    resultMessage.textContent = "Correct! You matched the emoji and emotion!";
    resultMessage.style.color = "#0a8";
  } else if (correctEmotion) {
    resultMessage.textContent = "Emotion right, but features don't match.";
    resultMessage.style.color = "#f90";
  } else {
    resultMessage.textContent = "Try again!";
    resultMessage.style.color = "#d22";
  }
}
submitButton.addEventListener("click", evaluateGuess);

// Dark/light mode toggle
const modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode"))
    modeToggle.textContent = "Light Mode";
  else
    modeToggle.textContent = "Dark Mode";
});
