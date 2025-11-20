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
    LOAF_RIGHT: 5,
    EATING: 6
};

const stateTransitions = {
    RUNNING_RIGHT: [BunnyState.LOAF_RIGHT, BunnyState.EATING],
    RUNNING_LEFT: [BunnyState.LOAF_LEFT, BunnyState.EATING],
    LOAF_RIGHT: [BunnyState.LOAF_LEFT, BunnyState.RUNNING_RIGHT, BunnyState.EATING],
    LOAF_LEFT: [BunnyState.RUNNING_LEFT, BunnyState.LOAF_RIGHT, BunnyState.EATING],
    EATING: [BunnyState.LOAF_LEFT, BunnyState.LOAF_RIGHT, BunnyState.RUNNING_LEFT, BunnyState.RUNNING_RIGHT]
}

class Bunny {
    constructor(initialPos, image, shouldTurn) {
        this.initialPos = initialPos;
        this.pos = initialPos.copy();
        this.accumulateDelta = Vector2D.zero();
        this.velocity = new Vector2D(1.5, 1.5);
        this.deltaV = Vector2D.zero();
        this.shouldTurn = shouldTurn;
        this.foodBowlTargetOffset = Vector2D.zero();
        this.lastKnownFoodBowlPos = null;

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
    }

    update(deltaT, foodBowl) {
        this.stateTimer.update(deltaT);
        this.bunnyAnimator.update(deltaT);

        // Check if the food bowl has moved and calculate a new target if it has.
        if (!this.lastKnownFoodBowlPos || !this.lastKnownFoodBowlPos.equals(foodBowl.pos)) {
            this.calculateNewFoodBowlTarget();
            this.lastKnownFoodBowlPos = foodBowl.pos.copy();
        }

        const targetPos = this.lastKnownFoodBowlPos.copy().add(this.foodBowlTargetOffset);
        const distanceToTarget = this.pos.distance(targetPos);
        const EATING_DISTANCE = 5; // Smaller distance now since it's a target point

        if (this.state === BunnyState.EATING) {
            if (distanceToTarget >= EATING_DISTANCE) {
                // Target moved away, start moving again
                const direction = targetPos.subtract(this.pos).normalize();
                if (direction.x > 0) {
                    this.transitionToRunningRight();
                } else {
                    this.transitionToRunningLeft();
                }
            } else {
                // Still eating, nothing to do but wait
                return;
            }
        } else { // Not in EATING state
            const direction = targetPos.subtract(this.pos).normalize();

            if (distanceToTarget < EATING_DISTANCE) {
                // Reached target, start eating
                this.transitionToEating(direction);
                return;
            }

            if (this.isOffscreen()) {
                this.pos.set(this.initialPos);
                this.accumulateDelta.setValues(0, 0);
                this.transitionToRunningRight();
                return;
            }

            // Move towards food bowl
            this.velocity.x = direction.x * 1.5;
            this.velocity.y = direction.y * 1.5;

            if (direction.x > 0 && direction.y > 0) {
                this.bunnyAnimator.runDownRight();
            } else if (direction.x <= 0 && direction.y > 0) {
                this.bunnyAnimator.runDownLeft();
            } else if (direction.x > 0 && direction.y <= 0) {
                this.bunnyAnimator.runRight();
            } else {
                this.bunnyAnimator.runLeft();
            }
        }

        this.deltaV.setValues(this.velocity.x / deltaT, this.velocity.y / deltaT);
        this.accumulateDelta.add(this.deltaV);

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

    calculateNewFoodBowlTarget() {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 25 + Math.random() * 25; // 25 to 50 pixel radius
        this.foodBowlTargetOffset.setValues(radius * Math.cos(angle), radius * Math.sin(angle));
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

    transitionToEating(direction) {
        this.state = BunnyState.EATING;
        this.stateTimer.reset(2000); // Wait for 2 seconds (example)
        this.velocity.setValues(0, 0);
        this.accumulateDelta.setValues(0, 0);
        
        if (direction.x > 0 && direction.y > 0) {
            this.bunnyAnimator.loafDownRight();
        } else if (direction.x <= 0 && direction.y > 0) {
            this.bunnyAnimator.loafDownLeft();
        } else if (direction.x > 0 && direction.y <= 0) {
            this.bunnyAnimator.loafRight();
        } else {
            this.bunnyAnimator.loafLeft();
        }
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
        return false;
    }
}

export { Bunny };
