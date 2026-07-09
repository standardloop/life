import { GameOfLife } from "./game.js";

let game;

// main
window.onload = () => {
  game = new GameOfLife("gameOfLifeCanvas", 2);
  game.start();
};

window.addEventListener("resize", () => {
  // cancelAnimationFrame(currAnimation);
  // game.handleResizeEvent();
  // requestAnimationFrame(gameLoop);
  // game.drawNoCompute();
  console.log("TODO");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    game.stop();
  } else {
    game.start();
  }
});

document.addEventListener("click", (event) => {
  game.handleClickEvent(event);
});
