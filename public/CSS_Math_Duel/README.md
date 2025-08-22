# 🧮 CSS Math Duel - Two-Player Speed Math Race

A fast-paced, competitive math game where two players race to solve math problems and reach the finish line first! Built with HTML5, CSS3, and JavaScript.

## 🎯 Project Overview

CSS Math Duel is an educational game that combines learning with real-time competitive fun. Players solve math problems as quickly as possible, with each correct answer moving their avatar forward along a CSS-powered race track.

## 🚀 Features

### 🎮 Gameplay Features
- **2-Player Split-Screen Mode**: Play on the same device with side-by-side racing
- **Random Math Problems**: Addition, subtraction, and multiplication questions
- **Real-Time Racing**: Avatars move forward with each correct answer
- **Speed-Based Progress**: Faster responses = quicker progress
- **Visual Race Track**: CSS Flexbox-powered track with progress indicators
- **Win Detection**: Automatic winner detection with celebration animations
- **Easy Restart**: Quick game reset functionality

### 🎨 Visual Features
- **Modern UI Design**: Clean, responsive interface with gradient backgrounds
- **Smooth Animations**: CSS keyframes for avatar movement and effects
- **Confetti Celebration**: Animated confetti when a player wins
- **Progress Tracking**: Visual progress bars and avatar positioning
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🎯 Educational Features
- **Math Practice**: Addition, subtraction, and multiplication problems
- **Speed Training**: Improves mental math speed and accuracy
- **Competitive Learning**: Motivates players through friendly competition
- **Immediate Feedback**: Instant feedback on correct/incorrect answers

## 🛠️ Tech Stack

- **HTML5**: Semantic markup and game structure
- **CSS3**: Flexbox, Grid, Keyframes, Transitions, and Animations
- **JavaScript**: ES6+ Classes, DOM manipulation, and game logic
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Inter font family for modern typography

## 🎮 How to Play

1. **Start the Game**: Click "Start Game" to begin
2. **Solve Math Problems**: Each player gets their own math question
3. **Type Your Answer**: Enter the correct answer in your input box
4. **Race to the Finish**: Correct answers move your avatar forward
5. **Win the Race**: First player to reach 100% wins!

### 🎯 Game Rules
- **Correct Answer**: Move forward 10% and get a new question
- **Wrong Answer**: Move backward 2% as a penalty
- **Win Condition**: Reach 100% progress to win
- **Scoring**: Track total correct answers for each player

## 📁 Project Structure

```
Games/CSS_Math_Duel/
├── index.html          # Main game HTML file
├── style.css           # CSS styles and animations
├── script.js           # JavaScript game logic
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download the project
2. Navigate to `Games/CSS_Math_Duel/`
3. Open `index.html` in your web browser
4. Start playing!

### Development Setup
1. Open the project in your code editor
2. Make changes to HTML, CSS, or JavaScript files
3. Refresh the browser to see changes
4. No build process required - pure HTML/CSS/JS

## 🎨 Customization

### Adding New Math Operations
```javascript
// In script.js, modify the generateQuestion() method
const operations = [
    { symbol: '+', func: (a, b) => a + b },
    { symbol: '-', func: (a, b) => a - b },
    { symbol: '×', func: (a, b) => a * b },
    { symbol: '÷', func: (a, b) => Math.floor(a / b) } // Add division
];
```

### Changing Game Difficulty
```javascript
// Modify number ranges in generateQuestion()
const a = Math.floor(Math.random() * 20) + 1; // 1-20 instead of 1-12
const b = Math.floor(Math.random() * 20) + 1;
```

### Customizing Visuals
```css
/* In style.css, modify colors and animations */
.btn-primary {
    background: linear-gradient(45deg, #your-color1, #your-color2);
}

.avatar {
    font-size: 2.5rem; /* Change avatar size */
}
```

## 🎯 Game Logic

### Question Generation
```javascript
function generateQuestion() {
    const operations = [
        { symbol: '+', func: (a, b) => a + b },
        { symbol: '-', func: (a, b) => a - b },
        { symbol: '×', func: (a, b) => a * b }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    
    return {
        question: `${a} ${operation.symbol} ${b}`,
        answer: operation.func(a, b)
    };
}
```

### Avatar Movement
```javascript
function updateAvatarPosition(player, percentage) {
    const avatar = this.avatars[player];
    const maxDistance = trackWidth - 60;
    const distance = (percentage / 100) * maxDistance;
    
    avatar.style.transform = `translateY(-50%) translateX(${distance}px)`;
}
```

## 🎨 CSS Features

### Keyframe Animations
```css
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(-50%) scale(1); }
    40% { transform: translateY(-50%) scale(1.2); }
    60% { transform: translateY(-50%) scale(1.1); }
}

@keyframes confettiFall {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

### Responsive Design
```css
@media (max-width: 768px) {
    .player-section {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .question {
        font-size: 1.5rem;
    }
}
```

## 🚀 Future Enhancements

### Potential Features
- **Multiple Difficulty Levels**: Easy, Medium, Hard modes
- **More Math Operations**: Division, exponents, fractions
- **Sound Effects**: Audio feedback for correct/incorrect answers
- **Timer Mode**: Race against the clock
- **Multiplayer Online**: Play with friends over the internet
- **Leaderboards**: Track high scores and fastest times
- **Custom Avatars**: Choose different character emojis
- **Power-ups**: Special abilities that affect gameplay

### Technical Improvements
- **Local Storage**: Save game statistics
- **Progressive Web App**: Install as a mobile app
- **Service Worker**: Offline functionality
- **WebSocket**: Real-time multiplayer
- **Canvas Graphics**: More advanced visual effects

---

**Happy Math Racing! 🏁🧮** 