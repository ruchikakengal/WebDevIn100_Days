class AlienPortalGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.settingsOverlay = document.getElementById('settingsOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        this.startButton = document.getElementById('startButton');
        this.settingsButton = document.getElementById('settingsButton');
        this.scoreElement = document.getElementById('score');
        this.livesContainer = document.getElementById('livesContainer');
        this.levelElement = document.getElementById('level');
        this.streakElement = document.getElementById('streak');
        this.highScoreElement = document.getElementById('highScore');
        this.comboDisplay = document.getElementById('comboDisplay');
        this.levelUpNotification = document.getElementById('levelUpNotification');
        this.powerUpsContainer = document.getElementById('powerUpsContainer');

        this.gameState = {
            isPlaying: false,
            score: 0,
            lives: 3,
            level: 1,
            streak: 0,
            combo: 0,
            spawnDelay: 2000,
            alienTimeout: 1000,
            activeAliens: new Set(),
            activePowerUps: new Set(),
            gameLoopInterval: null,
            powerUpInterval: null,
            difficultySeed: 5,
            highScore: parseInt(localStorage.getItem('alienPortalHighScore') || '0'),
            lastCatchTime: 0,
            maxComboTime: 2000
        };

        this.settings = {
            difficulty: 'normal',
            soundEnabled: true,
            particlesEnabled: true
        };

        this.powerUpTypes = {
            freeze: { icon: '❄️', duration: 3000, color: '#74b9ff' },
            slow: { icon: '🐌', duration: 4000, color: '#a29bfe' },
            multi: { icon: '✖️', duration: 2000, color: '#fd79a8' }
        };

        this.activePowerUpEffects = new Map();
        this.soundContext = null;
        this.initializeGame();
    }

    initializeGame() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.settingsButton.addEventListener('click', () => this.showSettings());
        this.setupSettingsListeners();
        this.initializeAudio();
        this.updateDisplay();
        this.showGameOverlay('Alien Hunt', 'Click aliens to catch them before they escape!');
    }

    setupSettingsListeners() {
        const saveButton = document.getElementById('saveSettings');
        const closeButton = document.getElementById('closeSettings');
        const difficultySelect = document.getElementById('difficultySelect');
        const soundToggle = document.getElementById('soundToggle');
        const particlesToggle = document.getElementById('particlesToggle');

        saveButton.addEventListener('click', () => {
            this.settings.difficulty = difficultySelect.value;
            this.settings.soundEnabled = soundToggle.checked;
            this.settings.particlesEnabled = particlesToggle.checked;
            this.hideSettings();
            this.applyDifficultySettings();
        });

        closeButton.addEventListener('click', () => this.hideSettings());
    }

    initializeAudio() {
        try {
            this.soundContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    playSound(frequency, duration = 200, type = 'sine') {
        if (!this.settings.soundEnabled || !this.soundContext) return;
        
        const oscillator = this.soundContext.createOscillator();
        const gainNode = this.soundContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.soundContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.soundContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.soundContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.soundContext.currentTime + duration / 1000);
        
        oscillator.start(this.soundContext.currentTime);
        oscillator.stop(this.soundContext.currentTime + duration / 1000);
    }

    showSettings() {
        this.settingsOverlay.classList.remove('hidden');
        document.getElementById('difficultySelect').value = this.settings.difficulty;
        document.getElementById('soundToggle').checked = this.settings.soundEnabled;
        document.getElementById('particlesToggle').checked = this.settings.particlesEnabled;
    }

    hideSettings() {
        this.settingsOverlay.classList.add('hidden');
    }

    applyDifficultySettings() {
        const difficultyMultipliers = {
            easy: { spawn: 1.5, timeout: 1.5, points: 8 },
            normal: { spawn: 1, timeout: 1, points: 5 },
            hard: { spawn: 0.7, timeout: 0.8, points: 4 },
            insane: { spawn: 0.5, timeout: 0.6, points: 3 }
        };
        
        const multiplier = difficultyMultipliers[this.settings.difficulty];
        this.gameState.spawnDelay = Math.floor(2000 * multiplier.spawn);
        this.gameState.alienTimeout = Math.floor(1000 * multiplier.timeout);
        this.gameState.difficultySeed = multiplier.points;
    }

    startGame() {
        this.resetGameState();
        this.hideGameOverlay();
        this.applyDifficultySettings();
        this.gameState.isPlaying = true;
        this.startGameLoop();
        this.startPowerUpLoop();
        this.updateDisplay();
        this.playSound(440, 300);
    }

    resetGameState() {
        this.gameState.score = 0;
        this.gameState.lives = 3;
        this.gameState.level = 1;
        this.gameState.streak = 0;
        this.gameState.combo = 0;
        this.gameState.lastCatchTime = 0;
        this.gameState.activeAliens.clear();
        this.gameState.activePowerUps.clear();
        this.activePowerUpEffects.clear();
        this.clearAllAliens();
        this.clearAllPowerUps();
        this.hideCombo();
        
        if (this.gameState.gameLoopInterval) {
            clearInterval(this.gameState.gameLoopInterval);
        }
        if (this.gameState.powerUpInterval) {
            clearInterval(this.gameState.powerUpInterval);
        }
    }

    startGameLoop() {
        this.spawnAlien();
        
        this.gameState.gameLoopInterval = setInterval(() => {
            if (this.gameState.isPlaying && !this.activePowerUpEffects.has('freeze')) {
                this.spawnAlien();
            }
        }, this.gameState.spawnDelay);
    }

    startPowerUpLoop() {
        this.gameState.powerUpInterval = setInterval(() => {
            if (this.gameState.isPlaying && Math.random() < 0.3) {
                this.spawnPowerUp();
            }
        }, 8000);
    }

    spawnAlien() {
        if (!this.gameState.isPlaying) return;

        const alienId = Date.now() + Math.random();
        const position = this.getRandomPosition();
        const alienType = this.getAlienType();
        
        const portal = this.createPortal(position);
        this.gameArea.appendChild(portal);

        setTimeout(() => {
            const alien = this.createAlien(alienId, portal, alienType);
            portal.appendChild(alien);
            this.gameState.activeAliens.add(alienId);

            let timeout = this.gameState.alienTimeout;
            if (this.activePowerUpEffects.has('slow')) {
                timeout *= 1.5;
            }

            setTimeout(() => {
                if (this.gameState.activeAliens.has(alienId)) {
                    this.missAlien(alienId, portal);
                }
            }, timeout);
        }, 300);
    }

    getAlienType() {
        const rand = Math.random();
        if (rand < 0.05) return 'bonus';
        if (rand < 0.15) return 'special';
        return 'normal';
    }

    spawnPowerUp() {
        if (this.gameState.activePowerUps.size >= 2) return;

        const powerUpId = Date.now() + Math.random();
        const position = this.getRandomPosition();
        const types = Object.keys(this.powerUpTypes);
        const type = types[Math.floor(Math.random() * types.length)];
        
        const powerUp = this.createPowerUp(powerUpId, position, type);
        this.powerUpsContainer.appendChild(powerUp);
        this.gameState.activePowerUps.add(powerUpId);

        setTimeout(() => {
            if (this.gameState.activePowerUps.has(powerUpId)) {
                this.removePowerUp(powerUpId);
            }
        }, 10000);
    }

    createPortal(position) {
        const portal = document.createElement('div');
        portal.className = 'portal';
        portal.style.left = position.x + 'px';
        portal.style.top = position.y + 'px';
        return portal;
    }

    createAlien(alienId, portal, type = 'normal') {
        const alien = document.createElement('div');
        alien.className = `alien alien-spawning ${type}`;
        alien.dataset.alienId = alienId;
        alien.dataset.type = type;
        
        alien.addEventListener('click', (e) => {
            e.stopPropagation();
            this.catchAlien(alienId, portal, e.clientX, e.clientY, type);
        });

        return alien;
    }

    createPowerUp(powerUpId, position, type) {
        const powerUp = document.createElement('div');
        powerUp.className = `power-up ${type}`;
        powerUp.style.left = position.x + 'px';
        powerUp.style.top = position.y + 'px';
        powerUp.dataset.powerUpId = powerUpId;
        powerUp.dataset.type = type;
        powerUp.textContent = this.powerUpTypes[type].icon;
        
        powerUp.addEventListener('click', (e) => {
            e.stopPropagation();
            this.collectPowerUp(powerUpId, type, e.clientX, e.clientY);
        });

        return powerUp;
    }

    getRandomPosition() {
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const portalSize = 100; 
        const margin = 20;

        const maxX = gameAreaRect.width - portalSize - margin;
        const maxY = gameAreaRect.height - portalSize - margin;

        return {
            x: Math.random() * maxX + margin,
            y: Math.random() * maxY + margin
        };
    }

    catchAlien(alienId, portal, clickX, clickY, type = 'normal') {
        if (!this.gameState.activeAliens.has(alienId)) return;

        this.gameState.activeAliens.delete(alienId);
        this.gameState.streak++;
        
        let points = 1;
        if (type === 'special') points = 5;
        if (type === 'bonus') points = 3;
        
        if (this.activePowerUpEffects.has('multi')) {
            points *= 2;
        }

        const now = Date.now();
        if (now - this.gameState.lastCatchTime <= this.gameState.maxComboTime) {
            this.gameState.combo++;
            if (this.gameState.combo >= 3) {
                points += Math.floor(this.gameState.combo / 3);
                this.showCombo();
            }
        } else {
            this.gameState.combo = 0;
            this.hideCombo();
        }
        this.gameState.lastCatchTime = now;

        this.gameState.score += points;

        const alien = portal.querySelector('.alien');
        if (alien) {
            alien.className = 'alien alien-caught';
        }

        this.showScorePopup(clickX, clickY, points, type);

        const frequency = type === 'special' ? 880 : type === 'bonus' ? 660 : 440;
        this.playSound(frequency, 150);

        if (this.settings.particlesEnabled) {
            this.createParticles(clickX, clickY, type);
        }

        setTimeout(() => {
            if (portal.parentNode) {
                portal.parentNode.removeChild(portal);
            }
        }, 500);

        this.checkLevelProgression();
        this.updateDisplay();
    }

    collectPowerUp(powerUpId, type, clickX, clickY) {
        if (!this.gameState.activePowerUps.has(powerUpId)) return;

        this.gameState.activePowerUps.delete(powerUpId);
        this.activatePowerUp(type);
        
        const powerUpElement = document.querySelector(`[data-power-up-id="${powerUpId}"]`);
        if (powerUpElement && powerUpElement.parentNode) {
            powerUpElement.parentNode.removeChild(powerUpElement);
        }

        this.showScorePopup(clickX, clickY, this.powerUpTypes[type].icon, 'power-up');
        this.playSound(550, 200);

        if (this.settings.particlesEnabled) {
            this.createParticles(clickX, clickY, 'power-up');
        }
    }

    activatePowerUp(type) {
        const duration = this.powerUpTypes[type].duration;
        this.activePowerUpEffects.set(type, Date.now() + duration);

       
        if (type === 'freeze') {
           
        } else if (type === 'slow') {
           
        } else if (type === 'multi') {
           
        }

        setTimeout(() => {
            this.activePowerUpEffects.delete(type);
        }, duration);
    }

    missAlien(alienId, portal) {
        if (!this.gameState.activeAliens.has(alienId)) return;

        this.gameState.activeAliens.delete(alienId);
        this.gameState.lives--;
        this.gameState.streak = 0;
        this.gameState.combo = 0;
        this.hideCombo();

        if (portal.parentNode) {
            portal.parentNode.removeChild(portal);
        }

        this.playSound(220, 300, 'sawtooth');

        this.gameArea.classList.add('shake');
        setTimeout(() => this.gameArea.classList.remove('shake'), 500);

        this.updateDisplay();

        if (this.gameState.lives <= 0) {
            this.endGame();
        }
    }

    removePowerUp(powerUpId) {
        if (!this.gameState.activePowerUps.has(powerUpId)) return;
        
        this.gameState.activePowerUps.delete(powerUpId);
        const powerUpElement = document.querySelector(`[data-power-up-id="${powerUpId}"]`);
        if (powerUpElement && powerUpElement.parentNode) {
            powerUpElement.parentNode.removeChild(powerUpElement);
        }
    }

    showScorePopup(x, y, points = 1, type = 'normal') {
        const popup = document.createElement('div');
        let className = 'score-popup';
        let text = `+${points}`;
        
        if (type === 'special') {
            className += ' special';
        } else if (type === 'bonus') {
            className += ' bonus';
        } else if (type === 'power-up') {
            text = points; 
        }
        
        popup.className = className;
        popup.textContent = text;
    
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        popup.style.left = (x - gameAreaRect.left) + 'px';
        popup.style.top = (y - gameAreaRect.top) + 'px';
        
        this.gameArea.appendChild(popup);

        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }

    showCombo() {
        this.comboDisplay.textContent = `${this.gameState.combo}x COMBO!`;
        this.comboDisplay.classList.add('show');
    }

    hideCombo() {
        this.comboDisplay.classList.remove('show');
    }

    createParticles(x, y, type) {
        const colors = {
            normal: ['#ff6b6b', '#ff8e8e'],
            special: ['#ffd700', '#ffed4e'],
            bonus: ['#9c88ff', '#c7b3ff'],
            'power-up': ['#74b9ff', '#00cec9']
        };
        
        const particleColors = colors[type] || colors.normal;
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.left = (x - gameAreaRect.left) + 'px';
            particle.style.top = (y - gameAreaRect.top) + 'px';
            
            this.gameArea.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    checkLevelProgression() {
        const newLevel = Math.floor(this.gameState.score / this.gameState.difficultySeed) + 1;
        
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            
            this.showLevelUpNotification();
            
            this.gameState.spawnDelay = Math.max(500, this.gameState.spawnDelay - 200);
            
            this.gameState.alienTimeout = Math.max(800, this.gameState.alienTimeout - 50);
            
            this.playSound(660, 500, 'square');
            
            if (this.gameState.gameLoopInterval) {
                clearInterval(this.gameState.gameLoopInterval);
                this.startGameLoop();
            }
        }
    }

    showLevelUpNotification() {
        this.levelUpNotification.textContent = `LEVEL ${this.gameState.level}!`;
        this.levelUpNotification.classList.add('show');
        
        setTimeout(() => {
            this.levelUpNotification.classList.remove('show');
        }, 2000);
    }

    endGame() {
        this.gameState.isPlaying = false;
        
        if (this.gameState.gameLoopInterval) {
            clearInterval(this.gameState.gameLoopInterval);
        }
        if (this.gameState.powerUpInterval) {
            clearInterval(this.gameState.powerUpInterval);
        }

        if (this.gameState.score > this.gameState.highScore) {
            this.gameState.highScore = this.gameState.score;
            localStorage.setItem('alienPortalHighScore', this.gameState.highScore.toString());
        }

        this.clearAllAliens();
        this.clearAllPowerUps();

        this.playSound(200, 1000, 'sawtooth');

        setTimeout(() => {
            const isNewRecord = this.gameState.score === this.gameState.highScore && this.gameState.score > 0;
            const recordText = isNewRecord ? '\n🎉 NEW HIGH SCORE! 🎉\n' : '';
            
            this.showGameOverlay(
                'Game Over!', 
                `Final Score: ${this.gameState.score}${recordText}Level Reached: ${this.gameState.level}\nMax Streak: ${this.gameState.streak}\nHigh Score: ${this.gameState.highScore}\n\nClick "Start Game" to play again!`
            );
        }, 1000);
    }

    clearAllAliens() {
        const portals = this.gameArea.querySelectorAll('.portal');
        portals.forEach(portal => {
            if (portal.parentNode) {
                portal.parentNode.removeChild(portal);
            }
        });

        const popups = this.gameArea.querySelectorAll('.score-popup');
        popups.forEach(popup => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        });

        const particles = this.gameArea.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });

        this.gameState.activeAliens.clear();
    }

    clearAllPowerUps() {
        const powerUps = this.powerUpsContainer.querySelectorAll('.power-up');
        powerUps.forEach(powerUp => {
            if (powerUp.parentNode) {
                powerUp.parentNode.removeChild(powerUp);
            }
        });
        this.gameState.activePowerUps.clear();
    }

    updateDisplay() {
        this.scoreElement.textContent = this.gameState.score;
        this.levelElement.textContent = this.gameState.level;
        this.streakElement.textContent = this.gameState.streak;
        this.highScoreElement.textContent = this.gameState.highScore;
        
        const hearts = this.livesContainer.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index < this.gameState.lives) {
                heart.classList.remove('lost');
            } else {
                heart.classList.add('lost');
            }
        });
    }

    showGameOverlay(title, message) {
        this.overlayTitle.textContent = title;
        this.overlayMessage.textContent = message;
        this.overlayMessage.style.whiteSpace = 'pre-line';
        this.gameOverlay.classList.remove('hidden');
    }

    hideGameOverlay() {
        this.gameOverlay.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.alienPortalGame = new AlienPortalGame();
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.alienPortalGame && window.alienPortalGame.gameState.isPlaying) {
        
    }
});

document.addEventListener('keydown', (e) => {
    if (!window.alienPortalGame) return;
    
    switch(e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            if (!window.alienPortalGame.gameState.isPlaying) {
                document.getElementById('startButton').click();
            }
            break;
        case 'Escape':
            if (window.alienPortalGame.gameState.isPlaying) {
                window.alienPortalGame.endGame();
            }
            break;
        case 's':
        case 'S':
            if (!window.alienPortalGame.gameState.isPlaying) {
                document.getElementById('settingsButton').click();
            }
            break;
    }
});
