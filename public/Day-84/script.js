class EscapeRoom404Game {
    constructor() {
        this.currentLevel = 1;
        this.timeLeft = 60;
        this.gameTimer = null;
        this.gameStartTime = null;
        this.isGameActive = false;
        this.keypadInput = '';
        
        // Game state
        this.levels = {
            1: { completed: false, answer: 'key-found' },
            2: { completed: false, answer: 'alarm' },
            3: { completed: false, answer: '1999' }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupDragAndDrop();
        this.createStarsEffect();
    }
    
    bindEvents() {
        // Start game button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Riddle submission
        document.getElementById('submit-riddle').addEventListener('click', () => {
            this.checkRiddleAnswer();
        });
        
        document.getElementById('riddle-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkRiddleAnswer();
            }
        });
        
        // Keypad buttons
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleKeypadInput(e.target.dataset.key);
            });
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Retry button
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    setupDragAndDrop() {
        const hiddenKey = document.getElementById('key-1');
        const keySlot = document.getElementById('key-slot-1');
        
        hiddenKey.setAttribute('draggable', 'true');
        
        hiddenKey.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'key-1');
            hiddenKey.classList.add('dragging');
        });
        
        hiddenKey.addEventListener('dragend', () => {
            hiddenKey.classList.remove('dragging');
        });
        
        keySlot.addEventListener('dragover', (e) => {
            e.preventDefault();
            keySlot.classList.add('drag-over');
        });
        
        keySlot.addEventListener('dragleave', () => {
            keySlot.classList.remove('drag-over');
        });
        
        keySlot.addEventListener('drop', (e) => {
            e.preventDefault();
            keySlot.classList.remove('drag-over');
            
            const data = e.dataTransfer.getData('text/plain');
            if (data === 'key-1') {
                this.completeLevel1();
            }
        });
        
        // Mobile touch support
        hiddenKey.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                this.completeLevel1();
            }
        });
    }
    
    createStarsEffect() {
        // Add more dynamic stars
        const starsContainer = document.querySelector('.stars');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = Math.random() * 3 + 'px';
            star.style.height = star.style.width;
            star.style.backgroundColor = Math.random() > 0.5 ? '#00ff88' : '#ff0080';
            star.style.borderRadius = '50%';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
            starsContainer.appendChild(star);
        }
        
        // Add twinkle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    startGame() {
        this.showScreen('game-screen');
        this.isGameActive = true;
        this.gameStartTime = Date.now();
        this.startTimer();
        this.showLevel(1);
        
        // Play start sound effect (visual feedback)
        this.showNotification('Game Started! Find the hidden key...', 'info');
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 10) {
                document.getElementById('timer').classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        document.getElementById('timer').textContent = this.timeLeft;
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    showLevel(levelNum) {
        document.querySelectorAll('.level').forEach(level => {
            level.classList.remove('active');
        });
        
        const levelElement = document.getElementById(`level-${levelNum}`);
        if (levelElement) {
            levelElement.classList.add('active');
            levelElement.classList.add('level-transition');
            
            // Remove transition class after animation
            setTimeout(() => {
                levelElement.classList.remove('level-transition');
            }, 1000);
        }
        
        this.currentLevel = levelNum;
    }
    
    completeLevel1() {
        if (this.levels[1].completed) return;
        
        this.levels[1].completed = true;
        
        // Visual feedback
        const keySlot = document.getElementById('key-slot-1');
        const hiddenKey = document.getElementById('key-1');
        
        keySlot.classList.add('completed');
        keySlot.innerHTML = '<span style="font-size: 2rem;">🔑</span>';
        hiddenKey.style.display = 'none';
        
        this.updateProgress(1);
        this.showNotification('Access key found! Proceeding to decryption...', 'success');
        
        setTimeout(() => {
            this.showLevel(2);
        }, 2000);
    }
    
    checkRiddleAnswer() {
        const answer = document.getElementById('riddle-answer').value.toLowerCase().trim();
        const correctAnswer = this.levels[2].answer;
        
        if (answer === correctAnswer) {
            this.completeLevel2();
        } else {
            this.showNotification('Incorrect answer. Try again!', 'error');
            document.getElementById('riddle-answer').value = '';
            
            // Show hint after wrong answer
            setTimeout(() => {
                document.getElementById('riddle-hint').style.opacity = '1';
                document.getElementById('riddle-hint').style.color = '#ffff00';
            }, 1000);
        }
    }
    
    completeLevel2() {
        if (this.levels[2].completed) return;
        
        this.levels[2].completed = true;
        this.updateProgress(2);
        this.showNotification('Decryption successful! Accessing final barrier...', 'success');
        
        setTimeout(() => {
            this.showLevel(3);
        }, 2000);
    }
    
    handleKeypadInput(key) {
        const display = document.getElementById('keypad-display');
        let currentDisplay = display.textContent;
        
        if (key === 'clear') {
            display.textContent = '____';
            this.keypadInput = '';
        } else if (key === 'enter') {
            // Only check if we have exactly 4 digits
            const inputWithoutUnderscores = currentDisplay.replace(/_/g, '');
            if (inputWithoutUnderscores.length === 4) {
                this.checkKeypadAnswer(inputWithoutUnderscores);
            } else {
                this.showNotification('Please enter 4 digits before pressing enter', 'error');
            }
        } else {
            // Handle number input - much simpler logic
            if (!this.keypadInput) {
                this.keypadInput = '';
            }
            
            // Add the digit if we haven't reached 4 digits
            if (this.keypadInput.length < 4) {
                this.keypadInput += key;
                
                // Update display by replacing underscores from left to right
                let newDisplay = '';
                for (let i = 0; i < 4; i++) {
                    if (i < this.keypadInput.length) {
                        newDisplay += this.keypadInput[i];
                    } else {
                        newDisplay += '_';
                    }
                }
                display.textContent = newDisplay;
            }
        }
        
        // Button press animation
        const btn = document.querySelector(`[data-key="${key}"]`);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        }
    }
    
    checkKeypadAnswer(input) {
        const correctAnswer = this.levels[3].answer;
        
        if (input === correctAnswer) {
            this.completeLevel3();
        } else {
            this.showNotification('Access denied! Try again.', 'error');
            document.getElementById('keypad-display').textContent = '____';
            
            // Screen glitch effect
            document.body.style.animation = 'error-glitch 0.5s';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        }
    }
    
    completeLevel3() {
        if (this.levels[3].completed) return;
        
        this.levels[3].completed = true;
        this.updateProgress(3);
        
        // Stop the timer
        clearInterval(this.gameTimer);
        this.isGameActive = false;
        
        this.showNotification('Final barrier breached! Escape sequence initiated...', 'success');
        
        setTimeout(() => {
            this.showSuccessScreen();
        }, 2000);
    }
    
    updateProgress(levelNum) {
        const progressBar = document.getElementById(`progress-${levelNum}`);
        progressBar.classList.add('completed');
        
        // Add completion animation
        progressBar.style.animation = 'progress-complete 0.5s ease';
    }
    
    showSuccessScreen() {
        this.showScreen('success-screen');
        
        // Calculate final time
        const totalTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        document.getElementById('final-time').textContent = 
            `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Animate doors opening
        setTimeout(() => {
            document.querySelectorAll('.door').forEach(door => {
                door.classList.add('open');
            });
            
            setTimeout(() => {
                document.querySelector('.exit-light').classList.add('active');
            }, 1000);
        }, 500);
    }
    
    gameOver() {
        clearInterval(this.gameTimer);
        this.isGameActive = false;
        this.showScreen('failure-screen');
    }
    
    resetGame() {
        // Reset all game state
        this.currentLevel = 1;
        this.timeLeft = 60;
        this.isGameActive = false;
        this.gameStartTime = null;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        // Reset levels
        Object.keys(this.levels).forEach(key => {
            this.levels[key].completed = false;
        });
        
        // Reset UI
        document.getElementById('timer').classList.remove('warning');
        document.getElementById('timer').textContent = '60';
        
        document.querySelectorAll('.progress-bar').forEach(bar => {
            bar.classList.remove('completed');
        });
        
        // Reset level 1
        document.getElementById('key-slot-1').classList.remove('completed');
        document.getElementById('key-slot-1').innerHTML = '<span class="slot-text">DROP KEY HERE</span>';
        document.getElementById('key-1').style.display = 'inline';
        
        // Reset level 2
        document.getElementById('riddle-answer').value = '';
        document.getElementById('riddle-hint').style.opacity = '0.7';
        document.getElementById('riddle-hint').style.color = '#666';
        
        // Reset level 3
        document.getElementById('keypad-display').textContent = '____';
        this.keypadInput = '';
        
        // Reset success screen animations
        document.querySelectorAll('.door').forEach(door => {
            door.classList.remove('open');
        });
        document.querySelector('.exit-light').classList.remove('active');
        
        // Show initial screen
        this.showScreen('error-screen');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.9)' : 
                         type === 'error' ? 'rgba(255, 0, 128, 0.9)' : 
                         'rgba(0, 255, 255, 0.9)'};
            color: #000;
            padding: 20px 40px;
            border-radius: 5px;
            font-size: 1.1rem;
            font-weight: bold;
            z-index: 1000;
            animation: notification-show 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'notification-hide 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes notification-show {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes notification-hide {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
    
    @keyframes progress-complete {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes error-glitch {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EscapeRoom404Game();
});

// Add some easter eggs and extra effects
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    if (e.code === 'ArrowUp' && e.shiftKey) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
    
    // ESC key for emergency reset
    if (e.key === 'Escape') {
        if (confirm('Reset the game?')) {
            location.reload();
        }
    }
});

// Add ambient sound effect simulation through visual pulses
setInterval(() => {
    if (Math.random() > 0.95) {
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(0, 255, 136, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ambient-pulse 2s ease-out;
            pointer-events: none;
            z-index: 0;
        `;
        
        document.body.appendChild(pulse);
        
        setTimeout(() => {
            document.body.removeChild(pulse);
        }, 2000);
    }
}, 1000);

// Add ambient pulse animation
const ambientStyle = document.createElement('style');
ambientStyle.textContent = `
    @keyframes ambient-pulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(ambientStyle);
