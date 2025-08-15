class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.game = game;
        
        // Physics properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 250;
        this.jumpPower = 450; // Increased jump height significantly
        this.gravity = 800;
        this.friction = 0.85;
        this.maxVelocityX = 350;
        this.maxVelocityY = 600;
        
        // State
        this.onGround = false;
        this.facing = 'right';
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.invulnerableDuration = 2;
        
        // Animation
        this.animation = {
            idle: { frames: 1, duration: 1 },
            walk: { frames: 3, duration: 0.2 },
            jump: { frames: 1, duration: 1 }
        };
        this.currentAnimation = 'idle';
        this.animationTime = 0;
        this.currentFrame = 0;
        
        console.log('Player created at:', x, y);
    }
    
    update(deltaTime) {
        this.handleInput(deltaTime);
        this.updatePhysics(deltaTime);
        this.updateAnimation(deltaTime);
        this.updateInvulnerability(deltaTime);
        
        // Keep player within world bounds
        this.x = Math.max(0, Math.min(this.x, this.game.levelManager.getCurrentLevel().width - this.width));
        
        // Check if player falls off the world
        if (this.y > this.game.height + 100) {
            this.game.playerHit();
            this.respawn();
        }
    }
    
    handleInput(deltaTime) {
        const input = this.game.input;
        let moving = false;
        
        // Horizontal movement
        if (input.isKeyPressed('ArrowLeft') || input.isKeyPressed('KeyA')) {
            this.velocityX -= this.speed * deltaTime;
            this.facing = 'left';
            moving = true;
        }
        
        if (input.isKeyPressed('ArrowRight') || input.isKeyPressed('KeyD')) {
            this.velocityX += this.speed * deltaTime;
            this.facing = 'right';
            moving = true;
        }
        
        // Jumping
        if ((input.isKeyPressed(' ') || input.isKeyPressed('ArrowUp')) && this.onGround) {
            this.jump();
        }
        
        // Set animation based on movement
        if (this.onGround) {
            if (moving) {
                this.currentAnimation = 'walk';
            } else {
                this.currentAnimation = 'idle';
            }
        } else {
            this.currentAnimation = 'jump';
        }
    }
    
    updatePhysics(deltaTime) {
        // Apply friction
        if (this.onGround) {
            this.velocityX *= this.friction;
        }
        
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        
        // Limit velocities
        this.velocityX = Math.max(-this.maxVelocityX, Math.min(this.maxVelocityX, this.velocityX));
        this.velocityY = Math.max(-this.maxVelocityY, Math.min(this.maxVelocityY, this.velocityY));
        
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Reset ground state (will be set by collision detection)
        this.onGround = false;
    }
    
    updateAnimation(deltaTime) {
        const anim = this.animation[this.currentAnimation];
        this.animationTime += deltaTime;
        
        if (this.animationTime >= anim.duration) {
            this.animationTime = 0;
            this.currentFrame = (this.currentFrame + 1) % anim.frames;
        }
    }
    
    updateInvulnerability(deltaTime) {
        if (this.invulnerable) {
            this.invulnerableTime += deltaTime;
            if (this.invulnerableTime >= this.invulnerableDuration) {
                this.invulnerable = false;
                this.invulnerableTime = 0;
            }
        }
    }
    
    jump() {
        this.velocityY = -this.jumpPower;
        this.onGround = false;
        this.game.audio.playJump();
        this.game.createJumpParticles(this.x, this.y);
        console.log('Player jumped');
    }
    
    bounce() {
        this.velocityY = -this.jumpPower * 0.7;
        this.onGround = false;
    }
    
    makeInvulnerable() {
        this.invulnerable = true;
        this.invulnerableTime = 0;
    }
    
    respawn() {
        this.x = 100;
        this.y = this.game.height - 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
    }
    
    render(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Flicker effect when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerableTime * 10) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Flip sprite based on facing direction
        if (this.facing === 'left') {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.x, this.y);
        }
        
        // Draw Mario as a simple colored rectangle with details
        this.drawMario(ctx);
        
        ctx.restore();
    }
    
    drawMario(ctx) {
        // Enhanced Mario with better details and shadows
        
        // Shadow beneath Mario
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000000';
        ctx.fillRect(-2, this.height + 2, this.width + 4, 4);
        ctx.restore();
        
        // Mario's overalls (blue) - draw first for layering
        ctx.fillStyle = '#0066FF';
        ctx.fillRect(2, 12, this.width - 4, 20);
        
        // Overalls straps
        ctx.fillStyle = '#0044AA';
        ctx.fillRect(6, 8, 4, 8);
        ctx.fillRect(22, 8, 4, 8);
        
        // Mario's body/shirt (red)
        ctx.fillStyle = '#FF2222';
        ctx.fillRect(0, 8, this.width, 16);
        
        // Shirt highlights
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(0, 8, 2, 16);
        
        // Mario's skin (face and hands) - peachy color
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(6, 0, 20, 12);
        
        // Face highlights
        ctx.fillStyle = '#FFEEDD';
        ctx.fillRect(6, 0, 2, 8);
        
        // Mario's hat (red)
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(4, 0, 24, 8);
        
        // Hat brim shadow
        ctx.fillStyle = '#990000';
        ctx.fillRect(4, 6, 24, 2);
        
        // Hat "M" emblem with background circle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(16, 4, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('M', 16, 7);
        
        // Mario's mustache (brown)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(10, 6, 12, 4);
        
        // Mustache highlight
        ctx.fillStyle = '#AA6633';
        ctx.fillRect(10, 6, 2, 2);
        
        // Mario's eyes (black with white highlights)
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 2, 3, 3);
        ctx.fillRect(21, 2, 3, 3);
        
        // Eye highlights
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(9, 2, 1, 1);
        ctx.fillRect(22, 2, 1, 1);
        
        // Mario's nose
        ctx.fillStyle = '#FFCCAA';
        ctx.fillRect(15, 4, 2, 2);
        
        // Mario's shoes (brown with laces)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(2, 28, 10, 4);
        ctx.fillRect(20, 28, 10, 4);
        
        // Shoe highlights
        ctx.fillStyle = '#AA6633';
        ctx.fillRect(2, 28, 2, 2);
        ctx.fillRect(20, 28, 2, 2);
        
        // Shoe laces
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(5, 29, 1, 1);
        ctx.fillRect(7, 29, 1, 1);
        ctx.fillRect(23, 29, 1, 1);
        ctx.fillRect(25, 29, 1, 1);
        
        // Animation effects
        if (this.currentAnimation === 'walk') {
            // Enhanced walking animation with arm swing
            const walkCycle = Math.sin(this.animationTime * 15);
            const offset = walkCycle * 1;
            ctx.translate(0, Math.abs(offset));
            
            // Draw simple arms that swing
            ctx.fillStyle = '#FFDBAC';
            const armOffset = walkCycle * 3;
            ctx.fillRect(-2, 12 + armOffset, 4, 8); // Left arm
            ctx.fillRect(30, 12 - armOffset, 4, 8); // Right arm
        } else if (this.currentAnimation === 'jump') {
            // Jump pose - arms up
            ctx.fillStyle = '#FFDBAC';
            ctx.fillRect(-2, 8, 4, 8); // Left arm up
            ctx.fillRect(30, 8, 4, 8); // Right arm up
        } else {
            // Idle pose - arms at sides
            ctx.fillStyle = '#FFDBAC';
            ctx.fillRect(-2, 14, 4, 8); // Left arm
            ctx.fillRect(30, 14, 4, 8); // Right arm
        }
        
        // Power-up glow effect when invulnerable
        if (this.invulnerable) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(-3, -3, this.width + 6, this.height + 6);
            ctx.restore();
        }
    }
}
