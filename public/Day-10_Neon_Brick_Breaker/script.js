const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const messageButton = document.getElementById('messageButton');
const powerUpTimersElement = document.getElementById('powerUpTimers');

// --- Game Settings ---
let score = 0;
let lives = 3;
let level = 1;
let gamePaused = true;
let gameOver = false;
let gameWon = false;
let rightPressed = false;
let leftPressed = false;
let animationFrameId;
let activePowerUps = {}; // To track active power-ups and their timers
let fallingPowerUps = []; // To track falling power-ups

// --- Sound Synthesis (Tone.js) ---
const synth = new Tone.Synth().toDestination();
const metalSynth = new Tone.MetalSynth({
  frequency: 150,
  envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
  harmonicity: 3.1,
  modulationIndex: 16,
  resonance: 4000,
  octaves: 1.5,
}).toDestination();
metalSynth.volume.value = -15; // Lower volume for metal synth

const powerUpSynth = new Tone.FMSynth({
  harmonicity: 3.01,
  modulationIndex: 14,
  carrier: {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.05 },
  },
  modulator: {
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.05 },
  },
}).toDestination();
powerUpSynth.volume.value = -10;

function playSound(type) {
  // Ensure Tone.js context is started by user interaction
  if (Tone.context.state !== 'running') {
    Tone.start();
  }

  try {
    switch (type) {
      case 'paddle':
        synth.triggerAttackRelease('C4', '16n');
        break;
      case 'brick':
        metalSynth.triggerAttackRelease('8n');
        break;
      case 'wall':
        synth.triggerAttackRelease('E3', '16n');
        break;
      case 'powerup':
        powerUpSynth.triggerAttackRelease('C5', '8n');
        break;
      case 'loseLife':
        synth.triggerAttackRelease('C3', '4n');
        break;
      case 'gameOver':
        synth.triggerAttackRelease('G2', '2n');
        break;
      case 'levelUp':
        powerUpSynth.triggerAttackRelease('G5', '4n');
        break;
    }
  } catch (error) {
    console.error('Tone.js error:', error);
  }
}

// --- Ball Properties ---
let balls = []; // Array to hold multiple balls
const initialBallRadius = 8;
const initialBallSpeed = 4;

function createBall(
  x,
  y,
  dx,
  dy,
  radius = initialBallRadius,
  speed = initialBallSpeed,
  isFireball = false,
  fireballTimer = 0
) {
  return {
    x: x,
    y: y,
    dx: (dx * speed) / initialBallSpeed, // Scale speed correctly
    dy: (dy * speed) / initialBallSpeed,
    radius: radius,
    speed: speed, // Store original speed for reference
    color: '#00ffcc', // Neon cyan
    glow: '#00ffcc',
    isFireball: isFireball,
    fireballDuration: 5000, // 5 seconds in milliseconds
    fireballTimer: fireballTimer,
    trail: [], // For motion trail effect
  };
}

function resetBall(ballInstance = null) {
  // Reset a specific ball or all balls if none specified
  if (ballInstance) {
    ballInstance.x = paddle.x + paddle.width / 2;
    ballInstance.y = paddle.y - ballInstance.radius - 2;
    ballInstance.dx =
      (Math.random() < 0.5 ? 1 : -1) * initialBallSpeed * Math.cos(Math.PI / 4); // Random initial angle
    ballInstance.dy = -initialBallSpeed * Math.sin(Math.PI / 4);
    ballInstance.isFireball = false;
    ballInstance.fireballTimer = 0;
    ballInstance.speed = initialBallSpeed; // Reset speed
    ballInstance.radius = initialBallRadius; // Reset radius
    ballInstance.color = '#00ffcc';
    ballInstance.glow = '#00ffcc';
  } else {
    balls = [
      createBall(
        paddle.x + paddle.width / 2,
        paddle.y - initialBallRadius - 2,
        initialBallSpeed * Math.cos(Math.PI / 4),
        -initialBallSpeed * Math.sin(Math.PI / 4)
      ),
    ];
  }
}

