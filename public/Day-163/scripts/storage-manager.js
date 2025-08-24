
class StorageManager {
    constructor() {
        this.prefix = 'story-generator-';
        this.maxStories = 10;
        this.isSupported = this.checkSupport();
    }

    checkSupport() {
        try {
            const testKey = this.prefix + 'test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage not supported');
            return false;
        }
    }

    saveStory(storyData) {
        if (!this.isSupported) return false;

        try {
            const stories = this.getSavedStories();
            
            // Remove any existing story with same ID
            const filteredStories = stories.filter(s => s.id !== storyData.id);
            
            // Add new story at beginning
            filteredStories.unshift(storyData);
            
            // Limit number of stories
            const limitedStories = filteredStories.slice(0, this.maxStories);
            
            localStorage.setItem(this.prefix + 'stories', JSON.stringify(limitedStories));
            return true;
        } catch (e) {
            console.error('Failed to save story:', e);
            return false;
        }
    }

    getSavedStories() {
        if (!this.isSupported) return [];

        try {
            const stored = localStorage.getItem(this.prefix + 'stories');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load stories:', e);
            return [];
        }
    }

    getStory(storyId) {
        const stories = this.getSavedStories();
        return stories.find(s => s.id === storyId) || null;
    }

    deleteStory(storyId) {
        if (!this.isSupported) return false;

        try {
            const stories = this.getSavedStories();
            const filteredStories = stories.filter(s => s.id !== storyId);
            localStorage.setItem(this.prefix + 'stories', JSON.stringify(filteredStories));
            return true;
        } catch (e) {
            console.error('Failed to delete story:', e);
            return false;
        }
    }

    saveSettings(settings) {
        if (!this.isSupported) return false;

        try {
            localStorage.setItem(this.prefix + 'settings', JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }

    getSettings() {
        if (!this.isSupported) return null;

        try {
            const stored = localStorage.getItem(this.prefix + 'settings');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('Failed to load settings:', e);
            return null;
        }
    }

    clearAllData() {
        if (!this.isSupported) return false;

        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Failed to clear data:', e);
            return false;
        }
    }

    getStorageUsage() {
        if (!this.isSupported) return { used: 0, total: 0 };

        let used = 0;
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    used += localStorage.getItem(key).length;
                }
            });
        } catch (e) {
            console.error('Failed to calculate storage usage:', e);
        }

        // Approximate localStorage limit (5MB for most browsers)
        const total = 5 * 1024 * 1024;
        
        return { used, total };
    }

    exportData() {
        if (!this.isSupported) return null;

        try {
            const stories = this.getSavedStories();
            const settings = this.getSettings();
            
            return {
                stories,
                settings,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
        } catch (e) {
            console.error('Failed to export data:', e);
            return null;
        }
    }

    importData(data) {
        if (!this.isSupported || !data) return false;

        try {
            if (data.stories) {
                localStorage.setItem(this.prefix + 'stories', JSON.stringify(data.stories));
            }
            
            if (data.settings) {
                localStorage.setItem(this.prefix + 'settings', JSON.stringify(data.settings));
            }
            
            return true;
        } catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    }
}

window.StorageManager = StorageManager;
