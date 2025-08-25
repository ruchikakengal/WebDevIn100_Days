// Narration Manager - Handles text-to-speech functionality
class NarrationManager {
    constructor() {
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isNarrating = false;
        this.isPaused = false;
        this.voices = [];
        this.settings = {
            voice: null,
            rate: 1.0,
            pitch: 1.0,
            volume: 0.8,
            lang: 'en-US'
        };
        this.eventListeners = {};
        this.queue = [];
        this.autoRetry = true;
        this.maxRetries = 3;
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }

    async init(settings = {}) {
        // Check for speech synthesis support
        if (!this.speechSynthesis) {
            console.warn('Speech synthesis not supported in this browser');
            return false;
        }

        // Update settings
        this.settings = { ...this.settings, ...settings };

        // Load available voices
        await this.loadVoices();
        
        // Set up event listeners
        this.setupEventListeners();

        console.log('Narration Manager initialized');
        return true;
    }

    async loadVoices() {
        return new Promise((resolve) => {
            // Voices may not be immediately available
            const loadVoicesImpl = () => {
                this.voices = this.speechSynthesis.getVoices();
                
                if (this.voices.length === 0) {
                    // Try again after a short delay
                    setTimeout(loadVoicesImpl, 100);
                    return;
                }

                // Filter and sort voices
                this.processVoices();
                this.populateVoiceSelect();
                resolve();
            };

            // Some browsers fire voiceschanged event
            if (this.speechSynthesis.onvoiceschanged !== undefined) {
                this.speechSynthesis.onvoiceschanged = loadVoicesImpl;
            }

            loadVoicesImpl();
        });
    }

    processVoices() {
        // Filter for English voices and sort by quality
        this.voices = this.voices.filter(voice => 
            voice.lang.startsWith('en')
        ).sort((a, b) => {
            // Prefer local voices over remote
            if (a.localService && !b.localService) return -1;
            if (!a.localService && b.localService) return 1;
            
            // Prefer voices with better names
            const qualityNames = ['premium', 'enhanced', 'high', 'natural'];
            const aQuality = qualityNames.some(q => a.name.toLowerCase().includes(q));
            const bQuality = qualityNames.some(q => b.name.toLowerCase().includes(q));
            
            if (aQuality && !bQuality) return -1;
            if (!aQuality && bQuality) return 1;
            
            return a.name.localeCompare(b.name);
        });

        // Set default voice if not already set
        if (!this.settings.voice && this.voices.length > 0) {
            this.settings.voice = this.voices[0].name;
        }
    }