// --- Paddle Properties ---
const initialPaddleHeight = 12;
const initialPaddleWidth = 90;
const paddleY = canvas.height - initialPaddleHeight - 20; // Positioned lower
let paddle = {
  height: initialPaddleHeight,
  width: initialPaddleWidth,
  x: (canvas.width - initialPaddleWidth) / 2,
  y: paddleY,
  color: 'rgba(0, 150, 200, 0.8)', // Semi-transparent blue
  glow: '#00aaff', // Light blue glow
  speed: 7,
  expandTimer: 0,
  expandDuration: 10000, // 10 seconds
};

// --- Brick Properties ---
const brickRowCount = 5;
const brickColumnCount = 8;
const brickPadding = 5; // Reduced padding
const brickOffsetTop = 40;
const brickOffsetLeft = 30;
const brickWidth =
  (canvas.width - 2 * brickOffsetLeft - (brickColumnCount - 1) * brickPadding) /
  brickColumnCount;
const brickHeight = 20;
let bricks = [];

const brickStyles = [
  {
    type: 'glass',
    color: 'rgba(100, 200, 255, 0.7)',
    glow: '#64C8FF',
    health: 1,
  }, // Light Blue Glass
  {
    type: 'metal',
    color: 'rgba(180, 180, 190, 0.9)',
    glow: '#E0E0E0',
    health: 2,
  }, // Silver Metal
  { type: 'glow', color: 'rgba(255, 100, 0, 0.8)', glow: '#FF6400', health: 1 }, // Orange Glow
  {
    type: 'hardened',
    color: 'rgba(100, 100, 120, 0.9)',
    glow: '#C0C0C0',
    health: 3,
  }, // Dark Metal
  {
    type: 'crystal',
    color: 'rgba(200, 0, 255, 0.7)',
    glow: '#C800FF',
    health: 1,
  }, // Purple Crystal
];

function createBricks(level) {
  bricks = [];
  const styleCount = brickStyles.length;
  // Basic level progression: add more rows or harder bricks
  const rowsToCreate = Math.min(brickRowCount + Math.floor(level / 2), 8); // Add rows up to 8

  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rowsToCreate; r++) {
      const brickX = brickOffsetLeft + c * (brickWidth + brickPadding);
      const brickY = brickOffsetTop + r * (brickHeight + brickPadding);
      // Alternate styles or make harder based on level/row
      let styleIndex = (r + c + level) % styleCount;
      // Increase health for higher levels slightly
      let health = brickStyles[styleIndex].health + Math.floor(level / 3);
      if (level > 5 && Math.random() < 0.2) health++; // Randomly make some bricks tougher

      bricks[c][r] = {
        x: brickX,
        y: brickY,
        width: brickWidth,
        height: brickHeight,
        status: 1, // 1: active, 0: broken
        style: brickStyles[styleIndex],
        health: health,
        initialHealth: health, // Store initial health for color calculation
        breaking: false, // For animation flag
      };
    }
  }
}

// --- Power-Up Definitions ---
const powerUpTypes = [
  { type: 'expand', color: '#00ff00', glow: '#33ff33', symbol: '↔️' }, // Green - Expand Paddle
  { type: 'multi', color: '#ffff00', glow: '#ffff66', symbol: '•••' }, // Yellow - Multi-ball
  { type: 'fire', color: '#ff0000', glow: '#ff3333', symbol: '🔥' }, // Red - Fireball
];
const powerUpDropChance = 0.2; // 20% chance to drop a power-up
const powerUpSpeed = 2;

function createPowerUp(x, y) {
  const randomType =
    powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
  fallingPowerUps.push({
    x: x,
    y: y,
    width: 20,
    height: 20,
    type: randomType.type,
    color: randomType.color,
    glow: randomType.glow,
    symbol: randomType.symbol, // Add symbol
    speed: powerUpSpeed,
  });
}

