const pickupLines = {
    sweet: [
        "Are you a magician? Because whenever I look at you, everyone else disappears.",
        "Do you have a map? I keep getting lost in your eyes.",
        "If you were a vegetable, you'd be a cute-cumber!",
        "Are you made of copper and tellurium? Because you're Cu-Te!",
        "Do you believe in love at first sight, or should I walk by again?",
        "Is your name Google? Because you have everything I've been searching for.",
        "If beauty were time, you'd be an eternity.",
        "Are you a parking ticket? Because you've got FINE written all over you.",
        "Do you have a Band-Aid? Because I just scraped my knee falling for you.",
        "If you were a triangle, you'd be acute one!",
        "Are you sunshine? Because you light up my entire world.",
        "If kisses were snowflakes, I'd send you a blizzard.",
        "You must be tired, because you've been running through my mind all day.",
        "Are you a camera? Because every time I look at you, I smile.",
        "If I could rearrange the alphabet, I'd put U and I together.",
        "Are you a dream? Because I never want to wake up from this moment.",
        "Your smile is like sunshine on a cloudy day.",
        "Are you made of sugar? Because you're so sweet, you're giving me cavities!"
    ],
    cheesy: [
        "Are you a cheese? Because you're making me melt!",
        "Is your dad a baker? Because you're a cutie pie!",
        "Do you like cheese? Because you're grate!",
        "Are you a beaver? Because daaaaam!",
        "If you were a fruit, you'd be a fineapple.",
        "Are you my appendix? Because this feeling in my stomach makes me want to take you out.",
        "Do you work at Starbucks? Because I like you a latte!",
        "Are you a campfire? Because you're hot and I want s'more.",
        "If you were a burger at McDonald's, you'd be the McGorgeous.",
        "Are you Australian? Because when I look at you, I feel like I'm down under.",
        "Are you WiFi? Because I'm really feeling a connection!",
        "If you were a pizza, you'd be a supreme... supreme-ly gorgeous!",
        "Are you a banana? Because I find you a-peel-ing!",
        "Do you have a sunburn? Or are you always this hot?",
        "Are you a magician? Because whenever I look at you, everyone else disappears... like my dignity!",
        "If you were words on a page, you'd be fine print.",
        "Are you my phone charger? Because without you, I'd die!",
        "Are you a dictionary? Because you add meaning to my life!"
    ],
    funny: [
        "Are you Wi-Fi? Because I'm feeling a connection.",
        "Do you like Star Wars? Because Yoda one for me!",
        "Are you a magician? Because abracadabra, you just made my heart disappear!",
        "If you were a vegetable, you'd be a cute-cumber, and if you were a fruit, you'd be a fine-apple!",
        "Are you my homework? Because I should be doing you right now, but I'm procrastinating.",
        "Do you have a sunburn, or are you always this hot?",
        "Are you a time traveler? Because I absolutely see you in my future!",
        "If you were a cat, you'd purr-fect!",
        "Are you a loan from a bank? Because you have my interest!",
        "Do you have a name, or can I call you mine?",
        "Are you a keyboard? Because you're just my type!",
        "If you were a booger, I'd pick you first!",
        "Are you Google? Because you autocomplete me!",
        "Do you have 11 protons? Because you're sodium fine!",
        "Are you a 90-degree angle? Because you're looking right!",
        "If you were a vegetable, you'd be a cute-cumber... but you're a human, so that's weird.",
        "Are you a magician? Because every time I look at you, everyone else disappears... including my self-respect!",
        "Do you believe in love at first swipe?"
    ],
    bold: [
        "Are you ready to be swept off your feet?",
        "I must be a snowflake, because I've fallen for you.",
        "Kiss me if I'm wrong, but dinosaurs still exist, right?",
        "Are you a volcano? Because I lava you!",
        "Do you have a mirror in your pocket? Because I can see myself in your pants.",
        "Are you a fire alarm? Because you're really loud and annoying... wait, that's not right.",
        "If looks could kill, you'd definitely be a weapon of mass destruction.",
        "Are you electricity? Because you're electrifying!",
        "Do you believe in fate? Because I think we were mint to be.",
        "Are you a superhero? Because you've got my heart racing!"
    ],
    nerdy: [
        "Are you made of copper and tellurium? Because you're Cu-Te!",
        "If you were a function, you'd be y = mx + beautiful.",
        "Are you the square root of -1? Because you can't be real!",
        "You must be the speed of light because time stops when I look at you.",
        "Are you a carbon sample? Because I want to date you.",
        "If I were an enzyme, I'd be DNA helicase so I could unzip your genes.",
        "Are you a 45-degree angle? Because you're acute-y!",
        "You're like a dictionary - you add meaning to my life!",
        "Are you made of quarks and leptons? Because you're elementary, my dear!",
        "If you were a programming language, you'd be Python because you're simple and beautiful."
    ],
    romantic: [
        "In a sea of people, my eyes will always search for you.",
        "You are the reason I believe in love.",
        "Every moment spent with you is like a beautiful dream come true.",
        "You're not just a star in the sky; you're my entire universe.",
        "If I had a rose for every time I thought of you, I would be walking through my garden forever.",
        "You are the poetry my heart has been trying to write.",
        "In your eyes, I found my home.",
        "You're the missing piece I never knew my heart needed.",
        "With you, I understand why it never worked out with anyone else.",
        "You are my today and all of my tomorrows."
    ]
};

