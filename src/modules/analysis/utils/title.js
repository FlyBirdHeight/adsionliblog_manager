import AnalysisIndex from "./index.js"
class Title extends AnalysisIndex {
    constructor() {
        super();
        this.title = /(?<titleCount>^#{1,6})(\s{1,})(.+)/;
        this.titleList = [];
        this.titleHtml = [];
        this.titleValueList = new Map();
        this.lastLevel = undefined;
        this.maxLevel = undefined;
        this.root = undefined;
    }
    /**
     * @method resetData 重置数据
     */
    resetData() {
        this.titleList = [];
        this.titleHtml = [];
        this.titleValueList = new Map();
        this.lastLevel = undefined;
        this.maxLevel = undefined;
        this.root = undefined;
    }

    /**
     * @method judgeTitle 判断是否是Title
     * @param {*} value 待判断值
     * @param {Number} index 文件中下标
     */
    judgeTitle(value, index, summaryLevel = null) {
        if (this.title.test(value)) {
            let execData = this.title.exec(value);
            let level = execData[1].length;
            let label = execData[3];
            if (!this.lastLevel) {
                this.lastLevel = level;
                this.maxLevel = level;
                this.root = index;
                this.joinTitleList({
                    startIndex: index,
                    endIndex: index,
                    label,
                    level,
                    summaryLevel,
                    root: undefined,
                    leave: [],
                }, index)
            } else {
                if (level > this.lastLevel) {
                    this.lastLevel = level;
                    this.joinTitleList({
                        startIndex: index,
                        endIndex: index,
                        label,
                        level,
                        summaryLevel,
                        root: this.root,
                        leave: [],
                    }, index)
                    this.root = index;
                } else if (level == this.lastLevel) {
                    this.joinTitleList({
                        startIndex: index,
                        endIndex: index,
                        label,
                        level,
                        summaryLevel,
                        root: this.titleValueList.get(this.root).root,
                        leave: [],
                    }, index)
                    this.root = index;
                } else if (level < this.lastLevel && level > this.maxLevel) {
                    let selectRoot = undefined;
                    let value = this.titleValueList.get(this.root);
                    while (typeof(value) != 'undefined' || value.level != level) {
                        if(typeof(value.root) == 'undefined'){
                            break;
                        }
                        selectRoot = value.root;
                        
                        value = this.titleValueList.get(value.root);
                    }
                    this.joinTitleList({
                        startIndex: index,
                        endIndex: index,
                        label,
                        level,
                        summaryLevel,
                        root: this.titleValueList.get(selectRoot).root,
                        leave: [],
                    }, index)
                    this.lastLevel = level;
                    this.root = index;
                } else {
                    this.lastLevel = level;
                    this.joinTitleList({
                        startIndex: index,
                        endIndex: index,
                        label,
                        level,
                        summaryLevel,
                        root: undefined,
                        leave: [],
                    }, index)
                    this.root = index;
                    this.maxLevel = level;
                }
            }
        }
    }

    /**
     * @method joinTitleList 添加入titleList数据
     * @param {*} data 待添加数据
     * @param {*} index key值
     */
    joinTitleList(data, index) {
        this.titleValueList.set(index, data);
        this.titleList.push(data);
    }

    /**
     * @method handleTitleLevel 处理Title的分级
     */
    handleTitleLevel() {
        let handleData = new Map();
        for (let [key, value] of this.titleValueList) {
            if (typeof (value.root) == 'undefined') {
                handleData.set(key, value)
                continue;
            }
            this.titleValueList.get(value.root).leave.push(value);
        }
        this.titleValueList = [...handleData];
        this.titleValueList.map((currentValue) => {
            currentValue.splice(0, 1);
            return currentValue;
        })
        this.titleValueList = this.titleValueList.flat();

        return this;
    }

    /**
     * @method generateTitleLevel 生成title分级列表
     */
    generateTitleLevel() {
        for (let value of this.titleList) {
            this.titleHtml.push({
                level: value.summaryLevel,
                startIndex: value.startIndex,
                endIndex: value.endIndex,
                returnHtml: `<h${value.level} id="title${value.startIndex}" class="${value.level < 4 ? 'page-title' : 'page-title-no-line'}">${this.matchSpecialChar(value.label)}</h${value.level}>`
            })
        }

        return this.titleHtml
    }
}

export default Title;