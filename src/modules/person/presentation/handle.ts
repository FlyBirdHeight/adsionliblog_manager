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
                x: 900,
                y: 600,
            },
        },
        isEdit: false
    }
}
import { addTextArea } from "@/modules/person/presentation/text/text";
import { addImage } from "@/modules/person/presentation/image/image";
import { keyInput } from "@/modules/person/presentation/utils/key_input";
import { addItem, deleteItem, updateItem, updateBody } from "@/modules/person/presentation/utils/event";
import { handleUndo } from '@/modules/person/presentation/utils/undo';
import { handleRecovery } from '@/modules/person/presentation/utils/recovery';
import { setItemTypeIndexList } from './utils/utils';
const initFn = [addTextArea, addImage, keyInput, addItem, deleteItem, updateItem, updateBody];
class HandlePresentation {
    pageList: Map<number, Type.Page>;
    currentPage: number;
    pickMember: null | Type.PageItem;
    actionStack: Type.Action[];
    undoStack: Type.Action[];
    recoveryStack: Type.Action[];
    copyData: Type.CopyObj | null;
    itemTypeIndexList: { index: string; type: string }[];
    currentPageData: Type.Page | null;
    constructor() {
        this.pageList = new Map();
        this.currentPage = 1;
        this.pickMember = null;
        this.actionStack = [];
        this.undoStack = [];
        this.recoveryStack = [];
        this.copyData = null;
        this.pageList.set(1, getDefaultPageData());
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
        let size = this.pageList.size + 1;
        this.pageList.set(size, pageData);
        this.currentPage = this.pageList.size;
        this.switchPageAction();
    }

    /**
     * @method deletePage 移除页面
     * @param {number} page 移除页面的页数
     */
    deletePage(page: number): boolean {
        if (this.pageList.size === 1) {
            return false;
        }
        if (page == this.pageList.size) {
            this.pageList.delete(page);
            this.currentPage = page - 1;
            this.currentPageData = this.pageList.get(this.currentPage) || null;
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
        this.currentPage = page;
        this.switchPageAction();
        return true;
    }
    /**
     * @method goFirst 前往首页
     */
    goFirst() {
        if (this.currentPage == 1) {
            return;
        }
        this.currentPage = 1;
        this.switchPageAction();
    }

    /**
     * @method goEnd 前往最后一页
     */
    goEnd() {
        if (this.currentPage == this.pageList.size) {
            return;
        }
        this.currentPage = this.pageList.size;
        this.switchPageAction();
    }
    /**
     * @method goPre 前往上一页
     */
    goPre() {
        if (this.pageList.size === 1) {
            return;
        }
        if (this.currentPage == 1) {
            this.currentPage = this.pageList.size;
        } else {
            this.currentPage -= 1;
        }
        this.switchPageAction();
    }

    /**
     * @method goNext 前往下一页
     */
    goNext() {
        if (this.pageList.size === 1) {
            return;
        }
        if (this.currentPage == this.pageList.size) {
            this.currentPage = 1
        } else {
            this.currentPage += 1
        }
        this.switchPageAction();
    }
    /**
     * @method goPage 前往指定页数
     * @param {number} page 页码
     */
    goPage(page: number) {
        if (page < 0 || page > this.pageList.size) {
            return
        }
        this.currentPage = page;
        this.switchPageAction();
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
        action.timeStamp = +new Date();

        this.recoveryStack.push(action);

        handleRecovery.call(this, action);
    }
    /**
     * @method switchPageAction 切换页面时，执行的内容
     */
    switchPageAction() {
        if ((this.actionStack.length == 0 && this.undoStack.length != 0 && this.recoveryStack.length != 0) || this.actionStack.length != 0) {
            this.currentPageData!.isEdit = true;
        } else {
            this.currentPageData!.isEdit = false;
        }
        this.currentPageData = this.pageList.get(this.currentPage) || null;
        this.itemTypeIndexList = setItemTypeIndexList(this.currentPageData || null);

        this.clearStack();
    }
    /**
     * @method clearStack 切换页面时，清空栈
     */
    clearStack() {
        this.actionStack = [];
        this.undoStack = [];
        this.recoveryStack = [];
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
        let pageData: any = this.currentPageData;
        let typeList = pageData.item[type];

        return {
            pageData, typeList
        }
    }
}

export default HandlePresentation;