class ThreeDoorsGame {
    constructor() {
        this.winningDoor = null;
        this.gameActive = false;
        this.gameEnded = false;
        this.wins = 0;
        this.losses = 0;
        this.hintsEnabled = false;
        this.easterEggPattern = [];
        this.consecutiveWins = 0;
        this.bestStreak = 0;
        this.currentStreak = 0;
        this.difficulty = 'easy';
        this.init();
    }

    init() {
        this.loadScore();
        this.setupEventListeners();
        this.updateScoreDisplay();
        this.updateDifficultyDisplay();
        this.startNewRound();
        this.applyTheme();
    }

    updateDifficultyDisplay() {
        const difficultyText = document.getElementById('difficultyText');
        const btn = document.getElementById('difficultyBtn');
        
        difficultyText.textContent = this.difficulty === 'easy' ? 'Easy Mode' : 'Hard Mode';
        
        if (this.difficulty === 'hard') {
            btn.style.background = 'linear-gradient(135deg, var(--danger-color), #ff6b6b)';
        } else {
            btn.style.background = 'linear-gradient(135deg, var(--accent-color), #6c5ce7)';
        }
    }

    setupEventListeners() {
        // Door click events
        document.querySelectorAll('.door').forEach(door => {
            door.addEventListener('click', (e) => this.handleDoorClick(e));
            door.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleDoorClick(e);
                }
            });
        });

        // Control buttons
        document.getElementById('restartBtn').addEventListener('click', () => this.startNewRound());
        document.getElementById('resetScoreBtn').addEventListener('click', () => this.resetScore());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('difficultyBtn').addEventListener('click', () => this.toggleDifficulty());
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Hints toggle
        document.getElementById('hintsToggle').addEventListener('change', (e) => {
            this.hintsEnabled = e.target.checked;
            this.toggleHints();
        });

        // Modal controls
        document.getElementById('closeHelp').addEventListener('click', () => this.hideHelp());
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideHelp();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.gameActive) {
                if (e.key >= '1' && e.key <= '3') {
                    const doorNum = parseInt(e.key);
                    const door = document.getElementById(`door${doorNum}`);
                    if (door && !door.classList.contains('disabled')) {
                        this.selectDoor(doorNum);
                    }
                }
            }
            if (e.key === 'r' || e.key === 'R') {
                this.startNewRound();
            }
        });
    }

    /**
     * Handle door click events
     */
    handleDoorClick(e) {
        const door = e.currentTarget;
        const doorNumber = parseInt(door.dataset.door);
        
        if (this.gameActive && !door.classList.contains('disabled')) {
            this.selectDoor(doorNumber);
        }
    }

    /**
     * Start a new round of the game
     */
    startNewRound() {
        // Reset game state
        this.gameActive = true;
        this.gameEnded = false;
        
        // Difficulty affects randomness and hint reliability
        if (this.difficulty === 'hard') {
            // In hard mode, make the game more challenging
            this.winningDoor = Math.floor(Math.random() * 3) + 1;
            // Sometimes swap the winning door mid-game (10% chance)
            if (Math.random() < 0.1) {
                setTimeout(() => {
                    if (this.gameActive) {
                        this.winningDoor = Math.floor(Math.random() * 3) + 1;
                        console.log('Hard mode: Winning door changed to:', this.winningDoor);
                    }
                }, 2000);
            }
        } else {
            this.winningDoor = Math.floor(Math.random() * 3) + 1;
        }
        
        // Reset door states
        document.querySelectorAll('.door').forEach(door => {
            door.classList.remove('opened', 'disabled', 'winner', 'loser', 'selected');
            door.querySelector('.door-result').innerHTML = '';
        });
        
        // Reset UI
        document.getElementById('statusMessage').textContent = this.difficulty === 'hard' ? 
            'Hard Mode: Choose wisely, things might change...' : 'Choose your door!';
        document.getElementById('restartBtn').disabled = true;
        
        // Setup hints if enabled
        if (this.hintsEnabled) {
            this.setupHints();
        } else {
            this.clearHints();
        }
        
        console.log('New round started. Winning door:', this.winningDoor);
    }

    /**
     * Handle door selection
     */
    selectDoor(doorNumber) {
        if (!this.gameActive || this.gameEnded) return;
        
        this.gameActive = false;
        this.gameEnded = true;
        
        // Track pattern for easter egg
        this.easterEggPattern.push(doorNumber);
        if (this.easterEggPattern.length > 5) {
            this.easterEggPattern.shift();
        }
        
        // Mark selected door and disable all doors temporarily
        document.querySelectorAll('.door').forEach(door => {
            door.classList.add('disabled');
        });
        
        // Highlight selected door
        document.getElementById(`door${doorNumber}`).classList.add('selected');
        
        // Show selection feedback
        document.getElementById('statusMessage').textContent = 
            `You chose door ${doorNumber}... ${this.difficulty === 'hard' ? 'Let\'s see if it stays that way!' : 'Revealing doors...'}`;
        
        // Reveal doors with animation delay
        setTimeout(() => {
            this.revealDoors(doorNumber);
        }, 1000);
    }

    /**
     * Reveal all doors and show results
     */
    revealDoors(selectedDoor) {
        const isWin = selectedDoor === this.winningDoor;
        
        // Setup door contents
        for (let i = 1; i <= 3; i++) {
            const door = document.getElementById(`door${i}`);
            const result = door.querySelector('.door-result');
            
            if (i === this.winningDoor) {
                result.innerHTML = '💰';
                result.classList.add('treasure');
                door.classList.add('winner');
            } else {
                const monsters = ['👹', '💀', '🐉', '👻', '🧟'];
                result.innerHTML = monsters[Math.floor(Math.random() * monsters.length)];
                result.classList.add('monster');
                door.classList.add('loser');
            }
        }
        
        // Open doors with staggered animation
        document.querySelectorAll('.door').forEach((door, index) => {
            setTimeout(() => {
                door.classList.add('opened');
            }, index * 200);
        });
        
        // Show result after all doors are open
        setTimeout(() => {
            this.showResult(isWin, selectedDoor);
        }, 1000);
    }

    /**
     * Show game result and update score
     */
    showResult(isWin, selectedDoor) {
        let message;
        
        if (isWin) {
            this.wins++;
            this.consecutiveWins++;
            this.currentStreak++;
            
            // Update best streak
            if (this.currentStreak > this.bestStreak) {
                this.bestStreak = this.currentStreak;
            }
            
            message = `🎉 Congratulations! You found the treasure behind door ${selectedDoor}!`;
            this.playSound('success');
            
            // Check for easter egg
            if (this.consecutiveWins >= 3) {
                this.showEasterEgg();
            }
        } else {
            this.losses++;
            this.consecutiveWins = 0;
            this.currentStreak = 0;
            message = `💀 Oh no! Door ${selectedDoor} had a monster. The treasure was behind door ${this.winningDoor}.`;
            this.playSound('failure');
        }
        
        document.getElementById('statusMessage').textContent = message;
        document.getElementById('restartBtn').disabled = false;
        
        this.updateScoreDisplay();
        this.saveScore();
        
        // Check for easter egg pattern
        this.checkEasterEggPattern();
    }

    /**
     * Play sound effects
     */
    playSound(type) {
        try {
            const audio = document.getElementById(type === 'success' ? 'successSound' : 'failureSound');
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.3;
                audio.play().catch(e => {
                    console.log('Audio play failed:', e);
                    // Fallback to Web Audio API
                    this.playWebAudioSound(type);
                });
            }
        } catch (error) {
            console.log('Sound failed:', error);
        }
    }

    /**
     * Fallback Web Audio API sound generation
     */
    playWebAudioSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'success') {
                // Success sound: ascending notes
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            } else {
                // Failure sound: descending notes
                oscillator.frequency.setValueAtTime(493.88, audioContext.currentTime); // B4
                oscillator.frequency.setValueAtTime(466.16, audioContext.currentTime + 0.1); // Bb4
                oscillator.frequency.setValueAtTime(440.00, audioContext.currentTime + 0.2); // A4
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Web Audio API failed:', error);
        }
    }

    /**
     * Update score display
     */
    updateScoreDisplay() {
        document.getElementById('winsCount').textContent = this.wins;
        document.getElementById('lossesCount').textContent = this.losses;
        document.getElementById('bestStreak').textContent = this.bestStreak;
        
        const totalGames = this.wins + this.losses;
        const winRate = totalGames > 0 ? Math.round((this.wins / totalGames) * 100) : 0;
        document.getElementById('winRate').textContent = `${winRate}%`;
        
        // Add visual effects to score cards when they update
        this.animateScoreUpdate();
    }

    /**
     * Animate score card updates
     */
    animateScoreUpdate() {
        const cards = document.querySelectorAll('.score-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            }, index * 100);
        });
    }

    /**
     * Reset score
     */
    resetScore() {
        if (confirm('Are you sure you want to reset your score?')) {
            this.wins = 0;
            this.losses = 0;
            this.consecutiveWins = 0;
            this.currentStreak = 0;
            this.bestStreak = 0;
            this.easterEggPattern = [];
            this.updateScoreDisplay();
            this.saveScore();
        }
    }

    /**
     * Save score to localStorage
     */
    saveScore() {
        try {
            localStorage.setItem('threeDoorsScore', JSON.stringify({
                wins: this.wins,
                losses: this.losses,
                bestStreak: this.bestStreak,
                difficulty: this.difficulty
            }));
        } catch (error) {
            console.log('Failed to save score:', error);
        }
    }

    /**
     * Load score from localStorage
     */
    loadScore() {
        try {
            const saved = localStorage.getItem('threeDoorsScore');
            if (saved) {
                const score = JSON.parse(saved);
                this.wins = score.wins || 0;
                this.losses = score.losses || 0;
                this.bestStreak = score.bestStreak || 0;
                this.difficulty = score.difficulty || 'easy';
            }
        } catch (error) {
            console.log('Failed to load score:', error);
        }
    }

    /**
     * Toggle dark/light theme
     */
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.dataset.theme = newTheme;
        
        // Update theme toggle icon
        const icon = document.querySelector('.theme-toggle i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Save theme preference
        try {
            localStorage.setItem('threeDoorsTheme', newTheme);
        } catch (error) {
            console.log('Failed to save theme:', error);
        }
    }

    /**
     * Apply saved theme
     */
    applyTheme() {
        try {
            const savedTheme = localStorage.getItem('threeDoorsTheme') || 'light';
            document.body.dataset.theme = savedTheme;
            
            const icon = document.querySelector('.theme-toggle i');
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        } catch (error) {
            console.log('Failed to apply theme:', error);
        }
    }

    /**
     * Setup visual hints
     */
    setupHints() {
        document.body.classList.add('hints-enabled');
        
        // Clear previous hints
        this.clearHints();
        
        // Add subtle hint to winning door
        const winningDoorHint = document.getElementById(`hint${this.winningDoor}`);
        if (winningDoorHint) {
            winningDoorHint.textContent = '✨';
        }
        
        // Add neutral hints to other doors
        for (let i = 1; i <= 3; i++) {
            if (i !== this.winningDoor) {
                const hint = document.getElementById(`hint${i}`);
                if (hint) {
                    hint.textContent = Math.random() > 0.5 ? '🌫️' : '🔍';
                }
            }
        }
    }

    /**
     * Clear all hints
     */
    clearHints() {
        document.body.classList.remove('hints-enabled');
        document.querySelectorAll('.door-hint').forEach(hint => {
            hint.textContent = '';
        });
    }

    /**
     * Toggle hints display
     */
    toggleHints() {
        if (this.hintsEnabled && !this.gameEnded) {
            this.setupHints();
        } else {
            this.clearHints();
        }
    }

    /**
     * Check for easter egg pattern
     */
    checkEasterEggPattern() {
        // Easter egg: if player chooses doors in sequence 1,2,3,1,2 or chooses same door 3 times
        const pattern = this.easterEggPattern;
        
        if (pattern.length >= 5) {
            const isSequential = pattern.join('') === '12312' || pattern.join('') === '32123';
            const isSame = pattern.every(door => door === pattern[0]) && pattern.length >= 3;
            
            if (isSequential || isSame) {
                this.showEasterEgg();
            }
        }
    }

    /**
     * Show easter egg
     */
    showEasterEgg() {
        const easterEgg = document.getElementById('easterEgg');
        easterEgg.classList.add('show');
        
        setTimeout(() => {
            easterEgg.classList.remove('show');
        }, 3000);
        
        // Reset pattern
        this.easterEggPattern = [];
    }

    /**
     * Show help modal
     */
    showHelp() {
        const modal = document.getElementById('helpModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Hide help modal
     */
    hideHelp() {
        const modal = document.getElementById('helpModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    /**
     * Toggle difficulty mode
     */
    toggleDifficulty() {
        this.difficulty = this.difficulty === 'easy' ? 'hard' : 'easy';
        const difficultyText = document.getElementById('difficultyText');
        difficultyText.textContent = this.difficulty === 'easy' ? 'Easy Mode' : 'Hard Mode';
        
        // Change button appearance based on difficulty
        const btn = document.getElementById('difficultyBtn');
        if (this.difficulty === 'hard') {
            btn.style.background = 'linear-gradient(135deg, var(--danger-color), #ff6b6b)';
        } else {
            btn.style.background = 'linear-gradient(135deg, var(--accent-color), #6c5ce7)';
        }
        
        this.saveScore();
        
        // If game is active, restart with new difficulty
        if (!this.gameEnded) {
            this.startNewRound();
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThreeDoorsGame();
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Prevent context menu on game elements for better mobile experience
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.door') || e.target.closest('.btn')) {
        e.preventDefault();
    }
});

// Add touch feedback for mobile
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.door')) {
        e.target.closest('.door').style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', (e) => {
    if (e.target.closest('.door')) {
        setTimeout(() => {
            e.target.closest('.door').style.transform = '';
        }, 100);
    }
});
