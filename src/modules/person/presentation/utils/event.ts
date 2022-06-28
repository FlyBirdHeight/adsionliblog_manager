import { Action, Page } from '../type';

/**
 * @method addItem 添加item到页面中
 * @param index 标识
 * @param type 类型
 * @param data 待添加数据
 */
const addItem = function (this: any, index: number, type: string, data: any) {
    let pageData = this.pageList.get(this.currentPage);
    let typeList = pageData.item[type];
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
const updateItem = function (this: any, index: number, type: string, updateData: any) {
    // recordAction.call(this, type, index, 'update', null, updateData)
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
const recordAction = function (this: any, type: string, index: any, actionType: string, oldV: any, newV: any, options: any = null) {
    let pushData = {
        type,
        page: this.currentPage,
        item_index: index,
        action: actionType,
        data: {
            pre: oldV,
            next: newV
        },
        timeStamp: +new Date()
    };

    this.actionStack.push(pushData)
}


export {
    addItem,
    deleteItem,
    updateItem,
    updateBody
}