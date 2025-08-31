// Countdown timer functionality
class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate);
        this.intervalId = null;
        this.callbacks = [];
        this.isRunning = false;
        this.previousValues = {};
    }

    start(callback) {
        if (callback) {
            this.callbacks.push(callback);
        }

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        
        // Update immediately
        this.update();
        
        // Then update every second
        this.intervalId = setInterval(() => {
            this.update();
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    update() {
        const now = new Date();
        const timeLeft = this.calculateTimeLeft(now);
        
        // Check if countdown finished
        if (timeLeft.total <= 0) {
            this.stop();
            this.onCountdownFinish();
        }
        
        // Notify callbacks
        this.callbacks.forEach(callback => {
            callback(timeLeft, this.hasValueChanged(timeLeft));
        });
        
        // Store current values for comparison
        this.previousValues = { ...timeLeft };
    }

    calculateTimeLeft(now) {
        const total = this.targetDate - now;
        
        if (total <= 0) {
            return {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);
        
        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    hasValueChanged(currentValues) {
        return Object.keys(currentValues).some(key => 
            this.previousValues[key] !== currentValues[key]
        );
    }

    onCountdownFinish() {
        // Play unlock sound
        if (window.timeCapApp && window.timeCapApp.audioManager) {
            window.timeCapApp.audioManager.playSound('unlock');
        }
        
        // Trigger celebration effects
        this.triggerCelebration();
    }

    triggerCelebration() {
        // Create celebration confetti
        this.createCelebrationConfetti();
        
        // Show success message
        if (window.timeCapApp) {
            window.timeCapApp.showToast('🎉 Time Capsule Unlocked!', 'success');
        }
    }

    createCelebrationConfetti() {
        const container = document.createElement('div');
        container.className = 'countdown-celebration';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        
        document.body.appendChild(container);
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'celebration-confetti';
            piece.style.position = 'absolute';
            piece.style.width = '8px';
            piece.style.height = '8px';
            piece.style.background = this.getRandomCelebrationColor();
            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = '-10px';
            piece.style.borderRadius = '50%';
            
            // Random animation properties
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
            piece.style.animation = `celebrationFall ${piece.style.animationDuration} linear ${piece.style.animationDelay}`;
            
            container.appendChild(piece);
        }
        
        // Remove after animation
        setTimeout(() => {
            container.remove();
        }, 6000);
    }

    getRandomCelebrationColor() {
        const theme = document.body.dataset.theme || 'metallic';
        const colorSets = {
            metallic: ['#4a9eff', '#6bb6ff', '#ffffff', '#cccccc'],
            neon: ['#ff3399', '#ff66b3', '#cc99ff', '#e6ccff'],
            glass: ['#00d4ff', '#33ddff', '#66e6ff', '#ffffff']
        };
        
        const colors = colorSets[theme];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    getTimeUntil() {
        return this.calculateTimeLeft(new Date());
    }

    isExpired() {
        return this.getTimeUntil().total <= 0;
    }

    getFormattedTimeLeft() {
        const timeLeft = this.getTimeUntil();
        
        if (timeLeft.total <= 0) {
            return 'Expired';
        }
        
        if (timeLeft.days > 0) {
            return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
        } else if (timeLeft.hours > 0) {
            return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
        } else {
            return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
        }
    }
}

// Countdown Display Manager
class CountdownDisplayManager {
    constructor() {
        this.activeCountdowns = new Map();
        this.flipAnimationDuration = 600;
    }

    createCountdownDisplay(targetDate, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Countdown container not found:', containerId);
            return null;
        }

        const countdown = new CountdownTimer(targetDate);
        const displayId = `countdown-${Date.now()}`;
        
        // Create countdown HTML
        container.innerHTML = this.generateCountdownHTML(displayId);
        
        // Start countdown with display updates
        countdown.start((timeLeft, hasChanged) => {
            this.updateDisplay(displayId, timeLeft, hasChanged);
        });
        
        this.activeCountdowns.set(displayId, countdown);
        return displayId;
    }

    generateCountdownHTML(displayId) {
        return `
            <div class="countdown-display" id="${displayId}">
                <div class="countdown-item">
                    <div class="countdown-number-container">
                        <span class="countdown-number" data-type="days">0</span>
                    </div>
                    <div class="countdown-label">Days</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number-container">
                        <span class="countdown-number" data-type="hours">0</span>
                    </div>
                    <div class="countdown-label">Hours</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number-container">
                        <span class="countdown-number" data-type="minutes">0</span>
                    </div>
                    <div class="countdown-label">Minutes</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number-container">
                        <span class="countdown-number" data-type="seconds">0</span>
                    </div>
                    <div class="countdown-label">Seconds</div>
                </div>
            </div>
        `;
    }

    updateDisplay(displayId, timeLeft, hasChanged) {
        const container = document.getElementById(displayId);
        if (!container) return;

        const elements = {
            days: container.querySelector('[data-type="days"]'),
            hours: container.querySelector('[data-type="hours"]'),
            minutes: container.querySelector('[data-type="minutes"]'),
            seconds: container.querySelector('[data-type="seconds"]')
        };

        Object.keys(elements).forEach(type => {
            const element = elements[type];
            if (!element) return;

            const newValue = timeLeft[type];
            const currentValue = parseInt(element.textContent);

            if (newValue !== currentValue) {
                this.animateNumberChange(element, currentValue, newValue);
            }
        });

        // Add special effects for low time
        this.addUrgencyEffects(container, timeLeft);
    }

    animateNumberChange(element, oldValue, newValue) {
        // Create flip animation
        element.classList.add('flipping');
        
        // Change the number halfway through the animation
        setTimeout(() => {
            element.textContent = newValue.toString().padStart(2, '0');
        }, this.flipAnimationDuration / 2);
        
        // Remove animation class
        setTimeout(() => {
            element.classList.remove('flipping');
        }, this.flipAnimationDuration);
        
        // Play tick sound for seconds
        if (element.dataset.type === 'seconds' && window.timeCapApp && window.timeCapApp.audioManager) {
            window.timeCapApp.audioManager.playSound('tick');
        }
    }

    addUrgencyEffects(container, timeLeft) {
        // Add urgent styling when time is low
        if (timeLeft.total <= 300000) { // Less than 5 minutes
            container.classList.add('urgent');
            
            // Add pulsing effect
            if (timeLeft.total <= 60000) { // Less than 1 minute
                container.classList.add('critical');
            }
        } else {
            container.classList.remove('urgent', 'critical');
        }
    }

    destroyCountdown(displayId) {
        const countdown = this.activeCountdowns.get(displayId);
        if (countdown) {
            countdown.stop();
            this.activeCountdowns.delete(displayId);
        }
        
        const container = document.getElementById(displayId);
        if (container) {
            container.remove();
        }
    }

    destroyAll() {
        this.activeCountdowns.forEach((countdown, id) => {
            this.destroyCountdown(id);
        });
    }
}

// Add countdown-specific CSS animations
const countdownStyles = document.createElement('style');
countdownStyles.textContent = `
    .countdown-number-container {
        position: relative;
        perspective: 200px;
        height: 3rem;
        overflow: hidden;
    }
    
    .countdown-number.flipping {
        animation: flipNumber 0.6s ease-in-out;
    }
    
    .countdown-display.urgent .countdown-item {
        border-color: #ffc107;
        box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
    }
    
    .countdown-display.urgent .countdown-number {
        color: #ffc107;
    }
    
    .countdown-display.critical {
        animation: urgentPulse 1s infinite;
    }
    
    .countdown-display.critical .countdown-item {
        border-color: #dc3545;
        box-shadow: 0 0 20px rgba(220, 53, 69, 0.5);
    }
    
    .countdown-display.critical .countdown-number {
        color: #dc3545;
    }
    
    @keyframes urgentPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes celebrationFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(countdownStyles);
