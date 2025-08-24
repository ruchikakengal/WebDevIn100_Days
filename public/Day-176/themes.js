// Theme Manager for Dynamic Color Schemes
class ThemeManager {
    constructor() {
        this.currentTheme = 'neon';
        this.themes = {
            neon: {
                name: 'Neon Cyber',
                colors: {
                    '--primary-color': '#00ffff',
                    '--secondary-color': '#ff00ff',
                    '--bg-primary': '#0a0a0a',
                    '--bg-secondary': '#1a1a1a',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#cccccc',
                    '--accent-color': '#ffff00',
                    '--success-color': '#00ff00',
                    '--error-color': '#ff0040',
                    '--border-glow': '0 0 20px #00ffff',
                    '--text-glow': '0 0 10px #00ffff'
                }
            },
            matrix: {
                name: 'Matrix Green',
                colors: {
                    '--primary-color': '#00ff41',
                    '--secondary-color': '#00cc33',
                    '--bg-primary': '#000000',
                    '--bg-secondary': '#0d1b0d',
                    '--text-primary': '#00ff41',
                    '--text-secondary': '#00cc33',
                    '--accent-color': '#ffffff',
                    '--success-color': '#00ff00',
                    '--error-color': '#ff0040',
                    '--border-glow': '0 0 20px #00ff41',
                    '--text-glow': '0 0 10px #00ff41'
                }
            },
            purple: {
                name: 'Purple Mystery',
                colors: {
                    '--primary-color': '#8a2be2',
                    '--secondary-color': '#da70d6',
                    '--bg-primary': '#1a0a1a',
                    '--bg-secondary': '#2d1b2d',
                    '--text-primary': '#e6d6ff',
                    '--text-secondary': '#c9b3ff',
                    '--accent-color': '#ff69b4',
                    '--success-color': '#00ff7f',
                    '--error-color': '#ff1493',
                    '--border-glow': '0 0 20px #8a2be2',
                    '--text-glow': '0 0 10px #8a2be2'
                }
            },
            orange: {
                name: 'Amber Glow',
                colors: {
                    '--primary-color': '#ff8c00',
                    '--secondary-color': '#ffa500',
                    '--bg-primary': '#1a0f0a',
                    '--bg-secondary': '#2d1f1a',
                    '--text-primary': '#ffe4b5',
                    '--text-secondary': '#deb887',
                    '--accent-color': '#ffff00',
                    '--success-color': '#32cd32',
                    '--error-color': '#dc143c',
                    '--border-glow': '0 0 20px #ff8c00',
                    '--text-glow': '0 0 10px #ff8c00'
                }
            },
            dark: {
                name: 'Dark Mode',
                colors: {
                    '--primary-color': '#61dafb',
                    '--secondary-color': '#282c34',
                    '--bg-primary': '#121212',
                    '--bg-secondary': '#1e1e1e',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#b0b0b0',
                    '--accent-color': '#ffd700',
                    '--success-color': '#4caf50',
                    '--error-color': '#f44336',
                    '--border-glow': '0 0 20px #61dafb',
                    '--text-glow': '0 0 10px #61dafb'
                }
            },
            retro: {
                name: 'Retro Wave',
                colors: {
                    '--primary-color': '#ff0080',
                    '--secondary-color': '#00ffff',
                    '--bg-primary': '#0a0a1a',
                    '--bg-secondary': '#1a1a2e',
                    '--text-primary': '#eee6ff',
                    '--text-secondary': '#ccccff',
                    '--accent-color': '#ffff00',
                    '--success-color': '#00ff80',
                    '--error-color': '#ff4080',
                    '--border-glow': '0 0 20px #ff0080',
                    '--text-glow': '0 0 10px #ff0080'
                }
            }
        };
        
        this.transitionDuration = 500; // ms
        this.particleSystem = null;
        
        this.init();
    }
    
    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        
        // Apply current theme
        this.applyTheme(this.currentTheme, false);
        
        // Setup theme transition styles
        this.setupTransitionStyles();
        
