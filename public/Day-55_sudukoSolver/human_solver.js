const size = 9;
const subgridSize = 3;
let initialBoard = [];

document.getElementById('generate').addEventListener('click', generateSudokuButtonClicked);
document.getElementById('restart').addEventListener('click', restartPuzzle);
document.getElementById('giveUp').addEventListener('click', giveUp);
document.getElementById('checkSolution').addEventListener('click', checkSolution);
const boardWrapper = document.querySelector(".board-wrapper");
const checkSolutionButton = document.querySelector("#checkSolution");
const restartButton = document.querySelector("#restart");
const giveUpButton = document.querySelector("#giveUp");

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.backgroundColor = "var(--color3)"; // Active state
    });

    button.addEventListener('mouseup', () => {
        button.style.backgroundColor = "var(--color2)"; // Normal state
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = "var(--color2)"; // Revert if mouse leaves button
    });
});

let candidateList;

// Initialize the candidate list based on the current board state
function initializeCandidateList(board) {
    candidateList = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => new Set())
    );

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= size; num++) {
                    if (isValid(board, num, row, col)) {
                        candidateList[row][col].add(num);
                    }
                }
            }
        }
    }
}

// Update the candidate list after a cell's value is set or cleared
function updateCandidateList(board, row, col, num, add) {
    const startRow = Math.floor(row / subgridSize) * subgridSize;
    const startCol = Math.floor(col / subgridSize) * subgridSize;

    for (let i = 0; i < size; i++) {
        candidateList[row][i].delete(num);
        candidateList[i][col].delete(num);
    }

    for (let i = 0; i < subgridSize; i++) {
        for (let j = 0; j < subgridSize; j++) {
            candidateList[startRow + i][startCol + j].delete(num);
        }
    }

    if (add) {
        for (let i = 1; i <= size; i++) {
            if (isValid(board, i, row, col)) {
                candidateList[row][col].add(i);
            }
        }
    }
}

function generateSudokuButtonClicked() {
    showButtons();
    enableCheckSolutionButton();
    boardWrapper.style = "display: flex;";
    console.log("generate called");
    const difficulty = document.getElementById('difficulty').value;

    // Simulated board data for demonstration
    const data = {
        board: generateHumanSolvablePuzzle(difficulty)
    };

    const board = data.board;

    initializeCandidateList(board);

    initialBoard = JSON.parse(JSON.stringify(board));

    const boardTable = document.getElementById('sudoku-board');
    boardTable.innerHTML = '';

    const statusLabel = document.getElementById('status-label');
    statusLabel.textContent = '';

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            cell.id = `td-${i}-${j}`;
            const cellInput = document.createElement('input');
            cellInput.type = 'tel'; // Use 'tel' to prompt number pad on mobile
            cellInput.inputMode = 'numeric'; // Ensure numeric keypad is used
            cellInput.maxLength = 1; // Limit to 1 character
            cellInput.id = `cell-${i}-${j}`;
            cellInput.value = board[i][j] !== 0 ? board[i][j] : '';
            cellInput.readOnly = board[i][j] !== 0;
            cellInput.classList.remove('invalid');

            // Restrict input to single digits only
            cellInput.addEventListener('input', function () {
                let value = this.value;
                if (!/^[1-9]$/.test(value)) {
                    this.value = ''; // Clear invalid input
                }
            });

            cell.appendChild(cellInput);
            row.appendChild(cell);
        }
        boardTable.appendChild(row);
    }

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', (event) => {
            highlightSelectedNumber(parseInt(event.target.value));
        });

        input.addEventListener('focusout', (event) => {
            removeHighlights();
        });
    });
}

function giveUp() {
    console.log("give up called");
    restartPuzzle();
    disableCheckSolutionButton();
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            row.push(cell.value === '' ? 0 : parseInt(cell.value));
        }
        board.push(row);
    }

    // Simulated solved board for demonstration
    solve(board)

    console.log(prettyPrint(board))

    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellInput = document.getElementById(`cell-${i}-${j}`);
            cellInput.value = cell !== 0 ? cell : '';
        });
    });
}

