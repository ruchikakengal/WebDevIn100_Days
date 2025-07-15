// ASCII Art Generator with Puter.js and Claude Sonnet 4
// Created by Amaan Syed

class ASCIIArtGenerator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.isGenerating = false;
    }

    initializeElements() {
        this.textInput = document.getElementById('textInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.asciiOutput = document.getElementById('asciiOutput');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.styleOptions = document.querySelectorAll('input[name="style"]');
    }    attachEventListeners() {
        // Add debugging for button click
        this.generateBtn.addEventListener('click', (e) => {
            console.log('Button clicked, event:', e);
            e.preventDefault(); // Prevent any default behavior
            this.generateASCIIArt();
        });
        
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadASCII());
        
        // Enable generation on Enter key
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isGenerating) {
                console.log('Enter key pressed');
                this.generateASCIIArt();
            }
        });

        // Real-time input validation
        this.textInput.addEventListener('input', () => {
            this.validateInput();
        });
        
        // Test notification system
        console.log('Event listeners attached successfully');
    }

    validateInput() {
        const text = this.textInput.value.trim();
        const isValid = text.length > 0 && text.length <= 50;
        
        this.generateBtn.disabled = !isValid || this.isGenerating;
        
        if (text.length > 50) {
            this.textInput.style.borderColor = '#e74c3c';
        } else {
            this.textInput.style.borderColor = '#e1e5e9';
        }
    }

    getSelectedStyle() {
        const selectedStyle = document.querySelector('input[name="style"]:checked').value;
        
        const stylePrompts = {
            detailed: 'very detailed and intricate',
            simple: 'simple and clean',
            block: 'using block characters and geometric shapes',
            artistic: 'artistic and creative with decorative elements'
        };
        
        return stylePrompts[selectedStyle] || stylePrompts.detailed;
    }    async generateASCIIArt() {
        console.log('Generate button clicked!'); // Debug log
        
        const text = this.textInput.value.trim();
        console.log('Input text:', text); // Debug log
        
        if (!text) {
            this.showNotification('Please enter some text first!', 'error');
            return;
        }

        if (text.length > 50) {
            this.showNotification('Text must be 50 characters or less!', 'error');
            return;
        }

        this.setGeneratingState(true);
        
        try {
            // Check if puter is available
            if (typeof puter === 'undefined') {
                throw new Error('Puter.js library is not loaded. Please check your internet connection.');
            }
            
            const styleDescription = this.getSelectedStyle();
            const prompt = `Create ASCII art of the text "${text}" that is ${styleDescription}. Make it visually appealing and readable. Only return the ASCII art, no additional text or explanations.`;
            
            console.log('Sending prompt to AI:', prompt); // Debug log
            
            // Clear previous output
            this.asciiOutput.textContent = '';
            
            // Use Puter.js to call Claude Sonnet 4
            const chatResponse = await puter.ai.chat(prompt, {
                model: 'claude-sonnet-4',
                stream: true
            });
            
            let fullResponse = '';
            
            for await (const part of chatResponse) {
                if (part?.text) {
                    fullResponse += part.text;
                    // Update output in real-time
                    this.asciiOutput.textContent = fullResponse;
                    // Auto-scroll to bottom
                    this.asciiOutput.scrollTop = this.asciiOutput.scrollHeight;
                }
            }
            
            if (fullResponse.trim()) {
                this.enableActions();
                this.showNotification('ASCII art generated successfully!', 'success');
            } else {
                throw new Error('No response received from AI');
            }
              } catch (error) {
            console.error('Error generating ASCII art:', error);
            
            let errorMessage = error.message;
            if (error.message.includes('puter')) {
                errorMessage = 'AI service unavailable. Using fallback generation...';
                
                // Use fallback generation
                try {
                    const fallbackResult = this.generateFallbackASCII(text);
                    this.asciiOutput.textContent = `${fallbackResult}

(Generated using fallback method - AI service was unavailable)`;
                    this.enableActions();
                    this.showNotification('ASCII art generated using fallback method!', 'warning');
                    return;
                } catch (fallbackError) {
                    console.error('Fallback generation failed:', fallbackError);
                }
            }
            
            this.asciiOutput.textContent = `Error generating ASCII art: ${errorMessage}

Please try again with different text or check your internet connection.

Debug info: ${error.stack || error.toString()}`;
            this.showNotification(`Failed to generate ASCII art: ${errorMessage}`, 'error');
        } finally {
            this.setGeneratingState(false);
        }
    }

    // Fallback ASCII art generation using simple patterns
    generateFallbackASCII(text) {
        const patterns = {
            simple: (char) => {
                const map = {
                    'A': ['  ▄▄  ', ' ▄▀▀▄ ', '▄▀  ▀▄', '▀▀▀▀▀▀'],
                    'B': ['▄▄▄▄  ', '▄▀  ▀▄', '▄▄▄▄▀ ', '▀▀▀▀▀▀'],
                    'C': [' ▄▄▄▄ ', '▄▀    ', '▄▀    ', ' ▀▀▀▀ '],
                    'D': ['▄▄▄▄  ', '▄▀  ▀▄', '▄▀  ▀▄', '▀▀▀▀▀▀'],
                    'E': ['▄▄▄▄▄▄', '▄▀    ', '▄▄▄▄  ', '▀▀▀▀▀▀'],
                    'F': ['▄▄▄▄▄▄', '▄▀    ', '▄▄▄▄  ', '▀▀    '],
                    'G': [' ▄▄▄▄ ', '▄▀    ', '▄▀ ▀▀▄', ' ▀▀▀▀ '],
                    'H': ['▄▀  ▀▄', '▄▀  ▀▄', '▄▄▄▄▄▄', '▀▀  ▀▀'],
                    'I': ['▄▄▄▄▄▄', '  ▄▀  ', '  ▄▀  ', '▀▀▀▀▀▀'],
                    'J': ['▄▄▄▄▄▄', '    ▄▀', '▄▀  ▄▀', ' ▀▀▀▀ '],
                    'K': ['▄▀  ▀▄', '▄▀▄▀  ', '▄▀ ▀▄ ', '▀▀  ▀▀'],
                    'L': ['▄▀    ', '▄▀    ', '▄▀    ', '▀▀▀▀▀▀'],
                    'M': ['▄▀▄▀▄▀', '▄▀▄▀▄▀', '▄▀ ▀ ▀', '▀▀   ▀'],
                    'N': ['▄▀▄ ▀▄', '▄▀▄▀▄▀', '▄▀ ▄▀▄', '▀▀  ▀▀'],
                    'O': [' ▄▄▄▄ ', '▄▀  ▀▄', '▄▀  ▀▄', ' ▀▀▀▀ '],
                    'P': ['▄▄▄▄▄ ', '▄▀  ▀▄', '▄▄▄▄▀ ', '▀▀    '],
                    'Q': [' ▄▄▄▄ ', '▄▀  ▀▄', '▄▀ ▄▀▄', ' ▀▀▀▀▄'],
                    'R': ['▄▄▄▄▄ ', '▄▀  ▀▄', '▄▄▄▄▀ ', '▀▀ ▀▀ '],
                    'S': [' ▄▄▄▄▄', '▄▀    ', ' ▀▀▀▄▀', '▀▀▀▀▀ '],
                    'T': ['▄▄▄▄▄▄', '  ▄▀  ', '  ▄▀  ', '  ▀▀  '],
                    'U': ['▄▀  ▀▄', '▄▀  ▀▄', '▄▀  ▀▄', ' ▀▀▀▀ '],
                    'V': ['▄▀  ▀▄', '▄▀  ▀▄', ' ▄▀▀▄ ', '  ▀▀  '],
                    'W': ['▄▀   ▀', '▄▀ ▀ ▀', '▄▀▄▀▄▀', ' ▀ ▀ ▀'],
                    'X': ['▄▀  ▀▄', ' ▄▀▀▄ ', ' ▄▀▀▄ ', '▀▀  ▀▀'],
                    'Y': ['▄▀  ▀▄', ' ▄▀▀▄ ', '  ▄▀  ', '  ▀▀  '],
                    'Z': ['▄▄▄▄▄▄', '   ▄▀ ', ' ▄▀   ', '▀▀▀▀▀▀'],
                    ' ': ['      ', '      ', '      ', '      ']
                };
                return map[char] || map[' '];
            }
        };

        const chars = text.toUpperCase().split('');
        const lines = ['', '', '', ''];
        
        chars.forEach(char => {
            const pattern = patterns.simple(char);
            for (let i = 0; i < 4; i++) {
                lines[i] += pattern[i] + ' ';
            }
        });
        
        return lines.join('\n');
    }

    // Test function to verify everything is working
    testGeneration() {
        console.log('Testing fallback ASCII generation...');
        const testText = 'TEST';
        const result = this.generateFallbackASCII(testText);
        console.log('Fallback result:', result);
        this.asciiOutput.textContent = `Testing fallback generation:\n\n${result}`;
        this.showNotification('Fallback ASCII generation test completed!', 'info');
    }

    setGeneratingState(isGenerating) {
        this.isGenerating = isGenerating;
        this.generateBtn.disabled = isGenerating;
        this.loadingSpinner.style.display = isGenerating ? 'block' : 'none';
        
        if (isGenerating) {
            this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            this.disableActions();
        } else {
            this.generateBtn.innerHTML = '<i class="fas fa-sparkles"></i> Generate ASCII Art';
            this.validateInput();
        }
    }

    enableActions() {
        this.copyBtn.disabled = false;
        this.downloadBtn.disabled = false;
    }

    disableActions() {
        this.copyBtn.disabled = true;
        this.downloadBtn.disabled = true;
    }

    async copyToClipboard() {
        const text = this.asciiOutput.textContent;
        
        if (!text || text.includes('Error generating')) {
            this.showNotification('No valid ASCII art to copy!', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('ASCII art copied to clipboard!', 'success');
            
            // Visual feedback
            const originalIcon = this.copyBtn.querySelector('i').className;
            this.copyBtn.querySelector('i').className = 'fas fa-check';
            this.copyBtn.style.background = '#28a745';
            this.copyBtn.style.color = 'white';
            
            setTimeout(() => {
                this.copyBtn.querySelector('i').className = originalIcon;
                this.copyBtn.style.background = '';
                this.copyBtn.style.color = '';
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }

    downloadASCII() {
        const text = this.asciiOutput.textContent;
        
        if (!text || text.includes('Error generating')) {
            this.showNotification('No valid ASCII art to download!', 'error');
            return;
        }
        
        try {
            const inputText = this.textInput.value.trim();
            const filename = `ascii-art-${inputText.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.txt`;
            
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('ASCII art downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to download:', error);
            this.showNotification('Failed to download ASCII art', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: linear-gradient(135deg, #28a745, #20c997);
    }
    
    .notification-error {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
    }
    
    .notification-info {
        background: linear-gradient(135deg, #667eea, #764ba2);
    }
    
    .notification-warning {
        background: linear-gradient(135deg, #ffc107, #ff8c00);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 5px;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    @media (max-width: 480px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the ASCII Art Generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    try {
        const generator = new ASCIIArtGenerator();
        console.log('Generator initialized successfully');
        
        // Add a temporary test button for debugging
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Test Fallback';
        testBtn.style.margin = '10px';
        testBtn.style.padding = '10px 20px';
        testBtn.style.background = '#ffc107';
        testBtn.style.border = 'none';
        testBtn.style.borderRadius = '5px';
        testBtn.style.cursor = 'pointer';
        testBtn.onclick = () => generator.testGeneration();
        
        // Insert test button after generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn && generateBtn.parentNode) {
            generateBtn.parentNode.insertBefore(testBtn, generateBtn.nextSibling);
        }
        
        // Test if elements are found
        const elements = ['textInput', 'generateBtn', 'copyBtn', 'downloadBtn', 'asciiOutput'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`Element ${id}:`, element ? 'Found' : 'NOT FOUND');
        });
        
        // Test puter availability
        setTimeout(() => {
            if (typeof puter !== 'undefined') {
                console.log('✅ Puter.js is available');
                generator.showNotification('Puter.js loaded successfully!', 'success');
            } else {
                console.log('❌ Puter.js is not available');
                generator.showNotification('Puter.js not loaded. Fallback mode available.', 'warning');
            }
        }, 2000);
        
    } catch (error) {
        console.error('Failed to initialize generator:', error);
    }
    
    // Add some welcome animations
    setTimeout(() => {
        const elements = document.querySelectorAll('.header, .input-card, .output-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        });
    }, 100);
    
    console.log('🎨 ASCII Art Generator initialized by Amaan Syed');
    console.log('✨ Powered by Puter.js and Claude Sonnet 4');
});
