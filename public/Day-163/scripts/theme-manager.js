
class ThemeManager {
    constructor() {
        this.currentTheme = 'fantasy';
        this.themes = window.THEMES || {};
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme ${themeName} not found, using fantasy`);
            themeName = 'fantasy';
        }

        // Remove existing theme classes
        document.body.classList.remove(...Object.keys(this.themes).map(t => `theme-${t}`));
        
        // Add new theme class
        document.body.classList.add(`theme-${themeName}`);
        
        // Update CSS variables
        this.updateCSSVariables(themeName);
        
        // Update current theme
        this.currentTheme = themeName;
        
        // Save preference
        localStorage.setItem('story-theme', themeName);
        
        console.log(`Applied theme: ${themeName}`);
    }

    updateCSSVariables(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        
        // Update CSS variables based on theme
        switch (themeName) {
            case 'fantasy':
                root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
                root.style.setProperty('--bg-secondary', 'rgba(26, 26, 46, 0.95)');
                root.style.setProperty('--bg-tertiary', 'rgba(22, 33, 62, 0.9)');
                root.style.setProperty('--text-primary', '#e8e3d3');
                root.style.setProperty('--text-secondary', '#c7b377');
                root.style.setProperty('--accent-primary', '#d4af37');
                root.style.setProperty('--accent-secondary', '#b8860b');
                root.style.setProperty('--accent-glow', 'rgba(212, 175, 55, 0.3)');
                break;
                
            case 'sci-fi':
                root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)');
                root.style.setProperty('--bg-secondary', 'rgba(0, 255, 255, 0.1)');
                root.style.setProperty('--bg-tertiary', 'rgba(0, 255, 255, 0.05)');
                root.style.setProperty('--text-primary', '#00ffff');
                root.style.setProperty('--text-secondary', '#80ffff');
                root.style.setProperty('--accent-primary', '#00ffff');
                root.style.setProperty('--accent-secondary', '#0080ff');
                root.style.setProperty('--accent-glow', 'rgba(0, 255, 255, 0.3)');
                break;
                
            case 'mystery':
                root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #2c1810 0%, #4a2c2a 50%, #3d2914 100%)');
                root.style.setProperty('--bg-secondary', 'rgba(44, 24, 16, 0.95)');
                root.style.setProperty('--bg-tertiary', 'rgba(74, 44, 42, 0.9)');
                root.style.setProperty('--text-primary', '#f4f1e8');
                root.style.setProperty('--text-secondary', '#d4c4a8');
                root.style.setProperty('--accent-primary', '#cd853f');
                root.style.setProperty('--accent-secondary', '#a0522d');
                root.style.setProperty('--accent-glow', 'rgba(205, 133, 63, 0.3)');
                break;
                
            case 'horror':
                root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 50%, #2a1010 100%)');
                root.style.setProperty('--bg-secondary', 'rgba(15, 15, 15, 0.95)');
                root.style.setProperty('--bg-tertiary', 'rgba(26, 10, 10, 0.9)');
                root.style.setProperty('--text-primary', '#f8f8f8');
                root.style.setProperty('--text-secondary', '#cccccc');
                root.style.setProperty('--accent-primary', '#dc143c');
                root.style.setProperty('--accent-secondary', '#8b0000');
                root.style.setProperty('--accent-glow', 'rgba(220, 20, 60, 0.3)');
                break;
        }
        
        // Trigger theme animation
        this.triggerThemeAnimation(themeName);
    }

    triggerThemeAnimation(themeName) {
        // Add transition class
        document.body.classList.add('theme-transition');
        
        // Remove after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
        
        // Create theme-specific effects
        this.createThemeEffects(themeName);
    }

    createThemeEffects(themeName) {
        switch (themeName) {
            case 'fantasy':
                this.createSparkleEffect();
                break;
            case 'sci-fi':
                this.createTechEffect();
                break;
            case 'mystery':
                this.createFogEffect();
                break;
            case 'horror':
                this.createFlickerEffect();
                break;
        }
    }

    createSparkleEffect() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: #d4af37;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    animation: sparkle 2s ease-out forwards;
                `;
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 2000);
            }, i * 100);
        }
    }

    createTechEffect() {
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ffff, transparent);
            pointer-events: none;
            z-index: 9999;
            animation: techScan 1s ease-out forwards;
        `;
        
        document.body.appendChild(scanLine);
        setTimeout(() => scanLine.remove(), 1000);
    }

    createFogEffect() {
        const fog = document.createElement('div');
        fog.style.cssText = `
            position: fixed;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(205, 133, 63, 0.2), transparent);
            pointer-events: none;
            z-index: 9999;
            animation: fogSweep 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(fog);
        setTimeout(() => fog.remove(), 1500);
    }

    createFlickerEffect() {
        const flicker = document.createElement('div');
        flicker.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(220, 20, 60, 0.1);
            pointer-events: none;
            z-index: 9999;
            animation: horrorFlicker 1s ease-out forwards;
        `;
        
        document.body.appendChild(flicker);
        setTimeout(() => flicker.remove(), 1000);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeData(themeName) {
        return this.themes[themeName];
    }

    getAllThemes() {
        return this.themes;
    }
}

// Add CSS animations
if (!document.querySelector('#theme-animations')) {
    const style = document.createElement('style');
    style.id = 'theme-animations';
    style.textContent = `
        .theme-transition {
            transition: all 0.5s ease !important;
        }
        
        @keyframes sparkle {
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0; transform: scale(0) translateY(-50px); }
        }
        
        @keyframes techScan {
            0% { transform: translateY(0); }
            100% { transform: translateY(100vh); }
        }
        
        @keyframes fogSweep {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        @keyframes horrorFlicker {
            0%, 100% { opacity: 0; }
            10%, 20%, 30%, 40%, 60%, 70% { opacity: 0.1; }
            50% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);
}

window.ThemeManager = ThemeManager;
