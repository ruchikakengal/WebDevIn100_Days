// DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const againBtn = document.querySelector('.again');
    const checkBtn = document.querySelector('.check');
    const guessInput = document.querySelector('.guess');
    const message = document.querySelector('.message');
    const number = document.querySelector('.number');
    const scoreDisplay = document.querySelector('.score');
    const highscoreDisplay = document.querySelector('.highscore');
    const body = document.body;

    // Game state
    let secretNumber = Math.trunc(Math.random() * 20) + 1;
    let score = 20;
    let highscore = 0;
    let gameOver = false;

    // Theme functionality
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('light-theme');
      if (body.classList.contains('light-theme')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    });

    // Game functionality
    function displayMessage(msg) {
      message.textContent = msg;
    }

    function createConfetti() {
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);
        
        // Remove confetti after animation completes
        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }
    }

    checkBtn.addEventListener('click', function() {
      if (gameOver) return;
      
      const guess = Number(guessInput.value);
      
      // No input
      if (!guess) {
        displayMessage('⛔ No number!');
        return;
      }
      
      // Wrong guess
      if (guess !== secretNumber) {
        if (score > 1) {
          displayMessage(guess > secretNumber ? '📈 Too high!' : '📉 Too low!');
          score--;
          scoreDisplay.textContent = score;
        } else {
          displayMessage('💥 You lost the game!');
          scoreDisplay.textContent = '0';
          gameOver = true;
          number.textContent = secretNumber;
          number.style.background = '#e74c3c';
        }
        return;
      }
      
      // Correct guess
      displayMessage('🎉 Correct Number!');
      number.textContent = secretNumber;
      number.style.background = '#2ecc71';
      document.body.style.background = body.classList.contains('light-theme') ? '#d4f7d4' : '#1a472a';
      
      // Create confetti effect
      createConfetti();
      
      // Highscore update
      if (score > highscore) {
        highscore = score;
        highscoreDisplay.textContent = highscore;
      }
      
      gameOver = true;
    });

    againBtn.addEventListener('click', function() {
      // Reset game state
      score = 20;
      secretNumber = Math.trunc(Math.random() * 20) + 1;
      gameOver = false;
      
      // Reset displays
      displayMessage('Start guessing...');
      scoreDisplay.textContent = score;
      number.textContent = '?';
      guessInput.value = '';
      
      // Reset styles
      number.style.background = '';
      document.body.style.background = body.classList.contains('light-theme') ? '#f0f8ff' : '#1a1a2e';
    });

    // Allow pressing Enter to submit guess
    guessInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkBtn.click();
      }
    });

    // Focus on input when page loads
    window.addEventListener('load', function() {
      guessInput.focus();
    });