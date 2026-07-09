import { Grid } from "./grid.js";

// const isStillLife = (matrix, x, y) => {
//   //   const numRows = matrix.length;
//   //   const numColumns = matrix[0].length;
//   return false;
// };

// const isOscillatorLife = (matrix, x, y) => {
//   //   const numRows = matrix.length;
//   //   const numColumns = matrix[0].length;
//   return false;
// };

// const isSpaceshipLife = (matrix, x, y) => {
//   //   const numRows = matrix.length;
//   //   const numColumns = matrix[0].length;
//   return false;
// };

export const GAME_STATE = Object.freeze({
  PLAYING: 0,
});

export class GameOfLife {
  #elementID;
  #dpr;
  #gridScale;
  #grid;
  #state;
  constructor(canvas) {
    this.canvas = canvas;
    this.setGridScale(20);
    this.#state = GAME_STATE.PLAYING;
    this.setColorStillLifeDifferent(true);

    // loop
    this.setFPS(60);

    this.lastFrameTime = 0;
    this.currAnimation = null;
  }

  setColorStillLifeDifferent(colorStillLifeDifferent) {
    this.colorStillLifeDifferent = colorStillLifeDifferent;
  }

  setGridScale(gridScale) {
    this.#gridScale = gridScale;
    this.initCanvas();
    this.#grid = new Grid(
      this.getCanvasWidth(),
      this.getCanvasHeight(),
      true,
      0.3,
    );
  }

  initCanvas() {
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
    return Math.floor(this.canvas.width / (this.#dpr * this.#gridScale));
  }

  getCanvasHeight() {
    return Math.floor(this.canvas.height / (this.#dpr * this.#gridScale));
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

    const scaleAmount = Math.floor(this.#dpr * this.#gridScale);
    this.ctx.scale(scaleAmount, scaleAmount);

    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  draw() {
    switch (this.#state) {
      case GAME_STATE.PLAYING:
        this.#grid.draw(this.ctx, true, this.colorStillLifeDifferent);
        break;
      default:
        alert("Unknown game state");
    }
  }

  drawNoCompute() {
    this.#grid.draw(this.ctx, false, colorStillLifeDifferent);
  }

  handleResizeEvent() {
    this.initCanvas();
    this.#grid.handleResizeEvent(this.getCanvasWidth(), this.getCanvasHeight());
  }

  handleClickEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    console.log(mouseX, mouseY);
  }

  setFPS(fps) {
    this.fps = fps;
    this.fpsInterval = 1000 / fps;
  }

  start() {
    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
  }

  stop() {
    if (this.currAnimation) {
      cancelAnimationFrame(this.currAnimation);
    }
  }

  loop = (timestamp) => {
    this.currAnimation = requestAnimationFrame(this.loop);

    const elapsed = timestamp - this.lastFrameTime;
    if (elapsed > this.fpsInterval) {
      this.lastFrameTime = timestamp - (elapsed % this.fpsInterval);
      this.draw();
    }
  };
}
