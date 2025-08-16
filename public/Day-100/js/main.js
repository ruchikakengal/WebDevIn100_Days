// Main application controller
class EduPlayApp {
    constructor() {
        this.currentGrade = '';
        this.currentGame = null;
        this.gameTimer = null;
        this.gameStartTime = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProgress();
        this.populateGames();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Grade selector
        document.getElementById('gradeSelect').addEventListener('change', (e) => {
            this.currentGrade = e.target.value;
            this.filterGamesByGrade();
            storage.save('selectedGrade', this.currentGrade);
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const subject = e.currentTarget.dataset.subject;
                this.switchSection('games');
                this.filterGames(subject);
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterGames(e.target.dataset.filter);
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Modal controls
        document.getElementById('closeGame').addEventListener('click', () => {
            this.closeGame();
        });

        document.getElementById('playAgain').addEventListener('click', () => {
            this.playAgain();
        });

        document.getElementById('backToGames').addEventListener('click', () => {
            this.closeSuccessModal();
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // Load saved grade
        const savedGrade = storage.get('selectedGrade');
        if (savedGrade) {
            document.getElementById('gradeSelect').value = savedGrade;
            this.currentGrade = savedGrade;
        }
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        if (sectionName === 'progress') {
            this.updateProgressDisplay();
        }
    }

    populateGames() {
        const gamesGrid = document.getElementById('gamesGrid');
        const allGames = [...mathGames.games, ...englishGames.games, ...scienceGames.games];
        
        gamesGrid.innerHTML = '';
        
        allGames.forEach(game => {
            const gameCard = this.createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });
    }

    createGameCard(game) {
        const card = document.createElement('div');
        card.className = `game-card ${game.subject}`;
        card.dataset.subject = game.subject;
        card.dataset.grade = game.grades.join(',');
        card.dataset.gameId = game.id;

        const difficultyClass = game.difficulty.toLowerCase();
        const subjectIcons = {
            math: 'fa-calculator',
            english: 'fa-book',
            science: 'fa-flask'
        };

        card.innerHTML = `
            <div class="game-icon">
                <i class="fas ${subjectIcons[game.subject]}"></i>
            </div>
            <h4>${game.title}</h4>
            <p>${game.description}</p>
            <div class="difficulty ${difficultyClass}">${game.difficulty}</div>
            <div class="game-grades">Grades: ${game.grades.join(', ')}</div>
        `;

        card.addEventListener('click', () => {
            this.startGame(game);
        });

        return card;
    }

    filterGames(filter) {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            const subject = card.dataset.subject;
            const shouldShow = filter === 'all' || subject === filter;
            card.style.display = shouldShow ? 'block' : 'none';
        });

        this.filterGamesByGrade();
    }

    filterGamesByGrade() {
        if (!this.currentGrade) return;

        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const gameGrades = card.dataset.grade.split(',');
            const shouldShow = gameGrades.includes(this.currentGrade);
            if (card.style.display !== 'none') {
                card.style.display = shouldShow ? 'block' : 'none';
            }
        });
    }

    startGame(game) {
        if (!this.currentGrade) {
            this.showMessage('Please select your grade first!', 'warning');
            return;
        }

        if (!game.grades.includes(parseInt(this.currentGrade))) {
            this.showMessage('This game is not suitable for your grade level.', 'warning');
            return;
        }

        this.currentGame = game;
        this.gameStartTime = Date.now();
        
        // Setup modal
        document.getElementById('gameTitle').textContent = game.title;
        document.getElementById('gameInstructions').innerHTML = this.createInstructions(game);
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('gameTimer').textContent = '0';
        
        // Clear game area
        const gameArea = document.getElementById('gameArea');
        gameArea.innerHTML = '';
        
        // Start the specific game
        this.initializeGame(game);
        
        // Show modal
        document.getElementById('gameModal').classList.add('active');
        
        // Start timer
        this.startTimer();
        
        // Play start sound
        audioManager.playSound('gameStart');
    }

