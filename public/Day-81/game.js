class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.paused = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.obstacles = [];
        this.powerUps = [];
        
        // Game state
        this.level = 1;
        this.score = 0;
        this.kills = 0;
        this.totalShots = 0;
        this.hitShots = 0;
        this.enemiesRemaining = 0;
        this.gameStartTime = 0;
        this.levelStartTime = 0;
        this.levelCompleted = false;
        
        // Systems
        this.audioManager = new AudioManager();
        this.particleSystem = new ParticleSystem();
        this.screenShake = new ScreenShake();
        this.ui = new UIManager(this.audioManager);
        
        // Input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Level configuration
        this.levelConfig = {
            enemyCount: 3,
            enemyIncrease: 2,
            powerUpChance: 0.3,
            bossLevel: 5
        };
        
        // Game settings
        this.difficulty = 'normal';
        this.playerTankColor = 'green';
        this.gameMode = 'single';
        
        // Day/Night cycle
        this.dayNightCycle = 0;
        this.isNightMode = false;
        this.lightRadius = 150;
        
        // Time freeze effect
        this.freezeTime = 0;
        
        // Setup UI callbacks
        this.ui.onGameStart = (settings) => {
            this.difficulty = settings.difficulty;
            this.playerTankColor = settings.playerTankColor;
            this.gameMode = settings.gameMode || 'single';
            this.initGame();
        };

        this.ui.onGamePause = () => {
            this.pauseGame();
        };

        this.ui.onGameResume = () => {
            this.resumeGame();
        };

        this.ui.onGameQuit = () => {
            this.quitGame();
        };

        this.ui.onNextLevel = () => {
            this.nextLevel();
        };
        
        // Start game loop
        this.gameLoop();
    }

    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.ui.handleKeyPress(e);
            
            // Handle ESC key for pause/unpause
            if (e.code === 'Escape' && this.gameState === 'playing') {
                if (this.paused) {
                    this.resumeGame();
                } else {
                    this.pauseGame();
                }
                e.preventDefault();
                return;
            }
            
            // Prevent default for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        this.resizeCanvas();
    }

    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const gameAspectRatio = 1200 / 800;
        const containerAspectRatio = containerWidth / containerHeight;
        
        if (containerAspectRatio > gameAspectRatio) {
            // Container is wider, fit to height
            this.canvas.style.height = containerHeight + 'px';
            this.canvas.style.width = (containerHeight * gameAspectRatio) + 'px';
        } else {
            // Container is taller, fit to width
            this.canvas.style.width = containerWidth + 'px';
            this.canvas.style.height = (containerWidth / gameAspectRatio) + 'px';
        }
    }

    initGame() {
        // Reset game state
        this.level = 1;
        this.score = 0;
        this.kills = 0;
        this.totalShots = 0;
        this.hitShots = 0;
        this.gameStartTime = Date.now();
        
        // Clear arrays
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.particleSystem.clear();
        
        // Create player tanks
        if (this.gameMode === 'two-player') {
            this.player = new Tank(200, 300, this.playerTankColor, true);
            this.player.team = 'player1';
            this.player2 = new Tank(200, 500, 'blue', true);
            this.player2.team = 'player2';
            this.player2.health = 100;
            this.player2.maxHealth = 100;
        } else {
            this.player = new Tank(600, 400, this.playerTankColor, true);
            this.player.team = 'player';
        }
        
        // Create obstacles
        this.createObstacles();
        
        // Start first level
        this.startLevel();
        
        this.running = true;
        this.paused = false;
    }

    pauseGame() {
        this.paused = true;
        this.audioManager.playSound('shoot'); // UI sound
    }

    resumeGame() {
        this.paused = false;
        this.audioManager.playSound('shoot'); // UI sound
    }

    quitGame() {
        this.running = false;
        this.paused = false;
        
        // Reset button visibility
        document.getElementById('resumeBtn').classList.add('hidden');
        document.getElementById('pauseBtn').classList.remove('hidden');
    }

    createObstacles() {
        this.obstacles = [];
        
        // Border walls (indestructible)
        this.obstacles.push(new Wall(0, 0, 1200, 20, false)); // Top
        this.obstacles.push(new Wall(0, 780, 1200, 20, false)); // Bottom
        this.obstacles.push(new Wall(0, 0, 20, 800, false)); // Left
        this.obstacles.push(new Wall(1180, 0, 20, 800, false)); // Right
        
        // Inner obstacles
        const obstaclePatterns = [
            // Cross pattern
            () => {
                this.obstacles.push(new Wall(580, 100, 40, 200, true));
                this.obstacles.push(new Wall(580, 500, 40, 200, true));
                this.obstacles.push(new Wall(200, 380, 200, 40, true));
                this.obstacles.push(new Wall(800, 380, 200, 40, true));
            },
            // Corners
            () => {
                this.obstacles.push(new Wall(100, 100, 100, 80, true));
                this.obstacles.push(new Wall(1000, 100, 100, 80, true));
                this.obstacles.push(new Wall(100, 620, 100, 80, true));
                this.obstacles.push(new Wall(1000, 620, 100, 80, true));
            },
            // Maze-like
            () => {
                this.obstacles.push(new Wall(300, 200, 40, 200, true));
                this.obstacles.push(new Wall(860, 200, 40, 200, true));
                this.obstacles.push(new Wall(400, 300, 200, 40, true));
                this.obstacles.push(new Wall(600, 460, 200, 40, true));
            }
        ];
        
        // Choose pattern based on level
        const patternIndex = (this.level - 1) % obstaclePatterns.length;
        obstaclePatterns[patternIndex]();
        
        // Add some barrels
        const barrelCount = Math.min(6, 2 + Math.floor(this.level / 2));
        for (let i = 0; i < barrelCount; i++) {
            let x, y, validPosition;
            let attempts = 0;
            
            do {
                x = 100 + Math.random() * 1000;
                y = 100 + Math.random() * 600;
                validPosition = true;
                attempts++;
                
                // Check distance from player
                if (Physics.getDistance({x, y}, this.player) < 150) {
                    validPosition = false;
                    continue;
                }
                
                // Check distance from other obstacles
                for (const obstacle of this.obstacles) {
                    if (obstacle.type === 'wall') {
                        const obstacleCenter = {
                            x: obstacle.x + obstacle.width / 2,
                            y: obstacle.y + obstacle.height / 2
                        };
                        if (Physics.getDistance({x, y}, obstacleCenter) < 80) {
                            validPosition = false;
                            break;
                        }
                    }
                }
                
            } while (!validPosition && attempts < 50);
            
            if (validPosition) {
                this.obstacles.push(new Barrel(x, y));
            }
        }
    }

    startLevel() {
        this.levelStartTime = Date.now();
        this.levelCompleted = false;
        this.enemiesRemaining = this.getEnemyCount();
        this.spawnEnemies();
        this.spawnPowerUps();
        
        // Play level start sound
        this.audioManager.playSound('powerup');
        
        // Show level start notification
        this.ui.showLevelStart(this.level);
    }

    nextLevel() {
        this.level++;
        this.startLevel();
    }

    getEnemyCount() {
        return this.levelConfig.enemyCount + (this.level - 1) * this.levelConfig.enemyIncrease;
    }

    spawnEnemies() {
        this.enemies = [];
        const enemyCount = this.getEnemyCount();
        
        // Determine enemy types based on level
        const enemyTypes = ['chaser', 'sniper', 'patrol'];
        
        for (let i = 0; i < enemyCount; i++) {
            let x, y, validPosition;
            let attempts = 0;
            
            do {
                x = 100 + Math.random() * 1000;
                y = 100 + Math.random() * 600;
                validPosition = true;
                attempts++;
                
                // Check distance from player
                if (Physics.getDistance({x, y}, this.player) < 200) {
                    validPosition = false;
                    continue;
                }
                
                // Check distance from obstacles
                for (const obstacle of this.obstacles) {
                    if (obstacle.type === 'wall') {
                        if (Physics.checkPointInRect({x, y}, obstacle)) {
                            validPosition = false;
                            break;
                        }
                    }
                }
                
                // Check distance from other enemies
                for (const enemy of this.enemies) {
                    if (Physics.getDistance({x, y}, enemy) < 100) {
                        validPosition = false;
                        break;
                    }
                }
                
            } while (!validPosition && attempts < 100);
            
            if (validPosition) {
                const tank = new Tank(x, y, 'red', false);
                
                // Adjust tank properties based on difficulty and level
                const difficultyMultiplier = {
                    easy: 0.8,
                    normal: 1.0,
                    hard: 1.2
                }[this.difficulty];
                
                tank.health *= difficultyMultiplier;
                tank.maxHealth = tank.health;
                tank.speed *= (0.8 + this.level * 0.1) * difficultyMultiplier;
                tank.shootCooldown *= Math.max(0.6, 1.2 - this.level * 0.1) / difficultyMultiplier;
                
                // Assign AI behavior
                const typeIndex = i % enemyTypes.length;
                const aiType = enemyTypes[typeIndex];
                
                switch (aiType) {
                    case 'chaser':
                        tank.ai = new ChaserAI(tank, this.difficulty);
                        tank.color = '#e74c3c';
                        break;
                    case 'sniper':
                        tank.ai = new SniperAI(tank, this.difficulty);
                        tank.color = '#8e44ad';
                        break;
                    case 'patrol':
                        tank.ai = new PatrolAI(tank, this.difficulty);
                        tank.color = '#d35400';
                        break;
                }
                
                this.enemies.push(tank);
            }
        }
        
        // Boss tank every 5 levels
        if (this.level % this.levelConfig.bossLevel === 0) {
            this.spawnBoss();
        }
    }

    spawnBoss() {
        const boss = new Tank(1100, 100, '#2c3e50', false);
        boss.health = 300 + this.level * 50;
        boss.maxHealth = boss.health;
        boss.radius = 30;
        boss.width = 50;
        boss.height = 35;
        boss.speed = 1.5;
        boss.shootCooldown = 200;
        boss.ai = new ChaserAI(boss, 'hard');
        boss.isBoss = true;
        
        this.enemies.push(boss);
        this.enemiesRemaining++;
    }

    spawnPowerUps() {
        const powerUpCount = Math.floor(Math.random() * 3) + 1;
        const powerUpTypes = ['health', 'shield', 'speed', 'damage', 'ammo', 'rapid', 'missiles', 'multishot', 'freeze'];
        
        for (let i = 0; i < powerUpCount; i++) {
            if (Math.random() < this.levelConfig.powerUpChance) {
                let x, y, validPosition;
                let attempts = 0;
                
                do {
                    x = 150 + Math.random() * 900;
                    y = 150 + Math.random() * 500;
                    validPosition = true;
                    attempts++;
                    
                    // Check distance from player and enemies
                    if (Physics.getDistance({x, y}, this.player) < 100) {
                        validPosition = false;
                        continue;
                    }
                    
                    for (const enemy of this.enemies) {
                        if (Physics.getDistance({x, y}, enemy) < 100) {
                            validPosition = false;
                            break;
                        }
                    }
                    
                    // Check obstacles
                    for (const obstacle of this.obstacles) {
                        if (obstacle.type === 'wall' && Physics.checkPointInRect({x, y}, obstacle)) {
                            validPosition = false;
                            break;
                        }
                    }
                    
                } while (!validPosition && attempts < 50);
                
                if (validPosition) {
                    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                    this.powerUps.push(new PowerUp(x, y, type));
                }
            }
        }
    }

    update() {
        if (!this.running || this.paused) return;
        
        // Handle input
        this.handleInput();
        if (this.gameMode === 'two-player' && this.player2) {
            this.handlePlayer2Input();
        }
        
        // Update game objects
        this.updatePlayer();
        if (this.gameMode === 'two-player' && this.player2) {
            this.updatePlayer2();
        }
        this.updateEnemies();
        this.updateBullets();
        this.updatePowerUps();
        this.updateObstacles();
        
        // Update effects
        this.particleSystem.update();
        this.screenShake.update();
        
        // Update day/night cycle
        this.dayNightCycle += 0.005;
        this.isNightMode = Math.sin(this.dayNightCycle) < 0;
        
        // Check collisions
        this.checkCollisions();
        
        // Check level completion
        this.checkLevelCompletion();
        
        // Check game over
        this.checkGameOver();
        
        // Update UI
        this.updateUI();
    }

    handleInput() {
        if (!this.player || !this.player.alive) return;
        
        // Player 1 controls: WASD + G (shoot) + F (missiles) for two-player mode
        // Or WASD/Arrow keys + Space + Shift for single player
        const moveUp = this.gameMode === 'two-player' ? this.keys['KeyW'] : (this.keys['KeyW'] || this.keys['ArrowUp']);
        const moveDown = this.gameMode === 'two-player' ? this.keys['KeyS'] : (this.keys['KeyS'] || this.keys['ArrowDown']);
        const rotateLeft = this.gameMode === 'two-player' ? this.keys['KeyA'] : (this.keys['KeyA'] || this.keys['ArrowLeft']);
        const rotateRight = this.gameMode === 'two-player' ? this.keys['KeyD'] : (this.keys['KeyD'] || this.keys['ArrowRight']);
        const shoot = this.gameMode === 'two-player' ? this.keys['KeyG'] : this.keys['Space'];
        const shootMissiles = this.gameMode === 'two-player' ? this.keys['KeyF'] : (this.keys['ShiftLeft'] || this.keys['ShiftRight']);
        
        // Movement
        if (moveUp) {
            this.player.moveForward();
        }
        if (moveDown) {
            this.player.moveBackward();
        }
        if (rotateLeft) {
            this.player.rotateLeft();
        }
        if (rotateRight) {
            this.player.rotateRight();
        }
        
        // Shooting
        if (shoot) {
            const bullets = this.player.shoot();
            if (bullets) {
                bullets.forEach(bullet => this.bullets.push(bullet));
                this.totalShots++;
                this.audioManager.playSound('shoot');
                this.particleSystem.createMuzzleFlash(
                    this.player.x + Math.cos(this.player.turretAngle) * (this.player.radius + 5),
                    this.player.y + Math.sin(this.player.turretAngle) * (this.player.radius + 5),
                    this.player.turretAngle
                );
            }
        }
        
        // Secondary weapon - Missiles
        if (shootMissiles) {
            const missiles = this.player.shootMissile();
            if (missiles) {
                missiles.forEach(missile => this.bullets.push(missile));
                this.totalShots++;
                this.audioManager.playSound('explosion');
                this.particleSystem.createMuzzleFlash(
                    this.player.x + Math.cos(this.player.turretAngle) * (this.player.radius + 10),
                    this.player.y + Math.sin(this.player.turretAngle) * (this.player.radius + 10),
                    this.player.turretAngle
                );
            }
        }
    }

    handlePlayer2Input() {
        if (!this.player2 || !this.player2.alive) return;
        
        // Player 2 controls: Arrow keys + Enter (shoot) + RShift (missiles)
        if (this.keys['ArrowUp']) {
            this.player2.moveForward();
        }
        if (this.keys['ArrowDown']) {
            this.player2.moveBackward();
        }
        if (this.keys['ArrowLeft']) {
            this.player2.rotateLeft();
        }
        if (this.keys['ArrowRight']) {
            this.player2.rotateRight();
        }
        
        // Shooting
        if (this.keys['Enter']) {
            const bullets = this.player2.shoot();
            if (bullets) {
                bullets.forEach(bullet => this.bullets.push(bullet));
                this.totalShots++;
                this.audioManager.playSound('shoot');
                this.particleSystem.createMuzzleFlash(
                    this.player2.x + Math.cos(this.player2.turretAngle) * (this.player2.radius + 5),
                    this.player2.y + Math.sin(this.player2.turretAngle) * (this.player2.radius + 5),
                    this.player2.turretAngle
                );
            }
        }
        
        // Secondary weapon - Missiles
        if (this.keys['ShiftRight']) {
            const missiles = this.player2.shootMissile();
            if (missiles) {
                missiles.forEach(missile => this.bullets.push(missile));
                this.totalShots++;
                this.audioManager.playSound('explosion');
                this.particleSystem.createMuzzleFlash(
                    this.player2.x + Math.cos(this.player2.turretAngle) * (this.player2.radius + 10),
                    this.player2.y + Math.sin(this.player2.turretAngle) * (this.player2.radius + 10),
                    this.player2.turretAngle
                );
            }
        }
    }

    updatePlayer() {
        if (this.player && this.player.alive) {
            this.player.update();
            
            // Check bounds
            this.player.x = Math.max(this.player.radius, Math.min(1200 - this.player.radius, this.player.x));
            this.player.y = Math.max(this.player.radius, Math.min(800 - this.player.radius, this.player.y));
        }
    }

    updatePlayer2() {
        if (this.player2 && this.player2.alive) {
            this.player2.update();
            
            // Check bounds
            this.player2.x = Math.max(this.player2.radius, Math.min(1200 - this.player2.radius, this.player2.x));
            this.player2.y = Math.max(this.player2.radius, Math.min(800 - this.player2.radius, this.player2.y));
        }
    }

    updateEnemies() {
        // Apply time freeze effect
        if (this.freezeTime > 0) {
            this.freezeTime--;
            return; // Skip enemy updates during freeze
        }
        
        this.enemies.forEach(enemy => {
            if (enemy.alive) {
                enemy.update();
                
                // Update AI
                if (enemy.ai) {
                    const bullets = enemy.ai.update(this.player, this.obstacles, this.enemies);
                    if (bullets) {
                        bullets.forEach(bullet => this.bullets.push(bullet));
                        this.audioManager.playSound('shoot');
                        this.particleSystem.createMuzzleFlash(
                            enemy.x + Math.cos(enemy.turretAngle) * (enemy.radius + 5),
                            enemy.y + Math.sin(enemy.turretAngle) * (enemy.radius + 5),
                            enemy.turretAngle
                        );
                    }
                }
            }
        });
        
        // Remove dead enemies
        this.enemies = this.enemies.filter(enemy => enemy.alive);
    }

    updateBullets() {
        this.bullets.forEach(bullet => {
            bullet.update();
            
            // Create smoke trail
            if (Math.random() < 0.3) {
                this.particleSystem.createSmokeTrail(bullet.x, bullet.y, bullet.vx, bullet.vy);
            }
        });
        
        // Remove dead bullets
        this.bullets = this.bullets.filter(bullet => bullet.alive);
    }

    updatePowerUps() {
        this.powerUps.forEach(powerUp => powerUp.update());
    }

    updateObstacles() {
        this.obstacles = this.obstacles.filter(obstacle => obstacle.alive);
    }

    checkCollisions() {
        // Bullet vs Tank collisions
        this.checkBulletTankCollisions();
        
        // Bullet vs Obstacle collisions
        this.checkBulletObstacleCollisions();
        
        // Tank vs Obstacle collisions
        this.checkTankObstacleCollisions();
        
        // Player vs PowerUp collisions
        this.checkPowerUpCollisions();
        if (this.gameMode === 'two-player' && this.player2) {
            this.checkPowerUpCollisionsPlayer2();
        }
        
        // Tank vs Tank collisions
        this.checkTankTankCollisions();
    }

    checkBulletTankCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // Handle missile explosions on impact
            if (bullet instanceof Missile) {
                // Check missile collision with obstacles
                for (const obstacle of this.obstacles) {
                    if (obstacle.type === 'wall' && Physics.checkPointInRect(bullet, obstacle)) {
                        const explosion = bullet.explode();
                        this.handleExplosion(explosion);
                        this.bullets.splice(i, 1);
                        bullet.alive = false;
                        break;
                    } else if (obstacle.type === 'barrel' && Physics.checkCircleCollision(bullet, obstacle)) {
                        const explosion = bullet.explode();
                        this.handleExplosion(explosion);
                        this.bullets.splice(i, 1);
                        bullet.alive = false;
                        break;
                    }
                }
                
                if (!bullet.alive) continue;
            }
            
            // Check player collision (only enemy bullets)
            if (!bullet.fromPlayer && this.player.alive) {
                if (Physics.checkCircleCollision(bullet, this.player)) {
                    if (!this.player.isShielded()) {
                        this.player.takeDamage(bullet.damage);
                        this.screenShake.shake(5, 10);
                        this.audioManager.playSound('hit');
                        this.particleSystem.createHitSparks(bullet.x, bullet.y, bullet.angle);
                    }
                    this.bullets.splice(i, 1);
                    continue;
                }
            }
            
            // Check enemy collisions (only player bullets)
            if (bullet.fromPlayer) {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    if (enemy.alive && Physics.checkCircleCollision(bullet, enemy)) {
                        enemy.takeDamage(bullet.damage);
                        this.hitShots++;
                        this.score += 10;
                        
                        if (enemy.isBoss) {
                            this.score += 50; // Bonus for boss hits
                        }
                        
                        this.audioManager.playSound('hit');
                        this.particleSystem.createHitSparks(bullet.x, bullet.y, bullet.angle);
                        
                        if (!enemy.alive) {
                            this.kills++;
                            this.enemiesRemaining--;
                            this.score += enemy.isBoss ? 500 : 100;
                            this.audioManager.playSound('explosion');
                            this.particleSystem.createExplosion(enemy.x, enemy.y, enemy.isBoss ? 2 : 1);
                            this.screenShake.shake(enemy.isBoss ? 15 : 8, enemy.isBoss ? 20 : 15);
                        }
                        
                        this.bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    checkBulletObstacleCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (const obstacle of this.obstacles) {
                if (obstacle.type === 'wall') {
                    if (Physics.checkPointInRect(bullet, obstacle)) {
                        if (obstacle.destructible) {
                            obstacle.takeDamage(bullet.damage);
                            if (!obstacle.alive) {
                                this.audioManager.playSound('explosion');
                                this.particleSystem.createExplosion(obstacle.x + obstacle.width/2, 
                                    obstacle.y + obstacle.height/2, 0.5);
                                this.score += 20;
                            }
                        }
                        
                        if (bullet.bounces > 0) {
                            Physics.handleBulletBounce(bullet, obstacle);
                            this.particleSystem.createHitSparks(bullet.x, bullet.y, bullet.angle);
                        } else {
                            this.bullets.splice(i, 1);
                        }
                        break;
                    }
                } else if (obstacle.type === 'barrel') {
                    if (Physics.checkCircleCollision(bullet, obstacle)) {
                        const exploded = obstacle.takeDamage(bullet.damage);
                        if (exploded) {
                            this.handleBarrelExplosion(obstacle);
                        }
                        this.bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    handleBarrelExplosion(barrel) {
        this.audioManager.playSound('explosion');
        this.particleSystem.createExplosion(barrel.x, barrel.y, 2);
        this.screenShake.shake(12, 18);
        this.score += 50;
        
        // Area damage
        const targets = [this.player, ...this.enemies];
        targets.forEach(target => {
            if (target.alive) {
                const distance = Physics.getDistance(barrel, target);
                if (distance < barrel.explosionRadius) {
                    const damage = barrel.explosionDamage * (1 - distance / barrel.explosionRadius);
                    if (target === this.player && target.isShielded()) {
                        return; // Shield protects from explosion
                    }
                    target.takeDamage(Math.floor(damage));
                    
                    if (!target.alive && target !== this.player) {
                        this.kills++;
                        this.enemiesRemaining--;
                        this.score += target.isBoss ? 500 : 100;
                    }
                }
            }
        });
    }

    checkTankObstacleCollisions() {
        const tanks = [this.player, ...this.enemies].filter(tank => tank && tank.alive);
        
        tanks.forEach(tank => {
            for (const obstacle of this.obstacles) {
                if (obstacle.type === 'wall') {
                    const tankBounds = tank.getBounds();
                    if (Physics.checkRectCollision(tankBounds, obstacle)) {
                        // Push tank away from obstacle
                        const tankCenter = { x: tank.x, y: tank.y };
                        const obstacleCenter = {
                            x: obstacle.x + obstacle.width / 2,
                            y: obstacle.y + obstacle.height / 2
                        };
                        
                        const angle = Physics.getAngle(obstacleCenter, tankCenter);
                        const pushDistance = 5;
                        
                        tank.x += Math.cos(angle) * pushDistance;
                        tank.y += Math.sin(angle) * pushDistance;
                    }
                } else if (obstacle.type === 'barrel') {
                    if (Physics.checkCircleCollision(tank, obstacle)) {
                        // Push tank away
                        const angle = Physics.getAngle(obstacle, tank);
                        const pushDistance = 3;
                        
                        tank.x += Math.cos(angle) * pushDistance;
                        tank.y += Math.sin(angle) * pushDistance;
                    }
                }
            }
        });
    }

    checkPowerUpCollisions() {
        if (!this.player || !this.player.alive) return;
        
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (Physics.checkCircleCollision(this.player, powerUp)) {
                this.collectPowerUp(powerUp);
                this.powerUps.splice(i, 1);
            }
        }
    }

    checkPowerUpCollisionsPlayer2() {
        if (!this.player2 || !this.player2.alive) return;
        
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (Physics.checkCircleCollision(this.player2, powerUp)) {
                this.collectPowerUpPlayer2(powerUp);
                this.powerUps.splice(i, 1);
            }
        }
    }

    collectPowerUp(powerUp) {
        this.audioManager.playSound('powerup');
        this.particleSystem.createPowerUpEffect(powerUp.x, powerUp.y, powerUp.properties[powerUp.type].color);
        this.ui.showPowerUpNotification(powerUp.type);
        this.score += 25;
        
        switch (powerUp.type) {
            case 'health':
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 50);
                break;
            case 'shield':
                this.player.applyPowerUp('shield', 600); // 10 seconds
                break;
            case 'speed':
                this.player.applyPowerUp('speedBoost', 600);
                break;
            case 'damage':
                this.player.applyPowerUp('doubleDamage', 600);
                break;
            case 'ammo':
                if (this.player.ammo !== Infinity) {
                    this.player.ammo = this.player.maxAmmo;
                }
                break;
            case 'stealth':
                this.player.applyPowerUp('stealth', 300); // 5 seconds
                break;
            case 'rapid':
                this.player.applyPowerUp('rapidFire', 600); // 10 seconds
                break;
            case 'missiles':
                this.player.missiles = Math.min(this.player.maxMissiles, this.player.missiles + 5);
                break;
            case 'multishot':
                this.player.applyPowerUp('multiShot', 450); // 7.5 seconds
                break;
            case 'freeze':
                this.freezeTime = 180; // 3 seconds freeze
                break;
        }
    }

    collectPowerUpPlayer2(powerUp) {
        this.audioManager.playSound('powerup');
        this.particleSystem.createPowerUpEffect(powerUp.x, powerUp.y, powerUp.properties[powerUp.type].color);
        this.ui.showPowerUpNotification(powerUp.type + ' (P2)');
        this.score += 25;
        
        switch (powerUp.type) {
            case 'health':
                this.player2.health = Math.min(this.player2.maxHealth, this.player2.health + 50);
                break;
            case 'shield':
                this.player2.applyPowerUp('shield', 600); // 10 seconds
                break;
            case 'speed':
                this.player2.applyPowerUp('speedBoost', 600);
                break;
            case 'damage':
                this.player2.applyPowerUp('doubleDamage', 600);
                break;
            case 'ammo':
                if (this.player2.ammo !== Infinity) {
                    this.player2.ammo = this.player2.maxAmmo;
                }
                break;
            case 'stealth':
                this.player2.applyPowerUp('stealth', 300); // 5 seconds
                break;
            case 'rapid':
                this.player2.applyPowerUp('rapidFire', 600); // 10 seconds
                break;
            case 'missiles':
                this.player2.missiles = Math.min(this.player2.maxMissiles, this.player2.missiles + 5);
                break;
            case 'multishot':
                this.player2.applyPowerUp('multiShot', 450); // 7.5 seconds
                break;
            case 'freeze':
                this.freezeTime = 180; // 3 seconds freeze
                break;
        }
    }

    checkTankTankCollisions() {
        const allTanks = [this.player, ...this.enemies].filter(tank => tank && tank.alive);
        
        for (let i = 0; i < allTanks.length; i++) {
            for (let j = i + 1; j < allTanks.length; j++) {
                const tank1 = allTanks[i];
                const tank2 = allTanks[j];
                
                if (Physics.checkCircleCollision(tank1, tank2)) {
                    // Push tanks apart
                    const angle = Physics.getAngle(tank1, tank2);
                    const pushDistance = 2;
                    
                    tank1.x -= Math.cos(angle) * pushDistance;
                    tank1.y -= Math.sin(angle) * pushDistance;
                    tank2.x += Math.cos(angle) * pushDistance;
                    tank2.y += Math.sin(angle) * pushDistance;
                }
            }
        }
    }

    handleExplosion(explosion) {
        // Create massive particle explosion
        this.particleSystem.createExplosion(explosion.x, explosion.y, 2);
        this.audioManager.playSound('explosion');
        this.screenShake.shake(15, 20);
        
        // Check damage to all entities within explosion radius
        const targets = [this.player, ...this.enemies];
        
        targets.forEach(target => {
            if (!target || !target.alive) return;
            
            const distance = Physics.getDistance(explosion, target);
            if (distance < explosion.radius) {
                const damageMultiplier = 1 - (distance / explosion.radius);
                const damage = Math.floor(explosion.damage * damageMultiplier);
                
                // Don't damage same team
                if ((explosion.fromPlayer && target === this.player) || 
                    (!explosion.fromPlayer && target !== this.player)) {
                    return;
                }
                
                if (!target.isShielded()) {
                    target.takeDamage(damage);
                    this.particleSystem.createHitSparks(target.x, target.y, 0);
                    
                    if (!target.alive && target !== this.player) {
                        this.handleEnemyDestroyed(target);
                    }
                }
            }
        });
        
        // Damage obstacles in explosion radius
        this.obstacles.forEach(obstacle => {
            if (obstacle.type === 'wall' || obstacle.type === 'barrel') {
                const obstacleCenter = {
                    x: obstacle.x + (obstacle.width ? obstacle.width / 2 : 0),
                    y: obstacle.y + (obstacle.height ? obstacle.height / 2 : 0)
                };
                
                const distance = Physics.getDistance(explosion, obstacleCenter);
                if (distance < explosion.radius) {
                    const damage = Math.floor(explosion.damage * (1 - distance / explosion.radius));
                    const exploded = obstacle.takeDamage(damage);
                    
                    if (exploded && obstacle.type === 'barrel') {
                        // Chain explosion
                        setTimeout(() => {
                            this.handleExplosion({
                                x: obstacle.x,
                                y: obstacle.y,
                                radius: obstacle.explosionRadius,
                                damage: obstacle.explosionDamage,
                                fromPlayer: explosion.fromPlayer
                            });
                        }, 100);
                    }
                }
            }
        });
    }

    checkLevelCompletion() {
        if (this.enemiesRemaining <= 0 && this.running && !this.levelCompleted) {
            this.levelCompleted = true;
            this.score += this.level * 100; // Level completion bonus
            
            // Calculate level stats
            const levelStats = {
                level: this.level,
                score: this.level * 100,
                enemiesKilled: this.getEnemyCount(),
                accuracy: this.totalShots > 0 ? Math.round((this.hitShots / this.totalShots) * 100) : 0,
                timeBonus: Math.max(0, 300 - Math.floor((Date.now() - this.levelStartTime) / 1000)) * 10
            };
            
            this.score += levelStats.timeBonus;
            
            // Reset enemies array to prevent counting issues
            this.enemies = [];
            
            // Show level complete with stats and next level button
            this.ui.showLevelCompleteWithStats(levelStats);
        }
    }

    checkGameOver() {
        let gameOver = false;
        
        if (this.gameMode === 'two-player') {
            // Game over if both players are dead
            gameOver = (!this.player || !this.player.alive) && (!this.player2 || !this.player2.alive);
        } else {
            // Game over if single player is dead
            gameOver = this.player && !this.player.alive;
        }
        
        if (gameOver && this.running) {
            this.running = false;
            
            const accuracy = this.totalShots > 0 ? Math.round((this.hitShots / this.totalShots) * 100) : 0;
            
            this.ui.showGameOver({
                score: this.score,
                level: this.level,
                kills: this.kills,
                accuracy: accuracy
            });
        }
    }

    updateUI() {
        if (this.ui.gameState === 'playing' && this.player) {
            this.ui.updateHUD({
                score: this.score,
                level: this.level,
                enemiesRemaining: this.enemiesRemaining,
                health: this.player.health,
                maxHealth: this.player.maxHealth,
                ammo: this.player.ammo,
                missiles: this.player.missiles,
                isNightMode: this.isNightMode,
                freezeTime: this.freezeTime
            });
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake
        this.ctx.save();
        this.screenShake.apply(this.ctx);
        
        // Draw grid background
        this.drawGrid();
        
        // Apply day/night overlay
        if (this.isNightMode) {
            this.drawNightOverlay();
        }
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        
        // Draw tanks
        if (this.player && this.player.alive) {
            this.player.draw(this.ctx);
        }
        if (this.gameMode === 'two-player' && this.player2 && this.player2.alive) {
            this.player2.draw(this.ctx);
        }
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Draw bullets
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        
        // Draw particles
        this.particleSystem.draw(this.ctx);
        
        // Reset screen shake transform
        this.screenShake.reset(this.ctx);
        this.ctx.restore();
        
        // Draw UI elements on top
        this.drawUIOverlay();
        
        // Draw mini-map
        this.drawMiniMap();
        
        // Draw pause overlay
        if (this.paused) {
            this.drawPauseOverlay();
        }
    }

    drawPauseOverlay() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Pause text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        // Instructions
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press Resume to continue or ESC to pause/unpause', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawNightOverlay() {
        // Create darkness overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create light circles around tanks
        if (this.player && this.player.alive) {
            this.drawLightRadius(this.player.x, this.player.y, this.lightRadius);
        }
        
        this.enemies.forEach(enemy => {
            if (enemy.alive) {
                this.drawLightRadius(enemy.x, enemy.y, this.lightRadius * 0.8);
            }
        });
    }

    drawLightRadius(x, y, radius) {
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';
    }

    drawMiniMap() {
        const minimapCanvas = document.getElementById('minimapCanvas');
        if (!minimapCanvas) return;
        
        const minimapCtx = minimapCanvas.getContext('2d');
        const scaleX = minimapCanvas.width / 1200;
        const scaleY = minimapCanvas.height / 800;
        
        // Clear mini-map
        minimapCtx.fillStyle = '#1a1a1a';
        minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
        
        // Draw obstacles
        minimapCtx.fillStyle = '#555';
        this.obstacles.forEach(obstacle => {
            if (obstacle.type === 'wall') {
                minimapCtx.fillRect(
                    obstacle.x * scaleX,
                    obstacle.y * scaleY,
                    obstacle.width * scaleX,
                    obstacle.height * scaleY
                );
            } else if (obstacle.type === 'barrel') {
                minimapCtx.beginPath();
                minimapCtx.arc(obstacle.x * scaleX, obstacle.y * scaleY, 3, 0, Math.PI * 2);
                minimapCtx.fill();
            }
        });
        
        // Draw power-ups
        minimapCtx.fillStyle = '#FFD700';
        this.powerUps.forEach(powerUp => {
            minimapCtx.beginPath();
            minimapCtx.arc(powerUp.x * scaleX, powerUp.y * scaleY, 2, 0, Math.PI * 2);
            minimapCtx.fill();
        });
        
        // Draw enemies
        minimapCtx.fillStyle = '#e74c3c';
        this.enemies.forEach(enemy => {
            if (enemy.alive) {
                minimapCtx.beginPath();
                minimapCtx.arc(enemy.x * scaleX, enemy.y * scaleY, 3, 0, Math.PI * 2);
                minimapCtx.fill();
            }
        });
        
        // Draw players
        if (this.player && this.player.alive) {
            minimapCtx.fillStyle = '#4CAF50';
            minimapCtx.beginPath();
            minimapCtx.arc(this.player.x * scaleX, this.player.y * scaleY, 4, 0, Math.PI * 2);
            minimapCtx.fill();
            
            // Player direction indicator
            minimapCtx.strokeStyle = '#4CAF50';
            minimapCtx.lineWidth = 2;
            minimapCtx.beginPath();
            minimapCtx.moveTo(this.player.x * scaleX, this.player.y * scaleY);
            minimapCtx.lineTo(
                (this.player.x + Math.cos(this.player.angle) * 20) * scaleX,
                (this.player.y + Math.sin(this.player.angle) * 20) * scaleY
            );
            minimapCtx.stroke();
        }
        
        if (this.gameMode === 'two-player' && this.player2 && this.player2.alive) {
            minimapCtx.fillStyle = '#2196F3';
            minimapCtx.beginPath();
            minimapCtx.arc(this.player2.x * scaleX, this.player2.y * scaleY, 4, 0, Math.PI * 2);
            minimapCtx.fill();
            
            // Player 2 direction indicator
            minimapCtx.strokeStyle = '#2196F3';
            minimapCtx.lineWidth = 2;
            minimapCtx.beginPath();
            minimapCtx.moveTo(this.player2.x * scaleX, this.player2.y * scaleY);
            minimapCtx.lineTo(
                (this.player2.x + Math.cos(this.player2.angle) * 20) * scaleX,
                (this.player2.y + Math.sin(this.player2.angle) * 20) * scaleY
            );
            minimapCtx.stroke();
        }
    }

    drawUIOverlay() {
        // Draw minimap (optional)
        // this.drawMinimap();
        
        // Draw power-up status indicators
        this.drawPowerUpIndicators();
    }

    drawPowerUpIndicators() {
        if (!this.player) return;
        
        const x = 20;
        let y = 120;
        const iconSize = 30;
        const spacing = 35;
        
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        for (const [powerUpType, timeLeft] of Object.entries(this.player.powerUps)) {
            if (timeLeft > 0) {
                const alpha = Math.min(1, timeLeft / 60);
                this.ctx.save();
                this.ctx.globalAlpha = alpha;
                
                // Background
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(x, y, iconSize, iconSize);
                
                // Icon background color
                const colors = {
                    shield: '#2196F3',
                    doubleShot: '#4CAF50',
                    speedBoost: '#FFEB3B',
                    doubleDamage: '#FF9800',
                    stealth: '#9C27B0'
                };
                
                this.ctx.fillStyle = colors[powerUpType] || '#666';
                this.ctx.fillRect(x + 2, y + 2, iconSize - 4, iconSize - 4);
                
                // Time indicator
                const timePercent = timeLeft / 600;
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(x, y + iconSize - 3, iconSize * timePercent, 3);
                
                this.ctx.restore();
                
                y += spacing;
            }
        }
    }

    gameLoop(currentTime = 0) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update();
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});

// Handle visibility change to pause/resume
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Game paused when tab is not visible
    } else {
        // Game resumed when tab becomes visible
    }
});
