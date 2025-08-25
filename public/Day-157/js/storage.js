// Local storage management for time capsules
class CapsuleStorage {
    constructor() {
        this.storageKey = 'timecapsule_data';
        this.backupKey = 'timecapsule_backup';
        this.version = '1.0';

        // Initialize storage structure
        this.initializeStorage();
    }

    initializeStorage() {
        try {
            const existingData = localStorage.getItem(this.storageKey);
            if (!existingData) {
                const initialData = {
                    version: this.version,
                    capsules: [],
                    settings: {
                        theme: 'metallic',
                        soundEnabled: true,
                        notifications: true
                    },
                    lastBackup: null
                };
                this.saveToStorage(initialData);
            }
        } catch (error) {
            console.error('Failed to initialize storage:', error);
            this.showStorageError('Failed to initialize storage');
        }
    }

    saveCapsule(capsule) {
        try {
            const data = this.loadFromStorage();

            // Validate capsule data
            if (!this.validateCapsule(capsule)) {
                throw new Error('Invalid capsule data');
            }

            // Check if capsule already exists
            const existingIndex = data.capsules.findIndex(c => c.id === capsule.id);

            if (existingIndex >= 0) {
                // Update existing capsule
                data.capsules[existingIndex] = capsule;
            } else {
                // Add new capsule
                data.capsules.push(capsule);
            }

            // Sort capsules by unlock date
            data.capsules.sort((a, b) => new Date(a.unlockDateTime) - new Date(b.unlockDateTime));

            this.saveToStorage(data);
            this.createBackup();

            return true;
        } catch (error) {
            console.error('Failed to save capsule:', error);
            this.showStorageError('Failed to save capsule');
            return false;
        }
    }

    getCapsule(id) {
        try {
            const data = this.loadFromStorage();
            return data.capsules.find(capsule => capsule.id === id) || null;
        } catch (error) {
            console.error('Failed to get capsule:', error);
            return null;
        }
    }

    updateCapsule(updatedCapsule) {
        try {
            const data = this.loadFromStorage();
            const index = data.capsules.findIndex(c => c.id === updatedCapsule.id);

            if (index === -1) {
                throw new Error('Capsule not found');
            }

            if (!this.validateCapsule(updatedCapsule)) {
                throw new Error('Invalid capsule data');
            }

            data.capsules[index] = updatedCapsule;
            this.saveToStorage(data);
            this.createBackup();

            return true;
        } catch (error) {
            console.error('Failed to update capsule:', error);
            this.showStorageError('Failed to update capsule');
            return false;
        }
    }

    deleteCapsule(id) {
        try {
            const data = this.loadFromStorage();
            const index = data.capsules.findIndex(c => c.id === id);

            if (index === -1) {
                return false;
            }

            data.capsules.splice(index, 1);
            this.saveToStorage(data);
            this.createBackup();

            return true;
        } catch (error) {
            console.error('Failed to delete capsule:', error);
            this.showStorageError('Failed to delete capsule');
            return false;
        }
    }

    getAllCapsules() {
        try {
            const data = this.loadFromStorage();
            return data.capsules || [];
        } catch (error) {
            console.error('Failed to get capsules:', error);
            return [];
        }
    }

    getUnlockedCapsules() {
        const all = this.getAllCapsules();
        const now = new Date();

        return all.filter(capsule =>
            capsule.unlocked || new Date(capsule.unlockDateTime) <= now
        );
    }

    getLockedCapsules() {
        const all = this.getAllCapsules();
        const now = new Date();

        return all.filter(capsule =>
            !capsule.unlocked && new Date(capsule.unlockDateTime) > now
        );
    }

    getCapsulesByDateRange(startDate, endDate) {
        const all = this.getAllCapsules();

        return all.filter(capsule => {
            const unlockDate = new Date(capsule.unlockDateTime);
            return unlockDate >= startDate && unlockDate <= endDate;
        });
    }

    searchCapsules(query) {
        const all = this.getAllCapsules();
        const searchTerm = query.toLowerCase();

        return all.filter(capsule =>
            capsule.message.toLowerCase().includes(searchTerm)
        );
    }

