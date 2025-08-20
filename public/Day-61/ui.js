class UIManager {
    constructor() {
        this.screens = new Map();
        this.currentScreen = 'mainMenu';
        this.gameStats = {
            score: 0,
            combo: 0,
            bestCombo: 0,
            level: 1,
            arrows: 10,
            time: 60,
            accuracy: 0,
            hits: 0,
            shots: 0
        };
        this.initScreens();
        this.bindEvents();
        this.showScreen('mainMenu');
    }

    /**
     * Initialize screen references
     */
    initScreens() {
        this.screens.set('mainMenu', document.getElementById('mainMenu'));
        this.screens.set('gameScreen', document.getElementById('gameScreen'));
        this.screens.set('pauseMenu', document.getElementById('pauseMenu'));
        this.screens.set('gameOverScreen', document.getElementById('gameOverScreen'));
        this.screens.set('leaderboardScreen', document.getElementById('leaderboardScreen'));
        
        // UI elements
        this.elements = {
            scoreValue: document.getElementById('scoreValue'),
            comboValue: document.getElementById('comboValue'),
            levelValue: document.getElementById('levelValue'),
            timerValue: document.getElementById('timerValue'),
            arrowsValue: document.getElementById('arrowsValue'),
            timerDisplay: document.getElementById('timerDisplay'),
            arrowsDisplay: document.getElementById('arrowsDisplay'),
            powerMeter: document.getElementById('powerMeter'),
            powerFill: document.getElementById('powerFill'),
            windIndicator: document.getElementById('windIndicator'),
            windArrow: document.getElementById('windArrow'),
            windStrength: document.getElementById('windStrength'),
            aimingGuide: document.getElementById('aimingGuide'),
            crosshair: document.querySelector('.crosshair'),
            trajectoryLine: document.getElementById('trajectoryLine'),
            instructions: document.getElementById('instructions'),
            finalScore: document.getElementById('finalScore'),
            bestCombo: document.getElementById('bestCombo'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            newRecord: document.getElementById('newRecord'),
            gameOverTitle: document.getElementById('gameOverTitle'),
            leaderboardList: document.getElementById('leaderboardList')
        };
    }

    /**
     * Bind all UI events
     */
    bindEvents() {
        // Main menu buttons
        document.querySelectorAll('[data-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.startGame(mode);
            });
        });

        // Control buttons
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
        document.getElementById('gameOverMenuBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('clearScoresBtn').addEventListener('click', () => this.clearLeaderboard());

        // Leaderboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.showLeaderboardMode(mode);
            });
        });

        // Touch/mouse events for aiming will be handled by the game engine
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Escape':
                    if (this.currentScreen === 'gameScreen') {
                        this.pauseGame();
                    } else if (this.currentScreen === 'pauseMenu') {
                        this.resumeGame();
                    }
                    break;
                case 'Space':
                    e.preventDefault();
                    if (this.currentScreen === 'gameOverScreen') {
                        this.playAgain();
                    }
                    break;
            }
        });
    }

    /**
     * Show a specific screen
     * @param {string} screenName - Name of the screen to show
     */
    showScreen(screenName) {
        // Hide all screens
        this.screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        if (this.screens.has(screenName)) {
            this.screens.get(screenName).classList.add('active');
            this.currentScreen = screenName;
        }
    }

    /**
     * Start a new game with specified mode
     * @param {string} mode - Game mode (timeAttack, accuracy, endless)
     */
    startGame(mode) {
        this.resetStats();
        this.configureGameMode(mode);
        this.showScreen('gameScreen');
        
        // Trigger game start event
        if (window.game) {
            window.game.startGame(mode);
        }
    }

    /**
     * Configure UI for specific game mode
     * @param {string} mode - Game mode
     */
    configureGameMode(mode) {
        switch(mode) {
            case 'timeAttack':
                this.gameStats.time = 60;
                this.gameStats.arrows = Infinity;
                this.elements.timerDisplay.style.display = 'block';
                this.elements.arrowsDisplay.style.display = 'none';
                break;
            case 'accuracy':
                this.gameStats.arrows = 10;
                this.gameStats.time = Infinity;
                this.elements.timerDisplay.style.display = 'none';
                this.elements.arrowsDisplay.style.display = 'block';
                break;
            case 'endless':
                this.gameStats.arrows = Infinity;
                this.gameStats.time = Infinity;
                this.elements.timerDisplay.style.display = 'none';
                this.elements.arrowsDisplay.style.display = 'none';
                break;
        }
        this.updateUI();
    }

    /**
     * Reset game statistics
     */
    resetStats() {
        this.gameStats = {
            score: 0,
            combo: 0,
            bestCombo: 0,
            level: 1,
            arrows: 10,
            time: 60,
            accuracy: 0,
            hits: 0,
            shots: 0
        };
    }

    /**
     * Update all UI elements with current stats
     */
    updateUI() {
        this.elements.scoreValue.textContent = this.gameStats.score.toLocaleString();
        this.elements.comboValue.textContent = this.gameStats.combo;
        this.elements.levelValue.textContent = this.gameStats.level;
        
        if (this.gameStats.time !== Infinity) {
            this.elements.timerValue.textContent = Math.ceil(this.gameStats.time);
        }
        
        if (this.gameStats.arrows !== Infinity) {
            this.elements.arrowsValue.textContent = this.gameStats.arrows;
        }
        
        // Update accuracy
        this.gameStats.accuracy = this.gameStats.shots > 0 ? 
            Math.round((this.gameStats.hits / this.gameStats.shots) * 100) : 0;
    }

    /**
     * Update power meter display
     * @param {number} power - Power level (0-1)
     * @param {boolean} show - Whether to show the meter
     */
    updatePowerMeter(power, show = true) {
        if (show) {
            this.elements.powerMeter.classList.add('active');
            this.elements.powerFill.style.width = `${power * 100}%`;
            this.elements.powerMeter.querySelector('.power-percentage').textContent = `${Math.round(power * 100)}%`;
        } else {
            this.elements.powerMeter.classList.remove('active');
        }
    }

    /**
     * Update wind indicator
     * @param {Object} windData - Wind information {strength, angle, direction}
     */
    updateWindIndicator(windData) {
        this.elements.windStrength.textContent = windData.strength.toFixed(1);
        this.elements.windArrow.style.transform = `rotate(${windData.angle}deg)`;
        
        // Color code wind strength
        const strength = windData.strength;
        let color = '#00ff88'; // Light wind
        if (strength > 3) color = '#ffff00'; // Medium wind
        if (strength > 6) color = '#ff6600'; // Strong wind
        
        this.elements.windArrow.querySelector('line').setAttribute('stroke', color);
        this.elements.windArrow.querySelector('polygon').setAttribute('fill', color);
    }

    /**
     * Update aiming guide
     * @param {Object} mouse - Mouse position {x, y}
     * @param {Array} trajectory - Trajectory points
     * @param {boolean} show - Whether to show the guide
     */
    updateAimingGuide(mouse, trajectory = [], show = true) {
        if (show) {
            this.elements.aimingGuide.classList.add('active');
            this.elements.crosshair.style.left = `${mouse.x}px`;
            this.elements.crosshair.style.top = `${mouse.y}px`;
            
            // Update trajectory line with better visualization
            if (trajectory.length > 3) {
                const start = trajectory[0];
                const mid = trajectory[Math.floor(trajectory.length / 3)];
                const end = trajectory[Math.min(trajectory.length - 1, Math.floor(trajectory.length / 2))];
                
                // Calculate the first segment
                const length1 = Math.sqrt((mid.x - start.x) ** 2 + (mid.y - start.y) ** 2);
                const angle1 = Math.atan2(mid.y - start.y, mid.x - start.x);
                
                this.elements.trajectoryLine.style.left = `${start.x}px`;
                this.elements.trajectoryLine.style.top = `${start.y}px`;
                this.elements.trajectoryLine.style.width = `${Math.min(length1, 300)}px`;
                this.elements.trajectoryLine.style.transform = `rotate(${angle1}rad)`;
                this.elements.trajectoryLine.style.opacity = '0.8';
            }
        } else {
            this.elements.aimingGuide.classList.remove('active');
        }
    }

    /**
     * Add score and update combo
     * @param {number} points - Points to add
     * @param {string} zone - Zone hit (for combo logic)
     */
    addScore(points, zone) {
        this.gameStats.score += points;
        
        if (zone && zone !== 'miss') {
            this.gameStats.combo++;
            this.gameStats.hits++;
            
            // Combo bonus
            if (this.gameStats.combo > 1) {
                const bonus = Math.floor(points * (this.gameStats.combo - 1) * 0.1);
                this.gameStats.score += bonus;
            }
            
            this.gameStats.bestCombo = Math.max(this.gameStats.bestCombo, this.gameStats.combo);
        } else {
            this.gameStats.combo = 0;
        }
        
        this.gameStats.shots++;
        this.updateUI();
    }

    /**
     * Update timer (for time attack mode)
     * @param {number} timeLeft - Time remaining in seconds
     */
    updateTimer(timeLeft) {
        this.gameStats.time = timeLeft;
        this.updateUI();
        
        // Flash warning when time is low
        if (timeLeft <= 10 && timeLeft > 0) {
            this.elements.timerDisplay.style.animation = 'pulse 0.5s ease infinite';
        } else {
            this.elements.timerDisplay.style.animation = '';
        }
    }

    /**
     * Update arrows remaining (for accuracy mode)
     * @param {number} arrowsLeft - Arrows remaining
     */
    updateArrows(arrowsLeft) {
        this.gameStats.arrows = arrowsLeft;
        this.updateUI();
        
        // Flash warning when arrows are low
        if (arrowsLeft <= 3 && arrowsLeft > 0) {
            this.elements.arrowsDisplay.style.animation = 'pulse 0.5s ease infinite';
        } else {
            this.elements.arrowsDisplay.style.animation = '';
        }
    }

    /**
     * Update level display
     * @param {number} level - Current level
     */
    updateLevel(level) {
        this.gameStats.level = level;
        this.updateUI();
        
        // Show level up animation
        this.elements.levelValue.style.animation = 'celebration 0.5s ease';
        setTimeout(() => {
            this.elements.levelValue.style.animation = '';
        }, 500);
    }

    /**
     * Show hit effect animation
     * @param {Object} position - Screen position {x, y}
     * @param {string} zone - Zone hit
     * @param {number} points - Points scored
     */
    showHitEffect(position, zone, points) {
        const effect = document.createElement('div');
        effect.className = `hit-effect ${zone}`;
        effect.textContent = `+${points}`;
        effect.style.left = `${position.x}px`;
        effect.style.top = `${position.y}px`;
        
        document.getElementById('hitEffects').appendChild(effect);
        
        // Remove effect after animation
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    /**
     * Pause the game
     */
    pauseGame() {
        this.showScreen('pauseMenu');
        if (window.game) {
            window.game.pause();
        }
    }

    /**
     * Resume the game
     */
    resumeGame() {
        this.showScreen('gameScreen');
        if (window.game) {
            window.game.resume();
        }
    }

    /**
     * Restart current game
     */
    restartGame() {
        if (window.game) {
            window.game.restart();
        }
        this.showScreen('gameScreen');
    }

    /**
     * Play again with same mode
     */
    playAgain() {
        if (window.game) {
            window.game.restart();
        }
        this.showScreen('gameScreen');
    }

    /**
     * Show main menu
     */
    showMainMenu() {
        this.showScreen('mainMenu');
        if (window.game) {
            window.game.stop();
        }
    }

    /**
     * Show game over screen
     * @param {Object} finalStats - Final game statistics
     * @param {boolean} isNewRecord - Whether a new record was set
     */
    showGameOver(finalStats, isNewRecord = false) {
        // Update final stats display
        this.elements.finalScore.textContent = finalStats.score.toLocaleString();
        this.elements.bestCombo.textContent = finalStats.bestCombo;
        this.elements.finalAccuracy.textContent = `${finalStats.accuracy}%`;
        
        // Show/hide new record indicator
        if (isNewRecord) {
            this.elements.newRecord.classList.add('show');
        } else {
            this.elements.newRecord.classList.remove('show');
        }
        
        // Set appropriate title
        if (finalStats.accuracy === 100) {
            this.elements.gameOverTitle.textContent = 'Perfect Score!';
        } else if (finalStats.score > 1000) {
            this.elements.gameOverTitle.textContent = 'Excellent!';
        } else {
            this.elements.gameOverTitle.textContent = 'Game Over!';
        }
        
        this.showScreen('gameOverScreen');
    }

    /**
     * Show leaderboard screen
     */
    showLeaderboard() {
        this.showScreen('leaderboardScreen');
        this.showLeaderboardMode('timeAttack'); // Default to time attack
    }

    /**
     * Show leaderboard for specific mode
     * @param {string} mode - Game mode
     */
    showLeaderboardMode(mode) {
        // Update tab selection
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Load and display scores
        const scores = this.loadScores(mode);
        this.displayLeaderboard(scores, mode);
    }

    /**
     * Load scores from localStorage
     * @param {string} mode - Game mode
     * @returns {Array} Array of score objects
     */
    loadScores(mode) {
        try {
            const key = `archery_scores_${mode}`;
            const scores = JSON.parse(localStorage.getItem(key) || '[]');
            return scores.sort((a, b) => b.score - a.score).slice(0, 10);
        } catch (error) {
            console.warn('Error loading scores:', error);
            return [];
        }
    }

    /**
     * Save score to localStorage
     * @param {string} mode - Game mode
     * @param {Object} scoreData - Score data to save
     * @returns {boolean} True if new record
     */
    saveScore(mode, scoreData) {
        try {
            const key = `archery_scores_${mode}`;
            const scores = this.loadScores(mode);
            
            const newScore = {
                score: scoreData.score,
                accuracy: scoreData.accuracy,
                combo: scoreData.bestCombo,
                date: new Date().toISOString(),
                level: scoreData.level
            };
            
            scores.push(newScore);
            scores.sort((a, b) => b.score - a.score);
            
            const isNewRecord = scores[0] === newScore;
            
            // Keep only top 10
            scores.splice(10);
            
            localStorage.setItem(key, JSON.stringify(scores));
            return isNewRecord;
        } catch (error) {
            console.warn('Error saving score:', error);
            return false;
        }
    }

    /**
     * Display leaderboard entries
     * @param {Array} scores - Array of score objects
     * @param {string} mode - Game mode
     */
    displayLeaderboard(scores, mode) {
        const container = this.elements.leaderboardList;
        
        if (scores.length === 0) {
            container.innerHTML = '<div class="empty-leaderboard">No scores yet. Be the first to play!</div>';
            return;
        }
        
        container.innerHTML = scores.map((score, index) => {
            const rank = index + 1;
            const date = new Date(score.date).toLocaleDateString();
            
            return `
                <div class="leaderboard-entry ${rank <= 3 ? 'top3' : ''}">
                    <div class="rank ${rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : ''}">#${rank}</div>
                    <div class="details">
                        <div class="score">${score.score.toLocaleString()} pts</div>
                        <div class="meta">
                            Accuracy: ${score.accuracy}% | 
                            Best Combo: ${score.combo} | 
                            Level: ${score.level}
                        </div>
                        <div class="date">${date}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Clear all leaderboard data
     */
    clearLeaderboard() {
        if (confirm('Are you sure you want to clear all leaderboard data? This cannot be undone.')) {
            const modes = ['timeAttack', 'accuracy', 'endless'];
            modes.forEach(mode => {
                localStorage.removeItem(`archery_scores_${mode}`);
            });
            
            // Refresh current leaderboard display
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                this.showLeaderboardMode(activeTab.dataset.mode);
            }
        }
    }

    /**
     * Get current game statistics
     * @returns {Object} Current game stats
     */
    getStats() {
        return { ...this.gameStats };
    }

    /**
     * Hide instructions (called when game starts)
     */
    hideInstructions() {
        if (this.elements.instructions) {
            this.elements.instructions.style.display = 'none';
        }
    }

    /**
     * Show instructions
     */
    showInstructions() {
        if (this.elements.instructions) {
            this.elements.instructions.style.display = 'block';
        }
    }
}
