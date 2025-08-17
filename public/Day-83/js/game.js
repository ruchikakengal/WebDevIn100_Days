class PongGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu'; // menu, countdown, playing, paused, gameOver
        this.gameMode = 'single-player'; // single-player, two-player
        this.difficulty = 'medium';
        this.settings = {};

        // Game objects
        this.player1Paddle = null;
        this.player2Paddle = null;
        this.ball = null;
        this.ai = null;
        this.powerUpSystem = null;

        // Game state
        this.player1Score = 0;
        this.player2Score = 0;
        this.winningScore = 10;
        this.gameStartTime = 0;
        this.gameDuration = 0;
        this.totalHits = 0;
        this.maxBallSpeed = 0;

        // Countdown
        this.countdownTimer = 0;
        this.countdownValue = 3;

        // Animation
        this.lastTime = 0;
        this.animationId = null;
        this.isRunning = false;

        // Canvas dimensions
        this.canvasWidth = 800;
        this.canvasHeight = 450;

        // Theme
        this.theme = 'retro';

        // Statistics
        this.gameStats = {
            ballDistance: 0,
            wallBounces: 0,
            paddleHits: 0,
            powerUpsCollected: 0
        };

        this.initialize();
    }

    initialize() {
        // Get canvas and context
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Game canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');

        // Set initial canvas size
        this.resizeCanvas();

        // Initialize control callbacks
        this.setupControls();

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        console.log('Pong Game initialized');
    }

    setupControls() {
        window.controlSystem.setCallbacks({
            player1Up: (pressed) => {
                if (this.player1Paddle) {
                    this.player1Paddle.moveUp(pressed);
                }
            },
            player1Down: (pressed) => {
                if (this.player1Paddle) {
                    this.player1Paddle.moveDown(pressed);
                }
            },
            player2Up: (pressed) => {
                if (this.player2Paddle && this.gameMode === 'two-player') {
                    this.player2Paddle.moveUp(pressed);
                }
            },
            player2Down: (pressed) => {
                if (this.player2Paddle && this.gameMode === 'two-player') {
                    this.player2Paddle.moveDown(pressed);
                }
            },
            pause: () => {
                if (this.gameState === 'playing') {
                    this.togglePause();
                }
            },
            quit: () => {
                if (this.gameState === 'playing' || this.gameState === 'paused') {
                    this.quitGame();
                }
            }
        });
    }

    startNewGame(gameMode, difficulty, settings) {
        this.gameMode = gameMode;
        this.difficulty = difficulty || 'medium';
        this.settings = settings || gameStorage.loadSettings();
        this.theme = this.settings.theme || 'retro';
        this.winningScore = this.settings.winningScore || 10;

        // Reset scores and stats
        this.player1Score = 0;
        this.player2Score = 0;
        this.totalHits = 0;
        this.maxBallSpeed = 0;
        this.gameStats = {
            ballDistance: 0,
            wallBounces: 0,
            paddleHits: 0,
            powerUpsCollected: 0
        };

        // Update UI
        window.uiManager.updateScore(this.player1Score, this.player2Score);

        // Resize canvas for current viewport
        this.resizeCanvas();

        // Initialize game objects
        this.initializeGameObjects();

        // Start countdown
        this.startCountdown();

        // Record game start time
        this.gameStartTime = Date.now();

        console.log(`Starting new ${gameMode} game${difficulty ? ` (${difficulty})` : ''}`);
    }

    initializeGameObjects() {
        // Calculate paddle dimensions based on settings
        const paddleWidth = 10;
        const basePaddleHeight = 80;
        const paddleHeightMultiplier = [0.8, 1.0, 1.2][this.settings.paddleSize - 1] || 1.0;
        const paddleHeight = basePaddleHeight * paddleHeightMultiplier;

        // Create paddles
        const paddleColor = this.theme === 'neon' ? '#ff00ff' : '#ffffff';

        this.player1Paddle = new Paddle(
            30, 
            this.canvasHeight / 2 - paddleHeight / 2,
            paddleWidth,
            paddleHeight,
            paddleColor
        );

        this.player2Paddle = new Paddle(
            this.canvasWidth - 30 - paddleWidth,
            this.canvasHeight / 2 - paddleHeight / 2,
            paddleWidth,
            paddleHeight,
            paddleColor
        );

        // Create ball
        const ballRadius = 8;
        const ballColor = this.theme === 'neon' ? '#00ffff' : '#ffffff';

        this.ball = new Ball(
            this.canvasWidth / 2,
            this.canvasHeight / 2,
            ballRadius,
            ballColor
        );

        // Apply ball speed setting
        const baseSpeed = 5;
        const speedMultiplier = this.settings.ballSpeed / 3; // Normalized from 1-5 to speed multiplier
        this.ball.originalSpeed = baseSpeed * speedMultiplier;
        this.ball.speed = this.ball.originalSpeed;

        // Initialize AI if single player
        if (this.gameMode === 'single-player') {
            this.ai = new PongAI(this.difficulty);
        } else {
            this.ai = null;
        }

        // Initialize power-up system
        this.powerUpSystem = new PowerUpSystem();
        this.powerUpSystem.setEnabled(this.settings.powerupsEnabled || false);

        // Reset ball for serve
        this.resetBallForServe();
    }

    resetBallForServe() {
        // Reset ball to center with proper velocity
        const direction = Math.random() < 0.5 ? -1 : 1;
        this.ball.reset(
            this.canvasWidth / 2,
            this.canvasHeight / 2,
            direction
        );
        
        // Ensure ball has velocity immediately
        if (this.ball.vx === 0 && this.ball.vy === 0) {
            this.ball.vx = this.ball.speed * direction * 0.8;
            this.ball.vy = this.ball.speed * (Math.random() - 0.5) * 0.6;
        }
    }

    startCountdown() {
        this.gameState = 'countdown';
        this.countdownValue = 3;
        this.countdownTimer = 0;

        window.uiManager.showCountdown(this.countdownValue);
        window.audioSystem.playCountdown();

        if (!this.isRunning) {
            this.startGameLoop();
        }
    }

    startGameLoop() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update game based on state
        switch (this.gameState) {
            case 'countdown':
                this.updateCountdown(deltaTime);
                break;
            case 'playing':
                this.updateGame(deltaTime);
                break;
            case 'paused':
                // Don't update game logic when paused
                break;
        }

        // Always render
        this.render();

        // Continue loop
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    updateCountdown(deltaTime) {
        this.countdownTimer += deltaTime;

        if (this.countdownTimer >= 1.0) {
            this.countdownValue--;
            this.countdownTimer = 0;

            if (this.countdownValue > 0) {
                window.uiManager.showCountdown(this.countdownValue);
                window.audioSystem.playCountdown();
            } else {
                window.uiManager.showCountdown(0);
                this.gameState = 'playing';

                // Start background music if enabled
                if (this.settings.musicEnabled) {
                    window.audioSystem.startBackgroundMusic();
                }
            }
        }
    }

    updateGame(deltaTime) {
        // Update paddles
        this.player1Paddle.update(deltaTime, this.canvasHeight);
        this.player2Paddle.update(deltaTime, this.canvasHeight);

        // Update AI
        if (this.ai && this.gameMode === 'single-player') {
            this.ai.update(this.player2Paddle, this.ball, deltaTime, this.canvasHeight);
        }

        // Update ball
        const ballResult = this.ball.update(deltaTime, this.canvasWidth, this.canvasHeight);

        // Check for scoring
        if (ballResult.scored) {
            this.handleScoring(ballResult.scorer);
            return;
        }

        // Check paddle collisions
        this.checkPaddleCollisions();

        // Update power-ups
        if (this.powerUpSystem) {
            this.powerUpSystem.update(
                deltaTime, 
                this.canvasWidth, 
                this.canvasHeight,
                this.ball,
                this.player1Paddle,
                this.player2Paddle
            );

            // Update power-up display
            window.uiManager.updatePowerups(this.powerUpSystem.getActivePowerUps());
        }

        // Update statistics
        this.updateStatistics();

        // Update game duration
        this.gameDuration = Date.now() - this.gameStartTime;
    }

    checkPaddleCollisions() {
        // Check collision with player 1 paddle
        if (this.ball.handlePaddleCollision(this.player1Paddle, 'player1')) {
            this.totalHits++;
            this.gameStats.paddleHits++;
            window.audioSystem.playWallBounce();
        }

        // Check collision with player 2 paddle
        if (this.ball.handlePaddleCollision(this.player2Paddle, 'player2')) {
            this.totalHits++;
            this.gameStats.paddleHits++;
            window.audioSystem.playWallBounce();
        }
    }

    updateStatistics() {
        // Track max ball speed
        this.maxBallSpeed = Math.max(this.maxBallSpeed, this.ball.speed);

        // Track ball distance
        const ballStats = this.ball.getStats();
        this.gameStats.ballDistance = ballStats.totalDistance;
        this.gameStats.wallBounces = ballStats.bounceCount;
    }

    handleScoring(scorer) {
        // Update scores
        if (scorer === 'player1') {
            this.player1Score++;
        } else {
            this.player2Score++;
        }

        // Update UI
        window.uiManager.updateScore(this.player1Score, this.player2Score);

        // Play score sound
        window.audioSystem.playScore();

        // Check for game end
        if (this.player1Score >= this.winningScore || this.player2Score >= this.winningScore) {
            this.endGame();
        } else {
            // Reset for next serve
            this.resetBallForServe();
            this.startCountdown();
        }
    }

    endGame() {
        this.gameState = 'gameOver';
        this.isRunning = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Stop background music
        window.audioSystem.stopBackgroundMusic();

        // Play game over sound
        window.audioSystem.playGameOver();

        // Determine winner
        const winner = this.player1Score > this.player2Score ? 'Player 1' : 
                      (this.gameMode === 'single-player' ? 'AI' : 'Player 2');

        // Prepare game data for storage and display
        const gameData = {
            gameMode: this.gameMode,
            difficulty: this.difficulty,
            player1Score: this.player1Score,
            player2Score: this.player2Score,
            winner: winner,
            gameDuration: this.gameDuration,
            totalHits: this.totalHits,
            maxBallSpeed: this.maxBallSpeed,
            ballDistance: Math.round(this.gameStats.ballDistance),
            wallBounces: this.gameStats.wallBounces,
            paddleHits: this.gameStats.paddleHits
        };

        // Save score and update leaderboard
        gameStorage.saveScore(gameData);
        gameStorage.updateLeaderboard(gameData);

        // Show game over screen
        window.uiManager.showGameOver(gameData);

        console.log('Game ended:', gameData);
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = this.theme === 'neon' ? '#0a0a1a' : '#000000';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Render game objects if playing
        if (this.gameState === 'playing' || this.gameState === 'countdown') {
            // Render center line
            this.renderCenterLine();

            // Render paddles
            if (this.player1Paddle) {
                this.player1Paddle.render(this.ctx, this.theme);
            }
            if (this.player2Paddle) {
                this.player2Paddle.render(this.ctx, this.theme);
            }

            // Render ball
            if (this.ball) {
                this.ball.render(this.ctx, this.theme);
            }

            // Render power-ups
            if (this.powerUpSystem) {
                this.powerUpSystem.render(this.ctx, this.theme);
            }
        }
    }

    renderCenterLine() {
        this.ctx.strokeStyle = this.theme === 'neon' ? '#ff00ff' : '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.globalAlpha = 0.5;

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasWidth / 2, 0);
        this.ctx.lineTo(this.canvasWidth / 2, this.canvasHeight);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
        this.ctx.globalAlpha = 1;
    }

    resizeCanvas() {
        const dimensions = window.uiManager.resizeCanvas(this.canvas);
        this.canvasWidth = dimensions.width;
        this.canvasHeight = dimensions.height;

        // Update paddle bounds if they exist
        if (this.player1Paddle) {
            this.player1Paddle.bottomBound = this.canvasHeight - this.player1Paddle.height;
        }
        if (this.player2Paddle) {
            this.player2Paddle.bottomBound = this.canvasHeight - this.player2Paddle.height;
            this.player2Paddle.x = this.canvasWidth - 30 - this.player2Paddle.width;
        }
    }

    handleResize() {
        this.resizeCanvas();

        // Reposition game objects if they exist
        if (this.player2Paddle) {
            this.player2Paddle.x = this.canvasWidth - 30 - this.player2Paddle.width;
        }

        // Ensure ball is within bounds
        if (this.ball) {
            this.ball.x = Math.min(this.ball.x, this.canvasWidth - this.ball.radius);
            this.ball.y = Math.min(Math.max(this.ball.y, this.ball.radius), 
                                   this.canvasHeight - this.ball.radius);
        }
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            window.uiManager.showPauseScreen();
            window.audioSystem.stopBackgroundMusic();
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            window.uiManager.hidePauseScreen();
            if (this.settings.musicEnabled) {
                window.audioSystem.startBackgroundMusic();
            }
        }
    }

    restartGame() {
        console.log('Restarting game...');
        this.stopGame();
        
        // Small delay to ensure clean restart
        setTimeout(() => {
            this.startNewGame(this.gameMode, this.difficulty, this.settings);
        }, 100);
    }

    quitGame() {
        this.stopGame();
        window.uiManager.showScreen('main-menu');
    }

    stopGame() {
        this.isRunning = false;
        this.gameState = 'menu';

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Stop background music
        window.audioSystem.stopBackgroundMusic();

        // Clear power-ups
        if (this.powerUpSystem) {
            this.powerUpSystem.clear();
        }

        // Reset AI
        if (this.ai) {
            this.ai.reset();
        }

        // Release all controls
        window.controlSystem.releaseAllKeys();
        window.controlSystem.setTouchControlsEnabled(false);
    }

    // Get current game state for debugging
    getGameState() {
        return {
            state: this.gameState,
            mode: this.gameMode,
            difficulty: this.difficulty,
            scores: {
                player1: this.player1Score,
                player2: this.player2Score
            },
            ballSpeed: this.ball ? this.ball.speed : 0,
            totalHits: this.totalHits,
            gameDuration: this.gameDuration
        };
    }

    // Debug mode toggle
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log('Debug mode:', this.debugMode ? 'ON' : 'OFF');
    }

    // Performance monitoring
    getPerformanceInfo() {
        return {
            fps: Math.round(1000 / (performance.now() - this.lastTime)),
            canvasSize: `${this.canvasWidth}x${this.canvasHeight}`,
            gameObjects: {
                paddles: 2,
                balls: 1,
                powerUps: this.powerUpSystem ? this.powerUpSystem.powerUps.length : 0
            }
        };
    }
}

// Game initialization is handled in index.html

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.pongGame && window.pongGame.gameState === 'playing') {
        window.pongGame.togglePause();
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.pongGame) {
        window.pongGame.stopGame();
    }
});