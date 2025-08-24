// Main application controller
class TimeCapApp {
    constructor() {
        this.currentScreen = 'welcome';
        this.currentCapsule = null;
        this.storage = new CapsuleStorage();
        this.emailConfig = new EmailJSConfig();
        this.audioManager = new AudioManager();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupThemeSelector();
        this.showScreen('welcome');
        this.createBackgroundElements();
        
        // Initialize EmailJS
        this.emailConfig.init();
        
        // Check for unlocked capsules on load
        this.checkUnlockedCapsules();
        
        // Set up interval to check capsules every minute
        setInterval(() => this.checkUnlockedCapsules(), 60000);
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('create-capsule-btn').addEventListener('click', () => {
            this.showScreen('create');
            this.audioManager.playSound('click');
        });
        
        document.getElementById('view-capsules-btn').addEventListener('click', () => {
            this.showScreen('view');
            this.loadCapsules();
            this.audioManager.playSound('click');
        });

        document.getElementById('cancel-create-btn').addEventListener('click', () => {
            this.showScreen('welcome');
            this.clearForm();
            this.audioManager.playSound('click');
        });

        document.getElementById('back-to-welcome').addEventListener('click', () => {
            this.showScreen('welcome');
            this.audioManager.playSound('click');
        });

        document.getElementById('back-to-list').addEventListener('click', () => {
            this.showScreen('view');
            this.loadCapsules();
            this.audioManager.playSound('click');
        });

        // Form submission
        document.getElementById('capsule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCapsule();
        });

        // Form interactions
        this.setupFormInteractions();
        
        // Modal interactions
        this.setupModalInteractions();
        
