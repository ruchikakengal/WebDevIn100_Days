// Advanced Puzzle Logic and Cipher Systems
class PuzzleManager {
    constructor() {
        this.cipherData = {
            caesar: {
                alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                messages: [
                    'WUHDVXUH LV KLGGHQ LQ WKH GDUNQHVV', // treasure is hidden in the darkness (shift 3)
                    'WKH DQFLHQW VHFUHW DZDLWV', // the ancient secret awaits
                    'ORRN EHKLQG WKH VWDUV' // look behind the stars
                ]
            },
            morse: {
                code: {
                    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
                    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
                    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
                    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
                    'Y': '-.--', 'Z': '--..', ' ': '/'
                },
                messages: [
                    '... --- ... / .... .. -.. -.. . -. / -.- . -.--', // SOS HIDDEN KEY
                    '- .... . / .-- .- -.-- / .. ... / -.-. .-.. . .- .-.', // THE WAY IS CLEAR
                    '..-. .. -. -.. / - .... . / .-.. .. --. .... -' // FIND THE LIGHT
                ]
            },
            substitution: {
                key: 'ZYXWVUTSRQPONMLKJIHGFEDCBA',
                messages: [
                    'GSV KOZIV DLLW SLMVB', // THE PLAIN WOOD HONEY
                    'XSZIV GSV WZIPMVHH' // CHASE THE DARKNESS
                ]
            }
        };
        
        this.puzzleTemplates = {
            wordArrangement: [
                {
                    pieces: ['THE', 'KEY', 'IS', 'HIDDEN', 'BENEATH', 'STARS'],
                    correct: ['THE', 'KEY', 'IS', 'HIDDEN', 'BENEATH', 'STARS'],
                    hint: 'Arrange to form a meaningful sentence about a celestial location.'
                },
                {
                    pieces: ['ANCIENT', 'WISDOM', 'GUARDS', 'THE', 'FINAL', 'DOOR'],
                    correct: ['ANCIENT', 'WISDOM', 'GUARDS', 'THE', 'FINAL', 'DOOR'],
                    hint: 'What protects the ultimate entrance?'
                }
            ],
            riddleBank: [
                {
                    question: "I am not a number, but I can be counted. I am not alive, but I can grow. I am not physical, but I can be felt. What am I, that leads to digital gold?",
                    answer: "knowledge",
                    hints: [
                        "Think about things that accumulate over time",
                        "Consider what you gain from learning",
                        "It's something everyone seeks but few master"
                    ]
                },
                {
                    question: "I have keys but no locks. I have space but no room. You can enter but can't go inside. What am I?",
                    answer: "keyboard",
                    hints: [
                        "You use this to communicate digitally",
                        "It has letters and numbers",
                        "Essential for any treasure hunter in the digital age"
                    ]
                }
            ]
        };
        
        this.secretCodes = {
            binary: {
                'TREASURE': '01010100 01010010 01000101 01000001 01010011 01010101 01010010 01000101',
                'CIPHER': '01000011 01001001 01010000 01001000 01000101 01010010',
                'HIDDEN': '01001000 01001001 01000100 01000100 01000101 01001110'
            },
            base64: {
                'SECRET': 'U0VDUkVU',
                'MYSTERY': 'TVlTVEVSWQ==',
                'DECODE': 'REVDT0RF'
            }
        };
    }
    
    // Caesar Cipher Methods
    encodeCaesar(text, shift) {
        return text.toUpperCase().split('').map(char => {
            if (char.match(/[A-Z]/)) {
                return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
            }
            return char;
        }).join('');
    }
    
    decodeCaesar(text, shift) {
        return text.toUpperCase().split('').map(char => {
            if (char.match(/[A-Z]/)) {
                return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            }
            return char;
        }).join('');
    }
    
    bruteforceCaesar(ciphertext) {
        const results = [];
        for (let shift = 1; shift <= 25; shift++) {
            results.push({
                shift: shift,
                decoded: this.decodeCaesar(ciphertext, shift)
            });
        }
        return results;
    }
    
    // Morse Code Methods
    textToMorse(text) {
        return text.toUpperCase().split('').map(char => {
            return this.cipherData.morse.code[char] || char;
        }).join(' ');
    }
    
    morseToText(morse) {
        const reverseCode = {};
        Object.keys(this.cipherData.morse.code).forEach(key => {
            reverseCode[this.cipherData.morse.code[key]] = key;
        });
        
        return morse.split(' ').map(code => {
            return reverseCode[code] || code;
        }).join('');
    }
    
    // Binary Conversion
    textToBinary(text) {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    }
    
