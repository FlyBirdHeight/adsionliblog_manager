import { Action } from "../type"

/**
 * @author adsionli
 * @file undo.ts
 * @description 专门用于处理撤销操作的执行
 */

/**
 * @method undoAdd 撤销添加操作
 * @param {Action} action
 */
const undoAdd = function (this: any, action: Action) {
    let { item_index: index, type } = action;
    let { pageData, typeList } = this.getTypeList(type);
    let idx = typeList.findIndex((v: any) => {
        return v.index == index
    })
    pageData.item.count -= 1;
    typeList.splice(idx, 1);

    let itemTypeIdx = this.itemTypeIndexList.findIndex((v: any) => {
        return v.index === index
    })
    if (itemTypeIdx != -1) {
        this.itemTypeIndexList.splice(itemTypeIdx, 1)
    }
}

/**
 * @method undoDelete 撤销删除操作
 */
const undoDelete = function (this: any, action: Action) {
    let { type } = action;
    let { pageData, typeList } = this.getTypeList(type);
    pageData.item.count += 1;
    typeList.push(action.data!.pre);
    this.itemTypeIndexList.push({
        index: action.item_index,
        type
    });
}

/**
 * @method undoBodyEdit 撤销背景更新操作操作
 */
const undoBodyEdit = function (this: any, action: Action) {
    console.log('undoBodyEdit:', action);
}

/**
 * @method undoItemEdit 撤销item更新操作操作
 */
const undoItemEdit = function (this: any, action: Action) {
    console.log('undoItemEdit:', action);
}

const handleUndo = function (this: any, action: Action) {
    switch (action.action) {
        case 'add':
            undoAdd.call(this, action)
            break;
        case 'delete':
            undoDelete.call(this, action)
            break;
        case 'item-edit':
            undoItemEdit.call(this, action)
            break;
        case 'body-edit':
            undoBodyEdit.call(this, action)
            break;
        default:
            break;
    }
}

export {
    handleUndo
}