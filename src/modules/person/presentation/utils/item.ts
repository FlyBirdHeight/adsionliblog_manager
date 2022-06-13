const handleSetting = (dom: any, data: any, type: string) => {
    switch (type) {
        case 'background':
            handleBackground(dom, data, type)
            break;
        case 'backgroundEdit':
            handleBackground(dom, data, type)
            break;
        case 'removeBackgroundImage':
            handleBackground(dom, data, type)
            break
        default:
            break;
    }
}
/**
 * @method handleBackground 处理Page页面的背景内容
 * @param {*} dom dom标签数据
 * @param data 数据
 * @param {string} type 类型
 */
const handleBackground = (dom: any, data: any, type: string) => {
    if (type === 'background') {
        if (data.defaultSetting) {
            dom.style.backgroundImage = `url(${data.val})`;
            setBackgroundConfig(dom, data.defaultSetting);
        } else {
            dom.style.backgroundColor = data.val;
        }
        return;
    }
    if (type === 'removeBackgroundImage') {
        dom.style.backgroundColor = data.val;
        clearBackgroundImage(dom);
        return;
    }
    setBackgroundConfig(dom, data);
}
const setBackgroundConfig = (dom: any, data: any) => {
    dom.style.backgroundSize = `${data.xSize}% ${data.ySize}%`;
    dom.style.backgroundRepeat = `${data.bgRepeat}`;
    dom.style.backgroundPosition = `${data.xPosition}% ${data.yPosition}%`
}
const clearBackgroundImage = (dom: any) => {
    dom.style.backgroundSize = null;
    dom.style.backgroundRepeat = null;
    dom.style.backgroundPosition = null;
    dom.style.backgroundImage = null;
}

export {
    handleSetting
}