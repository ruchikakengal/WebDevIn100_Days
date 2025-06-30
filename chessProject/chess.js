class ChessGame {
  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = "white";
    this.selectedSquare = null;
    this.gameMode = "pvp"; // 'pvp' or 'pvc'
    this.gameOver = false;
    this.capturedPieces = { white: [], black: [] };
    this.lastMove = null;
    this.whiteKingMoved = false;
    this.blackKingMoved = false;
    this.whiteRooksMoved = { left: false, right: false };
    this.blackRooksMoved = { left: false, right: false };

    // Timer properties
    this.timerEnabled = false;
    this.timerInterval = null;
    this.whiteTime = 300; // 5 minutes in seconds
    this.blackTime = 300;
    this.defaultTime = 300;

    // Score properties
    this.scores = { white: 0, black: 0 };
    this.pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0,
    };

    this.pieceSymbols = {
      white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙",
      },
      black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟",
      },
    };

    this.initializeGame();
  }

  initializeBoard() {
    const board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Place black pieces
    board[0] = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ].map((piece) => ({ type: piece, color: "black" }));
    board[1] = Array(8).fill({ type: "pawn", color: "black" });

    // Place white pieces
    board[6] = Array(8).fill({ type: "pawn", color: "white" });
    board[7] = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ].map((piece) => ({ type: piece, color: "white" }));

    return board;
  }

  initializeGame() {
    this.createBoard();
    this.updateDisplay();
    this.attachEventListeners();
  }

  createBoard() {
    const boardElement = document.getElementById("chess-board");
    boardElement.innerHTML = "";

    for (let row = 0; row < 8; row++) {
      const rowElement = document.createElement("div");
      rowElement.className = "row";

      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
        square.dataset.row = row;
        square.dataset.col = col;

        const piece = this.board[row][col];
        if (piece) {
          const pieceElement = document.createElement("div");
          pieceElement.className = `piece ${piece.color}`;
          pieceElement.textContent = this.pieceSymbols[piece.color][piece.type];
          square.appendChild(pieceElement);
        }

        square.addEventListener("click", (e) =>
          this.handleSquareClick(row, col)
        );
        rowElement.appendChild(square);
      }

      boardElement.appendChild(rowElement);
    }
  }

  handleSquareClick(row, col) {
    if (this.gameOver) return;
    if (this.gameMode === "pvc" && this.currentPlayer === "black") return;

    const square = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    const piece = this.board[row][col];

    if (this.selectedSquare) {
      const [selectedRow, selectedCol] = this.selectedSquare;

      if (selectedRow === row && selectedCol === col) {
        // Deselect the same square
        this.clearSelection();
        return;
      }

      const selectedPiece = this.board[selectedRow][selectedCol];
      if (selectedPiece && selectedPiece.color === this.currentPlayer) {
        if (this.isValidMove(selectedRow, selectedCol, row, col)) {
          this.makeMove(selectedRow, selectedCol, row, col);
          this.clearSelection();

          if (!this.gameOver) {
            this.switchPlayer();

            if (this.gameMode === "pvc" && this.currentPlayer === "black") {
              setTimeout(() => this.makeComputerMove(), 500);
            } else if (this.timerEnabled) {
              this.startTimer();
            }
          }
          return;
        }
      }
    }

    if (piece && piece.color === this.currentPlayer) {
      this.selectSquare(row, col);
    } else {
      this.clearSelection();
    }
  }

  selectSquare(row, col) {
    this.clearSelection();
    this.selectedSquare = [row, col];

    const square = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    square.classList.add("selected");

    this.highlightPossibleMoves(row, col);
  }

  clearSelection() {
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("selected", "possible-move", "possible-capture");
    });
    this.selectedSquare = null;
  }

  highlightPossibleMoves(row, col) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.isValidMove(row, col, r, c)) {
          const square = document.querySelector(
            `[data-row="${r}"][data-col="${c}"]`
          );

          // Check if this move would capture an opponent piece
          const targetPiece = this.board[r][c];
          if (targetPiece && targetPiece.color !== this.board[row][col].color) {
            square.classList.add("possible-capture");
          } else {
            square.classList.add("possible-move");
          }
        }
      }
    }
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece) return false;

    const targetPiece = this.board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;

    // Check if move is within bounds
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

    // Check piece-specific movement rules
    const isValid = this.isValidPieceMove(
      piece.type,
      fromRow,
      fromCol,
      toRow,
      toCol,
      piece.color
    );
    if (!isValid) return false;

    // Check if move would put own king in check
    return !this.wouldBeInCheck(fromRow, fromCol, toRow, toCol, piece.color);
  }

  isValidPieceMove(pieceType, fromRow, fromCol, toRow, toCol, color) {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    switch (pieceType) {
      case "pawn":
        return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, color);
      case "rook":
        return (
          (rowDiff === 0 || colDiff === 0) &&
          this.isPathClear(fromRow, fromCol, toRow, toCol)
        );
      case "bishop":
        return (
          absRowDiff === absColDiff &&
          this.isPathClear(fromRow, fromCol, toRow, toCol)
        );
      case "queen":
        return (
          (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) &&
          this.isPathClear(fromRow, fromCol, toRow, toCol)
        );
      case "knight":
        return (
          (absRowDiff === 2 && absColDiff === 1) ||
          (absRowDiff === 1 && absColDiff === 2)
        );
      case "king":
        return absRowDiff <= 1 && absColDiff <= 1;
    }
    return false;
  }

  isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Forward move
    if (colDiff === 0) {
      if (this.board[toRow][toCol]) return false; // Can't capture forward
      if (rowDiff === direction) return true;
      if (fromRow === startRow && rowDiff === 2 * direction) return true;
    }
    // Diagonal capture
    else if (colDiff === 1 && rowDiff === direction) {
      return this.board[toRow][toCol] !== null;
    }

    return false;
  }

  isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  }

  wouldBeInCheck(fromRow, fromCol, toRow, toCol, color) {
    // Make temporary move
    const originalPiece = this.board[toRow][toCol];
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;

    const inCheck = this.isInCheck(color);

    // Restore board
    this.board[fromRow][fromCol] = this.board[toRow][toCol];
    this.board[toRow][toCol] = originalPiece;

    return inCheck;
  }

  isInCheck(color) {
    const kingPosition = this.findKing(color);
    if (!kingPosition) return false;

    const [kingRow, kingCol] = kingPosition;
    const opponentColor = color === "white" ? "black" : "white";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === opponentColor) {
          if (
            this.isValidPieceMove(
              piece.type,
              row,
              col,
              kingRow,
              kingCol,
              piece.color
            )
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  findKing(color) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type === "king" && piece.color === color) {
          return [row, col];
        }
      }
    }
    return null;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];

    if (capturedPiece) {
      this.capturedPieces[capturedPiece.color].push(capturedPiece);
      // Update score when piece is captured
      this.scores[piece.color] += this.pieceValues[capturedPiece.type];
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Handle pawn promotion
    if (piece.type === "pawn") {
      if (
        (piece.color === "white" && toRow === 0) ||
        (piece.color === "black" && toRow === 7)
      ) {
        this.board[toRow][toCol] = { type: "queen", color: piece.color };
        // Add points for promotion (queen value - pawn value)
        this.scores[piece.color] +=
          this.pieceValues.queen - this.pieceValues.pawn;
      }
    }

    this.lastMove = { from: [fromRow, fromCol], to: [toRow, toCol] };
    this.updateDisplay();
    this.updateCapturedPieces();
    this.updateScores();

    // Check for game end conditions
    if (this.isCheckmate(this.currentPlayer === "white" ? "black" : "white")) {
      this.gameOver = true;
      this.stopTimer();
      document.getElementById("game-status").textContent = `Checkmate! ${
        this.currentPlayer === "white" ? "White" : "Black"
      } wins!`;
    } else if (
      this.isStalemate(this.currentPlayer === "white" ? "black" : "white")
    ) {
      this.gameOver = true;
      this.stopTimer();
      document.getElementById("game-status").textContent =
        "Stalemate! It's a draw!";
    } else if (
      this.isInCheck(this.currentPlayer === "white" ? "black" : "white")
    ) {
      document.getElementById("game-status").textContent = `${
        this.currentPlayer === "white" ? "Black" : "White"
      } is in check!`;
    } else {
      document.getElementById("game-status").textContent = "";
    }
  }

  isCheckmate(color) {
    if (!this.isInCheck(color)) return false;
    return !this.hasValidMoves(color);
  }

  isStalemate(color) {
    if (this.isInCheck(color)) return false;
    return !this.hasValidMoves(color);
  }

  hasValidMoves(color) {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = this.board[fromRow][fromCol];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    this.updateDisplay();
    this.switchTimers();
  }

  makeComputerMove() {
    if (this.gameOver || this.currentPlayer !== "black") return;

    const validMoves = this.getAllValidMoves("black");
    if (validMoves.length === 0) return;

    // Simple AI: random move with preference for captures
    const captureMoves = validMoves.filter(
      (move) => this.board[move.to[0]][move.to[1]] !== null
    );
    const moveToMake =
      captureMoves.length > 0 && Math.random() < 0.7
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : validMoves[Math.floor(Math.random() * validMoves.length)];

    this.makeMove(
      moveToMake.from[0],
      moveToMake.from[1],
      moveToMake.to[0],
      moveToMake.to[1]
    );

    if (!this.gameOver) {
      this.switchPlayer();
    }
  }

  getAllValidMoves(color) {
    const moves = [];
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = this.board[fromRow][fromCol];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                moves.push({ from: [fromRow, fromCol], to: [toRow, toCol] });
              }
            }
          }
        }
      }
    }
    return moves;
  }

  updateDisplay() {
    // Update current player display
    document.getElementById("current-player").textContent = `${
      this.currentPlayer === "white" ? "White" : "Black"
    }'s Turn`;

    // Highlight last move
    document.querySelectorAll(".last-move").forEach((square) => {
      square.classList.remove("last-move");
    });

    if (this.lastMove) {
      const fromSquare = document.querySelector(
        `[data-row="${this.lastMove.from[0]}"][data-col="${this.lastMove.from[1]}"]`
      );
      const toSquare = document.querySelector(
        `[data-row="${this.lastMove.to[0]}"][data-col="${this.lastMove.to[1]}"]`
      );
      if (fromSquare) fromSquare.classList.add("last-move");
      if (toSquare) toSquare.classList.add("last-move");
    }

    // Update board display
    this.createBoard();
  }

  updateCapturedPieces() {
    const whiteCaptured = document.getElementById("white-captured");
    const blackCaptured = document.getElementById("black-captured");

    whiteCaptured.innerHTML = "";
    blackCaptured.innerHTML = "";

    this.capturedPieces.white.forEach((piece) => {
      const pieceElement = document.createElement("span");
      pieceElement.className = `piece ${piece.color}`;
      pieceElement.textContent = this.pieceSymbols[piece.color][piece.type];
      whiteCaptured.appendChild(pieceElement);
    });

    this.capturedPieces.black.forEach((piece) => {
      const pieceElement = document.createElement("span");
      pieceElement.className = `piece ${piece.color}`;
      pieceElement.textContent = this.pieceSymbols[piece.color][piece.type];
      blackCaptured.appendChild(pieceElement);
    });
  }

  attachEventListeners() {
    document.getElementById("new-game").addEventListener("click", () => {
      this.newGame();
    });

    document.getElementById("pvp-mode").addEventListener("click", () => {
      this.setGameMode("pvp");
    });

    document.getElementById("pvc-mode").addEventListener("click", () => {
      this.setGameMode("pvc");
    });

    document.getElementById("timer-toggle").addEventListener("click", () => {
      this.toggleTimer();
    });

    document.getElementById("timer-minutes").addEventListener("change", (e) => {
      this.updateTimerSettings();
    });

    document.getElementById("timer-seconds").addEventListener("change", (e) => {
      this.updateTimerSettings();
    });
  }

  setGameMode(mode) {
    this.gameMode = mode;

    document.querySelectorAll(".mode-selector button").forEach((btn) => {
      btn.classList.remove("active");
    });

    if (mode === "pvp") {
      document.getElementById("pvp-mode").classList.add("active");
    } else {
      document.getElementById("pvc-mode").classList.add("active");
    }

    this.newGame();
  }

  // Timer methods
  toggleTimer() {
    this.timerEnabled = !this.timerEnabled;
    const timerToggle = document.getElementById("timer-toggle");
    const timerSettings = document.getElementById("timer-settings");
    const playerTimers = document.getElementById("player-timers");

    if (this.timerEnabled) {
      timerToggle.textContent = "Disable Timer";
      timerToggle.classList.add("active");
      timerSettings.classList.add("active");
      playerTimers.classList.add("active");
      this.updateTimerSettings();
      this.startTimer();
    } else {
      timerToggle.textContent = "Enable Timer";
      timerToggle.classList.remove("active");
      timerSettings.classList.remove("active");
      playerTimers.classList.remove("active");
      this.stopTimer();
    }
  }

  updateTimerSettings() {
    const minutes =
      parseInt(document.getElementById("timer-minutes").value) || 5;
    const seconds =
      parseInt(document.getElementById("timer-seconds").value) || 0;
    this.defaultTime = minutes * 60 + seconds;
    this.whiteTime = this.defaultTime;
    this.blackTime = this.defaultTime;
    this.updateTimerDisplay();
  }

  startTimer() {
    if (!this.timerEnabled || this.gameOver) return;

    this.stopTimer(); // Clear any existing timer
    this.timerInterval = setInterval(() => {
      if (this.currentPlayer === "white") {
        this.whiteTime--;
        if (this.whiteTime <= 0) {
          this.gameOver = true;
          this.stopTimer();
          document.getElementById("game-status").textContent =
            "Time's up! Black wins!";
          return;
        }
      } else {
        this.blackTime--;
        if (this.blackTime <= 0) {
          this.gameOver = true;
          this.stopTimer();
          document.getElementById("game-status").textContent =
            "Time's up! White wins!";
          return;
        }
      }
      this.updateTimerDisplay();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  switchTimers() {
    if (!this.timerEnabled) return;

    // Update timer display classes
    const whiteTimer = document.getElementById("white-timer");
    const blackTimer = document.getElementById("black-timer");

    whiteTimer.classList.toggle("active", this.currentPlayer === "white");
    blackTimer.classList.toggle("active", this.currentPlayer === "black");
  }

  updateTimerDisplay() {
    const whiteTimer = document.getElementById("white-time");
    const blackTimer = document.getElementById("black-time");
    const whiteTimerDiv = document.getElementById("white-timer");
    const blackTimerDiv = document.getElementById("black-timer");

    whiteTimer.textContent = this.formatTime(this.whiteTime);
    blackTimer.textContent = this.formatTime(this.blackTime);

    // Add warning class if time is low (less than 30 seconds)
    whiteTimerDiv.classList.toggle("warning", this.whiteTime <= 30);
    blackTimerDiv.classList.toggle("warning", this.blackTime <= 30);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Score methods
  updateScores() {
    document.getElementById("white-score").textContent = this.scores.white;
    document.getElementById("black-score").textContent = this.scores.black;
  }

  calculateMaterialScore() {
    const scores = { white: 0, black: 0 };

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type !== "king") {
          scores[piece.color] += this.pieceValues[piece.type];
        }
      }
    }

    return scores;
  }

  newGame() {
    this.board = this.initializeBoard();
    this.currentPlayer = "white";
    this.selectedSquare = null;
    this.gameOver = false;
    this.capturedPieces = { white: [], black: [] };
    this.lastMove = null;
    this.whiteKingMoved = false;
    this.blackKingMoved = false;
    this.whiteRooksMoved = { left: false, right: false };
    this.blackRooksMoved = { left: false, right: false };

    // Reset scores
    this.scores = { white: 0, black: 0 };

    // Reset timers
    if (this.timerEnabled) {
      this.whiteTime = this.defaultTime;
      this.blackTime = this.defaultTime;
      this.updateTimerDisplay();
      this.startTimer();
    }

    document.getElementById("game-status").textContent = "";
    this.updateDisplay();
    this.updateCapturedPieces();
    this.updateScores();
    this.clearSelection();
    this.switchTimers();
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const game = new ChessGame();
});
