class UIManager {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.currentMenu = 'main';
        this.gameState = 'menu';
        this.gameMode = 'single'; // single or two-player
        this.setupEventListeners();
        this.setupVolumeSlider();
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('startGame').addEventListener('click', () => {
            this.audioManager.resumeAudioContext();
            this.audioManager.playSound('shoot'); // UI sound
            this.gameMode = 'single';
            this.startGame();
        });
        
        document.getElementById('startTwoPlayer').addEventListener('click', () => {
            this.audioManager.resumeAudioContext();
            this.audioManager.playSound('shoot');
            this.gameMode = 'two-player';
            this.startGame();
        });

        document.getElementById('instructions').addEventListener('click', () => {
            this.audioManager.playSound('shoot');
            this.showInstructions();
        });

        document.getElementById('settings').addEventListener('click', () => {
            this.audioManager.playSound('shoot');
            this.showSettings();
        });

        document.getElementById('backToMenu').addEventListener('click', () => {
            this.audioManager.playSound('shoot');
            this.showMainMenu();
        });

        document.getElementById('backToMenuFromSettings').addEventListener('click', () => {
            this.audioManager.playSound('shoot');
            this.showMainMenu();
        });

        document.getElementById('playAgain').addEventListener('click', () => {
            this.audioManager.playSound('shoot');
            this.startGame();
        });

        document.getElementById('backToMenuFromGameOver').addEventListener('click', () => {
            this.audioManager.playSound('shoot');
            this.showMainMenu();
        });

        document.getElementById('quitToMenuBtn').addEventListener('click', () => {
            this.audioManager.playSound('shoot');
            this.quitGame();
        });

