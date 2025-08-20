class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.start();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle(x, y, options = {}) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * (options.velocityRange || 4),
            vy: (Math.random() - 0.5) * (options.velocityRange || 4),
            life: 1.0,
            decay: options.decay || 0.02,
            size: Math.random() * (options.maxSize || 8) + (options.minSize || 2),
            color: options.color || `hsl(${Math.random() * 360}, 70%, 60%)`,
            type: options.type || 'circle',
            gravity: options.gravity || 0,
            bounce: options.bounce || 0.8,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        };
        
        this.particles.push(particle);
    }
    
    createBurst(x, y, count = 20, options = {}) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, {
                ...options,
                velocityRange: options.velocityRange || 8,
                decay: options.decay || 0.015,
                color: options.colors ? 
                    options.colors[Math.floor(Math.random() * options.colors.length)] : 
                    `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
    }
    
    createCorrectAnswerEffect(x, y, playerColor) {
        this.createBurst(x, y, 30, {
            colors: [playerColor, '#2ecc71', '#f1c40f', '#e74c3c'],
            velocityRange: 12,
            maxSize: 12,
            minSize: 4,
            decay: 0.01,
            type: 'star'
        });
        
        this.createBurst(x, y, 15, {
            colors: ['#ffffff', '#f8f9fa'],
            velocityRange: 6,
            maxSize: 6,
            minSize: 2,
            decay: 0.02,
            type: 'circle'
        });
    }
    
    createStreakEffect(x, y, streakCount) {
        const colors = ['#f1c40f', '#e67e22', '#e74c3c'];
        const particleCount = Math.min(streakCount * 5, 50);
        
        this.createBurst(x, y, particleCount, {
            colors: colors,
            velocityRange: 15,
            maxSize: 15,
            minSize: 6,
            decay: 0.008,
            type: 'fire',
            gravity: -0.1
        });
    }
    
    createPowerupEffect(x, y, powerupType) {
        let colors, count, options;
        
        switch (powerupType) {
            case 'double':
                colors = ['#f1c40f', '#f39c12', '#e67e22'];
                count = 25;
                options = { type: 'diamond', velocityRange: 8 };
                break;
            case 'time':
                colors = ['#3498db', '#5dade2', '#85c1e9'];
                count = 20;
                options = { type: 'clock', velocityRange: 6, gravity: -0.05 };
                break;
            case 'freeze':
                colors = ['#aed6f1', '#d6eaf8', '#ffffff'];
                count = 30;
                options = { type: 'snowflake', velocityRange: 4, decay: 0.01 };
                break;
            default:
                colors = ['#9b59b6', '#bb8fce', '#d2b4de'];
                count = 20;
                options = { type: 'circle', velocityRange: 6 };
        }
        
        this.createBurst(x, y, count, {
            colors: colors,
            maxSize: 10,
            minSize: 4,
            decay: 0.012,
            ...options
        });
    }
    
    createWinnerFireworks(centerX, centerY) {
        const positions = [
            { x: centerX - 200, y: centerY - 100 },
            { x: centerX + 200, y: centerY - 100 },
            { x: centerX, y: centerY - 150 },
            { x: centerX - 100, y: centerY + 50 },
            { x: centerX + 100, y: centerY + 50 }
        ];
        
        positions.forEach((pos, index) => {
            setTimeout(() => {
                this.createBurst(pos.x, pos.y, 50, {
                    colors: ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'],
                    velocityRange: 20,
                    maxSize: 20,
                    minSize: 8,
                    decay: 0.005,
                    type: 'firework',
                    gravity: 0.1
                });
            }, index * 200);
        });
    }
    
    update() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;

            if (particle.y + particle.size > this.canvas.height && particle.bounce > 0) {
                particle.y = this.canvas.height - particle.size;
                particle.vy *= -particle.bounce;
                particle.vx *= 0.9; 
            }
            
            particle.rotation += particle.rotationSpeed;
            
            particle.life -= particle.decay;
            
            return particle.life > 0;
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            this.ctx.globalAlpha = particle.life;
            
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            this.ctx.fillStyle = particle.color;
            this.ctx.strokeStyle = particle.color;
            
            switch (particle.type) {
                case 'circle':
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                    
                case 'star':
                    this.drawStar(particle.size);
                    break;
                    
                case 'diamond':
                    this.drawDiamond(particle.size);
                    break;
                    
                case 'fire':
                    this.drawFlame(particle.size);
                    break;
                    
                case 'clock':
                    this.drawClock(particle.size);
                    break;
                    
                case 'snowflake':
                    this.drawSnowflake(particle.size);
                    break;
                    
                case 'firework':
                    this.drawFirework(particle.size);
                    break;
                    
                default:
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    drawStar(size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        
        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
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
    }
    
    drawDiamond(size) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(size * 0.7, 0);
        this.ctx.lineTo(0, size);
        this.ctx.lineTo(-size * 0.7, 0);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawFlame(size) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, size);
        this.ctx.bezierCurveTo(-size * 0.5, size * 0.5, -size * 0.5, -size * 0.5, 0, -size);
        this.ctx.bezierCurveTo(size * 0.5, -size * 0.5, size * 0.5, size * 0.5, 0, size);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawClock(size) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -size * 0.6);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(size * 0.4, 0);
        this.ctx.stroke();
    }
    
    drawSnowflake(size) {
        const arms = 6;
        for (let i = 0; i < arms; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI * 2) / arms);
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -size);
            this.ctx.moveTo(0, -size * 0.7);
            this.ctx.lineTo(-size * 0.2, -size * 0.9);
            this.ctx.moveTo(0, -size * 0.7);
            this.ctx.lineTo(size * 0.2, -size * 0.9);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
    }
    
    drawFirework(size) {
        const rays = 8;
        for (let i = 0; i < rays; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI * 2) / rays);
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -size);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.arc(0, -size, size * 0.2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    start() {
        const animate = () => {
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    getPlayerPosition(playerNum) {
        const rect = document.querySelector(`#player${playerNum}Area`);
        if (rect) {
            const bounds = rect.getBoundingClientRect();
            return {
                x: bounds.left + bounds.width / 2,
                y: bounds.top + bounds.height / 2
            };
        }
        return { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    }
}

window.ParticleSystem = ParticleSystem;
