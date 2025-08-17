
class GameStorage {
    constructor() {
        this.storagePrefix = 'advancedPong_';
        this.settings = this.loadSettings();
        this.scores = this.loadScores();
        this.leaderboard = this.loadLeaderboard();
    }

    // Settings management
    saveSettings(settings) {
        const defaultSettings = this.getDefaultSettings();
        const mergedSettings = { ...defaultSettings, ...settings };
        
        localStorage.setItem(
            this.storagePrefix + 'settings',
            JSON.stringify(mergedSettings)
        );
        
        this.settings = mergedSettings;
        console.log('Settings saved:', mergedSettings);
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.storagePrefix + 'settings');
            if (saved) {
                const settings = JSON.parse(saved);
                return { ...this.getDefaultSettings(), ...settings };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
        
        return this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            theme: 'retro',
            ballSpeed: 3,
            paddleSize: 2,
            winningScore: 10,
            soundEnabled: true,
            musicEnabled: true,
            powerupsEnabled: true
        };
    }

    // Score management
    saveScore(gameData) {
        const scores = this.loadScores();
        
        const scoreEntry = {
            id: Date.now(),
            gameMode: gameData.gameMode,
            difficulty: gameData.difficulty,
            player1Score: gameData.player1Score,
            player2Score: gameData.player2Score,
            winner: gameData.winner,
            gameDuration: gameData.gameDuration,
            totalHits: gameData.totalHits,
            maxBallSpeed: gameData.maxBallSpeed,
            ballDistance: gameData.ballDistance,
            wallBounces: gameData.wallBounces,
            paddleHits: gameData.paddleHits,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        };
        
        scores.push(scoreEntry);
        
        // Keep only the last 50 scores
        if (scores.length > 50) {
            scores.splice(0, scores.length - 50);
        }
        
        localStorage.setItem(
            this.storagePrefix + 'scores',
            JSON.stringify(scores)
        );
        
        this.scores = scores;
        console.log('Score saved:', scoreEntry);
    }

    loadScores() {
        try {
            const saved = localStorage.getItem(this.storagePrefix + 'scores');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load scores:', error);
        }
        
        return [];
    }

    clearScores() {
        localStorage.removeItem(this.storagePrefix + 'scores');
        localStorage.removeItem(this.storagePrefix + 'leaderboard');
        this.scores = [];
        this.leaderboard = [];
        console.log('All scores cleared');
    }

    // Leaderboard management
    updateLeaderboard(gameData) {
        const leaderboard = this.loadLeaderboard();
        
        const entry = {
            id: Date.now(),
            gameMode: gameData.gameMode,
            difficulty: gameData.difficulty,
            score: `${gameData.player1Score}-${gameData.player2Score}`,
            winner: gameData.winner,
            gameDuration: gameData.gameDuration,
            totalHits: gameData.totalHits,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        };
        
        leaderboard.push(entry);
        
        // Sort by total hits (higher is better)
        leaderboard.sort((a, b) => b.totalHits - a.totalHits);
        
        // Keep only top 20 entries
        if (leaderboard.length > 20) {
            leaderboard.splice(20);
        }
        
        localStorage.setItem(
            this.storagePrefix + 'leaderboard',
            JSON.stringify(leaderboard)
        );
        
        this.leaderboard = leaderboard;
    }

    loadLeaderboard() {
        try {
            const saved = localStorage.getItem(this.storagePrefix + 'leaderboard');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load leaderboard:', error);
        }
        
        return [];
    }

    getFormattedLeaderboard() {
        return this.leaderboard.map((entry, index) => ({
            rank: index + 1,
            gameMode: entry.gameMode.charAt(0).toUpperCase() + entry.gameMode.slice(1).replace('-', ' '),
            difficulty: entry.difficulty ? entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1) : '',
            score: entry.score,
            winner: entry.winner,
            duration: this.formatDuration(entry.gameDuration),
            hits: entry.totalHits,
            date: entry.date
        }));
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

    // Statistics
    getPlayerStats() {
        const scores = this.loadScores();
        
        if (scores.length === 0) {
            return {
                gamesPlayed: 0,
                totalWins: 0,
                totalHits: 0,
                averageGameDuration: 0,
                bestScore: 0
            };
        }
        
        const stats = {
            gamesPlayed: scores.length,
            totalWins: scores.filter(s => s.winner === 'Player 1').length,
            totalHits: scores.reduce((sum, s) => sum + s.totalHits, 0),
            averageGameDuration: scores.reduce((sum, s) => sum + s.gameDuration, 0) / scores.length,
            bestScore: Math.max(...scores.map(s => s.player1Score))
        };
        
        return stats;
    }

    // Data export/import
    exportData() {
        return {
            settings: this.settings,
            scores: this.scores,
            leaderboard: this.leaderboard,
            exportDate: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            
            if (data.scores) {
                localStorage.setItem(
                    this.storagePrefix + 'scores',
                    JSON.stringify(data.scores)
                );
                this.scores = data.scores;
            }
            
            if (data.leaderboard) {
                localStorage.setItem(
                    this.storagePrefix + 'leaderboard',
                    JSON.stringify(data.leaderboard)
                );
                this.leaderboard = data.leaderboard;
            }
            
            console.log('Data imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}

// GameStorage class will be instantiated in the main initialization script
