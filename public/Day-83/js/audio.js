class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.music = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.3;
        
        this.initAudioContext();
        this.createSounds();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.audioContext = null;
        }
    }

    // Create sound effects using Web Audio API
    createSounds() {
        if (!this.audioContext) return;

        // Paddle hit sound
        this.sounds.paddleHit = this.createTone(440, 0.1, 'sine');
        
        // Wall bounce sound
        this.sounds.wallBounce = this.createTone(220, 0.15, 'square');
        
        // Score sound
        this.sounds.score = this.createChord([523, 659, 784], 0.5);
        
        // Power-up collect sound
        this.sounds.powerup = this.createChord([880, 1108, 1319], 0.3);
        
        // Game over sound
        this.sounds.gameOver = this.createTone(150, 1.0, 'sawtooth');
        
        // Countdown beep
        this.sounds.countdown = this.createTone(800, 0.2, 'sine');
        
        // Button click
        this.sounds.buttonClick = this.createTone(600, 0.1, 'square');
    }

    createTone(frequency, duration, waveType = 'sine') {
        if (!this.audioContext) return null;

        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveType;
            
            // Envelope
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.sfxVolume * this.masterVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createChord(frequencies, duration) {
        if (!this.audioContext) return null;

        return () => {
            if (!this.soundEnabled) return;

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    // Envelope
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(
                        (this.sfxVolume * this.masterVolume) / frequencies.length, 
                        this.audioContext.currentTime + 0.01
                    );
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                }, index * 50);
            });
        };
    }

    // Background music using oscillators
    startBackgroundMusic() {
        if (!this.audioContext || !this.musicEnabled || this.music) return;

        this.music = {
            oscillators: [],
            gainNodes: [],
            isPlaying: true
        };

        // Create a simple ambient background track
        const notes = [
            { freq: 220, duration: 4 },  // A3
            { freq: 261, duration: 4 },  // C4
            { freq: 329, duration: 4 },  // E4
            { freq: 392, duration: 4 },  // G4
        ];

        let noteIndex = 0;
        const playNote = () => {
            if (!this.music || !this.music.isPlaying) return;

            const note = notes[noteIndex % notes.length];
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime);
            filterNode.Q.setValueAtTime(1, this.audioContext.currentTime);
            
            // Very quiet background music
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                this.musicVolume * this.masterVolume * 0.1, 
                this.audioContext.currentTime + 0.5
            );
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + note.duration - 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + note.duration);
            
            this.music.oscillators.push(oscillator);
            this.music.gainNodes.push(gainNode);
            
            noteIndex++;
            setTimeout(playNote, note.duration * 1000);
        };

        playNote();
    }

    stopBackgroundMusic() {
        if (this.music) {
            this.music.isPlaying = false;
            this.music.oscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
            this.music = null;
        }
    }

    // Sound effect methods
    playPaddleHit() {
        if (this.sounds.paddleHit) {
            this.sounds.paddleHit();
        }
    }

    playWallBounce() {
        if (this.sounds.wallBounce) {
            this.sounds.wallBounce();
        }
    }

    playScore() {
        if (this.sounds.score) {
            this.sounds.score();
        }
    }

    playPowerup() {
        if (this.sounds.powerup) {
            this.sounds.powerup();
        }
    }

    playGameOver() {
        if (this.sounds.gameOver) {
            this.sounds.gameOver();
        }
    }

    playCountdown() {
        if (this.sounds.countdown) {
            this.sounds.countdown();
        }
    }

    playButtonClick() {
        if (this.sounds.buttonClick) {
            this.sounds.buttonClick();
        }
    }

    // Volume and settings
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (enabled) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    // Resume audio context (required after user interaction)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Clean up resources
    destroy() {
        this.stopBackgroundMusic();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Create global audio instance
const audioSystem = new AudioSystem();

// Resume audio context on first user interaction
document.addEventListener('click', () => {
    audioSystem.resumeAudioContext();
}, { once: true });

document.addEventListener('keydown', () => {
    audioSystem.resumeAudioContext();
}, { once: true });

document.addEventListener('touchstart', () => {
    audioSystem.resumeAudioContext();
}, { once: true });
