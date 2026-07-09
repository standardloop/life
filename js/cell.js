export class Cell {
  #height;
  #width;
  constructor(value) {
    this.value = value;
    this.#height = 1;
    this.#width = 1;
    this.prevValue = -1;
  }

  draw(ctx, i, j, colorStillLifeDifferent) {
    if (this.value === 1) {
      if (this.prevValue === 1 && colorStillLifeDifferent) {
        ctx.fillStyle = "#0095ff";
      } else {
        ctx.fillStyle = "#00ff80";
      }
      ctx.fillRect(i, j, 1, 1);
    } else {
      // ctx.fillStyle = "#000000";
    }
    // ctx.fillRect(i, j, 1, 1);
  }
}
