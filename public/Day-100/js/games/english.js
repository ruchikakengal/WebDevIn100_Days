// English Games Module
const englishGames = {
    games: [
        {
            id: 'word_scramble',
            title: 'Word Scramble',
            description: 'Unscramble letters to make words',
            subject: 'english',
            difficulty: 'Easy',
            grades: [1, 2, 3, 4]
        },
        {
            id: 'spelling_bee',
            title: 'Spelling Bee',
            description: 'Spell words correctly',
            subject: 'english',
            difficulty: 'Medium',
            grades: [3, 4, 5, 6]
        },
        {
            id: 'vocabulary_match',
            title: 'Vocabulary Match',
            description: 'Match words with their meanings',
            subject: 'english',
            difficulty: 'Medium',
            grades: [4, 5, 6, 7]
        },
        {
            id: 'sentence_builder',
            title: 'Sentence Builder',
            description: 'Build sentences with given words',
            subject: 'english',
            difficulty: 'Hard',
            grades: [5, 6, 7, 8]
        },
        {
            id: 'rhyming_words',
            title: 'Rhyming Words',
            description: 'Find words that rhyme',
            subject: 'english',
            difficulty: 'Easy',
            grades: [1, 2, 3, 4]
        }
    ],

    // Word lists by grade level
    wordLists: {
        1: ['cat', 'dog', 'sun', 'run', 'fun', 'big', 'red', 'hot', 'top', 'hat'],
        2: ['book', 'look', 'good', 'play', 'day', 'way', 'home', 'come', 'some', 'time'],
        3: ['house', 'mouse', 'about', 'sound', 'found', 'round', 'light', 'night', 'right', 'sight'],
        4: ['friend', 'school', 'teacher', 'student', 'family', 'animal', 'garden', 'window', 'picture', 'kitchen'],
        5: ['beautiful', 'wonderful', 'important', 'different', 'favorite', 'library', 'computer', 'bicycle', 'elephant', 'butterfly'],
        6: ['adventure', 'discovery', 'imagination', 'celebration', 'environment', 'mysterious', 'fantastic', 'incredible', 'dangerous', 'confident'],
        7: ['extraordinary', 'magnificent', 'spectacular', 'fascinating', 'independent', 'responsible', 'achievement', 'opportunity', 'technology', 'democracy'],
        8: ['sophisticated', 'unprecedented', 'revolutionary', 'entrepreneurship', 'philosophical', 'archaeological', 'meteorological', 'psychological', 'geographical', 'mathematical']
    },

    rhymingPairs: {
        1: [['cat', 'hat'], ['sun', 'fun'], ['big', 'pig'], ['red', 'bed'], ['top', 'hop']],
        2: [['book', 'look'], ['play', 'day'], ['home', 'dome'], ['time', 'rhyme'], ['good', 'wood']],
        3: [['house', 'mouse'], ['sound', 'found'], ['light', 'night'], ['way', 'play'], ['round', 'ground']],
        4: [['school', 'cool'], ['friend', 'end'], ['family', 'happily'], ['garden', 'pardon'], ['teacher', 'feature']]
    },

    vocabularyPairs: {
        4: [
            { word: 'happy', meaning: 'feeling joy or pleasure' },
            { word: 'brave', meaning: 'showing courage' },
            { word: 'gentle', meaning: 'kind and careful' },
            { word: 'curious', meaning: 'wanting to learn' },
            { word: 'honest', meaning: 'telling the truth' }
        ],
        5: [
            { word: 'adventure', meaning: 'an exciting experience' },
            { word: 'creative', meaning: 'using imagination to make new things' },
            { word: 'generous', meaning: 'willing to give and share' },
            { word: 'patient', meaning: 'able to wait calmly' },
            { word: 'mysterious', meaning: 'difficult to understand' }
        ],
        6: [
            { word: 'magnificent', meaning: 'extremely beautiful or impressive' },
            { word: 'fascinating', meaning: 'extremely interesting' },
            { word: 'independent', meaning: 'not needing help from others' },
            { word: 'confident', meaning: 'sure of oneself' },
            { word: 'determined', meaning: 'having made a firm decision' }
        ],
        7: [
            { word: 'extraordinary', meaning: 'very unusual or remarkable' },
            { word: 'spectacular', meaning: 'beautiful in a dramatic way' },
            { word: 'achievement', meaning: 'something accomplished successfully' },
            { word: 'opportunity', meaning: 'a chance for progress or advancement' },
            { word: 'responsibility', meaning: 'duty to deal with something' }
        ],
        8: [
            { word: 'sophisticated', meaning: 'having great knowledge or experience' },
            { word: 'unprecedented', meaning: 'never done or known before' },
            { word: 'revolutionary', meaning: 'involving great change' },
            { word: 'philosophical', meaning: 'relating to the study of ideas about knowledge' },
            { word: 'entrepreneurship', meaning: 'the activity of setting up businesses' }
        ]
    },

    currentGame: null,
    currentWord: null,
    wordCount: 0,
    correctAnswers: 0,
    gameApp: null,

    initGame(game, app) {
        this.currentGame = game;
        this.gameApp = app;
        this.wordCount = 0;
        this.correctAnswers = 0;
        this.setupGameArea();
        this.startNextRound();
    },

    setupGameArea() {
        const gameArea = document.getElementById('gameArea');
        const gameControls = document.getElementById('gameControls');
        
        switch(this.currentGame.id) {
            case 'word_scramble':
                this.setupWordScramble(gameArea, gameControls);
                break;
            case 'spelling_bee':
                this.setupSpellingBee(gameArea, gameControls);
                break;
            case 'vocabulary_match':
                this.setupVocabularyMatch(gameArea, gameControls);
                break;
            case 'rhyming_words':
                this.setupRhymingWords(gameArea, gameControls);
                break;
            case 'sentence_builder':
                this.setupSentenceBuilder(gameArea, gameControls);
                break;
        }
    },

    setupWordScramble(gameArea, gameControls) {
        gameArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" id="englishProgress" style="width: 0%"></div>
            </div>
            <div class="word-display" id="wordHint">Word #1</div>
            <div class="scrambled-letters" id="scrambledLetters"></div>
            <div class="word-input" id="wordInput"></div>
        `;
        
        gameControls.innerHTML = `
            <button class="game-btn hint-btn" id="englishHint">
                <i class="fas fa-lightbulb"></i> Hint
            </button>
            <button class="game-btn" id="englishCheck">
                <i class="fas fa-check"></i> Check Answer
            </button>
            <button class="game-btn skip-btn" id="englishSkip">
                <i class="fas fa-forward"></i> Skip
            </button>
        `;
        
        this.setupDragAndDrop();
        this.addEventListeners();
    },

    setupSpellingBee(gameArea, gameControls) {
        gameArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" id="englishProgress" style="width: 0%"></div>
            </div>
            <div class="word-display" id="wordDisplay">Listen and Spell</div>
            <div class="spelling-input">
                <input type="text" id="spellingAnswer" placeholder="Type the word here..." maxlength="20">
            </div>
        `;
        
        gameControls.innerHTML = `
            <button class="game-btn" id="playAudio">
                <i class="fas fa-volume-up"></i> Play Word
            </button>
            <button class="game-btn hint-btn" id="englishHint">
                <i class="fas fa-lightbulb"></i> Hint
            </button>
            <button class="game-btn" id="englishCheck">
                <i class="fas fa-check"></i> Check Spelling
            </button>
            <button class="game-btn skip-btn" id="englishSkip">
                <i class="fas fa-forward"></i> Skip
            </button>
        `;
        
        this.addEventListeners();
    },

    setupVocabularyMatch(gameArea, gameControls) {
        gameArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" id="englishProgress" style="width: 0%"></div>
            </div>
            <div class="word-display" id="wordDisplay"></div>
            <div class="vocab-options" id="vocabOptions"></div>
        `;
        
        gameControls.innerHTML = `
            <button class="game-btn hint-btn" id="englishHint">
                <i class="fas fa-lightbulb"></i> Show Definition Again
            </button>
            <button class="game-btn skip-btn" id="englishSkip">
                <i class="fas fa-forward"></i> Skip
            </button>
        `;
        
        this.addEventListeners();
    },

    setupRhymingWords(gameArea, gameControls) {
        gameArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" id="englishProgress" style="width: 0%"></div>
            </div>
            <div class="word-display" id="wordDisplay"></div>
            <div class="rhyme-options" id="rhymeOptions"></div>
        `;
        
        gameControls.innerHTML = `
            <button class="game-btn hint-btn" id="englishHint">
                <i class="fas fa-lightbulb"></i> Hint
            </button>
            <button class="game-btn skip-btn" id="englishSkip">
                <i class="fas fa-forward"></i> Skip
            </button>
        `;
        
        this.addEventListeners();
    },

    setupDragAndDrop() {
        // Will be implemented for word scramble
        const wordInput = document.getElementById('wordInput');
        const scrambledLetters = document.getElementById('scrambledLetters');
        
        // Make word input a drop zone
        wordInput.addEventListener('dragover', this.handleDragOver.bind(this));
        wordInput.addEventListener('drop', this.handleDrop.bind(this));
    },

    addEventListeners() {
        const hintBtn = document.getElementById('englishHint');
        const checkBtn = document.getElementById('englishCheck');
        const skipBtn = document.getElementById('englishSkip');
        const playAudioBtn = document.getElementById('playAudio');
        
        if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
        if (checkBtn) checkBtn.addEventListener('click', () => this.checkAnswer());
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipWord());
        if (playAudioBtn) playAudioBtn.addEventListener('click', () => this.playWordAudio());
        
        // For spelling bee, allow Enter key to check answer
        const spellingInput = document.getElementById('spellingAnswer');
        if (spellingInput) {
            spellingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }
    },

    startNextRound() {
        if (this.wordCount >= 10) {
            this.completeGame();
            return;
        }

        const grade = parseInt(this.gameApp.currentGrade);
        
        switch(this.currentGame.id) {
            case 'word_scramble':
                this.generateWordScramble(grade);
                break;
            case 'spelling_bee':
                this.generateSpellingWord(grade);
                break;
            case 'vocabulary_match':
                this.generateVocabularyQuestion(grade);
                break;
            case 'rhyming_words':
                this.generateRhymingQuestion(grade);
                break;
            case 'sentence_builder':
                this.generateSentenceQuestion(grade);
                break;
        }
        
        this.updateProgress();
    },

    generateWordScramble(grade) {
        const words = this.wordLists[grade] || this.wordLists[4];
        const word = words[Math.floor(Math.random() * words.length)];
        this.currentWord = {
            original: word,
            scrambled: this.scrambleWord(word),
            hint: `This word has ${word.length} letters`
        };
        
        document.getElementById('wordHint').textContent = `Word #${this.wordCount + 1}: ${this.currentWord.hint}`;
        this.displayScrambledWord(this.currentWord.scrambled);
    },

    generateSpellingWord(grade) {
        const words = this.wordLists[grade] || this.wordLists[4];
        const word = words[Math.floor(Math.random() * words.length)];
        this.currentWord = {
            original: word,
            hint: `This word starts with "${word[0]}" and has ${word.length} letters`
        };
        
        document.getElementById('wordDisplay').textContent = `Word #${this.wordCount + 1} - Listen carefully!`;
        document.getElementById('spellingAnswer').value = '';
        document.getElementById('spellingAnswer').focus();
    },

    generateVocabularyQuestion(grade) {
        const vocabList = this.vocabularyPairs[grade] || this.vocabularyPairs[4];
        const correct = vocabList[Math.floor(Math.random() * vocabList.length)];
        
        // Generate wrong options
        const wrongOptions = vocabList.filter(item => item.word !== correct.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        
        const allOptions = [correct, ...wrongOptions].sort(() => 0.5 - Math.random());
        
        this.currentWord = {
            question: correct.meaning,
            answer: correct.word,
            options: allOptions.map(item => item.word),
            hint: `Think about the meaning: "${correct.meaning}"`
        };
        
        document.getElementById('wordDisplay').innerHTML = `
            <h4>What word means:</h4>
            <p>"${this.currentWord.question}"</p>
        `;
        
        this.displayVocabOptions(this.currentWord.options);
    },

    generateRhymingQuestion(grade) {
        const rhymes = this.rhymingPairs[Math.min(grade, 4)] || this.rhymingPairs[2];
        const correctPair = rhymes[Math.floor(Math.random() * rhymes.length)];
        const targetWord = correctPair[0];
        const correctRhyme = correctPair[1];
        
        // Generate wrong options
        const allWords = this.wordLists[grade] || this.wordLists[4];
        const wrongOptions = allWords.filter(word => 
            word !== correctRhyme && word !== targetWord && !this.doWordsRhyme(word, targetWord)
        ).sort(() => 0.5 - Math.random()).slice(0, 3);
        
        const allOptions = [correctRhyme, ...wrongOptions].sort(() => 0.5 - Math.random());
        
        this.currentWord = {
            question: targetWord,
            answer: correctRhyme,
            options: allOptions,
            hint: `Words that rhyme have similar ending sounds`
        };
        
        document.getElementById('wordDisplay').innerHTML = `
            <h4>Which word rhymes with:</h4>
            <p style="font-size: 2rem; color: #667eea; font-weight: bold;">${this.currentWord.question}</p>
        `;
        
        this.displayRhymeOptions(this.currentWord.options);
    },

    scrambleWord(word) {
        const letters = word.split('');
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        return letters.join('');
    },

    displayScrambledWord(scrambled) {
        const container = document.getElementById('scrambledLetters');
        container.innerHTML = '';
        
        scrambled.split('').forEach((letter, index) => {
            const letterTile = document.createElement('div');
            letterTile.className = 'letter-tile';
            letterTile.textContent = letter.toUpperCase();
            letterTile.draggable = true;
            letterTile.dataset.letter = letter;
            letterTile.dataset.index = index;
            
            letterTile.addEventListener('dragstart', this.handleDragStart.bind(this));
            letterTile.addEventListener('dragend', this.handleDragEnd.bind(this));
            
            container.appendChild(letterTile);
        });
        
        // Clear word input
        document.getElementById('wordInput').innerHTML = '';
    },

    displayVocabOptions(options) {
        const container = document.getElementById('vocabOptions');
        container.innerHTML = '';
        container.className = 'science-options'; // Reuse science option styles
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'science-option';
            button.textContent = option;
            button.addEventListener('click', () => this.checkVocabAnswer(option, button));
            container.appendChild(button);
        });
    },

    displayRhymeOptions(options) {
        const container = document.getElementById('rhymeOptions');
        container.innerHTML = '';
        container.className = 'science-options';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'science-option';
            button.textContent = option;
            button.addEventListener('click', () => this.checkRhymeAnswer(option, button));
            container.appendChild(button);
        });
    },

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.letter);
        e.target.classList.add('dragging');
    },

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    },

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    },

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const letter = e.dataTransfer.getData('text/plain');
        const letterTile = document.createElement('div');
        letterTile.className = 'letter-tile';
        letterTile.textContent = letter.toUpperCase();
        
        // Add remove functionality
        letterTile.addEventListener('click', () => {
            letterTile.remove();
        });
        
        document.getElementById('wordInput').appendChild(letterTile);
    },

    checkAnswer() {
        let userAnswer = '';
        
        switch(this.currentGame.id) {
            case 'word_scramble':
                const letterTiles = document.querySelectorAll('#wordInput .letter-tile');
                userAnswer = Array.from(letterTiles).map(tile => tile.textContent.toLowerCase()).join('');
                break;
            case 'spelling_bee':
                userAnswer = document.getElementById('spellingAnswer').value.toLowerCase().trim();
                break;
        }
        
        const isCorrect = userAnswer === this.currentWord.original;
        this.processAnswer(isCorrect, userAnswer);
    },

    checkVocabAnswer(selectedAnswer, buttonElement) {
        const isCorrect = selectedAnswer === this.currentWord.answer;
        
        // Disable all buttons and show correct answer
        document.querySelectorAll('#vocabOptions .science-option').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === this.currentWord.answer) {
                btn.classList.add('correct');
            } else if (btn === buttonElement && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        this.processAnswer(isCorrect, selectedAnswer);
    },

    checkRhymeAnswer(selectedAnswer, buttonElement) {
        const isCorrect = selectedAnswer === this.currentWord.answer;
        
        // Disable all buttons and show correct answer
        document.querySelectorAll('#rhymeOptions .science-option').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === this.currentWord.answer) {
                btn.classList.add('correct');
            } else if (btn === buttonElement && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        this.processAnswer(isCorrect, selectedAnswer);
    },

    processAnswer(isCorrect, userAnswer) {
        if (isCorrect) {
            this.correctAnswers++;
            this.gameApp.updateScore(10);
            audioManager.playSound('correct');
            this.showFeedback('Excellent! Well done!', 'correct');
        } else {
            audioManager.playSound('incorrect');
            this.showFeedback(`Not quite! The correct answer is "${this.currentWord.original || this.currentWord.answer}"`, 'incorrect');
        }
        
        setTimeout(() => {
            this.wordCount++;
            this.startNextRound();
        }, 2500);
    },

    playWordAudio() {
        if (this.currentWord && this.currentWord.original) {
            // Simulate audio playback with text-to-speech API or show word briefly
            this.showFeedback(`Listen: "${this.currentWord.original.toUpperCase()}"`, 'info');
        }
    },

    showHint() {
        if (this.currentWord && this.currentWord.hint) {
            this.showFeedback(this.currentWord.hint, 'hint');
        }
    },

    skipWord() {
        this.wordCount++;
        this.startNextRound();
    },

    updateProgress() {
        const progress = (this.wordCount / 10) * 100;
        document.getElementById('englishProgress').style.width = progress + '%';
    },

    doWordsRhyme(word1, word2) {
        // Simple rhyme detection - check if words end with similar sounds
        const endings = {
            'at': ['cat', 'hat', 'bat', 'rat', 'mat'],
            'un': ['sun', 'fun', 'run', 'gun'],
            'ig': ['big', 'pig', 'fig', 'wig'],
            'ed': ['red', 'bed', 'led', 'fed'],
            'op': ['top', 'hop', 'pop', 'mop']
        };
        
        for (const [ending, words] of Object.entries(endings)) {
            if (words.includes(word1) && words.includes(word2)) {
                return true;
            }
        }
        return false;
    },

    completeGame() {
        const gameTime = Math.floor((Date.now() - this.gameApp.gameStartTime) / 1000);
        const accuracy = Math.round((this.correctAnswers / 10) * 100);
        const score = parseInt(document.getElementById('currentScore').textContent);
        
        const stats = {
            score: score,
            correct: this.correctAnswers,
            total: 10,
            accuracy: accuracy,
            time: gameTime
        };
        
        this.gameApp.gameCompleted(stats);
    },

    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        
        const icons = {
            correct: 'fa-check-circle',
            incorrect: 'fa-times-circle',
            hint: 'fa-lightbulb',
            info: 'fa-info-circle'
        };
        
        feedback.innerHTML = `
            <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
            <h4>${type === 'correct' ? 'Correct!' : type === 'incorrect' ? 'Try Again!' : type === 'hint' ? 'Hint' : 'Info'}</h4>
            <p>${message}</p>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, type === 'hint' || type === 'info' ? 4000 : 2500);
    }
};