function activatePowerUp(type) {
  const now = Date.now();
  playSound('powerup');

  switch (type) {
    case 'expand':
      paddle.width = initialPaddleWidth * 1.5;
      paddle.expandTimer = now + paddle.expandDuration;
      activePowerUps['expand'] = paddle.expandTimer;
      // Ensure paddle doesn't go off-screen
      if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
      }
      break;
    case 'multi':
      const currentBalls = balls.length;
      // Limit max balls to avoid chaos
      const ballsToAdd = Math.min(2, 5 - currentBalls); // Add up to 2 more balls, max 5 total

      for (let i = 0; i < ballsToAdd; i++) {
        // Find an existing ball to split from (ideally the first active one)
        const sourceBall = balls.find((b) => b.y < canvas.height); // Find a ball still in play
        if (sourceBall) {
          // Create new balls near the source ball with slightly different angles
          const angleOffset =
            (Math.PI / 12) * (i + 1) * (Math.random() < 0.5 ? 1 : -1); // +/- 15 degrees offset
          const speed = Math.sqrt(sourceBall.dx ** 2 + sourceBall.dy ** 2);
          const currentAngle = Math.atan2(sourceBall.dy, sourceBall.dx);
          const newAngle = currentAngle + angleOffset;

          balls.push(
            createBall(
              sourceBall.x,
              sourceBall.y,
              Math.cos(newAngle), // dx component based on new angle
              Math.sin(newAngle), // dy component based on new angle
              sourceBall.radius,
              speed, // Use the source ball's speed
              sourceBall.isFireball, // Inherit fireball status
              sourceBall.fireballTimer // Inherit timer
            )
          );
        } else {
          // If no active ball found (unlikely), create a default new ball
          balls.push(
            createBall(
              paddle.x + paddle.width / 2,
              paddle.y - initialBallRadius - 2,
              initialBallSpeed * Math.cos(Math.PI / 3),
              -initialBallSpeed * Math.sin(Math.PI / 3)
            )
          );
        }
      }
      break;
    case 'fire':
      balls.forEach((ball) => {
        ball.isFireball = true;
        ball.fireballTimer = now + ball.fireballDuration;
        ball.color = '#ff6600'; // Orange fireball color
        ball.glow = '#ff3300'; // Red glow
        activePowerUps['fire'] = ball.fireballTimer; // Track the *last* activation time
      });
      break;
  }
  updatePowerUpTimers();
}

function deactivatePowerUp(type) {
  delete activePowerUps[type]; // Remove from active list
  switch (type) {
    case 'expand':
      paddle.width = initialPaddleWidth;
      paddle.expandTimer = 0;
      // Recenter paddle if needed after shrinking
      if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
      } else if (paddle.x < 0) {
        paddle.x = 0;
      }
      break;
    case 'fire':
      // Only deactivate if no other fireball powerup is active
      if (!Object.keys(activePowerUps).includes('fire')) {
        balls.forEach((ball) => {
          ball.isFireball = false;
          ball.fireballTimer = 0;
          ball.color = '#00ffcc'; // Revert to normal color
          ball.glow = '#00ffcc';
        });
      }
      break;
    // Multi-ball doesn't have a timed deactivation, balls just get lost
  }
  updatePowerUpTimers();
}

function updatePowerUpTimers() {
  powerUpTimersElement.innerHTML = '';
  const now = Date.now();
  for (const type in activePowerUps) {
    const expiryTime = activePowerUps[type];
    const timeLeft = Math.max(0, Math.ceil((expiryTime - now) / 1000));
    if (timeLeft > 0) {
      const li = document.createElement('li');
      let name = type.charAt(0).toUpperCase() + type.slice(1);
      if (type === 'fire') name = 'Fireball';
      if (type === 'expand') name = 'Wide Paddle';
      li.textContent = `${name}: ${timeLeft}s`;
      powerUpTimersElement.appendChild(li);
    } else {
      // Timer expired, deactivate
      deactivatePowerUp(type);
    }
  }
}

