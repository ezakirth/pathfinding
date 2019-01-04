class Scene {

    constructor() {
        this.multi = false;
        this.players = Array();
        this.bullets = Array();
        this.animations = Array();
        this.bulletIndex = null;
        this.animIndex = null;
        this.p1 = new Player(this, 5 * 80, 22 * 80, 1);
        this.p2 = new Player(this, 10 * 80, 7 * 80, -1);
        this.p1.target = this.p2;
        this.p2.target = this.p1;

        table.insert(this.players, this.p1);
        table.insert(this.players, this.p2);

        this.p1img = new image(WIDTH / 2, HEIGHT);
        this.p2img = new image(WIDTH / 2, HEIGHT);
    }

    reset() {
        this.constructor();
    }

    update() {
        // update timers (respawns, etc...);
        world.update();
        this.p1.update();
        this.p2.update();

        // process bullet collisions etc...;
        this.bulletIndex = null;
        for (var index in this.bullets) {
            var bullet = this.bullets[index];
            if (bullet.gone) {
                this.bulletIndex = index;
            } else {
                bullet.update();
            }
    }

    this.animIndex = null;
    for (var index in this.animations) {
        var animation = this.animations[index];
        if (animation.done) {
            this.animIndex = index;
        } else {
            animation.update();
        }
}


}

showStats(player) {
    fill(0, 0, 0, 150);
    var offset = 0;
    if (player.side == -1) {
        offset = WIDTH / 2;
    }
    rect(offset, 0, WIDTH / 2, HEIGHT);
    pushMatrix();
    fill(255, 0, 0, 255);
    translate(offset + WIDTH / 4, HEIGHT / 2);
    rotate(-90 * player.side);
    fontSize(30);
    if (!player.spawned) {
        text("You died !", 0, 200);
    }

    text("Flag caps. " + player.score.caps, 0, 100);
    text("Kills. " + player.score.kills, 0, 0);
    text("Deaths. " + player.score.deaths, 0, -100);

    if (!player.spawned) {
        text("Respawning in " + Math.floor(player.spawnTimer * 10) / 10 + "s", 0, -200);
    }
    popMatrix();
}


draw() {
    // if multi we use clip() to splitscreen;
    if (this.multi) {
        clip(0, 0, WIDTH / 2, HEIGHT);
    }
    world.draw(this.p1);
    if (this.p1.spawned) {
        this.p1.draw();
    } else {
        this.showStats(this.p1);
    }
    tint(255);

    if (this.multi) {
        clip(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
        world.draw(this.p2);
        if (this.p2.spawned) {
            this.p2.draw();
        } else {
            this.showStats(this.p2);
        }
        tint(255);

        clip();

        //  vignette overlay && separation;
        rotate(-90);
        sprite("assets/0001", -HEIGHT / 2, WIDTH / 4, HEIGHT, WIDTH / 2);
        rotate(180);
        sprite("assets/0001", HEIGHT / 2, -WIDTH / 2 - WIDTH / 4, HEIGHT, WIDTH / 2);
        rotate(-90);
        strokeWidth(2);
        stroke(0, 0, 0, 255);
        line(WIDTH / 2, 1, WIDTH / 2, HEIGHT);
    } else {
        sprite("assets/0001", WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT);
    }
}

// handle player controls;
touched(touch) {
    if (touch.x < WIDTH / 2) {
        if (this.p1.spawned) {
            if (touch.y < HEIGHT / 2) {
                this.p1.shootStick.touched(touch);
            } else {
                this.p1.moveStick.touched(touch);
            }
        }
    } else {
        if (this.p2.spawned) {
            if (touch.y < HEIGHT / 2) {
                this.p2.moveStick.touched(touch);
            } else {
                this.p2.shootStick.touched(touch);
            }
        }
    }


}

}