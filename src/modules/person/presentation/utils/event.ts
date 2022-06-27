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
    recordAction.call(this, type, index, 'add', null, data)
}
/**
 * @method deleteItem 从页面中删除item
 * @param {number} index item标识
 * @param {string} type 类型
 */
const deleteItem = function (this: any, index: number | string, type: string) {
    let pageData = this.pageList.get(this.currentPage);
    let typeList = pageData.item[type];
    let idx = typeList.findIndex((v: any) => {
        return Number(v.index) == Number(index)
    })
    if (idx == -1) {
        return false
    }
    pageData.item.count -= 1;
    let preV = typeList.splice(idx, 1)
    recordAction.call(this, type, Number(index), 'delete', preV, null)
    return true;
}
/**
 * @method updateItem 更新页面中的item
 * @param index item标识
 * @param type item类型
 * @param updateData 更新内容
 */
const updateItem = function (this: any, index: number, type: string, updateData: any) {
    recordAction.call(this, type, index, 'update', null, updateData)
}
/**
 * @method recordAction 收集动作信息
 * @param {string} type 动作类型 
 * @param {number} index 动作执行的item标识
 * @param oldV 
 */
const recordAction = function (this: any, type: string, index: number, actionType: string, oldV: any, newV: any) {
    this.actionStack.push({
        type,
        page: this.currentPage,
        item_index: index,
        action: actionType,
        data: {
            pre: oldV,
            next: newV
        }
    })
    console.log(this.actionStack);
}

export {
    addItem,
    deleteItem,
    updateItem
}