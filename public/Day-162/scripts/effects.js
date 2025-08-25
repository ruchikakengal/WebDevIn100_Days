/**
 * Effects Manager
 * Handles visual effects, animations, and cyberpunk aesthetics
 */

class EffectsManager {
    constructor() {
        this.glitchEnabled = true;
        this.matrixRain = null;
        this.scanLines = null;
        this.glitchInterval = null;
        this.particleSystem = null;
        this.theme = 'cyberpunk';
    }

    /**
     * Initialize effects manager
     */
    init() {
        this.createMatrixRain();
        this.createScanLines();
        this.startRandomGlitches();
        this.initParticleSystem();
        this.bindEffectEvents();
    }

    /**
     * Create Matrix-style digital rain effect
     */
    createMatrixRain() {
        // Remove existing matrix rain
        const existing = document.querySelector('.matrix-rain');
        if (existing) {
            existing.remove();
        }

        this.matrixRain = document.createElement('div');
        this.matrixRain.className = 'matrix-rain';
        document.body.appendChild(this.matrixRain);

        // Create columns of falling characters
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            setTimeout(() => {
                this.createMatrixColumn(i);
            }, i * 100);
        }
    }

    /**
     * Create a single matrix column
     */
    createMatrixColumn(index) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${index * 20}px`;
        column.style.animationDelay = `${Math.random() * 5}s`;
        column.style.animationDuration = `${5 + Math.random() * 10}s`;

        // Generate random characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        let content = '';
        
        for (let i = 0; i < 30; i++) {
            content += chars[Math.floor(Math.random() * chars.length)] + '\n';
        }
        
        column.textContent = content;
        this.matrixRain.appendChild(column);

        // Remove column after animation
        setTimeout(() => {
            if (column.parentNode) {
                column.parentNode.removeChild(column);
            }
        }, 15000);
    }

    /**
     * Start matrix rain effect
     */
    startMatrixRain() {
        this.matrixRain.style.display = 'block';
        
        // Continuously add new columns
        this.matrixInterval = setInterval(() => {
            const columns = Math.floor(window.innerWidth / 20);
            const randomColumn = Math.floor(Math.random() * columns);
            this.createMatrixColumn(randomColumn);
        }, 1000);
    }

    /**
     * Stop matrix rain effect
     */
    stopMatrixRain() {
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
        }
        this.matrixRain.style.display = 'none';
    }

    /**
     * Create scan lines effect for CRT monitor simulation
     */
    createScanLines() {
        const mainInterface = document.getElementById('mainInterface');
        if (!mainInterface) return;

        mainInterface.classList.add('scan-lines');
    }

    /**
     * Add screen glitch effect
     */
    addScreenGlitch() {
        const mainInterface = document.getElementById('mainInterface');
        if (!mainInterface || !this.glitchEnabled) return;

        mainInterface.classList.add('screen-glitch');
        
        setTimeout(() => {
            mainInterface.classList.remove('screen-glitch');
        }, 500);
    }

    /**
     * Start random glitch effects
     */
    startRandomGlitches() {
        if (!this.glitchEnabled) return;

        this.glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance
                this.addScreenGlitch();
            }
            
            if (Math.random() < 0.05) { // 5% chance
                this.addTextGlitch();
            }
        }, 2000);
    }

    /**
     * Add text glitch effect to random elements
     */
    addTextGlitch() {
        const textElements = document.querySelectorAll('.terminal-line:not(.glitch-text)');
        if (textElements.length === 0) return;

        const randomElement = textElements[Math.floor(Math.random() * textElements.length)];
        const originalText = randomElement.textContent;
        
        randomElement.classList.add('glitch-text');
        randomElement.setAttribute('data-text', originalText);
        
        setTimeout(() => {
            randomElement.classList.remove('glitch-text');
            randomElement.removeAttribute('data-text');
        }, 1000);
    }

    /**
     * Create particle system for background effects
     */
    initParticleSystem() {
        const mainInterface = document.getElementById('mainInterface');
        if (!mainInterface) return;

        // Create particles container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        mainInterface.appendChild(particlesContainer);
        this.particleSystem = particlesContainer;

        // Generate particles
        this.generateParticles();
    }

    /**
     * Generate floating particles
     */
    generateParticles() {
        if (!this.particleSystem) return;

        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
    }

    /**
     * Create a single particle
     */
    createParticle() {
        if (!this.particleSystem) return;

        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${5 + Math.random() * 10}s`;
        
        this.particleSystem.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 15000);
    }

    /**
     * Add neon glow effect to element
     */
    addNeonGlow(element, color = null) {
        if (!element) return;

        element.classList.add('neon-border');
        
        if (color) {
            element.style.setProperty('--glow-color', color);
        }
    }

    /**
     * Remove neon glow effect from element
     */
    removeNeonGlow(element) {
        if (!element) return;

        element.classList.remove('neon-border');
    }

    /**
     * Create typing effect for text
     */
    async createTypingEffect(element, text, speed = 50) {
        if (!element) return;

        element.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.delay(speed);
        }
    }

    /**
     * Create loading spinner
     */
    createLoadingSpinner(container) {
        if (!container) return null;

        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        container.appendChild(spinner);
        
        return spinner;
    }

    /**
     * Remove loading spinner
     */
    removeLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    /**
     * Create progress ring animation
     */
    createProgressRing(container, progress = 0) {
        if (!container) return null;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'progress-ring');
        svg.setAttribute('width', '60');
        svg.setAttribute('height', '60');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '30');
        circle.setAttribute('cy', '30');
        circle.setAttribute('r', '25');
        circle.setAttribute('class', 'progress');
        
        const circumference = 2 * Math.PI * 25;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
        
        svg.appendChild(circle);
        container.appendChild(svg);
        
        return { svg, circle, circumference };
    }

    /**
     * Update progress ring
     */
    updateProgressRing(progressRing, progress) {
        if (!progressRing || !progressRing.circle) return;

        const { circle, circumference } = progressRing;
        circle.style.strokeDashoffset = circumference - (progress / 100) * circumference;
    }

    /**
     * Show success flash effect
     */
    showSuccessFlash() {
        const mainInterface = document.getElementById('mainInterface');
        if (!mainInterface) return;

        mainInterface.classList.add('success-flash');
        
        setTimeout(() => {
            mainInterface.classList.remove('success-flash');
        }, 500);
    }

    /**
     * Show error shake effect
     */
    showErrorShake() {
        const mainInterface = document.getElementById('mainInterface');
        if (!mainInterface) return;

        mainInterface.classList.add('error-shake');
        
        setTimeout(() => {
            mainInterface.classList.remove('error-shake');
        }, 500);
    }

    /**
     * Show alert pulse effect
     */
    showAlertPulse() {
        const mainInterface = document.getElementById('mainInterface');
        if (!mainInterface) return;

        mainInterface.classList.add('alert-pulse');
        
        setTimeout(() => {
            mainInterface.classList.remove('alert-pulse');
        }, 1000);
    }

    /**
     * Create data stream effect
     */
    createDataStream(container) {
        if (!container) return;

        container.classList.add('data-stream');
    }

    /**
     * Create hologram effect
     */
    createHologramEffect(element) {
        if (!element) return;

        element.classList.add('hologram');
    }

    /**
     * Handle theme changes
     */
    updateTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update matrix rain colors based on theme
        if (theme === 'matrix') {
            this.updateMatrixColors('#00ff00');
        } else if (theme === 'retro') {
            this.updateMatrixColors('#ffaa00');
        } else {
            this.updateMatrixColors('#00ff00');
        }
    }

    /**
     * Update matrix rain colors
     */
    updateMatrixColors(color) {
        const matrixColumns = document.querySelectorAll('.matrix-column');
        matrixColumns.forEach(column => {
            column.style.color = color;
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recreate matrix rain with new dimensions
        if (this.matrixRain) {
            this.createMatrixRain();
        }
        
        // Regenerate particles
        if (this.particleSystem) {
            this.particleSystem.innerHTML = '';
            this.generateParticles();
        }
    }

    /**
     * Bind effect-related events
     */
    bindEffectEvents() {
        // Handle mouse movement for subtle effects
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        // Handle clicks for ripple effects
        document.addEventListener('click', (e) => {
            this.createRippleEffect(e);
        });
    }

    /**
     * Handle mouse movement for cursor effects
     */
    handleMouseMove(event) {
        if (!this.glitchEnabled) return;

        // Create subtle glitch on random mouse movements
        if (Math.random() < 0.01) { // 1% chance
            this.addScreenGlitch();
        }
    }

    /**
     * Create ripple effect on click
     */
    createRippleEffect(event) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 0, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            animation: ripple-effect 0.6s ease-out;
        `;

        const size = 100;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - size / 2) + 'px';
        ripple.style.top = (event.clientY - size / 2) + 'px';

        document.body.appendChild(ripple);

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-effect {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 600);
    }

    /**
     * Create boot effect animation
     */
    createBootEffect(element) {
        if (!element) return;

        element.classList.add('boot-effect');
        
        setTimeout(() => {
            element.classList.remove('boot-effect');
        }, 500);
    }

    /**
     * Cleanup effects (for performance)
     */
    cleanup() {
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
        }
        
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
        }
        
        // Remove all particles
        if (this.particleSystem) {
            this.particleSystem.innerHTML = '';
        }
        
        // Remove matrix rain
        if (this.matrixRain) {
            this.matrixRain.innerHTML = '';
        }
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
