// Game state
let gameState = {
    score: 0,
    streak: 0,
    currentWord: null,
    scrambledWord: '',
    timer: 60,
    timerInterval: null,
    gameActive: false,
    wordsSolved: 0
};

// Word database with hints
const wordDatabase = [
    { word: "elephant", hint: "The largest land animal" },
    { word: "astronaut", hint: "They travel to space" },
    { word: "butterfly", hint: "A colorful flying insect" },
    { word: "mountain", hint: "A tall natural elevation" },
    { word: "computer", hint: "An electronic device for processing data" },
    { word: "rainbow", hint: "A colorful arc in the sky after rain" },
    { word: "dinosaur", hint: "Extinct prehistoric reptiles" },
    { word: "basketball", hint: "A sport played with an orange ball" },
    { word: "pizza", hint: "A popular Italian dish with cheese" },
    { word: "volcano", hint: "A mountain that can erupt with lava" },
    { word: "guitar", hint: "A stringed musical instrument" },
    { word: "dolphin", hint: "An intelligent marine mammal" },
    { word: "library", hint: "A place filled with books" },
    { word: "sunflower", hint: "A tall yellow flower that follows the sun" },
    { word: "bicycle", hint: "A two-wheeled vehicle you pedal" },
    { word: "diamond", hint: "A precious gemstone" },
    { word: "fireworks", hint: "Colorful explosions in the sky" },
    { word: "telescope", hint: "A device to see distant objects" },
    { word: "chocolate", hint: "A sweet treat made from cocoa" },
    { word: "waterfall", hint: "Water falling from a height" },
    { word: "penguin", hint: "A flightless bird that lives in cold places" },
    { word: "umbrella", hint: "Protection from rain" },
    { word: "lighthouse", hint: "A tower that guides ships at sea" },
    { word: "carnival", hint: "A festive celebration with rides" },
    { word: "treasure", hint: "Hidden valuable items" },
    { word: "snowflake", hint: "A unique ice crystal" },
    { word: "rainforest", hint: "A dense tropical forest" },
    { word: "skyscraper", hint: "A very tall building" },
    { word: "watermelon", hint: "A large green fruit with red inside" }
];

// DOM elements
const elements = {
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    timer: document.getElementById('timer'),
    scrambledWord: document.getElementById('scrambledWord'),
    hintText: document.getElementById('hintText'),
    userInput: document.getElementById('userInput'),
    submitBtn: document.getElementById('submitBtn'),
    startBtn: document.getElementById('startBtn'),
    newWordBtn: document.getElementById('newWordBtn'),
    resultMessage: document.getElementById('resultMessage'),
    gameOverModal: document.getElementById('gameOverModal'),
    finalScore: document.getElementById('finalScore'),
    finalStreak: document.getElementById('finalStreak'),
    wordsSolved: document.getElementById('wordsSolved'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    themeToggle: document.getElementById('themeToggle')
};

// Initialize the game
function init() {
    loadTheme();
    setupEventListeners();
    updateDisplay();
}

// Setup event listeners
function setupEventListeners() {
    elements.startBtn.addEventListener('click', startGame);
    elements.newWordBtn.addEventListener('click', getNewWord);
    elements.submitBtn.addEventListener('click', checkAnswer);
    elements.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    elements.playAgainBtn.addEventListener('click', resetGame);
    elements.themeToggle.addEventListener('click', toggleTheme);
}

// Theme management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Game functions
function startGame() {
    gameState.gameActive = true;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.wordsSolved = 0;
    gameState.timer = 60;
    
    elements.startBtn.style.display = 'none';
    elements.newWordBtn.style.display = 'inline-flex';
    elements.userInput.disabled = false;
    elements.submitBtn.disabled = false;
    
    getNewWord();
    startTimer();
    updateDisplay();
}

function getNewWord() {
    const randomIndex = Math.floor(Math.random() * wordDatabase.length);
    gameState.currentWord = wordDatabase[randomIndex];
    gameState.scrambledWord = scrambleWord(gameState.currentWord.word);
    
    elements.scrambledWord.textContent = gameState.scrambledWord;
    elements.hintText.textContent = gameState.currentWord.hint;
    elements.userInput.value = '';
    elements.userInput.focus();
    
    hideResultMessage();
}

function scrambleWord(word) {
    const letters = word.split('');
    let scrambled = '';
    
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    scrambled = letters.join('');
    
    // Make sure the scrambled word is different from the original
    return scrambled === word ? scrambleWord(word) : scrambled;
}

function checkAnswer() {
    if (!gameState.gameActive) return;
    
    const userAnswer = elements.userInput.value.trim().toLowerCase();
    const correctAnswer = gameState.currentWord.word.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}

function handleCorrectAnswer() {
    gameState.score++;
    gameState.streak++;
    gameState.wordsSolved++;
    
    showResultMessage('Correct! 🎉', 'correct');
    updateDisplay();
    addConfetti();
    
    // Add some delay before showing next word
    setTimeout(() => {
        getNewWord();
    }, 1500);
}

function handleIncorrectAnswer() {
    gameState.streak = 0;
    
    showResultMessage(`Incorrect! The word was "${gameState.currentWord.word}"`, 'incorrect');
    
    // Add some delay before showing next word
    setTimeout(() => {
        getNewWord();
    }, 2000);
}

function showResultMessage(message, type) {
    elements.resultMessage.textContent = message;
    elements.resultMessage.className = `result-message show ${type}`;
}

function hideResultMessage() {
    elements.resultMessage.className = 'result-message';
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        updateDisplay();
        
        if (gameState.timer <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    
    elements.userInput.disabled = true;
    elements.submitBtn.disabled = true;
    elements.newWordBtn.style.display = 'none';
    elements.startBtn.style.display = 'inline-flex';
    
    showGameOverModal();
}

function showGameOverModal() {
    elements.finalScore.textContent = gameState.score;
    elements.finalStreak.textContent = gameState.streak;
    elements.wordsSolved.textContent = gameState.wordsSolved;
    
    elements.gameOverModal.classList.add('show');
}

function resetGame() {
    elements.gameOverModal.classList.remove('show');
    gameState.timer = 60;
    updateDisplay();
}

function updateDisplay() {
    elements.score.textContent = gameState.score;
    elements.streak.textContent = gameState.streak;
    elements.timer.textContent = gameState.timer;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', init);

// Add some fun animations and effects
function addConfetti() {
    // Simple confetti effect for correct answers
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// Add confetti animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


