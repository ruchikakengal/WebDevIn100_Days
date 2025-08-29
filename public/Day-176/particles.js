// Particle System for Background Animation
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 150;
        this.isRunning = false;
        this.animationId = null;
        
        this.mousePosition = { x: 0, y: 0 };
        this.mouseInfluence = 100;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.start();
        
        console.log("✨ Particle system initialized");
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Mouse interaction
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });
        
        // Touch interaction for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mousePosition.x = touch.clientX - rect.left;
            this.mousePosition.y = touch.clientY - rect.top;
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Adjust particle count based on screen size
        const screenArea = this.canvas.width * this.canvas.height;
        this.maxParticles = Math.min(200, Math.max(50, Math.floor(screenArea / 8000)));
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            color: this.getRandomColor(),
            type: this.getRandomType(),
            life: 1.0,
            maxLife: Math.random() * 200 + 100,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2
        };
        
        // Add special properties based on type
        switch (particle.type) {
            case 'star':
                particle.spikes = 5;
                particle.rotation = 0;
                particle.rotationSpeed = (Math.random() - 0.5) * 0.02;
                break;
                
            case 'circuit':
                particle.connections = [];
                particle.pulse = 0;
                particle.pulseSpeed = Math.random() * 0.05 + 0.02;
                break;
                
            case 'glow':
                particle.glowSize = particle.size * 3;
                particle.glowIntensity = Math.random() * 0.5 + 0.3;
                break;
        }
        
        return particle;
    }
    
    getRandomColor() {
        const colors = [
            '#00ffff', // Cyan
            '#ff00ff', // Magenta
            '#ffff00', // Yellow
            '#00ff00', // Green
            '#ff0040', // Red-pink
            '#40ff00', // Green-yellow
            '#0040ff', // Blue
            '#ff4000'  // Orange-red
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getRandomType() {
        const types = ['dot', 'star', 'circuit', 'glow'];
        const weights = [0.4, 0.3, 0.2, 0.1];
        
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                return types[i];
            }
        }
        
        return 'dot';
    }
    
    updateParticle(particle) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around screen edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Mouse interaction
        const dx = this.mousePosition.x - particle.x;
        const dy = this.mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouseInfluence) {
            const force = (this.mouseInfluence - distance) / this.mouseInfluence;
            const angle = Math.atan2(dy, dx);
            
            particle.vx += Math.cos(angle) * force * 0.01;
            particle.vy += Math.sin(angle) * force * 0.01;
            
            // Limit velocity
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 2) {
                particle.vx = (particle.vx / speed) * 2;
                particle.vy = (particle.vy / speed) * 2;
            }
        }
        
        // Apply drag
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Update type-specific properties
        switch (particle.type) {
            case 'star':
                particle.rotation += particle.rotationSpeed;
                break;
                
            case 'circuit':
                particle.pulse += particle.pulseSpeed;
                if (particle.pulse > Math.PI * 2) particle.pulse = 0;
                break;
        }
        
        // Update twinkle effect
        particle.twinklePhase += particle.twinkleSpeed;
        if (particle.twinklePhase > Math.PI * 2) particle.twinklePhase = 0;
        
        // Update life
        particle.life -= 1 / particle.maxLife;
        if (particle.life <= 0) {
            // Respawn particle
            particle.x = Math.random() * this.canvas.width;
            particle.y = Math.random() * this.canvas.height;
            particle.life = 1.0;
            particle.color = this.getRandomColor();
        }
    }
    
    drawParticle(particle) {
        const twinkle = 0.5 + 0.5 * Math.sin(particle.twinklePhase);
        const alpha = particle.opacity * particle.life * twinkle;
        
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        
        switch (particle.type) {
            case 'dot':
                this.drawDot(particle);
                break;
                
            case 'star':
                this.drawStar(particle);
                break;
                
            case 'circuit':
                this.drawCircuit(particle);
                break;
                
            case 'glow':
                this.drawGlow(particle);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawDot(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add a subtle glow
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = particle.size * 2;
        this.ctx.fill();
    }
    
    drawStar(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.strokeStyle = particle.color;
        this.ctx.lineWidth = 1;
        
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        this.ctx.beginPath();
        for (let i = 0; i < particle.spikes * 2; i++) {
            const angle = (i * Math.PI) / particle.spikes;
            const radius = i % 2 === 0 ? particle.size * 2 : particle.size;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawCircuit(particle) {
        const pulseSize = particle.size + Math.sin(particle.pulse) * particle.size * 0.5;
        
        // Draw circuit node
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(
            particle.x - pulseSize,
            particle.y - pulseSize,
            pulseSize * 2,
            pulseSize * 2
        );
        
        // Draw connecting lines to nearby particles
        this.particles.forEach(other => {
            if (other !== particle && other.type === 'circuit') {
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.globalAlpha = 0.3 * (1 - distance / 80);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
    }
    
    drawGlow(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.glowSize
        );
        
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.7, particle.color + '80'); // Add transparency
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.glowSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw center dot
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawConnections() {
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.strokeStyle = '#00ffff40';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.globalAlpha = 0.2 * (1 - distance / 100);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    update() {
        if (!this.isRunning) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Draw connections
        this.drawConnections();
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.update());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.update();
            console.log("✨ Particle animation started");
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            console.log("⏸️ Particle animation paused");
        }
    }
    
    resume() {
        if (!this.isRunning) {
            this.start();
            console.log("▶️ Particle animation resumed");
        }
    }
    
    stop() {
        this.pause();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log("⏹️ Particle animation stopped");
    }
    
    // Add particles at specific location (for special effects)
    addParticleAt(x, y, options = {}) {
        const particle = this.createParticle();
        particle.x = x;
        particle.y = y;
        
        // Apply custom options
        if (options.color) particle.color = options.color;
        if (options.size) particle.size = options.size;
        if (options.type) particle.type = options.type;
        if (options.velocity) {
            particle.vx = options.velocity.x || particle.vx;
            particle.vy = options.velocity.y || particle.vy;
        }
        
        this.particles.push(particle);
        
        // Remove excess particles
        if (this.particles.length > this.maxParticles + 20) {
            this.particles.splice(0, 10);
        }
    }
    
    // Create particle burst effect
    createBurst(x, y, count = 20, options = {}) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 3 + 2;
            
            this.addParticleAt(x, y, {
                ...options,
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                }
            });
        }
    }
    
    // Change particle colors based on theme
    updateTheme(primaryColor, secondaryColor, accentColor) {
        const themeColors = [primaryColor, secondaryColor, accentColor];
        
        this.particles.forEach(particle => {
            particle.color = themeColors[Math.floor(Math.random() * themeColors.length)];
        });
        
        console.log("🎨 Particle theme updated");
    }
    
    // Performance monitoring
    getPerformanceStats() {
        return {
            particleCount: this.particles.length,
            maxParticles: this.maxParticles,
            isRunning: this.isRunning,
            canvasSize: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        };
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
