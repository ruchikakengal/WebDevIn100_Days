/**
 * Audio Engine for Alien Language Translator
 * Generates procedural alien sounds using Web Audio API
 */

class AlienAudioEngine {
    constructor() {
        this.audioContext = null;
        this.isEnabled = true;
        this.masterVolume = 0.3;
        this.soundProfiles = this.initializeSoundProfiles();
        this.currentlyPlaying = new Set();
        
        this.initializeAudioContext();
    }
    
    /**
     * Initialize audio context
     */
    async initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle browser audio policy
            if (this.audioContext.state === 'suspended') {
                // Audio context will be resumed on first user interaction
                document.addEventListener('click', () => {
                    if (this.audioContext.state === 'suspended') {
                        this.audioContext.resume();
                    }
                }, { once: true });
            }
        } catch (error) {
            console.warn('Audio context initialization failed:', error);
            this.isEnabled = false;
        }
    }
    
    /**
     * Initialize sound profiles for different alien species
     */
    initializeSoundProfiles() {
        return {
            ethereal: {
                baseFrequency: 300,
                frequencyRange: 200,
                oscillatorType: 'sine',
                attackTime: 0.1,
                decayTime: 0.3,
                sustainLevel: 0.4,
                releaseTime: 0.5,
                filterFrequency: 1000,
                filterQ: 5,
                modulationRate: 4,
                modulationDepth: 50
            },
            crystalline: {
                baseFrequency: 800,
                frequencyRange: 400,
                oscillatorType: 'triangle',
                attackTime: 0.01,
                decayTime: 0.1,
                sustainLevel: 0.7,
                releaseTime: 0.2,
                filterFrequency: 2000,
                filterQ: 10,
                modulationRate: 8,
                modulationDepth: 100
            },
            atmospheric: {
                baseFrequency: 150,
                frequencyRange: 100,
                oscillatorType: 'sawtooth',
                attackTime: 0.2,
                decayTime: 0.4,
                sustainLevel: 0.3,
                releaseTime: 0.8,
                filterFrequency: 500,
                filterQ: 2,
                modulationRate: 2,
                modulationDepth: 30
            },
            digital: {
                baseFrequency: 440,
                frequencyRange: 300,
                oscillatorType: 'square',
                attackTime: 0.05,
                decayTime: 0.1,
                sustainLevel: 0.6,
                releaseTime: 0.3,
                filterFrequency: 1500,
                filterQ: 8,
                modulationRate: 16,
                modulationDepth: 200
            }
        };
    }
    
    /**
     * Generate sound for a single alien character
     */
    async generateCharacterSound(character, soundProfile = 'ethereal') {
        if (!this.isEnabled || !this.audioContext) {
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            try {
                const profile = this.soundProfiles[soundProfile] || this.soundProfiles.ethereal;
                const now = this.audioContext.currentTime;
                
                // Create oscillator
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filterNode = this.audioContext.createBiquadFilter();
                
                // Create modulation for more complex sounds
                const modOscillator = this.audioContext.createOscillator();
                const modGain = this.audioContext.createGain();
                
                // Set up modulation
                modOscillator.frequency.setValueAtTime(profile.modulationRate, now);
                modGain.gain.setValueAtTime(profile.modulationDepth, now);
                
                // Connect modulation
                modOscillator.connect(modGain);
                modGain.connect(oscillator.frequency);
                
                // Calculate frequency based on character
                const charCode = character.charCodeAt(0);
                const frequencyOffset = (charCode % 26) * (profile.frequencyRange / 26);
                const frequency = profile.baseFrequency + frequencyOffset;
                
                // Set up oscillator
                oscillator.type = profile.oscillatorType;
                oscillator.frequency.setValueAtTime(frequency, now);
                
                // Set up filter
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(profile.filterFrequency, now);
                filterNode.Q.setValueAtTime(profile.filterQ, now);
                
                // Connect audio nodes
                oscillator.connect(filterNode);
                filterNode.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // Set up envelope (ADSR)
                const attackTime = profile.attackTime;
                const decayTime = profile.decayTime;
                const sustainLevel = profile.sustainLevel * this.masterVolume;
                const releaseTime = profile.releaseTime;
                const totalDuration = attackTime + decayTime + 0.1 + releaseTime;
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(this.masterVolume, now + attackTime);
                gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
                gainNode.gain.setValueAtTime(sustainLevel, now + attackTime + decayTime + 0.1);
                gainNode.gain.linearRampToValueAtTime(0, now + totalDuration);
                
                // Start oscillators
                modOscillator.start(now);
                oscillator.start(now);
                
                // Stop oscillators
                modOscillator.stop(now + totalDuration);
                oscillator.stop(now + totalDuration);
                
                // Clean up
                setTimeout(() => {
                    try {
                        oscillator.disconnect();
                        modOscillator.disconnect();
                        gainNode.disconnect();
                        filterNode.disconnect();
                        modGain.disconnect();
                    } catch (e) {
                        // Ignore cleanup errors
                    }
                    resolve();
                }, totalDuration * 1000 + 100);
                
            } catch (error) {
                console.warn('Error generating character sound:', error);
                resolve();
            }
        });
    }
    
    /**
     * Play sound sequence for alien text
     */
    async playAlienText(characters, delay = 150) {
        if (!this.isEnabled || !characters || characters.length === 0) {
            return;
        }
        
        const playbackId = Date.now();
        this.currentlyPlaying.add(playbackId);
        
        try {
            for (let i = 0; i < characters.length; i++) {
                if (!this.currentlyPlaying.has(playbackId)) {
                    break; // Playback was stopped
                }
                
                const char = characters[i];
                if (char.human !== ' ') {
                    await this.generateCharacterSound(char.human, char.soundProfile);
                }
                
                // Wait between characters
                if (i < characters.length - 1) {
                    await this.sleep(delay);
                }
            }
        } catch (error) {
            console.warn('Error playing alien text:', error);
        } finally {
            this.currentlyPlaying.delete(playbackId);
        }
    }
    
    /**
     * Play UI sound effects
     */
    async playUISound(type) {
        if (!this.isEnabled || !this.audioContext) {
            return;
        }
        
        const soundMap = {
            button: { freq: 800, duration: 0.1, type: 'sine' },
            success: { freq: 600, duration: 0.3, type: 'triangle' },
            error: { freq: 200, duration: 0.5, type: 'sawtooth' },
            notification: { freq: 1000, duration: 0.2, type: 'square' },
            transmission: { freq: 440, duration: 1.0, type: 'sine' }
        };
        
        const sound = soundMap[type] || soundMap.button;
        
        try {
            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(sound.freq, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.5, now + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, now + sound.duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now);
            oscillator.stop(now + sound.duration);
            
            setTimeout(() => {
                try {
                    oscillator.disconnect();
                    gainNode.disconnect();
                } catch (e) {
                    // Ignore cleanup errors
                }
            }, sound.duration * 1000 + 100);
            
        } catch (error) {
            console.warn('Error playing UI sound:', error);
        }
    }
    
    /**
     * Stop all currently playing sounds
     */
    stopAllSounds() {
        this.currentlyPlaying.clear();
    }
    
    /**
     * Toggle audio on/off
     */
    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled) {
            this.stopAllSounds();
        }
        return this.isEnabled;
    }
    
    /**
     * Set master volume
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Get current volume
     */
    getVolume() {
        return this.masterVolume;
    }
    
    /**
     * Check if audio is enabled
     */
    isAudioEnabled() {
        return this.isEnabled && this.audioContext && this.audioContext.state === 'running';
    }
    
    /**
     * Utility function for delays
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Generate ambient background sound (optional)
     */
    async startAmbientSound() {
        if (!this.isEnabled || !this.audioContext) {
            return;
        }
        
        try {
            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(60, now);
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(200, now);
            filterNode.Q.setValueAtTime(1, now);
            
            gainNode.gain.setValueAtTime(this.masterVolume * 0.1, now);
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now);
            
            // Modulate the ambient sound
            setInterval(() => {
                if (this.isEnabled && this.audioContext) {
                    const currentTime = this.audioContext.currentTime;
                    const newFreq = 60 + Math.sin(currentTime * 0.1) * 20;
                    oscillator.frequency.setValueAtTime(newFreq, currentTime);
                }
            }, 100);
            
        } catch (error) {
            console.warn('Error starting ambient sound:', error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlienAudioEngine;
}
