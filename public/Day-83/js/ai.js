class PongAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.paddle = null;
        this.ball = null;
        
        // AI parameters based on difficulty
        this.setDifficulty(difficulty);
        
        // AI state
        this.targetY = 0;
        this.reactionTime = 0;
        this.lastUpdate = 0;
        this.errorOffset = 0;
        this.errorChangeTime = 0;
        
        // Prediction system
        this.predictedBallY = 0;
        this.predictionConfidence = 1;
        
        // Strategy
        this.isDefensive = false;
        this.aggressionLevel = 0.5;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        switch (difficulty) {
            case 'easy':
                this.reactionSpeed = 0.3;        // Slow reaction
                this.accuracy = 0.6;             // 60% accuracy
                this.predictionDepth = 0.2;      // Poor prediction
                this.maxSpeed = 0.6;             // Slow movement
                this.errorFrequency = 0.8;       // High error rate
                this.adaptability = 0.2;         // Low learning
                break;
                
            case 'medium':
                this.reactionSpeed = 0.6;        // Moderate reaction
                this.accuracy = 0.8;             // 80% accuracy
                this.predictionDepth = 0.5;      // Decent prediction
                this.maxSpeed = 0.8;             // Normal movement
                this.errorFrequency = 0.4;       // Moderate errors
                this.adaptability = 0.5;         // Some learning
                break;
                
            case 'hard':
                this.reactionSpeed = 0.95;       // Fast reaction
                this.accuracy = 0.95;            // 95% accuracy
                this.predictionDepth = 0.9;      // Excellent prediction
                this.maxSpeed = 1.0;             // Full speed
                this.errorFrequency = 0.1;       // Few errors
                this.adaptability = 0.8;         // High learning
                break;
        }
    }

    update(paddle, ball, deltaTime, canvasHeight) {
        this.paddle = paddle;
        this.ball = ball;
        
        const currentTime = Date.now();
        
        // Update reaction time
        if (currentTime - this.lastUpdate > this.reactionSpeed * 1000) {
            this.calculateTarget(canvasHeight);
            this.lastUpdate = currentTime;
        }
        
        // Update error offset periodically
        if (currentTime - this.errorChangeTime > 1000 + Math.random() * 2000) {
            this.updateErrorOffset();
            this.errorChangeTime = currentTime;
        }
        
        // Move paddle towards target
        this.movePaddle(deltaTime);
        
        // Update strategy
        this.updateStrategy();
    }

    calculateTarget(canvasHeight) {
        if (!this.ball || !this.paddle) return;
        
        const ballState = this.ball.getState();
        const paddleState = this.paddle.getState();
        
        // Predict where the ball will be when it reaches the paddle
        const predictedPosition = this.predictBallPosition(ballState, paddleState, canvasHeight);
        
        // Apply accuracy modifier
        let targetY = predictedPosition.y;
        
        // Add strategic positioning
        targetY = this.applyStrategy(targetY, ballState, canvasHeight);
        
        // Add error based on difficulty
        targetY = this.applyError(targetY, canvasHeight);
        
        // Store target
        this.targetY = targetY;
        this.predictedBallY = predictedPosition.y;
    }

    predictBallPosition(ballState, paddleState, canvasHeight) {
        let ballX = ballState.x;
        let ballY = ballState.y;
        let ballVX = ballState.vx;
        let ballVY = ballState.vy;
        
        // Simple prediction: calculate when ball will reach paddle X position
        const paddleX = paddleState.x;
        const timeToReachPaddle = Math.abs((paddleX - ballX) / ballVX);
        
        // Account for wall bounces during prediction
        let predictedY = ballY + ballVY * timeToReachPaddle;
        
        // Simple wall bounce prediction
        while (predictedY < 0 || predictedY > canvasHeight) {
            if (predictedY < 0) {
                predictedY = -predictedY;
                ballVY = Math.abs(ballVY);
            } else if (predictedY > canvasHeight) {
                predictedY = 2 * canvasHeight - predictedY;
                ballVY = -Math.abs(ballVY);
            }
        }
        
        // Apply prediction confidence based on difficulty
        const confidence = this.predictionDepth;
        const fallback = ballY + ballVY * 0.5; // Simple fallback prediction
        
        predictedY = predictedY * confidence + fallback * (1 - confidence);
        
        return { x: paddleX, y: predictedY };
    }

    applyStrategy(targetY, ballState, canvasHeight) {
        // Defensive strategy: stay centered when ball is moving away
        if (this.isDefensive && this.isBallMovingAway(ballState)) {
            const centerY = canvasHeight / 2;
            const defensiveWeight = 0.3;
            targetY = targetY * (1 - defensiveWeight) + centerY * defensiveWeight;
        }
        
        // Aggressive strategy: anticipate return angles
        if (this.aggressionLevel > 0.5) {
            const paddleCenter = this.paddle.getCenterY();
            const anticipationOffset = (ballState.vy > 0 ? 20 : -20) * this.aggressionLevel;
            targetY += anticipationOffset;
        }
        
        return targetY;
    }

    applyError(targetY, canvasHeight) {
        // Add random error based on difficulty
        if (Math.random() < this.errorFrequency) {
            const maxError = (1 - this.accuracy) * 100;
            const error = (Math.random() - 0.5) * maxError;
            targetY += error;
        }
        
        // Add persistent error offset
        targetY += this.errorOffset;
        
        // Ensure target is within bounds
        return Math.max(this.paddle.height / 2, 
                Math.min(canvasHeight - this.paddle.height / 2, targetY));
    }

    updateErrorOffset() {
        // Update persistent error for more realistic AI behavior
        const maxOffset = (1 - this.accuracy) * 50;
        this.errorOffset = (Math.random() - 0.5) * maxOffset;
    }

    movePaddle(deltaTime) {
        if (!this.paddle) return;
        
        const paddleCenter = this.paddle.getCenterY();
        const distance = this.targetY - paddleCenter;
        const moveThreshold = 5;
        
        if (Math.abs(distance) > moveThreshold) {
            // Calculate movement speed based on urgency and difficulty
            const urgency = Math.min(Math.abs(distance) / 100, 1);
            const speed = this.maxSpeed * urgency;
            
            // Use paddle's moveTowards method for smooth movement
            this.paddle.moveTowards(this.targetY, speed);
        } else {
            // Small movements for fine positioning
            this.paddle.moveTowards(this.targetY, 0.3);
        }
    }

    updateStrategy() {
        if (!this.ball) return;
        
        const ballState = this.ball.getState();
        
        // Adapt strategy based on ball speed
        if (ballState.speed > 10) {
            this.isDefensive = true;
            this.aggressionLevel = 0.3;
        } else {
            this.isDefensive = false;
            this.aggressionLevel = 0.7;
        }
        
        // Learn from recent hits (simple adaptation)
        if (this.adaptability > 0.5) {
            this.adaptToGameplay();
        }
    }

    adaptToGameplay() {
        // Simple learning: adjust accuracy based on performance
        // This is a placeholder for more sophisticated learning algorithms
        
        if (this.ball.paddleHits > 10) {
            // Increase accuracy slightly over time (learning effect)
            this.accuracy = Math.min(0.98, this.accuracy + 0.01 * this.adaptability);
        }
    }

    isBallMovingAway(ballState) {
        // Check if ball is moving away from the AI paddle
        const paddleX = this.paddle.x;
        const ballX = ballState.x;
        const ballVX = ballState.vx;
        
        // AI paddle is on the right side
        if (paddleX > 400) {
            return ballVX < 0; // Ball moving left (away)
        } else {
            return ballVX > 0; // Ball moving right (away)
        }
    }

    // Advanced AI behaviors for different difficulties
    getHitStrategy(ballRelativeY) {
        switch (this.difficulty) {
            case 'easy':
                // Easy AI: simple returns, mostly straight
                return ballRelativeY * 0.3;
                
            case 'medium':
                // Medium AI: some angle variation
                return ballRelativeY * 0.6 + (Math.random() - 0.5) * 0.2;
                
            case 'hard':
                // Hard AI: strategic returns
                const strategy = Math.random();
                if (strategy < 0.3) {
                    // Sharp angle return
                    return ballRelativeY * 0.9;
                } else if (strategy < 0.6) {
                    // Opposite corner shot
                    return -ballRelativeY * 0.7;
                } else {
                    // Straight power shot
                    return ballRelativeY * 0.1;
                }
        }
    }

    // Debug information
    getDebugInfo() {
        return {
            difficulty: this.difficulty,
            targetY: Math.round(this.targetY),
            predictedBallY: Math.round(this.predictedBallY),
            errorOffset: Math.round(this.errorOffset),
            accuracy: this.accuracy,
            isDefensive: this.isDefensive,
            aggressionLevel: this.aggressionLevel
        };
    }

    // Reset AI state
    reset() {
        this.targetY = 0;
        this.reactionTime = 0;
        this.lastUpdate = 0;
        this.errorOffset = 0;
        this.errorChangeTime = 0;
        this.predictedBallY = 0;
        this.predictionConfidence = 1;
        this.isDefensive = false;
        this.aggressionLevel = 0.5;
        
        // Reset difficulty-based parameters
        this.setDifficulty(this.difficulty);
    }
}