function checkSolution() {
    let valid = true;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            const value = parseInt(cell.value);
            if (initialBoard[i][j] === 0) {
                if (value && !is_valid_value(i, j, value)) {
                    valid = false;
                    cell.classList.add('invalid');
                } else if (cell.readOnly === false) {
                    cell.classList.remove('invalid');
                }
            }
        }
    }

    const statusLabel = document.getElementById('status-label');
    if (valid && allCellsFilled()) {
        statusLabel.textContent = "Congratulations! You solved the Sudoku.";
        statusLabel.style.color = "green";
    } else {
        statusLabel.textContent = "There are some mistakes in your solution. Please try again.";
        statusLabel.style.color = "red";
    }
}

function allCellsFilled() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            if (cell.value === '') {
                return false;
            }
        }
    }
    return true;
}

function is_valid_value(i, j, val) {
    const board = [];
    for (let x = 0; x < 9; x++) {
        const row = [];
        for (let y = 0; y < 9; y++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            row.push(cell.value === '' ? 0 : parseInt(cell.value));
        }
        board.push(row);
    }

    // Check row and column
    for (let k = 0; k < 9; k++) {
        if ((board[i][k] === val && k !== j) || (board[k][j] === val && k !== i)) {
            return false;
        }
    }

    // Check 3x3 block
    const rowStart = Math.floor(i / 3) * 3;
    const colStart = Math.floor(j / 3) * 3;

    for (let x = rowStart; x < rowStart + 3; x++) {
        for (let y = colStart; y < colStart + 3; y++) {
            if (board[x][y] === val && (x !== i || y !== j)) {
                return false;
            }
        }
    }

    return true;
}

function restartPuzzle() {
    console.log("restart puzzle called");
    enableCheckSolutionButton();
    const statusLabel = document.getElementById('status-label');
    statusLabel.textContent = '';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`td-${i}-${j}`);
            const cellInput = document.getElementById(`cell-${i}-${j}`);
            cellInput.value = initialBoard[i][j] !== 0 ? initialBoard[i][j] : '';
            cellInput.readOnly = initialBoard[i][j] !== 0;
            cellInput.classList.remove('invalid');
            cellInput.classList.remove('highlight');
            cell.classList.remove('highlight');
        }
    }
}

