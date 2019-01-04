class Bullet {

    constructor(owner, x, y, weapon) {
        this.owner = owner;
        this.origin = new vec2(x, y);
        this.pos = new vec2(x, y);

        // handles weapon spray;
        if (weapon == Weapons.flak) {
            this.dir = new vec2(this.owner.dir.x + (-1 + Math.random() * 2) / 5, this.owner.dir.y + (-1 + Math.random() * 2) / 5);
        } else {
            if (weapon == Weapons.blastgun) {
                this.dir = new vec2(this.owner.dir.x + (-1 + Math.random() * 2) / 10, this.owner.dir.y + (-1 + Math.random() * 2) / 10);
            } else {
                this.dir = new vec2(this.owner.dir.x, this.owner.dir.y);
            }
        }

        this.weapon = weapon;
        this.speed = weapon.speed;
        this.dmg = weapon.dmg;
        this.range = weapon.range;
        this.distance = 0;
        this.gone = false;
        this.impact = false;
        this.timer = 0;

        if (weapon == Weapons.rocketlauncher) {
            table.insert(scene.animations, Animation("smoke", this.pos));
        }

    }
    hit(vol) {
        if (this.weapon == Weapons.flak) {
            sound("Game Sounds One.Pillar Hit", vol / 10);
        } else {
            if (this.weapon == Weapons.rocketlauncher) {
                sound("A Hero's Quest.FireBall Blast 2", vol);
            } else {
                sound("Game Sounds One.Pillar Hit", vol);
            }

        }
    }
    update() {
        this.timer = this.timer + DeltaTime;
        var vol = Math.min(50 / this.pos.dist(this.owner.pos), .8) //Math.min(50/this.distance, .8);
        var bounce = this.weapon == Weapons.blastgun || this.weapon == Weapons.flak;
        this.lastpos = this.pos;

        var x = Math.floor(this.pos.x / world.size) + 1;
        var y = Math.floor(this.pos.y / world.size) + 1;
        var npx = this.pos.x + this.dir.x * this.speed * 60 * DeltaTime;
        var npy = this.pos.y + this.dir.y * this.speed * 60 * DeltaTime;
        var nx = Math.floor(npx / world.size) + 1;
        var ny = Math.floor(npy / world.size) + 1;
        var hit = false;

        // handles weather a bullet hits || bounces off ball.;
        if (world.map[nx][y].solid) {
            if (bounce) {
                this.dir.x = -this.dir.x;
            } else {
                hit = true;
                this.gone = true;
            }
            this.impact = true;
            this.hit(vol);
        }
        if (world.map[x][ny].solid) {
            if (bounce) {
                this.dir.y = -this.dir.y;
            } else {
                hit = true;
                this.gone = true;
            }
            this.impact = true;
            this.hit(vol);
        }

        this.pos.add(this.dir * this.speed * 60 * DeltaTime);
        
        if (this.weapon == Weapons.rocketlauncher) {
            if (this.timer > .1) {
                this.timer = 0;
                table.insert(scene.animations, Animation("smoke", this.pos, false, .1, 1, .7));
            }
        }

        if (this.impact && this.weapon == Weapons.rocketlauncher) {
            var dist = this.pos.dist(this.owner.pos);
            if (dist < 150) {
                this.dealDmg(this.owner, (this.dmg - dist) / 2);
            }
            var dist = this.pos.dist(this.owner.target.pos);
            if (dist < 150) {
                this.dealDmg(this.owner.target, (this.dmg - dist) / 2);
            }
            table.insert(scene.animations, Animation("smoke", this.pos, false, .1, 3.3, .7));
            table.insert(scene.animations, Animation("explosion", this.pos, false, .1, 2, .7));
            table.insert(scene.animations, Animation("explosion", this.pos, false, .1, 2, .7));
            return;
        }

        // update distance travelled by bullet;
        this.distance = this.distance + this.pos.dist(this.lastpos);

        if (this.distance > this.range) {
            this.gone = true;
            return;
        }

        // if it can bleed, we can kill it;
        if (!this.owner.target.invincible && this.pos.dist(this.owner.target.pos) < 40) {
            if (this.weapon == Weapons.rocketlauncher) {
                var dist = this.pos.dist(this.owner.pos);
                if (dist < 150) {
                    this.dealDmg(this.owner, (this.dmg - dist) / 4);
                }
                table.insert(scene.animations, Animation("smoke", this.pos, false, .1, 3.3, .7));
                table.insert(scene.animations, Animation("explosion", this.pos, false, .1, 2, .7));
                table.insert(scene.animations, Animation("explosion", this.pos, false, .1, 2, .7));
            }
            this.dealDmg(this.owner.target, this.dmg, true);
            this.impact = true;
            this.gone = true;
            this.hit(vol);
            return;
        }
    }

    dealDmg(target, dmg, face) {
        // calculate possible shield absorb;
        var realDmg = 0;
        if (target.shield == 0) {
            realDmg = dmg;
        } else {
            target.shield = target.shield - dmg;
            if (target.shield > 0) {
                realDmg = dmg / 2;
            } else {
                realDmg = dmg + target.shield / 2;
                target.shield = 0;
            }
        }

        target.life = target.life - realDmg;
        target.showHit = true;

        target.isSnared = true;
        target.snareTimer = .5;
        target.updateSpeed();
        if (target.life > 0) {
            sound("A Hero's Quest.Hurt 1");
        }

        target.knockedBack = true;
        target.knockBackPow = target.knockBackPow + dmg / 5;
        if (face) {
            target.knockBackDir = target.side * (this.pos - target.pos).normalize();
        } else {
            target.knockBackDir = -target.side * (this.pos - target.pos).normalize();
        }
        table.insert(scene.animations, Animation("blood", target.pos, false, .1, 2, .7));
        if (target.life <= 0) {
            target.score.deaths = target.score.deaths + 1;
            if (target != this.owner) {
                this.owner.score.kills = this.owner.score.kills + 1;
            } else {
                this.owner.score.kills = this.owner.score.kills - 1;
            }
            table.insert(scene.animations, Animation("blood", target.pos, false, .1, 3, .7));
            table.insert(scene.animations, Animation("blood", target.pos, false, .1, 3, .7));
            table.insert(scene.animations, Animation("blood", target.pos, false, .1, 3, .7));
        };
    }

    draw(vec) {
        var pos = this.pos - vec;
        pushMatrix();
        translate(pos.x, pos.y);

        if (this.impact) {
            if (this.weapon == Weapons.blastgun) {
                tint(255, 255, 255, 255);
                sprite("assets/blast2", 0, 0, 128, 128);
            } else {
                tint(255, 240, 0, 255);
                sprite("assets/bullet", 0, 0, 128, 128);
            }
        } else {
            tint(255, 255, 255, 255);
            if (this.weapon == Weapons.blastgun) {
                sprite("assets/blast", 0, 0, 64, 64);
            } else {
                if (this.weapon == Weapons.rocketlauncher) {
                    sprite("assets/bullet", 0, 0, 96, 96);
                } else {
                    sprite("assets/bullet", 0, 0, 64, 64);
                }
            }
            popMatrix();
        }
    }
}