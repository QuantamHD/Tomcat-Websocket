class Bunny {
    constructor(initalX, intialY, image) {
        this.initalX = initalX;
        this.intialY = intialY;
        this.x = initalX;
        this.y = intialY;
        // The amount of time between animation frames in milliseconds
        this.timePerFrameMs = 125;
        // The amount of time left on this frame before switching to the next one.
        this.timeLeftOnCurrentFrame = this.timePerFrameMs;
        this.currentFrameNumber = 0;
        this.spriteSheet = image;
    }

    update(deltaT) {
        this.updateAnimation(deltaT);
    }

    draw(deltaT, ctx) {
        ctx.drawImage(this.spriteSheet, 20 * (this.currentFrameNumber), 0, 20, 20, Math.floor(this.x), Math.floor(this.y), 20, 20);
    }

    updateAnimation(deltaT) {
        this.timeLeftOnCurrentFrame -= deltaT;
        if (this.timeLeftOnCurrentFrame < 0) {
            this.currentFrameNumber = (this.currentFrameNumber + 1) % 5;
            // Don't skip more than one frame if there's a lot of times between frames.
            this.timeLeftOnCurrentFrame = this.timePerFrameMs + Math.max(this.timeLeftOnCurrentFrame, -this.timePerFrameMs);
        }
        let rate = 1.5 / deltaT;
        this.x += rate;
        this.y -= rate;

        if (this.y < 10) {
            this.x = this.initalX;
            this.y = this.intialY;
        }
    }
}

export { Bunny };
