// Enhanced Chat Manager with Code Management and New Features
class ChatManager {
    constructor() {
        this.conversations = this.loadConversations() || [];
        this.currentConversationId = null;
        this.isGenerating = false;
        this.currentCode = null;
        
        this.initEventListeners();
        this.loadDeploymentHistory();
        
        if (this.conversations.length === 0) {
            this.createNewConversation();
        } else {
            this.currentConversationId = this.conversations[0].id;
            this.updateChatHistory();
            this.displayMessages();
        }
    }
    
    initEventListeners() {
        // Send button
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        // Enter key in input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Auto-resize textarea
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
            });
        }
        
        // Close modal when clicking outside
        const chatModal = document.getElementById('chat-modal');
        if (chatModal) {
            chatModal.addEventListener('click', (e) => {
                if (e.target === chatModal) {
                    closeChat();
                }
            });
        }

        // Preview size controls
        const previewSizeBtns = document.querySelectorAll('.preview-size-btn');
        previewSizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                if (window.previewManager) {
                    window.previewManager.changePreviewSize(size);
                }
                
                // Update active button
                previewSizeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    createNewConversation() {
        const conversation = {
            id: Date.now(),
            title: 'New Website Project',
            messages: [],
            createdAt: new Date()
        };
        
        this.conversations.unshift(conversation);
        this.currentConversationId = conversation.id;
        this.saveConversations();
        this.updateChatHistory();
        this.clearChatMessages();
        
        showToast('New conversation created', 'success');
    }
    
    loadConversations() {
        try {
            const stored = localStorage.getItem('ai_website_conversations');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading conversations:', error);
            return [];
        }
    }
    
    saveConversations() {
        try {
            localStorage.setItem('ai_website_conversations', JSON.stringify(this.conversations));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }

    loadDeploymentHistory() {
        try {
            const stored = localStorage.getItem('ai_website_deployments');
            const deployments = stored ? JSON.parse(stored) : [];
            this.updateDeploymentHistory(deployments);
        } catch (error) {
            console.error('Error loading deployment history:', error);
        }
    }

    updateDeploymentHistory(deployments) {
        const deploymentList = document.getElementById('deployment-history-list');
        if (!deploymentList) return;

        deploymentList.innerHTML = '';

        if (deployments.length === 0) {
            deploymentList.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.8rem; text-align: center; padding: 20px;">No deployments yet</p>';
            return;
        }

        deployments.slice(0, 5).forEach(deployment => {
            const deploymentItem = document.createElement('div');
            deploymentItem.className = 'deployment-item';
            deploymentItem.innerHTML = `
                <div class="deployment-item-header">
                    <span class="deployment-name">${escapeHtml(deployment.name)}</span>
                    <span class="deployment-status ${deployment.status}">${deployment.status}</span>
                </div>
                <div class="deployment-meta">
                    <small>${deployment.service} • ${formatDate(deployment.createdAt)}</small>
                </div>
                ${deployment.url ? `<div class="deployment-url"><small><a href="${deployment.url}" target="_blank">${deployment.url}</a></small></div>` : ''}
            `;
            deploymentList.appendChild(deploymentItem);
        });
    }
    
    updateChatHistory() {
        const historyContainer = document.getElementById('chat-history');
        if (!historyContainer) return;
        
        historyContainer.innerHTML = '';
        
        this.conversations.forEach(conversation => {
            const historyItem = document.createElement('div');
            historyItem.className = `chat-history-item ${conversation.id === this.currentConversationId ? 'active' : ''}`;
            historyItem.innerHTML = `
                <div class="history-title">${escapeHtml(conversation.title)}</div>
                <div class="history-date">${formatDate(conversation.createdAt)}</div>
                <div class="history-actions">
                    <button class="btn-small" onclick="chatManager.deleteConversation(${conversation.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            historyItem.addEventListener('click', (e) => {
                // Don't switch conversation if delete button was clicked
                if (!e.target.closest('.history-actions')) {
                    this.switchConversation(conversation.id);
                }
            });
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    switchConversation(conversationId) {
        this.currentConversationId = conversationId;
        this.updateChatHistory();
        this.displayMessages();
    }

    deleteConversation(conversationId) {
        if (confirm('Are you sure you want to delete this conversation?')) {
            this.conversations = this.conversations.filter(conv => conv.id !== conversationId);
            
            // If we deleted the current conversation, switch to the first one or create new
            if (this.currentConversationId === conversationId) {
                if (this.conversations.length > 0) {
                    this.currentConversationId = this.conversations[0].id;
                    this.displayMessages();
                } else {
                    this.createNewConversation();
                }
            }
            
            this.saveConversations();
            this.updateChatHistory();
            showToast('Conversation deleted', 'success');
        }
    }

    clearAllHistory() {
        if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
            this.conversations = [];
            this.currentConversationId = null;
            this.saveConversations();
            this.createNewConversation();
            showToast('All chat history cleared', 'success');
        }
    }
    
    clearChatMessages() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        // Keep welcome message for new conversations
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        messagesContainer.innerHTML = '';
        if (welcomeMessage) {
            messagesContainer.appendChild(welcomeMessage);
        }
    }

    usePrompt(promptText) {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.value = promptText;
            chatInput.focus();
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + 'px';
        }
        
        // Open chat if not already open
        const chatModal = document.getElementById('chat-modal');
        if (chatModal && chatModal.style.display !== 'block') {
            openChat();
        }
    }
    
    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message || this.isGenerating) return;
        
        // Clear input and reset height
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Add user message
        this.addMessage('user', message);
        
        // Generate title for new conversations
        const currentConversation = this.getCurrentConversation();
        if (currentConversation && currentConversation.messages.length === 1) {
            currentConversation.title = this.generateTitle(message);
            this.updateChatHistory();
            this.saveConversations();
        }
        
        // Show loading
        this.showLoading(true);
        this.isGenerating = true;
        
        try {
            // Use Gemini service to generate response
            const response = await window.geminiService.generateWebsiteCode(message);
            
            // Store current code for actions
            this.currentCode = response;
            
            // Add AI response with code - Always treat Gemini responses as code
            this.addMessage('ai', response, true);
            
            // Update title if it's still default
            if (currentConversation && currentConversation.title === 'New Website Project') {
                currentConversation.title = this.generateTitle(message);
                this.updateChatHistory();
            }
            
        } catch (error) {
            console.error('Error generating response:', error);
            let errorMessage = 'Sorry, I encountered an error while generating your website. ';
            
            if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
                errorMessage += 'There seems to be an issue with the API key. Please try again or contact support.';
            } else if (error.message.includes('QUOTA_EXCEEDED') || error.message.includes('429')) {
                errorMessage += 'API quota exceeded. Please try again in a few minutes.';
            } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
                errorMessage += 'Network connection issue. Please check your internet and try again.';
            } else {
                errorMessage += 'Please refresh the page and try again.';
            }
            
            this.addMessage('ai', errorMessage, false);
        } finally {
            this.showLoading(false);
            this.isGenerating = false;
            this.saveConversations();
            this.scrollToBottom();
        }
    }
    
    addMessage(sender, content, isCode = false) {
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        const message = {
            id: Date.now() + Math.random(),
            sender,
            content,
            isCode,
            timestamp: new Date()
        };
        
        conversation.messages.push(message);
        this.saveConversations();
        this.displayMessage(message);
        this.scrollToBottom();
    }
    
    displayMessages() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        // Clear existing messages except welcome message
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        messagesContainer.innerHTML = '';
        if (welcomeMessage && conversation.messages.length === 0) {
            messagesContainer.appendChild(welcomeMessage);
        }
        
        conversation.messages.forEach(message => {
            this.displayMessage(message);
        });
        
        this.scrollToBottom();
    }
    
    displayMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}-message`;
        
        if (message.sender === 'user') {
            messageDiv.innerHTML = `
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${escapeHtml(message.content)}</div>
                    <div class="message-time">${formatDate(message.timestamp)}</div>
                </div>
            `;
        } else {
            if (message.isCode) {
                messageDiv.innerHTML = `
                    <div class="ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        ${this.createCodeResponse(message.content)}
                        <div class="message-time">${formatDate(message.timestamp)}</div>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">${escapeHtml(message.content)}</div>
                        <div class="message-time">${formatDate(message.timestamp)}</div>
                    </div>
                `;
            }
        }
        
        messagesContainer.appendChild(messageDiv);
    }
    
    createCodeResponse(code) {
        const codeId = 'code-' + Date.now();
        return `
            <div class="code-response">
                <div class="code-response-header">
                    <div class="code-response-title">
                        <i class="fas fa-code"></i>
                        Generated Website Code
                    </div>
                    <div class="code-response-actions">
                        <button class="btn-icon" onclick="chatManager.copyCode('${codeId}')" title="Copy Code">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon" onclick="chatManager.previewCode('${codeId}')" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="chatManager.explainCode('${codeId}')" title="Explain Code">
                            <i class="fas fa-graduation-cap"></i>
                        </button>
                        <button class="btn-icon" onclick="chatManager.deployCode('${codeId}')" title="Deploy">
                            <i class="fas fa-rocket"></i>
                        </button>
                        <button class="btn-icon" onclick="chatManager.downloadCode('${codeId}')" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                <div class="code-response-preview">
                    <pre class="code-response-code" id="${codeId}">${escapeHtml(code)}</pre>
                </div>
            </div>
        `;
    }
    
    copyCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        copyToClipboard(code);
    }
    
    previewCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        if (window.previewManager) {
            window.previewManager.openPreview(code);
        }
    }
    
    explainCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        if (window.explanationService) {
            window.explanationService.openExplanation(code);
        }
    }
    
    deployCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        if (window.deploymentService) {
            window.deploymentService.openDeployment(code);
        }
    }
    
    downloadCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        if (window.fileManager) {
            window.fileManager.downloadFile(code, 'website.html', 'text/html');
        }
    }
    
    getCurrentConversation() {
        return this.conversations.find(conv => conv.id === this.currentConversationId);
    }
    
    generateTitle(message) {
        // Generate a meaningful title from the first message
        const words = message.split(' ').slice(0, 6);
        let title = words.join(' ');
        if (message.length > 30) {
            title += '...';
        }
        return title || 'New Website Project';
    }
    
    showLoading(show) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const existingLoader = messagesContainer.querySelector('.loading-message');
        
        if (show) {
            if (!existingLoader) {
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'message ai-message loading-message';
                loadingDiv.innerHTML = `
                    <div class="ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">
                            <i class="fas fa-spinner fa-spin"></i>
                            AI is generating your website...
                        </div>
                    </div>
                `;
                messagesContainer.appendChild(loadingDiv);
                this.scrollToBottom();
            }
        } else {
            if (existingLoader) {
                existingLoader.remove();
            }
        }
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Export conversation to JSON
    exportConversation(conversationId) {
        const conversation = this.conversations.find(conv => conv.id === conversationId);
        if (!conversation) return;

        const exportData = {
            title: conversation.title,
            messages: conversation.messages,
            createdAt: conversation.createdAt,
            exportedAt: new Date()
        };

        if (window.fileManager) {
            window.fileManager.downloadFile(
                JSON.stringify(exportData, null, 2),
                `conversation-${conversation.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`,
                'application/json'
            );
        }
    }

    // Import conversation from JSON
    importConversation(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                const conversation = {
                    id: Date.now(),
                    title: importData.title || 'Imported Conversation',
                    messages: importData.messages || [],
                    createdAt: new Date(importData.createdAt) || new Date()
                };

                this.conversations.unshift(conversation);
                this.saveConversations();
                this.updateChatHistory();
                showToast('Conversation imported successfully', 'success');
            } catch (error) {
                console.error('Error importing conversation:', error);
                showToast('Error importing conversation', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatManager;
}