// Enhanced theme-based pick-up lines with more categories
const themeLines = {
    coffee: [
        "Are you coffee? Because you're brewing up feelings in my heart!",
        "Do you work at Starbucks? Because I like you a latte!",
        "You're like my favorite coffee - hot, sweet, and I can't start my day without you!",
        "Are you espresso? Because you're small but you pack a punch!",
        "You must be a barista because you've got me all steamed up!"
    ],
    stars: [
        "Are you a star? Because you light up my universe!",
        "You must be made of stardust because you're absolutely stellar!",
        "If I could rearrange the stars, I'd spell out your name!",
        "Are you a constellation? Because I could get lost looking at you all night!",
        "You're like the North Star - you guide me home!"
    ],
    music: [
        "Are you a song? Because you've been stuck in my head all day!",
        "You must be a melody because you make my heart sing!",
        "Are you my playlist? Because I could listen to you all day long!",
        "Are you a symphony? Because you make beautiful music in my heart!",
        "You must be my favorite song because I never get tired of you!"
    ],
    books: [
        "Are you a library book? Because I'm checking you out!",
        "You must be a bestseller because I can't put you down!",
        "Are you poetry? Because you make my heart rhyme!",
        "Are you a novel? Because I want to read you cover to cover!",
        "You must be a dictionary because you add meaning to my life!"
    ],
    space: [
        "Are you an astronaut? Because you're out of this world!",
        "You must be from space because you've got stars in your eyes!",
        "Are you a planet? Because you've got me orbiting around you!",
        "Are you the moon? Because you light up my darkest nights!",
        "You must be a galaxy because you're vast and beautiful!"
    ],
    flowers: [
        "Are you a rose? Because you're beautiful and you've got me feeling thorny!",
        "You must be a flower because you make my garden complete!",
        "Are you a daisy? Because you're simply blooming gorgeous!",
        "Are you a sunflower? Because you always turn toward the light!",
        "You must be a tulip because you make my heart skip!"
    ],
    food: [
        "Are you a chef? Because you've got all the right ingredients!",
        "You must be chocolate because you're sweet and irresistible!",
        "Are you pizza? Because you've got a pizza my heart!",
        "Are you honey? Because you're the sweetest thing I've ever seen!"
    ],
    weather: [
        "Are you sunshine? Because you brighten up my day!",
        "You must be a rainbow because you bring color to my world!",
        "Are you lightning? Because you just struck my heart!",
        "Are you snow? Because you make everything beautiful!"
    ],
    technology: [
        "Are you WiFi? Because I'm feeling a strong connection!",
        "You must be my phone because I can't stop looking at you!",
        "Are you a computer? Because you've got my heart processing!",
        "Are you an app? Because I want to download you!"
    ],
    ocean: [
        "Are you the ocean? Because I'm lost at sea in your eyes!",
        "You must be a wave because you've swept me off my feet!",
        "Are you a mermaid? Because you've lured me with your beauty!",
        "Are you a pearl? Because you're a rare treasure!"
    ]
};

