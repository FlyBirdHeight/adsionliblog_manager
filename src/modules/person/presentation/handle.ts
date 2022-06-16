type Animation = {
    join: {
        type: string,
        timer: number,
        level: number
    },
    leave: {
        type: string,
        timer: number,
        level: number
    }
}
type PageItem = {
    type: string,
    position: {
        x: number,
        y: number
    },
    data: any,
    layer: number,
    animation: {
        join: Animation,
        leave: Animation,
    },
    index: string
}
const enum ActionType {
    PAGE_ACTION = "page",
    ITEM_ACTION = "item"
}

type Action = {
    type: string,
    page?: number,
    item_index?: string,
    action: string,
    data?: Page | PageItem | { pre: Page | PageItem, next: Page | PageItem }
}

type Page = {
    switch: string,
    item_count: 0,
    background: {
        type: 'color',
        data: 'rgba(255,255,255,1)'
    },
    item: PageItem[]
}
import { addTextArea } from "@/modules/person/presentation/text/text";
import { addImage } from "@/modules/person/presentation/image/image";
const initFn = [addTextArea, addImage];
class HandlePresentation {
    pageList: Map<number, Page>;
    currentPage: number;
    pickMember: null | PageItem;
    actionStack: Action[];
    undoStack: Action[];
    recoveryStack: Action[];
    constructor() {
        this.pageList = new Map();
        this.currentPage = 0;
        this.pickMember = null;
        this.actionStack = [];
        this.undoStack = [];
        this.recoveryStack = [];
        this.pageList.set(0, {
            switch: '',
            item_count: 0,
            background: {
                type: 'color',
                data: 'rgba(255,255,255,1)'
            },
            item: []
        });
        this.registerFn();
    }

    /**
     * @method registerFn 注册外部方法
     */
    registerFn() {
        for (let v of initFn) {
            Reflect.set(this, v.name, v)
        }
    }


    /**
     * @method addPage 添加页面
     */
    addPage() {
        let pageData: Page = {
            switch: '',
            item_count: 0,
            background: {
                type: 'color',
                data: 'rgba(255,255,255,1)'
            },
            item: []
        }
        this.pageList.set(this.pageList.size, pageData);

        this.actionStack.push({
            type: ActionType.PAGE_ACTION,
            page: this.pageList.size - 1,
            action: "add",
            data: pageData
        })
    }

    /**
     * @method deletePage 移除页面
     * @param {number} page 移除页面的页数
     */
    deletePage(page: number): boolean {
        if (this.pageList.size === 1) {
            return false;
        }
        let pageData = this.pageList.get(page);
        if (page == this.pageList.size - 1) {
            this.pageList.delete(page);
            return true;
        }
        this.pageList.delete(page);
        for (let i = page + 1; i < this.pageList.size + 1; i++) {
            let data = this.pageList.get(i);
            this.pageList.set(i - 1, data!);
            if (i == this.pageList.size) {
                this.pageList.delete(i);
            }
        }
        this.actionStack.push({
            type: ActionType.PAGE_ACTION,
            page: page,
            action: "delete",
            data: pageData
        })
        return true;
    }

    /**
     * @method addItem 添加元素到页面中
     * @param {PageItem} pageItem
     * @param {number} page
     */
    addItem(pageItem: PageItem, page: number) {
        let pageData = this.pageList.get(page);
        pageData?.item.push(pageItem);
        this.actionStack.push({
            type: ActionType.ITEM_ACTION,
            page: page,
            item_index: pageItem.index,
            action: "add",
            data: pageItem
        })
        return true;
    }

    /**
     * @method updateItem 添加元素到页面中
     * @param {PageItem} pageItem
     * @param {number} page
     */
    updateItem(pageItem: PageItem, page: number) {
        let pageData = this.pageList.get(page);
        let index: number = pageData!.item?.findIndex(v => v.index == pageItem.index);
        if (index === -1) {
            return false;
        }
        this.actionStack.push({
            type: ActionType.ITEM_ACTION,
            page: page,
            item_index: pageItem.index,
            action: "update",
            data: {
                pre: pageData!.item![index],
                next: pageItem
            }
        })
        pageData!.item![index] = pageItem;
        return true;
    }

    /**
     * @method deleteItem 移除元素
     * @param {string} pageItemIndex
     * @param {number} page
     */
    deleteItem(pageItemIndex: string, page: number) {
        let pageData = this.pageList.get(page);
        let index: number = pageData!.item?.findIndex(v => v.index == pageItemIndex);
        if (index === -1) {
            return false;
        }
        this.actionStack.push({
            type: ActionType.ITEM_ACTION,
            page: page,
            item_index: pageItemIndex,
            action: "delete",
            data: pageData!.item![index]
        })
        pageData!.item!.splice(index, 1);

        return true;
    }

    /**
     * @method revokeAction 撤销动作
     */
    revokeAction() {
        if (this.actionStack.length == 0) {
            return;
        }
        let action: Action | undefined = this.actionStack.length ? this.actionStack.pop() : undefined;
        if (!action) {
            return;
        }
        this.recoveryStack.push(action);
        if (action.type === ActionType.PAGE_ACTION) {
            if (action.action === 'add') {

            } else if (action.action === 'update') {

            } else {

            }
        } else {
            if (action.action === 'add') {

            } else if (action.action === 'update') {

            } else {

            }
        }
    }

    /**
     * @method recoveryAction 恢复动作
     */
    recoveryAction() {
        if (this.recoveryStack.length == 0) {
            return;
        }
        let action: Action | undefined = this.recoveryStack.length ? this.recoveryStack.pop() : undefined;
        if (!action) {
            return;
        }
        this.undoStack.push(action);
        if (action.type === ActionType.PAGE_ACTION) {
            if (action.action === 'add') {

            } else if (action.action === 'update') {

            } else {

            }
        } else {
            if (action.action === 'add') {

            } else if (action.action === 'update') {

            } else {

            }
        }
    }
}

export default HandlePresentation;