// Body Templates Manager for different body parts and skin tones
class BodyTemplates {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.templates = {
            arm: {
                name: 'Arm',
                icon: 'fas fa-hand-paper',
                shape: 'ellipse',
                dimensions: { width: 160, height: 400 },
                position: { x: 0.5, y: 0.5 }, // Relative to canvas center
                curves: [
                    // Define curves for natural arm shape
                    { x: -80, y: -200, cp1x: -90, cp1y: -180, cp2x: -85, cp2y: -120, x2: -75, y2: -100 },
                    { x: -75, y: -100, cp1x: -70, cp1y: -80, cp2x: -65, cp2y: -40, x2: -60, y2: 0 },
                    { x: -60, y: 0, cp1x: -55, cp1y: 40, cp2x: -50, cp2y: 80, x2: -45, y2: 120 },
                    { x: -45, y: 120, cp1x: -40, cp1y: 160, cp2x: -35, cp2y: 180, x2: -30, y2: 200 }
                ]
            },
            chest: {
                name: 'Chest',
                icon: 'fas fa-user',
                shape: 'ellipse',
                dimensions: { width: 300, height: 360 },
                position: { x: 0.5, y: 0.45 }
            },
            back: {
                name: 'Back',
                icon: 'fas fa-male',
                shape: 'ellipse',
                dimensions: { width: 240, height: 400 },
                position: { x: 0.5, y: 0.5 }
            },
            leg: {
                name: 'Leg',
                icon: 'fas fa-running',
                shape: 'ellipse',
                dimensions: { width: 120, height: 500 },
                position: { x: 0.5, y: 0.55 }
            }
        };
        
        this.skinTones = [
            { name: 'Very Light', color: '#f4c2a1' },
            { name: 'Light', color: '#d4a574' },
            { name: 'Light Medium', color: '#c4925c' },
            { name: 'Medium', color: '#9d7a54' },
            { name: 'Dark Medium', color: '#7d5a3f' },
            { name: 'Dark', color: '#5d3a2f' }
        ];
        
        this.currentTemplate = 'arm';
        this.currentSkinTone = '#7d5a3f';
        this.templateContainer = null;
        this.skinToneContainer = null;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.loadSVGTemplates();
        
