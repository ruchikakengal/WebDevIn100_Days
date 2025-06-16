// Game configuration
const config = {
  gridSize: 20,
  initialSpeed: 150,
  speedIncrease: 2,
  foodColors: ['#e94560', '#ff9e00', '#72edf2', '#9896f1'],
  snakeHeadColor: '#72edf2',
  snakeBodyColor: '#4eacfc'
};

// Game state
let canvas, ctx;
let snake, food;
let direction, nextDirection;
let score;
let gameInterval;
let gameRunning = false;
let playerName = "Guest";

document.addEventListener('DOMContentLoaded', function() {
  const nameScreen      = document.getElementById('name-screen');
  const countdownScreen = document.getElementById('countdown-screen');
  const gameScreen      = document.getElementById('game-screen');
  const gameOverModal   = document.getElementById('game-over-modal');
  const startBtn        = document.getElementById('start-btn');
  const playAgainBtn    = document.getElementById('play-again-btn');
  const countdownEl     = document.getElementById('countdown');
  const playerNameEl    = document.getElementById('player-name');
  const snakeNameEl     = document.getElementById('snake-name');
  const scoreEl         = document.getElementById('score');
  const finalScoreEl    = document.getElementById('final-score');
  const finalMessageEl  = document.getElementById('final-message');
  const usernameInput   = document.getElementById('username');
  const upBtn           = document.getElementById('up-btn');
  const downBtn         = document.getElementById('down-btn');
  const leftBtn         = document.getElementById('left-btn');
  const rightBtn        = document.getElementById('right-btn');
  
  canvas = document.getElementById('game-canvas');
  ctx    = canvas.getContext('2d');

  // Start button
  startBtn.addEventListener('click', () => {
    playerName = usernameInput.value.trim() || "Guest";
    playerNameEl.textContent = `Player: ${playerName}`;
    snakeNameEl.textContent  = `Snake: ${playerName}'s ex`;
    nameScreen.classList.add('hidden');
    countdownScreen.classList.remove('hidden');

    let count = 3;
    countdownEl.textContent = count;
    const cntInterval = setInterval(() => {
      count--;
      countdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(cntInterval);
        countdownScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startGame();
      }
    }, 1000);
  });

  // Play again
  playAgainBtn.addEventListener('click', () => {
    gameOverModal.classList.add('hidden');
    nameScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    usernameInput.value = playerName;
  });

  // Keyboard controls
  document.addEventListener('keydown', e => {
    switch(e.key) {
      case 'ArrowUp':    case 'w': case 'W': setDirection('up');    break;
      case 'ArrowDown':  case 's': case 'S': setDirection('down');  break;
      case 'ArrowLeft':  case 'a': case 'A': setDirection('left');  break;
      case 'ArrowRight': case 'd': case 'D': setDirection('right'); break;
    }
  });

  // Mobile controls
  upBtn.addEventListener('click', () => setDirection('up'));
  downBtn.addEventListener('click', () => setDirection('down'));
  leftBtn.addEventListener('click', () => setDirection('left'));
  rightBtn.addEventListener('click', () => setDirection('right'));

  // Responsive canvas
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Core functions
  function startGame() {
    snake = [{x:10,y:10}];
    generateFood();
    direction = nextDirection = 'right';
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    gameRunning = true;
    gameInterval = setInterval(gameLoop, config.initialSpeed);
  }

  function gameLoop() {
    direction = nextDirection;
    moveSnake();
    if (checkCollision()) return endGame();
    if (checkFoodCollision()) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      snake.push({...snake[snake.length-1]});
      generateFood();
      clearInterval(gameInterval);
      const newSpeed = Math.max(config.initialSpeed - score*config.speedIncrease, 50);
      gameInterval = setInterval(gameLoop, newSpeed);
    }
    drawGame();
  }

  function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    finalScoreEl.textContent   = `Your score: ${score}`;
    if      (score===0)  finalMessageEl.textContent = "Thats why you are single!";
    else if (score<5)    finalMessageEl.textContent = "Don't give up! Your ex still likes you!";
    else if (score<10)   finalMessageEl.textContent = "Its okay buddy! You deserve someone better.";
    else if (score<20)   finalMessageEl.textContent = "Your ex played you like a pro!";
    else                 finalMessageEl.textContent = "Woahhhh! Your ex is a Snake Master!";
    gameOverModal.classList.remove('hidden');
  }

  function resizeCanvas() {
    const container     = document.querySelector('.container');
    const headerHeight  = document.querySelector('.game-header')?.offsetHeight || 0;
    const controlsHeight= document.querySelector('.game-controls')?.offsetHeight || 0;
    const padding       = 40;
    const availW        = container.clientWidth - padding;
    const availH        = container.clientHeight - headerHeight - controlsHeight - padding;
    const cellSize      = Math.floor(Math.min(availW, availH)/config.gridSize);
    const canvasSize    = cellSize * config.gridSize;
    canvas.width  = canvasSize;
    canvas.height = canvasSize;
    if (gameRunning) drawGame();
  }
});

