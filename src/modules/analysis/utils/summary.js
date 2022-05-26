import AnalysisIndex from "./index.js"
import Title from "./title.js"
import Code from "./code.js"
import Table from "./table.js"
import OrderList from "./order_list.js"
import Normal from "./normal.js"
import Image from "./image.js"
class Summary extends AnalysisIndex {
    constructor() {
        super();
        this.code = new Code();
        this.table = new Table();
        this.orderList = new OrderList();
        this.title = new Title();
        this.normal = new Normal();
        this.image = new Image();
        /**
         * @property {*} summaryReg 正则匹配的规则
         * @property {Number} startSummaryIndex Summary开始位置
         * @property {Number} lastSummaryIndex 记录上一次Summary的位置
         * @property {Number} endSummaryIndex Summary结束位置
         * @property {*} summaryRule Summary模块的内容记录，比如是一块连续的Summary就需要进行详细的记录进行解析
         * @property {*} summarySpan Summary标签替换
         * @property {Boolean} summaryStart 是否是Summary开始
         * @property {Array} summaryCacheData summary缓存数据
         * @property {Array} summaryHandleData 待处理Summary数据
         * @property {Array} returnData 返回的html片段数据
         */
        this.summaryReg = {
            start: /(^\s*\>)(.*)/i,
            end: /^(\s*)(\n*)?$/i
        }
        this.startSummaryIndex = null;
        this.lastSummaryIndex = null;
        this.endSummaryIndex = null;
        this.summaryRule = {
            startIndex: null,
            endIndex: null,
            lineCount: null
        }
        //TODO 这里是否可以使用Jsx拓展来进行书写，等待调研
        this.summarySpan = {
            start: '<div class="summary">',
            normalSpanStart: '<span>',
            normalSpanEnd: '</span>',
            end: '</div>'
        }
        this.summaryStart = false;
        this.summaryCacheData = [];
        this.summaryHandleData = [];
        this.returnData = [];
    }

    /**
     * @method judgeHandle 匹配Summary模块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标
     */
    judgeSummary(value, index) {
        if (this.summaryReg.start.test(value) && !this.summaryStart) {
            this.lastSummaryIndex = index;
            this.startSummaryIndex = index;
            this.summaryStart = true;
            this.summaryCacheData.push(value);
        } else if (this.summaryStart && this.summaryReg.start.test(value)) {
            if (Number(index) - Number(this.lastSummaryIndex) == 1) {
                this.lastSummaryIndex = index;
                this.summaryCacheData.push(value);
            } else {
                this.summaryHandleData.push({
                    startIndex: this.startSummaryIndex,
                    endIndex: this.lastSummaryIndex,
                    handleData: this.summaryCacheData
                });
                this.resetData();
            }
        } else if (this.summaryReg.end.test(value) && this.summaryStart) {
            this.endSummaryIndex = index;
            this.summaryCacheData.push(value);
            this.summaryHandleData.push({
                startIndex: this.startSummaryIndex,
                endIndex: this.endSummaryIndex,
                handleData: this.summaryCacheData
            });
            this.resetData();
        }
    }

    /**
     * @method handleSummaryData 处理Summary模块的html标签
     */
    handleSummaryData() {
        for (let value of this.summaryHandleData) {
            let innerHtml = this.summarySpan.start;
            if (value.handleData.length > 1) {
                innerHtml += this.handleOtherModules(value.handleData);
                //NOTE:这里最特殊的是因为在Summary模块中也还是支持对table,title,code的辨析，所以，需要重复处理
            } else {
                innerHtml += this.summarySpan.normalSpanStart +
                    this.matchSpecialChar(value.handleData[0].replace(this.summaryReg.start, '$2')) +
                    this.summarySpan.normalSpanEnd;
            }
            innerHtml += this.summarySpan.end;
            this.returnData.push({
                startIndex: value.startIndex,
                endIndex: value.endIndex,
                returnHtml: innerHtml
            })
        }

        return this.returnData
    }

    /**
     * @method handleOtherModules 处理Summary中可能出现的其他模块
     * @param {*} data 待处理数据
     */
    handleOtherModules(data) {
        let length = data.length;
        this.title.resetData();
        this.code.resetData();
        this.code.allSummaryCodeData = [];
        let returnCodeHtml = '';
        for (let i = 0; i < length; i++) {
            let level = data[i].match(/^\s*(\>\s*)*/g)[0].replace(/\s/g, '').length;
            let judgeData = data[i].replace(/^\s*(\>\s+?)*(.+)/g, '$2');
            if (this.code.codeFlag) {
                this.code.judgeHandleSummary(judgeData, i, level);
                continue;
            }
            if (this.table.tableParameter.start) {
                judgeData = judgeData.replace(/(\r|\>)/g, '');
                this.table.judgeHandleSummary(judgeData, i, length, level);
                continue;
            }

            this.code.judgeHandleSummary(judgeData, i, level);
            this.table.judgeHandleSummary(judgeData, i, length, level);
            this.title.judgeTitle(judgeData, i, level);
            this.image.judgeImage(data[i], i, level);
        }
        let htmlSpanList = this.replaceToSpan();
        if (htmlSpanList.length != 0) {
            htmlSpanList.sort((a, b) => {
                return a.startIndex - b.startIndex;
            })
        }
        //NOTE: 处理普通数据，因为这里没有做处理
        htmlSpanList = this.handleNormalData(data, htmlSpanList);
        returnCodeHtml = this.generateEndReturnData(htmlSpanList);

        return returnCodeHtml;
    }

