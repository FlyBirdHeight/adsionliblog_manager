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
import { addItem, deleteItem, updateItem, updateBody } from "@/modules/person/presentation/utils/event";
import { handleUndo } from '@/modules/person/presentation/utils/undo';
import { handleRecovery } from '@/modules/person/presentation/utils/recovery';
const initFn = [addTextArea, addImage, keyInput, addItem, deleteItem, updateItem, updateBody];
class HandlePresentation {
    pageList: Map<number, Type.Page>;
    currentPage: number;
    pickMember: null | Type.PageItem;
    actionStack: Type.Action[];
    undoStack: Type.Action[];
    recoveryStack: Type.Action[];
    copyData: Type.CopyObj | null;
    itemTypeIndexList: { index: number; type: string }[];
    currentPageData: Type.Page | null;
    constructor() {
        this.pageList = new Map();
        this.currentPage = 0;
        this.pickMember = null;
        this.actionStack = [];
        this.undoStack = [];
        this.recoveryStack = [];
        this.copyData = null;
        this.pageList.set(0, getDefaultPageData());
        this.itemTypeIndexList = [];
        this.currentPageData = this.pageList.get(this.currentPage) || null;
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
        this.currentPage = this.pageList.size;
        this.currentPageData = this.pageList.get(this.pageList.size) || null;
        this.actionStack.push({
            type: ActionType.PAGE_ACTION,
            page: this.pageList.size - 1,
            action: "add",
            data: {
                pre: null,
                next: pageData
            },
            timeStamp: +new Date()
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
            data: {
                pre: pageData || null,
                next: null
            },
            timeStamp: +new Date()
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
        let actionLength = this.actionStack.length;
        let recoveryLength = this.recoveryStack.length;
        let action: Type.Action | undefined;
        if (actionLength != 0 && recoveryLength == 0) {
            action = this.actionStack.pop();
        } else if (actionLength == 0 && recoveryLength != 0) {
            action = this.recoveryStack.pop();
        } else {
            action = this.actionStack[actionLength - 1].timeStamp > this.recoveryStack[recoveryLength - 1].timeStamp ?
                this.actionStack.pop() : this.recoveryStack.pop();
        }
        if (!action) {
            return;
        }
        this.undoStack.push(action);
        handleUndo.call(this, action);
    }

    /**
     * @method recoveryAction 恢复动作
     */
    recoveryAction() {
        if (this.undoStack.length == 0) {
            return;
        }
        let action: Type.Action | undefined = this.undoStack.length ? this.undoStack.pop() : undefined;
        if (!action) {
            return;
        }
        this.recoveryStack.push(action);
        handleRecovery.call(this, action);
    }

    /**
     * Generates a GUID string.
     * @returns {string} The generated GUID.
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @author Slavik Meltser.
     * @link http://slavik.meltser.info/?p=142
     */
    guid() {
        const _p8 = (s: boolean = false) => {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    getTypeList(type: string) {
        let pageData: any = this.pageList.get(this.currentPage);
        let typeList = pageData.item[type];

        return {
            pageData, typeList
        }
    }
}

export default HandlePresentation;