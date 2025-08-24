// Utility functions for the tattoo design application

class Utils {
    // Generate unique ID
    static generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
    
    // Debounce function
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
    
    // Throttle function
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
    
    // Load image and return promise
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }
    
    // Get mouse/touch position relative to element
    static getEventPos(event, element) {
        const rect = element.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    // Distance between two points
    static distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    
    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Convert degrees to radians
    static degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    // Convert radians to degrees
    static radToDeg(radians) {
        return radians * 180 / Math.PI;
    }
    
    // Rotate point around center
    static rotatePoint(point, center, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        
        return {
            x: center.x + (dx * cos - dy * sin),
            y: center.y + (dx * sin + dy * cos)
        };
    }
    
    // Check if point is inside rectangle
    static pointInRect(point, rect) {
        return point.x >= rect.x && 
               point.x <= rect.x + rect.width && 
               point.y >= rect.y && 
               point.y <= rect.y + rect.height;
    }
    
    // Show notification
    static showNotification(message, type = 'success', duration = 3000) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    // Download file
    static downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Copy to clipboard
    static copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve(success);
        }
    }
    
    // Get file extension
    static getFileExtension(filename) {
        return filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    }
    
    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Deep clone object
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
    }
    
    // Check if device supports touch
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Get device pixel ratio
    static getPixelRatio() {
        return window.devicePixelRatio || 1;
    }
    
    // Resize canvas for high DPI
    static setupHighDPICanvas(canvas, ctx, width, height) {
        const pixelRatio = this.getPixelRatio();
        
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        ctx.scale(pixelRatio, pixelRatio);
    }
    
    // Color manipulation utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }
    
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    
    // Validate email
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Sanitize string for HTML
    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Get browser info
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        
        if (ua.indexOf("Chrome") > -1) browser = "Chrome";
        else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
        else if (ua.indexOf("Safari") > -1) browser = "Safari";
        else if (ua.indexOf("Edge") > -1) browser = "Edge";
        
        return {
            browser,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isTablet: /iPad|Android|Tablet/i.test(ua),
            touchSupport: this.isTouchDevice()
        };
    }
    
    // Performance measurement
    static performanceTimer(label) {
        const start = performance.now();
        return {
            end: () => {
                const duration = performance.now() - start;
                console.log(`${label}: ${duration.toFixed(2)}ms`);
                return duration;
            }
        };
    }
    
    // Local storage with error handling
    static localStorage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
                return false;
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Failed to read from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Failed to remove from localStorage:', e);
                return false;
            }
        },
        
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Failed to clear localStorage:', e);
                return false;
            }
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else {
    window.Utils = Utils;
}
