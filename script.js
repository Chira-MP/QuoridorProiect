let grid = [];
let cols = 9;
let rows = 9;
let cellSize = 60;   
let gap = 5;   
let gameStarted = false;    

let player1 = { row: 0, col: 4, color: '#DBBEB5', name: 'Jucător 1' };
let player2 = { row: 8, col: 4, color: '#88a286', name: 'Jucător 2' };

function setup() {
    let canvas = createCanvas(cols * (cellSize + gap) + gap, rows * (cellSize + gap) + gap + 50);
    canvas.parent('game-board'); 
    createGrid();
}

function draw() {
    background(255);
    drawGrid();
    drawPlayers();
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

    if (!gameStarted) return;

    if (key === 'w' || key === 'W') {
        if (player1.row > 0) player1.row--;
    } else if (key === 's' || key === 'S') {
        if (player1.row < rows - 1) player1.row++;
    } else if (key === 'a' || key === 'A') {
        if (player1.col > 0) player1.col--;
    } else if (key === 'd' || key === 'D') {
        if (player1.col < cols - 1) player1.col++;
    }

    if (keyCode === UP_ARROW) {
        if (player2.row > 0) player2.row--;
    } else if (keyCode === DOWN_ARROW) {
        if (player2.row < rows - 1) player2.row++;
    } else if (keyCode === LEFT_ARROW) {
        if (player2.col > 0) player2.col--;
    } else if (keyCode === RIGHT_ARROW) {
        if (player2.col < cols - 1) player2.col++;
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
}