// Movement & collisions
function setDirection(newDir) {
  if ((direction==='up'&&newDir==='down')||(direction==='down'&&newDir==='up')||
      (direction==='left'&&newDir==='right')||(direction==='right'&&newDir==='left')) {
    return;
  }
  nextDirection = newDir;
}
function moveSnake() {
  for (let i=snake.length-1; i>0; i--) snake[i] = {...snake[i-1]};
  switch(direction) {
    case 'up':    snake[0].y--; break;
    case 'down':  snake[0].y++; break;
    case 'left':  snake[0].x--; break;
    case 'right': snake[0].x++; break;
  }
}
function checkCollision() {
  const head=snake[0];
  if (head.x<0||head.x>=config.gridSize||head.y<0||head.y>=config.gridSize) return true;
  if (snake.length>3) {
    for (let i=3;i<snake.length;i++){
      if (head.x===snake[i].x&&head.y===snake[i].y) return true;
    }
  }
  return false;
}
function checkFoodCollision() {
  const head=snake[0];
  return head.x===food.x&&head.y===food.y;
}
function generateFood() {
  let pos, valid=false;
  while (!valid) {
    pos = {
      x: Math.floor(Math.random()*config.gridSize),
      y: Math.floor(Math.random()*config.gridSize),
      color: config.foodColors[Math.floor(Math.random()*config.foodColors.length)]
    };
    valid = !snake.some(seg=>seg.x===pos.x&&seg.y===pos.y);
  }
  food=pos;
}
function drawGame() {
  if (!ctx) return;
  const cellSize = canvas.width/config.gridSize;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(255,255,255,0.05)';
  for (let i=0;i<config.gridSize;i++){
    for (let j=0;j<config.gridSize;j++){
      if ((i+j)%2===0) ctx.fillRect(i*cellSize,j*cellSize,cellSize,cellSize);
    }
  }
  snake.forEach((seg,idx)=>{
    const x=seg.x*cellSize, y=seg.y*cellSize;
    if (idx===0) {
      ctx.fillStyle=config.snakeHeadColor;
      ctx.shadowColor=config.snakeHeadColor;
      ctx.shadowBlur=10;
      drawRoundedRect(x+1,y+1,cellSize-2,cellSize-2,5);
      drawSnakeEyes(x,y,cellSize);
    } else {
      ctx.shadowBlur=0;
      ctx.fillStyle=config.snakeBodyColor;
      const pad=2+(idx*0.1);
      drawRoundedRect(x+pad,y+pad,cellSize-pad*2,cellSize-pad*2,5);
    }
  });
  if (food) {
    ctx.fillStyle=food.color;
    ctx.shadowColor=food.color;
    ctx.shadowBlur=15;
    ctx.beginPath();
    ctx.arc(food.x*cellSize+cellSize/2,food.y*cellSize+cellSize/2,cellSize/2-2,0,Math.PI*2);
    ctx.fill();
    ctx.shadowBlur=0;
  }
}
function drawRoundedRect(x,y,w,h,r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
  ctx.fill();
}
function drawSnakeEyes(x,y,cellSize) {
  const eyeSize   = cellSize/6;
  const eyeOffset = cellSize/4;
  ctx.fillStyle='white';
  ctx.shadowBlur=0;
  const drawEye = (ex, ey) => {
    ctx.beginPath();
    ctx.arc(ex, ey, eyeSize, 0, Math.PI*2);
    ctx.fill();
  };
  const drawPupil=(px,py)=>{
    ctx.fillStyle='black';
    ctx.beginPath();
    ctx.arc(px,py,eyeSize/2,0,Math.PI*2);
    ctx.fill();
  };
  switch(direction) {
    case 'up':
      drawEye(x+eyeOffset, y+eyeOffset);
      drawEye(x+cellSize-eyeOffset, y+eyeOffset);
      drawPupil(x+eyeOffset, y+eyeOffset-1);
      drawPupil(x+cellSize-eyeOffset, y+eyeOffset-1);
      break;
    case 'down':
      drawEye(x+eyeOffset, y+cellSize-eyeOffset);
      drawEye(x+cellSize-eyeOffset, y+cellSize-eyeOffset);
      drawPupil(x+eyeOffset, y+cellSize-eyeOffset+1);
      drawPupil(x+cellSize-eyeOffset, y+cellSize-eyeOffset+1);
      break;
    case 'left':
      drawEye(x+eyeOffset, y+eyeOffset);
      drawEye(x+eyeOffset, y+cellSize-eyeOffset);
      drawPupil(x+eyeOffset-1, y+eyeOffset);
      drawPupil(x+eyeOffset-1, y+cellSize-eyeOffset);
      break;
    case 'right':
      drawEye(x+cellSize-eyeOffset, y+eyeOffset);
      drawEye(x+cellSize-eyeOffset, y+cellSize-eyeOffset);
      drawPupil(x+cellSize-eyeOffset+1, y+eyeOffset);
      drawPupil(x+cellSize-eyeOffset+1, y+cellSize-eyeOffset);
      break;
  }
}
