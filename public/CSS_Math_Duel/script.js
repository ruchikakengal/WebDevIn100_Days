class MathDuelGame {
    constructor() {
        this.gameActive = false;
        this.currentQuestions = { player1: null, player2: null };
        this.scores = { player1: 0, player2: 0 };
        this.positions = { player1: 0, player2: 0 };
        this.maxPosition = 100; // Percentage to win
        this.winner = null;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Game controls
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.gameStatus = document.getElementById('gameStatus');
        
        // Player elements
        this.avatars = {
            player1: document.getElementById('avatar1'),
            player2: document.getElementById('avatar2')
        };
        
        this.trackProgress = {
            player1: document.querySelector('#player1-section .track-progress'),
            player2: document.querySelector('#player2-section .track-progress')
        };
        
        this.questions = {
            player1: document.getElementById('question1'),
            player2: document.getElementById('question2')
        };
        
        this.answers = {
            player1: document.getElementById('answer1'),
            player2: document.getElementById('answer2')
        };
        
        this.feedback = {
            player1: document.getElementById('feedback1'),
            player2: document.getElementById('feedback2')
        };
        
        this.scores = {
            player1: document.getElementById('score1'),
            player2: document.getElementById('score2')
        };
        
        // Modal
        this.winnerModal = document.getElementById('winnerModal');
        this.winnerText = document.getElementById('winnerText');
        this.winnerDetails = document.getElementById('winnerDetails');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        // Confetti
        this.confettiContainer = document.getElementById('confettiContainer');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
        
        // Answer input events
        this.answers.player1.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer('player1');
        });
        
        this.answers.player2.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer('player2');
        });
    }

    startGame() {
        this.gameActive = true;
        this.winner = null;
        this.positions = { player1: 0, player2: 0 };
        this.scores = { player1: 0, player2: 0 };
        
        // Update UI
        this.startBtn.style.display = 'none';
        this.restartBtn.style.display = 'inline-block';
        this.gameStatus.textContent = 'Game in progress!';
        document.body.classList.add('game-active');
        
        // Enable inputs
        this.answers.player1.disabled = false;
        this.answers.player2.disabled = false;
        this.answers.player1.focus();
        
        // Generate initial questions
        this.generateNewQuestions();
        
        // Update scores display
        this.updateScoreDisplay();
    }

    restartGame() {
        this.gameActive = false;
        this.winner = null;
        this.positions = { player1: 0, player2: 0 };
        this.scores = { player1: 0, player2: 0 };
        
        // Reset UI
        this.startBtn.style.display = 'inline-block';
        this.restartBtn.style.display = 'none';
        this.gameStatus.textContent = 'Ready to race!';
        document.body.classList.remove('game-active');
        
        // Disable inputs
        this.answers.player1.disabled = true;
        this.answers.player2.disabled = true;
        this.answers.player1.value = '';
        this.answers.player2.value = '';
        
        // Reset avatars and tracks
        this.updateAvatarPosition('player1', 0);
        this.updateAvatarPosition('player2', 0);
        
        // Clear questions and feedback
        this.questions.player1.textContent = '?';
        this.questions.player2.textContent = '?';
        this.feedback.player1.textContent = '';
        this.feedback.player2.textContent = '';
        this.feedback.player1.className = 'feedback';
        this.feedback.player2.className = 'feedback';
        
        // Hide modal
        this.winnerModal.style.display = 'none';
        
        // Update scores display
        this.updateScoreDisplay();
    }

    generateQuestion() {
        const operations = [
            { symbol: '+', func: (a, b) => a + b },
            { symbol: '-', func: (a, b) => a - b },
            { symbol: '×', func: (a, b) => a * b }
        ];
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const a = Math.floor(Math.random() * 12) + 1;
        const b = Math.floor(Math.random() * 12) + 1;
        
        // Ensure positive results for subtraction
        const num1 = operation.symbol === '-' ? Math.max(a, b) : a;
        const num2 = operation.symbol === '-' ? Math.min(a, b) : b;
        
        return {
            question: `${num1} ${operation.symbol} ${num2}`,
            answer: operation.func(num1, num2)
        };
    }

    generateNewQuestions() {
        this.currentQuestions.player1 = this.generateQuestion();
        this.currentQuestions.player2 = this.generateQuestion();
        
        this.questions.player1.textContent = this.currentQuestions.player1.question;
        this.questions.player2.textContent = this.currentQuestions.player2.question;
        
        // Clear previous answers and feedback
        this.answers.player1.value = '';
        this.answers.player2.value = '';
        this.feedback.player1.textContent = '';
        this.feedback.player2.textContent = '';
        this.feedback.player1.className = 'feedback';
        this.feedback.player2.className = 'feedback';
    }

    checkAnswer(player) {
        if (!this.gameActive) return;
        
        const answer = parseInt(this.answers[player].value);
        const correctAnswer = this.currentQuestions[player].answer;
        
        if (answer === correctAnswer) {
            // Correct answer
            this.feedback[player].textContent = '✅ Correct!';
            this.feedback[player].className = 'feedback correct';
            
            // Update score and position
            this.scores[player]++;
            this.positions[player] += 10; // Move 10% forward
            
            // Update displays
            this.updateScoreDisplay();
            this.updateAvatarPosition(player, this.positions[player]);
            
            // Check for winner
            if (this.positions[player] >= this.maxPosition) {
                this.endGame(player);
                return;
            }
            
            // Generate new question for this player
            this.currentQuestions[player] = this.generateQuestion();
            this.questions[player].textContent = this.currentQuestions[player].question;
            this.answers[player].value = '';
            
        } else {
            // Incorrect answer
            this.feedback[player].textContent = `❌ Wrong! Answer was ${correctAnswer}`;
            this.feedback[player].className = 'feedback incorrect';
            
            // Small penalty for wrong answer
            this.positions[player] = Math.max(0, this.positions[player] - 2);
            this.updateAvatarPosition(player, this.positions[player]);
        }
        
        // Clear feedback after 2 seconds
        setTimeout(() => {
            this.feedback[player].textContent = '';
            this.feedback[player].className = 'feedback';
        }, 2000);
    }

    updateAvatarPosition(player, percentage) {
        const avatar = this.avatars[player];
        const trackProgress = this.trackProgress[player];
        const trackWidth = avatar.parentElement.offsetWidth;
        
        // Calculate position (leave some space for avatar)
        const maxDistance = trackWidth - 60; // 60px for avatar width
        const distance = (percentage / 100) * maxDistance;
        
        // Update avatar position
        avatar.style.transform = `translateY(-50%) translateX(${distance}px)`;
        
        // Update progress bar
        trackProgress.style.width = `${percentage}%`;
    }

    updateScoreDisplay() {
        document.getElementById('score1').textContent = this.scores.player1;
        document.getElementById('score2').textContent = this.scores.player2;
    }

    endGame(winner) {
        this.gameActive = false;
        this.winner = winner;
        
        // Disable inputs
        this.answers.player1.disabled = true;
        this.answers.player2.disabled = true;
        
        // Update UI
        this.startBtn.style.display = 'none';
        this.restartBtn.style.display = 'inline-block';
        this.gameStatus.textContent = `${winner === 'player1' ? 'Player 1' : 'Player 2'} wins!`;
        document.body.classList.remove('game-active');
        
        // Add winner animation
        this.avatars[winner].classList.add('winner');
        
        // Show winner modal
        this.showWinnerModal(winner);
        
        // Create confetti
        this.createConfetti();
    }

    showWinnerModal(winner) {
        const playerName = winner === 'player1' ? 'Player 1 🧍‍♂️' : 'Player 2 🧍‍♀️';
        const playerScore = this.scores[winner];
        
        this.winnerText.textContent = `🎉 ${playerName} Wins!`;
        this.winnerDetails.textContent = `Final Score: ${playerScore} correct answers`;
        
        this.winnerModal.style.display = 'flex';
    }

    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a29bfe', '#fd79a8'];
        
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 3 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
                
                this.confettiContainer.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 6000);
            }, i * 30);
        }
        
        // Add sparkle effect
        this.createSparkles();
    }
    
    createSparkles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'fixed';
                sparkle.style.width = '4px';
                sparkle.style.height = '4px';
                sparkle.style.background = '#fff';
                sparkle.style.borderRadius = '50%';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.animation = 'sparkle 2s ease-out forwards';
                sparkle.style.zIndex = '1001';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 2000);
            }, i * 100);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new MathDuelGame();
    
    // Add some visual polish
    const avatars = document.querySelectorAll('.avatar');
    avatars.forEach(avatar => {
        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform += ' scale(1.1)';
        });
        
        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = avatar.style.transform.replace(' scale(1.1)', '');
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && !game.gameActive) {
            e.preventDefault();
            game.startGame();
        }
    });
}); 