    populateVoiceSelect() {
        const voiceSelect = document.getElementById('voice-select');
        if (!voiceSelect) return;

        voiceSelect.innerHTML = '';
        
        this.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            
            if (voice.localService) {
                option.textContent += ' - Local';
            }
            
            voiceSelect.appendChild(option);
        });

        // Set current voice
        if (this.settings.voice) {
            voiceSelect.value = this.settings.voice;
        }
    }

    setupEventListeners() {
        // Handle browser events that might interrupt speech
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isNarrating) {
                this.pause();
            }
        });

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.stop();
        });
    }

    narrate(text, options = {}) {
        if (!text || !text.trim()) {
            console.warn('No text provided for narration');
            return false;
        }

        // Stop current narration
        this.stop();

        // Clean text for better speech
        const cleanText = this.preprocessText(text);
        
        // Create utterance
        this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
        
        // Apply settings
        this.applyNarrationSettings(this.currentUtterance, options);
        
        // Set up utterance events
        this.setupUtteranceEvents(this.currentUtterance);
        
        // Start narration
        this.isNarrating = true;
        this.isPaused = false;
        
        try {
            this.speechSynthesis.speak(this.currentUtterance);
            this.emit('started', { text: cleanText });
            return true;
        } catch (error) {
            console.error('Error starting narration:', error);
            this.isNarrating = false;
            this.emit('error', { error });
            return false;
        }
    }

    preprocessText(text) {
        // Remove HTML tags
        let cleanText = text.replace(/<[^>]*>/g, ' ');
        
        // Handle special characters and formatting
        cleanText = cleanText
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Ensure pauses between sentences
            .replace(/\n\n+/g, '. ') // Convert paragraph breaks to pauses
            .replace(/([a-z])([A-Z])/g, '$1. $2') // Add pauses for camelCase
            .trim();

        // Handle character names and special terms
        cleanText = this.handleSpecialTerms(cleanText);
        
        return cleanText;
    }

    handleSpecialTerms(text) {
        // Dictionary of special pronunciations
        const pronunciationMap = {
            'AI': 'A I',
            'UI': 'U I',
            'API': 'A P I',
            'URL': 'U R L',
            'HTML': 'H T M L',
            'CSS': 'C S S',
            'JS': 'JavaScript'
        };

        let processedText = text;
        
        Object.entries(pronunciationMap).forEach(([term, pronunciation]) => {
            const regex = new RegExp(`\\b${term}\\b`, 'g');
            processedText = processedText.replace(regex, pronunciation);
        });

        return processedText;
    }

    applyNarrationSettings(utterance, options = {}) {
        // Apply voice
        const voiceName = options.voice || this.settings.voice;
        if (voiceName) {
            const voice = this.voices.find(v => v.name === voiceName);
            if (voice) {
                utterance.voice = voice;
            }
        }

        // Apply other settings
        utterance.rate = options.rate || this.settings.rate;
        utterance.pitch = options.pitch || this.settings.pitch;
        utterance.volume = options.volume || this.settings.volume;
        utterance.lang = options.lang || this.settings.lang;
    }

    setupUtteranceEvents(utterance) {
        utterance.onstart = () => {
            this.emit('started');
        };

        utterance.onend = () => {
            this.isNarrating = false;
            this.isPaused = false;
            this.currentUtterance = null;
            this.emit('finished');
            this.processQueue();
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isNarrating = false;
            this.emit('error', { error: event.error });
            
            // Auto-retry on certain errors
            if (this.autoRetry && this.shouldRetry(event.error)) {
                this.retryNarration(utterance.text);
            }
        };

        utterance.onpause = () => {
            this.isPaused = true;
            this.emit('paused');
        };

        utterance.onresume = () => {
            this.isPaused = false;
            this.emit('resumed');
        };

        utterance.onboundary = (event) => {
            this.emit('boundary', { 
                charIndex: event.charIndex,
                charLength: event.charLength,
                name: event.name
            });
        };
    }

    shouldRetry(error) {
        const retryableErrors = ['network', 'not-allowed', 'interrupted'];
        return retryableErrors.includes(error);
    }

    retryNarration(text, retryCount = 0) {
        if (retryCount >= this.maxRetries) {
            console.error('Max retry attempts reached for narration');
            return;
        }

        setTimeout(() => {
            console.log(`Retrying narration (attempt ${retryCount + 1})`);
            if (!this.narrate(text)) {
                this.retryNarration(text, retryCount + 1);
            }
        }, 1000 * (retryCount + 1)); // Exponential backoff
    }

    pause() {
        if (this.isNarrating && !this.isPaused) {
            try {
                this.speechSynthesis.pause();
                this.isPaused = true;
                return true;
            } catch (error) {
                console.error('Error pausing narration:', error);
                return false;
            }
        }
        return false;
    }

    resume() {
        if (this.isPaused) {
            try {
                this.speechSynthesis.resume();
                this.isPaused = false;
                return true;
            } catch (error) {
                console.error('Error resuming narration:', error);
                return false;
            }
        }
        return false;
    }

    stop() {
        if (this.isNarrating) {
            try {
                this.speechSynthesis.cancel();
                this.isNarrating = false;
                this.isPaused = false;
                this.currentUtterance = null;
                this.emit('stopped');
                return true;
            } catch (error) {
                console.error('Error stopping narration:', error);
                return false;
            }
        }
        return false;
    }

    // Queue management for multiple text segments
    addToQueue(text, options = {}) {
        this.queue.push({ text, options });
        
        if (!this.isNarrating) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length > 0 && !this.isNarrating) {
            const next = this.queue.shift();
            this.narrate(next.text, next.options);
        }
    }

    clearQueue() {
        this.queue = [];
    }

    // Settings management
    updateVoice(voiceName) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            this.settings.voice = voiceName;
            this.emit('settingsChanged', { voice: voiceName });
            return true;
        }
        return false;
    }

    updateRate(rate) {
        this.settings.rate = Math.max(0.1, Math.min(10, rate));
        this.emit('settingsChanged', { rate: this.settings.rate });
    }

    updatePitch(pitch) {
        this.settings.pitch = Math.max(0, Math.min(2, pitch));
        this.emit('settingsChanged', { pitch: this.settings.pitch });
    }

    updateVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        this.emit('settingsChanged', { volume: this.settings.volume });
    }

    // Advanced features
    narrateWithHighlighting(text, element) {
        // This would highlight text as it's being spoken
        const words = text.split(' ');
        let currentWordIndex = 0;
        
        const utterance = new SpeechSynthesisUtterance(text);
        this.applyNarrationSettings(utterance);
        
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                this.highlightWord(element, currentWordIndex);
                currentWordIndex++;
            }
        };

        this.currentUtterance = utterance;
        this.isNarrating = true;
        this.speechSynthesis.speak(utterance);
    }

    highlightWord(element, wordIndex) {
        // Remove previous highlights
        element.querySelectorAll('.word-highlight').forEach(el => {
            el.classList.remove('word-highlight');
        });

        // Add highlight to current word
        const words = element.textContent.split(' ');
        if (words[wordIndex]) {
            // This is a simplified implementation
            // In practice, you'd need more sophisticated word tracking
        }
    }

    // Utility methods
    isSupported() {
        return !!this.speechSynthesis;
    }

    isNarrating() {
        return this.isNarrating;
    }

    isPaused() {
        return this.isPaused;
    }

    getVoices() {
        return this.voices;
    }

    getSettings() {
        return { ...this.settings };
    }

    // Testing and debugging
    testVoice(voiceName = null) {
        const testText = "Hello! This is a test of the narration system. How does this voice sound?";
        this.narrate(testText, { voice: voiceName });
    }

    // Speed reading mode
    enableSpeedReading(wpm = 200) {
        // Calculate rate based on words per minute
        const averageWPM = 150; // Average speaking rate
        const speedMultiplier = wpm / averageWPM;
        this.updateRate(speedMultiplier);
    }

    // Export settings
    exportSettings() {
        return {
            ...this.settings,
            voicesAvailable: this.voices.map(v => ({
                name: v.name,
                lang: v.lang,
                localService: v.localService
            }))
        };
    }

    importSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.emit('settingsChanged', this.settings);
    }

    // Cleanup
    cleanup() {
        this.stop();
        this.clearQueue();
        this.voices = [];
        this.eventListeners = {};
    }
}
