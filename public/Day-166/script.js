// Main Application Logic
class PastLifeApp {
    constructor() {
        this.currentScreen = 'landing';
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.totalQuestions = window.quizData ? window.quizData.length : 5;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.showScreen('landingPage');
    }

    setupEventListeners() {
        // Start journey button
        const startBtn = document.getElementById('startJourneyBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }

        // Find again button
        const findAgainBtn = document.getElementById('findAgainBtn');
        if (findAgainBtn) {
            findAgainBtn.addEventListener('click', () => this.restartJourney());
        }

        // Share result button
        const shareBtn = document.getElementById('shareResultBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.openShareModal());
        }

        // Modal close
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeShareModal());
        }

        // Close modal on outside click
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeShareModal();
                }
            });
        }

        // Audio toggle
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }
    }

    setupAudio() {
        // Audio setup would go here - for now just setup the toggle
        const audio = document.getElementById('backgroundMusic');
        const audioBtn = document.getElementById('audioToggle');
        
        if (audio && audioBtn) {
            audioBtn.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play().catch(e => console.log('Audio play failed:', e));
                    audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                } else {
                    audio.pause();
                    audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                }
            });
        }
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 100);
        }

        this.currentScreen = screenId;
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.showScreen('quizPage');
        this.displayQuestion();
    }

    displayQuestion() {
        if (!window.quizData || this.currentQuestionIndex >= window.quizData.length) {
            this.showResults();
            return;
        }

        const question = window.quizData[this.currentQuestionIndex];
        const container = document.getElementById('questionContainer');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');

        if (currentQuestionSpan) currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        if (totalQuestionsSpan) totalQuestionsSpan.textContent = this.totalQuestions;

        // Update progress bar
        this.updateProgressBar();

        // Create question HTML
        let optionsHTML = '';
        
        if (question.type === 'paths') {
            optionsHTML = question.options.map(option => `
                <div class="option-card path-option" data-value="${option.value}" 
                     style="background: ${option.background}">
                    <div class="path-content">
                        <div class="option-icon">${option.icon}</div>
                        <div class="option-text">${option.text}</div>
                    </div>
                </div>
            `).join('');
        } else {
            optionsHTML = question.options.map(option => `
                <div class="option-card" data-value="${option.value}">
                    <div class="option-icon">${option.icon}</div>
                    <div class="option-text">${option.text}</div>
                </div>
            `).join('');
        }

        const questionHTML = `
            <div class="question active">
                <h3>${question.question}</h3>
                <div class="options-grid">
                    ${optionsHTML}
                </div>
            </div>
        `;

        if (container) {
            container.innerHTML = questionHTML;

            // Add event listeners to options
            const optionCards = container.querySelectorAll('.option-card');
            optionCards.forEach(card => {
                card.addEventListener('click', () => this.selectOption(card));
            });
        }
    }

    selectOption(selectedCard) {
        // Remove previous selections
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Mark as selected
        selectedCard.classList.add('selected');

        // Store answer
        const value = selectedCard.getAttribute('data-value');
        this.answers[this.currentQuestionIndex] = value;

        // Proceed to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 1000);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.showResults();
        } else {
            this.displayQuestion();
        }
    }

    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    showResults() {
        this.showScreen('resultsPage');
        
        // Generate past life result
        if (window.generatePastLife) {
            const result = window.generatePastLife(this.answers);
            this.displayResult(result);
        }
    }

    displayResult(result) {
        const titleEl = document.getElementById('pastLifeTitle');
        const eraEl = document.getElementById('pastLifeEra');
        const storyEl = document.getElementById('pastLifeStory');

        if (titleEl) titleEl.textContent = result.title;
        if (eraEl) eraEl.textContent = result.era;
        if (storyEl) storyEl.textContent = result.story;

        // Update card symbol
        const cardSymbol = document.querySelector('.card-symbol');
        if (cardSymbol) {
            cardSymbol.textContent = result.symbol;
        }

        // Store result for sharing
        this.currentResult = result;
    }

    restartJourney() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.showScreen('landingPage');
        
        // Reset progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = '0%';
        }
    }

    openShareModal() {
        const modal = document.getElementById('shareModal');
        const shareUrl = document.getElementById('shareUrl');
        
        if (modal && shareUrl) {
            // Generate shareable URL (in real app, this would be a proper URL)
            const currentUrl = window.location.href;
            shareUrl.value = currentUrl;
            modal.style.display = 'block';
        }
    }

    closeShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    toggleAudio() {
        // Audio toggle logic is handled in setupAudio
    }
}

// Global functions for share functionality
window.copyToClipboard = function() {
    const shareUrl = document.getElementById('shareUrl');
    if (shareUrl) {
        shareUrl.select();
        shareUrl.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            
            // Show feedback
            const btn = event.target.closest('.share-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
};

window.downloadResult = function() {
    // Create a simple text file with the result
    if (window.app && window.app.currentResult) {
        const result = window.app.currentResult;
        const text = `🔮 My Past Life Reading 🔮\n\n` +
                    `Title: ${result.title}\n` +
                    `Era: ${result.era}\n\n` +
                    `Story: ${result.story}\n\n` +
                    `Generated by Past Life Finder`;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-past-life.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show feedback
        const btn = event.target.closest('.share-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PastLifeApp();
});

// Handle page visibility for audio
document.addEventListener('visibilitychange', () => {
    const audio = document.getElementById('backgroundMusic');
    if (audio && !document.hidden) {
        // Page became visible - audio management if needed
    }
});
