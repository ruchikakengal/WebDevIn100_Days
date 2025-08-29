class LuckyNumberSpinGame {
    constructor() {
        this.wheels = ['wheel1', 'wheel2', 'wheel3'];
        this.isSpinning = false;
        this.gameStats = {
            totalSpins: 0,
            totalWins: 0
        };
        
        // Difficulty settings
        this.difficulties = {
            easy: {
                winChance: 0.15, // 15% chance
                name: 'Easy'
            },
            hard: {
                winChance: 0.05, // 5% chance
                name: 'Hard'
            }
        };
        
        this.currentDifficulty = 'easy';
        
        // Sound contexts
        this.audioContext = null;
        this.spinSound = null;
        this.winSound = null;
        
        this.init();
    }
    
    init() {
        this.loadGameStats();
        this.updateStatsDisplay();
        this.setupEventListeners();
        this.initializeAudio();
        this.setupWheelPositions();
    }
    
    setupEventListeners() {
        const spinButton = document.getElementById('spinButton');
        const resetButton = document.getElementById('resetButton');
        const difficultySelect = document.getElementById('difficulty');
        
        spinButton.addEventListener('click', () => this.spin());
        resetButton.addEventListener('click', () => this.resetStats());
        difficultySelect.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.saveGameStats();
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });
        
        // Mobile touch support
        spinButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
    }
    
    initializeAudio() {
        // Create audio context for better cross-browser support
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
        
        this.spinSound = document.getElementById('spinSound');
        this.winSound = document.getElementById('winSound');
    }
    
    playSound(soundElement) {
        if (soundElement && this.audioContext) {
            try {
                soundElement.currentTime = 0;
                const playPromise = soundElement.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Audio play failed:', error);
                    });
                }
            } catch (error) {
                console.log('Audio error:', error);
            }
        }
    }
    
    setupWheelPositions() {
        // Initialize all wheels to show number 0
        this.wheels.forEach(wheelId => {
            const wheel = document.getElementById(wheelId);
            const strip = wheel.querySelector('.number-strip');
            strip.style.transform = 'translateY(0px)';
        });
    }
    
    async spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.gameStats.totalSpins++;
        
        // Clear previous results
        this.clearResult();
        
        // Disable spin button
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = true;
        spinButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SPINNING...';
        
        // Play spin sound
        this.playSound(this.spinSound);
        
        // Determine if this should be a win based on difficulty
        const shouldWin = this.shouldPlayerWin();
        let finalNumbers;
        
        if (shouldWin) {
            // Force a win - all same numbers
            const winningNumber = Math.floor(Math.random() * 10);
            finalNumbers = [winningNumber, winningNumber, winningNumber];
        } else {
            // Generate different numbers for a loss
            finalNumbers = this.generateLosingNumbers();
        }
        
        // Start spinning animation on all wheels
        this.wheels.forEach((wheelId, index) => {
            const wheel = document.getElementById(wheelId);
            wheel.classList.add('spinning');
            
            // Set final position after spin
            setTimeout(() => {
                this.setWheelToNumber(wheelId, finalNumbers[index]);
                wheel.classList.remove('spinning');
                
                // Check if all wheels have stopped
                if (index === this.wheels.length - 1) {
                    setTimeout(() => {
                        this.checkWin(finalNumbers);
                        this.finishSpin();
                    }, 500);
                }
            }, 2000 + (index * 200)); // Stagger wheel stops
        });
        
        this.updateStatsDisplay();
        this.saveGameStats();
    }
    
    shouldPlayerWin() {
        const difficulty = this.difficulties[this.currentDifficulty];
        return Math.random() < difficulty.winChance;
    }
    
    generateLosingNumbers() {
        let numbers;
        do {
            numbers = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10)
            ];
        } while (numbers[0] === numbers[1] && numbers[1] === numbers[2]);
        
        return numbers;
    }
    
    setWheelToNumber(wheelId, number) {
        const wheel = document.getElementById(wheelId);
        const strip = wheel.querySelector('.number-strip');
        
        // Calculate position to show the target number
        // Each number is 80px high, and we want to center it
        const position = -(number * 80);
        strip.style.transform = `translateY(${position}px)`;
    }
    
    checkWin(numbers) {
        const isWin = numbers[0] === numbers[1] && numbers[1] === numbers[2];
        const resultDisplay = document.getElementById('resultDisplay');
        
        if (isWin) {
            this.gameStats.totalWins++;
            resultDisplay.innerHTML = `🎉 JACKPOT! Triple ${numbers[0]}s! 🎉`;
            resultDisplay.className = 'result-display win';
            
            // Play win sound
            this.playSound(this.winSound);
            
            // Add winning glow to wheels
            this.wheels.forEach(wheelId => {
                document.getElementById(wheelId).classList.add('winning');
            });
            
            // Create confetti effect
            this.createConfetti();
            
            // Remove winning effects after animation
            setTimeout(() => {
                this.wheels.forEach(wheelId => {
                    document.getElementById(wheelId).classList.remove('winning');
                });
            }, 3000);
            
        } else {
            const resultMessages = [
                "Try again! 🎯",
                "So close! Keep spinning! 🎰",
                "Next spin could be the one! 🍀",
                "Don't give up! 💪",
                "Fortune favors the persistent! ⭐"
            ];
            
            const randomMessage = resultMessages[Math.floor(Math.random() * resultMessages.length)];
            resultDisplay.innerHTML = randomMessage;
            resultDisplay.className = 'result-display lose';
        }
    }
    
    createConfetti() {
        const container = document.getElementById('confettiContainer');
        
        // Clear existing confetti
        container.innerHTML = '';
        
        // Create 50 confetti pieces
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                container.appendChild(confetti);
                
                // Remove confetti piece after animation
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }, i * 20);
        }
    }
    
    finishSpin() {
        this.isSpinning = false;
        
        // Re-enable spin button
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = false;
        spinButton.innerHTML = '<i class="fas fa-sync-alt"></i> SPIN!';
        
        this.updateStatsDisplay();
        this.saveGameStats();
    }
    
    clearResult() {
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.innerHTML = '';
        resultDisplay.className = 'result-display';
    }
    
    updateStatsDisplay() {
        document.getElementById('totalSpins').textContent = this.gameStats.totalSpins;
        document.getElementById('totalWins').textContent = this.gameStats.totalWins;
        
        const winRate = this.gameStats.totalSpins > 0 
            ? ((this.gameStats.totalWins / this.gameStats.totalSpins) * 100).toFixed(1)
            : '0';
        document.getElementById('winRate').textContent = winRate + '%';
    }
    
    resetStats() {
        if (confirm('Are you sure you want to reset all game statistics?')) {
            this.gameStats = {
                totalSpins: 0,
                totalWins: 0
            };
            
            this.updateStatsDisplay();
            this.saveGameStats();
            this.clearResult();
            
            // Reset wheel positions
            this.setupWheelPositions();
            
            // Remove any winning effects
            this.wheels.forEach(wheelId => {
                document.getElementById(wheelId).classList.remove('winning');
            });
            
            // Show confirmation
            const resultDisplay = document.getElementById('resultDisplay');
            resultDisplay.innerHTML = 'Game statistics reset! 🔄';
            resultDisplay.className = 'result-display';
            
            setTimeout(() => {
                this.clearResult();
            }, 2000);
        }
    }
    
    saveGameStats() {
        try {
            const gameData = {
                stats: this.gameStats,
                difficulty: this.currentDifficulty,
                lastPlayed: Date.now()
            };
            localStorage.setItem('luckyNumberSpinGame', JSON.stringify(gameData));
        } catch (error) {
            console.log('Failed to save game data:', error);
        }
    }
    
    loadGameStats() {
        try {
            const savedData = localStorage.getItem('luckyNumberSpinGame');
            if (savedData) {
                const gameData = JSON.parse(savedData);
                this.gameStats = gameData.stats || { totalSpins: 0, totalWins: 0 };
                this.currentDifficulty = gameData.difficulty || 'easy';
                
                // Set difficulty select to saved value
                document.getElementById('difficulty').value = this.currentDifficulty;
            }
        } catch (error) {
            console.log('Failed to load game data:', error);
            this.gameStats = { totalSpins: 0, totalWins: 0 };
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Enable audio context on first user interaction
    document.addEventListener('click', function enableAudio() {
        if (window.game && window.game.audioContext && window.game.audioContext.state === 'suspended') {
            window.game.audioContext.resume();
        }
        document.removeEventListener('click', enableAudio);
    });
    
    // Create game instance
    window.game = new LuckyNumberSpinGame();
    
    // Add service worker for better mobile experience
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('data:text/javascript;base64,').catch(() => {
            // Service worker registration failed, but that's okay
        });
    }
});

// Handle page visibility change to pause/resume sounds
document.addEventListener('visibilitychange', () => {
    if (window.game && window.game.audioContext) {
        if (document.hidden) {
            if (window.game.audioContext.state === 'running') {
                window.game.audioContext.suspend();
            }
        } else {
            if (window.game.audioContext.state === 'suspended') {
                window.game.audioContext.resume();
            }
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Game is online');
});

window.addEventListener('offline', () => {
    console.log('Game is offline - using cached data');
});