        console.log(`🎨 Theme Manager initialized with theme: ${this.currentTheme}`);
    }
    
    setupTransitionStyles() {
        // Add CSS for smooth transitions
        const style = document.createElement('style');
        style.textContent = `
            :root {
                transition: all ${this.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .theme-transition * {
                transition: background-color ${this.transitionDuration}ms ease,
                           border-color ${this.transitionDuration}ms ease,
                           color ${this.transitionDuration}ms ease,
                           box-shadow ${this.transitionDuration}ms ease,
                           text-shadow ${this.transitionDuration}ms ease !important;
            }
            
            .theme-preview {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
                border: 2px solid #fff;
                background: linear-gradient(45deg, var(--preview-primary), var(--preview-secondary));
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);
    }
    
    setTheme(themeName, animate = true) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found`);
            return false;
        }
        
        if (themeName === this.currentTheme) {
            console.log(`Theme "${themeName}" is already active`);
            return true;
        }
        
        const previousTheme = this.currentTheme;
        this.currentTheme = themeName;
        
        // Save to localStorage
        localStorage.setItem('selectedTheme', themeName);
        
        // Apply theme
        this.applyTheme(themeName, animate);
        
        // Update particle system colors if available
        if (this.particleSystem && typeof this.particleSystem.updateTheme === 'function') {
            const colors = this.themes[themeName].colors;
            this.particleSystem.updateTheme(
                colors['--primary-color'],
                colors['--secondary-color'],
                colors['--accent-color']
            );
        }
        
        // Dispatch custom event for theme change
        const event = new CustomEvent('themeChanged', {
            detail: {
                previousTheme: previousTheme,
                currentTheme: themeName,
                colors: this.themes[themeName].colors
            }
        });
        document.dispatchEvent(event);
        
        console.log(`🎨 Theme changed to: ${themeName}`);
        return true;
    }
    
    applyTheme(themeName, animate = true) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        const root = document.documentElement;
        
        // Add transition class for smooth animation
        if (animate) {
            document.body.classList.add('theme-transition');
        }
        
        // Apply CSS custom properties
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Update theme-specific attributes
        document.body.setAttribute('data-theme', themeName);
        
        // Remove transition class after animation completes
        if (animate) {
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, this.transitionDuration);
        }
        
        // Update theme button previews
        this.updateThemeButtonPreviews();
    }
    
    updateThemeButtonPreviews() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            const themeName = button.getAttribute('data-theme');
            const theme = this.themes[themeName];
            
            if (theme) {
                // Add preview circle
                if (!button.querySelector('.theme-preview')) {
                    const preview = document.createElement('span');
                    preview.className = 'theme-preview';
                    button.insertBefore(preview, button.firstChild);
                }
                
                const preview = button.querySelector('.theme-preview');
                preview.style.setProperty('--preview-primary', theme.colors['--primary-color']);
                preview.style.setProperty('--preview-secondary', theme.colors['--secondary-color']);
                
                // Highlight current theme
                if (themeName === this.currentTheme) {
                    button.classList.add('active');
                    button.style.background = theme.colors['--primary-color'];
                    button.style.color = theme.colors['--bg-primary'];
                } else {
                    button.classList.remove('active');
                    button.style.background = '';
                    button.style.color = '';
                }
            }
        });
    }
    
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            displayName: this.themes[this.currentTheme].name,
            colors: this.themes[this.currentTheme].colors
        };
    }
    
    getAllThemes() {
        return Object.keys(this.themes).map(key => ({
            name: key,
            displayName: this.themes[key].name,
            colors: this.themes[key].colors
        }));
    }
    
    // Color utility functions
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    adjustBrightness(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;
        
        const adjust = (color) => {
            const adjusted = Math.round(color * (100 + percent) / 100);
            return Math.max(0, Math.min(255, adjusted));
        };
        
        return this.rgbToHex(
            adjust(rgb.r),
            adjust(rgb.g),
            adjust(rgb.b)
        );
    }
    
    // Theme generation utilities
    generateThemeVariations(baseTheme) {
        const variations = {};
        const theme = this.themes[baseTheme];
        
        if (!theme) return variations;
        
        // Generate lighter and darker variations
        variations.light = { ...theme };
        variations.dark = { ...theme };
        
        Object.entries(theme.colors).forEach(([property, value]) => {
            if (value.startsWith('#')) {
                variations.light.colors[property] = this.adjustBrightness(value, 20);
                variations.dark.colors[property] = this.adjustBrightness(value, -20);
            }
        });
        
        return variations;
    }
    
    // Custom theme creation
    createCustomTheme(name, primaryColor, secondaryColor, accentColor) {
        const customTheme = {
            name: name,
            colors: {
                '--primary-color': primaryColor,
                '--secondary-color': secondaryColor,
                '--bg-primary': this.adjustBrightness(primaryColor, -90),
                '--bg-secondary': this.adjustBrightness(primaryColor, -80),
                '--text-primary': '#ffffff',
                '--text-secondary': '#cccccc',
                '--accent-color': accentColor,
                '--success-color': '#00ff00',
                '--error-color': '#ff0040',
                '--border-glow': `0 0 20px ${primaryColor}`,
                '--text-glow': `0 0 10px ${primaryColor}`
            }
        };
        
        this.themes[name] = customTheme;
        return customTheme;
    }
    
    // Theme import/export
    exportTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return null;
        
        return JSON.stringify(theme, null, 2);
    }
    
    importTheme(themeData, name) {
        try {
            const theme = JSON.parse(themeData);
            this.themes[name] = theme;
            return true;
        } catch (error) {
            console.error('Failed to import theme:', error);
            return false;
        }
    }
    
    // Auto theme switching based on time
    enableAutoTheme(schedule = {}) {
        const defaultSchedule = {
            morning: 'orange',    // 6-12
            afternoon: 'neon',    // 12-18
            evening: 'purple',    // 18-22
            night: 'matrix'       // 22-6
        };
        
        const themeSchedule = { ...defaultSchedule, ...schedule };
        
        const updateThemeByTime = () => {
            const hour = new Date().getHours();
            let timeTheme;
            
            if (hour >= 6 && hour < 12) timeTheme = themeSchedule.morning;
            else if (hour >= 12 && hour < 18) timeTheme = themeSchedule.afternoon;
            else if (hour >= 18 && hour < 22) timeTheme = themeSchedule.evening;
            else timeTheme = themeSchedule.night;
            
            if (this.themes[timeTheme] && timeTheme !== this.currentTheme) {
                this.setTheme(timeTheme);
                console.log(`🕐 Auto theme switched to ${timeTheme} for ${hour}:00`);
            }
        };
        
        // Update immediately
        updateThemeByTime();
        
        // Update every hour
        this.autoThemeInterval = setInterval(updateThemeByTime, 60 * 60 * 1000);
        
        console.log('⏰ Auto theme switching enabled');
    }
    
    disableAutoTheme() {
        if (this.autoThemeInterval) {
            clearInterval(this.autoThemeInterval);
            this.autoThemeInterval = null;
            console.log('⏰ Auto theme switching disabled');
        }
    }
    
    // Accessibility features
    enableHighContrast() {
        const highContrastTheme = {
            name: 'High Contrast',
            colors: {
                '--primary-color': '#ffffff',
                '--secondary-color': '#ffffff',
                '--bg-primary': '#000000',
                '--bg-secondary': '#1a1a1a',
                '--text-primary': '#ffffff',
                '--text-secondary': '#ffffff',
                '--accent-color': '#ffff00',
                '--success-color': '#00ff00',
                '--error-color': '#ff0000',
                '--border-glow': '0 0 5px #ffffff',
                '--text-glow': '0 0 3px #ffffff'
            }
        };
        
        this.themes.highContrast = highContrastTheme;
        this.setTheme('highContrast');
        
        console.log('♿ High contrast mode enabled');
    }
    
    // Particle system integration
    setParticleSystem(particleSystem) {
        this.particleSystem = particleSystem;
        console.log('✨ Particle system connected to theme manager');
    }
    
    // Theme validation
    validateTheme(theme) {
        const requiredProperties = [
            '--primary-color',
            '--secondary-color',
            '--bg-primary',
            '--bg-secondary',
            '--text-primary',
            '--accent-color'
        ];
        
        return requiredProperties.every(prop => 
            theme.colors && theme.colors.hasOwnProperty(prop)
        );
    }
    
    // Debug utilities
    debugTheme(themeName = this.currentTheme) {
        const theme = this.themes[themeName];
        if (!theme) {
            console.error(`Theme "${themeName}" not found`);
            return;
        }
        
        console.group(`🎨 Theme Debug: ${themeName}`);
        console.log('Display Name:', theme.name);
        console.log('Colors:', theme.colors);
        console.log('Is Valid:', this.validateTheme(theme));
        console.log('Current Theme:', themeName === this.currentTheme);
        console.groupEnd();
    }
    
    // Performance monitoring
    getPerformanceStats() {
        return {
            currentTheme: this.currentTheme,
            totalThemes: Object.keys(this.themes).length,
            transitionDuration: this.transitionDuration,
            autoThemeEnabled: !!this.autoThemeInterval,
            particleSystemConnected: !!this.particleSystem
        };
    }
}

// Theme event handlers
document.addEventListener('DOMContentLoaded', () => {
    // Listen for system color scheme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            console.log(`🌓 System theme changed to: ${e.matches ? 'dark' : 'light'}`);
            // Could auto-switch theme based on system preference
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // Initial check
        handleSystemThemeChange(mediaQuery);
    }
    
    // Listen for reduced motion preference
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                console.log('⚡ Reduced motion preferred - disabling theme transitions');
                document.documentElement.style.setProperty('--transition-duration', '0ms');
            } else {
                document.documentElement.style.setProperty('--transition-duration', '500ms');
            }
        };
        
        mediaQuery.addEventListener('change', handleMotionPreference);
        handleMotionPreference(mediaQuery);
    }
});

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
