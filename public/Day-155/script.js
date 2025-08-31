class AliceInBorderlandGame {
    constructor() {
        this.gameEngine = new GameEngine();
        this.miniGames = new MiniGames();
        this.currentChallenge = null;
        this.particles = null;
        
        this.initializeGame();
        this.setupEventListeners();
        this.initializeParticles();
        this.loadGameState();
    }

    initializeGame() {
        // Initialize game board
        this.generateCards();
        this.updateUI();
        
        // Show welcome story
        this.showStory("Welcome to the Borderland", 
            "You find yourself in an empty Tokyo. To survive, you must complete challenges represented by playing cards. Each suit has different difficulty levels. You have 3 lives. Use them wisely.");
    }

    generateCards() {
        const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
        const suitIcons = {
            spades: '♠',
            hearts: '♥',
            clubs: '♣',
            diamonds: '♦'
        };

        suits.forEach(suit => {
            const grid = document.getElementById(`${suit}Grid`);
            grid.innerHTML = '';

            for (let i = 1; i <= 13; i++) {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.dataset.suit = suit;
                card.dataset.number = i;
                card.dataset.cardId = `${suit}-${i}`;

                // Check if card should be locked
                const isLocked = !this.gameEngine.isCardUnlocked(suit, i);
                const isCompleted = this.gameEngine.isCardCompleted(suit, i);

                if (isLocked && !isCompleted) {
                    card.classList.add('locked');
                }
                if (isCompleted) {
                    card.classList.add('completed');
                }

                card.innerHTML = `
                    <div class="card-face card-front">
                        <div class="card-number">${i}</div>
                        <div class="card-suit">${suitIcons[suit]}</div>
                    </div>
                    <div class="card-face card-back">
                        <div class="card-challenge">
                            ${this.getCardDescription(suit, i)}
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => this.handleCardClick(suit, i));
                grid.appendChild(card);
            }
        });
    }

    getCardDescription(suit, number) {
        const descriptions = {
            spades: [
                "Reaction Test", "Memory Challenge", "Pattern Recognition", "Logic Puzzle",
                "Speed Challenge", "Survival Quiz", "Reflex Game", "Code Breaking",
                "Strategic Thinking", "Time Pressure", "Mental Agility", "Final Trial", "Master Challenge"
            ],
            hearts: [
                "Simple Memory", "Basic Pattern", "Easy Quiz", "Color Match",
                "Number Sequence", "Shape Recognition", "Word Puzzle", "Visual Memory",
                "Simple Logic", "Pattern Match", "Memory Recall", "Association Game", "Heart Trial"
            ],
            clubs: [
                "Quick Click", "Basic Math", "Color Game", "Simple Puzzle",
                "Easy Pattern", "Basic Quiz", "Simple Memory", "Easy Logic",
                "Quick Response", "Basic Challenge", "Simple Task", "Easy Test", "Club Trial"
            ],
            diamonds: [
                "Bonus Round", "Random Challenge", "Special Task", "Surprise Game",
                "Mystery Challenge", "Bonus Points", "Random Game", "Special Trial",
                "Bonus Challenge", "Mystery Task", "Special Game", "Random Trial", "Diamond Jackpot"
            ]
        };

        return descriptions[suit][number - 1] || "Challenge";
    }

    handleCardClick(suit, number) {
        // Play card flip sound
        this.playSound('cardFlip');

        // Check if card is locked
        if (!this.gameEngine.isCardUnlocked(suit, number)) {
            this.showNotification("This card is locked! Complete previous challenges first.", "warning");
            return;
        }

        // Check if card is already completed
        if (this.gameEngine.isCardCompleted(suit, number)) {
            this.showNotification("This challenge has already been completed!", "info");
            return;
        }

        // Flip card animation
        const cardElement = document.querySelector(`[data-card-id="${suit}-${number}"]`);
        cardElement.classList.add('flipped');

        // Start challenge after animation
        setTimeout(() => {
            this.startChallenge(suit, number);
        }, 300);
    }

    startChallenge(suit, number) {
        const challenge = this.miniGames.getChallenge(suit, number);
        this.currentChallenge = { suit, number, challenge };

        // Show challenge modal
        const modal = document.getElementById('challengeModal');
        const title = document.getElementById('challengeTitle');
        const cardInfo = document.getElementById('challengeCard');
        const description = document.getElementById('challengeDescription');
        const content = document.getElementById('challengeContent');
        const timer = document.getElementById('challengeTimer');

        title.textContent = challenge.title;
        cardInfo.textContent = `${suit.toUpperCase()} ${number}`;
        description.textContent = challenge.description;
        content.innerHTML = challenge.content;
        timer.textContent = challenge.timeLimit;

        modal.classList.add('show');

        // Start timer
        this.startChallengeTimer(challenge.timeLimit);

        // Initialize challenge-specific logic
        if (challenge.init) {
            challenge.init();
        }
    }

    startChallengeTimer(timeLimit) {
        const timerElement = document.getElementById('challengeTimer');
        let timeLeft = timeLimit;

        this.challengeTimer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            // Add critical warning at 10 seconds
            if (timeLeft <= 10) {
                timerElement.classList.add('critical');
            }

            // Time's up
            if (timeLeft <= 0) {
                this.handleChallengeTimeout();
            }
        }, 1000);
    }

    handleChallengeTimeout() {
        clearInterval(this.challengeTimer);
        this.endChallenge(false, "Time's up! You failed the challenge.");
    }

    submitChallenge() {
        if (!this.currentChallenge) return;

        const challenge = this.currentChallenge.challenge;
        const isCorrect = challenge.validate ? challenge.validate() : true;

        clearInterval(this.challengeTimer);
        
        const timeLeft = parseInt(document.getElementById('challengeTimer').textContent);
        const speedBonus = Math.max(0, timeLeft * 10);

        this.endChallenge(isCorrect, isCorrect ? "Challenge completed!" : "Incorrect answer!", speedBonus);
    }

    skipChallenge() {
        clearInterval(this.challengeTimer);
        this.gameEngine.loseLife();
        this.endChallenge(false, "Challenge skipped. You lost a life!");
    }

    endChallenge(success, message, speedBonus = 0) {
        // Hide challenge modal
        document.getElementById('challengeModal').classList.remove('show');

        // Reset timer styling
        document.getElementById('challengeTimer').classList.remove('critical');

        if (success) {
            // Mark card as completed
            this.gameEngine.completeCard(this.currentChallenge.suit, this.currentChallenge.number);
            
            // Add score
            const baseScore = this.gameEngine.getCardScore(this.currentChallenge.suit);
            const streakBonus = this.gameEngine.getStreakBonus();
            const totalScore = baseScore + speedBonus + streakBonus;
            this.gameEngine.addScore(totalScore);

            // Show success result
            this.showResult(true, message, totalScore);
            this.playSound('success');
            this.createParticleEffect('success');
        } else {
            // Lose life if not skipped
            if (!message.includes("skipped")) {
                this.gameEngine.loseLife();
            }
            
            // Reset streak
            this.gameEngine.resetStreak();
            
            // Show failure result
            this.showResult(false, message, 0);
            this.playSound('failure');
            this.createParticleEffect('failure');
        }

        // Update UI
        this.updateUI();
        this.updateCards();

        // Check game over
        if (this.gameEngine.isGameOver()) {
            setTimeout(() => this.showGameOver(), 1000);
        }

        this.currentChallenge = null;
    }

    showResult(success, message, score) {
        const modal = document.getElementById('resultModal');
        const title = document.getElementById('resultTitle');
        const messageEl = document.getElementById('resultMessage');
        const scoreEl = document.getElementById('resultScore');

        title.textContent = success ? "Success!" : "Failed!";
        title.style.color = success ? "#00ff66" : "#ff0000";
        messageEl.textContent = message;
        scoreEl.textContent = `Points earned: ${score}`;
        scoreEl.style.display = success ? 'block' : 'none';

        modal.classList.add('show');
    }

    updateUI() {
        // Update stats
        document.getElementById('livesCount').textContent = this.gameEngine.lives;
        document.getElementById('scoreCount').textContent = this.gameEngine.score;
        document.getElementById('streakCount').textContent = this.gameEngine.streak;

        // Update progress
        const completedCards = this.gameEngine.getCompletedCardsCount();
        const progressPercent = (completedCards / 52) * 100;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
        document.getElementById('progressText').textContent = `${completedCards}/52 Cards Completed`;

        // Update lives indicator
        const livesElement = document.querySelector('.stat-item:first-child');
        if (this.gameEngine.lives <= 1) {
            livesElement.classList.add('low-lives');
        } else {
            livesElement.classList.remove('low-lives');
        }
    }

    updateCards() {
        const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
        
        suits.forEach(suit => {
            for (let i = 1; i <= 13; i++) {
                const cardElement = document.querySelector(`[data-card-id="${suit}-${i}"]`);
                const isLocked = !this.gameEngine.isCardUnlocked(suit, i);
                const isCompleted = this.gameEngine.isCardCompleted(suit, i);

                // Update card classes
                cardElement.classList.remove('locked', 'completed', 'flipped');
                
                if (isLocked && !isCompleted) {
                    cardElement.classList.add('locked');
                }
                if (isCompleted) {
                    cardElement.classList.add('completed');
                }
            }
        });
    }

    showGameOver() {
        const modal = document.getElementById('gameOverModal');
        document.getElementById('finalScore').textContent = this.gameEngine.score;
        document.getElementById('finalCards').textContent = this.gameEngine.getCompletedCardsCount();
        document.getElementById('finalStreak').textContent = this.gameEngine.maxStreak;

        // Save high score
        this.gameEngine.saveHighScore();
        
        modal.classList.add('show');
    }

    restartGame() {
        // Reset game state
        this.gameEngine.reset();
        
        // Close all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });

        // Regenerate cards
        this.generateCards();
        this.updateUI();

        // Show restart story
        this.showStory("Second Chance", "You've been given another chance to survive in the Borderland. Learn from your mistakes and try again!");
    }

    showStory(title, content) {
        const modal = document.getElementById('storyModal');
        modal.querySelector('h2').textContent = title;
        document.getElementById('storyContent').textContent = content;
        modal.classList.add('show');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'warning' ? '#ff6600' : type === 'error' ? '#ff0000' : '#0066ff'};
            color: white;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    playSound(type) {
        const audio = document.getElementById(`${type}Sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {}); // Ignore autoplay restrictions
        }
    }

    createParticleEffect(type) {
        if (!this.particles) return;

        const colors = type === 'success' ? ['#00ff66', '#66ff99'] : ['#ff0000', '#ff6666'];
        
        // Create burst of particles
        for (let i = 0; i < 20; i++) {
            this.particles.createParticle(
                window.innerWidth / 2,
                window.innerHeight / 2,
                colors[Math.floor(Math.random() * colors.length)]
            );
        }
    }

    initializeParticles() {
        const canvas = document.getElementById('particlesCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.particles = {
            particles: [],
            
            createParticle(x, y, color) {
                this.particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1,
                    decay: Math.random() * 0.02 + 0.01,
                    color: color,
                    size: Math.random() * 4 + 2
                });
            },

            update() {
                this.particles = this.particles.filter(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life -= particle.decay;
                    particle.vy += 0.2; // gravity
                    return particle.life > 0;
                });
            },

            draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.particles.forEach(particle => {
                    ctx.save();
                    ctx.globalAlpha = particle.life;
                    ctx.fillStyle = particle.color;
                    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                    ctx.restore();
                });
            },

            animate() {
                this.update();
                this.draw();
                requestAnimationFrame(() => this.animate());
            }
        };

        this.particles.animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    saveGameState() {
        localStorage.setItem('aliceGame', JSON.stringify(this.gameEngine.getGameState()));
    }

    loadGameState() {
        const saved = localStorage.getItem('aliceGame');
        if (saved) {
            this.gameEngine.loadGameState(JSON.parse(saved));
            this.updateUI();
            this.updateCards();
        }
    }

    setupEventListeners() {
        // Modal buttons
        document.getElementById('submitAnswer').addEventListener('click', () => this.submitChallenge());
        document.getElementById('skipChallenge').addEventListener('click', () => this.skipChallenge());
        document.getElementById('continueBtn').addEventListener('click', () => {
            document.getElementById('resultModal').classList.remove('show');
        });
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('viewLeaderboardBtn').addEventListener('click', () => {
            window.location.href = 'leaderboard.html';
        });
        document.getElementById('leaderboardBtn').addEventListener('click', () => {
            window.location.href = 'leaderboard.html';
        });
        document.getElementById('storyOkBtn').addEventListener('click', () => {
            document.getElementById('storyModal').classList.remove('show');
        });

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // Auto-save game state
        setInterval(() => this.saveGameState(), 10000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => this.saveGameState());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modal
                document.querySelectorAll('.modal.show').forEach(modal => {
                    modal.classList.remove('show');
                });
            }
        });
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new AliceInBorderlandGame();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
