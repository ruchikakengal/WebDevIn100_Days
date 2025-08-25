// Game Engine - Handles all game logic, state, and progression
class GameEngine {
    constructor() {
        this.reset();
    }

    reset() {
        this.lives = 3;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.completedCards = new Set();
        this.startTime = Date.now();
        
        // Difficulty settings
        this.difficulty = 'normal';
        this.difficultyMultiplier = 1;
    }

    // Card Management
    isCardUnlocked(suit, number) {
        // First card of each suit is always unlocked
        if (number === 1) return true;
        
        // Check if previous card is completed
        const prevCardId = `${suit}-${number - 1}`;
        return this.completedCards.has(prevCardId);
    }

    isCardCompleted(suit, number) {
        const cardId = `${suit}-${number}`;
        return this.completedCards.has(cardId);
    }

    completeCard(suit, number) {
        const cardId = `${suit}-${number}`;
        this.completedCards.add(cardId);
        this.streak++;
        this.maxStreak = Math.max(this.maxStreak, this.streak);
    }

    getCompletedCardsCount() {
        return this.completedCards.size;
    }

    // Scoring System
    getCardScore(suit) {
        const baseScores = {
            spades: 100,    // Hard challenges
            hearts: 75,     // Medium challenges  
            clubs: 50,      // Easy challenges
            diamonds: 125   // Bonus challenges
        };
        
        return Math.floor(baseScores[suit] * this.difficultyMultiplier);
    }

    getStreakBonus() {
        if (this.streak < 3) return 0;
        if (this.streak < 5) return 25;
        if (this.streak < 10) return 50;
        return 100;
    }

    addScore(points) {
        this.score += points;
    }

    resetStreak() {
        this.streak = 0;
    }

    // Lives System
    loseLife() {
        this.lives = Math.max(0, this.lives - 1);
        this.resetStreak();
    }

    isGameOver() {
        return this.lives <= 0;
    }

    isGameWon() {
        return this.completedCards.size >= 52;
    }

    // Challenge Difficulty Management
    getChallengeParams(suit, number) {
        const baseDifficulty = {
            spades: { timeLimit: 30, complexity: 0.8 },
            hearts: { timeLimit: 45, complexity: 0.6 },
            clubs: { timeLimit: 60, complexity: 0.4 },
            diamonds: { timeLimit: 40, complexity: 0.7 }
        };

        const params = baseDifficulty[suit];
        
        // Increase difficulty based on card number
        const progressMultiplier = 1 + (number - 1) * 0.1;
        
        return {
            timeLimit: Math.max(10, Math.floor(params.timeLimit / progressMultiplier)),
            complexity: Math.min(1, params.complexity * progressMultiplier),
            difficultyLevel: this.getDifficultyLevel(suit, number)
        };
    }

    getDifficultyLevel(suit, number) {
        if (suit === 'clubs') return 'easy';
        if (suit === 'hearts') return 'medium';
        if (suit === 'spades') return 'hard';
        return 'bonus'; // diamonds
    }

    // High Score System
    saveHighScore() {
        const highScores = this.getHighScores();
        const newScore = {
            score: this.score,
            cards: this.completedCards.size,
            streak: this.maxStreak,
            date: new Date().toISOString(),
            time: Date.now() - this.startTime
        };

        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 10 scores
        const topScores = highScores.slice(0, 10);
        localStorage.setItem('aliceHighScores', JSON.stringify(topScores));
        
        return topScores.indexOf(newScore) + 1; // Return rank
    }

