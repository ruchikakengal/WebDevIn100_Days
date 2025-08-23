(() => {
  const COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
  const ROWS = 8;
  const COLS = 8;
  const BASE_TIME = 60; // seconds for level 1
  const TIME_DECREASE = 5; // seconds less per level, min 15 seconds
  const MIN_GROUP = 3;
  const LEVEL_SCORE_MULTIPLIER = 1.5;
  const MAX_LEVEL = 5;

  const gameBoardEl = document.getElementById('game-board');
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const timerEl = document.getElementById('timer');
  const messageEl = document.getElementById('message');
  const startBtn = document.getElementById('start-btn');
  const instructionsEl = document.getElementById('instructions');
  const gameOverCard = document.getElementById('game-over-card');
  const finalScoreEl = document.getElementById('final-score');
  const restartBtn = document.getElementById('restart-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const popSound = document.getElementById('pop-sound');

  let grid = [];
  let score = 0;
  let level = 1;
  let timeLeft = BASE_TIME;
  let timer = null;
  let isGameActive = false;

  // Theme handling with localStorage persistence
  function applyTheme(darkMode) {
    if (darkMode) {
      document.body.classList.add('dark');
      themeToggle.checked = true;
    } else {
      document.body.classList.remove('dark');
      themeToggle.checked = false;
    }
  }

  applyTheme(localStorage.getItem('bubblePopDarkMode') === 'true');

  themeToggle.addEventListener('change', () => {
    applyTheme(themeToggle.checked);
    localStorage.setItem('bubblePopDarkMode', themeToggle.checked);
  });

  function createGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        row.push({ color, id: `${r}-${c}` });
      }
      grid.push(row);
    }
  }

  function renderGrid() {
    gameBoardEl.innerHTML = '';
    gameBoardEl.style.gridTemplateColumns = `repeat(${COLS}, var(--bubble-size))`;
    grid.forEach((row, r) => {
      row.forEach((bubbleData, c) => {
        const bubble = document.createElement('div');
        bubble.className = `bubble ${bubbleData.color}`;
        bubble.setAttribute('data-row', r);
        bubble.setAttribute('data-col', c);
        bubble.setAttribute('role', 'button');
        bubble.setAttribute('tabindex', '0');
        bubble.setAttribute('aria-label', `Bubble color ${bubbleData.color}`);
        bubble.addEventListener('click', onBubbleClick);
        bubble.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBubbleClick(e);
          }
        });
        gameBoardEl.appendChild(bubble);
      });
    });
  }

  function findConnected(r, c, color, visited = new Set()) {
    if (
      r < 0 || c < 0 || r >= ROWS || c >= COLS ||
      visited.has(`${r}-${c}`) ||
      !grid[r] || !grid[r][c] ||
      grid[r][c].color !== color
    ) {
      return [];
    }
    visited.add(`${r}-${c}`);
    let connected = [`${r}-${c}`];
    connected = connected.concat(findConnected(r - 1, c, color, visited));
    connected = connected.concat(findConnected(r + 1, c, color, visited));
    connected = connected.concat(findConnected(r, c - 1, color, visited));
    connected = connected.concat(findConnected(r, c + 1, color, visited));
    return connected;
  }

  function playPopSound() {
    if (popSound) {
      popSound.currentTime = 0;
      popSound.play().catch(() => {});
    }
  }

  function popBubbles(keys) {
    keys.forEach(key => {
      const [r, c] = key.split('-').map(Number);
      const bubbleEl = gameBoardEl.querySelector(`.bubble[data-row="${r}"][data-col="${c}"]`);
      if (bubbleEl) {
        bubbleEl.classList.add('pop');
      }
    });
    playPopSound();
    setTimeout(() => {
      keys.forEach(key => {
        const [r, c] = key.split('-').map(Number);
        grid[r][c] = null;
      });
      collapseGrid();
      refillGrid();
      renderGrid();
    }, 300);
  }

  function collapseGrid() {
    for (let c = 0; c < COLS; c++) {
      let col = [];
      for (let r = 0; r < ROWS; r++) {
        if (grid[r][c]) col.push(grid[r][c]);
      }
      while (col.length < ROWS) {
        col.unshift(null);
      }
      for (let r = 0; r < ROWS; r++) {
        grid[r][c] = col[r];
      }
    }
  }

  function refillGrid() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!grid[r][c]) {
          grid[r][c] = { color: COLORS[Math.floor(Math.random() * COLORS.length)], id: `new-${Math.random()}` };
        }
      }
    }
  }

  function movesAvailable() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const bubble = grid[r][c];
        if (!bubble) continue;
        const connected = findConnected(r, c, bubble.color);
        if (connected.length >= MIN_GROUP) return true;
      }
    }
    return false;
  }

  function onBubbleClick(e) {
    if (!isGameActive) return;
    const bubble = e.currentTarget;
    const r = +bubble.getAttribute('data-row');
    const c = +bubble.getAttribute('data-col');
    const bubbleData = grid[r][c];
    if (!bubbleData) return;

    const connected = findConnected(r, c, bubbleData.color);
    if (connected.length >= MIN_GROUP) {
      popBubbles(connected);
      incrementScore(connected.length);
      if (!movesAvailable()) {
        levelUp();
      }
    } else {
      flashMessage('Select 3 or more matching bubbles to pop', true);
    }
  }

  function incrementScore(poppedCount) {
    score += Math.floor(poppedCount * 10 * level * LEVEL_SCORE_MULTIPLIER);
    scoreEl.textContent = `Score: ${score}`;
  }

  function tick() {
    if (!isGameActive) return;
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame(false);
    }
  }

  // Start button click handler to show instructions, then start
  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    instructionsEl.style.display = 'block';

    setTimeout(() => {
      instructionsEl.style.display = 'none';
      startGame();
    }, 3500);
  });

  function startGame() {
    score = 0;
    level = 1;
    timeLeft = BASE_TIME;
    isGameActive = true;
    scoreEl.textContent = `Score: ${score}`;
    levelEl.textContent = `Level: ${level}`;
    timerEl.textContent = `Time: ${timeLeft}`;
    messageEl.textContent = '';
    gameOverCard.style.display = 'none';
    startBtn.style.display = 'none';
    createGrid();
    renderGrid();

    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  function endGame(won) {
    isGameActive = false;
    clearInterval(timer);
    gameOverCard.style.display = 'block';
    messageEl.style.display = 'none';
    startBtn.style.display = 'none';
    instructionsEl.style.display = 'none';
    gameBoardEl.style.pointerEvents = 'none';

    if (won) {
      finalScoreEl.textContent = `🎉 Congrats! You completed all ${MAX_LEVEL} levels with a score of ${score}!`;
    } else {
      finalScoreEl.textContent = `Game Over! Your final score is ${score}.`;
    }
  }

  restartBtn.addEventListener('click', () => {
    score = 0;
    level = 1;
    timeLeft = BASE_TIME;
    scoreEl.textContent = `Score: ${score}`;
    levelEl.textContent = `Level: ${level}`;
    timerEl.textContent = `Time: ${timeLeft}`;
    messageEl.style.display = 'block';
    messageEl.textContent = '';
    gameOverCard.style.display = 'none';
    startBtn.style.display = 'block';
    gameBoardEl.innerHTML = '';
    gameBoardEl.style.pointerEvents = 'auto';
  });

  function levelUp() {
    clearInterval(timer);
    endGame(true); // show level complete message, can customize to continue levels if desired
  }

  function flashMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.style.color = isError ? '#e74c3c' : '';
    messageEl.classList.add('shake');
    setTimeout(() => {
      messageEl.classList.remove('shake');
      messageEl.style.color = '';
      if (!isGameActive) messageEl.textContent = '';
    }, 900);
  }

  messageEl.style.willChange = 'transform';
})();