const clearBackgroundImage = (dom: any) => {
    dom.style.backgroundSize = null;
    dom.style.backgroundRepeat = null;
    dom.style.backgroundPosition = null;
    dom.style.backgroundImage = null;
}

const analysisBackground = (data: any, dom: any) => {
    if (!data.config) {
        if (data.type != '') {
            dom.style.backgroundColor = data.data;
        } else {
            clearBackgroundImage(dom)
        }
    } else {
        dom.style.backgroundImage = `url(${data.data})`;
        dom.style.backgroundSize = `${data.config.xSize}% ${data.config.ySize}%`;
        dom.style.backgroundRepeat = `${data.config.bgRepeat}`;
        dom.style.backgroundPosition = `${data.config.xPosition}% ${data.config.yPosition}%`
    }
}



/**
 * @method setPageMap 设置当前页保存数据
 * @param handleObj 
 * @param {string} type 类型
 * @param val 
 */
const setPageMap = (handleObj: any, type: string, val: any, pageMap: any) => {
    let updateData = {
        data: '',
        type: '',
        config: null
    }
    if (type === 'removeBackgroundImage') {
        handleObj.updateBody(updateData);
        return;
    }
    if (type === 'background') {
        if (val.defaultSetting) {
            updateData.type = 'image';
            updateData.config = val.defaultSetting;
        } else {
            updateData.type = 'color';
        }
        updateData.data = val.val;
        handleObj.updateBody(updateData);
    } else {
        updateData.config = val;
        updateData.data = pageMap.setting.background.data;
        updateData.type = 'image'
        handleObj.updateBody(updateData);
    }
}
/**
 * @method setPage 设置page页面，主要在添加，删除页面，跳转页面使用
 * @param pageInfo 响应式数据pageInfo
 * @param pageMap 响应式数据pageMap
 * @param handleObj 响应式数据handleObj
 */
const setPage = (pageInfo: any, handleObj: any) => {
    pageInfo.pageCount = handleObj.pageList.size;
    pageInfo.currentPage = handleObj.currentPage;
}


const countChange: string[] = ['addImage', 'addTextArea']
/**
 * @method handleToolAction 处理toolbar点击按钮事件
 */
const handleToolAction = async (handleObj: any, action: string, options: any, activeIndex: any, pageInfo: any) => {
    let activeItem, itemType;
    const editAction: boolean = countChange.findIndex(v => v == action) != -1
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
    if (action === 'revokeAction') {
        handleObj.revokeAction();
    } else if (action === 'recoveryAction') {
        handleObj.recoveryAction();
    }

    if (action === 'addPage') {
        handleObj.addPage();
        setPage(pageInfo, handleObj)
    } else if (action === 'deletePage') {
        handleObj.deletePage(handleObj.currentPage);
        setPage(pageInfo, handleObj)
    } else if (action === 'goFirst') {
        if (handleObj.pageList.size == 1) {
            return
        }
        handleObj.goFirst();
        setPage(pageInfo, handleObj)
    } else if (action === 'goEnd') {
        if (handleObj.pageList.size == 1) {
            return
        }
        handleObj.goEnd();
        setPage(pageInfo, handleObj)
    } else if (action === 'goPre') {
        if (handleObj.pageList.size == 1) {
            return
        }
        handleObj.goPre();
        setPage(pageInfo, handleObj)
    } else if (action === 'goNext') {
        if (handleObj.pageList.size == 1) {
            return
        }
        handleObj.goNext();
        setPage(pageInfo, handleObj)
    }


    if (editAction) {
        activeIndex.value = activeItem;
        handleObj.itemTypeIndexList.push(itemType)
    }
}

export {
    setPageMap,
    handleToolAction,
    analysisBackground,
    setPage
}