// --- Drawing Functions ---
function drawBall(ball) {
  // Trail effect
  ball.trail.push({ x: ball.x, y: ball.y });
  if (ball.trail.length > 10) {
    // Limit trail length
    ball.trail.shift();
  }

  // Draw trail
  for (let i = 0; i < ball.trail.length; i++) {
    const alpha = (i / ball.trail.length) * 0.5; // Fade out
    ctx.beginPath();
    ctx.arc(
      ball.trail[i].x,
      ball.trail[i].y,
      ball.radius * (i / ball.trail.length),
      0,
      Math.PI * 2
    );
    ctx.fillStyle = ball.isFireball
      ? `rgba(255, 100, 0, ${alpha})`
      : `rgba(0, 255, 204, ${alpha})`;
    ctx.fill();
    ctx.closePath();
  }

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  // Glowing effect
  ctx.shadowBlur = 15;
  ctx.shadowColor = ball.glow;
  ctx.fill();
  ctx.closePath();
  // Reset shadow for other elements
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = paddle.color;
  ctx.strokeStyle = paddle.glow; // Outline glow
  ctx.lineWidth = 2;
  // Glowing effect
  ctx.shadowBlur = 10;
  ctx.shadowColor = paddle.glow;
  ctx.fill();
  ctx.stroke(); // Draw the glowing outline
  ctx.closePath();
  // Reset shadow and line width
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 1;
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < bricks[c]?.length; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);

        // Calculate color based on health (fade towards a darker shade)
        const healthRatio = brick.health / brick.initialHealth;
        const baseColor = brick.style.color.match(
          /rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/
        );
        if (baseColor) {
          const rVal = Math.floor(parseInt(baseColor[1]) * healthRatio);
          const gVal = Math.floor(parseInt(baseColor[2]) * healthRatio);
          const bVal = Math.floor(parseInt(baseColor[3]) * healthRatio);
          const alpha = parseFloat(baseColor[4]);
          ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
        } else {
          ctx.fillStyle = brick.style.color; // Fallback
        }

        // Apply subtle 3D effect / highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Top/Left highlight
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height); // Draw highlight border first

        ctx.shadowBlur = 5;
        ctx.shadowColor = brick.style.glow;
        ctx.fill(); // Fill the main color

        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.closePath();

        // Add breaking class if needed (handled in collision logic)
        // This part is tricky with canvas, requires manual animation or pre-rendering frames
        // For simplicity, we'll just make it disappear on break.
        // A simple scale-down effect could be added in the draw loop if brick.breaking is true.
      }
    }
  }
}

function drawFallingPowerUps() {
  fallingPowerUps.forEach((p) => {
    ctx.beginPath();
    // Draw a simple shape (circle)
    ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    // Glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.glow;
    ctx.fill();
    ctx.closePath();

    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // Draw symbol inside (optional, requires good font alignment)
    ctx.fillStyle = '#000'; // Black symbol
    ctx.font = '12px Arial'; // Use a standard font for symbols
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.symbol, p.x + p.width / 2, p.y + p.height / 2 + 1); // Adjust position slightly
  });
}

// --- Collision Detection ---
function collisionDetection() {
  let activeBricksCount = 0;

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < bricks[c]?.length; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        activeBricksCount++;
        balls.forEach((ball) => {
          if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height
          ) {
            if (ball.isFireball) {
              // Fireball destroys brick instantly, no bounce
              brick.status = 0;
              score += 10;
              playSound('brick'); // Still play sound
              // Chance to drop power-up
              if (Math.random() < powerUpDropChance) {
                createPowerUp(
                  brick.x + brick.width / 2,
                  brick.y + brick.height / 2
                );
              }
            } else {
              // Regular ball collision
              playSound('brick');
              ball.dy = -ball.dy; // Reverse vertical direction
              brick.health--;
              score += 5; // Less score for just hitting

              if (brick.health <= 0) {
                brick.status = 0;
                score += 5; // Bonus for destroying
                // Chance to drop power-up
                if (Math.random() < powerUpDropChance) {
                  createPowerUp(
                    brick.x + brick.width / 2,
                    brick.y + brick.height / 2
                  );
                }
              }
            }
            updateScore();
          }
        });
      }
    }
  }

  // Check for win condition
  if (activeBricksCount === 0 && !gameWon) {
    level++;
    playSound('levelUp');
    showMessage(`Level ${level}!`, true); // Pause for next level
    // Keep powerups active between levels for now
    createBricks(level);
    resetBall(); // Reset ball position for the new level
    // Keep paddle position and size
  }
}

