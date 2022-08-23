import AnimateAction from "../animation";

class Opacity implements AnimateAction {
    duration!: number;
    constructor(time: number) {
        this.duration = time;
    }

    //进入
    beforeEnter(el: any) {
        el!.style.opacity = 0;
    }
    enter(el: any, done: any) {
        el!.style.transition = 'all 1s linear'
        let time = this.duration;
        setTimeout(() => {
            el!.style.opacity = 1;
            done();
        }, time)
    }
    afterEnter(el: any) {
        el!.style.opacity = 1;
    }
    //离开
    beforeLeave(el: any) {
        el!.style.opacity = 1;
    }
    leave(this: any, el: any, done: any) {
        el!.style.opacity = 0;
        el!.style.transition = 'all 1s linear'
        let time = this.duration;
        setTimeout(() => {
            done();
        }, time)
    }
    afterLeave(el: any) {
        el!.style.opacity = 0;
    }
}

export default Opacity