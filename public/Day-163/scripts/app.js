
/**
 * Main Application Controller
 * Manages the overall application state and coordinates between modules
 */

class StoryApp {
    constructor() {
        this.currentScreen = 'setup-screen';
        this.state = {
            currentStory: null,
            storyHistory: [],
            currentTheme: 'fantasy',
            settings: {
                speechRate: 1.0,
                autoNarrate: false,
                selectedVoice: null,
                textSize: 18,
                animationsEnabled: true
            }
        };
        
        this.init();
    }

    async init() {
        try {
            this.showLoading();
            
            // Initialize modules
            this.storyGenerator = new StoryGenerator();
            this.themeManager = new ThemeManager();
            this.audioManager = new AudioManager();
            this.storageManager = new StorageManager();
            this.exportManager = new ExportManager();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load saved data
            this.loadUserData();
            
            // Apply theme
            this.themeManager.applyTheme(this.state.currentTheme);
            
            // Initialize background effects
            this.initBackgroundEffects();
            
            this.hideLoading();
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.hideLoading();
            this.showToast('Failed to initialize application. Please refresh the page.', 'error');
        }
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('new-story-btn').addEventListener('click', () => {
            this.switchScreen('setup-screen');
        });
        
        document.getElementById('load-story-btn').addEventListener('click', () => {
            this.showSavedStories();
        });
        
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettingsModal();
        });

        // Story form
        document.getElementById('story-setup-form').addEventListener('submit', (e) => {
            this.handleStorySubmit(e);
        });

        // Theme selection
        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.state.currentTheme = e.target.value;
            this.themeManager.applyTheme(e.target.value);
        });

        // Story controls
        document.getElementById('back-btn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('narrate-btn').addEventListener('click', () => {
            this.toggleNarration();
        });
        
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveCurrentStory();
        });
        
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportStory();
        });
        
        document.getElementById('share-btn').addEventListener('click', () => {
            this.showShareModal();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartStory();
        });

        // Settings
        this.setupSettingsEvents();

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    setupSettingsEvents() {
        // Voice selection
        const voiceSelect = document.getElementById('voice-select');
        voiceSelect.addEventListener('change', (e) => {
            this.state.settings.selectedVoice = e.target.value;
            this.audioManager.setVoice(e.target.value);
            this.saveSettings();
        });

        // Speech rate
        const speechRate = document.getElementById('speech-rate');
        const speechRateValue = document.getElementById('speech-rate-value');
        speechRate.addEventListener('input', (e) => {
            const rate = parseFloat(e.target.value);
            this.state.settings.speechRate = rate;
            speechRateValue.textContent = `${rate.toFixed(1)}x`;
            this.audioManager.setRate(rate);
            this.saveSettings();
        });

        // Auto-narrate
        const autoNarrate = document.getElementById('auto-narrate');
        autoNarrate.addEventListener('change', (e) => {
            this.state.settings.autoNarrate = e.target.checked;
            this.saveSettings();
        });

        // Text size
        const textSize = document.getElementById('text-size');
        const textSizeValue = document.getElementById('text-size-value');
        textSize.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            this.state.settings.textSize = size;
            textSizeValue.textContent = `${size}px`;
            document.documentElement.style.setProperty('--text-size', `${size}px`);
            this.saveSettings();
        });

        // Animations
        const animationsEnabled = document.getElementById('animations-enabled');
        animationsEnabled.addEventListener('change', (e) => {
            this.state.settings.animationsEnabled = e.target.checked;
            document.body.classList.toggle('no-animations', !e.target.checked);
            this.saveSettings();
        });
    }

    async handleStorySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const params = {
            characterName: formData.get('character-name'),
            characterTrait: formData.get('character-trait'),
            storyGoal: formData.get('story-goal'),
            customElement: formData.get('custom-element'),
            theme: this.state.currentTheme
        };

        if (!this.validateStoryParams(params)) {
            this.showToast('Please fill in all required fields.', 'error');
            return;
        }

        try {
            this.showLoading();
            const story = await this.storyGenerator.generateStory(params);
            this.startNewStory(story, params);
        } catch (error) {
            console.error('Failed to generate story:', error);
            this.showToast('Failed to generate story. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    validateStoryParams(params) {
        return params.characterName && 
               params.characterTrait && 
               params.storyGoal &&
               params.theme;
    }

    startNewStory(story, params) {
        this.state.currentStory = story;
        this.state.storyHistory = [story];
        this.state.storyParams = params;
        
        this.switchScreen('story-screen');
        this.displayCurrentStory();
    }

    async displayCurrentStory() {
        if (!this.state.currentStory) return;

        // Update progress
        this.updateProgress();

        // Display story text with animation
        await this.displayStoryText(this.state.currentStory.text);

        // Auto-narration
        if (this.state.settings.autoNarrate) {
            this.audioManager.speak(this.state.currentStory.text);
        }

        // Display choices
        this.displayChoices(this.state.currentStory.choices);

        // Update controls
        this.updateControls();
    }

    async displayStoryText(text) {
        const storyTextEl = document.getElementById('story-text');
        if (!storyTextEl) return;

        storyTextEl.textContent = '';
        storyTextEl.classList.add('typing');

        if (this.state.settings.animationsEnabled) {
            // Typing animation
            for (let i = 0; i < text.length; i++) {
                storyTextEl.textContent += text[i];
                await this.delay(30);
            }
        } else {
            storyTextEl.textContent = text;
        }

        storyTextEl.classList.remove('typing');
    }

    displayChoices(choices) {
        const choicesContainer = document.getElementById('story-choices');
        if (!choicesContainer || !choices || choices.length === 0) {
            choicesContainer.innerHTML = '<p>The story has ended.</p>';
            return;
        }

        choicesContainer.innerHTML = choices.map((choice, index) => `
            <div class="choice-item" data-choice-index="${index}">
                ${choice.text}
            </div>
        `).join('');

        // Add click listeners
        choicesContainer.querySelectorAll('.choice-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.makeChoice(choices[index]);
            });
        });
    }

    async makeChoice(choice) {
        if (!choice) return;

        try {
            this.showLoading();
            
            const nextStory = await this.storyGenerator.continueStory(
                this.state.currentStory,
                choice,
                this.state.storyHistory
            );
            
            this.state.currentStory = nextStory;
            this.state.storyHistory.push(nextStory);
            
            await this.displayCurrentStory();
            
        } catch (error) {
            console.error('Failed to continue story:', error);
            this.showToast('Failed to continue story. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    goBack() {
        if (this.state.storyHistory.length <= 1) return;
        
        this.state.storyHistory.pop();
        this.state.currentStory = this.state.storyHistory[this.state.storyHistory.length - 1];
        
        this.displayCurrentStory();
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            const progress = Math.min((this.state.storyHistory.length / 10) * 100, 100);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Chapter ${this.state.storyHistory.length}`;
        }
    }

    updateControls() {
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.disabled = this.state.storyHistory.length <= 1;
        }
    }

    toggleNarration() {
        if (this.audioManager.isSpeaking()) {
            this.audioManager.stop();
            this.showToast('Narration stopped', 'info');
        } else {
            if (this.state.currentStory) {
                this.audioManager.speak(this.state.currentStory.text);
                this.showToast('Narration started', 'info');
            }
        }
    }

    saveCurrentStory() {
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

        this.storageManager.saveStory(storyData);
        this.showToast('Story saved successfully!', 'success');
    }

    showSavedStories() {
        const stories = this.storageManager.getSavedStories();
        const container = document.getElementById('saved-stories-list');
        
        if (!stories || stories.length === 0) {
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
                <button class="delete-story" data-story-id="${story.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.saved-story-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-story')) {
                    this.loadSavedStory(item.dataset.storyId);
                }
            });
        });

        container.querySelectorAll('.delete-story').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteSavedStory(btn.dataset.storyId);
            });
        });
    }

    loadSavedStory(storyId) {
        const story = this.storageManager.getStory(storyId);
        if (!story) return;

        this.state.currentStory = story.currentStory;
        this.state.storyHistory = story.history || [story.currentStory];
        this.state.storyParams = story.params;
        this.state.currentTheme = story.theme;

        this.themeManager.applyTheme(story.theme);
        this.switchScreen('story-screen');
        this.displayCurrentStory();
    }

    deleteSavedStory(storyId) {
        if (confirm('Are you sure you want to delete this saved story?')) {
            this.storageManager.deleteStory(storyId);
            this.showSavedStories();
            this.showToast('Story deleted successfully.', 'success');
        }
    }

    restartStory() {
        if (confirm('Are you sure you want to restart? Current progress will be lost.')) {
            this.state.currentStory = null;
            this.state.storyHistory = [];
            this.switchScreen('setup-screen');
        }
    }

    exportStory() {
        if (!this.state.storyHistory || this.state.storyHistory.length === 0) {
            this.showToast('No story to export.', 'error');
            return;
        }
        
        this.exportManager.exportAsText(this.state.storyHistory, this.state.storyParams);
    }

    showShareModal() {
        if (!this.state.storyHistory || this.state.storyHistory.length === 0) {
            this.showToast('No story to share.', 'error');
            return;
        }
        
        const modal = document.getElementById('share-modal');
        const summary = document.getElementById('share-summary');
        
        if (summary) {
            const storyText = this.state.storyHistory.map(s => s.text).join('\n\n');
            const truncated = storyText.length > 500 ? storyText.substring(0, 500) + '...' : storyText;
            summary.textContent = truncated;
        }
        
        modal.classList.add('active');
        
        // Setup social sharing
        document.getElementById('share-twitter').addEventListener('click', () => {
            const text = encodeURIComponent(`I just created an amazing story with Story Generator! Check it out.`);
            window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
        });
        
        document.getElementById('share-facebook').addEventListener('click', () => {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
        });
    }

    showSettingsModal() {
        const modal = document.getElementById('settings-modal');
        
        // Populate voice options
        const voiceSelect = document.getElementById('voice-select');
        const voices = this.audioManager.getVoices();
        voiceSelect.innerHTML = voices.map(voice => 
            `<option value="${voice.name}" ${voice.name === this.state.settings.selectedVoice ? 'selected' : ''}>
                ${voice.name} (${voice.lang})
            </option>`
        ).join('');

        // Set current values
        document.getElementById('speech-rate').value = this.state.settings.speechRate;
        document.getElementById('speech-rate-value').textContent = `${this.state.settings.speechRate.toFixed(1)}x`;
        document.getElementById('auto-narrate').checked = this.state.settings.autoNarrate;
        document.getElementById('text-size').value = this.state.settings.textSize;
        document.getElementById('text-size-value').textContent = `${this.state.settings.textSize}px`;
        document.getElementById('animations-enabled').checked = this.state.settings.animationsEnabled;
        
        modal.classList.add('active');
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
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

    loadUserData() {
        const savedSettings = this.storageManager.getSettings();
        if (savedSettings) {
            this.state.settings = { ...this.state.settings, ...savedSettings };
        }
        
        this.showSavedStories();
    }

    saveSettings() {
        this.storageManager.saveSettings(this.state.settings);
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'Escape':
                const openModal = document.querySelector('.modal.active');
                if (openModal) {
                    this.closeModal(openModal);
                }
                break;
        }
    }

    initBackgroundEffects() {
        if (typeof BackgroundEffects !== 'undefined') {
            this.backgroundEffects = new BackgroundEffects();
            this.backgroundEffects.init();
        }
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 500);
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
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
