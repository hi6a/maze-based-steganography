const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const ROWS = 31;
const COLS = 31;
const CELL_SIZE = 25;
const WALL_COLOR = "#333";
const PATH_COLOR = "#eee";
canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

let hiddenCells = [[1,1]];

let maze = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(1));

function generateMaze() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      maze[r][c] = 1;
    }
  }

  const startRow = 1;
  const startCol = 1;
  maze[startRow][startCol] = 0;

  carvePassages(startRow, startCol);
}

function carvePassages(r, c) {
  const directions = [
    [-2, 0],
    [0, 2],
    [2, 0],
    [0, -2],
  ];

  directions.sort(()=> Math.random() -0.5);

  for (let [dr, dc] of directions) {
    const newR = r + dr;
    const newC = c + dc;
    if (
      newR > 0 &&
      newR < ROWS - 1 &&
      newC > 0 &&
      newC < COLS - 1 &&
      maze[newR][newC] === 1
    ) {
      maze[r + dr / 2][c + dc / 2] = 0;
      maze[newR][newC] = 0;
      hiddenCells.push([newR,newC],[r + dr / 2,c + dc / 2]);
      carvePassages(newR, newC);
    }
  }
}

function drawMaze() {

hiddenCells.sort((r,c) => {
  if(r[0] !== c[0])  return r[0]-c[0];
 return r[1]-c[1];
});

shuffle(hiddenCells,seed);
console.log(hiddenCells);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if(maze[r][c] === 0){
        ctx.fillStyle = PATH_COLOR;
// map bits here
      }
      else{
        ctx.fillStyle = WALL_COLOR;
      }
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}
