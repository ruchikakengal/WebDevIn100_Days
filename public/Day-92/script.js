class RoastMaster {
    constructor() {
        this.userData = {};
        this.currentRoastLevel = 'light';
        this.savedRoasts = this.loadSavedRoasts();
        this.currentRoasts = [];
        this.isRapidMode = false;
        
        this.initializeApp();
        this.bindEvents();
        this.updateSavedRoastsDisplay();
    }
    
    // Initialize the application
    initializeApp() {
        // Add fire particles animation
        this.createFireParticles();
        
        // Set up form validation
        this.setupFormValidation();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        console.log('🔥 Roast Master 3000 initialized! Ready to destroy some egos! 🔥');
    }
    
    // Bind all event listeners
    bindEvents() {
        // Form submission
        const roastForm = document.getElementById('roastForm');
        roastForm?.addEventListener('submit', (e) => e.preventDefault());
        
        // Roast mode buttons
        const roastButtons = document.querySelectorAll('.roast-btn');
        roastButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleRoastMode(e.target.closest('.roast-btn'));
            });
        });
        
        // Action buttons
        document.getElementById('roastAgain')?.addEventListener('click', () => {
            this.generateNewRoast();
        });
        
        document.getElementById('saveRoast')?.addEventListener('click', () => {
            this.saveCurrentRoast();
        });
        
        document.getElementById('shareRoast')?.addEventListener('click', () => {
            this.shareRoast();
        });
        
        document.getElementById('newVictim')?.addEventListener('click', () => {
            this.resetToForm();
        });
        
        // Form inputs for real-time validation
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearInputError(input));
        });
        
        // Roast level changes
        const roastLevels = document.querySelectorAll('input[name="roastLevel"]');
        roastLevels.forEach(level => {
            level.addEventListener('change', (e) => {
                this.currentRoastLevel = e.target.value;
                this.updateRoastLevelIndicator(e.target.value);
            });
        });
    }
    
    // Handle roast mode selection
    handleRoastMode(button) {
        if (!this.validateForm()) {
            this.showToast('Please fill in all fields before getting roasted! 🔥', 'error');
            return;
        }
        
        this.collectUserData();
        
        const mode = button.dataset.mode;
        this.isRapidMode = mode === 'rapid';
        
        // Add button animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Show loading and generate roast
        this.showLoading();
        
        setTimeout(() => {
            if (this.isRapidMode) {
                this.generateRapidRoasts();
            } else {
                this.generateSingleRoast();
            }
            this.hideLoading();
        }, 2000); // Dramatic pause for effect
    }
    
    // Collect user data from form
    collectUserData() {
        const formData = new FormData(document.getElementById('roastForm'));
        this.userData = {
            name: formData.get('name').trim(),
            age: formData.get('age'),
            hobby: formData.get('hobby').trim(),
            job: formData.get('job').trim(),
            food: formData.get('food').trim(),
            dream: formData.get('dream').trim(),
            habit: formData.get('habit').trim()
        };
        this.currentRoastLevel = formData.get('roastLevel') || 'light';
    }
    
    // Generate a single roast
    generateSingleRoast() {
        const roast = getRandomRoast(this.currentRoastLevel, this.userData);
        const reactionImg = getRandomReactionImage();
        
        this.currentRoasts = [roast];
        this.displayRoast(roast, reactionImg);
        this.showRoastSection();
    }
    
    // Generate multiple rapid-fire roasts
    generateRapidRoasts() {
        const roastCount = Math.floor(Math.random() * 3) + 3; // 3-5 roasts
        const roasts = [];
        
        for (let i = 0; i < roastCount; i++) {
            const roast = getRandomRoast(this.currentRoastLevel, this.userData);
            roasts.push(roast);
        }
        
        this.currentRoasts = roasts;
        this.displayRapidRoasts(roasts);
        this.showRoastSection();
    }
    
    // Display a single roast
    displayRoast(roast, reactionImg) {
        const roastDisplay = document.getElementById('roastDisplay');
        const reactionImage = document.getElementById('reactionImg');
        const roastTitle = document.getElementById('roastTitle');
        
        roastTitle.textContent = `🔥 ${this.userData.name}, You've Been Roasted! 🔥`;
        reactionImage.src = reactionImg;
        reactionImage.alt = 'Reaction to the epic roast';
        
        // Animate text typing effect
        this.typewriterEffect(roastDisplay, roast);
    }
    
    // Display rapid roasts with staggered animation
    displayRapidRoasts(roasts) {
        const roastDisplay = document.getElementById('roastDisplay');
        const reactionImage = document.getElementById('reactionImg');
        const roastTitle = document.getElementById('roastTitle');
        
        roastTitle.textContent = `🚀 ${this.userData.name}, Prepare for Rapid Annihilation! 🚀`;
        reactionImage.src = getRandomReactionImage();
        
        roastDisplay.innerHTML = '';
        
        roasts.forEach((roast, index) => {
            setTimeout(() => {
                const roastElement = document.createElement('div');
                roastElement.className = 'rapid-roast-item';
                roastElement.style.cssText = `
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255, 107, 0, 0.1);
                    border-left: 3px solid var(--fire-orange);
                    border-radius: 8px;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease;
                `;
                
                roastElement.innerHTML = `
                    <div style="font-weight: 600; color: var(--fire-gold); margin-bottom: 0.5rem;">
                        🔥 Roast #${index + 1}:
                    </div>
                    <div>${roast}</div>
                `;
                
                roastDisplay.appendChild(roastElement);
                
                // Trigger animation
                setTimeout(() => {
                    roastElement.style.opacity = '1';
                    roastElement.style.transform = 'translateY(0)';
                }, 100);
                
                // Change reaction image for each roast
                if (index < roasts.length - 1) {
                    setTimeout(() => {
                        reactionImage.src = getRandomReactionImage();
                    }, 1500);
                }
            }, index * 2000); // Stagger each roast by 2 seconds
        });
    }
    
    // Typewriter effect for single roasts
    typewriterEffect(element, text) {
        element.innerHTML = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text[index];
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30);
    }
    
    // Generate a new roast with the same data
    generateNewRoast() {
        if (this.isRapidMode) {
            this.generateRapidRoasts();
        } else {
            this.generateSingleRoast();
        }
        
        this.showToast('Fresh roast incoming! 🔥');
    }
    
    // Save the current roast to localStorage
    saveCurrentRoast() {
        if (this.currentRoasts.length === 0) return;
        
        const roastToSave = this.isRapidMode 
            ? this.currentRoasts.join(' | ') 
            : this.currentRoasts[0];
        
        const savedRoast = {
            id: Date.now(),
            text: roastToSave,
            level: this.currentRoastLevel,
            victim: this.userData.name,
            timestamp: new Date().toLocaleString(),
            mode: this.isRapidMode ? 'rapid' : 'single'
        };
        
        this.savedRoasts.push(savedRoast);
        this.saveSavedRoasts();
        this.updateSavedRoastsDisplay();
        
        this.showToast('Roast saved to your collection! 💾');
    }
    
    // Share the current roast
    async shareRoast() {
        if (this.currentRoasts.length === 0) return;
        
        const roastToShare = this.isRapidMode 
            ? `Check out these savage roasts I got:\n\n${this.currentRoasts.join('\n\n')}` 
            : `Check out this savage roast I got:\n\n"${this.currentRoasts[0]}"`;
        
        const shareData = {
            title: '🔥 I Got Roasted by Roast Master 3000! 🔥',
            text: roastToShare,
            url: window.location.href
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Roast shared successfully! 📱');
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
                this.showToast('Roast copied to clipboard! 📋');
            }
        } catch (error) {
            console.error('Share failed:', error);
            this.showToast('Share failed, but you can copy the text! 😅', 'error');
        }
    }
    
    // Reset to form view
    resetToForm() {
        document.getElementById('formSection').style.display = 'block';
        document.getElementById('roastSection').style.display = 'none';
        
        // Clear form
        document.getElementById('roastForm').reset();
        
        // Reset data
        this.userData = {};
        this.currentRoasts = [];
        this.isRapidMode = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        this.showToast('Ready for a new victim! 😈');
    }
    
    // Show roast section and hide form
    showRoastSection() {
        document.getElementById('formSection').style.display = 'none';
        document.getElementById('roastSection').style.display = 'block';
        
        // Scroll to roast section
        document.getElementById('roastSection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Form validation
    validateForm() {
        const requiredInputs = document.querySelectorAll('input[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Validate individual input
    validateInput(input) {
        const value = input.value.trim();
        const isValid = value.length > 0;
        
        if (!isValid) {
            this.showInputError(input, 'This field is required');
            return false;
        }
        
        // Additional validation for specific fields
        if (input.type === 'number') {
            const num = parseInt(value);
            if (num < 13 || num > 100) {
                this.showInputError(input, 'Age must be between 13 and 100');
                return false;
            }
        }
        
        if (value.length > 100) {
            this.showInputError(input, 'Please keep it under 100 characters');
            return false;
        }
        
        this.clearInputError(input);
        return true;
    }
    
    // Show input error
    showInputError(input, message) {
        input.style.borderColor = 'var(--fire-red)';
        input.style.boxShadow = '0 0 0 4px rgba(255, 45, 0, 0.3)';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: var(--fire-red);
            font-size: 0.9rem;
            margin-top: 0.5rem;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    // Clear input error
    clearInputError(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Setup form validation
    setupFormValidation() {
        // Add real-time character counters
        const textInputs = document.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                font-size: 0.8rem;
                color: var(--text-secondary);
                text-align: right;
                margin-top: 0.25rem;
            `;
            
            const updateCounter = () => {
                const count = input.value.length;
                counter.textContent = `${count}/100`;
                counter.style.color = count > 100 ? 'var(--fire-red)' : 'var(--text-secondary)';
            };
            
            input.addEventListener('input', updateCounter);
            updateCounter();
            
            input.parentNode.appendChild(counter);
        });
    }
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form or generate new roast
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const formSection = document.getElementById('formSection');
                const roastSection = document.getElementById('roastSection');
                
                if (formSection.style.display !== 'none') {
                    // Form is visible, try to generate roast
                    const singleRoastBtn = document.querySelector('.single-roast');
                    if (singleRoastBtn) {
                        singleRoastBtn.click();
                    }
                } else if (roastSection.style.display !== 'none') {
                    // Roast is visible, generate new roast
                    this.generateNewRoast();
                }
                
                e.preventDefault();
            }
            
            // Escape to go back to form
            if (e.key === 'Escape') {
                const roastSection = document.getElementById('roastSection');
                if (roastSection.style.display !== 'none') {
                    this.resetToForm();
                }
            }
        });
    }
    
    // Update roast level indicator
    updateRoastLevelIndicator(level) {
        const indicators = {
            light: '☕ Prepare for gentle burns...',
            medium: '🔥 Heat is rising...',
            nuclear: '☢️ MAXIMUM DESTRUCTION MODE!'
        };
        
        this.showToast(indicators[level] || 'Roast level updated!');
    }
    
    // Load saved roasts from localStorage
    loadSavedRoasts() {
        try {
            const saved = localStorage.getItem('roastMaster_savedRoasts');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading saved roasts:', error);
            return [];
        }
    }
    
    // Save roasts to localStorage
    saveSavedRoasts() {
        try {
            localStorage.setItem('roastMaster_savedRoasts', JSON.stringify(this.savedRoasts));
        } catch (error) {
            console.error('Error saving roasts:', error);
            this.showToast('Failed to save roast! 😞', 'error');
        }
    }
    
    // Update saved roasts display
    updateSavedRoastsDisplay() {
        const savedContainer = document.getElementById('savedRoasts');
        const countBadge = document.getElementById('savedCount');
        
        countBadge.textContent = this.savedRoasts.length;
        
        if (this.savedRoasts.length === 0) {
            savedContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); font-style: italic; padding: 2rem;">
                    <i class="fas fa-fire" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No saved roasts yet. Get roasted and save your favorites!</p>
                </div>
            `;
            return;
        }
        
        const roastsHTML = this.savedRoasts
            .sort((a, b) => b.id - a.id) // Most recent first
            .map(roast => `
                <div class="saved-roast">
                    <div class="saved-roast-text">"${roast.text.substring(0, 150)}${roast.text.length > 150 ? '...' : ''}"</div>
                    <div class="saved-roast-meta">
                        <span>
                            <i class="fas fa-user"></i> ${roast.victim} |
                            <i class="fas fa-fire"></i> ${roast.level} |
                            <i class="fas fa-clock"></i> ${roast.timestamp}
                        </span>
                        <button class="delete-saved" onclick="roastMaster.deleteSavedRoast(${roast.id})" title="Delete this roast">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        
        savedContainer.innerHTML = roastsHTML;
    }
    
    // Delete a saved roast
    deleteSavedRoast(id) {
        this.savedRoasts = this.savedRoasts.filter(roast => roast.id !== id);
        this.saveSavedRoasts();
        this.updateSavedRoastsDisplay();
        this.showToast('Roast deleted! 🗑️');
    }
    
    // Show loading animation
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('show');
    }
    
    // Hide loading animation
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.remove('show');
    }
    
    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Create fire particles animation
    createFireParticles() {
        const fireContainer = document.getElementById('fireParticles');
        
        // Create floating embers
        for (let i = 0; i < 20; i++) {
            const ember = document.createElement('div');
            ember.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--fire-orange);
                border-radius: 50%;
                box-shadow: 0 0 10px var(--fire-orange);
                animation: floatUp ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                left: ${Math.random() * 100}%;
                top: 100%;
            `;
            
            fireContainer.appendChild(ember);
        }
        
        // Add CSS animation for floating embers
        if (!document.querySelector('#emberAnimation')) {
            const style = document.createElement('style');
            style.id = 'emberAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.roastMaster = new RoastMaster();
    
    // Add some console flair
    console.log(`
    🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    🔥                                      🔥
    🔥     WELCOME TO ROAST MASTER 3000    🔥
    🔥                                      🔥
    🔥     Where egos come to die and       🔥
    🔥     feelings get extra crispy!       🔥
    🔥                                      🔥
    🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    
    Ready to destroy some self-esteem? 😈
    `);
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // We're not implementing a full PWA here, but this shows we could
        console.log('🔥 Ready for PWA features if needed!');
    });
}

// Add some Easter eggs for the curious
window.addEventListener('konami', () => {
    document.body.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        document.body.style.transform = '';
    }, 2000);
});

// Listen for the Konami Code
(function() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                window.dispatchEvent(new Event('konami'));
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
})();
