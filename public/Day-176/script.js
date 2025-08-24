// Game State Management
class TreasureHuntGame {
    constructor() {
        this.currentStage = 0;
        this.completedStages = [];
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.gameData = null;
        this.audioManager = new AudioManager();
        this.themeManager = new ThemeManager();
        this.startTime = null;
        this.score = 0;
        this.achievements = [];
        this.settings = {
            particlesEnabled: true,
            animationsEnabled: true,
            glitchEnabled: true,
            autoSave: true,
            difficulty: 'normal'
        };
        
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.loadGameState();
        this.setupEventListeners();
        this.updateUI();
        this.initializeParticles();
        this.startGameTimer();
        
        // Initialize cipher tools
        this.initializeCipherTools();
        
        // Initialize drag and drop
        this.initializeDragAndDrop();
        
        // Initialize fullscreen support
        this.initializeFullscreen();
        
        // Setup settings handlers
        this.setupSettingsHandlers();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showAchievement("Welcome!", "Your digital treasure hunt begins now!");
        }, 3000);
        
        console.log("🎮 Game initialized successfully!");
    }
    
    loadGameState() {
        const savedState = localStorage.getItem('treasureHuntProgress');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.currentStage = state.currentStage || 0;
            this.completedStages = state.completedStages || [];
            this.hintsUsed = state.hintsUsed || 0;
            
            console.log("📁 Game state loaded:", state);
        } else {
            console.log("🆕 Starting new game");
        }
    }
    
    saveGameState() {
        const state = {
            currentStage: this.currentStage,
            completedStages: this.completedStages,
            hintsUsed: this.hintsUsed,
            timestamp: Date.now()
        };
        
        localStorage.setItem('treasureHuntProgress', JSON.stringify(state));
        console.log("💾 Game state saved:", state);
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            document.getElementById('theme-modal').style.display = 'block';
        });
        
        // Sound toggle
        document.getElementById('sound-toggle').addEventListener('click', () => {
            this.audioManager.toggleSound();
            this.updateSoundButton();
        });
        
        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'block';
        });
        
        // Fullscreen toggle
        document.getElementById('fullscreen-toggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Hint button
        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                this.themeManager.setTheme(theme);
                document.getElementById('theme-modal').style.display = 'none';
            });
        });
        
        // Caesar cipher slider
        const caesarSlider = document.getElementById('caesar-shift');
        if (caesarSlider) {
            caesarSlider.addEventListener('input', (e) => {
                document.getElementById('shift-value').textContent = e.target.value;
                this.updateCaesarDecoding(parseInt(e.target.value));
            });
        }
        
        // Morse code controls
        const playMorseBtn = document.getElementById('play-morse');
        if (playMorseBtn) {
            playMorseBtn.addEventListener('click', () => {
                this.playMorseCode();
            });
        }
        
        const morseHelpBtn = document.getElementById('morse-help');
        if (morseHelpBtn) {
            morseHelpBtn.addEventListener('click', () => {
                this.toggleMorseChart();
            });
        }
        
        // Timeline item clicks
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', () => {
                const stage = parseInt(item.getAttribute('data-stage'));
                if (this.completedStages.includes(stage) || stage === this.currentStage) {
                    this.navigateToStage(stage);
                }
            });
        });
        
        // Answer input enter key
        document.querySelectorAll('.answer-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const stageNum = parseInt(input.id.split('-')[1]);
                    this.checkAnswer(stageNum);
                }
            });
        });
    }
    
    updateUI() {
        // Update timeline
        document.querySelectorAll('.timeline-item').forEach(item => {
            const stage = parseInt(item.getAttribute('data-stage'));
            const marker = item.querySelector('.timeline-marker');
            
            if (this.completedStages.includes(stage)) {
                marker.className = 'timeline-marker completed';
                marker.innerHTML = '<i class="fas fa-check"></i>';
            } else if (stage === this.currentStage) {
                marker.className = 'timeline-marker current';
                marker.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                marker.className = 'timeline-marker locked';
                marker.innerHTML = '<i class="fas fa-lock"></i>';
            }
        });
        
        // Update hint count
        document.getElementById('hint-count').textContent = this.maxHints - this.hintsUsed;
        
        // Show current puzzle
        this.showCurrentPuzzle();
        
        // Update sound button
        this.updateSoundButton();
    }
    
    updateSoundButton() {
        const soundBtn = document.getElementById('sound-toggle');
        const icon = soundBtn.querySelector('i');
        
        if (this.audioManager.soundEnabled) {
            icon.className = 'fas fa-volume-up';
            soundBtn.style.opacity = '1';
        } else {
            icon.className = 'fas fa-volume-mute';
            soundBtn.style.opacity = '0.6';
        }
    }
    
    showCurrentPuzzle() {
        // Hide all puzzles
        document.querySelectorAll('.puzzle').forEach(puzzle => {
            puzzle.classList.remove('active');
        });
        
        // Show current puzzle
        const currentPuzzle = document.getElementById(`puzzle-${this.currentStage}`);
        if (currentPuzzle) {
            currentPuzzle.classList.add('active');
        }
        
        // Show victory screen if all stages completed
        if (this.currentStage > 4) {
            document.getElementById('victory').classList.add('active');
        }
    }
    
    navigateToStage(stage) {
        if (stage <= this.currentStage || this.completedStages.includes(stage)) {
            this.currentStage = stage;
            this.showCurrentPuzzle();
            this.audioManager.playSound('navigate');
        }
    }
    
    initializeCipherTools() {
        // Initialize Caesar cipher
        const originalText = "WUHDVXUH LV KLGGHQ LQ WKH GDUNQHVV";
        this.caesarOriginal = originalText;
        this.updateCaesarDecoding(1);
    }
    
    updateCaesarDecoding(shift) {
        const decoded = this.decodeCaesar(this.caesarOriginal, shift);
        const decodedElement = document.getElementById('decoded-text');
        if (decodedElement) {
            decodedElement.textContent = decoded;
        }
    }
    
    decodeCaesar(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[A-Z]/)) {
                return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            }
            return char;
        }).join('');
    }
    
    playMorseCode() {
        const morseMessage = "... --- ... / .... .. -.. -.. . -. / -.- . -.--"; // "SOS HIDDEN KEY"
        const morseDisplay = document.getElementById('morse-display');
        
        if (morseDisplay) {
            morseDisplay.textContent = '';
            this.audioManager.playMorseSequence(morseMessage, (symbol) => {
                morseDisplay.textContent += symbol;
            });
        }
    }
    
    toggleMorseChart() {
        const chart = document.getElementById('morse-chart');
        if (chart) {
            chart.classList.toggle('hidden');
        }
    }
    
    initializeDragAndDrop() {
        const pieces = document.querySelectorAll('.puzzle-piece');
        const slots = document.querySelectorAll('.drop-slot');
        
        pieces.forEach(piece => {
            piece.addEventListener('dragstart', this.handleDragStart.bind(this));
            piece.addEventListener('dragend', this.handleDragEnd.bind(this));
            
            // Touch events for mobile
            piece.addEventListener('touchstart', this.handleTouchStart.bind(this));
            piece.addEventListener('touchmove', this.handleTouchMove.bind(this));
            piece.addEventListener('touchend', this.handleTouchEnd.bind(this));
        });
        
        slots.forEach(slot => {
            slot.addEventListener('dragover', this.handleDragOver.bind(this));
            slot.addEventListener('drop', this.handleDrop.bind(this));
            slot.addEventListener('dragenter', this.handleDragEnter.bind(this));
            slot.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }
    
    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-piece'));
        e.target.classList.add('dragging');
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    handleDragOver(e) {
        e.preventDefault();
    }
    
    handleDragEnter(e) {
        e.target.classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        const pieceData = e.dataTransfer.getData('text/plain');
        const piece = document.querySelector(`[data-piece="${pieceData}"]`);
        
        if (piece && !e.target.querySelector('.puzzle-piece')) {
            // Remove piece from original location if it was in a slot
            const originalSlot = piece.closest('.drop-slot');
            if (originalSlot) {
                originalSlot.removeChild(piece);
            }
            
            e.target.appendChild(piece);
            this.audioManager.playSound('place');
        }
    }
    
    // Touch events for mobile drag and drop
    handleTouchStart(e) {
        this.touchItem = e.target;
        this.touchOffset = {
            x: e.touches[0].clientX - e.target.getBoundingClientRect().left,
            y: e.touches[0].clientY - e.target.getBoundingClientRect().top
        };
        e.target.style.position = 'fixed';
        e.target.style.zIndex = '1000';
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (this.touchItem) {
            this.touchItem.style.left = (e.touches[0].clientX - this.touchOffset.x) + 'px';
            this.touchItem.style.top = (e.touches[0].clientY - this.touchOffset.y) + 'px';
        }
    }
    
    handleTouchEnd(e) {
        if (this.touchItem) {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            const slot = dropTarget?.closest('.drop-slot');
            
            if (slot && !slot.querySelector('.puzzle-piece')) {
                slot.appendChild(this.touchItem);
                this.audioManager.playSound('place');
            }
            
            // Reset styles
            this.touchItem.style.position = '';
            this.touchItem.style.zIndex = '';
            this.touchItem.style.left = '';
            this.touchItem.style.top = '';
            this.touchItem = null;
        }
    }
    
    checkAnswer(stage) {
        const input = document.getElementById(`answer-${stage}`);
        const answer = input.value.trim().toLowerCase();
        
        let correctAnswer = '';
        let isCorrect = false;
        
        switch (stage) {
            case 1:
                correctAnswer = 'treasure is hidden in the darkness';
                isCorrect = answer === correctAnswer;
                break;
                
            case 2:
                correctAnswer = 'sos hidden key';
                isCorrect = answer === correctAnswer || answer === 'soshiddenkey';
                break;
                
            case 3:
                // Check if puzzle pieces are arranged correctly
                const slots = document.querySelectorAll('.drop-slot');
                const correctOrder = ['the', 'key', 'is', 'hidden', 'beneath', 'stars'];
                let arrangement = [];
                
                slots.forEach(slot => {
                    const piece = slot.querySelector('.puzzle-piece');
                    if (piece) {
                        arrangement.push(piece.textContent.toLowerCase());
                    } else {
                        arrangement.push('');
                    }
                });
                
                isCorrect = arrangement.join(' ') === correctOrder.join(' ');
                correctAnswer = 'the key is hidden beneath stars';
                break;
                
            case 4:
                correctAnswer = 'knowledge';
                isCorrect = answer === correctAnswer;
                break;
        }
        
        this.showFeedback(isCorrect, stage);
        
        if (isCorrect) {
            this.completeStage(stage);
        }
    }
    
    showFeedback(isCorrect, stage) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = `feedback ${isCorrect ? 'success' : 'error'}`;
        
        if (isCorrect) {
            feedback.textContent = '🎉 Correct! Well done, treasure hunter!';
            this.audioManager.playSound('success');
        } else {
            feedback.textContent = '❌ Not quite right. Keep trying!';
            this.audioManager.playSound('error');
        }
        
        const puzzleContent = document.querySelector(`#puzzle-${stage} .puzzle-content`);
        if (puzzleContent) {
            puzzleContent.appendChild(feedback);
            
            // Remove feedback after 3 seconds
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.remove();
                }
            }, 3000);
        }
    }
    
    completeStage(stage) {
        if (!this.completedStages.includes(stage)) {
            this.completedStages.push(stage);
        }
        
        this.currentStage = stage + 1;
        this.saveGameState();
        
        // Add delay before moving to next stage
        setTimeout(() => {
            this.updateUI();
            this.audioManager.playSound('advance');
        }, 1000);
        
        console.log(`✅ Stage ${stage} completed!`);
    }
    
    showHint() {
        if (this.hintsUsed >= this.maxHints) {
            alert('No more hints available!');
            return;
        }
        
        const hints = {
            0: "Click the 'Begin Your Quest' button to start your adventure!",
            1: "The Caesar cipher shifts each letter. Try shift value 3 and decode the message.",
            2: "Listen carefully to the Morse code. SOS means ... --- ... and you're looking for a hidden key.",
            3: "The pieces should form a sentence: 'THE KEY IS HIDDEN BENEATH STARS'",
            4: "Think about what grows but isn't alive, can be counted but isn't a number, and relates to learning and digital treasures."
        };
        
        const hint = hints[this.currentStage] || "No hint available for this stage.";
        
        document.getElementById('hint-content').innerHTML = `
            <p><strong>Hint ${this.hintsUsed + 1}:</strong></p>
            <p>${hint}</p>
        `;
        
        document.getElementById('hint-modal').style.display = 'block';
        
        this.hintsUsed++;
        this.saveGameState();
        this.updateUI();
        
        this.audioManager.playSound('hint');
    }
    
    resetGame() {
        localStorage.removeItem('treasureHuntProgress');
        this.currentStage = 0;
        this.completedStages = [];
        this.hintsUsed = 0;
        
        // Reset all inputs
        document.querySelectorAll('.answer-input').forEach(input => {
            input.value = '';
        });
        
        // Reset drag and drop
        const pieces = document.querySelectorAll('.puzzle-piece');
        const originalContainer = document.getElementById('puzzle-pieces');
        pieces.forEach(piece => {
            if (piece.parentNode !== originalContainer) {
                originalContainer.appendChild(piece);
            }
        });
        
        // Reset cipher slider
        const slider = document.getElementById('caesar-shift');
        if (slider) {
            slider.value = 1;
            this.updateCaesarDecoding(1);
        }
        
        this.updateUI();
        this.audioManager.playSound('reset');
        
        console.log("🔄 Game reset!");
    }

    // Advanced UI Functions
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    startGameTimer() {
        if (!this.startTime) {
            this.startTime = Date.now();
        }
        
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timeElement = document.getElementById('elapsed-time');
        if (timeElement) {
            timeElement.textContent = timeStr;
        }
    }

    updateScore(points) {
        this.score += points;
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    updateLevel() {
        const levelElement = document.getElementById('current-level');
        if (levelElement) {
            levelElement.textContent = this.currentStage + 1;
        }
    }

    showAchievement(title, description) {
        const popup = document.getElementById('achievement-notification');
        const titleElement = popup.querySelector('.achievement-title');
        const descElement = popup.querySelector('.achievement-description');
        
        titleElement.textContent = title;
        descElement.textContent = description;
        
        popup.classList.add('show');
        this.audioManager.playSound('success');
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 4000);
    }

    initializeFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreen-toggle');
        if (!fullscreenBtn) return;
        
        const icon = fullscreenBtn.querySelector('i');
        
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                icon.className = 'fas fa-compress';
            } else {
                icon.className = 'fas fa-expand';
            }
        });
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    setupSettingsHandlers() {
        // Volume controls
        const masterVol = document.getElementById('master-volume');
        const sfxVol = document.getElementById('sfx-volume');
        const musicVol = document.getElementById('music-volume');
        
        if (masterVol) masterVol.addEventListener('input', (e) => {
            this.audioManager.setMasterVolume(e.target.value / 100);
            masterVol.nextElementSibling.textContent = e.target.value + '%';
        });
        
        if (sfxVol) sfxVol.addEventListener('input', (e) => {
            this.audioManager.setSoundVolume(e.target.value / 100);
            sfxVol.nextElementSibling.textContent = e.target.value + '%';
        });
        
        if (musicVol) musicVol.addEventListener('input', (e) => {
            this.audioManager.setMusicVolume(e.target.value / 100);
            musicVol.nextElementSibling.textContent = e.target.value + '%';
        });
        
        // Visual settings
        const particlesToggle = document.getElementById('particles-toggle');
        if (particlesToggle) particlesToggle.addEventListener('change', (e) => {
            this.settings.particlesEnabled = e.target.checked;
            if (this.particleSystem) {
                if (e.target.checked) {
                    this.particleSystem.resume();
                } else {
                    this.particleSystem.pause();
                }
            }
        });
        
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) animationsToggle.addEventListener('change', (e) => {
            this.settings.animationsEnabled = e.target.checked;
            document.body.style.setProperty('--animation-duration', e.target.checked ? '0.3s' : '0s');
        });
        
        const glitchToggle = document.getElementById('glitch-toggle');
        if (glitchToggle) glitchToggle.addEventListener('change', (e) => {
            this.settings.glitchEnabled = e.target.checked;
            const glitchElements = document.querySelectorAll('.glitch');
            glitchElements.forEach(el => {
                if (e.target.checked) {
                    el.style.animation = '';
                } else {
                    el.style.animation = 'none';
                }
            });
        });
        
        // Settings actions
        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (confirm('Reset all settings to default?')) {
                this.resetSettings();
            }
        });
        
        const exportBtn = document.getElementById('export-save');
        if (exportBtn) exportBtn.addEventListener('click', () => {
            this.exportSaveData();
        });
        
        const importBtn = document.getElementById('import-save');
        if (importBtn) importBtn.addEventListener('click', () => {
            this.importSaveData();
        });
    }

    resetSettings() {
        this.settings = {
            particlesEnabled: true,
            animationsEnabled: true,
            glitchEnabled: true,
            autoSave: true,
            difficulty: 'normal'
        };
        
        // Reset UI
        const elements = {
            'master-volume': 70,
            'sfx-volume': 50,
            'music-volume': 30,
            'particles-toggle': true,
            'animations-toggle': true,
            'glitch-toggle': true,
            'auto-save': true,
            'difficulty-level': 'normal'
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = elements[id];
                } else {
                    element.value = elements[id];
                }
            }
        });
        
        this.showAchievement("Settings Reset", "All settings restored to default values");
    }

    exportSaveData() {
        const saveData = {
            currentStage: this.currentStage,
            completedStages: this.completedStages,
            hintsUsed: this.hintsUsed,
            score: this.score,
            achievements: this.achievements,
            settings: this.settings,
            startTime: this.startTime,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cipher_chronicles_save_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showAchievement("Save Exported", "Your progress has been saved to file");
    }

    importSaveData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const saveData = JSON.parse(e.target.result);
                        this.loadSaveData(saveData);
                        this.showAchievement("Save Imported", "Your progress has been restored");
                    } catch (error) {
                        alert('Invalid save file format');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    loadSaveData(saveData) {
        this.currentStage = saveData.currentStage || 0;
        this.completedStages = saveData.completedStages || [];
        this.hintsUsed = saveData.hintsUsed || 0;
        this.score = saveData.score || 0;
        this.achievements = saveData.achievements || [];
        this.settings = saveData.settings || this.settings;
        this.startTime = saveData.startTime || null;
        
        this.updateUI();
        this.saveGameState();
    }
    
    initializeParticles() {
        // Initialize particle system
        if (typeof ParticleSystem !== 'undefined') {
            this.particleSystem = new ParticleSystem('particles-canvas');
        }
    }
}

// Global functions for HTML onclick events
function startHunt() {
    game.currentStage = 1;
    game.saveGameState();
    game.updateUI();
    game.audioManager.playSound('start');
}

function checkAnswer(stage) {
    game.checkAnswer(stage);
}

function resetGame() {
    game.resetGame();
}

function revealFinalClue() {
    const imageElement = document.querySelector('.image-puzzle .overlay-text');
    if (imageElement) {
        imageElement.textContent = 'The answer lies in the realm of learning and growth...';
        game.audioManager.playSound('reveal');
    }
}

// Initialize the game when DOM is loaded
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new TreasureHuntGame();
});

// Handle page visibility change to pause/resume particles
document.addEventListener('visibilitychange', () => {
    if (game && game.particleSystem) {
        if (document.hidden) {
            game.particleSystem.pause();
        } else {
            game.particleSystem.resume();
        }
    }
});
