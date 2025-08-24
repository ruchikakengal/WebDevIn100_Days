// Color Picker Manager for tattoo and text color customization
class ColorPicker {
    constructor() {
        this.currentColor = '#000000';
        this.colorHistory = [];
        this.maxHistory = 10;
        this.colorPicker = null;
        this.colorPresets = null;
        
        // Predefined color palettes
        this.palettes = {
            tattoo: [
                '#000000', // Black
                '#8B4513', // Saddle Brown
                '#2F4F4F', // Dark Slate Gray
                '#800080', // Purple
                '#8B0000', // Dark Red
                '#006400', // Dark Green
                '#000080', // Navy Blue
                '#FF8C00'  // Dark Orange
            ],
            vibrant: [
                '#FF0000', // Red
                '#00FF00', // Green
                '#0000FF', // Blue
                '#FFFF00', // Yellow
                '#FF00FF', // Magenta
                '#00FFFF', // Cyan
                '#FF8000', // Orange
                '#8000FF'  // Purple
            ],
            pastel: [
                '#FFB6C1', // Light Pink
                '#98FB98', // Pale Green
                '#87CEEB', // Sky Blue
                '#DDA0DD', // Plum
                '#F0E68C', // Khaki
                '#FFE4B5', // Moccasin
                '#D3D3D3', // Light Gray
                '#FFEFD5'  // Papaya Whip
            ],
            grayscale: [
                '#000000', // Black
                '#2F2F2F', // Dark Gray
                '#5F5F5F', // Medium Dark Gray
                '#808080', // Gray
                '#A0A0A0', // Light Gray
                '#C0C0C0', // Silver
                '#E0E0E0', // Light Silver
                '#FFFFFF'  // White
            ]
        };
        
        this.currentPalette = 'tattoo';
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.loadColorHistory();
        this.updateColorPresets();
    }
    
    bindElements() {
        this.colorPicker = document.getElementById('element-color');
        this.colorPresets = document.getElementById('color-presets');
        
        if (!this.colorPicker || !this.colorPresets) {
            console.warn('Color picker elements not found');
        }
    }
    
