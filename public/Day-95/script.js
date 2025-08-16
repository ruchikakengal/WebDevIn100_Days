class SuperheroApp {
    constructor() {
        this.generator = new SuperheroGenerator();
        this.audioEffects = new AudioEffects();
        this.cardGenerator = new CardGenerator();
        this.favorites = this.loadFavorites();
        
        this.initializeElements();
        this.attachEventListeners();
        this.displayFavorites();
    }

    initializeElements() {
        this.nameInput = document.getElementById('nameInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultSection = document.getElementById('resultSection');
        this.superheroCard = document.getElementById('superheroCard');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.regenerateBtn = document.getElementById('regenerateBtn');
        this.favoritesSection = document.getElementById('favoritesSection');
        this.favoritesList = document.getElementById('favoritesList');
    }

    attachEventListeners() {
        // Input validation and generation
        this.generateBtn.addEventListener('click', () => this.handleGenerate());
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGenerate();
            }
        });
        this.nameInput.addEventListener('input', () => this.clearError());

        // Card actions
        this.downloadBtn.addEventListener('click', () => this.handleDownload());
        this.saveBtn.addEventListener('click', () => this.handleSave());
        this.regenerateBtn.addEventListener('click', () => this.handleRegenerate());

        // Input focus effects
        this.nameInput.addEventListener('focus', () => {
            this.nameInput.parentElement.classList.add('focused');
        });
        this.nameInput.addEventListener('blur', () => {
            this.nameInput.parentElement.classList.remove('focused');
        });
    }

    async handleGenerate() {
        const name = this.nameInput.value.trim();
        
        if (!this.validateInput(name)) {
            this.audioEffects.playError();
            return;
        }

        this.showLoading();
        this.audioEffects.playGenerate();

        try {
            // Simulate processing time for better UX
            await this.delay(1500);
            
            const superhero = this.generator.generateSuperhero(name);
            this.displaySuperhero(superhero);
            this.showResult();
            
            this.audioEffects.playSuccess();
        } catch (error) {
            this.showError('Failed to generate superhero. Please try again.');
            this.audioEffects.playError();
            console.error('Generation error:', error);
        } finally {
            this.hideLoading();
        }
    }

    validateInput(name) {
        if (!name) {
            this.showError('Please enter your name to discover your superhero identity!');
            return false;
        }
        
        if (name.length < 2) {
            this.showError('Your name must be at least 2 characters long.');
            return false;
        }
        
        if (name.length > 50) {
            this.showError('Your name is too long. Please use a shorter version.');
            return false;
        }
        
        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            this.showError('Please use only letters, spaces, hyphens, and apostrophes in your name.');
            return false;
        }
        
        return true;
    }

    displaySuperhero(superhero) {
        // Update superhero name
        document.getElementById('superheroName').textContent = superhero.name;
        
        // Update power level
        const powerLevel = document.getElementById('powerLevel');
        powerLevel.innerHTML = '';
        for (let i = 0; i < superhero.powerLevel; i++) {
            const star = document.createElement('span');
            star.className = 'power-star';
            star.innerHTML = '⭐';
            powerLevel.appendChild(star);
        }
        
        // Update powers
        const powersList = document.getElementById('powersList');
        powersList.innerHTML = '';
        superhero.powers.forEach(power => {
            const powerTag = document.createElement('span');
            powerTag.className = 'power-tag';
            powerTag.textContent = power;
            powersList.appendChild(powerTag);
        });
        
        // Update costume colors
        const colorPalette = document.getElementById('colorPalette');
        colorPalette.innerHTML = '';
        superhero.costume.colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;
            colorPalette.appendChild(swatch);
        });
        
        // Update costume description
        document.getElementById('costumeDescription').textContent = superhero.costume.description;
        
        // Update origin story
        document.getElementById('originStory').textContent = superhero.origin;
        
        // Store current superhero for actions
        this.currentSuperhero = superhero;
    }

    async handleDownload() {
        if (!this.currentSuperhero) return;
        
        this.audioEffects.playClick();
        
        try {
            await this.cardGenerator.generateCard(this.currentSuperhero);
            this.showMessage('Superhero card downloaded successfully!', 'success');
        } catch (error) {
            this.showMessage('Failed to download card. Please try again.', 'error');
            console.error('Download error:', error);
        }
    }

    handleSave() {
        if (!this.currentSuperhero) return;
        
        this.audioEffects.playClick();
        
        const favorite = {
            id: Date.now(),
            name: this.currentSuperhero.name,
            originalName: this.nameInput.value.trim(),
            powers: this.currentSuperhero.powers,
            costume: this.currentSuperhero.costume,
            origin: this.currentSuperhero.origin,
            powerLevel: this.currentSuperhero.powerLevel,
            dateCreated: new Date().toISOString()
        };
        
        // Check if already saved
        const exists = this.favorites.some(fav => 
            fav.originalName.toLowerCase() === favorite.originalName.toLowerCase()
        );
        
        if (exists) {
            this.showMessage('This superhero is already in your favorites!', 'info');
            return;
        }
        
        this.favorites.unshift(favorite);
        this.saveFavorites();
        this.displayFavorites();
        
        this.showMessage('Superhero saved to favorites!', 'success');
    }

    handleRegenerate() {
        const name = this.nameInput.value.trim();
        if (name) {
            this.handleGenerate();
        }
    }

    showLoading() {
        this.loadingSection.classList.add('active');
        this.resultSection.classList.remove('active');
        this.generateBtn.disabled = true;
    }

    hideLoading() {
        this.loadingSection.classList.remove('active');
        this.generateBtn.disabled = false;
    }

    showResult() {
        this.resultSection.classList.add('active');
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.opacity = '1';
        setTimeout(() => {
            this.errorMessage.style.opacity = '0';
        }, 5000);
    }

    clearError() {
        this.errorMessage.style.opacity = '0';
    }

    showMessage(message, type = 'info') {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `temp-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: linear-gradient(45deg, #4ecdc4, #44a08d);' : ''}
            ${type === 'error' ? 'background: linear-gradient(45deg, #ff6b6b, #ee5a52);' : ''}
            ${type === 'info' ? 'background: linear-gradient(45deg, #96ceb4, #85c7b3);' : ''}
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    displayFavorites() {
        if (this.favorites.length === 0) {
            this.favoritesSection.classList.remove('active');
            return;
        }
        
        this.favoritesSection.classList.add('active');
        this.favoritesList.innerHTML = '';
        
        this.favorites.forEach(favorite => {
            const favoriteEl = document.createElement('div');
            favoriteEl.className = 'favorite-item';
            favoriteEl.innerHTML = `
                <div class="favorite-name">${favorite.name}</div>
                <div class="favorite-powers">Powers: ${favorite.powers.join(', ')}</div>
                <div class="favorite-date">Created: ${new Date(favorite.dateCreated).toLocaleDateString()}</div>
            `;
            
            favoriteEl.addEventListener('click', () => {
                this.loadFavorite(favorite);
            });
            
            this.favoritesList.appendChild(favoriteEl);
        });
    }

    loadFavorite(favorite) {
        this.nameInput.value = favorite.originalName;
        this.currentSuperhero = favorite;
        this.displaySuperhero(favorite);
        this.showResult();
        this.audioEffects.playClick();
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem('superhero-favorites');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            // Keep only the most recent 10 favorites
            const toSave = this.favorites.slice(0, 10);
            localStorage.setItem('superhero-favorites', JSON.stringify(toSave));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SuperheroApp();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    if (e.code === 'KeyS' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        const nameInput = document.getElementById('nameInput');
        const names = ['Batman', 'Superman', 'Wonder Woman', 'Spider-Man', 'Iron Man'];
        nameInput.value = names[Math.floor(Math.random() * names.length)];
        nameInput.focus();
    }
});
