/**
 * Local Storage management for the Story Generator
 */

class StorageManager {
    constructor() {
        this.storageKey = 'storyGenerator';
        this.version = '1.0';
        this.maxStories = 10; // Maximum number of saved stories
        
        this.init();
    }
    
    init() {
        // Check if localStorage is available
        if (!StoryUtils.hasFeature('localStorage')) {
            console.warn('localStorage not available, using memory storage');
            this.storage = new Map();
            this.useLocalStorage = false;
        } else {
            this.useLocalStorage = true;
            this.migrateOldData();
        }
    }
    
    // Migrate old storage format if needed
    migrateOldData() {
        try {
            const oldData = localStorage.getItem('savedStories');
            if (oldData && !localStorage.getItem(this.storageKey)) {
                const parsed = JSON.parse(oldData);
                this.setData({
                    version: this.version,
                    stories: parsed,
                    settings: this.getDefaultSettings()
                });
                localStorage.removeItem('savedStories');
                console.log('Migrated old storage data');
            }
        } catch (error) {
            console.error('Error migrating old data:', error);
        }
    }
    
    // Get default settings
    getDefaultSettings() {
        return {
            theme: 'fantasy',
            narrationEnabled: true,
            narrationSpeed: 1.0,
            narrationVoice: null,
            animationsEnabled: true,
            autoSave: true
        };
    }
    
    // Get all data from storage
    getData() {
        if (!this.useLocalStorage) {
            return this.storage.get(this.storageKey) || this.getDefaultData();
        }
        
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (error) {
            console.error('Error parsing storage data:', error);
            return this.getDefaultData();
        }
    }
    
    // Get default data structure
    getDefaultData() {
        return {
            version: this.version,
            stories: [],
            settings: this.getDefaultSettings(),
            userContributions: []
        };
    }
    
