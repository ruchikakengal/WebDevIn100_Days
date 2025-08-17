class AudioSystem {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.enabled = true;
        
        this.initializeAudio();
        this.createSounds();
    }
    
    async initializeAudio() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.context.currentTime);
            document.addEventListener('click', () => this.resumeContext(), { once: true });
            document.addEventListener('keydown', () => this.resumeContext(), { once: true });
            
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }
    
    resumeContext() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
    
    createSounds() {
        if (!this.enabled || !this.context) return;
        
        const soundConfigs = {
            correct: {
                type: 'chord',
                frequencies: [523.25, 659.25, 783.99], 
                duration: 0.3,
                attack: 0.01,
                decay: 0.1,
                sustain: 0.3,
                release: 0.2
            },
            incorrect: {
                type: 'buzz',
                frequency: 220,
                duration: 0.4,
                attack: 0.01,
                decay: 0.05,
                sustain: 0.1,
                release: 0.3
            },
            powerup: {
                type: 'arpeggio',
                frequencies: [261.63, 329.63, 392.00, 523.25], 
                duration: 0.6,
                attack: 0.01,
                decay: 0.1,
                sustain: 0.4,
                release: 0.1
            },
            streak: {
                type: 'sweep',
                startFreq: 440,
                endFreq: 880,
                duration: 0.5,
                attack: 0.01,
                decay: 0.1,
                sustain: 0.3,
                release: 0.1
            },
            winner: {
                type: 'fanfare',
                frequencies: [523.25, 659.25, 783.99, 1046.50],
                duration: 1.0,
                attack: 0.01,
                decay: 0.2,
                sustain: 0.6,
                release: 0.2
            },
            tick: {
                type: 'click',
                frequency: 800,
                duration: 0.1,
                attack: 0.001,
                decay: 0.05,
                sustain: 0.02,
                release: 0.05
            },
            timeWarning: {
                type: 'pulse',
                frequency: 1000,
                duration: 0.2,
                attack: 0.01,
                decay: 0.05,
                sustain: 0.1,
                release: 0.05
            },
            freeze: {
                type: 'ice',
                startFreq: 1200,
                endFreq: 400,
                duration: 0.8,
                attack: 0.01,
                decay: 0.3,
                sustain: 0.2,
                release: 0.3
            },
            double: {
                type: 'sparkle',
                frequencies: [1046.50, 1244.51, 1567.98],
                duration: 0.4,
                attack: 0.01,
                decay: 0.1,
                sustain: 0.2,
                release: 0.1
            },
            extraTime: {
                type: 'time',
                frequency: 440,
                duration: 0.6,
                attack: 0.01,
                decay: 0.1,
                sustain: 0.4,
                release: 0.1
            }
        };
      
        Object.keys(soundConfigs).forEach(soundName => {
            this.sounds[soundName] = soundConfigs[soundName];
        });
    }
    
    createOscillator(frequency, type = 'sine') {
        if (!this.context) return null;
        
        const oscillator = this.context.createOscillator();
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        oscillator.type = type;
        return oscillator;
    }
    
    createEnvelope(gainNode, config, startTime) {
        const { attack, decay, sustain, release, duration } = config;
        const gain = gainNode.gain;
        
        gain.setValueAtTime(0, startTime);
        gain.linearRampToValueAtTime(1, startTime + attack);
        gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
        gain.setValueAtTime(sustain, startTime + duration - release);
        gain.linearRampToValueAtTime(0, startTime + duration);
    }
    
    playSound(soundName, options = {}) {
        if (!this.enabled || !this.context || !this.sounds[soundName]) return;
        
        const config = { ...this.sounds[soundName], ...options };
        const startTime = this.context.currentTime;
        const volume = (options.volume || 1) * this.sfxVolume;
        
        switch (config.type) {
            case 'chord':
                this.playChord(config, startTime, volume);
                break;
            case 'buzz':
                this.playBuzz(config, startTime, volume);
                break;
            case 'arpeggio':
                this.playArpeggio(config, startTime, volume);
                break;
            case 'sweep':
                this.playSweep(config, startTime, volume);
                break;
            case 'fanfare':
                this.playFanfare(config, startTime, volume);
                break;
            case 'click':
                this.playClick(config, startTime, volume);
                break;
            case 'pulse':
                this.playPulse(config, startTime, volume);
                break;
            case 'ice':
                this.playIce(config, startTime, volume);
                break;
            case 'sparkle':
                this.playSparkle(config, startTime, volume);
                break;
            case 'time':
                this.playTime(config, startTime, volume);
                break;
        }
    }
    
    playChord(config, startTime, volume) {
        config.frequencies.forEach((freq, index) => {
            const oscillator = this.createOscillator(freq, 'sine');
            const gainNode = this.context.createGain();
            const filterNode = this.context.createBiquadFilter();
            const noteStartTime = startTime + (index * 0.02);
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(2000, noteStartTime);
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            gainNode.gain.value = volume / config.frequencies.length;
            this.createEnvelope(gainNode, config, noteStartTime);
            
            oscillator.start(noteStartTime);
            oscillator.stop(noteStartTime + config.duration);
        });
    }
    
    playBuzz(config, startTime, volume) {
        const oscillator = this.createOscillator(config.frequency, 'sawtooth');
        const gainNode = this.context.createGain();
        const filterNode = this.context.createBiquadFilter();
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(800, startTime);
        filterNode.Q.setValueAtTime(5, startTime);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        gainNode.gain.value = volume * 0.5;
        this.createEnvelope(gainNode, config, startTime);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + config.duration);
    }
    
    playArpeggio(config, startTime, volume) {
        const noteInterval = config.duration / config.frequencies.length;
        
        config.frequencies.forEach((freq, index) => {
            const noteStartTime = startTime + (index * noteInterval * 0.3);
            const oscillator = this.createOscillator(freq, 'triangle');
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            gainNode.gain.value = volume * 0.6;
            
            const noteConfig = { ...config, duration: noteInterval * 2 };
            this.createEnvelope(gainNode, noteConfig, noteStartTime);
            
            oscillator.start(noteStartTime);
            oscillator.stop(noteStartTime + noteInterval * 2);
        });
    }
    
    playSweep(config, startTime, volume) {
        const oscillator = this.createOscillator(config.startFreq, 'sine');
        const gainNode = this.context.createGain();
        
        oscillator.frequency.setValueAtTime(config.startFreq, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(config.endFreq, startTime + config.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        gainNode.gain.value = volume * 0.7;
        this.createEnvelope(gainNode, config, startTime);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + config.duration);
    }
    
    playFanfare(config, startTime, volume) {
        config.frequencies.forEach((freq, index) => {
            const noteStartTime = startTime + (index * 0.15);
            const oscillator = this.createOscillator(freq, 'triangle');
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            gainNode.gain.value = volume * 0.8;
            this.createEnvelope(gainNode, config, noteStartTime);
            
            oscillator.start(noteStartTime);
            oscillator.stop(noteStartTime + config.duration);
        });
        
        setTimeout(() => {
            config.frequencies.forEach((freq, index) => {
                const harmonyStartTime = startTime + 0.3 + (index * 0.1);
                const oscillator = this.createOscillator(freq * 1.5, 'sine');
                const gainNode = this.context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                gainNode.gain.value = volume * 0.4;
                this.createEnvelope(gainNode, config, harmonyStartTime);
                
                oscillator.start(harmonyStartTime);
                oscillator.stop(harmonyStartTime + config.duration * 0.8);
            });
        }, 300);
    }
    
    playClick(config, startTime, volume) {
        const oscillator = this.createOscillator(config.frequency, 'square');
        const gainNode = this.context.createGain();
        const filterNode = this.context.createBiquadFilter();
        
        filterNode.type = 'highpass';
        filterNode.frequency.setValueAtTime(400, startTime);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        gainNode.gain.value = volume * 0.3;
        this.createEnvelope(gainNode, config, startTime);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + config.duration);
    }
    
    playPulse(config, startTime, volume) {
        for (let i = 0; i < 3; i++) {
            const pulseStart = startTime + (i * 0.1);
            const oscillator = this.createOscillator(config.frequency, 'square');
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            gainNode.gain.value = volume * 0.4;
            this.createEnvelope(gainNode, config, pulseStart);
            
            oscillator.start(pulseStart);
            oscillator.stop(pulseStart + config.duration);
        }
    }
    
    playIce(config, startTime, volume) {
        const oscillator = this.createOscillator(config.startFreq, 'sine');
        const gainNode = this.context.createGain();
        const filterNode = this.context.createBiquadFilter();
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(2000, startTime);
        filterNode.frequency.exponentialRampToValueAtTime(400, startTime + config.duration);
        
        oscillator.frequency.setValueAtTime(config.startFreq, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(config.endFreq, startTime + config.duration);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        gainNode.gain.value = volume * 0.6;
        this.createEnvelope(gainNode, config, startTime);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + config.duration);
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                const overtoneStart = startTime + (i * 0.1);
                const overtone = this.createOscillator(800 + (i * 200), 'triangle');
                const overtoneGain = this.context.createGain();
                
                overtone.connect(overtoneGain);
                overtoneGain.connect(this.masterGain);
                
                overtoneGain.gain.value = volume * 0.1;
                
                const overtoneConfig = { ...config, duration: 0.2 };
                this.createEnvelope(overtoneGain, overtoneConfig, overtoneStart);
                
                overtone.start(overtoneStart);
                overtone.stop(overtoneStart + 0.2);
            }
        }, 100);
    }
    
    playSparkle(config, startTime, volume) {
        config.frequencies.forEach((freq, index) => {
            const sparkleStart = startTime + (index * 0.05);
            const oscillator = this.createOscillator(freq, 'sine');
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            gainNode.gain.value = volume * 0.3;
            this.createEnvelope(gainNode, config, sparkleStart);
            
            oscillator.start(sparkleStart);
            oscillator.stop(sparkleStart + config.duration);
        });
    }
    
    playTime(config, startTime, volume) {
        for (let i = 0; i < 3; i++) {
            const tickStart = startTime + (i * 0.2);
            const frequency = i % 2 === 0 ? config.frequency : config.frequency * 1.2;
            
            const oscillator = this.createOscillator(frequency, 'square');
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            gainNode.gain.value = volume * 0.5;
            
            const tickConfig = { ...config, duration: 0.1 };
            this.createEnvelope(gainNode, tickConfig, tickStart);
            
            oscillator.start(tickStart);
            oscillator.stop(tickStart + 0.1);
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.context.currentTime);
        }
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    playCorrectAnswer(playerColor) {
        this.playSound('correct', { 
            volume: 0.8,
            playerColor: playerColor 
        });
    }
    
    playIncorrectAnswer() {
        this.playSound('incorrect', { volume: 0.6 });
    }
    
    playStreak(streakCount) {
        this.playSound('streak', { 
            volume: Math.min(1.0, 0.4 + (streakCount * 0.1)) 
        });
    }
    
    playPowerupActivated(powerupType) {
        const soundMap = {
            'double': 'double',
            'time': 'extraTime',
            'freeze': 'freeze'
        };
        
        this.playSound(soundMap[powerupType] || 'powerup', { volume: 0.7 });
    }
    
    playWinner() {
        this.playSound('winner', { volume: 0.9 });
    }
    
    playTick() {
        this.playSound('tick', { volume: 0.3 });
    }
    
    playTimeWarning() {
        this.playSound('timeWarning', { volume: 0.5 });
    }
}

window.AudioSystem = AudioSystem;