// Enhanced app state with advanced features
let currentMood = 'sweet';
let currentLine = '';
let favorites = JSON.parse(localStorage.getItem('pickupLineFavorites')) || [];
let isTyping = false;
let typingSpeed = 50;
let currentTheme = 'default';
let soundEnabled = true;
let lastGeneratedLines = [];
let animationEnabled = true;

// DOM elements
const nameInput = document.getElementById('nameInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const pickupLineElement = document.getElementById('pickupLine');
const favoriteBtn = document.getElementById('favoriteBtn');
const tryAnotherBtn = document.getElementById('tryAnotherBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const favoritesToggle = document.getElementById('favoritesToggle');
const favoritesList = document.getElementById('favoritesList');
const favoritesCount = document.getElementById('favoritesCount');
const favoritesEmpty = document.getElementById('favoritesEmpty');
const copyToast = document.getElementById('copyToast');
const shareModal = document.getElementById('shareModal');
const modalClose = document.getElementById('modalClose');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateFavoritesCount();
    createFloatingHearts();
    createSparkles();
    displayFavorites();
    enhanceMoodButtons();
    
    // Load user preferences
    const savedTypingSpeed = localStorage.getItem('typingSpeed');
    if (savedTypingSpeed) {
        typingSpeed = parseInt(savedTypingSpeed);
    }
    
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    if (savedSoundEnabled !== null) {
        soundEnabled = JSON.parse(savedSoundEnabled);
    }
    
    // Add welcome animation
    setTimeout(() => {
        createEnhancedSparkleEffect();
    }, 1000);
}

function setupEventListeners() {
    // Mood button event listeners
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            currentMood = this.getAttribute('data-mood');
        });
    });

    // Generate button event listener
    generateBtn.addEventListener('click', generatePickupLine);

    // Enter key support for input
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePickupLine();
        }
    });

    // Action button event listeners
    favoriteBtn.addEventListener('click', toggleFavorite);
    tryAnotherBtn.addEventListener('click', generatePickupLine);
    copyBtn.addEventListener('click', copyToClipboard);
    shareBtn.addEventListener('click', openShareModal);

    // Favorites toggle
    favoritesToggle.addEventListener('click', toggleFavorites);

    // Modal close
    modalClose.addEventListener('click', closeShareModal);
    shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
            closeShareModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeShareModal();
        }
    });
}

async function generatePickupLine() {
    if (isTyping) return;
    
    const name = nameInput.value.trim();
    const lines = getRelevantLines(name, currentMood);
    
    if (lines.length === 0) {
        showError('No lines found for this combination. Try a different mood or theme!');
        return;
    }

    // Avoid repeating recent lines
    let availableLines = lines.filter(line => !lastGeneratedLines.includes(line));
    if (availableLines.length === 0) {
        availableLines = lines;
        lastGeneratedLines = [];
    }

    // Get random line
    currentLine = availableLines[Math.floor(Math.random() * availableLines.length)];
    
    // Track generated lines
    lastGeneratedLines.push(currentLine);
    if (lastGeneratedLines.length > 5) {
        lastGeneratedLines.shift();
    }
    
    // Personalize line with name if provided
    if (name && !isThemeKeyword(name)) {
        currentLine = personalizeLine(currentLine, name);
    }

    // Show loading state
    generateBtn.innerHTML = '<i class="fas fa-heart loading"></i> Generating...';
    generateBtn.disabled = true;
    
    // Play sound effect
    playSound('generate');

    // Display result with typing effect
    resultSection.style.display = 'block';
    await typewriterEffect(currentLine);
    
    // Reset button
    generateBtn.innerHTML = '<i class="fas fa-heart"></i> Flirt Me Up!';
    generateBtn.disabled = false;
    
    // Update favorite button state
    updateFavoriteButton();
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add enhanced sparkle effect
    createEnhancedSparkleEffect();
    
    // Add success sound
    setTimeout(() => playSound('success'), 500);
}