    getHighScores() {
        const scores = localStorage.getItem('aliceHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    clearHighScores() {
        localStorage.removeItem('aliceHighScores');
    }

    // Game State Persistence
    getGameState() {
        return {
            lives: this.lives,
            score: this.score,
            streak: this.streak,
            maxStreak: this.maxStreak,
            completedCards: Array.from(this.completedCards),
            startTime: this.startTime,
            difficulty: this.difficulty,
            difficultyMultiplier: this.difficultyMultiplier
        };
    }

    loadGameState(state) {
        this.lives = state.lives || 3;
        this.score = state.score || 0;
        this.streak = state.streak || 0;
        this.maxStreak = state.maxStreak || 0;
        this.completedCards = new Set(state.completedCards || []);
        this.startTime = state.startTime || Date.now();
        this.difficulty = state.difficulty || 'normal';
        this.difficultyMultiplier = state.difficultyMultiplier || 1;
    }

    // Statistics
    getGameStats() {
        const playTime = Date.now() - this.startTime;
        const completionRate = (this.completedCards.size / 52) * 100;
        
        return {
            playTime: this.formatTime(playTime),
            completionRate: completionRate.toFixed(1),
            averageScore: this.completedCards.size > 0 ? Math.floor(this.score / this.completedCards.size) : 0,
            accuracy: this.calculateAccuracy(),
            survivalRate: (this.lives / 3) * 100
        };
    }

    calculateAccuracy() {
        // This would need to track attempts vs successes
        // For now, estimate based on remaining lives and completed cards
        const totalAttempts = this.completedCards.size + (3 - this.lives);
        return totalAttempts > 0 ? (this.completedCards.size / totalAttempts * 100).toFixed(1) : 100;
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Difficulty Scaling
    setDifficulty(level) {
        const multipliers = {
            easy: 0.7,
            normal: 1.0,
            hard: 1.3,
            extreme: 1.6
        };
        
        this.difficulty = level;
        this.difficultyMultiplier = multipliers[level] || 1.0;
    }

    // Progression System
    getNextUnlockedCard() {
        const suits = ['clubs', 'hearts', 'spades', 'diamonds'];
        
        for (const suit of suits) {
            for (let i = 1; i <= 13; i++) {
                if (this.isCardUnlocked(suit, i) && !this.isCardCompleted(suit, i)) {
                    return { suit, number: i };
                }
            }
        }
        
        return null; // All cards completed
    }

    getProgressBysuit() {
        const suits = ['spades', 'hearts', 'clubs', 'diamonds'];
        const progress = {};
        
        suits.forEach(suit => {
            const completed = Array.from(this.completedCards)
                .filter(cardId => cardId.startsWith(suit))
                .length;
            progress[suit] = {
                completed,
                total: 13,
                percentage: (completed / 13) * 100
            };
        });
        
        return progress;
    }

    // Challenge History
    addChallengeAttempt(suit, number, success, timeSpent, score) {
        const attempts = this.getChallengeAttempts();
        const cardId = `${suit}-${number}`;
        
        if (!attempts[cardId]) {
            attempts[cardId] = [];
        }
        
        attempts[cardId].push({
            success,
            timeSpent,
            score,
            timestamp: Date.now()
        });
        
        localStorage.setItem('aliceChallengeAttempts', JSON.stringify(attempts));
    }

    getChallengeAttempts() {
        const attempts = localStorage.getItem('aliceChallengeAttempts');
        return attempts ? JSON.parse(attempts) : {};
    }

    // Bonus Features
    hasEarnedBonus(type) {
        const bonuses = {
            speedster: this.maxStreak >= 5,
            survivor: this.lives === 3 && this.completedCards.size >= 10,
            perfectionist: this.completedCards.size >= 13, // One full suit
            challenger: this.completedCards.size >= 26, // Half the deck
            master: this.completedCards.size >= 52 // Full deck
        };
        
        return bonuses[type] || false;
    }

    getAvailableBonuses() {
        const bonuses = [
            { type: 'speedster', name: 'Speedster', description: 'Achieve a 5+ card streak', earned: this.hasEarnedBonus('speedster') },
            { type: 'survivor', name: 'Survivor', description: 'Complete 10 cards without losing a life', earned: this.hasEarnedBonus('survivor') },
            { type: 'perfectionist', name: 'Perfectionist', description: 'Complete a full suit (13 cards)', earned: this.hasEarnedBonus('perfectionist') },
            { type: 'challenger', name: 'Challenger', description: 'Complete half the deck (26 cards)', earned: this.hasEarnedBonus('challenger') },
            { type: 'master', name: 'Master', description: 'Complete all 52 cards', earned: this.hasEarnedBonus('master') }
        ];
        
        return bonuses;
    }
}
