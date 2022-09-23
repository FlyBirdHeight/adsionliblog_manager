import AnimateAction from '../animation';
type ScaleAttribute = {
    in: {
        attribute: 'blur' | 'normal',
        speed: number
    },
    out: {
        attribute: 'blur' | 'normal',
        speed: number
    }
}
class Scale implements AnimateAction {
    duration: number;
    attribute: ScaleAttribute
    constructor(time: number) {
        this.duration = time;
        this.attribute = {
            in: {
                attribute: 'normal',
                speed: 1
            },
            out: {
                attribute: 'normal',
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
        attribute: 'normal' | 'blur',
        speed: number
    }) {
        this.attribute[mode] = attribute;
    }

    beforeEnter(el: any) {
        Object.assign(el.style, {
            opacity: 0,
            transformOrigin: '50% 50%',
            transform: 'scale(2, 2)',
            filter: `blur(${this.attribute.in.attribute === 'blur' ? '90px' : '20px'})`
        })
    }

    enter(el: any, done: any) {
        let timer = this.getTime(this.attribute.in.speed);
        el!.style.transition = `all ${timer / 1000}s linear`;
        setTimeout(() => {
            Object.assign(el.style, {
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'scale(1, 1)'
            })
            done();
        }, timer)
    }

    afterEnter(el: any) {

    }

    beforeLeave(el: any) {
        Object.assign(el.style, {
            opacity: 1,
            transformOrigin: '50% 50%',
            transform: 'scale(1, 1)',
            filter: `blur(0px)`
        })
    }

    leave(el: any, done: any) {
        let timer = this.getTime(this.attribute.in.speed);
        el!.style.transition = `all ${timer / 1000}s linear`;
        Object.assign(el.style, {
            opacity: 0,
            filter: `blur(${this.attribute.in.attribute === 'blur' ? '90px' : '20px'})`,
            transform: 'scale(2, 2)'
        })
        setTimeout(() => {
            done();
        }, timer)
    }

    afterLeave(el: any) {
        Object.assign(el.style, {
            opacity: '',
            filter: '',
            transform: '',
            transition: ''
        })
    }

    getTime(speed: number): number {
        return Math.floor(this.duration / speed)
    }
}

export default Scale