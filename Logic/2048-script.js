var board;
        var score = 0;
        var best = localStorage.getItem('best2048') || 0;
        var rows = 4;
        var columns = 4;
        var gameStarted = false;

        // Touch handling variables
        let pageWidth = window.innerWidth || document.body.clientWidth;
        let threshold = Math.max(1, Math.floor(0.01 * pageWidth));
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;

        const limit = Math.tan(45 * 1.5 / 180 * Math.PI);

        window.onload = function() {
            document.getElementById('best').innerText = best;
            setGame();
        }

        function setGame() {
            board = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];

            // Clear the board
            document.getElementById("board").innerHTML = '';

            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    let tile = document.createElement("div");
                    tile.id = row.toString() + "-" + column.toString();
                    let num = board[row][column];
                    updateTile(tile, num);
                    document.getElementById("board").append(tile);
                }
            }

            generateRandomTile();
            generateRandomTile();
            gameStarted = true;
        }

        function newGame() {
            score = 0;
            document.getElementById("score").innerText = score;
            document.getElementById("gameOver").style.display = 'none';
            setGame();
        }

        function toggleInstructions() {
            const instructions = document.getElementById('instructions');
            if (window.innerWidth <= 768) {
                instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
            }
        }

        function hasEmptyTile() {
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    if (board[row][column] == 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        function canMove() {
            if (hasEmptyTile()) return true;
            
            // Check for possible merges
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    let current = board[row][column];
                    if ((row < rows - 1 && current == board[row + 1][column]) ||
                        (column < columns - 1 && current == board[row][column + 1])) {
                        return true;
                    }
                }
            }
            return false;
        }

        function generateRandomTile() {
            if (!hasEmptyTile()) {
                if (!canMove()) {
                    gameOver();
                }
                return;
            }

            let found = false;
            while (!found) {
                let row = Math.floor(Math.random() * rows);
                let column = Math.floor(Math.random() * columns);
                
                if (board[row][column] == 0) {
                    board[row][column] = Math.random() < 0.9 ? 2 : 4;
                    let tile = document.getElementById(row.toString() + "-" + column.toString());
                    updateTile(tile, board[row][column]);
                    tile.classList.add('new-tile');
                    setTimeout(() => tile.classList.remove('new-tile'), 200);
                    found = true;
                }
            }
        }

        function gameOver() {
            document.getElementById('finalScore').innerText = score;
            document.getElementById('gameOver').style.display = 'flex';
            
            if (score > best) {
                best = score;
                localStorage.setItem('best2048', best);
                document.getElementById('best').innerText = best;
            }
        }

        function updateTile(tile, num) {
            tile.innerText = "";
            tile.classList.value = "";
            tile.classList.add("tile");

            if (num > 0) {
                tile.innerText = num;
                if (num <= 8192) {
                    tile.classList.add("x" + num.toString());
                } else {
                    tile.classList.add("x8192");
                }
            }
        }

        function makeMove(direction) {
            if (!gameStarted) return;
            
            let moved = false;
            let oldBoard = board.map(row => row.slice());

            switch(direction) {
                case 'left': moved = slideLeft(); break;
                case 'right': moved = slideRight(); break;
                case 'up': moved = slideUp(); break;
                case 'down': moved = slideDown(); break;
            }

            if (moved) {
                generateRandomTile();
                document.getElementById("score").innerText = score;
                
                // Check for 2048 tile
                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        if (board[row][column] == 2048) {
                            setTimeout(() => {
                                alert('Congratulations! You reached 2048! 🎉\nYou can continue playing to reach higher scores.');
                            }, 300);
                        }
                    }
                }
            }
        }

        // Keyboard controls
        document.addEventListener("keyup", (event) => {
            switch(event.code) {
                case "ArrowLeft": makeMove('left'); break;
                case "ArrowRight": makeMove('right'); break;
                case "ArrowUp": makeMove('up'); break;
                case "ArrowDown": makeMove('down'); break;
            }
        });

        // Touch controls
        document.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
            touchstartY = event.changedTouches[0].screenY;
        }, false);

        document.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            touchendY = event.changedTouches[0].screenY;
            handleGesture();
        }, false);

        function handleGesture() {
            let x = touchendX - touchstartX;
            let y = touchendY - touchstartY;
            let xy = Math.abs(x / y);
            let yx = Math.abs(y / x);

            if (Math.abs(x) > threshold || Math.abs(y) > threshold) {
                if (yx <= limit) {
                    if (x < 0) {
                        makeMove('left');
                    } else {
                        makeMove('right');
                    }
                }
                if (xy <= limit) {
                    if (y < 0) {
                        makeMove('up');
                    } else {
                        makeMove('down');
                    }
                }
            }
        }

        function filterZeros(row) {
            return row.filter(num => num != 0);
        }

        function slide(row) {
            row = filterZeros(row);
            let merged = new Array(row.length).fill(false);

            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] == row[i + 1] && !merged[i] && !merged[i + 1]) {
                    row[i] *= 2;
                    row[i + 1] = 0;
                    score += row[i];
                    merged[i] = true;
                }
            }

            row = filterZeros(row);

            while (row.length < columns) {
                row.push(0);
            }

            return row;
        }

        function slideLeft() {
            let moved = false;
            for (let i = 0; i < rows; i++) {
                let originalRow = board[i].slice();
                let row = slide(board[i]);
                board[i] = row;

                if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
                    moved = true;
                }

                for (let j = 0; j < columns; j++) {
                    let tile = document.getElementById(i.toString() + "-" + j.toString());
                    updateTile(tile, board[i][j]);
                }
            }
            return moved;
        }

        function slideRight() {
            let moved = false;
            for (let i = 0; i < rows; i++) {
                let originalRow = board[i].slice();
                let row = board[i].slice().reverse();
                row = slide(row);
                row.reverse();
                board[i] = row;

                if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
                    moved = true;
                }

                for (let j = 0; j < columns; j++) {
                    let tile = document.getElementById(i.toString() + "-" + j.toString());
                    updateTile(tile, board[i][j]);
                }
            }
            return moved;
        }

        function slideUp() {
            let moved = false;
            for (let j = 0; j < columns; j++) {
                let originalColumn = [board[0][j], board[1][j], board[2][j], board[3][j]];
                let row = slide(originalColumn);

                if (JSON.stringify(originalColumn) !== JSON.stringify(row)) {
                    moved = true;
                }

                for (let i = 0; i < rows; i++) {
                    board[i][j] = row[i];
                    let tile = document.getElementById(i.toString() + "-" + j.toString());
                    updateTile(tile, board[i][j]);
                }
            }
            return moved;
        }

        function slideDown() {
            let moved = false;
            for (let j = 0; j < columns; j++) {
                let originalColumn = [board[0][j], board[1][j], board[2][j], board[3][j]];
                let row = originalColumn.slice().reverse();
                row = slide(row);
                row.reverse();

                if (JSON.stringify(originalColumn) !== JSON.stringify(row)) {
                    moved = true;
                }

                for (let i = 0; i < rows; i++) {
                    board[i][j] = row[i];
                    let tile = document.getElementById(i.toString() + "-" + j.toString());
                    updateTile(tile, board[i][j]);
                }
            }
            return moved;
        }