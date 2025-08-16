document.addEventListener("DOMContentLoaded", () => {
    const sudokuBoard = document.getElementById("sudokuBoard");
    const newGameBtn = document.getElementById("newGameBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const helpBtn = document.getElementById("helpBtn");
    const settingsModal = document.getElementById("settingsModal");
    const helpModal = document.getElementById("helpModal");
    const closeModalButtons = document.querySelectorAll(".close");
    const difficultySelect = document.getElementById("difficulty");
    const hintBtn = document.getElementById("hintBtn");
    const scoreDisplay = document.getElementById("score");
    const timeDisplay = document.getElementById("time");
    const themeButtons = document.querySelectorAll(".theme-button");
    let score = 0;
    let timer;
    let solutionGrid = [];

    // Generate the Sudoku grid
    function generateSudokuGrid() {
        sudokuBoard.innerHTML = "";
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement("div");
            cell.classList.add("sudoku-cell");
            cell.contentEditable = false;
            cell.dataset.index = i;
            sudokuBoard.appendChild(cell);
        }
    }

    // Generate a valid Sudoku puzzle
    function generateSudoku(difficulty) {
        generateSudokuGrid();
        const puzzle = createSudokuPuzzle(difficulty);
        solutionGrid = [...puzzle.solution];

        puzzle.board.forEach((value, index) => {
            const cell = sudokuBoard.children[index];
            if (value !== 0) {
                cell.textContent = value;
                cell.dataset.given = "true";
            } else {
                cell.contentEditable = true;
                cell.dataset.user = "true";
                cell.addEventListener("input", handleCellInput);
            }
        });
    }

    // Create a Sudoku puzzle with a given difficulty
    function createSudokuPuzzle(difficulty) {
        // Generate a complete, valid Sudoku solution using backtracking
        let board = new Array(81).fill(0);
        shuffleArray(board);
        solveSudoku(board);
        const solution = [...board];

        // Remove numbers from the board to create a puzzle of the desired difficulty
        let clues;
        switch (difficulty) {
            case "easy":
                clues = 40;
                break;
            case "medium":
                clues = 30;
                break;
            case "hard":
                clues = 25;
                break;
            case "expert":
                clues = 20;
                break;
            default:
                clues = 30;
        }

        let attempts = 81 - clues;
        while (attempts > 0) {
            let index = Math.floor(Math.random() * 81);
            if (board[index] !== 0) {
                board[index] = 0;
                attempts--;
            }
        }

        return { board, solution };
    }

    // Backtracking algorithm to solve the Sudoku board
    function solveSudoku(board) {
        const emptyIndex = board.indexOf(0);
        if (emptyIndex === -1) return true;

        const row = Math.floor(emptyIndex / 9);
        const col = emptyIndex % 9;

        for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[emptyIndex] = num;
                if (solveSudoku(board)) {
                    return true;
                }
                board[emptyIndex] = 0;
            }
        }
        return false;
    }

    // Check if placing a number is valid
    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row * 9 + i] === num || board[i * 9 + col] === num) {
                return false;
            }
            const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const boxCol = 3 * Math.floor(col / 3) + (i % 3);
            if (board[boxRow * 9 + boxCol] === num) {
                return false;
            }
        }
        return true;
    }

    // Shuffle array function to randomize the first row for variety
    function shuffleArray(array) {
        for (let i = 0; i < 9; i++) {
            array[i] = i + 1;
        }
        for (let i = 8; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Handle Cell Input
    function handleCellInput(e) {
        const cell = e.target;
        const value = cell.textContent;
        const index = parseInt(cell.dataset.index);

        if (!/^[1-9]$/.test(value)) {
            cell.textContent = "";
        } else {
            if (parseInt(value) !== solutionGrid[index]) {
                cell.style.color = "red";
                score -= 5; // Penalize user for incorrect entry
                updateScore();
            } else {
                cell.style.color = "#00bfff";
                cell.contentEditable = false;
                score += 10;
                updateScore();
            }
        }
    }

    // Event Listeners for modals
    settingsBtn.addEventListener("click", () => {
        settingsModal.style.display = "block";
    });

    helpBtn.addEventListener("click", () => {
        helpModal.style.display = "block";
    });

    closeModalButtons.forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            settingsModal.style.display = "none";
            helpModal.style.display = "none";
        });
    });

    // New Game Button logic
    newGameBtn.addEventListener("click", () => {
        generateSudoku(difficultySelect.value);
        startTimer();
        score = 0;
        updateScore();
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeToggle.textContent = "Light Mode";
        } else {
            darkModeToggle.textContent = "Dark Mode";
        }
    });

    // Theme Button logic
    themeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const theme = button.id.replace("theme", "").toLowerCase();
            applyTheme(theme);
        });
    });

    function applyTheme(theme) {
        document.body.classList.remove("classic-theme", "galaxy-theme", "modern-theme");
        switch (theme) {
            case "classic":
                document.body.classList.add("classic-theme");
                break;
            case "galaxy":
                document.body.classList.add("galaxy-theme");
                break;
            case "modern":
                document.body.classList.add("modern-theme");
                break;
            default:
                break;
        }
    }

    // Hint Button logic
    hintBtn.addEventListener("click", () => {
        provideHint();
    });

    function provideHint() {
        // Provide a hint by attempting to solve one of the easiest cells first
        let minOptions = 10;
        let targetCellIndex = -1;
        let targetValue = 0;

        for (let i = 0; i < 81; i++) {
            const cell = sudokuBoard.children[i];
            if (cell.contentEditable && cell.textContent === "") {
                const row = Math.floor(i / 9);
                const col = i % 9;
                const possibleValues = [];

                for (let num = 1; num <= 9; num++) {
                    if (isValid(solutionGrid, row, col, num)) {
                        possibleValues.push(num);
                    }
                }

                if (possibleValues.length < minOptions) {
                    minOptions = possibleValues.length;
                    targetCellIndex = i;
                    targetValue = possibleValues[0];
                }
            }
        }

        if (targetCellIndex !== -1) {
            const cell = sudokuBoard.children[targetCellIndex];
            cell.textContent = targetValue;
            cell.style.color = "#00bfff";
            cell.contentEditable = false;
            score -= 5;
            updateScore();
        }
    }

    // Visual Effects and Sound Effects settings
    const soundEffectsCheckbox = document.getElementById("soundEffects");
    const visualEffectsCheckbox = document.getElementById("visualEffects");

    soundEffectsCheckbox.addEventListener("change", () => {
        if (soundEffectsCheckbox.checked) {
            console.log("Sound effects enabled");
        } else {
            console.log("Sound effects disabled");
        }
    });

    visualEffectsCheckbox.addEventListener("change", () => {
        if (visualEffectsCheckbox.checked) {
            console.log("Visual effects enabled");
        } else {
            console.log("Visual effects disabled");
        }
    });

    // Timer Functionality
    function startTimer() {
        clearInterval(timer);
        let seconds = 0;
        timer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    // Update Score Display
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // Start a new game on page load
    generateSudoku(difficultySelect.value);
    startTimer();
});