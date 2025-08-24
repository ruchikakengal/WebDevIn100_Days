/**
 * Audio Manager
 * Handles text-to-speech narration
 */

class AudioManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.settings = {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            voice: null
        };

        this.init();
    }

    init() {
        if (!this.synth) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Load voices
        this.loadVoices();

        // Listen for voices changed event
        this.synth.addEventListener('voiceschanged', () => {
            this.loadVoices();
        });
    }

    loadVoices() {
        this.voices = this.synth.getVoices();

        // Try to select a good default voice
        if (this.voices.length > 0 && !this.settings.voice) {
            // Prefer English voices
            const englishVoices = this.voices.filter(voice =>
                voice.lang.startsWith('en')
            );

            this.settings.voice = englishVoices.length > 0
                ? englishVoices[0]
                : this.voices[0];
        }
    }

    speak(text) {
        if (!this.synth || !text) return;

        // Stop any current speech
        this.stop();

        // Create utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);

        // Apply settings
        this.currentUtterance.rate = this.settings.rate;
        this.currentUtterance.pitch = this.settings.pitch;
        this.currentUtterance.volume = this.settings.volume;

        if (this.settings.voice) {
            this.currentUtterance.voice = this.settings.voice;
        }

        // Event listeners
        this.currentUtterance.onstart = () => {
            console.log('Speech started');
        };

        this.currentUtterance.onend = () => {
            console.log('Speech ended');
            this.currentUtterance = null;
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech error:', event.error);
            this.currentUtterance = null;
        };

        // Speak
        this.synth.speak(this.currentUtterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.currentUtterance = null;
        }
    }

    pause() {
        if (this.synth) {
            this.synth.pause();
        }
    }

    resume() {
        if (this.synth) {
            this.synth.resume();
        }
    }

    isSpeaking() {
        return this.synth ? this.synth.speaking : false;
    }

    isPaused() {
        return this.synth ? this.synth.paused : false;
    }

    setRate(rate) {
        this.settings.rate = Math.max(0.1, Math.min(10, rate));
    }

    setPitch(pitch) {
        this.settings.pitch = Math.max(0, Math.min(2, pitch));
    }

    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
    }

    setVoice(voiceName) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            this.settings.voice = voice;
        }
    }

    getVoices() {
        return this.voices.map(voice => ({
            name: voice.name,
            lang: voice.lang,
            localService: voice.localService,
            default: voice.default
        }));
    }

    getSettings() {
        return { ...this.settings };
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    isSupported() {
        return !!this.synth;
    }
}

window.AudioManager = AudioManager;