        // Toast close
        document.getElementById('toast-close').addEventListener('click', () => {
            this.hideToast();
        });
    }

    setupFormInteractions() {
        // Emoji buttons
        document.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const emoji = btn.dataset.emoji;
                const textarea = document.getElementById('message-input');
                const cursorPos = textarea.selectionStart;
                const textBefore = textarea.value.substring(0, cursorPos);
                const textAfter = textarea.value.substring(cursorPos);
                textarea.value = textBefore + emoji + textAfter;
                textarea.focus();
                textarea.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
                this.audioManager.playSound('click');
            });
        });

        // Image upload
        document.getElementById('add-image-btn').addEventListener('click', () => {
            document.getElementById('image-upload').click();
            this.audioManager.playSound('click');
        });

        document.getElementById('image-upload').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Quick date buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const hours = parseInt(btn.dataset.hours);
                const futureDate = new Date();
                futureDate.setTime(futureDate.getTime() + (hours * 60 * 60 * 1000));
                
                // Format for datetime-local input
                const formatted = futureDate.toISOString().slice(0, -1);
                document.getElementById('unlock-datetime').value = formatted;
                this.audioManager.playSound('click');
            });
        });

        // Checkbox interactions
        document.getElementById('password-protect').addEventListener('change', (e) => {
            const passwordInput = document.getElementById('capsule-password');
            if (e.target.checked) {
                passwordInput.style.display = 'block';
                passwordInput.required = true;
            } else {
                passwordInput.style.display = 'none';
                passwordInput.required = false;
                passwordInput.value = '';
            }
        });

        document.getElementById('email-notify').addEventListener('change', (e) => {
            const emailInput = document.getElementById('notification-email');
            if (e.target.checked) {
                emailInput.style.display = 'block';
                emailInput.required = true;
            } else {
                emailInput.style.display = 'none';
                emailInput.required = false;
                emailInput.value = '';
            }
        });
    }

    setupModalInteractions() {
        document.getElementById('cancel-password').addEventListener('click', () => {
            this.hideModal();
            this.audioManager.playSound('click');
        });

        document.getElementById('submit-password').addEventListener('click', () => {
            this.checkCapsulePassword();
        });

        document.getElementById('modal-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkCapsulePassword();
            }
        });

        // Close modal on backdrop click
        document.getElementById('password-modal').addEventListener('click', (e) => {
            if (e.target.id === 'password-modal') {
                this.hideModal();
            }
        });
    }

    setupThemeSelector() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTheme(btn.dataset.theme);
                this.audioManager.playSound('click');
            });
        });
    }

    switchTheme(theme) {
        document.body.dataset.theme = theme;
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        // Save theme preference
        localStorage.setItem('timecapsule_theme', theme);
        this.audioManager.playSound('success');
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('fade-out');
        });

        // Show target screen after animation
        setTimeout(() => {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('fade-out');
            });
            
            document.getElementById(`${screenName}-screen`).classList.add('active', 'slide-in-up');
            this.currentScreen = screenName;
        }, 150);
    }

    createBackgroundElements() {
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            document.querySelector('.floating-particles').appendChild(particle);
        }
    }

    handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showToast('Image size must be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
            preview.style.display = 'block';
            this.audioManager.playSound('success');
        };
        reader.readAsDataURL(file);
    }

    async createCapsule() {
        const form = document.getElementById('capsule-form');
        const formData = new FormData(form);
        
        const message = document.getElementById('message-input').value.trim();
        const unlockDateTime = document.getElementById('unlock-datetime').value;
        const passwordProtect = document.getElementById('password-protect').checked;
        const password = passwordProtect ? document.getElementById('capsule-password').value : null;
        const emailNotify = document.getElementById('email-notify').checked;
        const email = emailNotify ? document.getElementById('notification-email').value : null;
        
        // Get uploaded image
        let imageData = null;
        const imagePreview = document.querySelector('#image-preview img');
        if (imagePreview) {
            imageData = imagePreview.src;
        }

        // Validation
        if (!message) {
            this.showToast('Please enter a message', 'error');
            return;
        }

        if (!unlockDateTime) {
            this.showToast('Please select an unlock date and time', 'error');
            return;
        }

        const unlockDate = new Date(unlockDateTime);
        if (unlockDate <= new Date()) {
            this.showToast('Unlock date must be in the future', 'error');
            return;
        }

        if (passwordProtect && !password) {
            this.showToast('Please enter a password', 'error');
            return;
        }

        if (emailNotify && !email) {
            this.showToast('Please enter an email address', 'error');
            return;
        }

        // Create capsule object
        const capsule = {
            id: Date.now().toString(),
            message,
            unlockDateTime: unlockDateTime,
            passwordProtected: passwordProtect,
            password: password,
            emailNotification: emailNotify,
            email: email,
            imageData: imageData,
            createdAt: new Date().toISOString(),
            unlocked: false
        };

        try {
            // Save capsule
            this.storage.saveCapsule(capsule);
            
            // Play lock sound
            this.audioManager.playSound('lock');
            
            // Show success message
            this.showToast('Time capsule created and locked successfully!', 'success');
            
            // Clear form and go back to welcome
            this.clearForm();
            setTimeout(() => {
                this.showScreen('welcome');
            }, 1500);
            
        } catch (error) {
            console.error('Error creating capsule:', error);
            this.showToast('Error creating capsule. Please try again.', 'error');
        }
    }

    loadCapsules() {
        const capsulesGrid = document.getElementById('capsules-grid');
        const capsules = this.storage.getAllCapsules();
        
        if (capsules.length === 0) {
            capsulesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-time-capsule" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                    <h3>No Time Capsules Yet</h3>
                    <p>Create your first time capsule to get started!</p>
                </div>
            `;
            return;
        }

        capsulesGrid.innerHTML = '';
        
        capsules.forEach(capsule => {
            const capsuleCard = this.createCapsuleCard(capsule);
            capsulesGrid.appendChild(capsuleCard);
        });
    }

    createCapsuleCard(capsule) {
        const card = document.createElement('div');
        card.className = 'capsule-card hover-lift';
        
        const unlockDate = new Date(capsule.unlockDateTime);
        const now = new Date();
        const isUnlocked = now >= unlockDate || capsule.unlocked;
        
        const preview = capsule.message.length > 100 
            ? capsule.message.substring(0, 100) + '...' 
            : capsule.message;
        
        card.innerHTML = `
            <div class="capsule-info">
                <div class="capsule-status ${isUnlocked ? 'unlocked' : 'locked'}">
                    <i class="fas fa-${isUnlocked ? 'unlock' : 'lock'}"></i>
                    ${isUnlocked ? 'Unlocked' : 'Locked'}
                </div>
                <div class="capsule-preview">${preview}</div>
                <div class="capsule-unlock-time">
                    ${isUnlocked ? 'Unlocked on' : 'Unlocks on'}: ${unlockDate.toLocaleString()}
                </div>
                ${capsule.passwordProtected ? '<i class="fas fa-shield-alt" title="Password Protected"></i>' : ''}
                ${capsule.emailNotification ? '<i class="fas fa-envelope" title="Email Notification"></i>' : ''}
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.viewCapsule(capsule.id);
            this.audioManager.playSound('click');
        });
        
        return card;
    }

    viewCapsule(capsuleId) {
        const capsule = this.storage.getCapsule(capsuleId);
        if (!capsule) {
            this.showToast('Capsule not found', 'error');
            return;
        }

        this.currentCapsule = capsule;
        
        // Check if password protected
        if (capsule.passwordProtected && !capsule.unlocked) {
            this.showPasswordModal();
            return;
        }
        
        this.displayCapsule(capsule);
    }

    showPasswordModal() {
        const modal = document.getElementById('password-modal');
        modal.classList.add('show', 'scale-in');
        document.getElementById('modal-password').focus();
    }

    hideModal() {
        const modal = document.getElementById('password-modal');
        modal.classList.remove('show', 'scale-in');
        document.getElementById('modal-password').value = '';
    }

    checkCapsulePassword() {
        const enteredPassword = document.getElementById('modal-password').value;
        
        if (enteredPassword === this.currentCapsule.password) {
            this.hideModal();
            this.displayCapsule(this.currentCapsule);
            this.audioManager.playSound('success');
        } else {
            this.showToast('Incorrect password', 'error');
            document.getElementById('modal-password').classList.add('shake-effect');
            setTimeout(() => {
                document.getElementById('modal-password').classList.remove('shake-effect');
            }, 500);
            this.audioManager.playSound('error');
        }
    }

    displayCapsule(capsule) {
        this.showScreen('detail');
        
        const capsuleDisplay = document.getElementById('capsule-display');
        const unlockDate = new Date(capsule.unlockDateTime);
        const now = new Date();
        const isUnlocked = now >= unlockDate || capsule.unlocked;
        
        if (isUnlocked) {
            this.showUnlockedCapsule(capsule, capsuleDisplay);
        } else {
            this.showLockedCapsule(capsule, capsuleDisplay, unlockDate);
        }
    }

    showLockedCapsule(capsule, container, unlockDate) {
        container.innerHTML = `
            <div class="capsule-3d">
                <div class="capsule-locked pulse-glow"></div>
            </div>
            <h3>Time Capsule Locked</h3>
            <p>This capsule will unlock on ${unlockDate.toLocaleString()}</p>
            <div class="countdown-display" id="countdown-display">
                ${this.createCountdownHTML()}
            </div>
        `;
        
        // Start countdown
        this.startCountdown(unlockDate);
    }

    showUnlockedCapsule(capsule, container) {
        // Mark as unlocked if not already
        if (!capsule.unlocked) {
            capsule.unlocked = true;
            this.storage.updateCapsule(capsule);
            
            // Send email notification if enabled
            if (capsule.emailNotification && capsule.email) {
                this.emailConfig.sendNotification(capsule);
            }
        }

        container.innerHTML = `
            <div class="capsule-3d">
                <div class="capsule-locked capsule-opening"></div>
                <div class="light-beam"></div>
                <div class="celebration-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
            </div>
        `;
        
        // Play opening animation and sound
        this.audioManager.playSound('unlock');
        this.createConfetti();
        
        // Show message after animation
        setTimeout(() => {
            container.innerHTML = `
                <h3>Time Capsule Opened!</h3>
                <div class="message-content message-reveal">
                    <div class="message-text">${capsule.message}</div>
                    ${capsule.imageData ? `<img src="${capsule.imageData}" alt="Capsule image" class="message-image">` : ''}
                </div>
                <p>Created on: ${new Date(capsule.createdAt).toLocaleString()}</p>
            `;
        }, 2000);
    }

    createCountdownHTML() {
        return `
            <div class="countdown-item">
                <span class="countdown-number" id="days">0</span>
                <div class="countdown-label">Days</div>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="hours">0</span>
                <div class="countdown-label">Hours</div>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="minutes">0</span>
                <div class="countdown-label">Minutes</div>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="seconds">0</span>
                <div class="countdown-label">Seconds</div>
            </div>
        `;
    }

    startCountdown(unlockDate) {
        const countdown = new CountdownTimer(unlockDate);
        countdown.start((timeLeft) => {
            if (timeLeft.total <= 0) {
                // Capsule is now unlocked!
                this.displayCapsule(this.currentCapsule);
                return;
            }
            
            // Update display with flip animation
            this.updateCountdownDisplay(timeLeft);
        });
    }

    updateCountdownDisplay(timeLeft) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && element.textContent !== timeLeft[key].toString()) {
                element.classList.add('flip-number');
                element.textContent = timeLeft[key];
                
                setTimeout(() => {
                    element.classList.remove('flip-number');
                }, 600);
            }
        });
    }

    createConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (Math.random() * 2 + 1) + 's';
            container.appendChild(piece);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            container.remove();
        }, 5000);
    }

    checkUnlockedCapsules() {
        const capsules = this.storage.getAllCapsules();
        const now = new Date();
        
        capsules.forEach(capsule => {
            if (!capsule.unlocked && now >= new Date(capsule.unlockDateTime)) {
                // Send notification for newly unlocked capsule
                this.showToast(`Time capsule "${capsule.message.substring(0, 30)}..." is now unlocked!`, 'success');
                
                // Send email if enabled
                if (capsule.emailNotification && capsule.email) {
                    this.emailConfig.sendNotification(capsule);
                }
            }
        });
    }

    clearForm() {
        document.getElementById('capsule-form').reset();
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('capsule-password').style.display = 'none';
        document.getElementById('notification-email').style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }

    hideToast() {
        document.getElementById('toast').classList.remove('show');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('timecapsule_theme') || 'metallic';
    document.body.dataset.theme = savedTheme;
    document.querySelector(`[data-theme="${savedTheme}"]`).classList.add('active');
    
    // Initialize app
    window.timeCapApp = new TimeCapApp();
});
