// Game variables
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // UI elements
        const startScreen = document.getElementById('startScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const levelCompleteScreen = document.getElementById('levelCompleteScreen');
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        const nextLevelButton = document.getElementById('nextLevelButton');
        const scoreDisplay = document.getElementById('score');
        const levelDisplay = document.getElementById('level');
        const livesDisplay = document.getElementById('lives');
        const finalScoreDisplay = document.getElementById('finalScore');
        
        // Game state
        let gameRunning = false;
        let score = 0;
        let level = 1;
        let lives = 3;
        
        // Paddle properties
        const paddleHeight = 15;
        const paddleWidth = 100;
        let paddleX = (canvas.width - paddleWidth) / 2;
        let paddleSpeed = 8;
        let paddleGlow = 0;
        
        // Ball properties
        const ballRadius = 10;
        let ballX = canvas.width / 2;
        let ballY = canvas.height - 30;
        let ballSpeedX = 5;
        let ballSpeedY = -5;
        let ballGlow = 0;
        
        // Brick properties
        const brickRowCount = 5;
        const brickColumnCount = 9;
        const brickWidth = 75;
        const brickHeight = 20;
        const brickPadding = 10;
        const brickOffsetTop = 60;
        const brickOffsetLeft = 35;
        
        // Create bricks
        const bricks = [];
        const brickColors = ['#ff00ff', '#7e42ff', '#00ffff', '#ff9900', '#ff0066'];
        
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                const color = brickColors[r % brickColors.length];
                
                bricks[c][r] = { 
                    x: brickX, 
                    y: brickY, 
                    status: 1, 
                    color: color,
                    glow: 0
                };
            }
        }
        
        // Initialize game
        function initGame() {
            score = 0;
            level = 1;
            lives = 3;
            paddleX = (canvas.width - paddleWidth) / 2;
            resetBall();
            generateBricks();
            updateDisplays();
        }
        
        // Generate bricks based on current level
        function generateBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    const color = brickColors[(r + level - 1) % brickColors.length];
                    
                    bricks[c][r] = { 
                        x: brickX, 
                        y: brickY, 
                        status: 1, 
                        color: color,
                        glow: 0
                    };
                }
            }
        }
        
        // Reset ball position and speed
        function resetBall() {
            ballX = canvas.width / 2;
            ballY = canvas.height - 30;
            ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
            ballSpeedY = -5;
        }
        
        // Update score, level, and lives displays
        function updateDisplays() {
            scoreDisplay.textContent = score;
            levelDisplay.textContent = level;
            livesDisplay.textContent = lives;
        }
        
        // Draw the paddle with neon effect
        function drawPaddle() {
            // Draw glow
            if (paddleGlow > 0) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#7e42ff';
                ctx.fillStyle = '#7e42ff';
                ctx.beginPath();
                ctx.roundRect(paddleX - 5, canvas.height - paddleHeight - 5, paddleWidth + 10, paddleHeight + 10, 10);
                ctx.fill();
                paddleGlow -= 0.5;
            }
            
            // Draw paddle
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff00ff';
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 7);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Draw the ball with neon effect
        function drawBall() {
            // Draw glow
            if (ballGlow > 0) {
                ctx.shadowBlur = 25;
                ctx.shadowColor = '#00ffff';
                ctx.fillStyle = '#00ffff';
                ctx.beginPath();
                ctx.arc(ballX, ballY, ballRadius + 5, 0, Math.PI * 2);
                ctx.fill();
                ballGlow -= 0.5;
            }
            
            // Draw ball
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffff';
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Draw bricks with neon effect
        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        const brick = bricks[c][r];
                        
                        // Draw glow if activated
                        if (brick.glow > 0) {
                            ctx.shadowBlur = 20;
                            ctx.shadowColor = brick.color;
                            ctx.fillStyle = brick.color;
                            ctx.beginPath();
                            ctx.roundRect(brick.x - 3, brick.y - 3, brickWidth + 6, brickHeight + 6, 5);
                            ctx.fill();
                            brick.glow -= 0.5;
                        }
                        
                        // Draw brick
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = brick.color;
                        ctx.fillStyle = brick.color;
                        ctx.beginPath();
                        ctx.roundRect(brick.x, brick.y, brickWidth, brickHeight, 5);
                        ctx.fill();
                    }
                }
            }
            ctx.shadowBlur = 0;
        }
        
        // Draw particle effects
        function drawParticles() {
            // This would be implemented for brick break effects
        }
        
        // Check for collisions
        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const brick = bricks[c][r];
                    if (brick.status === 1) {
                        if (ballX > brick.x && 
                            ballX < brick.x + brickWidth && 
                            ballY > brick.y && 
                            ballY < brick.y + brickHeight) {
                            ballSpeedY = -ballSpeedY;
                            brick.status = 0;
                            brick.glow = 10;
                            score += 10;
                            ballGlow = 10;
                            updateDisplays();
                            
                            // Check if all bricks are broken
                            if (checkLevelComplete()) {
                                levelComplete();
                            }
                        }
                    }
                }
            }
        }
        
        // Check if all bricks are broken
        function checkLevelComplete() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        // Handle level completion
        function levelComplete() {
            gameRunning = false;
            levelCompleteScreen.classList.remove('hidden');
        }
        
        // Move to next level
        function nextLevel() {
            level++;
            generateBricks();
            resetBall();
            updateDisplays();
            levelCompleteScreen.classList.add('hidden');
            gameRunning = true;
            requestAnimationFrame(draw);
        }
        
        // Main draw function
        function draw() {
            if (!gameRunning) return;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw game elements
            drawBricks();
            drawPaddle();
            drawBall();
            drawParticles();
            
            // Detect collisions
            collisionDetection();
            
            // Wall collisions
            if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
                ballSpeedX = -ballSpeedX;
                ballGlow = 10;
            }
            
            if (ballY + ballSpeedY < ballRadius) {
                ballSpeedY = -ballSpeedY;
                ballGlow = 10;
            } else if (ballY + ballSpeedY > canvas.height - ballRadius - paddleHeight) {
                if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                    ballSpeedY = -ballSpeedY;
                    paddleGlow = 10;
                    ballGlow = 10;
                    
                    // Add some angle variation based on where the ball hits the paddle
                    const deltaX = ballX - (paddleX + paddleWidth/2);
                    ballSpeedX = deltaX * 0.2;
                } else if (ballY + ballSpeedY > canvas.height) {
                    // Ball missed the paddle
                    lives--;
                    updateDisplays();
                    
                    if (lives <= 0) {
                        gameOver();
                    } else {
                        resetBall();
                    }
                }
            }
            
            // Move the ball
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            
            // Continue animation
            requestAnimationFrame(draw);
        }
        
        // Game over function
        function gameOver() {
            gameRunning = false;
            finalScoreDisplay.textContent = score;
            gameOverScreen.classList.remove('hidden');
        }
        
        // Handle keyboard input
        function keyDownHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = true;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = true;
            }
        }
        
        function keyUpHandler(e) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = false;
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = false;
            }
        }
        
        // Handle mouse movement
        function mouseMoveHandler(e) {
            if (!gameRunning) return;
            
            const relativeX = e.clientX - canvas.getBoundingClientRect().left;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
                
                // Constrain paddle position
                if (paddleX < 0) {
                    paddleX = 0;
                } else if (paddleX > canvas.width - paddleWidth) {
                    paddleX = canvas.width - paddleWidth;
                }
            }
        }
        
        // Initialize event listeners
        let rightPressed = false;
        let leftPressed = false;
        
        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);
        document.addEventListener("mousemove", mouseMoveHandler);
        
        startButton.addEventListener("click", function() {
            startScreen.classList.add("hidden");
            initGame();
            gameRunning = true;
            requestAnimationFrame(draw);
        });
        
        restartButton.addEventListener("click", function() {
            gameOverScreen.classList.add("hidden");
            initGame();
            gameRunning = true;
            requestAnimationFrame(draw);
        });
        
        nextLevelButton.addEventListener("click", nextLevel);
        
        // Add rounded rect function to CanvasRenderingContext2D
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                if (width < 2 * radius) radius = width / 2;
                if (height < 2 * radius) radius = height / 2;
                
                this.beginPath();
                this.moveTo(x + radius, y);
                this.arcTo(x + width, y, x + width, y + height, radius);
                this.arcTo(x + width, y + height, x, y + height, radius);
                this.arcTo(x, y + height, x, y, radius);
                this.arcTo(x, y, x + width, y, radius);
                this.closePath();
                return this;
            };
        }