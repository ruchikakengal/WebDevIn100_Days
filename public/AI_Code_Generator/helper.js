// Utility functions and helpers
(() => {
    'use strict';

    // Toast notification system
    let toastContainer = null;
    let toastCounter = 0;

    // Initialize toast container
    function initToastContainer() {
        toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    }

    // Show toast notification
    window.showToast = function(message, type = 'info', duration = 5000) {
        if (!toastContainer) {
            initToastContainer();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = `toast-${++toastCounter}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-message">${escapeHtml(message)}</div>
            <button class="toast-close" onclick="closeToast('${toast.id}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-close toast
        setTimeout(() => {
            closeToast(toast.id);
        }, duration);
    };

    // Close toast
    window.closeToast = function(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    };

    // Escape HTML to prevent XSS
    window.escapeHtml = function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Unescape HTML
    window.unescapeHtml = function(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    // Format date
    window.formatDate = function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const now = new Date();
        const diffInMs = now - d;
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return d.toLocaleDateString();
        }
    };

    // Format file size
    window.formatFileSize = function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Debounce function
    window.debounce = function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    };

    // Throttle function
    window.throttle = function(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Generate random ID
    window.generateId = function(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdebfghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Validate email
    window.isValidEmail = function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate URL
    window.isValidUrl = function(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Get browser info
    window.getBrowserInfo = function() {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = 'Unknown';
        
        if (userAgent.includes('Chrome')) {
            browserName = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1];
        } else if (userAgent.includes('Firefox')) {
            browserName = 'Firefox';
            browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1];
        } else if (userAgent.includes('Safari')) {
            browserName = 'Safari';
            browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1];
        } else if (userAgent.includes('Edge')) {
            browserName = 'Edge';
            browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1];
        }
        
        return {
            name: browserName,
            version: browserVersion,
            userAgent: userAgent,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
        };
    };

    // Check if device is mobile
    window.isMobile = function() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Check if device is tablet
    window.isTablet = function() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    };

    // Get device type
    window.getDeviceType = function() {
        if (isMobile()) return 'mobile';
        if (isTablet()) return 'tablet';
        return 'desktop';
    };

    // Local storage helpers
    window.storage = {
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error getting from localStorage:', error);
                return defaultValue;
            }
        },
        
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error setting to localStorage:', error);
                return false;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Error clearing localStorage:', error);
                return false;
            }
        }
    };

    // URL helpers
    window.urlHelpers = {
        getParams: function() {
            const params = new URLSearchParams(window.location.search);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            return result;
        },
        
        getParam: function(key, defaultValue = null) {
            const params = new URLSearchParams(window.location.search);
            return params.get(key) || defaultValue;
        },
        
        setParam: function(key, value) {
            const url = new URL(window.location.href);
            url.searchParams.set(key, value);
            window.history.replaceState({}, '', url);
        },
        
        removeParam: function(key) {
            const url = new URL(window.location.href);
            url.searchParams.delete(key);
            window.history.replaceState({}, '', url);
        }
    };

    // Animation helpers
    window.animationHelpers = {
        fadeIn: function(element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },
        
        fadeOut: function(element, duration = 300) {
            const start = performance.now();
            const startOpacity = parseFloat(element.style.opacity) || 1;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = startOpacity * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            };
            
            requestAnimationFrame(animate);
        },
        
        slideDown: function(element, duration = 300) {
            element.style.height = '0px';
            element.style.overflow = 'hidden';
            element.style.display = 'block';
            
            const targetHeight = element.scrollHeight;
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = `${targetHeight * progress}px`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = 'auto';
                    element.style.overflow = 'visible';
                }
            };
            
            requestAnimationFrame(animate);
        },
        
        slideUp: function(element, duration = 300) {
            const startHeight = element.scrollHeight;
            const start = performance.now();
            
            element.style.height = `${startHeight}px`;
            element.style.overflow = 'hidden';
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = `${startHeight * (1 - progress)}px`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    element.style.height = 'auto';
                    element.style.overflow = 'visible';
                }
            };
            
            requestAnimationFrame(animate);
        }
    };

    // Performance monitoring
    window.performance = window.performance || {};
    window.performance.monitor = {
        startTime: null,
        
        start: function(label) {
            this.startTime = performance.now();
            console.time(label);
        },
        
        end: function(label) {
            const endTime = performance.now();
            console.timeEnd(label);
            
            if (this.startTime) {
                const duration = endTime - this.startTime;
                console.log(`${label} took ${duration.toFixed(2)}ms`);
                this.startTime = null;
                return duration;
            }
            return 0;
        },
        
        mark: function(label) {
            if (performance.mark) {
                performance.mark(label);
            }
        },
        
        measure: function(name, startMark, endMark) {
            if (performance.measure) {
                performance.measure(name, startMark, endMark);
            }
        }
    };

    // Error handling
    window.errorHandler = {
        log: function(error, context = '') {
            console.error(`Error${context ? ` in ${context}` : ''}:`, error);
            
            // You could send this to an error tracking service
            // analytics.track('error', { error: error.message, context });
        },
        
        handle: function(error, context = '', showToast = true) {
            this.log(error, context);
            
            if (showToast) {
                showToast(
                    `An error occurred${context ? ` in ${context}` : ''}: ${error.message}`,
                    'error'
                );
            }
        }
    };

    // Initialize helpers when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initToastContainer();
        
        // Add global error handler
        window.addEventListener('error', function(event) {
            errorHandler.handle(event.error, 'Global', false);
        });
        
        // Add unhandled promise rejection handler
        window.addEventListener('unhandledrejection', function(event) {
            errorHandler.handle(event.reason, 'Promise', false);
        });
    });

    // Export for modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            showToast,
            closeToast,
            escapeHtml,
            unescapeHtml,
            formatDate,
            formatFileSize,
            debounce,
            throttle,
            generateId,
            isValidEmail,
            isValidUrl,
            getBrowserInfo,
            isMobile,
            isTablet,
            getDeviceType,
            storage,
            urlHelpers,
            animationHelpers,
            errorHandler
        };
    }
})();
