import { Timer } from "./timer.js";
import { Vector2D } from "./vector2d.js";

const BunnyHeight = 20;

const BunnyState = {
    RUNNING_RIGHT: 0,
    RUNNING_LEFT: 1,
    LOAF_LEFT: 2,
    LOAF_RIGHT: 3
};

class Bunny {
    constructor(initialPos, image, shouldTurn) {
        this.initialPos = initialPos;
        this.pos = initialPos.copy();
        this.accumulateDelta = Vector2D.zero();

        // The amount of time between animation frames in milliseconds
        this.stateTimer = new Timer(125, () => this.onStateTimerTimeout());
        this.currentFrameNumber = 0;
        this.spriteSheet = image;
        this.shouldTurn = shouldTurn;
        this.state = BunnyState.RUNNING_RIGHT
        this.velocity = new Vector2D(1.5, 1.5);
        this.deltaV = Vector2D.zero();
    }

    onStateTimerTimeout() {
        // update animation
        this.currentFrameNumber = (this.currentFrameNumber + 1) % 5;

        // state.change state
        if (this.state == BunnyState.LOAF_LEFT) {
            this.transitionToRunningLeft(this.state);
        }
        if (this.state == BunnyState.LOAF_RIGHT) {
            this.transitionToLoafLeft(this.state);
        }
        // this needs to be last for now
        if (this.state == BunnyState.RUNNING_RIGHT && this.performTurn()) {
            this.transitionToLoafRight(this.state);
        }
    }

    update(deltaT) {
        this.stateTimer.update(deltaT);
        this.deltaV.setValues(this.velocity.x / deltaT, this.velocity.y / deltaT);

        if (this.isOffscreen()) {
            this.pos.set(this.initialPos);
            this.accumulateDelta.setValues(0, 0);
            this.state = BunnyState.RUNNING_RIGHT;
            return;
        }

        // Controlling Bunny Direction
        if (this.state == BunnyState.RUNNING_LEFT) {
            this.deltaV.x = -this.deltaV.x;
        }

        this.accumulateDelta.x += this.deltaV.x;
        this.accumulateDelta.y -= this.deltaV.y;

        // update position
        if (Math.abs(this.accumulateDelta.x) > 1) {
            this.pos.x += Math.round(this.accumulateDelta.x);
            this.accumulateDelta.x = 0;
        }
        if (Math.abs(this.accumulateDelta.y) > 1) {
            this.pos.y += Math.round(this.accumulateDelta.y);
            this.accumulateDelta.y = 0;
        }
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

    transitionToRunningLeft(currState) {
        this.state = BunnyState.RUNNING_LEFT;
        this.currentFrameNumber = 0;
        this.stateTimer.reset(125);
        this.accumulateDelta.setValues(0, 0);
        this.velocity.setValues(1.5, 1.5);
    }

    transitionToLoafLeft(currState) {
        this.state = BunnyState.LOAF_LEFT;
        this.currentFrameNumber = 0;
        this.stateTimer.reset(400);
        this.velocity.setValues(0, 0);
        this.accumulateDelta.setValues(0, 0);
        // Accounts for image moving when it's flipped
        this.pos.x += 20;
    }

    transitionToLoafRight(currState) {
        this.currentFrameNumber = 0;
        this.stateTimer.reset(400);
        this.velocity.setValues(0, 0);
        this.state = BunnyState.LOAF_RIGHT;
    }

    performTurn() {
        return this.pos.y < 60 && this.shouldTurn;
    }

    isOffscreen() {
        return this.pos.y < -BunnyHeight;
    }
}

export { Bunny };
