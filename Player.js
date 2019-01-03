class Player {

    constructor(scene, x, y, side) {
        this.scene = scene;
        this.side = side;
        this.score = {}
        this.score.caps = 0;
        this.score.kills = 0;
        this.score.deaths = 0;

        if (side == 1) {
            this.flag = "images/p1_1_7";
            this.spawn = "images/p1_3_7";
        } else {
            this.flag = "images/p1_2_7";
            this.spawn = "images/p1_4_7";
        }
        this.hasFlag = false;
        this.flagStolen = false;

        this.target = null;

        this.pos = new vec2(x, y);
        this.mpos = new vec2();
        this.dir = new vec2(1, 0);
        this.moveStick = new Controller(this, true);
        this.shootStick = new Controller(this);

        this.status = "idle";
        this.model = new Model(this);

        this.arrow = new mesh();
        this.arrowId = this.arrow.addRect(0, 0, 150, 150);
        this.arrow.texture = "images/arrow";
        this.arrowTimer = 0;

        this.respawn();

        this.shield = 0;
        this.spawned = true;
        this.invincible = false;
    }

    move(vec, val) {
        var npx = this.pos.x + vec.x * val;
        var npy = this.pos.y + vec.y * val;
        var nx = Math.floor(npx / world.size) + 1;
        var ny = Math.floor(npy / world.size) + 1;
        if (ny > 0 && ny <= world.maxH && !world.map[this.mpos.x][ny].solid) {
            this.pos.y = npy;
        }
        if (nx > 0 && nx <= world.maxW && !world.map[nx][this.mpos.y].solid) {
            this.pos.x = npx;
        }
    }

    // equips a weapon;
    setWeapon(weapon) {
        this.weapon = weapon;
        if (this.weapon != Weapons.railgun) {
            this.aiming = false;
        }
        this.ammo = this.weapon.ammo;
        this.updateSpeed();
    }

    // respawn player to spawn point;
    respawn() {
        if (this.hasFlag) {
            this.dropFlag();
        }

        if (this.side == 1) {
            this.pos = new vec2(world.p1spawn.x * world.size - world.size / 2, world.p1spawn.y * world.size - world.size / 2);
        } else {
            this.pos = new vec2(world.p2spawn.x * world.size - world.size / 2, world.p2spawn.y * world.size - world.size / 2);
        }
        this.aiming = false;

        this.leftPortal = true;
        this.invincible = true;
        this.invinTimer = 2;
        this.spawned = false;
        this.timer = 0;
        this.shield = 0;
        this.status = "idle";
        this.aiming = false;
        this.firing = false;
        this.ready = true;
        this.showFlash = false;
        this.showHit = false;
        this.needReload = false;
        this.spawnTimer = 8;
        this.knockedBack = false;
        this.knockBackDir = new vec2();
        this.knockBackPow = 0;

        this.hasSpeedboost = false;
        this.speedboostTimer = 0;

        this.isSnared = false;
        this.snareTimer = 0;

        //repeat;
        // this.pos = new vec2(Math.random(world.maxW*world.size-1), Math.random(world.maxH*world.size-1));
        var x = Math.floor(this.pos.x / world.size) + 1;
        var y = Math.floor(this.pos.y / world.size) + 1;
        //until true //world.map[x][y].solid != true;

        this.setWeapon(Weapons.gun);
        this.life = 100;
    }

    updateSpeed() {
        var weight = this.weapon.weight;
        if (this.hasSpeedboost) {
            weight = weight - 3;
        }
        if (this.hasFlag) {
            weight = weight + 1;
        }
        if (this.isSnared) {
            weight = weight + 2;
        }

        this.speed = 5.5 - weight;
    }

    // handles flag capture;
    capFlag() {
        if (!this.flagStolen) {
            sound("A Hero's Quest.Level Up");
            sound("Game Sounds One.Crowd Cheer");

            var block;
            for (var x = 0; x < world.maxW; x++) {
                for (var y = 0; y < world.maxH; y++) {
                    block = world.map[x][y];
                    if (block.pickup == "images/p1_1_7") {
                        block.pickup = null
                    }
                    if (block.pickup == "images/p1_2_7") {
                        block.pickup = null
                    }
                }
            }

            if (this.side == 1) {
                world.map[world.p1flag.x][world.p1flag.y].pickup = this.flag;
                world.map[world.p2flag.x][world.p2flag.y].pickup = this.target.flag;
            } else {
                world.map[world.p1flag.x][world.p1flag.y].pickup = this.target.flag;
                world.map[world.p2flag.x][world.p2flag.y].pickup = this.flag;
            }
            this.target.hasFlag = false;
            this.hasFlag = false;
            this.flagStolen = false;
            this.target.flagStolen = false;
            this.score.caps = this.score.caps + 1;
        }
    }

    // handles flag stealing;
    stealFlag(tile) {
        this.hasFlag = true;
        sound("A Hero's Quest.Pick Up");
        tile.pickup = null;
        this.target.flagStolen = true;
    }

    // handles flag save;
    returnFlag(tile) {
        tile.pickup = null;
        sound("Game Sounds One.Crowd Cheer");
        if (this.side == 1) {
            world.map[world.p1flag.x][world.p1flag.y].pickup = this.flag;
        } else {
            world.map[world.p2flag.x][world.p2flag.y].pickup = this.flag;
        }
        this.flagStolen = false;
    }

    // handles flag drop;
    dropFlag() {
        this.hasFlag = false;
        world.map[this.mpos.x][this.mpos.y].pickup = this.target.flag;
        //    sound("A Hero's Quest.Pick Up");
    }

    // handles picking up item;
    pickup(tile) {

        // flag;
        if (this.hasFlag) {
            if (tile.pickup == this.spawn) {
                this.capFlag();
            }
        } else {
            if (tile.pickup == this.target.flag) {
                this.stealFlag(tile);
            }

            if (tile.pickup == this.flag && this.flagStolen) {
                this.returnFlag(tile);
            }
            // speedboost;
            if (tile.pickup == "images/p1_1_6") {
                sound("A Hero's Quest.FireBall Woosh");
                this.hasSpeedboost = true;
                this.boostTimer = 2;
                this.resetPickup(tile);
            }
            // shield;
            if (tile.pickup == "images/p1_2_6") {
                sound("A Hero's Quest.Steal");
                this.shield = this.shield + 50;
                if (this.shield > 100) {
                    this.shield = 100
                }
                this.resetPickup(tile);
            }
            // life;
            if (tile.pickup == "images/p1_1_8") {
                sound("A Hero's Quest.Eat 1");
                this.life = 100;
                this.resetPickup(tile);
            }
            // flak;
            if (tile.pickup == "images/p1_2_8") {
                sound("Game Sounds One.Reload 2");
                this.setWeapon(Weapons.flak);
                this.resetPickup(tile);
            }
            // minigun;
            if (tile.pickup == "images/p1_3_8") {
                sound("Game Sounds One.Reload 2");
                this.setWeapon(Weapons.minigun);
                this.resetPickup(tile);
            }
            // blastgun;
            if (tile.pickup == "images/p1_4_8") {
                sound("Game Sounds One.Reload 2");
                this.setWeapon(Weapons.blastgun);
                this.resetPickup(tile);
            }
            // railgun;
            if (tile.pickup == "images/p1_5_8") {
                sound("Game Sounds One.Reload 2");
                this.setWeapon(Weapons.railgun);
                this.resetPickup(tile);
            }
            // rocketlauncher;
            if (tile.pickup == "images/p1_6_8") {
                sound("Game Sounds One.Reload 2");
                this.setWeapon(Weapons.rocketlauncher);
                this.resetPickup(tile);
            }

        }
    }

    // once an item is picked up, starts its respawn timer (handled by World class);
    resetPickup(tile) {
        world.addRespawnTimer(tile.pickup, this.mpos);
        tile.pickup = null;
    }

    // handles entering a portal;
    portalTo(tile) {
        if (this.leftPortal) {
            table.insert(scene.animations, Animation("electrik", this.pos));
            table.insert(scene.animations, Animation("electrik", this.pos));
            this.pos.x = tile.portal.dx * world.size - world.size / 2;
            this.pos.y = tile.portal.dy * world.size - world.size / 2;
            this.mpos = new vec2(tile.portal.dx, tile.portal.dy);
            this.leftPortal = false;
            sound("A Hero's Quest.Attack Cast 1");
            table.insert(scene.animations, Animation("electrik", this.pos, false, .1, 2));
            table.insert(scene.animations, Animation("electrik", this.pos, false, .1, 2));
        }
    }

    // updates player timers && player map coordinates;
    update() {
        if (this.knockedBack) {
            this.knockBackPow = this.knockBackPow - this.knockBackPow / 5;
            this.move(this.knockBackDir, this.knockBackPow);
            if (this.knockBackPow < 1) {
                this.knockedBack = false;
                this.knockBackPow = 0;
            }
        }

        if (!this.spawned) {
            this.spawnTimer = this.spawnTimer - DeltaTime;
            if (this.spawnTimer < 0) {
                this.spawned = true;
            }
        }

        if (this.isSnared) {
            this.snareTimer = this.snareTimer - DeltaTime;
            if (this.snareTimer < 0) {
                this.isSnared = false;
                this.updateSpeed();
            }
        }

        if (this.hasSpeedboost) {
            this.boostTimer = this.boostTimer - DeltaTime;
            if (this.boostTimer < 0) {
                this.hasSpeedboost = false;
                this.updateSpeed();
            }
        }

        this.mpos = new vec2(Math.floor(this.pos.x / world.size) + 1, Math.floor(this.pos.y / world.size) + 1);
        var pos = world.map[this.mpos.x][this.mpos.y];
        if (pos.pickup) {
            this.pickup(pos);
            this.updateSpeed();
        }
        if (pos.portal) {
            this.portalTo(pos);
        } else {
            this.leftPortal = true;
        }

        if (this.ammo < 1) {
            this.setWeapon(Weapons.gun);
        }


        this.model.update();
        if (this.life <= 0) {
            sound("A Hero's Quest.Hurt 5");
            this.respawn();
        }


        if (this.spawned && this.invincible) {
            this.invinTimer = this.invinTimer - DeltaTime;
            if (this.invinTimer < 0) {
                this.invinTimer = 3;
                this.invincible = false;
            }
        }


        this.timer = this.timer + DeltaTime;
        this.arrowTimer = this.arrowTimer + DeltaTime / 2;
        if (this.arrowTimer > 1) {
            this.arrowTimer = 0;
        }

        if (this.weapon == Weapons.flak) {
            if (this.needReload && this.timer > this.weapon.rate / 3) {
                sound("Game Sounds One.Reload 1");
                this.needReload = false;
            }
        }
        if (this.timer > this.weapon.rate) {
            this.timer = 0;
            this.ready = true;
            if (this.firing) {
                this.fire();
            }

        }
    }


    draw() {
        // positions the player && opponent if multi;
        var offset = 0;
        if (this.side == -1) {
            offset = WIDTH / 2;
        }
        var p1offset;
        var v = this.target.pos - this.pos;
        if (scene.multi) {
            p1offset = new vec2(offset + WIDTH / 4, HEIGHT / 2);
        } else {
            p1offset = new vec2(offset + WIDTH / 2, HEIGHT / 2);
        }
        var p2offset = v + p1offset;
        var pos = this.pos - p1offset;

        // draws all bullets;
        for (var bullet of scene.bullets) {
            bullet.draw(pos);
        }

        // draws the red beam of railgun;
        if (this.aiming) {
            var offset = new vec2(0, -9).rotate(Math.atan(this.dir.y, this.dir.x));

            stroke(255, 0, 0, 49);
            strokeWidth(10);
            var A = p1offset + offset + this.dir * 45;
            var B = p1offset + offset + this.dir * this.weapon.range;
            line(A.x, A.y, B.x, B.y);
        }
        if (this.target.aiming) {
            stroke(255, 0, 0, 49);
            strokeWidth(10);
            var A = p2offset + this.target.dir * 45;
            var B = p2offset + this.target.dir * this.target.weapon.range;
            line(A.x, A.y, B.x, B.y);
        }

        strokeWidth(2);
        stroke(0, 0, 0, 255);

        pushMatrix();
        translate(p1offset.x, p1offset.y);

        // shows opponent position indicator;
        if (this.target.spawned) {
            var ang = Math.atan2(v.y, v.x);
            this.arrow.setRect(this.arrowId, 0, 0, this.arrowTimer * 250, this.arrowTimer * 250, ang);
            this.arrow.setRectColor(this.arrowId, 255, 255, 255, 255 - this.arrowTimer * 255);
            this.arrow.draw();
        }

        // display ammo && player;
        fill(255);
        rotate(-90 * this.side);
        text(this.ammo, 0, 50);
        rotate(90 * this.side);
        this.render();
        popMatrix();

        if (this.target.spawned) {
            pushMatrix();
            translate(p2offset.x, p2offset.y);
            this.target.render();
            popMatrix();
        }
        /*
        if (this.showHit && this.shield > 0) {
            pushMatrix();
            translate(p1offset.x, p1offset.y);
            tint(255, 255, 255, 131);
            sprite("images/shield", 0, 0, world.size);
            popMatrix();
        }
        */

        for (var animation of scene.animations) {
            animation.draw(pos);
        }

        this.showFlash = false;
        this.showHit = false;
    }

    render() {
        // draws light flash || player shadow;
        if (this.showFlash) {
            if (this.weapon == Weapons.blastgun) {
                sprite("images/blast2", 0, 0, 250, 250);
            } else {
                sprite("images/bullet", 0, 0, 250, 250);
            }
        } else {
            sprite("images/Shadow", 0, 0, 80, 96);
        }

        // draws the player;
        if (this.invincible) {
            rotate(Math.atan(this.dir.y, this.dir.x) * 180 / Math.PI);
            if (this.showFlash) {
                if (this.weapon == Weapons.blastgun) {
                    tint(255, 0, 201, 250);
                } else {
                    tint(255, 255, 255, 250);
                }
                sprite("images/muzzle", 73, -9);
            }
            if (Math.floor(this.invinTimer * 5) % 2 == 0) {
                this.model.draw();
            }
        } else {
            // display lifebar;
            var life = this.life * 2.55;
            fill(255 - life, life, 0, 255);
            rect(-this.side * 32, -this.life / 4, 10, this.life / 2);

            // display shield;
            var shield = this.shield * 2.55;
            fill(0, 127, 255, 255);
            rect(-this.side * 48, -this.shield / 4, 10, this.shield / 2);

            rotate(Math.atan(this.dir.y, this.dir.x) * 180 / Math.PI);
            if (this.showFlash) {
                if (this.weapon == Weapons.blastgun) {
                    tint(255, 0, 201, 250);
                } else {
                    tint(255, 255, 255, 250);
                }
                sprite("images/muzzle", 73, -9);
            }
            this.model.draw();
        }
    }

    drawGUI() {
        if (this.spawned) {
            this.moveStick.draw();
            this.shootStick.draw();
        }
    }

    // sets status ("moving", "idle", etc...);
    setStatus(status) {
        if (this.status != status) {
            this.status = status;
            this.model.currentFrame = 1;
        }
    }

    // handles pressing the fire button;
    fire(first) {
        // first shot;
        if (first) {
            this.firing = true;
            if (this.ready) {
                this.showFlash = true;
                this.timer = 0;
            }
        }

        // weapon ready to fire;
        if (this.ready) {
            this.ammo = this.ammo - 1;
            this.showFlash = true;

            // adds a bullet;
            var offset = new vec2(0, -9).rotate(Math.atan(this.dir.y, this.dir.x));
            var spawn = this.pos + offset + this.dir * 45;

            if (this.weapon == Weapons.blastgun || this.weapon == Weapons.flak) {
                var x = Math.floor(spawn.x / world.size) + 1;
                var y = Math.floor(spawn.y / world.size) + 1;
                if (world.map[x][y].solid) {
                    spawn = this.pos + offset - this.dir * 5;
                }

            }

            table.insert(this.scene.bullets, new Bullet(this, spawn.x, spawn.y, this.weapon));

            // or 10 on the flak;
            if (this.weapon == Weapons.flak) {
                for (var i = 0; i < 9; i++) {
                    table.insert(this.scene.bullets, new Bullet(this, spawn.x, spawn.y, this.weapon));
                }
                this.needReload = true;
                for (var i = 0; i < 4; i++) {
                    sound("Game Sounds One.Pistol");
                }
            } else {
                if (this.weapon == Weapons.railgun) {
                    for (var i = 0; i < 10; i++) {
                        sound("Game Sounds One.Blaster");
                    }
                } else {
                    if (this.weapon == Weapons.blastgun) {
                        sound("Game Sounds One.Blaster");
                    } else {
                        if (this.weapon == Weapons.rocketlauncher) {
                            sound("A Hero's Quest.FireBall Blast 1", .5);
                        } else {
                            sound("Game Sounds One.Pistol");
                        }
                    }
                    this.ready = false;
                }
            }
        }
    }
}