class DateSpinner {
    constructor() {
        this.isSpinning = false;
        this.dateIdeas = [
            {
                title: "Romantic Picnic",
                description: "Pack your favorite snacks and find a beautiful spot under the stars",
                icon: "🧺"
            },
            {
                title: "Movie Marathon",
                description: "Cuddle up with your favorite romantic movies and homemade popcorn",
                icon: "🎬"
            },
            {
                title: "Cooking Together",
                description: "Prepare a delicious meal together and enjoy each other's company",
                icon: "👨‍🍳"
            },
            {
                title: "Dancing Lesson",
                description: "Learn a new dance style or just dance to your favorite songs at home",
                icon: "💃"
            },
            {
                title: "Art & Craft Night",
                description: "Create something beautiful together - paintings, crafts, or photo albums",
                icon: "🎨"
            },
            {
                title: "Stargazing Adventure",
                description: "Find a quiet spot away from city lights and explore the night sky",
                icon: "⭐"
            },
            {
                title: "Game Night",
                description: "Play board games, card games, or video games together",
                icon: "🎲"
            },
            {
                title: "Coffee Shop Hopping",
                description: "Visit different coffee shops and try new drinks while having deep conversations",
                icon: "☕"
            },
            {
                title: "Nature Walk",
                description: "Take a peaceful walk through a park or hiking trail together",
                icon: "🌲"
            },
            {
                title: "Bookstore Browse",
                description: "Explore a bookstore together and read passages to each other",
                icon: "📚"
            },
            {
                title: "Photography Walk",
                description: "Capture beautiful moments and memories around your city",
                icon: "📸"
            },
            {
                title: "Mini Golf",
                description: "Have fun with a playful round of mini golf followed by ice cream",
                icon: "⛳"
            }
        ];
        
        this.spinDuration = 3000; 
        this.setupEventListeners();
        this.initializeWheel();
    }

    setupEventListeners() {
        const spinBtn = document.getElementById('spinBtn');
        spinBtn.addEventListener('click', () => {
            this.spin();
        });
    }

    initializeWheel() {
        const wheel = document.getElementById('spinnerWheel');
        const sectionsContainer = wheel.querySelector('.spinner-sections');
        sectionsContainer.innerHTML = '';       
        const sectionAngle = 360 / this.dateIdeas.length;
        const colors = [
            '#ff9a9e', '#fecfef', '#ff416c', '#667eea', 
            '#764ba2', '#ff4b2b', '#ffd89b', '#19547b',
            '#a8edea', '#fed6e3', '#d299c2', '#fef9d7'
        ];

        this.dateIdeas.forEach((idea, index) => {
            const section = document.createElement('div');
            section.className = 'spinner-section';
            section.style.cssText = `
                position: absolute;
                width: 50%;
                height: 50%;
                top: 50%;
                left: 50%;
                transform-origin: 0 0;
                transform: rotate(${index * sectionAngle}deg);
                background: ${colors[index % colors.length]};
                clip-path: polygon(0 0, 100% 0, 100% 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: bold;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            `;
            
            const content = document.createElement('div');
            content.textContent = idea.icon;
            content.style.cssText = `
                transform: rotate(${sectionAngle/2}deg);
                font-size: 1.5rem;
                text-align: center;
                margin-left: 20px;
            `;
            
            section.appendChild(content);
            sectionsContainer.appendChild(section);
        });
    }

    async spin() {
        if (this.isSpinning) return;

        this.isSpinning = true;
        const spinBtn = document.getElementById('spinBtn');
        const wheel = document.getElementById('spinnerWheel');
        const resultDisplay = document.getElementById('spinResult');
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<div class="loading"></div> Spinning...';
        resultDisplay.classList.remove('show');
        const randomIndex = Math.floor(Math.random() * this.dateIdeas.length);
        const sectionAngle = 360 / this.dateIdeas.length;
        const baseRotation = 1440;
        const finalAngle = baseRotation + (360 - (randomIndex * sectionAngle + sectionAngle / 2));

        wheel.style.transition = `transform ${this.spinDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
        wheel.style.transform = `rotate(${finalAngle}deg)`;

        if (window.audioManager) {
            window.audioManager.playSound('spin');
        }

        await this.sleep(this.spinDuration);

        this.displayResult(this.dateIdeas[randomIndex]);

        spinBtn.disabled = false;
        spinBtn.innerHTML = '<i class="fas fa-play"></i> Spin the Wheel';
        this.isSpinning = false;

        if (window.audioManager) {
            window.audioManager.playSound('success');
        }
    }

    displayResult(dateIdea) {
        const resultDisplay = document.getElementById('spinResult');
        const resultCard = resultDisplay.querySelector('.result-card');
        const resultTitle = resultCard.querySelector('.result-title');
        const resultDescription = resultCard.querySelector('.result-description');
        const resultIcon = resultCard.querySelector('.result-icon i');

        resultTitle.textContent = dateIdea.title;
        resultDescription.textContent = dateIdea.description;
        resultIcon.className = 'fas fa-heart';

        resultTitle.innerHTML = `${dateIdea.icon} ${dateIdea.title}`;

        setTimeout(() => {
            resultDisplay.classList.add('show');
            
            this.createCelebrationEffect();
        }, 300);

        this.saveToFavorites(dateIdea);
    }

    createCelebrationEffect() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = ['💖', '💕', '💗', '💓'][Math.floor(Math.random() * 4)];
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${window.innerHeight}px;
                    font-size: ${Math.random() * 10 + 20}px;
                    z-index: 1000;
                    pointer-events: none;
                    animation: float 3s ease-out forwards;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 3000);
            }, i * 100);
        }
    }

    saveToFavorites(dateIdea) {
        const favorites = JSON.parse(localStorage.getItem('date-favorites') || '[]');
        const existing = favorites.find(fav => fav.title === dateIdea.title);
        
        if (!existing) {
            favorites.unshift({
                ...dateIdea,
                dateAdded: new Date().toISOString(),
                timesSelected: 1
            });
        } else {
            existing.timesSelected = (existing.timesSelected || 1) + 1;
            existing.lastSelected = new Date().toISOString();
        }

        if (favorites.length > 20) {
            favorites.splice(20);
        }

        localStorage.setItem('date-favorites', JSON.stringify(favorites));
    }

    getFavorites() {
        return JSON.parse(localStorage.getItem('date-favorites') || '[]');
    }

    addCustomDateIdea(idea) {
        if (idea.title && idea.description) {
            this.dateIdeas.push({
                ...idea,
                icon: idea.icon || '❤️',
                isCustom: true
            });
            this.initializeWheel();
        }
    }

    removeCustomDateIdea(index) {
        if (this.dateIdeas[index] && this.dateIdeas[index].isCustom) {
            this.dateIdeas.splice(index, 1);
            this.initializeWheel();
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    init() {
        const wheel = document.getElementById('spinnerWheel');
        wheel.style.transition = 'none';
        wheel.style.transform = 'rotate(0deg)';
        
        document.getElementById('spinResult').classList.remove('show');
        
        const spinBtn = document.getElementById('spinBtn');
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<i class="fas fa-play"></i> Spin the Wheel';
        
        setTimeout(() => {
            wheel.style.transition = '';
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dateSpinner = new DateSpinner();
});