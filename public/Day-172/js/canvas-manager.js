// Canvas Manager for handling tattoo placement and manipulation
class CanvasManager {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.elements = [];
        this.selectedElement = null;
        this.isDragging = false;
        this.isResizing = false;
        this.isRotating = false;
        this.dragStart = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        this.snapToGrid = false;
        this.gridSize = 20;
        this.bodyTemplate = 'arm';
        this.skinTone = '#7d5a3f';
        
        this.setupCanvas();
        this.bindEvents();
        this.saveState();
    }
    
    setupCanvas() {
        // Setup high DPI canvas
        const rect = this.canvas.getBoundingClientRect();
        Utils.setupHighDPICanvas(this.canvas, this.ctx, rect.width, rect.height);
        
        // Set initial background
        this.drawBackground();
    }
    
    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('click', this.onClick.bind(this));
        this.canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        
        // Window resize
        window.addEventListener('resize', Utils.debounce(this.onResize.bind(this), 250));
    }
    
    // Event handlers
    onMouseDown(event) {
        event.preventDefault();
        const pos = Utils.getEventPos(event, this.canvas);
        this.handlePointerDown(pos);
    }
    
    onMouseMove(event) {
        event.preventDefault();
        const pos = Utils.getEventPos(event, this.canvas);
        this.handlePointerMove(pos);
    }
    
    onMouseUp(event) {
        event.preventDefault();
        this.handlePointerUp();
    }
    
    onTouchStart(event) {
        event.preventDefault();
        const pos = Utils.getEventPos(event, this.canvas);
        this.handlePointerDown(pos);
    }
    
    onTouchMove(event) {
        event.preventDefault();
        const pos = Utils.getEventPos(event, this.canvas);
        this.handlePointerMove(pos);
    }
    
    onTouchEnd(event) {
        event.preventDefault();
        this.handlePointerUp();
    }
    
    onClick(event) {
        const pos = Utils.getEventPos(event, this.canvas);
        const element = this.getElementAt(pos);
        this.selectElement(element);
    }
    
    onContextMenu(event) {
        event.preventDefault();
        const pos = Utils.getEventPos(event, this.canvas);
        const element = this.getElementAt(pos);
        if (element) {
            this.showContextMenu(event, element);
        }
    }
    
    onKeyDown(event) {
        if (!this.selectedElement) return;
        
        switch (event.key) {
            case 'Delete':
            case 'Backspace':
                this.deleteElement(this.selectedElement.id);
                break;
            case 'Escape':
                this.selectElement(null);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.moveElement(this.selectedElement.id, 0, -1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.moveElement(this.selectedElement.id, 0, 1);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.moveElement(this.selectedElement.id, -1, 0);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.moveElement(this.selectedElement.id, 1, 0);
                break;
        }
        
        // Undo/Redo
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'z':
                    event.preventDefault();
                    if (event.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 'y':
                    event.preventDefault();
                    this.redo();
                    break;
            }
        }
    }
    
    onResize() {
        this.setupCanvas();
        this.redraw();
    }
    
    // Pointer handling
    handlePointerDown(pos) {
        const element = this.getElementAt(pos);
        
        if (element) {
            this.selectElement(element);
            this.isDragging = true;
            this.dragStart = { ...pos };
            this.lastPos = { ...pos };
        } else {
            this.selectElement(null);
        }
    }
    
    handlePointerMove(pos) {
        if (!this.isDragging || !this.selectedElement) return;
        
        const dx = pos.x - this.lastPos.x;
        const dy = pos.y - this.lastPos.y;
        
        this.moveElement(this.selectedElement.id, dx, dy);
        this.lastPos = { ...pos };
        this.redraw();
    }
    
    handlePointerUp() {
        if (this.isDragging && this.selectedElement) {
            this.saveState();
        }
        
        this.isDragging = false;
        this.isResizing = false;
        this.isRotating = false;
    }
    
    // Element management
    addElement(element) {
        element.id = element.id || Utils.generateId();
        element.zIndex = element.zIndex || this.elements.length;
        element.created = new Date().toISOString();
        
        this.elements.push(element);
        this.selectElement(element);
        this.redraw();
        this.saveState();
        
        return element.id;
    }
    
    removeElement(elementId) {
        const index = this.elements.findIndex(el => el.id === elementId);
        if (index > -1) {
            this.elements.splice(index, 1);
            if (this.selectedElement && this.selectedElement.id === elementId) {
                this.selectElement(null);
            }
            this.redraw();
            this.saveState();
            return true;
        }
        return false;
    }
    
    updateElement(elementId, updates) {
        const element = this.elements.find(el => el.id === elementId);
        if (element) {
            Object.assign(element, updates);
            this.redraw();
            return true;
        }
        return false;
    }
    
    getElement(elementId) {
        return this.elements.find(el => el.id === elementId);
    }
    
    getElementAt(pos) {
        // Check elements in reverse order (top to bottom)
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            if (this.isPointInElement(pos, element)) {
                return element;
            }
        }
        return null;
    }
    
    isPointInElement(pos, element) {
        const bounds = this.getElementBounds(element);
        return Utils.pointInRect(pos, bounds);
    }
    
    getElementBounds(element) {
        return {
            x: element.x - element.width * element.scale / 2,
            y: element.y - element.height * element.scale / 2,
            width: element.width * element.scale,
            height: element.height * element.scale
        };
    }
    
    selectElement(element) {
        this.selectedElement = element;
        this.updateSelectionHandles();
        this.redraw();
        
        // Dispatch selection event
        this.canvas.dispatchEvent(new CustomEvent('elementSelected', {
            detail: { element }
        }));
    }
    
    updateSelectionHandles() {
        const handles = document.getElementById('selection-handles');
        if (!this.selectedElement) {
            handles.style.display = 'none';
            return;
        }
        
        const bounds = this.getElementBounds(this.selectedElement);
        const canvasRect = this.canvas.getBoundingClientRect();
        
        handles.style.display = 'block';
        handles.style.left = (canvasRect.left + bounds.x) + 'px';
        handles.style.top = (canvasRect.top + bounds.y) + 'px';
        handles.style.width = bounds.width + 'px';
        handles.style.height = bounds.height + 'px';
    }
    
    // Element manipulation
    moveElement(elementId, dx, dy) {
        const element = this.getElement(elementId);
        if (!element) return;
        
        element.x += dx;
        element.y += dy;
        
        if (this.snapToGrid) {
            element.x = Math.round(element.x / this.gridSize) * this.gridSize;
            element.y = Math.round(element.y / this.gridSize) * this.gridSize;
        }
        
        // Keep within canvas bounds
        const bounds = this.getElementBounds(element);
        element.x = Utils.clamp(element.x, bounds.width / 2, this.canvas.width - bounds.width / 2);
        element.y = Utils.clamp(element.y, bounds.height / 2, this.canvas.height - bounds.height / 2);
    }
    
    resizeElement(elementId, scale) {
        const element = this.getElement(elementId);
        if (!element) return;
        
        element.scale = Utils.clamp(scale, 0.1, 5);
        this.redraw();
    }
    
    rotateElement(elementId, angle) {
        const element = this.getElement(elementId);
        if (!element) return;
        
        element.rotation = angle;
        this.redraw();
    }
    
    flipElement(elementId, horizontal = true) {
        const element = this.getElement(elementId);
        if (!element) return;
        
        if (horizontal) {
            element.flipX = !element.flipX;
        } else {
            element.flipY = !element.flipY;
        }
        this.redraw();
        this.saveState();
    }
    
    changeElementLayer(elementId, direction) {
        const element = this.getElement(elementId);
        if (!element) return;
        
        const currentIndex = this.elements.indexOf(element);
        let newIndex;
        
        if (direction === 'forward') {
            newIndex = Math.min(currentIndex + 1, this.elements.length - 1);
        } else {
            newIndex = Math.max(currentIndex - 1, 0);
        }
        
        if (newIndex !== currentIndex) {
            this.elements.splice(currentIndex, 1);
            this.elements.splice(newIndex, 0, element);
            this.redraw();
            this.saveState();
        }
    }
    
    deleteElement(elementId) {
        if (this.removeElement(elementId)) {
            Utils.showNotification('Element deleted');
        }
    }
    
    // Canvas drawing
    drawBackground() {
        this.ctx.fillStyle = this.skinTone;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw body template silhouette
        this.drawBodyTemplate();
    }
    
    drawBodyTemplate() {
        // This will be implemented to draw different body templates
        // For now, draw a simple silhouette based on the selected template
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        switch (this.bodyTemplate) {
            case 'arm':
                this.drawArmTemplate(centerX, centerY);
                break;
            case 'chest':
                this.drawChestTemplate(centerX, centerY);
                break;
            case 'back':
                this.drawBackTemplate(centerX, centerY);
                break;
            case 'leg':
                this.drawLegTemplate(centerX, centerY);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawArmTemplate(centerX, centerY) {
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 80, 200, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawChestTemplate(centerX, centerY) {
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 150, 180, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBackTemplate(centerX, centerY) {
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 120, 200, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawLegTemplate(centerX, centerY) {
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, 60, 250, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        
        // Sort elements by zIndex
        const sortedElements = [...this.elements].sort((a, b) => a.zIndex - b.zIndex);
        
        sortedElements.forEach(element => {
            this.drawElement(element);
        });
        
        // Draw selection indicator
        if (this.selectedElement) {
            this.drawSelectionIndicator(this.selectedElement);
        }
    }
    
    drawElement(element) {
        this.ctx.save();
        
        // Apply transformations
        this.ctx.translate(element.x, element.y);
        this.ctx.rotate(Utils.degToRad(element.rotation || 0));
        this.ctx.scale(
            (element.scale || 1) * (element.flipX ? -1 : 1),
            (element.scale || 1) * (element.flipY ? -1 : 1)
        );
        
        // Set opacity
        this.ctx.globalAlpha = element.opacity || 1;
        
        // Draw based on element type
        switch (element.type) {
            case 'image':
                this.drawImageElement(element);
                break;
            case 'text':
                this.drawTextElement(element);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawImageElement(element) {
        if (element.image && element.image.complete) {
            this.ctx.drawImage(
                element.image,
                -element.width / 2,
                -element.height / 2,
                element.width,
                element.height
            );
        }
    }
    
    drawTextElement(element) {
        this.ctx.font = `${element.fontSize}px ${element.fontFamily}`;
        this.ctx.fillStyle = element.color || '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.fillText(element.text, 0, 0);
    }
    
    drawSelectionIndicator(element) {
        const bounds = this.getElementBounds(element);
        
        this.ctx.save();
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        this.ctx.restore();
    }
    
    // History management
    saveState() {
        const state = {
            elements: Utils.deepClone(this.elements),
            bodyTemplate: this.bodyTemplate,
            skinTone: this.skinTone
        };
        
        // Remove future states if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(this.history[this.historyIndex]);
            Utils.showNotification('Undone');
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(this.history[this.historyIndex]);
            Utils.showNotification('Redone');
        }
    }
    
    loadState(state) {
        this.elements = Utils.deepClone(state.elements);
        this.bodyTemplate = state.bodyTemplate;
        this.skinTone = state.skinTone;
        this.selectedElement = null;
        this.redraw();
    }
    
    reset() {
        this.elements = [];
        this.selectedElement = null;
        this.redraw();
        this.saveState();
        Utils.showNotification('Canvas reset');
    }
    
    // Settings
    setBodyTemplate(template) {
        this.bodyTemplate = template;
        this.redraw();
        this.saveState();
    }
    
    setSkinTone(color) {
        this.skinTone = color;
        this.redraw();
        this.saveState();
    }
    
    setSnapToGrid(enabled) {
        this.snapToGrid = enabled;
    }
    
    // Export
    exportAsPNG() {
        // Create a new canvas without the selection indicator
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        exportCanvas.width = this.canvas.width;
        exportCanvas.height = this.canvas.height;
        
        // Temporarily store selected element
        const selectedElement = this.selectedElement;
        this.selectedElement = null;
        
        // Draw on export canvas
        exportCtx.drawImage(this.canvas, 0, 0);
        
        // Restore selection
        this.selectedElement = selectedElement;
        
        // Convert to blob and download
        exportCanvas.toBlob(blob => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            Utils.downloadFile(blob, `tattoo_design_${timestamp}.png`);
            Utils.showNotification('Design exported successfully!');
        }, 'image/png');
    }
    
    // Context menu
    showContextMenu(event, element) {
        // This would show a context menu with options like:
        // - Bring Forward
        // - Send Backward  
        // - Duplicate
        // - Delete
        // - Properties
        console.log('Context menu for element:', element);
    }
    
    // Get canvas data for saving
    getCanvasData() {
        return {
            elements: this.elements,
            bodyTemplate: this.bodyTemplate,
            skinTone: this.skinTone,
            width: this.canvas.width,
            height: this.canvas.height
        };
    }
    
    // Load canvas data
    loadCanvasData(data) {
        this.elements = data.elements || [];
        this.bodyTemplate = data.bodyTemplate || 'arm';
        this.skinTone = data.skinTone || '#7d5a3f';
        this.selectedElement = null;
        this.redraw();
        this.saveState();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasManager;
} else {
    window.CanvasManager = CanvasManager;
}
