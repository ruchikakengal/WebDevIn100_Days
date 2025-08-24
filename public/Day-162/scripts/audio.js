/**
 * Audio Manager
 * Handles sound effects and background music for the hacker simulation
 */

class AudioManager {
    constructor() {
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.5;
        this.musicVolume = 0.3;
        this.audioContext = null;
        this.backgroundMusic = null;
        this.soundEffects = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize audio system
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create sound effects
            this.createSoundEffects();
            
            // Load background music
            await this.loadBackgroundMusic();
            
            this.isInitialized = true;
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            this.soundEnabled = false;
        }
    }

    /**
     * Create synthesized sound effects using Web Audio API
     */
    createSoundEffects() {
        // Typing sound
        this.soundEffects.set('type', () => this.createTypingSound());
        
        // Success sound
        this.soundEffects.set('success', () => this.createSuccessSound());
        
        // Error sound
        this.soundEffects.set('error', () => this.createErrorSound());
        
        // Boot sound
        this.soundEffects.set('boot', () => this.createBootSound());
        
        // Clear sound
        this.soundEffects.set('clear', () => this.createClearSound());
        
        // Achievement sound
        this.soundEffects.set('achievement', () => this.createAchievementSound());
        
        // Hack sound
        this.soundEffects.set('hack', () => this.createHackSound());
        
        // Alert sound
        this.soundEffects.set('alert', () => this.createAlertSound());
        
        // Login sound
        this.soundEffects.set('login', () => this.createLoginSound());
        
        // Scan sound
        this.soundEffects.set('scan', () => this.createScanSound());
    }

    /**
     * Create typing sound effect
     */
    createTypingSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    /**
     * Create success sound effect
     */
    createSuccessSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator1.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
        oscillator1.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.2); // E5
        oscillator1.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.4); // G5
        
        oscillator2.frequency.setValueAtTime(261.63, this.audioContext.currentTime); // C4
        oscillator2.frequency.setValueAtTime(329.63, this.audioContext.currentTime + 0.2); // E4
        oscillator2.frequency.setValueAtTime(392.00, this.audioContext.currentTime + 0.4); // G4
        
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.8);
        oscillator2.stop(this.audioContext.currentTime + 0.8);
    }

    /**
     * Create error sound effect
     */
    createErrorSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    /**
     * Create boot sound effect
     */
    createBootSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.3);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    /**
     * Create clear sound effect
     */
    createClearSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    /**
     * Create achievement sound effect
     */
    createAchievementSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        // Multi-tone achievement fanfare
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.4);
            }, index * 100);
        });
    }

    /**
     * Create hack sound effect
     */
    createHackSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(300, this.audioContext.currentTime + 1.0);
        oscillator.type = 'sawtooth';
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(500, this.audioContext.currentTime);
        filterNode.frequency.linearRampToValueAtTime(2000, this.audioContext.currentTime + 1.0);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1.2);
    }

    /**
     * Create alert sound effect
     */
    createAlertSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }, i * 300);
        }
    }

    /**
     * Create login sound effect
     */
    createLoginSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime); // E5
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime + 0.2); // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.6);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.6);
    }

    /**
     * Create scan sound effect
     */
    createScanSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1800, this.audioContext.currentTime + 0.5);
        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 1.0);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, this.audioContext.currentTime + 0.9);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.0);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1.0);
    }

    /**
     * Load and create background music
     */
    async loadBackgroundMusic() {
        if (!this.audioContext) return;

        // Create ambient cyberpunk background music using oscillators
        this.createAmbientMusic();
    }

    /**
     * Create ambient cyberpunk background music
     */
    createAmbientMusic() {
        if (!this.audioContext) return;

        // Low frequency bass drone
        const bassOsc = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();
        
        bassOsc.connect(bassGain);
        bassGain.connect(this.audioContext.destination);
        
        bassOsc.frequency.setValueAtTime(55, this.audioContext.currentTime); // A1
        bassOsc.type = 'sine';
        
        bassGain.gain.setValueAtTime(this.musicVolume * 0.3, this.audioContext.currentTime);
        
        // Mid frequency pad
        const padOsc = this.audioContext.createOscillator();
        const padGain = this.audioContext.createGain();
        const padFilter = this.audioContext.createBiquadFilter();
        
        padOsc.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(this.audioContext.destination);
        
        padOsc.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
        padOsc.type = 'sawtooth';
        
        padFilter.type = 'lowpass';
        padFilter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        padGain.gain.setValueAtTime(this.musicVolume * 0.1, this.audioContext.currentTime);
        
        // Store references for control
        this.backgroundMusic = {
            bass: { oscillator: bassOsc, gain: bassGain },
            pad: { oscillator: padOsc, gain: padGain, filter: padFilter }
        };
    }

    /**
     * Play background music
     */
    playBackgroundMusic() {
        if (!this.musicEnabled || !this.audioContext) return;

        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Create new ambient music if needed
            if (!this.backgroundMusic) {
                this.createAmbientMusic();
            }

            // Start oscillators
            if (this.backgroundMusic) {
                this.backgroundMusic.bass.oscillator.start();
                this.backgroundMusic.pad.oscillator.start();
            }
        } catch (error) {
            console.warn('Background music playback failed:', error);
        }
    }

    /**
     * Pause background music
     */
    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            try {
                this.backgroundMusic.bass.oscillator.stop();
                this.backgroundMusic.pad.oscillator.stop();
                this.backgroundMusic = null;
            } catch (error) {
                console.warn('Background music pause failed:', error);
            }
        }
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        this.pauseBackgroundMusic();
    }

    /**
     * Play sound effect
     */
    playSound(soundName) {
        if (!this.soundEnabled || !this.audioContext) return;

        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const soundEffect = this.soundEffects.get(soundName);
            if (soundEffect) {
                soundEffect();
            }
        } catch (error) {
            console.warn(`Sound effect '${soundName}' playback failed:`, error);
        }
    }

    /**
     * Toggle sound effects
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        if (!this.soundEnabled) {
            this.stopBackgroundMusic();
        } else {
            if (!this.isInitialized) {
                this.init();
            }
            this.playBackgroundMusic();
        }
    }

    /**
     * Enable sound
     */
    enableSound() {
        this.soundEnabled = true;
        this.musicEnabled = true;
        
        if (!this.isInitialized) {
            this.init();
        }
    }

    /**
     * Disable sound
     */
    disableSound() {
        this.soundEnabled = false;
        this.musicEnabled = false;
        this.stopBackgroundMusic();
    }

    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }

    /**
     * Set sound effects volume
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Set music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }

    /**
     * Update all volume settings
     */
    updateVolumes() {
        if (this.backgroundMusic) {
            this.backgroundMusic.bass.gain.gain.setValueAtTime(
                this.musicVolume * this.masterVolume * 0.3,
                this.audioContext.currentTime
            );
            this.backgroundMusic.pad.gain.gain.setValueAtTime(
                this.musicVolume * this.masterVolume * 0.1,
                this.audioContext.currentTime
            );
        }
    }

    /**
     * Get current audio state
     */
    getAudioState() {
        return {
            soundEnabled: this.soundEnabled,
            musicEnabled: this.musicEnabled,
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Cleanup audio resources
     */
    cleanup() {
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.soundEffects.clear();
        this.isInitialized = false;
    }
}
