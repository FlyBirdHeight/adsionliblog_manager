import AnimateAction from "../animation";

class Opacity implements AnimateAction {
    duration!: number;
    attribute: { in: { speed: number }, out: { speed: number } };
    constructor(time: number) {
        this.duration = time;
        this.attribute = { in: { speed: 1 }, out: { speed: 1 } }
    }
    /**
 * @method setAttribute 设置动画属性
 * @param {string} mode 时机
 * @param {*} attribute 属性
 */
    setAttribute(mode: 'in' | 'out' = 'in', attribute: {
        speed: number
    }) {
        this.attribute[mode] = attribute;
    }
    //进入
    beforeEnter(el: any) {
        el!.style.opacity = 0;
    }
    enter(el: any, done: any) {
        let timer: number = this.getTime(this.attribute.in.speed);
        el!.style.transition = `all ${timer / 1000}s linear`
        setTimeout(() => {
            el!.style.opacity = 1;
            done();
        }, timer)
    }
    afterEnter(el: any) {
        el!.style.opacity = 1;
    }
    //离开
    beforeLeave(el: any) {
        el!.style.opacity = 1;
    }
    leave(this: any, el: any, done: any) {
        let timer: number = this.getTime(this.attribute.in.speed);
        el!.style.opacity = 0;
        el!.style.transition = `all ${timer / 1000}s linear`
        setTimeout(() => {
            done();
        }, timer)
    }
    afterLeave(el: any) {
        el!.style.opacity = '';
        el!.style.transition = '';
    }

    getTime(speed: number): number {
        return Math.floor(this.duration / speed)
    }
}

export default Opacity