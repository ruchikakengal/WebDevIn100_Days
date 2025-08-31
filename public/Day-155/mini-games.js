class MiniGames {
    constructor() {
        this.currentGame = null;
        this.gameState = {};
    }

    getChallenge(suit, number) {
        const difficulty = this.getDifficultyLevel(suit);
        const timeLimit = this.getTimeLimit(suit, number);
        
        switch (suit) {
            case 'spades':
                return this.getHardChallenge(number, timeLimit);
            case 'hearts':
                return this.getMediumChallenge(number, timeLimit);
            case 'clubs':
                return this.getEasyChallenge(number, timeLimit);
            case 'diamonds':
                return this.getBonusChallenge(number, timeLimit);
            default:
                return this.getDefaultChallenge(timeLimit);
        }
    }

    getDifficultyLevel(suit) {
        const levels = {
            clubs: 'easy',
            hearts: 'medium', 
            spades: 'hard',
            diamonds: 'bonus'
        };
        return levels[suit] || 'medium';
    }

    getTimeLimit(suit, number) {
        const baseTimes = {
            spades: 30,
            hearts: 45,
            clubs: 60,
            diamonds: 40
        };
        
        // Decrease time as number increases
        const reduction = Math.floor((number - 1) * 2);
        return Math.max(15, baseTimes[suit] - reduction);
    }

    // HARD CHALLENGES (SPADES)
    getHardChallenge(number, timeLimit) {
        const challenges = [
            () => this.createReactionChallenge(timeLimit, 'hard'),
            () => this.createMemoryChallenge(timeLimit, 'hard'),
            () => this.createPatternChallenge(timeLimit, 'hard'),
            () => this.createLogicChallenge(timeLimit, 'hard'),
            () => this.createSequenceChallenge(timeLimit, 'hard'),
            () => this.createMathChallenge(timeLimit, 'hard'),
            () => this.createCodeChallenge(timeLimit, 'hard'),
            () => this.createSpatialChallenge(timeLimit, 'hard'),
            () => this.createStrategyChallenge(timeLimit, 'hard'),
            () => this.createMultiTaskChallenge(timeLimit, 'hard'),
            () => this.createAdvancedMemoryChallenge(timeLimit, 'hard'),
            () => this.createFinalChallenge(timeLimit, 'hard'),
            () => this.createMasterChallenge(timeLimit, 'hard')
        ];

        return challenges[number - 1]();
    }

    // MEDIUM CHALLENGES (HEARTS)
    getMediumChallenge(number, timeLimit) {
        const challenges = [
            () => this.createSimpleMemoryChallenge(timeLimit),
            () => this.createColorMatchChallenge(timeLimit),
            () => this.createBasicPatternChallenge(timeLimit),
            () => this.createWordChallenge(timeLimit),
            () => this.createNumberSequenceChallenge(timeLimit),
            () => this.createShapeRecognitionChallenge(timeLimit),
            () => this.createAssociationChallenge(timeLimit),
            () => this.createVisualMemoryChallenge(timeLimit),
            () => this.createBasicLogicChallenge(timeLimit),
            () => this.createPatternMatchChallenge(timeLimit),
            () => this.createMemoryRecallChallenge(timeLimit),
            () => this.createImageMemoryChallenge(timeLimit),
            () => this.createHeartsTrialChallenge(timeLimit)
        ];

        return challenges[number - 1]();
    }

    // EASY CHALLENGES (CLUBS)
    getEasyChallenge(number, timeLimit) {
        const challenges = [
            () => this.createClickChallenge(timeLimit),
            () => this.createBasicMathChallenge(timeLimit),
            () => this.createColorGameChallenge(timeLimit),
            () => this.createSimplePuzzleChallenge(timeLimit),
            () => this.createEasyPatternChallenge(timeLimit),
            () => this.createBasicQuizChallenge(timeLimit),
            () => this.createSimpleMemoryGameChallenge(timeLimit),
            () => this.createEasyLogicChallenge(timeLimit),
            () => this.createQuickResponseChallenge(timeLimit),
            () => this.createBasicChallengeGame(timeLimit),
            () => this.createSimpleTaskChallenge(timeLimit),
            () => this.createEasyTestChallenge(timeLimit),
            () => this.createClubsTrialChallenge(timeLimit)
        ];

        return challenges[number - 1]();
    }

    // BONUS CHALLENGES (DIAMONDS)
    getBonusChallenge(number, timeLimit) {
        const challenges = [
            () => this.createRandomChallenge(timeLimit),
            () => this.createBonusMemoryChallenge(timeLimit),
            () => this.createSpecialTaskChallenge(timeLimit),
            () => this.createSurpriseGameChallenge(timeLimit),
            () => this.createMysteryChallenge(timeLimit),
            () => this.createBonusPointsChallenge(timeLimit),
            () => this.createRandomGameChallenge(timeLimit),
            () => this.createSpecialTrialChallenge(timeLimit),
            () => this.createBonusChallengeGame(timeLimit),
            () => this.createMysteryTaskChallenge(timeLimit),
            () => this.createSpecialGameChallenge(timeLimit),
            () => this.createRandomTrialChallenge(timeLimit),
            () => this.createDiamondJackpotChallenge(timeLimit)
        ];

        return challenges[number - 1]();
    }

    // REACTION CHALLENGES
    createReactionChallenge(timeLimit, difficulty = 'medium') {
        const delays = { easy: 3000, medium: 2000, hard: 1000 };
        const delay = delays[difficulty];
        
        return {
            title: "Reaction Test",
            description: "Click the area when it turns red!",
            timeLimit: timeLimit,
            content: `
                <div class="reaction-area" id="reactionArea">
                    <div>Wait for RED...</div>
                </div>
            `,
            init: () => {
                this.gameState.reactionStarted = false;
                this.gameState.reactionClicked = false;
                this.gameState.reactionTime = null;
                
                const area = document.getElementById('reactionArea');
                
                // Random delay before showing red
                const randomDelay = Math.random() * 3000 + delay;
                
                setTimeout(() => {
                    if (!this.gameState.reactionClicked) {
                        area.classList.add('active');
                        area.innerHTML = '<div>CLICK NOW!</div>';
                        this.gameState.reactionStarted = true;
                        this.gameState.reactionTime = Date.now();
                    }
                }, randomDelay);
                
                area.addEventListener('click', () => {
                    if (this.gameState.reactionStarted && !this.gameState.reactionClicked) {
                        this.gameState.reactionClicked = true;
                        const reactionTime = Date.now() - this.gameState.reactionTime;
                        area.innerHTML = `<div>Reaction time: ${reactionTime}ms</div>`;
                        area.classList.remove('active');
                    } else if (!this.gameState.reactionStarted) {
                        this.gameState.reactionClicked = true;
                        area.innerHTML = '<div>Too early!</div>';
                    }
                });
            },
            validate: () => {
                return this.gameState.reactionStarted && this.gameState.reactionClicked;
            }
        };
    }

    // MEMORY CHALLENGES
    createMemoryChallenge(timeLimit, difficulty = 'medium') {
        const gridSizes = { easy: 3, medium: 4, hard: 5 };
        const sequences = { easy: 3, medium: 5, hard: 8 };
        
        const gridSize = gridSizes[difficulty];
        const sequenceLength = sequences[difficulty];
        
        return {
            title: "Memory Sequence",
            description: `Remember the sequence of ${sequenceLength} flashing squares`,
            timeLimit: timeLimit,
            content: `
                <div class="memory-grid" id="memoryGrid" style="grid-template-columns: repeat(${gridSize}, 1fr);">
                    ${Array(gridSize * gridSize).fill(0).map((_, i) => 
                        `<div class="memory-card" data-index="${i}"></div>`
                    ).join('')}
                </div>
                <div id="memoryStatus">Watch the sequence...</div>
            `,
            init: () => {
                this.gameState.memorySequence = [];
                this.gameState.playerSequence = [];
                this.gameState.showingSequence = true;
                
                // Generate random sequence
                const totalCells = gridSize * gridSize;
                for (let i = 0; i < sequenceLength; i++) {
                    this.gameState.memorySequence.push(Math.floor(Math.random() * totalCells));
                }
                
                this.showMemorySequence(gridSize);
            },
            validate: () => {
                return this.gameState.playerSequence.length === this.gameState.memorySequence.length &&
                       this.gameState.playerSequence.every((val, i) => val === this.gameState.memorySequence[i]);
            }
        };
    }

    showMemorySequence(gridSize) {
        const cells = document.querySelectorAll('.memory-card');
        const status = document.getElementById('memoryStatus');
        let index = 0;
        
        const showNext = () => {
            if (index < this.gameState.memorySequence.length) {
                const cellIndex = this.gameState.memorySequence[index];
                const cell = cells[cellIndex];
                
                cell.classList.add('active');
                setTimeout(() => {
                    cell.classList.remove('active');
                    index++;
                    setTimeout(showNext, 200);
                }, 600);
            } else {
                // Sequence shown, now player's turn
                this.gameState.showingSequence = false;
                status.textContent = "Now click the sequence in order!";
                
                cells.forEach((cell, i) => {
                    cell.addEventListener('click', () => {
                        if (!this.gameState.showingSequence) {
                            this.gameState.playerSequence.push(i);
                            cell.classList.add('revealed');
                            
                            if (this.gameState.playerSequence.length === this.gameState.memorySequence.length) {
                                status.textContent = "Sequence complete!";
                            }
                        }
                    });
                });
            }
        };
        
        setTimeout(showNext, 1000);
    }

    // PATTERN CHALLENGES
    createPatternChallenge(timeLimit, difficulty = 'medium') {
        const patterns = {
            easy: [
                { sequence: [1, 2, 3], next: 4 },
                { sequence: [2, 4, 6], next: 8 },
                { sequence: [1, 1, 2], next: 3 }
            ],
            medium: [
                { sequence: [1, 4, 9, 16], next: 25 },
                { sequence: [2, 6, 18, 54], next: 162 },
                { sequence: [1, 1, 2, 3, 5], next: 8 }
            ],
            hard: [
                { sequence: [2, 3, 5, 7, 11], next: 13 },
                { sequence: [1, 8, 27, 64], next: 125 },
                { sequence: [1, 4, 2, 8, 5, 7], next: 3 }
            ]
        };
        
        const pattern = patterns[difficulty][Math.floor(Math.random() * patterns[difficulty].length)];
        
        return {
            title: "Pattern Recognition",
            description: "What comes next in the sequence?",
            timeLimit: timeLimit,
            content: `
                <div class="pattern-display">
                    <div class="sequence">
                        ${pattern.sequence.map(num => `<span class="sequence-item">${num}</span>`).join('')}
                        <span class="sequence-item question">?</span>
                    </div>
                    <input type="number" id="patternAnswer" class="challenge-input" placeholder="Enter next number">
                </div>
            `,
            init: () => {
                this.gameState.patternAnswer = pattern.next;
                document.getElementById('patternAnswer').focus();
            },
            validate: () => {
                const answer = parseInt(document.getElementById('patternAnswer').value);
                return answer === this.gameState.patternAnswer;
            }
        };
    }

    // SIMPLE MEMORY CHALLENGE
    createSimpleMemoryChallenge(timeLimit) {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const sequence = [];
        for (let i = 0; i < 4; i++) {
            sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        return {
            title: "Color Memory",
            description: "Remember the color sequence",
            timeLimit: timeLimit,
            content: `
                <div id="colorDisplay" class="color-display"></div>
                <div class="color-buttons" id="colorButtons" style="display: none;">
                    ${colors.map(color => 
                        `<button class="challenge-button color-btn" data-color="${color}" style="background: ${color}">${color}</button>`
                    ).join('')}
                </div>
                <div id="colorStatus">Watch the colors...</div>
            `,
            init: () => {
                this.gameState.colorSequence = sequence;
                this.gameState.playerColors = [];
                this.showColorSequence(sequence, colors);
            },
            validate: () => {
                return this.gameState.playerColors.length === this.gameState.colorSequence.length &&
                       this.gameState.playerColors.every((color, i) => color === this.gameState.colorSequence[i]);
            }
        };
    }

    showColorSequence(sequence, colors) {
        const display = document.getElementById('colorDisplay');
        const buttons = document.getElementById('colorButtons');
        const status = document.getElementById('colorStatus');
        let index = 0;
        
        const showNext = () => {
            if (index < sequence.length) {
                display.style.background = sequence[index];
                display.textContent = sequence[index].toUpperCase();
                
                setTimeout(() => {
                    display.style.background = '#333';
                    display.textContent = '';
                    index++;
                    setTimeout(showNext, 500);
                }, 800);
            } else {
                status.textContent = "Now click the colors in order!";
                buttons.style.display = 'grid';
                buttons.style.gridTemplateColumns = 'repeat(2, 1fr)';
                buttons.style.gap = '10px';
                
                document.querySelectorAll('.color-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const color = btn.dataset.color;
                        this.gameState.playerColors.push(color);
                        btn.classList.add('selected');
                        btn.disabled = true;
                        
                        if (this.gameState.playerColors.length === this.gameState.colorSequence.length) {
                            status.textContent = "Sequence complete!";
                        }
                    });
                });
            }
        };
        
        setTimeout(showNext, 1000);
    }

    // BASIC MATH CHALLENGE
    createBasicMathChallenge(timeLimit) {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let a, b, answer;
        
        switch (operation) {
            case '+':
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                answer = a + b;
                break;
            case '-':
                a = Math.floor(Math.random() * 50) + 20;
                b = Math.floor(Math.random() * 20) + 1;
                answer = a - b;
                break;
            case '*':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                answer = a * b;
                break;
        }
        
        return {
            title: "Quick Math",
            description: "Solve the math problem",
            timeLimit: timeLimit,
            content: `
                <div class="math-problem">
                    <div class="equation">${a} ${operation} ${b} = ?</div>
                    <input type="number" id="mathAnswer" class="challenge-input" placeholder="Enter answer">
                </div>
            `,
            init: () => {
                this.gameState.mathAnswer = answer;
                document.getElementById('mathAnswer').focus();
            },
            validate: () => {
                const userAnswer = parseInt(document.getElementById('mathAnswer').value);
                return userAnswer === this.gameState.mathAnswer;
            }
        };
    }

    // CLICK CHALLENGE
    createClickChallenge(timeLimit) {
        const targetClicks = 20;
        
        return {
            title: "Click Speed Test",
            description: `Click the button ${targetClicks} times as fast as possible!`,
            timeLimit: timeLimit,
            content: `
                <div class="click-challenge">
                    <button id="clickButton" class="challenge-button click-btn">Click Me!</button>
                    <div id="clickCounter">Clicks: 0/${targetClicks}</div>
                </div>
            `,
            init: () => {
                this.gameState.clickCount = 0;
                this.gameState.targetClicks = targetClicks;
                
                const button = document.getElementById('clickButton');
                const counter = document.getElementById('clickCounter');
                
                button.addEventListener('click', () => {
                    this.gameState.clickCount++;
                    counter.textContent = `Clicks: ${this.gameState.clickCount}/${targetClicks}`;
                    
                    if (this.gameState.clickCount >= targetClicks) {
                        button.textContent = "Complete!";
                        button.disabled = true;
                        button.style.background = '#00ff66';
                    }
                });
            },
            validate: () => {
                return this.gameState.clickCount >= this.gameState.targetClicks;
            }
        };
    }

    // RANDOM BONUS CHALLENGE
    createRandomChallenge(timeLimit) {
        const challenges = [
            () => this.createReactionChallenge(timeLimit, 'medium'),
            () => this.createSimpleMemoryChallenge(timeLimit),
            () => this.createBasicMathChallenge(timeLimit),
            () => this.createClickChallenge(timeLimit)
        ];
        
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]();
        randomChallenge.title = "Bonus: " + randomChallenge.title;
        return randomChallenge;
    }

    // Additional challenge methods would continue here...
    // For brevity, I'll create simplified versions of the remaining challenges

    createLogicChallenge(timeLimit, difficulty) {
        const puzzles = {
            easy: { question: "If A = 1, B = 2, C = 3, what is D?", answer: 4 },
            medium: { question: "If 2 + 2 = fish, 3 + 3 = eight, what is 4 + 4?", answer: "arrow" },
            hard: { question: "In a room with 3 switches and 3 bulbs in another room, how many trips minimum to match each switch to its bulb?", answer: 1 }
        };
        
        const puzzle = puzzles[difficulty] || puzzles.medium;
        
        return {
            title: "Logic Puzzle",
            description: "Solve the logical problem",
            timeLimit: timeLimit,
            content: `
                <div class="logic-puzzle">
                    <div class="question">${puzzle.question}</div>
                    <input type="text" id="logicAnswer" class="challenge-input" placeholder="Enter answer">
                </div>
            `,
            init: () => {
                this.gameState.logicAnswer = puzzle.answer.toString().toLowerCase();
            },
            validate: () => {
                const answer = document.getElementById('logicAnswer').value.toLowerCase().trim();
                return answer === this.gameState.logicAnswer;
            }
        };
    }

    createSequenceChallenge(timeLimit, difficulty) {
        return this.createPatternChallenge(timeLimit, difficulty);
    }

    createMathChallenge(timeLimit, difficulty) {
        return this.createBasicMathChallenge(timeLimit);
    }

    createCodeChallenge(timeLimit, difficulty) {
        const codes = {
            easy: { cipher: "ABC -> 123", text: "CAB", answer: "312" },
            medium: { cipher: "A=1, B=2, +1 shift", text: "ABC", answer: "234" },
            hard: { cipher: "Caesar +3", text: "HELLO", answer: "KHOOR" }
        };
        
        const code = codes[difficulty] || codes.easy;
        
        return {
            title: "Code Breaking",
            description: `Decode using: ${code.cipher}`,
            timeLimit: timeLimit,
            content: `
                <div class="code-challenge">
                    <div class="cipher-rule">${code.cipher}</div>
                    <div class="encoded-text">Decode: ${code.text}</div>
                    <input type="text" id="codeAnswer" class="challenge-input" placeholder="Enter decoded text">
                </div>
            `,
            init: () => {
                this.gameState.codeAnswer = code.answer.toLowerCase();
            },
            validate: () => {
                const answer = document.getElementById('codeAnswer').value.toLowerCase().trim();
                return answer === this.gameState.codeAnswer;
            }
        };
    }

    // Default fallback challenge
    createDefaultChallenge(timeLimit) {
        return this.createBasicMathChallenge(timeLimit);
    }

    // Additional simplified challenges for completeness
    createSpatialChallenge(timeLimit, difficulty) { return this.createPatternChallenge(timeLimit, difficulty); }
    createStrategyChallenge(timeLimit, difficulty) { return this.createLogicChallenge(timeLimit, difficulty); }
    createMultiTaskChallenge(timeLimit, difficulty) { return this.createMemoryChallenge(timeLimit, difficulty); }
    createAdvancedMemoryChallenge(timeLimit, difficulty) { return this.createMemoryChallenge(timeLimit, difficulty); }
    createFinalChallenge(timeLimit, difficulty) { return this.createReactionChallenge(timeLimit, difficulty); }
    createMasterChallenge(timeLimit, difficulty) { return this.createLogicChallenge(timeLimit, difficulty); }
    
    // Medium challenge methods
    createColorMatchChallenge(timeLimit) { return this.createSimpleMemoryChallenge(timeLimit); }
    createBasicPatternChallenge(timeLimit) { return this.createPatternChallenge(timeLimit, 'easy'); }
    createWordChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'easy'); }
    createNumberSequenceChallenge(timeLimit) { return this.createPatternChallenge(timeLimit, 'medium'); }
    createShapeRecognitionChallenge(timeLimit) { return this.createPatternChallenge(timeLimit, 'easy'); }
    createAssociationChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'easy'); }
    createVisualMemoryChallenge(timeLimit) { return this.createSimpleMemoryChallenge(timeLimit); }
    createBasicLogicChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'easy'); }
    createPatternMatchChallenge(timeLimit) { return this.createPatternChallenge(timeLimit, 'medium'); }
    createMemoryRecallChallenge(timeLimit) { return this.createMemoryChallenge(timeLimit, 'medium'); }
    createImageMemoryChallenge(timeLimit) { return this.createSimpleMemoryChallenge(timeLimit); }
    createHeartsTrialChallenge(timeLimit) { return this.createMemoryChallenge(timeLimit, 'medium'); }
    
    // Easy challenge methods
    createColorGameChallenge(timeLimit) { return this.createSimpleMemoryChallenge(timeLimit); }
    createSimplePuzzleChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'easy'); }
    createEasyPatternChallenge(timeLimit) { return this.createPatternChallenge(timeLimit, 'easy'); }
    createBasicQuizChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'easy'); }
    createSimpleMemoryGameChallenge(timeLimit) { return this.createSimpleMemoryChallenge(timeLimit); }
    createEasyLogicChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'easy'); }
    createQuickResponseChallenge(timeLimit) { return this.createReactionChallenge(timeLimit, 'easy'); }
    createBasicChallengeGame(timeLimit) { return this.createClickChallenge(timeLimit); }
    createSimpleTaskChallenge(timeLimit) { return this.createBasicMathChallenge(timeLimit); }
    createEasyTestChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'easy'); }
    createClubsTrialChallenge(timeLimit) { return this.createClickChallenge(timeLimit); }
    
    // Bonus challenge methods
    createBonusMemoryChallenge(timeLimit) { return this.createMemoryChallenge(timeLimit, 'medium'); }
    createSpecialTaskChallenge(timeLimit) { return this.createReactionChallenge(timeLimit, 'medium'); }
    createSurpriseGameChallenge(timeLimit) { return this.createRandomChallenge(timeLimit); }
    createMysteryChallenge(timeLimit) { return this.createRandomChallenge(timeLimit); }
    createBonusPointsChallenge(timeLimit) { return this.createClickChallenge(timeLimit); }
    createRandomGameChallenge(timeLimit) { return this.createRandomChallenge(timeLimit); }
    createSpecialTrialChallenge(timeLimit) { return this.createLogicChallenge(timeLimit, 'medium'); }
    createBonusChallengeGame(timeLimit) { return this.createPatternChallenge(timeLimit, 'medium'); }
    createMysteryTaskChallenge(timeLimit) { return this.createRandomChallenge(timeLimit); }
    createSpecialGameChallenge(timeLimit) { return this.createMemoryChallenge(timeLimit, 'medium'); }
    createRandomTrialChallenge(timeLimit) { return this.createRandomChallenge(timeLimit); }
    createDiamondJackpotChallenge(timeLimit) { return this.createRandomChallenge(timeLimit); }
}
