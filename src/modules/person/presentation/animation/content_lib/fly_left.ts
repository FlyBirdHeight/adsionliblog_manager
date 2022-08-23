import AnimateAction from '../animation';
class FlyInLeft implements AnimateAction {
    duration: number;
    constructor(time: number = 1000) {
        this.duration = time;
    }
    //进入
    beforeEnter(el: any) {
        el!.style.opacity = 0;
        el!.style.transform = 'translate(-100%, 0)';
    }
    enter(el: any, done: any) {
        el!.style.transition = `all ${this.getTime()} linear`
        setTimeout(() => {
            el!.style.opacity = 1;
            el!.style.transform = 'translate(0,0)';
            done();
        }, this.duration)
    }
    afterEnter(el: any) {

    }
    //离开
    beforeLeave(el: any) {
        el!.style.transform = 'translate(0,0)';
        el!.style.opacity = 1;
    }
    leave(el: any, done: any) {
        el!.style.transform = 'translate(100%,0)';
        el!.style.opacity = 0;
        el!.style.transition = `all ${this.getTime()} linear`;
        setTimeout(() => {
            done();
            
        }, this.duration)
    }
    afterLeave(el: any) {

    }

    getTime() {
        return (this.duration / 1000) + 's'
    }

}

export default FlyInLeft;