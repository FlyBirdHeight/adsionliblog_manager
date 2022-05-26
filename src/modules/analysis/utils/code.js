import AnalysisIndex from "./index.js";
class Code extends AnalysisIndex {
    constructor() {
        super();
        this.handleValue = new String();
        this.handleTag = {
            start: '<div class="code">',
            normalCodeHighlight: '<pre v-highlight>',
            normalCodeHighlightEnd: '</pre>',
            highlightStart: '<code style="overflow:unset; padding: 0" class="">',
            highlightEnd: '</code>',
            pS: '<p class="code_font">',
            pE: '</p>',
            end: '</div>',
            tab: {
                tab_1: 4,
                tab_2: 8,
                tab_3: 12,
                tab_4: 16,
                tab_5: 20,
                tab_6: 24,
                tab_7: 28,
                tab_8: 32,
                tab_9: 36,
                tab_10: 40,
                tab_11: 44,
                tab_12: 48,
            },
            note: "note",
            br: "<br />"
        }
        this.codeFragment = /^(\s*)?(`{3})(\s*)?(.+)?$/;
        /**
         * @description 定义正则规则表达式参数
         * @property {String} removeEndSpace 去除尾部空格
         * @property {String} space 获取空格数量
         * @property {Array} nodeSign 注释标记
         * @property {RegExp} morelineAnnotation 多行注释的匹配(暂时没啥用)
         * @property {RegExp} morelineAnnotationStart 多行注释头匹配
         * @property {RegExp} morelineAnnotationBody 多行注释身体匹配
         * @property {RegExp} morelineAnnotationEnd 多行注释尾匹配
         * @property {Boolean} codeFlag 是否是代码片段的标记
         * @property {Number} codeStartIndex 代码片段开始位置
         * @property {Number} codeEndIndex 代码片段结束的位置
         * @property {Array} codeData 记录一段代码片段的数据
         * @property {Array} allCodeData 记录全部代码片段的位置
         * @property {Number} summaryLevel 只有在Summary模块中用来区分Code的，层级
         **/
        this.removeEndSpace = /\s*$/;
        this.space = /^\s*/g;
        this.morelineAnnotation = /^(\/\*{1,}\n)?((\*{1}.*)\n)*(\*{1,}\/)$/gmi;
        this.morelineAnnotationStart = new RegExp(/^(\s*)?(\/\*{1,})(.+)?(\n*)?$/i);
        this.morelineAnnotationBody = new RegExp(/^(\s*)?\*{1,}([^/]+)?$/i);
        this.morelineAnnotationEnd = new RegExp(/^(\s*)?(\*{1,}.*)*\*\/(\s*)?$/i);
        this.slashAnnotation = /^(\s*)(\/{2})(.+)/;
        this.nodeSign = [];
        this.startIndex = undefined;
        this.endIndex = undefined;
        this.codeFlag = false;
        this.codeStartIndex = undefined;
        this.codeEndIndex = undefined;
        this.codeData = [];
        this.allCodeData = [];
        this.allSummaryCodeData = [];
        this.summaryLevel = null;
        this.startSpaceCount = 0;
        this.handleStartSpaceCount = 0;
        this.showHighlightLanguage = 'javascript';
        this.languageList = ['shell', 'c++', 'c#', 'go', 'c', 'swift', 'javascript', 'java', 'php', 'sql', 'python', 'html', 'xml', 'bash', 'css', 'ruby', 'json', 'kotlin', 'objective-c', 'scss', 'typescript', 'glsl'];
    }

    /**
     * @method setHandleValue 设置待处理内容值
     * @param {*} value 待处理内容
     * @param {Number} startIndex 在数组中code标签开始下标
     * @param {Number} endIndex 在数组中code标签结束下标
     * @param {Number} startSpaceCount 起始位置空格数量
     */
    setHandleValue(value, startIndex, endIndex, startSpaceCount) {
        this.handleValue = value
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.handleStartSpaceCount = startSpaceCount;

        return this;
    }


    /**
     * @method handle 处理代码模块的输入值
     */
    handle() {
        let returnHtml = this.handleTag.start;
        returnHtml += this.handleTag.normalCodeHighlight;
        let morelineAnnotationStart = undefined;
        let firstMorelineAnnotationFlag = false;
        let morelineAnnotationBodyIndex = undefined;
        let morelineAnnotationEndIndex = undefined;
        let morelineAnnotationData = [];
        this.handleValue.map((currentValue, index) => {
            let innerHtml = this.handleTag.pS;
            currentValue = currentValue.replace(/\r|\n/g, '');
            if (this.slashAnnotation.test(currentValue)) {
                innerHtml = this.handleNote(currentValue, innerHtml);
                returnHtml += innerHtml;
            } else if (this.morelineAnnotationStart.test(currentValue)) {
                morelineAnnotationStart = index;
                firstMorelineAnnotationFlag = true;
                morelineAnnotationData.push(currentValue);
            } else if (this.morelineAnnotationBody.test(currentValue) || currentValue == '*') {
                morelineAnnotationBodyIndex = index;
                if (!firstMorelineAnnotationFlag && morelineAnnotationBodyIndex - morelineAnnotationStart == 1) {
                    morelineAnnotationData.push(currentValue);
                } else {
                    if (firstMorelineAnnotationFlag && typeof (morelineAnnotationEndIndex) == 'undefined') {
                        morelineAnnotationData.push(currentValue);
                    } else {
                        let requestData = [currentValue, firstMorelineAnnotationFlag, morelineAnnotationStart, morelineAnnotationEndIndex, innerHtml, 'notAn']
                        returnHtml += this.handleNormalCode(...requestData);
                    }
                }
            } else if (this.morelineAnnotationEnd.test(currentValue)) {
                morelineAnnotationEndIndex = index;
                morelineAnnotationData.push(currentValue);
                returnHtml += this.handleMorelineAnnotation(morelineAnnotationData);
                /**
                 * @description 当处理完成后，重置全部关于多行注释的内容
                 */
                morelineAnnotationBodyIndex = undefined;
                morelineAnnotationData = [];
                morelineAnnotationStart = undefined;
                firstMorelineAnnotationFlag = false;
                morelineAnnotationEndIndex = undefined;
            } else {
                if (currentValue.length == 0) {
                    returnHtml += this.handleTag.br;
                    return;
                }
                let requestData = [currentValue, firstMorelineAnnotationFlag, morelineAnnotationStart, morelineAnnotationEndIndex, innerHtml]
                returnHtml += this.handleNormalCode(...requestData);
            }
        })
        returnHtml += this.handleTag.normalCodeHighlightEnd;
        returnHtml += this.handleTag.end;
        let startIndex = this.startIndex;
        let endIndex = this.endIndex;
        return {
            startIndex,
            endIndex,
            returnHtml
        };
    }

    /**
     * @method judgeHandle 匹配代码块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标 
     */
    judgeHandle(value, index) {
        value = value.replace(/\r/g, '')
        if (this.codeFragment.test(value) && !this.codeFlag) {
            this.startSpaceCount = value.match(/^\s*/)[0].length;
            this.showHighlightLanguage = value.replace(this.codeFragment, '$4');
            this.handleCodeHighLight()
            this.codeFlag = true;
            this.codeStartIndex = index;
        } else if (this.codeFragment.test(value) && this.codeFlag) {
            this.codeEndIndex = index;
            this.allCodeData.push({
                startIndex: this.codeStartIndex,
                endIndex: this.codeEndIndex,
                codeData: this.codeData,
                startSpaceCount: this.startSpaceCount
            })
            this.resetData();
        } else if (this.codeFlag) {
            this.codeData.push(value);
        }
    }

    /**
     * @method judgeHandleSummary 在Summary模块中匹配代码块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标 
     * @param {*} level 所在summary的层级
     */
    judgeHandleSummary(value, index, level) {
        value = value.replace(/\r/g, '')
        if (this.codeFragment.test(value) && !this.codeFlag) {
            this.startSpaceCount = value.match(/^\s*/)[0].length;
            this.showHighlightLanguage = value.replace(this.codeFragment, '$4');
            this.handleCodeHighLight()
            this.codeFlag = true;
            this.codeStartIndex = index;
            this.summaryLevel = level;
        } else if (this.codeFragment.test(value) && this.codeFlag && this.summaryLevel == level) {
            this.codeEndIndex = index;
            this.allSummaryCodeData.push({
                startIndex: this.codeStartIndex,
                endIndex: this.codeEndIndex,
                codeData: this.codeData,
                level: this.summaryLevel,
                startSpaceCount: this.startSpaceCount
            })
            this.resetData();
        } else if (this.codeFlag) {
            this.codeData.push(value);
        } else if (this.codeFlag && this.summaryLevel != level) {
            this.resetData();
        }
    }

    /**
     * @method getTabNum 获取空格返回class样式
     * @param {Number} spaceCount 空格数量
     * @return {String} 添加入innerHtml中的tab样式
     */
    getTabNum(spaceCount) {
        let returnData = '';
        if (spaceCount == 0) {
            return returnData;
        } else if (spaceCount > 48) {
            returnData = 'tab_12';
            return returnData;
        }
        spaceCount = spaceCount - this.handleStartSpaceCount;
        let last = undefined;
        for (let key in this.handleTag.tab) {
            if (spaceCount < this.handleTag.tab[key]) {
                returnData = last;
                // console.log(returnData, spaceCount)
                break;
            }
            last = key;
        }
        return returnData;
    }

    /**
     * @method handleNote 处理note
     * @param {String} handleValue 待处理参数
     */
    handleNote(handleValue, innerHtml) {
        handleValue = handleValue.replace(this.removeEndSpace, '')
        let spaceCount = handleValue.match(this.space)[0].length;
        let tabLayour = this.getTabNum(spaceCount);
        innerHtml = innerHtml.replace(/code_font/i, this.handleTag.note + (tabLayour != '' ? ` ${tabLayour}` : ''));
        innerHtml += handleValue + this.handleTag.pE;

        return innerHtml
    }

    /**
     * @method handleMorelineAnnotation 处理多行注释的样式
     * @param {Array} handleValue 待处理数据
     */
    handleMorelineAnnotation(handleValue) {
        let returnHtml = '';
        for (let value of handleValue) {
            let innerHtml = this.handleTag.pS;
            value = value.replace(this.removeEndSpace, '')
            let spaceCount = value.match(this.space)[0].length;
            let tabLayour = this.getTabNum(spaceCount);
            innerHtml = innerHtml.substr(0, innerHtml.length - 2) + (tabLayour != '' ? ` ${tabLayour}` : '') + innerHtml.substr(innerHtml.length - 2, innerHtml.length);
            innerHtml = this.handleNote(value, innerHtml);
            returnHtml += innerHtml;
        }

        return returnHtml;
    }

    /**
     * @method handleNormalCode 处理普通代码模块
     * @param {String} 待处理字段
     * @param {aF} 是否是多行注释的开始
     * @param {aS} 多行注释开始的下标
     * @param {aE} 多行注释结束的下标
     * @param {String} 待添加内容
     */
    handleNormalCode(currentValue, aF, aS, aE, innerHtml, type = 'normal') {
        /**
         * @note 去除字符串尾部的空格，避免污染计算空格数量
         */
        currentValue = currentValue.replace(this.removeEndSpace, '')
        let spaceCount = currentValue.match(this.space)[0].length;
        let tabLayour = this.getTabNum(spaceCount);
        innerHtml = innerHtml.substr(0, innerHtml.length - 2) + (tabLayour != '' ? ` ${tabLayour}` : '') + innerHtml.substr(innerHtml.length - 2, innerHtml.length);
        if (type == 'normal') {
            if (aF && typeof (aS) != 'undefined' && typeof (aE) == 'undefined') {
                innerHtml = this.handleNote(currentValue, innerHtml);
                return innerHtml;
            } else {
                if (currentValue.replace(this.space, '') == '>') {
                    return '';
                }
                let start = this.handleTag.highlightStart.replace(/(class=")/, `$1${tabLayour} ${this.showHighlightLanguage}`);
                innerHtml = start + currentValue.replace(this.space, '') + this.handleTag.highlightEnd;
                return innerHtml;
            }
        } else {
            if (currentValue.replace(this.space, '') == '>') {
                return '';
            }
            let start = this.handleTag.highlightStart.replace(/(class=")/, `$1${tabLayour} ${this.showHighlightLanguage}`);
            innerHtml = start + currentValue.replace(this.space, '') + this.handleTag.highlightEnd;
            return innerHtml;
        }
    }

    /**
     * TODO: 待完成
     * @method handleCodeHighLight 处理代码高亮显示
     */
    handleCodeHighLight() {
        this.showHighlightLanguage = this.showHighlightLanguage.replace(/(\s|\r|\n)/g, '');
        if (this.showHighlightLanguage.length != 0) {
            if (this.languageList.indexOf(this.showHighlightLanguage) == -1) {
                this.showHighlightLanguage = 'javascript';
            }
            if (this.showHighlightLanguage == 'js') {
                this.showHighlightLanguage = 'javascript'
            }
        } else {
            this.showHighlightLanguage = 'javascript'
        }
    }

    /**
     * @method resetData 重置数据
     */
    resetData() {
        this.codeFlag = false;
        this.codeStartIndex = undefined;
        this.codeEndIndex = undefined;
        this.codeData = [];
        this.summaryLevel = undefined;
    }
}

export default Code;