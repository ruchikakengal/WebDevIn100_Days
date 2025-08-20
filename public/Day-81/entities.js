class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.radius = 10;
        this.health = 100;
        this.maxHealth = 100;
        this.alive = true;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    draw(ctx) {
        // Override in subclasses
    }
}

// Tank Class
class Tank extends Entity {
    constructor(x, y, color = 'green', isPlayer = false) {
        super(x, y);
        this.radius = 20;
        this.color = color;
        this.isPlayer = isPlayer;
        this.speed = 2;
        this.rotationSpeed = 0.05;
        this.turretAngle = 0;
        this.lastShot = 0;
        this.shootCooldown = 300; // milliseconds
        this.ammo = isPlayer ? Infinity : 50;
        this.maxAmmo = 50;
        this.missiles = isPlayer ? 10 : 3;
        this.maxMissiles = 10;
        this.lastMissileShot = 0;
        this.missileCooldown = 1000;
        
        // Power-up effects
        this.powerUps = {
            shield: 0,
            doubleShot: 0,
            speedBoost: 0,
            doubleDamage: 0,
            stealth: 0,
            rapidFire: 0,
            multiShot: 0,
            freezeTime: 0
        };
        
        // Movement properties
        this.acceleration = 0.1;
        this.friction = 0.95;
        this.maxSpeed = this.speed;
        
        // Visual properties
        this.drawHealth = true;
        this.width = 35;
        this.height = 25;
    }

    update() {
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Update position
        super.update();
        
        // Keep tank within bounds
        this.x = Math.max(this.radius, Math.min(1200 - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(800 - this.radius, this.y));
        
        // Update power-ups
        for (let powerUp in this.powerUps) {
            if (this.powerUps[powerUp] > 0) {
                this.powerUps[powerUp]--;
            }
        }
        
        // Update speed based on power-ups
        this.maxSpeed = this.speed * (this.powerUps.speedBoost > 0 ? 1.5 : 1);
    }

    moveForward() {
        const speedMultiplier = this.powerUps.speedBoost > 0 ? 1.5 : 1;
        this.vx += Math.cos(this.angle) * this.acceleration * speedMultiplier;
        this.vy += Math.sin(this.angle) * this.acceleration * speedMultiplier;
        
        // Limit speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > this.maxSpeed) {
            this.vx = (this.vx / speed) * this.maxSpeed;
            this.vy = (this.vy / speed) * this.maxSpeed;
        }
    }

    moveBackward() {
        const speedMultiplier = this.powerUps.speedBoost > 0 ? 1.5 : 1;
        this.vx -= Math.cos(this.angle) * this.acceleration * speedMultiplier * 0.7;
        this.vy -= Math.sin(this.angle) * this.acceleration * speedMultiplier * 0.7;
    }

    rotateLeft() {
        this.angle -= this.rotationSpeed;
        this.turretAngle = this.angle; // Turret follows body for now
    }

    rotateRight() {
        this.angle += this.rotationSpeed;
        this.turretAngle = this.angle; // Turret follows body for now
    }

    canShoot() {
        const cooldown = this.powerUps.rapidFire > 0 ? this.shootCooldown * 0.3 : this.shootCooldown;
        return Date.now() - this.lastShot > cooldown && 
               (this.ammo > 0 || this.ammo === Infinity);
    }

    shoot() {
        if (!this.canShoot()) return null;
        
        this.lastShot = Date.now();
        
        if (this.ammo !== Infinity) {
            this.ammo--;
        }
        
        const bulletX = this.x + Math.cos(this.turretAngle) * (this.radius + 5);
        const bulletY = this.y + Math.sin(this.turretAngle) * (this.radius + 5);
        
        const bullets = [];
        const damage = this.powerUps.doubleDamage > 0 ? 40 : 20;
        
        // Primary bullet
        bullets.push(new Bullet(bulletX, bulletY, this.turretAngle, this.isPlayer, damage));
        
        // Multi-shot power-up creates spread pattern
        if (this.powerUps.multiShot > 0) {
            const spreadAngles = [-0.4, -0.2, 0.2, 0.4]; // Additional 4 bullets
            spreadAngles.forEach(angleOffset => {
                bullets.push(new Bullet(bulletX, bulletY, this.turretAngle + angleOffset, this.isPlayer, damage * 0.7));
            });
        }
        
        // Double shot power-up
        if (this.powerUps.doubleShot > 0) {
            const spreadAngle = 0.3;
            bullets.push(new Bullet(bulletX, bulletY, this.turretAngle + spreadAngle, this.isPlayer, damage));
            bullets.push(new Bullet(bulletX, bulletY, this.turretAngle - spreadAngle, this.isPlayer, damage));
        }
        
        return bullets;
    }

