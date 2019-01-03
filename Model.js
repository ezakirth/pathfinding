class Model {

    constructor(owner) {
        this.owner = owner;
        this.frames = {
            idle: [
                [1 / 3, 1 / 3]
            ],
            moving: [
                [1 / 3, 1 / 3],
                [2 / 3, 1 / 3],
                [1 / 3, 1 / 3],
                [0, 1 / 3]
            ]
        }
        this.currentFrame = 0;
        this.timer = 0;
        this.mdl = new mesh();
        this.id = this.mdl.addRect(0, 0, 160 / 3, 105, -Math.PI / 2);
        if (this.owner.side == 1) {
            this.mdl.texture = "images/Toon";
        } else {
            this.mdl.texture = "images/Toon2";
        }
        var frame = this.frames["idle"][this.currentFrame];
        this.mdl.setRectTex(this.id, frame[1], 0, frame[2], 1);
    }

    update() {
        this.timer = this.timer + DeltaTime;

        if (this.timer > .1) {
            this.timer = 0;
            this.currentFrame = this.currentFrame + 1;
            if (this.currentFrame > this.frames.length[this.owner.status]) {
                this.currentFrame = 1;
            };
            var frame = this.frames[this.owner.status][this.currentFrame];
            this.mdl.setRectTex(this.id, frame[1], 0, frame[2], 1);
        }

    }

    draw() {
        if (this.owner.showFlash) {
            this.mdl.setRectColor(this.id, 1000, 1000, 1000, 255);
        } else {
            if (this.owner.showHit) {
                this.mdl.setRectColor(this.id, 10000, 0, 0, 255);
            } else {
                this.mdl.setRectColor(this.id, 255, 255, 255, 255);
            }

            this.mdl.draw();
        }
    }
}