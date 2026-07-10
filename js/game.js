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
    this.initialPercentAlive = 40;
    // this.setInitialPercentAlive(40);
    this.setGridScale(20);

    this.#state = GAME_STATE.PLAYING;

    this.setFPS(15);

    this.options = {
      colorStillLifeDifferent: true,
      showFPS: true,
      drawGridLines: true,
      allowClickInput: true,
    };

    this.lastFrameTime = 0;
    this.currAnimation = null;

    // fps counter (for display only, not tied to logic)
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.displayFPS = 0;
  }

  setOption(key, value) {
    this.options[key] = value;
  }

  setGridScale(gridScale) {
    this.#gridScale = gridScale;
    this.initCanvas();
    this.initGrid();
  }

  initGrid() {
    //console.log(this.initialPercentAlive / 100);
    this.#grid = new Grid(
      this.getCanvasWidth(),
      this.getCanvasHeight(),
      this.initialPercentAlive / 100,
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
        this.#grid.draw(
          this.ctx,
          menuScreen.style.display === "none",
          this.scaleAmount,
          this.options.colorStillLifeDifferent,
          this.options.drawGridLines,
        );
        break;
      default:
        alert("Unknown game state");
    }
  }

  drawNoCompute() {
    this.#grid.draw(
      this.ctx,
      false,
      this.scaleAmount,
      this.options.colorStillLifeDifferent,
      this.options.drawGridLines,
    );
  }

  handleResizeEvent() {
    cancelAnimationFrame(this.currAnimation);
    this.initCanvas();
    this.#grid.handleResizeEvent(this.getCanvasWidth(), this.getCanvasHeight());
    requestAnimationFrame(this.loop);
    this.drawNoCompute();
  }

  handleClickEvent(event) {
    if (this.options.allowClickInput) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      this.#grid.handleClickEvent(mouseX, mouseY);
      console.log(mouseX, mouseY);
    }
  }

  setFPS(fps) {
    this.fps = fps;
    this.fpsInterval = 1000 / fps;
  }

  setInitialPercentAlive(initialPercentAlive) {
    this.initialPercentAlive = initialPercentAlive;
    this.initGrid();
  }

  trackFPS(currentTime) {
    this.frameCount++;
    if (currentTime - this.fpsTimer >= 500) {
      this.displayFPS = Math.round(
        (this.frameCount * 1000) / (currentTime - this.fpsTimer),
      );
      this.frameCount = 0;
      this.fpsTimer = currentTime;
      document.getElementById("hud").textContent = `FPS: ${this.displayFPS}`;
    }
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
      if (this.options.showFPS) {
        this.trackFPS(timestamp);
      }
    }
  };
}
