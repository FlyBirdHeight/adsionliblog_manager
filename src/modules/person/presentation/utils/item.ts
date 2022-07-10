import { localImage } from './utils';

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
 * @method handleLayerAction 处理层级相关的内容
 * @param action 
 * @param options 
 * @param handleObj 
 */
const handleLayerAction = function (action: string, options: any, handleObj: any) {
    let layer = handleObj.layerSetting[action](
        options.itemInfo,
        handleObj.getItemLayer(options.itemInfo.type, options.itemInfo.index)
    )

    handleObj.updateItem(options.itemInfo.index, options.itemInfo.type, {
        layer
    })
}
const handleChangePage = function (action: string, pageInfo: any, handleObj: any) {
    if (handleObj.pageList.size == 1) {
        return
    }
    handleObj[action]();
    setPage(pageInfo, handleObj)
}
/**
 * @method setPageMap 设置当前页保存数据
 * @param handleObj 
 * @param {string} type 类型
 * @param val 
 */
const setPageMap = async (handleObj: any, type: string, val: any, pageMap: any) => {
    let updateData = {
        data: '',
        type: '',
        config: null,
        image: {
            url: "",
            localUrl: ""
        }
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
        let localUrl: any = await localImage(val.val);
        updateData.data = localUrl || val.val;
        updateData.image = { url: val.val, localUrl };
        handleObj.updateBody(updateData);
    } else {
        updateData.config = val;
        updateData.data = pageMap.setting.background.data;
        updateData.image = { url: pageMap.setting.background.image.url, localUrl: pageMap.setting.background.image.localUrl }
        updateData.type = 'image'
        handleObj.updateBody(updateData);
    }
    console.log(updateData);

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
    const editAction: boolean = countChange.includes(action);
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
    }

    if (['goFirst', 'goEnd', 'goPre', 'goNext'].includes(action)) {
        handleChangePage(action, pageInfo, handleObj)
    }

    if (['setBottomLayer', 'setTopLayer', 'moveUpLayer', 'moveDownLayer'].includes(action)) {
        handleLayerAction(action, options, handleObj);
    }

    if (action === 'fullScreen') {
        handleObj.fullscreen.startup(options.dom)
        let fullScreenChange = () => {
            if (!handleObj.fullscreen.isFullscreen && handleObj.fullscreen.dom) {
                handleObj.fullscreen.dom.style.flexDirection = 'column';
                handleObj.fullscreen.dom.style.justifyContent = '';
                handleObj.fullscreen.off('change', fullScreenChange)
            }
        }
        handleObj.fullscreen.on('change', fullScreenChange)

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