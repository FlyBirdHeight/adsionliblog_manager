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
    if (type === 'right-top') {
        nH = Math.abs(y - mY)
        if (x > mX) {
            nW = x - mX;
        } else {
            nW = mX - x;
        }
        nW = Math.abs(nW - 12);
    }
    if (type === 'top-center') {
        nH = Math.abs(y - mY)
    }
    if (type === 'bottom-center') {
        nH = Math.abs(y - mY)
    }
    if (type === 'left-top') {
        console.log(x, mX);
        nH = Math.abs(Math.floor(y) - Math.floor(mY));
        nW = Math.abs(Math.floor(x) - Math.floor(mX));
        if (nW != 0) {
            nW = Math.abs(nW - 12);
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
    if (type === 'right-top' || type === 'top-center') {
        position.top = parentDom.value.clientHeight - parentDom.value.clientHeight * 0.3 - 30
        position.left = parentDom.value.clientWidth * 0.3 + 260;
        element.value.style.top = 'unset'
        element.value.style.bottom = 'calc(70% - 112px)'
        element.value.style.right = 'unset'
        element.value.style.left = '30%'
    }
    if (type === 'right-center') {
        position.left = parentDom.value.clientWidth * 0.3;
        element.value.style.left = position.left + 'px';
    }
    if (type === 'right-bottom') {
        position.top = parentDom.value.clientHeight * 0.3;
        element.value.style.top = position.top + 'px';
        position.left = parentDom.value.clientWidth * 0.3;
        element.value.style.left = position.left + 'px';
    }
    if (type === 'left-top') {
        position.top = parentDom.value.clientHeight - parentDom.value.clientHeight * 0.3 - 30
        position.left = parentDom.value.clientWidth * 0.3 + 212 + 260;
        console.log(position, parentDom.value.clientWidth * 0.3, parentDom);

        element.value.style.left = 'unset';
        element.value.style.right = "calc(70% - 212px)";
        element.value.style.top = 'unset';
        element.value.style.bottom = 'calc(70% - 112px)';
    }
    if (type === 'bottom-center') {
        position.top = parentDom.value.clientHeight * 0.3 + parentDom.value.offsetTop;
        element.value.style.bottom = 'unset';
        element.value.style.top = '30%';
    }
}

export {
    calculateChangeWidthAndHeight,
    changeLocation
}