        // Set initial template
        this.setTemplate(this.currentTemplate);
        this.setSkinTone(this.currentSkinTone);
    }
    
    bindElements() {
        this.templateContainer = document.getElementById('body-templates');
        this.skinToneContainer = document.getElementById('skin-tones');
        
        if (!this.templateContainer || !this.skinToneContainer) {
            console.warn('Body template elements not found');
        }
    }
    
    bindEvents() {
        // Template selection
        if (this.templateContainer) {
            this.templateContainer.addEventListener('click', (event) => {
                const templateItem = event.target.closest('.template-item');
                if (templateItem) {
                    const template = templateItem.dataset.template;
                    this.setTemplate(template);
                }
            });
        }
        
        // Skin tone selection
        if (this.skinToneContainer) {
            this.skinToneContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('skin-tone')) {
                    const tone = event.target.dataset.tone;
                    this.setSkinTone(tone);
                }
            });
        }
    }
    
    async loadSVGTemplates() {
        try {
            // Load SVG template definitions
            const response = await fetch('assets/body-templates.svg');
            const svgText = await response.text();
            
            // Create a hidden container for SVG definitions
            const svgContainer = document.createElement('div');
            svgContainer.style.display = 'none';
            svgContainer.innerHTML = svgText;
            document.body.appendChild(svgContainer);
            
        } catch (error) {
            console.warn('Could not load SVG templates, using fallback rendering');
        }
    }
    
    setTemplate(templateName) {
        if (!this.templates[templateName]) {
            console.warn(`Template ${templateName} not found`);
            return;
        }
        
        this.currentTemplate = templateName;
        
        // Update UI
        this.updateTemplateUI();
        
        // Update canvas
        if (this.canvasManager) {
            this.canvasManager.setBodyTemplate(templateName);
        }
        
        Utils.showNotification(`Switched to ${this.templates[templateName].name} template`);
    }
    
    setSkinTone(color) {
        this.currentSkinTone = color;
        
        // Update UI
        this.updateSkinToneUI();
        
        // Update canvas
        if (this.canvasManager) {
            this.canvasManager.setSkinTone(color);
        }
        
        const toneName = this.getSkinToneName(color);
        Utils.showNotification(`Applied ${toneName} skin tone`);
    }
    
    updateTemplateUI() {
        if (!this.templateContainer) return;
        
        // Remove active class from all templates
        this.templateContainer.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current template
        const currentItem = this.templateContainer.querySelector(`[data-template="${this.currentTemplate}"]`);
        if (currentItem) {
            currentItem.classList.add('active');
        }
    }
    
    updateSkinToneUI() {
        if (!this.skinToneContainer) return;
        
        // Remove active class from all skin tones
        this.skinToneContainer.querySelectorAll('.skin-tone').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current skin tone
        const currentItem = this.skinToneContainer.querySelector(`[data-tone="${this.currentSkinTone}"]`);
        if (currentItem) {
            currentItem.classList.add('active');
        }
    }
    
    getSkinToneName(color) {
        const tone = this.skinTones.find(t => t.color === color);
        return tone ? tone.name : 'Custom';
    }
    
    // Advanced template drawing methods
    drawTemplateShape(ctx, template, canvasWidth, canvasHeight) {
        const centerX = canvasWidth * template.position.x;
        const centerY = canvasHeight * template.position.y;
        
        ctx.save();
        ctx.fillStyle = this.currentSkinTone;
        ctx.globalAlpha = 0.1;
        
        switch (template.shape) {
            case 'ellipse':
                this.drawEllipseTemplate(ctx, centerX, centerY, template.dimensions);
                break;
            case 'complex':
                this.drawComplexTemplate(ctx, centerX, centerY, template);
                break;
            case 'svg':
                this.drawSVGTemplate(ctx, centerX, centerY, template);
                break;
            default:
                this.drawEllipseTemplate(ctx, centerX, centerY, template.dimensions);
        }
        
        ctx.restore();
    }
    
    drawEllipseTemplate(ctx, centerX, centerY, dimensions) {
        ctx.beginPath();
        ctx.ellipse(
            centerX, centerY,
            dimensions.width / 2, dimensions.height / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }
    
    drawComplexTemplate(ctx, centerX, centerY, template) {
        // Draw complex shapes using curves
        if (!template.curves) return this.drawEllipseTemplate(ctx, centerX, centerY, template.dimensions);
        
        ctx.beginPath();
        ctx.moveTo(centerX + template.curves[0].x, centerY + template.curves[0].y);
        
        template.curves.forEach(curve => {
            if (curve.cp1x !== undefined) {
                // Bezier curve
                ctx.bezierCurveTo(
                    centerX + curve.cp1x, centerY + curve.cp1y,
                    centerX + curve.cp2x, centerY + curve.cp2y,
                    centerX + curve.x2, centerY + curve.y2
                );
            } else {
                // Simple line
                ctx.lineTo(centerX + curve.x, centerY + curve.y);
            }
        });
        
        ctx.closePath();
        ctx.fill();
    }
    
    drawSVGTemplate(ctx, centerX, centerY, template) {
        // Use SVG path if available
        const svgElement = document.querySelector(`#template-${this.currentTemplate}`);
        if (!svgElement) {
            return this.drawEllipseTemplate(ctx, centerX, centerY, template.dimensions);
        }
        
        // Draw SVG on canvas (simplified - would need full SVG to canvas conversion)
        const path = new Path2D(svgElement.getAttribute('d'));
        ctx.translate(centerX, centerY);
        ctx.fill(path);
    }
    
    // Template-specific tattoo placement guides
    getPlacementGuides(templateName) {
        const guides = {
            arm: [
                { name: 'Shoulder', x: 0.5, y: 0.15, popular: true },
                { name: 'Upper Arm', x: 0.5, y: 0.3, popular: true },
                { name: 'Elbow', x: 0.5, y: 0.5, popular: false },
                { name: 'Forearm', x: 0.5, y: 0.7, popular: true },
                { name: 'Wrist', x: 0.5, y: 0.85, popular: true }
            ],
            chest: [
                { name: 'Heart', x: 0.3, y: 0.4, popular: true },
                { name: 'Center', x: 0.5, y: 0.5, popular: true },
                { name: 'Collarbone', x: 0.5, y: 0.2, popular: true },
                { name: 'Side', x: 0.8, y: 0.6, popular: false }
            ],
            back: [
                { name: 'Shoulder Blade', x: 0.3, y: 0.25, popular: true },
                { name: 'Upper Back', x: 0.5, y: 0.3, popular: true },
                { name: 'Lower Back', x: 0.5, y: 0.8, popular: true },
                { name: 'Spine', x: 0.5, y: 0.5, popular: false }
            ],
            leg: [
                { name: 'Thigh', x: 0.5, y: 0.2, popular: true },
                { name: 'Knee', x: 0.5, y: 0.4, popular: false },
                { name: 'Calf', x: 0.5, y: 0.6, popular: true },
                { name: 'Ankle', x: 0.5, y: 0.85, popular: true }
            ]
        };
        
        return guides[templateName] || [];
    }
    
    // Show placement guides on canvas
    showPlacementGuides(show = true) {
        const guides = this.getPlacementGuides(this.currentTemplate);
        
        if (show && guides.length > 0) {
            this.drawPlacementGuides(guides);
        }
    }
    
    drawPlacementGuides(guides) {
        if (!this.canvasManager) return;
        
        const canvas = this.canvasManager.canvas;
        const ctx = this.canvasManager.ctx;
        
        ctx.save();
        ctx.strokeStyle = '#6366f1';
        ctx.fillStyle = '#6366f1';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        guides.forEach(guide => {
            const x = canvas.width * guide.x;
            const y = canvas.height * guide.y;
            
            // Draw guide point
            ctx.beginPath();
            ctx.arc(x, y, guide.popular ? 6 : 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw label
            ctx.fillText(guide.name, x, y - 10);
        });
        
        ctx.restore();
    }
    
    // Get template-specific recommendations
    getTemplateRecommendations(templateName) {
        const recommendations = {
            arm: {
                sizes: ['Small (2-4 inches)', 'Medium (4-8 inches)', 'Large (8+ inches)'],
                styles: ['Tribal bands', 'Script text', 'Small symbols', 'Sleeve designs'],
                considerations: ['Wraps around arm naturally', 'Consider muscle movement', 'Plan for potential sleeve']
            },
            chest: {
                sizes: ['Medium (4-8 inches)', 'Large (8+ inches)'],
                styles: ['Script text', 'Geometric designs', 'Memorial pieces', 'Religious symbols'],
                considerations: ['Close to heart - meaningful designs', 'Consider body hair', 'Think about neckline']
            },
            back: {
                sizes: ['Medium (4-8 inches)', 'Large (8+ inches)', 'Full back pieces'],
                styles: ['Large detailed pieces', 'Vertical designs', 'Wing designs', 'Landscape scenes'],
                considerations: ['Large canvas for detailed work', 'Consider clothing coverage', 'Plan for full piece']
            },
            leg: {
                sizes: ['Small (2-4 inches)', 'Medium (4-8 inches)', 'Large (8+ inches)'],
                styles: ['Ankle pieces', 'Calf designs', 'Thigh pieces', 'Leg sleeves'],
                considerations: ['Consider pants coverage', 'Think about walking/movement', 'Ankle pieces are delicate']
            }
        };
        
        return recommendations[templateName] || {};
    }
    
    // Size recommendations based on template
    getRecommendedSize(templateName, tattooType) {
        const sizeGuides = {
            arm: {
                text: { min: 20, max: 200, recommended: 80 },
                symbol: { min: 50, max: 300, recommended: 150 },
                detailed: { min: 100, max: 400, recommended: 250 }
            },
            chest: {
                text: { min: 30, max: 250, recommended: 100 },
                symbol: { min: 80, max: 400, recommended: 200 },
                detailed: { min: 150, max: 500, recommended: 300 }
            },
            back: {
                text: { min: 50, max: 400, recommended: 150 },
                symbol: { min: 100, max: 600, recommended: 300 },
                detailed: { min: 200, max: 800, recommended: 500 }
            },
            leg: {
                text: { min: 25, max: 180, recommended: 70 },
                symbol: { min: 60, max: 350, recommended: 180 },
                detailed: { min: 120, max: 450, recommended: 280 }
            }
        };
        
        return sizeGuides[templateName]?.[tattooType] || { min: 50, max: 300, recommended: 150 };
    }
    
    // Body template export/import
    exportTemplate() {
        return {
            currentTemplate: this.currentTemplate,
            currentSkinTone: this.currentSkinTone,
            customTemplates: this.customTemplates || {},
            version: '1.0'
        };
    }
    
    importTemplate(templateData) {
        if (templateData.version !== '1.0') {
            Utils.showNotification('Unsupported template data version', 'error');
            return false;
        }
        
        if (templateData.currentTemplate) {
            this.setTemplate(templateData.currentTemplate);
        }
        
        if (templateData.currentSkinTone) {
            this.setSkinTone(templateData.currentSkinTone);
        }
        
        return true;
    }
    
    // Custom skin tone
    addCustomSkinTone(color, name) {
        const customTone = { name, color };
        this.skinTones.push(customTone);
        
        // Update UI to include custom tone
        if (this.skinToneContainer) {
            const toneElement = document.createElement('div');
            toneElement.className = 'skin-tone';
            toneElement.dataset.tone = color;
            toneElement.style.backgroundColor = color;
            toneElement.title = name;
            
            this.skinToneContainer.appendChild(toneElement);
        }
        
        Utils.showNotification(`Added custom skin tone: ${name}`);
    }
    
    // Cleanup
    dispose() {
        this.canvasManager = null;
        this.templateContainer = null;
        this.skinToneContainer = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BodyTemplates;
} else {
    window.BodyTemplates = BodyTemplates;
}
