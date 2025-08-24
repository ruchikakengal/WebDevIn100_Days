class LeaderboardController {
    constructor() {
        this.gameEngine = new GameEngine();
        this.particles = null;
        
        this.initializeLeaderboard();
        this.setupEventListeners();
        this.initializeParticles();
        this.loadCurrentGameStats();
        this.displayHighScores();
        this.displaySuitProgress();
        this.displayAchievements();
    }

    initializeLeaderboard() {
        // Load saved game state if available
        const saved = localStorage.getItem('aliceGame');
        if (saved) {
            this.gameEngine.loadGameState(JSON.parse(saved));
        }
    }

    loadCurrentGameStats() {
        // Update current game statistics
        const stats = this.gameEngine.getGameStats();
        
        document.getElementById('currentScore').textContent = this.gameEngine.score.toLocaleString();
        document.getElementById('currentCards').textContent = this.gameEngine.getCompletedCardsCount();
        document.getElementById('currentStreak').textContent = this.gameEngine.streak;
        document.getElementById('currentLives').textContent = this.gameEngine.lives;
        document.getElementById('playTime').textContent = stats.playTime;
        document.getElementById('accuracy').textContent = stats.accuracy + '%';

        // Apply styling based on performance
        this.applyStatsStyling();
    }

    applyStatsStyling() {
        const livesCard = document.getElementById('currentLives').parentElement;
        const accuracyCard = document.getElementById('accuracy').parentElement;
        const streakCard = document.getElementById('currentStreak').parentElement;

        // Lives styling
        if (this.gameEngine.lives <= 1) {
            livesCard.classList.add('stat-critical');
        } else if (this.gameEngine.lives === 2) {
            livesCard.classList.add('stat-warning');
        } else {
            livesCard.classList.add('stat-good');
        }

        // Accuracy styling
        const accuracy = parseFloat(document.getElementById('accuracy').textContent);
        if (accuracy >= 80) {
            accuracyCard.classList.add('stat-excellent');
        } else if (accuracy >= 60) {
            accuracyCard.classList.add('stat-good');
        } else {
            accuracyCard.classList.add('stat-warning');
        }

        // Streak styling
        if (this.gameEngine.streak >= 5) {
            streakCard.classList.add('stat-excellent');
        } else if (this.gameEngine.streak >= 3) {
            streakCard.classList.add('stat-good');
        }
    }

    displayHighScores() {
        const highScores = this.gameEngine.getHighScores();
        const scoresBody = document.getElementById('scoresBody');
        const noScores = document.getElementById('noScores');
        const scoresTable = document.getElementById('scoresTable');

        if (highScores.length === 0) {
            scoresTable.style.display = 'none';
            noScores.style.display = 'block';
            return;
        }

        scoresTable.style.display = 'block';
        noScores.style.display = 'none';
        scoresBody.innerHTML = '';

        highScores.forEach((score, index) => {
            const row = document.createElement('div');
            row.className = 'score-row';
            
            // Add special styling for top 3
            if (index === 0) row.classList.add('rank-1');
            else if (index === 1) row.classList.add('rank-2');
            else if (index === 2) row.classList.add('rank-3');

            const date = new Date(score.date);
            const formattedDate = date.toLocaleDateString();
            const playTime = this.formatTime(score.time || 0);

            row.innerHTML = `
                <div class="rank-cell">
                    ${this.getRankIcon(index + 1)}
                    <span>${index + 1}</span>
                </div>
                <div class="score-cell">${score.score.toLocaleString()}</div>
                <div class="cards-cell">${score.cards}/52</div>
                <div class="streak-cell">${score.streak}</div>
                <div class="date-cell">${formattedDate}</div>
                <div class="time-cell">${playTime}</div>
            `;

            scoresBody.appendChild(row);
        });
    }

    getRankIcon(rank) {
        const icons = {
            1: '<i class="fas fa-crown" style="color: #ffd700;"></i>',
            2: '<i class="fas fa-medal" style="color: #c0c0c0;"></i>',
            3: '<i class="fas fa-award" style="color: #cd7f32;"></i>'
        };
        return icons[rank] || '<i class="fas fa-user"></i>';
    }

    displaySuitProgress() {
        const progress = this.gameEngine.getProgressBysuit();
        const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

        suits.forEach(suit => {
            const suitProgress = progress[suit];
            const progressBar = document.getElementById(`${suit}Progress`);
            const progressText = document.getElementById(`${suit}Text`);

            const percentage = suitProgress.percentage;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${suitProgress.completed}/13`;

            // Add completion styling
            const card = progressBar.closest('.suit-progress-card');
            if (suitProgress.completed === 13) {
                card.classList.add('suit-completed');
            } else if (suitProgress.completed > 0) {
                card.classList.add('suit-in-progress');
            }
        });
    }

    displayAchievements() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        const bonuses = this.gameEngine.getAvailableBonuses();

        achievementsGrid.innerHTML = '';

        bonuses.forEach(bonus => {
            const achievementCard = document.createElement('div');
            achievementCard.className = `achievement-card ${bonus.earned ? 'earned' : 'locked'}`;

            achievementCard.innerHTML = `
                <div class="achievement-icon">
                    ${this.getAchievementIcon(bonus.type)}
                </div>
                <div class="achievement-info">
                    <div class="achievement-name">${bonus.name}</div>
                    <div class="achievement-description">${bonus.description}</div>
                </div>
                <div class="achievement-status">
                    ${bonus.earned ? 
                        '<i class="fas fa-check-circle"></i>' : 
                        '<i class="fas fa-lock"></i>'
                    }
                </div>
            `;

            achievementsGrid.appendChild(achievementCard);
        });
    }

    getAchievementIcon(type) {
        const icons = {
            speedster: '<i class="fas fa-bolt"></i>',
            survivor: '<i class="fas fa-shield-alt"></i>',
            perfectionist: '<i class="fas fa-star"></i>',
            challenger: '<i class="fas fa-sword"></i>',
            master: '<i class="fas fa-crown"></i>'
        };
        return icons[type] || '<i class="fas fa-trophy"></i>';
    }

    clearHighScores() {
        this.showConfirmation(
            "Are you sure you want to clear all high scores? This action cannot be undone.",
            () => {
                this.gameEngine.clearHighScores();
                this.displayHighScores();
                this.showNotification("High scores cleared successfully!", "success");
                this.createParticleEffect('clear');
            }
        );
    }

    showConfirmation(message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const messageEl = document.getElementById('confirmMessage');
        const yesBtn = document.getElementById('confirmYes');
        const noBtn = document.getElementById('confirmNo');

        messageEl.textContent = message;
        modal.classList.add('show');

        // Remove previous event listeners
        const newYesBtn = yesBtn.cloneNode(true);
        const newNoBtn = noBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
        noBtn.parentNode.replaceChild(newNoBtn, noBtn);

        // Add new event listeners
        newYesBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            onConfirm();
        });

        newNoBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${this.getNotificationColor(type)};
            color: white;
            border-radius: 10px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#00ff66',
            warning: '#ff6600',
            error: '#ff0000',
            info: '#0066ff'
        };
        return colors[type] || '#0066ff';
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    refreshStats() {
        this.loadCurrentGameStats();
        this.displayHighScores();
        this.displaySuitProgress();
        this.displayAchievements();
    }

    goBackToGame() {
        window.location.href = 'index.html';
    }

    initializeParticles() {
        const canvas = document.getElementById('particlesCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.particles = {
            particles: [],
            
            createParticle(x, y, color, type = 'default') {
                const configs = {
                    default: { count: 10, speed: 5, size: 3 },
                    clear: { count: 20, speed: 8, size: 4 },
                    trophy: { count: 30, speed: 6, size: 5 }
                };
                
                const config = configs[type] || configs.default;
                
                for (let i = 0; i < config.count; i++) {
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * config.speed,
                        vy: (Math.random() - 0.5) * config.speed,
                        life: 1,
                        decay: Math.random() * 0.02 + 0.01,
                        color: color,
                        size: Math.random() * config.size + 2
                    });
                }
            },

            update() {
                this.particles = this.particles.filter(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life -= particle.decay;
                    particle.vy += 0.1; // gravity
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

    createParticleEffect(type, x = window.innerWidth / 2, y = window.innerHeight / 2) {
        if (!this.particles) return;

        const colors = {
            clear: ['#ff0000', '#ff6666'],
            trophy: ['#ffd700', '#ffdd00'],
            success: ['#00ff66', '#66ff99']
        };

        const effectColors = colors[type] || colors.success;
        
        effectColors.forEach(color => {
            this.particles.createParticle(x, y, color, type);
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('backToGameBtn').addEventListener('click', () => {
            this.goBackToGame();
        });

        document.getElementById('clearScoresBtn').addEventListener('click', () => {
            this.clearHighScores();
        });

        // Modal close on background click
        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') {
                e.target.classList.remove('show');
            }
        });

        // Auto-refresh stats every 5 seconds
        setInterval(() => {
            this.refreshStats();
        }, 5000);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    document.querySelectorAll('.modal.show').forEach(modal => {
                        modal.classList.remove('show');
                    });
                    break;
                case 'r':
                case 'R':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.refreshStats();
                        this.showNotification("Stats refreshed!", "info");
                    }
                    break;
                case 'b':
                case 'B':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.goBackToGame();
                    }
                    break;
            }
        });

        // Achievement card click effects
        document.addEventListener('click', (e) => {
            if (e.target.closest('.achievement-card.earned')) {
                const card = e.target.closest('.achievement-card');
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                this.createParticleEffect('trophy', centerX, centerY);
            }
        });

        // Suit progress card hover effects
        document.querySelectorAll('.suit-progress-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (card.classList.contains('suit-completed')) {
                    card.style.transform = 'scale(1.02)';
                    card.style.boxShadow = '0 0 30px rgba(0, 255, 102, 0.4)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }
}

// Initialize leaderboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.leaderboard = new LeaderboardController();
});

// Add additional CSS for leaderboard-specific styling
const leaderboardStyles = document.createElement('style');
leaderboardStyles.textContent = `
    .leaderboard-container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        gap: 30px;
    }

    .current-stats, .high-scores, .suit-progress, .achievements {
        background: rgba(0, 0, 0, 0.7);
        border-radius: 20px;
        padding: 25px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    }

    .current-stats h2, .high-scores h2, .suit-progress h2, .achievements h2 {
        margin-bottom: 20px;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 1.8rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
    }

    .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 5px;
    }

    .stat-label {
        color: #cccccc;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .stat-critical { border-color: #ff0000; }
    .stat-warning { border-color: #ff6600; }
    .stat-good { border-color: #00ff66; }
    .stat-excellent { border-color: #ffd700; }

    .scores-table {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .table-header {
        display: grid;
        grid-template-columns: 80px 1fr 80px 80px 120px 100px;
        gap: 15px;
        padding: 15px 20px;
        background: rgba(255, 0, 0, 0.2);
        color: #ffffff;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 1px;
    }

    .score-row {
        display: grid;
        grid-template-columns: 80px 1fr 80px 80px 120px 100px;
        gap: 15px;
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        color: #ffffff;
    }

    .score-row:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .score-row:last-child {
        border-bottom: none;
    }

    .rank-1 { background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent); }
    .rank-2 { background: linear-gradient(90deg, rgba(192, 192, 192, 0.1), transparent); }
    .rank-3 { background: linear-gradient(90deg, rgba(205, 127, 50, 0.1), transparent); }

    .rank-cell {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
    }

    .score-cell {
        font-weight: bold;
        color: #ffdd00;
    }

    .no-scores {
        text-align: center;
        padding: 40px;
        color: #cccccc;
    }

    .no-scores i {
        font-size: 3rem;
        margin-bottom: 20px;
        color: #666666;
    }

    .progress-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }

    .suit-progress-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .suit-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        min-width: 60px;
    }

    .suit-icon i {
        font-size: 2rem;
        color: #ffffff;
    }

    .suit-icon span {
        font-size: 0.9rem;
        color: #cccccc;
        text-transform: uppercase;
    }

    .progress-info {
        flex: 1;
    }

    .progress-bar-small {
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
    }

    .progress-fill-small {
        height: 100%;
        background: linear-gradient(90deg, #ff0000, #ff6600);
        width: 0%;
        transition: width 0.5s ease;
        border-radius: 4px;
    }

    .progress-text-small {
        font-size: 0.9rem;
        color: #cccccc;
    }

    .difficulty-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .suit-completed {
        border-color: #00ff66 !important;
        background: rgba(0, 255, 102, 0.1) !important;
    }

    .suit-in-progress {
        border-color: #ff6600 !important;
    }

    .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .achievement-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .achievement-card.earned {
        border-color: #ffd700;
        background: rgba(255, 215, 0, 0.1);
    }

    .achievement-card.earned:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3);
    }

    .achievement-card.locked {
        opacity: 0.6;
        filter: grayscale(100%);
    }

    .achievement-icon {
        font-size: 2.5rem;
        color: #ffd700;
        min-width: 50px;
        text-align: center;
    }

    .achievement-info {
        flex: 1;
    }

    .achievement-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 5px;
    }

    .achievement-description {
        font-size: 0.9rem;
        color: #cccccc;
        line-height: 1.4;
    }

    .achievement-status {
        font-size: 1.5rem;
    }

    .achievement-status .fa-check-circle {
        color: #00ff66;
    }

    .achievement-status .fa-lock {
        color: #666666;
    }

    @media (max-width: 768px) {
        .table-header, .score-row {
            grid-template-columns: 60px 1fr 60px 60px 100px 80px;
            gap: 10px;
            padding: 10px 15px;
            font-size: 0.8rem;
        }

        .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
        }

        .stat-value {
            font-size: 1.5rem;
        }

        .progress-grid {
            grid-template-columns: 1fr;
        }

        .achievements-grid {
            grid-template-columns: 1fr;
        }

        .achievement-card {
            padding: 15px;
        }

        .achievement-icon {
            font-size: 2rem;
        }
    }
`;

document.head.appendChild(leaderboardStyles);
