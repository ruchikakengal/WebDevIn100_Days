
class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        
        // Movement
        this.speed = 400; // pixels per second
        this.velocity = 0;
        this.movingUp = false;
        this.movingDown = false;
        
        // Boundaries
        this.topBound = 0;
        this.bottomBound = 0; // Will be set by game
        
        // Visual effects
        this.glowIntensity = 0;
        this.lastHitTime = 0;
    }

    moveUp(pressed) {
        this.movingUp = pressed;
        if (pressed) {
            this.movingDown = false;
        }
    }

    moveDown(pressed) {
        this.movingDown = pressed;
        if (pressed) {
            this.movingUp = false;
        }
    }

    update(deltaTime, canvasHeight) {
        this.bottomBound = canvasHeight - this.height;
        
        // Update velocity based on input
        if (this.movingUp) {
            this.velocity = -this.speed;
        } else if (this.movingDown) {
            this.velocity = this.speed;
        } else {
            this.velocity = 0;
        }
        
        // Apply movement
        this.y += this.velocity * deltaTime;
        
        // Keep within bounds
        if (this.y < this.topBound) {
            this.y = this.topBound;
            this.velocity = 0;
        }
        if (this.y > this.bottomBound) {
            this.y = this.bottomBound;
            this.velocity = 0;
        }
        
        // Update glow effect
        const timeSinceHit = Date.now() - this.lastHitTime;
        this.glowIntensity = Math.max(0, 1 - (timeSinceHit / 1000));
    }

    render(ctx, theme) {
        // Set colors based on theme
        let paddleColor = this.color;
        let glowColor = theme === 'neon' ? '#ff00ff' : '#00ffff';
        
        // Apply glow effect if recently hit
        if (this.glowIntensity > 0) {
            ctx.shadowBlur = 20 * this.glowIntensity;
            ctx.shadowColor = glowColor;
        } else {
            ctx.shadowBlur = 5;
            ctx.shadowColor = glowColor;
        }
        
        // Draw main paddle
        ctx.fillStyle = paddleColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw glow border
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Draw center line for visual detail
        ctx.fillStyle = glowColor;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(this.x + this.width / 2 - 1, this.y, 2, this.height);
        
        // Reset shadow and alpha
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    // Check collision with ball
    checkCollision(ball) {
        return ball.x - ball.radius < this.x + this.width &&
               ball.x + ball.radius > this.x &&
               ball.y - ball.radius < this.y + this.height &&
               ball.y + ball.radius > this.y;
    }

    // Get collision point for ball deflection calculation
    getCollisionPoint(ball) {
        const paddleCenter = this.y + this.height / 2;
        const relativeY = (ball.y - paddleCenter) / (this.height / 2);
        return Math.max(-1, Math.min(1, relativeY));
    }

    // Called when ball hits this paddle
    onHit() {
        this.lastHitTime = Date.now();
        this.glowIntensity = 1;
    }

    // Get paddle bounds for collision detection
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    // Set paddle position (useful for AI or repositioning)
    setPosition(x, y) {
        this.x = x;
        this.y = Math.max(this.topBound, Math.min(y, this.bottomBound));
    }

    // Move paddle to specific Y position smoothly
    moveTo(targetY, deltaTime) {
        const difference = targetY - (this.y + this.height / 2);
        const maxMove = this.speed * deltaTime;
        
        if (Math.abs(difference) < maxMove) {
            this.y = targetY - this.height / 2;
        } else {
            this.y += difference > 0 ? maxMove : -maxMove;
        }
        
        // Keep within bounds
        this.y = Math.max(this.topBound, Math.min(this.y, this.bottomBound));
    }

    // Reset paddle to center position
    reset(canvasHeight) {
        this.y = canvasHeight / 2 - this.height / 2;
        this.velocity = 0;
        this.movingUp = false;
        this.movingDown = false;
        this.glowIntensity = 0;
    }

    // Get relative hit position for ball deflection (-1 to 1)
    getRelativeHitPosition(ballY) {
        const paddleCenter = this.y + this.height / 2;
        const relativeY = (ballY - paddleCenter) / (this.height / 2);
        return Math.max(-1, Math.min(1, relativeY));
    }

    // Get center Y position
    getCenterY() {
        return this.y + this.height / 2;
    }

    // Move towards a target Y position
    moveTowards(targetY, speed) {
        const currentCenter = this.getCenterY();
        const distance = targetY - currentCenter;
        const moveAmount = speed || this.speed;
        
        if (Math.abs(distance) > moveAmount) {
            if (distance > 0) {
                this.movingDown = true;
                this.movingUp = false;
            } else {
                this.movingUp = true;
                this.movingDown = false;
            }
        } else {
            this.movingUp = false;
            this.movingDown = false;
        }
    }

    // Trigger hit effect
    triggerHitEffect() {
        this.lastHitTime = Date.now();
        this.glowIntensity = 1;
    }

    // Get current state for debugging
    getState() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            velocity: this.velocity,
            movingUp: this.movingUp,
            movingDown: this.movingDown
        };
    }
}
