class Image {
    constructor() {
        this.imageList = [];
        this.imageRegular = new RegExp("\\!(\\[(.+?)\\])(\\((.+?)\\))", 'g');
        this.imageHtmlRegular = new RegExp('<img(.+)?\/>', 'g');
        this.imageData = [];
    }

    /**
     * @method judgeImage 判断是否是图片
     * @param {*} value 待判断值
     * @param {*} index 文档中下标位置
     * @param {*} level 所处层级，只在summary模块中使用
     */
    judgeImage(value, index, level = undefined) {
        if (this.imageRegular.test(value)) {
            this.imageData.push({
                startIndex: index,
                endIndex: index,
                image: value,
                level
            });
        } else if (this.imageHtmlRegular.test(value)) {
            this.imageData.push({
                startIndex: index,
                endIndex: index,
                image: value.replace(this.imageHtmlRegular, '$1'),
                level,
                type: 'html'
            });
        }
    }

    /**
     * @method handleData 处理图片数据
     */
    handleData() {
        for (let value of this.imageData) {
            if (value.type) {
                let srcR = new RegExp('src="(.*?)"', 'g');
                let altR = new RegExp('alt="(.*?)"', 'g');
                let styleR = new RegExp('style="(.*?)"', 'g');
                let src = srcR.exec(value.image)[1].replace(/\.\.\//g, '');
                let alt = altR.exec(value.image)[1];
                let style = styleR.exec(value.image)[1];
                value['src'] = src;
                value['alt'] = alt;
                value['style'] = style
                this.imageList.push(src);
            } else {
                this.imageRegular.lastIndex = 0;
                let matchData = this.imageRegular.exec(value.image)
                value['src'] = matchData[4].replace(/\.\.\//g, '');
                value['alt'] = matchData[2];
                this.imageList.push(value['src']);
            }
        }

        return this;
    }

    /**
     * @method handlePreview 处理图片为html标签
     */
    handlePreview() {
        let previewList = "[";
        for (let value of this.imageList) {
            previewList += `'${value}',`
        }
        previewList += "]"
        for (let value of this.imageData) {
            if (value.type) {
                value['returnHtml'] = `
                    <image-data fit="contain" src="${value.src}" alt="${value.alt}" :preview="true" :previewSrcList="${previewList}" imageStyleData="${value.style}"></image-data>
                `
            } else {
                value['returnHtml'] = `
                    <image-data fit="contain" src="${value.src}" alt="${value.alt}" :preview="true" :previewSrcList="${previewList}"></image-data>
                `
            }

        }

        return this.imageData;
    }

    resetData() {
        this.imageList = [];
    }
}

export default Image;