/**
 * Main Application Controller
 * Initializes and coordinates all components of the hacker simulation
 */

class HackerSimulator {
    constructor() {
        this.isInitialized = false;
        this.currentUser = 'root';
        this.currentDirectory = '/home/hacker';
        this.systemLevel = 1;
        this.unlockedSystems = ['local'];
        this.gameState = {
            completedChallenges: [],
            discoveredFiles: [],
            commandHistory: [],
            achievements: [],
            score: 0
        };
        
        // Initialize components
        this.storage = new StorageManager();
        this.audio = new AudioManager();
        this.effects = new EffectsManager();
        this.filesystem = new FileSystem();
        this.minigames = new MiniGames();
        this.terminal = null;
        
        this.bindEvents();
        this.loadGameState();
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.isInitialized) return;

        try {
            await this.showBootSequence();
            await this.initializeComponents();
            await this.terminal.init();
            this.startApplication();
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('System initialization failed. Please refresh the page.');
        }
    }

    /**
     * Show the boot sequence animation
     */
    async showBootSequence() {
        const bootScreen = document.getElementById('bootScreen');
        const bootLogo = document.getElementById('bootLogo');
        const bootProgress = document.getElementById('bootProgress');
        const bootText = document.getElementById('bootText');

        // ASCII art logo
        const logo = `
    ▄████▄▓██   ██▓ ▄▄▄▄   ▓█████  ██▀███  
   ▒██▀ ▀█ ▒██  ██▒▓█████▄ ▓█   ▀ ▓██ ▒ ██▒
   ▒▓█    ▄ ▒██ ██░▒██▒ ▄██▒███   ▓██ ░▄█ ▒
   ▒▓▓▄ ▄██▒░ ▐██▓░▒██░█▀  ▒▓█  ▄ ▒██▀▀█▄  
   ▒ ▓███▀ ░░ ██▒▓░░▓█  ▀█▓░▒████▒░██▓ ▒██▒
   ░ ░▒ ▒  ░ ██▒▒▒ ░▒▓███▀▒░░ ▒░ ░░ ▒▓ ░▒▓░
     ░  ▒  ▓██ ░▒░ ▒░▒   ░  ░ ░  ░  ░▒ ░ ▒░
   ░       ▒ ▒ ░░  ░    ░    ░     ░░   ░ 
   ░ ░     ░ ░     ░         ░  ░   ░     
   ░       ░ ░          ░                 
                                         
           HACKER SIMULATION v2.1.7       
        `;

        bootLogo.textContent = logo;

        const bootSteps = [
            'Initializing CyberHack OS...',
            'Loading neural networks...',
            'Establishing secure connections...',
            'Decrypting system files...',
            'Injecting hack protocols...',
            'Bypassing security measures...',
            'System ready. Welcome, hacker.'
        ];

        for (let i = 0; i < bootSteps.length; i++) {
            bootText.textContent = bootSteps[i];
            bootProgress.style.width = `${((i + 1) / bootSteps.length) * 100}%`;
            
            if (this.audio.soundEnabled) {
                this.audio.playSound('boot');
            }
            
            await this.delay(800);
        }

        await this.delay(1000);
        
        bootScreen.style.opacity = '0';
        await this.delay(500);
        bootScreen.classList.add('hidden');
        
        document.getElementById('mainInterface').classList.remove('hidden');
        this.effects.addScreenGlitch();
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        try {
            await this.filesystem.init();
            await this.minigames.init();
            
            this.terminal = new Terminal(
                this.filesystem,
                this.minigames,
                this.audio,
                this.effects,
                this
            );
            
            this.effects.init();
            this.audio.init();
            
        } catch (error) {
            throw new Error(`Component initialization failed: ${error.message}`);
        }
    }

    /**
     * Start the main application
     */
    startApplication() {
        this.terminal.addLine('system', 'CyberHack Terminal v2.1.7 initialized successfully.');
        this.terminal.addLine('system', 'Type "help" for available commands.');
        this.terminal.addLine('system', 'WARNING: Unauthorized access detected. Proceed with caution.');
        this.terminal.addLine('', '');
        
        // Show welcome message based on game state
        if (this.gameState.completedChallenges.length === 0) {
            this.showWelcomeSequence();
        } else {
            this.terminal.addLine('system', `Welcome back, hacker. Progress: ${this.gameState.completedChallenges.length} challenges completed.`);
        }

        this.effects.startMatrixRain();
        
        if (this.audio.soundEnabled) {
            this.audio.playBackgroundMusic();
        }
    }

    /**
     * Show welcome sequence for new users
     */
    async showWelcomeSequence() {
        const welcomeMessages = [
            'Scanning network topology...',
            'Identifying vulnerable systems...',
            'Establishing backdoor connections...',
            'Preparing infiltration tools...',
            '',
            'MISSION BRIEFING:',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            'You are tasked with infiltrating the NEXUS Corporation\'s',
            'classified database. Multiple security layers protect the',
            'target data. Use your hacking skills to bypass firewalls,',
            'crack passwords, and extract the secret files.',
            '',
            'Start by exploring the system with "ls" and "help" commands.',
            'Good luck, hacker.'
        ];

        for (const message of welcomeMessages) {
            await this.delay(1000);
            this.terminal.addLine(message ? 'system' : '', message);
            
            if (message && this.audio.soundEnabled) {
                this.audio.playSound('type');
            }
        }
    }

    /**
     * Bind global event listeners
     */
    bindEvents() {
        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => {
            this.audio.toggleSound();
            this.updateSoundIcon();
        });

        // Fullscreen toggle
        document.getElementById('fullscreenToggle').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Settings panel
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.hideSettings();
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'l':
                        e.preventDefault();
                        if (this.terminal) {
                            this.terminal.clear();
                        }
                        break;
                    case 'm':
                        e.preventDefault();
                        this.audio.toggleSound();
                        this.updateSoundIcon();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                }
            }
        });

        // Prevent right-click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.effects.handleResize();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.audio.pauseBackgroundMusic();
            } else {
                if (this.audio.soundEnabled) {
                    this.audio.playBackgroundMusic();
                }
            }
        });
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Update sound icon based on state
     */
    updateSoundIcon() {
        const icon = document.querySelector('#soundToggle i');
        icon.className = this.audio.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }

    /**
     * Show settings panel
     */
    showSettings() {
        const panel = document.getElementById('settingsPanel');
        panel.classList.remove('hidden');
        
        // Update settings values
        document.getElementById('soundEnabled').checked = this.audio.soundEnabled;
        document.getElementById('glitchEnabled').checked = this.effects.glitchEnabled;
        document.getElementById('typingSpeed').value = this.terminal ? this.terminal.typingSpeed : 50;
        
        // Bind settings events
        this.bindSettingsEvents();
    }

    /**
     * Hide settings panel
     */
    hideSettings() {
        document.getElementById('settingsPanel').classList.add('hidden');
    }

    /**
     * Bind settings panel events
     */
    bindSettingsEvents() {
        document.getElementById('soundEnabled').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.audio.enableSound();
            } else {
                this.audio.disableSound();
            }
            this.updateSoundIcon();
            this.saveGameState();
        });

        document.getElementById('glitchEnabled').addEventListener('change', (e) => {
            this.effects.glitchEnabled = e.target.checked;
            this.saveGameState();
        });

        document.getElementById('typingSpeed').addEventListener('input', (e) => {
            if (this.terminal) {
                this.terminal.typingSpeed = parseInt(e.target.value);
                this.saveGameState();
            }
        });

        document.getElementById('terminalTheme').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
            this.saveGameState();
        });

        document.getElementById('resetProgress').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                this.resetGameState();
                this.hideSettings();
                location.reload();
            }
        });
    }

    /**
     * Change terminal theme
     */
    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.effects.updateTheme(theme);
    }

    /**
     * Load game state from storage
     */
    loadGameState() {
        const savedState = this.storage.load('gameState');
        if (savedState) {
            this.gameState = { ...this.gameState, ...savedState };
        }

        const settings = this.storage.load('settings');
        if (settings) {
            if (settings.soundEnabled !== undefined) {
                if (settings.soundEnabled) {
                    this.audio.enableSound();
                } else {
                    this.audio.disableSound();
                }
            }
            
            if (settings.theme) {
                this.changeTheme(settings.theme);
            }
        }
    }

    /**
     * Save current game state
     */
    saveGameState() {
        this.storage.save('gameState', this.gameState);
        this.storage.save('settings', {
            soundEnabled: this.audio.soundEnabled,
            glitchEnabled: this.effects.glitchEnabled,
            typingSpeed: this.terminal ? this.terminal.typingSpeed : 50,
            theme: document.documentElement.getAttribute('data-theme') || 'cyberpunk'
        });
    }

    /**
     * Reset game state
     */
    resetGameState() {
        this.gameState = {
            completedChallenges: [],
            discoveredFiles: [],
            commandHistory: [],
            achievements: [],
            score: 0
        };
        this.storage.clear();
    }

    /**
     * Update game progress
     */
    updateProgress(type, data) {
        switch (type) {
            case 'challenge_completed':
                if (!this.gameState.completedChallenges.includes(data.id)) {
                    this.gameState.completedChallenges.push(data.id);
                    this.gameState.score += data.points || 100;
                    this.checkAchievements();
                }
                break;
                
            case 'file_discovered':
                if (!this.gameState.discoveredFiles.includes(data.path)) {
                    this.gameState.discoveredFiles.push(data.path);
                    this.gameState.score += 50;
                }
                break;
                
            case 'system_unlocked':
                if (!this.unlockedSystems.includes(data.system)) {
                    this.unlockedSystems.push(data.system);
                    this.systemLevel++;
                }
                break;
        }
        
        this.saveGameState();
    }

    /**
     * Check for achievements
     */
    checkAchievements() {
        const achievements = [
            {
                id: 'first_hack',
                name: 'First Steps',
                description: 'Complete your first challenge',
                condition: () => this.gameState.completedChallenges.length >= 1
            },
            {
                id: 'password_master',
                name: 'Password Master',
                description: 'Crack 5 passwords',
                condition: () => this.gameState.completedChallenges.filter(c => c.includes('password')).length >= 5
            },
            {
                id: 'firewall_breaker',
                name: 'Firewall Breaker',
                description: 'Bypass 3 firewalls',
                condition: () => this.gameState.completedChallenges.filter(c => c.includes('firewall')).length >= 3
            },
            {
                id: 'explorer',
                name: 'Digital Explorer',
                description: 'Discover 10 hidden files',
                condition: () => this.gameState.discoveredFiles.length >= 10
            }
        ];

        achievements.forEach(achievement => {
            if (!this.gameState.achievements.includes(achievement.id) && achievement.condition()) {
                this.gameState.achievements.push(achievement.id);
                this.showAchievement(achievement);
            }
        });
    }

    /**
     * Show achievement notification
     */
    showAchievement(achievement) {
        this.showAlert('success', 'Achievement Unlocked!', `${achievement.name}: ${achievement.description}`);
        
        if (this.audio.soundEnabled) {
            this.audio.playSound('achievement');
        }
        
        this.effects.showSuccessFlash();
    }

    /**
     * Show alert notification
     */
    showAlert(type, title, message, duration = 5000) {
        const container = document.getElementById('alertContainer');
        
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.innerHTML = `
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
            <button class="alert-close">&times;</button>
        `;
        
        container.appendChild(alert);
        
        // Auto remove
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    if (alert.parentNode) {
                        container.removeChild(alert);
                    }
                }, 300);
            }
        }, duration);
        
        // Manual close
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.style.opacity = '0';
            setTimeout(() => {
                if (alert.parentNode) {
                    container.removeChild(alert);
                }
            }, 300);
        });
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showAlert('error', 'System Error', message);
    }

    /**
     * Utility function for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new HackerSimulator();
    app.init().catch(error => {
        console.error('Application failed to start:', error);
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #ff0040; font-family: monospace; text-align: center;">
                <div>
                    <h1>SYSTEM FAILURE</h1>
                    <p>Unable to initialize CyberHack Terminal</p>
                    <p>Please refresh the page to try again</p>
                </div>
            </div>
        `;
    });
    
    // Global reference for debugging
    window.hackerSim = app;
});
