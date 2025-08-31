// Storage Manager for saving and loading designs
class StorageManager {
    constructor() {
        this.storageKey = 'tattoo_designs';
        this.settingsKey = 'tattoo_settings';
        this.maxDesigns = 50; // Limit stored designs
    }
    
    // Save current design
    saveDesign(name, canvasData, metadata = {}) {
        try {
            const designs = this.getAllDesigns();
            const design = {
                id: Utils.generateId(),
                name: name || `Design ${designs.length + 1}`,
                canvasData: canvasData,
                metadata: {
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    ...metadata
                },
                thumbnail: this.generateThumbnail(canvasData)
            };
            
            designs.push(design);
            
            // Keep only the most recent designs
            if (designs.length > this.maxDesigns) {
                designs.splice(0, designs.length - this.maxDesigns);
            }
            
            Utils.localStorage.set(this.storageKey, designs);
            Utils.showNotification(`Design "${design.name}" saved successfully!`);
            return design.id;
        } catch (error) {
            console.error('Failed to save design:', error);
            Utils.showNotification('Failed to save design', 'error');
            return null;
        }
    }
    
    // Load design by ID
    loadDesign(designId) {
        try {
            const designs = this.getAllDesigns();
            const design = designs.find(d => d.id === designId);
            
            if (!design) {
                Utils.showNotification('Design not found', 'error');
                return null;
            }
            
            // Update access time
            design.metadata.accessed = new Date().toISOString();
            this.updateDesign(designId, design);
            
            return design;
        } catch (error) {
            console.error('Failed to load design:', error);
            Utils.showNotification('Failed to load design', 'error');
            return null;
        }
    }
    
    // Update existing design
    updateDesign(designId, updatedData) {
        try {
            const designs = this.getAllDesigns();
            const index = designs.findIndex(d => d.id === designId);
            
            if (index === -1) {
                return false;
            }
            
            designs[index] = {
                ...designs[index],
                ...updatedData,
                metadata: {
                    ...designs[index].metadata,
                    modified: new Date().toISOString(),
                    ...updatedData.metadata
                }
            };
            
            Utils.localStorage.set(this.storageKey, designs);
            return true;
        } catch (error) {
            console.error('Failed to update design:', error);
            return false;
        }
    }
    
    // Delete design
    deleteDesign(designId) {
        try {
            const designs = this.getAllDesigns();
            const filtered = designs.filter(d => d.id !== designId);
            
            if (filtered.length === designs.length) {
                Utils.showNotification('Design not found', 'error');
                return false;
            }
            
            Utils.localStorage.set(this.storageKey, filtered);
            Utils.showNotification('Design deleted successfully!');
            return true;
        } catch (error) {
            console.error('Failed to delete design:', error);
            Utils.showNotification('Failed to delete design', 'error');
            return false;
        }
    }
    
    // Get all designs
    getAllDesigns() {
        return Utils.localStorage.get(this.storageKey, []);
    }
    
    // Get recent designs
    getRecentDesigns(limit = 10) {
        const designs = this.getAllDesigns();
        return designs
            .sort((a, b) => new Date(b.metadata.modified) - new Date(a.metadata.modified))
            .slice(0, limit);
    }
    
    // Search designs
    searchDesigns(query) {
        const designs = this.getAllDesigns();
        const lowercaseQuery = query.toLowerCase();
        
        return designs.filter(design => 
            design.name.toLowerCase().includes(lowercaseQuery) ||
            (design.metadata.tags && design.metadata.tags.some(tag => 
                tag.toLowerCase().includes(lowercaseQuery)
            ))
        );
    }
    
