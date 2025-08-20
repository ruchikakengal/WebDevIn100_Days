// Utility functions for the KBC game

/**
 * Utility class for common helper functions
 */
class Utils {
    /**
     * Format number as Indian currency
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    static formatCurrency(amount) {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)} Crore`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)} Lakh`;
        } else {
            return `₹${amount.toLocaleString('en-IN')}`;
        }
    }

    /**
     * Generate a random number between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Shuffle an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Create a delay using Promise
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} Element or null if not found
     */
    static getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    }

    /**
     * Add event listener with error handling
     * @param {HTMLElement|string} element - Element or element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {boolean|object} options - Event options
     */
    static addEventListener(element, event, handler, options = false) {
        try {
            if (typeof element === 'string') {
                element = this.getElementById(element);
            }
            if (element && typeof handler === 'function') {
                element.addEventListener(event, handler, options);
            }
        } catch (error) {
            console.error('Error adding event listener:', error);
        }
    }

    /**
     * Remove event listener with error handling
     * @param {HTMLElement|string} element - Element or element ID
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {boolean|object} options - Event options
     */
    static removeEventListener(element, event, handler, options = false) {
        try {
            if (typeof element === 'string') {
                element = this.getElementById(element);
            }
            if (element && typeof handler === 'function') {
                element.removeEventListener(event, handler, options);
            }
        } catch (error) {
            console.error('Error removing event listener:', error);
        }
    }

    /**
     * Create and show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    static showToast(message, type = 'info', duration = 3000) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            word-wrap: break-word;
        `;

        document.body.appendChild(toast);

        // Auto remove
        const autoRemove = setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeToast(toast);
        });
    }

    /**
     * Remove toast with animation
     * @param {HTMLElement} toast - Toast element to remove
     */
    static removeToast(toast) {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }

    /**
     * Get toast icon based on type
     * @param {string} type - Toast type
     * @returns {string} Icon class
     */
    static getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Get toast color based on type
     * @param {string} type - Toast type
     * @returns {string} Background color
     */
    static getToastColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #28a745, #20c997)',
            error: 'linear-gradient(135deg, #dc3545, #e74c3c)',
            warning: 'linear-gradient(135deg, #fd7e14, #f39c12)',
            info: 'linear-gradient(135deg, #007bff, #0056b3)'
        };
        return colors[type] || colors.info;
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const result = document.execCommand('copy');
                document.body.removeChild(textArea);
                return result;
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            return false;
        }
    }

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Check if device is tablet
     * @returns {boolean} True if tablet device
     */
    static isTablet() {
        return /iPad|Android|Kindle|Silk/i.test(navigator.userAgent) && window.innerWidth >= 768;
    }

    /**
     * Get device type
     * @returns {string} Device type (mobile, tablet, desktop)
     */
    static getDeviceType() {
        if (this.isMobile() && !this.isTablet()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Generate a unique ID
     * @param {string} prefix - Prefix for the ID
     * @returns {string} Unique ID
     */
    static generateUniqueId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Local storage wrapper with error handling
     */
    static Storage = {
        /**
         * Set item in local storage
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         * @returns {boolean} Success status
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error setting local storage:', error);
                return false;
            }
        },

        /**
         * Get item from local storage
         * @param {string} key - Storage key
         * @param {*} defaultValue - Default value if key not found
         * @returns {*} Stored value or default value
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error getting local storage:', error);
                return defaultValue;
            }
        },

        /**
         * Remove item from local storage
         * @param {string} key - Storage key
         * @returns {boolean} Success status
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing local storage:', error);
                return false;
            }
        },

        /**
         * Clear all local storage
         * @returns {boolean} Success status
         */
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing local storage:', error);
                return false;
            }
        }
    };

    /**
     * Create particles effect
     * @param {HTMLElement} container - Container element
     * @param {number} count - Number of particles
     */
    static createParticles(container, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Utils.randomBetween(2, 4)}px;
                height: ${Utils.randomBetween(2, 4)}px;
                background: #ffd700;
                border-radius: 50%;
                pointer-events: none;
                animation: floatingParticles ${Utils.randomBetween(10, 20)}s linear infinite;
                animation-delay: ${Utils.randomBetween(0, 5)}s;
                left: ${Utils.randomBetween(0, 100)}%;
                top: 100%;
                box-shadow: 0 0 6px #ffd700;
            `;
            container.appendChild(particle);
        }
    }

    /**
     * Create confetti effect
     * @param {HTMLElement} container - Container element
     * @param {number} duration - Effect duration in milliseconds
     */
    static createConfetti(container, duration = 3000) {
        const colors = ['#ffd700', '#ff6b35', '#f7931e', '#dc143c', '#4caf50', '#2196f3'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.cssText = `
                position: absolute;
                width: ${Utils.randomBetween(6, 12)}px;
                height: ${Utils.randomBetween(6, 12)}px;
                background: ${color};
                border-radius: ${Utils.randomBetween(0, 50)}%;
                pointer-events: none;
                left: ${Utils.randomBetween(0, 100)}%;
                top: -20px;
                animation: confettiFall ${Utils.randomBetween(2, 4)}s linear forwards;
                animation-delay: ${Utils.randomBetween(0, 2)}s;
                transform: rotate(${Utils.randomBetween(0, 360)}deg);
                opacity: 0.8;
            `;
            
            container.appendChild(confetti);
        }

        // Clean up confetti after duration
        setTimeout(() => {
            const confettiElements = container.querySelectorAll('[style*="confettiFall"]');
            confettiElements.forEach(el => el.remove());
        }, duration + 2000);
    }

    /**
     * Animate element with custom properties
     * @param {HTMLElement} element - Element to animate
     * @param {Object} properties - Animation properties
     * @param {number} duration - Animation duration in milliseconds
     * @param {string} easing - CSS easing function
     * @returns {Promise} Promise that resolves when animation completes
     */
    static animate(element, properties, duration = 300, easing = 'ease') {
        return new Promise(resolve => {
            const originalStyles = {};
            
            // Store original styles
            Object.keys(properties).forEach(prop => {
                originalStyles[prop] = element.style[prop] || '';
            });

            // Apply transition
            element.style.transition = `all ${duration}ms ${easing}`;

            // Apply new styles
            Object.keys(properties).forEach(prop => {
                element.style[prop] = properties[prop];
            });

            // Clean up after animation
            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }
}

// Add confetti animation keyframes to document
if (!document.querySelector('#confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Export Utils for use in other modules
window.Utils = Utils;
