class CandyCrush {
    constructor() {
        this.boardSize = 8;
        this.colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        this.board = [];
        this.score = 0;
        this.moves = 30;
        this.selectedCandy = null;
        this.isSwapping = false;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.newGameButton = document.getElementById('newGame');
        
        this.init();
    }

    init() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        
        // Mouse events
        this.gameBoard.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
        
        // Touch events
        this.gameBoard.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        document.addEventListener('touchend', () => this.handleTouchEnd());
        
        this.startNewGame();
    }

    startNewGame() {
        this.score = 0;
        this.moves = 30;
        this.scoreElement.textContent = this.score;
        this.movesElement.textContent = this.moves;
        this.board = [];
        this.selectedCandy = null;
        this.isSwapping = false;
        this.isDragging = false;
        this.generateBoard();
        this.renderBoard();
    }

    generateBoard() {
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                let color;
                do {
                    color = this.colors[Math.floor(Math.random() * this.colors.length)];
                } while (
                    (col >= 2 && this.board[row][col-1] && this.board[row][col-2] && this.board[row][col-1].color === color && this.board[row][col-2].color === color) ||
                    (row >= 2 && this.board[row-1][col] && this.board[row-2][col] && this.board[row-1][col].color === color && this.board[row-2][col].color === color)
                );
                this.board[row][col] = { color };
            }
        }
    }

    renderBoard() {
        // Clear board
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const candy = document.createElement('div');
                const candyData = this.board[row][col];
                candy.className = `candy ${candyData ? candyData.color : ''}`;
                candy.dataset.row = row;
                candy.dataset.col = col;
                this.gameBoard.appendChild(candy);
            }
        }
    }

    getCandyAt(row, col) {
        return this.gameBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    handleMouseDown(e) {
        if (this.isSwapping || this.moves <= 0) return;
        
        const candy = e.target.closest('.candy');
        if (!candy) return;
        
        this.isDragging = true;
        this.selectedCandy = candy;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        candy.classList.add('selected');
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.selectedCandy || this.isSwapping || this.moves <= 0) return;
        
        const currentX = e.clientX;
        const currentY = e.clientY;
        const deltaX = currentX - this.startX;
        const deltaY = currentY - this.startY;
        
        // Only process if we've moved enough to consider it a drag
        if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return;
        
        const row1 = parseInt(this.selectedCandy.dataset.row);
        const col1 = parseInt(this.selectedCandy.dataset.col);
        
        let row2 = row1;
        let col2 = col1;
        
        // Determine the direction of the drag
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal drag
            col2 = deltaX > 0 ? col1 + 1 : col1 - 1;
        } else {
            // Vertical drag
            row2 = deltaY > 0 ? row1 + 1 : row1 - 1;
        }
        
        // Check if the target position is valid
        if (row2 >= 0 && row2 < this.boardSize && col2 >= 0 && col2 < this.boardSize) {
            if (this.isAdjacent(row1, col1, row2, col2)) {
                this.trySwap(row1, col1, row2, col2);
                this.isDragging = false;
            }
        }
        
        e.preventDefault();
    }

    handleMouseUp() {
        if (this.selectedCandy) {
            this.selectedCandy.classList.remove('selected');
            this.selectedCandy = null;
        }
        this.isDragging = false;
    }

    handleTouchStart(e) {
        if (this.isSwapping || this.moves <= 0) return;
        
        const touch = e.touches[0];
        const candy = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.candy');
        if (!candy) return;
        
        this.isDragging = true;
        this.selectedCandy = candy;
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        
        candy.classList.add('selected');
        e.preventDefault();
    }

    handleTouchMove(e) {
        if (!this.isDragging || !this.selectedCandy || this.isSwapping || this.moves <= 0) return;
        
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;
        const deltaX = currentX - this.startX;
        const deltaY = currentY - this.startY;
        
        // Only process if we've moved enough to consider it a drag
        if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return;
        
        const row1 = parseInt(this.selectedCandy.dataset.row);
        const col1 = parseInt(this.selectedCandy.dataset.col);
        
        let row2 = row1;
        let col2 = col1;
        
        // Determine the direction of the drag
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal drag
            col2 = deltaX > 0 ? col1 + 1 : col1 - 1;
        } else {
            // Vertical drag
            row2 = deltaY > 0 ? row1 + 1 : row1 - 1;
        }
        
        // Check if the target position is valid
        if (row2 >= 0 && row2 < this.boardSize && col2 >= 0 && col2 < this.boardSize) {
            if (this.isAdjacent(row1, col1, row2, col2)) {
                this.trySwap(row1, col1, row2, col2);
                this.isDragging = false;
            }
        }
        
        e.preventDefault();
    }

    handleTouchEnd() {
        if (this.selectedCandy) {
            this.selectedCandy.classList.remove('selected');
            this.selectedCandy = null;
        }
        this.isDragging = false;
    }

    isAdjacent(row1, col1, row2, col2) {
        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) ||
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    }

    async trySwap(row1, col1, row2, col2) {
        if (this.isSwapping || this.moves <= 0) return;
        this.isSwapping = true;
        // Swap in the board array
        [this.board[row1][col1], this.board[row2][col2]] = [this.board[row2][col2], this.board[row1][col1]];
        this.renderBoard();
        // Check for matches
        let matches = this.findMatches();
        if (matches.length > 0) {
            this.moves--;
            this.movesElement.textContent = this.moves;
            await this.handleMatchesAndCascades();
        } else {
            // Swap back if no matches
            await new Promise(r => setTimeout(r, 200));
            [this.board[row1][col1], this.board[row2][col2]] = [this.board[row2][col2], this.board[row1][col1]];
            this.renderBoard();
        }
        this.isSwapping = false;
        if (this.moves <= 0) {
            setTimeout(() => {
                alert(`Game Over! Your final score is ${this.score}`);
            }, 500);
        }
    }

    findMatches() {
        const matches = [];
        // Horizontal
        for (let row = 0; row < this.boardSize; row++) {
            let matchStart = 0;
            for (let col = 1; col <= this.boardSize; col++) {
                if (
                    col < this.boardSize &&
                    this.board[row][col] &&
                    this.board[row][col - 1] &&
                    this.board[row][col].color === this.board[row][col - 1].color
                ) {
                    continue;
                }
                if (col - matchStart >= 3) {
                    for (let k = matchStart; k < col; k++) {
                        matches.push([row, k]);
                    }
                }
                matchStart = col;
            }
        }
        // Vertical
        for (let col = 0; col < this.boardSize; col++) {
            let matchStart = 0;
            for (let row = 1; row <= this.boardSize; row++) {
                if (
                    row < this.boardSize &&
                    this.board[row][col] &&
                    this.board[row - 1][col] &&
                    this.board[row][col].color === this.board[row - 1][col].color
                ) {
                    continue;
                }
                if (row - matchStart >= 3) {
                    for (let k = matchStart; k < row; k++) {
                        matches.push([k, col]);
                    }
                }
                matchStart = row;
            }
        }
        // Remove duplicates
        return Array.from(new Set(matches.map(([r, c]) => `${r},${c}`))).map(s => s.split(',').map(Number));
    }

    async handleMatchesAndCascades() {
        let totalMatched = 0;
        while (true) {
            const matches = this.findMatches();
            if (matches.length === 0) break;
            totalMatched += matches.length;
            await this.removeMatches(matches);
            await this.fillEmptySpaces();
        }
        // Score: 30 points per candy
        this.score += totalMatched * 30;
        this.scoreElement.textContent = this.score;
    }

    async removeMatches(matches) {
        for (const [row, col] of matches) {
            this.board[row][col] = null;
        }
        this.renderBoard();
        await new Promise(r => setTimeout(r, 250));
    }

    async fillEmptySpaces() {
        for (let col = 0; col < this.boardSize; col++) {
            for (let row = this.boardSize - 1; row >= 0; row--) {
                if (!this.board[row][col]) {
                    // Find the nearest non-null above
                    let above = row - 1;
                    while (above >= 0 && !this.board[above][col]) above--;
                    if (above >= 0) {
                        this.board[row][col] = this.board[above][col];
                        this.board[above][col] = null;
                    } else {
                        // New candy
                        this.board[row][col] = { color: this.colors[Math.floor(Math.random() * this.colors.length)] };
                    }
                }
            }
        }
        this.renderBoard();
        await new Promise(r => setTimeout(r, 250));
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new CandyCrush();
}); 