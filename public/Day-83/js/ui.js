class UIManager {
    constructor() {
        this.currentScreen = 'main-menu';
        this.settings = gameStorage.loadSettings();
        this.initialized = false;

        // Screen elements
        this.screens = {
            mainMenu: document.getElementById('main-menu'),
            difficultyMenu: document.getElementById('difficulty-menu'),
            settingsMenu: document.getElementById('settings-menu'),
            leaderboardMenu: document.getElementById('leaderboard-menu'),
            howToPlayMenu: document.getElementById('how-to-play-menu'),
            gameScreen: document.getElementById('game-screen'),
            gameOver: document.getElementById('game-over'),
            pauseScreen: document.getElementById('pause-screen')
        };

        // Game UI elements
        this.gameUI = {
            player1Score: document.getElementById('player1-score'),
            player2Score: document.getElementById('player2-score'),
            player1Name: document.getElementById('player1-name'),
            player2Name: document.getElementById('player2-name'),
            countdown: document.getElementById('countdown'),
            gameModeDisplay: document.getElementById('game-mode-display'),
            activePowerups: document.getElementById('active-powerups')
        };

        // Initialize UI
        this.initializeEventListeners();
        this.applySettings();
        this.updateLeaderboard();
    }

    initializeEventListeners() {
        // Main menu buttons
        document.getElementById('single-player-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('difficulty-menu');
        });

        document.getElementById('two-player-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.startGame('two-player');
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('settings-menu');
        });

        document.getElementById('leaderboard-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('leaderboard-menu');
            this.updateLeaderboard();
        });

        document.getElementById('how-to-play-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('how-to-play-menu');
        });

        // Difficulty selection
        document.getElementById('easy-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.startGame('single-player', 'easy');
        });

        document.getElementById('medium-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.startGame('single-player', 'medium');
        });

        document.getElementById('hard-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.startGame('single-player', 'hard');
        });

        document.getElementById('back-to-main').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('main-menu');
        });

        // Settings
        this.initializeSettingsControls();

        document.getElementById('save-settings').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.saveSettings();
            this.showScreen('main-menu');
        });

        document.getElementById('back-from-settings').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('main-menu');
        });

        // Leaderboard
        document.getElementById('clear-scores').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            if (confirm('Are you sure you want to clear all scores?')) {
                gameStorage.clearScores();
                this.updateLeaderboard();
            }
        });

        document.getElementById('back-from-leaderboard').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('main-menu');
        });

        document.getElementById('back-from-how-to-play').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('main-menu');
        });

        // Game controls
        document.getElementById('pause-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            if (window.game) window.game.togglePause();
        });

        document.getElementById('quit-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            if (confirm('Are you sure you want to quit the game?')) {
                if (window.game) window.game.quitGame();
            }
        });

        // Pause screen
        document.getElementById('resume-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            if (window.game) window.game.togglePause();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            if (window.game) window.game.restartGame();
        });

        document.getElementById('pause-quit-btn').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            if (window.game) window.game.quitGame();
        });

        // Game over screen
        document.getElementById('play-again').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            if (window.game) window.game.restartGame();
        });

        document.getElementById('back-to-menu').addEventListener('click', () => {
            window.audioSystem.playButtonClick();
            this.showScreen('main-menu');
        });
    }

    initializeSettingsControls() {
        const themeSelect = document.getElementById('theme-select');
        const ballSpeedSlider = document.getElementById('ball-speed');
        const paddleSizeSlider = document.getElementById('paddle-size');
        const winningScoreSlider = document.getElementById('winning-score');
        const soundToggle = document.getElementById('sound-toggle');
        const musicToggle = document.getElementById('music-toggle');
        const powerupsToggle = document.getElementById('powerups-toggle');

        // Set initial values
        themeSelect.value = this.settings.theme;
        ballSpeedSlider.value = this.settings.ballSpeed;
        paddleSizeSlider.value = this.settings.paddleSize;
        winningScoreSlider.value = this.settings.winningScore;
        soundToggle.checked = this.settings.soundEnabled;
        musicToggle.checked = this.settings.musicEnabled;
        powerupsToggle.checked = this.settings.powerupsEnabled;

        // Update display values
        this.updateSettingDisplay('ball-speed', this.settings.ballSpeed);
        this.updateSettingDisplay('paddle-size', this.settings.paddleSize);
        this.updateSettingDisplay('winning-score', this.settings.winningScore);

        // Event listeners for real-time updates
        ballSpeedSlider.addEventListener('input', (e) => {
            this.updateSettingDisplay('ball-speed', e.target.value);
        });

        paddleSizeSlider.addEventListener('input', (e) => {
            this.updateSettingDisplay('paddle-size', e.target.value);
        });

        winningScoreSlider.addEventListener('input', (e) => {
            this.updateSettingDisplay('winning-score', e.target.value);
        });

        themeSelect.addEventListener('change', (e) => {
            this.previewTheme(e.target.value);
        });
    }

    updateSettingDisplay(setting, value) {
        const display = document.getElementById(`${setting}-value`);
        if (!display) return;

        switch (setting) {
            case 'ball-speed':
                display.textContent = value;
                break;
            case 'paddle-size':
                const sizes = ['Small', 'Medium', 'Large'];
                display.textContent = sizes[value - 1] || 'Medium';
                break;
            case 'winning-score':
                display.textContent = value;
                break;
        }
    }

    previewTheme(theme) {
        document.body.className = theme === 'neon' ? 'neon-theme' : '';
    }

    saveSettings() {
        const newSettings = {
            theme: document.getElementById('theme-select').value,
            ballSpeed: parseInt(document.getElementById('ball-speed').value),
            paddleSize: parseInt(document.getElementById('paddle-size').value),
            winningScore: parseInt(document.getElementById('winning-score').value),
            soundEnabled: document.getElementById('sound-toggle').checked,
            musicEnabled: document.getElementById('music-toggle').checked,
            powerupsEnabled: document.getElementById('powerups-toggle').checked
        };

        this.settings = newSettings;
        gameStorage.saveSettings(newSettings);
        this.applySettings();
    }

    applySettings() {
        // Apply theme
        this.previewTheme(this.settings.theme);

        // Apply audio settings
        window.audioSystem.setSoundEnabled(this.settings.soundEnabled);
        window.audioSystem.setMusicEnabled(this.settings.musicEnabled);

        // Other settings are applied when starting a new game
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });

        // Show target screen
        let targetScreen = null;

        // Map screen names to actual screen objects
        switch (screenName) {
            case 'main-menu':
                targetScreen = this.screens.mainMenu;
                break;
            case 'difficulty-menu':
                targetScreen = this.screens.difficultyMenu;
                break;
            case 'settings-menu':
                targetScreen = this.screens.settingsMenu;
                break;
            case 'leaderboard-menu':
                targetScreen = this.screens.leaderboardMenu;
                break;
            case 'how-to-play-menu':
                targetScreen = this.screens.howToPlayMenu;
                break;
            case 'game-screen':
                targetScreen = this.screens.gameScreen;
                break;
            case 'game-over':
                targetScreen = this.screens.gameOver;
                break;
            case 'pause-screen':
                targetScreen = this.screens.pauseScreen;
                break;
            default:
                console.error('Unknown screen:', screenName);
        }

        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.currentScreen = screenName;
        }
    }

    startGame(gameMode, difficulty = null) {
        this.showScreen('game-screen');

        // Update game mode display
        let modeText = gameMode === 'single-player' ? 
            `Single Player - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}` :
            'Two Player';

        this.gameUI.gameModeDisplay.textContent = modeText;

        // Update player names
        this.gameUI.player1Name.textContent = 'Player 1';
        this.gameUI.player2Name.textContent = gameMode === 'single-player' ? 'AI' : 'Player 2';

        // Configure touch controls for mobile
        if (controlSystem.isMobileDevice()) {
            controlSystem.setTouchControlsEnabled(true);
        }

        // Start the game
        if (window.game) {
            window.game.startNewGame(gameMode, difficulty, this.settings);
        }
    }

    updateScore(player1Score, player2Score) {
        this.gameUI.player1Score.textContent = player1Score;
        this.gameUI.player2Score.textContent = player2Score;
    }

    showCountdown(count) {
        const countdownElement = this.gameUI.countdown;
        if (count > 0) {
            countdownElement.textContent = count;
            countdownElement.classList.remove('hidden');

            // Trigger animation
            countdownElement.style.animation = 'none';
            countdownElement.offsetHeight; // Trigger reflow
            countdownElement.style.animation = 'pulse 1s ease-in-out';
        } else {
            countdownElement.classList.add('hidden');
        }
    }

    updatePowerups(activePowerUps) {
        const container = this.gameUI.activePowerups;
        container.innerHTML = '';

        activePowerUps.forEach(powerUp => {
            const indicator = document.createElement('div');
            indicator.className = 'powerup-indicator';
            indicator.innerHTML = `
                <div>${powerUp.name}</div>
                <div>${powerUp.beneficiary.replace('player', 'P')}</div>
                <div>${powerUp.timeRemaining}s</div>
            `;
            container.appendChild(indicator);
        });
    }

    showGameOver(gameData) {
        this.showScreen('game-over');

        // Display final score
        const finalScore = document.getElementById('final-score');
        finalScore.innerHTML = `
            <div class="winner">${gameData.winner} Wins!</div>
            <div class="score-display">
                ${gameData.player1Score} - ${gameData.player2Score}
            </div>
        `;

        // Display game statistics
        const gameStats = document.getElementById('game-stats');
        gameStats.innerHTML = `
            <div class="stat-item">
                <span>Game Duration:</span>
                <span>${this.formatDuration(gameData.gameDuration)}</span>
            </div>
            <div class="stat-item">
                <span>Total Hits:</span>
                <span>${gameData.totalHits}</span>
            </div>
            <div class="stat-item">
                <span>Max Ball Speed:</span>
                <span>${gameData.maxBallSpeed.toFixed(1)}</span>
            </div>
            <div class="stat-item">
                <span>Ball Distance:</span>
                <span>${gameData.ballDistance}px</span>
            </div>
        `;
    }

    showPauseScreen() {
        this.showScreen('pause-screen');
    }

    hidePauseScreen() {
        this.showScreen('game-screen');
    }

    updateLeaderboard() {
        const leaderboardContent = document.getElementById('leaderboard-content');
        const entries = gameStorage.getFormattedLeaderboard();

        if (entries.length === 0) {
            leaderboardContent.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    No scores recorded yet. Play some games to see your scores here!
                </div>
            `;
            return;
        }

        leaderboardContent.innerHTML = entries.map(entry => `
            <div class="leaderboard-entry">
                <div class="leaderboard-rank">#${entry.rank}</div>
                <div class="leaderboard-info">
                    <div><strong>${entry.gameMode}${entry.difficulty ? ` - ${entry.difficulty}` : ''}</strong></div>
                    <div>Winner: ${entry.winner} | Duration: ${entry.duration}</div>
                    <div>Hits: ${entry.hits} | Date: ${entry.date}</div>
                </div>
                <div class="leaderboard-score">${entry.score}</div>
            </div>
        `).join('');
    }

    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${remainingSeconds}s`;
    }

    // Responsive canvas sizing
    resizeCanvas(canvas) {
        const container = canvas.parentElement;
        const containerRect = container.getBoundingClientRect();

        // Calculate optimal size maintaining aspect ratio
        const aspectRatio = 16 / 9; // 16:9 aspect ratio
        let width = Math.min(containerRect.width - 40, 1200); // Max width 1200px
        let height = width / aspectRatio;

        // Ensure minimum playable size
        const minWidth = 600;
        const minHeight = minWidth / aspectRatio;

        if (width < minWidth) {
            width = minWidth;
            height = minHeight;
        }

        // Adjust if height is too large for viewport
        const maxHeight = window.innerHeight - 150; // Account for UI elements
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        return { width, height };
    }

    // Mobile orientation handling
    handleOrientationChange() {
        // Add a delay to allow for orientation change to complete
        setTimeout(() => {
            if (this.currentScreen === 'game-screen' && window.pongGame) {
                window.pongGame.handleResize();
            }
        }, 500);
    }

    // Initialize mobile-specific features
    initializeMobileFeatures() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.currentScreen === 'game-screen' && window.game) {
                window.game.handleResize();
            }
        });

        // Auto-configure for mobile devices
        controlSystem.autoConfigureForDevice();
    }

    // Initialize the UI system
    initialize() {
        if (this.initialized) return;

        this.initializeMobileFeatures();
        this.initialized = true;

        // Show main menu
        this.showScreen('main-menu');

        // Start background music if enabled
        if (this.settings.musicEnabled) {
            window.audioSystem.startBackgroundMusic();
        }
    }
}

// UI manager will be created by the main initialization script