    createInstructions(game) {
        const instructions = {
            math: `
                <h4>How to Play:</h4>
                <ul>
                    <li>Solve the math problems by clicking the correct answer</li>
                    <li>You get points for each correct answer</li>
                    <li>Try to answer as quickly as possible for bonus points</li>
                    <li>Complete 10 problems to finish the game</li>
                </ul>
            `,
            english: `
                <h4>How to Play:</h4>
                <ul>
                    <li>Unscramble the letters to form the correct word</li>
                    <li>Drag and drop letters to the correct positions</li>
                    <li>Use the hint button if you get stuck</li>
                    <li>Complete 10 words to finish the game</li>
                </ul>
            `,
            science: `
                <h4>How to Play:</h4>
                <ul>
                    <li>Read each question carefully</li>
                    <li>Click on the correct answer</li>
                    <li>Learn from the explanations provided</li>
                    <li>Answer 10 questions to complete the quiz</li>
                </ul>
            `
        };
        
        return instructions[game.subject] || instructions.math;
    }

    initializeGame(game) {
        switch(game.subject) {
            case 'math':
                mathGames.initGame(game, this);
                break;
            case 'english':
                englishGames.initGame(game, this);
                break;
            case 'science':
                scienceGames.initGame(game, this);
                break;
        }
    }

