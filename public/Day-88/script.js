class TetrisGame {
    constructor() {
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 30;
        this.gameCanvas = document.getElementById('gameCanvas');
        this.gameCtx = this.gameCanvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.holdCanvas = document.getElementById('holdCanvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.comboElement = document.getElementById('combo');
        this.timeElement = document.getElementById('time');
        this.highScoreElement = document.getElementById('highScore');
        this.themeSelect = document.getElementById('themeSelect');
        this.gameOverlay = document.getElementById('gameOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        // Game state
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.heldPiece = null;
        this.canHold = true;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.combo = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000; // millisecond
        this.gameStartTime = 0;
        this.gameTime = 0;
        this.highScore = this.loadHighScore();
        this.currentTheme = 'neon';
        this.themes = {
            classic: {
                background: 'linear-gradient(135deg, #333333 0%, #555555 50%, #777777 100%)',
                primary: '#ffffff',
                accent: '#ffff00'
            },
            neon: {
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                primary: '#00ff88',
                accent: '#00ffff'
            },
            retro: {
                background: 'linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #daa520 100%)',
                primary: '#ffd700',
                accent: '#ff6347'
            },
            dark: {
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
                primary: '#808080',
                accent: '#4169e1'
            }
        }
        
        // Tetromino definitions
        this.tetrominoes = {
            I: {
                shape: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                color: '#00ffff'
            },
            O: {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            T: {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#aa00ff'
            },
            S: {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0]
                ],
                color: '#00ff00'
            },
            Z: {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                ],
                color: '#ff0000'
            },
            J: {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#0000ff'
            },
            L: {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#ff7f00'
            }
        };
        
        this.tetrominoTypes = Object.keys(this.tetrominoes);
        this.lastTime = 0;
        
        this.init();
    }
    
    loadHighScore() {
        return parseInt(localStorage.getItem('tetrisHighScore') || '0');
    }
    
    saveHighScore() {
        localStorage.setItem('tetrisHighScore', this.highScore.toString());
    }
    
    changeTheme(themeName) {
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        document.body.style.background = theme.background;
        
        // Update CSS custom properties for theme colors
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        
        // Update UI elements with theme colors
        const elements = document.querySelectorAll('.panel-section');
        elements.forEach(el => {
            el.style.borderColor = theme.primary;
        });
        
        const title = document.querySelector('.game-header h1');
        title.style.color = theme.primary;
        title.style.textShadow = `0 0 20px ${theme.primary}, 0 0 40px ${theme.primary}`;
        
        const canvas = document.getElementById('gameCanvas');
        canvas.style.borderColor = theme.primary;
        canvas.style.boxShadow = `0 0 30px ${theme.primary}50`;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    init() {
        this.initBoard();
        this.setupEventListeners();
        this.updateSpeedIndicator();
        this.updateUI();
        this.showStartScreen();
        this.gameLoop();
    }
    
    initBoard() {
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    }
    
    setupEventListeners() {
        // Button events
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Prevent default behavior for game keys
        document.addEventListener('keydown', (e) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    handleKeyDown(e) {
        if (!this.gameRunning || this.gamePaused) {
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
            return;
        }
        
        switch (e.key) {
            case 'ArrowLeft':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                this.movePiece(1, 0);
                break;
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case 'ArrowDown':
                this.softDrop();
                break;
            case ' ':
                this.hardDrop();
                break;
            case 'Shift':
                this.holdPiece();
                break;
            case 'p':
            case 'P':
                this.togglePause();
                break;
        }
    }
    
    startGame() {
        this.initBoard();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.combo = 0;
        this.dropInterval = 1000;
        this.gameRunning = true;
        this.gamePaused = false;
        this.canHold = true;
        this.heldPiece = null;
        this.gameStartTime = Date.now();
        this.gameTime = 0;
        
        this.currentPiece = this.createNewPiece();
        this.nextPiece = this.createNewPiece();
        
        this.hideOverlay();
        this.updateUI();
        this.updateSpeedIndicator();
        
        this.pauseBtn.textContent = 'PAUSE';
    }
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.showStartScreen();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        this.pauseBtn.textContent = this.gamePaused ? 'RESUME' : 'PAUSE';
        
        if (this.gamePaused) {
            this.showPauseScreen();
        } else {
            this.hideOverlay();
        }
    }
    
    createNewPiece() {
        const type = this.tetrominoTypes[Math.floor(Math.random() * this.tetrominoTypes.length)];
        const tetromino = this.tetrominoes[type];
        
        return {
            type: type,
            shape: JSON.parse(JSON.stringify(tetromino.shape)), // Deep copy
            color: tetromino.color,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
            y: 0
        };
    }
    
    movePiece(dx, dy) {
        if (!this.currentPiece) return false;
        
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (this.isValidPosition(this.currentPiece.shape, newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        if (!this.currentPiece) return;
        
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        
        // Try basic rotation
        if (this.isValidPosition(rotated, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = rotated;
            return;
        }
        
        // Try wall kicks
        const kicks = [
            [-1, 0], [1, 0], [0, -1], [-2, 0], [2, 0]
        ];
        
        for (const [dx, dy] of kicks) {
            if (this.isValidPosition(rotated, this.currentPiece.x + dx, this.currentPiece.y + dy)) {
                this.currentPiece.shape = rotated;
                this.currentPiece.x += dx;
                this.currentPiece.y += dy;
                return;
            }
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    softDrop() {
        if (this.movePiece(0, 1)) {
            this.score += 1;
            this.updateUI();
        }
    }
    
    hardDrop() {
        if (!this.currentPiece) return;
        
        let dropDistance = 0;
        while (this.movePiece(0, 1)) {
            dropDistance++;
        }
        
        this.score += dropDistance * 2;
        this.updateUI();
        this.placePiece();
    }
    
    holdPiece() {
        if (!this.canHold || !this.currentPiece) return;
        
        if (this.heldPiece) {
            // Swap current and held pieces
            const temp = this.heldPiece;
            this.heldPiece = {
                type: this.currentPiece.type,
                shape: JSON.parse(JSON.stringify(this.tetrominoes[this.currentPiece.type].shape)),
                color: this.currentPiece.color
            };
            
            this.currentPiece = this.createPieceFromType(temp.type);
        } else {
            // Hold current piece and spawn next
            this.heldPiece = {
                type: this.currentPiece.type,
                shape: JSON.parse(JSON.stringify(this.tetrominoes[this.currentPiece.type].shape)),
                color: this.currentPiece.color
            };
            
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.createNewPiece();
        }
        
        this.canHold = false;
        this.drawHoldPiece();
    }
    
    createPieceFromType(type) {
        const tetromino = this.tetrominoes[type];
        return {
            type: type,
            shape: JSON.parse(JSON.stringify(tetromino.shape)),
            color: tetromino.color,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
            y: 0
        };
    }
    
    isValidPosition(shape, x, y) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    // Check boundaries
                    if (newX < 0 || newX >= this.BOARD_WIDTH || newY >= this.BOARD_HEIGHT) {
                        return false;
                    }
                    
                    // Check collision with existing blocks (ignore if above board)
                    if (newY >= 0 && this.board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    placePiece() {
        if (!this.currentPiece) return;
        
        // Place piece on board
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const boardY = this.currentPiece.y + row;
                    const boardX = this.currentPiece.x + col;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        // Check for line clears
        const linesCleared = this.clearLines();
        if (linesCleared > 0) {
            this.combo++;
            this.updateScore(linesCleared);
            this.updateLevel();
            this.showComboAnimation();
        } else {
            this.combo = 0;
        }
        
        // Spawn next piece
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createNewPiece();
        this.canHold = true;
        
        // Check game over
        if (!this.isValidPosition(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver();
        }
        
        this.updateUI();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                // Line is full, remove it
                this.board.splice(row, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        return linesCleared;
    }
    
    updateScore(linesCleared) {
        const baseScores = [0, 100, 300, 500, 800];
        let scoreGain = baseScores[linesCleared] * this.level;
        
        // Combo bonus
        if (this.combo > 1) {
            scoreGain += (this.combo - 1) * 50 * this.level;
        }
        
        // Perfect clear bonus (entire board is empty)
        if (this.isBoardEmpty()) {
            scoreGain *= 10;
            this.showPerfectClearAnimation();
        }
        
        this.score += scoreGain;
        this.lines += linesCleared;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        // Create visual effects for different line clears
        if (linesCleared === 4) {
            this.createParticleEffect();
            this.showScreenFlash('#ffd700'); // Gold flash for Tetris
        } else if (linesCleared > 0) {
            this.showScreenFlash('#00ff88'); // Green flash for any line clear
        }
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
            this.updateSpeedIndicator();
            this.showLevelUpAnimation();
        }
    }
    
    isBoardEmpty() {
        return this.board.every(row => row.every(cell => cell === 0));
    }
    
    showComboAnimation() {
        this.comboElement.classList.add('combo-flash');
        setTimeout(() => {
            this.comboElement.classList.remove('combo-flash');
        }, 500);
    }
    
    showPerfectClearAnimation() {
        this.gameCanvas.classList.add('perfect-clear-flash');
        setTimeout(() => {
            this.gameCanvas.classList.remove('perfect-clear-flash');
        }, 1000);
    }
    
    showLevelUpAnimation() {
        this.levelElement.classList.add('level-up-animation');
        setTimeout(() => {
            this.levelElement.classList.remove('level-up-animation');
        }, 800);
    }
    
    showScreenFlash(color) {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = color;
        flash.style.opacity = '0.3';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9999';
        flash.style.transition = 'opacity 0.3s ease-out';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(flash);
            }, 300);
        }, 100);
    }
    
    updateSpeedIndicator() {
        const speedBars = document.querySelectorAll('.speed-bar');
        const activeCount = Math.min(5, this.level);
        
        speedBars.forEach((bar, index) => {
            if (index < activeCount) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    }
    
    createParticleEffect() {
        const rect = this.gameCanvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = centerX + (Math.random() - 0.5) * 100 + 'px';
            particle.style.top = centerY + (Math.random() - 0.5) * 100 + 'px';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                document.body.removeChild(particle);
            }, 1000);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.showGameOverScreen();
    }
    
    update(deltaTime) {
        if (!this.gameRunning || this.gamePaused) return;
        
        // Update game time
        this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        
        this.dropTime += deltaTime;
        
        if (this.dropTime >= this.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
            }
            this.dropTime = 0;
        }
        
        // Update UI elements
        this.updateUI();
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score.toLocaleString();
        this.levelElement.textContent = this.level;
        this.linesElement.textContent = this.lines;
        this.comboElement.textContent = this.combo;
        this.timeElement.textContent = this.formatTime(this.gameTime);
        this.highScoreElement.textContent = this.highScore.toLocaleString();
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    draw() {
        this.clearCanvas(this.gameCtx, this.gameCanvas);
        this.drawBoard();
        this.drawGrid();
        this.drawCurrentPiece();
        this.drawGhost();
        this.drawNextPiece();
        this.drawHoldPiece();
    }
    
    clearCanvas(ctx, canvas) {
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawBoard() {
        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(this.gameCtx, col * this.BLOCK_SIZE, row * this.BLOCK_SIZE, this.board[row][col]);
                }
            }
        }
    }
    
    drawGrid() {
        this.gameCtx.strokeStyle = '#333344';
        this.gameCtx.lineWidth = 1;
        
        // Vertical lines
        for (let col = 0; col <= this.BOARD_WIDTH; col++) {
            this.gameCtx.beginPath();
            this.gameCtx.moveTo(col * this.BLOCK_SIZE, 0);
            this.gameCtx.lineTo(col * this.BLOCK_SIZE, this.BOARD_HEIGHT * this.BLOCK_SIZE);
            this.gameCtx.stroke();
        }
        
        // Horizontal lines
        for (let row = 0; row <= this.BOARD_HEIGHT; row++) {
            this.gameCtx.beginPath();
            this.gameCtx.moveTo(0, row * this.BLOCK_SIZE);
            this.gameCtx.lineTo(this.BOARD_WIDTH * this.BLOCK_SIZE, row * this.BLOCK_SIZE);
            this.gameCtx.stroke();
        }
    }
    
    drawCurrentPiece() {
        if (!this.currentPiece) return;
        
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const x = (this.currentPiece.x + col) * this.BLOCK_SIZE;
                    const y = (this.currentPiece.y + row) * this.BLOCK_SIZE;
                    this.drawBlock(this.gameCtx, x, y, this.currentPiece.color);
                }
            }
        }
    }
    
    drawGhost() {
        if (!this.currentPiece) return;
        
        let ghostY = this.currentPiece.y;
        while (this.isValidPosition(this.currentPiece.shape, this.currentPiece.x, ghostY + 1)) {
            ghostY++;
        }
        
        this.gameCtx.globalAlpha = 0.3;
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const x = (this.currentPiece.x + col) * this.BLOCK_SIZE;
                    const y = (ghostY + row) * this.BLOCK_SIZE;
                    this.drawBlock(this.gameCtx, x, y, this.currentPiece.color);
                }
            }
        }
        this.gameCtx.globalAlpha = 1.0;
    }
    
    drawNextPiece() {
        this.clearCanvas(this.nextCtx, this.nextCanvas);
        
        if (!this.nextPiece) return;
        
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
        
        for (let row = 0; row < this.nextPiece.shape.length; row++) {
            for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                if (this.nextPiece.shape[row][col]) {
                    const x = offsetX + col * blockSize;
                    const y = offsetY + row * blockSize;
                    this.drawBlock(this.nextCtx, x, y, this.nextPiece.color, blockSize);
                }
            }
        }
    }
    
    drawHoldPiece() {
        this.clearCanvas(this.holdCtx, this.holdCanvas);
        
        if (!this.heldPiece) return;
        
        const blockSize = 20;
        const offsetX = (this.holdCanvas.width - this.heldPiece.shape[0].length * blockSize) / 2;
        const offsetY = (this.holdCanvas.height - this.heldPiece.shape.length * blockSize) / 2;
        
        for (let row = 0; row < this.heldPiece.shape.length; row++) {
            for (let col = 0; col < this.heldPiece.shape[row].length; col++) {
                if (this.heldPiece.shape[row][col]) {
                    const x = offsetX + col * blockSize;
                    const y = offsetY + row * blockSize;
                    this.drawBlock(this.holdCtx, x, y, this.heldPiece.color, blockSize);
                }
            }
        }
    }
    
    drawBlock(ctx, x, y, color, size = this.BLOCK_SIZE) {
        // Main block
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
        
        // Highlight (top and left)
        ctx.fillStyle = this.lightenColor(color, 40);
        ctx.fillRect(x, y, size, 2);
        ctx.fillRect(x, y, 2, size);
        
        // Shadow (bottom and right)
        ctx.fillStyle = this.darkenColor(color, 40);
        ctx.fillRect(x, y + size - 2, size, 2);
        ctx.fillRect(x + size - 2, y, 2, size);
        
        // Border
        ctx.strokeStyle = this.darkenColor(color, 20);
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, size, size);
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
            (G > 0 ? G : 0) * 0x100 +
            (B > 0 ? B : 0)).toString(16).slice(1);
    }
    

    
    showStartScreen() {
        this.overlayTitle.textContent = 'TETRIS';
        this.overlayMessage.textContent = 'Press START to begin';
        this.startBtn.textContent = 'START';
        this.startBtn.style.display = 'inline-block';
        this.gameOverlay.classList.remove('hidden');
    }
    
    showPauseScreen() {
        this.overlayTitle.textContent = 'PAUSED';
        this.overlayMessage.textContent = 'Press RESUME to continue';
        this.startBtn.style.display = 'none';
        this.gameOverlay.classList.remove('hidden');
    }
    
    showGameOverScreen() {
        this.overlayTitle.textContent = 'GAME OVER';
        this.overlayMessage.textContent = `Final Score: ${this.score.toLocaleString()}`;
        this.startBtn.textContent = 'PLAY AGAIN';
        this.startBtn.style.display = 'inline-block';
        this.gameOverlay.classList.remove('hidden');
    }
    
    hideOverlay() {
        this.gameOverlay.classList.add('hidden');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TetrisGame();
});
