class Bunny {
    constructor(initalX, intialY, image, makeTurn) {
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
        this.makeTurn = makeTurn;
        this.state = "running_right";
        this.velocity = 1.5;
    }

    update(deltaT) {
        this.updateAnimation(deltaT);
    }

    draw(deltaT, ctx) {
        ctx.save();

        let x = Math.floor(this.x);
        let y = Math.floor(this.y);

        if (this.state == "running_left" || this.state == "loaf_left") {
            x *= -1;
            ctx.scale(-1, 1);
        }
        ctx.drawImage(this.spriteSheet, 20 * (this.currentFrameNumber), 0, 20, 20, x, y, 20, 20);
        ctx.restore();
    }

    updateAnimation(deltaT) {
        this.timeLeftOnCurrentFrame -= deltaT;
        if (this.timeLeftOnCurrentFrame < 0) {
            this.currentFrameNumber = (this.currentFrameNumber + 1) % 5;
            // Don't skip more than one frame if there's a lot of times between frames.
            this.timeLeftOnCurrentFrame = this.timePerFrameMs + Math.max(this.timeLeftOnCurrentFrame, -this.timePerFrameMs);

            if (this.state == "loaf_left") {
                this.state = "running_left";
                this.currentFrameNumber = 0;
                this.timeLeftOnCurrentFrame = 125;
                this.velocity = 1.5;
            }

            if (this.state == "loaf_right") {
                this.state = "loaf_left";
                this.currentFrameNumber = 0;
                this.timeLeftOnCurrentFrame = 400;
                this.velocity = 0;
                this.x += 20;
            }
        }
        let rate = this.velocity / deltaT;

        if (this.y < 60 && this.makeTurn && this.state == "running_right") {
            this.currentFrameNumber = 0;
            this.timeLeftOnCurrentFrame = 400;
            this.velocity = 0;
            this.state = "loaf_right";
        }

        if (this.state == "running_left") {
            this.x += -rate;
        } else if (this.state == "running_right") {
            this.x += rate;
        }
        this.y -= rate;


        if (this.y < -20) {
            this.x = this.initalX;
            this.y = this.intialY;
            this.shouldTurn = false;
            this.state = "running_right";
        }
    }
}

export { Bunny };
