class World {

    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.maxW = w * 3;
        this.maxH = h * 3;
        this.currentScale = 3;
        this.size = WIDTH / w;

        // attempts to load last map;
        this.load();
    }

    // resizes tiles of zoom in/out using editor;
    resize(s) {
        if (s) {
            this.w = 4 * s;
            this.h = 3 * s;
            this.size = WIDTH / this.w;
        } else {
            this.w = 4 * this.currentScale;
            this.h = 3 * this.currentScale;
        }
        this.size = WIDTH / this.w;
    }

    load() {
        var slot = "assets/save_" + editor.saveSlot;
        var backup = readText(slot);
        this.timers = Array();

        this.p1flag = new vec2();
        this.p1spawn = new vec2();
        this.p2flag = new vec2();
        this.p2spawn = new vec2();

        this.x = 1;
        this.y = 1;

        if (backup) {
            this.map = JSON.parse(backup);
            this.maxW = this.map.length;
            this.maxH = this.map[1].length;
        } else {
            this.map = Array(this.maxW);
            for (var x = 0; x < this.maxW; x++) {
                this.map[x] = Array(this.maxH);
                for (var y = 0; y < this.maxH; y++) {
                    this.map[x][y] = new Tile();
                }
            }
        }



        this.maxW = this.map.length;
        this.maxH = this.map[1].length;


        // reads map info (flags, spawns, etc);
        var block;
        for (var x = 0; x < this.maxW; x++) {
            for (var y = 0; y < this.maxH; y++) {
                block = this.map[x][y];
                //      if (block.tex && !readImage(block.tex)) {
                //          block.tex = null;
                //       }
                //      if (block.decal) {
                //          block.decals = {block.decal}
                //       }

                if (block.pickup == "assets/p1_1_7") {
                    this.p1flag = new vec2(x, y)
                }
                if (block.pickup == "assets/p1_2_7") {
                    this.p2flag = new vec2(x, y)
                }
                if (block.pickup == "assets/p1_3_7") {
                    this.p1spawn = new vec2(x, y)
                }
                if (block.pickup == "assets/p1_4_7") {
                    this.p2spawn = new vec2(x, y)
                }


            }
        };
    }

    save() {
        var slot = "assets/save_" + editor.saveSlot;
        saveText(slot, JSON.stringify(this.map));
        editor.saved = true;
    }

    // process timers;
    processTimer(timer) {
        // respawn timer done, repop pickup;
        if (timer.type == "pickup") {
            this.map[timer.obj.pos.x][timer.obj.pos.y].pickup = timer.obj.item;
        }
    }

    addRespawnTimer(i, p) {
        table.insert(this.timers, Timer(15, "pickup", {
            item: i,
            pos: new vec2(p.x, p.y)
        }));
    }

    // update timers;
    update() {
        for (var timer of this.timers) {
            timer.update();
        }

        var timer = this.timers[1];
        if (timer && timer.done) {
            this.processTimer(timer);
            table.remove(this.timers, 1);
        }
    }

    drawEditor() {
        var ix = Math.floor(this.x);
        var fx = this.x - ix;
        var fx = fx * this.size;
        var iy = Math.floor(this.y);
        var fy = this.y - iy;
        var fy = fy * this.size;
        var px = 0;
        var py = 0;

        pushMatrix();

        translate(this.size / 2 - fx, this.size / 2 - fy);

        for (var x = ix; x < ix + this.w; x++) {
            for (var y = iy; y < iy + this.h; y++) {
                if (x <= this.maxW && y <= this.maxH && x >= 1 && y >= 1) {
                    var block = this.map[x][y];
                    if (block.tex) {
                        sprite(block.tex, px, py, this.size);
                    }
                    if (block.decals) {
                        for (var i = 0; i < block.decals.length; i++) {
                            sprite(block.decals[i], px, py, this.size);
                        }
                    }
                    if (block.portal) {
                        if (block.portal.dx) {
                            tint(block.portal.r, block.portal.g, block.portal.b, 140);
                        }
                        sprite("assets/portal", px, py, this.size);
                        tint(255);
                    }
                    if (block.pickup) {
                        sprite("assets/light", px, py, this.size);
                        sprite(block.pickup, px, py, this.size);
                    }
                    if (editor.showGrid) {
                        if (block.solid) {
                            fill(255, 0, 0, 30);
                        } else {
                            fill(0, 255, 0, 30);
                        }
                        rect(px - this.size / 2, py - this.size / 2, this.size, this.size);
                    }
                }
                py = py + this.size;
            }
            px = px + this.size;
            py = 0;
        }
        popMatrix();
    }

    draw(player) {
        var block = null;
        strokeWidth(1);

        var bigfastmorph = this.size - Math.abs(Math.sin(ElapsedTime * 5) * 20);
        var bigslowmorph = this.size - Math.abs(Math.sin(ElapsedTime * 2) * 20);
        var smallfastmorph = this.size - Math.abs(Math.sin(ElapsedTime * 5) * 10);
        var smallslowmorph = this.size - Math.abs(Math.sin(ElapsedTime * 2) * 10);

        var mx = player.pos.x / world.size + 1;
        var my = player.pos.y / world.size + 1;
        var ix = Math.floor(mx);
        var fx = mx - ix;
        var fx = fx * this.size;
        var iy = Math.floor(my);
        var fy = my - iy;
        var fy = fy * this.size;
        var px = 0;
        var py = 0;
        pushMatrix();
        var w = 3;
        if (scene.multi) {
            translate(WIDTH / 4 + world.size / 2 - fx, HEIGHT / 2 + world.size / 2 - fy);
        } else {
            w = 6;
            translate(WIDTH / 2 + world.size / 2 - fx, HEIGHT / 2 + world.size / 2 - fy);
        }

        if (player.side == 1) {
            px = -w * this.size;
        } else {
            px = -3 * this.size + WIDTH / 2;
        }
        py = -5 * this.size;


        for (var x = ix - w; x < ix + w; x++) {
            for (var y = iy - 5; y < iy + 5; y++) {
                if (x <= this.maxW && y <= this.maxH && x > 0 && y > 0) {
                    block = this.map[x][y];
                    // read && display tile content;
                    if (block.tex) {
                        sprite(block.tex, px, py, this.size);
                    }

                    if (block.decals) {
                        for (var i = 0; i < block.decals.length; i++) {
                            sprite(block.decals[i], px, py, this.size);
                        }
                    }

                    if (block.portal) {
                        tint(block.portal.r, block.portal.g, block.portal.b, 140);
                        pushMatrix();
                        translate(px, py);
                        rotate(ElapsedTime * 300);
                        sprite("assets/portal", 0, 0, bigslowmorph);
                        popMatrix();
                        tint(255);
                    }
                    if (block.pickup) {
                        sprite("assets/light", px, py, bigfastmorph);
                        sprite(block.pickup, px, py, smallslowmorph);
                    }
                }
                py = py + this.size;
            }
            px = px + this.size;
            py = -5 * this.size;
        }


        popMatrix();
    }
}