import { Page, PageItem, Action } from '../type';
import { setItemData } from "./utils";
/**
 * @method findPosition 二分查找，寻找右边界，插入
 * @param stack 
 * @param timeStamp 
 */
const findPosition = (stack: Action[], timeStamp: number) => {
    let l = 0, r = stack.length;
    if (stack.length === 0) {
        return 0;
    }
    while (r > l) {
        let mid = Math.floor((l + r) / 2);
        if (stack[mid].timeStamp == timeStamp) {
            l = mid + 1;
        } else if (stack[mid].timeStamp < timeStamp) {
            l = mid + 1;
        } else {
            r = mid;
        }
    }

    return l - 1;
}
const recoveryToAction = function (this: any) {
    this.actionStack.sort((a: Action, b: Action) => {
        return a.timeStamp - b.timeStamp
    })
    for (let recovery of this.recoveryStack) {
        let idx = findPosition(this.actionStack, recovery.timeStamp)
        this.actionStack.splice(idx, 0, recovery);
    }
    this.recoveryStack = [];
}

/**
 * @method addItem 添加item到页面中
 * @param index 标识
 * @param type 类型
 * @param data 待添加数据
 */
const addItem = function (this: any, index: number, type: string, data: any) {
    let pageData = this.pageList.get(this.currentPage);
    let typeList = pageData.item[type];
    let layer = this.layerSetting.setTopLayer({
        index: index,
        type: type
    }, 0);
    data.style.layer = layer;
    typeList.push(data);
    pageData.item.count += 1;
    recordAction.call(this, type, index, 'add', null, JSON.parse(JSON.stringify(data)))
}
/**
 * @method deleteItem 从页面中删除item
 * @param {number} index item标识
 * @param {string} type 类型
 */
const deleteItem = function (this: any, index: any, type: string, record: boolean = true) {
    let pageData = this.pageList.get(this.currentPage);
    let typeList = pageData.item[type];
    let idx = typeList.findIndex((v: any) => {
        return v.index == index
    })
    if (idx == -1) {
        return false
    }
    pageData.item.count -= 1;
    let preV = typeList.splice(idx, 1)
    this.layerSetting.removeItem(preV[0].style.layer, preV[0].index)
    if (record) {
        recordAction.call(this, type, index, 'delete', JSON.parse(JSON.stringify(preV[0])), null)
    }

    return true;
}
/**
 * @method updateItem 更新页面中的item
 * @param index item标识
 * @param type item类型
 * @param updateData 更新内容
 */
const updateItem = function (this: any, index: any, type: string, updateData: any, itemEditType: string = '') {
    let { pageData, typeList } = this.getTypeList(type);
    let idx = typeList.findIndex((v: PageItem) => {
        return v.index === index;
    })
    let item = typeList[idx];
    if (Reflect.has(updateData, 'data')) {
        return;
    }
    let style = item.style;
    let oldData: any = setItemData(style, updateData);
    if (JSON.stringify(oldData) == JSON.stringify(updateData)) {
        return;
    }

    recordAction.call(this, type, index, 'item-edit', oldData, updateData, itemEditType)
}
/**
 * @method updateBody 更新页面内容
 * @param this 
 * @param updateData 更新数据
 * @param {string} updateType 更新类型
 */
const updateBody = function (this: any, updateData: any) {
    let pageData: Page = this.pageList.get(this.currentPage);
    let data = JSON.parse(JSON.stringify(updateData));
    recordAction.call(this, 'body', -1, 'body-edit', JSON.parse(JSON.stringify(pageData.setting.background)), data);
    pageData.setting.background = data;
}
/**
 * @method recordAction 收集动作信息
 * @param {string} type 动作类型 
 * @param {any} index 动作执行的item标识
 * @param oldV 
 */
const recordAction = function (this: any, type: string, index: any, actionType: string, oldV: any, newV: any, itemEditType: string = '') {
    let pushData: Action = {
        type,
        page: this.currentPage,
        item_index: index,
        action: actionType,
        data: {
            pre: oldV,
            next: newV
        },
        timeStamp: +new Date(),
    };
    if (actionType === 'item-edit') {
        pushData.itemEditType = itemEditType;
    }
    this.actionStack.push(pushData)
    if (this.undoStack.length != 0) {
        this.undoStack = [];
    }
    if (this.recoveryStack.length != 0 && this.undoStack.length == 0) {
        recoveryToAction.call(this);
    }
}


export {
    addItem,
    deleteItem,
    updateItem,
    updateBody
}