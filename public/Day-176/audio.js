// Audio Manager for Sound Effects and Music
class AudioManager {
    constructor() {
        this.soundEnabled = true;
        this.audioContext = null;
        this.sounds = {};
        this.masterVolume = 0.7;
        this.soundVolume = 0.5;
        this.musicVolume = 0.3;
        
        this.init();
    }
    
    init() {
        // Check for saved sound preference
        const savedSoundSetting = localStorage.getItem('soundEnabled');
        if (savedSoundSetting !== null) {
            this.soundEnabled = JSON.parse(savedSoundSetting);
        }
        
        // Initialize Web Audio API
        this.initializeAudioContext();
        
        // Preload sound effects
        this.preloadSounds();
        
        console.log("🔊 Audio Manager initialized");
    }
    
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume audio context on user interaction (required by browsers)
            const resumeAudio = () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                document.removeEventListener('click', resumeAudio);
                document.removeEventListener('keydown', resumeAudio);
            };
            
            document.addEventListener('click', resumeAudio);
            document.addEventListener('keydown', resumeAudio);
        } catch (error) {
            console.warn("Web Audio API not supported:", error);
        }
    }
    
    preloadSounds() {
        // Generate sound effects using Web Audio API
        this.sounds = {
            start: this.createTone(440, 0.3, 'sine'),
            success: this.createSuccessSound(),
            error: this.createErrorSound(),
            advance: this.createAdvanceSound(),
            navigate: this.createNavigateSound(),
            place: this.createPlaceSound(),
            hint: this.createHintSound(),
            reveal: this.createRevealSound(),
            reset: this.createResetSound(),
            morse_dot: this.createTone(800, 0.1, 'sine'),
            morse_dash: this.createTone(800, 0.3, 'sine')
        };
    }
    
    createTone(frequency, duration, waveform = 'sine') {
        if (!this.audioContext) return null;
        
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveform;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * this.masterVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createSuccessSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Triumphant ascending chord
            const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
            const duration = 0.8;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'triangle';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * this.masterVolume * 0.8, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                }, index * 100);
            });
        };
    }
    
    createErrorSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Descending dissonant sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * this.masterVolume * 0.6, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        };
    }
    
    createAdvanceSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Upward sweep with echo effect
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const delay = this.audioContext.createDelay();
            const feedback = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(delay);
            gainNode.connect(this.audioContext.destination);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(this.audioContext.destination);
            
            delay.delayTime.setValueAtTime(0.2, this.audioContext.currentTime);
            feedback.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            
            oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.6);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * this.masterVolume * 0.7, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.6);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.6);
        };
    }
    
    createNavigateSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Quick blip sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }
    
    createPlaceSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Soft click sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        };
    }
    
    createHintSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Magical bell sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1320, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(660, this.audioContext.currentTime + 0.8);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * this.masterVolume * 0.6, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.8);
        };
    }
    
    createRevealSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Mysterious reveal sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 1.0);
            
            oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.soundVolume * this.masterVolume * 0.5, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.0);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 1.0);
        };
    }
    
    createResetSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Descending scale
            const notes = [880, 784, 698, 659, 587, 523];
            
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.type = 'triangle';
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.soundVolume * this.masterVolume * 0.4, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                }, index * 100);
            });
        };
    }
    
    playSound(soundName) {
        if (!this.soundEnabled || !this.sounds[soundName]) {
            return;
        }
        
        try {
            this.sounds[soundName]();
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }
    
    playMorseSequence(morseCode, onSymbol = null) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const dotDuration = 100; // ms
        const dashDuration = 300; // ms
        const symbolGap = 100; // ms
        const letterGap = 300; // ms
        const wordGap = 700; // ms
        
        let currentTime = 0;
        
        for (let i = 0; i < morseCode.length; i++) {
            const symbol = morseCode[i];
            
            if (symbol === '.') {
                setTimeout(() => {
                    this.sounds.morse_dot();
                    if (onSymbol) onSymbol('.');
                }, currentTime);
                currentTime += dotDuration + symbolGap;
            } else if (symbol === '-') {
                setTimeout(() => {
                    this.sounds.morse_dash();
                    if (onSymbol) onSymbol('-');
                }, currentTime);
                currentTime += dashDuration + symbolGap;
            } else if (symbol === ' ') {
                setTimeout(() => {
                    if (onSymbol) onSymbol(' ');
                }, currentTime);
                currentTime += letterGap;
            } else if (symbol === '/') {
                setTimeout(() => {
                    if (onSymbol) onSymbol(' / ');
                }, currentTime);
                currentTime += wordGap;
            }
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', JSON.stringify(this.soundEnabled));
        
        if (this.soundEnabled) {
            this.playSound('navigate');
        }
        
        console.log(`🔊 Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('masterVolume', this.masterVolume.toString());
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('soundVolume', this.soundVolume.toString());
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('musicVolume', this.musicVolume.toString());
    }
    
    // Ambient Background Music
    createAmbientMusic() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        // Create a subtle ambient drone
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Low frequency drone
        oscillator1.frequency.setValueAtTime(55, this.audioContext.currentTime); // A1
        oscillator1.type = 'sine';
        
        // Higher harmonic
        oscillator2.frequency.setValueAtTime(165, this.audioContext.currentTime); // E3
        oscillator2.type = 'triangle';
        
        // Low pass filter for warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        filter.Q.setValueAtTime(1, this.audioContext.currentTime);
        
        // Very low volume for ambient effect
        gainNode.gain.setValueAtTime(this.musicVolume * this.masterVolume * 0.1, this.audioContext.currentTime);
        
        oscillator1.start();
        oscillator2.start();
        
        // Store references for later control
        this.ambientOscillators = [oscillator1, oscillator2];
        this.ambientGain = gainNode;
        
        return {
            stop: () => {
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
                setTimeout(() => {
                    oscillator1.stop();
                    oscillator2.stop();
                }, 2000);
            }
        };
    }
    
    // Sound visualization (for debugging/development)
    analyzeAudio() {
        if (!this.audioContext) return null;
        
        const analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        return {
            analyser: analyser,
            dataArray: new Uint8Array(analyser.frequencyBinCount),
            getFrequencyData: function() {
                this.analyser.getByteFrequencyData(this.dataArray);
                return this.dataArray;
            }
        };
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
