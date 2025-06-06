let grid = [];
let cols = 9;
let rows = 9;
let cellSize = 60;
let gap = 10;
let gameStarted = false;
let placingFence = false;
let fenceType = null;
let fences = [];
let currentPlayerTurn = 1;
let currentPlayerPlacingFence = null;
let player1 = { row: 0, col: 4, color: '#DBBEB5', name: 'Jucător 1', fencesLeft: 10 };
let player2 = { row: 8, col: 4, color: '#88a286', name: 'Jucător 2', fencesLeft: 10 };
let vsAI = false;
let aiDifficulty = 'easy';

function setup() {
    let canvas = createCanvas(cols * (cellSize + gap) + gap, rows * (cellSize + gap) + gap + 50);
    canvas.parent('game-board');
    createGrid();
}

function draw() {
    background(255);
    drawGrid();
    drawPlayers();
    drawFences();
}

function createGrid() {
    for (let y = 0; y < rows; y++) {
        let row = [];
        for (let x = 0; x < cols; x++) {
            row.push({
                x: x * (cellSize + gap) + gap,
                y: y * (cellSize + gap) + gap,
                w: cellSize,
                h: cellSize
            });
        }
        grid.push(row);
    }
}

function drawGrid() {
    stroke(0);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let cell = grid[y][x];
            fill("#A5887F");
            rect(cell.x, cell.y, cell.w, cell.h);
        }
    }
}

function drawPlayers() {
    drawPawn(player1);
    drawPawn(player2);
}

function drawPawn(player) {
    let cell = grid[player.row][player.col];
    fill(player.color);
    noStroke();
    ellipse(
        cell.x + cellSize / 2,
        cell.y + cellSize / 2,
        cellSize * 0.6
    );
}

function drawPlayerNames() {
    player1.name = document.getElementById('player1-name').value;
    player2.name = document.getElementById('player2-name').value;

    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(player1.name, 10, rows * (cellSize + gap) + 10);
    text(player2.name, 10, rows * (cellSize + gap) + 30);
}

function keyPressed() {
    if (!gameStarted || placingFence) return;

    if (currentPlayerTurn === 1) {
        if ((key === 'w' || key === 'W') && player1.row > 0 && canMove(player1, 'up')) player1.row--;
        else if ((key === 's' || key === 'S') && player1.row < rows - 1 && canMove(player1, 'down')) player1.row++;
        else if ((key === 'a' || key === 'A') && player1.col > 0 && canMove(player1, 'left')) player1.col--;
        else if ((key === 'd' || key === 'D') && player1.col < cols - 1 && canMove(player1, 'right')) player1.col++;
        else return;
        currentPlayerTurn = 2;
    } else if (currentPlayerTurn === 2) {
        if (keyCode === UP_ARROW && player2.row > 0 && canMove(player2, 'up')) player2.row--;
        else if (keyCode === DOWN_ARROW && player2.row < rows - 1 && canMove(player2, 'down')) player2.row++;
        else if (keyCode === LEFT_ARROW && player2.col > 0 && canMove(player2, 'left')) player2.col--;
        else if (keyCode === RIGHT_ARROW && player2.col < cols - 1 && canMove(player2, 'right')) player2.col++;
        else return;
        currentPlayerTurn = 1;
    }
    checkWinCondition();
    updateActivePlayerHighlight();
    if (vsAI && currentPlayerTurn === 2) setTimeout(aiMove, 500);
}

function startGame() {
    gameStarted = true;
    updateActivePlayerHighlight();
}

function restartGame() {
    player1.row = 0;
    player1.col = 4;
    player2.row = 8;
    player2.col = 4;
    fences = [];
    player1.fencesLeft = 10;
    player2.fencesLeft = 10;
    currentPlayerTurn = 1;
    gameStarted = true;
    grid = [];
    createGrid();
    updateFenceDisplay();
    updateActivePlayerHighlight();
}

function selectFence(type, playerNumber) {
    if (playerNumber !== currentPlayerTurn) return;
    let player = playerNumber === 1 ? player1 : player2;
    if (player.fencesLeft <= 0) {
        alert(player.name + " nu mai are garduri!");
        return;
    }
    placingFence = true;
    fenceType = type;
    currentPlayerPlacingFence = playerNumber;
}

function mousePressed() {
    if (!placingFence || !gameStarted) return;

    let tolerance = 10;
    let clickedOnFence = false;
    let simulatedFence = null;

    for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
            let cell = grid[y][x];
            let nextCellRight = grid[y][x + 1];
            let nextCellDown = grid[y + 1][x];

            if (fenceType === 'horizontal' &&
                mouseX > cell.x &&
                mouseX < nextCellRight.x + cellSize &&
                Math.abs(mouseY - (cell.y + cellSize)) < tolerance &&
                isFenceSpotFree(y, x, 'horizontal')) {
                simulatedFence = { row: y, col: x, type: 'horizontal' };
                clickedOnFence = true;
                break;
            }

            if (fenceType === 'vertical' &&
                mouseY > cell.y &&
                mouseY < nextCellDown.y + cellSize &&
                Math.abs(mouseX - (cell.x + cellSize)) < tolerance &&
                isFenceSpotFree(y, x, 'vertical')) {
                simulatedFence = { row: y, col: x, type: 'vertical' };
                clickedOnFence = true;
                break;
            }
        }
        if (clickedOnFence) break;
    }

    if (!clickedOnFence || !simulatedFence) return;

    fences.push(simulatedFence);
    let pathPlayer1 = hasPath(player1);
    let pathPlayer2 = hasPath(player2);
    fences.pop();

    if (!pathPlayer1 || !pathPlayer2) return;

    fences.push(simulatedFence);
    let player = currentPlayerPlacingFence === 1 ? player1 : player2;
    player.fencesLeft--;
    placingFence = false;
    fenceType = null;
    currentPlayerPlacingFence = null;
    updateFenceDisplay();
    currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;
    updateActivePlayerHighlight();
    if (vsAI && currentPlayerTurn === 2) setTimeout(aiMove, 500);
}


