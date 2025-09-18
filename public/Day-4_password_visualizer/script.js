document.addEventListener('DOMContentLoaded', function() {
            const passwordInput = document.getElementById('passwordInput');
            const togglePassword = document.getElementById('togglePassword');
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            const scoreNumber = document.getElementById('scoreNumber');
            const criteriaList = document.getElementById('criteriaList');
            
            // Common passwords to check against
            const commonPasswords = [
                'password', '123456', '12345678', 'qwerty', 'abc123', 
                'password1', 'admin', 'letmein', 'welcome', 'monkey'
            ];
            
            // Toggle password visibility
            togglePassword.addEventListener('click', function() {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    passwordInput.type = 'password';
                    togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
            
            // Check password strength as user types
            passwordInput.addEventListener('input', checkPasswordStrength);
            
            function checkPasswordStrength() {
                const password = passwordInput.value;
                let strength = 0;
                let totalCriteria = 0;
                let metCriteria = 0;
                
                // Reset all criteria
                document.querySelectorAll('.criteria-item').forEach(item => {
                    item.classList.remove('met');
                    const icon = item.querySelector('.criteria-icon');
                    icon.className = 'criteria-icon not-met';
                    icon.textContent = '✗';
                });
                
                // Check length
                totalCriteria++;
                if (password.length >= 8) {
                    strength += 20;
                    updateCriteria('length', true);
                    metCriteria++;
                } else {
                    updateCriteria('length', false);
                }
                
                // Check uppercase letters
                totalCriteria++;
                if (/[A-Z]/.test(password)) {
                    strength += 20;
                    updateCriteria('uppercase', true);
                    metCriteria++;
                } else {
                    updateCriteria('uppercase', false);
                }
                
                // Check lowercase letters
                totalCriteria++;
                if (/[a-z]/.test(password)) {
                    strength += 20;
                    updateCriteria('lowercase', true);
                    metCriteria++;
                } else {
                    updateCriteria('lowercase', false);
                }
                
                // Check numbers
                totalCriteria++;
                if (/[0-9]/.test(password)) {
                    strength += 20;
                    updateCriteria('numbers', true);
                    metCriteria++;
                } else {
                    updateCriteria('numbers', false);
                }
                
                // Check special characters
                totalCriteria++;
                if (/[!@#$%^&*]/.test(password)) {
                    strength += 20;
                    updateCriteria('special', true);
                    metCriteria++;
                } else {
                    updateCriteria('special', false);
                }
                
                // Check if not common password
                totalCriteria++;
                if (!commonPasswords.includes(password.toLowerCase())) {
                    strength += 20;
                    updateCriteria('common', true);
                    metCriteria++;
                } else {
                    updateCriteria('common', false);
                }
                
                // Update strength bar and text
                updateStrengthIndicator(strength, metCriteria, totalCriteria);
                
                // Update score
                scoreNumber.textContent = Math.round(strength);
            }
            
            function updateCriteria(criteria, isMet) {
                const item = document.querySelector(`[data-criteria="${criteria}"]`);
                const icon = item.querySelector('.criteria-icon');
                
                if (isMet) {
                    item.classList.add('met');
                    icon.className = 'criteria-icon met';
                    icon.textContent = '✓';
                } else {
                    item.classList.remove('met');
                    icon.className = 'criteria-icon not-met';
                    icon.textContent = '✗';
                }
            }
            
            function updateStrengthIndicator(strength, metCriteria, totalCriteria) {
                // Update the width and color of the strength bar
                let strengthClass = '';
                
                if (strength <= 20) {
                    strengthClass = 'very-weak';
                    strengthText.textContent = 'Very Weak';
                    strengthText.style.color = '#e74c3c';
                } else if (strength <= 40) {
                    strengthClass = 'weak';
                    strengthText.textContent = 'Weak';
                    strengthText.style.color = '#e67e22';
                } else if (strength <= 60) {
                    strengthClass = 'medium';
                    strengthText.textContent = 'Medium';
                    strengthText.style.color = '#f1c40f';
                } else if (strength <= 80) {
                    strengthClass = 'strong';
                    strengthText.textContent = 'Strong';
                    strengthText.style.color = '#2ecc71';
                } else {
                    strengthClass = 'very-strong';
                    strengthText.textContent = 'Very Strong';
                    strengthText.style.color = '#27ae60';
                }
                
                // Update the strength bar
                strengthFill.className = 'strength-fill ' + strengthClass;
                
                // Add more detailed text for very strong passwords
                if (metCriteria === totalCriteria && strength >= 100) {
                    strengthText.textContent = 'Excellent! This password is very secure';
                }
            }
        });

// DOM Elements
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const criteriaList = document.getElementById('criteriaList');
const scoreNumber = document.getElementById('scoreNumber');

// Generator Controls
const lengthRange = document.getElementById('lengthRange');
const lengthValue = document.getElementById('lengthValue');
const cbLower = document.getElementById('cbLower');
const cbUpper = document.getElementById('cbUpper');
const cbNumbers = document.getElementById('cbNumbers');
const cbSymbols = document.getElementById('cbSymbols');
const excludeAmbiguous = document.getElementById('excludeAmbiguous');
const passphraseMode = document.getElementById('passphraseMode');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const historyList = document.getElementById('historyList');

// Common weak passwords list
const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
    'qwerty123', 'dragon', 'master', 'hello', 'login', 'passw0rd',
    'football', 'baseball', 'sunshine', 'iloveyou', 'trustno1'
];

// Word list for passphrase mode (expandable)
const sampleWords = [
    'apple','river','sunset','forest','laptop','code','ocean',
    'mountain','star','cloud','spark','violet','copper','glow','atlas','pixel'
];

// Ambiguous characters to exclude if selected
const ambiguous = 'O0oIl1|';

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password) {
    let score = 0;
    const criteria = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+=\-\[\]{}|;:,.<>?]/.test(password),
        common: !commonPasswords.includes(password.toLowerCase())
    };

    Object.values(criteria).forEach(met => {
        if (met) score += 10;
    });

    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;

    const uniqueChars = new Set(password.toLowerCase()).size;
    if (uniqueChars >= password.length * 0.7) score += 10;

    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/123|abc|qwe|asd|zxc/i.test(password)) score -= 10; // Sequential
    if (/(\d{4,})/.test(password)) score -= 5; // Long numbers

    return { 
        score: Math.max(0, Math.min(100, score)), 
        criteria 
    };
}

