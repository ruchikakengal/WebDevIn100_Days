/**
 * Main Application Controller
 * Manages the overall application state and coordinates between modules
 */

class StoryApp {
    constructor() {
        this.currentScreen = 'story-setup';
        this.modules = {};
        this.state = {
            currentStory: null,
            storyHistory: [],
            currentTheme: 'fantasy',
            isNarrationEnabled: false,
            settings: {
                narrationSpeed: 1.0,
                autoNarration: false,
                selectedVoice: null
            }
        };
        
        this.init();
    }

    async init() {
        try {
            this.showLoadingScreen();
            
            // Initialize core modules
            this.modules.storyGenerator = new StoryGenerator();
            this.modules.choiceHandler = new ChoiceHandler(this);
            this.modules.narration = new NarrationManager();
            this.modules.export = new ExportManager();
            this.modules.themes = new ThemeManager(this);
            this.modules.storage = new StorageManager();

            // Initialize modules
            await this.initializeModules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load saved settings and stories
            this.loadUserData();
            
            // Apply default theme
            this.modules.themes.applyTheme(this.state.currentTheme);
            
            this.hideLoadingScreen();
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.hideLoadingScreen();
            this.showNotification('Failed to initialize application. Please refresh the page.', 'error');
        }
    }

    async initializeModules() {
        const initPromises = Object.values(this.modules).map(module => {
            if (typeof module.init === 'function') {
                return module.init();
            }
            return Promise.resolve();
        });
        
        await Promise.all(initPromises);
    }

    setupEventListeners() {
        // Navigation controls
        this.bindEvent('theme-selector', 'click', () => this.showThemeModal());
        this.bindEvent('narration-toggle', 'click', () => this.toggleNarration());
        this.bindEvent('settings-btn', 'click', () => this.showSettingsModal());

        // Story form
        this.bindEvent('story-form', 'submit', (e) => this.handleStorySubmit(e));

        // Story controls
        this.bindEvent('back-btn', 'click', () => this.modules.choiceHandler.goBack());
        this.bindEvent('bookmark-btn', 'click', () => this.saveProgress());
        this.bindEvent('restart-btn', 'click', () => this.restartStory());

        // Modal controls
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Settings controls
        this.bindEvent('narration-speed', 'input', (e) => this.updateNarrationSpeed(e));
        this.bindEvent('voice-select', 'change', (e) => this.updateVoice(e));
        this.bindEvent('auto-narration', 'change', (e) => this.updateAutoNarration(e));
        this.bindEvent('export-story', 'click', () => this.exportStory());
        this.bindEvent('share-story', 'click', () => this.shareStory());

        // Contribution
        this.bindEvent('submit-contribution', 'click', () => this.submitContribution());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardInput(e));

