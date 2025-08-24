// Game State Management
class BottleSpinGame {
    constructor() {
        this.players = [];
        this.currentRotation = 0;
        this.isSpinning = false;
        this.gameMode = 'classic';
        this.selectedCategories = ['funny', 'friendship', 'general'];
        this.round = 1;
        this.selectedPlayer = null;
        this.customQuestions = JSON.parse(localStorage.getItem('customQuestions')) || { truth: [], dare: [] };
        this.settings = JSON.parse(localStorage.getItem('gameSettings')) || {
            sound: true,
            animations: true,
            confetti: true
        };
        
        this.initializeEventListeners();
        this.loadSavedSession();
    }

    initializeEventListeners() {
        // Setup Modal Events
        document.getElementById('addPlayer').addEventListener('click', () => this.addPlayerInput());
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        
        // Game Controls
        document.getElementById('spinBtn').addEventListener('click', () => this.spinBottle());
        document.getElementById('menuBtn').addEventListener('click', () => this.showSettings());
        
        // Question Modal Events
        document.getElementById('completeBtn').addEventListener('click', () => this.completeChallenge());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipChallenge());
        
        // Theme Toggle
        document.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Settings Events
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
        document.getElementById('clearData').addEventListener('click', () => this.clearAllData());
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.hideModal('settingsModal'));
        
        // Custom Questions Events
        document.getElementById('addCustomQuestion').addEventListener('click', () => this.addCustomQuestion());
        document.getElementById('closeCustomModal').addEventListener('click', () => this.hideModal('customQuestionsModal'));
        
        // Settings toggles
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.settings.sound = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('animationToggle').addEventListener('change', (e) => {
            this.settings.animations = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('confettiToggle').addEventListener('change', (e) => {
            this.settings.confetti = e.target.checked;
            this.saveSettings();
        });

        // Keyboard Events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Modal click outside to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (!this.isSpinning && document.getElementById('gameArea').style.display !== 'none') {
                    this.spinBottle();
                }
                break;
            case 'Enter':
                if (document.getElementById('questionModal').classList.contains('active')) {
                    this.completeChallenge();
                }
                break;
            case 'Escape':
                const activeModal = document.querySelector('.modal.active');
                if (activeModal && activeModal.id !== 'setupModal') {
                    activeModal.classList.remove('active');
                }
                break;
        }
    }

    addPlayerInput() {
        const playerInputs = document.getElementById('playerInputs');
        const playerCount = playerInputs.children.length;
        
        if (playerCount >= 12) {
            this.showNotification('Maximum 12 players allowed!', 'warning');
            return;
        }

        const playerInput = document.createElement('div');
        playerInput.className = 'player-input';
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        const defaultColor = colors[playerCount % colors.length];
        
        playerInput.innerHTML = `
            <input type="text" placeholder="Player ${playerCount + 1}" maxlength="20">
            <div class="color-picker">
                <input type="color" value="${defaultColor}">
            </div>
            <button class="remove-player" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        playerInputs.appendChild(playerInput);
    }

    startGame() {
        const playerInputs = document.querySelectorAll('.player-input input[type="text"]');
        const colorInputs = document.querySelectorAll('.player-input input[type="color"]');
        
        this.players = [];
        
        for (let i = 0; i < playerInputs.length; i++) {
            const name = playerInputs[i].value.trim() || `Player ${i + 1}`;
            const color = colorInputs[i].value;
            
            this.players.push({
                id: i,
                name: name,
                color: color,
                score: 0
            });
        }
        
        if (this.players.length < 2) {
            this.showNotification('At least 2 players required!', 'warning');
            return;
        }
        
        // Get selected game mode
        const selectedMode = document.querySelector('input[name="gameMode"]:checked').value;
        this.gameMode = selectedMode;
        
        // Get selected categories
        const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
            .map(cb => cb.value);
        this.selectedCategories = selectedCategories.length > 0 ? selectedCategories : ['general'];
        
        this.hideModal('setupModal');
        this.setupGameArea();
        this.saveSession();
        
        this.showNotification(`Game started with ${this.players.length} players!`, 'success');
    }

    setupGameArea() {
        document.getElementById('gameArea').style.display = 'block';
        
        // Update game mode display
        const gameModeNames = {
            'classic': 'Classic (Truth/Dare)',
            'truth': 'Truth Only',
            'dare': 'Dare Only',
            'double': 'Double Spin',
            'custom': 'Custom Questions'
        };
        
        document.getElementById('gameModeDisplay').textContent = gameModeNames[this.gameMode];
        
        this.renderPlayers();
        this.updateScoreboard();
    }

    renderPlayers() {
        const playersCircle = document.getElementById('playersCircle');
        playersCircle.innerHTML = '';
        
        const angleStep = (2 * Math.PI) / this.players.length;
        const radius = 180; // Distance from center
        
        this.players.forEach((player, index) => {
            const angle = angleStep * index - Math.PI / 2; // Start from top
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const playerElement = document.createElement('div');
            playerElement.className = 'player-position';
            playerElement.style.left = `calc(50% + ${x}px - 30px)`;
            playerElement.style.top = `calc(50% + ${y}px - 30px)`;
            playerElement.style.backgroundColor = player.color;
            playerElement.textContent = player.name;
            playerElement.setAttribute('aria-label', `Player: ${player.name}, Score: ${player.score}`);
            
            // Store angle for bottle pointing calculation
            playerElement.dataset.angle = angle;
            playerElement.dataset.playerId = player.id;
            
            playersCircle.appendChild(playerElement);
        });
    }

    updateScoreboard() {
        const scoresList = document.getElementById('scoresList');
        scoresList.innerHTML = '';
        
        // Sort players by score
        const sortedPlayers = [...this.players].sort((a, b) => b.score - a.score);
        
        sortedPlayers.forEach(player => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            
            if (this.selectedPlayer && this.selectedPlayer.id === player.id) {
                scoreItem.classList.add('selected');
            }
            
            scoreItem.innerHTML = `
                <span class="player-name" style="color: ${player.color}">
                    ${player.name}
                </span>
                <span class="player-score">${player.score}</span>
            `;
            
            scoresList.appendChild(scoreItem);
        });
    }

    async spinBottle() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        const spinBtn = document.getElementById('spinBtn');
        const bottle = document.getElementById('bottle');
        
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>SPINNING...</span>';
        
        // Play spin sound
        this.playSound('spinSound');
        
        // Calculate random spin (multiple full rotations + random angle)
        const minSpins = 3;
        const maxSpins = 8;
        const spins = Math.random() * (maxSpins - minSpins) + minSpins;
        const finalAngle = Math.random() * 360;
        const totalRotation = (spins * 360) + finalAngle;
        
        // Add physics-like easing
        bottle.style.transition = 'transform 4s cubic-bezier(0.15, 0.05, 0.25, 1)';
        this.currentRotation += totalRotation;
        bottle.style.transform = `rotate(${this.currentRotation}deg)`;
        
        // Wait for animation to complete
        await this.sleep(4000);
        
        // Play stop sound
        this.playSound('stopSound');
        
        // Determine selected player
        this.selectedPlayer = this.getSelectedPlayer(this.currentRotation);
        this.highlightSelectedPlayer();
        
        // Show question after a brief pause
        await this.sleep(1000);
        
        this.isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<i class="fas fa-play"></i><span>SPIN</span>';
        
        this.showQuestion();
        this.saveSession();
    }

    getSelectedPlayer(rotation) {
        // Normalize rotation to 0-360
        const normalizedRotation = ((rotation % 360) + 360) % 360;
        
        // Calculate which player the bottle points to
        const playerCount = this.players.length;
        const sectorSize = 360 / playerCount;
        
        // Adjust for bottle starting position (pointing up)
        const adjustedRotation = (normalizedRotation + 90) % 360;
        
        const selectedIndex = Math.floor(adjustedRotation / sectorSize);
        return this.players[selectedIndex];
    }

    highlightSelectedPlayer() {
        // Remove previous selection
        document.querySelectorAll('.player-position').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Highlight selected player
        const selectedElement = document.querySelector(`[data-player-id="${this.selectedPlayer.id}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
        
        this.updateScoreboard();
    }

    showQuestion() {
        const modal = document.getElementById('questionModal');
        const selectedPlayerEl = document.getElementById('selectedPlayer');
        const questionTypeEl = document.getElementById('questionType');
        const questionTextEl = document.getElementById('questionText');
        
        selectedPlayerEl.textContent = `${this.selectedPlayer.name}, it's your turn!`;
        
        let questionType, question;
        
        if (this.gameMode === 'custom') {
            const customQuestions = [...this.customQuestions.truth, ...this.customQuestions.dare];
            if (customQuestions.length === 0) {
                question = "No custom questions available! Add some in settings.";
                questionType = "Custom";
            } else {
                const randomQuestion = customQuestions[Math.floor(Math.random() * customQuestions.length)];
                question = randomQuestion.text;
                questionType = randomQuestion.type;
            }
        } else {
            const questionData = this.getRandomQuestion();
            question = questionData.text;
            questionType = questionData.type;
        }
        
        questionTypeEl.textContent = questionType.toUpperCase();
        questionTypeEl.className = `question-type ${questionType}`;
        questionTextEl.textContent = question;
        
        this.showModal('questionModal');
    }

    getRandomQuestion() {
        let availableQuestions = [];
        
        // Get questions based on game mode and selected categories
        if (this.gameMode === 'truth') {
            this.selectedCategories.forEach(category => {
                if (QUESTIONS[category] && QUESTIONS[category].truth) {
                    availableQuestions.push(...QUESTIONS[category].truth.map(q => ({ text: q, type: 'truth' })));
                }
            });
        } else if (this.gameMode === 'dare') {
            this.selectedCategories.forEach(category => {
                if (QUESTIONS[category] && QUESTIONS[category].dare) {
                    availableQuestions.push(...QUESTIONS[category].dare.map(q => ({ text: q, type: 'dare' })));
                }
            });
        } else { // classic mode
            const isTrue = Math.random() < 0.5;
            const type = isTrue ? 'truth' : 'dare';
            
            this.selectedCategories.forEach(category => {
                if (QUESTIONS[category] && QUESTIONS[category][type]) {
                    availableQuestions.push(...QUESTIONS[category][type].map(q => ({ text: q, type: type })));
                }
            });
        }
        
        if (availableQuestions.length === 0) {
            return {
                text: "No questions available for the selected categories!",
                type: "error"
            };
        }
        
        return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }

    completeChallenge() {
        this.selectedPlayer.score += 10;
        this.hideModal('questionModal');
        this.showNotification(`${this.selectedPlayer.name} completed the challenge! +10 points`, 'success');
        
        if (this.settings.confetti) {
            this.showConfetti();
        }
        
        this.playSound('successSound');
        this.nextRound();
    }

    skipChallenge() {
        this.selectedPlayer.score = Math.max(0, this.selectedPlayer.score - 5);
        this.hideModal('questionModal');
        this.showNotification(`${this.selectedPlayer.name} skipped the challenge! -5 points`, 'warning');
        this.nextRound();
    }

    nextRound() {
        this.round++;
        document.getElementById('roundCounter').textContent = `Round ${this.round}`;
        this.updateScoreboard();
        this.saveSession();
        
        // Remove player highlight after a delay
        setTimeout(() => {
            document.querySelectorAll('.player-position').forEach(el => {
                el.classList.remove('selected');
            });
        }, 2000);
    }

    showConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const particlesContainer = document.getElementById('particles');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            particlesContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Settings
    showSettings() {
        document.getElementById('settingsModal').classList.add('active');
        
        // Update settings checkboxes
        document.getElementById('soundToggle').checked = this.settings.sound;
        document.getElementById('animationToggle').checked = this.settings.animations;
        document.getElementById('confettiToggle').checked = this.settings.confetti;
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = document.querySelector('.theme-toggle i');
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    resetGame() {
        if (confirm('Start a new game? Current progress will be lost.')) {
            this.hideModal('settingsModal');
            document.getElementById('gameArea').style.display = 'none';
            document.getElementById('setupModal').classList.add('active');
            
            // Reset game state
            this.players = [];
            this.currentRotation = 0;
            this.round = 1;
            this.selectedPlayer = null;
            
            // Reset bottle rotation
            const bottle = document.getElementById('bottle');
            bottle.style.transition = 'none';
            bottle.style.transform = 'rotate(0deg)';
            
            localStorage.removeItem('gameSession');
        }
    }

    clearAllData() {
        if (confirm('Clear all saved data including custom questions? This cannot be undone.')) {
            localStorage.clear();
            this.customQuestions = { truth: [], dare: [] };
            this.settings = { sound: true, animations: true, confetti: true };
            this.showNotification('All data cleared!', 'success');
        }
    }

    // Custom Questions
    addCustomQuestion() {
        const type = document.getElementById('customQuestionType').value;
        const text = document.getElementById('customQuestionInput').value.trim();
        
        if (!text) {
            this.showNotification('Please enter a question!', 'warning');
            return;
        }
        
        this.customQuestions[type].push({ text, type });
        this.saveCustomQuestions();
        this.renderCustomQuestions();
        
        document.getElementById('customQuestionInput').value = '';
        this.showNotification('Custom question added!', 'success');
    }

    renderCustomQuestions() {
        const container = document.getElementById('customQuestionsList');
        container.innerHTML = '';
        
        ['truth', 'dare'].forEach(type => {
            this.customQuestions[type].forEach((question, index) => {
                const questionItem = document.createElement('div');
                questionItem.className = 'custom-question-item';
                questionItem.innerHTML = `
                    <span><strong>${type.toUpperCase()}:</strong> ${question.text}</span>
                    <button class="delete-custom-question" onclick="game.deleteCustomQuestion('${type}', ${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                container.appendChild(questionItem);
            });
        });
    }

    deleteCustomQuestion(type, index) {
        this.customQuestions[type].splice(index, 1);
        this.saveCustomQuestions();
        this.renderCustomQuestions();
        this.showNotification('Question deleted!', 'success');
    }

    // Audio
    playSound(soundId) {
        if (!this.settings.sound) return;
        
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Audio play failed (user hasn't interacted yet)
            });
        }
    }

    // Storage
    saveSession() {
        const session = {
            players: this.players,
            gameMode: this.gameMode,
            selectedCategories: this.selectedCategories,
            round: this.round,
            currentRotation: this.currentRotation
        };
        
        localStorage.setItem('gameSession', JSON.stringify(session));
    }

    loadSavedSession() {
        const saved = localStorage.getItem('gameSession');
        if (saved) {
            const session = JSON.parse(saved);
            
            if (session.players && session.players.length >= 2) {
                const shouldRestore = confirm('Restore previous game session?');
                if (shouldRestore) {
                    this.players = session.players;
                    this.gameMode = session.gameMode || 'classic';
                    this.selectedCategories = session.selectedCategories || ['general'];
                    this.round = session.round || 1;
                    this.currentRotation = session.currentRotation || 0;
                    
                    // Hide setup modal and show game
                    this.hideModal('setupModal');
                    this.setupGameArea();
                    
                    // Restore bottle rotation
                    const bottle = document.getElementById('bottle');
                    bottle.style.transition = 'none';
                    bottle.style.transform = `rotate(${this.currentRotation}deg)`;
                }
            }
        }
        
        // Load theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
            const icon = document.querySelector('.theme-toggle i');
            icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Load settings
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
    }

    saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    }

    saveCustomQuestions() {
        localStorage.setItem('customQuestions', JSON.stringify(this.customQuestions));
    }

    // Utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'danger'}-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new BottleSpinGame();
    
    // Initialize custom questions modal
    const settingsBtn = document.querySelector('.settings-btn');
    settingsBtn.addEventListener('click', () => {
        document.getElementById('customQuestionsModal').classList.add('active');
        game.renderCustomQuestions();
    });
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
