class CardMaker {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentTheme = 'pink';
        this.isGenerating = false;
        
        this.themes = {
            pink: {
                background: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
                accent: '#ff416c',
                text: '#2c3e50',
                secondary: '#fff'
            },
            red: {
                background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                accent: '#fff',
                text: '#fff',
                secondary: '#ffcccb'
            },
            purple: {
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                accent: '#fff',
                text: '#fff',
                secondary: '#e6e6fa'
            },
            gold: {
                background: 'linear-gradient(135deg, #ffd89b, #19547b)',
                accent: '#fff',
                text: '#2c3e50',
                secondary: '#fff'
            }
        };
        
        this.setupEventListeners();
        this.initializeCanvas();
    }

    setupEventListeners() {
        const generateBtn = document.getElementById('generateCard');
        const downloadBtn = document.getElementById('downloadCard');
        const colorBtns = document.querySelectorAll('.color-btn');
        const inputs = ['cardTitle', 'cardMessage', 'senderName', 'recipientName'];

        generateBtn.addEventListener('click', () => {
            this.generateCard();
        });

        downloadBtn.addEventListener('click', () => {
            this.downloadCard();
        });

        colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTheme = btn.getAttribute('data-theme');
    
                if (!this.isGenerating && this.hasContent()) {
                    this.generateCard();
                }
            });
        });

        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            let timeout;
            
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (this.hasContent() && !this.isGenerating) {
                        this.generateCard();
                    }
                }, 500);
            });
        });
    }

    initializeCanvas() {
        this.canvas = document.getElementById('cardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 300;
        this.drawEmptyCard();
    }

    hasContent() {
        const title = document.getElementById('cardTitle').value.trim();
        const message = document.getElementById('cardMessage').value.trim();
        const sender = document.getElementById('senderName').value.trim();
        const recipient = document.getElementById('recipientName').value.trim();
        
        return title || message || sender || recipient;
    }

    async generateCard() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        const generateBtn = document.getElementById('generateCard');
        const downloadBtn = document.getElementById('downloadCard');
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="loading"></div> Generating...';

        const cardData = {
            title: document.getElementById('cardTitle').value.trim() || 'Happy Valentine\'s Day',
            message: document.getElementById('cardMessage').value.trim() || 'You make my heart smile every day!',
            sender: document.getElementById('senderName').value.trim() || 'Your Secret Admirer',
            recipient: document.getElementById('recipientName').value.trim() || 'Someone Special'
        };

        await this.drawCard(cardData);

        downloadBtn.style.display = 'inline-flex';
        
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Card';
        this.isGenerating = false;

        if (window.audioManager) {
            window.audioManager.playSound('success');
        }

        if (window.loveVerse) {
            window.loveVerse.showNotification('Card generated successfully!', 'success');
        }
    }

    async drawCard(cardData) {
        const theme = this.themes[this.currentTheme];
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        await this.drawGradientBackground(theme.background);
        this.drawDecorations(theme);
        this.drawTextContent(cardData, theme);
        this.drawBorder(theme);
        this.canvas.style.animation = 'scaleIn 0.6s ease-out';
    }

    async drawGradientBackground(gradientString) {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        if (gradientString.includes('#ff9a9e')) {
            gradient.addColorStop(0, '#ff9a9e');
            gradient.addColorStop(1, '#fecfef');
        } else if (gradientString.includes('#ff416c')) {
            gradient.addColorStop(0, '#ff416c');
            gradient.addColorStop(1, '#ff4b2b');
        } else if (gradientString.includes('#667eea')) {
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
        } else if (gradientString.includes('#ffd89b')) {
            gradient.addColorStop(0, '#ffd89b');
            gradient.addColorStop(1, '#19547b');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawDecorations(theme) {
      
        this.drawHeart(50, 50, 15, theme.accent);
        this.drawHeart(350, 50, 12, theme.secondary);
        this.drawHeart(370, 250, 10, theme.accent);
        this.drawHeart(30, 250, 8, theme.secondary);
        this.ctx.strokeStyle = theme.accent;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
        this.ctx.setLineDash([]);
    }

    drawHeart(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(x, y + topCurveHeight);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x - size / 2, y + (topCurveHeight + size / 2), x, y + (topCurveHeight + size / 2), x, y + size);
        this.ctx.bezierCurveTo(x, y + (topCurveHeight + size / 2), x + size / 2, y + (topCurveHeight + size / 2), x + size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);       
        this.ctx.fill();
    }

    drawTextContent(cardData, theme) {
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = theme.text;
        this.ctx.font = 'bold 24px "Dancing Script", cursive';
        this.ctx.fillText(cardData.title, this.canvas.width / 2, 80);
        this.ctx.font = '14px "Poppins", sans-serif';
        this.ctx.fillText(`To: ${cardData.recipient}`, this.canvas.width / 2, 110);
        this.ctx.font = '16px "Poppins", sans-serif';
        this.wrapText(cardData.message, this.canvas.width / 2, 150, 320, 20);
        this.ctx.font = 'italic 14px "Poppins", sans-serif';
        this.ctx.fillText(`From: ${cardData.sender}`, this.canvas.width / 2, 260);
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        this.ctx.fillText(line, x, currentY);
    }

    drawBorder(theme) {
        this.ctx.strokeStyle = theme.accent;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
        this.ctx.strokeStyle = theme.secondary;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(15, 15, this.canvas.width - 30, this.canvas.height - 30);
    }

    drawEmptyCard() {
        const theme = this.themes[this.currentTheme];
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '20px "Poppins", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Your card will appear here', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
    }

    downloadCard() {
        const link = document.createElement('a');
        link.download = 'valentine-card.png';
        link.href = this.canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (window.audioManager) {
            window.audioManager.playSound('success');
        }
        
        if (window.loveVerse) {
            window.loveVerse.showNotification('Card downloaded successfully!', 'success');
        }
        
        this.saveToHistory();
    }

    saveToHistory() {
        const history = JSON.parse(localStorage.getItem('card-history') || '[]');
        const cardData = {
            date: new Date().toISOString(),
            title: document.getElementById('cardTitle').value.trim(),
            message: document.getElementById('cardMessage').value.trim(),
            sender: document.getElementById('senderName').value.trim(),
            recipient: document.getElementById('recipientName').value.trim(),
            theme: this.currentTheme
        };
        
        history.unshift(cardData);
        
        if (history.length > 20) {
            history.splice(20);
        }
        
        localStorage.setItem('card-history', JSON.stringify(history));
    }

    getHistory() {
        return JSON.parse(localStorage.getItem('card-history') || '[]');
    }

    clearForm() {
        document.getElementById('cardTitle').value = '';
        document.getElementById('cardMessage').value = '';
        document.getElementById('senderName').value = '';
        document.getElementById('recipientName').value = '';
        
        this.drawEmptyCard();
        document.getElementById('downloadCard').style.display = 'none';
    }

    loadTemplate(template) {
        const templates = {
            romantic: {
                title: 'My Dearest Love',
                message: 'Every moment with you feels like a beautiful dream come true. You are my heart, my soul, my everything.',
                sender: 'Your Forever Love'
            },
            playful: {
                title: 'Hey You!',
                message: 'You make my heart do little happy dances! Thanks for being absolutely amazing and wonderfully you.',
                sender: 'Your Biggest Fan'
            },
            classic: {
                title: 'Happy Valentine\'s Day',
                message: 'Roses are red, violets are blue, no one in this world is more special than you!',
                sender: 'With Love'
            }
        };
        
        if (templates[template]) {
            const t = templates[template];
            document.getElementById('cardTitle').value = t.title;
            document.getElementById('cardMessage').value = t.message;
            document.getElementById('senderName').value = t.sender;
            setTimeout(() => this.generateCard(), 100);
        }
    }

    init() {
        this.clearForm();
        this.currentTheme = 'pink';
        
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-theme="pink"]').classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cardMaker = new CardMaker();
});