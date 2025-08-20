// Main game controller for KBC quiz game

/**
 * Main Game class that controls the entire KBC quiz experience
 */
class KBCGame {
    constructor() {
        this.currentQuestion = null;
        this.currentLevel = 1;
        this.selectedOption = null;
        this.gameState = 'initial'; // initial, playing, paused, ended
        this.usedLifelines = new Set();
        this.timer = null;
        this.timeRemaining = 30;
        this.score = 0;
        this.questionsAnswered = 0;
        this.currentStreak = 0;
        this.highScore = Utils.Storage.get('highScore', 0);
        this.usedPowerups = new Set();
        this.isDoubleDipActive = false;
        this.isTimeFrozen = false;
        this.gameSettings = {
            timerDuration: 30,
            difficultyMode: 'normal',
            masterVolume: 0.7,
            musicVolume: 0.3,
            effectsVolume: 0.8
        };
        
        // Prize ladder amounts in rupees
        this.prizeLadder = [
            5000, 10000, 20000, 40000, 80000,           // Easy questions
            160000, 320000, 625000, 1250000, 2500000,    // Medium questions
            5000000, 8750000, 17500000, 35000000, 70000000 // Hard questions
        ];
        
        // Milestone levels (safe amounts)
        this.milestones = [6, 11, 15]; // ₹1.6 Lakh, ₹50 Lakh, ₹7 Crore
        
        // Initialize game components
        this.questions = new Questions();
        this.audioManager = new AudioManager();
        this.lifelines = new LifelinesManager(this);
        
        this.initializeGame();
        this.attachEventListeners();
        this.loadGamePreferences();
        this.loadGameSettings();
        this.updateStreakAndScore();
    }

