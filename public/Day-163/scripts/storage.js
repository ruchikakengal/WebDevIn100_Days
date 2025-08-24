// Storage Manager - Handles localStorage operations and data persistence
class StorageManager {
    constructor() {
        this.storageKeys = {
            stories: 'story_generator_stories',
            settings: 'story_generator_settings',
            completedStories: 'story_generator_completed',
            userContributions: 'story_generator_contributions',
            analytics: 'story_generator_analytics'
        };
        
        this.defaultSettings = {
            voice: null,
            speechRate: 1.0,
            autoNarrate: false,
            textSize: 18,
            animationsEnabled: true,
            theme: 'auto'
        };
        
        this.init();
    }

    init() {
        // Initialize settings if they don't exist
        if (!this.getSettings()) {
            this.saveSettings(this.defaultSettings);
        }
        
        // Clean up old data periodically
        this.cleanupOldData();
    }

    // Settings Management
    getSettings() {
        try {
            const settings = localStorage.getItem(this.storageKeys.settings);
            if (!settings) return this.defaultSettings;
            
            return { ...this.defaultSettings, ...JSON.parse(settings) };
        } catch (error) {
            console.warn('Error loading settings:', error);
            return this.defaultSettings;
        }
    }

    saveSettings(settings) {
        try {
            const mergedSettings = { ...this.getSettings(), ...settings };
            localStorage.setItem(this.storageKeys.settings, JSON.stringify(mergedSettings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            this.handleStorageError(error);
            return false;
        }
    }

    // Story Management
    saveStory(story) {
        try {
            const savedStories = this.getSavedStories();
            
            // Add or update story
            const existingIndex = savedStories.findIndex(s => s.id === story.id);
            const storyToSave = {
                ...story,
                savedAt: Date.now(),
                version: '1.0'
            };
            
            if (existingIndex >= 0) {
                savedStories[existingIndex] = storyToSave;
            } else {
                savedStories.push(storyToSave);
            }
            
            // Limit number of saved stories
            const maxStories = 20;
            if (savedStories.length > maxStories) {
                savedStories.sort((a, b) => b.savedAt - a.savedAt);
                savedStories.splice(maxStories);
            }
            
            localStorage.setItem(this.storageKeys.stories, JSON.stringify(savedStories));
            return storyToSave.id;
        } catch (error) {
            console.error('Error saving story:', error);
            this.handleStorageError(error);
            return null;
        }
    }

    getSavedStories() {
        try {
            const stories = localStorage.getItem(this.storageKeys.stories);
            if (!stories) return [];
            
            const parsedStories = JSON.parse(stories);
            
            // Migrate old story format if needed
            return parsedStories.map(story => this.migrateStoryFormat(story));
        } catch (error) {
            console.warn('Error loading saved stories:', error);
            return [];
        }
    }

    loadStory(storyId) {
        try {
            const savedStories = this.getSavedStories();
            const story = savedStories.find(s => s.id === storyId);
            
            if (!story) {
                throw new Error(`Story with ID ${storyId} not found`);
            }
            
            // Deserialize Maps and other complex objects
            return this.deserializeStory(story);
        } catch (error) {
            console.error('Error loading story:', error);
            return null;
        }
    }

    deleteStory(storyId) {
        try {
            const savedStories = this.getSavedStories();
            const filteredStories = savedStories.filter(s => s.id !== storyId);
            
            localStorage.setItem(this.storageKeys.stories, JSON.stringify(filteredStories));
            return true;
        } catch (error) {
            console.error('Error deleting story:', error);
            return false;
        }
    }

    // Completed Stories Management
    saveCompletedStory(story) {
        try {
            const completedStories = this.getCompletedStories();
            
            const completedStory = {
                id: story.id,
                config: story.config,
                choiceHistory: story.choiceHistory || [],
                completedAt: Date.now(),
                totalScenes: story.scenes ? story.scenes.length : 0,
                finalScene: story.currentScene,
                stats: this.calculateStoryStats(story)
            };
            
            completedStories.push(completedStory);
            
            // Limit completed stories
            const maxCompleted = 50;
            if (completedStories.length > maxCompleted) {
                completedStories.sort((a, b) => b.completedAt - a.completedAt);
                completedStories.splice(maxCompleted);
            }
            
            localStorage.setItem(this.storageKeys.completedStories, JSON.stringify(completedStories));
            return true;
        } catch (error) {
            console.error('Error saving completed story:', error);
            return false;
        }
    }

    getCompletedStories() {
        try {
            const stories = localStorage.getItem(this.storageKeys.completedStories);
            return stories ? JSON.parse(stories) : [];
        } catch (error) {
            console.warn('Error loading completed stories:', error);
            return [];
        }
    }

    // User Contributions Management
    addUserContribution(contribution) {
        try {
            const contributions = this.getUserContributions();
            
            const newContribution = {
                id: this.generateId(),
                ...contribution,
                createdAt: Date.now(),
                approved: false, // Pending moderation
                used: false
            };
            
            contributions.push(newContribution);
            
            // Limit contributions
            const maxContributions = 100;
            if (contributions.length > maxContributions) {
                contributions.sort((a, b) => b.createdAt - a.createdAt);
                contributions.splice(maxContributions);
            }
            
            localStorage.setItem(this.storageKeys.userContributions, JSON.stringify(contributions));
            return newContribution.id;
        } catch (error) {
            console.error('Error saving contribution:', error);
            return null;
        }
    }

    getUserContributions() {
        try {
            const contributions = localStorage.getItem(this.storageKeys.userContributions);
            return contributions ? JSON.parse(contributions) : [];
        } catch (error) {
            console.warn('Error loading contributions:', error);
            return [];
        }
    }

    getApprovedContributions(theme = null) {
        const contributions = this.getUserContributions();
        let approved = contributions.filter(c => c.approved);
        
        if (theme) {
            approved = approved.filter(c => c.theme === theme);
        }
        
        return approved;
    }

    // Analytics and Statistics
    saveAnalytics(data) {
        try {
            const analytics = this.getAnalytics();
            analytics.sessions = analytics.sessions || [];
            analytics.sessions.push({
                ...data,
                timestamp: Date.now()
            });
            
            // Keep only last 100 sessions
            if (analytics.sessions.length > 100) {
                analytics.sessions = analytics.sessions.slice(-100);
            }
            
            localStorage.setItem(this.storageKeys.analytics, JSON.stringify(analytics));
        } catch (error) {
            console.warn('Error saving analytics:', error);
        }
    }

    getAnalytics() {
        try {
            const analytics = localStorage.getItem(this.storageKeys.analytics);
            return analytics ? JSON.parse(analytics) : { sessions: [] };
        } catch (error) {
            console.warn('Error loading analytics:', error);
            return { sessions: [] };
        }
    }

    // Data Export/Import
    exportAllData() {
        try {
            return {
                stories: this.getSavedStories(),
                completedStories: this.getCompletedStories(),
                settings: this.getSettings(),
                contributions: this.getUserContributions(),
                analytics: this.getAnalytics(),
                exportedAt: Date.now(),
                version: '1.0'
            };
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }

    importData(data, options = {}) {
        try {
            const { merge = true, overwrite = false } = options;
            
            if (data.settings && (overwrite || !merge)) {
                this.saveSettings(data.settings);
            }
            
            if (data.stories) {
                if (overwrite) {
                    localStorage.setItem(this.storageKeys.stories, JSON.stringify(data.stories));
                } else if (merge) {
                    const existingStories = this.getSavedStories();
                    const mergedStories = this.mergeStoryArrays(existingStories, data.stories);
                    localStorage.setItem(this.storageKeys.stories, JSON.stringify(mergedStories));
                }
            }
            
            if (data.completedStories) {
                if (overwrite) {
                    localStorage.setItem(this.storageKeys.completedStories, JSON.stringify(data.completedStories));
                } else if (merge) {
                    const existing = this.getCompletedStories();
                    const merged = this.mergeCompletedStories(existing, data.completedStories);
                    localStorage.setItem(this.storageKeys.completedStories, JSON.stringify(merged));
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Utility Methods
    calculateStoryStats(story) {
        const stats = {
            totalChoices: story.choiceHistory ? story.choiceHistory.length : 0,
            scenesCompleted: story.scenes ? story.scenes.length : 0,
            timeSpent: 0, // Would be calculated if we tracked time
            theme: story.config.theme,
            characterName: story.config.characterName
        };
        
        if (story.choiceHistory && story.choiceHistory.length > 1) {
            const firstChoice = story.choiceHistory[0];
            const lastChoice = story.choiceHistory[story.choiceHistory.length - 1];
            stats.timeSpent = lastChoice.timestamp - firstChoice.timestamp;
        }
        
        return stats;
    }

    migrateStoryFormat(story) {
        // Handle migration from older story formats
        if (!story.version || story.version < '1.0') {
            // Convert old Map serialization format
            if (story.variables && Array.isArray(story.variables)) {
                story.variables = new Map(story.variables);
            }
            
            story.version = '1.0';
        }
        
        return story;
    }

    serializeStory(story) {
        // Convert Maps and other non-JSON objects for storage
        const serialized = { ...story };
        
        if (story.variables instanceof Map) {
            serialized.variables = Array.from(story.variables.entries());
        }
        
        return serialized;
    }

    deserializeStory(story) {
        // Convert serialized data back to proper objects
        const deserialized = { ...story };
        
        if (Array.isArray(story.variables)) {
            deserialized.variables = new Map(story.variables);
        }
        
        return deserialized;
    }

    mergeStoryArrays(existing, incoming) {
        const merged = [...existing];
        
        incoming.forEach(incomingStory => {
            const existingIndex = merged.findIndex(s => s.id === incomingStory.id);
            if (existingIndex >= 0) {
                // Keep the more recent version
                if (incomingStory.savedAt > merged[existingIndex].savedAt) {
                    merged[existingIndex] = incomingStory;
                }
            } else {
                merged.push(incomingStory);
            }
        });
        
        return merged;
    }

    mergeCompletedStories(existing, incoming) {
        const merged = [...existing];
        
        incoming.forEach(incomingStory => {
            const existingIndex = merged.findIndex(s => s.id === incomingStory.id);
            if (existingIndex === -1) {
                merged.push(incomingStory);
            }
        });
        
        return merged;
    }

    // Storage Management
    getStorageUsage() {
        try {
            let totalSize = 0;
            const usage = {};
            
            Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
                const data = localStorage.getItem(storageKey);
                const size = data ? new Blob([data]).size : 0;
                usage[key] = {
                    size: size,
                    sizeFormatted: this.formatBytes(size)
                };
                totalSize += size;
            });
            
            return {
                total: totalSize,
                totalFormatted: this.formatBytes(totalSize),
                breakdown: usage,
                available: this.getAvailableStorage()
            };
        } catch (error) {
            console.warn('Error calculating storage usage:', error);
            return null;
        }
    }

    getAvailableStorage() {
        try {
            // Test available localStorage space
            const testKey = 'storage_test';
            let size = 0;
            let testData = 'a';
            
            try {
                while (size < 10 * 1024 * 1024) { // Test up to 10MB
                    localStorage.setItem(testKey, testData);
                    size += testData.length;
                    testData += testData;
                }
            } catch (e) {
                // Hit storage limit
            } finally {
                localStorage.removeItem(testKey);
            }
            
            return size;
        } catch (error) {
            return 0;
        }
    }

    cleanupOldData() {
        try {
            const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
            
            // Clean up old completed stories
            const completedStories = this.getCompletedStories();
            const recentCompleted = completedStories.filter(story => 
                story.completedAt > cutoffDate
            );
            
            if (recentCompleted.length !== completedStories.length) {
                localStorage.setItem(this.storageKeys.completedStories, JSON.stringify(recentCompleted));
            }
            
            // Clean up old analytics
            const analytics = this.getAnalytics();
            if (analytics.sessions) {
                analytics.sessions = analytics.sessions.filter(session =>
                    session.timestamp > cutoffDate
                );
                localStorage.setItem(this.storageKeys.analytics, JSON.stringify(analytics));
            }
            
        } catch (error) {
            console.warn('Error during cleanup:', error);
        }
    }

    clearAllData() {
        try {
            Object.values(this.storageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Reinitialize with defaults
            this.saveSettings(this.defaultSettings);
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    handleStorageError(error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('Storage quota exceeded. Attempting cleanup...');
            this.cleanupOldData();
            
            // If still not enough space, remove oldest saved stories
            const stories = this.getSavedStories();
            if (stories.length > 5) {
                stories.sort((a, b) => a.savedAt - b.savedAt);
                const reducedStories = stories.slice(-5);
                localStorage.setItem(this.storageKeys.stories, JSON.stringify(reducedStories));
            }
        }
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Backup and Restore
    createBackup() {
        const backup = {
            ...this.exportAllData(),
            backupCreatedAt: Date.now(),
            version: '1.0'
        };
        
        return JSON.stringify(backup);
    }

    restoreFromBackup(backupString, options = {}) {
        try {
            const backup = JSON.parse(backupString);
            
            if (!backup.version || backup.version < '1.0') {
                throw new Error('Incompatible backup format');
            }
            
            return this.importData(backup, options);
        } catch (error) {
            console.error('Error restoring backup:', error);
            return false;
        }
    }
}
