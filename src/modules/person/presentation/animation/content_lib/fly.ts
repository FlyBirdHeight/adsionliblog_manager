import AnimateAction from '../animation';
type FlyAttribute = {
    in: {
        attribute: string,
        speed: number
    },
    out: {
        attribute: string,
        speed: number
    }
}
class Fly implements AnimateAction {
    duration: number;
    attribute: FlyAttribute;
    constructor(time: number = 1000) {
        this.duration = time;
        this.attribute = { in: { attribute: 'left', speed: 1 }, out: { attribute: 'left', speed: 1 } }
    }
    /**
     * @method setAttribute 设置动画属性
     * @param {string} mode 时机
     * @param {*} attribute 属性
     */
    setAttribute(mode: 'in' | 'out' = 'in', attribute: {
        attribute: string,
        speed: number
    }) {
        this.attribute[mode] = attribute;
    }
    //进入
    beforeEnter(el: any) {
        let position = this.attribute.in.attribute;
        console.log(this.getPositionStyler(position), position);
        el!.style.opacity = 0;
        el!.style.transform = this.getPositionStyler(position);
    }
    enter(el: any, done: any) {
        let timer: number = this.getTime(this.attribute.in.speed);
        el!.style.transition = `all ${timer}s linear`
        setTimeout(() => {
            el!.style.opacity = 1;
            el!.style.transform = 'translate(0,0)';
            done();
        }, timer * 1000)
    }
    afterEnter(el: any) {

    }
    //离开
    beforeLeave(el: any) {
        el!.style.transform = 'translate(0,0)';
        el!.style.opacity = 1;
    }
    leave(el: any, done: any) {
        let timer: number = this.getTime(this.attribute.out.speed);
        let position = this.attribute.out.attribute;
        el!.style.transform = this.getPositionStyler(position);
        el!.style.opacity = 0;
        el!.style.transition = `all ${timer}s linear`;
        setTimeout(() => {
            done();
        }, timer * 1000)
    }
    afterLeave(el: any) {

    }

    getTime(speed: number): number {
        return Number(((this.duration / speed) / 1000).toFixed(2))
    }

    getPositionStyler(position: string) {
        let styler = '';
        switch (position) {
            case 'left':
                styler = 'translate(-100%, 0)'
                break;
            case 'right':
                styler = 'translate(100%, 0)'
                break;
            case 'bottom':
                styler = 'translate(0, -100%)'
                break;
            case 'top':
                styler = 'translate(0, 100%)'
                break;
        }

        return styler;
    }
}

export default Fly;