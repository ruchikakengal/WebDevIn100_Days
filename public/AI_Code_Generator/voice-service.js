// Voice Service for speech-to-text functionality
class VoiceService {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isSupported = false;
        this.currentTranscript = '';
        this.finalTranscript = '';
        
        this.initSpeechRecognition();
        this.initEventListeners();
    }

    initSpeechRecognition() {
        // Check for browser support
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.isSupported = true;
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
            this.isSupported = true;
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.isSupported = false;
            return;
        }

        // Configure speech recognition
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        // Set up event handlers
        this.setupRecognitionEvents();
    }

    setupRecognitionEvents() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            console.log('Voice recognition started');
            this.isListening = true;
            this.updateVoiceStatus('listening', 'Listening... Speak now');
            this.updateVoiceButton('listening');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            this.currentTranscript = interimTranscript;
            this.finalTranscript += finalTranscript;
            
            // Update the input field
            this.updateChatInput(this.finalTranscript + this.currentTranscript);
            
            // Update status
            if (interimTranscript) {
                this.updateVoiceStatus('processing', `Processing: "${interimTranscript}"`);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };

        this.recognition.onend = () => {
            console.log('Voice recognition ended');
            this.isListening = false;
            this.updateVoiceStatus('inactive', 'Click microphone to start voice input');
            this.updateVoiceButton('inactive');
            
            // If we have final transcript, show success
            if (this.finalTranscript.trim()) {
                showToast('Voice input captured successfully', 'success');
            }
        };

        this.recognition.onnomatch = () => {
            console.warn('No speech was recognized');
            this.updateVoiceStatus('error', 'No speech recognized, please try again');
        };

        this.recognition.onspeechstart = () => {
            console.log('Speech detected');
            this.updateVoiceStatus('listening', 'Speech detected, keep talking...');
        };

        this.recognition.onspeechend = () => {
            console.log('Speech ended');
            this.updateVoiceStatus('processing', 'Processing speech...');
        };
    }

    initEventListeners() {
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceRecognition();
            });
        }

        // Update UI based on support
        this.updateVoiceSupport();
    }

    updateVoiceSupport() {
        const voiceBtn = document.getElementById('voice-btn');
        const voiceStatus = document.getElementById('voice-status');
        
        if (!this.isSupported) {
            if (voiceBtn) {
                voiceBtn.disabled = true;
                voiceBtn.title = 'Voice input not supported in this browser';
                voiceBtn.style.opacity = '0.5';
            }
            
            if (voiceStatus) {
                voiceStatus.innerHTML = `
                    <i class="fas fa-microphone-slash"></i>
                    <span>Voice input not supported in this browser</span>
                `;
                voiceStatus.style.display = 'flex';
                voiceStatus.className = 'voice-status error';
            }
            
            return;
        }

        // Initial status for supported browsers
        this.updateVoiceStatus('inactive', 'Click microphone to start voice input');
    }

    toggleVoiceRecognition() {
        if (!this.isSupported) {
            showToast('Voice input not supported in this browser', 'error');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition || this.isListening) return;

        try {
            // Reset transcripts
            this.currentTranscript = '';
            this.finalTranscript = '';
            
            // Start recognition
            this.recognition.start();
            
            // Set timeout to auto-stop after 30 seconds
            this.autoStopTimeout = setTimeout(() => {
                if (this.isListening) {
                    this.stopListening();
                    showToast('Voice input stopped automatically after 30 seconds', 'info');
                }
            }, 30000);
            
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            this.handleRecognitionError(error.message);
        }
    }

    stopListening() {
        if (!this.recognition || !this.isListening) return;

        try {
            this.recognition.stop();
            
            // Clear auto-stop timeout
            if (this.autoStopTimeout) {
                clearTimeout(this.autoStopTimeout);
                this.autoStopTimeout = null;
            }
            
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    }

    handleRecognitionError(error) {
        this.isListening = false;
        this.updateVoiceButton('error');
        
        let errorMessage = 'Voice recognition error';
        let toastType = 'error';
        
        switch (error) {
            case 'no-speech':
                errorMessage = 'No speech detected, please try again';
                toastType = 'warning';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone access denied or not available';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error during voice recognition';
                break;
            case 'service-not-allowed':
                errorMessage = 'Voice recognition service not allowed';
                break;
            case 'bad-grammar':
                errorMessage = 'Grammar error in voice recognition';
                break;
            case 'language-not-supported':
                errorMessage = 'Language not supported for voice recognition';
                break;
            default:
                errorMessage = `Voice recognition error: ${error}`;
        }
        
        this.updateVoiceStatus('error', errorMessage);
        showToast(errorMessage, toastType);
        
        // Reset status after 3 seconds
        setTimeout(() => {
            this.updateVoiceStatus('inactive', 'Click microphone to start voice input');
        }, 3000);
    }

    updateVoiceStatus(status, message) {
        const voiceStatus = document.getElementById('voice-status');
        if (!voiceStatus) return;

        const icons = {
            inactive: 'fas fa-microphone',
            listening: 'fas fa-microphone',
            processing: 'fas fa-cog fa-spin',
            error: 'fas fa-exclamation-triangle'
        };

        voiceStatus.innerHTML = `
            <i class="${icons[status] || icons.inactive}"></i>
            <span>${message}</span>
        `;
        
        voiceStatus.className = `voice-status ${status}`;
        
        // Show/hide status based on activity
        voiceStatus.style.display = (status === 'inactive' && !this.isListening) ? 'none' : 'flex';
    }

    updateVoiceButton(status) {
        const voiceBtn = document.getElementById('voice-btn');
        if (!voiceBtn) return;

        // Remove existing status classes
        voiceBtn.classList.remove('active', 'listening', 'error');
        
        // Add new status class
        if (status !== 'inactive') {
            voiceBtn.classList.add(status);
        }
        
        // Update button icon
        const icon = voiceBtn.querySelector('i');
        if (icon) {
            switch (status) {
                case 'listening':
                    icon.className = 'fas fa-microphone';
                    break;
                case 'processing':
                    icon.className = 'fas fa-cog fa-spin';
                    break;
                case 'error':
                    icon.className = 'fas fa-exclamation-triangle';
                    break;
                default:
                    icon.className = 'fas fa-microphone';
            }
        }
        
        // Update button title
        const titles = {
            inactive: 'Start voice input',
            listening: 'Stop voice input',
            processing: 'Processing voice...',
            error: 'Voice input error'
        };
        
        voiceBtn.title = titles[status] || titles.inactive;
    }

    updateChatInput(text) {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;

        chatInput.value = text;
        
        // Auto-resize the textarea
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
        
        // Focus on input
        chatInput.focus();
    }

    // Method to clear the current transcript
    clearTranscript() {
        this.currentTranscript = '';
        this.finalTranscript = '';
        this.updateChatInput('');
    }

    // Method to get current transcript
    getTranscript() {
        return this.finalTranscript + this.currentTranscript;
    }

    // Method to set language
    setLanguage(lang) {
        if (this.recognition) {
            this.recognition.lang = lang;
            showToast(`Voice recognition language set to ${lang}`, 'success');
        }
    }

    // Method to get supported languages
    getSupportedLanguages() {
        return [
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'es-ES', name: 'Spanish (Spain)' },
            { code: 'fr-FR', name: 'French (France)' },
            { code: 'de-DE', name: 'German (Germany)' },
            { code: 'it-IT', name: 'Italian (Italy)' },
            { code: 'pt-BR', name: 'Portuguese (Brazil)' },
            { code: 'ru-RU', name: 'Russian (Russia)' },
            { code: 'zh-CN', name: 'Chinese (Simplified)' },
            { code: 'ja-JP', name: 'Japanese (Japan)' },
            { code: 'ko-KR', name: 'Korean (South Korea)' },
            { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
            { code: 'hi-IN', name: 'Hindi (India)' }
        ];
    }

    // Method to test microphone
    async testMicrophone() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Microphone testing not supported', 'error');
            return false;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Test successful - stop the stream
            stream.getTracks().forEach(track => track.stop());
            
            showToast('Microphone test successful', 'success');
            return true;
        } catch (error) {
            console.error('Microphone test failed:', error);
            showToast('Microphone test failed: ' + error.message, 'error');
            return false;
        }
    }

    // Method to check permissions
    async checkPermissions() {
        if (!navigator.permissions) {
            return { state: 'unknown' };
        }

        try {
            const permission = await navigator.permissions.query({ name: 'microphone' });
            return permission;
        } catch (error) {
            console.error('Permission check failed:', error);
            return { state: 'unknown' };
        }
    }

    // Method to get voice recognition settings
    getSettings() {
        if (!this.recognition) return null;

        return {
            continuous: this.recognition.continuous,
            interimResults: this.recognition.interimResults,
            language: this.recognition.lang,
            maxAlternatives: this.recognition.maxAlternatives,
            isSupported: this.isSupported,
            isListening: this.isListening
        };
    }

    // Method to update settings
    updateSettings(settings) {
        if (!this.recognition) return;

        if (settings.continuous !== undefined) {
            this.recognition.continuous = settings.continuous;
        }
        
        if (settings.interimResults !== undefined) {
            this.recognition.interimResults = settings.interimResults;
        }
        
        if (settings.language !== undefined) {
            this.recognition.lang = settings.language;
        }
        
        if (settings.maxAlternatives !== undefined) {
            this.recognition.maxAlternatives = settings.maxAlternatives;
        }
        
        showToast('Voice recognition settings updated', 'success');
    }

    // Cleanup method
    cleanup() {
        if (this.isListening) {
            this.stopListening();
        }
        
        if (this.autoStopTimeout) {
            clearTimeout(this.autoStopTimeout);
            this.autoStopTimeout = null;
        }
        
        this.recognition = null;
        this.isSupported = false;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceService;
}
