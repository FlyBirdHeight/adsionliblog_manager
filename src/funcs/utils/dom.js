export const on = function (isServer) {
    if (!isServer && document.addEventListener) {
        return function (element, event, handle) {
            if (element && event) {
                element.addEventListener(event, handle, false)
            }
        }
    } else {
        return function (element, event, handle) {
            if (element && event) {
                element.attachEvent(`on${event}`, handle)
            }
        }
    }
}

export const off = function (isServer) {
    if (!isServer && document.addEventListener) {
        return function (element, event, handle) {
            if (element && event) {
                element.removeEventListener(event, handle, false)
            }
        }
    } else {
        return function (element, event, handle) {
            if (element && event) {
                element.detachEvent(`on${event}`, handle)
            }
        }
    }
}

/**
 * @method rafThrottle 通过使用window.requestAnimationFrame来实现节流和防抖的功效，主要用于鼠标滚轮事件的时候触发
 * @param {*} fn 事件方法，也就是需要加上的事件，放在raf中处理
 * @returns 事件处理方法
 */
export function rafThrottle(fn) {
    //locked在此处的作用就是在raf期间只被允许调用一次。
    let locked = false;
    //这里args的结构函数，实际就是触发事件之后回调的event对象
    return function (...args) {
        if (locked) return;
        locked = true;
        window.requestAnimationFrame(_ => {
            fn.apply(this, args);
            locked = false;
        });
    };
}