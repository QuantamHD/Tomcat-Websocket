import { Vector2D } from "./vector2d.js";

class Bunny {
    constructor(initialPos, image, makeTurn) {
        this.initialPos = initialPos;
        this.pos = initialPos.copy();
        //this.prevPos = initialPos.copy();
        this.accumulateDelta = Vector2D.zero();

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

        let x = Math.round(this.pos.x);
        let y = Math.round(this.pos.y);
        

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
                this.accumulateDelta.setValues(0, 0);
                this.velocity = 1.5;
            }

            if (this.state == "loaf_right") {
                this.state = "loaf_left";
                this.currentFrameNumber = 0;
                this.timeLeftOnCurrentFrame = 400;
                this.velocity = 0;
                this.accumulateDelta.setValues(0, 0);
                // Accounts for image moving when it's flipped
                this.pos.x += 20;
            }

        }
        let rate = this.velocity / deltaT;

        if (this.pos.y < 60 && this.makeTurn && this.state == "running_right") {
            this.currentFrameNumber = 0;
            this.timeLeftOnCurrentFrame = 400;
            this.velocity = 0;
            this.state = "loaf_right";
        }

        if (this.state == "running_left") {
            this.accumulateDelta.x += -rate;
        } else if (this.state == "running_right") {
            this.accumulateDelta.x += rate;
        }
        if (this.state == "running_left" || this.state == "running_right") {
            this.accumulateDelta.y -= rate;
        }

        if (Math.abs(this.accumulateDelta.x) > 1) {
            this.pos.x += Math.round(this.accumulateDelta.x);
            this.accumulateDelta.x = 0;
        }

        if (Math.abs(this.accumulateDelta.y) > 1) {
            this.pos.y += Math.round(this.accumulateDelta.y);
            this.accumulateDelta.y = 0;
        }

        if (this.pos.y < -20) {
            this.pos.set(this.initialPos);
            this.shouldTurn = false;
            this.accumulateDelta.setValues(0, 0);
            this.state = "running_right";
        }
    }

    // Since this is a pixel art game exact pixel coordinates
    // matter a lot. Right now the fractional component of their
    // position can start to deviate, and when it does they round
    // in an unnatural and jittery way. Incrementing either x or y
    // 1 frame apart.
    //
    // This function will essentially keep the fractional component
    // of their position the same to avoid this unnatural rounding.
    smoothlyRoundPosition() {
        let x = Math.abs(this.pos.x);
        let y = Math.abs(this.pos.y);

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
