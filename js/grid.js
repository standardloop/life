import { Cell } from "./cell.js";

const getBiasedBit = (chanceOfOne) => {
  return Math.random() <= chanceOfOne ? 1 : 0;
};

function makeMatrix(rows, cols, filledIn, percentFilled) {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      if (filledIn) {
        row.push(new Cell(getBiasedBit(percentFilled)));
      } else {
        row.push(new Cell(0));
      }
    }
    matrix.push(row);
  }
  return matrix;
}

function countValueInMatrix(matrix, matchNumber) {
  const currMatrixNumRows = matrix.length;
  const currMatrixNumColumns = matrix[0].length;

  let count = 0;
  for (let i = 0; i < currMatrixNumRows; i++) {
    for (let j = 0; j < currMatrixNumColumns; j++) {
      if (matrix[i][j].value === matchNumber) {
        count++;
      }
    }
  }
  return count;
}

function countNeighborsInMatrix(matrix, x, y) {
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
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}

export class Grid {
  #matrix;
  #population;
  constructor(canvasWidth, canvasHeight, filledIn, percentFilled) {
    this.#matrix = makeMatrix(
      canvasWidth,
      canvasHeight,
      filledIn,
      percentFilled,
    );
    this.#population = this.countAliveCells();
  }
  countAliveCells() {
    return countValueInMatrix(this.#matrix, 1);
  }
  countDeadCells() {
    return countValueInMatrix(this.matrix, 0);
  }
  percentAliveCells() {
    return (countAliveCells() * 100) / (countAliveCells() + countDeadCells());
  }

  drawEmpty(ctx) {
    const currMatrixNumRows = this.#matrix.length;
    const currMatrixNumColumns = this.#matrix[0].length;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, currMatrixNumRows, currMatrixNumColumns);
  }

  drawMatrix(ctx, computeNext) {
    if (computeNext) {
      this.computeNextGeneration();
    }
    const currMatrixNumRows = this.#matrix.length;
    const currMatrixNumColumns = this.#matrix[0].length;

    this.drawEmpty(ctx);

    for (let i = 0; i < currMatrixNumRows; i++) {
      for (let j = 0; j < currMatrixNumColumns; j++) {
        const cell = this.#matrix[i][j];
        cell.draw(ctx, i, j);
      }
    }
  }

  computeNextGeneration() {
    const currMatrixNumRows = this.#matrix.length;
    const currMatrixNumColumns = this.#matrix[0].length;

    let next = makeMatrix(currMatrixNumRows, currMatrixNumColumns, false, null);

    let nextPopulation = 0;
    for (let i = 0; i < currMatrixNumRows; i++) {
      for (let j = 0; j < currMatrixNumColumns; j++) {
        let state = this.#matrix[i][j].value;
        let neighbors = countNeighborsInMatrix(this.#matrix, i, j);
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
    // if (arraysEqual(this.#matrix, next)) {
    //   next = makeMatrix(currMatrixNumRows, currMatrixNumColumns, true);
    // }
    this.#population = nextPopulation;
    this.#matrix = next;
  }

  drawMatrixGridLines(ctx) {
    const drawWidth = 0.1;
    const currMatrixNumRows = this.#matrix.length;
    const currMatrixNumColumns = this.#matrix[0].length;
    ctx.strokeStyle = "#313131";
    ctx.lineWidth = drawWidth;
    //ctx.translate((ctx.lineWidth / 2), (ctx.lineWidth / 2));

    const cellSize = 1;
    for (let x = 0; x <= currMatrixNumRows; x += cellSize) {
      let drawingX = x + ctx.lineWidth / 2;
      ctx.beginPath();
      ctx.moveTo(drawingX, 0);
      ctx.lineTo(drawingX, currMatrixNumColumns);
      ctx.stroke();
    }
    for (let y = 0; y <= currMatrixNumColumns; y += cellSize) {
      let drawingY = y + ctx.lineWidth / 2;

      ctx.beginPath();
      ctx.moveTo(0, drawingY);
      ctx.lineTo(currMatrixNumRows, drawingY);
      ctx.stroke();
    }
    // draw the bottom right corner
    ctx.fillStyle = "#313131";
    ctx.fillRect(currMatrixNumRows, currMatrixNumColumns, drawWidth, drawWidth);
  }

  draw(ctx, computeNext) {
    this.drawMatrix(ctx, computeNext);
    this.drawMatrixGridLines(ctx);
  }

  handleResizeEvent(canvasWidth, canvasHeight) {
    // don't mess up the current, add either empty or random to new area
    // flags for
    // random on outside
    // draw new array on middle
    // TODO

    let next = makeMatrix(canvasWidth, canvasHeight, false, null);
    const rows =
      this.#matrix.length > next.length ? next.length : this.#matrix.length;
    const cols =
      this.#matrix[0].length > next[0].length
        ? next[0].length
        : this.#matrix[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        next[i][j].value = this.#matrix[i][j].value;
      }
    }
    this.#matrix = next;
  }
}