    /**
     * Initialize game components and UI
     */
    initializeGame() {
        // Load audio preferences
        this.audioManager.loadPreferences();
        
        // Show start modal
        this.showModal('start-modal');
        
        // Initialize UI elements
        this.updateQuestionNumber();
        this.updatePrizeLadder();
        
        // Set initial question display
        this.displayWelcomeMessage();
        
        // Create particle effects
        const particlesContainer = document.querySelector('.particles-container');
        if (particlesContainer) {
            Utils.createParticles(particlesContainer, 30);
        }
        
        console.log('KBC Game initialized successfully');
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Start game button
        Utils.addEventListener('start-game', 'click', () => {
            this.startGame();
        });

        // Answer options
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            Utils.addEventListener(option, 'click', (e) => {
                this.selectOption(e.currentTarget);
            });
            
            // Add hover sound effects
            Utils.addEventListener(option, 'mouseenter', () => {
                this.audioManager.playButtonHover();
            });
        });

        // Action buttons
        Utils.addEventListener('lock-answer', 'click', () => {
            this.lockAnswer();
        });

        Utils.addEventListener('quit-game', 'click', () => {
            this.quitGame();
        });

        // Play again button
        Utils.addEventListener('play-again', 'click', () => {
            this.restartGame();
        });

        // Share score button
        Utils.addEventListener('share-score', 'click', () => {
            this.shareScore();
        });

        // Lifeline buttons
        Utils.addEventListener('fifty-fifty', 'click', () => {
            this.lifelines.useFiftyFifty();
        });

        Utils.addEventListener('phone-friend', 'click', () => {
            this.lifelines.usePhoneAFriend();
        });

        Utils.addEventListener('ask-audience', 'click', () => {
            this.lifelines.useAskAudience();
        });

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close-btn');
        closeButtons.forEach(btn => {
            Utils.addEventListener(btn, 'click', (e) => {
                const modalId = e.target.getAttribute('data-close');
                this.hideModal(modalId);
            });
        });

        // Keyboard navigation
        Utils.addEventListener(document, 'keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Window visibility change (pause/resume)
        Utils.addEventListener(document, 'visibilitychange', () => {
            if (document.hidden && this.gameState === 'playing') {
                this.pauseGame();
            } else if (!document.hidden && this.gameState === 'paused') {
                this.resumeGame();
            }
        });

        // Prevent context menu on game elements
        Utils.addEventListener(document, 'contextmenu', (e) => {
            if (e.target.closest('.game-container')) {
                e.preventDefault();
            }
        });

        // Power-up buttons
        Utils.addEventListener('double-dip', 'click', () => {
            this.useDoubleDip();
        });

        Utils.addEventListener('switch-question', 'click', () => {
            this.useSwitchQuestion();
        });

        Utils.addEventListener('time-freeze', 'click', () => {
            this.useTimeFreeze();
        });

        Utils.addEventListener('skip-question', 'click', () => {
            this.skipQuestion();
        });

        // Settings panel
        Utils.addEventListener('settings-toggle', 'click', () => {
            this.toggleSettingsPanel();
        });

        // Settings controls
        Utils.addEventListener('master-volume', 'input', (e) => {
            this.updateMasterVolume(e.target.value / 100);
        });

        Utils.addEventListener('music-volume', 'input', (e) => {
            this.updateMusicVolume(e.target.value / 100);
        });

        Utils.addEventListener('effects-volume', 'input', (e) => {
            this.updateEffectsVolume(e.target.value / 100);
        });

        Utils.addEventListener('timer-speed', 'change', (e) => {
            this.gameSettings.timerDuration = parseInt(e.target.value);
            this.saveGameSettings();
        });

        Utils.addEventListener('difficulty-mode', 'change', (e) => {
            this.gameSettings.difficultyMode = e.target.value;
            this.saveGameSettings();
        });
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyPress(event) {
        if (this.gameState !== 'playing') return;

        const key = event.key.toLowerCase();
        
        // Answer selection (A, B, C, D keys)
        if (['a', 'b', 'c', 'd'].includes(key)) {
            const optionKey = key.toUpperCase();
            const option = document.querySelector(`[data-option="${optionKey}"]`);
            if (option && !option.classList.contains('disabled')) {
                this.selectOption(option);
            }
        }
        
        // Enter to lock answer
        if (key === 'enter' && this.selectedOption) {
            event.preventDefault();
            this.lockAnswer();
        }
        
        // Escape to quit
        if (key === 'escape') {
            event.preventDefault();
            this.quitGame();
        }
        
        // Lifeline shortcuts
        if (key === '1' && !this.usedLifelines.has('50-50')) {
            event.preventDefault();
            this.lifelines.useFiftyFifty();
        }
        if (key === '2' && !this.usedLifelines.has('phone')) {
            event.preventDefault();
            this.lifelines.usePhoneAFriend();
        }
        if (key === '3' && !this.usedLifelines.has('audience')) {
            event.preventDefault();
            this.lifelines.useAskAudience();
        }
        
        // Power-up shortcuts
        if (key === '4' && !this.usedPowerups.has('double-dip')) {
            event.preventDefault();
            this.useDoubleDip();
        }
        if (key === '5' && !this.usedPowerups.has('switch')) {
            event.preventDefault();
            this.useSwitchQuestion();
        }
        if (key === '6' && !this.usedPowerups.has('time-freeze')) {
            event.preventDefault();
            this.useTimeFreeze();
        }
    }

    /**
     * Start the game
     */
    startGame() {
        this.gameState = 'playing';
        this.currentLevel = 1;
        this.selectedOption = null;
        this.questionsAnswered = 0;
        this.usedLifelines.clear();
        
        // Hide start modal
        this.hideModal('start-modal');
        
        // Reset lifelines
        this.resetLifelines();
        
        // Start background music
        this.audioManager.playBackgroundMusic();
        
        // Load first question
        this.loadQuestion();
        
        // Update UI
        this.updatePrizeLadder();
        this.updateQuestionNumber();
        
        console.log('Game started');
        Utils.showToast('Game started! Good luck!', 'success');
    }

    /**
     * Load and display current question
     */
    loadQuestion() {
        if (this.currentLevel > 15) {
            this.gameWon();
            return;
        }

        // Get question from database
        this.currentQuestion = this.questions.getQuestion(this.currentLevel);
        
        // Display question with animation
        this.displayQuestion();
        
        // Start timer
        this.startTimer();
        
        // Reset option selection
        this.selectedOption = null;
        this.updateLockButton();
        
        console.log(`Question ${this.currentLevel} loaded:`, this.currentQuestion.question);
    }

    /**
     * Display question and options with animations
     */
    displayQuestion() {
        const questionText = Utils.getElementById('question-text');
        const optionsContainer = Utils.getElementById('options-container');
        
        if (!questionText || !optionsContainer) return;

        // Clear previous question with fade out
        questionText.style.opacity = '0';
        optionsContainer.style.opacity = '0';
        
        setTimeout(() => {
            // Set new question text
            questionText.textContent = this.currentQuestion.question;
            questionText.classList.add('animate-questionReveal');
            
            // Set options
            const options = optionsContainer.querySelectorAll('.option');
            options.forEach((option, index) => {
                const optionKey = option.getAttribute('data-option');
                const optionText = option.querySelector('.option-text');
                
                if (optionText) {
                    optionText.textContent = this.currentQuestion.options[optionKey];
                }
                
                // Reset option states
                option.classList.remove('selected', 'correct', 'incorrect', 'disabled');
                option.classList.add('animate-optionReveal', `stagger-${index + 1}`);
            });
            
            // Fade in with animations
            questionText.style.opacity = '1';
            optionsContainer.style.opacity = '1';
        }, 300);

        // Update question difficulty indicator
        this.updateDifficultyIndicator();
    }

    /**
     * Display welcome message
     */
    displayWelcomeMessage() {
        const questionText = Utils.getElementById('question-text');
        if (questionText) {
            questionText.textContent = 'Welcome to Kaun Banega Crorepati! Are you ready to start your journey to ₹7 Crore?';
        }

        // Set welcome options
        const options = [
            { key: 'A', text: "Yes, I'm ready!" },
            { key: 'B', text: "Let me read the rules first" },
            { key: 'C', text: "I need a moment to prepare" },
            { key: 'D', text: "Let's begin the challenge!" }
        ];

        const optionsContainer = Utils.getElementById('options-container');
        if (optionsContainer) {
            const optionElements = optionsContainer.querySelectorAll('.option');
            optionElements.forEach((option, index) => {
                const optionText = option.querySelector('.option-text');
                if (optionText && options[index]) {
                    optionText.textContent = options[index].text;
                }
                option.classList.remove('selected', 'correct', 'incorrect', 'disabled');
            });
        }
    }

    /**
     * Start the question timer
     */
    startTimer() {
        this.timeRemaining = 30;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            // Play tick sound
            if (this.timeRemaining > 0) {
                this.audioManager.playTimerTick();
            }
            
            // Warning at 10 seconds
            if (this.timeRemaining === 10) {
                this.audioManager.playTimerWarning();
                this.showTimerWarning();
            }
            
            // Critical warning at 5 seconds
            if (this.timeRemaining === 5) {
                this.showTimerCritical();
            }
            
            // Time's up
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    /**
     * Stop the timer
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.removeTimerWarnings();
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        const timerText = document.querySelector('.timer-text');
        const timerFill = document.querySelector('.timer-fill');
        
        if (timerText) {
            timerText.textContent = this.timeRemaining;
        }
        
        if (timerFill) {
            const percentage = (this.timeRemaining / 30) * 360;
            timerFill.style.background = `conic-gradient(var(--accent-gold) ${percentage}deg, transparent ${percentage}deg)`;
        }
    }

    /**
     * Show timer warning (10 seconds)
     */
    showTimerWarning() {
        const timerCircle = document.querySelector('.timer-circle');
        if (timerCircle) {
            timerCircle.classList.add('timer-warning');
        }
    }

    /**
     * Show critical timer warning (5 seconds)
     */
    showTimerCritical() {
        const timerCircle = document.querySelector('.timer-circle');
        if (timerCircle) {
            timerCircle.classList.remove('timer-warning');
            timerCircle.classList.add('timer-critical');
        }
    }

    /**
     * Remove timer warning classes
     */
    removeTimerWarnings() {
        const timerCircle = document.querySelector('.timer-circle');
        if (timerCircle) {
            timerCircle.classList.remove('timer-warning', 'timer-critical');
        }
    }

    /**
     * Handle time up scenario
     */
    timeUp() {
        this.stopTimer();
        this.audioManager.playWrongSound();
        
        Utils.showToast("Time's up! Game over.", 'error');
        
        // If no answer selected, player gets the previous milestone amount
        const finalAmount = this.getPreviousMilestoneAmount();
        this.gameOver(false, finalAmount);
    }

    /**
     * Select an answer option
     * @param {HTMLElement} option - Selected option element
     */
    selectOption(option) {
        if (this.gameState !== 'playing' || !option) return;
        
        // Remove previous selection
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select new option
        option.classList.add('selected');
        this.selectedOption = option.getAttribute('data-option');
        
        // Play selection sound
        this.audioManager.playButtonClick();
        
        // Update lock button
        this.updateLockButton();
        
        console.log(`Option ${this.selectedOption} selected`);
    }

    /**
     * Lock in the selected answer
     */
    lockAnswer() {
        if (!this.selectedOption || this.gameState !== 'playing') return;
        
        this.stopTimer();
        this.audioManager.playButtonClick();
        
        // Disable all options
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.add('disabled');
        });
        
        // Check if answer is correct
        const isCorrect = this.selectedOption === this.currentQuestion.correct;
        
        // Show correct/incorrect animation
        this.showAnswerResult(isCorrect);
    }

    /**
     * Show answer result with animations
     * @param {boolean} isCorrect - Whether the answer is correct
     */
    showAnswerResult(isCorrect) {
        const selectedElement = document.querySelector(`[data-option="${this.selectedOption}"]`);
        const correctElement = document.querySelector(`[data-option="${this.currentQuestion.correct}"]`);
        
        // Dramatic pause
        setTimeout(() => {
            if (isCorrect) {
                // Correct answer animation
                selectedElement.classList.add('correct');
                this.audioManager.playCorrectSound();
                
                // Update score and streak
                this.score = this.prizeLadder[this.currentLevel - 1];
                this.questionsAnswered++;
                this.currentStreak++;
                this.updatePrizeLadder();
                this.updateStreakAndScore();
                
                // Show celebration effects
                setTimeout(() => {
                    this.celebrateCorrectAnswer();
                }, 1000);
                
                // Progress to next level
                setTimeout(() => {
                    this.nextQuestion();
                }, 3000);
                
            } else {
                // Check if Double Dip is active for second chance
                if (this.isDoubleDipActive && !this.selectedOption.endsWith('_second')) {
                    // First wrong attempt with Double Dip
                    selectedElement.classList.add('incorrect');
                    this.audioManager.playWrongSound();
                    
                    // Reset selection for second chance
                    this.selectedOption = null;
                    document.querySelectorAll('.option.selected').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    Utils.showToast('Wrong! Double Dip gives you one more chance.', 'warning');
                    return;
                }
                
                // Wrong answer animation (final)
                selectedElement.classList.add('incorrect');
                correctElement.classList.add('correct');
                this.audioManager.playWrongSound();
                this.currentStreak = 0; // Reset streak
                this.updateStreakAndScore();
                
                // Disable Double Dip if it was active
                this.isDoubleDipActive = false;
                const questionContainer = Utils.getElementById('question-container');
                if (questionContainer) {
                    questionContainer.style.animation = '';
                }
                
                // Show game over
                setTimeout(() => {
                    const finalAmount = this.getPreviousMilestoneAmount();
                    this.gameOver(false, finalAmount);
                }, 3000);
            }
        }, 1000);
    }

    /**
     * Celebrate correct answer with effects
     */
    celebrateCorrectAnswer() {
        // Update prize ladder
        this.updatePrizeLadder();
        
        // Show congratulations message
        const currentPrize = Utils.formatCurrency(this.prizeLadder[this.currentLevel - 1]);
        Utils.showToast(`Correct! You've won ${currentPrize}!`, 'success', 2000);
        
        // Create confetti for milestone questions
        if (this.milestones.includes(this.currentLevel)) {
            const container = document.querySelector('.background-container');
            if (container) {
                Utils.createConfetti(container, 3000);
            }
        }
        
        // Increment questions answered
        this.questionsAnswered++;
        
        console.log(`Correct answer! Level ${this.currentLevel} completed.`);
    }

    /**
     * Progress to next question
     */
    nextQuestion() {
        this.currentLevel++;
        this.selectedOption = null;
        
        // Update UI
        this.updateQuestionNumber();
        this.removeTimerWarnings();
        
        // Load next question
        this.loadQuestion();
    }

    /**
     * Quit the game
     */
    quitGame() {
        if (this.gameState !== 'playing') return;
        
        // Confirm quit
        if (confirm('Are you sure you want to quit? You will keep your current winnings.')) {
            this.stopTimer();
            
            // Calculate final amount (current level - 1, or previous milestone)
            let finalAmount = 0;
            if (this.currentLevel > 1) {
                finalAmount = this.prizeLadder[this.currentLevel - 2];
            }
            
            this.gameOver(true, finalAmount, 'quit');
        }
    }

    /**
     * Handle game over scenario
     * @param {boolean} wasQuit - Whether player quit voluntarily
     * @param {number} finalAmount - Final prize amount
     * @param {string} reason - Reason for game over
     */
    gameOver(wasQuit = false, finalAmount = 0, reason = 'incorrect') {
        this.gameState = 'ended';
        this.stopTimer();
        this.audioManager.stopBackgroundMusic();
        
        // Update final amount display
        const finalAmountElement = Utils.getElementById('final-amount');
        const gameOverTitle = Utils.getElementById('game-over-title');
        const questionsAnsweredElement = Utils.getElementById('questions-answered');
        const lifelinesUsedElement = Utils.getElementById('lifelines-used');
        
        if (finalAmountElement) {
            finalAmountElement.textContent = Utils.formatCurrency(finalAmount);
        }
        
        if (gameOverTitle) {
            if (wasQuit) {
                gameOverTitle.textContent = 'Game Quit';
            } else if (reason === 'incorrect') {
                gameOverTitle.textContent = 'Wrong Answer';
            } else {
                gameOverTitle.textContent = 'Time Up';
            }
        }
        
        if (questionsAnsweredElement) {
            questionsAnsweredElement.textContent = this.questionsAnswered;
        }
        
        if (lifelinesUsedElement) {
            lifelinesUsedElement.textContent = this.usedLifelines.size;
        }
        
        // Save high score
        this.saveHighScore(finalAmount);
        
        // Show game over modal
        setTimeout(() => {
            this.showModal('game-over-modal');
        }, 1000);
        
        console.log(`Game over. Final amount: ${Utils.formatCurrency(finalAmount)}`);
    }

    /**
     * Handle game won scenario (reached ₹7 Crore)
     */
    gameWon() {
        this.gameState = 'ended';
        this.stopTimer();
        this.audioManager.stopBackgroundMusic();
        
        const finalAmount = this.prizeLadder[14]; // ₹7 Crore
        
        // Create massive celebration
        const container = document.querySelector('.background-container');
        if (container) {
            Utils.createConfetti(container, 10000);
        }
        
        // Update modal for winner
        const gameOverTitle = Utils.getElementById('game-over-title');
        const finalAmountElement = Utils.getElementById('final-amount');
        
        if (gameOverTitle) {
            gameOverTitle.textContent = 'CROREPATI! 🎉';
            gameOverTitle.classList.add('animate-congratulations');
        }
        
        if (finalAmountElement) {
            finalAmountElement.textContent = Utils.formatCurrency(finalAmount);
        }
        
        // Save high score
        this.saveHighScore(finalAmount);
        
        // Show winner modal
        setTimeout(() => {
            this.showModal('game-over-modal');
        }, 2000);
        
        Utils.showToast('CONGRATULATIONS! You are a CROREPATI! 🎉', 'success', 5000);
        console.log('GAME WON! Player reached ₹7 Crore!');
    }

    /**
     * Restart the game
     */
    restartGame() {
        // Reset all game state
        this.currentLevel = 1;
        this.selectedOption = null;
        this.gameState = 'initial';
        this.usedLifelines.clear();
        this.usedPowerups.clear();
        this.questionsAnswered = 0;
        this.currentStreak = 0;
        this.isDoubleDipActive = false;
        this.isTimeFrozen = false;
        this.stopTimer();
        
        // Reset questions
        this.questions.resetAllQuestions();
        
        // Hide modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Reset UI
        this.displayWelcomeMessage();
        this.resetLifelines();
        this.resetPowerups();
        this.updatePrizeLadder();
        this.updateQuestionNumber();
        this.updateStreakAndScore();
        this.removeTimerWarnings();
        
        // Show start modal
        setTimeout(() => {
            this.showModal('start-modal');
        }, 500);
        
        console.log('Game restarted');
    }

    /**
     * Pause the game
     */
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopTimer();
            this.audioManager.pauseBackgroundMusic();
            Utils.showToast('Game paused', 'info');
        }
    }

    /**
     * Resume the game
     */
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
            this.audioManager.resumeBackgroundMusic();
            Utils.showToast('Game resumed', 'info');
        }
    }

    /**
     * Share score on social media or copy to clipboard
     */
    async shareScore() {
        const finalAmount = Utils.getElementById('final-amount')?.textContent || '₹0';
        const shareText = `I just played KBC and won ${finalAmount}! Can you beat my score? #KBC #Quiz`;
        
        if (navigator.share && Utils.isMobile()) {
            try {
                await navigator.share({
                    title: 'My KBC Score',
                    text: shareText,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Copy to clipboard as fallback
            const copied = await Utils.copyToClipboard(shareText);
            if (copied) {
                Utils.showToast('Score copied to clipboard!', 'success');
            } else {
                Utils.showToast('Failed to copy score', 'error');
            }
        }
    }

    /**
     * Update question number display
     */
    updateQuestionNumber() {
        const currentQuestionElement = Utils.getElementById('current-question');
        if (currentQuestionElement) {
            currentQuestionElement.textContent = this.currentLevel;
        }
    }

    /**
     * Update prize ladder display
     */
    updatePrizeLadder() {
        const ladderItems = document.querySelectorAll('.ladder-item');
        
        ladderItems.forEach((item, index) => {
            const level = parseInt(item.getAttribute('data-level'));
            item.classList.remove('current', 'completed');
            
            if (level === this.currentLevel) {
                item.classList.add('current');
            } else if (level < this.currentLevel) {
                item.classList.add('completed');
            }
        });
    }

    /**
     * Update difficulty indicator
     */
    updateDifficultyIndicator() {
        const difficultyName = this.questions.getDifficultyName(this.currentLevel);
        const difficultyColors = {
            'Easy': '#28a745',
            'Medium': '#fd7e14',
            'Hard': '#dc3545'
        };
        
        // You can add a difficulty indicator to the UI if needed
        console.log(`Current difficulty: ${difficultyName}`);
    }

    /**
     * Update lock answer button state
     */
    updateLockButton() {
        const lockButton = Utils.getElementById('lock-answer');
        if (lockButton) {
            lockButton.disabled = !this.selectedOption;
            if (this.selectedOption) {
                lockButton.textContent = 'Lock Answer';
            } else {
                lockButton.textContent = 'Select an Answer';
            }
        }
    }

    /**
     * Reset all lifelines to unused state
     */
    resetLifelines() {
        const lifelineButtons = document.querySelectorAll('.lifeline');
        lifelineButtons.forEach(button => {
            button.classList.remove('used');
        });
        this.usedLifelines.clear();
    }

    /**
     * Get previous milestone amount
     * @returns {number} Previous safe amount
     */
    getPreviousMilestoneAmount() {
        if (this.currentLevel <= 6) return 0; // Below first milestone
        if (this.currentLevel <= 11) return this.prizeLadder[5]; // ₹1.6 Lakh
        if (this.currentLevel <= 15) return this.prizeLadder[10]; // ₹50 Lakh
        return this.prizeLadder[14]; // ₹7 Crore
    }

    /**
     * Show modal
     * @param {string} modalId - Modal ID to show
     */
    showModal(modalId) {
        const modal = Utils.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            // Focus management for accessibility
            const firstButton = modal.querySelector('button');
            if (firstButton) {
                setTimeout(() => firstButton.focus(), 100);
            }
        }
    }

    /**
     * Hide modal
     * @param {string} modalId - Modal ID to hide
     */
    hideModal(modalId) {
        const modal = Utils.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Save high score to local storage
     * @param {number} amount - Final prize amount
     */
    saveHighScore(amount) {
        const currentHighScore = Utils.Storage.get('kbc_high_score', 0);
        if (amount > currentHighScore) {
            Utils.Storage.set('kbc_high_score', amount);
            Utils.Storage.set('kbc_high_score_date', new Date().toISOString());
            Utils.showToast('New High Score!', 'success');
        }
        
        // Save game statistics
        const stats = Utils.Storage.get('kbc_stats', {
            gamesPlayed: 0,
            totalWinnings: 0,
            questionsAnswered: 0,
            lifelinesUsed: 0
        });
        
        stats.gamesPlayed++;
        stats.totalWinnings += amount;
        stats.questionsAnswered += this.questionsAnswered;
        stats.lifelinesUsed += this.usedLifelines.size;
        
        Utils.Storage.set('kbc_stats', stats);
    }

    /**
     * Load game preferences from storage
     */
    loadGamePreferences() {
        // Load any saved preferences
        const savedPrefs = Utils.Storage.get('kbc_preferences', {});
        
        // Apply preferences (audio is handled by AudioManager)
        console.log('Game preferences loaded:', savedPrefs);
    }

    /**
     * Get current game statistics
     * @returns {Object} Game statistics
     */
    getStatistics() {
        const stats = Utils.Storage.get('kbc_stats', {
            gamesPlayed: 0,
            totalWinnings: 0,
            questionsAnswered: 0,
            lifelinesUsed: 0
        });
        
        const highScore = Utils.Storage.get('kbc_high_score', 0);
        const highScoreDate = Utils.Storage.get('kbc_high_score_date', null);
        
        return {
            ...stats,
            highScore: highScore,
            highScoreDate: highScoreDate,
            averageWinnings: stats.gamesPlayed > 0 ? Math.round(stats.totalWinnings / stats.gamesPlayed) : 0
        };
    }

    /**
     * Use Double Dip power-up
     */
    useDoubleDip() {
        if (this.usedPowerups.has('double-dip') || this.gameState !== 'playing') {
            return;
        }

        this.usedPowerups.add('double-dip');
        this.isDoubleDipActive = true;
        
        // Update UI
        const powerupBtn = Utils.getElementById('double-dip');
        if (powerupBtn) {
            powerupBtn.classList.add('used');
            powerupBtn.style.animation = 'powerupActivate 0.6s ease-out';
        }

        // Add visual indicator
        const questionContainer = Utils.getElementById('question-container');
        if (questionContainer) {
            questionContainer.style.animation = 'doubleDipPulse 2s ease-in-out infinite';
        }

        this.audioManager.playEffect('lifeline');
        Utils.showToast('Double Dip activated! Second chance if wrong answer.', 'success');
    }

    /**
     * Use Switch Question power-up
     */
    useSwitchQuestion() {
        if (this.usedPowerups.has('switch') || this.gameState !== 'playing') {
            return;
        }

        this.usedPowerups.add('switch');
        
        // Update UI
        const powerupBtn = Utils.getElementById('switch-question');
        if (powerupBtn) {
            powerupBtn.classList.add('used');
            powerupBtn.style.animation = 'powerupActivate 0.6s ease-out';
        }

        // Generate new question
        this.loadNewQuestion();
        this.audioManager.playEffect('lifeline');
        Utils.showToast('Question switched!', 'success');
    }

    /**
     * Use Time Freeze power-up
     */
    useTimeFreeze() {
        if (this.usedPowerups.has('time-freeze') || this.gameState !== 'playing') {
            return;
        }

        this.usedPowerups.add('time-freeze');
        
        // Update UI
        const powerupBtn = Utils.getElementById('time-freeze');
        if (powerupBtn) {
            powerupBtn.classList.add('used');
            powerupBtn.style.animation = 'powerupActivate 0.6s ease-out';
        }

        // Add 15 seconds to timer
        this.timeRemaining += 15;
        
        // Visual effect
        const timerElement = Utils.getElementById('timer-display');
        if (timerElement) {
            timerElement.style.animation = 'timeFreeze 1s ease-in-out';
            setTimeout(() => {
                timerElement.style.animation = '';
            }, 1000);
        }

        this.audioManager.playEffect('lifeline');
        Utils.showToast('Time Freeze activated! +15 seconds added.', 'success');
    }

    /**
     * Skip question with penalty
     */
    skipQuestion() {
        if (this.gameState !== 'playing') return;

        // Reduce current prize by 50%
        const currentPrize = this.prizeLadder[this.currentLevel - 1];
        const penalty = Math.floor(currentPrize * 0.5);
        
        this.score = Math.max(0, this.score - penalty);
        
        // Load next question
        this.loadNewQuestion();
        
        this.audioManager.playEffect('wrong');
        Utils.showToast(`Question skipped! Penalty: ${Utils.formatCurrency(penalty)}`, 'warning');
    }

    /**
     * Toggle settings panel
     */
    toggleSettingsPanel() {
        const panel = Utils.getElementById('settings-panel');
        if (panel) {
            panel.classList.toggle('open');
        }
    }

    /**
     * Update master volume
     */
    updateMasterVolume(value) {
        this.gameSettings.masterVolume = value;
        this.audioManager.setMasterVolume(value);
        this.saveGameSettings();
    }

    /**
     * Update music volume
     */
    updateMusicVolume(value) {
        this.gameSettings.musicVolume = value;
        this.audioManager.setMusicVolume(value);
        this.saveGameSettings();
    }

    /**
     * Update effects volume
     */
    updateEffectsVolume(value) {
        this.gameSettings.effectsVolume = value;
        this.audioManager.setEffectsVolume(value);
        this.saveGameSettings();
    }

    /**
     * Save game settings
     */
    saveGameSettings() {
        Utils.Storage.set('kbcGameSettings', this.gameSettings);
    }

    /**
     * Load game settings
     */
    loadGameSettings() {
        const saved = Utils.Storage.get('kbcGameSettings', {});
        this.gameSettings = { ...this.gameSettings, ...saved };
        
        // Update UI elements if they exist
        setTimeout(() => {
            const masterVol = Utils.getElementById('master-volume');
            const musicVol = Utils.getElementById('music-volume');
            const effectsVol = Utils.getElementById('effects-volume');
            const timerSpeed = Utils.getElementById('timer-speed');
            const difficultyMode = Utils.getElementById('difficulty-mode');
            
            if (masterVol) masterVol.value = this.gameSettings.masterVolume * 100;
            if (musicVol) musicVol.value = this.gameSettings.musicVolume * 100;
            if (effectsVol) effectsVol.value = this.gameSettings.effectsVolume * 100;
            if (timerSpeed) timerSpeed.value = this.gameSettings.timerDuration;
            if (difficultyMode) difficultyMode.value = this.gameSettings.difficultyMode;
        }, 100);
    }

    /**
     * Update streak counter and UI
     */
    updateStreakAndScore() {
        // Update streak
        const streakElement = Utils.getElementById('current-streak');
        const highScoreElement = Utils.getElementById('high-score');
        
        if (streakElement) {
            streakElement.textContent = this.currentStreak;
            if (this.currentStreak > 0 && this.currentStreak % 5 === 0) {
                streakElement.parentElement.style.animation = 'streakCelebration 0.8s ease-out';
                setTimeout(() => {
                    streakElement.parentElement.style.animation = '';
                }, 800);
            }
        }
        
        if (highScoreElement) {
            highScoreElement.textContent = Utils.formatCurrency(this.highScore);
        }
    }

    /**
     * Reset all power-ups to unused state
     */
    resetPowerups() {
        this.usedPowerups.clear();
        this.isDoubleDipActive = false;
        this.isTimeFrozen = false;
        
        // Reset UI
        document.querySelectorAll('.powerup').forEach(powerup => {
            powerup.classList.remove('used');
            powerup.style.animation = '';
        });
        
        // Reset visual effects
        const questionContainer = Utils.getElementById('question-container');
        if (questionContainer) {
            questionContainer.style.animation = '';
        }
        
        const timerElement = Utils.getElementById('timer-display');
        if (timerElement) {
            timerElement.style.animation = '';
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global game instance
    window.kbcGame = new KBCGame();
    
    // Add click handler to enable audio context (Chrome autoplay policy)
    document.addEventListener('click', () => {
        if (window.kbcGame && window.kbcGame.audioManager) {
            window.kbcGame.audioManager.resumeAudioContext();
        }
    }, { once: true });
});

// Export for module usage
window.KBCGame = KBCGame;
