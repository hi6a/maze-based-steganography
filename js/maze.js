const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const ROWS = 31;
const COLS = 31;
const CELL_SIZE = 10;
const WALL_COLOR = "#37A8F0";
const PATH_COLOR = "#eee";
canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

let hiddenCells = [[0, 0]];
let wallObjects =[];

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

  directions.sort(() => Math.random() - 0.5);

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

      carvePassages(newR, newC);
    }
  }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < ROWS; r++) {
      wallObjects[r] = [];
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 0) {
        ctx.fillStyle = PATH_COLOR;
        // map bits here
      }
      else {
        ctx.fillStyle = WALL_COLOR;
        hiddenCells.push([r, c]);
      }
      ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  hiddenCells.sort((r, c) => {
    if (r[0] !== c[0]) return r[0] - c[0];
    return r[1] - c[1];
  });
  shuffle(hiddenCells, seed);
  console.log(hiddenCells);
}


function shuffle(arr, seed) {
  const rnd = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
