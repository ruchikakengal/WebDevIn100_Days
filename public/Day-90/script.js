const gameState = {
    deck: [],
    stock: [],
    waste: [],
    foundations: {
        hearts: [],
        diamonds: [],
        clubs: [],
        spades: []
    },
    tableau: [[], [], [], [], [], [], []],
    score: 0,
    moves: 0,
    timer: 0,
    timerInterval: null,
    gameStarted: false,
    gameWon: false,
    history: [],
    soundEnabled: true,
    musicEnabled: true,
    draggedCard: null,
    draggedFrom: null,
    draggedCards: [],
    hintActive: false,
    autoCompleteAvailable: false,
    lastHint: null,
    particlesEnabled: true
};

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
};

// Audio context for sound effects
let audioContext;
let musicAudio;

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    initializeAudio();
    showLoadingScreen();
    setTimeout(() => {
        hideLoadingScreen();
        initializeGame();
        setupEventListeners();
        createBackgroundMusic();
    }, 2000);
});

// Audio initialization
function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
        gameState.soundEnabled = false;
        gameState.musicEnabled = false;
    }
}

function createBackgroundMusic() {
    if (!audioContext || !gameState.musicEnabled) return;

    // Create a simple background music loop
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);

    oscillator.start();

    // Store reference for later control
    musicAudio = { oscillator, gainNode };
}

function playSound(type) {
    if (!gameState.soundEnabled || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    let duration = 0.3;
    const time = audioContext.currentTime;

    switch (type) {
        case 'cardMove':
            oscillator.frequency.setValueAtTime(350, time);
            oscillator.frequency.exponentialRampToValueAtTime(250, time + 0.1);
            oscillator.type = 'sawtooth';
            filterNode.frequency.setValueAtTime(800, time);
            duration = 0.15;
            break;
        case 'cardFlip':
            oscillator.frequency.setValueAtTime(500, time);
            oscillator.frequency.exponentialRampToValueAtTime(350, time + 0.1);
            oscillator.type = 'triangle';
            duration = 0.2;
            break;
        case 'win':
            // Victory fanfare
            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const winOsc = audioContext.createOscillator();
                    const winGain = audioContext.createGain();
                    winOsc.connect(winGain);
                    winGain.connect(audioContext.destination);

                    winOsc.frequency.setValueAtTime(freq, audioContext.currentTime);
                    winOsc.type = 'triangle';
                    winGain.gain.setValueAtTime(0.2, audioContext.currentTime);
                    winGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

                    winOsc.start();
                    winOsc.stop(audioContext.currentTime + 0.5);
                }, i * 150);
            });
            return;
        case 'invalid':
            oscillator.frequency.setValueAtTime(150, time);
            oscillator.frequency.exponentialRampToValueAtTime(80, time + 0.3);
            oscillator.type = 'sawtooth';
            filterNode.frequency.setValueAtTime(300, time);
            break;
        case 'hint':
            oscillator.frequency.setValueAtTime(800, time);
            oscillator.frequency.exponentialRampToValueAtTime(1200, time + 0.2);
            oscillator.type = 'sine';
            duration = 0.2;
            break;
        case 'success':
            oscillator.frequency.setValueAtTime(659, time);
            oscillator.frequency.exponentialRampToValueAtTime(1319, time + 0.4);
            oscillator.type = 'triangle';
            duration = 0.4;
            break;
    }

    gainNode.gain.setValueAtTime(0.15, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

    oscillator.start(time);
    oscillator.stop(time + duration);
}

// Loading screen functions
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

// Game initialization
function initializeGame() {
    createDeck();
    shuffleDeck();
    dealCards();
    updateDisplay();
    resetTimer();
}

function createDeck() {
    gameState.deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            gameState.deck.push({
                suit: suit,
                rank: rank,
                faceUp: false,
                id: `${suit}-${rank}`
            });
        }
    }
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}

