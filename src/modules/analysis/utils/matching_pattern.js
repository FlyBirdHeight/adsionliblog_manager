import AnalysisIndex from "./index.js"
import Code from "./code.js"
import Table from "./table.js"
import OrderList from "./order_list.js"
import Summary from "./summary.js"
import Normal from "./normal.js"
import Image from "./image.js"
/**
 * @class MatchPattern 模式匹配类
 */
class MatchPattern extends AnalysisIndex {
    constructor() {
        super();
        this.code = new Code();
        this.table = new Table();
        this.orderList = new OrderList();
        this.summary = new Summary();
        this.normal = new Normal();
        this.htmlSpanList = [];
        this.returnCodeHtml = '';
        this.image = new Image();
        /**
         * @property {Array} normalData 无符合大片段数据记录
         */
        this.normalData = [];
    }

    /**
     * @method handle 开始处理全部传入数据
     */
    handle(value) {
        let data = value.split('\n');
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (this.code.codeFlag) {
                this.code.judgeHandle(data[i], i);
                continue;
            }
            if (this.table.tableParameter.start) {
                this.table.judgeHandle(data[i], i, length);
                continue;
            }
            if (this.summary.summaryStart) {
                this.summary.judgeSummary(data[i], i);
                continue;
            }

            this.summary.judgeSummary(data[i], i)
            this.code.judgeHandle(data[i], i);
            this.table.judgeHandle(data[i], i, length);
            this.image.judgeImage(data[i], i)
        }
        //NOTE: 非普通数据的渲染标签替换
        this.replaceToSpan();
        if (this.htmlSpanList.length != 0) {
            this.htmlSpanList.sort((a, b) => {
                return a.startIndex - b.startIndex;
            })
        }
        //NOTE: 处理普通数据，因为这里没有做处理
        this.handleNormalData(data);
        this.htmlSpanList.map((value, index) => {
            this.returnCodeHtml += value.returnHtml;
        })
        return {
            html: this.returnCodeHtml,
        }
    }

    /**
     * @method replaceToSpan 替换全部markdown语法为标签
     */
    replaceToSpan() {
        if (this.code.allCodeData.length != 0) {
            for (let value of this.code.allCodeData) {
                this.htmlSpanList.push(this.code.setHandleValue(value.codeData, value.startIndex, value.endIndex, value.startSpaceCount).handle())
            }
        }
        if (this.table.tableParameter.allTableData.length != 0) {
            this.htmlSpanList = this.htmlSpanList.concat(this.table.filterTableData().generateTableData().generateSpan());
        }
        if (this.summary.summaryHandleData.length != 0) {
            let returnData = this.summary.handleSummaryData();
            this.htmlSpanList = this.htmlSpanList.concat(returnData);
        }
        if (this.image.imageData.length != 0) {
            let returnData = this.image.handleData().handlePreview();
            this.htmlSpanList = this.htmlSpanList.concat(returnData);
        }
    }

    /**
     * @method handleNormlaData 处理普通数据
     * @param {Array} data 原始数据
     */
    handleNormalData(data) {
        let noHandleIndex = 0;
        if (this.htmlSpanList.length == 0) {
            this.normalData.push({
                data: data,
                startIndex: 0,
                endIndex: data.length - 1
            })
        } else {
            //NOTE 首先先获取到待处理数据内容
            this.htmlSpanList.map(value => {
                if (noHandleIndex != value.endIndex) {
                    this.normalData.push({
                        data: data.slice(noHandleIndex, (noHandleIndex + (value.startIndex - noHandleIndex))),
                        startIndex: value.startIndex - noHandleIndex == 1 ? noHandleIndex + (value.startIndex - noHandleIndex) - 1 : noHandleIndex,
                        endIndex: noHandleIndex + (value.startIndex - noHandleIndex) - 1
                    })
                    noHandleIndex = value.endIndex + 1;
                } else {
                    noHandleIndex = value.endIndex + 1;
                }
            })
            if (data.length > this.htmlSpanList[this.htmlSpanList.length - 1].endIndex) {
                this.normalData.push({
                    data: data.slice(this.htmlSpanList[this.htmlSpanList.length - 1].endIndex + 1),
                    startIndex: this.htmlSpanList[this.htmlSpanList.length - 1].endIndex + 1,
                    endIndex: data.length - 1
                })
            }
        }

        this.normal.setHandleData(this.normalData).handleDataToSpan();
        this.htmlSpanList = this.htmlSpanList.concat(this.normal.returnData).sort((a, b) => {
            return a.startIndex - b.startIndex;
        })
    }

    /**
     * @method resetData 重置数据
     */
    resetData() {
        this.htmlSpanList = [];
        this.returnCodeHtml = '';
        this.tableFlag = false;
        this.tableParameter = {
            startIndex: undefined,
            endIndex: undefined,
            allTableData: [],
            tableData: []
        };
    }
}

export default MatchPattern