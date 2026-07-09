export class Cell {
  #color;
  #height;
  #width;
  constructor(value) {
    this.value = value;

    this.#color = "#00ff80";
    this.#height = 1;
    this.#width = 1;
  }

  draw(ctx, i, j) {
    if (this.value === 1) {
      ctx.fillStyle = this.#color;
      ctx.fillRect(i, j, 1, 1);
    }
  }
}
