// Audio management system for time capsule application
class AudioManager {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.masterVolume = 0.7;
        this.soundEnabled = true;
        this.loadedSounds = new Set();
        this.failedSounds = new Set();
        
        this.initializeAudioContext();
        this.loadSounds();
        this.loadSettings();
    }

    initializeAudioContext() {
        try {
            // Create audio context for better sound control
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Resume audio context on user interaction (required by browsers)
            document.addEventListener('click', () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            }, { once: true });
        } catch (error) {
            console.warn('AudioContext not supported:', error);
            this.audioContext = null;
        }
    }

    loadSounds() {
        // Load sound definitions from sounds.js
        if (typeof SoundLibrary !== 'undefined') {
            this.sounds = SoundLibrary.getSounds();
            this.preloadSounds();
        } else {
            console.warn('Sound library not loaded, using fallback sounds');
            this.createFallbackSounds();
        }
    }

    createFallbackSounds() {
        // Create simple beep sounds using Web Audio API as fallback
        this.sounds = {
            click: { frequency: 800, duration: 0.1, type: 'sine' },
            success: { frequency: 1000, duration: 0.3, type: 'sine' },
            error: { frequency: 400, duration: 0.5, type: 'square' },
            lock: { frequency: 600, duration: 0.4, type: 'sawtooth' },
            unlock: { frequency: 1200, duration: 0.6, type: 'sine' },
            tick: { frequency: 500, duration: 0.05, type: 'square' }
        };
    }

    async preloadSounds() {
        for (const [soundName, soundData] of Object.entries(this.sounds)) {
            try {
                if (soundData.url) {
                    await this.loadAudioFile(soundName, soundData.url);
                }
                this.loadedSounds.add(soundName);
            } catch (error) {
                console.warn(`Failed to load sound: ${soundName}`, error);
                this.failedSounds.add(soundName);
            }
        }
    }

    async loadAudioFile(soundName, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', () => {
                this.sounds[soundName].audio = audio;
                resolve(audio);
            });
            audio.addEventListener('error', reject);
            audio.src = url;
            audio.preload = 'auto';
            audio.volume = this.masterVolume;
        });
    }

    playSound(soundName, options = {}) {
        if (!this.soundEnabled) {
            return;
        }

        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }

        try {
            if (sound.audio) {
                // Play preloaded audio file
                this.playAudioFile(sound.audio, options);
            } else if (this.audioContext) {
                // Generate sound using Web Audio API
                this.generateSound(sound, options);
            } else {
                // Fallback to simple beep
                this.playBeep(sound.frequency || 800);
            }
        } catch (error) {
            console.warn(`Failed to play sound: ${soundName}`, error);
        }
    }

    playAudioFile(audio, options = {}) {
        // Clone audio for overlapping sounds
        const audioClone = audio.cloneNode();
        audioClone.volume = (options.volume || 1) * this.masterVolume;
        audioClone.playbackRate = options.playbackRate || 1;
        
        const playPromise = audioClone.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Audio play failed:', error);
            });
        }

        // Clean up after playing
        audioClone.addEventListener('ended', () => {
            audioClone.remove();
        });
    }

    generateSound(soundConfig, options = {}) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Configure oscillator
        oscillator.type = soundConfig.type || 'sine';
        oscillator.frequency.setValueAtTime(
            soundConfig.frequency || 800, 
            this.audioContext.currentTime
        );

        // Configure gain (volume)
        const volume = (options.volume || 1) * this.masterVolume;
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01, 
            this.audioContext.currentTime + (soundConfig.duration || 0.2)
        );

        // Add frequency modulation for more interesting sounds
        if (soundConfig.modulation) {
            const modulator = this.audioContext.createOscillator();
            const modulatorGain = this.audioContext.createGain();
            
            modulator.frequency.setValueAtTime(soundConfig.modulation.frequency, this.audioContext.currentTime);
            modulatorGain.gain.setValueAtTime(soundConfig.modulation.depth, this.audioContext.currentTime);
            
            modulator.connect(modulatorGain);
            modulatorGain.connect(oscillator.frequency);
            
            modulator.start();
            modulator.stop(this.audioContext.currentTime + soundConfig.duration);
        }

        // Start and stop
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + (soundConfig.duration || 0.2));
    }

    playBeep(frequency = 800) {
        // Simple fallback beep using data URL
        const audio = new Audio();
        const duration = 200;
        const sampleRate = 44100;
        const samples = duration * sampleRate / 1000;
        const data = new Int16Array(samples);
        
        for (let i = 0; i < samples; i++) {
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 32767;
        }
        
        // Convert to WAV format (simplified)
        const wav = this.createWavFromSamples(data, sampleRate);
        audio.src = 'data:audio/wav;base64,' + btoa(wav);
        audio.volume = this.masterVolume;
        audio.play().catch(() => {
            // Silently fail if audio can't play
        });
    }

    createWavFromSamples(samples, sampleRate) {
        // Simplified WAV creation for beep sounds
        const length = samples.length;
        const buffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(buffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);
        
        // Write samples
        let offset = 44;
        for (let i = 0; i < length; i++) {
            view.setInt16(offset, samples[i], true);
            offset += 2;
        }
        
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    // Specialized sound effects
    playCountdownTick() {
        this.playSound('tick', { volume: 0.3 });
    }

    playSuccessChime() {
        this.playSound('success');
        
        // Add harmonic for richer sound
        setTimeout(() => {
            this.playSound('success', { 
                volume: 0.5,
                playbackRate: 1.5 
            });
        }, 100);
    }

    playLockSequence() {
        this.playSound('lock');
        
        // Add confirmation beep
        setTimeout(() => {
            this.playSound('click', { volume: 0.7 });
        }, 300);
    }

    playUnlockSequence() {
        // Multi-stage unlock sound
        this.playSound('unlock');
        
        setTimeout(() => {
            this.playSuccessChime();
        }, 400);
        
        setTimeout(() => {
            this.playSound('success', { 
                volume: 0.4,
                playbackRate: 0.8 
            });
        }, 800);
    }

    playErrorAlert() {
        this.playSound('error');
        
        // Add emphasis with repetition
        setTimeout(() => {
            this.playSound('error', { volume: 0.6 });
        }, 200);
    }

    // Volume and settings management
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
        
        // Update existing audio elements
        Object.values(this.sounds).forEach(sound => {
            if (sound.audio) {
                sound.audio.volume = this.masterVolume;
            }
        });
    }

    getMasterVolume() {
        return this.masterVolume;
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.saveSettings();
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }

    toggleSound() {
        this.setSoundEnabled(!this.soundEnabled);
        return this.soundEnabled;
    }

    // Settings persistence
    saveSettings() {
        try {
            const settings = {
                masterVolume: this.masterVolume,
                soundEnabled: this.soundEnabled
            };
            localStorage.setItem('timecapsule_audio_settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Failed to save audio settings:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('timecapsule_audio_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.masterVolume = settings.masterVolume || 0.7;
                this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
            }
        } catch (error) {
            console.warn('Failed to load audio settings:', error);
        }
    }

    // Debug and utility methods
    getSoundStatus() {
        return {
            enabled: this.soundEnabled,
            volume: this.masterVolume,
            audioContextState: this.audioContext ? this.audioContext.state : 'unavailable',
            loadedSounds: Array.from(this.loadedSounds),
            failedSounds: Array.from(this.failedSounds),
            availableSounds: Object.keys(this.sounds)
        };
    }

    testAllSounds() {
        if (!this.soundEnabled) {
            console.log('Sounds are disabled');
            return;
        }

        const soundNames = Object.keys(this.sounds);
        let index = 0;

        const playNext = () => {
            if (index < soundNames.length) {
                console.log(`Testing sound: ${soundNames[index]}`);
                this.playSound(soundNames[index]);
                index++;
                setTimeout(playNext, 800);
            }
        };

        playNext();
    }

    // Cleanup
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Stop all audio elements
        Object.values(this.sounds).forEach(sound => {
            if (sound.audio) {
                sound.audio.pause();
                sound.audio = null;
            }
        });
        
        this.sounds = {};
        this.loadedSounds.clear();
        this.failedSounds.clear();
    }
}

