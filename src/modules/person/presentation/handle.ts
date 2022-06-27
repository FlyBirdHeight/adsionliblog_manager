import * as Type from "./type"
const enum ActionType {
    PAGE_ACTION = "page",
    ITEM_ACTION = "item"
}
const getDefaultPageData = (): Type.Page => {
    return {
        item: {
            text: [],
            image: [],
            code: [],
            count: 0,
        },
        setting: {
            background: {
                type: '',
                data: '',
                config: null,
            },
            resolution: {
                x: 1600,
                y: 900,
            },
        },
    }
}
import { addTextArea } from "@/modules/person/presentation/text/text";
import { addImage } from "@/modules/person/presentation/image/image";
import { keyInput } from "@/modules/person/presentation/utils/key_input";
import {
    addItem,
    deleteItem,
    updateItem
} from "@/modules/person/presentation/utils/event";
const initFn = [addTextArea, addImage, keyInput, addItem, deleteItem, updateItem];
class HandlePresentation {
    pageList: Map<number, Type.Page>;
    currentPage: number;
    pickMember: null | Type.PageItem;
    actionStack: Type.Action[];
    undoStack: Type.Action[];
    recoveryStack: Type.Action[];
    copyData: Type.CopyObj | null;
    constructor() {
        this.pageList = new Map();
        this.currentPage = 0;
        this.pickMember = null;
        this.actionStack = [];
        this.undoStack = [];
        this.recoveryStack = [];
        this.copyData = null;
        this.pageList.set(0, getDefaultPageData());
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
        let pageData: Type.Page = getDefaultPageData()
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
     * @method revokeAction 撤销动作
     */
    revokeAction() {
        if (this.actionStack.length == 0 && this.recoveryStack.length == 0) {
            return;
        }
        let action: Type.Action | undefined = this.recoveryStack.length ? this.recoveryStack.pop() : this.actionStack.pop();
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
        let action: Type.Action | undefined = this.recoveryStack.length ? this.recoveryStack.pop() : undefined;
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