    bindEvents() {
        // Main color picker change
        if (this.colorPicker) {
            this.colorPicker.addEventListener('change', (event) => {
                this.setColor(event.target.value);
            });
            
            this.colorPicker.addEventListener('input', (event) => {
                this.previewColor(event.target.value);
            });
        }
        
        // Color preset clicks
        if (this.colorPresets) {
            this.colorPresets.addEventListener('click', (event) => {
                if (event.target.classList.contains('color-preset')) {
                    const color = event.target.dataset.color;
                    this.setColor(color);
                }
            });
        }
        
        // Keyboard shortcuts for quick color access
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        this.setColor('#000000'); // Black
                        break;
                    case '2':
                        event.preventDefault();
                        this.setColor('#FFFFFF'); // White
                        break;
                    case '3':
                        event.preventDefault();
                        this.setColor('#FF0000'); // Red
                        break;
                }
            }
        });
    }
    
    setColor(color) {
        this.currentColor = color;
        this.addToHistory(color);
        this.updateColorPicker(color);
        this.updateSelectedElement(color);
        this.updatePresetSelection(color);
        
        // Dispatch color change event
        this.dispatchColorChange(color);
    }
    
    previewColor(color) {
        // Show real-time preview without committing the change
        this.updateSelectedElement(color, true);
    }
    
    updateColorPicker(color) {
        if (this.colorPicker) {
            this.colorPicker.value = color;
        }
    }
    
    updateSelectedElement(color, preview = false) {
        // Update the selected element's color
        if (window.canvasManager && window.canvasManager.selectedElement) {
            const element = window.canvasManager.selectedElement;
            
            if (preview) {
                // Temporary preview - don't save state
                window.canvasManager.updateElement(element.id, { color }, false);
            } else {
                // Permanent change
                window.canvasManager.updateElement(element.id, { color });
            }
        }
    }
    
    updatePresetSelection(color) {
        if (!this.colorPresets) return;
        
        // Remove active class from all presets
        this.colorPresets.querySelectorAll('.color-preset').forEach(preset => {
            preset.classList.remove('active');
        });
        
        // Add active class to matching preset
        const matchingPreset = this.colorPresets.querySelector(`[data-color="${color}"]`);
        if (matchingPreset) {
            matchingPreset.classList.add('active');
        }
    }
    
    dispatchColorChange(color) {
        const event = new CustomEvent('colorChanged', {
            detail: { color, picker: this }
        });
        document.dispatchEvent(event);
    }
    
    // Color history management
    addToHistory(color) {
        // Remove if already exists
        const existingIndex = this.colorHistory.indexOf(color);
        if (existingIndex > -1) {
            this.colorHistory.splice(existingIndex, 1);
        }
        
        // Add to beginning
        this.colorHistory.unshift(color);
        
        // Limit history size
        if (this.colorHistory.length > this.maxHistory) {
            this.colorHistory = this.colorHistory.slice(0, this.maxHistory);
        }
        
        this.saveColorHistory();
    }
    
    saveColorHistory() {
        Utils.localStorage.set('color_history', this.colorHistory);
    }
    
    loadColorHistory() {
        this.colorHistory = Utils.localStorage.get('color_history', []);
    }
    
    // Color palette management
    setPalette(paletteName) {
        if (!this.palettes[paletteName]) {
            console.warn(`Palette ${paletteName} not found`);
            return;
        }
        
        this.currentPalette = paletteName;
        this.updateColorPresets();
        
        Utils.showNotification(`Switched to ${paletteName} palette`);
    }
    
    updateColorPresets() {
        if (!this.colorPresets) return;
        
        // Clear existing presets
        this.colorPresets.innerHTML = '';
        
        // Add current palette colors
        const paletteColors = this.palettes[this.currentPalette] || this.palettes.tattoo;
        
        paletteColors.forEach(color => {
            const preset = document.createElement('div');
            preset.className = 'color-preset';
            preset.dataset.color = color;
            preset.style.backgroundColor = color;
            preset.title = this.getColorName(color);
            
            this.colorPresets.appendChild(preset);
        });
        
        // Add recent colors if we have history
        if (this.colorHistory.length > 0) {
            const separator = document.createElement('div');
            separator.className = 'preset-separator';
            this.colorPresets.appendChild(separator);
            
            // Add up to 4 recent colors
            this.colorHistory.slice(0, 4).forEach(color => {
                if (!paletteColors.includes(color)) {
                    const preset = document.createElement('div');
                    preset.className = 'color-preset recent';
                    preset.dataset.color = color;
                    preset.style.backgroundColor = color;
                    preset.title = `Recent: ${this.getColorName(color)}`;
                    
                    this.colorPresets.appendChild(preset);
                }
            });
        }
    }
    
    // Color utility functions
    getColorName(hex) {
        const colorNames = {
            '#000000': 'Black',
            '#FFFFFF': 'White',
            '#FF0000': 'Red',
            '#00FF00': 'Green',
            '#0000FF': 'Blue',
            '#FFFF00': 'Yellow',
            '#FF00FF': 'Magenta',
            '#00FFFF': 'Cyan',
            '#8B4513': 'Saddle Brown',
            '#2F4F4F': 'Dark Slate Gray',
            '#800080': 'Purple',
            '#8B0000': 'Dark Red',
            '#006400': 'Dark Green',
            '#000080': 'Navy Blue',
            '#FF8C00': 'Dark Orange'
        };
        
        return colorNames[hex.toUpperCase()] || hex;
    }
    
    hexToRgb(hex) {
        return Utils.hexToRgb(hex);
    }
    
    rgbToHex(r, g, b) {
        return Utils.rgbToHex(r, g, b);
    }
    
    // Color harmony generation
    generateHarmony(baseColor, harmonyType = 'complementary') {
        const rgb = this.hexToRgb(baseColor);
        if (!rgb) return [baseColor];
        
        const hsl = Utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colors = [baseColor];
        
        switch (harmonyType) {
            case 'complementary':
                colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                break;
                
            case 'triadic':
                colors.push(this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
                break;
                
            case 'analogous':
                colors.push(this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
                break;
                
            case 'split-complementary':
                colors.push(this.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
                break;
                
            case 'tetradic':
                colors.push(this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
                break;
        }
        
        return colors;
    }
    
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
        return this.rgbToHex(r, g, b);
    }
    
    // Advanced color operations
    adjustBrightness(color, amount) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        const adjust = (value) => Math.max(0, Math.min(255, value + amount));
        
        return this.rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
    }
    
    adjustSaturation(color, amount) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        const hsl = Utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const newSaturation = Math.max(0, Math.min(100, hsl.s + amount));
        
        return this.hslToHex(hsl.h, newSaturation, hsl.l);
    }
    
    // Color accessibility
    getContrastRatio(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 1;
        
        const luminance1 = this.getLuminance(rgb1);
        const luminance2 = this.getLuminance(rgb2);
        
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    getLuminance(rgb) {
        const normalize = (value) => {
            const normalized = value / 255;
            return normalized <= 0.03928 
                ? normalized / 12.92 
                : Math.pow((normalized + 0.055) / 1.055, 2.4);
        };
        
        const r = normalize(rgb.r);
        const g = normalize(rgb.g);
        const b = normalize(rgb.b);
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    
    isAccessible(color, backgroundColor, level = 'AA') {
        const ratio = this.getContrastRatio(color, backgroundColor);
        
        switch (level) {
            case 'AAA': return ratio >= 7;
            case 'AA': return ratio >= 4.5;
            case 'AA-Large': return ratio >= 3;
            default: return ratio >= 4.5;
        }
    }
    
    // Custom color picker dialog
    showAdvancedPicker() {
        // This would open an advanced color picker with HSL/RGB controls
        // For now, just focus the main color picker
        if (this.colorPicker) {
            this.colorPicker.click();
        }
    }
    
    // Eyedropper tool (if supported)
    async useEyeDropper() {
        if (!window.EyeDropper) {
            Utils.showNotification('Eyedropper not supported in this browser', 'warning');
            return;
        }
        
        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            this.setColor(result.sRGBHex);
            Utils.showNotification('Color picked successfully!');
        } catch (error) {
            if (error.name !== 'AbortError') {
                Utils.showNotification('Failed to pick color', 'error');
            }
        }
    }
    
    // Export/Import color settings
    exportColors() {
        return {
            currentColor: this.currentColor,
            colorHistory: this.colorHistory,
            currentPalette: this.currentPalette,
            customPalettes: this.customPalettes || {},
            version: '1.0'
        };
    }
    
    importColors(colorData) {
        if (colorData.version !== '1.0') {
            Utils.showNotification('Unsupported color data version', 'error');
            return false;
        }
        
        if (colorData.currentColor) {
            this.setColor(colorData.currentColor);
        }
        
        if (colorData.colorHistory) {
            this.colorHistory = colorData.colorHistory;
            this.saveColorHistory();
        }
        
        if (colorData.currentPalette) {
            this.setPalette(colorData.currentPalette);
        }
        
        this.updateColorPresets();
        return true;
    }
    
    // Cleanup
    dispose() {
        this.colorPicker = null;
        this.colorPresets = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorPicker;
} else {
    window.ColorPicker = ColorPicker;
}
