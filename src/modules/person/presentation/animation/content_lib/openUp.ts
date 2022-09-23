import AnimateAction from '../animation';
type OpenUpAttribute = {
    in: {
        attribute: 'left' | 'right',
        speed: number
    },
    out: {
        attribute: 'left' | 'right',
        speed: number
    }
}
class OpenUp implements AnimateAction {
    duration: number;
    attribute: OpenUpAttribute;
    constructor(time: number = 1000) {
        this.duration = time;
        this.attribute = {
            in: {
                attribute: 'left',
                speed: 1
            },
            out: {
                attribute: 'right',
                speed: 1
            }
        }
    }
    /**
     * @method setAttribute 设置动画属性
     * @param {string} mode 时机
     * @param {*} attribute 属性
     */
    setAttribute(mode: 'in' | 'out' = 'in', attribute: {
        attribute: 'left' | 'right',
        speed: number
    }) {
        this.attribute[mode] = attribute;
    }

    beforeEnter(el: any) {
        el!.style.transformOrigin = `top ${this.attribute.in.attribute || 'left'}`;
        el!.style.transform = this.attribute.in.attribute === 'right' ? 'rotate(-110deg)' : 'rotate(110deg)';
        el!.style.opacity = 0;
    }

    enter(el: any, done: any) {
        let timer: number = this.getTime(this.attribute.in.speed);
        el!.style.transition = `all ${timer / 1000}s ease-in-out`;
        setTimeout(() => {
            el!.style.opacity = 1;
            el!.style.transform = 'rotate(0deg)';
            done();
        }, timer)
    }

    afterEnter(el: any) {
        el!.style.transform = '';
    }

    beforeLeave(el: any) {
        el!.style.transformOrigin = `top ${this.attribute.out.attribute || 'right'}`;
        el!.style.transform = 'rotate(0deg)';
        el!.style.opacity = 1;
    }

    leave(el: any, done: any) {
        let timer: number = this.getTime(this.attribute.out.speed);
        el!.style.transition = `all ${timer / 1000}s ease-out`;
        el!.style.opacity = 0;
        el!.style.transform = this.attribute.out.attribute === 'right' ? 'rotate(-110deg)' : 'rotate(110deg)';
        setTimeout(() => {
            done();
        }, timer)
    }

    afterLeave(el: any) {
        el!.style.opacity = '';
        el!.style.transform = null;
        el!.style.transition = '';
        el!.style.transformOrigin = '';
    }

    getTime(speed: number): number {
        return Math.floor(this.duration / speed)
    }
}

export default OpenUp