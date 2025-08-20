class ArcheryGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.physics = new Physics();
        this.audio = new AudioManager();
        this.ui = new UIManager();
        
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.gameMode = null; // timeAttack, accuracy, endless
        this.level = 1;
        
        // Game objects
        this.bow = null;
        this.arrows = [];
        this.targets = [];
        this.particles = [];
        
        // Input handling
        this.mouse = { x: 0, y: 0, down: false };
        this.touch = { active: false, x: 0, y: 0 };
        this.isDragging = false;
        this.chargeStartTime = 0;
        this.currentPower = 0;
        
        // Game timing
        this.lastTime = 0;
        this.gameTimer = 0;
        this.arrowsRemaining = 10;
        
        // Animation frame
        this.animationId = null;
        
        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.createBow();
        this.gameLoop(0);
        
        // Make game globally accessible
        window.game = this;
    }

    /**
     * Setup canvas dimensions and properties
     */
    setupCanvas() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.updateBowPosition();
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Set canvas context properties
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    /**
     * Bind input events
     */
    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Create the bow object
     */
    createBow() {
        this.bow = {
            x: 100,
            y: this.canvas.height / 2,
            width: 80,
            height: 120,
            stringPull: 0,
            angle: 0,
            maxPull: 60
        };
    }

    /**
     * Update bow position when canvas resizes
     */
    updateBowPosition() {
        if (this.bow) {
            this.bow.y = this.canvas.height / 2;
        }
    }

    /**
     * Start a new game
     * @param {string} mode - Game mode
     */
    startGame(mode) {
        this.gameMode = mode;
        this.gameState = 'playing';
        this.level = 1;
        this.gameTimer = 0;
        
        // Reset game objects
        this.arrows = [];
        this.targets = [];
        this.particles = [];
        
        // Configure based on mode
        switch (mode) {
            case 'timeAttack':
                this.gameTimer = 60; // 60 seconds
                this.arrowsRemaining = Infinity;
                break;
            case 'accuracy':
                this.arrowsRemaining = 10;
                this.gameTimer = Infinity;
                break;
            case 'endless':
                this.arrowsRemaining = Infinity;
                this.gameTimer = Infinity;
                break;
        }
        
        this.spawnInitialTargets();
        this.physics.updateWindForLevel(this.level);
        this.ui.hideInstructions();
        this.audio.playSound('gameStart');
    }

    /**
     * Spawn initial targets for the level
     */
    spawnInitialTargets() {
        this.targets = [];
        const targetCount = Math.min(2 + this.level, 5);
        
        for (let i = 0; i < targetCount; i++) {
            this.spawnTarget();
        }
    }

    /**
     * Spawn a new target
     */
    spawnTarget() {
        const canvas = this.canvas;
        const baseRadius = Math.max(40, 70 - Math.min(this.level * 3, 25)); // Smaller targets at higher levels
        
        const target = {
            x: canvas.width * 0.6 + Math.random() * (canvas.width * 0.35),
            y: Math.max(baseRadius + 50, Math.min(canvas.height - baseRadius - 50, 
                100 + Math.random() * (canvas.height - 200))),
            radius: baseRadius,
            zones: [
                { name: 'bullseye', radius: baseRadius * 0.25, points: 100 },
                { name: 'inner', radius: baseRadius * 0.6, points: 50 },
                { name: 'outer', radius: baseRadius, points: 25 }
            ],
            movement: {
                type: this.level > 2 ? (Math.random() > 0.5 ? 'vertical' : 'horizontal') : 'static',
                speed: Math.min(30 + this.level * 8, 120), // pixels per second
                direction: Math.random() > 0.5 ? 1 : -1,
                bounds: {
                    minX: canvas.width * 0.5,
                    maxX: canvas.width - baseRadius - 20,
                    minY: baseRadius + 20,
                    maxY: canvas.height - baseRadius - 70
                }
            },
            hit: false,
            animationOffset: Math.random() * Math.PI * 2
        };
        
        this.targets.push(target);
    }

    /**
     * Handle mouse down event
     */
    handleMouseDown(e) {
        if (this.gameState !== 'playing') return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.down = true;
        
        this.startAiming();
    }

    /**
     * Handle mouse move event
     */
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        
        if (this.mouse.down) {
            this.updateAiming();
        }
    }

    /**
     * Handle mouse up event
     */
    handleMouseUp(e) {
        if (this.gameState !== 'playing' || !this.mouse.down) return;
        
        this.mouse.down = false;
        this.shootArrow();
    }

    /**
     * Handle touch start event
     */
    handleTouchStart(e) {
        e.preventDefault();
        if (this.gameState !== 'playing') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touch.x = touch.clientX - rect.left;
        this.touch.y = touch.clientY - rect.top;
        this.touch.active = true;
        
        this.mouse.x = this.touch.x;
        this.mouse.y = this.touch.y;
        this.mouse.down = true;
        
        this.startAiming();
    }

    /**
     * Handle touch move event
     */
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.touch.active) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touch.x = touch.clientX - rect.left;
        this.touch.y = touch.clientY - rect.top;
        
        this.mouse.x = this.touch.x;
        this.mouse.y = this.touch.y;
        
        this.updateAiming();
    }

    /**
     * Handle touch end event
     */
    handleTouchEnd(e) {
        e.preventDefault();
        if (!this.touch.active) return;
        
        this.touch.active = false;
        this.mouse.down = false;
        this.shootArrow();
    }

    /**
     * Start aiming process
     */
    startAiming() {
        if (this.gameState !== 'playing') return;
        this.isDragging = true;
        this.chargeStartTime = Date.now();
        this.currentPower = 0;
        this.audio.playSound('buttonClick');
    }

    /**
     * Update aiming during drag
     */
    updateAiming() {
        if (!this.isDragging) return;
        
        // Calculate aim angle
        const dx = this.mouse.x - this.bow.x;
        const dy = this.mouse.y - this.bow.y;
        this.bow.angle = Math.atan2(dy, dx);
        
        // Calculate power based on hold time and distance
        const holdTime = (Date.now() - this.chargeStartTime) / 1000;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const distancePower = Math.min(distance / 150, 1); // Distance-based power (reduced threshold)
        const timePower = Math.min(holdTime / 2.0, 1); // Time-based power (2 seconds for full power)
        this.currentPower = Math.max(distancePower * 0.7, timePower); // Favor time over distance
        
        // Update bow string pull
        this.bow.stringPull = this.currentPower * this.bow.maxPull;
        
        // Update UI
        this.ui.updatePowerMeter(this.currentPower, true);
        
        // Get predicted trajectory for aiming guide
        const initialVelocity = this.calculateInitialVelocity();
        const trajectory = this.physics.getPredictedTrajectory({
            x: this.bow.x + Math.cos(this.bow.angle) * 70,
            y: this.bow.y + Math.sin(this.bow.angle) * 70,
            vx: initialVelocity.vx,
            vy: initialVelocity.vy
        });
        
        this.ui.updateAimingGuide(this.mouse, trajectory, true);
        
        // Draw trajectory on canvas (additional visual aid)
        this.renderTrajectoryPreview(trajectory);
    }

    /**
     * Calculate initial velocity for arrow
     */
    calculateInitialVelocity() {
        const maxSpeed = 1200; // pixels per second (increased for longer range)
        const minSpeed = 200; // minimum speed
        const speed = minSpeed + (this.currentPower * (maxSpeed - minSpeed));
        
        return {
            vx: Math.cos(this.bow.angle) * speed,
            vy: Math.sin(this.bow.angle) * speed
        };
    }

    /**
     * Shoot an arrow
     */
    shootArrow() {
        if (!this.isDragging || this.currentPower < 0.05) {
            this.cancelAiming();
            return;
        }
        
        const velocity = this.calculateInitialVelocity();
        
        const arrow = {
            x: this.bow.x + Math.cos(this.bow.angle) * 70,
            y: this.bow.y + Math.sin(this.bow.angle) * 70,
            vx: velocity.vx,
            vy: velocity.vy,
            rotation: this.bow.angle,
            active: true,
            trailPoints: [],
            timeAlive: 0,
            speed: Math.sqrt(velocity.vx * velocity.vx + velocity.vy * velocity.vy)
        };
        
        this.arrows.push(arrow);
        
        // Update game state
        if (this.arrowsRemaining !== Infinity) {
            this.arrowsRemaining--;
            this.ui.updateArrows(this.arrowsRemaining);
        }
        
        // Play sound and hide UI elements
        this.audio.playSound('bowRelease');
        this.cancelAiming();
        
        // Check for game over conditions
        if (this.gameMode === 'accuracy' && this.arrowsRemaining <= 0) {
            setTimeout(() => this.checkGameOver(), 3000); // Wait for arrow to finish
        }
    }

    /**
     * Cancel aiming process
     */
    cancelAiming() {
        this.isDragging = false;
        this.bow.stringPull = 0;
        this.ui.updatePowerMeter(0, false);
        this.ui.updateAimingGuide({}, [], false);
    }

    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        if (this.gameState === 'playing') {
            this.update(deltaTime);
        }
        
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        // Update game timer
        if (this.gameMode === 'timeAttack' && this.gameTimer > 0) {
            this.gameTimer -= deltaTime;
            this.ui.updateTimer(Math.max(0, this.gameTimer));
            
            if (this.gameTimer <= 0) {
                this.endGame();
                return;
            }
        }
        
        // Update arrows
        this.updateArrows(deltaTime);
        
        // Update targets
        this.updateTargets(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Check for level progression
        this.checkLevelProgression();
        
        // Update wind indicator
        const windDisplay = this.physics.getWindDisplay();
        this.ui.updateWindIndicator(windDisplay);
    }

    /**
     * Update arrow physics and collisions
     */
    updateArrows(deltaTime) {
        for (let i = this.arrows.length - 1; i >= 0; i--) {
            const arrow = this.arrows[i];
            if (!arrow.active) continue;
            
            arrow.timeAlive += deltaTime;
            
            // Store previous position for trail
            arrow.trailPoints.push({ x: arrow.x, y: arrow.y });
            if (arrow.trailPoints.length > 8) {
                arrow.trailPoints.shift();
            }
            
            // Apply forces
            arrow.vx += this.physics.wind.x * deltaTime * 20;
            arrow.vy += this.physics.wind.y * deltaTime * 20 + this.physics.gravity * deltaTime;
            
            // Apply air resistance (reduced for better flight)
            arrow.vx *= Math.max(0.2, 1 - this.physics.airResistance * deltaTime * 3);
            arrow.vy *= Math.max(0.2, 1 - this.physics.airResistance * deltaTime * 2);
            
            // Update position
            arrow.x += arrow.vx * deltaTime;
            arrow.y += arrow.vy * deltaTime;
            arrow.rotation = this.physics.calculateArrowRotation(arrow.vx, arrow.vy);
            
            // Check target collisions
            let hit = false;
            for (const target of this.targets) {
                if (target.hit) continue;
                
                const collision = this.physics.checkTargetCollision(arrow, target);
                if (collision) {
                    this.handleTargetHit(target, collision, arrow);
                    arrow.active = false;
                    hit = true;
                    break;
                }
            }
            
            // Check boundaries or time limit
            if (!hit && (this.physics.isOutOfBounds(arrow, { width: this.canvas.width * 1.5, height: this.canvas.height }) || arrow.timeAlive > 15)) {
                arrow.active = false;
                if (arrow.x < this.canvas.width && arrow.y < this.canvas.height) {
                    this.handleMiss(arrow);
                }
            }
            
            // Remove inactive arrows
            if (!arrow.active) {
                this.arrows.splice(i, 1);
            }
        }
    }

    /**
     * Update target positions and animations
     */
    updateTargets(deltaTime) {
        for (const target of this.targets) {
            if (target.hit) continue;
            
            // Update movement
            if (target.movement.type === 'vertical') {
                target.y += target.movement.speed * target.movement.direction * deltaTime;
                
                if (target.y <= target.movement.bounds.minY || target.y >= target.movement.bounds.maxY) {
                    target.movement.direction *= -1;
                }
            } else if (target.movement.type === 'horizontal') {
                target.x += target.movement.speed * target.movement.direction * deltaTime;
                
                if (target.x <= target.movement.bounds.minX || target.x >= target.movement.bounds.maxX) {
                    target.movement.direction *= -1;
                }
            }
            
            // Update animation
            target.animationOffset += deltaTime * 2;
        }
    }

    /**
     * Update particle effects
     */
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += 200 * deltaTime; // Gravity
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Handle target hit
     */
    handleTargetHit(target, collision, arrow) {
        target.hit = true;
        
        // Add score
        this.ui.addScore(collision.points, collision.zone);
        
        // Show hit effect
        const screenPos = { x: target.x, y: target.y };
        this.ui.showHitEffect(screenPos, collision.zone, collision.points);
        
        // Create particles
        const particles = this.physics.createHitExplosion(target, collision.zone);
        this.particles.push(...particles);
        
        // Play appropriate sound
        if (collision.zone === 'bullseye') {
            this.audio.playSound('hitBullseye');
            this.audio.playSound('crowdCheer');
        } else if (collision.zone === 'inner') {
            this.audio.playSound('hitInner');
        } else {
            this.audio.playSound('hitOuter');
        }
        
        // Spawn new target after delay
        setTimeout(() => {
            this.spawnTarget();
            this.targets.splice(this.targets.indexOf(target), 1);
        }, 1000);
    }

    /**
     * Handle arrow miss
     */
    handleMiss(arrow) {
        this.ui.addScore(0, 'miss');
        this.audio.playSound('miss');
        
        // Check for endless mode game over
        if (this.gameMode === 'endless') {
            this.endGame();
        }
    }

    /**
     * Check for level progression
     */
    checkLevelProgression() {
        const stats = this.ui.getStats();
        const scoreThreshold = this.level * 500;
        
        if (stats.score >= scoreThreshold) {
            this.level++;
            this.ui.updateLevel(this.level);
            this.physics.updateWindForLevel(this.level);
            
            // Increase difficulty
            this.spawnTarget(); // Add an extra target
        }
    }

    /**
     * Check if game should end
     */
    checkGameOver() {
        let shouldEnd = false;
        
        if (this.gameMode === 'timeAttack' && this.gameTimer <= 0) {
            shouldEnd = true;
        } else if (this.gameMode === 'accuracy' && this.arrowsRemaining <= 0) {
            shouldEnd = true;
        }
        
        if (shouldEnd) {
            this.endGame();
        }
    }

    /**
     * End the current game
     */
    endGame() {
        this.gameState = 'gameOver';
        const stats = this.ui.getStats();
        
        // Save score and check for new record
        const isNewRecord = this.ui.saveScore(this.gameMode, stats);
        
        if (isNewRecord) {
            this.audio.playSound('newRecord');
        } else {
            this.audio.playSound('gameOver');
        }
        
        // Show game over screen
        setTimeout(() => {
            this.ui.showGameOver(stats, isNewRecord);
        }, 1000);
    }

    /**
     * Render the game
     */
    render() {
        this.clearCanvas();
        
        if (this.gameState === 'playing' || this.gameState === 'paused') {
            this.renderBackground();
            this.renderTargets();
            this.renderArrows();
            this.renderBow();
            this.renderParticles();
            
            // Render trajectory preview if aiming
            if (this.isDragging) {
                this.renderAimingHelpers();
            }
        } else if (this.gameState === 'menu') {
            this.renderMenuBackground();
        }
    }

    /**
     * Render aiming helpers
     */
    renderAimingHelpers() {
        // Draw power arc around bow
        this.ctx.save();
        this.ctx.translate(this.bow.x, this.bow.y);
        
        // Power indicator arc
        this.ctx.strokeStyle = `rgba(255, 255, 0, ${this.currentPower * 0.8})`;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 80 + this.currentPower * 20, 0, Math.PI * 2 * this.currentPower);
        this.ctx.stroke();
        
        // Aim direction line
        if (this.currentPower > 0.1) {
            this.ctx.strokeStyle = `rgba(255, 0, 0, 0.6)`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(this.bow.angle) * (100 + this.currentPower * 100), 
                           Math.sin(this.bow.angle) * (100 + this.currentPower * 100));
            this.ctx.stroke();
            
            // Aim point dot
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(Math.cos(this.bow.angle) * (100 + this.currentPower * 100),
                        Math.sin(this.bow.angle) * (100 + this.currentPower * 100), 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }

    /**
     * Render trajectory preview on canvas
     */
    renderTrajectoryPreview(trajectory) {
        if (trajectory.length < 2 || this.currentPower < 0.2) return;
        
        this.ctx.save();
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${Math.min(this.currentPower, 0.6)})`;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(trajectory[0].x, trajectory[0].y);
        
        for (let i = 1; i < Math.min(trajectory.length, 15); i++) {
            this.ctx.lineTo(trajectory[i].x, trajectory[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw trajectory dots
        for (let i = 0; i < Math.min(trajectory.length, 10); i += 2) {
            const point = trajectory[i];
            const alpha = 1 - (i / 10);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }

    /**
     * Render menu background
     */
    renderMenuBackground() {
        // Simple background for menu state
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.4, '#98FB98');
        gradient.addColorStop(1, '#90EE90');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Clear the canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Render background
     */
    renderBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.4, '#98FB98');
        gradient.addColorStop(1, '#90EE90');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
        
        // Grass
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.canvas.height - 60, this.canvas.width, 20);
    }

    /**
     * Render all targets
     */
    renderTargets() {
        for (const target of this.targets) {
            this.renderTarget(target);
        }
    }

    /**
     * Render a single target
     */
    renderTarget(target) {
        this.ctx.save();
        this.ctx.translate(target.x, target.y);
        
        // Add slight animation if not hit
        if (!target.hit) {
            const wobble = Math.sin(target.animationOffset) * 1.5;
            const scale = 1 + Math.sin(target.animationOffset * 0.5) * 0.02;
            this.ctx.translate(wobble, 0);
            this.ctx.scale(scale, scale);
        }
        
        // Draw target stand/pole
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-3, target.radius, 6, 40);
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(-8, target.radius + 35, 16, 10);
        
        // Draw target zones (from outside to inside) with better colors
        const zones = [...target.zones].reverse();
        const colors = ['#ff4444', '#ffffff', '#4444ff', '#ffff00']; // Red, White, Blue, Gold
        const strokeColors = ['#cc0000', '#cccccc', '#0000cc', '#ccaa00'];
        
        zones.forEach((zone, index) => {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, zone.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = colors[index] || '#ff4444';
            this.ctx.fill();
            this.ctx.strokeStyle = strokeColors[index] || '#000000';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // Add scoring rings
            if (index < zones.length - 1) {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, zone.radius - 3, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
        
        // Draw center dot and crosshairs
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        
        // Crosshairs
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(-8, 0);
        this.ctx.lineTo(8, 0);
        this.ctx.moveTo(0, -8);
        this.ctx.lineTo(0, 8);
        this.ctx.stroke();
        
        // Target hit effect
        if (target.hit) {
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(0, 0, target.radius + 10, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        this.ctx.restore();
    }

    /**
     * Render all arrows
     */
    renderArrows() {
        for (const arrow of this.arrows) {
            this.renderArrow(arrow);
        }
    }

    /**
     * Render a single arrow
     */
    renderArrow(arrow) {
        // Draw enhanced trail
        if (arrow.trailPoints.length > 1) {
            for (let i = 0; i < arrow.trailPoints.length - 1; i++) {
                const alpha = i / arrow.trailPoints.length;
                const width = 3 * alpha;
                this.ctx.strokeStyle = `rgba(255, ${200 - i * 20}, 0, ${alpha * 0.8})`;
                this.ctx.lineWidth = width;
                this.ctx.beginPath();
                this.ctx.moveTo(arrow.trailPoints[i].x, arrow.trailPoints[i].y);
                this.ctx.lineTo(arrow.trailPoints[i + 1].x, arrow.trailPoints[i + 1].y);
                this.ctx.stroke();
            }
        }
        
        // Draw arrow
        this.ctx.save();
        this.ctx.translate(arrow.x, arrow.y);
        this.ctx.rotate(arrow.rotation);
        
        // Arrow shaft
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-25, -2, 35, 4);
        
        // Arrow head
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.beginPath();
        this.ctx.moveTo(12, 0);
        this.ctx.lineTo(0, -5);
        this.ctx.lineTo(0, 5);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Fletching
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.moveTo(-25, 0);
        this.ctx.lineTo(-30, -4);
        this.ctx.lineTo(-28, 0);
        this.ctx.lineTo(-30, 4);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * Render the bow
     */
    renderBow() {
        this.ctx.save();
        this.ctx.translate(this.bow.x, this.bow.y);
        this.ctx.rotate(this.bow.angle);
        
        // Bow limbs (enhanced appearance)
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = 'round';
        
        // Upper limb
        this.ctx.beginPath();
        this.ctx.moveTo(0, -50);
        this.ctx.quadraticCurveTo(-15, -35, -8, 0);
        this.ctx.stroke();
        
        // Lower limb
        this.ctx.beginPath();
        this.ctx.moveTo(0, 50);
        this.ctx.quadraticCurveTo(-15, 35, -8, 0);
        this.ctx.stroke();
        
        // Bow decorations
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -50);
        this.ctx.quadraticCurveTo(-12, -32, -6, 0);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, 50);
        this.ctx.quadraticCurveTo(-12, 32, -6, 0);
        this.ctx.stroke();
        
        // Bow string
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        if (this.bow.stringPull > 0) {
            // Pulled string with curve
            const pullX = -this.bow.stringPull;
            this.ctx.moveTo(0, -50);
            this.ctx.quadraticCurveTo(pullX - 5, 0, pullX, 0);
            this.ctx.quadraticCurveTo(pullX - 5, 0, 0, 50);
        } else {
            // Relaxed string
            this.ctx.moveTo(0, -50);
            this.ctx.lineTo(-8, 0);
            this.ctx.lineTo(0, 50);
        }
        this.ctx.stroke();
        
        // Enhanced grip
        this.ctx.fillStyle = '#4A4A4A';
        this.ctx.fillRect(-12, -15, 8, 30);
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(-10, -12, 4, 24);
        
        // Arrow rest (if aiming)
        if (this.isDragging) {
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(-this.bow.stringPull, 0, 3, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    /**
     * Render particle effects
     */
    renderParticles() {
        for (const particle of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    /**
     * Pause the game
     */
    pause() {
        this.gameState = 'paused';
    }

    /**
     * Resume the game
     */
    resume() {
        this.gameState = 'playing';
        this.lastTime = performance.now();
    }

    /**
     * Restart the current game
     */
    restart() {
        this.startGame(this.gameMode);
    }

    /**
     * Stop the game and return to menu
     */
    stop() {
        this.gameState = 'menu';
        this.arrows = [];
        this.targets = [];
        this.particles = [];
        this.cancelAiming();
        this.ui.showInstructions();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new ArcheryGame();
        console.log('🏹 Archery Master Game Ready!');
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});
