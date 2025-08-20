// Question database for KBC game

/**
 * Question management class
 */
class Questions {
    constructor() {
        this.questionBank = this.initializeQuestions();
        this.usedQuestions = new Set();
        this.currentDifficulty = 'easy';
    }

    /**
     * Initialize the question database
     * @returns {Object} Question database organized by difficulty
     */
    initializeQuestions() {
        return {
            easy: [ // Questions 1-5 (₹5,000 - ₹80,000)
                {
                    question: "Who is the current Prime Minister of India?",
                    options: {
                        A: "Rahul Gandhi",
                        B: "Narendra Modi", 
                        C: "Arvind Kejriwal",
                        D: "Mamata Banerjee"
                    },
                    correct: "B",
                    explanation: "Narendra Modi has been the Prime Minister of India since 2014."
                },
                {
                    question: "What is the capital of India?",
                    options: {
                        A: "Mumbai",
                        B: "Kolkata",
                        C: "New Delhi",
                        D: "Chennai"
                    },
                    correct: "C",
                    explanation: "New Delhi is the capital city of India."
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: {
                        A: "Venus",
                        B: "Mars",
                        C: "Jupiter",
                        D: "Saturn"
                    },
                    correct: "B",
                    explanation: "Mars is known as the Red Planet due to iron oxide on its surface."
                },
                {
                    question: "Who wrote the Indian national anthem 'Jana Gana Mana'?",
                    options: {
                        A: "Mahatma Gandhi",
                        B: "Rabindranath Tagore",
                        C: "Bankim Chandra Chattopadhyay",
                        D: "Subhas Chandra Bose"
                    },
                    correct: "B",
                    explanation: "Rabindranath Tagore wrote Jana Gana Mana, which became India's national anthem."
                },
                {
                    question: "In which year did India gain independence?",
                    options: {
                        A: "1945",
                        B: "1946",
                        C: "1947",
                        D: "1948"
                    },
                    correct: "C",
                    explanation: "India gained independence from British rule on August 15, 1947."
                },
                {
                    question: "What is the largest mammal in the world?",
                    options: {
                        A: "African Elephant",
                        B: "Blue Whale",
                        C: "Giraffe",
                        D: "Great White Shark"
                    },
                    correct: "B",
                    explanation: "The Blue Whale is the largest mammal and the largest animal ever known to live on Earth."
                },
                {
                    question: "Which is the longest river in India?",
                    options: {
                        A: "Yamuna",
                        B: "Godavari",
                        C: "Ganga",
                        D: "Narmada"
                    },
                    correct: "C",
                    explanation: "The Ganga (Ganges) is the longest river in India, flowing for about 2,525 km."
                },
                {
                    question: "How many states are there in India?",
                    options: {
                        A: "27",
                        B: "28",
                        C: "29",
                        D: "30"
                    },
                    correct: "B",
                    explanation: "India has 28 states and 8 union territories as of 2021."
                }
            ],
            medium: [ // Questions 6-10 (₹1.6 Lakh - ₹25 Lakh)
                {
                    question: "Who was the first President of India?",
                    options: {
                        A: "Dr. Rajendra Prasad",
                        B: "Dr. A.P.J. Abdul Kalam",
                        C: "Dr. S. Radhakrishnan",
                        D: "Zakir Hussain"
                    },
                    correct: "A",
                    explanation: "Dr. Rajendra Prasad was the first President of India (1950-1962)."
                },
                {
                    question: "Which Indian city is known as the 'Silicon Valley of India'?",
                    options: {
                        A: "Hyderabad",
                        B: "Pune",
                        C: "Chennai",
                        D: "Bangalore"
                    },
                    correct: "D",
                    explanation: "Bangalore is known as the Silicon Valley of India due to its IT industry concentration."
                },
                {
                    question: "The Ajanta and Ellora caves are located in which state?",
                    options: {
                        A: "Rajasthan",
                        B: "Madhya Pradesh",
                        C: "Maharashtra",
                        D: "Gujarat"
                    },
                    correct: "C",
                    explanation: "The famous Ajanta and Ellora caves are located in Maharashtra."
                },
                {
                    question: "Which Mughal emperor built the Taj Mahal?",
                    options: {
                        A: "Akbar",
                        B: "Shah Jahan",
                        C: "Babur",
                        D: "Aurangzeb"
                    },
                    correct: "B",
                    explanation: "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal."
                },
                {
                    question: "What is the chemical symbol for Gold?",
                    options: {
                        A: "Go",
                        B: "Gd",
                        C: "Au",
                        D: "Ag"
                    },
                    correct: "C",
                    explanation: "Au is the chemical symbol for Gold, derived from the Latin word 'aurum'."
                },
                {
                    question: "Which is the highest mountain peak in India?",
                    options: {
                        A: "Kanchenjunga",
                        B: "Nanda Devi",
                        C: "K2",
                        D: "Annapurna"
                    },
                    correct: "A",
                    explanation: "Kanchenjunga is the highest mountain peak in India and the third highest in the world."
                },
                {
                    question: "Who is known as the 'Iron Man of India'?",
                    options: {
                        A: "Subhas Chandra Bose",
                        B: "Bhagat Singh",
                        C: "Sardar Vallabhbhai Patel",
                        D: "Jawaharlal Nehru"
                    },
                    correct: "C",
                    explanation: "Sardar Vallabhbhai Patel is known as the Iron Man of India for his role in uniting the country."
                },
                {
                    question: "Which Indian scientist won the Nobel Prize in Physics in 1930?",
                    options: {
                        A: "Jagadish Chandra Bose",
                        B: "C.V. Raman",
                        C: "Homi Bhabha",
                        D: "Vikram Sarabhai"
                    },
                    correct: "B",
                    explanation: "C.V. Raman won the Nobel Prize in Physics in 1930 for his discovery of the Raman Effect."
                }
            ],
            hard: [ // Questions 11-15 (₹50 Lakh - ₹7 Crore)
                {
                    question: "Which ancient Indian text is considered the world's first treatise on economics?",
                    options: {
                        A: "Rigveda",
                        B: "Arthashastra",
                        C: "Mahabharata",
                        D: "Upanishads"
                    },
                    correct: "B",
                    explanation: "Arthashastra by Chanakya (Kautilya) is considered the world's first treatise on economics and political science."
                },
                {
                    question: "Who was the first Indian to win an individual Olympic gold medal?",
                    options: {
                        A: "Karnam Malleswari",
                        B: "Leander Paes",
                        C: "Abhinav Bindra",
                        D: "Sushil Kumar"
                    },
                    correct: "C",
                    explanation: "Abhinav Bindra won India's first individual Olympic gold medal in shooting at the 2008 Beijing Olympics."
                },
                {
                    question: "Which Indian mathematician is credited with discovering the concept of zero?",
                    options: {
                        A: "Aryabhata",
                        B: "Brahmagupta",
                        C: "Bhaskara",
                        D: "Ramanujan"
                    },
                    correct: "B",
                    explanation: "Brahmagupta, a 7th-century Indian mathematician, is credited with giving the first known rules for computing with zero."
                },
                {
                    question: "The Indus Valley Civilization was primarily located in which present-day countries?",
                    options: {
                        A: "India and Nepal",
                        B: "India and Bangladesh",
                        C: "India and Pakistan",
                        D: "India and Sri Lanka"
                    },
                    correct: "C",
                    explanation: "The Indus Valley Civilization was primarily located in present-day India and Pakistan."
                },
                {
                    question: "Which Indian freedom fighter was known as 'Netaji'?",
                    options: {
                        A: "Bhagat Singh",
                        B: "Chandra Shekhar Azad",
                        C: "Subhas Chandra Bose",
                        D: "Ashfaqulla Khan"
                    },
                    correct: "C",
                    explanation: "Subhas Chandra Bose was popularly known as 'Netaji' and founded the Indian National Army."
                },
                {
                    question: "Which classical dance form originated in Kerala?",
                    options: {
                        A: "Bharatanatyam",
                        B: "Kathakali",
                        C: "Odissi",
                        D: "Manipuri"
                    },
                    correct: "B",
                    explanation: "Kathakali is the classical dance-drama form that originated in Kerala."
                },
                {
                    question: "The ancient university of Nalanda was located in which present-day state?",
                    options: {
                        A: "West Bengal",
                        B: "Uttar Pradesh",
                        C: "Bihar",
                        D: "Odisha"
                    },
                    correct: "C",
                    explanation: "The ancient university of Nalanda was located in present-day Bihar and was a major center of learning."
                },
                {
                    question: "Which Chola king built the Brihadeeswara Temple in Thanjavur?",
                    options: {
                        A: "Rajaraja Chola I",
                        B: "Rajendra Chola I",
                        C: "Kulottunga Chola I",
                        D: "Parantaka Chola I"
                    },
                    correct: "A",
                    explanation: "Rajaraja Chola I built the magnificent Brihadeeswara Temple in Thanjavur in the 11th century."
                }
            ]
        };
    }

