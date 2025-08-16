class AudioManager {
    constructor() {
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.backgroundMusic = null;
        this.soundEffects = {};
        this.musicVolume = 0.3;
        this.soundVolume = 0.5;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadAudioAssets();
        this.loadUserPreferences();
        this.isInitialized = true;
    }

    setupEventListeners() {
        const musicToggle = document.getElementById('musicToggle');
        const soundToggle = document.getElementById('soundToggle');

        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                this.toggleMusic();
            });
        }

        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleSound();
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseMusic();
            } else if (this.musicEnabled) {
                this.resumeMusic();
            }
        });

        document.addEventListener('click', () => {
            this.initializeAudioContext();
        }, { once: true });
    }

    async loadAudioAssets() {
        try {
            this.createBackgroundMusic();
            this.createSoundEffects();
            
        } catch (error) {
            console.warn('Could not load audio assets:', error);
        }
    }

    createBackgroundMusic() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.createRomanticMelody();
    }

    createRomanticMelody() {
        if (!this.audioContext) return;
        const chords = [
            [261.63, 329.63, 392.00], 
            [220.00, 261.63, 329.63], 
            [174.61, 220.00, 261.63], 
            [196.00, 246.94, 293.66]  
        ];

        let currentChord = 0;
        const chordDuration = 2000; 

        this.playChord = () => {
            if (!this.musicEnabled || !this.audioContext) return;

            const chord = chords[currentChord];
            const oscillators = [];
            const gainNode = this.audioContext.createGain();
            
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.setValueAtTime(this.musicVolume * 0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(this.musicVolume * 0.05, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.8);

            chord.forEach(frequency => {
                const oscillator = this.audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                oscillator.connect(gainNode);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 1.8);
                oscillators.push(oscillator);
            });

            currentChord = (currentChord + 1) % chords.length;
        };

        this.musicInterval = setInterval(() => {
            if (this.musicEnabled && this.audioContext && this.audioContext.state === 'running') {
                this.playChord();
            }
        }, chordDuration);
    }

    createSoundEffects() {
        if (!this.audioContext) return;
        this.soundEffects = {
            click: () => this.createTone(800, 0.1, 'sine'),
            success: () => this.createChime([523.25, 659.25, 783.99], 0.5),
            error: () => this.createTone(200, 0.3, 'sawtooth'),
            flip: () => this.createTone(400, 0.2, 'triangle'),
            match: () => this.createChime([523.25, 659.25, 783.99, 1046.50], 0.4),
            miss: () => this.createTone(150, 0.4, 'sawtooth'),
            spin: () => this.createSpinSound(),
            start: () => this.createChime([261.63, 329.63, 392.00, 523.25], 0.6),
            victory: () => this.createVictoryFanfare()
        };
    }

    createTone(frequency, duration, type = 'sine') {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.setValueAtTime(this.soundVolume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    createChime(frequencies, duration) {
        if (!this.audioContext || !this.soundEnabled) return;

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, duration * 0.6, 'sine');
            }, index * 100);
        });
    }

    createSpinSound() {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 2);
        gainNode.gain.setValueAtTime(this.soundVolume * 0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 2);
    }

    createVictoryFanfare() {
        if (!this.audioContext || !this.soundEnabled) return;

        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.4, 'sine');
            }, index * 150);
        });

       
        setTimeout(() => {
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq * 1.5, 0.3, 'triangle');
                }, index * 100);
            });
        }, 500);
    }

    initializeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    toggleMusic(enabled = null) {
        this.musicEnabled = enabled !== null ? enabled : !this.musicEnabled;
        
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            if (this.musicEnabled) {
                musicToggle.classList.add('active');
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                this.startMusic();
            } else {
                musicToggle.classList.remove('active');
                musicToggle.innerHTML = '<i class="fas fa-music-slash"></i>';
                this.stopMusic();
            }
        }
        
        this.savePreferences();
    }

    toggleSound(enabled = null) {
        this.soundEnabled = enabled !== null ? enabled : !this.soundEnabled;
        
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            if (this.soundEnabled) {
                soundToggle.classList.add('active');
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                soundToggle.classList.remove('active');
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        }
        
        this.savePreferences();
    }

    startMusic() {
        if (!this.musicEnabled || !this.audioContext) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (!this.musicInterval) {
            this.createRomanticMelody();
        }
    }

    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }

    pauseMusic() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    resumeMusic() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playSound(soundName) {
        if (!this.soundEnabled || !this.isInitialized) return;
        
        if (this.soundEffects[soundName]) {
            try {
                this.soundEffects[soundName]();
            } catch (error) {
                console.warn(`Could not play sound: ${soundName}`, error);
            }
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.savePreferences();
    }

    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.savePreferences();
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('loveverse-audio-preferences') || '{}');
        
        if (preferences.musicEnabled !== undefined) {
            this.toggleMusic(preferences.musicEnabled);
        }
        
        if (preferences.soundEnabled !== undefined) {
            this.toggleSound(preferences.soundEnabled);
        }
        
        if (preferences.musicVolume !== undefined) {
            this.musicVolume = preferences.musicVolume;
        }
        
        if (preferences.soundVolume !== undefined) {
            this.soundVolume = preferences.soundVolume;
        }
    }

    savePreferences() {
        const preferences = {
            musicEnabled: this.musicEnabled,
            soundEnabled: this.soundEnabled,
            musicVolume: this.musicVolume,
            soundVolume: this.soundVolume
        };
        
        localStorage.setItem('loveverse-audio-preferences', JSON.stringify(preferences));
    }

    
    createAmbientSound(type) {
        if (!this.audioContext || !this.soundEnabled) return;

        switch (type) {
            case 'romantic':
                this.createAmbientTone(200, 0.02, 5000);
                break;
            case 'magical':
                setInterval(() => {
                    if (Math.random() > 0.7) {
                        this.createTone(Math.random() * 1000 + 500, 0.1, 'sine');
                    }
                }, 2000);
                break;
        }
    }

    createAmbientTone(frequency, volume, duration) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.5, this.audioContext.currentTime + duration / 2);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    destroy() {
        this.stopMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.soundEffects = {};
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
});

window.addEventListener('beforeunload', () => {
    if (window.audioManager) {
        window.audioManager.destroy();
    }
});