// Text Tool for creating custom text tattoos
class TextTool {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.textInput = null;
        this.fontFamily = null;
        this.fontSize = null;
        this.fontSizeValue = null;
        this.addTextBtn = null;
        
        this.currentSettings = {
            text: '',
            fontFamily: 'Inter',
            fontSize: 24,
            color: '#000000',
            bold: false,
            italic: false,
            underline: false,
            textAlign: 'center',
            letterSpacing: 0,
            lineHeight: 1.2
        };
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.updateFontSizeDisplay();
    }
    
    bindElements() {
        this.textInput = document.getElementById('custom-text');
        this.fontFamily = document.getElementById('font-family');
        this.fontSize = document.getElementById('font-size');
        this.fontSizeValue = document.querySelector('.font-size-value');
        this.addTextBtn = document.getElementById('add-text');
        
        if (!this.textInput || !this.fontFamily || !this.fontSize || !this.addTextBtn) {
            console.warn('Some text tool elements not found');
        }
    }
    
    bindEvents() {
        // Text input changes
        if (this.textInput) {
            this.textInput.addEventListener('input', (event) => {
                this.currentSettings.text = event.target.value;
            });
            
            // Enter key adds text
            this.textInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    this.addText();
                }
            });
        }
        
        // Font family changes
        if (this.fontFamily) {
            this.fontFamily.addEventListener('change', (event) => {
                this.currentSettings.fontFamily = event.target.value;
                this.previewFont();
            });
        }
        
        // Font size changes
        if (this.fontSize) {
            this.fontSize.addEventListener('input', (event) => {
                this.currentSettings.fontSize = parseInt(event.target.value);
                this.updateFontSizeDisplay();
                this.previewFont();
            });
        }
        
        // Add text button
        if (this.addTextBtn) {
            this.addTextBtn.addEventListener('click', () => {
                this.addText();
            });
        }
    }
    
    updateFontSizeDisplay() {
        if (this.fontSizeValue) {
            this.fontSizeValue.textContent = `${this.currentSettings.fontSize}px`;
        }
    }
    
    previewFont() {
        // Update the text input to preview the font
        if (this.textInput) {
            this.textInput.style.fontFamily = this.currentSettings.fontFamily;
            this.textInput.style.fontSize = this.currentSettings.fontSize + 'px';
        }
    }
    
    addText() {
        const text = this.currentSettings.text.trim();
        
        if (!text) {
            Utils.showNotification('Please enter some text first', 'warning');
            return;
        }
        
        // Measure text dimensions
        const dimensions = this.measureText(text);
        
        // Create text element
        const element = {
            type: 'text',
            text: text,
            x: 400, // Center of canvas
            y: 300,
            width: dimensions.width,
            height: dimensions.height,
            scale: 1,
            rotation: 0,
            opacity: 1,
            flipX: false,
            flipY: false,
            fontFamily: this.currentSettings.fontFamily,
            fontSize: this.currentSettings.fontSize,
            color: this.currentSettings.color,
            bold: this.currentSettings.bold,
            italic: this.currentSettings.italic,
            underline: this.currentSettings.underline,
            textAlign: this.currentSettings.textAlign,
            letterSpacing: this.currentSettings.letterSpacing,
            lineHeight: this.currentSettings.lineHeight
        };
        
        // Add to canvas
        this.canvasManager.addElement(element);
        
        // Clear input after adding
        if (this.textInput) {
            this.textInput.value = '';
            this.currentSettings.text = '';
        }
        
        Utils.showNotification('Text added to canvas!');
    }
    
    measureText(text) {
        // Create temporary canvas to measure text
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set font properties
        let fontStyle = '';
        if (this.currentSettings.italic) fontStyle += 'italic ';
        if (this.currentSettings.bold) fontStyle += 'bold ';
        fontStyle += `${this.currentSettings.fontSize}px ${this.currentSettings.fontFamily}`;
        
        ctx.font = fontStyle;
        
        // Measure text
        const metrics = ctx.measureText(text);
        const width = metrics.width;
        const height = this.currentSettings.fontSize * this.currentSettings.lineHeight;
        
        return { width, height };
    }
    
    // Advanced text formatting methods
    setBold(bold) {
        this.currentSettings.bold = bold;
        this.updateSelectedTextElement();
    }
    
    setItalic(italic) {
        this.currentSettings.italic = italic;
        this.updateSelectedTextElement();
    }
    
    setUnderline(underline) {
        this.currentSettings.underline = underline;
        this.updateSelectedTextElement();
    }
    
    setTextAlign(align) {
        this.currentSettings.textAlign = align;
        this.updateSelectedTextElement();
    }
    
    setLetterSpacing(spacing) {
        this.currentSettings.letterSpacing = spacing;
        this.updateSelectedTextElement();
    }
    
    setLineHeight(height) {
        this.currentSettings.lineHeight = height;
        this.updateSelectedTextElement();
    }
    
    setTextColor(color) {
        this.currentSettings.color = color;
        this.updateSelectedTextElement();
    }
    
    updateSelectedTextElement() {
        const selectedElement = this.canvasManager.selectedElement;
        if (selectedElement && selectedElement.type === 'text') {
            // Update the selected text element with new settings
            const updates = {
                fontFamily: this.currentSettings.fontFamily,
                fontSize: this.currentSettings.fontSize,
                color: this.currentSettings.color,
                bold: this.currentSettings.bold,
                italic: this.currentSettings.italic,
                underline: this.currentSettings.underline,
                textAlign: this.currentSettings.textAlign,
                letterSpacing: this.currentSettings.letterSpacing,
                lineHeight: this.currentSettings.lineHeight
            };
            
            // Recalculate dimensions if font properties changed
            const dimensions = this.measureText(selectedElement.text);
            updates.width = dimensions.width;
            updates.height = dimensions.height;
            
            this.canvasManager.updateElement(selectedElement.id, updates);
        }
    }
    
    // Text effects
    applyTextEffect(effectType, options = {}) {
        const selectedElement = this.canvasManager.selectedElement;
        if (!selectedElement || selectedElement.type !== 'text') {
            Utils.showNotification('Please select a text element first', 'warning');
            return;
        }
        
        switch (effectType) {
            case 'shadow':
                this.applyTextShadow(selectedElement, options);
                break;
            case 'outline':
                this.applyTextOutline(selectedElement, options);
                break;
            case 'gradient':
                this.applyTextGradient(selectedElement, options);
                break;
            case 'curve':
                this.applyTextCurve(selectedElement, options);
                break;
        }
    }
    
    applyTextShadow(element, options) {
        const shadow = {
            offsetX: options.offsetX || 2,
            offsetY: options.offsetY || 2,
            blur: options.blur || 4,
            color: options.color || 'rgba(0, 0, 0, 0.5)'
        };
        
        this.canvasManager.updateElement(element.id, { textShadow: shadow });
        Utils.showNotification('Text shadow applied');
    }
    
    applyTextOutline(element, options) {
        const outline = {
            width: options.width || 2,
            color: options.color || '#000000'
        };
        
        this.canvasManager.updateElement(element.id, { textOutline: outline });
        Utils.showNotification('Text outline applied');
    }
    
    applyTextGradient(element, options) {
        const gradient = {
            type: options.type || 'linear',
            colors: options.colors || ['#ff0000', '#00ff00'],
            direction: options.direction || 0
        };
        
        this.canvasManager.updateElement(element.id, { textGradient: gradient });
        Utils.showNotification('Text gradient applied');
    }
    
    applyTextCurve(element, options) {
        const curve = {
            radius: options.radius || 100,
            startAngle: options.startAngle || 0,
            direction: options.direction || 1 // 1 for clockwise, -1 for counter-clockwise
        };
        
        this.canvasManager.updateElement(element.id, { textCurve: curve });
        Utils.showNotification('Text curve applied');
    }
    
    // Preset text styles
    applyPresetStyle(styleName) {
        const presets = {
            'classic': {
                fontFamily: 'Playfair Display',
                fontSize: 32,
                color: '#000000',
                bold: true,
                italic: false
            },
            'modern': {
                fontFamily: 'Inter',
                fontSize: 24,
                color: '#333333',
                bold: false,
                italic: false,
                letterSpacing: 1
            },
            'script': {
                fontFamily: 'Dancing Script',
                fontSize: 36,
                color: '#8b4513',
                bold: false,
                italic: true
            },
            'bold': {
                fontFamily: 'Oswald',
                fontSize: 28,
                color: '#000000',
                bold: true,
                italic: false,
                letterSpacing: 2
            }
        };
        
        const preset = presets[styleName];
        if (!preset) {
            Utils.showNotification(`Unknown preset style: ${styleName}`, 'error');
            return;
        }
        
        // Apply preset to current settings
        Object.assign(this.currentSettings, preset);
        
        // Update UI elements
        this.updateUIFromSettings();
        
        // Apply to selected element if it's text
        this.updateSelectedTextElement();
        
        Utils.showNotification(`Applied ${styleName} text style`);
    }
    
    updateUIFromSettings() {
        if (this.fontFamily) {
            this.fontFamily.value = this.currentSettings.fontFamily;
        }
        
        if (this.fontSize) {
            this.fontSize.value = this.currentSettings.fontSize;
        }
        
        this.updateFontSizeDisplay();
        this.previewFont();
    }
    
    // Text manipulation utilities
    wrapText(text, maxWidth) {
        // Simple text wrapping for multi-line text
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${this.currentSettings.fontSize}px ${this.currentSettings.fontFamily}`;
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }
    
    // Get available fonts
    getAvailableFonts() {
        return [
            { name: 'Inter', category: 'Sans-serif', suitable: ['modern', 'minimalist'] },
            { name: 'Playfair Display', category: 'Serif', suitable: ['classic', 'elegant'] },
            { name: 'Dancing Script', category: 'Script', suitable: ['script', 'decorative'] },
            { name: 'Oswald', category: 'Sans-serif', suitable: ['bold', 'impact'] },
            { name: 'Arial', category: 'Sans-serif', suitable: ['basic', 'readable'] },
            { name: 'Georgia', category: 'Serif', suitable: ['traditional', 'readable'] },
            { name: 'Courier New', category: 'Monospace', suitable: ['typewriter', 'code'] }
        ];
    }
    
    // Font recommendation based on tattoo style
    recommendFont(tattooStyle) {
        const recommendations = {
            'tribal': ['Oswald', 'Inter'],
            'minimalist': ['Inter', 'Arial'],
            'geometric': ['Oswald', 'Inter'],
            'traditional': ['Playfair Display', 'Georgia'],
            'script': ['Dancing Script'],
            'modern': ['Inter', 'Oswald']
        };
        
        return recommendations[tattooStyle] || ['Inter'];
    }
    
    // Validation
    validateText(text) {
        if (!text || text.trim().length === 0) {
            return { valid: false, message: 'Text cannot be empty' };
        }
        
        if (text.length > 500) {
            return { valid: false, message: 'Text is too long (maximum 500 characters)' };
        }
        
        // Check for problematic characters
        const problematicChars = /[^\w\s\-_.,!?'"()]/g;
        if (problematicChars.test(text)) {
            return { valid: false, message: 'Text contains unsupported characters' };
        }
        
        return { valid: true };
    }
    
    // Import/Export text settings
    exportTextSettings() {
        return {
            ...this.currentSettings,
            version: '1.0'
        };
    }
    
    importTextSettings(settings) {
        if (settings.version !== '1.0') {
            Utils.showNotification('Unsupported text settings version', 'error');
            return false;
        }
        
        Object.assign(this.currentSettings, settings);
        this.updateUIFromSettings();
        
        return true;
    }
    
    // Cleanup
    dispose() {
        this.canvasManager = null;
        this.textInput = null;
        this.fontFamily = null;
        this.fontSize = null;
        this.fontSizeValue = null;
        this.addTextBtn = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextTool;
} else {
    window.TextTool = TextTool;
}
