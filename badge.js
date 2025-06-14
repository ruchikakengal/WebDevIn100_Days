// Dynamic Badge Generator JavaScript
class BadgeGenerator {
    constructor() {
        this.init();
        this.bindEvents();
        this.setDefaultDate();
        this.updatePreview();
    }

    init() {
        // Cache DOM elements
        this.elements = {
            // Form inputs
            userName: document.getElementById('userName'),
            achievement: document.getElementById('achievement'),
            badgeDate: document.getElementById('badgeDate'),
            badgeType: document.getElementById('badgeType'),
            colorInputs: document.querySelectorAll('input[name="color"]'),
            
            // Buttons
            generateBtn: document.getElementById('generateBadge'),
            downloadBtn: document.getElementById('downloadBadge'),
            backBtn: document.getElementById('backToHome'),
            
            // Preview elements
            badgePreview: document.getElementById('badgePreview'),
            previewName: document.getElementById('previewName'),
            previewAchievement: document.getElementById('previewAchievement'),
            previewDate: document.getElementById('previewDate'),
            previewType: document.getElementById('previewType'),
            
            // Error elements
            userNameError: document.getElementById('userNameError'),
            achievementError: document.getElementById('achievementError'),
            badgeDateError: document.getElementById('badgeDateError'),
            badgeTypeError: document.getElementById('badgeTypeError'),
            
            // Toast and confetti
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            confettiContainer: document.getElementById('confettiContainer')
        };

        // State
        this.state = {
            isGenerated: false,
            currentColor: 'emerald'
        };
    }

