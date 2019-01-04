class Button {

    constructor(img, x, y, type) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 64;
    }

    draw() {
        var bg = "";
        if (editor.activeButton == this.type) {
            bg = "assets/buttonbg_on";
        } else {
            bg = "assets/buttonbg_off";
        }
        if (this.type != "play" && this.type != "save" && this.type != "load") {
            sprite(bg, this.x, this.y, 71, 71);
            sprite(this.img, this.x, this.y, this.size - 10, this.size - 10);
            sprite("assets/overlay", this.x, this.y, 71, 71);
        } else {
            sprite(this.img, this.x, this.y, this.size, this.size);
            if (this.type == "save" && !editor.saved) {
                fontSize(48);
                fill(255, 0, 0, 255);
                text("!!!", this.x, this.y);
            }
        }

    }

    touched(touch) {
        var h = this.size / 2;
        if (touch.x > this.x - h && touch.x < this.x + h && touch.y > this.y - h && touch.y < this.y + h) {
            if (this.type != "grid") {
                editor.activeButton = this.type;
                editor.scrolling = false;
            }

            if (this.type == "tile") {
                editor.showTiles = true;
                editor.tile.pickup = null;
                editor.tile.decal = null;
            }

            if (this.type == "decal") {
                editor.showDecals = true;
                editor.showPickups = null;
                editor.tile.tex = null;
            }

            if (this.type == "pickup") {
                editor.showPickups = true;
                editor.tile.tex = null;
                editor.tile.decal = null;
            }

            if (this.type == "portal") {
                editor.tile.tex = null;
                editor.tile.pickup = null;
                editor.tile.decal = null;
            }

            if (this.type == "play") {
                editor.editMode = !editor.editMode;
                world.resize(3);
                if (editor.editMode) {
                    music.stop();
                    editor.activeButton = "move";
                    editor.scrolling = true;
                } else {
                    music("A Hero's Quest.Battle", true, .3);
                    if (!scene) {
                        scene = Scene();
                    } else {
                        scene.reset();
                    }
                }
            }

            if (this.type == "grid") {
                editor.showGrid = !editor.showGrid;
                if (this.img == "assets/showgrid_on") {
                    this.img = "assets/showgrid_off";
                } else {
                    this.img = "assets/showgrid_on";
                }
            }

            if (this.type == "move") {
                editor.scrolling = true;
            }

            if (this.type == "load") {
                editor.showLoad = true;
                editor.activeButton = "move";
                editor.scrolling = true;
            }

            if (this.type == "save") {
                editor.showSave = true;
                editor.activeButton = "move";
                editor.scrolling = true;
            }
        }
    }
}