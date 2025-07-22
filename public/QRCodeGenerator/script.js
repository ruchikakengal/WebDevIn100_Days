// DOM elements
const qrText = document.getElementById('qr-text');
const generateBtn = document.getElementById('generate-btn');
const qrCodeDiv = document.querySelector('.qr-code');
const qrImg = document.getElementById('qr-img');
const downloadBtn = document.getElementById('download-btn');

// API URL for QR code generation
const apiUrl = 'https://api.qrserver.com/v1/create-qr-code/';

// Generate QR code function
function generateQRCode() {
    const text = qrText.value.trim();
    
    if (!text) {
        alert('Please enter text or URL');
        return;
    }
    
    // Show loading state
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;
    
    // Clear previous QR code
    qrImg.src = '';
    qrCodeDiv.classList.remove('active');
    downloadBtn.disabled = true;
    
    // Generate QR code with API
    const size = '200x200';
    const qrCodeUrl = `${apiUrl}?size=${size}&data=${encodeURIComponent(text)}`;
    
    // When image loads
    qrImg.onload = function() {
        qrCodeDiv.classList.add('active');
        generateBtn.textContent = 'Generate QR Code';
        generateBtn.disabled = false;
        downloadBtn.disabled = false;
    };
    
    // Set image source to API URL
    qrImg.src = qrCodeUrl;
}

// Download QR code function
function downloadQRCode() {
    if (!qrImg.src) return;
    
    const text = qrText.value.trim();
    const fileName = `qrcode-${text.substring(0, 15)}${text.length > 15 ? '...' : ''}.png`;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = qrImg.src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listeners
generateBtn.addEventListener('click', generateQRCode);
downloadBtn.addEventListener('click', downloadQRCode);

// Generate QR code on Enter key press
qrText.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        generateQRCode();
    }
});

// Clear QR code when input is cleared
qrText.addEventListener('input', function() {
    if (qrText.value.trim() === '' && qrCodeDiv.classList.contains('active')) {
        qrCodeDiv.classList.remove('active');
        downloadBtn.disabled = true;
    }
});