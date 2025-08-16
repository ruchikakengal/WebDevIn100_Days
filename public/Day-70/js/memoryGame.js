class MemoryGame {
    constructor() {
        this.board = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.gameTimer = null;
        this.isGameActive = false;
        this.isProcessing = false;
        
        this.symbols = ['💖', '💕', '💗', '💓', '❤️', '💝', '💘', '💌'];
        this.cardPairs = [...this.symbols, ...this.symbols]; // Duplicate for pairs
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const startBtn = document.getElementById('startMemoryGame');
        const restartBtn = document.getElementById('restartMemoryGame');
        const playAgainBtn = document.getElementById('playAgain');

        startBtn.addEventListener('click', () => {
            this.startGame();
        });

        restartBtn.addEventListener('click', () => {
            this.restartGame();
        });

        playAgainBtn.addEventListener('click', () => {
            this.closeVictoryModal();
            this.startGame();
        });
    }

    startGame() {
        this.resetGame();
        this.createBoard();
        this.startTimer();
        this.isGameActive = true;
        document.getElementById('startMemoryGame').style.display = 'none';
        document.getElementById('restartMemoryGame').style.display = 'inline-flex';
        if (window.audioManager) {
            window.audioManager.playSound('start');
        }
    }

    resetGame() {
        this.board = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = Date.now();
        this.isGameActive = false;
        this.isProcessing = false;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        this.updateStats();
    }

    createBoard() {
        const boardElement = document.getElementById('memoryBoard');
        boardElement.innerHTML = '';
        this.board = this.shuffleArray([...this.cardPairs]);
        this.board.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            
            const frontFace = document.createElement('div');
            frontFace.className = 'card-face card-front';
            frontFace.innerHTML = '<i class="fas fa-heart"></i>';
            
            const backFace = document.createElement('div');
            backFace.className = 'card-face card-back';
            backFace.textContent = symbol;
            
            card.appendChild(frontFace);
            card.appendChild(backFace);
            
            card.addEventListener('click', () => {
                this.flipCard(card, index);
            });
            
            boardElement.appendChild(card);
            
            setTimeout(() => {
                card.style.animation = 'scaleIn 0.3s ease-out';
            }, index * 50);
        });
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    flipCard(cardElement, index) {
        if (!this.isGameActive || this.isProcessing) return;
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
        if (this.flippedCards.length >= 2) return;
        cardElement.classList.add('flipped');
        this.flippedCards.push({ element: cardElement, index, symbol: this.board[index] });
        
        if (window.audioManager) {
            window.audioManager.playSound('flip');
        }
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    async checkMatch() {
        this.isProcessing = true;
        const [card1, card2] = this.flippedCards;
        
        await this.sleep(800);
        
        if (card1.symbol === card2.symbol) {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            this.matchedPairs++;
            if (window.audioManager) {
                window.audioManager.playSound('match');
            }
            
            this.addSparkleEffect(card1.element);
            this.addSparkleEffect(card2.element);
            
            if (this.matchedPairs === this.symbols.length) {
                this.endGame();
            }
        } else {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            
            if (window.audioManager) {
                window.audioManager.playSound('miss');
            }
        }
        
        this.flippedCards = [];
        this.isProcessing = false;
        this.updateStats();
    }

    addSparkleEffect(cardElement) {
        const sparkles = [];
        
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                font-size: 20px;
                pointer-events: none;
                z-index: 1000;
                animation: sparkle 1s ease-out forwards;
                transform: translate(-50%, -50%) rotate(${i * 45}deg) translateY(-30px);
            `;
            
            cardElement.appendChild(sparkle);
            sparkles.push(sparkle);
        }
        
        setTimeout(() => {
            sparkles.forEach(sparkle => sparkle.remove());
        }, 1000);
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            if (this.isGameActive) {
                this.updateStats();
            }
        }, 1000);
    }

    updateStats() {
        document.getElementById('moveCount').textContent = this.moves;
        document.getElementById('matchCount').textContent = `${this.matchedPairs}/${this.symbols.length}`;
        
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timeCount').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    endGame() {
        this.isGameActive = false;
        clearInterval(this.gameTimer);
        
        const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(finalTime / 60);
        const seconds = finalTime % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalTime').textContent = timeString;
        
        if (window.audioManager) {
            window.audioManager.playSound('victory');
        }
        
        setTimeout(() => {
            document.getElementById('victoryModal').style.display = 'flex';
            
            this.createVictoryCelebration();
        }, 1000);
        
        this.saveGameStats(this.moves, finalTime);
    }

    createVictoryCelebration() {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.backgroundColor = ['#ff9a9e', '#fecfef', '#ff416c', '#667eea'][Math.floor(Math.random() * 4)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = ['💖', '💕', '💗', '💓', '❤️'][Math.floor(Math.random() * 5)];
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${window.innerHeight}px;
                    font-size: ${Math.random() * 20 + 25}px;
                    z-index: 1001;
                    pointer-events: none;
                    animation: float 4s ease-out forwards;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 4000);
            }, i * 100);
        }
    }

    restartGame() {
        this.resetGame();
        this.startGame();
    }

    closeVictoryModal() {
        document.getElementById('victoryModal').style.display = 'none';
    }

    saveGameStats(moves, timeInSeconds) {
        const stats = JSON.parse(localStorage.getItem('memory-game-stats') || '{}');
        
        if (!stats.gamesPlayed) stats.gamesPlayed = 0;
        if (!stats.bestMoves || moves < stats.bestMoves) stats.bestMoves = moves;
        if (!stats.bestTime || timeInSeconds < stats.bestTime) stats.bestTime = timeInSeconds;
        
        stats.gamesPlayed++;
        stats.lastPlayed = new Date().toISOString();
        stats.totalMoves = (stats.totalMoves || 0) + moves;
        stats.totalTime = (stats.totalTime || 0) + timeInSeconds;
        
        localStorage.setItem('memory-game-stats', JSON.stringify(stats));
    }

    getStats() {
        return JSON.parse(localStorage.getItem('memory-game-stats') || '{}');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    init() {
        this.resetGame();
        
        document.getElementById('memoryBoard').innerHTML = '';
        document.getElementById('startMemoryGame').style.display = 'inline-flex';
        document.getElementById('restartMemoryGame').style.display = 'none';
        document.getElementById('victoryModal').style.display = 'none';
        this.updateStats();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.memoryGame = new MemoryGame();
});