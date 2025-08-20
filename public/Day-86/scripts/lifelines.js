// Lifelines management for KBC game

/**
 * Lifelines Manager class handling all three lifelines
 */
class LifelinesManager {
    constructor(game) {
        this.game = game;
        this.usedLifelines = new Set();
        
        // Lifeline configuration
        this.lifelines = {
            '50-50': {
                name: 'Fifty-Fifty',
                description: 'Remove two wrong answers',
                used: false
            },
            'phone': {
                name: 'Phone a Friend',
                description: 'Call a friend for help',
                used: false
            },
            'audience': {
                name: 'Ask the Audience',
                description: 'Poll the studio audience',
                used: false
            }
        };
        
        this.initializeLifelines();
    }

    /**
     * Initialize lifeline functionality
     */
    initializeLifelines() {
        console.log('Lifelines Manager initialized');
    }

    /**
     * Use Fifty-Fifty lifeline
     */
    useFiftyFifty() {
        if (this.isLifelineUsed('50-50') || this.game.gameState !== 'playing') {
            return false;
        }

        // Mark lifeline as used
        this.markLifelineUsed('50-50');
        
        // Play lifeline sound
        this.game.audioManager.playLifelineSound();
        
        // Get wrong options to remove
        const wrongOptions = this.game.currentQuestion ? 
            this.game.questions.getFiftyFiftyHint(this.game.currentQuestion) : 
            ['A', 'C']; // fallback
        
        // Create dramatic effect
        this.createLifelineEffect('fifty-fifty');
        
        // Remove wrong options with delay for dramatic effect
        setTimeout(() => {
            this.removeWrongOptions(wrongOptions);
            Utils.showToast('Two wrong answers removed!', 'info', 2000);
        }, 1500);
        
        console.log('Fifty-Fifty lifeline used, removing options:', wrongOptions);
        return true;
    }

    /**
     * Use Phone a Friend lifeline
     */
    usePhoneAFriend() {
        if (this.isLifelineUsed('phone') || this.game.gameState !== 'playing') {
            return false;
        }

        // Mark lifeline as used
        this.markLifelineUsed('phone');
        
        // Play lifeline sound
        this.game.audioManager.playLifelineSound();
        
        // Create lifeline effect
        this.createLifelineEffect('phone-friend');
        
        // Show phone friend modal
        this.showPhoneFriendModal();
        
        console.log('Phone a Friend lifeline used');
        return true;
    }

    /**
     * Use Ask the Audience lifeline
     */
    useAskAudience() {
        if (this.isLifelineUsed('audience') || this.game.gameState !== 'playing') {
            return false;
        }

        // Mark lifeline as used
        this.markLifelineUsed('audience');
        
        // Play lifeline sound
        this.game.audioManager.playLifelineSound();
        
        // Create lifeline effect
        this.createLifelineEffect('ask-audience');
        
        // Show audience poll modal
        this.showAudiencePollModal();
        
        console.log('Ask the Audience lifeline used');
        return true;
    }

    /**
     * Check if a lifeline has been used
     * @param {string} lifelineId - Lifeline identifier
     * @returns {boolean} True if lifeline is used
     */
    isLifelineUsed(lifelineId) {
        return this.game.usedLifelines.has(lifelineId);
    }

    /**
     * Mark a lifeline as used
     * @param {string} lifelineId - Lifeline identifier
     */
    markLifelineUsed(lifelineId) {
        this.game.usedLifelines.add(lifelineId);
        this.lifelines[lifelineId].used = true;
        
        // Update UI
        const lifelineButton = document.getElementById(this.getLifelineButtonId(lifelineId));
        if (lifelineButton) {
            lifelineButton.classList.add('used');
        }
    }

