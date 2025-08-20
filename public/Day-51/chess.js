class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.validMoves = [];
        this.gameHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.isGameOver = false;
        this.isInCheck = { white: false, black: false };
        this.gameMode = 'human';
        this.aiDifficulty = 'medium';
        this.playerColor = 'white';
        this.aiColor = 'black';
        this.isAiThinking = false;

        this.pieces = {
            white: {
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black: {
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟'
            }
        };

        this.initializeBoard();
        this.createBoardUI();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeBoard() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));

        const startingPosition = [
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
        ];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (startingPosition[row][col]) {
                    const color = row < 2 ? 'black' : 'white';
                    this.board[row][col] = {
                        type: startingPosition[row][col],
                        color: color,
                        hasMoved: false
                    };
                }
            }
        }
    }

    createBoardUI() {
        const chessboard = document.getElementById('chessboard');
        chessboard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('span');
                    pieceElement.className = `piece piece-${piece.color} piece-${piece.type}`;
                    pieceElement.textContent = this.pieces[piece.color][piece.type];
                    pieceElement.draggable = true;
                    square.appendChild(pieceElement);
                }

                chessboard.appendChild(square);
            }
        }
    }

    setupEventListeners() {
        const chessboard = document.getElementById('chessboard');

        chessboard.addEventListener('click', (e) => {
            const square = e.target.closest('.square');
            if (!square || this.isGameOver) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);

            this.handleSquareClick(row, col);
        });

        chessboard.addEventListener('dragstart', (e) => {
            if (!e.target.classList.contains('piece')) return;

            const square = e.target.parentElement;
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);

            if (this.board[row][col] && this.board[row][col].color === this.currentPlayer) {
                this.selectSquare(row, col);
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', `${row},${col}`);
            } else {
                e.preventDefault();
            }
        });

        chessboard.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        chessboard.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        chessboard.addEventListener('drop', (e) => {
            e.preventDefault();
            const square = e.target.closest('.square');
            if (!square) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const data = e.dataTransfer.getData('text/plain');
            const [fromRow, fromCol] = data.split(',').map(Number);

            if (this.selectedSquare && this.selectedSquare.row === fromRow && this.selectedSquare.col === fromCol) {
                this.handleSquareClick(row, col);
            }
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undoLastMove();
        });

        const gameModeRadios = document.querySelectorAll('input[name="game-mode"]');
        const aiSettings = document.getElementById('ai-settings');

        gameModeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'computer') {
                    aiSettings.style.display = 'block';
                } else {
                    aiSettings.style.display = 'none';
                }
                this.applyGameSettings();
            });
        });

        const difficultyRadios = document.querySelectorAll('input[name="ai-difficulty"]');
        difficultyRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.applyGameSettings();
            });
        });

        const colorRadios = document.querySelectorAll('input[name="player-color"]');
        colorRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.applyGameSettings();
            });
        });
    }

    handleSquareClick(row, col) {
        if (this.isAiThinking || (this.gameMode === 'computer' && this.currentPlayer === this.aiColor)) {
            return;
        }

        if (this.selectedSquare) {

            if (this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
                this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
                this.clearSelection();
            } else if (this.board[row][col] && this.board[row][col].color === this.currentPlayer) {

                this.selectSquare(row, col);
            } else {
                this.clearSelection();
            }
        } else {

            if (this.board[row][col] && this.board[row][col].color === this.currentPlayer) {
                this.selectSquare(row, col);
            }
        }
    }

    selectSquare(row, col) {
        this.clearSelection();
        this.selectedSquare = { row, col };
        this.validMoves = this.getValidMoves(row, col);
        this.highlightSquares();
    }

    clearSelection() {
        this.selectedSquare = null;
        this.validMoves = [];
        this.removeHighlights();
    }

    highlightSquares() {
        const squares = document.querySelectorAll('.square');

        if (this.selectedSquare) {
            const selectedIndex = this.selectedSquare.row * 8 + this.selectedSquare.col;
            squares[selectedIndex].classList.add('selected');
        }

        this.validMoves.forEach(move => {
            const index = move.row * 8 + move.col;
            const square = squares[index];

            if (this.board[move.row][move.col]) {
                square.classList.add('attack-move');
            } else {
                square.classList.add('valid-move');
            }
        });

        this.highlightCheck();
    }

    removeHighlights() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('selected', 'valid-move', 'attack-move', 'in-check');
        });
    }

    highlightCheck() {
        if (this.isInCheck.white) {
            const kingPos = this.findKing('white');
            if (kingPos) {
                const index = kingPos.row * 8 + kingPos.col;
                document.querySelectorAll('.square')[index].classList.add('in-check');
            }
        }

        if (this.isInCheck.black) {
            const kingPos = this.findKing('black');
            if (kingPos) {
                const index = kingPos.row * 8 + kingPos.col;
                document.querySelectorAll('.square')[index].classList.add('in-check');
            }
        }
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        let moves = [];

        switch (piece.type) {
            case 'pawn':
                moves = this.getPawnMoves(row, col);
                break;
            case 'rook':
                moves = this.getRookMoves(row, col);
                break;
            case 'knight':
                moves = this.getKnightMoves(row, col);
                break;
            case 'bishop':
                moves = this.getBishopMoves(row, col);
                break;
            case 'queen':
                moves = this.getQueenMoves(row, col);
                break;
            case 'king':
                moves = this.getKingMoves(row, col);
                break;
        }

        return moves.filter(move => !this.wouldBeInCheck(row, col, move.row, move.col, piece.color));
    }

    getPawnMoves(row, col) {
        const piece = this.board[row][col];
        const moves = [];
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;


        if (this.isInBounds(row + direction, col) && !this.board[row + direction][col]) {
            moves.push({ row: row + direction, col });

            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col });
            }
        }

        for (const colOffset of [-1, 1]) {
            const newRow = row + direction;
            const newCol = col + colOffset;

            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (target && target.color !== piece.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getRookMoves(row, col) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (const [dRow, dCol] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;

                if (!this.isInBounds(newRow, newCol)) break;

                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== this.board[row][col].color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }

        return moves;
    }

    getKnightMoves(row, col) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [dRow, dCol] of knightMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== this.board[row][col].color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getBishopMoves(row, col) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

        for (const [dRow, dCol] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;

                if (!this.isInBounds(newRow, newCol)) break;

                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== this.board[row][col].color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }

        return moves;
    }

    getQueenMoves(row, col) {
        return [...this.getRookMoves(row, col), ...this.getBishopMoves(row, col)];
    }

    getKingMoves(row, col) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (this.isInBounds(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== this.board[row][col].color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    isInBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const validMoves = this.getValidMoves(fromRow, fromCol);
        return validMoves.some(move => move.row === toRow && move.col === toCol);
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];

        this.gameHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: { ...piece },
            capturedPiece: capturedPiece ? { ...capturedPiece } : null,
            board: this.board.map(row => row.map(cell => cell ? { ...cell } : null))
        });

        if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece.type);
        }

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        piece.hasMoved = true;

        if (piece.type === 'pawn') {
            const promotionRow = piece.color === 'white' ? 0 : 7;
            if (toRow === promotionRow) {
                piece.type = 'queen';
            }
        }

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';


        this.updateGameState();
        this.createBoardUI();
        this.updateUI();

        if (this.gameMode === 'computer' && this.currentPlayer === this.aiColor && !this.isGameOver) {
            this.makeAIMove();
        }
    }

    updateGameState() {

        this.isInCheck.white = this.isKingInCheck('white');
        this.isInCheck.black = this.isKingInCheck('black');

        const currentPlayerInCheck = this.isInCheck[this.currentPlayer];
        const hasValidMoves = this.hasValidMoves(this.currentPlayer);

        if (currentPlayerInCheck && !hasValidMoves) {

            this.isGameOver = true;
            const winner = this.currentPlayer === 'white' ? 'Black' : 'White';
            this.setGameMessage(`Checkmate! ${winner} wins!`);
        } else if (!hasValidMoves) {

            this.isGameOver = true;
            this.setGameMessage('Stalemate! Game is a draw.');
        } else if (currentPlayerInCheck) {

            this.setGameMessage(`${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} is in check!`);
        } else {
            this.setGameMessage('');
        }
    }

    isKingInCheck(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color !== color) {
                    const moves = this.getPieceMoves(row, col);
                    if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    getPieceMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        switch (piece.type) {
            case 'pawn':
                return this.getPawnMoves(row, col);
            case 'rook':
                return this.getRookMoves(row, col);
            case 'knight':
                return this.getKnightMoves(row, col);
            case 'bishop':
                return this.getBishopMoves(row, col);
            case 'queen':
                return this.getQueenMoves(row, col);
            case 'king':
                return this.getKingMoves(row, col);
            default:
                return [];
        }
    }

    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {

        const originalPiece = this.board[toRow][toCol];
        const movingPiece = this.board[fromRow][fromCol];

        this.board[toRow][toCol] = movingPiece;
        this.board[fromRow][fromCol] = null;

        const inCheck = this.isKingInCheck(color);

        this.board[fromRow][fromCol] = movingPiece;
        this.board[toRow][toCol] = originalPiece;

        return inCheck;
    }

    hasValidMoves(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const validMoves = this.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    undoLastMove() {
        if (this.gameHistory.length === 0) return;

        const lastMove = this.gameHistory.pop();

        this.board = lastMove.board;

        if (lastMove.capturedPiece) {
            const capturedList = this.capturedPieces[lastMove.capturedPiece.color];
            const index = capturedList.lastIndexOf(lastMove.capturedPiece.type);
            if (index > -1) {
                capturedList.splice(index, 1);
            }
        }

        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

        this.isGameOver = false;

        this.updateGameState();
        this.createBoardUI();
        this.updateUI();
    }

    resetGame() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.validMoves = [];
        this.gameHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.isGameOver = false;
        this.isInCheck = { white: false, black: false };

        this.initializeBoard();
        this.createBoardUI();
        this.updateUI();
        this.applyGameSettings();
    }

    updateUI() {
        document.getElementById('current-player').textContent =
            this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);

        document.getElementById('undo-btn').disabled = this.gameHistory.length === 0;

        this.updateCapturedPiecesDisplay();
    }

    updateCapturedPiecesDisplay() {
        const capturedWhite = document.getElementById('captured-white');
        const capturedBlack = document.getElementById('captured-black');

        capturedWhite.innerHTML = '';
        capturedBlack.innerHTML = '';

        this.capturedPieces.white.forEach(pieceType => {
            const pieceElement = document.createElement('span');
            pieceElement.className = 'captured-piece';
            pieceElement.textContent = this.pieces.white[pieceType];
            capturedWhite.appendChild(pieceElement);
        });

        this.capturedPieces.black.forEach(pieceType => {
            const pieceElement = document.createElement('span');
            pieceElement.className = 'captured-piece';
            pieceElement.textContent = this.pieces.black[pieceType];
            capturedBlack.appendChild(pieceElement);
        });
    }

    setGameMessage(message) {
        document.getElementById('game-message').textContent = message;
    }

    makeAIMove() {
        if (this.isGameOver || this.isAiThinking) return;

        this.isAiThinking = true;
        this.setGameMessage('Computer is thinking...');

        setTimeout(() => {
            const bestMove = this.getBestMove(this.aiColor, this.aiDifficulty);

            if (bestMove) {
                this.makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
            }

            this.isAiThinking = false;
        }, 500 + Math.random() * 1500);
    }

    getBestMove(color, difficulty) {
        const allMoves = this.getAllValidMoves(color);
        if (allMoves.length === 0) return null;

        switch (difficulty) {
            case 'easy':
                return this.getRandomMove(allMoves);
            case 'medium':
                return this.getMediumMove(allMoves, color);
            case 'hard':
                return this.getHardMove(allMoves, color);
            default:
                return this.getRandomMove(allMoves);
        }
    }

    getAllValidMoves(color) {
        const moves = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const validMoves = this.getValidMoves(row, col);
                    for (const move of validMoves) {
                        moves.push({
                            from: { row, col },
                            to: { row: move.row, col: move.col },
                            piece: piece.type,
                            capturedPiece: this.board[move.row][move.col]
                        });
                    }
                }
            }
        }

        return moves;
    }

    getRandomMove(moves) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    getMediumMove(moves, color) {
        const captureMoves = moves.filter(move => move.capturedPiece);
        const safeMoves = moves.filter(move => !this.isSquareUnderAttack(move.to.row, move.to.col, color));

        if (captureMoves.length > 0) {
            captureMoves.sort((a, b) => this.getPieceValue(b.capturedPiece.type) - this.getPieceValue(a.capturedPiece.type));
            return captureMoves[0];
        }

        if (safeMoves.length > 0) {
            return this.getRandomMove(safeMoves);
        }

        return this.getRandomMove(moves);
    }

    getHardMove(moves, color) {

        let bestMove = null;
        let bestScore = -Infinity;

        for (const move of moves) {
            const score = this.evaluateMove(move, color);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove || this.getRandomMove(moves);
    }

    evaluateMove(move, color) {
        let score = 0;

        if (move.capturedPiece) {
            score += this.getPieceValue(move.capturedPiece.type);
        }

        score += this.getPositionValue(move.to.row, move.to.col, move.piece, color);

        if (this.isSquareUnderAttack(move.to.row, move.to.col, color)) {
            score -= this.getPieceValue(move.piece) * 0.5;
        }

        const originalPiece = this.board[move.to.row][move.to.col];
        const movingPiece = this.board[move.from.row][move.from.col];

        this.board[move.to.row][move.to.col] = movingPiece;
        this.board[move.from.row][move.from.col] = null;

        const opponentColor = color === 'white' ? 'black' : 'white';
        if (this.isKingInCheck(opponentColor)) {
            score += 50;

            if (!this.hasValidMoves(opponentColor)) {
                score += 1000;
            }
        }

        this.board[move.from.row][move.from.col] = movingPiece;
        this.board[move.to.row][move.to.col] = originalPiece;

        return score;
    }

    getPieceValue(pieceType) {
        const values = {
            pawn: 10,
            knight: 30,
            bishop: 30,
            rook: 50,
            queen: 90,
            king: 1000
        };
        return values[pieceType] || 0;
    }

    getPositionValue(row, col, pieceType, color) {
        const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col);
        let positionValue = (7 - centerDistance) * 2;

        if (pieceType === 'pawn') {
            const advancement = color === 'white' ? (7 - row) : row;
            positionValue += advancement * 2;
        }

        return positionValue;
    }

    isSquareUnderAttack(row, col, defendingColor) {
        const attackingColor = defendingColor === 'white' ? 'black' : 'white';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color === attackingColor) {
                    const moves = this.getPieceMoves(r, c);
                    if (moves.some(move => move.row === row && move.col === col)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    applyGameSettings() {
        const gameMode = document.querySelector('input[name="game-mode"]:checked').value;
        const difficulty = document.querySelector('input[name="ai-difficulty"]:checked').value;
        const playerColor = document.querySelector('input[name="player-color"]:checked').value;

        this.setGameMode(gameMode, difficulty, playerColor);
    }

    setGameMode(mode, difficulty = 'medium', playerColor = 'white') {
        this.gameMode = mode;
        this.aiDifficulty = difficulty;
        this.playerColor = playerColor;
        this.aiColor = playerColor === 'white' ? 'black' : 'white';

        if (mode === 'computer' && this.currentPlayer === this.aiColor && !this.isGameOver) {
            this.makeAIMove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});
