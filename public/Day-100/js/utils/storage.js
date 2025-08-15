// Local Storage Utility
const storage = {
    // Save data to localStorage
    save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(`eduplay_${key}`, serializedData);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Get data from localStorage
    get(key) {
        try {
            const serializedData = localStorage.getItem(`eduplay_${key}`);
            if (serializedData === null) {
                return null;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // Delete data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(`eduplay_${key}`);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all EduPlay data
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('eduplay_')) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    // Check if localStorage is available
    isAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    },

    // Get all EduPlay keys
    getAllKeys() {
        try {
            const keys = Object.keys(localStorage);
            return keys.filter(key => key.startsWith('eduplay_'))
                      .map(key => key.replace('eduplay_', ''));
        } catch (error) {
            console.error('Error getting keys from localStorage:', error);
            return [];
        }
    },

    // Export all data (for backup)
    exportData() {
        try {
            const data = {};
            const keys = this.getAllKeys();
            
            keys.forEach(key => {
                data[key] = this.get(key);
            });
            
            return data;
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    },

    // Import data (for restore)
    importData(data) {
        try {
            Object.keys(data).forEach(key => {
                this.save(key, data[key]);
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    // Get storage usage info
    getStorageInfo() {
        if (!this.isAvailable()) {
            return { available: false, used: 0, total: 0 };
        }

        try {
            let used = 0;
            const keys = this.getAllKeys();
            
            keys.forEach(key => {
                const data = localStorage.getItem(`eduplay_${key}`);
                if (data) {
                    used += data.length;
                }
            });

            // Estimate total available (usually 5-10MB for localStorage)
            const total = 5 * 1024 * 1024; // 5MB estimate
            
            return {
                available: true,
                used: used,
                total: total,
                usedMB: (used / (1024 * 1024)).toFixed(2),
                totalMB: (total / (1024 * 1024)).toFixed(2),
                percentUsed: ((used / total) * 100).toFixed(1)
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { available: false, used: 0, total: 0 };
        }
    }
};

// Initialize storage check
document.addEventListener('DOMContentLoaded', () => {
    if (!storage.isAvailable()) {
        console.warn('localStorage is not available. Progress will not be saved.');
        
        // Show warning to user
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff3cd;
            color: #856404;
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid #ffeaa7;
            z-index: 1000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        `;
        warning.innerHTML = `
            <strong>⚠️ Storage Warning:</strong> Your progress may not be saved due to browser restrictions.
            <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
        `;
        document.body.appendChild(warning);
        
        // Auto-remove warning after 10 seconds
        setTimeout(() => {
            if (warning.parentElement) {
                warning.remove();
            }
        }, 10000);
    }
});
