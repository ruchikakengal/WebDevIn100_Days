const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');

const emojis = ["🍕", "🐱", "🚀", "🎮", "🌈", "🎲", "🎵", "🧠"];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer = 60;
let countdown;
let score = 0;

function shuffle(array) {
  return array.concat(array).sort(() => Math.random() - 0.5);
}

function createCard(emoji) {
  const card = document.createElement('div');
  card.classList.add('card');

  const inner = document.createElement('div');
  inner.classList.add('card-inner');

  const front = document.createElement('div');
  front.classList.add('card-front');
  front.textContent = "❓";

  const back = document.createElement('div');
  back.classList.add('card-back');
  back.textContent = emoji;

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.dataset.emoji = emoji;

  card.addEventListener('click', () => {
    if (
      flippedCards.length < 2 &&
      !card.classList.contains('flipped') &&
      !card.classList.contains('matched')
    ) {
      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        checkMatch();
      }
    }
  });

  return card;
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.dataset.emoji === second.dataset.emoji) {
    first.classList.add('matched');
    second.classList.add('matched');
    score += 10;
    matchedPairs++;

    if (matchedPairs === emojis.length) {
      clearInterval(countdown);
      alert("🎉 You won! Great memory!");
    }
  } else {
    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
    }, 800);
  }

  flippedCards = [];
  scoreEl.textContent = score;
}

function startGame() {
  board.innerHTML = '';
  flippedCards = [];
  matchedPairs = 0;
  score = 0;
  timer = 60;
  scoreEl.textContent = 0;
  timerEl.textContent = timer;

  const shuffled = shuffle(emojis);

  shuffled.forEach((emoji) => {
    const card = createCard(emoji);
    board.appendChild(card);
  });

  clearInterval(countdown);
  countdown = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer === 0) {
      clearInterval(countdown);
      alert("⏰ Time's up! Try again.");
    }
  }, 1000);
}

restartBtn.addEventListener('click', startGame);
startGame(); // Auto start