// --- Game Logic Update ---
function update() {
  if (gamePaused || gameOver || gameWon) return; // Don't update if paused or finished

  const now = Date.now();

  // --- Paddle Movement ---
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.speed;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }

  // --- Power-Up Timers ---
  if (paddle.expandTimer > 0 && now > paddle.expandTimer) {
    deactivatePowerUp('expand');
  }
  // Check fireball timer on each ball
  let anyFireballActive = false;
  balls.forEach((ball) => {
    if (ball.isFireball && ball.fireballTimer > 0 && now > ball.fireballTimer) {
      // Check if this specific ball's timer expired
      ball.isFireball = false;
      ball.fireballTimer = 0;
      ball.color = '#00ffcc';
      ball.glow = '#00ffcc';
    }
    if (ball.isFireball) {
      anyFireballActive = true; // Mark if any ball is still a fireball
    }
  });
  // If no balls are fireballs anymore, ensure the power-up is marked inactive
  if (!anyFireballActive && activePowerUps['fire']) {
    deactivatePowerUp('fire'); // This updates the UI timer list
  } else {
    updatePowerUpTimers(); // Update timers display continuously
  }

  // --- Ball Movement & Collision ---
  balls.forEach((ball, index) => {
    // Wall collisions (left/right)
    if (
      ball.x + ball.dx > canvas.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      ball.dx = -ball.dx;
      playSound('wall');
    }

    // Wall collision (top)
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
      playSound('wall');
    }
    // Bottom collision (paddle or lose life)
    else if (ball.y + ball.radius > canvas.height - paddle.height - 15) {
      // Check near paddle height first
      if (
        ball.x + ball.radius > paddle.x &&
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y + ball.radius > paddle.y
      ) {
        // Collision with paddle
        playSound('paddle');
        // Calculate bounce angle based on where it hit the paddle
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        collidePoint = collidePoint / (paddle.width / 2); // Normalize to -1 to 1
        let angle = collidePoint * (Math.PI / 3); // Max bounce angle 60 degrees

        // Recalculate speed components based on angle and original speed
        const currentSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2); // Use current speed in case it changed
        ball.dx = currentSpeed * Math.sin(angle);
        ball.dy = -currentSpeed * Math.cos(angle);

        // Prevent ball getting stuck inside paddle slightly
        ball.y = paddle.y - ball.radius - 1;
      } else if (ball.y + ball.radius > canvas.height) {
        // Ball missed paddle and hit bottom
        balls.splice(index, 1); // Remove this ball

        if (balls.length === 0) {
          // Check if it was the last ball
          lives--;
          playSound('loseLife');
          updateLives();
          if (lives > 0) {
            showMessage('Try Again!', true); // Pause
            resetPaddle();
            resetBall(); // Create a new single ball
          } else {
            gameOver = true;
            playSound('gameOver');
            showMessage('Game Over!', false);
          }
        }
      }
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
  });

  // --- Brick Collision ---
  collisionDetection(); // Handles ball vs brick

  // --- Falling Power-Ups ---
  for (let i = fallingPowerUps.length - 1; i >= 0; i--) {
    const p = fallingPowerUps[i];
    p.y += p.speed;

    // Collision with paddle
    if (
      p.x < paddle.x + paddle.width &&
      p.x + p.width > paddle.x &&
      p.y < paddle.y + paddle.height &&
      p.y + p.height > paddle.y
    ) {
      activatePowerUp(p.type);
      fallingPowerUps.splice(i, 1); // Remove collected power-up
    }
    // Remove if it falls off screen
    else if (p.y > canvas.height) {
      fallingPowerUps.splice(i, 1);
    }
  }
}

