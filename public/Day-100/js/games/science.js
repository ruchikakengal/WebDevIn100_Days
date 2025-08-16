// Science Games Module
const scienceGames = {
    games: [
        {
            id: 'animal_facts',
            title: 'Animal Kingdom',
            description: 'Learn about different animals',
            subject: 'science',
            difficulty: 'Easy',
            grades: [1, 2, 3, 4]
        },
        {
            id: 'plant_life',
            title: 'Plant Life',
            description: 'Discover how plants grow',
            subject: 'science',
            difficulty: 'Easy',
            grades: [2, 3, 4, 5]
        },
        {
            id: 'weather_patterns',
            title: 'Weather & Climate',
            description: 'Understanding weather phenomena',
            subject: 'science',
            difficulty: 'Medium',
            grades: [3, 4, 5, 6]
        },
        {
            id: 'human_body',
            title: 'Human Body',
            description: 'Learn about body systems',
            subject: 'science',
            difficulty: 'Medium',
            grades: [4, 5, 6, 7]
        },
        {
            id: 'space_exploration',
            title: 'Space & Planets',
            description: 'Explore the solar system',
            subject: 'science',
            difficulty: 'Hard',
            grades: [5, 6, 7, 8]
        }
    ],

    // Question databases by topic and grade
    questionBank: {
        animal_facts: {
            1: [
                {
                    question: "Which animal is known as the 'King of the Jungle'?",
                    options: ["Lion", "Tiger", "Elephant", "Bear"],
                    correct: 0,
                    explanation: "Lions are called the 'King of the Jungle' because they are powerful predators.",
                    icon: "🦁"
                },
                {
                    question: "What do cows eat?",
                    options: ["Meat", "Fish", "Grass", "Insects"],
                    correct: 2,
                    explanation: "Cows are herbivores, which means they eat plants like grass.",
                    icon: "🐄"
                },
                {
                    question: "How many legs does a spider have?",
                    options: ["6", "8", "10", "4"],
                    correct: 1,
                    explanation: "All spiders have 8 legs. This is what makes them arachnids!",
                    icon: "🕷️"
                },
                {
                    question: "Which animal lays eggs?",
                    options: ["Dog", "Cat", "Bird", "Horse"],
                    correct: 2,
                    explanation: "Birds lay eggs to have babies. The eggs keep the baby birds safe as they grow.",
                    icon: "🐦"
                },
                {
                    question: "What sound does a duck make?",
                    options: ["Moo", "Quack", "Bark", "Meow"],
                    correct: 1,
                    explanation: "Ducks make a 'quack' sound to communicate with other ducks.",
                    icon: "🦆"
                }
            ],
            2: [
                {
                    question: "Which animal changes color to hide from predators?",
                    options: ["Elephant", "Chameleon", "Horse", "Rabbit"],
                    correct: 1,
                    explanation: "Chameleons can change their skin color to blend in with their surroundings.",
                    icon: "🦎"
                },
                {
                    question: "What do bees make?",
                    options: ["Milk", "Honey", "Butter", "Cheese"],
                    correct: 1,
                    explanation: "Bees collect nectar from flowers and turn it into honey in their hives.",
                    icon: "🐝"
                },
                {
                    question: "Which animal is the tallest in the world?",
                    options: ["Elephant", "Giraffe", "Horse", "Camel"],
                    correct: 1,
                    explanation: "Giraffes are the tallest animals, with their long necks helping them eat leaves from tall trees.",
                    icon: "🦒"
                }
            ]
        },
        plant_life: {
            2: [
                {
                    question: "What do plants need to grow?",
                    options: ["Only water", "Only sunlight", "Water, sunlight, and air", "Only soil"],
                    correct: 2,
                    explanation: "Plants need water, sunlight, and air (carbon dioxide) to make their own food through photosynthesis.",
                    icon: "🌱"
                },
                {
                    question: "What part of the plant grows underground?",
                    options: ["Leaves", "Flowers", "Roots", "Stem"],
                    correct: 2,
                    explanation: "Roots grow underground and help the plant get water and nutrients from the soil.",
                    icon: "🌿"
                }
            ],
            3: [
                {
                    question: "What is the process called when plants make their own food?",
                    options: ["Digestion", "Photosynthesis", "Breathing", "Growing"],
                    correct: 1,
                    explanation: "Photosynthesis is when plants use sunlight, water, and carbon dioxide to make their own food.",
                    icon: "☀️"
                }
            ]
        },
        weather_patterns: {
            3: [
                {
                    question: "What causes rain?",
                    options: ["Clouds getting heavy with water", "Wind blowing hard", "The sun getting hot", "Stars shining"],
                    correct: 0,
                    explanation: "Rain happens when water droplets in clouds become too heavy and fall to the ground.",
                    icon: "☔"
                },
                {
                    question: "What do we call frozen rain?",
                    options: ["Snow", "Hail", "Sleet", "All of these"],
                    correct: 3,
                    explanation: "Snow, hail, and sleet are all different forms of frozen precipitation.",
                    icon: "❄️"
                }
            ]
        },
        human_body: {
            4: [
                {
                    question: "How many bones are in an adult human body?",
                    options: ["106", "206", "306", "156"],
                    correct: 1,
                    explanation: "An adult human has 206 bones. Babies are born with about 270 bones, but some fuse together as they grow.",
                    icon: "🦴"
                },
                {
                    question: "Which organ pumps blood through your body?",
                    options: ["Brain", "Lungs", "Heart", "Stomach"],
                    correct: 2,
                    explanation: "The heart is a muscle that pumps blood throughout your body to deliver oxygen and nutrients.",
                    icon: "❤️"
                }
            ]
        },
        space_exploration: {
            5: [
                {
                    question: "Which planet is closest to the Sun?",
                    options: ["Venus", "Earth", "Mercury", "Mars"],
                    correct: 2,
                    explanation: "Mercury is the closest planet to the Sun, which makes it very hot during the day.",
                    icon: "☀️"
                },
                {
                    question: "How many planets are in our solar system?",
                    options: ["7", "8", "9", "10"],
                    correct: 1,
                    explanation: "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
                    icon: "🪐"
                }
            ]
        }
    },

    currentGame: null,
    currentQuestion: null,
    questionCount: 0,
    correctAnswers: 0,
    gameApp: null,

    initGame(game, app) {
        this.currentGame = game;
        this.gameApp = app;
        this.questionCount = 0;
        this.correctAnswers = 0;
        this.setupGameArea();
        this.generateQuestion();
    },

    setupGameArea() {
        const gameArea = document.getElementById('gameArea');
        const gameControls = document.getElementById('gameControls');
        
        gameArea.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" id="scienceProgress" style="width: 0%"></div>
            </div>
            <div class="science-question" id="scienceQuestion">
                <div class="science-image" id="scienceImage"></div>
                <h4 id="questionText"></h4>
            </div>
            <div class="science-options" id="scienceOptions"></div>
        `;
        
        gameControls.innerHTML = `
            <button class="game-btn hint-btn" id="scienceHint">
                <i class="fas fa-lightbulb"></i> Hint
            </button>
            <button class="game-btn skip-btn" id="scienceSkip">
                <i class="fas fa-forward"></i> Skip
            </button>
        `;
        
        // Add event listeners
        document.getElementById('scienceHint').addEventListener('click', () => this.showHint());
        document.getElementById('scienceSkip').addEventListener('click', () => this.skipQuestion());
    },

    generateQuestion() {
        if (this.questionCount >= 10) {
            this.completeGame();
            return;
        }

        const grade = parseInt(this.gameApp.currentGrade);
        const topicId = this.currentGame.id;
        
        // Get questions for this topic and grade
        const questionsForTopic = this.questionBank[topicId];
        if (!questionsForTopic) {
            console.error('No questions found for topic:', topicId);
            return;
        }
        
        // Find appropriate grade level questions
        let questions = questionsForTopic[grade];
        if (!questions || questions.length === 0) {
            // Try nearby grades if exact grade not available
            const grades = Object.keys(questionsForTopic).map(Number).sort();
            const closestGrade = grades.reduce((prev, curr) => 
                Math.abs(curr - grade) < Math.abs(prev - grade) ? curr : prev
            );
            questions = questionsForTopic[closestGrade];
        }
        
        if (!questions || questions.length === 0) {
            console.error('No questions available for this game and grade level');
            return;
        }
        
        // Select a random question
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        this.currentQuestion = randomQuestion;
        
        this.displayQuestion(randomQuestion);
        this.updateProgress();
    },

    displayQuestion(question) {
        // Update question number and icon
        document.getElementById('scienceImage').textContent = question.icon || '🔬';
        document.getElementById('questionText').textContent = `${this.questionCount + 1}. ${question.question}`;
        
        // Display options
        const optionsContainer = document.getElementById('scienceOptions');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'science-option';
            button.textContent = option;
            button.dataset.option = String.fromCharCode(65 + index); // A, B, C, D
            button.addEventListener('click', () => this.checkAnswer(index, button));
            optionsContainer.appendChild(button);
        });
    },

    checkAnswer(selectedIndex, buttonElement) {
        const isCorrect = selectedIndex === this.currentQuestion.correct;
        
        // Disable all option buttons and show correct answer
        document.querySelectorAll('.science-option').forEach((btn, index) => {
            btn.disabled = true;
            if (index === this.currentQuestion.correct) {
                btn.classList.add('correct');
            } else if (btn === buttonElement && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        if (isCorrect) {
            this.correctAnswers++;
            this.gameApp.updateScore(10);
            audioManager.playSound('correct');
            this.showFeedback('Excellent! ' + this.currentQuestion.explanation, 'correct');
        } else {
            audioManager.playSound('incorrect');
            const correctAnswer = this.currentQuestion.options[this.currentQuestion.correct];
            this.showFeedback(`Not quite! The correct answer is "${correctAnswer}". ${this.currentQuestion.explanation}`, 'incorrect');
        }
        
        setTimeout(() => {
            this.questionCount++;
            this.generateQuestion();
        }, 4000);
    },

    showHint() {
        if (this.currentQuestion && this.currentQuestion.explanation) {
            // Give a partial hint without revealing the full answer
            const hints = {
                animal_facts: "Think about what you know about this animal's characteristics or behavior.",
                plant_life: "Consider what plants need to survive and grow healthy.",
                weather_patterns: "Think about what happens in the sky and atmosphere.",
                human_body: "Consider how different parts of your body work together.",
                space_exploration: "Think about what you know about planets and space."
            };
            
            const hint = hints[this.currentGame.id] || "Think carefully about what you've learned!";
            this.showFeedback(hint, 'hint');
        }
    },

    skipQuestion() {
        this.questionCount++;
        this.generateQuestion();
    },

    updateProgress() {
        const progress = (this.questionCount / 10) * 100;
        document.getElementById('scienceProgress').style.width = progress + '%';
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
        }, type === 'hint' ? 5000 : type === 'incorrect' ? 4000 : 3000);
    }
};
