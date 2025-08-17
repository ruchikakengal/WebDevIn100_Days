const colorPicker = document.getElementById("colorPicker");
const generateBtn = document.getElementById("generateBtn");
const palette = document.getElementById("palette");

// Utility: Generate shades of base color
function generateShades(hex, count = 6) {
  const shades = [];
  let base = hex.replace("#", "");
  let r = parseInt(base.substr(0, 2), 16);
  let g = parseInt(base.substr(2, 2), 16);
  let b = parseInt(base.substr(4, 2), 16);

  for (let i = 0; i < count; i++) {
    let factor = 1 - i * 0.1;
    let newR = Math.round(r * factor);
    let newG = Math.round(g * factor);
    let newB = Math.round(b * factor);
    shades.push(rgbToHex(newR, newG, newB));
  }

  return shades;
}

// RGB to Hex
function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Display the palette
function renderPalette(colors) {
  palette.innerHTML = "";
  colors.forEach((color) => {
    const box = document.createElement("div");
    box.classList.add("color-box");
    box.style.backgroundColor = color;

    const label = document.createElement("div");
    label.classList.add("color-code");
    label.innerText = color;

    box.appendChild(label);
    palette.appendChild(box);

    // Copy on click
    box.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      alert(`Copied: ${color}`);
    });
  });
}

// Trigger
generateBtn.addEventListener("click", () => {
  const selectedColor = colorPicker.value;
  const shades = generateShades(selectedColor);
  renderPalette(shades);
});

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  const initialShades = generateShades(colorPicker.value);
  renderPalette(initialShades);
});
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

const colors = ['#ffffff', '#00e5ff', '#ff6ec4', '#ffe57f', '#81ecec', '#a29bfe'];

function Particle(x, y, dx, dy, size, color, glow) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.size = size;
  this.color = color;
  this.glow = glow;

  this.update = () => {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

    this.draw();
  };

  this.draw = () => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.glow;
    ctx.fill();
  };
}

function initParticles() {
  particlesArray = [];
  const numParticles = 80;

  for (let i = 0; i < numParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dx = (Math.random() - 0.5) * 0.5;
    const dy = (Math.random() - 0.5) * 0.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const glow = Math.random() * 25 + 10;

    particlesArray.push(new Particle(x, y, dx, dy, size, color, glow));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

