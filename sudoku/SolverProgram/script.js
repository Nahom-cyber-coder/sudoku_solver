// Function to draw the grid
function drawGrid(grid) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (i % 3 === 2 && j < 8) {
                cell.style.borderRight = '2px solid #333';
            }
            if (i < 8 && j % 3 === 2) {
                cell.style.borderBottom = '2px solid #333';
            }
            if (grid[i][j] !== 0) {
                cell.textContent = grid[i][j];
                cell.style.background = '#ADD8E6';
            } else {
                const inputField = document.createElement('input');
                inputField.type = 'number';
                inputField.min = 1;
                inputField.max = 9;
                inputField.oninput = function() {
                    if (this.value > 9 || this.value < 1) {
                        this.value = '';
                    }
                };
                cell.appendChild(inputField);
            }
            gridContainer.appendChild(cell);
        }
    }
}

// Function to get grid values from input fields
function getGridValues() {
    const grid = Array(9).fill(0).map(() => Array(9).fill(0));
    const inputFields = document.querySelectorAll('input');
    let index = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById('grid-container').children[i * 9 + j];
            if (cell.children.length > 0 && cell.children[0].tagName === 'INPUT') {
                if (inputFields[index].value !== '') {
                    grid[i][j] = parseInt(inputFields[index].value);
                }
                index++;
            }
        }
    }
    return grid;
}

// Function to solve Sudoku using backtracking
function solveSudoku(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, i, j, num)) {
                        grid[i][j] = num;
                        if (solveSudoku(grid)) return true;
                        grid[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Function to check if a number is valid in a position
function isValid(grid, row, col, num) {
    // Check the row
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num) return false;
    }
    // Check the column
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num) return false;
    }
    // Check the box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}

// Function to generate a Sudoku puzzle
function generateSudoku(difficulty) {
    const grid = Array(9).fill(0).map(() => Array(9).fill(0));
    backtrackGenerate(grid);
    removeNumbers(grid, difficulty);
    return grid;
}

// Function to generate a Sudoku puzzle using backtracking
function backtrackGenerate(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, i, j, num)) {
                        grid[i][j] = num;
                        if (backtrackGenerate(grid)) return true;
                        grid[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Function to remove numbers based on difficulty
function removeNumbers(grid, difficulty) {
    let numEmpty;
    if (difficulty === 'easy') {
        numEmpty = 40;
    } else if (difficulty === 'medium') {
        numEmpty = 50;
    } else {
        numEmpty = 60;
    }
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            emptyCells.push([i, j]);
        }
    }
    for (let i = 0; i < numEmpty; i++) {
        const index = Math.floor(Math.random() * emptyCells.length);
        const [row, col] = emptyCells.splice(index, 1)[0];
        grid[row][col] = 0;
    }
}

// Function to validate user input
function validateInput(grid) {
    for (let i = 0; i < 9; i++) {
        const row = [];
        const col = [];
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== 0) {
                if (row.includes(grid[i][j])) {
                    alert('Duplicate number in row');
                    return false;
                }
                row.push(grid[i][j]);
            }
            if (grid[j][i] !== 0) {
                if (col.includes(grid[j][i])) {
                    alert('Duplicate number in column');
                    return false;
                }
                col.push(grid[j][i]);
            }
        }
    }
    return true;
}

// Event listeners
document.getElementById('generate-btn').addEventListener('click', function() {
    document.getElementById('welcome-page').style.display = 'none';
    document.getElementById('generate-page').style.display = 'block';
});

document.getElementById('generate-sudoku-btn').addEventListener('click', function() {
    const difficulty = document.getElementById('difficulty-select').value;
    const grid = generateSudoku(difficulty);
    document.getElementById('generate-page').style.display = 'none';
    document.getElementById('solve-page').style.display = 'block';
    drawGrid(grid);
});

document.getElementById('back-to-welcome-btn').addEventListener('click', function() {
    document.getElementById('generate-page').style.display = 'none';
    document.getElementById('welcome-page').style.display = 'block';
});

document.getElementById('solve-btn').addEventListener('click', function() {
    document.getElementById('welcome-page').style.display = 'none';
    document.getElementById('solve-page').style.display = 'block';
    drawGrid(Array(9).fill(0).map(() => Array(9).fill(0)));
});

document.getElementById('back-to-welcome-from-solve-btn').addEventListener('click', function() {
    document.getElementById('solve-page').style.display = 'none';
    document.getElementById('welcome-page').style.display = 'block';
});

document.getElementById('solve-sudoku-btn').addEventListener('click', function() {
    const grid = getGridValues();
    if (validateInput(grid)) {
        if (solveSudoku(grid)) {
            drawGrid(grid);
        } else {
            document.getElementById('error-message').textContent = 'No solution exists';
        }
    } else {
        document.getElementById('error-message').textContent = 'Invalid input';
    }
});

document.getElementById('finish-sudoku-btn').addEventListener('click', function() {
    const grid = getGridValues();
    const solvedGrid = Array(9).fill(0).map(() => Array(9).fill(0));
    solveSudoku(solvedGrid);
    if (JSON.stringify(grid) === JSON.stringify(solvedGrid)) {
        document.getElementById('success-message').textContent = 'You passed this level!';
        document.getElementById('error-message').textContent = '';
    } else {
        document.getElementById('error-message').textContent = 'Incorrect solution';
        document.getElementById('success-message').textContent = '';
    }
});

document.getElementById('clear-sudoku-btn').addEventListener('click', function() {
    const grid = Array(9).fill(0).map(() => Array(9).fill(0));
    drawGrid(grid);
});
