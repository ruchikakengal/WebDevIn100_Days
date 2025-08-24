// Main Application Controller
class TattooApp {
    constructor() {
        this.canvasManager = null;
        this.tattooLibrary = null;
        this.textTool = null;
        this.bodyTemplates = null;
        this.colorPicker = null;
        this.storageManager = null;
        this.currentTheme = 'light';
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            this.showLoading(true);
            
            // Initialize storage manager first
            this.storageManager = new StorageManager();
            
            // Load user settings
            const settings = this.storageManager.getSettings();
            this.applySettings(settings);
            
            // Initialize core components
            await this.initializeComponents();
            
            // Bind global events
            this.bindEvents();
            
            // Setup drag and drop for canvas
            this.setupCanvasDragDrop();
            
            // Load auto-saved work if available
            this.loadAutoSave();
            
            this.isInitialized = true;
            this.showLoading(false);
            
            Utils.showNotification('Tattoo Design Studio loaded successfully!');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }
    
    async initializeComponents() {
        // Initialize canvas manager
        const canvas = document.getElementById('main-canvas');
        if (!canvas) throw new Error('Canvas element not found');
        
        this.canvasManager = new CanvasManager(canvas);
        
        // Initialize tattoo library
        this.tattooLibrary = new TattooLibrary();
        
        // Initialize text tool
        this.textTool = new TextTool(this.canvasManager);
        
        // Initialize drawing tool
        this.drawingTool = new DrawingTool(this.canvasManager);
        
        // Initialize body templates
        this.bodyTemplates = new BodyTemplates(this.canvasManager);
        
        // Initialize color picker
        this.colorPicker = new ColorPicker();
        
        // Wait for components to be ready
        await this.waitForComponents();
    }
    