    bindEvents() {
        // Form input events for live preview
        this.elements.userName.addEventListener('input', () => this.updatePreview());
        this.elements.achievement.addEventListener('input', () => this.updatePreview());
        this.elements.badgeDate.addEventListener('change', () => this.updatePreview());
        this.elements.badgeType.addEventListener('change', () => this.updatePreview());
        
        // Color selection
        this.elements.colorInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.state.currentColor = input.value;
                this.updatePreview();
            });
        });

        // Button events
        this.elements.generateBtn.addEventListener('click', () => this.generateBadge());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadBadge());
        
        // Back button (if you have routing)
        this.elements.backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Add your routing logic here
            console.log('Navigate back to home');
        });

        // Form validation on blur
        this.elements.userName.addEventListener('blur', () => this.validateField('userName'));
        this.elements.achievement.addEventListener('blur', () => this.validateField('achievement'));
        this.elements.badgeDate.addEventListener('blur', () => this.validateField('badgeDate'));

        // Prevent form submission on Enter
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
                this.generateBadge();
            }
        });
    }

    setDefaultDate() {
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        this.elements.badgeDate.value = today;
    }

    updatePreview() {
        // Update preview with current form values
        const name = this.elements.userName.value.trim() || 'Your Name';
        const achievement = this.elements.achievement.value.trim() || 'Your Achievement';
        const date = this.elements.badgeDate.value ? this.formatDate(this.elements.badgeDate.value) : 'Select Date';
        const type = this.elements.badgeType.value;

        // Update preview text
        this.elements.previewName.textContent = name;
        this.elements.previewAchievement.textContent = achievement;
        this.elements.previewDate.textContent = date;
        this.elements.previewType.textContent = type;

        // Update badge color theme
        this.elements.badgePreview.className = `badge ${this.state.currentColor}`;
    }

    validateField(fieldName) {
        const field = this.elements[fieldName];
        const errorElement = this.elements[fieldName + 'Error'];
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        field.classList.remove('error');
        errorElement.classList.remove('show');

        switch (fieldName) {
            case 'userName':
                if (!field.value.trim()) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (field.value.trim().length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                } else if (field.value.trim().length > 30) {
                    errorMessage = 'Name must be less than 30 characters';
                    isValid = false;
                }
                break;

            case 'achievement':
                if (!field.value.trim()) {
                    errorMessage = 'Achievement is required';
                    isValid = false;
                } else if (field.value.trim().length < 3) {
                    errorMessage = 'Achievement must be at least 3 characters';
                    isValid = false;
                } else if (field.value.trim().length > 50) {
                    errorMessage = 'Achievement must be less than 50 characters';
                    isValid = false;
                }
                break;

            case 'badgeDate':
                if (!field.value) {
                    errorMessage = 'Date is required';
                    isValid = false;
                } else {
                    const selectedDate = new Date(field.value);
                    const today = new Date();
                    const maxDate = new Date();
                    maxDate.setFullYear(today.getFullYear() + 1);
                    
                    if (selectedDate > maxDate) {
                        errorMessage = 'Date cannot be more than 1 year in the future';
                        isValid = false;
                    }
                }
                break;
        }

        if (!isValid) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }

        return isValid;
    }

    validateForm() {
        const fields = ['userName', 'achievement', 'badgeDate'];
        let isFormValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    generateBadge() {
        // Validate form first
        if (!this.validateForm()) {
            this.showToast('Please fix the errors before generating', 'error');
            this.shakeForm();
            return;
        }

        // Disable button during generation
        this.elements.generateBtn.disabled = true;
        this.elements.generateBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Generating...
        `;

        // Simulate generation process
        setTimeout(() => {
            this.state.isGenerated = true;
            this.elements.downloadBtn.disabled = false;
            this.elements.downloadBtn.style.opacity = '1';
            
            // Reset button
            this.elements.generateBtn.disabled = false;
            this.elements.generateBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                Generate Badge
            `;

            // Show success
            this.showToast('Badge generated successfully!', 'success');
            this.createConfetti();
            
            // Add generation animation
            this.elements.badgePreview.style.animation = 'none';
            this.elements.badgePreview.offsetHeight; // Trigger reflow
            this.elements.badgePreview.style.animation = 'float 0.6s ease-out';
            
        }, 1500);
    }

    downloadBadge() {
        if (!this.state.isGenerated) {
            this.showToast('Please generate the badge first', 'error');
            return;
        }

        // Create canvas for badge rendering
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (high resolution for print quality)
        canvas.width = 800;
        canvas.height = 600;

        // Get current badge data
        const badgeData = {
            name: this.elements.userName.value.trim(),
            achievement: this.elements.achievement.value.trim(),
            date: this.formatDate(this.elements.badgeDate.value),
            type: this.elements.badgeType.value,
            color: this.state.currentColor
        };

        // Render badge on canvas
        this.renderBadgeOnCanvas(ctx, canvas, badgeData);

        // Download the image
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `badge-${badgeData.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showToast('Badge downloaded successfully!', 'success');
        }, 'image/png', 1.0);
    }

    renderBadgeOnCanvas(ctx, canvas, data) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const badgeWidth = 640;
        const badgeHeight = 480;

        // Color mappings
        const colors = {
            emerald: { primary: '#10b981', secondary: '#059669' },
            blue: { primary: '#3b82f6', secondary: '#2563eb' },
            purple: { primary: '#8b5cf6', secondary: '#7c3aed' },
            orange: { primary: '#f97316', secondary: '#ea580c' },
            pink: { primary: '#ec4899', secondary: '#db2777' }
        };

        const color = colors[data.color] || colors.emerald;

        // Create gradient background
        const gradient = ctx.createLinearGradient(
            centerX - badgeWidth/2, centerY - badgeHeight/2,
            centerX + badgeWidth/2, centerY + badgeHeight/2
        );
        gradient.addColorStop(0, color.primary);
        gradient.addColorStop(1, color.secondary);

        // Draw badge background
        ctx.fillStyle = gradient;
        ctx.roundRect(centerX - badgeWidth/2, centerY - badgeHeight/2, badgeWidth, badgeHeight, 30);
        ctx.fill();

        // Add subtle pattern overlay
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX - 200 + i * 100, centerY - 150, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX - 150 + i * 100, centerY + 100, 30, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Draw star icon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.drawStar(ctx, centerX, centerY - 120, 30);

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Name (large)
        ctx.font = 'bold 48px Inter, Arial, sans-serif';
        ctx.fillText(data.name, centerX, centerY - 40);

        // Achievement (medium)
        ctx.font = '32px Inter, Arial, sans-serif';
        ctx.fillText(data.achievement, centerX, centerY + 10);

        // Date (small)
        ctx.font = '24px Inter, Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(data.date, centerX, centerY + 60);

        // Badge type (pill)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        const typeWidth = ctx.measureText(data.type).width + 40;
        ctx.roundRect(centerX - typeWidth/2, centerY + 90, typeWidth, 40, 20);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Inter, Arial, sans-serif';
        ctx.fillText(data.type, centerX, centerY + 110);
    }

    drawStar(ctx, x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(x, y - outerRadius);

        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
            rot += step;
        }

        ctx.lineTo(x, y - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }

    showToast(message, type = 'success') {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.className = `toast ${type === 'error' ? 'error-toast' : ''}`;
        this.elements.toast.classList.add('show');

        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 3000);
    }

    shakeForm() {
        this.elements.generateBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.elements.generateBtn.style.animation = '';
        }, 500);
    }

    createConfetti() {
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#ec4899'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
                confetti.style.animationDelay = '0s';

                this.elements.confettiContainer.appendChild(confetti);

                // Remove confetti after animation
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 20);
        }
    }
}

// Add roundRect method for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
        return this;
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BadgeGenerator();
});

// Optional: Add some utility functions for enhanced features
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Sanitize input
    sanitizeInput: (input) => {
        return input.replace(/[<>]/g, '').trim();
    },

    // Generate unique ID
    generateId: () => {
        return 'badge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};