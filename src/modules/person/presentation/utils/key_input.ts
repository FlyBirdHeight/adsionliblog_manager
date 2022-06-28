const getHandleKeyDownData = (event: any) => {
    let keyDownData = event.key

    if (event.key === 'c' && event.ctrlKey) {
        keyDownData = 'copy'
    } else if (event.key === 'v' && event.ctrlKey) {
        keyDownData = 'paste'
    }

    return keyDownData
}

/**
 * @method findItemInfo 寻找item信息
 * @param itemList 
 * @param activeIndex 
 */
const findItemInfo = (activeIndex: any, itemList: any) => {
    for (let key in itemList) {
        if (itemList[key].index == activeIndex) {
            return {
                index: key,
                itemInfo: itemList[key]
            };
        }
    }

    return null;
}
/**
 * @method getPageTypeData 获取当前页下的item数据
 * @param currentPage 
 * @param type 
 */
const getPageTypeData = function (this: any, currentPage: number, activeIndex: any, itemList: any) {
    const itemData = findItemInfo(activeIndex, itemList);

    if (!itemData || !this.pageList.has(currentPage)) {
        return null;
    }
    let pageData = this.pageList.get(currentPage);
    let typeList = pageData.item[itemData.itemInfo.type];
    if (typeList.length === 0) {
        return null;
    }

    return {
        itemData,
        typeList,
        pageData
    };
}
/**
 * @method backspace 按下删除键的处理
 * @param {*} activeIndex 当前选中的index值 
 * @param {*} itemList 
 * @param {number} currentPage 当前page
 */
const backspace = function (this: any, activeIndex: any, itemList: any, currentPage: number) {
    let data = getPageTypeData.call(this, currentPage, activeIndex.value, itemList)
    if (!data) {
        return;
    }

    let status = this.deleteItem(activeIndex.value, data.itemData.itemInfo.type)
    if (!status) {
        return;
    }
    let itemIdx = itemList.findIndex((v: any) => {
        return v.index == activeIndex.value
    })
    activeIndex.value = -1;
    itemList.splice(itemIdx, 1);
}
/**
 * @method copy 复制内容
 * @param this 
 * @param activeIndex 当前选中数据 
 * @param itemList item列表
 */
const copy = function (this: any, activeIndex: any, itemList: any) {
    const data = findItemInfo(activeIndex.value, itemList);
    if (!data) {
        return;
    }
    this.copyData = data.itemInfo;
}
/**
 * @method paste 粘贴数据
 * @param this 
 * @param activeIndex 当前选中数据的ref对象
 * @param itemList item列表，ref对象
 * @param {number} currentPage 当前page的页数
 */
const paste = function (this: any, activeIndex: any, itemList: any, currentPage: number) {
    if (!this.copyData) {
        return;
    }
    let data = getPageTypeData.call(this, currentPage, this.copyData.index, itemList)
    if (!data) {
        return;
    }
    let idx = data.typeList.findIndex((v: any) => {
        return v.index === this.copyData.index
    })
    if (idx === -1) {
        return;
    }
    let copyItem = JSON.parse(JSON.stringify(data.typeList[idx]));

    copyItem.index = this.guid();
    copyItem.style.position.x += 20;
    copyItem.style.position.y += 20;
    this.addItem(copyItem.index, this.copyData.type, copyItem)
    itemList.push({ index: copyItem.index, type: this.copyData.type });
    activeIndex.value = copyItem.index;
}

/**
 * @method keyInput 键盘输入的处理
 * @param {string} key 键盘输入内容 
 * @param {*} options 额外携带参数
 */
const keyInput = function (this: any, key: string, options: any) {
    let activeIndex = options.activeIndex;
    let itemList = options.itemList;
    let currentPage = options.currentPage;
    switch (key) {
        case 'Backspace':
            backspace.call(this, activeIndex, itemList, currentPage);
            break;
        case 'copy':
            copy.call(this, activeIndex, itemList);
            break;
        case 'paste':
            paste.call(this, activeIndex, itemList, currentPage);
            break;
        default:
            break;
    }
}

export {
    keyInput,
    getHandleKeyDownData
}