import { BunnyAnimator } from "./bunny_animator.js";
import { Timer } from "./timer.js";
import { Vector2D } from "./vector2d.js";

const BunnyHeight = 20;

const BunnyState = {
    RUNNING_RIGHT: 0,
    RUNNING_LEFT: 1,
    RUNNING_DOWN_RIGHT: 2,
    RUNNING_DOWN_LEFT: 3,
    LOAF_LEFT: 4,
    LOAF_RIGHT: 5
};

class Bunny {
    constructor(initialPos, image, shouldTurn) {
        this.initialPos = initialPos;
        this.pos = initialPos.copy();
        this.accumulateDelta = Vector2D.zero();
        this.velocity = new Vector2D(1.5, 1.5);
        this.deltaV = Vector2D.zero();
        this.shouldTurn = shouldTurn;

        // The amount of time between animation frames in milliseconds
        this.stateTimer = new Timer(125, () => this.onStateTimerTimeout());
        this.bunnyAnimator = new BunnyAnimator(image);
        this.state = BunnyState.RUNNING_RIGHT;
        this.transitionToRunningRight();
    }

    onStateTimerTimeout() {
        // state.change state
        if (this.state == BunnyState.LOAF_LEFT) {
            this.transitionToRunningLeft(this.state);
        }
        if (this.state == BunnyState.LOAF_RIGHT) {
            this.transitionToLoafRight(this.state);
        }
        // this needs to be last for now
        if (this.state == BunnyState.RUNNING_RIGHT) {
            this.performTurn()
        }
    }

    update(deltaT) {
        this.stateTimer.update(deltaT);
        this.bunnyAnimator.update(deltaT);
        this.deltaV.setValues(this.velocity.x / deltaT, this.velocity.y / deltaT);

        if (this.isOffscreen()) {
            this.pos.set(this.initialPos);
            this.accumulateDelta.setValues(0, 0);
            this.transitionToRunningRight();
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
        ctx.translate(Math.round(this.pos.x), Math.round(this.pos.y));
        this.bunnyAnimator.draw(deltaT, ctx);
        ctx.restore();
    }

    transitionToRunningRight(currState) {
        this.state = BunnyState.RUNNING_RIGHT;
        this.accumulateDelta.setValues(0, 0);
        this.velocity.setValues(1.5, 1.5);
        this.bunnyAnimator.runRight();
    }

    transitionToRunningLeft(currState) {
        this.state = BunnyState.RUNNING_LEFT;
        this.stateTimer.reset(125);
        this.accumulateDelta.setValues(0, 0);
        this.velocity.setValues(1.5, 1.5);
        this.bunnyAnimator.runLeft();
    }

    transitionToRunningDownRight(currState) {
        this.state = BunnyState.RUNNING_DOWN_RIGHT;
        this.stateTimer.reset(125);
        this.accumulateDelta.setValues(0, 0);
        this.velocity.setValues(1.5, -1.5);
        this.bunnyAnimator.runDownRight();
    }

    transitionToRunningDownLeft(currState) {
        this.state = BunnyState.RUNNING_DOWN_LEFT;
        this.stateTimer.reset(125);
        this.accumulateDelta.setValues(0, 0);
        this.velocity.setValues(-1.5, -1.5);
        this.bunnyAnimator.runDownLeft();
    }

    transitionToLoafLeft(currState) {
        this.state = BunnyState.LOAF_LEFT;
        this.stateTimer.reset(400);
        this.velocity.setValues(0, 0);
        this.accumulateDelta.setValues(0, 0);
        this.bunnyAnimator.loafLeft();
    }

    transitionToLoafRight(currState) {
        this.stateTimer.reset(400);
        this.velocity.setValues(0, 0);
        this.state = BunnyState.LOAF_RIGHT;
        this.bunnyAnimator.loafRight();
    }

    performTurn() {
        if (this.pos.y > 60) {
            return;
        }
        switch (this.shouldTurn) {
            case "northeast":
                this.transitionToRunningRight(this.state);
                break;
            case "northwest":
                this.transitionToRunningLeft(this.state);
                break;
            case "southeast":
               this.transitionToRunningDownRight(this.state);
               break;
            case "southwest":
                this.transitionToRunningDownLeft(this.state);
                break;
        }
    }

    isOffscreen() {
        return this.pos.y < -BunnyHeight || this.pos.y > 220;
    }
}

export { Bunny };
