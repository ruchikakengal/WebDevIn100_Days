class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.gameState = 'menu';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.streak = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.bossLevel = false;
        this.boss = null;
        this.bossMusic = false;
        this.screenShake = 0;
        this.playerLevel = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.weaponLevel = 1;
        this.weaponType = 'plasma';
        this.weaponTypes = ['plasma', 'laser', 'missile', 'railgun', 'fusion'];
        this.currentWeaponIndex = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.armor = 0;
        this.maxArmor = 100;
        this.criticalChance = 0.05;
        this.criticalDamage = 2.0;
        this.fireRate = 1.0;
        this.bulletSpeed = 1.0;
        this.energyShield = 0;
        this.maxEnergyShield = 50;
        this.player = null;
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.powerups = [];
        this.explosions = [];
        this.enemySpawnRate = 0.02;
        this.powerupSpawnRate = 0.001;
        this.lastPowerupTime = 0;
        this.bossActive = false;
        this.waveTimer = 0;
        this.backgroundSpeed = 1;
        this.specialWeaponCooldown = 0;
        this.specialWeaponCharges = 3;
        this.shieldActive = false;
        this.shieldDuration = 0;
        this.keys = {};
        this.mobile = this.detectMobile();
        this.mobileControls = {
            shooting: false,
            movement: { x: 0, y: 0 },
            joystick: { active: false, center: { x: 0, y: 0 } }
        };
        
        this.stars = [];
        this.initStars();
        this.setupEventListeners();
        this.setupUI();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0);
    }

    initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyDown(e);
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        if (this.mobile) {
            this.setupMobileControls();
        }

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.initStars();
        });
    }

    setupMobileControls() {
        const joystick = document.getElementById('joystick');
        const shootBtn = document.getElementById('shoot-btn');
        const specialBtn = document.getElementById('special-btn');
        const joystickOuter = joystick.parentElement;

        const handleJoystickStart = (e) => {
            e.preventDefault();
            this.mobileControls.joystick.active = true;
            const rect = joystickOuter.getBoundingClientRect();
            this.mobileControls.joystick.center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        };

        const handleJoystickMove = (e) => {
            if (!this.mobileControls.joystick.active) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.mobileControls.joystick.center.x;
            const deltaY = touch.clientY - this.mobileControls.joystick.center.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 40;
            
            if (distance <= maxDistance) {
                joystick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                this.mobileControls.movement.x = deltaX / maxDistance;
                this.mobileControls.movement.y = deltaY / maxDistance;
            } else {
                const angle = Math.atan2(deltaY, deltaX);
                const limitedX = Math.cos(angle) * maxDistance;
                const limitedY = Math.sin(angle) * maxDistance;
                joystick.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
                this.mobileControls.movement.x = limitedX / maxDistance;
                this.mobileControls.movement.y = limitedY / maxDistance;
            }
        };

        const handleJoystickEnd = (e) => {
            e.preventDefault();
            this.mobileControls.joystick.active = false;
            joystick.style.transform = 'translate(-50%, -50%)';
            this.mobileControls.movement.x = 0;
            this.mobileControls.movement.y = 0;
        };

        joystickOuter.addEventListener('touchstart', handleJoystickStart);
        window.addEventListener('touchmove', handleJoystickMove);
        window.addEventListener('touchend', handleJoystickEnd);
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.mobileControls.shooting = true;
        });

        shootBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mobileControls.shooting = false;
        });
        specialBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.useSpecialWeapon();
        });
    }

    setupUI() {
        this.updateUI();
    }

    handleKeyDown(e) {
        switch (e.code) {
            case 'Enter':
                if (this.gameState === 'menu') {
                    this.startGame();
                }
                break;
            case 'KeyP':
                if (this.gameState === 'playing') {
                    this.pauseGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                }
                break;
            case 'KeyR':
                if (this.gameState === 'gameOver') {
                    this.restartGame();
                }
                break;
            case 'Space':
                e.preventDefault();
                if (this.gameState === 'playing' && this.player) {
                    this.player.shoot();
                }
                break;
            case 'KeyX':
                if (this.gameState === 'playing') {
                    this.useSpecialWeapon();
                }
                break;
            case 'KeyQ':
                if (this.gameState === 'playing') {
                    this.switchWeapon();
                }
                break;
            case 'KeyE':
                if (this.gameState === 'playing') {
                    this.activateShield();
                }
                break;
            case 'KeyC':
                if (this.gameState === 'playing') {
                    this.useCriticalStrike();
                }
                break;
        }
    }

    switchWeapon() {
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weaponTypes.length;
        this.weaponType = this.weaponTypes[this.currentWeaponIndex];
        this.showNotification(`Weapon: ${this.weaponType.toUpperCase()}`, '#00ff00');
        audioManager.playSound('powerup');
    }

    activateShield() {
        if (this.energyShield >= 25) {
            this.energyShield -= 25;
            this.shieldActive = true;
            this.shieldDuration = 300; 
            this.showNotification('Energy Shield Activated!', '#00ffff');
            audioManager.playSound('shield');
        }
    }

    useCriticalStrike() {
        if (this.specialWeaponCharges > 0) {
            this.specialWeaponCharges--;
            const originalCrit = this.criticalChance;
            const originalDamage = this.criticalDamage;
            
            this.criticalChance = 1.0; 
            this.criticalDamage = 5.0;
            
            setTimeout(() => {
                this.criticalChance = originalCrit;
                this.criticalDamage = originalDamage;
            }, 3000);
            
            this.showNotification('CRITICAL STRIKE MODE!', '#ff0000');
            audioManager.playSound('specialWeapon');
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.streak = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.playerLevel = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.weaponLevel = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.specialWeaponCharges = 3;
        
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.powerups = [];
        this.explosions = [];
        
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 100);
        this.hideAllMessages();
        this.updateUI();
        
        audioManager.playSound('levelUp');
    }

    pauseGame() {
        this.gameState = 'paused';
        document.getElementById('pause-message').classList.remove('hidden');
    }

    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pause-message').classList.add('hidden');
    }

    restartGame() {
        this.startGame();
    }

    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over-message').classList.remove('hidden');
        audioManager.playSound('explosion');
    }

    hideAllMessages() {
        document.getElementById('start-message').classList.add('hidden');
        document.getElementById('pause-message').classList.add('hidden');
        document.getElementById('game-over-message').classList.add('hidden');
    }

    useSpecialWeapon() {
        if (this.specialWeaponCooldown <= 0 && this.specialWeaponCharges > 0 && this.player) {
            this.specialWeaponCharges--;
            this.specialWeaponCooldown = 300; 
            for (let i = -2; i <= 2; i++) {
                const angle = i * 0.3;
                this.bullets.push(new Bullet(
                    this.player.x,
                    this.player.y,
                    Math.sin(angle) * 8,
                    -12,
                    'special',
                    30
                ));
            }
            
            this.updateWeaponDisplay();
            audioManager.playSound('specialWeapon');
        }
    }

    spawnEnemy() {
        if (Math.random() < this.enemySpawnRate * (1 + this.level * 0.1)) {
            const enemyType = Math.random() < 0.1 ? 'fast' : Math.random() < 0.05 ? 'heavy' : 'normal';
            this.enemies.push(new Enemy(
                Math.random() * (this.canvas.width - 60) + 30,
                -30,
                enemyType
            ));
        }
    }

    spawnPowerup() {
        const currentTime = Date.now();
        if (currentTime - this.lastPowerupTime > 12000 && Math.random() < this.powerupSpawnRate) {
            const powerupTypes = [
                'health', 'weapon', 'shield', 'specialAmmo', 
                'armor', 'criticalBoost', 'fireRate', 'bulletSpeed', 
                'energyShield', 'maxHealth'
            ];
            const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
            this.powerups.push(new Powerup(
                Math.random() * (this.canvas.width - 40) + 20,
                -20,
                type
            ));
            this.lastPowerupTime = currentTime;
        }
    }

    update() {
        if (this.gameState !== 'playing') return;

        if (this.player) {
            this.updatePlayerMovement();
            this.player.update();
            
            if (this.mobile && this.mobileControls.shooting) {
                this.player.shoot();
            }
        }

        if (this.boss) {
            this.boss.update();
            if (this.boss.health <= 0) {
                this.addScore(this.boss.points);
                this.createExplosion(this.boss.x, this.boss.y, this.boss.size * 2);
                this.screenShake = 60;
                this.boss = null;
                this.bossLevel = false;
                this.showNotification('BOSS DEFEATED!', '#00ff00');
                audioManager.playSound('explosion');
            }
        }

        this.updateBullets();
        this.updateEnemies();
        this.updateParticles();
        this.updatePowerups();
        this.updateExplosions();
        this.updateStars();
        if (!this.bossLevel) {
            this.spawnEnemy();
            this.spawnPowerup();
        }

        this.checkCollisions();
        this.updateTimers();
        this.updateUI();
        this.checkLevelUp();
    }

    updatePlayerMovement() {
        if (!this.player) return;

        let moveX = 0;
        let moveY = 0;

        if (this.mobile) {
            moveX = this.mobileControls.movement.x;
            moveY = this.mobileControls.movement.y;
        } else {
            if (this.keys['ArrowLeft'] || this.keys['KeyA']) moveX -= 1;
            if (this.keys['ArrowRight'] || this.keys['KeyD']) moveX += 1;
            if (this.keys['ArrowUp'] || this.keys['KeyW']) moveY -= 1;
            if (this.keys['ArrowDown'] || this.keys['KeyS']) moveY += 1;
        }

        this.player.move(moveX, moveY);
    }

    updateBullets() {
       
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();

            if (bullet.y < -10 || bullet.y > this.canvas.height + 10 ||
                bullet.x < -10 || bullet.x > this.canvas.width + 10) {
                this.bullets.splice(i, 1);
            }
        }

        
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            bullet.update();

            if (bullet.y < -10 || bullet.y > this.canvas.height + 10) {
                this.enemyBullets.splice(i, 1);
            }
        }
    }

    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update();

            if (Math.random() < 0.005 && this.player) {
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 300) {
                    this.enemyBullets.push(new Bullet(
                        enemy.x,
                        enemy.y + 20,
                        (dx / distance) * 3,
                        (dy / distance) * 3,
                        'enemy',
                        10
                    ));
                }
            }

            if (enemy.y > this.canvas.height + 50) {
                this.enemies.splice(i, 1);
            }
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    updatePowerups() {
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.update();

            if (powerup.y > this.canvas.height + 50) {
                this.powerups.splice(i, 1);
            }
        }
    }

    updateExplosions() {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.update();

            if (explosion.life <= 0) {
                this.explosions.splice(i, 1);
            }
        }
    }

    updateStars() {
        for (const star of this.stars) {
            star.y += star.speed * this.backgroundSpeed;
            if (star.y > this.canvas.height) {
                star.y = -5;
                star.x = Math.random() * this.canvas.width;
            }
        }
    }

    updateTimers() {
        if (this.specialWeaponCooldown > 0) {
            this.specialWeaponCooldown--;
        }

        if (this.shieldDuration > 0) {
            this.shieldDuration--;
            if (this.shieldDuration <= 0) {
                this.shieldActive = false;
            }
        }

        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer <= 0) {
                this.combo = 0;
                document.getElementById('combo-counter').classList.add('hidden');
            }
        }
    }

    checkCollisions() {
        if (!this.player) return;
        if (this.boss) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                
                if (this.isColliding(bullet, this.boss)) {
                    this.boss.health -= bullet.damage;
                    this.bullets.splice(i, 1);
                    this.createParticles(this.boss.x, this.boss.y, '#ff4444', 8);
                    this.screenShake = 5;
                    
                    if (this.boss.health <= 0) {
                        this.addScore(this.boss.points);
                        this.addExperience(this.boss.points / 2);
                        this.streak += 10;
                        this.combo += 5;
                        this.comboTimer = 300;
                        
                        document.getElementById('combo-value').textContent = this.combo;
                        document.getElementById('combo-counter').classList.remove('hidden');
                        
                        this.createExplosion(this.boss.x, this.boss.y, this.boss.size * 2);
                        this.showCriticalHit(this.boss.x, this.boss.y);
                        this.addScore(this.boss.points);
                    } else {
                        audioManager.playSound('enemyHit');
                    }
                    break;
                }
            }
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                if (this.isColliding(bullet, enemy)) {
                  
                    enemy.health -= bullet.damage;
                    this.bullets.splice(i, 1);
                    this.createParticles(enemy.x, enemy.y, '#ff4444', 5);
                    
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.addScore(enemy.points);
                        this.addExperience(enemy.points / 2);
                        this.streak++;
                        this.combo++;
                        this.comboTimer = 180; 
                        if (this.combo > 1) {
                            document.getElementById('combo-value').textContent = this.combo;
                            document.getElementById('combo-counter').classList.remove('hidden');
                        }
                        
                        this.createExplosion(enemy.x, enemy.y, enemy.size);
                        audioManager.playSound('explosion');
                        if (Math.random() < 0.1) {
                            this.showCriticalHit(enemy.x, enemy.y);
                            this.addScore(enemy.points);
                        }
                    } else {
                        audioManager.playSound('enemyHit');
                    }
                    break;
                }
            }
        }
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            
            if (this.isColliding(bullet, this.player) && !this.shieldActive) {
                this.enemyBullets.splice(i, 1);
                this.takeDamage(bullet.damage);
                this.createParticles(this.player.x, this.player.y, '#ff0000', 8);
                audioManager.playSound('playerHit');
            }
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (this.isColliding(this.player, enemy) && !this.shieldActive) {
                this.enemies.splice(i, 1);
                this.takeDamage(20);
                this.createExplosion(enemy.x, enemy.y, enemy.size);
                this.createParticles(this.player.x, this.player.y, '#ff0000', 10);
                audioManager.playSound('explosion');
            }
        }

        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            
            if (this.isColliding(this.player, powerup)) {
                this.powerups.splice(i, 1);
                this.collectPowerup(powerup);
                this.createParticles(powerup.x, powerup.y, '#00ff00', 8);
                audioManager.playSound('powerup');
            }
        }
    }

    isColliding(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.size + obj2.size) / 2;
    }

    takeDamage(damage) {
        let actualDamage = damage;
        
        if (this.armor > 0) {
            const armorReduction = Math.min(0.8, this.armor / this.maxArmor * 0.5);
            actualDamage = damage * (1 - armorReduction);
            this.armor = Math.max(0, this.armor - Math.floor(damage * 0.1));
        }
        
        this.health -= actualDamage;
        this.streak = 0;
        
        if (this.health <= 0) {
            this.health = 0;
            this.lives--;
            
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.health = this.maxHealth;
                this.armor = this.maxArmor * 0.5;
                this.showNotification('Life Lost!', '#ff0000');
            }
        }
        
        this.showDamageNumber(this.player.x, this.player.y, Math.floor(actualDamage), '#ff0000');
        
        document.querySelector('.game-container').classList.add('damage-flash');
        setTimeout(() => {
            document.querySelector('.game-container').classList.remove('damage-flash');
        }, 300);
    }

    calculateDamage(baseDamage) {
        let finalDamage = baseDamage;
        
        if (Math.random() < this.criticalChance) {
            finalDamage *= this.criticalDamage;
            return { damage: finalDamage, critical: true };
        }
        
        return { damage: finalDamage, critical: false };
    }

    showDamageNumber(x, y, damage, color) {
        const damageElement = document.createElement('div');
        damageElement.className = 'damage-number';
        damageElement.textContent = Math.floor(damage);
        damageElement.style.position = 'absolute';
        damageElement.style.left = x + 'px';
        damageElement.style.top = y + 'px';
        damageElement.style.color = color;
        damageElement.style.fontSize = '16px';
        damageElement.style.fontWeight = 'bold';
        damageElement.style.pointerEvents = 'none';
        damageElement.style.zIndex = '1000';
        damageElement.style.animation = 'damageFloat 2s ease-out forwards';
        
        document.body.appendChild(damageElement);
        
        setTimeout(() => {
            if (document.body.contains(damageElement)) {
                document.body.removeChild(damageElement);
            }
        }, 2000);
    }

    collectPowerup(powerup) {
        switch (powerup.type) {
            case 'health':
                this.health = Math.min(this.maxHealth, this.health + 25);
                this.showNotification('Health Restored!', '#00ff00');
                break;
            case 'weapon':
                this.weaponLevel = Math.min(10, this.weaponLevel + 1);
                this.showNotification('Weapon Upgraded!', '#ffa500');
                break;
            case 'shield':
                this.shieldActive = true;
                this.shieldDuration = 600;
                this.showNotification('Shield Activated!', '#00ffff');
                audioManager.playSound('shield');
                break;
            case 'specialAmmo':
                this.specialWeaponCharges = Math.min(5, this.specialWeaponCharges + 2);
                this.showNotification('Special Ammo!', '#ff00ff');
                break;
            case 'armor':
                this.armor = Math.min(this.maxArmor, this.armor + 30);
                this.showNotification('Armor Plating!', '#888888');
                break;
            case 'criticalBoost':
                this.criticalChance = Math.min(0.5, this.criticalChance + 0.05);
                this.criticalDamage = Math.min(4.0, this.criticalDamage + 0.2);
                this.showNotification('Critical Boost!', '#ff6600');
                break;
            case 'fireRate':
                this.fireRate = Math.min(3.0, this.fireRate + 0.3);
                this.showNotification('Fire Rate Up!', '#ffff00');
                break;
            case 'bulletSpeed':
                this.bulletSpeed = Math.min(2.5, this.bulletSpeed + 0.2);
                this.showNotification('Bullet Speed Up!', '#00ff88');
                break;
            case 'energyShield':
                this.energyShield = Math.min(this.maxEnergyShield, this.energyShield + 20);
                this.showNotification('Energy Shield!', '#0088ff');
                break;
            case 'maxHealth':
                this.maxHealth += 20;
                this.health += 20;
                this.showNotification('Max Health Up!', '#ff0088');
                break;
        }
    }

    addScore(points) {
        this.score += points * (this.combo > 1 ? this.combo : 1);
        const scoreElement = document.getElementById('score');
        scoreElement.classList.add('score-increase');
        setTimeout(() => {
            scoreElement.classList.remove('score-increase');
        }, 400);
    }

    addExperience(exp) {
        this.experience += exp;
        
        if (this.experience >= this.experienceToNext) {
            this.playerLevel++;
            this.experience -= this.experienceToNext;
            this.experienceToNext = Math.floor(this.experienceToNext * 1.5);
            this.maxHealth += 10;
            this.health = this.maxHealth;
            this.showNotification(`Level ${this.playerLevel}!`, '#ffd700');
            audioManager.playSound('levelUp');
        }
    }

    checkLevelUp() {
        const scoreThreshold = this.level * 1000;
        if (this.score >= scoreThreshold) {
            this.level++;
            if (this.level % 5 === 0 && !this.boss) {
                this.spawnBoss();
            } else {
                this.enemySpawnRate = Math.min(0.08, this.enemySpawnRate + 0.005);
                this.backgroundSpeed = Math.min(3, this.backgroundSpeed + 0.1);
                this.showNotification(`Wave ${this.level}!`, '#ff0000');
                audioManager.playSound('bossWarning');
            }
        }
    }

    spawnBoss() {
        this.bossLevel = true;
        this.boss = new Boss(this.canvas.width / 2, -100, Math.floor(this.level / 5));
        this.showNotification('BOSS INCOMING!', '#ff0000');
        this.screenShake = 30;
        audioManager.playSound('bossWarning');
    }

    updateScreenShake() {
        if (this.screenShake > 0) {
            this.screenShake--;
            this.ctx.save();
            this.ctx.translate(
                (Math.random() - 0.5) * this.screenShake * 0.5,
                (Math.random() - 0.5) * this.screenShake * 0.5
            );
        }
    }

    restoreScreenShake() {
        if (this.screenShake > 0) {
            this.ctx.restore();
        }
    }

    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    createExplosion(x, y, size) {
        this.explosions.push(new Explosion(x, y, size));
    }

    showCriticalHit(x, y) {
        const critElement = document.createElement('div');
        critElement.className = 'critical-hit';
        critElement.textContent = 'CRITICAL!';
        critElement.style.left = x + 'px';
        critElement.style.top = y + 'px';
        document.body.appendChild(critElement);
        
        setTimeout(() => {
            document.body.removeChild(critElement);
        }, 2000);
    }

    showNotification(text, color) {
        const notification = document.createElement('div');
        notification.className = 'powerup-notification';
        notification.textContent = text;
        notification.style.color = color;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        document.getElementById('streak').textContent = this.streak;
        document.getElementById('player-level').textContent = this.playerLevel;
        document.getElementById('weapon-level').textContent = this.weaponLevel;
        
        const xpPercent = (this.experience / this.experienceToNext) * 100;
        document.getElementById('xp-fill').style.width = xpPercent + '%';
        
        const healthPercent = (this.health / this.maxHealth) * 100;
        document.getElementById('health-fill').style.width = healthPercent + '%';
        
        const armorBar = document.getElementById('armor-fill');
        if (armorBar) {
            const armorPercent = (this.armor / this.maxArmor) * 100;
            armorBar.style.width = armorPercent + '%';
        }
        
        const shieldBar = document.getElementById('energy-shield-fill');
        if (shieldBar) {
            const shieldPercent = (this.energyShield / this.maxEnergyShield) * 100;
            shieldBar.style.width = shieldPercent + '%';
        }
        
        this.updateWeaponDisplay();
        this.updateMinimap();
    }

    updateWeaponDisplay() {
        const weaponIcons = {
            'plasma': '⚡',
            'laser': '🔴',
            'missile': '🚀',
            'railgun': '⚙️',
            'fusion': '🌟'
        };
        
        const weaponName = `${weaponIcons[this.weaponType] || '⚔️'} ${this.weaponType.toUpperCase()} Lv.${this.weaponLevel}`;
        
        let displayText = weaponName;
        
        if (this.specialWeaponCharges > 0) {
            displayText += ` | Special: ${this.specialWeaponCharges}`;
        }
        
        if (this.fireRate > 1) {
            displayText += ` | Fire Rate: x${this.fireRate.toFixed(1)}`;
        }
        
        if (this.criticalChance > 0.05) {
            displayText += ` | Crit: ${(this.criticalChance * 100).toFixed(1)}%`;
        }
        
        document.getElementById('weapon-display').innerHTML = displayText;
    }

    updateMinimap() {
        const minimap = document.getElementById('minimap');
        minimap.innerHTML = '';
        
        const scale = 0.1;
        const minimapWidth = 140;
        const minimapHeight = 140;
        
        if (this.player) {
            const playerDot = document.createElement('div');
            playerDot.style.position = 'absolute';
            playerDot.style.width = '4px';
            playerDot.style.height = '4px';
            playerDot.style.backgroundColor = '#00ff00';
            playerDot.style.borderRadius = '50%';
            playerDot.style.left = (this.player.x * scale) + 'px';
            playerDot.style.top = (this.player.y * scale) + 'px';
            minimap.appendChild(playerDot);
        }
        
        for (const enemy of this.enemies) {
            const enemyDot = document.createElement('div');
            enemyDot.style.position = 'absolute';
            enemyDot.style.width = '3px';
            enemyDot.style.height = '3px';
            enemyDot.style.backgroundColor = '#ff0000';
            enemyDot.style.borderRadius = '50%';
            enemyDot.style.left = (enemy.x * scale) + 'px';
            enemyDot.style.top = (enemy.y * scale) + 'px';
            minimap.appendChild(enemyDot);
        }
    }

    render() {
        this.updateScreenShake();
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(10, 10, 40, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 20, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderStars();

        if (this.gameState === 'playing') {
            if (this.bossLevel && this.boss) {
                const time = Date.now() * 0.001;
                this.ctx.fillStyle = `rgba(255, 0, 0, ${Math.sin(time * 3) * 0.1 + 0.05})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            if (this.shieldActive && this.player) {
                this.ctx.beginPath();
                this.ctx.arc(this.player.x, this.player.y, this.player.size + 15, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(Date.now() * 0.01) * 0.3})`;
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }

            if (this.player) this.player.render(this.ctx);
            if (this.boss) this.boss.render(this.ctx);
            
            for (const bullet of this.bullets) bullet.render(this.ctx);
            for (const bullet of this.enemyBullets) bullet.render(this.ctx);
            for (const enemy of this.enemies) enemy.render(this.ctx);
            for (const powerup of this.powerups) powerup.render(this.ctx);
            for (const particle of this.particles) particle.render(this.ctx);
            for (const explosion of this.explosions) explosion.render(this.ctx);
        }
        
        this.restoreScreenShake();
    }

    renderStars() {
        for (const star of this.stars) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.speed = 5;
        this.shootCooldown = 0;
    }

    move(dx, dy) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;
        this.x = Math.max(this.size/2, Math.min(game.canvas.width - this.size/2, this.x));
        this.y = Math.max(this.size/2, Math.min(game.canvas.height - this.size/2, this.y));
    }

    shoot() {
        if (this.shootCooldown <= 0) {
            const weaponLevel = game.weaponLevel;
            const weaponType = game.weaponType;
            const baseDamage = 15 + (weaponLevel - 1) * 8;
            const fireRateModifier = game.fireRate;
            const speedModifier = game.bulletSpeed;
            const leftCannonX = this.x - this.size/3;
            const centerCannonX = this.x;
            const rightCannonX = this.x + this.size/3;
            const cannonY = this.y - this.size/6;
            
            switch (weaponType) {
                case 'plasma':
                    this.firePlasmaWeapon(leftCannonX, centerCannonX, rightCannonX, cannonY, baseDamage, speedModifier, weaponLevel);
                    break;
                case 'laser':
                    this.fireLaserWeapon(leftCannonX, centerCannonX, rightCannonX, cannonY, baseDamage, speedModifier, weaponLevel);
                    break;
                case 'missile':
                    this.fireMissileWeapon(leftCannonX, centerCannonX, rightCannonX, cannonY, baseDamage, speedModifier, weaponLevel);
                    break;
                case 'railgun':
                    this.fireRailgunWeapon(leftCannonX, centerCannonX, rightCannonX, cannonY, baseDamage, speedModifier, weaponLevel);
                    break;
                case 'fusion':
                    this.fireFusionWeapon(leftCannonX, centerCannonX, rightCannonX, cannonY, baseDamage, speedModifier, weaponLevel);
                    break;
            }
            
            this.shootCooldown = Math.max(2, Math.floor((15 - weaponLevel * 2) / fireRateModifier));
            audioManager.playSound('shoot');
        }
    }

    firePlasmaWeapon(leftX, centerX, rightX, y, damage, speed, level) {
        const baseSpeed = -8 * speed;
        
        if (level === 1) {
            game.bullets.push(new Bullet(leftX, y, -0.5, baseSpeed, 'plasma', damage));
            game.bullets.push(new Bullet(centerX, y, 0, baseSpeed, 'plasma', damage));
            game.bullets.push(new Bullet(rightX, y, 0.5, baseSpeed, 'plasma', damage));
        } else if (level === 2) {
            game.bullets.push(new Bullet(leftX, y, -0.3, baseSpeed * 1.1, 'plasma', damage));
            game.bullets.push(new Bullet(centerX, y, 0, baseSpeed * 1.1, 'plasma', damage));
            game.bullets.push(new Bullet(rightX, y, 0.3, baseSpeed * 1.1, 'plasma', damage));
        } else if (level >= 3) {
            for (let i = 0; i < level; i++) {
                const angle = (i - level/2) * 0.4;
                game.bullets.push(new Bullet(centerX, y, Math.sin(angle) * 2, baseSpeed * 1.2, 'plasma', damage));
            }
        }
    }

    fireLaserWeapon(leftX, centerX, rightX, y, damage, speed, level) {
        const baseSpeed = -12 * speed;
        damage = damage * 0.8; 
        
        if (level === 1) {
            game.bullets.push(new Bullet(centerX, y, 0, baseSpeed, 'laser', damage));
        } else if (level === 2) {
            game.bullets.push(new Bullet(leftX, y, 0, baseSpeed, 'laser', damage));
            game.bullets.push(new Bullet(rightX, y, 0, baseSpeed, 'laser', damage));
        } else if (level >= 3) {
            for (let i = 0; i < level * 2; i++) {
                const offsetX = (Math.random() - 0.5) * this.size;
                game.bullets.push(new Bullet(centerX + offsetX, y, 0, baseSpeed, 'laser', damage * 0.7));
            }
        }
    }

    fireMissileWeapon(leftX, centerX, rightX, y, damage, speed, level) {
        const baseSpeed = -6 * speed;
        damage = damage * 1.5; 
        
        if (level === 1) {
            game.bullets.push(new Bullet(centerX, y, 0, baseSpeed, 'missile', damage));
        } else if (level === 2) {
            game.bullets.push(new Bullet(leftX, y, -0.2, baseSpeed, 'missile', damage));
            game.bullets.push(new Bullet(rightX, y, 0.2, baseSpeed, 'missile', damage));
        } else if (level >= 3) {
            for (let i = 0; i < level; i++) {
                const angle = (i - level/2) * 0.3;
                game.bullets.push(new Bullet(centerX, y, Math.sin(angle), baseSpeed, 'homing_missile', damage));
            }
        }
    }

    fireRailgunWeapon(leftX, centerX, rightX, y, damage, speed, level) {
        const baseSpeed = -15 * speed;
        damage = damage * 2; 
        
        if (level === 1) {
            game.bullets.push(new Bullet(centerX, y, 0, baseSpeed, 'railgun', damage));
        } else if (level >= 2) {
            for (let i = 0; i < level; i++) {
                const offsetX = (i - level/2) * 15;
                game.bullets.push(new Bullet(centerX + offsetX, y, 0, baseSpeed, 'piercing_railgun', damage));
            }
        }
    }

    fireFusionWeapon(leftX, centerX, rightX, y, damage, speed, level) {
        const baseSpeed = -10 * speed;
        damage = damage * 1.3; 
        
        if (level === 1) {
            game.bullets.push(new Bullet(centerX, y, 0, baseSpeed, 'fusion', damage));
        } else if (level >= 2) {
            const orbCount = level + 1;
            for (let i = 0; i < orbCount; i++) {
                const angle = (i / orbCount) * Math.PI * 2;
                const orbX = centerX + Math.cos(angle) * 20;
                const orbY = y + Math.sin(angle) * 10;
                game.bullets.push(new Bullet(orbX, orbY, Math.cos(angle) * 2, baseSpeed, 'fusion_orb', damage));
            }
        }
    }

    update() {
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const time = Date.now() * 0.003;
        const enginePulse = Math.sin(time * 4) * 0.4 + 0.8;
        const weaponGlow = Math.sin(time * 3) * 0.3 + 0.9;
        const energyFlow = Math.sin(time * 6) * 0.2 + 0.8;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(-this.size/2 + 3, -this.size/2 + 3, this.size, this.size);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(-this.size/2 + 1, -this.size/2 + 1, this.size, this.size);
        
        const mainGradient = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
        mainGradient.addColorStop(0, '#000d1a');
        mainGradient.addColorStop(0.2, '#001f3d');
        mainGradient.addColorStop(0.4, '#0033cc');
        mainGradient.addColorStop(0.6, '#0066ff');
        mainGradient.addColorStop(0.8, '#00aaff');
        mainGradient.addColorStop(1, '#00ffff');
        
        ctx.fillStyle = mainGradient;
        ctx.beginPath();
        ctx.moveTo(0, -this.size/1.8);
        ctx.lineTo(-this.size/8, -this.size/2.2);
        ctx.lineTo(-this.size/4, -this.size/2.8);
        ctx.lineTo(-this.size/2.5, -this.size/4);
        ctx.lineTo(-this.size/1.8, -this.size/8);
        ctx.lineTo(-this.size/1.6, 0);
        ctx.lineTo(-this.size/1.4, this.size/6);
        ctx.lineTo(-this.size/2, this.size/3);
        ctx.lineTo(-this.size/3, this.size/2.2);
        ctx.lineTo(-this.size/5, this.size/1.8);
        ctx.lineTo(-this.size/8, this.size/1.6);
        ctx.lineTo(0, this.size/1.5);
        ctx.lineTo(this.size/8, this.size/1.6);
        ctx.lineTo(this.size/5, this.size/1.8);
        ctx.lineTo(this.size/3, this.size/2.2);
        ctx.lineTo(this.size/2, this.size/3);
        ctx.lineTo(this.size/1.4, this.size/6);
        ctx.lineTo(this.size/1.6, 0);
        ctx.lineTo(this.size/1.8, -this.size/8);
        ctx.lineTo(this.size/2.5, -this.size/4);
        ctx.lineTo(this.size/4, -this.size/2.8);
        ctx.lineTo(this.size/8, -this.size/2.2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 220, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        const cockpitGradient = ctx.createRadialGradient(0, -this.size/3, 0, 0, -this.size/3, this.size/4);
        cockpitGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        cockpitGradient.addColorStop(0.3, 'rgba(135, 206, 250, 0.8)');
        cockpitGradient.addColorStop(0.6, 'rgba(0, 191, 255, 0.7)');
        cockpitGradient.addColorStop(1, 'rgba(0, 100, 200, 0.5)');
        
        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        ctx.moveTo(0, -this.size/1.9);
        ctx.lineTo(-this.size/5, -this.size/2.5);
        ctx.lineTo(-this.size/6, -this.size/3);
        ctx.lineTo(-this.size/8, -this.size/4);
        ctx.lineTo(0, -this.size/5);
        ctx.lineTo(this.size/8, -this.size/4);
        ctx.lineTo(this.size/6, -this.size/3);
        ctx.lineTo(this.size/5, -this.size/2.5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1a2d4a';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(0, -this.size/3, 3, 0, Math.PI * 2);
        ctx.fill();
        const wingPods = [
            {x: -this.size/2.2, y: this.size/12, width: this.size/5, height: this.size/4},
            {x: this.size/2.2 - this.size/5, y: this.size/12, width: this.size/5, height: this.size/4}
        ];
        
        wingPods.forEach(pod => {
            ctx.fillStyle = '#0066cc';
            ctx.fillRect(pod.x, pod.y, pod.width, pod.height);
            ctx.fillStyle = `rgba(0, 255, 255, ${energyFlow})`;
            ctx.fillRect(pod.x + 2, pod.y + 2, pod.width - 4, 3);
            ctx.fillRect(pod.x + 2, pod.y + pod.height - 5, pod.width - 4, 3);
        });
        
        ctx.strokeStyle = `rgba(0, 255, 255, ${energyFlow})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-this.size/2.5, -this.size/6);
        ctx.lineTo(-this.size/4, 0);
        ctx.lineTo(-this.size/5, this.size/8);
        ctx.moveTo(this.size/2.5, -this.size/6);
        ctx.lineTo(this.size/4, 0);
        ctx.lineTo(this.size/5, this.size/8);
        ctx.moveTo(0, -this.size/4);
        ctx.lineTo(0, this.size/3);
        ctx.stroke();
        
        const energyNodes = [
            {x: -this.size/4, y: 0}, {x: this.size/4, y: 0},
            {x: -this.size/6, y: this.size/6}, {x: this.size/6, y: this.size/6},
            {x: 0, y: -this.size/6}, {x: 0, y: this.size/8}
        ];
        
        energyNodes.forEach((node, index) => {
            ctx.fillStyle = `rgba(0, 255, 255, ${Math.sin(time * 8 + index) * 0.4 + 0.8})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        const cannonArrays = [
            {x: -this.size/2.8, y: -this.size/8, name: 'Left Array'},
            {x: 0, y: -this.size/6, name: 'Center Array'},
            {x: this.size/2.8, y: -this.size/8, name: 'Right Array'}
        ];
        
        cannonArrays.forEach((array, arrayIndex) => {
            
            ctx.fillStyle = '#1a2d4a';
            ctx.fillRect(array.x - 6, array.y - 8, 12, 16);
            
            const barrels = [
                {x: array.x - 4, y: array.y},
                {x: array.x, y: array.y - 3},
                {x: array.x + 4, y: array.y}
            ];
            
            barrels.forEach((barrel, barrelIndex) => {
                
                ctx.fillStyle = '#2a4d69';
                ctx.fillRect(barrel.x - 2, barrel.y - 8, 4, 16);
                
                ctx.fillStyle = `rgba(255, 150, 0, ${weaponGlow})`;
                ctx.fillRect(barrel.x - 1.5, barrel.y - 10, 3, 4);
                
                if (this.shootCooldown <= 0) {
                    const chargeIntensity = Math.sin(time * 12 + arrayIndex * 2 + barrelIndex) * 0.4 + 0.8;
                    ctx.fillStyle = `rgba(0, 255, 100, ${chargeIntensity})`;
                    ctx.fillRect(barrel.x - 1, barrel.y - 12, 2, 3);
                    ctx.fillStyle = `rgba(255, 255, 255, ${chargeIntensity * 0.8})`;
                    ctx.fillRect(barrel.x - 0.5, barrel.y - 13, 1, 1);
                }
                if (this.shootCooldown > 0 && this.shootCooldown < 8) {
                    const fireIntensity = (8 - this.shootCooldown) / 8;
                    
                    ctx.fillStyle = `rgba(255, 255, 255, ${fireIntensity})`;
                    ctx.fillRect(barrel.x - 3, barrel.y - 14, 6, 8);
                    ctx.fillStyle = `rgba(0, 255, 255, ${fireIntensity * 0.8})`;
                    ctx.fillRect(barrel.x - 2, barrel.y - 16, 4, 12);
                    for (let ring = 0; ring < 3; ring++) {
                        ctx.strokeStyle = `rgba(255, 100, 0, ${fireIntensity * (1 - ring * 0.3)})`;
                        ctx.lineWidth = 2 - ring * 0.5;
                        ctx.beginPath();
                        ctx.arc(barrel.x, barrel.y - 10, 4 + ring * 2, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            });
            
            ctx.strokeStyle = `rgba(255, 165, 0, ${weaponGlow})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(array.x, array.y + 8);
            ctx.lineTo(0, this.size/8);
            ctx.stroke();
        });
        
        const engineSystems = [
            {x: -this.size/3.5, width: this.size/6, intensity: enginePulse * 0.95, name: 'Port'},
            {x: 0, width: this.size/5, intensity: enginePulse, name: 'Main'},
            {x: this.size/3.5, width: this.size/6, intensity: enginePulse * 0.95, name: 'Starboard'}
        ];
        
        engineSystems.forEach((engine, index) => {
            ctx.fillStyle = '#0f1419';
            ctx.fillRect(engine.x - engine.width/2, this.size/2 - 4, engine.width, 12);
            ctx.fillStyle = '#2a2a3a';
            ctx.fillRect(engine.x - engine.width/3, this.size/2 - 2, engine.width * 0.66, 8);
            const exhaustLength = 18 + Math.sin(time * 8 + index * 2) * 6;
            const coreGradient = ctx.createLinearGradient(0, this.size/2, 0, this.size/2 + exhaustLength);
            coreGradient.addColorStop(0, `rgba(255, 255, 255, ${engine.intensity})`);
            coreGradient.addColorStop(0.1, `rgba(255, 220, 100, ${engine.intensity * 0.9})`);
            coreGradient.addColorStop(0.3, `rgba(255, 150, 0, ${engine.intensity * 0.8})`);
            coreGradient.addColorStop(0.6, `rgba(255, 80, 0, ${engine.intensity * 0.6})`);
            coreGradient.addColorStop(0.8, `rgba(255, 40, 40, ${engine.intensity * 0.4})`);
            coreGradient.addColorStop(1, `rgba(255, 0, 100, ${engine.intensity * 0.2})`);
            
            ctx.fillStyle = coreGradient;
            ctx.fillRect(engine.x - engine.width/4, this.size/2 + 1, engine.width/2, exhaustLength);
            
            const outerGradient = ctx.createLinearGradient(0, this.size/2, 0, this.size/2 + exhaustLength * 0.8);
            outerGradient.addColorStop(0, `rgba(255, 180, 0, ${engine.intensity * 0.6})`);
            outerGradient.addColorStop(0.4, `rgba(255, 100, 0, ${engine.intensity * 0.4})`);
            outerGradient.addColorStop(0.8, `rgba(255, 60, 60, ${engine.intensity * 0.2})`);
            outerGradient.addColorStop(1, `rgba(200, 0, 100, ${engine.intensity * 0.1})`);
            
            ctx.fillStyle = outerGradient;
            ctx.fillRect(engine.x - engine.width/3, this.size/2 + 3, engine.width * 0.66, exhaustLength * 0.8);
            ctx.fillStyle = `rgba(255, 255, 255, ${engine.intensity * 1.2})`;
            ctx.fillRect(engine.x - engine.width/6, this.size/2 + 1, engine.width/3, 6);
            for (let particle = 0; particle < 8; particle++) {
                const particleY = this.size/2 + 6 + Math.random() * exhaustLength;
                const particleX = engine.x + (Math.random() - 0.5) * engine.width * 0.8;
                const particleSize = Math.random() * 3 + 1;
                const particleAlpha = Math.random() * engine.intensity * 0.6;
                
                ctx.fillStyle = `rgba(255, ${150 + Math.random() * 105}, ${Math.random() * 100}, ${particleAlpha})`;
                ctx.fillRect(particleX, particleY, particleSize, particleSize);
            }
            
            if (Math.abs(game.keys?.['ArrowLeft'] || game.keys?.['KeyA']) || 
                Math.abs(game.keys?.['ArrowRight'] || game.keys?.['KeyD']) ||
                game.mobileControls?.movement?.x !== 0 || 
                game.mobileControls?.movement?.y !== 0) {
                
                const afterburnerLength = exhaustLength * 0.4;
                ctx.fillStyle = `rgba(0, 150, 255, ${engine.intensity * 0.5})`;
                ctx.fillRect(engine.x - engine.width/6, this.size/2 + exhaustLength - afterburnerLength, 
                           engine.width/3, afterburnerLength);
            }
        });
        
        ctx.strokeStyle = 'rgba(120, 180, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-this.size/2.5, -this.size/4);
        ctx.lineTo(-this.size/4, this.size/8);
        ctx.moveTo(this.size/2.5, -this.size/4);
        ctx.lineTo(this.size/4, this.size/8);
        ctx.moveTo(0, -this.size/3);
        ctx.lineTo(0, this.size/4);
        ctx.moveTo(-this.size/5, -this.size/8);
        ctx.lineTo(this.size/5, -this.size/8);
        ctx.stroke();
        
        const armorDetails = [
            {x: -this.size/4, y: -this.size/6}, {x: this.size/4, y: -this.size/6},
            {x: -this.size/3, y: 0}, {x: this.size/3, y: 0},
            {x: -this.size/5, y: this.size/8}, {x: this.size/5, y: this.size/8}
        ];
        
        armorDetails.forEach(detail => {
            ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(detail.x, detail.y, 1, 0, Math.PI * 2);
            ctx.fill();
        });
        
        if (game.shieldActive) {
            const shieldPulse = Math.sin(time * 10) * 0.3 + 0.7;
            
            ctx.strokeStyle = `rgba(0, 255, 255, ${shieldPulse * 0.8})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.size/2 + 12, 0, Math.PI * 2);
            ctx.stroke();
            
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
                const radius = this.size/2 + 8;
                const x1 = Math.cos(angle) * radius;
                const y1 = Math.sin(angle) * radius;
                const x2 = Math.cos(angle + Math.PI/6) * radius;
                const y2 = Math.sin(angle + Math.PI/6) * radius;
                
                ctx.strokeStyle = `rgba(0, 255, 255, ${shieldPulse * 0.4})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            
            for (let ripple = 0; ripple < 3; ripple++) {
                const rippleRadius = (this.size/2 + 6) + Math.sin(time * 4 + ripple * 2) * 4;
                ctx.strokeStyle = `rgba(100, 255, 255, ${shieldPulse * (0.3 - ripple * 0.1)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(0, 0, rippleRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        const healthPercent = game.health / game.maxHealth;
        if (healthPercent < 0.3) {
            const warningPulse = Math.sin(time * 12) * 0.4 + 0.6;
            
            ctx.strokeStyle = `rgba(255, 0, 0, ${warningPulse})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.size/2 + 5, 0, Math.PI * 2);
            ctx.stroke();
            
           
            if (warningPulse > 0.8) {
                for (let spark = 0; spark < 5; spark++) {
                    const sparkX = (Math.random() - 0.5) * this.size;
                    const sparkY = (Math.random() - 0.5) * this.size;
                    ctx.fillStyle = `rgba(255, 255, 0, ${Math.random()})`;
                    ctx.fillRect(sparkX, sparkY, 1, 1);
                }
            }
        }
        
        if (this.shootCooldown <= 0) {
           
            ctx.strokeStyle = `rgba(0, 255, 0, ${Math.sin(time * 8) * 0.2 + 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, this.size/2 + 2, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

class Enemy {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        
        switch (type) {
            case 'fast':
                this.size = 20;
                this.speed = 3;
                this.health = 15;
                this.points = 15;
                this.color = '#ff6600';
                break;
            case 'heavy':
                this.size = 40;
                this.speed = 1;
                this.health = 50;
                this.points = 30;
                this.color = '#660066';
                break;
            default:
                this.size = 25;
                this.speed = 2;
                this.health = 25;
                this.points = 10;
                this.color = '#ff0000';
        }
        
        this.maxHealth = this.health;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.y += this.speed;
        this.angle += 0.05;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        
        if (this.health < this.maxHealth) {
            ctx.restore();
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2 - 8, this.size, 4);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2 - 8, 
                        this.size * (this.health / this.maxHealth), 4);
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
        }
        
        ctx.restore();
    }
}

class Bullet {
    constructor(x, y, vx, vy, type = 'player', damage = 10) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.damage = damage;
        this.piercing = type.includes('piercing') || type.includes('railgun');
        this.homing = type.includes('homing');
        this.explosive = type.includes('missile') || type.includes('fusion');
        this.life = 1;
        this.trail = [];
        this.age = 0;
        
        switch (type) {
            case 'special':
                this.size = 8;
                break;
            case 'laser':
                this.size = 2;
                break;
            case 'missile':
            case 'homing_missile':
                this.size = 6;
                break;
            case 'railgun':
            case 'piercing_railgun':
                this.size = 3;
                break;
            case 'fusion':
            case 'fusion_orb':
                this.size = 7;
                break;
            default:
                this.size = 4;
        }
    }

    update() {
        this.age++;
        
        if (this.homing && game.enemies.length > 0) {
            const target = this.findNearestEnemy();
            if (target) {
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const homingStrength = 0.3;
                
                this.vx += (dx / distance) * homingStrength;
                this.vy += (dy / distance) * homingStrength;
                
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 12) {
                    this.vx = (this.vx / speed) * 12;
                    this.vy = (this.vy / speed) * 12;
                }
            }
        }
        
        this.trail.push({x: this.x, y: this.y, age: this.age});
        if (this.trail.length > 8) {
            this.trail.shift();
        }
        
        this.x += this.vx;
        this.y += this.vy;
    }

    findNearestEnemy() {
        let nearest = null;
        let minDistance = Infinity;
        
        for (const enemy of game.enemies) {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        }
        
        return nearest;
    }

    render(ctx) {
        ctx.save();
        
        this.renderTrail(ctx);
        
        if (this.type === 'enemy') {
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        } else if (this.type === 'special') {
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            ctx.shadowBlur = 0;
        } else {
            this.renderWeaponBullet(ctx);
        }
        
        ctx.restore();
    }

    renderTrail(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = (i / this.trail.length) * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
        }
    }

    renderWeaponBullet(ctx) {
        const time = Date.now() * 0.005;
        
        switch (this.type) {
            case 'plasma':
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(this.x - this.size/4, this.y - this.size/2, this.size/2, this.size);
                ctx.fillStyle = '#00ffff';
                ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                break;
                
            case 'laser':
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 6;
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = this.size;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + 15);
                ctx.stroke();
                break;
                
            case 'missile':
            case 'homing_missile':
                ctx.fillStyle = '#ffa500';
                ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size * 1.5);
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(this.x - this.size/3, this.y, this.size * 0.66, this.size);
                
                ctx.fillStyle = `rgba(255, 100, 0, ${Math.sin(time * 10) * 0.5 + 0.5})`;
                ctx.fillRect(this.x - 2, this.y + this.size, 4, 8);
                break;
                
            case 'railgun':
            case 'piercing_railgun':
                ctx.shadowColor = '#8000ff';
                ctx.shadowBlur = 12;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = this.size * 2;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + 25);
                ctx.stroke();
                ctx.strokeStyle = '#8000ff';
                ctx.lineWidth = this.size;
                ctx.stroke();
                break;
                
            case 'fusion':
            case 'fusion_orb':
                ctx.shadowColor = '#ffff00';
                ctx.shadowBlur = 10;
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.5, '#ffff00');
                gradient.addColorStop(1, '#ff8000');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            default:
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(this.x - this.size/4, this.y - this.size/2, this.size/2, this.size);
                ctx.fillStyle = '#00ffff';
                ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }
        
        ctx.shadowBlur = 0;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.color = color;
        this.life = 60;
        this.maxLife = 60;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life--;
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
}

class Explosion {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.maxSize = size * 2;
        this.life = 30;
        this.maxLife = 30;
    }

    update() {
        this.size += this.maxSize / this.maxLife;
        this.life--;
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 20;
        this.speed = 1;
        this.angle = 0;
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.y += this.speed;
        this.angle += 0.1;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(this.angle + this.bobOffset) * 3);
        ctx.rotate(this.angle);
        
        const glowIntensity = Math.sin(this.angle * 2) * 0.3 + 0.7;
        
        switch (this.type) {
            case 'health':
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(-this.size/2, -2, this.size, 4);
                ctx.fillRect(-2, -this.size/2, 4, this.size);
                break;
                
            case 'weapon':
                ctx.shadowColor = '#ffa500';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ffa500';
                ctx.beginPath();
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(-this.size/2, this.size/2);
                ctx.lineTo(this.size/2, this.size/2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'shield':
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'specialAmmo':
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                break;
                
            case 'armor':
                ctx.shadowColor = '#888888';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#cccccc';
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size/3);
                ctx.fillRect(-this.size/2, -this.size/6, this.size, this.size/3);
                ctx.fillRect(-this.size/2, this.size/6, this.size, this.size/3);
                break;
                
            case 'criticalBoost':
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 10;
                ctx.fillStyle = '#ff6600';
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const radius = i % 2 === 0 ? this.size/2 : this.size/4;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'fireRate':
                ctx.shadowColor = '#ffff00';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ffff00';
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(-this.size/2 + i * 5, -this.size/2, 3, this.size);
                }
                break;
                
            case 'bulletSpeed':
                ctx.shadowColor = '#00ff88';
                ctx.shadowBlur = 8;
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-this.size/2, 0);
                ctx.lineTo(this.size/2, -this.size/3);
                ctx.lineTo(this.size/3, 0);
                ctx.lineTo(this.size/2, this.size/3);
                ctx.closePath();
                ctx.stroke();
                break;
                
            case 'energyShield':
                ctx.shadowColor = '#0088ff';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = `rgba(0, 136, 255, ${glowIntensity})`;
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(0, 0, (this.size/2) - i * 3, 0, Math.PI * 2);
                    ctx.stroke();
                }
                break;
                
            case 'maxHealth':
                ctx.shadowColor = '#ff0088';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ff0088';
                ctx.beginPath();
                ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-2, -this.size/3, 4, this.size * 0.66);
                ctx.fillRect(-this.size/3, -2, this.size * 0.66, 4);
                break;
        }
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

