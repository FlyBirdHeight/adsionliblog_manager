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
/**
 * @method setPageMap 设置当前页保存数据
 * @param data 
 * @param {string} type 类型
 * @param val 
 */
const setPageMap = (data: any, type: string, val: any) => {
    if (type === 'removeBackgroundImage') {
        data.setting.background.data = val.val;
        data.setting.background.type = 'color';
        data.setting.background.config = null;
        return;
    }
    if (type === 'background') {
        if (val.defaultSetting) {
            data.setting.background.type = 'image';
            data.setting.background.config = val.defaultSetting;
        } else {
            data.setting.background.type = 'color';
        }
        data.setting.background.data = val.val;
    } else {
        data.setting.background.config = val;
    }
}
const countChange: string[] = ['addImage', 'addTextArea']
/**
 * @method handleToolAction 处理toolbar点击按钮事件
 */
const handleToolAction = async (pageMap: any, handleObj: any, action: string, options: any, activeIndex: any) => {
    let count = pageMap.item.count;
    let activeItem, itemType;
    const editAction: boolean = countChange.findIndex(v => v == action) != -1
    if (editAction) {
        pageMap.item.count += 1
    }
    if (action === 'addTextArea') {
        const text = handleObj.addTextArea()
        handleObj.addItem(text.index, 'text', text)
        activeItem = text.index;
        itemType = { index: activeItem, type: 'text' };
    }
    if (action === 'addImage') {
        const image = await handleObj.addImage(options!.url)
        handleObj.addItem(image.index, 'image', image)
        activeItem = image.index;
        itemType = { index: activeItem, type: 'image' };
    }
    if (editAction) {
        activeIndex.value = activeItem;
        return {
            itemType
        }
    }
}
export {
    handleSetting,
    setPageMap,
    handleToolAction
}