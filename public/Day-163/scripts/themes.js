// Theme Manager - Handles visual theme switching and management
class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.themes = {
            fantasy: {
                name: 'Fantasy',
                primaryColor: '#8b5cf6',
                secondaryColor: '#a78bfa',
                accentColor: '#fbbf24',
                backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: '#1f2937',
                mood: 'mystical'
            },
            'sci-fi': {
                name: 'Science Fiction',
                primaryColor: '#06b6d4',
                secondaryColor: '#67e8f9',
                accentColor: '#34d399',
                backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                textColor: '#e2e8f0',
                mood: 'futuristic'
            },
            mystery: {
                name: 'Mystery',
                primaryColor: '#7c3aed',
                secondaryColor: '#a855f7',
                accentColor: '#f59e0b',
                backgroundColor: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                textColor: '#f3f4f6',
                mood: 'suspenseful'
            },
            horror: {
                name: 'Horror',
                primaryColor: '#dc2626',
                secondaryColor: '#ef4444',
                accentColor: '#f97316',
                backgroundColor: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                textColor: '#f5f5f5',
                mood: 'dark'
            }
        };
        
        this.transitionDuration = 500; // ms
        this.isTransitioning = false;
    }

    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme '${themeName}' not found`);
            return false;
        }

        if (this.currentTheme === themeName) {
            return true; // Already set
        }

        if (this.isTransitioning) {
            return false; // Prevent rapid theme changes
        }

        this.isTransitioning = true;
        
        // Remove previous theme classes
        this.removePreviousTheme();
        
        // Apply new theme
        this.applyTheme(themeName);
        
        // Update current theme
        this.currentTheme = themeName;
        
        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, this.transitionDuration);
        
        return true;
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        const body = document.body;
        
        // Add theme class
        body.classList.add(`theme-${themeName}`);
        
        // Apply CSS custom properties
        this.setCSSVariables(theme);
        
        // Update favicon if needed
        this.updateFavicon(themeName);
        
        // Apply theme-specific animations
        this.applyThemeAnimations(themeName);
        
        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor(theme.primaryColor);
        
        console.log(`Applied theme: ${theme.name}`);
    }

    removePreviousTheme() {
        const body = document.body;
        
        // Remove all theme classes
        Object.keys(this.themes).forEach(themeName => {
            body.classList.remove(`theme-${themeName}`);
        });
    }

    setCSSVariables(theme) {
        const root = document.documentElement;
        
        // Set theme-specific CSS variables
        root.style.setProperty('--theme-primary', theme.primaryColor);
        root.style.setProperty('--theme-secondary', theme.secondaryColor);
        root.style.setProperty('--theme-accent', theme.accentColor);
        root.style.setProperty('--theme-bg', theme.backgroundColor);
        root.style.setProperty('--theme-text', theme.textColor);
        
        // Update primary color for existing elements
        root.style.setProperty('--primary-color', theme.primaryColor);
    }

    previewTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        // Apply theme temporarily for preview
        const originalTheme = this.currentTheme;
        this.setTheme(themeName);
        
        // Revert after a short time if not confirmed
        // This would be used in a preview context
        return {
            confirm: () => {
                // Theme is already applied
            },
            cancel: () => {
                if (originalTheme) {
                    this.setTheme(originalTheme);
                } else {
                    this.removePreviousTheme();
                }
            }
        };
    }

    applyThemeAnimations(themeName) {
        const body = document.body;
        
        // Remove existing animation classes
        body.classList.remove('theme-transition');
        
        // Force reflow
        body.offsetHeight;
        
        // Add transition class
        body.classList.add('theme-transition');
        
        // Apply theme-specific particle effects or animations
        this.triggerThemeSpecificEffects(themeName);
        
        // Remove transition class after animation
        setTimeout(() => {
            body.classList.remove('theme-transition');
        }, this.transitionDuration);
    }

    triggerThemeSpecificEffects(themeName) {
        switch (themeName) {
            case 'fantasy':
                this.createSparkleEffect();
                break;
            case 'sci-fi':
                this.createTechGlowEffect();
                break;
            case 'mystery':
                this.createShadowEffect();
                break;
            case 'horror':
                this.createFlickerEffect();
                break;
        }
    }

    createSparkleEffect() {
        // Create temporary sparkle particles for fantasy theme
        const sparkleCount = 15;
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'theme-sparkle';
                sparkle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: #fbbf24;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    animation: sparkleFloat 2s ease-out forwards;
                `;
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 2000);
            }, i * 100);
        }
    }

    createTechGlowEffect() {
        // Create tech scan line effect
        const scanLine = document.createElement('div');
        scanLine.className = 'tech-scan-line';
        scanLine.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #06b6d4 50%, transparent 100%);
            pointer-events: none;
            z-index: 9999;
            animation: techScan 1s ease-out forwards;
        `;
        
        document.body.appendChild(scanLine);
        
        setTimeout(() => {
            scanLine.remove();
        }, 1000);
    }

    createShadowEffect() {
        // Create mystery shadow sweep
        const shadow = document.createElement('div');
        shadow.className = 'mystery-shadow';
        shadow.style.cssText = `
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(124, 58, 237, 0.3) 50%, transparent 100%);
            pointer-events: none;
            z-index: 9999;
            animation: shadowSweep 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(shadow);
        
        setTimeout(() => {
            shadow.remove();
        }, 1500);
    }

    createFlickerEffect() {
        // Create horror flicker effect
        const overlay = document.createElement('div');
        overlay.className = 'horror-flicker';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(220, 38, 38, 0.1);
            pointer-events: none;
            z-index: 9999;
            animation: horrorFlicker 1s ease-out forwards;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.remove();
        }, 1000);
    }

    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = color;
    }

    updateFavicon(themeName) {
        // This would update favicon based on theme
        // For now, we'll just log it
        console.log(`Favicon updated for theme: ${themeName}`);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            key,
            name: this.themes[key].name,
            primaryColor: this.themes[key].primaryColor
        }));
    }

    getThemeData(themeName) {
        return this.themes[themeName] || null;
    }

    // Custom theme creation
    createCustomTheme(name, themeData) {
        if (this.themes[name]) {
            console.warn(`Theme '${name}' already exists`);
            return false;
        }
        
        const defaultTheme = {
            name: name,
            primaryColor: '#6366f1',
            secondaryColor: '#a5b4fc',
            accentColor: '#f59e0b',
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textColor: '#1f2937',
            mood: 'neutral'
        };
        
        this.themes[name] = { ...defaultTheme, ...themeData };
        return true;
    }

    removeCustomTheme(name) {
        // Prevent removal of built-in themes
        const builtInThemes = ['fantasy', 'sci-fi', 'mystery', 'horror'];
        if (builtInThemes.includes(name)) {
            console.warn(`Cannot remove built-in theme: ${name}`);
            return false;
        }
        
        if (!this.themes[name]) {
            console.warn(`Theme '${name}' not found`);
            return false;
        }
        
        // Switch to default theme if removing current theme
        if (this.currentTheme === name) {
            this.setTheme('fantasy');
        }
        
        delete this.themes[name];
        return true;
    }

    // Theme persistence
    saveThemePreference(themeName) {
        try {
            localStorage.setItem('story_generator_theme_preference', themeName);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    loadThemePreference() {
        try {
            const saved = localStorage.getItem('story_generator_theme_preference');
            if (saved && this.themes[saved]) {
                return saved;
            }
        } catch (error) {
            console.warn('Could not load theme preference:', error);
        }
        
        return 'fantasy'; // Default theme
    }

    // Auto theme detection
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'horror'; // Dark theme preference
        }
        return 'fantasy'; // Light theme preference
    }

    setupThemeMediaQuery() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                if (this.autoThemeEnabled) {
                    const newTheme = e.matches ? 'horror' : 'fantasy';
                    this.setTheme(newTheme);
                }
            });
        }
    }

    enableAutoTheme(enabled = true) {
        this.autoThemeEnabled = enabled;
        
        if (enabled) {
            const systemTheme = this.detectSystemTheme();
            this.setTheme(systemTheme);
            this.setupThemeMediaQuery();
        }
    }

    // Accessibility
    getContrastRatio(color1, color2) {
        // Simple contrast ratio calculation
        // In a real implementation, this would be more sophisticated
        const brightness1 = this.getBrightness(color1);
        const brightness2 = this.getBrightness(color2);
        
        const lighter = Math.max(brightness1, brightness2);
        const darker = Math.min(brightness1, brightness2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    getBrightness(hexColor) {
        // Convert hex to RGB and calculate brightness
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    validateThemeAccessibility(themeData) {
        const contrastRatio = this.getContrastRatio(themeData.primaryColor, themeData.textColor);
        const isAccessible = contrastRatio >= 4.5; // WCAG AA standard
        
        return {
            isAccessible,
            contrastRatio,
            recommendation: isAccessible ? 'Good contrast' : 'Consider adjusting colors for better accessibility'
        };
    }

    // Dynamic theme generation
    generateThemeFromImage(imageUrl) {
        // This would analyze an image and create a theme
        // For now, return a promise that resolves with a sample theme
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    name: 'Generated',
                    primaryColor: '#' + Math.floor(Math.random()*16777215).toString(16),
                    secondaryColor: '#' + Math.floor(Math.random()*16777215).toString(16),
                    accentColor: '#' + Math.floor(Math.random()*16777215).toString(16),
                    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textColor: '#1f2937',
                    mood: 'generated'
                });
            }, 1000);
        });
    }

    // Cleanup
    cleanup() {
        this.removePreviousTheme();
        this.currentTheme = null;
        
        // Remove any temporary theme elements
        document.querySelectorAll('.theme-sparkle, .tech-scan-line, .mystery-shadow, .horror-flicker').forEach(el => {
            el.remove();
        });
    }
}

// Add CSS animations for theme effects
const themeAnimationsCSS = `
@keyframes sparkleFloat {
    0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
    }
    50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
    }
    100% {
        opacity: 0;
        transform: scale(0) rotate(360deg);
    }
}

@keyframes techScan {
    0% {
        top: 0;
        opacity: 1;
    }
    100% {
        top: 100%;
        opacity: 0;
    }
}

@keyframes shadowSweep {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}

@keyframes horrorFlicker {
    0%, 90%, 100% {
        opacity: 0;
    }
    10%, 30%, 50%, 70% {
        opacity: 1;
    }
    20%, 40%, 60%, 80% {
        opacity: 0.5;
    }
}

.theme-transition {
    transition: all 0.5s ease-in-out;
}

.theme-transition * {
    transition: color 0.5s ease-in-out, background-color 0.5s ease-in-out, border-color 0.5s ease-in-out;
}
`;

// Inject theme animations CSS
if (!document.getElementById('theme-animations')) {
    const style = document.createElement('style');
    style.id = 'theme-animations';
    style.textContent = themeAnimationsCSS;
    document.head.appendChild(style);
}