class Boss {
    constructor(x, y, tier = 1) {
        this.x = x;
        this.y = y;
        this.size = 80 + (tier * 20);
        this.tier = tier;
        this.speed = 1 + (tier * 0.2);
        this.health = 200 + (tier * 100);
        this.maxHealth = this.health;
        this.points = 500 + (tier * 300);
        
        this.angle = 0;
        this.shootCooldown = 0;
        this.specialAttackCooldown = 0;
        this.phase = 1;
        this.movePattern = 'descent';
        this.targetY = 100;
        
        this.moveTime = 0;
        this.direction = 1;
        this.attackPatterns = ['spread', 'laser', 'missiles', 'spiral'];
        this.currentPattern = 0;
    }

    update() {
        this.moveTime++;
        this.angle += 0.02;
        
        switch (this.movePattern) {
            case 'descent':
                this.y += this.speed;
                if (this.y >= this.targetY) {
                    this.movePattern = 'horizontal';
                }
                break;
                
            case 'horizontal':
                this.x += this.direction * this.speed * 2;
                if (this.x <= this.size || this.x >= game.canvas.width - this.size) {
                    this.direction *= -1;
                }
                
                this.y = this.targetY + Math.sin(this.moveTime * 0.02) * 20;
                break;
        }
        
        const healthPercent = this.health / this.maxHealth;
        if (healthPercent < 0.7 && this.phase === 1) {
            this.phase = 2;
            this.speed *= 1.5;
            game.showNotification('BOSS PHASE 2!', '#ff0000');
            game.screenShake = 20;
        } else if (healthPercent < 0.3 && this.phase === 2) {
            this.phase = 3;
            this.speed *= 1.5;
            game.showNotification('BOSS FINAL PHASE!', '#ff0000');
            game.screenShake = 30;
        }
        
        this.updateAttacks();
    }