/**
 * Determine strength level
 */
function getStrengthLevel(score) {
    if (score < 20) return { level: 'very-weak', text: 'Very Weak' };
    if (score < 40) return { level: 'weak', text: 'Weak' };
    if (score < 60) return { level: 'fair', text: 'Fair' };
    if (score < 80) return { level: 'good', text: 'Good' };
    return { level: 'strong', text: 'Strong' };
}

/**
 * Update strength visualization
 */
function updateStrengthVisualization(password) {
    const { score, criteria } = calculatePasswordStrength(password);
    const { level, text } = getStrengthLevel(score);

    strengthFill.style.width = `${score}%`;
    strengthFill.className = `strength-fill ${level}`;

    strengthText.textContent = password ? text : 'Enter a password to check its strength';
    strengthText.className = `strength-text ${level}-text`;

    scoreNumber.textContent = score;
    scoreNumber.className = `score-number ${level}-text`;

    Object.entries(criteria).forEach(([key, met]) => {
        const item = document.querySelector(`[data-criteria="${key}"]`);
        const icon = item.querySelector('.criteria-icon');
        
        if (met) {
            item.classList.add('met');
            item.classList.remove('not-met');
            icon.classList.add('met');
            icon.classList.remove('not-met');
            icon.textContent = '✓';
        } else {
            item.classList.add('not-met');
            item.classList.remove('met');
            icon.classList.add('not-met');
            icon.classList.remove('met');
            icon.textContent = '✗';
        }
    });
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
}