function dealCards() {
    // Reset all piles
    gameState.stock = [];
    gameState.waste = [];
    gameState.foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
    gameState.tableau = [[], [], [], [], [], [], []];

    let deckIndex = 0;

    // Deal tableau cards
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= col; row++) {
            const card = gameState.deck[deckIndex++];
            if (row === col) {
                card.faceUp = true;
            }
            gameState.tableau[col].push(card);
        }
    }

    // Remaining cards go to stock
    gameState.stock = gameState.deck.slice(deckIndex);
}

// Event listeners setup
function setupEventListeners() {
    // Control buttons
    const controlButtons = {
        'restart-btn': restartGame,
        'undo-btn': undoMove,
        'hint-btn': showHint,
        'auto-complete-btn': autoComplete,
        'sound-toggle': toggleSound,
        'music-toggle': toggleMusic,
        'new-game-btn': restartGame
    };

    for (const [id, handler] of Object.entries(controlButtons)) {
        const element = document.getElementById(id);
        if (element) element.addEventListener('click', handler);
    }

    // Stock pile click
    const stockPile = document.getElementById('stock-pile');
    if (stockPile) stockPile.addEventListener('click', drawFromStock);

    // Card drag events
    setupDragAndDrop();

    // Double-click for auto-move to foundation
    setupDoubleClick();

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function setupDragAndDrop() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Touch events for mobile
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function setupDoubleClick() {
    document.addEventListener('dblclick', handleDoubleClick);
}

// Card creation and display
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.faceUp ? 'face-up' : ''}`;
    cardElement.dataset.cardId = card.id;

    // Card back
    const cardBack = document.createElement('div');
    cardBack.className = 'card-face card-back';

    // Card front
    const cardFront = document.createElement('div');
    cardFront.className = 'card-face card-front';

    if (card.faceUp) {
        cardFront.innerHTML = createCardContent(card);
    }

    cardElement.appendChild(cardBack);
    cardElement.appendChild(cardFront);

    return cardElement;
}

function createCardContent(card) {
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    const colorClass = isRed ? 'red' : 'black';
    const suitSymbol = suitSymbols[card.suit];

    let content = `
        <div class="card-content ${colorClass}">
            <div class="corner-top-left">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${suitSymbol}</div>
            </div>
            <div class="corner-bottom-right">
                <div class="card-rank">${card.rank}</div>
                <div class="card-suit">${suitSymbol}</div>
            </div>
    `;

    if (['J', 'Q', 'K'].includes(card.rank)) {
        content += `<div class="card-center" data-suit="${suitSymbol}">${card.rank}</div>`;
    } else if (card.rank === 'A') {
        content += `<div class="card-center">${suitSymbol}</div>`;
    } else {
        // Number cards - create suit symbols
        const numValue = parseInt(card.rank);
        content += `<div class="suit-symbols">`;
        for (let i = 0; i < numValue; i++) {
            content += `<span>${suitSymbol}</span>`;
        }
        content += `</div>`;
    }

    content += `</div>`;
    return content;
}

function updateDisplay() {
    updateStock();
    updateWaste();
    updateFoundations();
    updateTableau();
    updateGameInfo();
    updateAutoCompleteButton();
}

function updateStock() {
    const stockPile = document.getElementById('stock-pile');
    if (stockPile) {
        stockPile.innerHTML = '';

        if (gameState.stock.length > 0) {
            const topCard = gameState.stock[gameState.stock.length - 1];
            const cardElement = createCardElement({ ...topCard, faceUp: false });
            stockPile.appendChild(cardElement);
        }
    }
}

function updateWaste() {
    const wastePile = document.getElementById('waste-pile');
    if (wastePile) {
        wastePile.innerHTML = '';

        if (gameState.waste.length > 0) {
            const topCard = gameState.waste[gameState.waste.length - 1];
            const cardElement = createCardElement({ ...topCard, faceUp: true });
            wastePile.appendChild(cardElement);
        }
    }
}

function updateFoundations() {
    for (let suit of suits) {
        const foundationPile = document.getElementById(`foundation-${suit}`);
        if (foundationPile) {
            foundationPile.innerHTML = '';

            if (gameState.foundations[suit].length > 0) {
                const topCard = gameState.foundations[suit][gameState.foundations[suit].length - 1];
                const cardElement = createCardElement({ ...topCard, faceUp: true });
                foundationPile.appendChild(cardElement);
            }
        }
    }
}

function updateTableau() {
    for (let col = 0; col < 7; col++) {
        const column = document.querySelector(`.tableau-column[data-column="${col}"]`);
        if (column) {
            column.innerHTML = '';

            gameState.tableau[col].forEach((card, index) => {
                const cardElement = createCardElement(card);
                cardElement.style.top = `${index * 25}px`;
                cardElement.style.zIndex = index;
                column.appendChild(cardElement);
            });
        }
    }
}

function updateGameInfo() {
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = gameState.score;

    const movesEl = document.getElementById('moves');
    if (movesEl) movesEl.textContent = gameState.moves;

    const timerEl = document.getElementById('timer');
    if (timerEl) {
        const minutes = Math.floor(gameState.timer / 60);
        const seconds = gameState.timer % 60;
        timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Timer functions
function startTimer() {
    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        gameState.timerInterval = setInterval(() => {
            gameState.timer++;
            updateGameInfo();
        }, 1000);
    }
}

function resetTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    gameState.timer = 0;
    gameState.gameStarted = false;
    updateGameInfo();
}

// Stock pile interaction
function drawFromStock() {
    if (!gameState.gameStarted) startTimer();

    if (gameState.stock.length > 0) {
        const card = gameState.stock.pop();
        card.faceUp = true;
        gameState.waste.push(card);

        playSound('cardFlip');
        updateDisplay();
        incrementMoves();
        saveGameState();
    } else if (gameState.waste.length > 0) {
        // Reset waste to stock
        while (gameState.waste.length > 0) {
            const card = gameState.waste.pop();
            card.faceUp = false;
            gameState.stock.push(card);
        }

        playSound('cardMove');
        updateDisplay();
        incrementMoves();
        saveGameState();
    }
}

// Mouse event handlers
function handleMouseDown(e) {
    if (e.target.closest('.card')) {
        const cardElement = e.target.closest('.card');
        const cardId = cardElement.dataset.cardId;

        startDrag(cardElement, cardId, e.clientX, e.clientY);
        e.preventDefault();
    }
}

function handleMouseMove(e) {
    if (gameState.draggedCard) {
        moveDraggedCard(e.clientX, e.clientY);
        e.preventDefault();
    }
}

function handleMouseUp(e) {
    if (gameState.draggedCard) {
        endDrag(e.clientX, e.clientY);
        e.preventDefault();
    }
}

// Touch event handlers
function handleTouchStart(e) {
    if (e.target.closest('.card')) {
        const cardElement = e.target.closest('.card');
        const cardId = cardElement.dataset.cardId;
        const touch = e.touches[0];

        startDrag(cardElement, cardId, touch.clientX, touch.clientY);
        e.preventDefault();
    }
}

function handleTouchMove(e) {
    if (gameState.draggedCard) {
        const touch = e.touches[0];
        moveDraggedCard(touch.clientX, touch.clientY);
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    if (gameState.draggedCard) {
        const touch = e.changedTouches[0];
        endDrag(touch.clientX, touch.clientY);
        e.preventDefault();
    }
}

// Drag and drop implementation
function startDrag(cardElement, cardId, x, y) {
    const cardData = findCardById(cardId);
    if (!cardData || !cardData.card.faceUp) return;

    const location = cardData.location;
    if (!isCardDraggable(cardData.card, location)) return;

    if (!gameState.gameStarted) startTimer();

    gameState.draggedCard = cardElement;
    gameState.draggedFrom = location;
    gameState.draggedCards = getCardsToMove(cardData.card, location);

    cardElement.classList.add('dragging');
    cardElement.style.position = 'fixed';
    cardElement.style.pointerEvents = 'none';
    cardElement.style.zIndex = '1000';

    moveDraggedCard(x, y);
}

function moveDraggedCard(x, y) {
    if (!gameState.draggedCard) return;

    const rect = gameState.draggedCard.getBoundingClientRect();
    gameState.draggedCard.style.left = `${x - rect.width / 2}px`;
    gameState.draggedCard.style.top = `${y - rect.height / 2}px`;

    // Highlight valid drop targets
    highlightDropTargets();
}

function endDrag(x, y) {
    if (!gameState.draggedCard) return;

    const dropTarget = getDropTarget(x, y);
    const isValidMove = dropTarget && isValidDrop(gameState.draggedCards[0], dropTarget);

    if (isValidMove) {
        executeMove(gameState.draggedCards, gameState.draggedFrom, dropTarget);
        playSound('cardMove');

        // Create particle effect at drop location
        createParticleEffect(x, y, '#4caf50', 6);

        // Success sound
        setTimeout(() => playSound('success'), 200);
    } else {
        playSound('invalid');

        // Shake animation for invalid drop
        gameState.draggedCard.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            if (gameState.draggedCard) {
                gameState.draggedCard.style.animation = '';
            }
        }, 500);
    }

    // Reset drag state
    gameState.draggedCard.classList.remove('dragging');
    gameState.draggedCard.style.position = '';
    gameState.draggedCard.style.pointerEvents = '';
    gameState.draggedCard.style.zIndex = '';
    gameState.draggedCard.style.left = '';
    gameState.draggedCard.style.top = '';

    gameState.draggedCard = null;
    gameState.draggedFrom = null;
    gameState.draggedCards = [];

    clearHighlights();
    updateDisplay();
}

function highlightDropTargets() {
    // Clear previous highlights
    document.querySelectorAll('.highlight, .valid-drop').forEach(el => {
        el.classList.remove('highlight', 'valid-drop');
    });

    if (!gameState.draggedCards.length) return;

    const card = gameState.draggedCards[0];

    // Highlight valid foundations
    for (let suit of suits) {
        if (isValidFoundationMove(card, suit)) {
            const foundation = document.getElementById(`foundation-${suit}`);
            if (foundation) foundation.classList.add('valid-drop');
        }
    }

    // Highlight valid tableau columns
    for (let col = 0; col < 7; col++) {
        if (isValidTableauMove(card, col)) {
            const column = document.querySelector(`[data-column="${col}"]`);
            if (column) column.classList.add('valid-drop');
        }
    }
}

function clearHighlights() {
    document.querySelectorAll('.highlight, .valid-drop').forEach(el => {
        el.classList.remove('highlight', 'valid-drop');
    });
}

// Double-click for auto-move to foundation
function handleDoubleClick(e) {
    const cardElement = e.target.closest('.card');
    if (!cardElement) return;

    const cardId = cardElement.dataset.cardId;
    const cardData = findCardById(cardId);
    if (!cardData || !cardData.card.faceUp) return;

    // Try to move to foundation
    const card = cardData.card;
    const foundationSuit = card.suit;
    const foundationLocation = { type: 'foundation', suit: foundationSuit };

    if (isValidDrop(card, foundationLocation) && isCardDraggable(card, cardData.location)) {
        if (!gameState.gameStarted) startTimer();

        const cardsToMove = getCardsToMove(card, cardData.location);
        if (cardsToMove.length === 1) {
            // Add auto-move animation
            cardElement.classList.add('auto-move');
            setTimeout(() => {
                cardElement.classList.remove('auto-move');
            }, 800);

            executeMove(cardsToMove, cardData.location, foundationLocation);
            playSound('cardMove');

            // Create particle effect
            const rect = cardElement.getBoundingClientRect();
            createParticleEffect(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                '#f9ca24',
                8
            );

            updateDisplay();
        }
    } else {
        // Visual feedback for invalid double-click
        cardElement.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            cardElement.style.animation = '';
        }, 300);
        playSound('invalid');
    }
}

// Game logic functions
function findCardById(cardId) {
    // Search in waste
    for (let i = 0; i < gameState.waste.length; i++) {
        if (gameState.waste[i].id === cardId) {
            return { card: gameState.waste[i], location: { type: 'waste', index: i } };
        }
    }

    // Search in foundations
    for (let suit of suits) {
        for (let i = 0; i < gameState.foundations[suit].length; i++) {
            if (gameState.foundations[suit][i].id === cardId) {
                return { card: gameState.foundations[suit][i], location: { type: 'foundation', suit: suit, index: i } };
            }
        }
    }

    // Search in tableau
    for (let col = 0; col < 7; col++) {
        for (let i = 0; i < gameState.tableau[col].length; i++) {
            if (gameState.tableau[col][i].id === cardId) {
                return { card: gameState.tableau[col][i], location: { type: 'tableau', column: col, index: i } };
            }
        }
    }

    return null;
}

function isCardDraggable(card, location) {
    if (!card.faceUp) return false;

    switch (location.type) {
        case 'waste':
            return location.index === gameState.waste.length - 1;
        case 'foundation':
            return location.index === gameState.foundations[location.suit].length - 1;
        case 'tableau':
            return true; // Can drag any face-up card from tableau
        default:
            return false;
    }
}

function getCardsToMove(card, location) {
    if (location.type === 'tableau') {
        const column = gameState.tableau[location.column];
        const startIndex = location.index;
        return column.slice(startIndex);
    } else {
        return [card];
    }
}

function getDropTarget(x, y) {
    const element = document.elementFromPoint(x, y);
    if (!element) return null;

    // Check if dropping on foundation
    const foundation = element.closest('.foundation');
    if (foundation) {
        return { type: 'foundation', suit: foundation.dataset.suit };
    }

    // Check if dropping on tableau column
    const tableauColumn = element.closest('.tableau-column');
    if (tableauColumn) {
        return { type: 'tableau', column: parseInt(tableauColumn.dataset.column) };
    }

    return null;
}

function isValidDrop(card, dropTarget) {
    switch (dropTarget.type) {
        case 'foundation':
            return isValidFoundationMove(card, dropTarget.suit);
        case 'tableau':
            return isValidTableauMove(card, dropTarget.column);
        default:
            return false;
    }
}

function isValidFoundationMove(card, suit) {
    if (card.suit !== suit) return false;

    const foundation = gameState.foundations[suit];
    if (foundation.length === 0) {
        return card.rank === 'A';
    } else {
        const topCard = foundation[foundation.length - 1];
        const cardValue = getCardValue(card.rank);
        const topValue = getCardValue(topCard.rank);
        return cardValue === topValue + 1;
    }
}

function isValidTableauMove(card, column) {
    const tableauColumn = gameState.tableau[column];

    if (tableauColumn.length === 0) {
        return card.rank === 'K';
    } else {
        const topCard = tableauColumn[tableauColumn.length - 1];
        if (!topCard.faceUp) return false;

        const cardValue = getCardValue(card.rank);
        const topValue = getCardValue(topCard.rank);
        const cardIsRed = card.suit === 'hearts' || card.suit === 'diamonds';
        const topIsRed = topCard.suit === 'hearts' || topCard.suit === 'diamonds';

        return cardValue === topValue - 1 && cardIsRed !== topIsRed;
    }
}

function getCardValue(rank) {
    switch (rank) {
        case 'A': return 1;
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        default: return parseInt(rank);
    }
}

function executeMove(cards, fromLocation, toLocation) {
    saveGameState();

    // Clear any active hints
    clearHints();

    // Remove cards from source
    removeCardsFromLocation(cards, fromLocation);

    // Add cards to destination
    addCardsToLocation(cards, toLocation);

    // Add success animation to moved card
    if (cards.length > 0) {
        setTimeout(() => {
            const cardElement = document.querySelector(`[data-card-id="${cards[0].id}"]`);
            if (cardElement) {
                cardElement.classList.add('success-move');
                setTimeout(() => {
                    cardElement.classList.remove('success-move');
                }, 600);
            }
        }, 100);
    }

    // Flip face-down cards if needed
    flipTableauCards();

    // Update score
    updateScore(fromLocation, toLocation);

    incrementMoves();

    // Check for win
    if (checkWin()) {
        gameWon();
    }
}

function removeCardsFromLocation(cards, location) {
    switch (location.type) {
        case 'waste':
            gameState.waste.pop();
            break;
        case 'foundation':
            gameState.foundations[location.suit].pop();
            break;
        case 'tableau':
            const column = gameState.tableau[location.column];
            column.splice(location.index);
            break;
    }
}

function addCardsToLocation(cards, location) {
    switch (location.type) {
        case 'foundation':
            gameState.foundations[location.suit].push(cards[0]);
            break;
        case 'tableau':
            gameState.tableau[location.column].push(...cards);
            break;
    }
}

function flipTableauCards() {
    for (let col = 0; col < 7; col++) {
        const column = gameState.tableau[col];
        if (column.length > 0) {
            const topCard = column[column.length - 1];
            if (!topCard.faceUp) {
                topCard.faceUp = true;
                playSound('cardFlip');
            }
        }
    }
}

function updateScore(fromLocation, toLocation) {
    let points = 0;

    if (toLocation.type === 'foundation') {
        points += 10;
    } else if (fromLocation.type === 'foundation' && toLocation.type === 'tableau') {
        points -= 15;
    } else if (fromLocation.type === 'waste' && toLocation.type === 'tableau') {
        points += 5;
    }

    gameState.score = Math.max(0, gameState.score + points);
}

function incrementMoves() {
    gameState.moves++;
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = gameState.history.length === 0;
    }
}

function saveGameState() {
    // Save current state for undo
    const state = {
        stock: [...gameState.stock],
        waste: [...gameState.waste],
        foundations: {
            hearts: [...gameState.foundations.hearts],
            diamonds: [...gameState.foundations.diamonds],
            clubs: [...gameState.foundations.clubs],
            spades: [...gameState.foundations.spades]
        },
        tableau: gameState.tableau.map(col => [...col]),
        score: gameState.score,
        moves: gameState.moves
    };

    gameState.history.push(state);

    // Keep only last 50 moves
    if (gameState.history.length > 50) {
        gameState.history.shift();
    }
}

function checkWin() {
    return gameState.foundations.hearts.length === 13 &&
        gameState.foundations.diamonds.length === 13 &&
        gameState.foundations.clubs.length === 13 &&
        gameState.foundations.spades.length === 13;
}

function gameWon() {
    gameState.gameWon = true;

    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    // Clear any active hints
    clearHints();

    // Calculate final score bonus
    const timeBonus = Math.max(0, 700000 - gameState.timer * 2);
    gameState.score += timeBonus;

    // Show win overlay with enhanced stats
    const finalScore = document.getElementById('final-score');
    const finalTime = document.getElementById('final-time');
    const finalMoves = document.getElementById('final-moves');
    const winMoves = document.getElementById('win-moves');
    const winTime = document.getElementById('win-time');
    const winOverlay = document.getElementById('win-overlay');

    const timeText = document.getElementById('timer').textContent;

    if (finalScore) finalScore.textContent = gameState.score;
    if (finalTime) finalTime.textContent = timeText;
    if (finalMoves) finalMoves.textContent = gameState.moves;
    if (winMoves) winMoves.textContent = gameState.moves;
    if (winTime) winTime.textContent = timeText;
    if (winOverlay) winOverlay.classList.remove('hidden');

    // Create celebration effects
    createConfetti();
    createFireworks();

    // Play win sound
    playSound('win');

    updateGameInfo();
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';

            const container = document.getElementById('confetti-container');
            if (container) {
                container.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }
        }, i * 50);
    }
}

function restartGame() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    // Clear any active hints
    clearHints();

    // Reset game state
    gameState.score = 0;
    gameState.moves = 0;
    gameState.timer = 0;
    gameState.gameStarted = false;
    gameState.gameWon = false;
    gameState.history = [];
    gameState.hintActive = false;
    gameState.autoCompleteAvailable = false;
    gameState.lastHint = null;

    // Hide win overlay
    const winOverlay = document.getElementById('win-overlay');
    if (winOverlay) {
        winOverlay.classList.add('hidden');
    }

    // Initialize new game
    initializeGame();

    playSound('cardMove');
}

function undoMove() {
    if (gameState.history.length === 0) return;

    const previousState = gameState.history.pop();

    gameState.stock = previousState.stock;
    gameState.waste = previousState.waste;
    gameState.foundations = previousState.foundations;
    gameState.tableau = previousState.tableau;
    gameState.score = previousState.score;
    gameState.moves = previousState.moves;

    updateDisplay();
    playSound('cardMove');

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = gameState.history.length === 0;
    }
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    const btn = document.getElementById('sound-toggle');
    if (btn) {
        btn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
    }

    if (gameState.soundEnabled) {
        playSound('cardMove');
    }
}

function toggleMusic() {
    gameState.musicEnabled = !gameState.musicEnabled;
    const btn = document.getElementById('music-toggle');
    if (btn) {
        btn.textContent = gameState.musicEnabled ? '🎵' : '🎶';
    }

    if (musicAudio && musicAudio.gainNode) {
        musicAudio.gainNode.gain.setValueAtTime(
            gameState.musicEnabled ? 0.05 : 0,
            audioContext.currentTime
        );
    }
}

// Enhanced features implementation

// Hint System
function showHint() {
    if (gameState.hintActive) {
        clearHints();
        return;
    }

    const hint = findBestMove();
    if (hint) {
        clearHints();
        gameState.hintActive = true;
        gameState.lastHint = hint;

        // Highlight the card
        const cardElement = document.querySelector(`[data-card-id="${hint.card.id}"]`);
        if (cardElement) {
            cardElement.classList.add('hint-highlight');
        }

        // Highlight destination
        let destination;
        if (hint.to.type === 'foundation') {
            destination = document.getElementById(`foundation-${hint.to.suit}`);
        } else if (hint.to.type === 'tableau') {
            destination = document.querySelector(`[data-column="${hint.to.column}"]`);
        }

        if (destination) {
            destination.classList.add('valid-drop');
        }

        // Update hint button state
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.classList.add('hint-active');
            hintBtn.textContent = '❌ Clear';
        }

        playSound('hint');

        // Auto-clear hint after 5 seconds
        setTimeout(clearHints, 5000);
    } else {
        playSound('invalid');
    }
}

function clearHints() {
    gameState.hintActive = false;
    gameState.lastHint = null;

    document.querySelectorAll('.hint-highlight').forEach(el => {
        el.classList.remove('hint-highlight');
    });
    document.querySelectorAll('.valid-drop').forEach(el => {
        el.classList.remove('valid-drop');
    });

    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        hintBtn.classList.remove('hint-active');
        hintBtn.textContent = '💡 Hint';
    }
}

function findBestMove() {
    // Try foundation moves first (highest priority)
    for (let col = 0; col < 7; col++) {
        const column = gameState.tableau[col];
        if (column.length > 0) {
            const card = column[column.length - 1];
            if (card.faceUp && isValidFoundationMove(card, card.suit)) {
                return {
                    card: card,
                    from: { type: 'tableau', column: col },
                    to: { type: 'foundation', suit: card.suit }
                };
            }
        }
    }

    // Check waste pile for foundation moves
    if (gameState.waste.length > 0) {
        const card = gameState.waste[gameState.waste.length - 1];
        if (isValidFoundationMove(card, card.suit)) {
            return {
                card: card,
                from: { type: 'waste' },
                to: { type: 'foundation', suit: card.suit }
            };
        }
    }

    // Try tableau to tableau moves
    for (let fromCol = 0; fromCol < 7; fromCol++) {
        const fromColumn = gameState.tableau[fromCol];
        if (fromColumn.length > 0) {
            const card = fromColumn[fromColumn.length - 1];
            if (card.faceUp) {
                for (let toCol = 0; toCol < 7; toCol++) {
                    if (fromCol !== toCol && isValidTableauMove(card, toCol)) {
                        return {
                            card: card,
                            from: { type: 'tableau', column: fromCol },
                            to: { type: 'tableau', column: toCol }
                        };
                    }
                }
            }
        }
    }

    // Check waste to tableau
    if (gameState.waste.length > 0) {
        const card = gameState.waste[gameState.waste.length - 1];
        for (let toCol = 0; toCol < 7; toCol++) {
            if (isValidTableauMove(card, toCol)) {
                return {
                    card: card,
                    from: { type: 'waste' },
                    to: { type: 'tableau', column: toCol }
                };
            }
        }
    }

    return null;
}

// Auto-Complete System
function updateAutoCompleteButton() {
    const canAutoComplete = checkCanAutoComplete();
    const button = document.getElementById('auto-complete-btn');
    if (button) {
        button.disabled = !canAutoComplete;
        gameState.autoCompleteAvailable = canAutoComplete;
    }
}

function checkCanAutoComplete() {
    // Auto-complete available when all tableau cards are face-up
    for (let col = 0; col < 7; col++) {
        const column = gameState.tableau[col];
        for (let card of column) {
            if (!card.faceUp) return false;
        }
    }
    return true;
}

function autoComplete() {
    if (!gameState.autoCompleteAvailable) return;

    clearHints();

    const autoMoveInterval = setInterval(() => {
        let moveMade = false;

        // Try to move cards to foundations
        for (let col = 0; col < 7; col++) {
            const column = gameState.tableau[col];
            if (column.length > 0) {
                const card = column[column.length - 1];
                if (card.faceUp && isValidFoundationMove(card, card.suit)) {
                    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
                    if (cardElement) {
                        cardElement.classList.add('auto-move');
                        setTimeout(() => {
                            cardElement.classList.remove('auto-move');
                        }, 800);
                    }

                    executeMove([card],
                        { type: 'tableau', column: col, index: column.length - 1 },
                        { type: 'foundation', suit: card.suit });
                    moveMade = true;
                    break;
                }
            }
        }

        // Check waste pile
        if (!moveMade && gameState.waste.length > 0) {
            const card = gameState.waste[gameState.waste.length - 1];
            if (isValidFoundationMove(card, card.suit)) {
                const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
                if (cardElement) {
                    cardElement.classList.add('auto-move');
                    setTimeout(() => {
                        cardElement.classList.remove('auto-move');
                    }, 800);
                }

                executeMove([card],
                    { type: 'waste', index: gameState.waste.length - 1 },
                    { type: 'foundation', suit: card.suit });
                moveMade = true;
            }
        }

        if (!moveMade || checkWin()) {
            clearInterval(autoMoveInterval);
        }

        updateDisplay();
        playSound('cardMove');
    }, 500);
}

// Enhanced Visual Effects
function createParticleEffect(x, y, color = '#4caf50', count = 8) {
    if (!gameState.particlesEnabled) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`;

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

function createFireworks() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    const container = document.getElementById('fireworks-container');
    if (!container) return;

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6);

            for (let j = 0; j < 8; j++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.background = colors[Math.floor(Math.random() * colors.length)];
                firework.style.left = x + 'px';
                firework.style.top = y + 'px';
                firework.style.transform = `rotate(${j * 45}deg)`;

                container.appendChild(firework);

                setTimeout(() => {
                    firework.remove();
                }, 2000);
            }
        }, i * 300);
    }
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    if (!e) return;

    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'z':
                e.preventDefault();
                undoMove();
                break;
            case 'n':
                e.preventDefault();
                restartGame();
                break;
            case 'h':
                e.preventDefault();
                showHint();
                break;
        }
    }

    switch (e.key) {
        case 'Escape':
            clearHints();
            break;
        case ' ':
            if (e.target === document.body) {
                e.preventDefault();
                drawFromStock();
            }
            break;
        case 'a':
            if (gameState.autoCompleteAvailable) {
                autoComplete();
            }
            break;
    }
}

// Initialize buttons in disabled state if needed
setTimeout(() => {
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = gameState.history.length === 0;
    }
    updateAutoCompleteButton();
}, 100);