    /**
     * Get lifeline button ID from lifeline ID
     * @param {string} lifelineId - Lifeline identifier
     * @returns {string} Button element ID
     */
    getLifelineButtonId(lifelineId) {
        const buttonIds = {
            '50-50': 'fifty-fifty',
            'phone': 'phone-friend',
            'audience': 'ask-audience'
        };
        return buttonIds[lifelineId];
    }

    /**
     * Create visual effect for lifeline activation
     * @param {string} buttonId - Button element ID
     */
    createLifelineEffect(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add('lifeline-activate');
            
            // Remove effect class after animation
            setTimeout(() => {
                button.classList.remove('lifeline-activate');
            }, 1000);
        }
    }

    /**
     * Remove wrong options for Fifty-Fifty lifeline
     * @param {Array} wrongOptions - Array of wrong option keys to remove
     */
    removeWrongOptions(wrongOptions) {
        wrongOptions.forEach(optionKey => {
            const option = document.querySelector(`[data-option="${optionKey}"]`);
            if (option && !option.classList.contains('selected')) {
                // Animate removal
                option.style.transition = 'all 0.5s ease';
                option.style.opacity = '0.3';
                option.style.transform = 'scale(0.8)';
                option.classList.add('disabled');
                
                // Add visual indicator
                const optionText = option.querySelector('.option-text');
                if (optionText) {
                    optionText.style.textDecoration = 'line-through';
                }
            }
        });
    }

    /**
     * Show Phone a Friend modal with realistic conversation
     */
    showPhoneFriendModal() {
        const modal = this.game.showModal('phone-friend-modal');
        
        // Show calling animation first
        const callingText = document.querySelector('.calling-text');
        const phoneIcon = document.querySelector('.phone-icon');
        const friendResponse = document.querySelector('.friend-response');
        
        if (callingText) callingText.style.display = 'block';
        if (friendResponse) friendResponse.style.display = 'none';
        
        // Simulate calling delay
        setTimeout(() => {
            this.showFriendResponse();
        }, Utils.randomBetween(2000, 4000));
    }

    /**
     * Show friend's response
     */
    showFriendResponse() {
        const callingText = document.querySelector('.calling-text');
        const friendResponse = document.querySelector('.friend-response');
        const responseText = document.getElementById('friend-response-text');
        const confidenceSpan = document.getElementById('friend-confidence');
        
        if (callingText) callingText.style.display = 'none';
        if (friendResponse) friendResponse.style.display = 'block';
        
        // Generate friend response
        const response = this.game.currentQuestion ? 
            this.game.questions.generatePhoneFriendResponse(this.game.currentQuestion) :
            { response: "I'm not sure about this one. Good luck!", confidence: 50, answer: 'A' };
        
        if (responseText) {
            responseText.textContent = response.response;
        }
        
        if (confidenceSpan) {
            confidenceSpan.textContent = response.confidence;
        }
        
        // Highlight suggested answer with subtle effect
        setTimeout(() => {
            const suggestedOption = document.querySelector(`[data-option="${response.answer}"]`);
            if (suggestedOption && !suggestedOption.classList.contains('disabled')) {
                suggestedOption.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';
                suggestedOption.style.borderColor = 'rgba(255, 215, 0, 0.6)';
            }
        }, 1000);
        
        // Auto close modal after 10 seconds
        setTimeout(() => {
            this.game.hideModal('phone-friend-modal');
            this.resetOptionHighlights();
        }, 10000);
    }

    /**
     * Show Ask the Audience poll modal
     */
    showAudiencePollModal() {
        this.game.showModal('ask-audience-modal');
        
        // Generate poll results
        const pollResults = this.game.currentQuestion ? 
            this.game.questions.generateAudiencePoll(this.game.currentQuestion) :
            { A: 25, B: 25, C: 25, D: 25 }; // fallback
        
        // Animate poll bars
        setTimeout(() => {
            this.animatePollResults(pollResults);
        }, 500);
        
        // Highlight audience favorite
        setTimeout(() => {
            this.highlightAudienceFavorite(pollResults);
        }, 3000);
        
        // Auto close after 15 seconds
        setTimeout(() => {
            this.game.hideModal('ask-audience-modal');
            this.resetOptionHighlights();
        }, 15000);
    }

    /**
     * Animate poll results bars
     * @param {Object} pollResults - Poll results object
     */
    animatePollResults(pollResults) {
        Object.keys(pollResults).forEach((option, index) => {
            const percentage = pollResults[option];
            const pollFill = document.querySelector(`[data-option="${option}"].poll-fill`);
            const pollPercentage = document.getElementById(`poll-${option}`);
            
            if (pollFill && pollPercentage) {
                // Animate bar fill
                setTimeout(() => {
                    pollFill.style.width = `${percentage}%`;
                    pollPercentage.textContent = `${percentage}%`;
                    
                    // Add pulsing effect for high percentages
                    if (percentage > 40) {
                        pollFill.style.animation = 'none';
                        setTimeout(() => {
                            pollFill.style.animation = 'audiencePollReveal 0.5s ease-out, currentPulse 2s ease-in-out infinite';
                        }, 100);
                    }
                }, index * 200);
            }
        });
    }

    /**
     * Highlight the audience's favorite answer
     * @param {Object} pollResults - Poll results object
     */
    highlightAudienceFavorite(pollResults) {
        // Find option with highest percentage
        let maxPercentage = 0;
        let favoriteOption = null;
        
        Object.keys(pollResults).forEach(option => {
            if (pollResults[option] > maxPercentage) {
                maxPercentage = pollResults[option];
                favoriteOption = option;
            }
        });
        
        // Highlight the favorite option in the main question
        if (favoriteOption && maxPercentage > 30) {
            const option = document.querySelector(`[data-option="${favoriteOption}"]`);
            if (option && !option.classList.contains('disabled')) {
                option.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.4)';
                option.style.borderColor = 'rgba(255, 215, 0, 0.7)';
                
                // Add subtle glow animation
                option.style.animation = 'currentPulse 3s ease-in-out infinite';
            }
        }
    }

    /**
     * Reset option highlights after lifeline use
     */
    resetOptionHighlights() {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.boxShadow = '';
            option.style.borderColor = '';
            option.style.animation = '';
        });
    }

    /**
     * Reset all lifelines (for new game)
     */
    resetLifelines() {
        this.game.usedLifelines.clear();
        
        Object.keys(this.lifelines).forEach(lifelineId => {
            this.lifelines[lifelineId].used = false;
        });
        
        // Reset UI
        const lifelineButtons = document.querySelectorAll('.lifeline');
        lifelineButtons.forEach(button => {
            button.classList.remove('used');
        });
        
        console.log('All lifelines reset');
    }

    /**
     * Get lifeline usage statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        return {
            totalLifelines: Object.keys(this.lifelines).length,
            usedLifelines: this.game.usedLifelines.size,
            availableLifelines: Object.keys(this.lifelines).length - this.game.usedLifelines.size,
            usedList: Array.from(this.game.usedLifelines),
            mostUsedLifeline: this.getMostUsedLifeline()
        };
    }

    /**
     * Get most used lifeline from storage
     * @returns {string} Most used lifeline ID
     */
    getMostUsedLifeline() {
        const stats = Utils.Storage.get('lifeline_usage_stats', {
            '50-50': 0,
            'phone': 0,
            'audience': 0
        });
        
        let mostUsed = '50-50';
        let maxUsage = 0;
        
        Object.keys(stats).forEach(lifeline => {
            if (stats[lifeline] > maxUsage) {
                maxUsage = stats[lifeline];
                mostUsed = lifeline;
            }
        });
        
        return mostUsed;
    }

    /**
     * Update lifeline usage statistics
     * @param {string} lifelineId - Used lifeline ID
     */
    updateUsageStats(lifelineId) {
        const stats = Utils.Storage.get('lifeline_usage_stats', {
            '50-50': 0,
            'phone': 0,
            'audience': 0
        });
        
        stats[lifelineId]++;
        Utils.Storage.set('lifeline_usage_stats', stats);
    }

    /**
     * Create strategic hint for lifeline selection
     * @returns {Object} Lifeline recommendations
     */
    getLifelineRecommendation() {
        const availableLifelines = [];
        
        Object.keys(this.lifelines).forEach(lifelineId => {
            if (!this.isLifelineUsed(lifelineId)) {
                availableLifelines.push(lifelineId);
            }
        });
        
        const currentLevel = this.game.currentLevel;
        const timeRemaining = this.game.timeRemaining;
        
        let recommendation = null;
        let reason = '';
        
        // Strategic recommendations based on game state
        if (availableLifelines.includes('50-50') && currentLevel <= 10) {
            recommendation = '50-50';
            reason = 'Good for eliminating obviously wrong answers in early levels';
        } else if (availableLifelines.includes('audience') && currentLevel <= 8) {
            recommendation = 'audience';
            reason = 'Audience is reliable for general knowledge questions';
        } else if (availableLifelines.includes('phone') && currentLevel >= 9) {
            recommendation = 'phone';
            reason = 'Friends might have specialized knowledge for harder questions';
        } else if (availableLifelines.includes('50-50') && timeRemaining < 10) {
            recommendation = '50-50';
            reason = 'Quick way to improve odds when time is running out';
        }
        
        return {
            recommended: recommendation,
            reason: reason,
            available: availableLifelines
        };
    }

    /**
     * Simulate realistic friend personalities for Phone a Friend
     * @returns {Object} Friend personality and response style
     */
    generateFriendPersonality() {
        const personalities = [
            {
                name: 'Alex',
                confidence: 'high',
                knowledge: 'general',
                responseStyle: 'confident',
                accuracy: 0.8
            },
            {
                name: 'Sam',
                confidence: 'medium',
                knowledge: 'specific',
                responseStyle: 'thoughtful',
                accuracy: 0.7
            },
            {
                name: 'Jordan',
                confidence: 'variable',
                knowledge: 'broad',
                responseStyle: 'analytical',
                accuracy: 0.75
            },
            {
                name: 'Casey',
                confidence: 'low',
                knowledge: 'limited',
                responseStyle: 'honest',
                accuracy: 0.6
            }
        ];
        
        return personalities[Math.floor(Math.random() * personalities.length)];
    }

    /**
     * Generate more realistic audience poll results
     * @param {Object} question - Current question object
     * @returns {Object} Enhanced poll results
     */
    generateEnhancedAudiencePoll(question) {
        const difficulty = this.game.questions.getDifficultyName(this.game.currentLevel);
        let baseAccuracy;
        
        // Audience accuracy varies by difficulty
        switch (difficulty) {
            case 'Easy':
                baseAccuracy = Utils.randomBetween(70, 85);
                break;
            case 'Medium':
                baseAccuracy = Utils.randomBetween(55, 70);
                break;
            case 'Hard':
                baseAccuracy = Utils.randomBetween(40, 60);
                break;
            default:
                baseAccuracy = 65;
        }
        
        const results = {};
        const correctAnswer = question.correct;
        const options = ['A', 'B', 'C', 'D'];
        
        // Generate weighted results
        results[correctAnswer] = baseAccuracy;
        let remainingPercentage = 100 - baseAccuracy;
        
        const otherOptions = options.filter(opt => opt !== correctAnswer);
        otherOptions.forEach((option, index) => {
            if (index === otherOptions.length - 1) {
                results[option] = remainingPercentage;
            } else {
                const percentage = Utils.randomBetween(5, Math.floor(remainingPercentage / 2));
                results[option] = percentage;
                remainingPercentage -= percentage;
            }
        });
        
        return results;
    }
}

// Export LifelinesManager
window.LifelinesManager = LifelinesManager;
