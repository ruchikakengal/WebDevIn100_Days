class Particle {
    constructor(x, y, vx, vy, life, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.color = color;
        this.size = size;
        this.gravity = 0.1;
        this.friction = 0.98;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.life--;
        return this.life > 0;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createExplosion(x, y, intensity = 1) {
        const particleCount = Math.floor(20 * intensity);
        const colors = ['#ff4444', '#ff8800', '#ffaa00', '#ffff00', '#ff6600'];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = (Math.random() * 5 + 2) * intensity;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = Math.floor(30 + Math.random() * 30);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 4 + 2;
            
            this.particles.push(new Particle(x, y, vx, vy, life, color, size));
        }
    }

    createSmokeTrail(x, y, vx, vy) {
        const smokeColors = ['#666666', '#888888', '#aaaaaa'];
        const color = smokeColors[Math.floor(Math.random() * smokeColors.length)];
        const life = Math.floor(20 + Math.random() * 20);
        const size = Math.random() * 3 + 1;
        
        // Add some randomness to the velocity
        const randomVx = vx * 0.1 + (Math.random() - 0.5) * 2;
        const randomVy = vy * 0.1 + (Math.random() - 0.5) * 2;
        
        this.particles.push(new Particle(x, y, randomVx, randomVy, life, color, size));
    }

    createMuzzleFlash(x, y, angle) {
        const flashColors = ['#ffffff', '#ffff00', '#ffaa00'];
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const spreadAngle = angle + (Math.random() - 0.5) * Math.PI / 4;
            const speed = Math.random() * 8 + 4;
            const vx = Math.cos(spreadAngle) * speed;
            const vy = Math.sin(spreadAngle) * speed;
            const life = Math.floor(8 + Math.random() * 12);
            const color = flashColors[Math.floor(Math.random() * flashColors.length)];
            const size = Math.random() * 6 + 3;
            
            this.particles.push(new Particle(x, y, vx, vy, life, color, size));
        }
    }

    createPowerUpEffect(x, y, color) {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 3 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const life = Math.floor(40 + Math.random() * 20);
            const size = Math.random() * 4 + 2;
            
            this.particles.push(new Particle(x, y, vx, vy, life, color, size));
        }
    }

    createHitSparks(x, y, angle) {
        const sparkColors = ['#ffffff', '#ffff00', '#ff8800'];
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            const spreadAngle = angle + Math.PI + (Math.random() - 0.5) * Math.PI / 2;
            const speed = Math.random() * 6 + 3;
            const vx = Math.cos(spreadAngle) * speed;
            const vy = Math.sin(spreadAngle) * speed;
            const life = Math.floor(15 + Math.random() * 15);
            const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
            const size = Math.random() * 3 + 1;
            
            this.particles.push(new Particle(x, y, vx, vy, life, color, size));
        }
    }

    update() {
        this.particles = this.particles.filter(particle => particle.update());
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}

// Screen shake effect
class ScreenShake {
    constructor() {
        this.intensity = 0;
        this.duration = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    shake(intensity, duration) {
        this.intensity = Math.max(this.intensity, intensity);
        this.duration = Math.max(this.duration, duration);
    }

    update() {
        if (this.duration > 0) {
            this.offsetX = (Math.random() - 0.5) * this.intensity;
            this.offsetY = (Math.random() - 0.5) * this.intensity;
            this.duration--;
            this.intensity *= 0.95; // Gradually reduce intensity
        } else {
            this.offsetX = 0;
            this.offsetY = 0;
            this.intensity = 0;
        }
    }

    apply(ctx) {
        if (this.intensity > 0) {
            ctx.translate(this.offsetX, this.offsetY);
        }
    }

    reset(ctx) {
        if (this.intensity > 0) {
            ctx.translate(-this.offsetX, -this.offsetY);
        }
    }
}
