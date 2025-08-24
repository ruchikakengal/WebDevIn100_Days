/**
 * Alien Language Translator Module
 * Handles the core translation logic and alien language systems
 */

class AlienTranslator {
    constructor() {
        this.languages = {
            zephyrian: {
                name: 'Zephyrian',
                description: 'Ancient wind-walking civilization',
                mapping: {
                    'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥',
                    'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭',
                    'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵',
                    'y': '𝔶', 'z': '𝔷', ' ': ' ', '.': '◊', '!': '※', '?': '⟐', ',': '⟨', ';': '⟩',
                    ':': '⟪', "'": '⟫', '"': '⟬', '-': '⟭', '(': '⟮', ')': '⟯'
                },
                soundProfile: 'ethereal'
            },
            crystalline: {
                name: 'Crystalline',
                description: 'Silicon-based harmonic speakers',
                mapping: {
                    'a': '◈', 'b': '◉', 'c': '◊', 'd': '○', 'e': '◎', 'f': '●', 'g': '◐', 'h': '◑',
                    'i': '◒', 'j': '◓', 'k': '◔', 'l': '◕', 'm': '◖', 'n': '◗', 'o': '◘', 'p': '◙',
                    'q': '◚', 'r': '◛', 's': '◜', 't': '◝', 'u': '◞', 'v': '◟', 'w': '◠', 'x': '◡',
                    'y': '◢', 'z': '◣', ' ': ' ', '.': '⬢', '!': '⬡', '?': '⬠', ',': '⬟', ';': '⬞',
                    ':': '⬝', "'": '⬜', '"': '⬛', '-': '⬚', '(': '⬙', ')': '⬘'
                },
                soundProfile: 'crystalline'
            },
            nebular: {
                name: 'Nebular',
                description: 'Gas-cloud dwelling entities',
                mapping: {
                    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
                    'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
                    'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
                    'y': '𝘆', 'z': '𝘇', ' ': ' ', '.': '✦', '!': '✧', '?': '✩', ',': '✪', ';': '✫',
                    ':': '✬', "'": '✭', '"': '✮', '-': '✯', '(': '✰', ')': '✱'
                },
                soundProfile: 'atmospheric'
            },
            quantum: {
                name: 'Quantum',
                description: 'Interdimensional probability beings',
                mapping: {
                    'a': '⟨α⟩', 'b': '⟨β⟩', 'c': '⟨γ⟩', 'd': '⟨δ⟩', 'e': '⟨ε⟩', 'f': '⟨ζ⟩', 'g': '⟨η⟩', 'h': '⟨θ⟩',
                    'i': '⟨ι⟩', 'j': '⟨κ⟩', 'k': '⟨λ⟩', 'l': '⟨μ⟩', 'm': '⟨ν⟩', 'n': '⟨ξ⟩', 'o': '⟨ο⟩', 'p': '⟨π⟩',
                    'q': '⟨ρ⟩', 'r': '⟨σ⟩', 's': '⟨τ⟩', 't': '⟨υ⟩', 'u': '⟨φ⟩', 'v': '⟨χ⟩', 'w': '⟨ψ⟩', 'x': '⟨ω⟩',
                    'y': '⟨Α⟩', 'z': '⟨Β⟩', ' ': ' ', '.': '⟨∅⟩', '!': '⟨∞⟩', '?': '⟨∫⟩', ',': '⟨∂⟩', ';': '⟨∇⟩',
                    ':': '⟨∆⟩', "'": '⟨∑⟩', '"': '⟨∏⟩', '-': '⟨∪⟩', '(': '⟨∩⟩', ')': '⟨⊆⟩'
                },
                soundProfile: 'digital'
            }
        };
        
        this.currentLanguage = 'zephyrian';
        this.translationHistory = this.loadHistory();
        this.reverseMapping = {};
        this.generateReverseMappings();
    }
    
    /**
     * Generate reverse mappings for hover-to-reveal functionality
     */
    generateReverseMappings() {
        Object.keys(this.languages).forEach(langKey => {
            const mapping = this.languages[langKey].mapping;
            this.reverseMapping[langKey] = {};
            Object.keys(mapping).forEach(human => {
                this.reverseMapping[langKey][mapping[human]] = human;
            });
        });
    }
    
    /**
     * Set the current alien language
     */
    setLanguage(languageKey) {
        if (this.languages[languageKey]) {
            this.currentLanguage = languageKey;
            return true;
        }
        return false;
    }
    
    /**
     * Get current language info
     */
    getCurrentLanguage() {
        return this.languages[this.currentLanguage];
    }
    