/**
 * Password Generator (character-based)
 */
function generatePasswordChar(length, opts) {
    let charset = '';
    if (opts.lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.num) charset += '0123456789';
    if (opts.sym) charset += '!@#$%^&*()-_=+[]{}|;:\'",.<>/?`~\\';

    if (opts.excludeAmb) {
        charset = charset.split('').filter(ch => !ambiguous.includes(ch)).join('');
    }
    if (!charset) return '';

    let pw = '';
    const getRandom = (max) => {
        if (window.crypto && crypto.getRandomValues) {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            return array[0] % max;
        } else {
            return Math.floor(Math.random() * max);
        }
    };
    for (let i = 0; i < length; i++) {
        pw += charset[getRandom(charset.length)];
    }
    return pw;
}

/**
 * Passphrase Generator
 */
function generatePassphrase(targetLength, opts) {
    const wordsCount = Math.max(2, Math.min(6, Math.round(targetLength / 4)));
    const words = [];
    for (let i = 0; i < wordsCount; i++) {
        const idx = Math.floor(Math.random() * sampleWords.length);
        words.push(sampleWords[idx]);
    }
    let phrase = words.join('-');
    if (opts.num) phrase += String(Math.floor(Math.random() * 90) + 10);
    if (opts.sym) phrase += ['!', '@', '#', '$'][Math.floor(Math.random()*4)];
    return phrase;
}

/**
 * Save password to history (localStorage)
 */
function saveHistory(entry) {
    try {
        const raw = localStorage.getItem('pwgen_history');
        const arr = raw ? JSON.parse(raw) : [];
        arr.unshift(entry);
        localStorage.setItem('pwgen_history', JSON.stringify(arr.slice(0, 20)));
        renderHistory();
    } catch (e) {
        console.warn('History save failed', e);
    }
}

/**
 * Render history in UI
 */
function renderHistory() {
    historyList.innerHTML = '';
    const raw = localStorage.getItem('pwgen_history');
    const arr = raw ? JSON.parse(raw) : [];
    arr.forEach(item => {
        const li = document.createElement('li');
        const dt = new Date(item.ts).toLocaleString();
        li.textContent = `${item.pw} · ${item.options.mode} · L:${item.options.length} · ${dt}`;
        historyList.appendChild(li);
    });
}

/**
 * Initialize application
 */
function initializeApp() {
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.6s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
    
    updateStrengthVisualization('');
    renderHistory();
}

// Event Listeners
togglePassword.addEventListener('click', togglePasswordVisibility);

passwordInput.addEventListener('input', (e) => {
    updateStrengthVisualization(e.target.value);
});

lengthRange?.addEventListener('input', () => {
    lengthValue.textContent = lengthRange.value;
});

generateBtn?.addEventListener('click', () => {
    const length = parseInt(lengthRange?.value || 12, 10);
    const opts = {
        lower: cbLower?.checked ?? true,
        upper: cbUpper?.checked ?? true,
        num: cbNumbers?.checked ?? true,
        sym: cbSymbols?.checked ?? true,
        excludeAmb: excludeAmbiguous?.checked ?? false,
        mode: passphraseMode?.checked ? 'passphrase' : 'chars'
    };

    let pw = '';
    if (opts.mode === 'passphrase') {
        pw = generatePassphrase(length, opts);
    } else {
        pw = generatePasswordChar(length, opts);
    }

    passwordInput.value = pw;
    updateStrengthVisualization(pw);

    saveHistory({ pw, options: { mode: opts.mode, length }, ts: Date.now() });
});

copyBtn?.addEventListener('click', async () => {
    const text = passwordInput.value;
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    } catch (e) {
        console.warn('Copy failed', e);
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', initializeApp);
