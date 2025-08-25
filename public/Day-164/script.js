/**
 * Main Application Controller for Alien Language Translator
 * Coordinates all modules and handles user interface interactions
 */

class XenolinguistApp {
    constructor() {
        this.translator = new AlienTranslator();
        this.audioEngine = new AlienAudioEngine();
        this.particleBackground = null;
        
        this.elements = {};
        this.state = {
            isTransmissionMode: false,
            isAudioEnabled: true,
            currentTranslation: null,
            lastInputTime: 0,
            typingTimeout: null
        };
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeBackground();
        this.updateDateTime();
        this.loadSavedSettings();
        this.displayWelcomeMessage();
        
        // Start time update interval
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        this.elements = {
            humanInput: document.getElementById('human-input'),
            alienOutput: document.getElementById('alien-output'),
            alienLanguageSelect: document.getElementById('alien-language'),
            charCount: document.getElementById('char-count'),
            alienStatus: document.getElementById('alien-status'),
            connectionStatus: document.getElementById('connection-status'),
            currentTime: document.getElementById('current-time'),
            audioToggle: document.getElementById('audio-toggle'),
            transmissionMode: document.getElementById('transmission-mode'),
            translateBtn: document.getElementById('translate-btn'),
            playAudio: document.getElementById('play-audio'),
            copyTranslation: document.getElementById('copy-translation'),
            clearAll: document.getElementById('clear-all'),
            historyContainer: document.getElementById('history-container'),
            hoverTooltip: document.getElementById('hover-tooltip'),
            notificationContainer: document.getElementById('notification-container'),
            loadingOverlay: document.getElementById('loading-overlay')
        };
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Input events
        this.elements.humanInput.addEventListener('input', (e) => this.handleInput(e));
        this.elements.humanInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Control events
        this.elements.alienLanguageSelect.addEventListener('change', (e) => this.handleLanguageChange(e));
        this.elements.audioToggle.addEventListener('click', () => this.toggleAudio());
        this.elements.transmissionMode.addEventListener('click', () => this.toggleTransmissionMode());
        this.elements.translateBtn.addEventListener('click', () => this.forceTranslate());
        
        // Action button events
        this.elements.playAudio.addEventListener('click', () => this.playCurrentTranslation());
        this.elements.copyTranslation.addEventListener('click', () => this.copyToClipboard());
        this.elements.clearAll.addEventListener('click', () => this.clearAll());
        
        // Alien text hover events
        this.elements.alienOutput.addEventListener('mousemove', (e) => this.handleAlienTextHover(e));
        this.elements.alienOutput.addEventListener('mouseleave', () => this.hideTooltip());
        
        // History container events
        this.elements.historyContainer.addEventListener('click', (e) => this.handleHistoryClick(e));
        
        // Global events
        document.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));
        window.addEventListener('beforeunload', () => this.saveSettings());
    }
    
    /**
     * Initialize particle background
     */
    initializeBackground() {
        try {
            this.particleBackground = new ParticleBackground('particle-canvas');
        } catch (error) {
            console.warn('Failed to initialize particle background:', error);
        }
    }
    
    /**
     * Handle text input
     */
    handleInput(e) {
        const inputText = e.target.value;
        this.updateCharacterCount(inputText.length);
        this.state.lastInputTime = Date.now();
        
        // Clear existing timeout
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }
        
        // Set new timeout for real-time translation
        this.state.typingTimeout = setTimeout(() => {
            if (inputText.trim()) {
                this.translateText(inputText);
            } else {
                this.clearOutput();
            }
        }, 300); // 300ms delay for real-time translation
    }
    
    /**
     * Handle keyboard shortcuts
     */
    handleKeyDown(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    this.forceTranslate();
                    break;
                case 'l':
                    e.preventDefault();
                    this.focusLanguageSelector();
                    break;
            }
        }
    }
    
    /**
     * Handle global keyboard shortcuts
     */
    handleGlobalKeyDown(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'm':
                    e.preventDefault();
                    this.toggleAudio();
                    break;
                case 't':
                    e.preventDefault();
                    this.toggleTransmissionMode();
                    break;
                case 'k':
                    e.preventDefault();
                    this.clearAll();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.hideTooltip();
        }
    }
    
    /**
     * Handle language selection change
     */
    handleLanguageChange(e) {
        const newLanguage = e.target.value;
        this.translator.setLanguage(newLanguage);
        
        // Re-translate current text if any
        const currentText = this.elements.humanInput.value.trim();
        if (currentText) {
            this.translateText(currentText);
        }
        
        this.showNotification(`Language changed to ${this.translator.getCurrentLanguage().name}`, 'success');
        this.audioEngine.playUISound('button');
    }
    
    /**
     * Translate text to alien language
     */
    async translateText(humanText) {
        if (!humanText || !humanText.trim()) {
            this.clearOutput();
            return;
        }
        
        // Validate input
        const validation = this.translator.validateInput(humanText);
        if (!validation.isValid) {
            this.showError(validation.errors.join(', '));
            return;
        }
        
        try {
            // Show translating status
            this.elements.alienStatus.textContent = 'TRANSLATING';
            this.elements.alienStatus.style.color = '#ffaa00';
            
            // Perform translation
            const alienText = this.translator.translateToAlien(humanText);
            const characters = this.translator.getAlienCharacters(alienText);
            
            // Store current translation
            this.state.currentTranslation = {
                human: humanText,
                alien: alienText,
                characters: characters
            };
            
            // Display translation
            if (this.state.isTransmissionMode) {
                await this.displayTransmissionEffect(alienText, characters);
            } else {
                this.displayAlienText(alienText);
            }
            
            // Update status
            this.elements.alienStatus.textContent = 'ACTIVE';
            this.elements.alienStatus.style.color = '#00ff41';
            
            // Add to history
            this.translator.addToHistory(humanText, alienText);
            this.updateHistoryDisplay();
            
            // Play sound if enabled
            if (this.state.isAudioEnabled && characters.length > 0) {
                setTimeout(() => {
                    this.audioEngine.playAlienText(characters, 100);
                }, 500);
            }
            
        } catch (error) {
            console.error('Translation error:', error);
            this.showError('Translation failed. Please try again.');
            this.elements.alienStatus.textContent = 'ERROR';
            this.elements.alienStatus.style.color = '#ff4444';
        }
    }
    
    /**
     * Display alien text with character wrapping for hover effects
     */
    displayAlienText(alienText) {
        const characters = this.translator.getAlienCharacters(alienText);
        const outputElement = this.elements.alienOutput;
        
        outputElement.innerHTML = '';
        outputElement.className = 'alien-text';
        
        characters.forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'alien-char';
            span.textContent = char.alien;
            span.dataset.human = char.human;
            span.dataset.index = index;
            outputElement.appendChild(span);
        });
        
        // Add spaces back
        const text = alienText;
        let charIndex = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                const space = document.createTextNode(' ');
                outputElement.insertBefore(space, outputElement.children[charIndex] || null);
            } else {
                charIndex++;
            }
        }
    }
    
    /**
     * Display transmission effect (animated typing)
     */
    async displayTransmissionEffect(alienText, characters) {
        const outputElement = this.elements.alienOutput;
        outputElement.innerHTML = '';
        outputElement.className = 'alien-text incoming-transmission';
        
        // Play transmission sound
        this.audioEngine.playUISound('transmission');
        
        for (let i = 0; i < characters.length; i++) {
            const char = characters[i];
            const span = document.createElement('span');
            span.className = 'alien-char';
            span.textContent = char.alien;
            span.dataset.human = char.human;
            span.dataset.index = i;
            span.style.animationDelay = `${i * 0.1}s`;
            
            outputElement.appendChild(span);
            
            // Play character sound
            if (this.state.isAudioEnabled && char.human !== ' ') {
                this.audioEngine.generateCharacterSound(char.human, char.soundProfile);
            }
            
            await this.sleep(100);
        }
        
        // Remove transmission class after animation
        setTimeout(() => {
            outputElement.classList.remove('incoming-transmission');
        }, characters.length * 100 + 500);
    }
    
    /**
     * Handle alien text hover for translation reveal
     */
    handleAlienTextHover(e) {
        const target = e.target;
        if (target.classList.contains('alien-char')) {
            const humanChar = target.dataset.human;
            if (humanChar && humanChar !== ' ') {
                this.showTooltip(e.clientX, e.clientY, humanChar);
            }
        } else {
            this.hideTooltip();
        }
    }
    
    /**
     * Show hover tooltip
     */
    showTooltip(x, y, text) {
        const tooltip = this.elements.hoverTooltip;
        tooltip.querySelector('.tooltip-content').textContent = text;
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y - 30}px`;
        tooltip.classList.add('visible');
    }
    
    /**
     * Hide hover tooltip
     */
    hideTooltip() {
        this.elements.hoverTooltip.classList.remove('visible');
    }
    
    /**
     * Toggle audio on/off
     */
    toggleAudio() {
        this.state.isAudioEnabled = this.audioEngine.toggleAudio();
        const audioBtn = this.elements.audioToggle;
        const icon = audioBtn.querySelector('i');
        
        if (this.state.isAudioEnabled) {
            icon.className = 'fas fa-volume-up';
            audioBtn.querySelector('span').textContent = 'AUDIO';
            this.showNotification('Audio enabled', 'success');
        } else {
            icon.className = 'fas fa-volume-mute';
            audioBtn.querySelector('span').textContent = 'MUTED';
            this.showNotification('Audio disabled', 'success');
        }
        
        this.audioEngine.playUISound('button');
    }
    
    /**
     * Toggle transmission mode
     */
    toggleTransmissionMode() {
        this.state.isTransmissionMode = !this.state.isTransmissionMode;
        const transmissionBtn = this.elements.transmissionMode;
        
        if (this.state.isTransmissionMode) {
            transmissionBtn.style.background = '#00ff41';
            transmissionBtn.style.color = '#0a0a0f';
            this.showNotification('Transmission mode enabled', 'success');
        } else {
            transmissionBtn.style.background = '';
            transmissionBtn.style.color = '';
            this.showNotification('Transmission mode disabled', 'success');
        }
        
        this.audioEngine.playUISound('button');
    }
    
    /**
     * Force translation (manual trigger)
     */
    forceTranslate() {
        const inputText = this.elements.humanInput.value.trim();
        if (inputText) {
            this.translateText(inputText);
        } else {
            this.showNotification('Please enter some text to translate', 'error');
        }
        
        this.audioEngine.playUISound('button');
    }
    
    /**
     * Play current translation audio
     */
    playCurrentTranslation() {
        if (this.state.currentTranslation && this.state.currentTranslation.characters) {
            this.audioEngine.playAlienText(this.state.currentTranslation.characters, 120);
            this.showNotification('Playing translation audio', 'success');
        } else {
            this.showNotification('No translation to play', 'error');
        }
        
        this.audioEngine.playUISound('button');
    }
    
    /**
     * Copy translation to clipboard
     */
    async copyToClipboard() {
        if (this.state.currentTranslation) {
            try {
                await navigator.clipboard.writeText(this.state.currentTranslation.alien);
                this.showNotification('Translation copied to clipboard', 'success');
                
                // Add burst effect
                if (this.particleBackground) {
                    this.particleBackground.addBurstEffect(
                        window.innerWidth / 2,
                        window.innerHeight / 2,
                        '#00ff41'
                    );
                }
            } catch (error) {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(this.state.currentTranslation.alien);
            }
        } else {
            this.showNotification('No translation to copy', 'error');
        }
        
        this.audioEngine.playUISound('button');
    }
    
    /**
     * Fallback copy method for older browsers
     */
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Translation copied to clipboard', 'success');
        } catch (error) {
            this.showNotification('Failed to copy translation', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    /**
     * Clear all inputs and outputs
     */
    clearAll() {
        this.elements.humanInput.value = '';
        this.clearOutput();
        this.updateCharacterCount(0);
        this.state.currentTranslation = null;
        this.elements.alienStatus.textContent = 'STANDBY';
        this.elements.alienStatus.style.color = '#b0b0b0';
        
        this.showNotification('All fields cleared', 'success');
        this.audioEngine.playUISound('button');
    }
    
    /**
     * Clear output display
     */
    clearOutput() {
        this.elements.alienOutput.innerHTML = '<div class="placeholder-text">Translation will appear here...</div>';
        this.elements.alienOutput.className = '';
    }
    
    /**
     * Update character count display
     */
    updateCharacterCount(count) {
        this.elements.charCount.textContent = count;
        
        // Change color based on limit
        if (count > 450) {
            this.elements.charCount.style.color = '#ff4444';
        } else if (count > 400) {
            this.elements.charCount.style.color = '#ffaa00';
        } else {
            this.elements.charCount.style.color = '#b0b0b0';
        }
    }
    
    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const history = this.translator.getHistory();
        const container = this.elements.historyContainer;
        
        if (history.length === 0) {
            container.innerHTML = '<div class="history-placeholder">No previous transmissions</div>';
            return;
        }
        
        container.innerHTML = '';
        history.slice(0, 10).forEach(item => { // Show only last 10 items
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.dataset.id = item.id;
            
            historyItem.innerHTML = `
                <div class="history-human">${item.human}</div>
                <div class="history-alien">${item.alien}</div>
                <div class="history-meta">${item.languageName} • ${this.formatTimestamp(item.timestamp)}</div>
            `;
            
            container.appendChild(historyItem);
        });
    }
    
    /**
     * Handle history item click
     */
    handleHistoryClick(e) {
        const historyItem = e.target.closest('.history-item');
        if (historyItem) {
            const itemId = parseInt(historyItem.dataset.id);
            const history = this.translator.getHistory();
            const item = history.find(h => h.id === itemId);
            
            if (item) {
                this.elements.humanInput.value = item.human;
                this.translator.setLanguage(item.language);
                this.elements.alienLanguageSelect.value = item.language;
                this.translateText(item.human);
                
                this.showNotification('History item loaded', 'success');
                this.audioEngine.playUISound('button');
            }
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        this.elements.notificationContainer.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
        this.audioEngine.playUISound('error');
    }
    
    /**
     * Update date and time display
     */
    updateDateTime() {
        const now = new Date();
        const timeString = now.toISOString().slice(0, 19).replace('T', ' ');
        this.elements.currentTime.textContent = timeString;
    }
    
    /**
     * Focus language selector
     */
    focusLanguageSelector() {
        this.elements.alienLanguageSelect.focus();
    }
    
    /**
     * Display welcome message
     */
    displayWelcomeMessage() {
        const welcomeText = "Welcome to the Xenolinguist";
        this.elements.humanInput.value = welcomeText;
        this.translateText(welcomeText);
        
        // Show a brief tutorial
        setTimeout(() => {
            this.showNotification('Start typing to see real-time translation!', 'success');
        }, 2000);
    }
    
    /**
     * Save settings to localStorage
     */
    saveSettings() {
        const settings = {
            language: this.translator.currentLanguage,
            audioEnabled: this.state.isAudioEnabled,
            transmissionMode: this.state.isTransmissionMode
        };
        
        try {
            localStorage.setItem('xenolinguist_settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }
    
    /**
     * Load saved settings
     */
    loadSavedSettings() {
        try {
            const saved = localStorage.getItem('xenolinguist_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                
                if (settings.language) {
                    this.translator.setLanguage(settings.language);
                    this.elements.alienLanguageSelect.value = settings.language;
                }
                
                if (typeof settings.audioEnabled === 'boolean') {
                    this.state.isAudioEnabled = settings.audioEnabled;
                    if (!this.state.isAudioEnabled) {
                        this.audioEngine.toggleAudio();
                        this.toggleAudio(); // Update UI
                    }
                }
                
                if (typeof settings.transmissionMode === 'boolean') {
                    this.state.isTransmissionMode = settings.transmissionMode;
                    if (this.state.isTransmissionMode) {
                        this.toggleTransmissionMode(); // Update UI
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
        
        // Update history display
        this.updateHistoryDisplay();
    }
    
    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    
    /**
     * Utility sleep function
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.xenolinguistApp = new XenolinguistApp();
    
    // Add some global utilities for debugging
    window.alienTranslator = window.xenolinguistApp.translator;
    window.audioEngine = window.xenolinguistApp.audioEngine;
    window.particleBackground = window.xenolinguistApp.particleBackground;
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be implemented separately if needed
    });
}
