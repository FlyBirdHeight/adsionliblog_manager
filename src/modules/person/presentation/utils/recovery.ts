import { Action } from "../type"

/**
 * @author adsionli
 * @file recovery.ts
 * @description 专门用于处理恢复操作的执行
 */

/**
 * @method recoveryAdd 恢复添加操作
 * @param {Action} action
 */
const recoveryAdd = function (this: any, action: Action) {
    let { type } = action;
    let { pageData, typeList } = this.getTypeList(type);
    pageData.item.count += 1;
    typeList.push(action.data!.next);
    this.itemTypeIndexList.push({
        index: action.item_index,
        type
    });
}

/**
 * @method recoveryDelete 恢复删除操作
 * @param {Action} action 
 */
const recoveryDelete = function (this: any, action: Action) {
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
 * @method recoveryBodyEdit 恢复背景更新操作操作
 */
const recoveryBodyEdit = function (this: any, action: Action) {
    console.log('recoveryBodyEdit:', action);
}

/**
 * @method recoveryItemEdit 恢复item更新操作操作
 */
const recoveryItemEdit = function (this: any, action: Action) {
    console.log('recoveryItemEdit:', action);
}

const handleRecovery = function (this: any, action: Action) {
    switch (action.action) {
        case 'add':
            recoveryAdd.call(this, action)
            break;
        case 'delete':
            recoveryDelete.call(this, action)
            break;
        case 'item-edit':
            recoveryItemEdit.call(this, action)
            break;
        case 'body-edit':
            recoveryBodyEdit.call(this, action)
            break;
        default:
            break;
    }
}

export {
    handleRecovery
}