function getRelevantLines(name, mood) {
    let lines = [...pickupLines[mood]];
    
    // Check if name is a theme keyword
    if (name && isThemeKeyword(name.toLowerCase())) {
        const themeKey = findThemeKey(name.toLowerCase());
        if (themeKey && themeLines[themeKey]) {
            lines = [...lines, ...themeLines[themeKey]];
        }
    }
    
    return lines;
}

function isThemeKeyword(keyword) {
    const themes = Object.keys(themeLines);
    return themes.some(theme => 
        keyword.includes(theme) || 
        theme.includes(keyword) ||
        getThemeAliases(theme).some(alias => keyword.includes(alias))
    );
}

function findThemeKey(keyword) {
    const themes = Object.keys(themeLines);
    return themes.find(theme => 
        keyword.includes(theme) || 
        theme.includes(keyword) ||
        getThemeAliases(theme).some(alias => keyword.includes(alias))
    );
}

function getThemeAliases(theme) {
    const aliases = {
        coffee: ['cafe', 'espresso', 'latte', 'cappuccino'],
        stars: ['star', 'galaxy', 'universe', 'cosmos', 'astronomy'],
        music: ['song', 'melody', 'rhythm', 'beat', 'sound'],
        books: ['book', 'novel', 'story', 'reading', 'literature'],
        space: ['galaxy', 'planet', 'astronaut', 'rocket', 'mars'],
        flowers: ['flower', 'rose', 'daisy', 'tulip', 'garden']
    };
    return aliases[theme] || [];
}

function personalizeLine(line, name) {
    // Use advanced personalization if available
    if (typeof advancedPersonalizeLine === 'function') {
        return advancedPersonalizeLine(line, name, currentMood);
    }
    
    // Fallback to basic personalization
    const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    
    // Replace generic terms with the name
    const personalizations = [
        { pattern: /\byou\b/gi, replacement: nameCapitalized },
        { pattern: /\byour\b/gi, replacement: `${nameCapitalized}'s` },
        { pattern: /Are you/gi, replacement: `${nameCapitalized}, are you` },
        { pattern: /Do you/gi, replacement: `${nameCapitalized}, do you` }
    ];

    // Try to find a good personalization
    for (let p of personalizations) {
        if (line.match(p.pattern)) {
            return line.replace(p.pattern, p.replacement);
        }
    }

    // If no good personalization found, add name at the end
    return `${nameCapitalized}, ${line.toLowerCase()} 💕`;
}

function toggleFavorite() {
    if (!currentLine) return;

    const favoriteIndex = favorites.findIndex(fav => fav.line === currentLine);
    
    if (favoriteIndex > -1) {
        // Remove from favorites
        favorites.splice(favoriteIndex, 1);
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.classList.remove('active');
        showToast('Removed from favorites!', 'info');
        playSound('click');
    } else {
        // Add to favorites
        const favorite = {
            line: currentLine,
            mood: currentMood,
            timestamp: new Date().toISOString(),
            name: nameInput.value.trim() || 'Unknown'
        };
        favorites.unshift(favorite);
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favoriteBtn.classList.add('active');
        showToast('Added to favorites!', 'success');
        playSound('favorite');
        
        // Add heart burst animation
        createHeartBurstEffect();
    }
    
    // Save to localStorage
    localStorage.setItem('pickupLineFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
    displayFavorites();
}

function updateFavoriteButton() {
    if (!currentLine) return;
    
    const isFavorite = favorites.some(fav => fav.line === currentLine);
    
    if (isFavorite) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.classList.remove('active');
    }
}