    // Generate thumbnail from canvas data
    generateThumbnail(canvasData, maxSize = 100) {
        try {
            // Create temporary canvas for thumbnail
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate thumbnail dimensions
            const aspectRatio = canvasData.width / canvasData.height;
            let thumbWidth, thumbHeight;
            
            if (aspectRatio > 1) {
                thumbWidth = maxSize;
                thumbHeight = maxSize / aspectRatio;
            } else {
                thumbHeight = maxSize;
                thumbWidth = maxSize * aspectRatio;
            }
            
            canvas.width = thumbWidth;
            canvas.height = thumbHeight;
            
            // Draw a simplified version
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, thumbWidth, thumbHeight);
            
            // Return as data URL
            return canvas.toDataURL('image/jpeg', 0.8);
        } catch (error) {
            console.error('Failed to generate thumbnail:', error);
            return null;
        }
    }
    
    // Export design as JSON
    exportDesign(designId) {
        try {
            const design = this.loadDesign(designId);
            if (!design) return null;
            
            const exportData = {
                version: '1.0',
                design: design,
                exported: new Date().toISOString(),
                app: 'Tattoo Design Studio'
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            Utils.downloadFile(blob, `${design.name}.json`);
            Utils.showNotification('Design exported successfully!');
            return exportData;
        } catch (error) {
            console.error('Failed to export design:', error);
            Utils.showNotification('Failed to export design', 'error');
            return null;
        }
    }
    
    // Import design from JSON
    importDesign(jsonString) {
        try {
            const importData = JSON.parse(jsonString);
            
            if (!importData.design || !importData.design.canvasData) {
                throw new Error('Invalid design format');
            }
            
            const design = importData.design;
            design.id = Utils.generateId(); // Generate new ID
            design.name = `${design.name} (Imported)`;
            design.metadata.imported = new Date().toISOString();
            
            const designs = this.getAllDesigns();
            designs.push(design);
            
            if (designs.length > this.maxDesigns) {
                designs.splice(0, designs.length - this.maxDesigns);
            }
            
            Utils.localStorage.set(this.storageKey, designs);
            Utils.showNotification('Design imported successfully!');
            return design.id;
        } catch (error) {
            console.error('Failed to import design:', error);
            Utils.showNotification('Failed to import design. Please check the file format.', 'error');
            return null;
        }
    }
    
    // Save user settings
    saveSettings(settings) {
        try {
            const currentSettings = this.getSettings();
            const updatedSettings = {
                ...currentSettings,
                ...settings,
                lastModified: new Date().toISOString()
            };
            
            Utils.localStorage.set(this.settingsKey, updatedSettings);
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }
    
    // Load user settings
    getSettings() {
        return Utils.localStorage.get(this.settingsKey, {
            theme: 'light',
            snapToGrid: false,
            autoSave: true,
            canvasSize: { width: 800, height: 600 },
            skinTone: '#7d5a3f',
            bodyTemplate: 'arm',
            defaultFontFamily: 'Inter',
            defaultFontSize: 24
        });
    }
    
    // Auto-save current work
    autoSave(canvasData) {
        if (!this.getSettings().autoSave) return;
        
        const autoSaveKey = this.storageKey + '_autosave';
        const autoSaveData = {
            canvasData: canvasData,
            timestamp: new Date().toISOString()
        };
        
        Utils.localStorage.set(autoSaveKey, autoSaveData);
    }
    
    // Load auto-saved work
    loadAutoSave() {
        const autoSaveKey = this.storageKey + '_autosave';
        return Utils.localStorage.get(autoSaveKey, null);
    }
    
    // Clear auto-save
    clearAutoSave() {
        const autoSaveKey = this.storageKey + '_autosave';
        Utils.localStorage.remove(autoSaveKey);
    }
    
    // Get storage usage info
    getStorageInfo() {
        try {
            const designs = this.getAllDesigns();
            const settings = this.getSettings();
            
            const designsSize = JSON.stringify(designs).length;
            const settingsSize = JSON.stringify(settings).length;
            
            return {
                designCount: designs.length,
                totalSize: designsSize + settingsSize,
                designsSize: designsSize,
                settingsSize: settingsSize,
                maxDesigns: this.maxDesigns,
                storageAvailable: this.isStorageAvailable()
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return null;
        }
    }
    
    // Check if localStorage is available
    isStorageAvailable() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Clear all stored data
    clearAllData() {
        try {
            Utils.localStorage.remove(this.storageKey);
            Utils.localStorage.remove(this.settingsKey);
            this.clearAutoSave();
            Utils.showNotification('All data cleared successfully!');
            return true;
        } catch (error) {
            console.error('Failed to clear data:', error);
            Utils.showNotification('Failed to clear data', 'error');
            return false;
        }
    }
    
    // Backup all data
    backupAllData() {
        try {
            const backupData = {
                version: '1.0',
                designs: this.getAllDesigns(),
                settings: this.getSettings(),
                autoSave: this.loadAutoSave(),
                backup: {
                    created: new Date().toISOString(),
                    app: 'Tattoo Design Studio'
                }
            };
            
            const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                type: 'application/json'
            });
            
            const filename = `tattoo_backup_${new Date().toISOString().split('T')[0]}.json`;
            Utils.downloadFile(blob, filename);
            Utils.showNotification('Backup created successfully!');
            return backupData;
        } catch (error) {
            console.error('Failed to create backup:', error);
            Utils.showNotification('Failed to create backup', 'error');
            return null;
        }
    }
    
    // Restore from backup
    restoreFromBackup(jsonString) {
        try {
            const backupData = JSON.parse(jsonString);
            
            if (!backupData.designs || !backupData.settings) {
                throw new Error('Invalid backup format');
            }
            
            // Restore designs
            if (backupData.designs.length > 0) {
                Utils.localStorage.set(this.storageKey, backupData.designs);
            }
            
            // Restore settings
            Utils.localStorage.set(this.settingsKey, backupData.settings);
            
            Utils.showNotification('Backup restored successfully!');
            return true;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            Utils.showNotification('Failed to restore backup. Please check the file format.', 'error');
            return false;
        }
    }
}

// Create global instance
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
} else {
    window.StorageManager = StorageManager;
}
