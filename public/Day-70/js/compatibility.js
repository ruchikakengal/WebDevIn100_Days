class CompatibilityCalculator {
    constructor() {
        this.isCalculating = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        const name1Input = document.getElementById('name1');
        const name2Input = document.getElementById('name2');

        calculateBtn.addEventListener('click', () => {
            this.calculateCompatibility();
        });

        [name1Input, name2Input].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateCompatibility();
                }
            });

            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const value = input.value.trim();
        
        if (value.length > 0 && !/^[a-zA-Z\s]+$/.test(value)) {
            input.style.borderColor = '#f44336';
            input.style.animation = 'shake 0.5s ease-in-out';
            return false;
        } else {
            input.style.borderColor = '';
            input.style.animation = '';
            return true;
        }
    }

    async calculateCompatibility() {
        if (this.isCalculating) return;

        const name1 = document.getElementById('name1').value.trim();
        const name2 = document.getElementById('name2').value.trim();
        const calculateBtn = document.getElementById('calculateBtn');
        const resultContainer = document.getElementById('compatibilityResult');

        if (!name1 || !name2) {
            this.showError('Please enter both names');
            return;
        }

        if (name1.length < 2 || name2.length < 2) {
            this.showError('Names must be at least 2 characters long');
            return;
        }

        if (!this.validateInput(document.getElementById('name1')) || 
            !this.validateInput(document.getElementById('name2'))) {
            this.showError('Please enter valid names (letters only)');
            return;
        }

        this.isCalculating = true;
        calculateBtn.disabled = true;
        calculateBtn.innerHTML = '<div class="loading"></div> Calculating...';
        resultContainer.classList.remove('show');
        await this.sleep(1500);

        const compatibility = this.computeCompatibility(name1, name2);
        this.displayResult(name1, name2, compatibility);

        calculateBtn.disabled = false;
        calculateBtn.innerHTML = '<i class="fas fa-magic"></i> Calculate Compatibility';
        this.isCalculating = false;
        if (window.audioManager) {
            window.audioManager.playSound('success');
        }
    }

    computeCompatibility(name1, name2) {
        const combined = (name1 + name2).toLowerCase().replace(/\s/g, '');
        let hash = 0;
        
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        const percentage = Math.abs(hash) % 50 + 50;
        
        return {
            percentage: percentage,
            level: this.getCompatibilityLevel(percentage),
            description: this.getCompatibilityDescription(percentage),
            advice: this.getCompatibilityAdvice(percentage)
        };
    }

    getCompatibilityLevel(percentage) {
        if (percentage >= 90) return "Soulmates";
        if (percentage >= 80) return "Perfect Match";
        if (percentage >= 70) return "Great Chemistry";
        if (percentage >= 60) return "Good Connection";
        return "Potential Match";
    }

    getCompatibilityDescription(percentage) {
        const descriptions = {
            90: [
                "You two are destined to be together! Your souls are perfectly aligned.",
                "This is a once-in-a-lifetime connection. Pure magic!",
                "The stars have aligned for your perfect love story."
            ],
            80: [
                "Amazing compatibility! You complement each other beautifully.",
                "Your hearts beat in perfect harmony. A truly special bond!",
                "You're like two puzzle pieces that fit perfectly together."
            ],
            70: [
                "Great potential for a wonderful relationship filled with love and laughter.",
                "Your connection is strong and has room to grow even deeper.",
                "You share a beautiful chemistry that lights up every room."
            ],
            60: [
                "A solid foundation for love with exciting possibilities ahead.",
                "Your differences make you stronger together. Embrace the journey!",
                "There's genuine potential here worth exploring and nurturing."
            ],
            50: [
                "An intriguing match with unique dynamics worth discovering.",
                "Sometimes opposites attract in the most beautiful ways.",
                "Your story is still being written. Give love a chance to bloom!"
            ]
        };

        const tier = Math.floor(percentage / 10) * 10;
        const options = descriptions[Math.max(tier, 50)];
        return options[Math.floor(Math.random() * options.length)];
    }

    getCompatibilityAdvice(percentage) {
        const advice = {
            90: [
                "Trust your instincts - this connection is rare and precious.",
                "Communication will be your superpower. Keep talking and sharing!",
                "Plan adventures together and create lasting memories."
            ],
            80: [
                "Focus on building trust and understanding each other's dreams.",
                "Your shared values will be the foundation of your happiness.",
                "Support each other's growth and celebrate your differences."
            ],
            70: [
                "Take time to really get to know each other's passions and goals.",
                "Find activities you both enjoy and create new traditions together.",
                "Be patient and let your connection deepen naturally."
            ],
            60: [
                "Communication is key - share your thoughts and feelings openly.",
                "Focus on what you admire about each other.",
                "Give your relationship time and space to flourish."
            ],
            50: [
                "Keep an open mind and heart as you get to know each other.",
                "Focus on building friendship first - it's the best foundation.",
                "Sometimes the best relationships start as beautiful surprises!"
            ]
        };

        const tier = Math.floor(percentage / 10) * 10;
        const options = advice[Math.max(tier, 50)];
        return options[Math.floor(Math.random() * options.length)];
    }

    displayResult(name1, name2, compatibility) {
        const resultContainer = document.getElementById('compatibilityResult');
        const percentageText = resultContainer.querySelector('.percentage-text');
        const resultTitle = resultContainer.querySelector('.result-title');
        const resultDescription = resultContainer.querySelector('.result-description');
        this.animatePercentage(percentageText, compatibility.percentage);
        resultTitle.textContent = `${name1} ❤️ ${name2}: ${compatibility.level}`;
        resultDescription.innerHTML = `
            <p style="margin-bottom: 15px;"><strong>${compatibility.description}</strong></p>
            <p style="font-style: italic; opacity: 0.9;">${compatibility.advice}</p>
        `;

        setTimeout(() => {
            resultContainer.classList.add('show');
            
            if (compatibility.percentage >= 80) {
                this.createConfetti();
            }
        }, 500);

        this.saveToHistory(name1, name2, compatibility);
    }

    animatePercentage(element, targetPercentage) {
        let current = 0;
        const increment = targetPercentage / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetPercentage) {
                current = targetPercentage;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + '%';
        }, 50);
    }

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.backgroundColor = ['#ff9a9e', '#fecfef', '#ff416c'][Math.floor(Math.random() * 3)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }

    saveToHistory(name1, name2, compatibility) {
        const history = JSON.parse(localStorage.getItem('compatibility-history') || '[]');
        const entry = {
            date: new Date().toISOString(),
            name1,
            name2,
            percentage: compatibility.percentage,
            level: compatibility.level
        };

        history.unshift(entry);
        if (history.length > 10) {
            history.splice(10);
        }

        localStorage.setItem('compatibility-history', JSON.stringify(history));
    }

    showError(message) {
        if (window.loveVerse) {
            window.loveVerse.showNotification(message, 'error');
        }
        
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            calculateBtn.style.animation = '';
        }, 500);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    init() {
        document.getElementById('name1').value = '';
        document.getElementById('name2').value = '';
        document.getElementById('compatibilityResult').classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.compatibilityCalculator = new CompatibilityCalculator();
});