    canShootMissile() {
        return Date.now() - this.lastMissileShot > this.missileCooldown && this.missiles > 0;
    }

    shootMissile() {
        if (!this.canShootMissile()) return null;
        
        this.lastMissileShot = Date.now();
        this.missiles--;
        
        const missileX = this.x + Math.cos(this.turretAngle) * (this.radius + 8);
        const missileY = this.y + Math.sin(this.turretAngle) * (this.radius + 8);
        
        const damage = this.powerUps.doubleDamage > 0 ? 120 : 60;
        return [new Missile(missileX, missileY, this.turretAngle, this.isPlayer, damage)];
    }

    applyPowerUp(type, duration = 600) { // 10 seconds at 60 FPS
        this.powerUps[type] = duration;
        
        if (type === 'health') {
            this.health = Math.min(this.maxHealth, this.health + 50);
        }
    }

    isStealthed() {
        return this.powerUps.stealth > 0;
    }

    isShielded() {
        return this.powerUps.shield > 0;
    }

    draw(ctx) {
        ctx.save();
        
        // Apply stealth effect
        if (this.isStealthed()) {
            ctx.globalAlpha = 0.3;
        }
        
        // Draw tank body
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Tank body
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Tank outline
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Tank tracks
        ctx.fillStyle = '#333';
        ctx.fillRect(-this.width/2, -this.height/2 - 3, this.width, 3);
        ctx.fillRect(-this.width/2, this.height/2, this.width, 3);
        
        ctx.restore();
        
        // Draw turret
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.turretAngle);
        
