class Ball {
    constructor(x, y, radius, color = '#ffffff') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.originalRadius = radius;

        // Movement properties
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.maxSpeed = 15;
        this.originalSpeed = 5;
        this.speedIncrease = 0.5;

        // Visual effects
        this.trail = [];
        this.maxTrailLength = 10;
        this.glowIntensity = 0;
        this.rotationAngle = 0;

        // Power-up effects
        this.isSpeedBoosted = false;
        this.speedBoostEndTime = 0;

        // Collision prevention
        this.lastPaddleHit = null;
        this.paddleHitCooldown = 0;

        // Statistics
        this.totalDistance = 0;
        this.bounceCount = 0;
        this.paddleHits = 0;
    }

    reset(x, y, direction = 1) {
        this.x = x;
        this.y = y;
        this.speed = Math.max(this.originalSpeed, 4); // Minimum speed of 4
        
        // Ensure proper velocity initialization
        this.vx = this.speed * direction * (Math.random() * 0.4 + 0.8); // 0.8 to 1.2 range
        this.vy = this.speed * (Math.random() - 0.5) * 0.6; // Smaller vertical component
        
        // Guarantee minimum velocity
        if (Math.abs(this.vx) < 3) {
            this.vx = 4 * direction;
        }
        if (Math.abs(this.vy) < 1) {
            this.vy = (Math.random() < 0.5 ? -1 : 1) * 2;
        }

        this.trail = [];
        this.glowIntensity = 0;
        this.rotationAngle = 0;
        this.isSpeedBoosted = false;
        this.speedBoostEndTime = 0;
        this.lastPaddleHit = null;
        this.paddleHitCooldown = 0;

        // Reset size
        this.radius = this.originalRadius;
        
        console.log(`Ball reset: vx=${this.vx.toFixed(2)}, vy=${this.vy.toFixed(2)}, speed=${this.speed.toFixed(2)}`);
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        // Update position
        const prevX = this.x;
        const prevY = this.y;

        this.x += this.vx * deltaTime * 60; // Normalize for 60fps
        this.y += this.vy * deltaTime * 60;

        // Calculate distance traveled
        const distance = Math.sqrt(Math.pow(this.x - prevX, 2) + Math.pow(this.y - prevY, 2));
        this.totalDistance += distance;

        // Update rotation
        this.rotationAngle += distance * 0.1;

        // Update trail
        this.updateTrail();

        // Update visual effects
        this.updateEffects(deltaTime);

        // Update power-up timers
        this.updatePowerups(deltaTime);

        // Update cooldowns
        if (this.paddleHitCooldown > 0) {
            this.paddleHitCooldown -= deltaTime;
        }

        // Wall collision detection
        this.checkWallCollisions(canvasHeight);

        // Check if ball is out of bounds (scoring)
        return this.checkScoring(canvasWidth);
    }

    updateTrail() {
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y, timestamp: Date.now() });

        // Remove old trail points
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    updateEffects(deltaTime) {
        // Fade glow effect
        if (this.glowIntensity > 0) {
            this.glowIntensity = Math.max(0, this.glowIntensity - deltaTime * 2);
        }
    }

    updatePowerups(deltaTime) {
        // Check speed boost expiration
        if (this.isSpeedBoosted && Date.now() > this.speedBoostEndTime) {
            this.isSpeedBoosted = false;
            this.resetSpeed();
        }
    }

    checkWallCollisions(canvasHeight) {
        // Top wall collision
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.vy = Math.abs(this.vy);
            this.bounceCount++;
            this.triggerGlow();
            window.audioSystem.playWallBounce();
        }

        // Bottom wall collision
        if (this.y + this.radius >= canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.vy = -Math.abs(this.vy);
            this.bounceCount++;
            this.triggerGlow();
            window.audioSystem.playWallBounce();
        }
    }

    checkScoring(canvasWidth) {
        // Left side (Player 2 scores)
        if (this.x + this.radius < 0) {
            return { scored: true, scorer: 'player2' };
        }

        // Right side (Player 1 scores)
        if (this.x - this.radius > canvasWidth) {
            return { scored: true, scorer: 'player1' };
        }

        return { scored: false };
    }

    handlePaddleCollision(paddle, paddleId) {
        // Prevent multiple hits with the same paddle
        if (this.lastPaddleHit === paddleId && this.paddleHitCooldown > 0) {
            return false;
        }

        // Check collision
        if (!this.checkPaddleCollision(paddle)) {
            return false;
        }

        // Calculate relative hit position (-1 to 1)
        const relativeHitY = paddle.getRelativeHitPosition(this.y);

        // Calculate new velocity based on hit position
        const angleMultiplier = relativeHitY * 0.75; // Max 75% angle influence
        const newSpeed = Math.min(this.speed + this.speedIncrease, this.maxSpeed);

        // Determine ball direction based on paddle side
        const canvasCenter = 400; // Assuming 800px width
        const isLeftPaddle = paddle.x < canvasCenter;
        const directionX = isLeftPaddle ? 1 : -1;

        // Calculate new velocities with guaranteed movement
        this.vx = newSpeed * directionX * 0.8; // Base horizontal speed
        this.vy = newSpeed * angleMultiplier; // Vertical component based on hit position

        // Add paddle velocity influence (converted to proper scale)
        this.vy += (paddle.velocity || 0) * 0.01;

        // Ensure minimum horizontal speed to prevent stopping
        const minHorizontalSpeed = newSpeed * 0.7;
        if (Math.abs(this.vx) < minHorizontalSpeed) {
            this.vx = minHorizontalSpeed * directionX;
        }

        // Ensure the ball doesn't stop completely
        if (Math.abs(this.vx) < 2) {
            this.vx = 4 * directionX;
        }
        if (Math.abs(this.vy) < 1 && Math.abs(angleMultiplier) < 0.1) {
            this.vy = (Math.random() - 0.5) * 2;
        }

        // Update ball speed
        this.speed = Math.max(newSpeed, 4); // Minimum speed

        // Position ball outside paddle to prevent sticking
        if (isLeftPaddle) {
            this.x = paddle.x + paddle.width + this.radius + 2;
        } else {
            this.x = paddle.x - this.radius - 2;
        }

        // Update collision tracking
        this.lastPaddleHit = paddleId;
        this.paddleHitCooldown = 0.2; // 200ms cooldown
        this.paddleHits++;

        // Visual and audio effects
        paddle.triggerHitEffect();
        this.triggerGlow();
        if (window.audioSystem) {
            window.audioSystem.playPaddleHit();
        }

        console.log(`Ball hit ${paddleId}: vx=${this.vx.toFixed(2)}, vy=${this.vy.toFixed(2)}, speed=${this.speed.toFixed(2)}`);

        return true;
    }

    checkPaddleCollision(paddle) {
        return this.x - this.radius < paddle.x + paddle.width &&
               this.x + this.radius > paddle.x &&
               this.y - this.radius < paddle.y + paddle.height &&
               this.y + this.radius > paddle.y;
    }

    render(ctx, theme = 'retro') {
        ctx.save();

        // Draw trail
        this.renderTrail(ctx, theme);

        // Main ball rendering
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        // Glow effect
        if (this.glowIntensity > 0 || theme === 'neon') {
            const glowAmount = theme === 'neon' ? 20 : this.glowIntensity * 30;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = glowAmount;
        }

        // Speed boost effect
        if (this.isSpeedBoosted) {
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 25;
        }

        if (theme === 'neon') {
            // Neon theme - gradient ball
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.7, this.color);
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
        } else {
            // Retro theme - solid ball
            ctx.fillStyle = this.color;
        }

        // Draw main ball
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner patterns
        if (theme === 'retro') {
            // Simple dot pattern
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Neon theme - electric lines
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;

            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(
                    Math.cos(angle) * this.radius * 0.7,
                    Math.sin(angle) * this.radius * 0.7
                );
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    renderTrail(ctx, theme) {
        if (this.trail.length < 2) return;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 1; i < this.trail.length; i++) {
            const point = this.trail[i];
            const prevPoint = this.trail[i - 1];
            const progress = i / this.trail.length;

            ctx.strokeStyle = theme === 'neon' ? 
                `rgba(0, 255, 255, ${progress * 0.5})` : 
                `rgba(255, 255, 255, ${progress * 0.3})`;
            ctx.lineWidth = this.radius * progress;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }

        ctx.restore();
    }

    // Visual effects
    triggerGlow(intensity = 1) {
        this.glowIntensity = intensity;
    }

    // Power-up effects
    applySpeedBoost(duration = 5000) {
        this.isSpeedBoosted = true;
        this.speedBoostEndTime = Date.now() + duration;

        // Increase current velocity
        const speedMultiplier = 1.5;
        this.vx *= speedMultiplier;
        this.vy *= speedMultiplier;
        this.speed *= speedMultiplier;

        this.triggerGlow(2);
        window.audioSystem.playPowerup();
    }

    resetSpeed() {
        if (this.isSpeedBoosted) return; // Don't reset if boosted

        const currentAngle = Math.atan2(this.vy, this.vx);
        this.speed = this.originalSpeed + (this.paddleHits * this.speedIncrease * 0.5);
        this.speed = Math.min(this.speed, this.maxSpeed);

        this.vx = Math.cos(currentAngle) * this.speed;
        this.vy = Math.sin(currentAngle) * this.speed;
    }

    // Size effects
    resize(newRadius) {
        this.radius = newRadius;
    }

    resetSize() {
        this.radius = this.originalRadius;
    }

    // Get ball state for AI
    getState() {
        return {
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            speed: this.speed,
            radius: this.radius
        };
    }

    // Predict future position
    predictPosition(timeAhead) {
        return {
            x: this.x + this.vx * timeAhead,
            y: this.y + this.vy * timeAhead
        };
    }

    // Statistics
    getStats() {
        return {
            totalDistance: Math.round(this.totalDistance),
            bounceCount: this.bounceCount,
            paddleHits: this.paddleHits,
            currentSpeed: Math.round(this.speed * 10) / 10,
            maxSpeed: this.maxSpeed
        };
    }
}