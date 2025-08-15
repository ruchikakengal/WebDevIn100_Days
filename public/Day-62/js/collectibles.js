class Collectible {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.width = 16;
        this.height = 16;
        this.collected = false;
        
        // Animation
        this.animationTime = 0;
        this.bobOffset = 0;
        this.bobSpeed = 3;
        this.bobAmount = 5;
    }
    
    update(deltaTime) {
        if (this.collected) {
            this.updateCollected(deltaTime);
            return;
        }
        
        // Bobbing animation
        this.animationTime += deltaTime * this.bobSpeed;
        this.bobOffset = Math.sin(this.animationTime) * this.bobAmount;
    }
    
    updateCollected(deltaTime) {
        // Override in subclasses for collection animation
    }
    
    collect() {
        this.collected = true;
        console.log('Collectible collected');
        
        // Remove from game after animation
        setTimeout(() => {
            const index = this.game.collectibles.indexOf(this);
            if (index > -1) {
                this.game.collectibles.splice(index, 1);
            }
        }, 500);
    }
    
    render(ctx) {
        if (this.collected) {
            this.renderCollected(ctx);
            return;
        }
        
        ctx.save();
        ctx.translate(this.x, this.y + this.bobOffset);
        this.draw(ctx);
        ctx.restore();
    }
    
    renderCollected(ctx) {
        // Override in subclasses for collection animation
    }
    
    draw(ctx) {
        // Override in subclasses
    }
}

// Coin Class
class Coin extends Collectible {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 16;
        this.height = 16;
        this.rotationSpeed = 5;
        this.rotation = 0;
        this.value = 200;
        
        console.log('Coin created at:', x, y);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (!this.collected) {
            // Spinning animation
            this.rotation += this.rotationSpeed * deltaTime;
        }
    }
    
    updateCollected(deltaTime) {
        // Float up and fade
        this.y -= 100 * deltaTime;
        this.animationTime += deltaTime;
    }
    
    renderCollected(ctx) {
        const alpha = Math.max(0, 1 - (this.animationTime / 0.5));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x, this.y);
        this.draw(ctx);
        ctx.restore();
    }
    
    draw(ctx) {
        ctx.save();
        
        // Create spinning effect by scaling
        const scaleX = Math.abs(Math.cos(this.rotation));
        ctx.scale(scaleX, 1);
        
        // Draw coin as a circle with shine effect
        ctx.fillStyle = '#FFD700'; // Gold color
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner circle (darker gold)
        ctx.fillStyle = '#DAA520';
        ctx.beginPath();
        ctx.arc(this.width / 2, this.height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Shine effect
        ctx.fillStyle = '#FFFF99';
        ctx.beginPath();
        ctx.arc(this.width / 2 - 2, this.height / 2 - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Dollar sign or star
        if (scaleX > 0.3) {
            ctx.fillStyle = '#8B6914';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('$', this.width / 2, this.height / 2 + 3);
        }
        
        ctx.restore();
    }
}

// Power-up Class (Mushroom)
class PowerUp extends Collectible {
    constructor(x, y, game) {
        super(x, y, game);
        this.width = 24;
        this.height = 24;
        this.type = 'mushroom'; // Can be 'mushroom', 'fireflower', etc.
        this.moveSpeed = 30;
        this.velocityX = this.moveSpeed;
        this.velocityY = 0;
        this.gravity = 400;
        this.onGround = false;
        
        console.log('Power-up created at:', x, y);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (!this.collected) {
            this.updateMovement(deltaTime);
        }
    }
    
    updateMovement(deltaTime) {
        // Power-ups move and are affected by gravity
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
                
                // Bounce off walls
                if (this.x <= platform.x || this.x + this.width >= platform.x + platform.width) {
                    this.velocityX *= -1;
                }
            }
        });
        
        // Reverse direction at world boundaries
        if (this.x <= 0 || this.x >= this.game.levelManager.getCurrentLevel().width - this.width) {
            this.velocityX *= -1;
        }
    }
    
    draw(ctx) {
        switch (this.type) {
            case 'mushroom':
                this.drawMushroom(ctx);
                break;
            case 'fireflower':
                this.drawFireFlower(ctx);
                break;
            default:
                this.drawMushroom(ctx);
        }
    }
    
    drawMushroom(ctx) {
        // Mushroom cap (red with white spots)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(2, 0, 20, 16);
        
        // White spots
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(4, 4, 4, 4);
        ctx.fillRect(12, 8, 4, 4);
        ctx.fillRect(16, 2, 4, 4);
        
        // Mushroom stem (white/cream)
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(8, 12, 8, 12);
        
        // Eyes (make it friendly)
        ctx.fillStyle = '#000000';
        ctx.fillRect(6, 6, 2, 2);
        ctx.fillRect(16, 6, 2, 2);
    }
    
    drawFireFlower(ctx) {
        // Fire flower petals
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(0, 8, 8, 8);
        ctx.fillRect(16, 8, 8, 8);
        ctx.fillRect(8, 0, 8, 8);
        ctx.fillRect(8, 16, 8, 8);
        
        // Center
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(8, 8, 8, 8);
        
        // Stem
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(10, 16, 4, 8);
    }
}

