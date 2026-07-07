import { GameOfLife } from "./game.js";

let game;
let currAnimation;
const fps = 1; // Target generations per second
let fpsInterval = 1000 / fps;
let then = performance.now();
const gridScale = 100; // 1 is no scaling

let generation = 0;

// main
window.onload = () => {
  game = new GameOfLife("gameOfLiveCanvas", gridScale);
  game.draw();
  gameLoop();
};

const gameLoop = (timestamp) => {
  currAnimation = requestAnimationFrame(gameLoop);

  let elapsed = timestamp - then;
  if (elapsed > fpsInterval) {
    then = timestamp - (elapsed % fpsInterval);
    game.draw();
    generation++;
    if (generation % 250 === 0) {
      console.log("generation:", generation);
      console.log("population:", game.population);
    }
  }
};

window.addEventListener("resize", () => {
  cancelAnimationFrame(currAnimation);
  game.handleResizeEvent();
  requestAnimationFrame(gameLoop);
  game.drawCurrentGrid();
  game.drawGridLines();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(currAnimation);
  } else {
    requestAnimationFrame(gameLoop);
  }
});

document.addEventListener("click", (event) => {
  game.handleClickEvent(event);
});
