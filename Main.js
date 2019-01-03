// Fight;
supportedOrientations(LANDSCAPE_ANY);
displayMode(FULLSCREEN);

var showEditor, screen, scene, editor, world, origin, time, fps, cnt, lastFps, touches, nbTouches;
function setup() {
    showEditor = false;

    screen = "editor";

    noSmooth();
    fill(255);
    font("Copperplate-Bold");
    scene = null;

    editor = new Editor();
    world = new World(12, 9);
    origin = {}
    time = 0, fps = 0, cnt = 0, lastFps = 0;

    //    editor.editMode = false;
    strokeWidth(2);
    stroke(0, 0, 0, 255);


    assetList("Dropbox", TEXT);

    touches = {}
    nbTouches = 0;

    if (!showEditor) {
        scene = new Scene();
        music("A Hero's Quest.Battle", true, .3);
    }

    draw();
}


function draw() {
    background(240, 240, 240, 255);
    sprite("images/bg", WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT);

    if (showEditor && editor.editMode) {
        editor.draw();
    } else {
        scene.update();

        scene.draw();

        // cleanup obselete objects;
        if (scene.bulletIndex) {
            table.remove(scene.bullets, scene.bulletIndex);
        }
        if (scene.animIndex) {
            table.remove(scene.animations, scene.animIndex);
        }

        if (showEditor) {
            editor.playButton.img = "images/edit";
            editor.playButton.draw();
        }

        scene.p1.drawGUI();
        scene.p2.drawGUI();

    }

    fontSize(17);
    fill(255);
    time = time + DeltaTime;
    cnt = cnt + 1;
    fps = fps + 1 / DeltaTime;
    if (time > .5) {
        lastFps = Math.floor(10 * fps / cnt) / 10;
        time = 0;
        cnt = 0;
        fps = 0;

    }
    text(lastFps, WIDTH - 20, 10);
    //     collectgarbage();

    window.requestAnimationFrame(draw);
}


function touched(touch) {
    // allows multitouch;
    if (touch.state == ENDED) {
        touches[touch.id] = null;
        nbTouches = nbTouches - 1;
    } else {
        if (touch.state == BEGAN) {
            nbTouches = nbTouches + 1;
        }
        touches[touch.id] = touch;
    }


    if (showEditor && editor.editMode) {
        editor.touched(touch);
    } else {
        if (showEditor && touch.state == ENDED) {
            editor.playButton.touched(touch);
        }
        scene.touched(touch);
    }
}