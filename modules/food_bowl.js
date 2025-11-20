import { Vector2D } from "./vector2d.js";

export default class FoodBowl {
  constructor(x, y) {
    this.pos = new Vector2D(x, y);
    this.width = 50;
    this.height = 30;
  }

  draw(deltaT, context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    // Draw the trapezoid
    context.beginPath();
    context.moveTo(-this.width / 2, -this.height / 2);
    context.lineTo(this.width / 2, -this.height / 2);
    context.lineTo(this.width / 2 - 10, this.height / 2);
    context.lineTo(-this.width / 2 + 10, this.height / 2);
    context.closePath();

    context.fillStyle = '#8B4513'; // SaddleBrown
    context.fill();

    // Draw the text
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('food', 0, 0);

    context.restore();
  }

  update(deltaT) {}
}
