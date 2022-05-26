class AnalysisIndex {
    constructor() {
        //TODO 注意，加粗匹配一定要在倾斜匹配之前
        this.specialChar = {
            bold: /(\*{2})(.+?)(\1)/gi,
            tilt: /(\*)(.+?)\1/gi,
            boldTilt: /(\*{3})(.+?)(\1)/gi,
            underline: /(<u>)(.+?)(<\/u>)/gi,
            inlineCode: /(`{1,5})(.+?)\1/gi,
            deleteLine: /(~{2})(.+?)(\1)/gi,
            highlight: /(={2})(.+?)\1/gi,
            hyperlinks: /(\[(.+?)\])(\((.+?)\))/gi,
        }
    }
    /**
     * @method matchSpecialChar 匹配特殊字符
     * @param {String} value 
     */
    matchSpecialChar(value) {
        for (let key in this.specialChar) {
            let reg = new RegExp(this.specialChar[key]);
            if (reg.test(value)) {
                if (key == 'hyperlinks') {
                    value = value.replace(reg, this.handleSpecialChar('$2', key, '$4'));
                } else {
                    value = value.replace(reg, this.handleSpecialChar('$2', key))
                }
            }
        }

        return value;
    }

    /**
     * @method handleSpecialChar 将特殊字符转为对应的html标签
     * @param {*} value 插入检索值
     * @param {*} type 类型
     * @param {*} url 链接标签时的url
     */
    handleSpecialChar(value, type, url = '') {
        switch (type) {
            case 'tilt':
                return `<font class='tilt_char'>${value}</font>`
            case 'bold':
                return `<font class='bold_char'>${value}</font>`
            case 'underline':
                return `<font class='underline_char'>${value}</font>`
            case 'inlineCode':
                return `<span class='inlineCode_char'>${value}</span>`
            case 'deleteLine':
                return `<del class='deleteline_char'>${value}</del>`
            case 'highlight':
                return `<font class='highlight_char'>${value}</font>`
            case 'hyperlinks':
                return `<a href='${url}' rel='noopener noreferrer' target='_blank'>${value}</a>` 
            default:
                break;
        }
    }
    /**
     * @method deleteBlank 去除空白符
     * @param {String} value 待处理字符串
     * @param {*} type 1: 去除全部 2: 去除起始空白符 3: 去除结尾空白符
     */
    deleteBlank(value, type = 1) {
        let returnValue;
        switch (type) {
            case 1:
                returnValue = value.replace('/(^\\s*|\\s*$)/gi', '')
                break;
            case 2:
                returnValue = value.replace('/(^\\s*)/gi', '')
                break;
            case 3:
                returnValue = value.replace('/(\\s*$)/gi', '')
                break
            default:
                break;
        }

        return returnValue;
    }
}

export default AnalysisIndex