export const MENU_BUTTONS = Object.freeze({
  GO: "GO",
});

export class Menu {
  #buttons;

  constructor(canvasWidth, canvasHeight) {
    this.initButtons(canvasWidth, canvasHeight);
  }

  #drawTitle(ctx, canvasWidth, canvasHeight) {
    const text = "Life";
    const fontSize = "80px";
    const fontFace = "Oxanium";
    const textColor = "rgb(255, 255, 255)";
    const borderWidth = 1;

    ctx.font = `${fontSize} ${fontFace}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const x = canvasWidth * 0.5;
    const y = canvasHeight * 0.2;

    ctx.strokeStyle = textColor;
    ctx.lineWidth = borderWidth;
    // TODO, 3d effect
    for (let i = 0; i < 1; i++) {
      ctx.strokeText(text, x, y);
    }
  }

  clearButtons() {
    this.#buttons = [];
  }

  whichButtonWasPressed(mouseX, mouseY) {
    let return_text = "";
    this.#buttons.forEach((button) => {
      if (button.inBounds(mouseX, mouseY)) {
        return_text = button.text;
      }
    });
    return return_text;
  }

  initButtons(canvasWidth, canvasHeight) {
    this.clearButtons();
    let menuButtonNames = Object.values(MENU_BUTTONS);

    for (
      let menuButtonIndex = 0;
      menuButtonIndex < menuButtonNames.length;
      menuButtonIndex++
    ) {
      let x = canvasWidth * 0.5 - 60;
      let y = canvasHeight * (0.32 + 0.1 * menuButtonIndex) - 25;
      let menuButtonName = menuButtonNames[menuButtonIndex];
      let width = 120;
      let height = 50;
      this.#buttons.push(new Button(menuButtonName, x, y, width, height));
    }
  }

  #drawMenuButtons(ctx) {
    this.#buttons.forEach((button) => button.draw(ctx));
  }

  draw(ctx, canvasWidth, canvasHeight) {
    this.#drawTitle(ctx, canvasWidth, canvasHeight);
    this.#drawMenuButtons(ctx);
  }
}

class Button {
  constructor(text, x, y, width, height) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    console.log(x, y);
  }

  draw(ctx) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#1aff00";
    ctx.font = "20px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  inBounds(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    );
  }
}
