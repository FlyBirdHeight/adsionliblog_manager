class Highlight {
    constructor() {
        /**
         * @property {Array} expression 表达式
         */
        this.expression = [
            'let', 'var', 'this', 'class', 'function', 'const', 'import', 'export', 'delete', 'new', 'for', 'while', 'switch',
            'case', 'break', 'continue', 'default', 'async', 'await', 'return', 'typeof', 'do', 'if',
            'else if', 'else', 'import', 'super', 'try', 'catch', 'yield', 'throw', 'debugger', 'from', 'in', 'of', 'console'
        ];
        this.atom = [
            'true', 'false', 'null', 'undefined', 'NaN', 'Infinity'
        ]
        this.char = /(\`.*\`|\'.*\'|\".*\"|\=|\+|\!|\?|\*|\||\/|\>|\<|\-|\&|\^|\@)/gi
        // this.value = [
        //     'let','var','class','function','const','import'
        // ];
        this.scopeOut = /\((.+)\)\s*{/g
    }

    matchExpress(data) {
        for (let value of this.expression) {
            let reg = new RegExp(eval(`/(${value})(\\s|:|\\.){1}/`), 'g');
            if (reg.test(data)) {
                data = data.replace(reg, '<font class="expression">$1</font>$2');
            }
        }

        return data;
    }

    matchChar(data) {
        if (this.char.test(data)) {
            data = data.replace(this.char, '<font class="char">$1</font>')
        }
        return data;
    }

    // matchValue(data) {
    //     for (let value of this.value) {
    //         let reg = new RegExp(eval(`/(?<=${value})(\\s+)(.+?)(?=(\\s|;)+)/g`))
    //         if (reg.test(data)) {
    //             data = data.replace(reg, '$1<font class="value">$2</font>')
    //         }
    //     }
        

    //     return data;
    // }

    matchScope(data) {
        // data = data.join('\n')
        // let functionScope = data.match(/([a-zA-Z]+)(\s*)(\(.*\))(\n*|\s*)(\n*|\r*|\s*|\p{P}\s*)?\{/giu).join('\n').replace(/^(if\s*\(|switch\s*\(|case\s*\(|else if\s*\(|while\s*\(|for\s*\().+/gmi, '').replace(/(\n|\s)/g,'').split('{');
        // console.log(functionScope)
    }

    handleHighLight(data) {
        let handleData = this.matchChar(data);
        // handleData = this.matchValue(handleData);
        handleData = this.matchExpress(handleData);
        return handleData;
    }
}


export default Highlight;