// Audio management system for KBC game

/**
 * Audio Manager class for handling all game sounds
 */
class AudioManager {
    constructor() {
        this.audioElements = {};
        this.isEnabled = true;
        this.volume = 0.7;
        this.backgroundMusicVolume = 0.3;
        this.effectsVolume = 0.8;
        
        this.initializeAudio();
        this.createSoundEffects();
    }

    /**
     * Initialize audio elements from HTML
     */
    initializeAudio() {
        // Get audio elements from HTML
        this.audioElements = {
            backgroundMusic: document.getElementById('background-music'),
            correctSound: document.getElementById('correct-sound'),
            wrongSound: document.getElementById('wrong-sound'),
            lifelineSound: document.getElementById('lifeline-sound'),
            timerSound: document.getElementById('timer-sound')
        };

        // Set initial volumes
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.volume = this.backgroundMusicVolume;
        }
        
        // Set volumes for other audio elements
        Object.keys(this.audioElements).forEach(key => {
            if (key !== 'backgroundMusic' && this.audioElements[key]) {
                this.audioElements[key].volume = this.effectsVolume;
            }
        });

        // Add error handling for audio loading
        Object.keys(this.audioElements).forEach(key => {
            const audio = this.audioElements[key];
            if (audio) {
                audio.addEventListener('error', (e) => {
                    console.warn(`Failed to load audio: ${key}`, e);
                });
                
                audio.addEventListener('canplaythrough', () => {
                    console.log(`Audio loaded successfully: ${key}`);
                });
            }
        });
    }

    /**
     * Create synthetic sound effects using Web Audio API
     */
    createSoundEffects() {
        try {
            // Create AudioContext for synthetic sounds
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.synthSounds = {};
            
            // Create synthetic sound generators
            this.createSynthSounds();
        } catch (error) {
            console.warn('Web Audio API not supported, using fallback sounds');
            this.audioContext = null;
        }
    }

    /**
     * Create synthetic sound effects
     */
    createSynthSounds() {
        if (!this.audioContext) return;

        // Button hover sound
        this.synthSounds.buttonHover = () => this.playTone(800, 0.1, 'sine', 0.2);
        
        // Button click sound
        this.synthSounds.buttonClick = () => this.playTone(600, 0.1, 'square', 0.3);
        
        // Timer tick sound
        this.synthSounds.timerTick = () => this.playTone(1000, 0.05, 'sine', 0.1);
        
        // Timer warning sound
        this.synthSounds.timerWarning = () => {
            this.playTone(1500, 0.1, 'triangle', 0.4);
            setTimeout(() => this.playTone(1200, 0.1, 'triangle', 0.4), 100);
        };
        
        // Success chime
        this.synthSounds.successChime = () => {
            this.playTone(523, 0.2, 'sine', 0.3); // C5
            setTimeout(() => this.playTone(659, 0.2, 'sine', 0.3), 100); // E5
            setTimeout(() => this.playTone(784, 0.3, 'sine', 0.3), 200); // G5
        };
        
        // Error buzz
        this.synthSounds.errorBuzz = () => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => this.playTone(150, 0.1, 'sawtooth', 0.5), i * 100);
            }
        };
        
        // Dramatic reveal
        this.synthSounds.dramaticReveal = () => {
            const frequencies = [220, 277, 330, 440, 554, 659, 880];
            frequencies.forEach((freq, index) => {
                setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), index * 50);
            });
        };
    }

    /**
     * Play a synthetic tone
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} waveType - Wave type (sine, square, triangle, sawtooth)
     * @param {number} volume - Volume (0-1)
     */
    playTone(frequency, duration, waveType = 'sine', volume = 0.3) {
        if (!this.audioContext || !this.isEnabled) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Error playing synthetic tone:', error);
        }
    }

    /**
     * Resume audio context (required for Chrome autoplay policy)
     */
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('Audio context resumed');
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }

    /**
     * Play background music
     */
    playBackgroundMusic() {
        if (!this.isEnabled || !this.audioElements.backgroundMusic) return;
        
        this.resumeAudioContext();
        
        const music = this.audioElements.backgroundMusic;
        music.volume = this.backgroundMusicVolume;
        
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Background music autoplay prevented:', error);
                // Show a user message about enabling audio
                this.showAudioEnableMessage();
            });
        }
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.pause();
            this.audioElements.backgroundMusic.currentTime = 0;
        }
    }

    /**
     * Pause background music
     */
    pauseBackgroundMusic() {
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.pause();
        }
    }

    /**
     * Resume background music
     */
    resumeBackgroundMusic() {
        if (this.isEnabled && this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.play().catch(error => {
                console.warn('Failed to resume background music:', error);
            });
        }
    }

    /**
     * Play correct answer sound
     */
    playCorrectSound() {
        this.playAudio('correctSound');
        if (this.synthSounds.successChime) {
            setTimeout(() => this.synthSounds.successChime(), 200);
        }
    }

    /**
     * Play wrong answer sound
     */
    playWrongSound() {
        this.playAudio('wrongSound');
        if (this.synthSounds.errorBuzz) {
            setTimeout(() => this.synthSounds.errorBuzz(), 100);
        }
    }

    /**
     * Play lifeline sound
     */
    playLifelineSound() {
        this.playAudio('lifelineSound');
        if (this.synthSounds.dramaticReveal) {
            this.synthSounds.dramaticReveal();
        }
    }

    /**
     * Play timer sound
     */
    playTimerSound() {
        this.playAudio('timerSound');
    }

    /**
     * Play timer tick (synthetic)
     */
    playTimerTick() {
        if (this.synthSounds.timerTick) {
            this.synthSounds.timerTick();
        }
    }

    /**
     * Play timer warning (synthetic)
     */
    playTimerWarning() {
        if (this.synthSounds.timerWarning) {
            this.synthSounds.timerWarning();
        }
    }

    /**
     * Play button hover sound
     */
    playButtonHover() {
        if (this.synthSounds.buttonHover) {
            this.synthSounds.buttonHover();
        }
    }

    /**
     * Play button click sound
     */
    playButtonClick() {
        if (this.synthSounds.buttonClick) {
            this.synthSounds.buttonClick();
        }
    }

    /**
     * Generic method to play audio
     * @param {string} audioKey - Key of audio element
     */
    playAudio(audioKey) {
        if (!this.isEnabled || !this.audioElements[audioKey]) return;
        
        this.resumeAudioContext();
        
        const audio = this.audioElements[audioKey];
        audio.currentTime = 0; // Reset to beginning
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn(`Failed to play ${audioKey}:`, error);
            });
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }

    /**
     * Set background music volume
     * @param {number} volume - Volume level (0-1)
     */
    setBackgroundMusicVolume(volume) {
        this.backgroundMusicVolume = Math.max(0, Math.min(1, volume));
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.volume = this.backgroundMusicVolume * this.volume;
        }
    }

    /**
     * Set sound effects volume
     * @param {number} volume - Volume level (0-1)
     */
    setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
        this.updateEffectsVolume();
    }

    /**
     * Update all audio volumes
     */
    updateAllVolumes() {
        if (this.audioElements.backgroundMusic) {
            this.audioElements.backgroundMusic.volume = this.backgroundMusicVolume * this.volume;
        }
        this.updateEffectsVolume();
    }

    /**
     * Update sound effects volumes
     */
    updateEffectsVolume() {
        Object.keys(this.audioElements).forEach(key => {
            if (key !== 'backgroundMusic' && this.audioElements[key]) {
                this.audioElements[key].volume = this.effectsVolume * this.volume;
            }
        });
    }

    /**
     * Enable/disable audio
     * @param {boolean} enabled - Whether audio should be enabled
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        
        if (!enabled) {
            this.stopBackgroundMusic();
            this.stopAllSounds();
        } else {
            this.playBackgroundMusic();
        }
        
        // Save preference
        Utils.Storage.set('audioEnabled', enabled);
    }

    /**
     * Toggle audio on/off
     */
    toggle() {
        this.setEnabled(!this.isEnabled);
    }

    /**
     * Stop all playing sounds
     */
    stopAllSounds() {
        Object.keys(this.audioElements).forEach(key => {
            const audio = this.audioElements[key];
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }

    /**
     * Show message to enable audio
     */
    showAudioEnableMessage() {
        const message = document.createElement('div');
        message.className = 'audio-enable-message';
        message.innerHTML = `
            <div class="audio-message-content">
                <i class="fas fa-volume-up"></i>
                <p>Click to enable audio for the full KBC experience!</p>
                <button class="enable-audio-btn">Enable Audio</button>
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #0f1419;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
            z-index: 10001;
            text-align: center;
            animation: slideInDown 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(message);
        
        // Add click handler
        const enableBtn = message.querySelector('.enable-audio-btn');
        enableBtn.addEventListener('click', () => {
            this.resumeAudioContext();
            this.playBackgroundMusic();
            message.remove();
        });
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 10000);
    }

    /**
     * Create audio visualization (simple bars)
     * @param {HTMLElement} container - Container for visualization
     */
    createAudioVisualization(container) {
        if (!this.audioContext) return;

        try {
            const analyser = this.audioContext.createAnalyser();
            const backgroundMusic = this.audioElements.backgroundMusic;
            
            if (backgroundMusic) {
                const source = this.audioContext.createMediaElementSource(backgroundMusic);
                source.connect(analyser);
                analyser.connect(this.audioContext.destination);
                
                analyser.fftSize = 64;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                // Create visualization bars
                const bars = [];
                for (let i = 0; i < 8; i++) {
                    const bar = document.createElement('div');
                    bar.style.cssText = `
                        width: 4px;
                        background: #ffd700;
                        border-radius: 2px;
                        margin: 0 1px;
                        transition: height 0.1s ease;
                    `;
                    bars.push(bar);
                    container.appendChild(bar);
                }
                
                // Animation loop
                const animate = () => {
                    analyser.getByteFrequencyData(dataArray);
                    
                    bars.forEach((bar, index) => {
                        const value = dataArray[index * 4] || 0;
                        const height = Math.max(4, (value / 255) * 20);
                        bar.style.height = `${height}px`;
                    });
                    
                    requestAnimationFrame(animate);
                };
                
                animate();
            }
        } catch (error) {
            console.warn('Failed to create audio visualization:', error);
        }
    }

    /**
     * Load audio preferences from storage
     */
    loadPreferences() {
        const savedEnabled = Utils.Storage.get('audioEnabled', true);
        const savedVolume = Utils.Storage.get('audioVolume', 0.7);
        const savedMusicVolume = Utils.Storage.get('musicVolume', 0.3);
        const savedEffectsVolume = Utils.Storage.get('effectsVolume', 0.8);
        
        this.setEnabled(savedEnabled);
        this.setVolume(savedVolume);
        this.setBackgroundMusicVolume(savedMusicVolume);
        this.setEffectsVolume(savedEffectsVolume);
    }

    /**
     * Save audio preferences to storage
     */
    savePreferences() {
        Utils.Storage.set('audioEnabled', this.isEnabled);
        Utils.Storage.set('audioVolume', this.volume);
        Utils.Storage.set('musicVolume', this.backgroundMusicVolume);
        Utils.Storage.set('effectsVolume', this.effectsVolume);
    }

    /**
     * Get current audio status
     * @returns {Object} Audio status object
     */
    getStatus() {
        return {
            enabled: this.isEnabled,
            volume: this.volume,
            backgroundMusicVolume: this.backgroundMusicVolume,
            effectsVolume: this.effectsVolume,
            contextState: this.audioContext ? this.audioContext.state : 'unavailable',
            backgroundMusicPlaying: this.audioElements.backgroundMusic ? 
                !this.audioElements.backgroundMusic.paused : false
        };
    }
}

// Export AudioManager
window.AudioManager = AudioManager;
