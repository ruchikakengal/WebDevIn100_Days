// DOM Elements
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const criteriaList = document.getElementById('criteriaList');
const scoreNumber = document.getElementById('scoreNumber');

// Common weak passwords list
const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
    'qwerty123', 'dragon', 'master', 'hello', 'login', 'passw0rd',
    'football', 'baseball', 'sunshine', 'iloveyou', 'trustno1'
];

/**
 * Calculate password strength based on multiple criteria
 * @param {string} password - The password to analyze
 * @returns {Object} Object containing score and criteria results
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

    // Basic criteria scoring (10 points each)
    Object.values(criteria).forEach(met => {
        if (met) score += 10;
    });

    // Length bonus scoring
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;

    // Complexity bonus - character diversity
    const uniqueChars = new Set(password.toLowerCase()).size;
    if (uniqueChars >= password.length * 0.7) score += 10;

    // Apply penalties for weak patterns
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters (aaa, 111)
    if (/123|abc|qwe|asd|zxc/i.test(password)) score -= 10; // Sequential patterns
    if (/(\d{4,})/.test(password)) score -= 5; // Long number sequences

    // Ensure score stays within 0-100 range
    return { 
        score: Math.max(0, Math.min(100, score)), 
        criteria 
    };
}

/**
 * Determine strength level based on score
 * @param {number} score - Password strength score (0-100)
 * @returns {Object} Object containing level identifier and display text
 */
function getStrengthLevel(score) {
    if (score < 20) return { level: 'very-weak', text: 'Very Weak' };
    if (score < 40) return { level: 'weak', text: 'Weak' };
    if (score < 60) return { level: 'fair', text: 'Fair' };
    if (score < 80) return { level: 'good', text: 'Good' };
    return { level: 'strong', text: 'Strong' };
}

/**
 * Update all visual elements based on password strength
 * @param {string} password - The password to analyze
 */
function updateStrengthVisualization(password) {
    const { score, criteria } = calculatePasswordStrength(password);
    const { level, text } = getStrengthLevel(score);

    // Update strength bar
    strengthFill.style.width = `${score}%`;
    strengthFill.className = `strength-fill ${level}`;

    // Update strength text
    strengthText.textContent = password ? text : 'Enter a password to check its strength';
    strengthText.className = `strength-text ${level}-text`;

    // Update score display
    scoreNumber.textContent = score;
    scoreNumber.className = `score-number ${level}-text`;

    // Update criteria checklist
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
 * Initialize the application with smooth entrance animation
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
    
    // Initialize with empty password
    updateStrengthVisualization('');
}

// Event Listeners
togglePassword.addEventListener('click', togglePasswordVisibility);

passwordInput.addEventListener('input', (e) => {
    updateStrengthVisualization(e.target.value);
});

// Initialize app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);