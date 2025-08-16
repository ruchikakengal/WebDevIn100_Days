// Math Games Module
const mathGames = {
    games: [
        {
            id: 'addition_basic',
            title: 'Addition Fun',
            description: 'Practice basic addition problems',
            subject: 'math',
            difficulty: 'Easy',
            grades: [1, 2, 3]
        },
        {
            id: 'subtraction_basic',
            title: 'Subtraction Challenge',
            description: 'Learn subtraction with fun problems',
            subject: 'math',
            difficulty: 'Easy',
            grades: [2, 3, 4]
        },
        {
            id: 'multiplication_tables',
            title: 'Times Tables',
            description: 'Master multiplication tables',
            subject: 'math',
            difficulty: 'Medium',
            grades: [3, 4, 5, 6]
        },
        {
            id: 'division_basic',
            title: 'Division Practice',
            description: 'Practice division problems',
            subject: 'math',
            difficulty: 'Medium',
            grades: [4, 5, 6]
        },
        {
            id: 'mixed_operations',
            title: 'Mixed Math',
            description: 'All operations combined',
            subject: 'math',
            difficulty: 'Hard',
            grades: [5, 6, 7, 8]
        }
    ],

    currentGame: null,
    currentProblem: null,
    problemCount: 0,
    correctAnswers: 0,
    gameApp: null,

    initGame(game, app) {
        this.currentGame = game;
        this.gameApp = app;
        this.problemCount = 0;
        this.correctAnswers = 0;
        this.setupGameArea();
        this.generateProblem();
    },

    setupGameArea() {
        const gameArea = document.getElementById('gameArea');
        const gameControls = document.getElementById('gameControls');
        
        gameArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" id="mathProgress" style="width: 0%"></div>
            </div>
            <div class="math-problem" id="mathProblem"></div>
            <div class="math-options" id="mathOptions"></div>
        `;
        
        gameControls.innerHTML = `
            <button class="game-btn hint-btn" id="mathHint">
                <i class="fas fa-lightbulb"></i> Hint
            </button>
            <button class="game-btn skip-btn" id="mathSkip">
                <i class="fas fa-forward"></i> Skip
            </button>
        `;
        
        // Add event listeners
        document.getElementById('mathHint').addEventListener('click', () => this.showHint());
        document.getElementById('mathSkip').addEventListener('click', () => this.skipProblem());
    },

    generateProblem() {
        if (this.problemCount >= 10) {
            this.completeGame();
            return;
        }

        const grade = parseInt(this.gameApp.currentGrade);
        let problem;

        switch(this.currentGame.id) {
            case 'addition_basic':
                problem = this.generateAddition(grade);
                break;
            case 'subtraction_basic':
                problem = this.generateSubtraction(grade);
                break;
            case 'multiplication_tables':
                problem = this.generateMultiplication(grade);
                break;
            case 'division_basic':
                problem = this.generateDivision(grade);
                break;
            case 'mixed_operations':
                problem = this.generateMixedOperation(grade);
                break;
            default:
                problem = this.generateAddition(grade);
        }

        this.currentProblem = problem;
        this.displayProblem(problem);
        this.updateProgress();
    },

    generateAddition(grade) {
        let max = grade <= 2 ? 10 : grade <= 4 ? 50 : 100;
        const a = Math.floor(Math.random() * max) + 1;
        const b = Math.floor(Math.random() * max) + 1;
        const answer = a + b;
        
        return {
            question: `${a} + ${b} = ?`,
            answer: answer,
            options: this.generateOptions(answer),
            explanation: `${a} + ${b} = ${answer}`,
            hint: `Try counting up from ${a} by ${b} steps`
        };
    },

    generateSubtraction(grade) {
        let max = grade <= 3 ? 20 : grade <= 5 ? 50 : 100;
        const b = Math.floor(Math.random() * max) + 1;
        const answer = Math.floor(Math.random() * max) + 1;
        const a = answer + b;
        
        return {
            question: `${a} - ${b} = ?`,
            answer: answer,
            options: this.generateOptions(answer),
            explanation: `${a} - ${b} = ${answer}`,
            hint: `Think: what number plus ${b} equals ${a}?`
        };
    },

    generateMultiplication(grade) {
        const maxFactor = grade <= 4 ? 5 : grade <= 6 ? 10 : 12;
        const a = Math.floor(Math.random() * maxFactor) + 1;
        const b = Math.floor(Math.random() * maxFactor) + 1;
        const answer = a * b;
        
        return {
            question: `${a} × ${b} = ?`,
            answer: answer,
            options: this.generateOptions(answer),
            explanation: `${a} × ${b} = ${answer}`,
            hint: `Think of ${a} groups of ${b} items each`
        };
    },

    generateDivision(grade) {
        const divisor = Math.floor(Math.random() * 8) + 2;
        const answer = Math.floor(Math.random() * 10) + 1;
        const dividend = divisor * answer;
        
        return {
            question: `${dividend} ÷ ${divisor} = ?`,
            answer: answer,
            options: this.generateOptions(answer),
            explanation: `${dividend} ÷ ${divisor} = ${answer}`,
            hint: `How many groups of ${divisor} fit into ${dividend}?`
        };
    },

    generateMixedOperation(grade) {
        const operations = ['add', 'subtract', 'multiply'];
        if (grade >= 5) operations.push('divide');
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        switch(operation) {
            case 'add': return this.generateAddition(grade);
            case 'subtract': return this.generateSubtraction(grade);
            case 'multiply': return this.generateMultiplication(grade);
            case 'divide': return this.generateDivision(grade);
        }
    },

    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        
        while (options.length < 4) {
            let wrongAnswer;
            if (correctAnswer <= 10) {
                wrongAnswer = Math.max(0, correctAnswer + Math.floor(Math.random() * 6) - 3);
            } else if (correctAnswer <= 50) {
                wrongAnswer = Math.max(0, correctAnswer + Math.floor(Math.random() * 20) - 10);
            } else {
                wrongAnswer = Math.max(0, correctAnswer + Math.floor(Math.random() * 40) - 20);
            }
            
            if (!options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    },

    displayProblem(problem) {
        document.getElementById('mathProblem').textContent = problem.question;
        
        const optionsContainer = document.getElementById('mathOptions');
        optionsContainer.innerHTML = '';
        
        problem.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'math-option';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(option, button));
            optionsContainer.appendChild(button);
        });
    },

    checkAnswer(selectedAnswer, buttonElement) {
        const isCorrect = selectedAnswer === this.currentProblem.answer;
        
        // Disable all option buttons
        document.querySelectorAll('.math-option').forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.textContent) === this.currentProblem.answer) {
                btn.classList.add('correct');
            } else if (btn === buttonElement && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        if (isCorrect) {
            this.correctAnswers++;
            this.gameApp.updateScore(10);
            audioManager.playSound('correct');
            this.showFeedback('Correct! Well done!', 'correct');
        } else {
            audioManager.playSound('incorrect');
            this.showFeedback(`Not quite! The answer is ${this.currentProblem.answer}`, 'incorrect');
        }
        
        setTimeout(() => {
            this.problemCount++;
            this.generateProblem();
        }, 2000);
    },

    showHint() {
        if (this.currentProblem && this.currentProblem.hint) {
            this.showFeedback(this.currentProblem.hint, 'hint');
        }
    },

    skipProblem() {
        this.problemCount++;
        this.generateProblem();
    },

    updateProgress() {
        const progress = (this.problemCount / 10) * 100;
        document.getElementById('mathProgress').style.width = progress + '%';
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
            hint: 'fa-lightbulb'
        };
        
        feedback.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <h4>${type === 'correct' ? 'Correct!' : type === 'incorrect' ? 'Try Again!' : 'Hint'}</h4>
            <p>${message}</p>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, type === 'hint' ? 4000 : 2000);
    }
};
