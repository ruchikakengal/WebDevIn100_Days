class AudioEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;
        this.initializeAudio();
    }

    async initializeAudio() {
        try {
            // Create audio context (requires user interaction in modern browsers)
            if (typeof AudioContext !== 'undefined') {
                this.audioContext = new AudioContext();
            } else if (typeof webkitAudioContext !== 'undefined') {
                this.audioContext = new webkitAudioContext();
            }
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }

    // Resume audio context (needed for Chrome's autoplay policy)
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.warn('Could not resume audio context:', error);
            }
        }
    }

    // Generate tone using oscillator
    async playTone(frequency, duration, type = 'sine', volume = null) {
        if (!this.enabled || !this.audioContext) return;
        
        await this.resumeContext();
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            const vol = volume !== null ? volume : this.volume;
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(vol, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration - 0.01);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Error playing tone:', error);
        }
    }

    // Play superhero generation sound effect
    async playGenerate() {
        if (!this.enabled) return;
        
        // Heroic rising tone sequence
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        const duration = 0.3;
        
        for (let i = 0; i < notes.length; i++) {
            setTimeout(() => {
                this.playTone(notes[i], duration, 'triangle', this.volume * 0.8);
            }, i * 150);
        }
        
        // Add some sparkle effect
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const freq = 800 + Math.random() * 400;
                    this.playTone(freq, 0.1, 'sine', this.volume * 0.3);
                }, i * 50);
            }
        }, 600);
    }

    // Play success sound
    async playSuccess() {
        if (!this.enabled) return;
        
        // Victory fanfare
        const melody = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
        const duration = 0.25;
        
        for (let i = 0; i < melody.length; i++) {
            setTimeout(() => {
                this.playTone(melody[i], duration, 'triangle', this.volume);
            }, i * 200);
        }
        
        // Add chord at the end
        setTimeout(() => {
            this.playTone(523.25, 0.8, 'triangle', this.volume * 0.6); // C5
            this.playTone(659.25, 0.8, 'triangle', this.volume * 0.4); // E5
            this.playTone(783.99, 0.8, 'triangle', this.volume * 0.4); // G5
        }, 800);
    }

    // Play error sound
    async playError() {
        if (!this.enabled) return;
        
        // Descending error tone
        const notes = [400, 350, 300, 250];
        const duration = 0.2;
        
        for (let i = 0; i < notes.length; i++) {
            setTimeout(() => {
                this.playTone(notes[i], duration, 'sawtooth', this.volume * 0.5);
            }, i * 100);
        }
    }

    // Play button click sound
    async playClick() {
        if (!this.enabled) return;
        
        this.playTone(800, 0.1, 'square', this.volume * 0.3);
        setTimeout(() => {
            this.playTone(1000, 0.05, 'square', this.volume * 0.2);
        }, 50);
    }

    // Play power-up sound
    async playPowerUp() {
        if (!this.enabled) return;
        
        // Rising power-up effect
        let freq = 200;
        const steps = 20;
        const stepDuration = 30;
        
        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                freq += 50;
                this.playTone(freq, 0.08, 'sawtooth', this.volume * 0.4);
            }, i * stepDuration);
        }
    }

    // Play whoosh sound for animations
    async playWhoosh() {
        if (!this.enabled) return;
        
        // Create noise-like effect
        let freq = 800;
        const duration = 0.4;
        const steps = 10;
        
        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                freq -= 60;
                this.playTone(freq + Math.random() * 100, 0.1, 'sawtooth', this.volume * 0.2);
            }, i * 40);
        }
    }

    // Toggle audio on/off
    toggleAudio() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Set volume (0 to 1)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // Play ambient superhero theme
    async playTheme() {
        if (!this.enabled) return;
        
        // Simple heroic chord progression
        const chords = [
            [261.63, 329.63, 392.00], // C major
            [293.66, 369.99, 440.00], // D major
            [329.63, 415.30, 493.88], // E major
            [261.63, 329.63, 392.00]  // C major
        ];
        
        for (let i = 0; i < chords.length; i++) {
            setTimeout(() => {
                chords[i].forEach((freq, index) => {
                    this.playTone(freq, 1.0, 'triangle', this.volume * (0.3 - index * 0.05));
                });
            }, i * 1000);
        }
    }

    // Initialize audio on first user interaction
    static addInteractionListener() {
        const events = ['mousedown', 'keydown', 'touchstart'];
        const initAudio = () => {
            // Remove listeners after first interaction
            events.forEach(event => {
                document.removeEventListener(event, initAudio);
            });
        };
        
        events.forEach(event => {
            document.addEventListener(event, initAudio, { once: true });
        });
    }
}

// Initialize interaction listener when script loads
AudioEffects.addInteractionListener();