    async waitForComponents() {
        // Wait a bit for all components to initialize
        return new Promise(resolve => setTimeout(resolve, 100));
    }
    
    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        
        // Save and export buttons
        const saveBtn = document.getElementById('save-design');
        const exportBtn = document.getElementById('export-design');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', this.saveCurrentDesign.bind(this));
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', this.exportDesign.bind(this));
        }
        
        // Canvas toolbar buttons
        this.bindToolbarEvents();
        
        // Properties panel events
        this.bindPropertiesEvents();
        
        // Canvas element selection
        this.canvasManager.canvas.addEventListener('elementSelected', this.onElementSelected.bind(this));
        
        // Auto-save on canvas changes
        this.canvasManager.canvas.addEventListener('canvasChanged', 
            Utils.debounce(this.autoSave.bind(this), 2000)
        );
        
        // Window beforeunload for unsaved changes
        window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.onGlobalKeyDown.bind(this));
    }
    
    bindToolbarEvents() {
        // Undo/Redo
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        const resetBtn = document.getElementById('reset-btn');
        const snapGridBtn = document.getElementById('snap-grid');
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.canvasManager.undo());
        }
        
        if (redoBtn) {
            redoBtn.addEventListener('click', () => this.canvasManager.redo());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', this.resetCanvas.bind(this));
        }
        
        if (snapGridBtn) {
            snapGridBtn.addEventListener('click', this.toggleSnapGrid.bind(this));
        }
        
        // Opacity slider
        const opacitySlider = document.getElementById('opacity-slider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', this.onOpacityChange.bind(this));
        }
    }
    
    bindPropertiesEvents() {
        // Color picker
        const elementColor = document.getElementById('element-color');
        if (elementColor) {
            elementColor.addEventListener('change', this.onElementColorChange.bind(this));
        }
        
        // Color presets
        const colorPresets = document.getElementById('color-presets');
        if (colorPresets) {
            colorPresets.addEventListener('click', this.onColorPresetClick.bind(this));
        }
        
        // Size slider
        const sizeSlider = document.getElementById('size-slider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', this.onSizeChange.bind(this));
        }
        
        // Rotation slider
        const rotationSlider = document.getElementById('rotation-slider');
        if (rotationSlider) {
            rotationSlider.addEventListener('input', this.onRotationChange.bind(this));
        }
        
        // Layer controls
        const bringForward = document.getElementById('bring-forward');
        const sendBackward = document.getElementById('send-backward');
        
        if (bringForward) {
            bringForward.addEventListener('click', () => {
                if (this.canvasManager.selectedElement) {
                    this.canvasManager.changeElementLayer(this.canvasManager.selectedElement.id, 'forward');
                }
            });
        }
        
        if (sendBackward) {
            sendBackward.addEventListener('click', () => {
                if (this.canvasManager.selectedElement) {
                    this.canvasManager.changeElementLayer(this.canvasManager.selectedElement.id, 'backward');
                }
            });
        }
        
        // Flip controls
        const flipHorizontal = document.getElementById('flip-horizontal');
        const flipVertical = document.getElementById('flip-vertical');
        
        if (flipHorizontal) {
            flipHorizontal.addEventListener('click', () => {
                if (this.canvasManager.selectedElement) {
                    this.canvasManager.flipElement(this.canvasManager.selectedElement.id, true);
                }
            });
        }
        
        if (flipVertical) {
            flipVertical.addEventListener('click', () => {
                if (this.canvasManager.selectedElement) {
                    this.canvasManager.flipElement(this.canvasManager.selectedElement.id, false);
                }
            });
        }
        
        // Delete element
        const deleteElement = document.getElementById('delete-element');
        if (deleteElement) {
            deleteElement.addEventListener('click', () => {
                if (this.canvasManager.selectedElement) {
                    this.canvasManager.deleteElement(this.canvasManager.selectedElement.id);
                }
            });
        }
    }
    
    setupCanvasDragDrop() {
        const canvas = this.canvasManager.canvas;
        
        // Prevent default drag behaviors
        canvas.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            canvas.classList.add('drag-over');
        });
        
        canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
        });
        
        canvas.addEventListener('drop', (event) => {
            event.preventDefault();
            canvas.classList.remove('drag-over');
            
            try {
                const data = JSON.parse(event.dataTransfer.getData('text/plain'));
                if (data.type === 'tattoo') {
                    this.addTattooAtPosition(data.imageUrl, data.category, event);
                }
            } catch (error) {
                console.error('Failed to handle drop:', error);
            }
        });
    }
    
    async addTattooAtPosition(imageUrl, category, dropEvent) {
        try {
            const img = await this.tattooLibrary.getOrLoadImage(imageUrl);
            if (!img) {
                Utils.showNotification('Failed to load tattoo image', 'error');
                return;
            }
            
            // Get drop position relative to canvas
            const pos = Utils.getEventPos(dropEvent, this.canvasManager.canvas);
            
            // Calculate appropriate size
            const maxSize = 200;
            let width = img.width;
            let height = img.height;
            
            if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width *= ratio;
                height *= ratio;
            }
            
            // Create tattoo element at drop position
            const element = {
                type: 'image',
                image: img,
                x: pos.x,
                y: pos.y,
                width: width,
                height: height,
                scale: 1,
                rotation: 0,
                opacity: 1,
                flipX: false,
                flipY: false,
                category: category,
                imageUrl: imageUrl
            };
            
            this.canvasManager.addElement(element);
            Utils.showNotification('Tattoo added to canvas!');
            
        } catch (error) {
            console.error('Failed to add tattoo:', error);
            Utils.showNotification('Failed to add tattoo to canvas', 'error');
        }
    }
    
    // Event handlers
    onElementSelected(event) {
        const element = event.detail.element;
        this.updatePropertiesPanel(element);
    }
    
    updatePropertiesPanel(element) {
        if (!element) {
            // Hide properties panel or show empty state
            return;
        }
        
        // Update color picker
        const elementColor = document.getElementById('element-color');
        if (elementColor && element.color) {
            elementColor.value = element.color;
        }
        
        // Update size slider
        const sizeSlider = document.getElementById('size-slider');
        const sizeValue = document.getElementById('size-value');
        if (sizeSlider && element.scale) {
            const size = Math.round(element.width * element.scale);
            sizeSlider.value = size;
            if (sizeValue) sizeValue.textContent = size + 'px';
        }
        
        // Update rotation slider
        const rotationSlider = document.getElementById('rotation-slider');
        const rotationValue = document.getElementById('rotation-value');
        if (rotationSlider && element.rotation !== undefined) {
            rotationSlider.value = element.rotation;
            if (rotationValue) rotationValue.textContent = element.rotation + '°';
        }
        
        // Update opacity
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');
        if (opacitySlider && element.opacity !== undefined) {
            const opacity = Math.round(element.opacity * 100);
            opacitySlider.value = opacity;
            if (opacityValue) opacityValue.textContent = opacity + '%';
        }
    }
    
    onOpacityChange(event) {
        const opacity = parseFloat(event.target.value) / 100;
        const opacityValue = document.getElementById('opacity-value');
        
        if (opacityValue) {
            opacityValue.textContent = Math.round(opacity * 100) + '%';
        }
        
        if (this.canvasManager.selectedElement) {
            this.canvasManager.updateElement(this.canvasManager.selectedElement.id, { opacity });
        }
    }
    
    onElementColorChange(event) {
        const color = event.target.value;
        if (this.canvasManager.selectedElement) {
            this.canvasManager.updateElement(this.canvasManager.selectedElement.id, { color });
        }
    }
    
    onColorPresetClick(event) {
        if (event.target.classList.contains('color-preset')) {
            const color = event.target.dataset.color;
            const elementColor = document.getElementById('element-color');
            
            if (elementColor) {
                elementColor.value = color;
            }
            
            if (this.canvasManager.selectedElement) {
                this.canvasManager.updateElement(this.canvasManager.selectedElement.id, { color });
            }
        }
    }
    
    onSizeChange(event) {
        const size = parseInt(event.target.value);
        const sizeValue = document.getElementById('size-value');
        
        if (sizeValue) {
            sizeValue.textContent = size + 'px';
        }
        
        if (this.canvasManager.selectedElement) {
            const scale = size / this.canvasManager.selectedElement.width;
            this.canvasManager.updateElement(this.canvasManager.selectedElement.id, { scale });
        }
    }
    
    onRotationChange(event) {
        const rotation = parseInt(event.target.value);
        const rotationValue = document.getElementById('rotation-value');
        
        if (rotationValue) {
            rotationValue.textContent = rotation + '°';
        }
        
        if (this.canvasManager.selectedElement) {
            this.canvasManager.updateElement(this.canvasManager.selectedElement.id, { rotation });
        }
    }
    
    onGlobalKeyDown(event) {
        // Global keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    this.saveCurrentDesign();
                    break;
                case 'e':
                    event.preventDefault();
                    this.exportDesign();
                    break;
            }
        }
    }
    
    onBeforeUnload(event) {
        // Check for unsaved changes
        if (this.hasUnsavedChanges()) {
            event.preventDefault();
            event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return event.returnValue;
        }
    }
    
    // Theme management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        // Save theme preference
        this.storageManager.saveSettings({ theme: this.currentTheme });
        
        Utils.showNotification(`Switched to ${this.currentTheme} theme`);
    }
    
    applySettings(settings) {
        // Apply theme
        if (settings.theme) {
            this.currentTheme = settings.theme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            
            const themeToggle = document.getElementById('theme-toggle');
            const icon = themeToggle?.querySelector('i');
            
            if (icon) {
                icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Apply snap to grid
        if (settings.snapToGrid !== undefined) {
            this.canvasManager?.setSnapToGrid(settings.snapToGrid);
            const snapBtn = document.getElementById('snap-grid');
            if (snapBtn && settings.snapToGrid) {
                snapBtn.classList.add('active');
            }
        }
    }
    
    // Canvas operations
    resetCanvas() {
        if (confirm('Are you sure you want to reset the canvas? This will remove all tattoos.')) {
            this.canvasManager.reset();
            this.storageManager.clearAutoSave();
        }
    }
    
    toggleSnapGrid() {
        const snapBtn = document.getElementById('snap-grid');
        const currentState = this.canvasManager.snapToGrid;
        const newState = !currentState;
        
        this.canvasManager.setSnapToGrid(newState);
        
        if (snapBtn) {
            snapBtn.classList.toggle('active', newState);
        }
        
        this.storageManager.saveSettings({ snapToGrid: newState });
        
        Utils.showNotification(`Snap to grid ${newState ? 'enabled' : 'disabled'}`);
    }
    
    // Save and export
    saveCurrentDesign() {
        const canvasData = this.canvasManager.getCanvasData();
        const designName = prompt('Enter a name for your design:', `Design ${new Date().toLocaleDateString()}`);
        
        if (designName) {
            const metadata = {
                elementCount: canvasData.elements.length,
                bodyTemplate: canvasData.bodyTemplate,
                skinTone: canvasData.skinTone
            };
            
            this.storageManager.saveDesign(designName, canvasData, metadata);
            this.storageManager.clearAutoSave(); // Clear auto-save after manual save
        }
    }
    
    exportDesign() {
        this.canvasManager.exportAsPNG();
    }
    
    autoSave() {
        if (!this.isInitialized) return;
        
        const canvasData = this.canvasManager.getCanvasData();
        this.storageManager.autoSave(canvasData);
    }
    
    loadAutoSave() {
        const autoSave = this.storageManager.loadAutoSave();
        
        if (autoSave && autoSave.canvasData) {
            const timeDiff = new Date() - new Date(autoSave.timestamp);
            const hours = timeDiff / (1000 * 60 * 60);
            
            // Only offer to restore if it's less than 24 hours old
            if (hours < 24) {
                if (confirm('Auto-saved work found. Would you like to restore it?')) {
                    this.canvasManager.loadCanvasData(autoSave.canvasData);
                    Utils.showNotification('Auto-saved work restored!');
                }
            }
        }
    }
    
    hasUnsavedChanges() {
        // Check if there are elements on canvas and no recent save
        const canvasData = this.canvasManager.getCanvasData();
        return canvasData.elements.length > 0;
    }
    
    // UI utilities
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'flex' : 'none';
        }
    }
    
    showError(message) {
        Utils.showNotification(message, 'error');
        this.showLoading(false);
    }
    
    // Resize handling
    handleResize() {
        if (this.canvasManager) {
            this.canvasManager.onResize();
        }
    }
    
    // Cleanup
    destroy() {
        this.canvasManager = null;
        this.tattooLibrary?.dispose();
        this.textTool?.dispose();
        this.drawingTool?.dispose();
        this.bodyTemplates?.dispose();
        this.colorPicker?.dispose();
        this.storageManager = null;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tattooApp = new TattooApp();
});

// Handle resize
window.addEventListener('resize', Utils.debounce(() => {
    if (window.tattooApp) {
        window.tattooApp.handleResize();
    }
}, 250));

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TattooApp;
} else {
    window.TattooApp = TattooApp;
}
