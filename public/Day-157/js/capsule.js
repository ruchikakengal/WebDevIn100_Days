// Capsule management and 3D visualization
class CapsuleManager {
    constructor() {
        this.capsules = new Map();
    }

    createCapsule(data) {
        const capsule = {
            id: data.id || this.generateId(),
            message: data.message,
            unlockDateTime: data.unlockDateTime,
            passwordProtected: data.passwordProtected || false,
            password: data.password || null,
            emailNotification: data.emailNotification || false,
            email: data.email || null,
            imageData: data.imageData || null,
            createdAt: data.createdAt || new Date().toISOString(),
            unlocked: data.unlocked || false,
            theme: data.theme || 'metallic'
        };

        this.capsules.set(capsule.id, capsule);
        return capsule;
    }

    getCapsule(id) {
        return this.capsules.get(id);
    }

    updateCapsule(capsule) {
        if (this.capsules.has(capsule.id)) {
            this.capsules.set(capsule.id, capsule);
            return true;
        }
        return false;
    }

    deleteCapsule(id) {
        return this.capsules.delete(id);
    }

    getAllCapsules() {
        return Array.from(this.capsules.values());
    }

    getUnlockedCapsules() {
        return this.getAllCapsules().filter(capsule => 
            capsule.unlocked || new Date() >= new Date(capsule.unlockDateTime)
        );
    }

    getLockedCapsules() {
        return this.getAllCapsules().filter(capsule => 
            !capsule.unlocked && new Date() < new Date(capsule.unlockDateTime)
        );
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    validateCapsuleData(data) {
        const errors = [];

        if (!data.message || data.message.trim().length === 0) {
            errors.push('Message is required');
        }

        if (!data.unlockDateTime) {
            errors.push('Unlock date/time is required');
        } else {
            const unlockDate = new Date(data.unlockDateTime);
            if (unlockDate <= new Date()) {
                errors.push('Unlock date must be in the future');
            }
        }

        if (data.passwordProtected && !data.password) {
            errors.push('Password is required for protected capsules');
        }

        if (data.emailNotification && !data.email) {
            errors.push('Email is required for notifications');
        }

        return errors;
    }

    encryptMessage(message, password) {
        // Simple encryption for demo - in production use proper encryption
        let encrypted = '';
        for (let i = 0; i < message.length; i++) {
            encrypted += String.fromCharCode(message.charCodeAt(i) ^ password.charCodeAt(i % password.length));
        }
        return btoa(encrypted);
    }

    decryptMessage(encrypted, password) {
        try {
            const decoded = atob(encrypted);
            let decrypted = '';
            for (let i = 0; i < decoded.length; i++) {
                decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length));
            }
            return decrypted;
        } catch (error) {
            throw new Error('Failed to decrypt message');
        }
    }
}

// 3D Capsule Renderer
class CapsuleRenderer {
    constructor(container) {
        this.container = container;
        this.theme = document.body.dataset.theme || 'metallic';
    }

    renderLockedCapsule(capsule) {
        const capsuleElement = document.createElement('div');
        capsuleElement.className = 'capsule-3d';
        
        const innerCapsule = document.createElement('div');
        innerCapsule.className = `capsule-locked ${this.theme}-theme`;
        
        // Add theme-specific styling
        this.applyCapsuleTheme(innerCapsule);
        
        // Add locking animation
        innerCapsule.style.animation = 'float 4s ease-in-out infinite';
        
        // Add glow effect
        if (this.isCloseToUnlock(capsule)) {
            innerCapsule.classList.add('pulse-glow');
        }
        
        capsuleElement.appendChild(innerCapsule);
        
        // Add interactive elements
        this.addCapsuleInteractivity(capsuleElement, capsule);
        
        return capsuleElement;
    }

    renderUnlockedCapsule(capsule) {
        const capsuleElement = document.createElement('div');
        capsuleElement.className = 'capsule-3d';
        
        const innerCapsule = document.createElement('div');
        innerCapsule.className = 'capsule-unlocked';
        
        // Opening animation
        innerCapsule.style.animation = 'capsuleOpen 2s ease-in-out';
        
        // Light beam effect
        const lightBeam = document.createElement('div');
        lightBeam.className = 'light-beam';
        
        capsuleElement.appendChild(innerCapsule);
        capsuleElement.appendChild(lightBeam);
        
        // Add celebration particles
        this.addCelebrationEffects(capsuleElement);
        
        return capsuleElement;
    }