        // Theme selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-option')) {
                const theme = e.target.closest('.theme-option').dataset.theme;
                this.modules.themes.applyTheme(theme);
                this.closeModal(document.getElementById('theme-modal'));
            }
        });

        // Story management
        document.addEventListener('click', (e) => {
            if (e.target.closest('.saved-story-item') && !e.target.closest('.delete-story')) {
                const storyId = e.target.closest('.saved-story-item').dataset.storyId;
                this.loadSavedStory(storyId);
            }
            if (e.target.closest('.delete-story')) {
                e.stopPropagation();
                const storyId = e.target.closest('.saved-story-item').dataset.storyId;
                this.deleteSavedStory(storyId);
            }
        });
    }

    bindEvent(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, handler);
        }
    }

    async handleStorySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const storyParams = {
            characterName: formData.get('character-name'),
            characterTrait: formData.get('character-trait'),
            storyGoal: formData.get('story-goal'),
            customElement: formData.get('custom-element'),
            theme: this.state.currentTheme
        };

        if (!this.validateStoryParams(storyParams)) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const story = await this.modules.storyGenerator.generateInitialStory(storyParams);
            this.startNewStory(story, storyParams);
        } catch (error) {
            console.error('Failed to generate story:', error);
            this.showNotification('Failed to generate story. Please try again.', 'error');
        }
    }

    validateStoryParams(params) {
        return params.characterName && 
               params.characterTrait && 
               params.storyGoal;
    }

    startNewStory(story, params) {
        this.state.currentStory = story;
        this.state.storyHistory = [story];
        this.state.storyParams = params;
        
        this.switchScreen('story-display');
        this.displayCurrentStory();
    }

    async displayCurrentStory() {
        if (!this.state.currentStory) return;

        // Update progress indicator
        this.updateProgress();

        // Display story text with typing animation
        await this.displayStoryText(this.state.currentStory.text);

        // Auto-narration if enabled
        if (this.state.settings.autoNarration && this.state.isNarrationEnabled) {
            this.modules.narration.speak(this.state.currentStory.text);
        }

        // Display choices
        this.modules.choiceHandler.displayChoices(this.state.currentStory.choices);

        // Update controls
        this.updateStoryControls();
    }

    async displayStoryText(text) {
        const storyTextEl = document.getElementById('story-text');
        if (!storyTextEl) return;

        // Clear previous text
        storyTextEl.textContent = '';
        storyTextEl.classList.add('typing');

        // Typing animation
        for (let i = 0; i < text.length; i++) {
            storyTextEl.textContent += text[i];
            await this.delay(30);
        }

        storyTextEl.classList.remove('typing');
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const chapterIndicator = document.getElementById('chapter-indicator');
        
        if (progressFill && chapterIndicator) {
            const progress = Math.min((this.state.storyHistory.length / 10) * 100, 100);
            progressFill.style.width = `${progress}%`;
            chapterIndicator.textContent = `Chapter ${this.state.storyHistory.length}`;
        }
    }

    updateStoryControls() {
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.disabled = this.state.storyHistory.length <= 1;
        }
    }

    async continueStory(choice) {
        try {
            const nextStory = await this.modules.storyGenerator.continueStory(
                this.state.currentStory, 
                choice, 
                this.state.storyHistory
            );
            
            this.state.currentStory = nextStory;
            this.state.storyHistory.push(nextStory);
            
            await this.displayCurrentStory();
            
        } catch (error) {
            console.error('Failed to continue story:', error);
            this.showNotification('Failed to continue story. Please try again.', 'error');
        }
    }

    saveProgress() {
        if (!this.state.currentStory) return;

        const storyData = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            characterName: this.state.storyParams?.characterName || 'Unknown Hero',
            theme: this.state.currentTheme,
            currentStory: this.state.currentStory,
            history: this.state.storyHistory,
            params: this.state.storyParams
        };

        this.modules.storage.saveStory(storyData);
        this.loadSavedStories();
        this.showNotification('Progress saved successfully!', 'success');
    }

    loadSavedStories() {
        const stories = this.modules.storage.getSavedStories();
        const container = document.getElementById('saved-stories-list');
        
        if (!container) return;

        if (stories.length === 0) {
            container.innerHTML = '<p class="no-stories">No saved stories yet.</p>';
            return;
        }

        container.innerHTML = stories.map(story => `
            <div class="saved-story-item" data-story-id="${story.id}">
                <div class="story-info">
                    <h4>${this.escapeHtml(story.characterName)}</h4>
                    <div class="story-meta">
                        ${story.theme} • ${new Date(story.timestamp).toLocaleDateString()} • Chapter ${story.history?.length || 1}
                    </div>
                </div>
                <button class="delete-story" title="Delete Story">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    loadSavedStory(storyId) {
        const story = this.modules.storage.getStory(storyId);
        if (!story) return;

        // Apply story theme
        this.modules.themes.applyTheme(story.theme);
        
        // Restore story state
        this.state.currentStory = story.currentStory;
        this.state.storyHistory = story.history || [story.currentStory];
        this.state.storyParams = story.params;
        this.state.currentTheme = story.theme;

        this.switchScreen('story-display');
        this.displayCurrentStory();
    }

    deleteSavedStory(storyId) {
        if (confirm('Are you sure you want to delete this saved story?')) {
            this.modules.storage.deleteStory(storyId);
            this.loadSavedStories();
            this.showNotification('Story deleted successfully.', 'success');
        }
    }

    restartStory() {
        if (confirm('Are you sure you want to restart? Current progress will be lost.')) {
            this.state.currentStory = null;
            this.state.storyHistory = [];
            this.switchScreen('story-setup');
        }
    }

    toggleNarration() {
        this.state.isNarrationEnabled = !this.state.isNarrationEnabled;
        this.modules.narration.setEnabled(this.state.isNarrationEnabled);
        this.updateNarrationButton();
        
        if (this.state.isNarrationEnabled && this.state.currentStory) {
            this.modules.narration.speak(this.state.currentStory.text);
        } else {
            this.modules.narration.stop();
        }
    }

    updateNarrationButton() {
        const button = document.getElementById('narration-toggle');
        if (!button) return;

        const icon = button.querySelector('i');
        if (this.state.isNarrationEnabled) {
            button.classList.add('active');
            icon.className = 'fas fa-volume-up';
            button.title = 'Disable Narration';
        } else {
            button.classList.remove('active');
            icon.className = 'fas fa-volume-mute';
            button.title = 'Enable Narration';
        }
    }

    updateNarrationSpeed(e) {
        const speed = parseFloat(e.target.value);
        this.state.settings.narrationSpeed = speed;
        this.modules.narration.setSpeed(speed);
        
        const speedValue = document.getElementById('speed-value');
        if (speedValue) {
            speedValue.textContent = `${speed}x`;
        }
        
        this.saveSettings();
    }

    updateVoice(e) {
        this.state.settings.selectedVoice = e.target.value;
        this.modules.narration.setVoice(e.target.value);
        this.saveSettings();
    }

    updateAutoNarration(e) {
        this.state.settings.autoNarration = e.target.checked;
        this.saveSettings();
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.currentScreen = screenId;
        }
    }

    showThemeModal() {
        const modal = document.getElementById('theme-modal');
        if (modal) {
            this.modules.themes.populateThemeGrid();
            modal.classList.add('active');
        }
    }

    showSettingsModal() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            this.populateSettings();
            modal.classList.add('active');
        }
    }

    populateSettings() {
        // Voice selection
        const voiceSelect = document.getElementById('voice-select');
        if (voiceSelect) {
            const voices = this.modules.narration.getAvailableVoices();
            voiceSelect.innerHTML = voices.map(voice => 
                `<option value="${voice.name}" ${voice.name === this.state.settings.selectedVoice ? 'selected' : ''}>
                    ${voice.name} (${voice.lang})
                </option>`
            ).join('');
        }

        // Speed setting
        const speedSlider = document.getElementById('narration-speed');
        const speedValue = document.getElementById('speed-value');
        if (speedSlider && speedValue) {
            speedSlider.value = this.state.settings.narrationSpeed;
            speedValue.textContent = `${this.state.settings.narrationSpeed}x`;
        }

        // Auto-narration checkbox
        const autoNarration = document.getElementById('auto-narration');
        if (autoNarration) {
            autoNarration.checked = this.state.settings.autoNarration;
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    exportStory() {
        if (!this.state.storyHistory || this.state.storyHistory.length === 0) {
            this.showNotification('No story to export.', 'error');
            return;
        }
        
        this.modules.export.exportAsText(this.state.storyHistory, this.state.storyParams);
    }

    shareStory() {
        if (!this.state.storyHistory || this.state.storyHistory.length === 0) {
            this.showNotification('No story to share.', 'error');
            return;
        }
        
        this.modules.export.shareStory(this.state.storyHistory, this.state.storyParams);
    }

    submitContribution() {
        const contributionText = document.getElementById('user-contribution')?.value.trim();
        if (!contributionText) {
            this.showNotification('Please enter your contribution.', 'error');
            return;
        }

        if (!this.isValidContribution(contributionText)) {
            this.showNotification('Please provide a meaningful contribution of at least 10 characters.', 'error');
            return;
        }

        this.modules.storage.saveContribution(contributionText);
        this.closeModal(document.getElementById('contribution-modal'));
        this.showNotification('Thank you for your contribution!', 'success');
        
        const contributionInput = document.getElementById('user-contribution');
        if (contributionInput) {
            contributionInput.value = '';
        }
    }

    isValidContribution(text) {
        return text.length >= 10 && !text.toLowerCase().includes('test');
    }

    handleKeyboardInput(e) {
        switch (e.key) {
            case 'Escape':
                const openModal = document.querySelector('.modal.active');
                if (openModal) {
                    this.closeModal(openModal);
                }
                break;
            case 'Enter':
                if (e.target.classList.contains('choice-btn')) {
                    e.target.click();
                }
                break;
        }
    }

    loadUserData() {
        // Load saved settings
        const savedSettings = localStorage.getItem('story-weaver-settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.state.settings = { ...this.state.settings, ...settings };
            } catch (error) {
                console.warn('Failed to load saved settings:', error);
            }
        }

        // Load saved stories
        this.loadSavedStories();
    }

    saveSettings() {
        localStorage.setItem('story-weaver-settings', JSON.stringify(this.state.settings));
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.storyApp = new StoryApp();
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.storyApp) {
        window.storyApp.showNotification('An unexpected error occurred.', 'error');
    }
});

// Add notification styles
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