    updateAttacks() {
        if (this.shootCooldown <= 0) {
            this.executeAttackPattern();
            this.shootCooldown = 60 - (this.phase * 10);
        } else {
            this.shootCooldown--;
        }
        
        if (this.specialAttackCooldown <= 0 && this.phase >= 2) {
            this.executeSpecialAttack();
            this.specialAttackCooldown = 180 - (this.phase * 30);
        } else {
            this.specialAttackCooldown--;
        }
    }

    executeAttackPattern() {
        const pattern = this.attackPatterns[this.currentPattern];
        
        switch (pattern) {
            case 'spread':
                for (let i = 0; i < 5; i++) {
                    const angle = (i - 2) * 0.3;
                    game.enemyBullets.push(new Bullet(
                        this.x,
                        this.y + this.size/2,
                        Math.sin(angle) * 4,
                        Math.cos(angle) * 4 + 3,
                        'enemy',
                        15
                    ));
                }
                break;
                
            case 'laser':
                if (game.player) {
                    const dx = game.player.x - this.x;
                    const dy = game.player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    for (let i = 0; i < 3; i++) {
                        game.enemyBullets.push(new Bullet(
                            this.x + (Math.random() - 0.5) * 20,
                            this.y + this.size/2,
                            (dx / distance) * 6,
                            (dy / distance) * 6,
                            'enemy',
                            20
                        ));
                    }
                }
                break;
                
            case 'missiles':
                for (let i = 0; i < 2; i++) {
                    const side = i === 0 ? -1 : 1;
                    game.enemyBullets.push(new Bullet(
                        this.x + side * this.size/3,
                        this.y + this.size/2,
                        side * 2,
                        5,
                        'enemy',
                        25
                    ));
                }
                break;
                
            case 'spiral':
                for (let i = 0; i < 8; i++) {
                    const angle = (this.moveTime * 0.1) + (i * Math.PI / 4);
                    game.enemyBullets.push(new Bullet(
                        this.x,
                        this.y + this.size/2,
                        Math.cos(angle) * 3,
                        Math.sin(angle) * 3 + 2,
                        'enemy',
                        12
                    ));
                }
                break;
        }
        
        this.currentPattern = (this.currentPattern + 1) % this.attackPatterns.length;
    }

