class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.initializeGame();
        this.loadScores();
    }
    
    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.gameStatus = document.getElementById('game-status');
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.resetBtn = document.getElementById('reset-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.modal = document.getElementById('game-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalClose = document.getElementById('modal-close');
        
        this.scoreX = document.getElementById('score-x');
        this.scoreO = document.getElementById('score-o');
        this.scoreDraw = document.getElementById('score-draw');
        
        this.addEventListeners();
        this.updateScoreDisplay();
        this.updateCurrentPlayerDisplay();
    }
    
    addEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', this.handleCellClick.bind(this));
        });
        
        this.resetBtn.addEventListener('click', this.resetGame.bind(this));
        this.newGameBtn.addEventListener('click', this.newGame.bind(this));
        this.modalClose.addEventListener('click', this.closeModal.bind(this));
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            
            // Number keys 1-9 for cell selection
            const num = parseInt(e.key);
            if (num >= 1 && num <= 9) {
                const cellIndex = num - 1;
                const cell = this.cells[cellIndex];
                if (this.gameActive && this.board[cellIndex] === '') {
                    this.makeMove(cellIndex);
                }
            }
            
            // R key for reset
            if (e.key.toLowerCase() === 'r') {
                this.resetGame();
            }
        });
    }
    
    handleCellClick(e) {
        const cellIndex = parseInt(e.target.getAttribute('data-index'));
        
        if (this.board[cellIndex] !== '' || !this.gameActive) {
            this.playSound('error');
            return;
        }
        
        this.makeMove(cellIndex);
    }
    
    makeMove(cellIndex) {
        this.board[cellIndex] = this.currentPlayer;
        this.cells[cellIndex].textContent = this.currentPlayer;
        this.cells[cellIndex].classList.add(this.currentPlayer.toLowerCase());
        
        this.playSound('move');
        
        if (this.checkWin()) {
            this.gameActive = false;
            this.highlightWinningCells();
            this.scores[this.currentPlayer]++;
            this.updateScoreDisplay();
            this.saveScores();
            this.playSound('win');
            
            setTimeout(() => {
                this.showModal(
                    `🎉 Player ${this.currentPlayer} Wins!`,
                    `Congratulations! You've won this round.`
                );
            }, 800);
            
            return;
        }
        
        if (this.checkDraw()) {
            this.gameActive = false;
            this.scores.draw++;
            this.updateScoreDisplay();
            this.saveScores();
            this.playSound('draw');
            
            setTimeout(() => {
                this.showModal(
                    "🤝 It's a Draw!",
                    "Good game! Nobody wins this round."
                );
            }, 500);
            
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateCurrentPlayerDisplay();
        this.updateGameStatus(`Player ${this.currentPlayer}'s turn`);
    }
    
    checkWin() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    highlightWinningCells() {
        this.winningConditions.forEach(condition => {
            const [a, b, c] = condition;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.cells[a].classList.add('winning');
                this.cells[b].classList.add('winning');
                this.cells[c].classList.add('winning');
            }
        });
    }
    
    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning', 'disabled');
        });
        
        this.updateCurrentPlayerDisplay();
        this.updateGameStatus('');
        this.playSound('reset');
    }
    
    newGame() {
        this.resetGame();
        this.scores = { X: 0, O: 0, draw: 0 };
        this.updateScoreDisplay();
        this.saveScores();
    }
    
    updateCurrentPlayerDisplay() {
        this.currentPlayerDisplay.textContent = this.currentPlayer;
        this.currentPlayerDisplay.style.color = this.currentPlayer === 'X' ? '#e53e3e' : '#3182ce';
    }
    
    updateGameStatus(message) {
        this.gameStatus.textContent = message;
    }
    
    updateScoreDisplay() {
        this.scoreX.textContent = this.scores.X;
        this.scoreO.textContent = this.scores.O;
        this.scoreDraw.textContent = this.scores.draw;
    }
    
    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.style.display = 'block';
        
        // Disable cells during modal
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
        });
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        this.cells.forEach(cell => {
            cell.classList.remove('disabled');
        });
        this.resetGame();
    }
    
    playSound(type) {
        // Create different frequencies for different sounds
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure sound based on type
        switch(type) {
            case 'move':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'win':
                // Play a victory melody
                const frequencies = [523, 659, 784, 1047]; // C, E, G, C
                frequencies.forEach((freq, index) => {
                    setTimeout(() => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                        gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                        osc.start(audioContext.currentTime);
                        osc.stop(audioContext.currentTime + 0.3);
                    }, index * 150);
                });
                break;
                
            case 'draw':
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'error':
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'reset':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
        }
    }
    
    saveScores() {
        // Since we can't use localStorage in Claude artifacts, we'll keep scores in memory
        // In a real implementation, you would use:
        // localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }
    
    loadScores() {
        // Since we can't use localStorage in Claude artifacts, we'll start with default scores
        // In a real implementation, you would use:
        // const savedScores = localStorage.getItem('ticTacToeScores');
        // if (savedScores) {
        //     this.scores = JSON.parse(savedScores);
        // }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Add some fun Easter eggs
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        // Konami code style Easter egg - change theme
        document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)';
        setTimeout(() => {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 3000);
    }
});

// Prevent context menu on game board for better mobile experience
document.querySelector('.game-board').addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add touch support for better mobile experience
let touchStartTime = 0;
document.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
});

document.addEventListener('touchend', (e) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    
    // Prevent accidental touches (too short) and long presses
    if (touchDuration < 50 || touchDuration > 500) {
        e.preventDefault();
    }
});