    startTimer() {
        let seconds = 0;
        this.gameTimer = setInterval(() => {
            seconds++;
            document.getElementById('gameTimer').textContent = seconds;
        }, 1000);
    }

    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    updateScore(points) {
        const currentScore = parseInt(document.getElementById('currentScore').textContent);
        const newScore = currentScore + points;
        document.getElementById('currentScore').textContent = newScore;
        
        // Animate score update
        const scoreElement = document.getElementById('currentScore');
        scoreElement.style.transform = 'scale(1.2)';
        scoreElement.style.color = '#28a745';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
            scoreElement.style.color = 'inherit';
        }, 300);
    }

    gameCompleted(stats) {
        this.stopTimer();
        
        // Save progress
        this.saveGameProgress(stats);
        
        // Show success modal
        this.showSuccessModal(stats);
        
        // Play completion sound
        audioManager.playSound('gameComplete');
    }

    saveGameProgress(stats) {
        const progress = storage.get('gameProgress') || {};
        const gameKey = `${this.currentGame.subject}_${this.currentGame.id}`;
        
        if (!progress[gameKey]) {
            progress[gameKey] = {
                timesPlayed: 0,
                bestScore: 0,
                bestTime: Infinity,
                totalScore: 0
            };
        }
        
        progress[gameKey].timesPlayed++;
        progress[gameKey].totalScore += stats.score;
        progress[gameKey].bestScore = Math.max(progress[gameKey].bestScore, stats.score);
        progress[gameKey].bestTime = Math.min(progress[gameKey].bestTime, stats.time);
        
        storage.save('gameProgress', progress);
        
        // Check for achievements
        this.checkAchievements(stats);
    }

    checkAchievements(stats) {
        const achievements = storage.get('achievements') || [];
        const newAchievements = [];
        
        // Score-based achievements
        if (stats.score >= 100 && !achievements.includes('century')) {
            achievements.push('century');
            newAchievements.push('Century Club - Scored 100 points!');
        }
        
        if (stats.accuracy >= 90 && !achievements.includes('perfectionist')) {
            achievements.push('perfectionist');
            newAchievements.push('Perfectionist - 90%+ accuracy!');
        }
        
        // Time-based achievements
        if (stats.time <= 60 && !achievements.includes('speedster')) {
            achievements.push('speedster');
            newAchievements.push('Speed Demon - Completed in under 60 seconds!');
        }
        
        // Subject-specific achievements
        const progress = storage.get('gameProgress') || {};
        const mathGamesPlayed = Object.keys(progress).filter(key => key.startsWith('math_')).length;
        const englishGamesPlayed = Object.keys(progress).filter(key => key.startsWith('english_')).length;
        const scienceGamesPlayed = Object.keys(progress).filter(key => key.startsWith('science_')).length;
        
        if (mathGamesPlayed >= 3 && !achievements.includes('mathWiz')) {
            achievements.push('mathWiz');
            newAchievements.push('Math Wizard - Played 3 math games!');
        }
        
        if (englishGamesPlayed >= 3 && !achievements.includes('wordMaster')) {
            achievements.push('wordMaster');
            newAchievements.push('Word Master - Played 3 English games!');
        }
        
        if (scienceGamesPlayed >= 3 && !achievements.includes('scientist')) {
            achievements.push('scientist');
            newAchievements.push('Young Scientist - Played 3 science games!');
        }
        
        storage.save('achievements', achievements);
        
        // Show new achievements
        if (newAchievements.length > 0) {
            setTimeout(() => {
                newAchievements.forEach(achievement => {
                    this.showMessage(achievement, 'achievement');
                });
            }, 2000);
        }
    }

    showSuccessModal(stats) {
        const modal = document.getElementById('successModal');
        const message = document.getElementById('successMessage');
        const statsContainer = document.getElementById('successStats');
        
        message.textContent = this.getSuccessMessage(stats);
        
        statsContainer.innerHTML = `
            <div class="success-stat">
                <div class="value">${stats.score}</div>
                <div class="label">Score</div>
            </div>
            <div class="success-stat">
                <div class="value">${stats.correct}</div>
                <div class="label">Correct</div>
            </div>
            <div class="success-stat">
                <div class="value">${stats.accuracy}%</div>
                <div class="label">Accuracy</div>
            </div>
            <div class="success-stat">
                <div class="value">${stats.time}s</div>
                <div class="label">Time</div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    getSuccessMessage(stats) {
        if (stats.accuracy === 100) {
            return "Perfect! You got all answers correct! 🌟";
        } else if (stats.accuracy >= 80) {
            return "Excellent work! You're doing great! 🎉";
        } else if (stats.accuracy >= 60) {
            return "Good job! Keep practicing to improve! 👍";
        } else {
            return "Nice try! Practice makes perfect! 💪";
        }
    }

    playAgain() {
        this.closeSuccessModal();
        this.initializeGame(this.currentGame);
        this.gameStartTime = Date.now();
        document.getElementById('currentScore').textContent = '0';
        document.getElementById('gameTimer').textContent = '0';
        this.startTimer();
    }

    closeGame() {
        this.stopTimer();
        document.getElementById('gameModal').classList.remove('active');
        this.currentGame = null;
    }

    closeSuccessModal() {
        document.getElementById('successModal').classList.remove('active');
        this.closeGame();
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.stopTimer();
        this.currentGame = null;
    }

    updateProgressDisplay() {
        const progress = storage.get('gameProgress') || {};
        const achievements = storage.get('achievements') || [];
        
        // Calculate stats
        let totalGames = 0;
        let totalScore = 0;
        let totalTime = 0;
        
        Object.values(progress).forEach(gameData => {
            totalGames += gameData.timesPlayed;
            totalScore += gameData.totalScore;
            totalTime += gameData.bestTime === Infinity ? 0 : gameData.bestTime;
        });
        
        const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
        
        // Update stats display
        const statsContainer = document.getElementById('progressStats');
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">🎮</div>
                <div class="stat-value">${totalGames}</div>
                <div class="stat-label">Games Played</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🏆</div>
                <div class="stat-value">${totalScore}</div>
                <div class="stat-label">Total Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">${avgScore}</div>
                <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-value">${achievements.length}</div>
                <div class="stat-label">Achievements</div>
            </div>
        `;
        
        // Update achievements display
        this.updateAchievementsDisplay(achievements);
    }

    updateAchievementsDisplay(userAchievements) {
        const achievementsContainer = document.getElementById('achievements');
        const allAchievements = [
            { id: 'century', name: 'Century Club', description: 'Score 100 points in a game', icon: '💯' },
            { id: 'perfectionist', name: 'Perfectionist', description: 'Get 90%+ accuracy', icon: '🎯' },
            { id: 'speedster', name: 'Speed Demon', description: 'Complete a game in under 60 seconds', icon: '⚡' },
            { id: 'mathWiz', name: 'Math Wizard', description: 'Play 3 different math games', icon: '🧮' },
            { id: 'wordMaster', name: 'Word Master', description: 'Play 3 different English games', icon: '📚' },
            { id: 'scientist', name: 'Young Scientist', description: 'Play 3 different science games', icon: '🔬' }
        ];
        
        achievementsContainer.innerHTML = `
            <h3>Achievements</h3>
            <div class="achievement-grid">
                ${allAchievements.map(achievement => `
                    <div class="achievement-badge ${userAchievements.includes(achievement.id) ? 'earned' : ''}">
                        <i>${achievement.icon}</i>
                        <div>
                            <strong>${achievement.name}</strong>
                            <br>
                            <small>${achievement.description}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    loadProgress() {
        // Load any saved progress or settings
        const savedGrade = storage.get('selectedGrade');
        if (savedGrade) {
            document.getElementById('gradeSelect').value = savedGrade;
            this.currentGrade = savedGrade;
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `feedback-message ${type}`;
        
        const icons = {
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle',
            achievement: 'fa-trophy',
            success: 'fa-check-circle'
        };
        
        messageDiv.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <p>${message}</p>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.eduPlayApp = new EduPlayApp();
});
