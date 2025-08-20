class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.masterVolume = 0.3;
        
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            this.generateSounds();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }

    generateSounds() {
        this.sounds.shoot = this.generateLaserSound();
        this.sounds.explosion = this.generateExplosionSound();
        this.sounds.enemyHit = this.generateHitSound();
        this.sounds.playerHit = this.generatePlayerHitSound();
        this.sounds.powerup = this.generatePowerupSound();
        this.sounds.bossWarning = this.generateBossWarningSound();
        this.sounds.levelUp = this.generateLevelUpSound();
        this.sounds.combo = this.generateComboSound();
        this.sounds.specialWeapon = this.generateSpecialWeaponSound();
        this.sounds.shield = this.generateShieldSound();
    }

    generateLaserSound() {
        const duration = 0.1;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 800 - (t * 400); 
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 10) * 0.3;
        }
        
        return buffer;
    }

    generateExplosionSound() {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const noise = (Math.random() - 0.5) * 2;
            const rumble = Math.sin(2 * Math.PI * 60 * t);
            const envelope = Math.exp(-t * 3);
            data[i] = (noise * 0.7 + rumble * 0.3) * envelope * 0.4;
        }
        
        return buffer;
    }

    generateHitSound() {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 200;
            const envelope = Math.exp(-t * 15);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        
        return buffer;
    }

    generatePlayerHitSound() {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 150 - (t * 50);
            const envelope = Math.exp(-t * 2);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
        }
        
        return buffer;
    }

    generatePowerupSound() {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 200 + (t * 400);
            const envelope = Math.exp(-t * 2);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        
        return buffer;
    }

    generateBossWarningSound() {
        const duration = 1.5;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 100 + Math.sin(t * 10) * 50;
            const envelope = Math.sin(t * Math.PI / duration) * Math.exp(-t * 0.5);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.6;
        }
        
        return buffer;
    }

    generateLevelUpSound() {
        const duration = 1.0;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 400 + (t * 400);
            const envelope = Math.exp(-t * 1.5);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.4;
        }
        
        return buffer;
    }

    generateComboSound() {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 600 + Math.sin(t * 20) * 100;
            const envelope = Math.exp(-t * 8);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        
        return buffer;
    }

    generateSpecialWeaponSound() {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 300 + Math.sin(t * 50) * 200;
            const envelope = Math.exp(-t * 3);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.5;
        }
        
        return buffer;
    }

    generateShieldSound() {
        const duration = 0.8;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const frequency = 250 + Math.sin(t * 15) * 50;
            const envelope = Math.exp(-t * 2);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.4;
        }
        
        return buffer;
    }

    playSound(soundName, volume = 1) {
        if (!this.enabled || !this.sounds[soundName] || !this.audioContext) {
            return;
        }

        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[soundName];
            gainNode.gain.value = volume;
            
            source.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            source.start();
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }

    toggleMute() {
        this.enabled = !this.enabled;
        if (this.masterGain) {
            this.masterGain.gain.value = this.enabled ? this.masterVolume : 0;
        }
    }
}

const audioManager = new AudioManager();