function copyToClipboard() {
    if (!currentLine) return;
    
    navigator.clipboard.writeText(currentLine).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentLine;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!', 'success');
    });
}

function openShareModal() {
    if (!currentLine) return;
    shareModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeShareModal() {
    shareModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function shareToWhatsApp() {
    const text = encodeURIComponent(`💘 ${currentLine} - Generated by Pick-Up Line Machine!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    closeShareModal();
}

function shareToTwitter() {
    const text = encodeURIComponent(`💘 ${currentLine} - Generated by Pick-Up Line Machine! #PickUpLines #Love`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    closeShareModal();
}

function shareGeneric() {
    if (navigator.share) {
        navigator.share({
            title: 'Pick-Up Line Machine',
            text: `💘 ${currentLine} - Generated by Pick-Up Line Machine!`,
            url: window.location.href
        });
    } else {
        copyToClipboard();
        showToast('Line copied! You can now paste it anywhere!', 'info');
    }
    closeShareModal();
}

function toggleFavorites() {
    const isVisible = favoritesList.style.display !== 'none';
    favoritesList.style.display = isVisible ? 'none' : 'block';
}

function displayFavorites() {
    if (favorites.length === 0) {
        favoritesEmpty.style.display = 'block';
        return;
    }
    
    favoritesEmpty.style.display = 'none';
    
    // Clear existing favorites
    const existingFavorites = favoritesList.querySelectorAll('.favorite-item');
    existingFavorites.forEach(item => item.remove());
    
    // Add favorites
    favorites.forEach((favorite, index) => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="favorite-text">${favorite.line}</div>
            <button class="remove-favorite" onclick="removeFavorite(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        favoritesList.appendChild(favoriteItem);
    });
}

function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('pickupLineFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
    displayFavorites();
    
    // Update favorite button if current line was removed
    updateFavoriteButton();
    
    showToast('Removed from favorites!', 'info');
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
}

function showToast(message, type = 'success') {
    copyToast.textContent = message;
    copyToast.className = `toast ${type}`;
    copyToast.classList.add('show');
    
    setTimeout(() => {
        copyToast.classList.remove('show');
    }, 3000);
}

function showError(message) {
    showToast(message, 'error');
}

function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const heartSymbols = ['💖', '💕', '💗', '💓', '💝', '❤️', '💜', '💙'];
    
    function addHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 8000);
    }
    
    // Add hearts periodically
    setInterval(addHeart, 2000);
    
    // Add initial hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(addHeart, i * 400);
    }
}

function createSparkles() {
    const container = document.getElementById('sparkles');
    
    function addSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        
        container.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 3000);
    }
    
    // Add sparkles periodically
    setInterval(addSparkle, 500);
}

function createSparkleEffect() {
    const container = document.getElementById('sparkles');
    
    // Create burst of sparkles
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = (Math.random() * 60 + 20) + '%';
            sparkle.style.top = (Math.random() * 60 + 20) + '%';
            sparkle.style.animationDelay = '0s';
            
            container.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 3000);
        }, i * 100);
    }
}

// Advanced Features Implementation

// Typewriter effect for displaying pick-up lines
async function typewriterEffect(text) {
    isTyping = true;
    pickupLineElement.textContent = '';
    pickupLineElement.style.borderRight = '2px solid #d63384';
    
    for (let i = 0; i < text.length; i++) {
        pickupLineElement.textContent += text.charAt(i);
        await sleep(typingSpeed);
    }
    
    // Remove cursor
    setTimeout(() => {
        pickupLineElement.style.borderRight = 'none';
        isTyping = false;
    }, 500);
}

