/**
 * Utility functions for the Story Generator application
 */

// DOM utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Create element with attributes and children
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Random utility functions
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// String utility functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str) {
    return str.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function truncate(str, length, suffix = '...') {
    if (str.length <= length) return str;
    return str.slice(0, length) + suffix;
}

// Template string processor
function processTemplate(template, variables) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return variables[key] || match;
    });
}

// Weighted random selection
function weightedChoice(options) {
    const weights = options.map(opt => opt.weight || 1);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < options.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return options[i];
        }
    }
    
    return options[options.length - 1];
}

// Animation utilities
function animateText(element, text, speed = 50) {
    return new Promise((resolve) => {
        element.textContent = '';
        element.classList.add('typing');
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text[i];
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                element.classList.remove('typing');
                resolve();
            }
        }, speed);
    });
}

function fadeIn(element, duration = 300) {
    return new Promise((resolve) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }
        
        requestAnimationFrame(animate);
    });
}

function fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
        const startTime = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                resolve();
            }
        }
        
        requestAnimationFrame(animate);
    });
}

// Event handling utilities
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Toast notification system
function showToast(message, type = 'info', duration = 4000) {
    const toastContainer = $('#toastContainer');
    
    const toast = createElement('div', {
        className: `toast ${type}`,
        innerHTML: `
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        `
    });
    
    toastContainer.appendChild(toast);
    
    // Trigger show animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Loading overlay
function showLoading(message = 'Loading...') {
    const overlay = $('#loadingOverlay');
    overlay.querySelector('p').textContent = message;
    overlay.classList.add('active');
}

function hideLoading() {
    const overlay = $('#loadingOverlay');
    overlay.classList.remove('active');
}

// URL and sharing utilities
function generateShareableUrl(storyPath) {
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedPath = btoa(JSON.stringify(storyPath));
    return `${baseUrl}?story=${encodedPath}`;
}

function parseSharedUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyParam = urlParams.get('story');
    
    if (storyParam) {
        try {
            return JSON.parse(atob(storyParam));
        } catch (error) {
            console.error('Invalid shared story URL:', error);
        }
    }
    
    return null;
}

// Content filtering for user contributions
function filterContent(text) {
    const inappropriateWords = [
        // Basic content filter - would be more comprehensive in production
        'spam', 'test', 'placeholder', 'lorem ipsum'
    ];
    
    const lowerText = text.toLowerCase();
    const hasInappropriate = inappropriateWords.some(word => 
        lowerText.includes(word)
    );
    
    if (hasInappropriate) {
        return false;
    }
    
    // Check for minimum content quality
    if (text.trim().length < 10) {
        return false;
    }
    
    // Check for repetitive characters
    if (/(.)\1{10,}/.test(text)) {
        return false;
    }
    
    return true;
}

// Date and time utilities
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Performance utilities
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

// Accessibility utilities
function announceToScreenReader(message) {
    const announcement = createElement('div', {
        'aria-live': 'polite',
        'aria-atomic': 'true',
        className: 'sr-only'
    });
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    setTimeout(() => announcement.remove(), 1000);
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    firstElement.focus();
}

// Error handling
function handleError(error, userMessage = 'Something went wrong') {
    console.error('Application error:', error);
    showToast(userMessage, 'error');
    
    // In production, you might want to send error reports to a logging service
    // reportError(error);
}

// Browser feature detection
function hasFeature(feature) {
    const features = {
        speechSynthesis: 'speechSynthesis' in window,
        localStorage: (() => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        })(),
        fileApi: 'File' in window && 'FileReader' in window,
        canvas: (() => {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        })()
    };
    
    return features[feature] || false;
}

// Export utilities for use in other modules
window.StoryUtils = {
    $, $$, createElement,
    randomChoice, randomInt, shuffle, weightedChoice,
    capitalize, slugify, truncate, processTemplate,
    animateText, fadeIn, fadeOut,
    debounce, throttle,
    showToast, hideLoading, showLoading,
    generateShareableUrl, parseSharedUrl,
    filterContent, formatDate, getTimeAgo,
    measurePerformance, announceToScreenReader, trapFocus,
    handleError, hasFeature
};
