/**
 * Particle Background System for Alien Language Translator
 * Creates animated cosmic background with stars, particles, and energy fields
 */

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.stars = [];
        this.energyFields = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.config = {
            particleCount: 100,
            starCount: 200,
            energyFieldCount: 3,
            colors: {
                primary: '#00ffff',
                secondary: '#8a2be2',
                accent: '#00ff41',
                background: '#0a0a0f'
            }
        };
        
        this.mouse = { x: 0, y: 0 };
        this.setupCanvas();
        this.initializeParticles();
        this.initializeStars();
        this.initializeEnergyFields();
        this.bindEvents();
        this.start();
    }
    
    /**
     * Setup canvas dimensions and properties
     */
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    /**
     * Resize canvas to window size
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    /**
     * Initialize floating particles
     */
    initializeParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    /**
     * Create a single particle
     */
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            color: this.getRandomColor(),
            life: Math.random() * 100,
            maxLife: Math.random() * 100 + 50,
            pulseSpeed: Math.random() * 0.02 + 0.01
        };
    }
    
    /**
     * Initialize background stars
     */
    initializeStars() {
        this.stars = [];
        for (let i = 0; i < this.config.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    /**
     * Initialize energy fields
     */
    initializeEnergyFields() {
        this.energyFields = [];
        for (let i = 0; i < this.config.energyFieldCount; i++) {
            this.energyFields.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 100 + 50,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                pulseSpeed: Math.random() * 0.01 + 0.005,
                pulseOffset: Math.random() * Math.PI * 2,
                color: this.getRandomColor(),
                opacity: 0.1
            });
        }
    }
    
    /**
     * Get random color from palette
     */
    getRandomColor() {
        const colors = Object.values(this.config.colors);
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * Bind mouse events for interactivity
     */
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
    }
    
    /**
     * Create click effect at mouse position
     */
    createClickEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                size: Math.random() * 4 + 2,
                opacity: 1,
                color: this.config.colors.primary,
                life: 0,
                maxLife: 30,
                isClickEffect: true
            };
            this.particles.push(particle);
        }
    }
    
    /**
     * Update particle positions and properties
     */
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update life
            particle.life++;
            
            // Apply mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.01;
                particle.vy -= (dy / distance) * force * 0.01;
            }
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Update opacity based on life
            if (particle.isClickEffect) {
                particle.opacity = 1 - (particle.life / particle.maxLife);
                if (particle.life >= particle.maxLife) {
                    this.particles.splice(i, 1);
                }
            } else {
                // Pulse effect
                particle.opacity = 0.3 + Math.sin(particle.life * particle.pulseSpeed) * 0.2;
            }
        }
    }
    
    /**
     * Update star twinkling effect
     */
    updateStars() {
        this.stars.forEach(star => {
            star.opacity = 0.3 + Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset) * 0.5;
        });
    }
    
    /**
     * Update energy fields
     */
    updateEnergyFields() {
        this.energyFields.forEach(field => {
            field.rotation += field.rotationSpeed;
            field.opacity = 0.05 + Math.sin(Date.now() * field.pulseSpeed + field.pulseOffset) * 0.05;
        });
    }
    
    /**
     * Draw stars
     */
    drawStars() {
        this.ctx.save();
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect for larger stars
            if (star.size > 1.5) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });
        this.ctx.restore();
    }
    
    /**
     * Draw energy fields
     */
    drawEnergyFields() {
        this.ctx.save();
        this.energyFields.forEach(field => {
            this.ctx.globalAlpha = field.opacity;
            this.ctx.strokeStyle = field.color;
            this.ctx.lineWidth = 2;
            
            this.ctx.save();
            this.ctx.translate(field.x, field.y);
            this.ctx.rotate(field.rotation);
            
            // Draw spiral pattern
            this.ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
                const radius = (angle / (Math.PI * 4)) * field.radius;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (angle === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
            
            this.ctx.restore();
        });
        this.ctx.restore();
    }
    
    /**
     * Draw particles
     */
    drawParticles() {
        this.ctx.save();
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            
            // Add glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = particle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw particle trail for click effects
            if (particle.isClickEffect) {
                this.ctx.shadowBlur = 20;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
    }
    
    /**
     * Draw connections between nearby particles
     */
    drawConnections() {
        this.ctx.save();
        this.ctx.strokeStyle = this.config.colors.primary;
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.3;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.restore();
    }
    
    /**
     * Main render loop
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.config.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update systems
        this.updateStars();
        this.updateEnergyFields();
        this.updateParticles();
        
        // Draw everything
        this.drawStars();
        this.drawEnergyFields();
        this.drawConnections();
        this.drawParticles();
        
        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.render());
        }
    }
    
    /**
     * Start animation
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.render();
        }
    }
    
    /**
     * Stop animation
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Add burst effect for special events
     */
    addBurstEffect(x, y, color = null) {
        const burstColor = color || this.config.colors.accent;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                opacity: 1,
                color: burstColor,
                life: 0,
                maxLife: 40,
                isClickEffect: true
            };
            this.particles.push(particle);
        }
    }
    
    /**
     * Modify color scheme
     */
    setColorScheme(colors) {
        this.config.colors = { ...this.config.colors, ...colors };
    }
    
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Reinitialize if particle count changed
        if (newConfig.particleCount && newConfig.particleCount !== this.particles.length) {
            this.initializeParticles();
        }
        
        if (newConfig.starCount && newConfig.starCount !== this.stars.length) {
            this.initializeStars();
        }
        
        if (newConfig.energyFieldCount && newConfig.energyFieldCount !== this.energyFields.length) {
            this.initializeEnergyFields();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleBackground;
}
