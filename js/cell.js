export class Cell {
  #height;
  #width;
  #x;
  #y;
  constructor(value) {
    this.value = value;
    this.#height = 1;
    this.#width = 1;
    this.prevValue = -1;
    this.#x = null;
    this.#y = null;
  }

  draw(ctx, i, j, scale, colorStillLifeDifferent) {
    this.#width = scale * 1;
    this.#height = scale * 1;
    this.#x = i * scale;
    this.#y = j * scale;

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

  inBounds(mouseX, mouseY) {
    return (
      mouseX > this.#x &&
      mouseX < this.#x + this.#width &&
      mouseY > this.#y &&
      mouseY < this.#y + this.#height
    );
  }
}
