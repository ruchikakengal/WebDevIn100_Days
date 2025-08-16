class FortuneTeller {
    constructor() {
        this.currentCategory = 'general';
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.isPlaying = false;
        this.dailyFortuneGenerated = false;
        this.fortunes = {
            general: {
                positive: [
                    "Great success awaits you in your near future! ✨",
                    "The stars align in your favor - embrace new opportunities! 🌟",
                    "A wonderful surprise is coming your way soon! 🎁",
                    "Your inner strength will guide you to victory! 💪",
                    "The universe is conspiring to help you succeed! 🌌",
                    "Luck flows toward you like a golden river! 🌊✨",
                    "Your positive energy will attract amazing things! ⚡",
                    "A door to happiness is about to open for you! 🚪💛"
                ],
                negative: [
                    "Challenges lie ahead, but they will make you stronger! ⚔️",
                    "Beware of false promises in the coming days... 🌙",
                    "A period of uncertainty approaches - stay grounded! 🌪️",
                    "Hidden obstacles may test your resolve soon! 🗿",
                    "The path ahead is foggy - proceed with caution! 🌫️",
                    "Difficult choices await, but wisdom will guide you! 🤔",
                    "A storm is brewing, but you have the strength to weather it! ⛈️",
                    "Trust must be earned carefully in the near future! 🔒"
                ],
                neutral: [
                    "The future remains unwritten - your choices matter most! 📜",
                    "Balance is key - neither rush nor hesitate! ⚖️",
                    "The answer you seek lies within your own heart! ❤️",
                    "Time will reveal what is meant to be! ⏰",
                    "The spirits whisper of change on the horizon... 🌀",
                    "Your journey is uniquely yours - trust the process! 🛤️",
                    "The crystal ball shows swirling mists of possibility! 🔮",
                    "What you need will come when you're ready to receive it! 🕰️"
                ]
            },
            love: {
                positive: [
                    "True love is blooming in your life like a beautiful flower! 🌹",
                    "A romantic connection will surprise you this month! 💕",
                    "Your heart will find its perfect match soon! 💖",
                    "Passionate love awaits those who open their hearts! 🔥❤️",
                    "A soulmate connection is written in your stars! ⭐💑",
                    "Love will find you when you least expect it! 💘",
                    "Your relationship will reach new depths of intimacy! 🌊💞",
                    "Wedding bells may ring in your future! 💒🔔"
                ],
                negative: [
                    "Guard your heart against fleeting attractions! 💔🛡️",
                    "Someone may not be as genuine as they appear... 😔",
                    "Heartbreak teaches lessons that lead to true love! 💔➡️💕",
                    "Jealousy may cloud a relationship - communicate openly! 👁️‍🗨️",
                    "Distance or separation may test your bonds! 🌍💔",
                    "Past relationships may resurface to create confusion! 👻💭",
                    "Trust issues need healing before love can flourish! 🩹❤️",
                    "Someone close may disappoint you in matters of the heart! 😞"
                ],
                neutral: [
                    "Love takes many forms - be open to all possibilities! 💝",
                    "Self-love is the foundation of all other love! 🪞❤️",
                    "The heart wants what it wants - listen carefully! 👂💓",
                    "Timing in love is everything - patience is key! ⏳💕",
                    "Your love story is still being written! 📖✍️",
                    "Focus on being the love you wish to receive! 🌟💖",
                    "The universe is preparing your heart for something special! 🌌💘",
                    "Love will find its way, as it always does! 🧭❤️"
                ]
            },
            career: {
                positive: [
                    "A promotion or recognition is heading your way! 🏆",
                    "Your talents will be noticed by important people! 👀✨",
                    "A dream job opportunity will present itself soon! 💼🌟",
                    "Success in your field is written in the stars! ⭐📈",
                    "Your hard work will pay off handsomely! 💪💰",
                    "A mentor will appear to guide your career path! 🧙‍♂️📚",
                    "Financial abundance flows from your professional efforts! 💸✨",
                    "Your creative ideas will be the key to your success! 💡🗝️"
                ],
                negative: [
                    "Workplace politics may challenge your progress... 🏢⚡",
                    "A career setback will redirect you toward your true calling! 🔄",
                    "Competition at work may intensify - stay focused! 🎯👥",
                    "Financial constraints may limit your options temporarily! 💰⛔",
                    "A difficult boss or colleague may test your patience! 😤",
                    "Job security may feel uncertain in the coming months! 🌪️💼",
                    "Your current path may not lead where you hope... 🛤️❓",
                    "Professional relationships need careful navigation! 🧭🤝"
                ],
                neutral: [
                    "Career changes bring both challenges and opportunities! 🔄⚖️",
                    "Your professional journey is evolving - embrace the process! 🦋",
                    "Skills you develop now will serve you in unexpected ways! 🛠️🔮",
                    "The right career move will become clear with time! ⏰💡",
                    "Your professional worth is greater than you realize! 💎",
                    "Network building will be crucial to your future success! 🕸️🤝",
                    "Balance between ambition and contentment is key! ⚖️😌",
                    "Your career path may take unexpected but rewarding turns! 🛤️🌟"
                ]
            },
            money: {
                positive: [
                    "Financial abundance is flowing toward you like a river! 💰🌊",
                    "An unexpected windfall will brighten your financial picture! 💸☀️",
                    "Your investments will yield profitable returns! 📈💎",
                    "Money worries will soon become a thing of the past! 🚫😰➡️😊",
                    "A lucrative opportunity will knock on your door! 🚪💰",
                    "Your financial intuition will guide you to prosperity! 🧠💸",
                    "Wealth will come through your natural talents! 🎨💰",
                    "Financial security and independence are in your future! 🏦🗝️"
                ],
                negative: [
                    "Unnecessary expenses may drain your resources... 💸🕳️",
                    "Be wary of get-rich-quick schemes that seem too good to be true! ⚠️💰",
                    "Financial discipline is needed to avoid future problems! 📊✋",
                    "Someone may try to take advantage of your generosity! 🤲⚠️",
                    "Market fluctuations may affect your savings! 📉💔",
                    "Debt may accumulate if spending isn't controlled! 💳⛔",
                    "Financial partnerships require extra scrutiny! 🤝🔍",
                    "Unexpected expenses may strain your budget! 💸😰"
                ],
                neutral: [
                    "Money is energy - spend and save with intention! ⚡💰",
                    "Financial wisdom comes from both earning and learning! 🧠💸",
                    "Your relationship with money is evolving! 💰🔄",
                    "True wealth includes more than just monetary gains! 💎❤️🧠",
                    "Financial planning now will benefit your future self! 📅💰",
                    "Money flows where value is created! 💸➡️💎",
                    "Your financial story is still being written! 📖✍️💰",
                    "Balance between saving and enjoying life is important! ⚖️😊💸"
                ]
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.generateDailyFortune();
        this.updateCharCounter();
        this.createMysticalSounds();
    }

    bindEvents() {
        // Fortune button click
        document.getElementById('revealFortune').addEventListener('click', () => {
            this.revealFortune();
        });

        // Category button clicks
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.target.dataset.category);
            });
        });

        // Audio toggle
        document.getElementById('audioToggle').addEventListener('click', () => {
            this.toggleBackgroundMusic();
        });

        // Crystal ball click
        document.getElementById('crystalBall').addEventListener('click', () => {
            this.crystalBallClick();
        });

        // Character counter for question input
        document.getElementById('question').addEventListener('input', () => {
            this.updateCharCounter();
        });

        // Enter key in textarea
        document.getElementById('question').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.revealFortune();
            }
        });
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Update button states
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Hide previous fortune when switching categories
        document.getElementById('fortuneContainer').classList.remove('visible');
    }

    updateCharCounter() {
        const question = document.getElementById('question').value;
        const charCount = document.getElementById('charCount');
        charCount.textContent = question.length;
        
        // Change color when approaching limit
        if (question.length > 180) {
            charCount.style.color = '#EF4444';
        } else if (question.length > 150) {
            charCount.style.color = '#F97316';
        } else {
            charCount.style.color = 'rgba(229, 231, 235, 0.6)';
        }
    }

    generateDailyFortune() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('dailyFortuneDate');
        const savedFortune = localStorage.getItem('dailyFortune');

        if (savedDate === today && savedFortune) {
            document.getElementById('dailyFortune').textContent = savedFortune;
        } else {
            // Generate new daily fortune
            const allFortunes = [
                ...this.fortunes.general.positive,
                ...this.fortunes.general.neutral
            ];
            const dailyFortune = allFortunes[this.generateDeterministicRandom(today) % allFortunes.length];
            
            document.getElementById('dailyFortune').textContent = dailyFortune;
            localStorage.setItem('dailyFortuneDate', today);
            localStorage.setItem('dailyFortune', dailyFortune);
        }
    }

    generateDeterministicRandom(seed) {
        // Simple hash function for consistent daily fortunes
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    crystalBallClick() {
        const crystalBall = document.getElementById('crystalBall');
        crystalBall.classList.add('active');
        
        setTimeout(() => {
            crystalBall.classList.remove('active');
        }, 1000);

        this.playMysticalSound();
    }

    async revealFortune() {
        const question = document.getElementById('question').value.trim();
        const fortuneBtn = document.getElementById('revealFortune');
        const fortuneContainer = document.getElementById('fortuneContainer');
        const loadingContainer = document.getElementById('loadingContainer');
        const crystalBall = document.getElementById('crystalBall');

        // Validate input
        if (!question) {
            this.showError("The spirits require a question to guide you...");
            return;
        }

        if (question.length < 3) {
            this.showError("Your question is too brief for the mystical forces...");
            return;
        }

        // Disable button and show loading
        fortuneBtn.disabled = true;
        fortuneContainer.classList.remove('visible');
        loadingContainer.classList.add('visible');
        crystalBall.classList.add('active');

        // Play mystical sound
        this.playMysticalSound();

        // Simulate consultation delay
        await this.delay(3000);

        // Generate fortune
        const fortune = this.generateFortune(question);
        
        // Hide loading and show fortune
        loadingContainer.classList.remove('visible');
        this.displayFortune(fortune);
        crystalBall.classList.remove('active');
        
        // Re-enable button
        fortuneBtn.disabled = false;
    }

    generateFortune(question) {
        const categoryFortunes = this.fortunes[this.currentCategory];
        
        // Simple hash to make fortune selection deterministic based on question
        const questionHash = this.hashString(question.toLowerCase());
        
        // Determine fortune type based on hash
        const typeRandom = questionHash % 100;
        let type, fortuneArray;
        
        if (typeRandom < 40) {
            type = 'positive';
            fortuneArray = categoryFortunes.positive;
        } else if (typeRandom < 70) {
            type = 'neutral';
            fortuneArray = categoryFortunes.neutral;
        } else {
            type = 'negative';
            fortuneArray = categoryFortunes.negative;
        }

        // Select specific fortune
        const fortuneIndex = Math.abs(questionHash) % fortuneArray.length;
        const fortuneText = fortuneArray[fortuneIndex];

        return { text: fortuneText, type: type };
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    displayFortune(fortune) {
        const fortuneContainer = document.getElementById('fortuneContainer');
        const fortuneText = document.getElementById('fortuneText');
        const fortuneType = document.getElementById('fortuneType');

        // Set content
        fortuneText.textContent = fortune.text;
        fortuneType.textContent = `${fortune.type.toUpperCase()} FORTUNE`;
        fortuneType.className = `fortune-type ${fortune.type}`;

        // Show with animation
        fortuneContainer.classList.add('visible');

        // Scroll to fortune
        setTimeout(() => {
            fortuneContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1rem;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
            backdrop-filter: blur(10px);
        `;
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);

        // Shake the question input
        const questionInput = document.getElementById('question');
        questionInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            questionInput.style.animation = '';
        }, 500);
    }

    toggleBackgroundMusic() {
        const audioToggle = document.getElementById('audioToggle');
        const audioStatus = document.getElementById('audioStatus');

        if (this.isPlaying) {
            this.backgroundMusic.pause();
            this.isPlaying = false;
            audioStatus.textContent = 'Play Music';
            audioToggle.innerHTML = '<i class="fas fa-music"></i><span id="audioStatus">Play Music</span>';
        } else {
            // Create a more mystical background music using Web Audio API
            this.createAndPlayBackgroundMusic();
            this.isPlaying = true;
            audioStatus.textContent = 'Pause Music';
            audioToggle.innerHTML = '<i class="fas fa-pause"></i><span id="audioStatus">Pause Music</span>';
        }
    }

    createAndPlayBackgroundMusic() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        }

        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.playAmbientMusic();
    }

    playAmbientMusic() {
        const now = this.audioContext.currentTime;
        
        // Create mystical drone
        const drone = this.audioContext.createOscillator();
        const droneGain = this.audioContext.createGain();
        
        drone.type = 'sine';
        drone.frequency.setValueAtTime(55, now); // Low A
        droneGain.gain.setValueAtTime(0.05, now);
        
        drone.connect(droneGain);
        droneGain.connect(this.masterGain);
        
        drone.start(now);
        
        // Add mystical bells
        this.addMysticalBells(now);
        
        // Schedule next iteration
        setTimeout(() => {
            if (this.isPlaying) {
                this.playAmbientMusic();
            }
        }, 8000);
    }

    addMysticalBells(startTime) {
        const bellTimes = [2, 4.5, 6.8];
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        bellTimes.forEach((time, index) => {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.playBell(frequencies[index % frequencies.length]);
                }
            }, time * 1000);
        });
    }

    playBell(frequency) {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 2);
    }

    createMysticalSounds() {
        // Pre-create audio context for sounds
        this.setupAudioContext();
    }

    setupAudioContext() {
        // Audio context will be created on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }

    playMysticalSound() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);
        osc.frequency.exponentialRampToValueAtTime(110, now + 1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 1);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add CSS animation for shake effect
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the Fortune Teller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FortuneTeller();
});

// Add mystical cursor trail effect
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        animation: fadeOut 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    }, 1000);
});

// Add fade out animation for cursor trail
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes fadeOut {
        0% { 
            opacity: 1; 
            transform: scale(1);
        }
        100% { 
            opacity: 0; 
            transform: scale(0.5);
        }
    }
`;
document.head.appendChild(trailStyle);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'R' to reveal fortune
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        const questionInput = document.getElementById('question');
        if (document.activeElement !== questionInput) {
            e.preventDefault();
            document.getElementById('revealFortune').click();
        }
    }
    
    // Press 'M' to toggle music
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey) {
        const questionInput = document.getElementById('question');
        if (document.activeElement !== questionInput) {
            e.preventDefault();
            document.getElementById('audioToggle').click();
        }
    }
    
    // Press 'C' to click crystal ball
    if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        const questionInput = document.getElementById('question');
        if (document.activeElement !== questionInput) {
            e.preventDefault();
            document.getElementById('crystalBall').click();
        }
    }
});

// Add mystical loading text variations
const loadingTexts = [
    "The spirits are consulting...",
    "Gazing into the ethereal realm...",
    "The crystal ball is swirling with visions...",
    "Ancient wisdom is being channeled...",
    "The mystical forces are aligning...",
    "Cosmic energies are converging...",
    "The oracle is interpreting signs..."
];

// Update loading text periodically
let loadingTextIndex = 0;
setInterval(() => {
    const loadingContainer = document.querySelector('.loading-text');
    if (loadingContainer && document.getElementById('loadingContainer').classList.contains('visible')) {
        loadingTextIndex = (loadingTextIndex + 1) % loadingTexts.length;
        loadingContainer.textContent = loadingTexts[loadingTextIndex];
    }
}, 1500);