// Question Block Class
class QuestionBlock extends Collectible {
    constructor(x, y, game, contains = 'coin') {
        super(x, y, game);
        this.width = 32;
        this.height = 32;
        this.contains = contains; // 'coin', 'powerup', 'multiple_coins'
        this.used = false;
        this.bounceOffset = 0;
        this.bounceSpeed = 0;
        this.maxBounce = -10;
        
        console.log('Question block created at:', x, y);
    }
    
    update(deltaTime) {
        if (!this.used) {
            super.update(deltaTime);
        } else {
            // Handle bounce animation after use
            if (this.bounceSpeed !== 0) {
                this.bounceOffset += this.bounceSpeed * deltaTime * 60;
                this.bounceSpeed *= 0.9; // Damping
                
                if (Math.abs(this.bounceSpeed) < 0.1) {
                    this.bounceSpeed = 0;
                    this.bounceOffset = 0;
                }
            }
        }
    }
    
    hit() {
        if (this.used) return;
        
        this.used = true;
        this.bounceSpeed = this.maxBounce;
        
        // Create what's inside the block
        switch (this.contains) {
            case 'coin':
                this.game.collectibles.push(new Coin(this.x, this.y - 32, this.game));
                this.game.addScore(200);
                break;
            case 'powerup':
                this.game.collectibles.push(new PowerUp(this.x, this.y - 32, this.game));
                break;
            case 'multiple_coins':
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.game.collectibles.push(new Coin(this.x + (i * 8), this.y - 32, this.game));
                        this.game.addScore(200);
                    }, i * 200);
                }
                break;
        }
        
        this.game.audio.playCoin();
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y + this.bounceOffset);
        this.draw(ctx);
        ctx.restore();
    }
    
    draw(ctx) {
        if (this.used) {
            // Used block (brown/gray)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Block outline
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, this.width, this.height);
        } else {
            // Active question block (yellow with question mark)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Block outline
            ctx.strokeStyle = '#B8860B';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, this.width, this.height);
            
            // Question mark
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', this.width / 2, this.height / 2 + 6);
            
            // Blinking effect
            if (Math.sin(this.animationTime * 4) > 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(0, 0, this.width, this.height);
            }
        }
    }
}

// Pipe Class (can be collectible entrance or just decoration)
class Pipe extends Collectible {
    constructor(x, y, game, height = 64, type = 'normal') {
        super(x, y, game);
        this.width = 48;
        this.height = height;
        this.type = type; // 'normal', 'warp', 'bonus'
        this.entranceY = y;
        
        console.log('Pipe created at:', x, y);
    }
    
    update(deltaTime) {
        // Pipes don't move or animate much
    }
    
    canEnter() {
        return this.type === 'warp' || this.type === 'bonus';
    }
    
    draw(ctx) {
        // Pipe body (green)
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Pipe rim (darker green)
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(0, 0, this.width, 8);
        
        // Pipe opening (black)
        ctx.fillStyle = '#000000';
        ctx.fillRect(4, 8, this.width - 8, 12);
        
        // Pipe highlights
        ctx.fillStyle = '#44FF44';
        ctx.fillRect(2, 2, 4, this.height - 4);
        ctx.fillRect(this.width - 6, 2, 4, this.height - 4);
        
        // Different pipe types
        if (this.type === 'warp') {
            // Add some visual indicator for warp pipes
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(this.width / 2 - 2, 20, 4, 8);
        } else if (this.type === 'bonus') {
            // Bonus area indicator
            ctx.fillStyle = '#FF00FF';
            ctx.fillRect(this.width / 2 - 3, 15, 6, 6);
        }
    }
}
