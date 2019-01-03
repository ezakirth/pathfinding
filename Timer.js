class Timer {

    constructor(duration, type, obj) {
        this.type = type;
        this.obj = obj;
        this.done = false;

        this.start = os.clock();
        this.max = this.start + duration;
    }

    update() {
        this.start = this.start + DeltaTime;

        if (this.start > this.max) {
            this.done = true;
        }
    }
}