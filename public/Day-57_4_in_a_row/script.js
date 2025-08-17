class ConnectFour {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = [];
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.moveHistory = [];
        this.scores = { red: 0, yellow: 0 };
        
        this.initializeBoard();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeBoard() {
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = null;
            }
        }
        this.createBoard();
        this.createDropIndicator();
    }

    createBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(col));
                gameBoard.appendChild(cell);
            }
        }
    }

    createDropIndicator() {
        const dropIndicator = document.getElementById('drop-indicator');
        dropIndicator.innerHTML = '';
        
        for (let col = 0; col < this.cols; col++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.dataset.col = col;
            dropIndicator.appendChild(indicator);
        }
    }

    setupEventListeners() {
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // Undo button
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undoMove();
        });

        // Modal buttons
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.closeModal('winner-modal');
            this.resetGame();
        });

        document.getElementById('close-modal-btn').addEventListener('click', () => {
            this.closeModal('winner-modal');
        });

        document.getElementById('play-again-draw-btn').addEventListener('click', () => {
            this.closeModal('draw-modal');
            this.resetGame();
        });

        document.getElementById('close-draw-modal-btn').addEventListener('click', () => {
            this.closeModal('draw-modal');
        });

        // Mouse hover for drop indicator
        const gameBoard = document.getElementById('game-board');
        gameBoard.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('cell')) {
                const col = parseInt(e.target.dataset.col);
                this.showDropIndicator(col);
            }
        });

        gameBoard.addEventListener('mouseout', () => {
            this.hideDropIndicator();
        });
    }

    handleCellClick(col) {
        if (this.gameOver) return;
        
        const row = this.getLowestEmptyRow(col);
        if (row === -1) return; // Column is full
        
        this.makeMove(row, col);
    }

    getLowestEmptyRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === null) {
                return row;
            }
        }
        return -1; // Column is full
    }

    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.moveHistory.push({ row, col, player: this.currentPlayer });
        
        // Update visual
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(this.currentPlayer);
        
        // Check for win
        if (this.checkWin(row, col)) {
            this.handleWin();
            return;
        }
        
        // Check for draw
        if (this.isBoardFull()) {
            this.handleDraw();
            return;
        }
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.updateDisplay();
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal down-right
            [[1, -1], [-1, 1]] // Diagonal down-left
        ];

        for (const direction of directions) {
            let count = 1;
            
            for (const [dr, dc] of direction) {
                count += this.countInDirection(row, col, dr, dc);
            }
            
            if (count >= 4) {
                this.highlightWinningCells(row, col, direction);
                return true;
            }
        }
        
        return false;
    }

    countInDirection(row, col, dr, dc) {
        let count = 0;
        let r = row + dr;
        let c = col + dc;
        
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && 
               this.board[r][c] === this.currentPlayer) {
            count++;
            r += dr;
            c += dc;
        }
        
        return count;
    }

    highlightWinningCells(row, col, direction) {
        const winningCells = [];
        winningCells.push({ row, col });
        
        for (const [dr, dc] of direction) {
            let r = row + dr;
            let c = col + dc;
            
            while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && 
                   this.board[r][c] === this.currentPlayer) {
                winningCells.push({ row: r, col: c });
                r += dr;
                c += dc;
            }
        }
        
        // Add winning animation to cells
        winningCells.forEach(({ row, col }) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('winning');
        });
    }

    isBoardFull() {
        for (let col = 0; col < this.cols; col++) {
            if (this.board[0][col] === null) {
                return false;
            }
        }
        return true;
    }

    handleWin() {
        this.gameOver = true;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        
        const modal = document.getElementById('winner-modal');
        const winnerCircle = document.getElementById('winner-circle');
        const modalMessage = document.getElementById('modal-message');
        
        winnerCircle.className = `player-circle player-${this.currentPlayer}`;
        const playerName = this.currentPlayer === 'red' ? 'Pink' : 'Blue';
        modalMessage.textContent = `${playerName} wins!`;
        
        this.showModal('winner-modal');
    }

    handleDraw() {
        this.gameOver = true;
        this.showModal('draw-modal');
    }

    resetGame() {
        this.board = [];
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.moveHistory = [];
        
        this.initializeBoard();
        this.updateDisplay();
        
        // Remove winning animations
        document.querySelectorAll('.cell.winning').forEach(cell => {
            cell.classList.remove('winning');
        });
    }

    undoMove() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = null;
        
        // Update visual
        const cell = document.querySelector(`[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
        cell.classList.remove('red', 'yellow');
        
        // Switch back to previous player
        this.currentPlayer = lastMove.player;
        this.gameOver = false;
        
        this.updateDisplay();
        
        // Remove winning animations
        document.querySelectorAll('.cell.winning').forEach(cell => {
            cell.classList.remove('winning');
        });
    }

    showDropIndicator(col) {
        const indicators = document.querySelectorAll('.drop-indicator .indicator');
        indicators.forEach((indicator, index) => {
            if (index === col) {
                indicator.classList.add('show');
                indicator.style.background = this.currentPlayer === 'red' 
                    ? 'rgba(248, 187, 217, 0.5)' 
                    : 'rgba(33, 150, 243, 0.5)';
            } else {
                indicator.classList.remove('show');
            }
        });
    }

    hideDropIndicator() {
        document.querySelectorAll('.drop-indicator .indicator').forEach(indicator => {
            indicator.classList.remove('show');
        });
    }

    updateDisplay() {
        // Update current player indicator
        const currentPlayerIndicator = document.getElementById('current-player');
        const playerName = this.currentPlayer === 'red' ? 'Pink' : 'Blue';
        currentPlayerIndicator.innerHTML = `
            <div class="player-circle player-${this.currentPlayer}"></div>
            <span>${playerName}</span>
        `;
        
        // Update game status
        const gameStatus = document.getElementById('game-status');
        if (this.gameOver) {
            gameStatus.textContent = 'Game Over!';
        } else {
            const playerName = this.currentPlayer === 'red' ? 'Pink' : 'Blue';
            gameStatus.textContent = `${playerName}'s turn`;
        }
        
        // Update undo button state
        const undoBtn = document.getElementById('undo-btn');
        undoBtn.disabled = this.moveHistory.length === 0 || this.gameOver;
    }

    updateScores() {
        document.getElementById('score-red').textContent = this.scores.red;
        document.getElementById('score-yellow').textContent = this.scores.yellow;
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ConnectFour();
}); 