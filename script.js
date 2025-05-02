let grid = [];
let cols = 9;
let rows = 9;
let cellSize = 60;


let player1 = { row: 0, col: 4, color: 'blue' };
let player2 = { row: 8, col: 4, color: 'red' };

function setup() {
    createCanvas(cols * cellSize + 1, rows * cellSize + 1);
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
                x: x * cellSize,
                y: y * cellSize,
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
            fill(240);
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
