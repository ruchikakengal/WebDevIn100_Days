class MathRacingGame {
    constructor() {
        this.gameState = 'menu'; 
        this.currentScreen = 'mainMenu';
        this.players = {
            1: {
                name: 'Player 1',
                score: 0,
                streak: 0,
                multiplier: 1,
                powerups: { double: 0, time: 0, freeze: 0 },
                stats: {
                    totalAnswers: 0,
                    correctAnswers: 0,
                    totalTime: 0,
                    bestStreak: 0,
                    powerupsUsed: 0
                },
                effects: new Set(),
                color: '#3498db',
                theme: 'blue'
            },
            2: {
                name: 'Player 2',
                score: 0,
                streak: 0,
                multiplier: 1,
                powerups: { double: 0, time: 0, freeze: 0 },
                stats: {
                    totalAnswers: 0,
                    correctAnswers: 0,
                    totalTime: 0,
                    bestStreak: 0,
                    powerupsUsed: 0
                },
                effects: new Set(),
                color: '#e74c3c',
                theme: 'red'
            }
        };
        
        this.settings = {
            difficulty: 'medium',
            powerupsEnabled: true,
            soundEnabled: true,
            particlesEnabled: true,
            targetScore: 5,
            timeLimit: 5,
            masterVolume: 0.7,
            sfxVolume: 0.8,
            highContrast: false,
            largeText: false,
            reduceMotion: false
        };
        
        this.currentProblem = null;
        this.problemStartTime = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.problemHistory = [];
        this.particleSystem = null;
        this.audioSystem = null;
        
        this.keyHandlers = new Map();
        this.frozenPlayers = new Set();
        
        this.init();
    }
    
    async init() {
        console.log('Initializing CalRace...');
        
        await this.initializeSystems();
        
        this.loadSettings();
        this.loadStatistics();
        
        this.setupEventListeners();
        
        this.setupUI();
        
        this.showScreen('mainMenu');
        
        console.log('Game initialized successfully!');
    }
    
    async initializeSystems() {
        try {
            const canvas = document.getElementById('particleCanvas');
            if (canvas && this.settings.particlesEnabled) {
                this.particleSystem = new ParticleSystem(canvas);
                console.log('Particle system initialized');
            }
            
            if (this.settings.soundEnabled) {
                this.audioSystem = new AudioSystem();
                await this.audioSystem.initializeAudio();
                this.audioSystem.setMasterVolume(this.settings.masterVolume);
                this.audioSystem.setSfxVolume(this.settings.sfxVolume);
                console.log('Audio system initialized');
            }
        } catch (error) {
            console.error('Error initializing systems:', error);
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        window.addEventListener('beforeunload', () => this.saveSettings());
        window.addEventListener('blur', () => {
            if (this.gameState === 'playing') {
                this.pauseGame();
            }
        });
        
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        
        this.setupPlayerSetupEvents();
        
        this.setupSettingsEvents();
    }
    
    setupPlayerSetupEvents() {
        document.getElementById('player1Name').addEventListener('input', (e) => {
            this.players[1].name = e.target.value || 'Player 1';
        });
        
        document.getElementById('player2Name').addEventListener('input', (e) => {
            this.players[2].name = e.target.value || 'Player 2';
        });
        
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                const playerSetup = e.target.closest('.player-setup');
                const isPlayer1 = playerSetup === document.querySelector('.players-setup .player-setup:first-child');
                
                playerSetup.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const player = isPlayer1 ? this.players[1] : this.players[2];
                player.theme = color;
                player.color = this.getColorForTheme(color);
            });
        });
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.settings.difficulty = e.target.dataset.difficulty;
            });
        });
        
        document.getElementById('powerupsEnabled').addEventListener('change', (e) => {
            this.settings.powerupsEnabled = e.target.checked;
        });
        
        document.getElementById('soundEnabled').addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            if (this.audioSystem) {
                this.audioSystem.setEnabled(e.target.checked);
            }
        });
        
        document.getElementById('particlesEnabled').addEventListener('change', (e) => {
            this.settings.particlesEnabled = e.target.checked;
        });
    }
    
    setupSettingsEvents() {
       
        const masterVolumeSlider = document.getElementById('masterVolume');
        const sfxVolumeSlider = document.getElementById('sfxVolume');
        
        if (masterVolumeSlider) {
            masterVolumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                this.settings.masterVolume = volume;
                if (this.audioSystem) {
                    this.audioSystem.setMasterVolume(volume);
                }
                e.target.nextElementSibling.textContent = e.target.value + '%';
            });
        }
        
        if (sfxVolumeSlider) {
            sfxVolumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                this.settings.sfxVolume = volume;
                if (this.audioSystem) {
                    this.audioSystem.setSfxVolume(volume);
                }
                e.target.nextElementSibling.textContent = e.target.value + '%';
            });
        }
        
        document.getElementById('highContrast')?.addEventListener('change', (e) => {
            this.settings.highContrast = e.target.checked;
            document.body.classList.toggle('high-contrast', e.target.checked);
        });
        
        document.getElementById('largeText')?.addEventListener('change', (e) => {
            this.settings.largeText = e.target.checked;
            document.body.classList.toggle('large-text', e.target.checked);
        });
        
        document.getElementById('reduceMotion')?.addEventListener('change', (e) => {
            this.settings.reduceMotion = e.target.checked;
            document.body.classList.toggle('reduce-motion', e.target.checked);
        });
    }
    
    setupUI() {
        const masterVolumeSlider = document.getElementById('masterVolume');
        const sfxVolumeSlider = document.getElementById('sfxVolume');
        
        if (masterVolumeSlider) {
            masterVolumeSlider.value = this.settings.masterVolume * 100;
            masterVolumeSlider.nextElementSibling.textContent = Math.round(this.settings.masterVolume * 100) + '%';
        }
        
        if (sfxVolumeSlider) {
            sfxVolumeSlider.value = this.settings.sfxVolume * 100;
            sfxVolumeSlider.nextElementSibling.textContent = Math.round(this.settings.sfxVolume * 100) + '%';
        }
        
        document.body.classList.toggle('high-contrast', this.settings.highContrast);
        document.body.classList.toggle('large-text', this.settings.largeText);
        document.body.classList.toggle('reduce-motion', this.settings.reduceMotion);
    }
    
    getColorForTheme(theme) {
        const colors = {
            blue: '#3498db',
            green: '#2ecc71',
            purple: '#9b59b6',
            orange: '#e67e22',
            red: '#e74c3c'
        };
        return colors[theme] || colors.blue;
    }
    
    handleKeyDown(e) {
        if (['Space', 'Escape', 'F11', 'Enter'].includes(e.code) || 
            e.ctrlKey || e.altKey) {
            e.preventDefault();
        }
        
        switch (e.code) {
            case 'Space':
                if (this.gameState === 'playing') {
                    this.togglePause();
                }
                break;
            case 'Escape':
                if (this.gameState === 'playing') {
                    this.showMainMenu();
                } else if (this.currentScreen !== 'mainMenu') {
                    this.showMainMenu();
                }
                break;
            case 'F11':
                this.toggleFullscreen();
                break;
        }
        
        if (this.gameState === 'playing') {
            this.handleGameKeyDown(e);
        }
    }
    
    handleGameKeyDown(e) {
        if (e.ctrlKey && !this.frozenPlayers.has(1)) {
            switch (e.code) {
                case 'Digit1':
                    this.usePowerup(1, 'double');
                    break;
                case 'Digit2':
                    this.usePowerup(1, 'time');
                    break;
                case 'Digit3':
                    this.usePowerup(1, 'freeze');
                    break;
            }
        }
        
        if (e.altKey && !this.frozenPlayers.has(2)) {
            switch (e.code) {
                case 'Digit1':
                    this.usePowerup(2, 'double');
                    break;
                case 'Digit2':
                    this.usePowerup(2, 'time');
                    break;
                case 'Digit3':
                    this.usePowerup(2, 'freeze');
                    break;
            }
        }
        
        if (e.code === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('answer-input')) {
                const playerId = activeElement.id.includes('player1') ? 1 : 2;
                this.submitAnswer(playerId);
            }
        }
    }
    
    handleKeyUp(e) {
        
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            
            switch (screenName) {
                case 'gameScreen':
                    this.setupGameScreen();
                    break;
                case 'statsScreen':
                    this.updateStatsDisplay();
                    break;
                case 'winnerScreen':
                    this.setupWinnerScreen();
                    break;
            }
        }
    }
    
    showMainMenu() {
        this.gameState = 'menu';
        this.showScreen('mainMenu');
        this.stopTimer();
    }
    
    showPlayerSetup() {
        this.showScreen('playerSetup');
        document.getElementById('player1Name').value = this.players[1].name === 'Player 1' ? '' : this.players[1].name;
        document.getElementById('player2Name').value = this.players[2].name === 'Player 2' ? '' : this.players[2].name;
        document.getElementById('powerupsEnabled').checked = this.settings.powerupsEnabled;
        document.getElementById('soundEnabled').checked = this.settings.soundEnabled;
        document.getElementById('particlesEnabled').checked = this.settings.particlesEnabled;
    }
    
    showSettings() {
        this.showScreen('settingsScreen');
    }
    
    showHelp() {
        this.showScreen('helpScreen');
    }
    
    showStats() {
        this.showScreen('statsScreen');
    }
    
    startGame() {
        this.gameState = 'playing';
        this.resetGameState();
        this.showScreen('gameScreen');
        this.generateNewProblem();
        
        if (this.audioSystem) {
            this.audioSystem.playTick();
        }
    }
    
    startPracticeMode() {
        this.showPlayerSetup();
    }
    
    resetGameState() {
        Object.keys(this.players).forEach(playerId => {
            const player = this.players[playerId];
            player.score = 0;
            player.streak = 0;
            player.multiplier = 1;
            player.powerups = { double: 0, time: 0, freeze: 0 };
            player.effects.clear();
        });
        
        this.problemHistory = [];
        this.frozenPlayers.clear();
        this.timeRemaining = this.settings.timeLimit;
        
        this.updateScoreDisplay();
        this.updatePlayerDisplay();
        this.clearHistory();
    }
    
    setupGameScreen() {
        document.getElementById('player1NameDisplay').textContent = this.players[1].name;
        document.getElementById('player2NameDisplay').textContent = this.players[2].name;
        
        const player1Input = document.getElementById('player1Input');
        const player2Input = document.getElementById('player2Input');
        
        if (player1Input) {
            player1Input.addEventListener('input', () => this.handleAnswerInput(1));
            player1Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer(1);
                }
            });
        }
        
        if (player2Input) {
            player2Input.addEventListener('input', () => this.handleAnswerInput(2));
            player2Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer(2);
                }
            });
        }
        
        this.setupPowerupButtons();
        
        this.enablePlayerInputs();
    }
    
    setupPowerupButtons() {
        const powerupButtons = document.querySelectorAll('.powerup-btn');
        powerupButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const playerArea = e.target.closest('.player-area');
                const playerId = playerArea.id.includes('player1') ? 1 : 2;
                const powerupType = e.target.dataset.powerup || e.target.closest('[data-powerup]').dataset.powerup;
                
                this.usePowerup(playerId, powerupType);
            });
        });
    }
    
    generateNewProblem() {
        const difficulty = this.settings.difficulty;
        let num1, num2, operator, answer;
        
        switch (difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                break;
            case 'medium':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                break;
            case 'hard':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
                break;
        }
        
        const operators = ['+', '-', '×', '÷'];
        operator = operators[Math.floor(Math.random() * operators.length)];
        
        switch (operator) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
                break;
            case '×':
                if (difficulty === 'easy') {
                    num1 = Math.floor(Math.random() * 5) + 1;
                    num2 = Math.floor(Math.random() * 5) + 1;
                }
                answer = num1 * num2;
                break;
            case '÷':
                answer = Math.floor(Math.random() * 10) + 1;
                num1 = answer * num2;
                break;
        }
        
        this.currentProblem = {
            num1,
            num2,
            operator,
            answer,
            difficulty,
            startTime: Date.now()
        };
        
        this.displayProblem();
        this.startTimer();
        this.clearPlayerInputs();
        this.enablePlayerInputs();
    }
    
    displayProblem() {
        const problemElement = document.getElementById('currentProblem');
        const difficultyElement = document.getElementById('problemDifficulty');
        
        if (problemElement && this.currentProblem) {
            const { num1, num2, operator } = this.currentProblem;
            problemElement.textContent = `${num1} ${operator} ${num2} = ?`;
            problemElement.classList.add('problem-fade-in');
            
            setTimeout(() => {
                problemElement.classList.remove('problem-fade-in');
            }, 500);
        }
        
        if (difficultyElement) {
            difficultyElement.textContent = `${this.settings.difficulty.toUpperCase()} MODE`;
        }
    }
    
    startTimer() {
        this.timeRemaining = this.settings.timeLimit;
        this.problemStartTime = Date.now();
        
        if (this.players[1].effects.has('extraTime') || this.players[2].effects.has('extraTime')) {
            this.timeRemaining += 3;
        }
        
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining -= 0.1;
            
            if (this.timeRemaining <= 0) {
                this.handleTimeout();
            } else {
                this.updateTimerDisplay();
                
                if (this.timeRemaining <= 2 && this.timeRemaining > 1.9 && this.audioSystem) {
                    this.audioSystem.playTimeWarning();
                }
                
                if (Math.abs(this.timeRemaining % 1) < 0.1 && this.audioSystem) {
                    this.audioSystem.playTick();
                }
            }
        }, 100);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimerDisplay() {
        const timerText = document.querySelector('.timer-text');
        const timerProgress = document.querySelector('.timer-progress');
        
        if (timerText) {
            timerText.textContent = Math.ceil(this.timeRemaining);
        }
        
        if (timerProgress) {
            const totalTime = this.settings.timeLimit + (this.players[1].effects.has('extraTime') || this.players[2].effects.has('extraTime') ? 3 : 0);
            const progress = (this.timeRemaining / totalTime) * 157;
            timerProgress.style.strokeDasharray = `${progress} 157`;
            
            if (this.timeRemaining <= 2) {
                timerProgress.style.stroke = '#e74c3c';
            } else if (this.timeRemaining <= 3) {
                timerProgress.style.stroke = '#f39c12';
            } else {
                timerProgress.style.stroke = '#3498db';
            }
        }
    }
    
    handleAnswerInput(playerId) {
        if (this.frozenPlayers.has(playerId)) return;
        
        const input = document.getElementById(`player${playerId}Input`);
        if (!input) return;
        
        const value = input.value.trim();
        
        if (value && !isNaN(value) && parseFloat(value) === this.currentProblem.answer) {
            setTimeout(() => this.submitAnswer(playerId), 100);
        }
    }
    
    submitAnswer(playerId) {
        if (this.gameState !== 'playing' || this.frozenPlayers.has(playerId)) return;
        
        const input = document.getElementById(`player${playerId}Input`);
        if (!input) return;
        
        const answer = parseFloat(input.value.trim());
        const isCorrect = !isNaN(answer) && answer === this.currentProblem.answer;
        const responseTime = Date.now() - this.problemStartTime;
        
        const player = this.players[playerId];
        player.stats.totalAnswers++;
        player.stats.totalTime += responseTime;
        
        if (isCorrect) {
            this.handleCorrectAnswer(playerId, responseTime);
        } else {
            this.handleIncorrectAnswer(playerId);
        }
        
        this.updatePlayerStats(playerId);
        
        this.addToHistory(playerId, isCorrect, responseTime);
        
        if (player.score >= this.settings.targetScore) {
            this.handleGameWin(playerId);
        } else {
            setTimeout(() => this.generateNewProblem(), 1000);
        }
    }
    
    handleCorrectAnswer(playerId, responseTime) {
        const player = this.players[playerId];
        
        player.stats.correctAnswers++;
        
        let points = 1;
        if (player.effects.has('doublePoints')) {
            points = 2;
            player.effects.delete('doublePoints');
            this.removePlayerEffect(playerId, 'doublePoints');
        }
        
        points *= player.multiplier;
        
        player.score += points;
        player.streak++;
        player.stats.bestStreak = Math.max(player.stats.bestStreak, player.streak);
        
        if (player.streak >= 5) {
            player.multiplier = 3;
        } else if (player.streak >= 3) {
            player.multiplier = 2;
        } else {
            player.multiplier = 1;
        }
        
        if (player.streak > 0 && player.streak % 3 === 0 && this.settings.powerupsEnabled) {
            this.awardRandomPowerup(playerId);
        }
        
        this.showInputStatus(playerId, 'correct');
        this.stopTimer();
        this.disablePlayerInputs();
        
        if (this.audioSystem) {
            this.audioSystem.playCorrectAnswer(player.color);
            
            if (player.streak >= 3) {
                this.audioSystem.playStreak(player.streak);
            }
        }
        
        if (this.particleSystem && this.settings.particlesEnabled) {
            const playerPos = this.particleSystem.getPlayerPosition(playerId);
            this.particleSystem.createCorrectAnswerEffect(playerPos.x, playerPos.y, player.color);
            
            if (player.streak >= 3) {
                this.particleSystem.createStreakEffect(playerPos.x, playerPos.y, player.streak);
            }
        }
        
        this.updateScoreDisplay();
        this.updateStreakDisplay(playerId);
        this.updateMultiplierDisplay(playerId);
        this.updatePowerupDisplay(playerId);
    }
    
    handleIncorrectAnswer(playerId) {
        const player = this.players[playerId];
        
        player.streak = 0;
        player.multiplier = 1;
        
        this.showInputStatus(playerId, 'incorrect');
        
        if (this.audioSystem) {
            this.audioSystem.playIncorrectAnswer();
        }
        
        this.updateStreakDisplay(playerId);
        this.updateMultiplierDisplay(playerId);
    }
    
    handleTimeout() {
        this.stopTimer();
        this.disablePlayerInputs();
        
        this.players[1].streak = 0;
        this.players[1].multiplier = 1;
        this.players[2].streak = 0;
        this.players[2].multiplier = 1;
        
        this.addToHistory(0, false, this.settings.timeLimit * 1000);
        
        this.updateStreakDisplay(1);
        this.updateStreakDisplay(2);
        this.updateMultiplierDisplay(1);
        this.updateMultiplierDisplay(2);
        
        if (this.audioSystem) {
            this.audioSystem.playIncorrectAnswer();
        }
        
        setTimeout(() => this.generateNewProblem(), 1000);
    }
    
    handleGameWin(playerId) {
        this.gameState = 'winner';
        this.stopTimer();
        
        this.saveStatistics();
        
        if (this.audioSystem) {
            this.audioSystem.playWinner();
        }
        
        if (this.particleSystem && this.settings.particlesEnabled) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            this.particleSystem.createWinnerFireworks(centerX, centerY);
        }
        
        setTimeout(() => {
            this.showWinnerScreen(playerId);
        }, 1000);
    }
    
    showWinnerScreen(playerId) {
        const winnerText = document.getElementById('winnerText');
        const finalStats = document.getElementById('finalStats');
        
        if (winnerText) {
            winnerText.textContent = `${this.players[playerId].name} Wins!`;
            winnerText.style.color = this.players[playerId].color;
        }
        
        if (finalStats) {
            const player1 = this.players[1];
            const player2 = this.players[2];
            
            finalStats.innerHTML = `
                <div class="stat-row">
                    <span>Final Score:</span>
                    <span>${player1.name}: ${player1.score} | ${player2.name}: ${player2.score}</span>
                </div>
                <div class="stat-row">
                    <span>Best Streak:</span>
                    <span>${player1.name}: ${player1.stats.bestStreak} | ${player2.name}: ${player2.stats.bestStreak}</span>
                </div>
                <div class="stat-row">
                    <span>Accuracy:</span>
                    <span>${player1.name}: ${this.calculateAccuracy(1)}% | ${player2.name}: ${this.calculateAccuracy(2)}%</span>
                </div>
                <div class="stat-row">
                    <span>Avg Response Time:</span>
                    <span>${player1.name}: ${this.calculateAvgTime(1)}s | ${player2.name}: ${this.calculateAvgTime(2)}s</span>
                </div>
            `;
        }
        
        this.showScreen('winnerScreen');
    }
    
    usePowerup(playerId, powerupType) {
        const player = this.players[playerId];
        
        if (player.powerups[powerupType] <= 0) return;
        
        player.powerups[powerupType]--;
        player.stats.powerupsUsed++;
        
        switch (powerupType) {
            case 'double':
                player.effects.add('doublePoints');
                this.applyPlayerEffect(playerId, 'doublePoints');
                break;
            case 'time':
                this.timeRemaining += 3;
                this.updateTimerDisplay();
                break;
            case 'freeze':
                const opponentId = playerId === 1 ? 2 : 1;
                this.freezePlayer(opponentId, 2000);
                break;
        }
        
        if (this.audioSystem) {
            this.audioSystem.playPowerupActivated(powerupType);
        }
        
        if (this.particleSystem && this.settings.particlesEnabled) {
            const playerPos = this.particleSystem.getPlayerPosition(playerId);
            this.particleSystem.createPowerupEffect(playerPos.x, playerPos.y, powerupType);
        }
        
        this.updatePowerupDisplay(playerId);
    }
    
    awardRandomPowerup(playerId) {
        const powerupTypes = ['double', 'time', 'freeze'];
        const randomPowerup = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        
        this.players[playerId].powerups[randomPowerup]++;
        this.updatePowerupDisplay(playerId);
        
        this.showPowerupNotification(playerId, randomPowerup);
    }
    
    showPowerupNotification(playerId, powerupType) {
        const playerArea = document.getElementById(`player${playerId}Area`);
        if (!playerArea) return;
        
        const notification = document.createElement('div');
        notification.className = 'powerup-notification';
        notification.innerHTML = `
            <i class="fas fa-${this.getPowerupIcon(powerupType)}"></i>
            <span>Power-up Earned!</span>
        `;
        
        playerArea.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
    
    getPowerupIcon(powerupType) {
        const icons = {
            double: 'gem',
            time: 'clock',
            freeze: 'snowflake'
        };
        return icons[powerupType] || 'star';
    }
    
    applyPlayerEffect(playerId, effectType) {
        const effectsElement = document.getElementById(`player${playerId}Effects`);
        if (!effectsElement) return;
        
        effectsElement.classList.add(effectType.replace(/([A-Z])/g, '-$1').toLowerCase());
        
        if (effectType === 'doublePoints') {
        }
    }
    
    removePlayerEffect(playerId, effectType) {
        const effectsElement = document.getElementById(`player${playerId}Effects`);
        if (!effectsElement) return;
        
        effectsElement.classList.remove(effectType.replace(/([A-Z])/g, '-$1').toLowerCase());
    }
    
    freezePlayer(playerId, duration) {
        this.frozenPlayers.add(playerId);
        
        const input = document.getElementById(`player${playerId}Input`);
        const effectsElement = document.getElementById(`player${playerId}Effects`);
        
        if (input) {
            input.disabled = true;
        }
        
        if (effectsElement) {
            effectsElement.classList.add('frozen');
        }
        
        setTimeout(() => {
            this.frozenPlayers.delete(playerId);
            
            if (input && this.gameState === 'playing') {
                input.disabled = false;
            }
            
            if (effectsElement) {
                effectsElement.classList.remove('frozen');
            }
        }, duration);
    }
    
    updateScoreDisplay() {
        document.getElementById('player1Score').textContent = this.players[1].score;
        document.getElementById('player2Score').textContent = this.players[2].score;
    }
    
    updateStreakDisplay(playerId) {
        const streakElement = document.getElementById(`player${playerId}Streak`);
        const streakCount = streakElement.querySelector('.streak-count');
        
        if (streakCount) {
            streakCount.textContent = this.players[playerId].streak;
        }
        
        if (this.players[playerId].streak >= 3) {
            streakElement.classList.add('active');
        } else {
            streakElement.classList.remove('active');
        }
    }
    
    updateMultiplierDisplay(playerId) {
        const multiplierElement = document.getElementById(`player${playerId}Multiplier`);
        const multiplierText = multiplierElement.querySelector('.multiplier-text');
        
        if (multiplierText) {
            multiplierText.textContent = `${this.players[playerId].multiplier}x`;
        }
        
        if (this.players[playerId].multiplier > 1) {
            multiplierElement.classList.add('active');
        } else {
            multiplierElement.classList.remove('active');
        }
    }
    
    updatePowerupDisplay(playerId) {
        const powerupsContainer = document.getElementById(`player${playerId}Powerups`);
        if (!powerupsContainer) return;
        
        const player = this.players[playerId];
        
        document.getElementById(`player${playerId}DoubleCount`).textContent = player.powerups.double;
        document.getElementById(`player${playerId}TimeCount`).textContent = player.powerups.time;
        document.getElementById(`player${playerId}FreezeCount`).textContent = player.powerups.freeze;
        
        powerupsContainer.querySelectorAll('.powerup-btn').forEach(btn => {
            const powerupType = btn.dataset.powerup;
            if (player.powerups[powerupType] > 0) {
                btn.classList.add('available');
            } else {
                btn.classList.remove('available');
            }
        });
    }
    
    updatePlayerDisplay() {
        this.updateScoreDisplay();
        this.updateStreakDisplay(1);
        this.updateStreakDisplay(2);
        this.updateMultiplierDisplay(1);
        this.updateMultiplierDisplay(2);
        this.updatePowerupDisplay(1);
        this.updatePowerupDisplay(2);
    }
    
    updatePlayerStats(playerId) {
        const accuracy = this.calculateAccuracy(playerId);
        const avgTime = this.calculateAvgTime(playerId);
        
        document.getElementById(`player${playerId}Accuracy`).textContent = `${accuracy}%`;
        document.getElementById(`player${playerId}AvgTime`).textContent = `${avgTime}s`;
    }
    
    calculateAccuracy(playerId) {
        const stats = this.players[playerId].stats;
        if (stats.totalAnswers === 0) return 100;
        return Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    }
    
    calculateAvgTime(playerId) {
        const stats = this.players[playerId].stats;
        if (stats.correctAnswers === 0) return 0;
        return (stats.totalTime / stats.correctAnswers / 1000).toFixed(1);
    }
    
    showInputStatus(playerId, status) {
        const statusElement = document.getElementById(`player${playerId}Status`);
        if (!statusElement) return;
        
        statusElement.className = `input-status ${status}`;
        statusElement.textContent = status === 'correct' ? '✓' : '✗';
        
        setTimeout(() => {
            statusElement.className = 'input-status';
            statusElement.textContent = '';
        }, 1000);
    }
    
    clearPlayerInputs() {
        document.getElementById('player1Input').value = '';
        document.getElementById('player2Input').value = '';
    }
    
    enablePlayerInputs() {
        const inputs = [
            document.getElementById('player1Input'),
            document.getElementById('player2Input')
        ];
        
        inputs.forEach((input, index) => {
            if (input && !this.frozenPlayers.has(index + 1)) {
                input.disabled = false;
            }
        });
        
        if (inputs[0] && !inputs[0].disabled) {
            inputs[0].focus();
        }
    }
    
    disablePlayerInputs() {
        document.getElementById('player1Input').disabled = true;
        document.getElementById('player2Input').disabled = true;
    }
    
    addToHistory(playerId, isCorrect, responseTime) {
        const historyItem = {
            problem: { ...this.currentProblem },
            playerId,
            isCorrect,
            responseTime,
            timestamp: Date.now()
        };
        
        this.problemHistory.unshift(historyItem);
        
        if (this.problemHistory.length > 10) {
            this.problemHistory = this.problemHistory.slice(0, 10);
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        historyList.innerHTML = '';
        
        this.problemHistory.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            
            if (item.playerId === 0) {
                historyElement.classList.add('timeout');
            } else {
                historyElement.classList.add(item.isCorrect ? `player${item.playerId}-win` : 'incorrect');
            }
            
            const { num1, num2, operator, answer } = item.problem;
            const timeText = item.playerId === 0 ? 'TIMEOUT' : `${(item.responseTime / 1000).toFixed(1)}s`;
            const playerName = item.playerId === 0 ? 'No one' : this.players[item.playerId].name;
            
            historyElement.innerHTML = `
                <span class="problem-text">${num1} ${operator} ${num2} = ${answer}</span>
                <span class="result-text">${playerName} (${timeText})</span>
            `;
            
            historyList.appendChild(historyElement);
        });
    }
    
    clearHistory() {
        this.problemHistory = [];
        this.updateHistoryDisplay();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.pauseGame();
        } else if (this.gameState === 'paused') {
            this.resumeGame();
        }
    }
    
    pauseGame() {
        this.gameState = 'paused';
        this.stopTimer();
        this.disablePlayerInputs();
        
        document.getElementById('pauseOverlay').classList.add('active');
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i>';
    }
    
    resumeGame() {
        this.gameState = 'playing';
        this.enablePlayerInputs();
        
        this.startTimer();
        
        document.getElementById('pauseOverlay').classList.remove('active');
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    handleFullscreenChange() {
        const fullscreenBtn = document.querySelector('.control-btn:nth-child(2)');
        if (fullscreenBtn) {
            const icon = fullscreenBtn.querySelector('i');
            if (document.fullscreenElement) {
                icon.className = 'fas fa-compress';
            } else {
                icon.className = 'fas fa-expand';
            }
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('mathRacingSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('mathRacingSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }
    
    saveStatistics() {
        try {
            const stats = {
                gamesPlayed: this.getStoredStat('gamesPlayed') + 1,
                totalCorrectAnswers: this.getStoredStat('totalCorrectAnswers') + this.players[1].stats.correctAnswers + this.players[2].stats.correctAnswers,
                totalIncorrectAnswers: this.getStoredStat('totalIncorrectAnswers') + (this.players[1].stats.totalAnswers - this.players[1].stats.correctAnswers) + (this.players[2].stats.totalAnswers - this.players[2].stats.correctAnswers),
                bestGameStreak: Math.max(this.getStoredStat('bestGameStreak'), Math.max(this.players[1].stats.bestStreak, this.players[2].stats.bestStreak)),
                totalPowerupsUsed: this.getStoredStat('totalPowerupsUsed') + this.players[1].stats.powerupsUsed + this.players[2].stats.powerupsUsed,
                fastestAnswer: Math.min(this.getStoredStat('fastestAnswer') || Infinity, Math.min(this.players[1].stats.totalTime / Math.max(this.players[1].stats.correctAnswers, 1), this.players[2].stats.totalTime / Math.max(this.players[2].stats.correctAnswers, 1))),
                lastPlayed: Date.now()
            };
            
            localStorage.setItem('mathRacingStats', JSON.stringify(stats));
        } catch (error) {
            console.error('Failed to save statistics:', error);
        }
    }
    
    loadStatistics() {
        try {
            const saved = localStorage.getItem('mathRacingStats');
            if (saved) {
                this.statistics = JSON.parse(saved);
            } else {
                this.statistics = {};
            }
        } catch (error) {
            console.error('Failed to load statistics:', error);
            this.statistics = {};
        }
    }
    
    getStoredStat(statName) {
        return this.statistics && this.statistics[statName] || 0;
    }
    
    updateStatsDisplay() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;
        
        const stats = [
            { label: 'Games Played', value: this.getStoredStat('gamesPlayed') },
            { label: 'Total Correct Answers', value: this.getStoredStat('totalCorrectAnswers') },
            { label: 'Total Incorrect Answers', value: this.getStoredStat('totalIncorrectAnswers') },
            { label: 'Overall Accuracy', value: this.calculateOverallAccuracy() + '%' },
            { label: 'Best Streak', value: this.getStoredStat('bestGameStreak') },
            { label: 'Power-ups Used', value: this.getStoredStat('totalPowerupsUsed') },
            { label: 'Fastest Answer', value: this.formatTime(this.getStoredStat('fastestAnswer')) },
            { label: 'Last Played', value: this.formatDate(this.getStoredStat('lastPlayed')) }
        ];
        
        statsGrid.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <span class="stat-value">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');
    }
    
    calculateOverallAccuracy() {
        const correct = this.getStoredStat('totalCorrectAnswers');
        const incorrect = this.getStoredStat('totalIncorrectAnswers');
        const total = correct + incorrect;
        
        if (total === 0) return 0;
        return Math.round((correct / total) * 100);
    }
    
    formatTime(ms) {
        if (!ms || ms === Infinity) return 'N/A';
        return (ms / 1000).toFixed(2) + 's';
    }
    
    formatDate(timestamp) {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleDateString();
    }
    
    clearStats() {
        if (confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
            localStorage.removeItem('mathRacingStats');
            this.statistics = {};
            this.updateStatsDisplay();
        }
    }
}

function showMainMenu() {
    game.showMainMenu();
}

function showPlayerSetup() {
    game.showPlayerSetup();
}

function startPracticeMode() {
    game.startPracticeMode();
}

function showSettings() {
    game.showSettings();
}

function showStats() {
    game.showStats();
}

function showHelp() {
    game.showHelp();
}

function startGame() {
    game.startGame();
}

function togglePause() {
    game.togglePause();
}

function toggleFullscreen() {
    game.toggleFullscreen();
}

function saveSettings() {
    game.saveSettings();
    alert('Settings saved successfully!');
}

function clearStats() {
    game.clearStats();
}

let game;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing CalRace...');
    game = new MathRacingGame();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && game.gameState === 'playing') {
        game.pauseGame();
    }
});

if (typeof window !== 'undefined') {
    window.MathRacingGame = MathRacingGame;
}