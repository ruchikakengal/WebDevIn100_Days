class PowerUpSystem {
    constructor() {
        this.powerUps = [];
        this.activePowerUps = [];
        this.spawnTimer = 0;
        this.spawnInterval = 15000; // 15 seconds
        this.enabled = true;
        
        // Power-up types
        this.powerUpTypes = {
            speedBoost: {
                name: 'Speed Boost',
                color: '#ffff00',
                duration: 5000,
                description: 'Increases ball speed',
                rarity: 0.3
            },
            paddleGrow: {
                name: 'Paddle Grow',
                color: '#00ff00',
                duration: 8000,
                description: 'Increases paddle size',
                rarity: 0.25
            },
            paddleShrink: {
                name: 'Paddle Shrink',
                color: '#ff6600',
                duration: 8000,
                description: 'Shrinks opponent paddle',
                rarity: 0.25
            },
            multiball: {
                name: 'Multi Ball',
                color: '#ff00ff',
                duration: 10000,
                description: 'Spawns additional balls',
                rarity: 0.1
            },
            slowMotion: {
                name: 'Slow Motion',
                color: '#00ffff',
                duration: 6000,
                description: 'Slows down game speed',
                rarity: 0.1
            }
        };
    }

    update(deltaTime, canvasWidth, canvasHeight, ball, player1Paddle, player2Paddle) {
        if (!this.enabled) return;
        
        // Update spawn timer
        this.spawnTimer += deltaTime * 1000;
        
        // Spawn new power-up
        if (this.spawnTimer >= this.spawnInterval && this.powerUps.length < 2) {
            this.spawnPowerUp(canvasWidth, canvasHeight);
            this.spawnTimer = 0;
        }
        
        // Update existing power-ups
        this.updatePowerUps(deltaTime);
        
        // Check collisions with ball
        this.checkCollisions(ball, player1Paddle, player2Paddle);
        
        // Update active power-up timers
        this.updateActivePowerUps(deltaTime, player1Paddle, player2Paddle);
    }

    spawnPowerUp(canvasWidth, canvasHeight) {
        // Select random power-up type based on rarity
        const type = this.selectRandomPowerUp();
        
        // Random position in center area
        const x = canvasWidth * 0.3 + Math.random() * canvasWidth * 0.4;
        const y = canvasHeight * 0.2 + Math.random() * canvasHeight * 0.6;
        
        const powerUp = {
            id: Date.now(),
            type: type,
            x: x,
            y: y,
            radius: 15,
            rotationAngle: 0,
            pulseScale: 1,
            lifetime: 20000, // 20 seconds before despawn
            age: 0
        };
        
        this.powerUps.push(powerUp);
    }

    selectRandomPowerUp() {
        const types = Object.keys(this.powerUpTypes);
        const weights = types.map(type => this.powerUpTypes[type].rarity);
        
        // Weighted random selection
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < types.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return types[i];
            }
        }
        
        return types[0]; // Fallback
    }

    updatePowerUps(deltaTime) {
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.age += deltaTime * 1000;
            powerUp.rotationAngle += deltaTime * 2;
            powerUp.pulseScale = 1 + Math.sin(powerUp.age * 0.005) * 0.2;
            
            // Remove if lifetime exceeded
            return powerUp.age < powerUp.lifetime;
        });
    }

    checkCollisions(ball, player1Paddle, player2Paddle) {
        this.powerUps = this.powerUps.filter(powerUp => {
            const distance = Math.sqrt(
                Math.pow(ball.x - powerUp.x, 2) + 
                Math.pow(ball.y - powerUp.y, 2)
            );
            
            if (distance < ball.radius + powerUp.radius) {
                // Collision detected - apply power-up
                this.applyPowerUp(powerUp, ball, player1Paddle, player2Paddle);
                return false; // Remove power-up
            }
            
            return true; // Keep power-up
        });
    }

    applyPowerUp(powerUp, ball, player1Paddle, player2Paddle) {
        const typeData = this.powerUpTypes[powerUp.type];
        
        // Determine which player gets the benefit
        const ballMovingRight = ball.vx > 0;
        const beneficiary = ballMovingRight ? 'player1' : 'player2';
        const beneficiaryPaddle = ballMovingRight ? player1Paddle : player2Paddle;
        const opponentPaddle = ballMovingRight ? player2Paddle : player1Paddle;
        
        const activePowerUp = {
            id: powerUp.id,
            type: powerUp.type,
            name: typeData.name,
            beneficiary: beneficiary,
            duration: typeData.duration,
            timeRemaining: typeData.duration,
            applied: false
        };
        
        // Apply immediate effects
        switch (powerUp.type) {
            case 'speedBoost':
                ball.applySpeedBoost(typeData.duration);
                break;
                
            case 'paddleGrow':
                this.growPaddle(beneficiaryPaddle, 1.5);
                activePowerUp.originalHeight = beneficiaryPaddle.height / 1.5;
                break;
                
            case 'paddleShrink':
                this.shrinkPaddle(opponentPaddle, 0.6);
                activePowerUp.originalHeight = opponentPaddle.height / 0.6;
                activePowerUp.targetPaddle = opponentPaddle;
                break;
                
            case 'multiball':
                // This would require game-level implementation
                activePowerUp.effect = 'multiball';
                break;
                
            case 'slowMotion':
                activePowerUp.effect = 'slowMotion';
                break;
        }
        
        this.activePowerUps.push(activePowerUp);
        
        // Play sound effect
        audioSystem.playPowerup();
        
        // Visual effect
        ball.triggerGlow(2);
    }

    updateActivePowerUps(deltaTime, player1Paddle, player2Paddle) {
        this.activePowerUps = this.activePowerUps.filter(powerUp => {
            powerUp.timeRemaining -= deltaTime * 1000;
            
            // Remove expired power-ups
            if (powerUp.timeRemaining <= 0) {
                this.removePowerUpEffect(powerUp, player1Paddle, player2Paddle);
                return false;
            }
            
            return true;
        });
    }

    removePowerUpEffect(powerUp, player1Paddle, player2Paddle) {
        switch (powerUp.type) {
            case 'paddleGrow':
                const grownPaddle = powerUp.beneficiary === 'player1' ? player1Paddle : player2Paddle;
                grownPaddle.resetSize();
                break;
                
            case 'paddleShrink':
                if (powerUp.targetPaddle) {
                    powerUp.targetPaddle.resetSize();
                }
                break;
        }
    }

    growPaddle(paddle, multiplier) {
        paddle.resize(paddle.originalHeight * multiplier);
    }

    shrinkPaddle(paddle, multiplier) {
        paddle.resize(paddle.originalHeight * multiplier);
    }

    render(ctx, theme = 'retro') {
        // Render power-ups
        this.powerUps.forEach(powerUp => {
            this.renderPowerUp(ctx, powerUp, theme);
        });
    }

    renderPowerUp(ctx, powerUp, theme) {
        const typeData = this.powerUpTypes[powerUp.type];
        
        ctx.save();
        ctx.translate(powerUp.x, powerUp.y);
        ctx.rotate(powerUp.rotationAngle);
        ctx.scale(powerUp.pulseScale, powerUp.pulseScale);
        
        // Glow effect
        ctx.shadowColor = typeData.color;
        ctx.shadowBlur = 20;
        
        // Main circle
        ctx.fillStyle = typeData.color;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner design based on type
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let symbol = '';
        switch (powerUp.type) {
            case 'speedBoost': symbol = '⚡'; break;
            case 'paddleGrow': symbol = '+'; break;
            case 'paddleShrink': symbol = '-'; break;
            case 'multiball': symbol = '●'; break;
            case 'slowMotion': symbol = '⏰'; break;
        }
        
        ctx.fillText(symbol, 0, 0);
        
        // Outer ring
        ctx.strokeStyle = typeData.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }

    // Get active power-ups for UI display
    getActivePowerUps() {
        return this.activePowerUps.map(powerUp => ({
            name: powerUp.name,
            beneficiary: powerUp.beneficiary,
            timeRemaining: Math.ceil(powerUp.timeRemaining / 1000),
            type: powerUp.type
        }));
    }

    // Clear all power-ups
    clear() {
        this.powerUps = [];
        this.activePowerUps = [];
        this.spawnTimer = 0;
    }

    // Enable/disable power-up system
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.clear();
        }
    }

    // Configuration
    setSpawnInterval(interval) {
        this.spawnInterval = interval;
    }

    // Get power-up statistics
    getStats() {
        return {
            activePowerUps: this.activePowerUps.length,
            availablePowerUps: this.powerUps.length,
            nextSpawnIn: Math.max(0, this.spawnInterval - this.spawnTimer),
            enabled: this.enabled
        };
    }

    // Reset system
    reset() {
        this.clear();
        this.spawnTimer = 0;
    }
}
