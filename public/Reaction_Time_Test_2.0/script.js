(() => {
  const COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
  const SHAPES = ['circle', 'square', 'triangle'];
  const MAX_TARGETS = 5; // number of shapes visible simultaneously at max level
  const BASE_TARGETS = 2; // start with 2 targets
  const BASE_SHOW_TIME = 2500; // how long targets stay displayed (ms) at level 1
  const MIN_SHOW_TIME = 900;   // min display time at max level
  const LEVELS = 8;            // total levels

  const levelEl = document.getElementById('level');
  const scoreEl = document.getElementById('score');
  const reactionEl = document.getElementById('reaction-time');
  const gameArea = document.getElementById('game-area');
  const startBtn = document.getElementById('start-btn');
  const messageEl = document.getElementById('message');
  const themeToggle = document.getElementById('theme-toggle');
  const successSound = document.getElementById('success-sound');
  const failSound = document.getElementById('fail-sound');

  let currentLevel = 1;
  let score = 0;
  let reactionStart = 0;
  let targets = [];
  let correctTarget = null;
  let waitingForReaction = false;
  let gameRunning = false;
  let reactionTimeout = null;

  // Light/Dark mode with persistence
  function applyTheme(dark) {
    if (dark) {
      document.body.classList.add('dark');
      themeToggle.checked = true;
    } else {
      document.body.classList.remove('dark');
      themeToggle.checked = false;
    }
  }
  applyTheme(localStorage.getItem('darkMode') === 'true');

  themeToggle.addEventListener('change', () => {
    applyTheme(themeToggle.checked);
    localStorage.setItem('darkMode', themeToggle.checked);
  });

  // Utility: random integer in range [min, max]
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate a random target (color + shape)
  function generateTarget() {
    const color = COLORS[randInt(0, COLORS.length - 1)];
    const shape = SHAPES[randInt(0, SHAPES.length - 1)];
    return { color, shape };
  }

  // Clear all targets from game area
  function clearTargets() {
    gameArea.innerHTML = '';
    targets = [];
    correctTarget = null;
    waitingForReaction = false;
  }

  // Check if position overlaps any existing ones
  function isOverlap(x, y, usedPositions) {
    for (const pos of usedPositions) {
      const [px, py] = pos.split('-').map(Number);
      const dx = x - px;
      const dy = y - py;
      if (Math.sqrt(dx * dx + dy * dy) < parseInt(getComputedStyle(document.documentElement).getPropertyValue('--target-size')) + 10) {
        return true;
      }
    }
    return false;
  }

  // Place targets randomly within the game area
  function placeTargets(count) {
    clearTargets();
    const areaRect = gameArea.getBoundingClientRect();
    const maxX = areaRect.width - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--target-size'));
    const maxY = areaRect.height - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--target-size'));

    let usedPositions = new Set();

    for (let i = 0; i < count; i++) {
      let target = generateTarget();

      // Ensure positions do not overlap visually
      let x, y;
      let tries = 0;
      do {
        x = randInt(10, maxX - 10);
        y = randInt(10, maxY - 10);
        tries++;
      } while (isOverlap(x, y, usedPositions) && tries < 100);
      usedPositions.add(`${x}-${y}`);

      targets.push(target);

      const targetEl = document.createElement('div');
      targetEl.classList.add('target', target.color, `shape-${target.shape}`);
      if (target.shape === 'triangle') {
        // Triangle uses borders so override width and height
        targetEl.style.width = '0px';
        targetEl.style.height = '0px';
      }
      targetEl.style.left = `${x}px`;
      targetEl.style.top = `${y}px`;
      targetEl.setAttribute('data-color', target.color);
      targetEl.setAttribute('data-shape', target.shape);
      targetEl.setAttribute('tabindex', '0');
      targetEl.setAttribute('role', 'button');
      targetEl.setAttribute('aria-label', `Target shape ${target.shape} color ${target.color}`);
      targetEl.addEventListener('click', onTargetClick);
      targetEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTargetClick(e);
        }
      });
      gameArea.appendChild(targetEl);
    }

    // Randomly select one correct target out of placed
    correctTarget = targets[randInt(0, targets.length - 1)];
  }

  // Show instruction message each round
  function showInstruction() {
    // Clear previous
    messageEl.textContent = '';

    setTimeout(() => {
      messageEl.textContent = `Click the ${correctTarget.color} ${correctTarget.shape}`;
    }, 300);
  }

  // Calculate show time based on level (decrease with progression)
  function getShowTime() {
    return Math.max(BASE_SHOW_TIME - ((currentLevel - 1) * 250), MIN_SHOW_TIME);
  }

  // Called when the player fails to react in time
  function failRound() {
    playSound(failSound);
    messageEl.textContent = "⌛ Time's up! Game Over.";
    setTimeout(() => endGame(false), 1500);
  }

  // Start a level round
  function startRound() {
    waitingForReaction = false;
    messageEl.textContent = '';
    const targetCount = Math.min(BASE_TARGETS + currentLevel - 1, MAX_TARGETS);
    placeTargets(targetCount);

    showInstruction();

    // Start reaction timer and enable clicks shortly after rendering/instruction
    setTimeout(() => {
      gameArea.style.pointerEvents = 'auto';
      reactionStart = performance.now();
      waitingForReaction = true;

      if (reactionTimeout) clearTimeout(reactionTimeout);
      reactionTimeout = setTimeout(() => {
        if (waitingForReaction) {
          waitingForReaction = false;
          failRound();
        }
      }, getShowTime());
    }, 350); // Delay slightly (350 ms) for targets + instruction to show properly
  }

  // Handle click on target
  function onTargetClick(e) {
    if (!gameRunning || !waitingForReaction) return;
    const el = e.currentTarget;
    const col = el.getAttribute('data-color');
    const shp = el.getAttribute('data-shape');

    waitingForReaction = false;
    gameArea.style.pointerEvents = 'none';

    const reactTime = Math.round(performance.now() - reactionStart);
    reactionEl.textContent = `Reaction Time: ${reactTime} ms`;

    if (col === correctTarget.color && shp === correctTarget.shape) {
      // Correct target
      playSound(successSound);
      score += Math.max(1000 - reactTime, 10);
      scoreEl.textContent = `Score: ${score}`;
      messageEl.textContent = '✔ Correct!';

      if (currentLevel === LEVELS) {
        setTimeout(() => endGame(true), 1500);
      } else {
        currentLevel++;
        levelEl.textContent = `Level: ${currentLevel}`;
        setTimeout(startRound, 1500);
      }
    } else {
      // Wrong target
      playSound(failSound);
      messageEl.textContent = '✘ Wrong target! Game Over.';
      setTimeout(() => endGame(false), 1500);
    }
  }

  // Play sound helper
  function playSound(soundEl) {
    if (!soundEl) return;
    soundEl.currentTime = 0;
    soundEl.play().catch(() => {});
  }

  // Start game handler
  function startGame() {
    currentLevel = 1;
    score = 0;
    gameRunning = true;
    levelEl.textContent = `Level: ${currentLevel}`;
    scoreEl.textContent = `Score: ${score}`;
    reactionEl.textContent = 'Reaction Time: 0 ms';
    messageEl.textContent = '';
    startBtn.disabled = true;
    startBtn.setAttribute('aria-pressed', 'true');
    gameArea.focus();
    startRound();
  }

  // End game handler
  function endGame(win) {
    gameRunning = false;
    waitingForReaction = false;
    startBtn.disabled = false;
    startBtn.setAttribute('aria-pressed', 'false');
    clearTargets();
    if (win) {
      messageEl.textContent = `🎉 Congratulations! You completed all ${LEVELS} levels with a score of ${score}.`;
    } else {
      messageEl.textContent += ` Your final score was ${score}. Press Start to try again.`;
    }
  }

  // Keyboard "start game" on main game area (space/enter)
  gameArea.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && !gameRunning) {
      e.preventDefault();
      startGame();
    }
  });

  startBtn.addEventListener('click', startGame);
})();