    /**
     * @method replaceToSpan 替换全部markdown语法为标签
     */
    replaceToSpan() {
        let returnData = [];

        if (this.code.allSummaryCodeData.length != 0) {
            for (let value of this.code.allSummaryCodeData) {
                let level = value.level;
                let addData = this.code.setHandleValue(value.codeData, value.startIndex, value.endIndex, value.startSpaceCount).handle()
                addData['level'] = level;
                returnData.push(addData)
            }
        }
        if (this.table.tableParameter.allTableData.length != 0) {
            returnData = returnData.concat(this.table.filterTableData().generateTableData().generateSpan());
        }
        if (this.title.titleList.length != 0) {
            returnData = returnData.concat(this.title.handleTitleLevel().generateTitleLevel());
        }
        if (this.image.imageData.length != 0) {
            let imageData = this.image.handleData().handlePreview();
            returnData = returnData.concat(imageData);
            this.image.resetData();
            this.image.imageData = [];
        }

        return returnData;
    }

    /**
     * @method handleNormlaData 处理普通数据
     * @param {Array} data 原始数据
     */
    handleNormalData(data, htmlSpanList) {
        let noHandleIndex = 0;
        let normalData = [];
        if (htmlSpanList.length == 0) {
            normalData.push({
                data: data,
                startIndex: 0,
                endIndex: data.length - 1
            })
        } else {
            //NOTE 首先先获取到待处理数据内容
            htmlSpanList.map(value => {
                if (noHandleIndex != value.endIndex) {
                    normalData.push({
                        data: data.slice(noHandleIndex, (noHandleIndex + (value.startIndex - noHandleIndex))),
                        startIndex: value.startIndex - noHandleIndex == 1 ? noHandleIndex + (value.startIndex - noHandleIndex) - 1 : noHandleIndex,
                        endIndex: noHandleIndex + (value.startIndex - noHandleIndex) - 1,
                    })
                    noHandleIndex = value.endIndex + 1;
                } else {
                    noHandleIndex = value.endIndex + 1;
                }
            })
            if (data.length > htmlSpanList[htmlSpanList.length - 1].endIndex) {
                normalData.push({
                    data: data.slice(htmlSpanList[htmlSpanList.length - 1].endIndex + 1),
                    startIndex: htmlSpanList[htmlSpanList.length - 1].endIndex + 1,
                    endIndex: data.length - 1
                })
            }
        }
        normalData = this.handleNormalDataCreateLevel(normalData);
        this.normal.setHandleData(normalData).handleDataToSpanForSummary();
        htmlSpanList = htmlSpanList.concat(this.normal.returnData).sort((a, b) => {
            return a.startIndex - b.startIndex;
        })
        this.normal.resetData()
        return htmlSpanList;
    }

    /**
     * @method handleNormalData 处理一下普通数据，确定其层级
     * @param {*} normalData 
     */
    handleNormalDataCreateLevel(normalData) {
        let returnData = [];
        for (let value of normalData) {
            let normalDataA = [];
            if (value.data.length != 0) {
                for (let label of value.data) {
                    let obj = {};
                    obj['level'] = label.match(/^(\s*\>\s*)*/g)[0].replace(/\s/g, '').length;
                    obj['label'] = label.replace(/^(\>\s+?)*(.+)/g, '$2').replace(/\r/g, '');
                    obj['label'] = obj['label'].replace(/(\s*)\>/g, '');
                    normalDataA.push(obj);
                }
                returnData.push({
                    data: normalDataA,
                    startIndex: value.startIndex,
                    endIndex: value.endIndex
                })
            }
        }
        return returnData;
    }

    /**
     * @method generateEndReturnData 生成最终输出数据
     */
    generateEndReturnData(handleData) {
        if (handleData.length == 0) {
            return '';
        }
        let lastLevel = 1;
        let innerHtml = '';
        let count = 1;
        for (let value of handleData) {
            if (value.type == 'normal') {
                for (let normal of value.returnHtml.body) {
                    if (lastLevel != normal.level) {
                        if (lastLevel != 1) {
                            for (let i = 1; i < lastLevel; ++i) {
                                innerHtml += this.summarySpan.end;
                            }
                        }
                        lastLevel = normal.level;
                        for (let i = 1; i < lastLevel; i++) {
                            innerHtml += this.summarySpan.start;
                        }
                        innerHtml += normal.html;
                    } else {
                        innerHtml += normal.html;
                    }
                    if (count == handleData.length && lastLevel != 1) {
                        for (let i = 1; i < lastLevel; i++) {
                            innerHtml += this.summarySpan.end;
                        }
                    }
                }
            } else {
                if (value.level == 0) {
                    continue;
                }
                if (lastLevel != value.level) {
                    if (lastLevel != 1) {
                        for (let i = 1; i < lastLevel; ++i) {
                            innerHtml += this.summarySpan.end;
                        }
                    }
                    lastLevel = value.level
                    for (let i = 1; i < lastLevel; i++) {
                        innerHtml += this.summarySpan.start;
                    }
                    innerHtml += value.returnHtml;
                } else if (lastLevel == value.level) {
                    innerHtml += value.returnHtml;
                }
                if (count == handleData.length && lastLevel != 1) {
                    for (let i = 1; i < lastLevel; i++) {
                        innerHtml += this.summarySpan.end;
                    }
                }
            }
            count++;
        }
        return innerHtml
    }

    /**
     * @method resetData 重置数据
     */
    resetData() {
        this.summaryStart = false;
        this.endSummaryIndex = null;
        this.startSummaryIndex = null;
        this.lastSummaryIndex = null;
        this.summaryCacheData = [];
    }
}

export default Summary;