    executeSpecialAttack() {
        if (this.phase === 2) {
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                game.enemyBullets.push(new Bullet(
                    this.x,
                    this.y,
                    Math.cos(angle) * 5,
                    Math.sin(angle) * 5,
                    'enemy',
                    18
                ));
            }
            game.screenShake = 15;
        } else if (this.phase === 3) {
            for (let i = 0; i < 6; i++) {
                game.enemyBullets.push(new Bullet(
                    Math.random() * game.canvas.width,
                    -20,
                    0,
                    8 + Math.random() * 4,
                    'enemy',
                    30
                ));
            }
            game.screenShake = 20;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const time = Date.now() * 0.003;
        const pulse = Math.sin(time * 4) * 0.3 + 0.7;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(-this.size/2 + 5, -this.size/2 + 5, this.size, this.size);
        
        const tierColors = [
            ['#ff0000', '#ff4444', '#ff8888'],
            ['#ff00ff', '#ff44ff', '#ff88ff'],
            ['#8800ff', '#aa44ff', '#cc88ff']
        ];
        const colors = tierColors[Math.min(this.tier - 1, 2)];
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size/2);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        if (this.phase >= 2) {
            ctx.strokeStyle = `rgba(255, 255, 0, ${pulse})`;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, 0, this.size/2 + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        if (this.phase >= 3) {
            ctx.strokeStyle = `rgba(255, 0, 255, ${pulse})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.size/2 + 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        const weaponCount = 4 + this.tier;
        for (let i = 0; i < weaponCount; i++) {
            const angle = (i / weaponCount) * Math.PI * 2;
            const weaponX = Math.cos(angle) * (this.size/2 - 10);
            const weaponY = Math.sin(angle) * (this.size/2 - 10);
            
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(weaponX - 3, weaponY - 3, 6, 6);
            
            if (this.shootCooldown < 10) {
                ctx.fillStyle = `rgba(255, 255, 255, ${(10 - this.shootCooldown) / 10})`;
                ctx.fillRect(weaponX - 5, weaponY - 5, 10, 10);
            }
        }
        
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(0, 255, 255, ${pulse * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2 + Math.sin(time * 6) * 5, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
        
        const barWidth = this.size * 1.5;
        const barHeight = 8;
        const barX = this.x - barWidth/2;
        const barY = this.y - this.size/2 - 20;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(`BOSS TIER ${this.tier} - PHASE ${this.phase}`, this.x, barY - 10);
    }
}

let game;
window.addEventListener('load', () => {
    game = new Game();
});
