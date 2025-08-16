class HelicopterGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.startScreen = document.getElementById('start-screen');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalBestScoreElement = document.getElementById('final-best-score');
        this.gameState = 'start';
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('helicopterBestScore')) || 0;
        this.helicopter = {
            x: 100,
            y: this.canvas.height / 2,
            width: 50,
            height: 25,
            velocity: 0,
            thrust: -1.5,
            gravity: 0.25,
            maxVelocity: 5,
            rotation: 0
        };       
        this.walls = [];
        this.wallWidth = 50;
        this.wallGap = 180;
        this.wallSpeed = 2.5;
        this.wallSpawnInterval = 200;
        this.wallSpawnTimer = 0;
        this.particles = [];
        this.screenShake = 0;
        this.backgroundOffset = 0;
        this.animationId = null;
        this.lastTime = 0;
        this.soundVisuals = [];       
        this.initializeGame();
        this.setupEventListeners();
        this.updateBestScoreDisplay();
    }
    
    initializeGame() {
        this.helicopter.x = 100;
        this.helicopter.y = this.canvas.height / 2;
        this.helicopter.velocity = 0;
        this.helicopter.rotation = 0;
        this.walls = [];
        this.particles = [];
        this.wallSpawnTimer = 0;
        this.score = 0;
        this.updateScoreDisplay();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleInput();
            }
        });
        
        this.canvas.addEventListener('click', () => {
            this.handleInput();
        });
        
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    handleInput() {
        if (this.gameState === 'playing') {
            this.helicopter.velocity = this.helicopter.thrust;
            this.createThrustParticles();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.startScreen.classList.add('hidden');
        this.initializeGame();
        this.gameLoop();
    }
    
    restartGame() {
        this.gameState = 'playing';
        this.gameOverScreen.classList.add('hidden');
        this.initializeGame();
        this.gameLoop();
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;       
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.helicopter.velocity += this.helicopter.gravity;
        this.helicopter.velocity = Math.max(-this.helicopter.maxVelocity, 
                                          Math.min(this.helicopter.maxVelocity, this.helicopter.velocity));
        this.helicopter.y += this.helicopter.velocity;
        this.helicopter.rotation = this.helicopter.velocity * 0.08;
        this.backgroundOffset -= 1;
        if (this.backgroundOffset < -100) this.backgroundOffset = 0;
        
        if (this.screenShake > 0) {
            this.screenShake = Math.max(0, this.screenShake - 0.5);
        }
        
        if (this.helicopter.y <= 0 || this.helicopter.y + this.helicopter.height >= this.canvas.height) {
            this.gameOver();
            return;
        }
        
        this.wallSpawnTimer++;
        if (this.wallSpawnTimer >= this.wallSpawnInterval) {
            this.spawnWall();
            this.wallSpawnTimer = 0;
        }
        
        for (let i = this.walls.length - 1; i >= 0; i--) {
            const wall = this.walls[i];
            wall.x -= this.wallSpeed;
            
            if (wall.x + this.wallWidth < 0) {
                this.walls.splice(i, 1);
                continue;
            }
            
            if (!wall.scored && wall.x + this.wallWidth < this.helicopter.x) {
                wall.scored = true;
                this.score++;
                this.updateScoreDisplay();
                this.createScoreParticles();
                this.createScoreVisual();
            }
            
            if (this.checkWallCollision(wall)) {
                this.screenShake = 15;
                this.gameOver();
                return;
            }
        }
        
        this.updateParticles(deltaTime);
        this.updateSoundVisuals(deltaTime);
    }
    
    spawnWall() {
        const minGapY = 50;
        const maxGapY = this.canvas.height - this.wallGap - 50;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        
        this.walls.push({
            x: this.canvas.width,
            gapY: gapY,
            scored: false
        });
    }
    
    checkWallCollision(wall) {
        const heli = this.helicopter;
        
        if (heli.x < wall.x + this.wallWidth && heli.x + heli.width > wall.x) {
            
            if (heli.y < wall.gapY || heli.y + heli.height > wall.gapY + this.wallGap) {
                return true;
            }
        }
        
        return false;
    }
    
    createThrustParticles() {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: this.helicopter.x + this.helicopter.width * 0.3,
                y: this.helicopter.y + this.helicopter.height * 0.8 + (Math.random() - 0.5) * 8,
                vx: -3 - Math.random() * 3,
                vy: 1 + Math.random() * 3,
                life: 1,
                maxLife: 25,
                color: `hsl(${25 + Math.random() * 35}, 100%, ${60 + Math.random() * 30}%)`,
                size: 3 + Math.random() * 3
            });
        }
        
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: this.helicopter.x + this.helicopter.width * 0.35,
                y: this.helicopter.y + this.helicopter.height * 0.75,
                vx: -1 - Math.random(),
                vy: 2 + Math.random() * 2,
                life: 1,
                maxLife: 15,
                color: `hsl(${200 + Math.random() * 60}, 80%, ${70 + Math.random() * 20}%)`,
                size: 1 + Math.random() * 2
            });
        }
    }
    
    createScoreParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.helicopter.x + this.helicopter.width / 2,
                y: this.helicopter.y + this.helicopter.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                maxLife: 60,
                color: `hsl(${120 + Math.random() * 60}, 100%, ${60 + Math.random() * 20}%)`,
                size: 3 + Math.random() * 3
            });
        }
    }
    
    createCrashParticles() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.helicopter.x + this.helicopter.width / 2,
                y: this.helicopter.y + this.helicopter.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1,
                maxLife: 120,
                color: `hsl(${Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`,
                size: 3 + Math.random() * 6
            });
        }
    }
    
    createScoreVisual() {
        this.soundVisuals.push({
            x: this.helicopter.x + this.helicopter.width / 2,
            y: this.helicopter.y + this.helicopter.height / 2,
            text: `+${this.score}`,
            life: 0,
            maxLife: 60,
            color: '#FFD700'
        });
    }
    
    updateSoundVisuals(deltaTime) {
        for (let i = this.soundVisuals.length - 1; i >= 0; i--) {
            const visual = this.soundVisuals[i];
            visual.life++;
            visual.y -= 1;
            
            if (visual.life >= visual.maxLife) {
                this.soundVisuals.splice(i, 1);
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life++;
            particle.vy += 0.1;
            
            if (particle.life >= particle.maxLife) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    render() {
        this.ctx.save();
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(shakeX, shakeY);
        }
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        const time = Date.now() * 0.001;
        gradient.addColorStop(0, `hsl(${200 + Math.sin(time) * 10}, 70%, 80%)`);
        gradient.addColorStop(1, `hsl(${120 + Math.sin(time + 1) * 10}, 60%, 75%)`);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAnimatedClouds();
        this.walls.forEach(wall => this.drawWallWithShadow(wall));
        this.drawHelicopter();
        this.drawParticles();
        this.drawScoreVisuals();
        this.drawSpeedLines();
        
        this.ctx.restore();
    }
    
    drawAnimatedClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        
        const cloudPositions = [
            {x: 200, y: 100, speed: 0.3}, {x: 500, y: 80, speed: 0.2}, {x: 700, y: 120, speed: 0.4},
            {x: 150, y: 400, speed: 0.25}, {x: 400, y: 450, speed: 0.35}, {x: 650, y: 420, speed: 0.3}
        ];
        
        cloudPositions.forEach(cloud => {
            const offset = this.backgroundOffset * cloud.speed;
            let cloudX = (cloud.x + offset) % (this.canvas.width + 100);
            if (cloudX < -100) cloudX += this.canvas.width + 100;
            this.drawCloud(cloudX, cloud.y);
        });
    }
    
    drawCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 30, y - 15, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawWallWithShadow(wall) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(wall.x + 3, 3, this.wallWidth, wall.gapY);
        this.ctx.fillRect(wall.x + 3, wall.gapY + this.wallGap + 3, this.wallWidth, 
                         this.canvas.height - (wall.gapY + this.wallGap));
        
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(wall.x, 0, this.wallWidth, wall.gapY);
        this.ctx.fillRect(wall.x, wall.gapY + this.wallGap, this.wallWidth, 
                         this.canvas.height - (wall.gapY + this.wallGap));
        
        this.ctx.fillStyle = '#543921';
        this.ctx.fillRect(wall.x + 5, 0, 5, wall.gapY);
        this.ctx.fillRect(wall.x + 5, wall.gapY + this.wallGap, 5, 
                         this.canvas.height - (wall.gapY + this.wallGap));

        this.ctx.fillStyle = '#876543';
        this.ctx.fillRect(wall.x + 2, 2, 3, wall.gapY - 4);
        this.ctx.fillRect(wall.x + 2, wall.gapY + this.wallGap + 2, 3, 
                         this.canvas.height - (wall.gapY + this.wallGap) - 4);
        
        const gradient = this.ctx.createLinearGradient(wall.x, wall.gapY, wall.x, wall.gapY + this.wallGap);
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
        gradient.addColorStop(0.5, 'rgba(135, 206, 235, 0.1)');
        gradient.addColorStop(1, 'rgba(135, 206, 235, 0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(wall.x, wall.gapY, this.wallWidth, this.wallGap);
    }
    
    drawHelicopter() {
        const heli = this.helicopter;
        const centerX = heli.x + heli.width / 2;
        const centerY = heli.y + heli.height / 2;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(heli.rotation);
        this.ctx.translate(-centerX, -centerY);
        this.drawHelicopterSVG(heli);
        this.ctx.restore();
        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const rotorCenterX = heli.x + heli.width * 0.5;
        const rotorCenterY = heli.y + heli.height * 0.05;
        const rotorLength = heli.width * 0.9;
        const rotorAngle = Date.now() * 0.02;
        
        for (let i = 0; i < 4; i++) {
            const angle = rotorAngle + (i * Math.PI / 2);
            this.ctx.beginPath();
            this.ctx.moveTo(rotorCenterX - Math.cos(angle) * rotorLength, rotorCenterY);
            this.ctx.lineTo(rotorCenterX + Math.cos(angle) * rotorLength, rotorCenterY);
            this.ctx.stroke();
        }
        
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(rotorCenterX, rotorCenterY, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.4)';
        this.ctx.lineWidth = 2;
        const tailRotorX = heli.x + heli.width * 0.05;
        const tailRotorY = heli.y + heli.height * 0.4;
        const tailRotorAngle = Date.now() * 0.04;
        
        for (let i = 0; i < 3; i++) {
            const angle = tailRotorAngle + (i * Math.PI * 2 / 3);
            this.ctx.beginPath();
            this.ctx.moveTo(tailRotorX, tailRotorY - Math.cos(angle) * 8);
            this.ctx.lineTo(tailRotorX, tailRotorY + Math.cos(angle) * 8);
            this.ctx.stroke();
        }
    }
    
    drawHelicopterSVG(heli) {
        const x = heli.x;
        const y = heli.y;
        const w = heli.width;
        const h = heli.height;
        
        this.ctx.fillStyle = '#4A4A4A';
        this.ctx.fillRect(x + w * 0.05, y + h * 0.42, w * 0.4, h * 0.16);
        this.ctx.fillStyle = '#3A3A3A';
        this.ctx.beginPath();
        this.ctx.moveTo(x + w * 0.02, y + h * 0.3);
        this.ctx.lineTo(x + w * 0.12, y + h * 0.4);
        this.ctx.lineTo(x + w * 0.12, y + h * 0.6);
        this.ctx.lineTo(x + w * 0.02, y + h * 0.7);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = '#FF4444';
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.55, y + h * 0.5, w * 0.3, h * 0.25, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#FF6666';
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.55, y + h * 0.45, w * 0.25, h * 0.15, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.7, y + h * 0.45, w * 0.18, h * 0.2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(x + w * 0.75, y + h * 0.4, w * 0.08, h * 0.1, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#AA2222';
        this.ctx.fillRect(x + w * 0.45, y + h * 0.15, w * 0.2, h * 0.25);
        this.ctx.fillStyle = '#888';
        this.ctx.fillRect(x + w * 0.47, y + h * 0.17, w * 0.16, h * 0.03);
        this.ctx.fillRect(x + w * 0.47, y + h * 0.22, w * 0.16, h * 0.03);
        this.ctx.fillRect(x + w * 0.47, y + h * 0.27, w * 0.16, h * 0.03);
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + w * 0.35, y + h * 0.8, w * 0.45, h * 0.08);
        this.ctx.fillRect(x + w * 0.4, y + h * 0.72, w * 0.04, h * 0.15);
        this.ctx.fillRect(x + w * 0.7, y + h * 0.72, w * 0.04, h * 0.15);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + w * 0.42, y + h * 0.35, w * 0.2, h * 0.35);
        this.ctx.fillStyle = '#666';
        this.ctx.beginPath();
        this.ctx.arc(x + w * 0.58, y + h * 0.52, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(x + w * 0.9, y + h * 0.45, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#00FF00';
        this.ctx.beginPath();
        this.ctx.arc(x + w * 0.15, y + h * 0.45, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = 1 - (particle.life / particle.maxLife);
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawScoreVisuals() {
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        
        this.soundVisuals.forEach(visual => {
            const alpha = 1 - (visual.life / visual.maxLife);
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = visual.color;
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(visual.text, visual.x, visual.y);
            this.ctx.fillText(visual.text, visual.x, visual.y);
        });
        
        this.ctx.globalAlpha = 1;
        this.ctx.textAlign = 'left';
    }
    
    drawSpeedLines() {
        if (this.gameState === 'playing') {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            
            for (let i = 0; i < 10; i++) {
                const x = (Date.now() * 0.1 + i * 80) % (this.canvas.width + 50);
                const y = 50 + i * 55;               
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x - 30, y);
                this.ctx.stroke();
            }
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.createCrashParticles();
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('helicopterBestScore', this.bestScore.toString());
        }
        
        this.finalScoreElement.textContent = this.score;
        this.finalBestScoreElement.textContent = this.bestScore;
        this.updateBestScoreDisplay();
        
        setTimeout(() => {
            this.gameOverScreen.classList.remove('hidden');
        }, 1000);
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    updateScoreDisplay() {
        this.scoreElement.textContent = this.score;
    }
    
    updateBestScoreDisplay() {
        this.bestScoreElement.textContent = this.bestScore;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new HelicopterGame();
});