        // Turret barrel
        ctx.fillStyle = '#555';
        ctx.fillRect(0, -3, this.radius + 15, 6);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, -3, this.radius + 15, 6);
        
        ctx.restore();
        
        // Draw turret base
        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
        // Draw shield effect
        if (this.isShielded()) {
            ctx.save();
            ctx.strokeStyle = '#00aaff';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Draw health bar
        if (this.drawHealth && (this.health < this.maxHealth || !this.isPlayer)) {
            this.drawHealthBar(ctx);
        }
    }

    drawHealthBar(ctx) {
        const barWidth = 40;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.radius - 15;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        // Health bar
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = barWidth * healthPercent;
        
        ctx.fillStyle = healthPercent > 0.6 ? '#4CAF50' : 
                       healthPercent > 0.3 ? '#FF9800' : '#F44336';
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    getBounds() {
        return {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }
}

// Bullet Class
class Bullet extends Entity {
    constructor(x, y, angle, fromPlayer = false, damage = 20) {
        super(x, y);
        this.radius = 3;
        this.speed = 8;
        this.angle = angle;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.fromPlayer = fromPlayer;
        this.damage = damage;
        this.life = 300; // frames until bullet disappears
        this.bounces = 1; // Number of times bullet can bounce
        this.trail = []; // For visual trail effect
    }

    update() {
        // Add current position to trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 8) {
            this.trail.shift();
        }
        
        super.update();
        this.life--;
        
        // Check bounds
        if (this.x < 0 || this.x > 1200 || this.y < 0 || this.y > 800) {
            this.alive = false;
        }
        
        if (this.life <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i + 1) / this.trail.length * 0.5;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.fromPlayer ? '#4CAF50' : '#F44336';
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, this.radius * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        
        // Draw bullet
        ctx.fillStyle = this.fromPlayer ? '#4CAF50' : '#F44336';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Missile Class
class Missile extends Entity {
    constructor(x, y, angle, fromPlayer = false, damage = 60) {
        super(x, y);
        this.radius = 4;
        this.speed = 5;
        this.angle = angle;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.fromPlayer = fromPlayer;
        this.damage = damage;
        this.life = 400; // frames until missile disappears
        this.explosionRadius = 60;
        this.trail = [];
        this.smokeTimer = 0;
    }

    update() {
        // Add current position to trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 12) {
            this.trail.shift();
        }
        
        super.update();
        this.life--;
        this.smokeTimer++;
        
        // Check bounds
        if (this.x < 0 || this.x > 1200 || this.y < 0 || this.y > 800) {
            this.alive = false;
        }
        
        if (this.life <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        // Draw smoke trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i + 1) / this.trail.length * 0.4;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#666666';
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, this.radius * alpha + 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        
        // Draw missile body
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Missile body
        ctx.fillStyle = this.fromPlayer ? '#4CAF50' : '#F44336';
        ctx.fillRect(-8, -2, 16, 4);
        
        // Missile tip
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(12, -2);
        ctx.lineTo(12, 2);
        ctx.closePath();
        ctx.fill();
        
        // Missile fins
        ctx.fillStyle = '#333';
        ctx.fillRect(-8, -4, 4, 2);
        ctx.fillRect(-8, 2, 4, 2);
        
        ctx.restore();
    }

    explode() {
        // Return explosion data for area damage
        return {
            x: this.x,
            y: this.y,
            radius: this.explosionRadius,
            damage: this.damage,
            fromPlayer: this.fromPlayer
        };
    }
}

// Obstacle Classes
class Wall {
    constructor(x, y, width, height, destructible = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.destructible = destructible;
        this.health = destructible ? 100 : Infinity;
        this.maxHealth = this.health;
        this.alive = true;
        this.type = 'wall';
    }

    takeDamage(damage) {
        if (this.destructible) {
            this.health -= damage;
            if (this.health <= 0) {
                this.alive = false;
            }
        }
    }

    draw(ctx) {
        if (this.destructible) {
            // Destructible wall
            const damagePercent = this.health / this.maxHealth;
            ctx.fillStyle = `rgb(${139 + (1 - damagePercent) * 100}, ${69 + (1 - damagePercent) * 50}, 19)`;
        } else {
            // Indestructible wall
            ctx.fillStyle = '#555';
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Add texture for destructible walls
        if (this.destructible) {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 1;
            for (let i = 0; i < this.width; i += 20) {
                for (let j = 0; j < this.height; j += 10) {
                    ctx.strokeRect(this.x + i, this.y + j, 20, 10);
                }
            }
        }
    }
}

class Barrel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.health = 50;
        this.alive = true;
        this.type = 'barrel';
        this.explosionRadius = 80;
        this.explosionDamage = 60;
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
            return true; // Indicates explosion
        }
        return false;
    }

    draw(ctx) {
        // Barrel body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Barrel rings
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Explosion warning (when damaged)
        if (this.health < 50) {
            ctx.fillStyle = '#FF4444';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('!', this.x, this.y - this.radius - 5);
        }
    }
}

// Power-up Class
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 12;
        this.alive = true;
        this.rotation = 0;
        this.bobOffset = 0;
        this.bobSpeed = 0.1;
        
        // Define power-up properties
        this.properties = {
            health: { color: '#F44336', icon: '♥', name: 'Health Pack' },
            shield: { color: '#2196F3', icon: '🛡', name: 'Shield' },
            speed: { color: '#FFEB3B', icon: '⚡', name: 'Speed Boost' },
            damage: { color: '#FF9800', icon: '💥', name: 'Double Damage' },
            ammo: { color: '#4CAF50', icon: '📦', name: 'Ammo Pack' },
            stealth: { color: '#9C27B0', icon: '👻', name: 'Stealth' },
            rapid: { color: '#00BCD4', icon: '🔫', name: 'Rapid Fire' },
            missiles: { color: '#795548', icon: '🚀', name: 'Missile Pack' },
            multishot: { color: '#E91E63', icon: '💫', name: 'Multi-Shot' },
            freeze: { color: '#00E676', icon: '❄️', name: 'Freeze Time' }
        };
    }

    update() {
        this.rotation += 0.05;
        this.bobOffset += this.bobSpeed;
    }

    draw(ctx) {
        const prop = this.properties[this.type];
        const bobY = Math.sin(this.bobOffset) * 3;
        
        ctx.save();
        ctx.translate(this.x, this.y + bobY);
        ctx.rotate(this.rotation);
        
        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius + 5);
        gradient.addColorStop(0, prop.color);
        gradient.addColorStop(0.7, prop.color + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Main circle
        ctx.fillStyle = prop.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Icon
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prop.icon, 0, 0);
        
        ctx.restore();
    }
}