function drawFences() {
    for (let fence of fences) {
        let baseX = fence.col * (cellSize + gap) + gap;
        let baseY = fence.row * (cellSize + gap) + gap;
        fill('#000');
        noStroke();
        if (fence.type === 'horizontal') rect(baseX, baseY + cellSize, cellSize * 2 + gap, 10);
        else if (fence.type === 'vertical') rect(baseX + cellSize, baseY, 10, cellSize * 2 + gap);
    }
}

function updateFenceDisplay() {
    document.getElementById('player1-fences').textContent = "Garduri: " + player1.fencesLeft;
    document.getElementById('player2-fences').textContent = "Garduri: " + player2.fencesLeft;
}

function canMove(player, direction) {
    let r = player.row;
    let c = player.col;
    for (let fence of fences) {
        if (fence.type === 'horizontal') {
            if (direction === 'down' && r === fence.row && (c === fence.col || c === fence.col + 1)) return false;
            if (direction === 'up' && r - 1 === fence.row && (c === fence.col || c === fence.col + 1)) return false;
        }
        if (fence.type === 'vertical') {
            if (direction === 'right' && c === fence.col && (r === fence.row || r === fence.row + 1)) return false;
            if (direction === 'left' && c - 1 === fence.col && (r === fence.row || r === fence.row + 1)) return false;
        }
    }
    return true;
}

function updateActivePlayerHighlight() {
    const p1Container = document.getElementById('player1-container');
    const p2Container = document.getElementById('player2-container');
    if (currentPlayerTurn === 1) {
        p1Container.classList.add('active-player');
        p2Container.classList.remove('active-player');
    } else {
        p1Container.classList.remove('active-player');
        p2Container.classList.add('active-player');
    }
}

function toggleGameMode() {
    vsAI = !vsAI;
    alert("Modul AI este acum " + (vsAI ? 'ACTIVAT' : 'DEZACTIVAT'));
}

function aiMove() {
    if (!vsAI || currentPlayerTurn !== 2 || placingFence) return;
    if (aiDifficulty === 'easy') {
        let action = decideAIAction();
        if (action === 'fence' && player2.fencesLeft > 0) {
            let placed = tryPlaceRandomFence();
            if (!placed) moveAIPawn();
        } else {
            moveAIPawn();
        }
    } else if (aiDifficulty === 'hard') {
        strategicAIMove();
    }
    currentPlayerTurn = 1;
    updateActivePlayerHighlight();
}

function decideAIAction() {
    return Math.random() < 0.3 ? 'fence' : 'move';
}

function moveAIPawn() {
    const directions = ['up', 'right', 'left', 'down'];
    for (let dir of directions) {
        if (canMove(player2, dir)) {
            if (dir === 'up') player2.row--;
            if (dir === 'down') player2.row++;
            if (dir === 'left') player2.col--;
            if (dir === 'right') player2.col++;
            break;
        }
    }
    checkWinCondition();
}

function tryPlaceRandomFence() {
    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
        let row = Math.floor(Math.random() * (rows - 1));
        let col = Math.floor(Math.random() * (cols - 1));
        let type = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        if (isFenceSpotFree(row, col, type)) {
            fences.push({ row, col, type });
            player2.fencesLeft--;
            updateFenceDisplay();
            return true;
        }
    }
    return false;
}

function isFenceSpotFree(row, col, type) {
    if (type === 'horizontal' && (col >= cols - 1 || row >= rows - 1)) return false;
    if (type === 'vertical' && (row >= rows - 1 || col >= cols - 1)) return false;
    for (let f of fences) {
        if (f.type === type && f.row === row && f.col === col) return false;
        if (type === 'horizontal' && f.type === 'horizontal' && f.row === row && Math.abs(f.col - col) <= 1) return false;
        if (type === 'vertical' && f.type === 'vertical' && f.col === col && Math.abs(f.row - row) <= 1) return false;
    }
    return true;
}

function strategicAIMove() {
    moveAIPawn();
}

function checkWinCondition() {
    if (player1.row === rows - 1) {
        alert(player1.name + " a câștigat!");
        gameStarted = false;
    } else if (player2.row === 0) {
        alert(player2.name + " a câștigat!");
        gameStarted = false;
    }
}

function hasPath(player) {
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let queue = [{ row: player.row, col: player.col }];
    visited[player.row][player.col] = true;

    while (queue.length > 0) {
        let { row, col } = queue.shift();

        if ((player === player1 && row === rows - 1) || (player === player2 && row === 0)) return true;

        const directions = [
            { r: -1, c: 0, name: 'up' },
            { r: 1, c: 0, name: 'down' },
            { r: 0, c: -1, name: 'left' },
            { r: 0, c: 1, name: 'right' }
        ];

        for (let dir of directions) {
            let newRow = row + dir.r;
            let newCol = col + dir.c;

            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !visited[newRow][newCol] &&
                canMove({ row, col }, dir.name)
            ) {
                visited[newRow][newCol] = true;
                queue.push({ row: newRow, col: newCol });
            }
        }
    }

    return false; 
}
