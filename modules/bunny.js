import { Timer } from "./timer.js";
import { Vector2D } from "./vector2d.js";

const BunnyState = {
    RUNNING_RIGHT: 0,
    RUNNING_LEFT: 1,
    LOAF_LEFT: 2,
    LOAF_RIGHT: 3
};

class Bunny {
    constructor(initialPos, image, makeTurn) {
        this.initialPos = initialPos;
        this.pos = initialPos.copy();
        this.accumulateDelta = Vector2D.zero();

        // The amount of time between animation frames in milliseconds
        this.stateTimer = new Timer(125, () => this.onStateTimerTimeout());
        this.currentFrameNumber = 0;
        this.spriteSheet = image;
        this.makeTurn = makeTurn;
        this.state = BunnyState.RUNNING_RIGHT
        this.velocity = new Vector2D(1.5, 1.5);
        this.deltaV = Vector2D.zero();
    }

    onStateTimerTimeout() {
        // update animation
        this.currentFrameNumber = (this.currentFrameNumber + 1) % 5;
            
        // state.change state
        if (this.state == BunnyState.LOAF_LEFT) {
            this.state = BunnyState.RUNNING_LEFT;
            this.currentFrameNumber = 0;
            this.stateTimer.reset(125);
            this.accumulateDelta.setValues(0, 0);
            this.velocity.setValues(1.5, 1.5);
        }

        if (this.state == BunnyState.LOAF_RIGHT) {
            this.state = BunnyState.LOAF_LEFT;
            this.currentFrameNumber = 0;
            this.stateTimer.reset(400);
            this.velocity.setValues(0, 0);
            this.accumulateDelta.setValues(0, 0);
            // Accounts for image moving when it's flipped
            this.pos.x += 20;
        }
    }

    update(deltaT) {
        this.updateAnimation(deltaT);
    }

    draw(deltaT, ctx) {
        ctx.save();

        let x = Math.round(this.pos.x);
        let y = Math.round(this.pos.y);
        

        if (this.state == BunnyState.RUNNING_LEFT || this.state == BunnyState.LOAF_LEFT) {
            x *= -1;
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(this.spriteSheet, 20 * (this.currentFrameNumber), 0, 20, 20, x, y, 20, 20);
        ctx.restore();
    }

    updateAnimation(deltaT) {
        this.stateTimer.update(deltaT);
        this.deltaV.setValues(this.velocity.x / deltaT, this.velocity.y / deltaT);

        // state.update()
        if (this.pos.y < 60 && this.makeTurn && this.state == BunnyState.RUNNING_RIGHT) {
            this.currentFrameNumber = 0;
            this.stateTimer.reset(400);
            this.velocity.setValues(0, 0);
            this.state = BunnyState.LOAF_RIGHT;
        }

        if (this.state == BunnyState.RUNNING_LEFT) {
            this.accumulateDelta.x += -this.deltaV.x;
            this.accumulateDelta.y -= this.deltaV.y;
        } else if (this.state == BunnyState.RUNNING_RIGHT) {
            this.accumulateDelta.x += this.deltaV.x;
            this.accumulateDelta.y -= this.deltaV.y;
        }

        // update position
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
            this.state = BunnyState.RUNNING_RIGHT;
        }
    }
}

export { Bunny };