    applyCapsuleTheme(element) {
        const theme = document.body.dataset.theme;
        
        switch (theme) {
            case 'neon':
                element.style.borderColor = '#ff3399';
                element.style.boxShadow = '0 0 20px rgba(255, 51, 153, 0.5), inset 0 0 20px rgba(255, 51, 153, 0.2)';
                break;
            case 'glass':
                element.style.backdropFilter = 'blur(20px)';
                element.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))';
                element.style.borderColor = '#00d4ff';
                break;
            default: // metallic
                element.style.borderColor = '#4a9eff';
                element.style.boxShadow = '0 0 20px rgba(74, 158, 255, 0.3), inset 0 0 20px rgba(74, 158, 255, 0.1)';
        }
    }

    isCloseToUnlock(capsule) {
        const unlockDate = new Date(capsule.unlockDateTime);
        const now = new Date();
        const timeLeft = unlockDate - now;
        
        // Glow if less than 1 hour remaining
        return timeLeft < 3600000 && timeLeft > 0;
    }

    addCapsuleInteractivity(element, capsule) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05) rotateY(15deg)';
            element.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1) rotateY(0deg)';
        });
        
        element.addEventListener('click', () => {
            this.createRippleEffect(element);
        });
    }

    addCelebrationEffects(element) {
        // Create particles container
        const particles = document.createElement('div');
        particles.className = 'celebration-particles';
        
        // Create individual particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = (Math.random() * 100) + '%';
            particle.style.animationDelay = (i * 0.1) + 's';
            particles.appendChild(particle);
        }
        
        element.appendChild(particles);
        
        // Remove particles after animation
        setTimeout(() => {
            particles.remove();
        }, 2000);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.position = 'absolute';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(74, 158, 255, 0.3)';
        ripple.style.animation = 'ripple 0.6s linear';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    updateTheme(newTheme) {
        this.theme = newTheme;
        // Re-apply theme to existing capsules
        document.querySelectorAll('.capsule-locked').forEach(capsule => {
            this.applyCapsuleTheme(capsule);
        });
    }
}

// Capsule Animation Controller
class CapsuleAnimations {
    constructor() {
        this.animations = new Map();
    }

    playLockAnimation(element) {
        element.classList.add('locking');
        element.style.animation = 'shake 0.5s ease-in-out, glow 1s ease-in-out 0.5s';
        
        // Play lock sound
        this.playSound('lock');
        
        // Remove classes after animation
        setTimeout(() => {
            element.classList.remove('locking');
            element.style.animation = 'float 4s ease-in-out infinite';
        }, 1500);
    }

    playUnlockAnimation(element, callback) {
        element.classList.add('unlocking');
        
        // Create light effect
        const lightEffect = document.createElement('div');
        lightEffect.className = 'unlock-light-effect';
        element.appendChild(lightEffect);
        
        // Play unlock sound
        this.playSound('unlock');
        
        // Animate opening
        element.style.animation = 'capsuleOpen 2s ease-in-out';
        
        setTimeout(() => {
            this.createUnlockConfetti(element);
            if (callback) callback();
        }, 1000);
        
        setTimeout(() => {
            element.classList.remove('unlocking');
            lightEffect.remove();
        }, 2000);
    }

    createUnlockConfetti(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.position = 'absolute';
            confetti.style.left = centerX + 'px';
            confetti.style.top = centerY + 'px';
            confetti.style.width = '6px';
            confetti.style.height = '6px';
            confetti.style.background = this.getRandomColor();
            
            // Random trajectory
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 100;
            
            confetti.style.animation = `confettiExplode 2s ease-out`;
            confetti.style.setProperty('--vx', vx + 'px');
            confetti.style.setProperty('--vy', vy + 'px');
            
            confettiContainer.appendChild(confetti);
        }
        
        // Clean up after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 2000);
    }

    getRandomColor() {
        const colors = ['#4a9eff', '#6bb6ff', '#ff3399', '#ff66b3', '#00d4ff', '#33ddff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    playSound(soundType) {
        // This will be handled by the AudioManager
        if (window.timeCapApp && window.timeCapApp.audioManager) {
            window.timeCapApp.audioManager.playSound(soundType);
        }
    }
}

// Add CSS for confetti explosion
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiExplode {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy)) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);
