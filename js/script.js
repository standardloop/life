import { GameOfLife } from "./game.js";

let game;

const canvas = document.getElementById("gameOfLifeCanvas");
const startBtn = document.getElementById("startBtn");
const menuScreen = document.getElementById("menuScreen");

const fpsSlider = document.getElementById("fpsSlider");
const scaleSlider = document.getElementById("scaleSlider");

const colorStillLifeToggle = document.getElementById("colorStill");

// main
window.onload = () => {
  game = new GameOfLife(canvas);
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
    // only after menu is gone?
    if (menuScreen.style.display === "none") {
      game.start();
    }
  }
});

// document.addEventListener("click", (event) => {
//   game.handleClickEvent(event);
// });

startBtn.addEventListener("click", () => {
  menuScreen.style.display = "none";
  canvas.style.display = "block";
  // hud.style.display = "block";
  game.start();
});

fpsSlider.addEventListener("input", (e) => {
  const fps = parseInt(e.target.value);
  fpsValue.textContent = fps;
  game.setFPS(fps);
});

scaleSlider.addEventListener("input", (e) => {
  const scale = parseInt(e.target.value);
  scaleValue.textContent = scale;
  game.setGridScale(scale);
});

colorStill.addEventListener("change", (e) => {
  game.setColorStillLifeDifferent(e.target.checked);
});
