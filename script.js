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



let player1 = { row: 0, col: 4, color: '#DBBEB5', name: 'Jucător 1', fencesLeft: 10 };
let player2 = { row: 8, col: 4, color: '#88a286', name: 'Jucător 2', fencesLeft: 10 };

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
    text(`${player1.name}`, 10, rows * (cellSize + gap) + 10);  
    text(`${player2.name}`, 10, rows * (cellSize + gap) + 30);  
}

function keyPressed() {
    if (!gameStarted || placingFence) return;

    if (currentPlayerTurn === 1) {
        if ((key === 'w' || key === 'W') && player1.row > 0 && canMove(player1, 'up')) {
            player1.row--;
            currentPlayerTurn = 2;
        } else if ((key === 's' || key === 'S') && player1.row < rows - 1 && canMove(player1, 'down')) {
            player1.row++;
            currentPlayerTurn = 2;
        } else if ((key === 'a' || key === 'A') && player1.col > 0 && canMove(player1, 'left')) {
            player1.col--;
            currentPlayerTurn = 2;
        } else if ((key === 'd' || key === 'D') && player1.col < cols - 1 && canMove(player1, 'right')) {
            player1.col++;
            currentPlayerTurn = 2;
        }
    } else if (currentPlayerTurn === 2) {
        if (keyCode === UP_ARROW && player2.row > 0 && canMove(player2, 'up')) {
            player2.row--;
            currentPlayerTurn = 1;
        } else if (keyCode === DOWN_ARROW && player2.row < rows - 1 && canMove(player2, 'down')) {
            player2.row++;
            currentPlayerTurn = 1;
        } else if (keyCode === LEFT_ARROW && player2.col > 0 && canMove(player2, 'left')) {
            player2.col--;
            currentPlayerTurn = 1;
        } else if (keyCode === RIGHT_ARROW && player2.col < cols - 1 && canMove(player2, 'right')) {
            player2.col++;
            currentPlayerTurn = 1;
        }
    }
}



function startGame() {
    gameStarted = true;
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
    updateFenceDisplay();
}


function selectFence(type, playerNumber) {
    if (playerNumber !== currentPlayerTurn) return;

    let player = playerNumber === 1 ? player1 : player2;

    if (player.fencesLeft <= 0) {
        alert(`${player.name} nu mai are garduri!`);
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

    for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
            let cell = grid[y][x];
            let nextCellRight = grid[y][x + 1];
            let nextCellDown = grid[y + 1][x];

            if (
                fenceType === 'horizontal' &&
                mouseX > cell.x &&
                mouseX < nextCellRight.x + cellSize &&
                Math.abs(mouseY - (cell.y + cellSize)) < tolerance
            ) {
                fences.push({ row: y, col: x, type: 'horizontal' });
                clickedOnFence = true;
            }

            if (
                fenceType === 'vertical' &&
                mouseY > cell.y &&
                mouseY < nextCellDown.y + cellSize &&
                Math.abs(mouseX - (cell.x + cellSize)) < tolerance
            ) {
                fences.push({ row: y, col: x, type: 'vertical' });
                clickedOnFence = true;
            }

            if (clickedOnFence) break;
        }
        if (clickedOnFence) break;
    }

    if (!clickedOnFence) return;

    let player = currentPlayerPlacingFence === 1 ? player1 : player2;
    player.fencesLeft--;

    placingFence = false;
    fenceType = null;
    currentPlayerPlacingFence = null;

    updateFenceDisplay();
    currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;
}



function drawFences() {
    for (let fence of fences) {
        let baseX = fence.col * (cellSize + gap) + gap;
        let baseY = fence.row * (cellSize + gap) + gap;

        fill('#000');
        noStroke();

        if (fence.type === 'horizontal') {
            rect(baseX, baseY + cellSize, cellSize * 2 + gap, 10);
        } else if (fence.type === 'vertical') {
            rect(baseX + cellSize, baseY, 10, cellSize * 2 + gap);
        }
    }
}

function updateFenceDisplay() {
    document.getElementById('player1-fences').textContent = `Garduri: ${player1.fencesLeft}`;
    document.getElementById('player2-fences').textContent = `Garduri: ${player2.fencesLeft}`;
}

function canMove(player, direction) {
    let r = player.row;
    let c = player.col;

    for (let fence of fences) {
        if (fence.type === 'horizontal') {
            if (direction === 'down' &&
                r === fence.row && (c === fence.col || c === fence.col + 1)) {
                return false;
            }
            if (direction === 'up' &&
                r - 1 === fence.row && (c === fence.col || c === fence.col + 1)) {
                return false;
            }
        }

        if (fence.type === 'vertical') {
            if (direction === 'right' &&
                c === fence.col && (r === fence.row || r === fence.row + 1)) {
                return false;
            }
            if (direction === 'left' &&
                c - 1 === fence.col && (r === fence.row || r === fence.row + 1)) {
                return false;
            }
        }
    }
    return true;
}

