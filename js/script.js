import { GameOfLife } from "./game.js";

let game;

const canvas = document.getElementById("gameOfLifeCanvas");
const startBtn = document.getElementById("startBtn");
const menuScreen = document.getElementById("menuScreen");
const hud = document.getElementById("hud");

const fpsSlider = document.getElementById("fpsSlider");

const scaleSlider = document.getElementById("scaleSlider");

const initialPercentAliveSlide = document.getElementById(
  "initialPercentAliveSlide",
);

const colorStillLifeToggle = document.getElementById("colorStillToggle");
const fpsToggle = document.getElementById("fpsToggle");
const drawGridLinesToggle = document.getElementById("drawGridLinesToggle");
const allowClickInputToggle = document.getElementById("allowClickInputToggle");

hud.style.display = fpsToggle.checked ? "block" : "none";

fpsToggle.addEventListener("change", (e) => {
  game.setOption("showFPS", e.target.checked);
  hud.style.display = e.target.checked ? "block" : "none";
});

// main
window.onload = () => {
  game = new GameOfLife(canvas);
  game.start();
};

window.addEventListener("resize", () => {
  game.handleResizeEvent();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    game.stop();
  } else {
    // only after menu is gone?
    game.start();
  }
});

document.addEventListener("click", (event) => {
  game.handleClickEvent(event);
});

startBtn.addEventListener("click", () => {
  menuScreen.style.display = "none";
  hud.style.display = "block";
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

initialPercentAliveSlider.addEventListener("input", (e) => {
  const initialPercentAlive = parseInt(e.target.value);
  initialPercentAliveValue.textContent = initialPercentAlive;
  game.setInitialPercentAlive(initialPercentAlive);
});

colorStillLifeToggle.addEventListener("change", (e) => {
  game.setOption("colorStillLifeDifferent", e.target.checked);
});

drawGridLinesToggle.addEventListener("change", (e) => {
  game.setOption("drawGridLines", e.target.checked);
});

allowClickInputToggle.addEventListener("change", (e) => {
  game.setOption("allowClickInput", e.target.checked);
});