function isValid(board, num, row, col) {
    // Check if the number is in the given row or column
    for (let i = 0; i < size; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    // Check if the number is in the subgrid
    const startRow = Math.floor(row / subgridSize) * subgridSize;
    const startCol = Math.floor(col / subgridSize) * subgridSize;
    for (let i = 0; i < subgridSize; i++) {
        for (let j = 0; j < subgridSize; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

function findEmptyCell(board) {
    // Find an empty cell (represented by 0)
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

function isSolved(board) {
    return findEmptyCell(board) === null;
}

// Eliminate candidates using the "Single Possibility" technique
function eliminate(board) {
    let progress = false;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 0 && candidateList[row][col].size === 1) {
                const [num] = [...candidateList[row][col]];
                board[row][col] = num;
                updateCandidateList(board, row, col, num, false);
                progress = true;
            }
        }
    }
    return progress;
}

// Fill cells using the "Only Choice" technique
function onlyChoice(board) {
    let progress = false;
    for (let num = 1; num <= size; num++) {
        // Check each row
        for (let row = 0; row < size; row++) {
            const candidates = [];
            for (let col = 0; col < size; col++) {
                if (board[row][col] === 0 && candidateList[row][col].has(num)) {
                    candidates.push(col);
                }
            }
            if (candidates.length === 1) {
                board[row][candidates[0]] = num;
                updateCandidateList(board, row, candidates[0], num, false);
                progress = true;
            }
        }

        // Check each column
        for (let col = 0; col < size; col++) {
            const candidates = [];
            for (let row = 0; row < size; row++) {
                if (board[row][col] === 0 && candidateList[row][col].has(num)) {
                    candidates.push(row);
                }
            }
            if (candidates.length === 1) {
                board[candidates[0]][col] = num;
                updateCandidateList(board, candidates[0], col, num, false);
                progress = true;
            }
        }

        // Check each subgrid
        for (let boxRow = 0; boxRow < size; boxRow += subgridSize) {
            for (let boxCol = 0; boxCol < size; boxCol += subgridSize) {
                const candidates = [];
                for (let i = 0; i < subgridSize; i++) {
                    for (let j = 0; j < subgridSize; j++) {
                        const row = boxRow + i;
                        const col = boxCol + j;
                        if (board[row][col] === 0 && candidateList[row][col].has(num)) {
                            candidates.push([row, col]);
                        }
                    }
                }
                if (candidates.length === 1) {
                    const [row, col] = candidates[0];
                    board[row][col] = num;
                    updateCandidateList(board, row, col, num, false);
                    progress = true;
                }
            }
        }
    }
    return progress;
}

function nakedPairs(board) {
    let progress = false;

    // Check rows for naked pairs
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (candidateList[row][col].size === 2) {
                const pair = [...candidateList[row][col]];
                for (let otherCol = col + 1; otherCol < size; otherCol++) {
                    if (candidateList[row][otherCol].size === 2 &&
                        [...candidateList[row][otherCol]].every(num => pair.includes(num))) {

                        // Eliminate pair from other cells in the row
                        for (let i = 0; i < size; i++) {
                            if (i !== col && i !== otherCol && board[row][i] === 0) {
                                pair.forEach(num => {
                                    if (candidateList[row][i].has(num)) {
                                        candidateList[row][i].delete(num);
                                        progress = true;
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    // Check columns for naked pairs
    for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
            if (candidateList[row][col].size === 2) {
                const pair = [...candidateList[row][col]];
                for (let otherRow = row + 1; otherRow < size; otherRow++) {
                    if (candidateList[otherRow][col].size === 2 &&
                        [...candidateList[otherRow][col]].every(num => pair.includes(num))) {

                        // Eliminate pair from other cells in the column
                        for (let i = 0; i < size; i++) {
                            if (i !== row && i !== otherRow && board[i][col] === 0) {
                                pair.forEach(num => {
                                    if (candidateList[i][col].has(num)) {
                                        candidateList[i][col].delete(num);
                                        progress = true;
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    // Check subgrids for naked pairs
    for (let boxRow = 0; boxRow < size; boxRow += subgridSize) {
        for (let boxCol = 0; boxCol < size; boxCol += subgridSize) {
            for (let i = 0; i < subgridSize; i++) {
                for (let j = 0; j < subgridSize; j++) {
                    const row = boxRow + i;
                    const col = boxCol + j;
                    if (candidateList[row][col].size === 2) {
                        const pair = [...candidateList[row][col]];
                        for (let k = i; k < subgridSize; k++) {
                            for (let l = j + 1; l < subgridSize; l++) {
                                const otherRow = boxRow + k;
                                const otherCol = boxCol + l;
                                if (candidateList[otherRow][otherCol].size === 2 &&
                                    [...candidateList[otherRow][otherCol]].every(num => pair.includes(num))) {

                                    // Eliminate pair from other cells in the subgrid
                                    for (let m = 0; m < subgridSize; m++) {
                                        for (let n = 0; n < subgridSize; n++) {
                                            const cellRow = boxRow + m;
                                            const cellCol = boxCol + n;
                                            if ((cellRow !== row || cellCol !== col) &&
                                                (cellRow !== otherRow || cellCol !== otherCol) &&
                                                board[cellRow][cellCol] === 0) {
                                                pair.forEach(num => {
                                                    if (candidateList[cellRow][cellCol].has(num)) {
                                                        candidateList[cellRow][cellCol].delete(num);
                                                        progress = true;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return progress;
}

// Helper function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate a fully solved Sudoku board
function generateSolvedBoard() {
    const board = Array.from({ length: size }, () => Array(size).fill(0));
    solve(board);
    return board;
}

// Solve the Sudoku board using backtracking
function solve(board) {
    const cell = findEmptyCell(board);
    if (!cell) return true;

    const [row, col] = cell;
    const numbers = shuffle([...Array(size).keys()].map(x => x + 1)); // Shuffle numbers 1-9

    for (const num of numbers) {
        if (isValid(board, num, row, col)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
        }
    }

    return false;
}

// remove numbers to generate a puzzle with a unique solution
function removeNumbers(board, difficulty) {
    let attempts = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 40 : difficulty === 'hard' ? 45 : 50;
    const maxIterations = 500;
    let iterationCount = 0;

    const puzzle = board.map(row => row.slice());

    // Create a list of filled cells
    const filledCells = [];
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (puzzle[row][col] !== 0) {
                filledCells.push([row, col]);
            }
        }
    }

    while (attempts > 0 && iterationCount < maxIterations) {
        iterationCount++;

        // Randomly select a filled cell
        const randomIndex = Math.floor(Math.random() * filledCells.length);
        const [row, col] = filledCells[randomIndex];

        const backup = puzzle[row][col];
        puzzle[row][col] = 0;

        const copy = puzzle.map(row => row.slice());
        if (countSolutions(copy) !== 1) {
            puzzle[row][col] = backup;
        } else {
            // If the cell is successfully cleared, remove it from the list of filled cells
            filledCells.splice(randomIndex, 1);
            attempts--;
        }
    }

    // console.log("iterationCount: " + iterationCount);
    return puzzle;
}

// Find all solutions (used to check for uniqueness)
function countSolutions(board) {
    const cell = findEmptyCell(board);
    if (!cell) return 1;

    const [row, col] = cell;
    let count = 0;

    // Generate candidate list for the current cell
    const candidates = [];
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, num, row, col)) {
            candidates.push(num);
        }
    }

    // Try each candidate
    for (const num of candidates) {
        board[row][col] = num;
        count += countSolutions(board);
        if (count > 1) break; // Early exit if more than one solution is found
        board[row][col] = 0;
    }

    return count;
}

function deepCopy(board) {
    return board.map(row => row.slice());
}

// Solver logic using the global candidate list
function solveWithLogic(board) {
    initializeCandidateList(board);
    let progress;
    do {
        progress = false;
        progress = eliminate(board) || progress;
        progress = onlyChoice(board) || progress;
        progress = nakedPairs(board) || progress;
    } while (progress);

    return isSolved(board); // Return true if the puzzle is fully solved by logic
}

function generateHumanSolvablePuzzle(difficulty) {
    let puzzle;
    let iterations = 0;
    do {
        iterations += 1;
        const solvedBoard = generateSolvedBoard();
        puzzle = removeNumbers(solvedBoard, difficulty);

        // Create a deep copy of the puzzle for the logical solver
        const puzzleCopy = deepCopy(puzzle);

        // Check if the puzzle can be solved using logic alone
        if (!solveWithLogic(puzzleCopy)) {
            puzzle = null; // Regenerate if not solvable by logic
        }
    } while (!puzzle);

    console.log("Puzzle generated in " + iterations + " attempt(s)");
    return puzzle;
}

function prettyPrint(board) {
    const size = board.length;
    const subgridSize = Math.sqrt(size);
    let output = '';

    for (let row = 0; row < size; row++) {
        if (row % subgridSize === 0 && row !== 0) {
            output += '-'.repeat(size * 2 + subgridSize - 1) + '\n';
        }
        for (let col = 0; col < size; col++) {
            if (col % subgridSize === 0 && col !== 0) {
                output += '| ';
            }
            output += board[row][col] === 0 ? '.' : board[row][col];
            output += ' ';
        }
        output += '\n';
    }

    console.log(output);
}

function highlightSelectedNumber(num) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`td-${i}-${j}`);
            const cellInput = document.getElementById(`cell-${i}-${j}`);
            const value = parseInt(cellInput.value);
            if (value === num) {
                cell.classList.add('highlight');
                cellInput.classList.add('highlight');
                cellInput.style.color = "white";
                //cellInput.classList.remove('invalid');
            }
        }
    }
}

function removeHighlights() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`td-${i}-${j}`);
            const cellInput = document.getElementById(`cell-${i}-${j}`);
            cell.classList.remove('highlight');
            cellInput.classList.remove('highlight');
            cellInput.style.color = "black";
        }
    }
}

function enableCheckSolutionButton() {
    checkSolutionButton.setAttribute("style", "display: inline; cursor: pointer; background-color: #0B8494; pointer-events: all;");
}

function disableCheckSolutionButton() {
    checkSolutionButton.setAttribute("style", "display: inline; cursor: default; background-color: gray; pointer-events: none;");
}

function showButtons() {
    restartButton.setAttribute("style", "display: inline;");
    giveUpButton.setAttribute("style", "display: inline;");
}