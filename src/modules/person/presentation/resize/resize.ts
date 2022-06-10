/**
 * @method calculateChangeWidthAndHeight 计算改变之后的宽高
 * @param {number} x 鼠标相对于容器的x轴位置
 * @param {number} y 鼠标相对于容器的y轴位置
 * @param {number} mX 需要修改内容相对于的x轴位置
 * @param {number} mY 需要修改内容相对于的y轴位置
 * @param {number} oW 需要修改内容宽度
 * @param {number} oH 需要修改内容高度
 * @param {string} type 移动类型
 */
const calculateChangeWidthAndHeight = (x: number, y: number, mX: number, mY: number, oW: number, oH: number, type: string) => {
    let nH = 0, nW = 0;

    if (type === 'top-center' || type === 'bottom-center') {
        nH = Math.abs(y - mY)
        if (nH != 0) {
            nH = Math.abs(nH - 12);
        }
    } else if (type === 'left-center' || type === 'right-center') {
        nW = Math.abs(Math.floor(x) - Math.floor(mX));
        if (nW != 0) {
            nW = Math.abs(nW - 12);
        }
    } else {
        nH = Math.abs(Math.floor(y) - Math.floor(mY));
        nW = Math.abs(Math.floor(x) - Math.floor(mX));
        if (nW != 0) {
            nW = Math.abs(nW - 12);
        }
        if (nH != 0) {
            nH = Math.abs(nH - 12);
        }
    }

    return { nH, nW }
}
/**
 * @method changeLocation 处理定位问题
 * @param {string} type 定位点类型 
 * @param {*} element dom，需要修改其定位，用来修改其大小 
 * @param {*} parentDom 外部容器dom
 * @param {*} position 用于记录位置的position
 */
const changeLocation = (type: string, element: any, parentDom: any, position: any) => {
    position.type = type;
    let { left, right, top, height } = parentDom.value.getBoundingClientRect();
    let { left: eLeft, right: eRight, top: eTop, height: eHeight, width: eWidth } = element.value.getBoundingClientRect()

    if (type === 'right-top' || type === 'top-center') {
        position.top = eTop + eHeight
        position.left = eLeft;
        element.value.style.top = 'unset'
        element.value.style.bottom = height - (eTop - top + eHeight) + 'px';
        element.value.style.right = 'unset'
        element.value.style.left = eLeft - left + 'px';
    }
    if (type === 'left-top') {
        position.top = eTop + eHeight
        position.left = eLeft + eWidth
        element.value.style.left = 'unset';
        element.value.style.right = right - eRight + 'px';
        element.value.style.top = 'unset';
        element.value.style.bottom = height - (eTop - top + eHeight) + 'px';
    }
    if (type === 'right-center') {
        position.left = eLeft;
        element.value.style.right = 'unset'
        element.value.style.left = (eLeft - left) + 'px';
    }
    if (type === 'left-center') {
        position.left = eLeft + eWidth;
        element.value.style.left = 'unset';
        element.value.style.right = right - eRight + 'px';
    }
    if (type === 'bottom-center') {
        position.top = eTop;
        element.value.style.bottom = 'unset';
        element.value.style.top = eTop - top + 'px';
    }

    if (type === 'right-bottom') {
        element.value.style.bottom = 'unset';
        element.value.style.right = 'unset';
        position.top = eTop;
        element.value.style.top = (eTop - top) + 'px';
        position.left = eLeft;
        element.value.style.left = (eLeft - left) + 'px';
    }
    if (type === 'left-bottom') {
        position.top = eTop;
        element.value.style.bottom = 'unset';
        element.value.style.left = 'unset';
        element.value.style.top = (eTop - top) + 'px';
        position.left = eLeft + eWidth;
        element.value.style.right = right - eRight + 'px';
    }


}

export {
    calculateChangeWidthAndHeight,
    changeLocation
}