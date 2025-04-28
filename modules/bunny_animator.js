import { Timer } from "./timer.js";

const FrameWidth = 20;

class BunnyAnimator {
  constructor(image) {
    this.spriteSheet = image;
    this.currentFrameNumber = 0;
    this.frameOffset = 0;
    this.animationLength = 0;
    this.flipX = false;

    this.timer = new Timer(125, () => this.onTimerTimeout());
  }

  // if we add a set look dir and a set is moving field then the animator can pick it's own animation based off of that knowledge.
  update(deltaT) {
    this.timer.update(deltaT);
  }
  

  runLeft() {
    this.frameOffset = 0;
    this.animationLength = 4;
    this.flipX = true;
  }

  runRight() {
    this.frameOffset = 0;
    this.animationLength = 4;
    this.flipX = false;
  }

  runDownRight() {
    this.frameOffset = 4;
    this.animationLength = 4;
    this.flipX = true;
  }

  runDownLeft() {
    this.frameOffset = 4;
    this.animationLength = 4;
    this.flipX = false;
  }

  loafLeft() {
    this.frameOffset = 0;
    this.animationLength = 1;
    this.flipX = true;
  }

  loafRight() {
    this.frameOffset = 0;
    this.animationLength = 1;
    this.flipX = false;
  }

  draw(deltaT, ctx) {
    ctx.save();

    if (this.flipX) {
        ctx.translate(FrameWidth, 0);
        ctx.scale(-1, 1);
    }
    
    ctx.drawImage(
      this.spriteSheet,
      /*Frame offset = */ FrameWidth * (this.currentFrameNumber), 0,
      /*Clip window = */ 20, 20,
      /*Draw location = */ 0, 0,
      /*Drawn image dimensions = */ 20, 20);
    ctx.restore();
  }

  onTimerTimeout() {
    this.currentFrameNumber = (this.currentFrameNumber + 1) % this.animationLength + this.frameOffset;
  }
}

export { BunnyAnimator };