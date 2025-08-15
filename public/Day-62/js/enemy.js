class Enemy {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.defeated = false;
        this.health = 1;
    }
    
    defeat() {
        this.defeated = true;
        setTimeout(() => {
            const index = this.game.enemies.indexOf(this);
            if (index > -1) {
                this.game.enemies.splice(index, 1);
            }
        }, 800);
    }
}

// Goomba Enemy Class
class Goomba extends Enemy {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 24;
        this.height = 24;
        
        // Physics
        this.velocityX = -50; // Move left by default
        this.velocityY = 0;
        this.gravity = 800;
        this.speed = 50;
        
        // AI properties
        this.direction = -1; // -1 for left, 1 for right
        this.patrolDistance = 100;
        this.startX = x;
        this.onGround = false;
        
        // Animation
        this.animationTime = 0;
        this.animationFrame = 0;
        this.animationSpeed = 2;
        
        console.log('Goomba created at:', x, y);
    }
    
    update(deltaTime) {
        if (this.defeated) {
            this.updateDefeated(deltaTime);
            return;
        }
        
        this.updateAI(deltaTime);
        this.updatePhysics(deltaTime);
        this.updateAnimation(deltaTime);
    }
    
    updateAI(deltaTime) {
        // Simple patrol AI
        this.velocityX = this.direction * this.speed;
        
        // Check if we've moved too far from start position
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
        
        // Check for platform edges (simple edge detection)
        const nextX = this.x + (this.velocityX * deltaTime);
        const foundPlatform = this.game.platforms.some(platform => {
            return nextX >= platform.x && 
                   nextX <= platform.x + platform.width &&
                   this.y + this.height >= platform.y - 5 &&
                   this.y <= platform.y + platform.height;
        });
        
        if (!foundPlatform && this.onGround) {
            this.direction *= -1; // Turn around at platform edge
        }
    }
    
    updatePhysics(deltaTime) {
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Reset ground state
        this.onGround = false;
        
        // Platform collision
        this.game.platforms.forEach(platform => {
            if (this.game.physics.checkCollision(this, platform)) {
                this.game.physics.resolveCollision(this, platform);
            }
        });
    }
    
    updateAnimation(deltaTime) {
        this.animationTime += deltaTime * this.animationSpeed;
        this.animationFrame = Math.floor(this.animationTime) % 2;
    }
    
    updateDefeated(deltaTime) {
        // Flatten and fade when defeated
        this.height = Math.max(4, this.height - 40 * deltaTime);
        this.y += 40 * deltaTime;
    }
    
    defeat() {
        super.defeat();
        console.log('Goomba defeated');
    }
    
    render(ctx) {
        if (this.defeated) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - (this.height < 8 ? 0.8 : 0));
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        this.drawGoomba(ctx);
        
        ctx.restore();
        
        if (this.defeated) {
            ctx.restore();
        }
    }
    
    drawGoomba(ctx) {
        // Goomba body (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(2, 4, this.width - 4, this.height - 8);
        
        // Goomba head (darker brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, 0, this.width, 16);
        
        // Goomba feet
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, this.height - 4, 8, 4);
        ctx.fillRect(this.width - 8, this.height - 4, 8, 4);
        
        // Goomba eyes (angry look)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(4, 4, 4, 4);
        ctx.fillRect(this.width - 8, 4, 4, 4);
        
        // Eye pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(5, 5, 2, 2);
        ctx.fillRect(this.width - 7, 5, 2, 2);
        
        // Goomba frown
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 10, 8, 2);
        
        // Simple walking animation
        if (this.animationFrame === 1 && !this.defeated) {
            // Slightly move feet for walking effect
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-1, this.height - 4, 8, 4);
            ctx.fillRect(this.width - 7, this.height - 4, 8, 4);
        }
    }
}

// Additional enemy types can be added here
class Koopa extends Enemy {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 28;
        this.height = 32;
        this.shell = false;
        
        // Similar implementation to Goomba but with shell mechanics
        this.velocityX = -40;
        this.velocityY = 0;
        this.direction = -1;
        this.speed = 40;
        
        console.log('Koopa created at:', x, y);
    }
    
    update(deltaTime) {
        if (this.defeated && !this.shell) {
            this.updateDefeated(deltaTime);
            return;
        }
        
        if (!this.shell) {
            this.updateAI(deltaTime);
        }
        this.updatePhysics(deltaTime);
    }
    
    updateAI(deltaTime) {
        // Similar to Goomba AI
        this.velocityX = this.direction * this.speed;
    }
    
    updatePhysics(deltaTime) {
        // Apply gravity
        this.velocityY += this.game.physics.gravity * deltaTime;
        
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }
    
    defeat() {
        if (!this.shell) {
            this.shell = true;
            this.height = 16;
            this.velocityX = 0;
            // Shell can be kicked by player
        } else {
            super.defeat();
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.shell) {
            this.drawShell(ctx);
        } else {
            this.drawKoopa(ctx);
        }
        
        ctx.restore();
    }
    
    drawKoopa(ctx) {
        // Green shell
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(0, 8, this.width, 16);
        
        // Koopa head
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(4, 0, 20, 12);
        
        // Koopa feet
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(2, this.height - 4, 6, 4);
        ctx.fillRect(this.width - 8, this.height - 4, 6, 4);
    }
    
    drawShell(ctx) {
        // Just the shell
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Shell pattern
        ctx.fillStyle = '#008800';
        ctx.fillRect(4, 4, this.width - 8, 8);
    }
}