    validateCapsule(capsule) {
        const required = ['id', 'message', 'unlockDateTime', 'createdAt'];

        // Check required fields
        for (const field of required) {
            if (!capsule.hasOwnProperty(field) || capsule[field] === null || capsule[field] === undefined) {
                return false;
            }
        }

        // Validate dates
        try {
            new Date(capsule.unlockDateTime);
            new Date(capsule.createdAt);
        } catch (error) {
            return false;
        }

        // Validate message length
        if (capsule.message.length > 10000) {
            return false;
        }

        // Validate email format if provided
        if (capsule.email && !this.isValidEmail(capsule.email)) {
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                throw new Error('No data found');
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load from storage:', error);

            // Try to load from backup
            try {
                const backupData = localStorage.getItem(this.backupKey);
                if (backupData) {
                    const backup = JSON.parse(backupData);
                    this.saveToStorage(backup);
                    return backup;
                }
            } catch (backupError) {
                console.error('Failed to load backup:', backupError);
            }

            // Return empty structure if all else fails
            return {
                version: this.version,
                capsules: [],
                settings: {
                    theme: 'metallic',
                    soundEnabled: true,
                    notifications: true
                },
                lastBackup: null
            };
        }
    }

    saveToStorage(data) {
        try {
            data.lastModified = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                this.handleStorageQuotaExceeded();
            }
            throw error;
        }
    }

    createBackup() {
        try {
            const data = this.loadFromStorage();
            data.lastBackup = new Date().toISOString();
            localStorage.setItem(this.backupKey, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to create backup:', error);
        }
    }

    restoreFromBackup() {
        try {
            const backupData = localStorage.getItem(this.backupKey);
            if (!backupData) {
                throw new Error('No backup found');
            }

            const backup = JSON.parse(backupData);
            this.saveToStorage(backup);

            return true;
        } catch (error) {
            console.error('Failed to restore from backup:', error);
            return false;
        }
    }

    exportData() {
        try {
            const data = this.loadFromStorage();
            const exportData = {
                ...data,
                exportDate: new Date().toISOString(),
                version: this.version
            };

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Failed to export data:', error);
            return null;
        }
    }

    importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);

            // Validate imported data
            if (!importedData.capsules || !Array.isArray(importedData.capsules)) {
                throw new Error('Invalid data format');
            }

            // Validate each capsule
            for (const capsule of importedData.capsules) {
                if (!this.validateCapsule(capsule)) {
                    throw new Error('Invalid capsule data in import');
                }
            }

            // Create backup before import
            this.createBackup();

            // Save imported data
            const data = {
                version: this.version,
                capsules: importedData.capsules,
                settings: importedData.settings || {
                    theme: 'metallic',
                    soundEnabled: true,
                    notifications: true
                },
                lastBackup: null
            };

            this.saveToStorage(data);

            return {
                success: true,
                importedCount: importedData.capsules.length
            };
        } catch (error) {
            console.error('Failed to import data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.backupKey);
            this.initializeStorage();
            return true;
        } catch (error) {
            console.error('Failed to clear data:', error);
            return false;
        }
    }

    getStorageStats() {
        try {
            const data = this.loadFromStorage();
            const dataSize = JSON.stringify(data).length;
            const maxSize = 5 * 1024 * 1024; // 5MB typical limit

            return {
                capsuleCount: data.capsules.length,
                dataSize: dataSize,
                maxSize: maxSize,
                usagePercentage: Math.round((dataSize / maxSize) * 100),
                unlockedCount: this.getUnlockedCapsules().length,
                lockedCount: this.getLockedCapsules().length
            };
        } catch (error) {
            console.error('Failed to get storage stats:', error);
            return null;
        }
    }

    handleStorageQuotaExceeded() {
        // Try to free up space by removing old unlocked capsules
        try {
            const data = this.loadFromStorage();
            const now = new Date();
            const oneYearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));

            const filtered = data.capsules.filter(capsule => {
                // Keep locked capsules and recently unlocked capsules
                if (!capsule.unlocked) return true;
                if (new Date(capsule.unlockDateTime) > oneYearAgo) return true;
                return false;
            });

            if (filtered.length < data.capsules.length) {
                data.capsules = filtered;
                this.saveToStorage(data);
                this.showStorageError('Storage full. Old capsules have been cleaned up.');
            } else {
                this.showStorageError('Storage quota exceeded. Please delete some capsules.');
            }
        } catch (error) {
            this.showStorageError('Storage quota exceeded and cleanup failed.');
        }
    }

    showStorageError(message) {
        if (window.timeCapApp) {
            window.timeCapApp.showToast(message, 'error');
        } else {
            console.error('Storage Error:', message);
        }
    }

    // Settings management
    getSettings() {
        try {
            const data = this.loadFromStorage();
            return data.settings || {
                theme: 'metallic',
                soundEnabled: true,
                notifications: true
            };
        } catch (error) {
            return {
                theme: 'metallic',
                soundEnabled: true,
                notifications: true
            };
        }
    }

    updateSettings(newSettings) {
        try {
            const data = this.loadFromStorage();
            data.settings = { ...data.settings, ...newSettings };
            this.saveToStorage(data);
            return true;
        } catch (error) {
            console.error('Failed to update settings:', error);
            return false;
        }
    }
}
