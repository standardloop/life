import { Cell } from "./cell.js";

const getBiasedBit = (chanceOfOne) => {
  return Math.random() <= chanceOfOne ? 1 : 0;
};

const makeMatrix = (rows, cols, random) => {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      if (random) {
        row.push(new Cell(getBiasedBit(0.4)));
      } else {
        row.push(new Cell(0));
      }
    }
    matrix.push(row);
  }
  return matrix;
};

const countValueInMatrix = (matrix, matchNumber) => {
  const currGridNumRows = matrix.length;
  const currGridNumColumns = matrix[0].length;

  let count = 0;
  for (let i = 0; i < currGridNumRows; i++) {
    for (let j = 0; j < currGridNumColumns; j++) {
      if (matrix[i][j].value === matchNumber) {
        count++;
      }
    }
  }
  return count;
};

const countNeighborsInMatrix = (matrix, x, y) => {
  const numRows = matrix.length;
  const numColumns = matrix[0].length;
  let sum = 0;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i === x && j === y) {
        continue;
      }
      if (i >= 0 && i < numRows && j >= 0 && j < numColumns) {
        sum += matrix[i][j].value;
      }
    }
  }
  return sum;
};

const isStillLife = (matrix, x, y) => {
  //   const numRows = matrix.length;
  //   const numColumns = matrix[0].length;
  return false;
};

const isOscillatorLife = (matrix, x, y) => {
  //   const numRows = matrix.length;
  //   const numColumns = matrix[0].length;
  return false;
};

const isSpaceshipLife = (matrix, x, y) => {
  //   const numRows = matrix.length;
  //   const numColumns = matrix[0].length;
  return false;
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
};

export class GameOfLife {
  #elementID;
  #dpr;
  #resolution;
  constructor(elementID, resolution) {
    this.#resolution = resolution;
    this.#elementID = elementID;
    this.initCanvas();
    this.grid = makeMatrix(this.getCanvasWidth(), this.getCanvasHeight(), true);

    console.log("total size: ", this.getCanvasWidth() * this.getCanvasHeight());
    const aliveCount = countValueInMatrix(this.grid, 1);
    console.log("initial live count:", aliveCount);
    const deadCount = countValueInMatrix(this.grid, 0);
    console.log("initial dead count:", deadCount);
    console.log(
      "percent alive:",
      (aliveCount * 100) / (aliveCount + deadCount),
      "%",
    );
    this.population = 0;
  }

  initCanvas() {
    this.canvas = document.getElementById(this.#elementID);
    this.ctx = null;
    this.setupHighDPICanvas();
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
  }

  setCTX() {
    this.ctx = this.canvas.getContext("2d");
  }
  getCanvasWidth() {
    return Math.floor(this.canvas.width / (this.#dpr * this.#resolution));
  }

  getCanvasHeight() {
    return Math.floor(this.canvas.height / (this.#dpr * this.#resolution));
  }

  setDPR() {
    this.#dpr = window.devicePixelRatio || 1;
  }

  setupHighDPICanvas() {
    // const rect = canvas.getBoundingClientRect();
    this.setCTX();
    this.setDPR();
    const rect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas.width = rect.width * this.#dpr;
    this.canvas.height = rect.height * this.#dpr;

    const scaleAmount = Math.floor(this.#dpr * this.#resolution);
    this.ctx.scale(scaleAmount, scaleAmount);

    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  drawCurrentGrid() {
    const currGridNumRows = this.grid.length;
    const currGridNumColumns = this.grid[0].length;
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, currGridNumRows, currGridNumColumns);
    for (let i = 0; i < currGridNumRows; i++) {
      for (let j = 0; j < currGridNumColumns; j++) {
        if (this.grid[i][j].value === 1) {
          this.ctx.fillStyle = "#00ff80";
          this.ctx.fillRect(i, j, 1, 1);
        }
      }
    }
  }

  drawNextGrid() {
    const currGridNumRows = this.grid.length;
    const currGridNumColumns = this.grid[0].length;

    let next = makeMatrix(currGridNumRows, currGridNumColumns, false);

    let nextPopulation = 0;
    for (let i = 0; i < currGridNumRows; i++) {
      for (let j = 0; j < currGridNumColumns; j++) {
        let state = this.grid[i][j].value;
        let neighbors = countNeighborsInMatrix(this.grid, i, j);
        if (state == 0 && neighbors == 3) {
          next[i][j].value = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j].value = 0;
        } else {
          next[i][j].value = state;
        }
        nextPopulation += next[i][j].value;
      }
    }

    // for fun
    // if nothing has changed, then reset
    // if (arraysEqual(this.grid, next)) {
    //   next = makeMatrix(currGridNumRows, currGridNumColumns, true);
    // }
    this.population = nextPopulation;
    this.grid = next;
  }

  drawGridLines() {
    const drawWidth = 0.1;
    const currGridNumRows = this.grid.length;
    const currGridNumColumns = this.grid[0].length;
    this.ctx.strokeStyle = "#313131";
    this.ctx.lineWidth = drawWidth;
    //ctx.translate((this.ctx.lineWidth / 2), (this.ctx.lineWidth / 2));

    const cellSize = 1;
    for (let x = 0; x <= currGridNumRows; x += cellSize) {
      let drawingX = x + this.ctx.lineWidth / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(drawingX, 0);
      this.ctx.lineTo(drawingX, currGridNumColumns);
      this.ctx.stroke();
    }
    for (let y = 0; y <= currGridNumColumns; y += cellSize) {
      let drawingY = y + this.ctx.lineWidth / 2;

      this.ctx.beginPath();
      this.ctx.moveTo(0, drawingY);
      this.ctx.lineTo(currGridNumRows, drawingY);
      this.ctx.stroke();
    }
    // draw the bottom right corner
    this.ctx.fillStyle = "#313131";
    this.ctx.fillRect(
      currGridNumRows,
      currGridNumColumns,
      drawWidth,
      drawWidth,
    );
  }

  draw() {
    this.drawCurrentGrid();
    this.drawNextGrid();
    this.drawGridLines();
  }

  handleResizeEvent() {
    this.initCanvas();
    // don't mess up the current, add either empty or random to new area
    // flags for
    // random on outside
    // draw new array on middle
    let next = makeMatrix(this.getCanvasWidth(), this.getCanvasHeight(), false);
    const rows =
      this.grid.length > next.length ? next.length : this.grid.length;
    const cols =
      this.grid[0].length > next[0].length
        ? next[0].length
        : this.grid[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        next[i][j].value = this.grid[i][j].value;
      }
    }

    this.grid = next;
  }
  handleClickEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    console.log(mouseX, mouseY);

    const currGridNumRows = this.grid.length;
    const currGridNumColumns = this.grid[0].length;
    //const cellSquareSize =
  }
}
