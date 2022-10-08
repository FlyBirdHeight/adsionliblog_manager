class Action {
    duration: number;
    constructor(time: number = 1000) {
        this.duration = time;
    }

    getTime(speed: number): number {
        return Math.floor(this.duration / speed);
    }
}

export default Action;