// Audio Manager for EduPlay
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3;
        this.init();
    }

    async init() {
        try {
            // Initialize Web Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Load sound definitions
            this.loadSoundDefinitions();
            
            // Handle audio context state
            this.handleAudioContextState();
            
            console.log('Audio Manager initialized successfully');
        } catch (error) {
            console.warn('Audio not available:', error);
            this.enabled = false;
        }
    }

    handleAudioContextState() {
        if (this.audioContext.state === 'suspended') {
            // Audio context might be suspended due to autoplay policy
            document.addEventListener('click', () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('Audio context resumed');
                    });
                }
            }, { once: true });
        }
    }

    loadSoundDefinitions() {
        // Import sound definitions from assets/sounds.js
        if (typeof soundDefinitions !== 'undefined') {
            this.sounds = soundDefinitions;
        } else {
            console.warn('Sound definitions not loaded');
        }
    }

    playSound(soundName) {
        if (!this.enabled || !this.audioContext || !this.sounds[soundName]) {
            return;
        }

        try {
            const soundDef = this.sounds[soundName];
            
            switch (soundDef.type) {
                case 'tone':
                    this.playTone(soundDef);
                    break;
                case 'chord':
                    this.playChord(soundDef);
                    break;
                case 'sequence':
                    this.playSequence(soundDef);
                    break;
                case 'noise':
                    this.playNoise(soundDef);
                    break;
                default:
                    console.warn('Unknown sound type:', soundDef.type);
            }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    playTone(soundDef) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configure oscillator
        oscillator.frequency.setValueAtTime(soundDef.frequency, this.audioContext.currentTime);
        oscillator.type = soundDef.waveType || 'sine';
        
        // Configure gain (volume)
        const startTime = this.audioContext.currentTime;
        const duration = soundDef.duration || 0.2;
        const volume = (soundDef.volume || 1) * this.volume;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        // Start and stop
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    playChord(soundDef) {
        soundDef.frequencies.forEach((frequency, index) => {
            setTimeout(() => {
                const toneConfig = {
                    type: 'tone',
                    frequency: frequency,
                    duration: soundDef.duration || 0.3,
                    volume: (soundDef.volume || 1) * 0.7, // Reduce volume for chords
                    waveType: soundDef.waveType || 'sine'
                };
                this.playTone(toneConfig);
            }, (soundDef.stagger || 0) * index);
        });
    }

    playSequence(soundDef) {
        soundDef.notes.forEach((note, index) => {
            setTimeout(() => {
                const toneConfig = {
                    type: 'tone',
                    frequency: note.frequency,
                    duration: note.duration || 0.15,
                    volume: (note.volume || soundDef.volume || 1) * this.volume,
                    waveType: soundDef.waveType || 'sine'
                };
                this.playTone(toneConfig);
            }, note.delay || (index * 150));
        });
    }

    playNoise(soundDef) {
        const bufferSize = this.audioContext.sampleRate * (soundDef.duration || 0.1);
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (soundDef.volume || 0.3) * this.volume;
        }
        
        // Apply filtering if specified
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        
        let destination = this.audioContext.destination;
        
        if (soundDef.filterType) {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = soundDef.filterType;
            filter.frequency.setValueAtTime(soundDef.filterFrequency || 1000, this.audioContext.currentTime);
            
            source.connect(filter);
            filter.connect(destination);
        } else {
            source.connect(destination);
        }
        
        source.start();
    }

    // Utility method to play a simple beep
    beep(frequency = 800, duration = 0.2, volume = 0.3) {
        this.playTone({
            frequency: frequency,
            duration: duration,
            volume: volume,
            waveType: 'sine'
        });
    }

    // Create musical note frequencies
    static noteToFrequency(note, octave = 4) {
        const noteFrequencies = {
            'C': 261.63,
            'C#': 277.18,
            'D': 293.66,
            'D#': 311.13,
            'E': 329.63,
            'F': 349.23,
            'F#': 369.99,
            'G': 392.00,
            'G#': 415.30,
            'A': 440.00,
            'A#': 466.16,
            'B': 493.88
        };
        
        const baseFreq = noteFrequencies[note.toUpperCase()];
        if (!baseFreq) return 440; // Default to A4
        
        return baseFreq * Math.pow(2, octave - 4);
    }

    // Enable/disable audio
    setEnabled(enabled) {
        this.enabled = enabled;
        
        // Save preference
        if (typeof storage !== 'undefined') {
            storage.save('audioEnabled', enabled);
        }
    }

    // Set volume (0.0 to 1.0)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Save preference
        if (typeof storage !== 'undefined') {
            storage.save('audioVolume', this.volume);
        }
    }

    // Load saved preferences
    loadPreferences() {
        if (typeof storage !== 'undefined') {
            const savedEnabled = storage.get('audioEnabled');
            const savedVolume = storage.get('audioVolume');
            
            if (savedEnabled !== null) {
                this.enabled = savedEnabled;
            }
            
            if (savedVolume !== null) {
                this.volume = savedVolume;
            }
        }
    }

    // Get current state
    getState() {
        return {
            enabled: this.enabled,
            volume: this.volume,
            contextState: this.audioContext ? this.audioContext.state : 'unavailable'
        };
    }

    // Test audio system
    test() {
        console.log('Testing audio system...');
        console.log('Audio state:', this.getState());
        
        if (this.enabled) {
            this.playSound('correct');
            setTimeout(() => this.playSound('incorrect'), 500);
            setTimeout(() => this.playSound('gameStart'), 1000);
            setTimeout(() => this.playSound('gameComplete'), 1500);
        }
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();

// Load preferences when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    audioManager.loadPreferences();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
