// elements
const qrText = document.getElementById('qr-text');
const generateBtn = document.getElementById('generate-btn');
const qrCodeDiv = document.querySelector('.qr-code');
const qrImg = document.getElementById('qr-img');
const downloadBtn = document.getElementById('download-btn');

const apiUrl = 'https://api.qrserver.com/v1/create-qr-code/';


function generateQRCode() {
    const text = qrText.value.trim();
    
    if (!text) {
        alert('Please enter text or URL');
        return;
    }
    
    
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;
    
    qrImg.src = '';
    qrCodeDiv.classList.remove('active');
    downloadBtn.disabled = true;
    
    const size = '200x200';
    const qrCodeUrl = `${apiUrl}?size=${size}&data=${encodeURIComponent(text)}`;
    
    qrImg.onload = function() {
        qrCodeDiv.classList.add('active');
        generateBtn.textContent = 'Generate QR Code';
        generateBtn.disabled = false;
        downloadBtn.disabled = false;
    };
    
    qrImg.src = qrCodeUrl;
}

function downloadQRCode() {
    if (!qrImg.src) return;
    
    const text = qrText.value.trim();
    const fileName = `qrcode-${text.substring(0, 15)}${text.length > 15 ? '...' : ''}.png`;
    
    const link = document.createElement('a');
    link.href = qrImg.src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

generateBtn.addEventListener('click', generateQRCode);
downloadBtn.addEventListener('click', downloadQRCode);

qrText.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        generateQRCode();
    }
});

qrText.addEventListener('input', function() {
    if (qrText.value.trim() === '' && qrCodeDiv.classList.contains('active')) {
        qrCodeDiv.classList.remove('active');
        downloadBtn.disabled = true;
    }
});