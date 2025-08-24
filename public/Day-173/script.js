const canvas = document.getElementById('signingBoard');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushColor = '#000';
let brushSize = 2;
let textMode = false;
let textInput = '';
let undoStack = [];
let redoStack = [];

// Resize canvas function
function resizeCanvas() {
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    canvas.width = canvasWrapper.clientWidth;
    canvas.height = canvas.width * (2/3); // Keep a consistent aspect ratio (e.g., 600x400)
    restoreCanvas();
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Save canvas state for undo/redo
function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack
}

// Restore canvas from saved state
function restoreCanvas() {
    if (undoStack.length) {
        const img = new Image();
        img.src = undoStack[undoStack.length - 1];
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function startDrawing(e) {
    isDrawing = true;
    saveState();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing || textMode) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}

function clearCanvas() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveToLocalStorage() {
    const dataURL = canvas.toDataURL();
    localStorage.setItem('signature', dataURL);
    alert('Signature saved!');
}

function loadFromLocalStorage() {
    const dataURL = localStorage.getItem('signature');
    if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    } else {
        alert('No saved signature found!');
    }
}

function downloadImage() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
}

function loadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                saveState();
                // Calculate the aspect ratio and fit the image within the canvas
                const aspectRatio = img.width / img.height;
                let newWidth = canvas.width;
                let newHeight = canvas.height;
                if (aspectRatio > 1) {
                    newHeight = canvas.width / aspectRatio;
                } else {
                    newWidth = canvas.height * aspectRatio;
                }
                // Clear the canvas before drawing the new image
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw the image onto the canvas, centered
                ctx.drawImage(img, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight);
            };
        };
        reader.readAsDataURL(file);
    }
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(undoStack.pop());
        clearCanvas();
        if (undoStack.length > 0) {
            const img = new Image();
            img.src = undoStack[undoStack.length - 1];
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        const img = new Image();
        img.src = undoStack[undoStack.length - 1];
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function addText() {
    if (textInput) {
        saveState();
        ctx.font = `${brushSize * 10}px Arial`;
        ctx.fillStyle = brushColor;
        ctx.fillText(textInput, canvas.width / 2, canvas.height / 2);
        textInput = '';
        document.getElementById('textInput').value = '';
    }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

document.getElementById('clearBtn').addEventListener('click', clearCanvas);
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);
document.getElementById('saveBtn').addEventListener('click', saveToLocalStorage);
document.getElementById('loadBtn').addEventListener('click', loadFromLocalStorage);
document.getElementById('downloadBtn').addEventListener('click', downloadImage);
document.getElementById('uploadBtn').addEventListener('change', loadImage);

document.getElementById('colorPicker').addEventListener('input', (e) => brushColor = e.target.value);
document.getElementById('brushSize').addEventListener('input', (e) => brushSize = e.target.value);
document.getElementById('textInput').addEventListener('input', (e) => {
    textMode = true;
    textInput = e.target.value;
});
document.getElementById('addTextBtn').addEventListener('click', addText);