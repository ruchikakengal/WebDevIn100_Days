class CardGenerator {
    constructor() {
        this.canvas = document.getElementById('cardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cardWidth = 800;
        this.cardHeight = 1200;
        
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = this.cardWidth;
        this.canvas.height = this.cardHeight;
        
        // Set high DPI scaling for crisp images
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    async generateCard(superhero) {
        return new Promise((resolve, reject) => {
            try {
                // Clear canvas
                this.ctx.clearRect(0, 0, this.cardWidth, this.cardHeight);
                
                // Draw background
                this.drawBackground(superhero.costume.colors);
                
                // Draw decorative elements
                this.drawDecorations();
                
                // Draw content sections
                this.drawHeader(superhero.name, superhero.powerLevel);
                this.drawPowers(superhero.powers);
                this.drawCostume(superhero.costume);
                this.drawOrigin(superhero.origin);
                
                // Draw border and finishing touches
                this.drawBorder();
                this.drawWatermark();
                
                // Convert to downloadable image
                this.downloadCard(superhero.name);
                
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    drawBackground(colors) {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.cardHeight);
        gradient.addColorStop(0, colors[0] || '#FF6B6B');
        gradient.addColorStop(0.5, colors[1] || '#4ECDC4');
        gradient.addColorStop(1, colors[2] || '#45B7D1');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);
        
        // Add overlay pattern
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.cardWidth;
            const y = Math.random() * this.cardHeight;
            const size = Math.random() * 3 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawDecorations() {
        // Draw comic book style bursts
        this.drawBurst(100, 100, 40, '#FFD700', 0.3);
        this.drawBurst(this.cardWidth - 100, 150, 30, '#FF69B4', 0.3);
        this.drawBurst(150, this.cardHeight - 150, 35, '#00CED1', 0.3);
        this.drawBurst(this.cardWidth - 120, this.cardHeight - 200, 25, '#FF4500', 0.3);
        
        // Draw lightning bolts
        this.drawLightning(50, 300, 100, 80, '#FFFF00', 0.4);
        this.drawLightning(this.cardWidth - 80, 400, 60, 120, '#FFFF00', 0.4);
    }

    drawBurst(x, y, size, color, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        const spikes = 8;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const pointX = x + Math.cos(angle) * radius;
            const pointY = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(pointX, pointY);
            } else {
                this.ctx.lineTo(pointX, pointY);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawLightning(x, y, width, height, color, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width * 0.3, y + height * 0.3);
        this.ctx.lineTo(x + width * 0.1, y + height * 0.5);
        this.ctx.lineTo(x + width * 0.7, y + height * 0.7);
        this.ctx.lineTo(x + width * 0.5, y + height);
        this.ctx.stroke();
        
        // Add glow effect
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawHeader(name, powerLevel) {
        const headerY = 80;
        const headerHeight = 200;
        
        // Draw header background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(40, headerY, this.cardWidth - 80, headerHeight);
        
        // Draw superhero name
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 48px "Bangers", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Add text shadow
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 5;
        
        this.ctx.fillText(name, this.cardWidth / 2, headerY + 70);
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        
        // Draw power level stars
        const starY = headerY + 130;
        const starSize = 25;
        const starSpacing = 40;
        const totalWidth = powerLevel * starSpacing;
        const startX = (this.cardWidth - totalWidth) / 2;
        
        for (let i = 0; i < powerLevel; i++) {
            this.drawStar(startX + i * starSpacing + starSize, starY, starSize, '#FFD700');
        }
    }

    drawStar(x, y, size, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const radius = i % 2 === 0 ? size : size * 0.5;
            const pointX = x + Math.cos(angle - Math.PI / 2) * radius;
            const pointY = y + Math.sin(angle - Math.PI / 2) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(pointX, pointY);
            } else {
                this.ctx.lineTo(pointX, pointY);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Add inner glow
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawPowers(powers) {
        const sectionY = 320;
        const sectionHeight = 250;
        
        // Draw section background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(40, sectionY, this.cardWidth - 80, sectionHeight);
        
        // Draw section title
        this.ctx.fillStyle = '#333333';
        this.ctx.font = 'bold 32px "Comic Neue", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SUPERPOWERS', this.cardWidth / 2, sectionY + 40);
        
        // Draw powers
        this.ctx.font = 'bold 20px "Comic Neue", cursive';
        this.ctx.textAlign = 'left';
        
        const powerHeight = 25;
        const startY = sectionY + 80;
        const leftColumn = 60;
        const rightColumn = this.cardWidth / 2 + 20;
        
        powers.forEach((power, index) => {
            const x = index % 2 === 0 ? leftColumn : rightColumn;
            const y = startY + Math.floor(index / 2) * powerHeight;
            
            // Draw power bullet
            this.ctx.fillStyle = '#FF6B6B';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Draw power text
            this.ctx.fillStyle = '#333333';
            this.ctx.fillText(power, x + 20, y + 5);
        });
    }

    drawCostume(costume) {
        const sectionY = 590;
        const sectionHeight = 200;
        
        // Draw section background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(40, sectionY, this.cardWidth - 80, sectionHeight);
        
        // Draw section title
        this.ctx.fillStyle = '#333333';
        this.ctx.font = 'bold 32px "Comic Neue", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('COSTUME STYLE', this.cardWidth / 2, sectionY + 40);
        
        // Draw color palette
        const colorSize = 40;
        const colorSpacing = 60;
        const totalWidth = costume.colors.length * colorSpacing;
        const startX = (this.cardWidth - totalWidth) / 2;
        
        costume.colors.forEach((color, index) => {
            const x = startX + index * colorSpacing + colorSize / 2;
            const y = sectionY + 80;
            
            // Draw color swatch
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x - colorSize / 2, y - colorSize / 2, colorSize, colorSize);
            
            // Draw border
            this.ctx.strokeStyle = '#333333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x - colorSize / 2, y - colorSize / 2, colorSize, colorSize);
        });
        
        // Draw costume description
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '18px "Comic Neue", cursive';
        this.ctx.textAlign = 'center';
        
        const words = costume.description.split(' ');
        const lineHeight = 22;
        const maxWidth = this.cardWidth - 120;
        let line = '';
        let y = sectionY + 140;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                this.ctx.fillText(line.trim(), this.cardWidth / 2, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        if (line.trim()) {
            this.ctx.fillText(line.trim(), this.cardWidth / 2, y);
        }
    }

    drawOrigin(origin) {
        const sectionY = 810;
        const sectionHeight = 280;
        
        // Draw section background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(40, sectionY, this.cardWidth - 80, sectionHeight);
        
        // Draw section title
        this.ctx.fillStyle = '#333333';
        this.ctx.font = 'bold 32px "Comic Neue", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ORIGIN STORY', this.cardWidth / 2, sectionY + 40);
        
        // Draw origin story text
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '16px "Comic Neue", cursive';
        this.ctx.textAlign = 'left';
        
        const words = origin.split(' ');
        const lineHeight = 20;
        const maxWidth = this.cardWidth - 120;
        const startX = 60;
        let line = '';
        let y = sectionY + 80;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                this.ctx.fillText(line.trim(), startX, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        if (line.trim()) {
            this.ctx.fillText(line.trim(), startX, y);
        }
    }

    drawBorder() {
        // Draw outer border
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 8;
        this.ctx.strokeRect(10, 10, this.cardWidth - 20, this.cardHeight - 20);
        
        // Draw inner border
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 20, this.cardWidth - 40, this.cardHeight - 40);
        
        // Draw corner decorations
        const cornerSize = 30;
        const corners = [
            [30, 30], [this.cardWidth - 30, 30],
            [30, this.cardHeight - 30], [this.cardWidth - 30, this.cardHeight - 30]
        ];
        
        corners.forEach(([x, y]) => {
            this.drawCornerDecoration(x, y, cornerSize);
        });
    }

    drawCornerDecoration(x, y, size) {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x, y - size);
        this.ctx.lineTo(x + size, y);
        this.ctx.lineTo(x, y + size);
        this.ctx.closePath();
        
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawWatermark() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.font = '14px "Comic Neue", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Generated by Superhero Identity Generator', this.cardWidth / 2, this.cardHeight - 30);
    }

    downloadCard(superheroName) {
        // Create download link
        const link = document.createElement('a');
        link.download = `${superheroName.replace(/[^a-zA-Z0-9]/g, '_')}_superhero_card.png`;
        
        // Convert canvas to blob and create download URL
        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            link.href = url;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up URL
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }, 'image/png', 1.0);
    }
}
