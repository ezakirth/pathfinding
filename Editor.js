class Editor {

    constructor() {
        this.buttons = Array();
        this.showMenu = false;
        this.showTiles = false;
        this.showPickups = false;
        this.showDecals = false;
        this.showGrid = false;
        this.saved = true;
        this.activeButton = "move";
        this.scrolling = true;
        this.editMode = true;
        this.tile = new Tile();

        this.saveSlot = 1;

        // setup buttons;
        table.insert(this.buttons, new Button("assets/load", 50 * (this.buttons.length + 1), HEIGHT - 50, "load"));
        table.insert(this.buttons, new Button("assets/save", 60 * (this.buttons.length + 1), HEIGHT - 50, "save"));
        table.insert(this.buttons, new Button("assets/move", 74 * (this.buttons.length + 1), HEIGHT - 50, "move"));
        this.tileButton = new Button("assets/tiles_1", 74 * (this.buttons.length + 1), HEIGHT - 50, "tile");
        table.insert(this.buttons, this.tileButton);
        this.decalButton = new Button("assets/decals", 74 * (this.buttons.length + 1), HEIGHT - 50, "decal");
        table.insert(this.buttons, this.decalButton);
        table.insert(this.buttons, new Button("assets/showgrid_on", 74 * (this.buttons.length + 1), HEIGHT - 50, "grid"));
        this.pickupButton = new Button("assets/pickups", 74 * (this.buttons.length + 1), HEIGHT - 50, "pickup");
        table.insert(this.buttons, this.pickupButton);
        table.insert(this.buttons, new Button("assets/portal", 74 * (this.buttons.length + 1), HEIGHT - 50, "portal"));
        this.playButton = new Button("assets/play", WIDTH - 50, HEIGHT - 50, "play");
        table.insert(this.buttons, this.playButton);

        // portal specific;
        this.portalA = {
            px : null,
            py : null,
            dx : null,
            dy : null
        }
        this.portalB = {
            px : null,
            py : null,
            dx : null,
            dy : null
        }
        this.nbPortals = 0;
    }

    // either adds an opening portal || a closing (and { links them together);
    // temporary until savePortal() is called;
    addPortal(x, y) {
        if (!this.portalA.px) {
            this.portalA.px = x;
            this.portalA.py = y;
            return this.portalA, false;
        } else {
            this.portalA.dx = x;
            this.portalA.dy = y;
            this.portalB.px = x;
            this.portalB.py = y;
            this.portalB.dx = this.portalA.px;
            this.portalB.dy = this.portalA.py;
            return this.portalB, true;
        }
    }

    // removes linked portals;
    removePortal(tile) {
        var px = tile.portal.px;
        var py = tile.portal.py;
        var dx = tile.portal.dx;
        var dy = tile.portal.dy;
        if (px) {
            world.map[px][py].portal = null;
        }
        if (dx) {
            world.map[dx][dy].portal = null;
        }
    }

    // actually adds the portals to the map;
    savePortal(portal, tile) {
        this.nbPortals = this.nbPortals + 1;
        if (this.nbPortals > Colors.length) {
            this.nbPortals = 1;
        }
        var px = portal.dx;
        var py = portal.dy;
        var dx = portal.px;
        var dy = portal.py;

        this.portalA = {
            px : null,
            py : null,
            dx : null,
            dy : null
        }
        this.portalB = {
            px : null,
            py : null,
            dx : null,
            dy : null
        }

        if (px == dx && py == dy) {
            this.removePortal(tile);
            return;
        }

        var source = world.map[px][py];

        var val = Colors[this.nbPortals];

        source.portal = {
            px : px,
            py : py,
            dx : dx,
            dy : dy,
            r : val.r,
            g : val.g,
            b : val.b
        }
        tile.portal = {
            px : dx,
            py : dy,
            dx : px,
            dy : py,
            r : val.r,
            g : val.g,
            b : val.b
        }

    }

    // draws environments tileset;
    drawTiles() {
        var txt = "";
        rectMode(CENTER);
        resetMatrix();

        textWrapWidth(96);
        textAlign(CENTER);
        if (this.tile.solid) {
            fill(255, 0, 0, 194);
            txt = "Tile will act as wall";
        } else {
            fill(0, 255, 38, 176);
            txt = "Tile can be walked on";
        }
        rect(128, HEIGHT / 2, 128, 128);
        stroke(127, 127, 127, 255);
        fill(0, 0, 0, 160);
        rect(WIDTH / 2, HEIGHT / 2, 518, 518);
        fill(255, 255, 255, 160);
        text(txt, 128, HEIGHT / 2);

        rectMode(CORNER);
        sprite("assets/tiles_1", WIDTH / 2, HEIGHT / 2, 512, 512);
    }

    // draws pickups tileset;
    drawPickups() {
        rectMode(CENTER);
        resetMatrix();

        stroke(127, 127, 127, 255);
        fill(0, 0, 0, 160);
        sprite("assets/erase", 128, HEIGHT / 2, 128, 128);

        rect(WIDTH / 2, HEIGHT / 2, 518, 518);
        rectMode(CORNER);
        sprite("assets/pickups", WIDTH / 2, HEIGHT / 2, 512, 512);
    }

    // draws decals tileset;
    drawDecals() {
        rectMode(CENTER);
        resetMatrix();

        stroke(127, 127, 127, 255);
        fill(127, 127, 127, 160);
        sprite("assets/erase", 128, HEIGHT / 2, 128, 128);

        rect(WIDTH / 2, HEIGHT / 2, 518, 518);
        rectMode(CORNER);
        sprite("assets/decals", WIDTH / 2, HEIGHT / 2, 512, 512);
    }

    // draws the Load menu;
    drawLoad() {
        rectMode(CENTER);
        resetMatrix();

        fill(0, 0, 0, 160);

        rect(WIDTH / 2, HEIGHT / 2, 512, 512);
        rectMode(CORNER);
        sprite("assets/loadmenu", WIDTH / 2, HEIGHT / 2, 512, 512);

        var L = WIDTH / 2 - 208;
        var W = 400;

        fill(255, 0, 0, 118);
        rectMode(CORNER);
        if (this.saveSlot == 1) {
            rect(L, HEIGHT / 2 + 143, 416, 65);
        }
        if (this.saveSlot == 2) {
            rect(L, HEIGHT / 2 + 55, 416, 65);
        }
        if (this.saveSlot == 3) {
            rect(L, HEIGHT / 2 - 32, 416, 65);
        }
        if (this.saveSlot == 4) {
            rect(L, HEIGHT / 2 - 121, 416, 65);
        }
        if (this.saveSlot == 5) {
            rect(L, HEIGHT / 2 - 209, 416, 65);
        }
    }

    // draws the Save menu;
    drawSave() {
        rectMode(CENTER);
        resetMatrix();

        fill(0, 0, 0, 160);

        rect(WIDTH / 2, HEIGHT / 2, 512, 512);
        rectMode(CORNER);
        sprite("assets/loadmenu", WIDTH / 2, HEIGHT / 2, 512, 512);

        var L = WIDTH / 2 - 208;
        var W = 400;

        fill(255, 0, 0, 118);
        rectMode(CORNER);
        if (this.saveSlot == 1) {
            rect(L, HEIGHT / 2 + 143, 416, 65);
        }
        if (this.saveSlot == 2) {
            rect(L, HEIGHT / 2 + 55, 416, 65);
        }
        if (this.saveSlot == 3) {
            rect(L, HEIGHT / 2 - 32, 416, 65);
        }
        if (this.saveSlot == 4) {
            rect(L, HEIGHT / 2 - 121, 416, 65);
        }
        if (this.saveSlot == 5) {
            rect(L, HEIGHT / 2 - 209, 416, 65);
        }
    }


    draw() {
        world.drawEditor();

        if (this.showMenu) {
            this.drawMenu();
        } else {
            if (this.showLoad) {
                this.drawLoad();
            } else {
                if (this.showSave) {
                    this.drawSave();
                } else {
                    if (this.showTiles) {
                        this.drawTiles();
                    } else {
                        if (this.showPickups) {
                            this.drawPickups();
                        } else {
                            if (this.showDecals) {
                                this.drawDecals();
                            }
                        }
                    }
                }
            }
        }


        this.tileButton.img = this.tile.tex || "assets/tiles_1";
        this.pickupButton.img = this.tile.pickup || "assets/pickups";
        this.playButton.img = "assets/play";

        for (var button of this.buttons) {
            button.draw();
        }

        if (this.tile.solid) {
            fill(255, 0, 0, 131);
        } else {
            fill(0, 255, 38, 83);
        }

        rect(this.tileButton.x, this.tileButton.y - 32, 32, 32);

    }


    // handles input of environment tile selection;
    touchTiles(touch) {
        if (touch.state == ENDED) {
            var nb = 8;
            var txt = "t1";

            var x = Math.floor((touch.x - WIDTH / 2 + 512 / 2) / 512 * nb) + 1;
            var y = Math.floor((touch.y - HEIGHT / 2 + 512 / 2) / 512 * nb) + 1;

            var tile = "assets/" + txt + "_" + x + "_" + y;
            if (readImage(tile)) {
                this.tile.tex = tile;
                this.showTiles = false;
            } else {
                if (touch.x > 64 && touch.x < 192 && touch.y > HEIGHT / 2 - 64 && touch.y < HEIGHT / 2 + 64) {
                    this.tile.solid = !this.tile.solid;
                } else {
                    this.showTiles = false;
                }
            }
        }
    }

    // handles input of pickup selection;
    touchPickups(touch) {
        if (touch.state == ENDED) {
            var nb = 8;
            var txt = "p1";

            var x = Math.floor((touch.x - WIDTH / 2 + 512 / 2) / 512 * nb) + 1;
            var y = Math.floor((touch.y - HEIGHT / 2 + 512 / 2) / 512 * nb) + 1;

            var tile = "assets/" + txt + "_" + x + "_" + y;
            if (readImage(tile)) {
                this.tile.pickup = tile;
            } else {
                if (touch.x > 64 && touch.x < 192 && touch.y > HEIGHT / 2 - 64 && touch.y < HEIGHT / 2 + 64) {
                    this.tile.pickup = "assets/erase";
                }
                this.showPickups = false;
            }
        }
    }

    // handles input of decals selection;
    touchDecals(touch) {
        if (touch.state == ENDED) {
            var nb = 8;
            var txt = "d1";

            var x = Math.floor((touch.x - WIDTH / 2 + 512 / 2) / 512 * nb) + 1;
            var y = Math.floor((touch.y - HEIGHT / 2 + 512 / 2) / 512 * nb) + 1;

            var tile = "assets/" + txt + "_" + x + "_" + y;
            if (readImage(tile)) {
                this.tile.decal = tile;
            } else {
                if (touch.x > 64 && touch.x < 192 && touch.y > HEIGHT / 2 - 64 && touch.y < HEIGHT / 2 + 64) {
                    this.tile.decal = "assets/erase";
                }
                this.showDecals = false;
            }
        }
    }

    // handles input of load menu;
    touchLoad(touch) {
        if (touch.x > WIDTH / 2 - 208 && touch.x < WIDTH / 2 + 208) {
            if (touch.x > HEIGHT / 2 - 209 && touch.x < HEIGHT / 2 + 143 + 65) {
                if (touch.y > HEIGHT / 2 + 143 && touch.y < HEIGHT / 2 + 143 + 65) {
                    this.saveSlot = 1;
                    world.load();
                } else {
                    if (touch.y > HEIGHT / 2 + 55 && touch.y < HEIGHT / 2 + 55 + 65) {
                        this.saveSlot = 2;
                        world.load();
                    } else {
                        if (touch.y > HEIGHT / 2 - 32 && touch.y < HEIGHT / 2 + 32) {
                            this.saveSlot = 3;
                            world.load();
                        } else {
                            if (touch.y > HEIGHT / 2 - 121 && touch.y < HEIGHT / 2 + (-121 + 65)) {
                                this.saveSlot = 4;
                                world.load();
                            } else {
                                if (touch.y > HEIGHT / 2 - 209 && touch.y < HEIGHT / 2 + (-209 + 65)) {
                                    this.saveSlot = 5;
                                    world.load();
                                }
                            };
                        }
                        this.showLoad = false;
                    }
                }
            }
        }
    }

    // handles input of save menu;
    touchSave(touch) {
        if (touch.x > WIDTH / 2 - 208 && touch.x < WIDTH / 2 + 208) {
            if (touch.x > HEIGHT / 2 - 209 && touch.x < HEIGHT / 2 + 143 + 65) {
                if (touch.y > HEIGHT / 2 + 143 && touch.y < HEIGHT / 2 + 143 + 65) {
                    this.saveSlot = 1;
                    world.save();
                } else {
                    if (touch.y > HEIGHT / 2 + 55 && touch.y < HEIGHT / 2 + 55 + 65) {
                        this.saveSlot = 2;
                        world.save();
                    } else {
                        if (touch.y > HEIGHT / 2 - 32 && touch.y < HEIGHT / 2 + 32) {
                            this.saveSlot = 3;
                            world.save();
                        } else {
                            if (touch.y > HEIGHT / 2 - 121 && touch.y < HEIGHT / 2 + (-121 + 65)) {
                                this.saveSlot = 4;
                                world.save();
                            } else {
                                if (touch.y > HEIGHT / 2 - 209 && touch.y < HEIGHT / 2 + (-209 + 65)) {
                                    this.saveSlot = 5;
                                    world.save();
                                }
                            };
                        }
                        this.showSave = false;
                    }
                }
            }
        }
    }

    scroll(touch) {
        // regular scrolling if using single finger;
        if (nbTouches == 1) {
            if (touch.state == BEGAN) {
                origin.x = touch.x;
                origin.y = touch.y;

                if (touch.tapCount == 2) {
                    world.resize();
                }

            }
            if (touch.state == MOVING) {
                world.x = world.x + (origin.x - touch.x) / world.size;
                world.y = world.y + (origin.y - touch.y) / world.size;
                origin.x = touch.x;
                origin.y = touch.y;

                world.x = Math.max(1, Math.min(world.x, world.maxW));
                world.y = Math.max(1, Math.min(world.y, world.maxH));
            }
            // zoom in/out if using two finger gesture;
        }
        if (nbTouches == 2) {
            var newPt = {}
            var lastPt = {}
            var ins = table.insert;
            for (var p of touches) {
                var px = p.x;
                var py = p.y;
                ins(newPt, new vec2(px, py));
                if (touch.state == BEGAN) {
                    ins(lastPt, new vec2(px, py));
                } else {
                    ins(lastPt, new vec2(px - p.deltaX, py - p.deltaY));
                }
            }
            var delta = lastPt[1].dist(lastPt[2]) - newPt[1].dist(newPt[2]);
            world.currentScale = world.currentScale + delta / 200;
            world.currentScale = Math.max(Math.min(9, world.currentScale), 3);
            world.resize();
        }

    }

    paint(touch) {
        // converts touch to map coordinates;
        var ix = Math.floor(world.x);
        var fx = world.x - ix;
        var iy = Math.floor(world.y);
        var fy = world.y - iy;
        var x = Math.floor(touch.x / world.size + fx);
        var y = Math.floor(touch.y / world.size + fy);

        if (x <= world.maxW && y <= world.maxH) {
            var tile = world.map[x + ix][y + iy];
            var change = false;

            // tile painting;
            if (!this.tile.pickup && this.activeButton != "portal") {
                if (tile.tex != this.tile.tex || tile.solid != this.tile.solid) {
                    change = true;
                }
                tile.tex = this.tile.tex || tile.tex;
                tile.solid = this.tile.solid;
            }


            if (touch.state == ENDED) {
                // add portals;
                if (this.activeButton == "portal") {
                    if (tile.portal) {
                        this.removePortal(tile);
                    }

                    tile.pickup = null;
                    tile.solid = false;
                    var portal, done = this.addPortal(x + ix, y + iy);
                    tile.portal = portal;
                    if (done) {
                        this.savePortal(portal, tile);
                    }
                    this.activeButton = "move";
                    this.scrolling = true;
                    change = true;
                }

                // add pickups;
                if (this.tile.pickup) {
                    if (tile.portal) {
                        this.removePortal(tile);
                    }
                    if (this.tile.pickup == "assets/erase") {
                        tile.pickup = null;
                    } else {
                        tile.solid = false;
                        tile.pickup = this.tile.pickup;
                    }
                    if (tile.pickup == "assets/p1_1_7") {
                        world.p1flag = new vec2(x + ix, y + iy);
                    }
                    if (tile.pickup == "assets/p1_2_7") {
                        world.p2flag = new vec2(x + ix, y + iy);
                    }
                    if (tile.pickup == "assets/p1_3_7") {
                        world.p1spawn = new vec2(x + ix, y + iy);
                    }
                    if (tile.pickup == "assets/p1_4_7") {
                        world.p2spawn = new vec2(x + ix, y + iy);
                    }

                    change = true;
                }

                // add decals;
                if (this.tile.decal) {
                    if (this.tile.decal == "assets/erase") {
                        tile.decals = null;
                    } else {
                        tile.solid = false;
                        if (!tile.decals) {
                            tile.decals = {}
                        }
                        table.insert(tile.decals, this.tile.decal);
                    }
                    change = true;
                }

            }

            this.saved = false;

        }
    }

    touched(touch) {
        if (this.showMenu) {
            this.touchMenu(touch);
        } else {
            if (this.showLoad) {
                this.touchLoad(touch);
            } else {
                if (this.showSave) {
                    this.touchSave(touch);
                } else {
                    if (this.showTiles) {
                        this.touchTiles(touch);
                    } else {
                        if (this.showPickups) {
                            this.touchPickups(touch);
                        } else {
                            if (this.showDecals) {
                                this.touchDecals(touch);
                            } else {
                                if (touch.y < HEIGHT - 110) {
                                    if (this.scrolling) {
                                        this.scroll(touch);
                                    } else {
                                        this.paint(touch);
                                    }
                                } else {
                                    if (touch.state == ENDED) {
                                        for (var button of this.buttons) {
                                            button.touched(touch);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}