import AnimateAction from '../animation';
class BackIn implements AnimateAction {
    duration: number;
    constructor(time: number = 1000) {
        this.duration = time;
    }
    //进入
    beforeEnter(el: any) {
        el!.style.opacity = 0;
        el!.style.scale = 0.5;
    }
    enter(el: any, done: any) {
        el!.style.transition = 'all 0.5s linear'
        setTimeout(() => {
            el!.style.opacity = 1;
            el!.style.scale = 1;
            done();
        }, this.duration)
    }
    afterEnter(el: any) {
        el!.style.opacity = 1;
        el!.style.scale = 1;
    }
    //离开
    beforeLeave(el: any) {
        el!.style.opacity = 1;
        el!.style.scale = 1;
    }
    leave(el: any, done: any) {
        el!.style.opacity = 0;
        el!.style.scale = 0.5;
        el!.style.transition = 'all 0.5s linear'
        setTimeout(() => {
            done();
        }, this.duration)
    }
    afterLeave(el: any) {
        el!.style.opacity = 0;
        el!.style.scale = 0.5;
    }
}


export default BackIn;