    // Set all data to storage
    setData(data) {
        if (!this.useLocalStorage) {
            this.storage.set(this.storageKey, data);
            return;
        }
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            // If quota exceeded, remove oldest stories
            this.cleanupOldStories(3);
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            } catch (retryError) {
                console.error('Failed to save after cleanup:', retryError);
                StoryUtils.showToast('Storage full. Some data may not be saved.', 'warning');
            }
        }
    }
    
    // Save a story
    saveStory(storyData) {
        const data = this.getData();
        const story = {
            id: this.generateId(),
            title: storyData.title || this.generateStoryTitle(storyData),
            theme: storyData.theme,
            character: storyData.character,
            setting: storyData.setting,
            specialElement: storyData.specialElement,
            currentPath: storyData.currentPath || [],
            storyText: storyData.storyText || '',
            choices: storyData.choices || [],
            currentChapter: storyData.currentChapter || 1,
            totalChapters: storyData.totalChapters || 1,
            progress: storyData.progress || 0,
            createdAt: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),
            isCompleted: storyData.isCompleted || false
        };
        
        // Remove existing story with same parameters if exists
        data.stories = data.stories.filter(s => 
            !(s.character === story.character && 
              s.setting === story.setting && 
              s.theme === story.theme)
        );
        
        // Add new story at beginning
        data.stories.unshift(story);
        
        // Keep only maximum number of stories
        if (data.stories.length > this.maxStories) {
            data.stories = data.stories.slice(0, this.maxStories);
        }
        
        this.setData(data);
        return story.id;
    }
    
    // Load a story by ID
    loadStory(storyId) {
        const data = this.getData();
        const story = data.stories.find(s => s.id === storyId);
        
        if (story) {
            // Update last played timestamp
            story.lastPlayed = new Date().toISOString();
            this.setData(data);
        }
        
        return story;
    }
    
    // Get all saved stories
    getSavedStories() {
        const data = this.getData();
        return data.stories.sort((a, b) => 
            new Date(b.lastPlayed) - new Date(a.lastPlayed)
        );
    }
    
    // Delete a story
    deleteStory(storyId) {
        const data = this.getData();
        data.stories = data.stories.filter(s => s.id !== storyId);
        this.setData(data);
    }
    
    // Update story progress
    updateStoryProgress(storyId, progressData) {
        const data = this.getData();
        const storyIndex = data.stories.findIndex(s => s.id === storyId);
        
        if (storyIndex !== -1) {
            Object.assign(data.stories[storyIndex], progressData, {
                lastPlayed: new Date().toISOString()
            });
            this.setData(data);
        }
    }
    
    // Generate story title from parameters
    generateStoryTitle(storyData) {
        const themeAdjectives = {
            fantasy: ['Magical', 'Epic', 'Mystical', 'Legendary'],
            scifi: ['Galactic', 'Futuristic', 'Cosmic', 'Advanced'],
            mystery: ['Mysterious', 'Hidden', 'Secret', 'Enigmatic'],
            horror: ['Dark', 'Haunting', 'Terrifying', 'Sinister']
        };
        
        const adjective = StoryUtils.randomChoice(themeAdjectives[storyData.theme] || ['Amazing']);
        const character = StoryUtils.capitalize(storyData.character || 'Hero');
        
        return `${adjective} Tale of ${character}`;
    }
    
    // Settings management
    getSettings() {
        const data = this.getData();
        return { ...this.getDefaultSettings(), ...data.settings };
    }
    
    setSetting(key, value) {
        const data = this.getData();
        data.settings = { ...data.settings, [key]: value };
        this.setData(data);
    }
    
    updateSettings(settings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        this.setData(data);
    }
    
    // User contributions management
    addUserContribution(contribution) {
        const data = this.getData();
        const newContribution = {
            id: this.generateId(),
            title: contribution.title,
            theme: contribution.theme,
            text: contribution.text,
            choices: contribution.choices || [],
            createdAt: new Date().toISOString(),
            approved: false // Would require moderation in production
        };
        
        data.userContributions.unshift(newContribution);
        
        // Keep only last 50 contributions
        if (data.userContributions.length > 50) {
            data.userContributions = data.userContributions.slice(0, 50);
        }
        
        this.setData(data);
        return newContribution.id;
    }
    
    getUserContributions(theme = null) {
        const data = this.getData();
        let contributions = data.userContributions || [];
        
        if (theme) {
            contributions = contributions.filter(c => c.theme === theme);
        }
        
        return contributions;
    }
    
    // Export story data
    exportStory(storyId, format = 'json') {
        const story = this.loadStory(storyId);
        if (!story) return null;
        
        const exportData = {
            title: story.title,
            theme: story.theme,
            character: story.character,
            setting: story.setting,
            specialElement: story.specialElement,
            storyContent: story.storyText,
            choices: story.choices,
            isCompleted: story.isCompleted,
            exportedAt: new Date().toISOString(),
            generatedBy: 'Story Forge'
        };
        
        if (format === 'json') {
            return JSON.stringify(exportData, null, 2);
        } else if (format === 'text') {
            return this.storyToText(exportData);
        }
        
        return exportData;
    }
    
    // Convert story to readable text format
    storyToText(storyData) {
        let text = `${storyData.title}\n`;
        text += '='.repeat(storyData.title.length) + '\n\n';
        text += `Theme: ${StoryUtils.capitalize(storyData.theme)}\n`;
        text += `Character: ${storyData.character}\n`;
        text += `Setting: ${storyData.setting}\n`;
        if (storyData.specialElement) {
            text += `Special Element: ${storyData.specialElement}\n`;
        }
        text += `\nGenerated: ${StoryUtils.formatDate(new Date(storyData.exportedAt))}\n`;
        text += `By: ${storyData.generatedBy}\n\n`;
        text += '-'.repeat(50) + '\n\n';
        text += storyData.storyContent;
        
        return text;
    }
    
    // Clear all data
    clearAllData() {
        if (!this.useLocalStorage) {
            this.storage.clear();
            return;
        }
        
        try {
            localStorage.removeItem(this.storageKey);
            StoryUtils.showToast('All data cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing data:', error);
            StoryUtils.showToast('Error clearing data', 'error');
        }
    }
    
    // Clean up old stories when storage is full
    cleanupOldStories(keepCount = 5) {
        const data = this.getData();
        if (data.stories.length > keepCount) {
            data.stories = data.stories
                .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
                .slice(0, keepCount);
            this.setData(data);
            console.log(`Cleaned up old stories, kept ${keepCount} most recent`);
        }
    }
    
    // Get storage usage information
    getStorageInfo() {
        if (!this.useLocalStorage) {
            return {
                used: 0,
                total: Infinity,
                percentage: 0,
                stories: this.storage.get(this.storageKey)?.stories?.length || 0
            };
        }
        
        try {
            const data = this.getData();
            const dataString = JSON.stringify(data);
            const used = new Blob([dataString]).size;
            const total = 5 * 1024 * 1024; // Assume 5MB limit (varies by browser)
            
            return {
                used,
                total,
                percentage: (used / total) * 100,
                stories: data.stories.length,
                contributions: data.userContributions?.length || 0
            };
        } catch (error) {
            console.error('Error calculating storage info:', error);
            return {
                used: 0,
                total: 0,
                percentage: 0,
                stories: 0
            };
        }
    }
    
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Create global instance
window.StorageManager = new StorageManager();
