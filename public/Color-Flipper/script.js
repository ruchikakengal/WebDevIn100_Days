const btn = document.getElementById('flipBtn');
const chip = document.getElementById('colorChip');
const toast = document.getElementById('toast');

function randomHex() {
  return '#'+Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0').toUpperCase();
}
function setColor(hex) {
  document.body.style.background = hex;
  chip.textContent = hex;
}

btn.addEventListener('click', () => setColor(randomHex()));

chip.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(chip.textContent.trim());
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 800);
  } catch(e) {
    console.warn('Clipboard not available', e);
  }
});

// initial color
setColor('#3498DB');