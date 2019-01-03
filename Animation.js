class Animation {

    constructor(effect, pos, loop, speed, size, alpha) {
        this.pos = new vec2(pos.x, pos.y);
        this.img = "images/" + effect;
        this.timer = 0;
        this.loop = loop;
        this.speed = speed || .1;
        this.scale = size || 1;
        this.alpha = alpha || 1;

        this.rot = Math.random() * Math.PI * 2;

        this.w, this.h = spriteSize(this.img);
        this.size = 1 / Math.floor(this.w / 64);
        this.mdl = mesh();
        this.id = this.mdl.addRect(0, 0, 64, 64, this.rot);
        this.mdl.texture = this.img;
        this.mdl.setRectTex(this.id, 0, 0, this.size, 1);
        this.mdl.setRectColor(this.id, color(255, 255, 255, this.alpha * 255));
        this.offset = 0;

        this.done = false;
    }

    update() {
        this.timer = this.timer + DeltaTime;
        if (this.timer > this.speed) {
            this.timer = 0;
            this.offset = this.offset + this.size;
            if (this.offset > 1) {
                this.done = true;
            } else {
                this.mdl.setRectTex(this.id, this.offset, 0, this.size, 1);
            }
        }
    }

    draw(vec) {
        var pos = this.pos - vec;
        pushMatrix();
        translate(pos.x, pos.y);
        //   rotate(ElapsedTime*360);
        //   tint(255, 255, 255, this.timer*255*this.alpha);
        scale(this.scale);
        this.mdl.draw();
        //    sprite(this.img, 0, 0, this.size);

        popMatrix();
    }
}