        // Settings
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });

        document.getElementById('tankColorSelect').addEventListener('change', (e) => {
            this.playerTankColor = e.target.value;
        });

        // Game control buttons
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseGame();
        });

        document.getElementById('resumeBtn').addEventListener('click', () => {
            this.resumeGame();
        });

        document.getElementById('quitBtn').addEventListener('click', () => {
            this.quitGame();
        });

        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            this.nextLevel();
        });
    }

    setupVolumeSlider() {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.audioManager.setMasterVolume(volume);
            volumeValue.textContent = e.target.value + '%';
        });
    }

    showMainMenu() {
        this.hideAllMenus();
        document.getElementById('mainMenu').classList.remove('hidden');
        this.currentMenu = 'main';
        this.gameState = 'menu';
    }

    showInstructions() {
        this.hideAllMenus();
        document.getElementById('instructionsMenu').classList.remove('hidden');
        this.currentMenu = 'instructions';
    }

    showSettings() {
        this.hideAllMenus();
        document.getElementById('settingsMenu').classList.remove('hidden');
        this.currentMenu = 'settings';
    }

    showGameOver(stats) {
        this.hideAllMenus();
        this.hideHUD();
        
        // Update final stats
        document.getElementById('finalScore').textContent = stats.score;
        document.getElementById('finalLevel').textContent = stats.level;
        document.getElementById('finalKills').textContent = stats.kills;
        document.getElementById('finalAccuracy').textContent = stats.accuracy + '%';
        
        document.getElementById('gameOverMenu').classList.remove('hidden');
        this.currentMenu = 'gameOver';
        this.gameState = 'gameOver';
    }

    showHUD() {
        document.getElementById('gameHUD').classList.remove('hidden');
    }

    hideHUD() {
        document.getElementById('gameHUD').classList.add('hidden');
    }

    hideAllMenus() {
        const menus = ['mainMenu', 'instructionsMenu', 'settingsMenu', 'gameOverMenu', 'levelCompleteMenu', 'loading'];
        menus.forEach(menuId => {
            document.getElementById(menuId).classList.add('hidden');
        });
    }

    showLoading() {
        this.hideAllMenus();
        document.getElementById('loading').classList.remove('hidden');
    }

    startGame() {
        this.gameState = 'playing';
        this.hideAllMenus();
        this.showHUD();
        
        // Get settings
        this.difficulty = document.getElementById('difficultySelect').value;
        this.playerTankColor = document.getElementById('tankColorSelect').value;
        
        // Trigger game start event
        if (this.onGameStart) {
            this.onGameStart({
                difficulty: this.difficulty,
                playerTankColor: this.playerTankColor,
                gameMode: this.gameMode
            });
        }
    }

    updateHUD(gameData) {
        if (this.gameState !== 'playing') return;
        
        // Update score
        document.getElementById('scoreDisplay').textContent = gameData.score;
        
        // Update level
        document.getElementById('levelDisplay').textContent = gameData.level;
        
        // Update enemies count
        document.getElementById('enemiesDisplay').textContent = gameData.enemiesRemaining;
        
        // Update health
        const healthPercent = (gameData.health / gameData.maxHealth) * 100;
        document.getElementById('healthBarFill').style.width = healthPercent + '%';
        document.getElementById('healthDisplay').textContent = `${gameData.health}/${gameData.maxHealth}`;
        
        // Update ammo
        const ammoText = gameData.ammo === Infinity ? '∞' : gameData.ammo;
        document.getElementById('ammoDisplay').textContent = ammoText;
        
        // Update missiles
        document.getElementById('missileDisplay').textContent = gameData.missiles || 0;
        
        // Update day/night mode with freeze effect
        const modeText = gameData.isNightMode ? 'Night' : 'Day';
        const freezeText = gameData.freezeTime > 0 ? ' ❄️' : '';
        document.getElementById('dayNightDisplay').textContent = modeText + freezeText;
        
        if (gameData.freezeTime > 0) {
            document.getElementById('dayNightDisplay').style.color = '#00E676';
            document.getElementById('dayNightDisplay').style.animation = 'pulse 0.5s infinite alternate';
        } else {
            document.getElementById('dayNightDisplay').style.color = gameData.isNightMode ? '#3498db' : '#f39c12';
            document.getElementById('dayNightDisplay').style.animation = 'none';
        }
        
        // Update health bar color based on health percentage
        const healthBar = document.getElementById('healthBarFill');
        if (healthPercent > 60) {
            healthBar.style.background = 'linear-gradient(90deg, #27ae60, #4CAF50)';
        } else if (healthPercent > 30) {
            healthBar.style.background = 'linear-gradient(90deg, #f39c12, #FF9800)';
        } else {
            healthBar.style.background = 'linear-gradient(90deg, #e74c3c, #F44336)';
        }
    }

    showPowerUpNotification(powerUpType) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        `;
        
        const powerUpNames = {
            health: 'Health Restored!',
            shield: 'Shield Activated!',
            speed: 'Speed Boost!',
            damage: 'Double Damage!',
            stealth: 'Stealth Mode!',
            ammo: 'Ammo Refilled!'
        };
        
        notification.textContent = powerUpNames[powerUpType] || 'Power-up Collected!';
        document.body.appendChild(notification);
        
        // Animate in
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        
        setTimeout(() => {
            notification.style.transition = 'all 0.3s ease';
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    showLevelCompleteWithStats(stats) {
        this.hideAllMenus();
        
        // Update level complete stats
        document.getElementById('levelCompleteLevel').textContent = stats.level;
        document.getElementById('levelCompleteScore').textContent = stats.score;
        document.getElementById('levelCompleteEnemies').textContent = stats.enemiesKilled;
        document.getElementById('levelCompleteAccuracy').textContent = stats.accuracy + '%';
        document.getElementById('levelCompleteTimeBonus').textContent = stats.timeBonus;
        
        document.getElementById('levelCompleteMenu').classList.remove('hidden');
        this.currentMenu = 'levelComplete';
    }

    showLevelStart(level) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #27ae60, #2ecc71);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 28px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            border: 3px solid #f39c12;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 36px; margin-bottom: 10px; color: #f39c12;">Level ${level}</div>
            <div style="font-size: 18px;">Get Ready!</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        setTimeout(() => {
            notification.style.transition = 'all 0.5s ease';
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 1500);
    }

    nextLevel() {
        this.hideAllMenus();
        this.showHUD();
        if (this.onNextLevel) {
            this.onNextLevel();
        }
    }

    pauseGame() {
        if (this.onGamePause) {
            this.onGamePause();
        }
        document.getElementById('pauseBtn').classList.add('hidden');
        document.getElementById('resumeBtn').classList.remove('hidden');
    }

    resumeGame() {
        if (this.onGameResume) {
            this.onGameResume();
        }
        document.getElementById('resumeBtn').classList.add('hidden');
        document.getElementById('pauseBtn').classList.remove('hidden');
    }

    quitGame() {
        if (this.onGameQuit) {
            this.onGameQuit();
        }
        this.showMainMenu();
    }

    // Keyboard handling for menus
    handleKeyPress(event) {
        if (this.gameState === 'menu') {
            switch (event.code) {
                case 'Enter':
                    if (this.currentMenu === 'main') {
                        this.startGame();
                    }
                    break;
                case 'Escape':
                    if (this.currentMenu !== 'main') {
                        this.showMainMenu();
                    }
                    break;
            }
        }
        // ESC key handling for game is now handled in game.js
    }
}
