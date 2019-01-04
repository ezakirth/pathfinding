class Controller {

    constructor(owner, moveStick) {
        this.isMoveStick = moveStick;
        this.owner = owner;
        this.active = false;
        this.moving = false;
        this.pos = new vec2();
        this.origin = new vec2();
        this.dist = 0;
        this.lastDir = new vec2(1, 0);
    }

    draw() {
        if (this.active) {

            var vec = (this.pos.subtract(this.origin));

            var dir = new vec2(0, 0);
            if (vec != dir) {
                dir = vec.normalize();
            } else {
                dir = this.lastDir;
            }

            if (this.isMoveStick) {
                var val = this.owner.speed * this.dist / 50 * 60 * DeltaTime;
                this.owner.move(dir, val);

                if (this.owner.shootStick.moving == false) {
                    this.owner.dir = dir;
                }
            } else {
                if (this.moving) {
                    this.owner.dir = dir;
                }
            }

            this.lastDir = dir;

            sprite("assets/stick", this.pos.x, this.pos.y);
            sprite("assets/stick_bg", this.origin.x, this.origin.y);
        }
    }

    touched(touch) {
        this.active = true;
        if (touch.state == BEGAN) {
            if (!this.isMoveStick) {
                if (this.owner.weapon == Weapons.railgun) {
                    this.owner.aiming = true;
                } else {
                    this.owner.fire(true);
                }
            }
            this.origin.x = touch.x;
            this.origin.y = touch.y;
        }

        this.pos.x = touch.x;
        this.pos.y = touch.y;

        this.dist = this.pos.dist(this.origin);

        if (this.dist > 10) {;
            this.moving = true;
        }

        if (this.isMoveStick) {
            if (this.dist > 15) {
                this.dist = this.dist - 15;
                this.owner.setStatus("moving");
            } else {
                this.dist = 0;
                this.owner.setStatus("idle");
            }
        }

        if (touch.state == ENDED) {
            this.active = false;
            this.moving = false;
            if (this.isMoveStick) {
                this.owner.setStatus("idle");
            } else {
                if (this.owner.weapon == Weapons.railgun) {
                    this.owner.aiming = false;
                    this.owner.fire(true);
                }
                this.owner.firing = false;
            }
        }

        if (this.dist > 50) {
            this.dist = 50
        }
    }

}