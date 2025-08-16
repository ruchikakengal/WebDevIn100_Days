class PerfectHamsterGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.level = 1;
        this.streak = 0;
        this.maxStreak = 0;
        this.isGameActive = false;
        this.isPaused = false;
        this.currentHamster = null;
        this.gameTimer = null;
        this.hamsterTimer = null;
        this.powerups = {
            slowTime: { count: 0, active: false, duration: 5000 },
            doublePoints: { count: 0, active: false, duration: 10000 }
        };
        
        this.difficultySettings = {
            easy: { 
                gameTime: 45, 
                hamsterMinTime: 1200, 
                hamsterMaxTime: 2500, 
                spawnMinDelay: 800, 
                spawnMaxDelay: 1800 
            },
            normal: { 
                gameTime: 30, 
                hamsterMinTime: 800, 
                hamsterMaxTime: 2000, 
                spawnMinDelay: 500, 
                spawnMaxDelay: 1500 
            },
            hard: { 
                gameTime: 25, 
                hamsterMinTime: 600, 
                hamsterMaxTime: 1500, 
                spawnMinDelay: 300, 
                spawnMaxDelay: 1000 
            },
            expert: { 
                gameTime: 20, 
                hamsterMinTime: 400, 
                hamsterMaxTime: 1000, 
                spawnMinDelay: 200, 
                spawnMaxDelay: 800 
            }
        };
        
        this.hamsterTypes = {
            normal: { emoji: '🐹', points: 10, weight: 70 },
            golden: { emoji: '💎', points: 20, weight: 15 },
            bomb: { emoji: '💀', points: -10, weight: 10 },
            speed: { emoji: '⚡', points: 5, weight: 5 }
        };
        
        this.sessionStats = {
            totalHits: 0,
            goldenHits: 0,
            bombHits: 0,
            speedHits: 0
        };
        
        this.achievements = [
            { id: 'first_hit', name: 'First Strike!', description: 'Hit your first hamster', unlocked: false },
            { id: 'streak_5', name: 'Hot Streak!', description: 'Get a 5-hit streak', unlocked: false },
            { id: 'streak_10', name: 'Unstoppable!', description: 'Get a 10-hit streak', unlocked: false },
            { id: 'score_100', name: 'Century Club', description: 'Score 100 points', unlocked: false },
            { id: 'score_200', name: 'Double Century', description: 'Score 200 points', unlocked: false },
            { id: 'golden_hunter', name: 'Gold Rush', description: 'Hit 5 golden hamsters in one game', unlocked: false },
            { id: 'bomb_dodger', name: 'Bomb Expert', description: 'Complete a game without hitting any bombs', unlocked: false },
            { id: 'speed_demon', name: 'Lightning Fast', description: 'Hit 10 speed hamsters in one game', unlocked: false }
        ];
        
        this.highScore = parseInt(localStorage.getItem('hamsterGameHighScore') || '0');
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateUI();
        console.log('Perfect Hamster Game initialized successfully!');
    }
    
    cacheElements() {
        this.scoreEl = document.getElementById('score');
        this.timerEl = document.getElementById('timer');
        this.levelEl = document.getElementById('level');
        this.highScoreEl = document.getElementById('highscore');
        this.streakContainer = document.getElementById('streakContainer');
        this.streakTextEl = document.getElementById('streakText');
        this.streakFillEl = document.getElementById('streakFill');
        this.gameBoard = document.getElementById('gameBoard');
        this.holes = document.querySelectorAll('.hole');
        this.hamsters = document.querySelectorAll('.hamster');
        this.difficultySelect = document.getElementById('difficulty');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.powerupsContainer = document.getElementById('powerupsContainer');
        this.slowTimePowerup = document.getElementById('slowTimePowerup');
        this.doublePointsPowerup = document.getElementById('doublePointsPowerup');
        this.slowTimeCountEl = document.getElementById('slowTimeCount');
        this.doublePointsCountEl = document.getElementById('doublePointsCount');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.finalScoreEl = document.getElementById('finalScore');
        this.performanceMessageEl = document.getElementById('performanceMessage');
        this.gameSummaryEl = document.getElementById('gameSummary');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.achievementNotification = document.getElementById('achievementNotification');
        this.achievementTitleEl = document.getElementById('achievementTitle');
        this.achievementDescriptionEl = document.getElementById('achievementDescription');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.gameOverModal.addEventListener('click', (e) => {
            if (e.target === this.gameOverModal) this.closeModal();
        });
        
        this.hamsters.forEach((hamster, index) => {
            hamster.addEventListener('click', () => this.hitHamster(index));
        });
        
        this.slowTimePowerup.addEventListener('click', () => this.usePowerup('slowTime'));
        this.doublePointsPowerup.addEventListener('click', () => this.usePowerup('doublePoints'));
        this.achievementNotification.addEventListener('click', () => this.hideAchievement());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isGameActive) {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        this.gameBoard.addEventListener('selectstart', (e) => e.preventDefault());
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) e.preventDefault();
        });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) e.preventDefault();
            lastTouchEnd = now;
        });
    }
    
    startGame() {
        console.log('Starting new game...');
        
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.maxStreak = 0;
        this.isGameActive = true;
        this.isPaused = false;
        this.currentHamster = null;
        this.powerups.slowTime = { count: 0, active: false, duration: 5000 };
        this.powerups.doublePoints = { count: 0, active: false, duration: 10000 };
        this.sessionStats = { totalHits: 0, goldenHits: 0, bombHits: 0, speedHits: 0 };
        this.achievements.forEach(achievement => achievement.unlocked = false);
        
        const difficulty = this.difficultySelect.value;
        this.timeLeft = this.difficultySettings[difficulty].gameTime;
        this.updateUI();
        this.hideAllHamsters();
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-block';
        this.restartBtn.style.display = 'none';
        this.streakContainer.style.display = 'block';
        this.powerupsContainer.style.display = 'block';
        this.startGameTimer();
        this.scheduleNextHamster();
        
        console.log(`Game started on ${difficulty} difficulty with ${this.timeLeft} seconds`);
    }
    
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                this.updateTimer();
                
                if (this.timeLeft > 0 && this.timeLeft % 10 === 0) {
                    this.level++;
                    this.updateLevel();
                    this.checkAchievements();
                }
                
                if (this.timeLeft <= 0) {
                    this.endGame();
                }
            }
        }, this.powerups.slowTime.active ? 1500 : 1000);
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        if (this.isPaused) {
            this.hideCurrentHamster();
            console.log('Game paused');
        } else {
            this.scheduleNextHamster();
            console.log('Game resumed');
        }
    }
    
    scheduleNextHamster() {
        if (!this.isGameActive || this.isPaused) return;
        
        const difficulty = this.difficultySelect.value;
        const settings = this.difficultySettings[difficulty];
        const levelMultiplier = Math.max(0.3, 1 - (this.level - 1) * 0.08);
        const minDelay = Math.floor(settings.spawnMinDelay * levelMultiplier);
        const maxDelay = Math.floor(settings.spawnMaxDelay * levelMultiplier);
        
        const delay = this.randomBetween(minDelay, maxDelay);
        
        console.log(`Scheduling next hamster in ${delay}ms`);
        
        this.hamsterTimer = setTimeout(() => {
            if (this.isGameActive && !this.isPaused) {
                console.log('Timer triggered, showing hamster...');
                this.showRandomHamster();
            }
        }, delay);
    }
    
    showRandomHamster() {
        if (!this.isGameActive || this.isPaused || this.currentHamster !== null) return;
        let availableHoles = Array.from({ length: 9 }, (_, i) => i);
        if (this.currentHamster !== null) {
            availableHoles = availableHoles.filter(i => i !== this.currentHamster);
        }
        
        const holeIndex = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const hamsterType = this.getRandomHamsterType();
        
        this.currentHamster = holeIndex;
        const hamster = this.hamsters[holeIndex];
        const hole = this.holes[holeIndex];
        
        hamster.textContent = this.hamsterTypes[hamsterType].emoji;
        hamster.className = `hamster ${hamsterType}`;
        
        hamster.style.opacity = '';
        hamster.style.visibility = '';
        
        hamster.classList.add('visible');
        
        hole.classList.add('has-hamster');
        
        console.log(`Showing ${hamsterType} hamster at hole ${holeIndex}`);
        
        const difficulty = this.difficultySelect.value;
        const settings = this.difficultySettings[difficulty];
        const levelMultiplier = Math.max(0.3, 1 - (this.level - 1) * 0.08);
        
        let visibleTime;
        if (hamsterType === 'speed') {
            visibleTime = Math.floor(settings.hamsterMinTime * 0.5 * levelMultiplier);
        } else {
            const minTime = Math.floor(settings.hamsterMinTime * levelMultiplier);
            const maxTime = Math.floor(settings.hamsterMaxTime * levelMultiplier);
            visibleTime = this.randomBetween(minTime, maxTime);
        }
        
        this.hamsterTimer = setTimeout(() => {
            this.hideCurrentHamster();
            this.scheduleNextHamster();
        }, visibleTime);
    }
    
    getRandomHamsterType() {
        const random = Math.random() * 100;
        let cumulative = 0;
        
        for (const [type, config] of Object.entries(this.hamsterTypes)) {
            cumulative += config.weight;
            if (random <= cumulative) {
                return type;
            }
        }
        
        return 'normal';
    }
    
    hideCurrentHamster() {
        if (this.currentHamster !== null) {
            const hamster = this.hamsters[this.currentHamster];
            const hole = this.holes[this.currentHamster];
            
            hamster.classList.remove('visible');
            hole.classList.remove('has-hamster');
            
            setTimeout(() => {
                hamster.textContent = '';
                hamster.className = 'hamster';
            }, 400);
            this.currentHamster = null;
        }
    }
    
    hideAllHamsters() {
        this.hamsters.forEach(hamster => {
            hamster.classList.remove('visible', 'hit', 'golden', 'bomb', 'speed');
            hamster.className = 'hamster';
            hamster.textContent = '';
        });
        
        this.holes.forEach(hole => {
            hole.classList.remove('has-hamster');
        });
        
        this.currentHamster = null;
    }
    
    hitHamster(holeIndex) {
        if (!this.isGameActive || this.isPaused || this.currentHamster !== holeIndex) {
            return;
        }
        
        const hamster = this.hamsters[holeIndex];
        const hamsterType = this.getHamsterType(hamster);
        const hamsterConfig = this.hamsterTypes[hamsterType];
        
        console.log(`Hit ${hamsterType} hamster! Points: ${hamsterConfig.points}`);
        
        this.sessionStats.totalHits++;
        if (hamsterType === 'golden') this.sessionStats.goldenHits++;
        if (hamsterType === 'bomb') this.sessionStats.bombHits++;
        if (hamsterType === 'speed') this.sessionStats.speedHits++;
        
        let points = hamsterConfig.points;
        
        if (this.powerups.doublePoints.active && points > 0) {
            points *= 2;
        }
        
        this.score += points;
        
        if (points > 0) {
            this.streak++;
            if (this.streak > this.maxStreak) {
                this.maxStreak = this.streak;
            }
        } else {
            this.streak = 0;
        }
        
        if (hamsterType === 'golden') {
            const powerupType = Math.random() < 0.5 ? 'slowTime' : 'doublePoints';
            this.powerups[powerupType].count++;
            console.log(`Gained ${powerupType} power-up!`);
        }
        
        this.showScorePopup(holeIndex, points, hamsterType);
        hamster.classList.add('hit');
        
        if (this.hamsterTimer) {
            clearTimeout(this.hamsterTimer);
            this.hamsterTimer = null;
        }
        
        this.currentHamster = null;
        
        setTimeout(() => {
            const hole = this.holes[holeIndex];
            hamster.classList.remove('hit', 'visible');
            hole.classList.remove('has-hamster');
            setTimeout(() => {
                hamster.textContent = '';
                hamster.className = 'hamster';
            }, 200);
        }, 400);
        
        this.updateUI();
        this.checkAchievements();
        
        setTimeout(() => this.scheduleNextHamster(), 200);
    }
    
    getHamsterType(hamster) {
        const classes = hamster.className.split(' ');
        for (const cls of classes) {
            if (this.hamsterTypes[cls]) {
                return cls;
            }
        }
        return 'normal';
    }
    
    showScorePopup(holeIndex, points, hamsterType) {
        const hole = this.holes[holeIndex];
        const popup = document.createElement('div');
        popup.className = `score-popup ${points < 0 ? 'negative' : ''} ${hamsterType === 'golden' ? 'golden' : ''}`;
        
        let text = points > 0 ? `+${points}` : `${points}`;
        if (hamsterType === 'golden') text += ' 💎';
        
        popup.textContent = text;
        
        const rect = hole.getBoundingClientRect();
        const boardRect = this.gameBoard.getBoundingClientRect();
        
        popup.style.position = 'absolute';
        popup.style.left = `${rect.left - boardRect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top - boardRect.top}px`;
        
        this.gameBoard.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1200);
    }
    
    usePowerup(type) {
        if (!this.isGameActive || this.powerups[type].count <= 0 || this.powerups[type].active) {
            return;
        }
        
        console.log(`Using ${type} power-up`);
        
        this.powerups[type].count--;
        this.powerups[type].active = true;
        
        if (type === 'slowTime') {
            clearInterval(this.gameTimer);
            this.startGameTimer();
        }
        
        setTimeout(() => {
            this.powerups[type].active = false;
            console.log(`${type} power-up expired`);
            
            if (type === 'slowTime') {
                clearInterval(this.gameTimer);
                this.startGameTimer();
            }
            
            this.updatePowerups();
        }, this.powerups[type].duration);
        
        this.updatePowerups();
    }
    
    checkAchievements() {
        const newAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (achievement.unlocked) return;
            
            let shouldUnlock = false;
            
            switch (achievement.id) {
                case 'first_hit':
                    shouldUnlock = this.sessionStats.totalHits >= 1;
                    break;
                case 'streak_5':
                    shouldUnlock = this.streak >= 5;
                    break;
                case 'streak_10':
                    shouldUnlock = this.streak >= 10;
                    break;
                case 'score_100':
                    shouldUnlock = this.score >= 100;
                    break;
                case 'score_200':
                    shouldUnlock = this.score >= 200;
                    break;
                case 'golden_hunter':
                    shouldUnlock = this.sessionStats.goldenHits >= 5;
                    break;
                case 'bomb_dodger':
                    shouldUnlock = !this.isGameActive && this.sessionStats.bombHits === 0 && this.sessionStats.totalHits > 0;
                    break;
                case 'speed_demon':
                    shouldUnlock = this.sessionStats.speedHits >= 10;
                    break;
            }
            
            if (shouldUnlock) {
                achievement.unlocked = true;
                newAchievements.push(achievement);
                console.log(`Achievement unlocked: ${achievement.name}`);
            }
        });
        
        newAchievements.forEach((achievement, index) => {
            setTimeout(() => this.showAchievement(achievement), index * 2000);
        });
    }
    
    showAchievement(achievement) {
        this.achievementTitleEl.textContent = achievement.name;
        this.achievementDescriptionEl.textContent = achievement.description;
        this.achievementNotification.style.display = 'block';
        
        setTimeout(() => this.hideAchievement(), 3000);
    }
    
    hideAchievement() {
        this.achievementNotification.style.display = 'none';
    }
    
    endGame() {
        console.log('Game ended!');
        
        this.isGameActive = false;
        this.isPaused = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        if (this.hamsterTimer) {
            clearTimeout(this.hamsterTimer);
            this.hamsterTimer = null;
        }
        
        this.hideCurrentHamster();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('hamsterGameHighScore', this.highScore.toString());
            console.log(`New high score: ${this.highScore}`);
        }
        
        this.checkAchievements();
        this.showGameOverModal();
        this.pauseBtn.style.display = 'none';
        this.streakContainer.style.display = 'none';
        this.powerupsContainer.style.display = 'none';
    }
    
    showGameOverModal() {
        this.finalScoreEl.textContent = this.score;
        
        let message;
        if (this.score >= 300) {
            message = 'LEGENDARY PERFORMANCE! You are the ultimate hamster slapper! 👑';
        } else if (this.score >= 200) {
            message = 'AMAZING! Incredible reflexes and skill! 🔥';
        } else if (this.score >= 150) {
            message = 'EXCELLENT! Great job hitting those hamsters! 🎯';
        } else if (this.score >= 100) {
            message = 'GOOD WORK! You\'re getting the hang of it! 👍';
        } else if (this.score >= 50) {
            message = 'NOT BAD! Keep practicing to improve! 💪';
        } else {
            message = 'KEEP TRYING! Those hamsters can be tricky! 🎯';
        }
        
        if (this.score === this.highScore && this.score > 0) {
            message += ' NEW HIGH SCORE!';
        }
        
        this.performanceMessageEl.textContent = message;
        
        const summary = [
            `Final Level: ${this.level}`,
            `Max Streak: ${this.maxStreak}`,
            `Total Hits: ${this.sessionStats.totalHits}`,
            `Golden Hits: ${this.sessionStats.goldenHits}`,
            `Speed Hits: ${this.sessionStats.speedHits}`,
            `Bombs Hit: ${this.sessionStats.bombHits}`
        ].join(' • ');
        
        this.gameSummaryEl.textContent = summary;
        
        this.gameOverModal.style.display = 'flex';
    }
    
    closeModal() {
        this.gameOverModal.style.display = 'none';
        this.startBtn.style.display = 'inline-block';
        this.restartBtn.style.display = 'none';
    }
    
    restartGame() {
        this.closeModal();
        this.startGame();
    }
    
    updateUI() {
        this.updateScore();
        this.updateTimer();
        this.updateLevel();
        this.updateHighScore();
        this.updateStreak();
        this.updatePowerups();
    }
    
    updateScore() {
        this.scoreEl.textContent = this.score;
    }
    
    updateTimer() {
        this.timerEl.textContent = this.timeLeft;
        
        if (this.timeLeft <= 5 && this.isGameActive) {
            this.timerEl.classList.add('timer-warning');
        } else {
            this.timerEl.classList.remove('timer-warning');
        }
    }
    
    updateLevel() {
        this.levelEl.textContent = this.level;
    }
    
    updateHighScore() {
        this.highScoreEl.textContent = this.highScore;
    }
    
    updateStreak() {
        this.streakTextEl.textContent = `Streak: ${this.streak}`;
        const streakPercent = Math.min(100, (this.streak / 15) * 100);
        this.streakFillEl.style.width = `${streakPercent}%`;
    }
    
    updatePowerups() {
        this.slowTimeCountEl.textContent = this.powerups.slowTime.count;
        this.doublePointsCountEl.textContent = this.powerups.doublePoints.count;
        this.updatePowerupState(this.slowTimePowerup, this.powerups.slowTime);
        this.updatePowerupState(this.doublePointsPowerup, this.powerups.doublePoints);
    }
    
    updatePowerupState(element, powerup) {
        element.classList.remove('disabled', 'active');
        
        if (powerup.active) {
            element.classList.add('active');
        } else if (powerup.count <= 0) {
            element.classList.add('disabled');
        }
    }
    
    showTestHamster() {
        const testHole = 4;
        const hamster = this.hamsters[testHole];
        const hole = this.holes[testHole];
        
        console.log('Showing test hamster at center hole');
        console.log('Hamster element:', hamster);
        console.log('Current hamster classes:', hamster.className);
        
        hamster.textContent = '🐹';
        hamster.className = 'hamster normal';
        hamster.style.opacity = '';
        hamster.style.visibility = '';
        hamster.classList.add('visible');
        hole.classList.add('has-hamster');
        
        console.log('After adding visible class:', hamster.className);
        console.log('Computed style:', window.getComputedStyle(hamster));
        
        setTimeout(() => {
            hamster.classList.remove('visible');
            hole.classList.remove('has-hamster');
            console.log('Test hamster hidden');
        }, 3000);
    }
    
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Perfect Hamster Game...');
    new PerfectHamsterGame();
});