    binaryToText(binary) {
        return binary.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');
    }
    
    // Base64 Encoding/Decoding
    textToBase64(text) {
        return btoa(text);
    }
    
    base64ToText(base64) {
        try {
            return atob(base64);
        } catch (e) {
            return null;
        }
    }
    
    // ROT13 Cipher
    rot13(text) {
        return text.replace(/[a-zA-Z]/g, char => {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
        });
    }
    
    // Substitution Cipher
    createSubstitutionKey() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const shuffled = alphabet.split('').sort(() => Math.random() - 0.5).join('');
        return shuffled;
    }
    
    encodeSubstitution(text, key) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return text.toUpperCase().split('').map(char => {
            const index = alphabet.indexOf(char);
            return index !== -1 ? key[index] : char;
        }).join('');
    }
    
    decodeSubstitution(text, key) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return text.toUpperCase().split('').map(char => {
            const index = key.indexOf(char);
            return index !== -1 ? alphabet[index] : char;
        }).join('');
    }
    
    // Pattern Recognition Puzzles
    generateNumberSequence(type = 'fibonacci') {
        switch (type) {
            case 'fibonacci':
                return [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
            case 'prime':
                return [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
            case 'squares':
                return [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
            case 'triangular':
                return [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
            default:
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }
    }
    
    // Image-based Puzzles
    generateColorSequence() {
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        const sequence = [];
        for (let i = 0; i < 8; i++) {
            sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        return sequence;
    }
    
    // Puzzle Validation
    validateAnswer(puzzleType, userAnswer, correctAnswer, options = {}) {
        const normalize = (str) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
        
        switch (puzzleType) {
            case 'text':
                return normalize(userAnswer) === normalize(correctAnswer);
                
            case 'numeric':
                return parseFloat(userAnswer) === parseFloat(correctAnswer);
                
            case 'array':
                if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
                return userAnswer.length === correctAnswer.length && 
                       userAnswer.every((val, index) => normalize(val) === normalize(correctAnswer[index]));
                       
            case 'fuzzy':
                const similarity = this.calculateStringSimilarity(normalize(userAnswer), normalize(correctAnswer));
                return similarity >= (options.threshold || 0.8);
                
            default:
                return normalize(userAnswer) === normalize(correctAnswer);
        }
    }
    
    calculateStringSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
        
        for (let i = 0; i <= len1; i++) matrix[i][0] = i;
        for (let j = 0; j <= len2; j++) matrix[0][j] = j;
        
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        
        const maxLen = Math.max(len1, len2);
        return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
    }
    
    // Generate Random Puzzles
    generateRandomCipher() {
        const types = ['caesar', 'morse', 'binary', 'base64', 'rot13'];
        const type = types[Math.floor(Math.random() * types.length)];
        const messages = ['HELLO WORLD', 'SECRET MESSAGE', 'FIND THE KEY', 'TREASURE AWAITS'];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        let encoded = '';
        let decoder = '';
        
        switch (type) {
            case 'caesar':
                const shift = Math.floor(Math.random() * 25) + 1;
                encoded = this.encodeCaesar(message, shift);
                decoder = `Caesar cipher with shift ${shift}`;
                break;
                
            case 'morse':
                encoded = this.textToMorse(message);
                decoder = 'Morse code';
                break;
                
            case 'binary':
                encoded = this.textToBinary(message);
                decoder = 'Binary code';
                break;
                
            case 'base64':
                encoded = this.textToBase64(message);
                decoder = 'Base64 encoding';
                break;
                
            case 'rot13':
                encoded = this.rot13(message);
                decoder = 'ROT13 cipher';
                break;
        }
        
        return {
            type: type,
            original: message,
            encoded: encoded,
            decoder: decoder
        };
    }
    
    // Hint System
    generateHint(puzzleType, currentAnswer, correctAnswer, difficulty = 'medium') {
        const hints = {
            caesar: [
                "Try different shift values systematically",
                "The most common shift in Caesar cipher is 3",
                "Each letter is shifted by the same amount",
                "The shift wraps around: after Z comes A"
            ],
            morse: [
                "Dots are short, dashes are long",
                "Letters are separated by spaces",
                "Words are separated by forward slashes",
                "Listen for the rhythm: dot-dash patterns"
            ],
            riddle: [
                "Think metaphorically, not literally",
                "Consider what the words might represent",
                "Sometimes the answer is simpler than you think",
                "Break down each clue in the riddle"
            ],
            arrangement: [
                "Try to form a complete sentence",
                "Think about logical word order",
                "Some phrases have natural flow",
                "Consider the meaning of the words together"
            ]
        };
        
        const puzzleHints = hints[puzzleType] || hints.riddle;
        return puzzleHints[Math.floor(Math.random() * puzzleHints.length)];
    }
    
    // Easter Egg Generator
    generateEasterEgg() {
        const easterEggs = [
            {
                type: 'konami',
                code: '↑↑↓↓←→←→BA',
                reward: 'Extra hint unlocked!'
            },
            {
                type: 'console',
                command: 'unlock("secret")',
                reward: 'Developer tools easter egg found!'
            },
            {
                type: 'click_sequence',
                sequence: [1, 3, 3, 7],
                reward: 'Secret message revealed!'
            },
            {
                type: 'time_based',
                time: '13:37',
                reward: 'Leet time bonus activated!'
            }
        ];
        
        return easterEggs[Math.floor(Math.random() * easterEggs.length)];
    }
}

// Advanced Cipher Analyzer
class CipherAnalyzer {
    constructor() {
        this.letterFrequency = {
            'E': 12.7, 'T': 9.1, 'A': 8.1, 'O': 7.5, 'I': 7.0, 'N': 6.7,
            'S': 6.3, 'H': 6.1, 'R': 6.0, 'D': 4.3, 'L': 4.0, 'C': 2.8,
            'U': 2.8, 'M': 2.4, 'W': 2.4, 'F': 2.2, 'G': 2.0, 'Y': 2.0,
            'P': 1.9, 'B': 1.3, 'V': 1.0, 'K': 0.8, 'J': 0.15, 'X': 0.15,
            'Q': 0.10, 'Z': 0.07
        };
    }
    
    analyzeFrequency(text) {
        const counts = {};
        const total = text.replace(/[^A-Z]/g, '').length;
        
        text.toUpperCase().replace(/[^A-Z]/g, '').split('').forEach(char => {
            counts[char] = (counts[char] || 0) + 1;
        });
        
        const frequencies = {};
        Object.keys(counts).forEach(char => {
            frequencies[char] = (counts[char] / total) * 100;
        });
        
        return frequencies;
    }
    
    suggestCipherType(text) {
        const analysis = this.analyzeFrequency(text);
        const hasNumbers = /\d/.test(text);
        const hasDots = /\./.test(text);
        const hasDashes = /-/.test(text);
        const hasEquals = /=/.test(text);
        
        if (hasDots && hasDashes && !hasNumbers) {
            return 'morse';
        }
        
        if (hasEquals && /^[A-Za-z0-9+/]*={0,2}$/.test(text.trim())) {
            return 'base64';
        }
        
        if (/^[01\s]+$/.test(text.trim())) {
            return 'binary';
        }
        
        if (Object.keys(analysis).length > 0) {
            const entropy = this.calculateEntropy(text);
            if (entropy < 3.5) {
                return 'substitution';
            } else if (entropy < 4.2) {
                return 'caesar';
            }
        }
        
        return 'unknown';
    }
    
    calculateEntropy(text) {
        const frequencies = this.analyzeFrequency(text);
        let entropy = 0;
        
        Object.values(frequencies).forEach(freq => {
            if (freq > 0) {
                const probability = freq / 100;
                entropy -= probability * Math.log2(probability);
            }
        });
        
        return entropy;
    }
    
    getDecryptionSuggestions(text) {
        const type = this.suggestCipherType(text);
        const suggestions = [];
        
        switch (type) {
            case 'caesar':
                suggestions.push('Try different shift values (1-25)');
                suggestions.push('Look for common English words in the output');
                suggestions.push('The most common shift is 3 (ROT3)');
                break;
                
            case 'morse':
                suggestions.push('Dots (.) represent short signals');
                suggestions.push('Dashes (-) represent long signals');
                suggestions.push('Spaces separate letters, slashes separate words');
                break;
                
            case 'base64':
                suggestions.push('This appears to be Base64 encoded');
                suggestions.push('Use a Base64 decoder');
                break;
                
            case 'binary':
                suggestions.push('Convert binary to ASCII characters');
                suggestions.push('Each group of 8 bits represents one character');
                break;
                
            case 'substitution':
                suggestions.push('Try frequency analysis');
                suggestions.push('Look for common letter patterns');
                suggestions.push('Single letters are often A or I');
                break;
                
            default:
                suggestions.push('Try different cipher types');
                suggestions.push('Check for hidden patterns');
                suggestions.push('Consider steganography or word puzzles');
        }
        
        return suggestions;
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PuzzleManager, CipherAnalyzer };
}
