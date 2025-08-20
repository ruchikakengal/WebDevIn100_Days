class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.5;
        this.sounds = new Map();
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.initAudioContext();
        this.createSounds();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);
            this.masterGainNode.gain.value = this.masterVolume;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    createSounds() {
        // Create synthetic sounds using Web Audio API
        this.createShootSound();
        this.createExplosionSound();
        this.createHitSound();
        this.createPowerUpSound();
        this.createEngineSound();
    }

    createOscillator(frequency, type = 'sine', duration = 0.1) {
        if (!this.audioContext) return null;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        return { oscillator, gainNode };
    }

    createNoiseBuffer(duration = 0.1) {
        if (!this.audioContext) return null;

        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        return buffer;
    }

    createShootSound() {
        this.sounds.set('shoot', () => {
            if (!this.audioContext) return;

            const { oscillator, gainNode } = this.createOscillator(800, 'square', 0.1);
            
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        });
    }

    createExplosionSound() {
        this.sounds.set('explosion', () => {
            if (!this.audioContext) return;

            // Low frequency boom
            const { oscillator: boom } = this.createOscillator(60, 'sine', 0.5);
            boom.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.3);
            boom.start(this.audioContext.currentTime);
            boom.stop(this.audioContext.currentTime + 0.5);

            // High frequency crack
            const { oscillator: crack } = this.createOscillator(2000, 'sawtooth', 0.2);
            crack.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
            crack.start(this.audioContext.currentTime + 0.05);
            crack.stop(this.audioContext.currentTime + 0.2);

            // Noise component
            const noiseBuffer = this.createNoiseBuffer(0.3);
            if (noiseBuffer) {
                const noiseSource = this.audioContext.createBufferSource();
                const noiseGain = this.audioContext.createGain();
                
                noiseSource.buffer = noiseBuffer;
                noiseSource.connect(noiseGain);
                noiseGain.connect(this.masterGainNode);
                
                noiseGain.gain.setValueAtTime(0.1 * this.sfxVolume, this.audioContext.currentTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                noiseSource.start(this.audioContext.currentTime);
            }
        });
    }

    createHitSound() {
        this.sounds.set('hit', () => {
            if (!this.audioContext) return;

            const { oscillator } = this.createOscillator(150, 'triangle', 0.15);
            oscillator.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 0.1);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        });
    }

    createPowerUpSound() {
        this.sounds.set('powerup', () => {
            if (!this.audioContext) return;

            const { oscillator } = this.createOscillator(440, 'sine', 0.3);
            oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.15);
            oscillator.frequency.linearRampToValueAtTime(1320, this.audioContext.currentTime + 0.3);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        });
    }

    createEngineSound() {
        this.sounds.set('engine', () => {
            if (!this.audioContext) return;

            const { oscillator, gainNode } = this.createOscillator(100, 'sawtooth', 0.5);
            
            // Add some frequency modulation for engine effect
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            
            lfo.frequency.value = 8;
            lfoGain.gain.value = 20;
            
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            
            gainNode.gain.setValueAtTime(0.05 * this.sfxVolume, this.audioContext.currentTime);
            
            lfo.start(this.audioContext.currentTime);
            oscillator.start(this.audioContext.currentTime);
            
            lfo.stop(this.audioContext.currentTime + 0.5);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        });
    }

    playSound(soundName) {
        const sound = this.sounds.get(soundName);
        if (sound && this.audioContext) {
            // Resume audio context if suspended (required for user interaction)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            sound();
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGainNode) {
            this.masterGainNode.gain.value = this.masterVolume;
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    // Resume audio context (call this on first user interaction)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}