    /**
     * Get a random question based on difficulty level
     * @param {number} questionLevel - Current question level (1-15)
     * @returns {Object} Question object
     */
    getQuestion(questionLevel) {
        let difficulty;
        
        // Determine difficulty based on question level
        if (questionLevel <= 5) {
            difficulty = 'easy';
        } else if (questionLevel <= 10) {
            difficulty = 'medium';
        } else {
            difficulty = 'hard';
        }

        const questions = this.questionBank[difficulty];
        const availableQuestions = questions.filter((_, index) => 
            !this.usedQuestions.has(`${difficulty}_${index}`)
        );

        if (availableQuestions.length === 0) {
            // If no available questions, reset used questions for this difficulty
            this.resetUsedQuestions(difficulty);
            return this.getQuestion(questionLevel);
        }

        // Get random question from available questions
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];
        
        // Find original index and mark as used
        const originalIndex = questions.indexOf(selectedQuestion);
        this.usedQuestions.add(`${difficulty}_${originalIndex}`);

        return {
            ...selectedQuestion,
            level: questionLevel,
            difficulty: difficulty
        };
    }

    /**
     * Reset used questions for a specific difficulty
     * @param {string} difficulty - Difficulty level
     */
    resetUsedQuestions(difficulty) {
        const keysToDelete = [];
        this.usedQuestions.forEach(key => {
            if (key.startsWith(`${difficulty}_`)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.usedQuestions.delete(key));
    }

    /**
     * Reset all used questions
     */
    resetAllQuestions() {
        this.usedQuestions.clear();
    }

    /**
     * Get questions statistics
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const stats = {
            total: 0,
            used: this.usedQuestions.size,
            available: 0,
            byDifficulty: {}
        };

        Object.keys(this.questionBank).forEach(difficulty => {
            const total = this.questionBank[difficulty].length;
            const used = Array.from(this.usedQuestions)
                .filter(key => key.startsWith(`${difficulty}_`)).length;
            
            stats.byDifficulty[difficulty] = {
                total: total,
                used: used,
                available: total - used
            };
            
            stats.total += total;
            stats.available += (total - used);
        });

        return stats;
    }

    /**
     * Add a new question to the database
     * @param {string} difficulty - Difficulty level
     * @param {Object} question - Question object
     */
    addQuestion(difficulty, question) {
        if (!this.questionBank[difficulty]) {
            this.questionBank[difficulty] = [];
        }
        
        // Validate question structure
        if (this.validateQuestion(question)) {
            this.questionBank[difficulty].push(question);
            return true;
        }
        return false;
    }

    /**
     * Validate question structure
     * @param {Object} question - Question object to validate
     * @returns {boolean} True if valid
     */
    validateQuestion(question) {
        return (
            question &&
            typeof question.question === 'string' &&
            question.options &&
            typeof question.options === 'object' &&
            question.options.A &&
            question.options.B &&
            question.options.C &&
            question.options.D &&
            question.correct &&
            ['A', 'B', 'C', 'D'].includes(question.correct) &&
            typeof question.explanation === 'string'
        );
    }

    /**
     * Get difficulty level name
     * @param {number} questionLevel - Question level (1-15)
     * @returns {string} Difficulty name
     */
    getDifficultyName(questionLevel) {
        if (questionLevel <= 5) return 'Easy';
        if (questionLevel <= 10) return 'Medium';
        return 'Hard';
    }

    /**
     * Get question count by difficulty
     * @param {string} difficulty - Difficulty level
     * @returns {number} Number of questions
     */
    getQuestionCount(difficulty) {
        return this.questionBank[difficulty] ? this.questionBank[difficulty].length : 0;
    }

    /**
     * Shuffle options for a question
     * @param {Object} question - Question object
     * @returns {Object} Question with shuffled options
     */
    shuffleOptions(question) {
        const options = { ...question.options };
        const keys = Object.keys(options);
        const values = keys.map(key => options[key]);
        
        // Shuffle values
        const shuffledValues = Utils.shuffleArray(values);
        
        // Create new options mapping
        const shuffledOptions = {};
        keys.forEach((key, index) => {
            shuffledOptions[key] = shuffledValues[index];
        });
        
        // Find new correct answer
        const correctValue = question.options[question.correct];
        const newCorrect = keys.find(key => shuffledOptions[key] === correctValue);
        
        return {
            ...question,
            options: shuffledOptions,
            correct: newCorrect
        };
    }

    /**
     * Get hint for a question (removes two wrong options)
     * @param {Object} question - Question object
     * @returns {Array} Array of option keys to remove
     */
    getFiftyFiftyHint(question) {
        const allOptions = ['A', 'B', 'C', 'D'];
        const wrongOptions = allOptions.filter(key => key !== question.correct);
        
        // Randomly select 2 wrong options to remove
        const shuffled = Utils.shuffleArray(wrongOptions);
        return shuffled.slice(0, 2);
    }

    /**
     * Generate phone a friend response with realistic personality
     * @param {Object} question - Question object
     * @returns {Object} Friend response object
     */
    generatePhoneFriendResponse(question) {
        const correctAnswer = question.correct;
        const allOptions = ['A', 'B', 'C', 'D'];
        
        // Friend personalities with different accuracy rates
        const friends = [
            { name: "Alex", accuracy: 0.85, confidence: "high", style: "confident" },
            { name: "Sam", accuracy: 0.70, confidence: "medium", style: "thoughtful" },
            { name: "Jordan", accuracy: 0.75, confidence: "variable", style: "analytical" },
            { name: "Riley", accuracy: 0.60, confidence: "low", style: "honest" }
        ];
        
        const friend = friends[Math.floor(Math.random() * friends.length)];
        const willAnswerCorrectly = Math.random() < friend.accuracy;
        const suggestedAnswer = willAnswerCorrectly ? correctAnswer : allOptions[Math.floor(Math.random() * allOptions.length)];
        
        // Generate confidence percentage based on friend personality
        let confidenceLevel;
        if (friend.confidence === "high") {
            confidenceLevel = Utils.randomBetween(80, 95);
        } else if (friend.confidence === "medium") {
            confidenceLevel = Utils.randomBetween(60, 80);
        } else if (friend.confidence === "low") {
            confidenceLevel = Utils.randomBetween(40, 65);
        } else { // variable
            confidenceLevel = Utils.randomBetween(50, 90);
        }
        
        // Lower confidence if answer is wrong
        if (!willAnswerCorrectly) {
            confidenceLevel = Math.max(30, confidenceLevel - 20);
        }
        
        // Generate realistic responses based on style
        const responses = {
            confident: [
                `I'm pretty sure it's option ${suggestedAnswer}. I remember reading about this recently.`,
                `Definitely option ${suggestedAnswer}! I'm confident about this one.`,
                `It has to be ${suggestedAnswer}. I've seen this question before somewhere.`
            ],
            thoughtful: [
                `Hmm, let me think... I believe it's option ${suggestedAnswer}, but I'm not 100% certain.`,
                `After thinking about it, I'd go with ${suggestedAnswer}. That sounds right to me.`,
                `My gut feeling says ${suggestedAnswer}, though you should trust your instincts too.`
            ],
            analytical: [
                `Based on what I know, I'd eliminate some options and go with ${suggestedAnswer}.`,
                `Looking at the logic here, ${suggestedAnswer} seems most likely to be correct.`,
                `If I had to analyze this, I'd say ${suggestedAnswer} fits best with the facts.`
            ],
            honest: [
                `I'm not completely sure, but I think it might be ${suggestedAnswer}.`,
                `This is tough, but my best guess would be ${suggestedAnswer}.`,
                `I wish I knew for certain, but ${suggestedAnswer} seems reasonable to me.`
            ]
        };
        
        const responseTexts = responses[friend.style];
        const response = responseTexts[Math.floor(Math.random() * responseTexts.length)];
        
        return {
            friend: friend.name,
            answer: suggestedAnswer,
            confidence: confidenceLevel,
            response: response,
            isCorrect: willAnswerCorrectly
        };
    }

    /**
     * Generate audience poll results
     * @param {Object} question - Question object
     * @returns {Object} Poll results
     */
    generateAudiencePoll(question) {
        const correctAnswer = question.correct;
        const options = ['A', 'B', 'C', 'D'];
        const results = {};
        
        // Generate weighted random percentages (correct answer gets higher chance)
        let remainingPercentage = 100;
        const correctWeight = Utils.randomBetween(45, 75); // Correct answer gets 45-75%
        
        results[correctAnswer] = correctWeight;
        remainingPercentage -= correctWeight;
        
        // Distribute remaining percentage among other options
        const otherOptions = options.filter(opt => opt !== correctAnswer);
        otherOptions.forEach((option, index) => {
            if (index === otherOptions.length - 1) {
                // Last option gets remaining percentage
                results[option] = remainingPercentage;
            } else {
                const percentage = Utils.randomBetween(5, Math.floor(remainingPercentage / 2));
                results[option] = percentage;
                remainingPercentage -= percentage;
            }
        });
        
        return results;
    }

    /**
     * Generate phone a friend response
     * @param {Object} question - Question object
     * @returns {Object} Friend response
     */
    generatePhoneFriendResponse(question) {
        const correctAnswer = question.correct;
        const confidence = Utils.randomBetween(60, 90);
        
        // Friend has high chance to give correct answer
        const isCorrect = Math.random() < (confidence / 100);
        const suggestedAnswer = isCorrect ? correctAnswer : 
            ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
        
        const responses = [
            `I think the answer is ${suggestedAnswer}. I'm quite ${confidence > 80 ? 'confident' : 'sure'} about this one.`,
            `Based on what I know, I would go with option ${suggestedAnswer}. I feel ${confidence}% confident.`,
            `My guess would be ${suggestedAnswer}. I remember reading something about this topic.`,
            `I believe the correct answer is ${suggestedAnswer}. Hope this helps!`,
            `From what I recall, ${suggestedAnswer} seems right to me. Good luck!`
        ];
        
        return {
            answer: suggestedAnswer,
            confidence: confidence,
            response: responses[Math.floor(Math.random() * responses.length)]
        };
    }
}

// Export Questions class
window.Questions = Questions;
