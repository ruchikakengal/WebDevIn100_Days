class AudioManager {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.masterVolume = 1.0;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.5;
        this.muted = false;
        this.audioContext = null;
        this.initialized = false;
        
        console.log('Audio manager created');
        this.initializeAudio();
    }
    
    async initializeAudio() {
        try {
            // Create audio context (requires user interaction)
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Load sound effects
            await this.loadSounds();
            this.initialized = true;
            console.log('Audio system initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            // Fallback to basic HTML5 audio
            this.initializeBasicAudio();
        }
    }
    
    initializeBasicAudio() {
        try {
            // Create basic HTML5 audio elements
            this.sounds = {
                jump: this.createAudioElement('/sounds/jump.mp3'),
                coin: this.createAudioElement('/sounds/coin.mp3'),
                hit: this.createAudioElement('/sounds/hit.mp3'),
                enemyDefeat: this.createAudioElement('/sounds/enemy-defeat.mp3'),
                powerUp: this.createAudioElement('/sounds/success.mp3'),
                success: this.createAudioElement('/sounds/success.mp3')
            };
            
            // Background music
            this.backgroundMusic = this.createAudioElement('/sounds/background-music.mp3');
            if (this.backgroundMusic) {
                this.backgroundMusic.loop = true;
                this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
            }
            
            this.initialized = true;
            console.log('Basic audio system initialized');
        } catch (error) {
            console.warn('Basic audio initialization failed:', error);
            this.initializeSilentAudio();
        }
    }
    
    initializeSilentAudio() {
        // Create silent fallbacks with better sound effects using Web Audio API
        console.log('Creating synthesized audio effects...');
        
        this.sounds = {
            jump: { play: () => this.playJumpBeep(), stop: () => {} },
            coin: { play: () => this.playCoinBeep(), stop: () => {} },
            hit: { play: () => this.playHitBeep(), stop: () => {} },
            enemyDefeat: { play: () => this.playDefeatBeep(), stop: () => {} },
            powerUp: { play: () => this.playPowerUpBeep(), stop: () => {} },
            success: { play: () => this.playSuccessBeep(), stop: () => {} }
        };
        
        this.backgroundMusic = { 
            play: () => console.log('🎵 Background music playing'),
            pause: () => console.log('🎵 Background music paused'),
            stop: () => console.log('🎵 Background music stopped')
        };
        
        this.initialized = true;
    }

    // Synthesized sound effects using Web Audio API
    createBeep(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.log('🎵 Beep sound effect');
        }
    }

    playJumpBeep() {
        this.createBeep(220, 0.15);
        setTimeout(() => this.createBeep(330, 0.1), 50);
    }

    playCoinBeep() {
        this.createBeep(800, 0.1);
        setTimeout(() => this.createBeep(1000, 0.1), 50);
        setTimeout(() => this.createBeep(1200, 0.15), 100);
    }

    playHitBeep() {
        this.createBeep(150, 0.3, 'square');
    }

    playDefeatBeep() {
        this.createBeep(440, 0.1);
        setTimeout(() => this.createBeep(350, 0.1), 50);
        setTimeout(() => this.createBeep(250, 0.2), 100);
    }

    playPowerUpBeep() {
        this.createBeep(400, 0.1);
        setTimeout(() => this.createBeep(500, 0.1), 80);
        setTimeout(() => this.createBeep(600, 0.1), 160);
        setTimeout(() => this.createBeep(800, 0.2), 240);
    }

    playSuccessBeep() {
        this.createBeep(523, 0.2); // C
        setTimeout(() => this.createBeep(659, 0.2), 150); // E
        setTimeout(() => this.createBeep(784, 0.3), 300); // G
    }
    
    createAudioElement(src) {
        try {
            const audio = new Audio();
            audio.src = src;
            audio.preload = 'auto';
            audio.volume = this.sfxVolume * this.masterVolume;
            
            // Handle loading errors gracefully
            audio.onerror = () => {
                console.warn(`Failed to load audio: ${src}`);
            };
            
            return audio;
        } catch (error) {
            console.warn(`Failed to create audio element for ${src}:`, error);
            return null;
        }
    }
    
    async loadSounds() {
        const soundFiles = {
            jump: '/sounds/jump.mp3',
            coin: '/sounds/coin.mp3',
            hit: '/sounds/hit.mp3',
            enemyDefeat: '/sounds/enemy-defeat.mp3',
            powerUp: '/sounds/success.mp3',
            success: '/sounds/success.mp3'
        };
        
        // Use existing sounds from the project
        const existingSounds = {
            jump: '/sounds/hit.mp3', // Repurpose hit sound for jump
            coin: '/sounds/success.mp3', // Use success for coin
            hit: '/sounds/hit.mp3',
            enemyDefeat: '/sounds/hit.mp3', // Use hit sound for enemy defeat
            powerUp: '/sounds/success.mp3',
            success: '/sounds/success.mp3'
        };
        
        for (const [name, src] of Object.entries(existingSounds)) {
            try {
                this.sounds[name] = this.createAudioElement(src);
            } catch (error) {
                console.warn(`Failed to load ${name}:`, error);
                this.sounds[name] = null;
            }
        }
        
        // Load background music
        try {
            this.backgroundMusic = this.createAudioElement('/sounds/background.mp3');
            if (this.backgroundMusic) {
                this.backgroundMusic.loop = true;
                this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
            }
        } catch (error) {
            console.warn('Failed to load background music:', error);
        }
    }
    
    playSound(soundName, volume = 1.0) {
        if (this.muted || !this.initialized) return;
        
        const sound = this.sounds[soundName];
        if (sound && sound.play) {
            try {
                // Reset sound to beginning for overlapping sounds
                sound.currentTime = 0;
                sound.volume = this.sfxVolume * this.masterVolume * volume;
                sound.play().catch(error => {
                    console.warn(`Failed to play sound ${soundName}:`, error);
                });
            } catch (error) {
                console.warn(`Error playing sound ${soundName}:`, error);
            }
        }
    }
    
    playJump() {
        this.playSound('jump', 0.8);
    }
    
    playCoin() {
        this.playSound('coin', 0.6);
    }
    
    playHit() {
        this.playSound('hit', 1.0);
    }
    
    playEnemyDefeat() {
        this.playSound('enemyDefeat', 0.7);
    }
    
    playPowerUp() {
        this.playSound('powerUp', 0.8);
    }
    
    playSuccess() {
        this.playSound('success', 1.0);
    }
    
    playBackgroundMusic() {
        if (this.muted || !this.backgroundMusic) return;
        
        try {
            this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
            this.backgroundMusic.play().catch(error => {
                console.warn('Failed to play background music:', error);
            });
        } catch (error) {
            console.warn('Error starting background music:', error);
        }
    }
    
    pauseBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.pause) {
            this.backgroundMusic.pause();
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            if (this.backgroundMusic.pause) {
                this.backgroundMusic.pause();
            }
            if (this.backgroundMusic.currentTime !== undefined) {
                this.backgroundMusic.currentTime = 0;
            }
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.updateSFXVolumes();
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic && this.backgroundMusic.volume !== undefined) {
            this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    updateAllVolumes() {
        this.updateSFXVolumes();
        if (this.backgroundMusic && this.backgroundMusic.volume !== undefined) {
            this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    updateSFXVolumes() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && sound.volume !== undefined) {
                sound.volume = this.sfxVolume * this.masterVolume;
            }
        });
    }
    
    toggleMute() {
        this.muted = !this.muted;
        
        if (this.muted) {
            this.pauseBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
        
        console.log(`Audio ${this.muted ? 'muted' : 'unmuted'}`);
        return this.muted;
    }
    
    isMuted() {
        return this.muted;
    }
    
    // Enable audio after user interaction (required by browsers)
    enableAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('Audio context resumed');
            });
        }
    }
}
