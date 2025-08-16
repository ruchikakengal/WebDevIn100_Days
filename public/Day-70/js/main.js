class LoveVerse {
    constructor() {
        this.currentSection = 'home';
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeParticles();
        this.loadUserPreferences();
        this.startHeartAnimations();
    }

    setupEventListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const gameCards = document.querySelectorAll('.game-card');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const game = card.getAttribute('data-game');
                this.navigateToSection(game);
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    navigateToSection(sectionId) {
        if (this.isAnimating || sectionId === this.currentSection) return;

        this.isAnimating = true;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        const currentSection = document.querySelector('.section.active');
        currentSection.style.opacity = '0';
        currentSection.style.transform = 'translateX(-50px)';

        setTimeout(() => {
            currentSection.classList.remove('active');
            
            const newSection = document.getElementById(sectionId);
            newSection.classList.add('active');
            newSection.style.opacity = '0';
            newSection.style.transform = 'translateX(50px)';

            setTimeout(() => {
                newSection.style.opacity = '1';
                newSection.style.transform = 'translateX(0)';
                this.currentSection = sectionId;
                this.isAnimating = false;
                
                this.initializeSection(sectionId);
            }, 50);
        }, 300);

        document.getElementById('navMenu').classList.remove('active');
    }

    initializeSection(sectionId) {
        switch (sectionId) {
            case 'compatibility':
                if (window.CompatibilityCalculator) {
                    window.compatibilityCalculator.init();
                }
                break;
            case 'date-spinner':
                if (window.DateSpinner) {
                    window.dateSpinner.init();
                }
                break;
            case 'confession':
                if (window.ConfessionSimulator) {
                    window.confessionSimulator.init();
                }
                break;
            case 'card-maker':
                if (window.CardMaker) {
                    window.cardMaker.init();
                }
                break;
            case 'memory-game':
                if (window.MemoryGame) {
                    window.memoryGame.init();
                }
                break;
        }
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = window.innerWidth < 768 ? 15 : 30;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle(particlesContainer);
            }, i * 200);
        }

        setInterval(() => {
            if (document.querySelectorAll('.particle').length < particleCount) {
                this.createParticle(particlesContainer);
            }
        }, 3000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        const isHeart = Math.random() > 0.7;
        
        if (isHeart) {
            particle.innerHTML = '❤️';
            particle.className = 'particle heart';
        } else {
            particle.className = 'particle sparkle';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `hsl(${Math.random() * 60 + 320}, 70%, 70%)`;
        }

        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    }

    startHeartAnimations() {
        setInterval(() => {
            if (Math.random() > 0.8) {
                this.createFloatingHeart();
            }
        }, 2000);
    }

    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = window.innerHeight + 'px';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.zIndex = '-1';
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'float 4s ease-out forwards';

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 4000);
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('loveverse-preferences') || '{}');
        
        if (preferences.musicEnabled !== undefined) {
            window.audioManager.toggleMusic(preferences.musicEnabled);
        }
        
        if (preferences.soundEnabled !== undefined) {
            window.audioManager.toggleSound(preferences.soundEnabled);
        }
    }

    saveUserPreferences() {
        const preferences = {
            musicEnabled: window.audioManager.musicEnabled,
            soundEnabled: window.audioManager.soundEnabled
        };
        localStorage.setItem('loveverse-preferences', JSON.stringify(preferences));
    }

    handleResize() {
        if (window.innerWidth < 768) {
            const particles = document.querySelectorAll('.particle');
            if (particles.length > 15) {
                for (let i = 15; i < particles.length; i++) {
                    particles[i].remove();
                }
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            document.body.style.animationPlayState = 'paused';
        } else {
            document.body.style.animationPlayState = 'running';
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    playClickSound() {
        if (window.audioManager) {
            window.audioManager.playSound('click');
        }
    }

    addGlowEffect(element) {
        element.style.animation = 'glow 0.6s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.loveVerse = new LoveVerse();
    
    document.querySelectorAll('button, .nav-link, .game-card').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
        
        element.addEventListener('click', () => {
            window.loveVerse.playClickSound();
            window.loveVerse.addGlowEffect(element);
        });
    });
});

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);