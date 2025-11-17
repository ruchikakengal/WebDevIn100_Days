# 🔤 Word Wizard – Scramble & Solve

A fun and engaging word scramble game where players unscramble words based on helpful hints. Built with modern web technologies and featuring a beautiful, responsive design.

## ✨ Features

### 🎮 Core Gameplay
- **Random Word Selection**: Words are randomly chosen from a curated database
- **Word Scrambling**: Advanced algorithm that ensures scrambled words are different from originals
- **Hint System**: Helpful clues guide players to the correct answer
- **User Input**: Clean, accessible input system with keyboard support

### 🏆 Scoring & Progress
- **Scoring System**: +1 point for each correct answer
- **Streak Tracker**: Count consecutive correct answers
- **Timer Mode**: 60-second countdown adds excitement
- **Words Solved Counter**: Track total words completed

### 🎨 User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Engaging visual feedback and transitions
- **Confetti Effect**: Celebratory animation for correct answers
- **Game Over Modal**: Beautiful end-game summary

### 🎯 Game Flow
1. Click "Start Game" to begin
2. View the scrambled word and hint
3. Type your answer and press Enter or click Submit
4. Get immediate feedback and see your score/stats
5. Continue until the timer runs out
6. Review your final performance

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with CSS Variables and Flexbox/Grid
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Font Awesome 6
- **Animations**: CSS Keyframes and JavaScript
- **Storage**: Local Storage for theme preferences

## 📁 Project Structure

```
word-scramble/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with dark mode
├── script.js           # Game logic and functionality
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start playing immediately!

### Local Development
If you want to run it locally with a server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🎮 How to Play

1. **Start the Game**: Click the "Start Game" button
2. **Read the Hint**: Look at the hint below the scrambled word
3. **Unscramble**: Figure out what the original word is
4. **Submit Answer**: Type your answer and press Enter or click Submit
5. **Build Streaks**: Get consecutive correct answers for higher scores
6. **Beat the Clock**: Try to solve as many words as possible in 60 seconds!

## 📊 Word Database

The game includes 30 carefully selected words with helpful hints:

- **Animals**: elephant, butterfly, dolphin, penguin
- **Nature**: mountain, rainbow, volcano, waterfall, snowflake
- **Technology**: computer, telescope, skyscraper
- **Food**: pizza, chocolate, watermelon
- **Objects**: guitar, umbrella, bicycle, diamond
- **Places**: library, lighthouse, carnival, rainforest
- **And many more!**

## 🎨 Customization

### Adding New Words
To add new words, edit the `wordDatabase` array in `script.js`:

```javascript
const wordDatabase = [
    { word: "yourword", hint: "Your hint here" },
    // ... existing words
];
```

### Modifying Game Settings
Adjust game parameters in the `gameState` object:

```javascript
let gameState = {
    timer: 60,        // Change timer duration
    // ... other settings
};
```

### Styling Customization
The CSS uses CSS variables for easy theming. Modify the `:root` section in `styles.css`:

```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #10b981;  /* Success/action color */
    /* ... other variables */
}
```

## 🌟 Features in Detail

### Word Scrambling Algorithm
- Uses Fisher-Yates shuffle for true randomness
- Ensures scrambled word is never the same as original
- Handles edge cases and repeated letters

### Timer System
- 60-second countdown timer
- Visual feedback as time runs low
- Automatic game end when timer reaches zero

### Dark Mode
- Persistent theme preference (saved in localStorage)
- Smooth transitions between themes
- Optimized colors for both light and dark modes

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons and inputs
- Optimized typography for all screen sizes

### Accessibility
- Keyboard navigation support
- High contrast color schemes
- Clear visual feedback
- Screen reader friendly

## 🎯 Future Enhancements

Potential features for future versions:
- **Difficulty Levels**: Easy, Medium, Hard word categories
- **Sound Effects**: Audio feedback for correct/incorrect answers
- **Leaderboards**: Local or online high score tracking
- **Word Categories**: Themed word sets (animals, food, etc.)
- **Multiplayer Mode**: Competitive play with friends
- **Custom Word Lists**: Import your own word collections
- **Statistics**: Detailed performance analytics
- **Achievements**: Unlockable badges and milestones

## 🤝 Contributing

This project is part of the SSoC (Summer of Open Source Code) initiative. Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Font Awesome** for the beautiful icons
- **Google Fonts** for the Poppins font family
- **SSoC** for the project inspiration and framework

---

**Happy Scrambling! 🎉**

*Built with ❤️ for word game enthusiasts everywhere*