// Sound system for enhanced interaction
function playSound(type) {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let frequency, duration;
    
    switch(type) {
        case 'generate':
            frequency = 440;
            duration = 0.1;
            break;
        case 'success':
            frequency = 660;
            duration = 0.2;
            break;
        case 'click':
            frequency = 800;
            duration = 0.05;
            break;
        case 'favorite':
            frequency = 523;
            duration = 0.15;
            break;
        default:
            return;
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Enhanced sparkle effect
function createEnhancedSparkleEffect() {
    const container = document.getElementById('sparkles');
    const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#DDA0DD', '#98FB98'];
    
    // Create burst of colored sparkles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle enhanced';
            sparkle.style.left = (Math.random() * 80 + 10) + '%';
            sparkle.style.top = (Math.random() * 80 + 10) + '%';
            sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            sparkle.style.animationDelay = '0s';
            sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            container.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 3000);
        }, i * 50);
    }
}

// Advanced personalization with better context awareness
function advancedPersonalizeLine(line, name, mood) {
    const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    
    // Mood-specific personalizations
    const moodPatterns = {
        sweet: [
            { pattern: /\byou\b/gi, replacement: `${nameCapitalized}` },
            { pattern: /Are you/gi, replacement: `${nameCapitalized}, are you` }
        ],
        bold: [
            { pattern: /\byou\b/gi, replacement: `gorgeous ${nameCapitalized}` },
            { pattern: /Are you/gi, replacement: `Hey ${nameCapitalized}, are you` }
        ],
        funny: [
            { pattern: /\byou\b/gi, replacement: `${nameCapitalized}` },
            { pattern: /Are you/gi, replacement: `${nameCapitalized}, are you` }
        ]
    };
    
    const patterns = moodPatterns[mood] || moodPatterns.sweet;
    
    for (let p of patterns) {
        if (line.match(p.pattern)) {
            return line.replace(p.pattern, p.replacement);
        }
    }
    
    return `${nameCapitalized}, ${line.toLowerCase()}`;
}

// Intelligent theme detection
function detectThemeFromInput(input) {
    const themes = {
        'coffee': ['coffee', 'espresso', 'latte', 'cappuccino', 'mocha', 'brew', 'cafe'],
        'music': ['music', 'song', 'melody', 'rhythm', 'beat', 'guitar', 'piano', 'singing'],
        'space': ['space', 'star', 'moon', 'planet', 'galaxy', 'universe', 'cosmos', 'astronaut'],
        'books': ['book', 'read', 'novel', 'story', 'poetry', 'literature', 'library'],
        'food': ['food', 'pizza', 'chocolate', 'sweet', 'cooking', 'recipe', 'delicious'],
        'weather': ['sun', 'rain', 'snow', 'storm', 'rainbow', 'cloud', 'weather'],
        'ocean': ['ocean', 'sea', 'wave', 'beach', 'mermaid', 'pearl', 'fish', 'sailor'],
        'flowers': ['flower', 'rose', 'daisy', 'tulip', 'garden', 'bloom', 'petal']
    };
    
    const inputLower = input.toLowerCase();
    
    for (const [theme, keywords] of Object.entries(themes)) {
        if (keywords.some(keyword => inputLower.includes(keyword))) {
            return theme;
        }
    }
    
    return null;
}

// Enhanced mood button interactions
function enhanceMoodButtons() {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                playSound('click');
                this.style.transform = 'translateY(-5px) scale(1.05)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        btn.addEventListener('click', function() {
            playSound('click');
            // Add pulse animation
            this.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// Sleep utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced line quality scoring (prefer more creative lines)
function scoreLineQuality(line, name, mood) {
    let score = 0;
    
    // Prefer longer, more detailed lines
    score += Math.min(line.length / 10, 20);
    
    // Bonus for containing emojis or special characters
    if (line.match(/[💖💕💗💓💝❤️💜💙🌹🔥✨]/)) score += 10;
    
    // Bonus for word play or puns
    if (line.includes('you\'re') || line.includes('your')) score += 5;
    
    // Mood-specific bonuses
    if (mood === 'nerdy' && line.match(/\b(equation|chemical|scientific|math|code)\b/i)) score += 15;
    if (mood === 'romantic' && line.match(/\b(heart|love|beautiful|universe|forever)\b/i)) score += 15;
    
    return score;
}

// Heart burst effect for favorites
function createHeartBurstEffect() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💖', '💕', '💗', '💓', '💝'];
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart burst';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
            heart.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
            heart.style.animation = `heartBurst 1s ease-out forwards`;
            
            container.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 1000);
        }, i * 100);
    }
}