    /**
     * Translate human text to alien language
     */
    translateToAlien(humanText) {
        if (!humanText || typeof humanText !== 'string') {
            return '';
        }
        
        const mapping = this.languages[this.currentLanguage].mapping;
        let alienText = '';
        
        for (let char of humanText.toLowerCase()) {
            if (mapping[char]) {
                alienText += mapping[char];
            } else if (/[0-9]/.test(char)) {
                // Handle numbers with special symbols
                const numberMap = {
                    '0': '◯', '1': '◔', '2': '◑', '3': '◕', '4': '◗',
                    '5': '◖', '6': '◐', '7': '◒', '8': '◓', '9': '◉'
                };
                alienText += numberMap[char] || char;
            } else {
                // Keep unknown characters as-is
                alienText += char;
            }
        }
        
        return alienText;
    }
    
    /**
     * Reverse translate alien text to human (for hover functionality)
     */
    translateToHuman(alienText) {
        if (!alienText || typeof alienText !== 'string') {
            return '';
        }
        
        const reverseMap = this.reverseMapping[this.currentLanguage];
        let humanText = '';
        
        // Handle multi-character alien symbols (like quantum language)
        let i = 0;
        while (i < alienText.length) {
            let found = false;
            
            // Try to match longer symbols first
            for (let len = 10; len >= 1; len--) {
                if (i + len <= alienText.length) {
                    const substring = alienText.substring(i, i + len);
                    if (reverseMap[substring]) {
                        humanText += reverseMap[substring];
                        i += len;
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                humanText += alienText[i];
                i++;
            }
        }
        
        return humanText;
    }
    
    /**
     * Get alien characters for audio generation
     */
    getAlienCharacters(alienText) {
        const characters = [];
        const reverseMap = this.reverseMapping[this.currentLanguage];
        
        let i = 0;
        while (i < alienText.length) {
            let found = false;
            
            // Try to match longer symbols first
            for (let len = 10; len >= 1; len--) {
                if (i + len <= alienText.length) {
                    const substring = alienText.substring(i, i + len);
                    if (reverseMap[substring]) {
                        characters.push({
                            alien: substring,
                            human: reverseMap[substring],
                            soundProfile: this.languages[this.currentLanguage].soundProfile
                        });
                        i += len;
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                if (alienText[i] !== ' ') {
                    characters.push({
                        alien: alienText[i],
                        human: alienText[i],
                        soundProfile: this.languages[this.currentLanguage].soundProfile
                    });
                }
                i++;
            }
        }
        
        return characters;
    }
    
    /**
     * Add translation to history
     */
    addToHistory(humanText, alienText) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            human: humanText,
            alien: alienText,
            language: this.currentLanguage,
            languageName: this.languages[this.currentLanguage].name
        };
        
        this.translationHistory.unshift(historyItem);
        
        // Keep only last 50 translations
        if (this.translationHistory.length > 50) {
            this.translationHistory = this.translationHistory.slice(0, 50);
        }
        
        this.saveHistory();
        return historyItem;
    }
    
    /**
     * Get translation history
     */
    getHistory() {
        return this.translationHistory;
    }
    
    /**
     * Clear translation history
     */
    clearHistory() {
        this.translationHistory = [];
        this.saveHistory();
    }
    
    /**
     * Save history to localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('xenolinguist_history', JSON.stringify(this.translationHistory));
        } catch (error) {
            console.warn('Failed to save translation history:', error);
        }
    }
    
    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('xenolinguist_history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Failed to load translation history:', error);
            return [];
        }
    }
    
    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(this.languages).map(key => ({
            key: key,
            name: this.languages[key].name,
            description: this.languages[key].description
        }));
    }
    
    /**
     * Get statistics about current translation
     */
    getTranslationStats(humanText, alienText) {
        return {
            humanLength: humanText.length,
            alienLength: alienText.length,
            wordCount: humanText.trim().split(/\s+/).filter(w => w.length > 0).length,
            characterCount: humanText.length,
            alienCharacterCount: this.getAlienCharacters(alienText).length
        };
    }
    
    /**
     * Validate input text
     */
    validateInput(text) {
        const errors = [];
        
        if (!text || text.trim().length === 0) {
            errors.push('Input text is empty');
        }
        
        if (text.length > 500) {
            errors.push('Input text exceeds maximum length of 500 characters');
        }
        
        // Check for unsupported characters
        const supportedPattern = /^[a-zA-Z0-9\s.,!?;:'"()\-]*$/;
        if (!supportedPattern.test(text)) {
            errors.push('Input contains unsupported characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Generate random alien phrase for demonstration
     */
    generateRandomPhrase() {
        const phrases = [
            "Greetings from the stars",
            "Peace among the galaxies",
            "The cosmic winds carry our message",
            "Unity across dimensions",
            "Welcome to our world",
            "May the light guide you",
            "Beyond the event horizon",
            "Quantum entanglement activated",
            "Stellar coordinates received",
            "Transmission acknowledged"
        ];
        
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlienTranslator;
}
