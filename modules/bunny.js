class Bunny {
    constructor(initalX, intialY, image, makeTurn) {
        this.initalX = initalX;
        this.intialY = intialY;
        this.x = initalX;
        this.y = intialY;
        this.prevX = initalX;
        this.prevY = intialY;
        this.accumulateDeltaX = 0;
        this.accumulateDeltaY = 0;
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

        let x = Math.round(this.x);
        let y = Math.round(this.y);
        

        if (this.state == "running_left" || this.state == "loaf_left") {
            x *= -1;
            ctx.scale(-1, 1);
        }

        if (this.state == "running_left" || this.state == "loaf_left") { 
            console.log(x + ", " + y);
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
                this.accumulateDeltaX = 0;
                this.accumulateDeltaY = 0;
                this.velocity = 1.5;
            }

            if (this.state == "loaf_right") {
                this.state = "loaf_left";
                this.currentFrameNumber = 0;
                this.timeLeftOnCurrentFrame = 400;
                this.velocity = 0;
                this.accumulateDeltaX = 0;
                this.accumulateDeltaY = 0;
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
            this.accumulateDeltaX += -rate;
        } else if (this.state == "running_right") {
            this.accumulateDeltaX += rate;
        }
        if (this.state == "running_left" || this.state == "running_right") {
            this.accumulateDeltaY -= rate;
        }

        if (Math.abs(this.accumulateDeltaX) > 1) {
            this.x += Math.round(this.accumulateDeltaX);
            this.accumulateDeltaX = 0;
        }

        if (Math.abs(this.accumulateDeltaY) > 1) {
            this.y += Math.round(this.accumulateDeltaY);
            this.accumulateDeltaY = 0;
        }

        if (this.y < -20) {
            this.x = this.initalX;
            this.y = this.intialY;
            this.shouldTurn = false;
            this.accumulateDeltaX = 0;
            this.accumulateDeltaY = 0;
            this.state = "running_right";
        }
    }

    // Since this is a pixel art game exact pixel coordinates
    // matter a lot. Right now the fractional component of their
    // position can start to deviate, and when it does they round
    // in an unatrual and jittery way. Incrementing either x or y
    // 1 frame apart.
    //
    // This function will essentially keep the fractional component
    // of their position the same to avoid this unatural rounding.
    smoothlyRoundPosition() {
        let x = Math.abs(this.x);
        let y = Math.abs(this.y);

        let fractional_x = x - Math.floor(x);
        let fractional_y = y - Math.floor(y);

        let new_fractional = (fractional_x + fractional_y)/2;

        if (this.x >= 0) {
            this.x = Math.floor(this.x) + new_fractional;
        } else {
            this.x = Math.ceil(this.x) - new_fractional;
        }

        if (this.y >= 0) {
            this.y = Math.floor(this.y) + new_fractional;
        } else {
            this.y = Math.ceil(this.y) - new_fractional;
        }

    }
}

export { Bunny };
