/**
 * Storage Manager
 * Handles localStorage operations and data persistence
 */

class StorageManager {
    constructor() {
        this.prefix = 'cyberhack_';
        this.version = '1.0';
        this.isAvailable = this.checkLocalStorageAvailability();
        
        // Initialize storage with version check
        this.initializeStorage();
    }

    /**
     * Check if localStorage is available
     */
    checkLocalStorageAvailability() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('localStorage is not available:', error);
            return false;
        }
    }

    /**
     * Initialize storage with version management
     */
    initializeStorage() {
        if (!this.isAvailable) return;

        const storedVersion = localStorage.getItem(this.prefix + 'version');
        
        if (!storedVersion || storedVersion !== this.version) {
            // Clear old data if version mismatch
            this.clearAll();
            localStorage.setItem(this.prefix + 'version', this.version);
            console.log('Storage initialized with version:', this.version);
        }
    }

    /**
     * Save data to localStorage
     */
    save(key, data) {
        if (!this.isAvailable) {
            console.warn('Cannot save data: localStorage not available');
            return false;
        }

        try {
            const serializedData = JSON.stringify({
                data: data,
                timestamp: Date.now(),
                version: this.version
            });
            
            localStorage.setItem(this.prefix + key, serializedData);
            return true;
        } catch (error) {
            console.error('Failed to save data:', error);
            
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            
            return false;
        }
    }

    /**
     * Load data from localStorage
     */
    load(key) {
        if (!this.isAvailable) {
            console.warn('Cannot load data: localStorage not available');
            return null;
        }

        try {
            const item = localStorage.getItem(this.prefix + key);
            
            if (!item) {
                return null;
            }

            const parsed = JSON.parse(item);
            
            // Check if data format is valid
            if (!parsed || typeof parsed !== 'object' || !parsed.hasOwnProperty('data')) {
                console.warn(`Invalid data format for key: ${key}`);
                this.remove(key);
                return null;
            }

            // Check version compatibility
            if (parsed.version && parsed.version !== this.version) {
                console.warn(`Version mismatch for key ${key}: ${parsed.version} vs ${this.version}`);
                this.remove(key);
                return null;
            }

            return parsed.data;
        } catch (error) {
            console.error(`Failed to load data for key ${key}:`, error);
            this.remove(key); // Remove corrupted data
            return null;
        }
    }

    /**
     * Remove specific key from localStorage
     */
    remove(key) {
        if (!this.isAvailable) return false;

        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error(`Failed to remove key ${key}:`, error);
            return false;
        }
    }

    /**
     * Check if key exists in localStorage
     */
    exists(key) {
        if (!this.isAvailable) return false;

        return localStorage.getItem(this.prefix + key) !== null;
    }

    /**
     * Get all keys with the prefix
     */
    getAllKeys() {
        if (!this.isAvailable) return [];

        const keys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix) && key !== this.prefix + 'version') {
                keys.push(key.substring(this.prefix.length));
            }
        }
        
        return keys;
    }

    /**
     * Get all stored data
     */
    getAllData() {
        if (!this.isAvailable) return {};

        const data = {};
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            const value = this.load(key);
            if (value !== null) {
                data[key] = value;
            }
        });
        
        return data;
    }

    /**
     * Clear all data with prefix
     */
    clear() {
        if (!this.isAvailable) return false;

        try {
            const keys = this.getAllKeys();
            keys.forEach(key => {
                this.remove(key);
            });
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }

    /**
     * Clear all localStorage data (including other apps)
     */
    clearAll() {
        if (!this.isAvailable) return false;

        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Failed to clear all storage:', error);
            return false;
        }
    }

    /**
     * Get storage usage information
     */
    getStorageInfo() {
        if (!this.isAvailable) {
            return {
                available: false,
                used: 0,
                total: 0,
                keys: 0
            };
        }

        let totalSize = 0;
        let appSize = 0;
        const keys = this.getAllKeys();
        
        // Calculate approximate storage usage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const itemSize = (key + value).length * 2; // Rough estimate (UTF-16)
            
            totalSize += itemSize;
            
            if (key && key.startsWith(this.prefix)) {
                appSize += itemSize;
            }
        }

        return {
            available: true,
            used: totalSize,
            appUsed: appSize,
            total: this.getStorageQuota(),
            keys: keys.length,
            allKeys: localStorage.length
        };
    }

    /**
     * Get estimated storage quota
     */
    getStorageQuota() {
        // Most browsers have 5-10MB limit for localStorage
        // This is a rough estimate
        try {
            return 5 * 1024 * 1024; // 5MB in bytes
        } catch (error) {
            return 0;
        }
    }

    /**
     * Handle quota exceeded error
     */
    handleQuotaExceeded() {
        console.warn('localStorage quota exceeded, attempting cleanup...');
        
        // Get all app data with timestamps
        const keys = this.getAllKeys();
        const dataWithTimestamps = [];
        
        keys.forEach(key => {
            try {
                const item = localStorage.getItem(this.prefix + key);
                const parsed = JSON.parse(item);
                
                if (parsed && parsed.timestamp) {
                    dataWithTimestamps.push({
                        key: key,
                        timestamp: parsed.timestamp,
                        size: item.length
                    });
                }
            } catch (error) {
                // Invalid data, mark for removal
                dataWithTimestamps.push({
                    key: key,
                    timestamp: 0,
                    size: 0
                });
            }
        });
        
        // Sort by timestamp (oldest first)
        dataWithTimestamps.sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest 25% of data
        const removeCount = Math.ceil(dataWithTimestamps.length * 0.25);
        
        for (let i = 0; i < removeCount; i++) {
            this.remove(dataWithTimestamps[i].key);
            console.log(`Removed old data: ${dataWithTimestamps[i].key}`);
        }
    }

    /**
     * Save game state with automatic backup
     */
    saveGameState(gameState) {
        const success = this.save('gameState', gameState);
        
        if (success) {
            // Create backup
            this.save('gameState_backup', {
                ...gameState,
                backupTimestamp: Date.now()
            });
        }
        
        return success;
    }

    /**
     * Load game state with backup recovery
     */
    loadGameState() {
        let gameState = this.load('gameState');
        
        if (!gameState) {
            // Try to load from backup
            const backup = this.load('gameState_backup');
            if (backup) {
                console.log('Recovered game state from backup');
                gameState = backup;
                // Restore main save
                this.save('gameState', gameState);
            }
        }
        
        return gameState;
    }

    /**
     * Save user settings
     */
    saveSettings(settings) {
        return this.save('settings', {
            ...settings,
            lastUpdated: Date.now()
        });
    }

    /**
     * Load user settings
     */
    loadSettings() {
        return this.load('settings');
    }

    /**
     * Save command history
     */
    saveCommandHistory(history) {
        // Only keep last 100 commands to save space
        const limitedHistory = history.slice(-100);
        return this.save('commandHistory', limitedHistory);
    }

    /**
     * Load command history
     */
    loadCommandHistory() {
        return this.load('commandHistory') || [];
    }

    /**
     * Save achievement data
     */
    saveAchievements(achievements) {
        return this.save('achievements', achievements);
    }

    /**
     * Load achievement data
     */
    loadAchievements() {
        return this.load('achievements') || [];
    }

    /**
     * Save high scores
     */
    saveHighScore(score, challengeType) {
        const highScores = this.load('highScores') || {};
        
        if (!highScores[challengeType] || score > highScores[challengeType].score) {
            highScores[challengeType] = {
                score: score,
                timestamp: Date.now(),
                date: new Date().toISOString()
            };
            
            return this.save('highScores', highScores);
        }
        
        return true;
    }

    /**
     * Load high scores
     */
    loadHighScores() {
        return this.load('highScores') || {};
    }

    /**
     * Export all data for backup
     */
    exportData() {
        if (!this.isAvailable) return null;

        const exportData = {
            version: this.version,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            data: this.getAllData()
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import data from backup
     */
    importData(jsonData) {
        if (!this.isAvailable) return false;

        try {
            const importData = JSON.parse(jsonData);
            
            if (!importData.data || typeof importData.data !== 'object') {
                throw new Error('Invalid import data format');
            }

            // Validate version compatibility
            if (importData.version && importData.version !== this.version) {
                console.warn(`Import version mismatch: ${importData.version} vs ${this.version}`);
            }

            // Import each piece of data
            Object.entries(importData.data).forEach(([key, value]) => {
                this.save(key, value);
            });

            console.log('Data imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    /**
     * Clean up old or corrupted data
     */
    cleanup() {
        if (!this.isAvailable) return;

        const keys = this.getAllKeys();
        let cleanedCount = 0;
        
        keys.forEach(key => {
            const data = this.load(key);
            if (data === null) {
                // Data was corrupted and removed by load()
                cleanedCount++;
            }
        });

        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} corrupted entries`);
        }
    }

    /**
     * Get storage statistics
     */
    getStatistics() {
        const info = this.getStorageInfo();
        const keys = this.getAllKeys();
        
        const stats = {
            ...info,
            byType: {}
        };

        // Categorize data by type
        keys.forEach(key => {
            const category = key.split('_')[0] || 'other';
            if (!stats.byType[category]) {
                stats.byType[category] = 0;
            }
            stats.byType[category]++;
        });

        return stats;
    }
}