// --- Drawing Loop ---
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw elements
  drawBricks();
  drawPaddle();
  balls.forEach(drawBall); // Draw all active balls
  drawFallingPowerUps();

  // Update UI Text (redundant if using separate update functions, but safe)
  // updateScore();
  // updateLives();
  // updateLevel();
}

// --- Game Loop ---
function gameLoop(timestamp) {
  update(); // Update game state
  draw(); // Render game state

  if (!gameOver && !gameWon) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

// --- UI Updates ---
function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

function updateLives() {
  livesElement.textContent = `Lives: ${lives}`;
}

function updateLevel() {
  levelElement.textContent = `Level: ${level}`;
}

function showMessage(text, pauseGame = false) {
  messageText.textContent = text;
  messageBox.style.display = 'block';
  gamePaused = pauseGame; // Pause if needed (e.g., between levels, try again)
  if (!pauseGame && (gameOver || gameWon)) {
    messageButton.textContent = 'Play Again?';
  } else if (pauseGame) {
    messageButton.textContent = 'Continue';
  } else {
    messageButton.textContent = 'OK'; // Should not happen often
  }
}

function hideMessage() {
  messageBox.style.display = 'none';
  // Unpause only if the game wasn't already over
  if (!gameOver && !gameWon) {
    gamePaused = false;
    // Resume animation loop if it was paused
    if (!animationFrameId && !gameOver && !gameWon) {
      requestAnimationFrame(gameLoop);
    }
  }
}

// --- Event Listeners ---
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);
messageButton.addEventListener('click', handleMessageButtonClick);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (e.key === 'Enter' || e.key === ' ') {
    // Start game or resume from pause if message box is shown
    if (messageBox.style.display === 'block') {
      handleMessageButtonClick();
    } else if (gamePaused && !gameOver && !gameWon) {
      // If paused without message box (e.g., initial start)
      gamePaused = false;
      if (!animationFrameId) {
        // Start loop if not running
        requestAnimationFrame(gameLoop);
      }
    }
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX =
    e.clientX - canvas.offsetLeft - (canvas.offsetWidth - canvas.width) / 2; // Adjust for canvas centering/padding
  const containerRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / containerRect.width; // Handle potential CSS scaling
  const mouseX = (e.clientX - containerRect.left) * scaleX;

  if (mouseX > 0 && mouseX < canvas.width) {
    paddle.x = mouseX - paddle.width / 2;
    // Clamp paddle position within canvas bounds
    if (paddle.x < 0) {
      paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
}

function handleMessageButtonClick() {
  if (gameOver || gameWon) {
    // Restart game
    document.location.reload(); // Simple way to reset everything
  } else {
    // Just hide message and unpause
    hideMessage();
  }
}

function resetPaddle() {
  paddle.x = (canvas.width - initialPaddleWidth) / 2;
  paddle.width = initialPaddleWidth;
  paddle.expandTimer = 0;
  // Clear expand powerup if active
  if (activePowerUps['expand']) {
    delete activePowerUps['expand'];
    updatePowerUpTimers();
  }
}

// --- Game Initialization ---
function initGame() {
  score = 0;
  lives = 3;
  level = 1;
  gameOver = false;
  gameWon = false;
  gamePaused = true;
  activePowerUps = {};
  fallingPowerUps = [];
  updateScore();
  updateLives();
  updateLevel();
  updatePowerUpTimers();
  resetPaddle();
  createBricks(level);
  resetBall();
  showMessage('Press Enter or Click Continue to Start!', true);
  draw();
}

window.onload = initGame;