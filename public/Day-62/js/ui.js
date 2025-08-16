class UIManager {
    constructor() {
        this.elements = {
            score: document.getElementById('scoreValue'),
            lives: document.getElementById('livesValue'),
            timer: document.getElementById('timerValue'),
            startScreen: document.getElementById('startScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            levelCompleteScreen: document.getElementById('levelCompleteScreen'),
            hud: document.getElementById('hud'),
            finalScore: document.getElementById('finalScore'),
            levelScore: document.getElementById('levelScore')
        };
        
        // Mobile detection
        this.isMobile = this.detectMobile();
        this.setupMobileUI();
        
        console.log('UI Manager initialized');
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    setupMobileUI() {
        if (this.isMobile) {
            // Show mobile controls
            const mobileControls = document.getElementById('mobileControls');
            if (mobileControls) {
                mobileControls.style.display = 'block';
            }
            
            // Adjust HUD for mobile
            if (this.elements.hud) {
                this.elements.hud.style.fontSize = '14px';
            }
            
            // Add mobile-specific classes
            document.body.classList.add('mobile-device');
        }
    }
    
    updateScore(score) {
        if (this.elements.score) {
            this.elements.score.textContent = score.toLocaleString();
            
            // Add animation effect
            this.elements.score.classList.add('score-update');
            setTimeout(() => {
                this.elements.score.classList.remove('score-update');
            }, 300);
        }
    }
    
    updateLives(lives) {
        if (this.elements.lives) {
            this.elements.lives.textContent = lives;
            
            // Visual feedback for life loss
            if (lives <= 1) {
                this.elements.lives.style.color = '#FF4444';
                this.elements.lives.classList.add('low-lives');
            } else {
                this.elements.lives.style.color = 'white';
                this.elements.lives.classList.remove('low-lives');
            }
            
            // Pulse animation
            this.elements.lives.classList.add('lives-update');
            setTimeout(() => {
                this.elements.lives.classList.remove('lives-update');
            }, 500);
        }
    }
    
    updateTimer(time) {
        if (this.elements.timer) {
            this.elements.timer.textContent = Math.max(0, Math.floor(time));
            
            // Warning color when time is low
            if (time <= 30) {
                this.elements.timer.style.color = '#FF4444';
                this.elements.timer.classList.add('timer-warning');
            } else if (time <= 60) {
                this.elements.timer.style.color = '#FFAA44';
                this.elements.timer.classList.remove('timer-warning');
            } else {
                this.elements.timer.style.color = 'white';
                this.elements.timer.classList.remove('timer-warning');
            }
            
            // Pulse when very low
            if (time <= 10) {
                this.elements.timer.classList.add('timer-critical');
            } else {
                this.elements.timer.classList.remove('timer-critical');
            }
        }
    }
    
    showScreen(screenName) {
        // Hide all screens first
        Object.values(this.elements).forEach(element => {
            if (element && element.classList && element.classList.contains('screen')) {
                element.classList.add('hidden');
            }
        });
        
        // Show requested screen
        const screen = this.elements[screenName + 'Screen'];
        if (screen) {
            screen.classList.remove('hidden');
            
            // Add entrance animation
            screen.style.opacity = '0';
            screen.style.transform = 'scale(0.9)';
            
            requestAnimationFrame(() => {
                screen.style.transition = 'all 0.3s ease-out';
                screen.style.opacity = '1';
                screen.style.transform = 'scale(1)';
            });
        }
    }
    
    hideScreen(screenName) {
        const screen = this.elements[screenName + 'Screen'];
        if (screen) {
            screen.style.transition = 'all 0.2s ease-in';
            screen.style.opacity = '0';
            screen.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                screen.classList.add('hidden');
                screen.style.transition = '';
                screen.style.opacity = '';
                screen.style.transform = '';
            }, 200);
        }
    }
    
    showHUD() {
        if (this.elements.hud) {
            this.elements.hud.style.display = 'flex';
            this.elements.hud.style.opacity = '0';
            
            requestAnimationFrame(() => {
                this.elements.hud.style.transition = 'opacity 0.3s ease-out';
                this.elements.hud.style.opacity = '1';
            });
        }
    }
    
    hideHUD() {
        if (this.elements.hud) {
            this.elements.hud.style.transition = 'opacity 0.2s ease-in';
            this.elements.hud.style.opacity = '0';
            
            setTimeout(() => {
                this.elements.hud.style.display = 'none';
                this.elements.hud.style.transition = '';
                this.elements.hud.style.opacity = '';
            }, 200);
        }
    }
    
    displayGameOver(finalScore) {
        if (this.elements.finalScore) {
            this.elements.finalScore.textContent = finalScore.toLocaleString();
        }
        
        this.hideHUD();
        this.showScreen('gameOver');
        
        // Add some dramatic effect
        this.addScreenShake();
    }
    
    displayLevelComplete(score, level) {
        if (this.elements.levelScore) {
            this.elements.levelScore.textContent = score.toLocaleString();
        }
        
        this.showScreen('levelComplete');
        
        // Celebration effect
        this.addCelebrationEffect();
    }
    
    addScreenShake() {
        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                gameContainer.style.animation = '';
            }, 500);
        }
    }
    
    addCelebrationEffect() {
        // Simple celebration effect
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = '🎉';
        celebration.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4em;
            animation: celebrate 2s ease-out forwards;
            pointer-events: none;
            z-index: 100;
        `;
        
        document.getElementById('gameContainer').appendChild(celebration);
        
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 2000);
    }
    
    showToast(message, duration = 2000, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });
        
        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    
    showPowerUpEffect(x, y, type) {
        const effect = document.createElement('div');
        effect.className = 'powerup-effect';
        effect.textContent = type === 'coin' ? '+200' : type === 'powerup' ? '+1UP' : '+100';
        
        // Position relative to game canvas
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        const gameContainer = document.getElementById('gameContainer');
        
        effect.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: ${type === 'coin' ? '#FFD700' : '#00FF00'};
            font-size: 16px;
            font-weight: bold;
            text-shadow: 2px 2px 0px #000;
            pointer-events: none;
            z-index: 50;
            animation: floatUp 1s ease-out forwards;
        `;
        
        gameContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }
    
    createLoadingScreen() {
        const loading = document.createElement('div');
        loading.id = 'loadingScreen';
        loading.className = 'screen';
        loading.innerHTML = `
            <h1>Loading...</h1>
            <div class="loading-spinner"></div>
            <p>Preparing your adventure!</p>
        `;
        
        loading.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        `;
        
        document.getElementById('gameContainer').appendChild(loading);
        return loading;
    }
    
    removeLoadingScreen() {
        const loading = document.getElementById('loadingScreen');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
            }, 300);
        }
    }
    
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes celebrate {
                0% { 
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 1;
                }
                100% { 
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes floatUp {
                0% {
                    transform: translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-50px);
                    opacity: 0;
                }
            }
            
            .score-update {
                animation: pulse 0.3s ease-out;
                color: #FFD700 !important;
            }
            
            .lives-update {
                animation: pulse 0.5s ease-out;
            }
            
            .timer-warning {
                animation: pulse 1s infinite;
            }
            
            .timer-critical {
                animation: pulse 0.5s infinite;
                color: #FF0000 !important;
            }
            
            .low-lives {
                animation: pulse 0.8s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .loading-spinner {
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 20px auto;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize dynamic styles when script loads
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIManager();
    ui.addDynamicStyles();
});
