let grid=[];
let cols=9;
let rows=9;
let cellSize=60;

function setup(){
    createCanvas(cols*cellSize+1, rows*cellSize+1);
    createGrid();
}

function draw(){
    background(255);
    drawGrid();
}

function createGrid(){
    for(let x=0;x<rows;x++){
        let row=[];
        for(let y=0;y<cols;y++){
            row.push({
                x: x*cellSize,
                y: y*cellSize,
                w: cellSize,
                h:cellSize
            });
        }
        grid.push(row);
    }
}

function drawGrid(){
    stroke(0);
    for(let x=0;x<rows;x++){
        for(let y=0;y<cols;y++){
            let cell=grid[x][y];
            fill(240);
            rect(cell.y, cell.x, cell.w, cell.h)
        }
    }
}