// Enhanced copy functionality with better feedback
function copyToClipboard() {
    if (!currentLine) return;
    
    playSound('click');
    
    navigator.clipboard.writeText(currentLine).then(() => {
        showToast('Copied to clipboard!', 'success');
        // Change button text temporarily
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentLine;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!', 'success');
    });
}

// Service Worker registration (commented out to avoid 404 errors)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then((registration) => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch((registrationError) => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

// Add some extra interactivity
document.addEventListener('mousemove', function(e) {
    // Create trailing sparkles on mouse move (throttled)
    if (Math.random() < 0.1) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.position = 'fixed';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 3000);
    }
});

// Add click effect
document.addEventListener('click', function(e) {
    if (e.target.closest('button') || e.target.closest('.mood-btn')) {
        createClickEffect(e.clientX, e.clientY);
        playSound('click');
    }
});

// Create visual click effect
function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.width = '20px';
    effect.style.height = '20px';
    effect.style.borderRadius = '50%';
    effect.style.background = 'radial-gradient(circle, rgba(214,51,132,0.8) 0%, transparent 70%)';
    effect.style.transform = 'translate(-50%, -50%) scale(0)';
    effect.style.animation = 'clickEffect 0.6s ease-out forwards';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '1000';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 600);
}

// Enhanced input suggestions
const inputSuggestions = [
    'Emma', 'Alex', 'Sarah', 'coffee', 'stars', 'music', 'books', 'pizza', 
    'sunshine', 'ocean', 'flowers', 'chocolate', 'adventure', 'dreams'
];

let suggestionIndex = 0;

// Add input placeholder rotation
setInterval(() => {
    if (!nameInput.value && !document.activeElement === nameInput) {
        nameInput.placeholder = `Try "${inputSuggestions[suggestionIndex]}" or any theme...`;
        suggestionIndex = (suggestionIndex + 1) % inputSuggestions.length;
    }
}, 3000);

// Enhanced keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generatePickupLine();
    }
    
    // Ctrl/Cmd + D to toggle favorites
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleFavorites();
    }
    
    // Space to try another line when result is shown
    if (e.key === ' ' && resultSection.style.display === 'block' && !nameInput.matches(':focus')) {
        e.preventDefault();
        generatePickupLine();
    }
});

// Performance monitoring and optimization
let performanceMetrics = {
    generationTime: 0,
    averageTime: 0,
    totalGenerations: 0
};

function trackPerformance(startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    performanceMetrics.generationTime = duration;
    performanceMetrics.totalGenerations++;
    performanceMetrics.averageTime = 
        (performanceMetrics.averageTime * (performanceMetrics.totalGenerations - 1) + duration) / 
        performanceMetrics.totalGenerations;
    
    // Log performance if it's slow
    if (duration > 1000) {
        console.log('Slow generation detected:', duration + 'ms');
    }
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.width = '20px';
    effect.style.height = '20px';
    effect.style.borderRadius = '50%';
    effect.style.background = 'radial-gradient(circle, #d63384, transparent)';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '1000';
    effect.style.transform = 'translate(-50%, -50%) scale(0)';
    effect.style.animation = 'clickEffect 0.6s ease-out';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 600);
}

// Add CSS for click effect
const style = document.createElement('style');
style.textContent = `
    @keyframes clickEffect {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
