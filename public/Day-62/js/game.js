class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.state = 'start'; // start, playing, paused, gameOver, levelComplete
        this.score = 0;
        this.lives = 3;
        this.timer = 300;
        this.level = 1;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.collectibles = [];
        this.platforms = [];
        
        // Camera
        this.camera = { x: 0, y: 0 };
        this.scrollSpeed = 2;
        
        // Background layers for parallax
        this.backgroundLayers = [
            { x: 0, speed: 0.2, color: '#87CEEB' },
            { x: 0, speed: 0.5, color: '#98FB98' },
            { x: 0, speed: 1, color: '#90EE90' }
        ];
        
        // Particle system for visual effects
        this.particles = [];
        
        // Game loop
        this.lastTime = 0;
        this.gameRunning = false;
        
        // Initialize systems
        this.physics = new Physics();
        this.input = new Input();
        this.audio = new AudioManager();
        this.ui = new UIManager();
        this.levelManager = new LevelManager();
        
        this.init();
    }
    
    init() {
        console.log('Initializing game...');
        
        // Setup canvas for crisp pixel art
        this.ctx.imageSmoothingEnabled = false;
        
        // Initialize game systems
        this.setupEventListeners();
        this.loadLevel(this.level);
        
        // Start game loop
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
        
        console.log('Game initialized successfully');
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Start button
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
        document.getElementById('nextLevelButton').addEventListener('click', () => this.nextLevel());
        
        // Mobile touch controls
        this.setupMobileControls();
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupMobileControls() {
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const jumpBtn = document.getElementById('jumpBtn');
        
        // Touch events for mobile controls
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.input.keys['ArrowLeft'] = true;
        });
        
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.keys['ArrowLeft'] = false;
        });
        
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.input.keys['ArrowRight'] = true;
        });
        
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.keys['ArrowRight'] = false;
        });
        
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.input.keys[' '] = true;
        });
        
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.keys[' '] = false;
        });
    }
    
    handleKeyDown(e) {
        e.preventDefault();
        
        if (e.code === 'Enter' && this.state === 'start') {
            this.startGame();
        } else if (e.code === 'KeyR' && this.state === 'gameOver') {
            this.restartGame();
        } else {
            this.input.handleKeyDown(e);
        }
    }
    
    handleKeyUp(e) {
        e.preventDefault();
        this.input.handleKeyUp(e);
    }
    
    handleResize() {
        // Handle responsive canvas resizing if needed
        const container = document.getElementById('gameContainer');
        const rect = container.getBoundingClientRect();
        
        // Maintain aspect ratio
        const aspectRatio = this.width / this.height;
        let newWidth = rect.width;
        let newHeight = rect.width / aspectRatio;
        
        if (newHeight > rect.height) {
            newHeight = rect.height;
            newWidth = rect.height * aspectRatio;
        }
        
        this.canvas.style.width = newWidth + 'px';
        this.canvas.style.height = newHeight + 'px';
    }
    
    startGame() {
        console.log('Starting game...');
        this.state = 'playing';
        this.gameRunning = true;
        
        // Hide start screen, show HUD
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('hud').style.display = 'flex';
        
        // Start background music
        this.audio.playBackgroundMusic();
        
        // Start timer
        this.startTimer();
    }
    
    restartGame() {
        console.log('Restarting game...');
        
        // Reset game state
        this.score = 0;
        this.lives = 3;
        this.timer = 300;
        this.level = 1;
        this.camera.x = 0;
        this.camera.y = 0;
        
        // Hide game over screen
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        // Reload level
        this.loadLevel(this.level);
        
        // Start game
        this.startGame();
    }
    
    nextLevel() {
        this.level++;
        console.log(`Starting level ${this.level}`);
        
        // Hide level complete screen
        document.getElementById('levelCompleteScreen').classList.add('hidden');
        
        // Reset timer
        this.timer = 300;
        
        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;
        
        // Load new level
        this.loadLevel(this.level);
        
        // Start the game
        this.startGame();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.state === 'playing') {
                this.timer--;
                this.ui.updateTimer(this.timer);
                
                if (this.timer <= 0) {
                    this.gameOver();
                }
            }
        }, 1000);
    }
    
    loadLevel(levelNumber) {
        console.log(`Loading level ${levelNumber}...`);
        
        // Clear existing objects
        this.enemies = [];
        this.collectibles = [];
        this.platforms = [];
        
        // Create player
        this.player = new Player(100, this.height - 100, this);
        
        // Load level data
        const levelData = this.levelManager.getLevel(levelNumber);
        
        // Create platforms
        levelData.platforms.forEach(platform => {
            this.platforms.push({
                x: platform.x,
                y: platform.y,
                width: platform.width,
                height: platform.height,
                type: platform.type || 'ground'
            });
        });
        
        // Create enemies
        levelData.enemies.forEach(enemy => {
            this.enemies.push(new Goomba(enemy.x, enemy.y, this));
        });
        
        // Create collectibles
        levelData.collectibles.forEach(collectible => {
            if (collectible.type === 'coin') {
                this.collectibles.push(new Coin(collectible.x, collectible.y, this));
            } else if (collectible.type === 'powerup') {
                this.collectibles.push(new PowerUp(collectible.x, collectible.y, this));
            }
        });
        
        console.log(`Level ${levelNumber} loaded successfully`);
    }
    
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
        }
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        
        // Update collectibles
        this.collectibles.forEach(collectible => collectible.update(deltaTime));
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update camera (follow player)
        this.updateCamera();
        
        // Update background parallax
        this.updateBackground();
        
        // Check collisions
        this.checkCollisions();
        
        // Check level completion
        this.checkLevelComplete();
    }
    
    // Particle system for visual effects
    createParticle(x, y, color, size = 3, life = 1) {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 100,
            vy: -Math.random() * 50 - 25,
            color: color,
            size: size,
            life: life,
            maxLife: life,
            gravity: 200
        });
    }
    
    createCoinParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.createParticle(x + 8, y + 8, '#FFD700', 2, 0.8);
        }
    }
    
    createJumpParticles(x, y) {
        for (let i = 0; i < 4; i++) {
            this.createParticle(x + 16, y + 30, '#FFFFFF', 1, 0.5);
        }
    }
    
    createEnemyDefeatParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            this.createParticle(x + 12, y + 12, '#FF4444', 2, 1);
        }
    }
    
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += particle.gravity * deltaTime;
            particle.life -= deltaTime;
            
            return particle.life > 0;
        });
    }
    
    renderParticles(ctx) {
        this.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.life / particle.maxLife;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    updateCamera() {
        if (!this.player) return;
        
        // Follow player with some offset
        const targetX = this.player.x - this.width / 3;
        this.camera.x += (targetX - this.camera.x) * 0.1;
        
        // Keep camera within bounds
        this.camera.x = Math.max(0, this.camera.x);
        this.camera.x = Math.min(this.camera.x, this.levelManager.getCurrentLevel().width - this.width);
    }
    
    updateBackground() {
        // Update parallax background layers
        this.backgroundLayers.forEach(layer => {
            layer.x -= layer.speed;
            if (layer.x <= -this.width) {
                layer.x = 0;
            }
        });
    }
    
    checkCollisions() {
        if (!this.player) return;
        
        // Platform collisions
        this.platforms.forEach(platform => {
            if (this.physics.checkCollision(this.player, platform)) {
                this.physics.resolveCollision(this.player, platform);
            }
        });
        
        // Enemy collisions
        this.enemies.forEach((enemy, index) => {
            if (this.physics.checkCollision(this.player, enemy) && !enemy.defeated) {
                if (this.player.velocityY > 0 && this.player.y < enemy.y - 10) {
                    // Player jumps on enemy
                    enemy.defeat();
                    this.player.bounce();
                    this.addScore(100);
                    this.audio.playEnemyDefeat();
                    this.createEnemyDefeatParticles(enemy.x, enemy.y);
                } else {
                    // Player touches enemy
                    this.playerHit();
                }
            }
        });
        
        // Collectible collisions
        this.collectibles.forEach((collectible, index) => {
            if (this.physics.checkCollision(this.player, collectible) && !collectible.collected) {
                collectible.collect();
                
                if (collectible instanceof Coin) {
                    this.addScore(200);
                    this.audio.playCoin();
                    this.createCoinParticles(collectible.x, collectible.y);
                } else if (collectible instanceof PowerUp) {
                    this.lives++;
                    this.ui.updateLives(this.lives);
                    this.audio.playPowerUp();
                }
            }
        });
    }
    
    checkLevelComplete() {
        if (!this.player) return;
        
        // Check if player touched the flagpole
        const levelData = this.levelManager.getCurrentLevel();
        const flagpole = levelData.flagpole;
        
        if (flagpole && this.physics.checkCollision(this.player, {
            x: flagpole.x,
            y: flagpole.y,
            width: 20,
            height: 200
        })) {
            this.levelComplete();
        }
    }
    
    playerHit() {
        if (this.player.invulnerable) return;
        
        this.lives--;
        this.ui.updateLives(this.lives);
        this.player.makeInvulnerable();
        this.audio.playHit();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    addScore(points) {
        this.score += points;
        this.ui.updateScore(this.score);
    }
    
    levelComplete() {
        this.state = 'levelComplete';
        this.gameRunning = false;
        clearInterval(this.timerInterval);
        
        // Time bonus
        const timeBonus = this.timer * 50;
        this.addScore(timeBonus);
        
        // Show level complete screen
        document.getElementById('levelScore').textContent = this.score;
        document.getElementById('levelCompleteScreen').classList.remove('hidden');
        
        this.audio.playSuccess();
    }
    
    gameOver() {
        this.state = 'gameOver';
        this.gameRunning = false;
        clearInterval(this.timerInterval);
        
        // Show game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('hud').style.display = 'none';
        
        this.audio.stopBackgroundMusic();
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render background layers (parallax)
        this.renderBackground();
        
        // Render platforms
        this.renderPlatforms();
        
        // Render flagpole
        this.renderFlagpole();
        
        // Render collectibles
        this.collectibles.forEach(collectible => collectible.render(this.ctx));
        
        // Render enemies
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        
        // Render particles
        this.renderParticles(this.ctx);
        
        // Render player
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Restore context
        this.ctx.restore();
    }
    
    renderBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.camera.x, this.camera.y, this.width, this.height);
        
        // Simple cloud shapes
        this.renderClouds();
        
        // Hills in background
        this.renderHills();
    }
    
    renderClouds() {
        this.ctx.fillStyle = '#FFFFFF';
        const cloudPositions = [200, 500, 800, 1200, 1600];
        
        cloudPositions.forEach(x => {
            // Simple cloud shape using circles
            const adjustedX = x - (this.camera.x * 0.3); // Parallax effect
            const y = 50;
            
            this.ctx.beginPath();
            this.ctx.arc(adjustedX, y, 20, 0, Math.PI * 2);
            this.ctx.arc(adjustedX + 25, y, 30, 0, Math.PI * 2);
            this.ctx.arc(adjustedX + 50, y, 20, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    renderHills() {
        this.ctx.fillStyle = '#90EE90';
        const hillPositions = [100, 400, 700, 1000, 1300];
        
        hillPositions.forEach(x => {
            const adjustedX = x - (this.camera.x * 0.5); // Parallax effect
            const y = this.height - 80;
            
            this.ctx.beginPath();
            this.ctx.arc(adjustedX, y, 60, Math.PI, 0);
            this.ctx.fill();
        });
    }
    
    renderPlatforms() {
        this.platforms.forEach(platform => {
            // Ground/platform styling
            if (platform.type === 'ground') {
                this.ctx.fillStyle = '#8B4513';
            } else {
                this.ctx.fillStyle = '#DEB887';
            }
            
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Add some detail to platforms
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });
    }
    
    renderFlagpole() {
        const levelData = this.levelManager.getCurrentLevel();
        const flagpole = levelData.flagpole;
        
        if (!flagpole) return;
        
        // Draw flagpole
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(flagpole.x + 8, flagpole.y, 4, 200);
        
        // Draw flag
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(flagpole.x + 12, flagpole.y, 30, 20);
        
        // Flag pattern
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(flagpole.x + 15, flagpole.y + 3, 6, 3);
        this.ctx.fillRect(flagpole.x + 24, flagpole.y + 9, 6, 3);
        this.ctx.fillRect(flagpole.x + 15, flagpole.y + 15, 6, 3);
        
        // Flagpole base
        this.ctx.fillStyle = '#444444';
        this.ctx.fillRect(flagpole.x, flagpole.y + 200, 20, 8);
    }
    
    gameLoop(currentTime) {
        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update game
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Continue game loop
        requestAnimationFrame(this.gameLoop);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, initializing game...');
    window.game = new Game();
});
