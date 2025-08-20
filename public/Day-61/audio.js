class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.masterVolume = 0.7;
        this.enabled = true;
        this.initAudioContext();
        this.createSounds();
    }

    /**
     * Initialize Web Audio Context
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle audio context suspension in some browsers
            if (this.audioContext.state === 'suspended') {
                document.addEventListener('click', () => {
                    this.audioContext.resume();
                }, { once: true });
            }
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }

    /**
     * Create all sound effects procedurally
     */
    createSounds() {
        if (!this.enabled) return;

        // Bow release sound
        this.sounds.set('bowRelease', this.createBowReleaseSound());
        
        // Arrow hit sounds
        this.sounds.set('hitBullseye', this.createHitSound(800, 0.3));
        this.sounds.set('hitInner', this.createHitSound(600, 0.25));
        this.sounds.set('hitOuter', this.createHitSound(400, 0.2));
        this.sounds.set('miss', this.createMissSound());
        
        // UI sounds
        this.sounds.set('buttonClick', this.createButtonSound());
        this.sounds.set('gameStart', this.createGameStartSound());
        this.sounds.set('gameOver', this.createGameOverSound());
        this.sounds.set('newRecord', this.createNewRecordSound());
        
        // Ambient sounds
        this.sounds.set('windEffect', this.createWindSound());
        this.sounds.set('crowdCheer', this.createCrowdCheerSound());
    }

    /**
     * Create bow release sound effect
     */
    createBowReleaseSound() {
        return () => {
            if (!this.enabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // String release sound
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
    }

    /**
     * Create target hit sound
     * @param {number} frequency - Base frequency for the hit sound
     * @param {number} volume - Volume multiplier
     */
    createHitSound(frequency, volume) {
        return () => {
            if (!this.enabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.audioContext.currentTime + 0.1);
            
            filterNode.type = 'bandpass';
            filterNode.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            filterNode.Q.setValueAtTime(10, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }

    /**
     * Create miss sound effect
     */
    createMissSound() {
        return () => {
            if (!this.enabled) return;
            
            // Create a noise buffer for thud sound
            const bufferSize = this.audioContext.sampleRate * 0.3;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            source.buffer = buffer;
            source.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
            
            source.start(this.audioContext.currentTime);
        };
    }

    /**
     * Create button click sound
     */
    createButtonSound() {
        return () => {
            if (!this.enabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    /**
     * Create game start sound
     */
    createGameStartSound() {
        return () => {
            if (!this.enabled) return;
            
            const frequencies = [523, 659, 784]; // C, E, G
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.1);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.1);
                gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + index * 0.1 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + index * 0.1 + 0.3);
                
                oscillator.start(this.audioContext.currentTime + index * 0.1);
                oscillator.stop(this.audioContext.currentTime + index * 0.1 + 0.3);
            });
        };
    }

    /**
     * Create game over sound
     */
    createGameOverSound() {
        return () => {
            if (!this.enabled) return;
            
            const frequencies = [784, 659, 523, 392]; // G, E, C, G (descending)
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.2);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.2);
                gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime + index * 0.2 + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + index * 0.2 + 0.4);
                
                oscillator.start(this.audioContext.currentTime + index * 0.2);
                oscillator.stop(this.audioContext.currentTime + index * 0.2 + 0.4);
            });
        };
    }

    /**
     * Create new record celebration sound
     */
    createNewRecordSound() {
        return () => {
            if (!this.enabled) return;
            
            // Play an ascending scale with harmony
            const frequencies = [523, 659, 784, 1047]; // C, E, G, C
            
            frequencies.forEach((freq, index) => {
                // Main note
                const oscillator1 = this.audioContext.createOscillator();
                const gainNode1 = this.audioContext.createGain();
                
                oscillator1.connect(gainNode1);
                gainNode1.connect(this.audioContext.destination);
                
                oscillator1.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.1);
                
                gainNode1.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.1);
                gainNode1.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + index * 0.1 + 0.01);
                gainNode1.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + index * 0.1 + 0.4);
                
                oscillator1.start(this.audioContext.currentTime + index * 0.1);
                oscillator1.stop(this.audioContext.currentTime + index * 0.1 + 0.4);
                
                // Harmony note
                const oscillator2 = this.audioContext.createOscillator();
                const gainNode2 = this.audioContext.createGain();
                
                oscillator2.connect(gainNode2);
                gainNode2.connect(this.audioContext.destination);
                
                oscillator2.frequency.setValueAtTime(freq * 1.5, this.audioContext.currentTime + index * 0.1);
                
                gainNode2.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.1);
                gainNode2.gain.linearRampToValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime + index * 0.1 + 0.01);
                gainNode2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + index * 0.1 + 0.4);
                
                oscillator2.start(this.audioContext.currentTime + index * 0.1);
                oscillator2.stop(this.audioContext.currentTime + index * 0.1 + 0.4);
            });
        };
    }

    /**
     * Create wind ambient sound
     */
    createWindSound() {
        return (intensity = 0.5) => {
            if (!this.enabled) return;
            
            // Create noise buffer for wind
            const bufferSize = this.audioContext.sampleRate * 2;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            source.buffer = buffer;
            source.loop = true;
            source.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filterNode.type = 'highpass';
            filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(this.masterVolume * intensity * 0.05, this.audioContext.currentTime);
            
            source.start(this.audioContext.currentTime);
            
            // Stop after 2 seconds
            setTimeout(() => {
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
                setTimeout(() => source.stop(), 500);
            }, 1500);
        };
    }

    /**
     * Create crowd cheer sound
     */
    createCrowdCheerSound() {
        return () => {
            if (!this.enabled) return;
            
            // Create multiple oscillators for crowd effect
            for (let i = 0; i < 5; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filterNode = this.audioContext.createBiquadFilter();
                
                oscillator.connect(filterNode);
                filterNode.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                const baseFreq = 200 + Math.random() * 300;
                oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime + i * 0.1);
                oscillator.frequency.linearRampToValueAtTime(baseFreq * 1.5, this.audioContext.currentTime + i * 0.1 + 0.5);
                
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                filterNode.Q.setValueAtTime(5, this.audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + i * 0.1);
                gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime + i * 0.1 + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + i * 0.1 + 1);
                
                oscillator.start(this.audioContext.currentTime + i * 0.1);
                oscillator.stop(this.audioContext.currentTime + i * 0.1 + 1);
            }
        };
    }

    /**
     * Play a sound effect by name
     * @param {string} soundName - Name of the sound to play
     * @param {*} params - Optional parameters for the sound
     */
    playSound(soundName, ...params) {
        if (!this.enabled || !this.sounds.has(soundName)) return;
        
        try {
            const soundFunction = this.sounds.get(soundName);
            soundFunction(...params);
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Toggle audio on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Check if audio is enabled
     */
    isEnabled() {
        return this.enabled;
    }
}
