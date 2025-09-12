class DocumentAnalyzer {
    constructor() {
        this.documentText = '';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // File input change
        document.getElementById('fileInput').addEventListener('change', this.handleFileSelect.bind(this));

        // Upload button
        document.getElementById('uploadBtn').addEventListener('click', this.uploadDocument.bind(this));

        // Summarize button
        document.getElementById('summarizeBtn').addEventListener('click', this.generateSummary.bind(this));

        // Ask button
        document.getElementById('askBtn').addEventListener('click', this.askQuestion.bind(this));

        // Question input (Enter key)
        document.getElementById('questionInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.askQuestion();
            }
        });

        // Question input change (enable/disable ask button)
        document.getElementById('questionInput').addEventListener('input', (e) => {
            const askBtn = document.getElementById('askBtn');
            askBtn.disabled = !e.target.value.trim() || !this.documentText;
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        const uploadBtn = document.getElementById('uploadBtn');

        if (file) {
            uploadBtn.disabled = false;
            this.hideError();
        } else {
            uploadBtn.disabled = true;
        }
    }

    async uploadDocument() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!file) {
            this.showError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        this.setUploadState(true);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.documentText = data.text;
                this.showDocumentStats(data.stats);
                this.showMainContent();
                this.hideError();
            } else {
                this.showError(data.error || 'Failed to process document.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.setUploadState(false);
        }
    }

    async generateSummary() {
        if (!this.documentText) {
            this.showError('Please upload a document first.');
            return;
        }

        const summaryLength = document.querySelector('input[name="summaryLength"]:checked').value;

        this.setSummarizeState(true);

        try {
            const response = await fetch('/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: this.documentText,
                    length: summaryLength
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showSummary(data.summary, data.stats);
                this.hideError();
            } else {
                this.showError(data.error || 'Failed to generate summary.');
            }
        } catch (error) {
            console.error('Summarization error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.setSummarizeState(false);
        }
    }

    async askQuestion() {
        const questionInput = document.getElementById('questionInput');
        const question = questionInput.value.trim();

        if (!question) {
            this.showError('Please enter a question.');
            return;
        }

        if (!this.documentText) {
            this.showError('Please upload a document first.');
            return;
        }

        this.setAskState(true);

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    context: this.documentText
                })
            });

            const data = await response.json();

            if (data.success) {
                this.addQAItem(question, data.answer);
                questionInput.value = '';
                document.getElementById('askBtn').disabled = true;
                this.hideError();
            } else {
                this.showError(data.error || 'Failed to get answer.');
            }
        } catch (error) {
            console.error('Q&A error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.setAskState(false);
        }
    }

    setUploadState(loading) {
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadSpinner = document.getElementById('uploadSpinner');
        const uploadIcon = document.getElementById('uploadIcon');
        const uploadText = document.getElementById('uploadText');
        const uploadProgress = document.getElementById('uploadProgress');

        if (loading) {
            uploadBtn.disabled = true;
            uploadSpinner.classList.remove('d-none');
            uploadIcon.classList.add('d-none');
            uploadText.textContent = 'Processing...';
            uploadProgress.classList.remove('d-none');

            // Simulate progress
            let progress = 0;
            const progressBar = uploadProgress.querySelector('.progress-bar');
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 90) progress = 90;
                progressBar.style.width = progress + '%';
            }, 200);

            uploadBtn.dataset.interval = interval;
        } else {
            uploadBtn.disabled = false;
            uploadSpinner.classList.add('d-none');
            uploadIcon.classList.remove('d-none');
            uploadText.textContent = 'Upload & Process';
            uploadProgress.classList.add('d-none');

            if (uploadBtn.dataset.interval) {
                clearInterval(uploadBtn.dataset.interval);
                delete uploadBtn.dataset.interval;
            }
        }
    }

    setSummarizeState(loading) {
        const summarizeBtn = document.getElementById('summarizeBtn');
        const summarizeSpinner = document.getElementById('summarizeSpinner');
        const summarizeIcon = document.getElementById('summarizeIcon');

        summarizeBtn.disabled = loading;

        if (loading) {
            summarizeSpinner.classList.remove('d-none');
            summarizeIcon.classList.add('d-none');
            summarizeBtn.innerHTML = summarizeBtn.innerHTML.replace('Generate Summary', 'Generating...');
        } else {
            summarizeSpinner.classList.add('d-none');
            summarizeIcon.classList.remove('d-none');
            summarizeBtn.innerHTML = summarizeBtn.innerHTML.replace('Generating...', 'Generate Summary');
        }
    }

    setAskState(loading) {
        const askBtn = document.getElementById('askBtn');
        const askSpinner = document.getElementById('askSpinner');
        const askIcon = document.getElementById('askIcon');

        if (loading) {
            askBtn.disabled = true;
            askSpinner.classList.remove('d-none');
            askIcon.classList.add('d-none');
            askBtn.innerHTML = askBtn.innerHTML.replace('Get Answer', 'Finding Answer...');
        } else {
            const questionInput = document.getElementById('questionInput');
            askBtn.disabled = !questionInput.value.trim();
            askSpinner.classList.add('d-none');
            askIcon.classList.remove('d-none');
            askBtn.innerHTML = askBtn.innerHTML.replace('Finding Answer...', 'Get Answer');
        }
    }

    showDocumentStats(stats) {
        document.getElementById('wordCount').textContent = stats.word_count.toLocaleString();
        document.getElementById('charCount').textContent = stats.char_count.toLocaleString();
        document.getElementById('fileName').textContent = stats.filename;
        document.getElementById('documentStats').classList.remove('d-none');
        document.getElementById('documentStats').classList.add('fade-in');
    }

    showMainContent() {
        document.getElementById('mainContent').style.display = 'flex';
        document.getElementById('mainContent').classList.add('fade-in');

        // Enable ask button if there's a question
        const questionInput = document.getElementById('questionInput');
        const askBtn = document.getElementById('askBtn');
        askBtn.disabled = !questionInput.value.trim();
    }

    showSummary(summary, stats) {
        document.getElementById('summaryText').textContent = summary;
        document.getElementById('originalWords').textContent = stats.original_words.toLocaleString();
        document.getElementById('summaryWords').textContent = stats.summary_words.toLocaleString();
        document.getElementById('compressionRatio').textContent = stats.compression_ratio + '%';

        document.getElementById('summaryResult').classList.remove('d-none');
        document.getElementById('summaryResult').classList.add('fade-in');
    }

    addQAItem(question, answer) {
        const qaList = document.getElementById('qaList');
        const qaHistoryTitle = document.getElementById('qaHistoryTitle');

        // Show history title if this is the first Q&A
        if (qaList.children.length === 0) {
            qaHistoryTitle.classList.remove('d-none');
        }

        const qaItem = document.createElement('div');
        qaItem.className = 'qa-item fade-in';
        qaItem.innerHTML = `
            <div class="qa-question">
                <i class="bi bi-question-circle-fill"></i>
                ${this.escapeHtml(question)}
            </div>
            <div class="qa-answer">
                <i class="bi bi-chat-square-text-fill"></i>
                ${this.escapeHtml(answer)}
            </div>
        `;

        qaList.insertBefore(qaItem, qaList.firstChild);

        // Limit to 5 Q&A items
        if (qaList.children.length > 5) {
            qaList.removeChild(qaList.lastChild);
        }
    }

    showError(message) {
        const errorAlert = document.getElementById('errorAlert');
        const errorMessage = document.getElementById('errorMessage');

        errorMessage.textContent = message;
        errorAlert.classList.remove('d-none');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        document.getElementById('errorAlert').classList.add('d-none');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DocumentAnalyzer();
});
