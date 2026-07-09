import { Grid } from "./grid.js";
import { Menu, MENU_BUTTONS } from "./menu.js";

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
  MENU: 0,
  PLAYING: 1,
});

export class GameOfLife {
  #elementID;
  #dpr;
  #resolution;
  #grid;
  #state;
  #menu;
  constructor(elementID, resolution) {
    this.#resolution = resolution;
    this.#elementID = elementID;
    this.initCanvas();
    this.#grid = new Grid(
      this.getCanvasWidth(),
      this.getCanvasHeight(),
      true,
      0.3,
    );
    this.#state = GAME_STATE.MENU;
    this.#menu = new Menu(this.getCanvasWidth(), this.getCanvasHeight());

    this.gridScale = 2; // 1 is no scaling

    // loop
    this.setFPS(1);
    this.lastFrameTime = 0;
    this.currAnimation = null;
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

  draw() {
    switch (this.#state) {
      case GAME_STATE.MENU:
        this.#menu.draw(
          this.ctx,
          this.getCanvasWidth(),
          this.getCanvasHeight(),
        );
        break;
      case GAME_STATE.PLAYING:
        this.#grid.draw(this.ctx, true);
        break;
      default:
        alert("unknown erro");
    }
  }

  drawNoCompute() {
    this.#grid.draw(this.ctx, false);
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
    // console.log(mouseX, mouseY);

    // const currGridNumRows = this.grid.length;
    // const currGridNumColumns = this.grid[0].length;

    if (this.#state === GAME_STATE.MENU) {
      const button_pressed = this.#menu.whichButtonWasPressed(mouseX, mouseY);
      switch (button_pressed) {
        case MENU_BUTTONS.GO:
          this.#state = GAME_STATE.PLAYING;
          break;
      }
    }
    //const cellSquareSize =
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
