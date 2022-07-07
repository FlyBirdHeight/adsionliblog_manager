const methodMap = [
    [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror',
    ],
    // New WebKit
    [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror',

    ],
    // Old WebKit
    [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror',

    ],
    [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror',
    ],
    [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError',
    ],
];
/**
 * NOTE: 首先根据Document对象的区别，区分应该调用哪一个全屏模式的API
 */
const nativeAPI = (() => {
    if (typeof document === 'undefined') {
        return false;
    }

    const unprefixedMethods = methodMap[0];
    const returnValue: any = {};

    for (const methodList of methodMap) {
        const exitFullscreenMethod = methodList?.[1];
        if (exitFullscreenMethod in document) {
            for (const [index, method] of methodList.entries()) {
                returnValue[unprefixedMethods[index]] = method;
            }

            return returnValue;
        }
    }

    return false;
})();

const eventNameMap: any = {
    change: nativeAPI.fullscreenchange,
    error: nativeAPI.fullscreenerror,
};

class FullScreen {
    dom: any;
    constructor() {
        this.dom = null;
    }
    /**
     * @method startup 开启全屏模式
     * @param dom 
     * @param options 
     */
    startup(dom: any, options: any) {
        return new Promise((resolve: any, reject: any) => {
            if (!document.fullscreenEnabled) {
                return false;
            }
            this.dom = dom;
            const enterFullScreen = () => {
                dom.style.flexDirection = 'row';
                dom.style.justifyContent = 'center';
                this.off('change', enterFullScreen);
                resolve();
            }
            //NOTE: 添加在开启fullscreen模式时的事件监听
            this.on('change', enterFullScreen);
            //NOTE: 调用对应平台的fullscreen的api，获取返回的promise对象
            const createPromise: any = dom[nativeAPI.requestFullscreen]();

            if (createPromise instanceof Promise) {
                createPromise.then(enterFullScreen).catch(reject);
            }
        })
    }
    /**
     * @method exit 退出全屏模式时调用
     */
    exit() {
        return new Promise((resolve: any, reject: any) => {
            if (!this.isFullscreen) {
                resolve();
                return;
            }
            const exitFullScreen = () => {
                
                this.off('change', exitFullScreen);
                resolve();
            }

            this.on('change', exitFullScreen);
            const exitPromise: any = Reflect.get(document, nativeAPI.exitFullscreen)();

            if (exitPromise instanceof Promise) {
                exitPromise.then(exitFullScreen).catch(reject);
            }
        })
    }
    /**
     * @method onchange 自定义在开启与关闭时触发的change事件
     * @param callback 
     */
    onchange(callback: any) {
        this.on('change', callback);
    }
    /**
     * @method onerror 自定义在开启与关闭时触发的error事件
     * @param callback 
     */
    onerror(callback: any) {
        this.on('error', callback);
    }
    on(event: string, callback: any) {
        const eventName = eventNameMap[event];
        if (eventName) {
            document.addEventListener(eventName, callback, false);
        }
    }
    off(event: string, callback: any) {
        const eventName = eventNameMap[event];
        if (eventName) {
            document.removeEventListener(eventName, callback, false);
        }
    }
    /**
     * @property {boolean} isFullscreen 是否是全屏状态
     * @property {Element} element 获取当前全屏状态的element对象
     * @property {boolean} isEnabled 是否允许全屏模式
     */
    get isFullscreen() {
        return Boolean(Reflect.get(document, nativeAPI.fullscreenElement))
    }
    get element() {
        return Reflect.get(document, nativeAPI.fullscreenElement) ?? undefined
    }
    get isEnabled() {
        return Reflect.get(document, nativeAPI.fullscreenEnabled)
    }
}

export default FullScreen;