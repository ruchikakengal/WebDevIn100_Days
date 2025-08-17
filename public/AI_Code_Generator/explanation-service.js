// Code Explanation Service using Gemini AI
class ExplanationService {
    constructor() {
        this.currentCode = null;
        this.currentExplanationType = 'overview';
        this.initEventListeners();
    }

    initEventListeners() {
        // Tab buttons for different explanation types
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.switchExplanationType(type);
            });
        });

        // Close modal when clicking outside
        const explanationModal = document.getElementById('explanation-modal');
        if (explanationModal) {
            explanationModal.addEventListener('click', (e) => {
                if (e.target === explanationModal) {
                    closeExplanation();
                }
            });
        }
    }

    async openExplanation(code) {
        if (!code) {
            showToast('No code available to explain', 'warning');
            return;
        }

        this.currentCode = code;
        this.currentExplanationType = 'overview';
        
        // Update tab buttons
        this.updateActiveTab('overview');
        
        // Open modal
        openExplanation();
        
        // Generate initial explanation
        await this.generateExplanation('overview');
    }

    switchExplanationType(type) {
        this.currentExplanationType = type;
        this.updateActiveTab(type);
        this.generateExplanation(type);
    }

    updateActiveTab(activeType) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === activeType);
        });
    }

    async generateExplanation(type) {
        if (!this.currentCode || !window.geminiService) {
            this.showExplanationError('Code or AI service not available');
            return;
        }

        // Show loading state
        this.showLoading(true);

        try {
            console.log(`Generating ${type} explanation...`);
            
            // Use Gemini service to generate explanation
            const explanation = await window.geminiService.generateCodeExplanation(this.currentCode, type);
            
            // Display the explanation
            this.displayExplanation(explanation);
            
        } catch (error) {
            console.error('Error generating explanation:', error);
            this.showExplanationError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const loadingElement = document.getElementById('explanation-loading');
        const textElement = document.getElementById('explanation-text');
        
        if (loadingElement) {
            loadingElement.style.display = show ? 'flex' : 'none';
        }
        
        if (textElement && show) {
            textElement.innerHTML = '';
        }
    }

    displayExplanation(explanation) {
        const textElement = document.getElementById('explanation-text');
        if (!textElement) return;

        // Display the formatted explanation
        textElement.innerHTML = explanation;
        
        // Scroll to top of explanation
        textElement.scrollTop = 0;
        
        // Add some styling for better readability
        this.enhanceExplanationDisplay();
    }

    enhanceExplanationDisplay() {
        const textElement = document.getElementById('explanation-text');
        if (!textElement) return;

        // Add syntax highlighting for code snippets if any
        const codeElements = textElement.querySelectorAll('code');
        codeElements.forEach(code => {
            code.style.backgroundColor = 'var(--bg-tertiary)';
            code.style.padding = '2px 6px';
            code.style.borderRadius = 'var(--radius-sm)';
            code.style.fontFamily = 'Monaco, Menlo, "Ubuntu Mono", monospace';
            code.style.fontSize = '0.9em';
        });

        // Style headers
        const headers = textElement.querySelectorAll('h3, h4, h5');
        headers.forEach(header => {
            header.style.marginTop = '1.5rem';
            header.style.marginBottom = '0.5rem';
            header.style.borderBottom = '2px solid var(--border-color)';
            header.style.paddingBottom = '0.25rem';
        });

        // Style lists
        const lists = textElement.querySelectorAll('ul');
        lists.forEach(list => {
            list.style.marginLeft = '1rem';
            list.style.marginBottom = '1rem';
        });

        const listItems = textElement.querySelectorAll('li');
        listItems.forEach(item => {
            item.style.marginBottom = '0.25rem';
            item.style.lineHeight = '1.6';
        });

        // Style paragraphs
        const paragraphs = textElement.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.marginBottom = '1rem';
            p.style.lineHeight = '1.7';
        });
    }

    showExplanationError(errorMessage) {
        const textElement = document.getElementById('explanation-text');
        if (!textElement) return;

        textElement.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--error-color);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Explanation Error</h3>
                <p>${escapeHtml(errorMessage)}</p>
                <button class="btn-primary" onclick="explanationService.generateExplanation('${this.currentExplanationType}')" style="margin-top: 1rem;">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
    }

    // Method to export explanation as text
    exportExplanation() {
        const textElement = document.getElementById('explanation-text');
        if (!textElement) {
            showToast('No explanation to export', 'warning');
            return;
        }

        try {
            // Get text content without HTML tags
            const textContent = textElement.innerText || textElement.textContent;
            
            if (!textContent.trim()) {
                showToast('No explanation content to export', 'warning');
                return;
            }

            // Create export data with metadata
            const exportData = {
                type: this.currentExplanationType,
                explanation: textContent,
                exportedAt: new Date().toISOString(),
                codeLength: this.currentCode ? this.currentCode.length : 0
            };

            if (window.fileManager) {
                window.fileManager.downloadFile(
                    JSON.stringify(exportData, null, 2),
                    `code-explanation-${this.currentExplanationType}.json`,
                    'application/json'
                );
            }
            
            showToast('Explanation exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting explanation:', error);
            showToast('Error exporting explanation: ' + error.message, 'error');
        }
    }

    // Method to copy explanation to clipboard
    async copyExplanation() {
        const textElement = document.getElementById('explanation-text');
        if (!textElement) {
            showToast('No explanation to copy', 'warning');
            return;
        }

        try {
            const textContent = textElement.innerText || textElement.textContent;
            
            if (!textContent.trim()) {
                showToast('No explanation content to copy', 'warning');
                return;
            }

            await navigator.clipboard.writeText(textContent);
            showToast('Explanation copied to clipboard', 'success');
        } catch (error) {
            console.error('Error copying explanation:', error);
            // Fallback to manual copy
            copyToClipboard(textContent);
        }
    }

    // Method to get explanation statistics
    getExplanationStats() {
        const textElement = document.getElementById('explanation-text');
        if (!textElement) return null;

        const textContent = textElement.innerText || textElement.textContent;
        if (!textContent) return null;

        const words = textContent.trim().split(/\s+/).length;
        const characters = textContent.length;
        const paragraphs = textElement.querySelectorAll('p').length;
        const headers = textElement.querySelectorAll('h3, h4, h5').length;
        const lists = textElement.querySelectorAll('ul, ol').length;

        return {
            words,
            characters,
            paragraphs,
            headers,
            lists,
            type: this.currentExplanationType,
            readingTime: Math.ceil(words / 200) // Assuming 200 words per minute reading speed
        };
    }

    // Method to validate code before explanation
    validateCodeForExplanation(code) {
        if (!code || typeof code !== 'string') {
            return { valid: false, error: 'No code provided for explanation' };
        }

        if (code.length < 10) {
            return { valid: false, error: 'Code too short for meaningful explanation' };
        }

        if (code.length > 100000) {
            return { valid: false, error: 'Code too large for explanation (max 100KB)' };
        }

        return { valid: true };
    }

    // Method to get explanation type descriptions
    getExplanationTypeDescription(type) {
        const descriptions = {
            overview: 'Get a high-level overview of what the code does and its main features',
            breakdown: 'Get a detailed breakdown of how each part of the code works',
            concepts: 'Learn about the programming concepts and techniques used',
            practices: 'Understand the best practices and coding standards followed'
        };

        return descriptions[type] || 'Code explanation';
    }

    // Method to save explanation to local storage
    saveExplanation() {
        const textElement = document.getElementById('explanation-text');
        if (!textElement) return;

        const textContent = textElement.innerText || textElement.textContent;
        if (!textContent.trim()) return;

        try {
            const explanationData = {
                type: this.currentExplanationType,
                content: textContent,
                code: this.currentCode,
                savedAt: new Date().toISOString(),
                id: Date.now()
            };

            const stored = localStorage.getItem('ai_website_explanations');
            const explanations = stored ? JSON.parse(stored) : [];
            
            explanations.unshift(explanationData);
            
            // Keep only last 20 explanations
            if (explanations.length > 20) {
                explanations.splice(20);
            }
            
            localStorage.setItem('ai_website_explanations', JSON.stringify(explanations));
            showToast('Explanation saved', 'success');
        } catch (error) {
            console.error('Error saving explanation:', error);
            showToast('Error saving explanation', 'error');
        }
    }

    // Method to load saved explanations
    loadSavedExplanations() {
        try {
            const stored = localStorage.getItem('ai_website_explanations');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading saved explanations:', error);
            return [];
        }
    }

    // Method to delete saved explanation
    deleteSavedExplanation(id) {
        try {
            const explanations = this.loadSavedExplanations();
            const filtered = explanations.filter(exp => exp.id !== id);
            localStorage.setItem('ai_website_explanations', JSON.stringify(filtered));
            showToast('Explanation deleted', 'success');
        } catch (error) {
            console.error('Error deleting explanation:', error);
            showToast('Error deleting explanation', 'error');
        }
    }

    // Method to clear all saved explanations
    clearSavedExplanations() {
        if (confirm('Are you sure you want to clear all saved explanations?')) {
            localStorage.removeItem('ai_website_explanations');
            showToast('All saved explanations cleared', 'success');
        }
    }

    // Method to reset explanation state
    reset() {
        this.currentCode = null;
        this.currentExplanationType = 'overview';
        
        const textElement = document.getElementById('explanation-text');
        if (textElement) {
            textElement.innerHTML = '<p>Select code from the chat to see detailed explanations here.</p>';
        }
        
        this.updateActiveTab('overview');
    }

    // Method to compare explanations
    compareExplanations(explanation1, explanation2) {
        // Simple comparison based on content length and type
        return {
            lengthDiff: explanation1.content.length - explanation2.content.length,
            typeDiff: explanation1.type === explanation2.type,
            timeDiff: new Date(explanation1.savedAt) - new Date(explanation2.savedAt)
        };
    }

    // Method to generate explanation summary
    generateSummary(explanation) {
        const words = explanation.content.trim().split(/\s+/).length;
        const sentences = explanation.content.split(/[.!?]+/).length;
        const readingTime = Math.ceil(words / 200);
        
        return {
            words,
            sentences,
            readingTime,
            type: explanation.type,
            savedAt: explanation.savedAt
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExplanationService;
}
