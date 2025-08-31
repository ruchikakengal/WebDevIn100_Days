
// Drawing Tool for custom freehand drawing on the tattoo canvas
class DrawingTool {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.isDrawing = false;
        this.isDrawingMode = false;
        this.currentPath = [];
        this.brushSize = 5;
        this.brushColor = '#000000';
        this.brushOpacity = 1;
        this.drawingPaths = [];
        this.tempCanvas = null;
        this.tempCtx = null;
        
        this.init();
    }
    
    init() {
        this.createTempCanvas();
        this.bindEvents();
        this.setupDrawingControls();
    }
    
    createTempCanvas() {
        this.tempCanvas = document.createElement('canvas');
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.tempCanvas.width = this.canvasManager.canvas.width;
        this.tempCanvas.height = this.canvasManager.canvas.height;
        this.tempCanvas.style.position = 'absolute';
        this.tempCanvas.style.top = '0';
        this.tempCanvas.style.left = '0';
        this.tempCanvas.style.pointerEvents = 'none';
        this.tempCanvas.style.zIndex = '10';
    }
    
    bindEvents() {
        const canvas = this.canvasManager.canvas;
        
        // Override canvas manager events when in drawing mode
        this.originalMouseDown = canvas.onmousedown;
        this.originalMouseMove = canvas.onmousemove;
        this.originalMouseUp = canvas.onmouseup;
        this.originalTouchStart = canvas.ontouchstart;
        this.originalTouchMove = canvas.ontouchmove;
        this.originalTouchEnd = canvas.ontouchend;
    }
    
    setupDrawingControls() {
        // Find or create drawing controls in the sidebar
        const sidebar = document.querySelector('.sidebar-content');
        if (!sidebar) return;
        
        // Check if drawing section already exists
        let drawingSection = document.getElementById('drawing-section');
        if (!drawingSection) {
            drawingSection = document.createElement('div');
            drawingSection.id = 'drawing-section';
            drawingSection.className = 'sidebar-section';
            drawingSection.innerHTML = `
                <h3>Drawing Tool</h3>
                <div class="drawing-controls">
                    <button id="toggle-drawing" class="btn btn-primary">
                        <i class="fas fa-paint-brush"></i>
                        Enable Drawing
                    </button>
                    
                    <div class="brush-controls" style="display: none;">
                        <label>Brush Size: <span id="brush-size-value">${this.brushSize}px</span></label>
                        <input type="range" id="brush-size" min="1" max="50" value="${this.brushSize}">
                        
                        <label>Brush Color:</label>
                        <input type="color" id="brush-color" value="${this.brushColor}">
                        
                        <label>Opacity: <span id="brush-opacity-value">100%</span></label>
                        <input type="range" id="brush-opacity" min="10" max="100" value="100">
                        
                        <div class="drawing-actions">
                            <button id="clear-drawing" class="btn btn-secondary">
                                <i class="fas fa-eraser"></i>
                                Clear Drawing
                            </button>
                            <button id="save-drawing" class="btn btn-success">
                                <i class="fas fa-save"></i>
                                Save Drawing
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            sidebar.appendChild(drawingSection);
        }
        
        this.bindDrawingControls();
    }
    
    bindDrawingControls() {
        const toggleBtn = document.getElementById('toggle-drawing');
        const brushSizeSlider = document.getElementById('brush-size');
        const brushSizeValue = document.getElementById('brush-size-value');
        const brushColorPicker = document.getElementById('brush-color');
        const brushOpacitySlider = document.getElementById('brush-opacity');
        const brushOpacityValue = document.getElementById('brush-opacity-value');
        const clearBtn = document.getElementById('clear-drawing');
        const saveBtn = document.getElementById('save-drawing');
        const brushControls = document.querySelector('.brush-controls');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleDrawingMode();
                if (this.isDrawingMode) {
                    toggleBtn.innerHTML = '<i class="fas fa-hand-pointer"></i> Disable Drawing';
                    toggleBtn.classList.remove('btn-primary');
                    toggleBtn.classList.add('btn-warning');
                    brushControls.style.display = 'block';
                } else {
                    toggleBtn.innerHTML = '<i class="fas fa-paint-brush"></i> Enable Drawing';
                    toggleBtn.classList.remove('btn-warning');
                    toggleBtn.classList.add('btn-primary');
                    brushControls.style.display = 'none';
                }
            });
        }
        
        if (brushSizeSlider) {
            brushSizeSlider.addEventListener('input', (e) => {
                this.brushSize = parseInt(e.target.value);
                if (brushSizeValue) {
                    brushSizeValue.textContent = this.brushSize + 'px';
                }
            });
        }
        
        if (brushColorPicker) {
            brushColorPicker.addEventListener('change', (e) => {
                this.brushColor = e.target.value;
            });
        }
        
        if (brushOpacitySlider) {
            brushOpacitySlider.addEventListener('input', (e) => {
                this.brushOpacity = parseInt(e.target.value) / 100;
                if (brushOpacityValue) {
                    brushOpacityValue.textContent = e.target.value + '%';
                }
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearDrawing();
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveDrawingAsElement();
            });
        }
    }
    
    toggleDrawingMode() {
        this.isDrawingMode = !this.isDrawingMode;
        
        if (this.isDrawingMode) {
            this.enableDrawingMode();
        } else {
            this.disableDrawingMode();
        }
    }
    
    enableDrawingMode() {
        const canvas = this.canvasManager.canvas;
        const canvasContainer = canvas.parentElement;
        
        // Add temp canvas for drawing preview
        if (!canvasContainer.contains(this.tempCanvas)) {
            canvasContainer.appendChild(this.tempCanvas);
        }
        
        // Override event handlers
        canvas.onmousedown = this.onDrawStart.bind(this);
        canvas.onmousemove = this.onDrawMove.bind(this);
        canvas.onmouseup = this.onDrawEnd.bind(this);
        
        canvas.ontouchstart = this.onTouchDrawStart.bind(this);
        canvas.ontouchmove = this.onTouchDrawMove.bind(this);
        canvas.ontouchend = this.onTouchDrawEnd.bind(this);
        
        // Change cursor
        canvas.style.cursor = 'crosshair';
        
        Utils.showNotification('Drawing mode enabled - click and drag to draw');
    }
    
    disableDrawingMode() {
        const canvas = this.canvasManager.canvas;
        const canvasContainer = canvas.parentElement;
        
        // Remove temp canvas
        if (canvasContainer.contains(this.tempCanvas)) {
            canvasContainer.removeChild(this.tempCanvas);
        }
        
        // Restore original event handlers
        canvas.onmousedown = this.originalMouseDown;
        canvas.onmousemove = this.originalMouseMove;
        canvas.onmouseup = this.originalMouseUp;
        canvas.ontouchstart = this.originalTouchStart;
        canvas.ontouchmove = this.originalTouchMove;
        canvas.ontouchend = this.originalTouchEnd;
        
        // Restore cursor
        canvas.style.cursor = 'default';
        
        Utils.showNotification('Drawing mode disabled');
    }
    
    onDrawStart(event) {
        event.preventDefault();
        this.isDrawing = true;
        const pos = Utils.getEventPos(event, this.canvasManager.canvas);
        this.currentPath = [pos];
        this.drawPreview();
    }
    
    onDrawMove(event) {
        if (!this.isDrawing) return;
        event.preventDefault();
        
        const pos = Utils.getEventPos(event, this.canvasManager.canvas);
        this.currentPath.push(pos);
        this.drawPreview();
    }
    
    onDrawEnd(event) {
        if (!this.isDrawing) return;
        event.preventDefault();
        
        this.isDrawing = false;
        
        if (this.currentPath.length > 1) {
            // Save the path
            this.drawingPaths.push({
                points: [...this.currentPath],
                color: this.brushColor,
                size: this.brushSize,
                opacity: this.brushOpacity
            });
            
            // Draw on main canvas
            this.drawPathOnMainCanvas(this.currentPath);
        }
        
        // Clear temp canvas
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.currentPath = [];
    }
    
    onTouchDrawStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onDrawStart(mouseEvent);
    }
    
    onTouchDrawMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onDrawMove(mouseEvent);
    }
    
    onTouchDrawEnd(event) {
        event.preventDefault();
        this.onDrawEnd(event);
    }
    
    drawPreview() {
        if (this.currentPath.length < 2) return;
        
        // Clear temp canvas
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        
        // Draw current path on temp canvas
        this.drawPath(this.tempCtx, this.currentPath, this.brushColor, this.brushSize, this.brushOpacity);
    }
    
    drawPathOnMainCanvas(path) {
        const ctx = this.canvasManager.ctx;
        this.drawPath(ctx, path, this.brushColor, this.brushSize, this.brushOpacity);
    }
    
    drawPath(ctx, points, color, size, opacity) {
        if (points.length < 2) return;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    clearDrawing() {
        if (confirm('Are you sure you want to clear all drawings?')) {
            this.drawingPaths = [];
            this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
            this.canvasManager.redraw(); // This will redraw without the drawing paths
            Utils.showNotification('Drawing cleared');
        }
    }
    
    saveDrawingAsElement() {
        if (this.drawingPaths.length === 0) {
            Utils.showNotification('No drawing to save', 'warning');
            return;
        }
        
        // Create a new canvas with the drawing
        const drawingCanvas = document.createElement('canvas');
        const drawingCtx = drawingCanvas.getContext('2d');
        drawingCanvas.width = this.canvasManager.canvas.width;
        drawingCanvas.height = this.canvasManager.canvas.height;
        
        // Draw all paths on the new canvas
        this.drawingPaths.forEach(path => {
            this.drawPath(drawingCtx, path.points, path.color, path.size, path.opacity);
        });
        
        // Convert to image
        const img = new Image();
        img.onload = () => {
            // Create element for canvas manager
            const element = {
                type: 'image',
                image: img,
                x: this.canvasManager.canvas.width / 2,
                y: this.canvasManager.canvas.height / 2,
                width: drawingCanvas.width,
                height: drawingCanvas.height,
                scale: 1,
                rotation: 0,
                opacity: 1,
                flipX: false,
                flipY: false,
                category: 'custom-drawing'
            };
            
            this.canvasManager.addElement(element);
            this.clearDrawing();
            Utils.showNotification('Drawing saved as element!');
        };
        
        img.src = drawingCanvas.toDataURL();
    }
    
    // Override canvas manager's redraw to include drawing paths
    redrawWithDrawing() {
        // First, let canvas manager do its normal redraw
        this.canvasManager.redraw();
        
        // Then draw our drawing paths on top
        this.drawingPaths.forEach(path => {
            this.drawPath(this.canvasManager.ctx, path.points, path.color, path.size, path.opacity);
        });
    }
    
    dispose() {
        this.disableDrawingMode();
        this.drawingPaths = [];
        if (this.tempCanvas && this.tempCanvas.parentElement) {
            this.tempCanvas.parentElement.removeChild(this.tempCanvas);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DrawingTool;
} else {
    window.DrawingTool = DrawingTool;
}
