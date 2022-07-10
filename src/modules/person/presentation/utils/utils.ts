import { Page } from '../type';
import html2canvas from 'html2canvas'
/**
 * @method setItemData 根据更新数据结构，设置对应的item内容
 * @param style 
 * @param updateData 
 */
const setItemData = (style: any, updateData: any) => {
    let oldData: any = {}
    for (let key of Reflect.ownKeys(updateData)) {
        oldData[key] = {}
        if (Array.isArray(updateData[key])) {
            oldData[key] = []
        }
        if (typeof (updateData[key]) === 'object' && Reflect.ownKeys(updateData[key]).length != 0 && !Array.isArray(updateData[key])) {
            oldData[key] = setItemData(style[key], updateData[key]);
        } else {
            oldData[key] = style[key];
            style[key] = updateData[key]
        }
    }

    return oldData;
}
/**
 * @method setUpdateData 设置更新数据结构
 * @param keyList 
 * @param styleData 
 */
const setUpdateData = (keyList: string[], styleData: any) => {
    let updateData: any = {}
    if (keyList.length == 1) {
        if (typeof styleData[keyList[0]] === 'object' && Array.isArray(styleData[keyList[0]])) {
            updateData[keyList[0]] = JSON.parse(JSON.stringify(styleData[keyList[0]]))
        } else {
            updateData[keyList[0]] = styleData[keyList[0]]
        }
    } else {
        updateData[keyList[0]] = setUpdateData(keyList.slice(1), styleData[keyList[0]])
    }
    return updateData
}

const findTypeIdx = (index: any, itemList: any[]) => {
    let idx = itemList.findIndex((v: any) => {
        return v.index == index
    })
    return idx;
}
/**
 * @method setItemTypeIndexList 设置item索引表
 * @param currentPage 
 */
const setItemTypeIndexList = (currentPage: Page | null): { index: string, type: string }[] => {
    if (!currentPage) {
        return []
    }
    let item = currentPage.item;
    let returnData: { index: string, type: string }[] = [];
    if (item.count === 0) {
        return returnData;
    }
    for (let text of item.text) {
        returnData.push({
            index: text.index,
            type: 'text'
        })
    }
    for (let image of item.image) {
        returnData.push({
            index: image.index,
            type: "image"
        })
    }
    for (let code of item.code) {
        returnData.push({
            index: code.index,
            type: "code"
        })
    }

    return returnData;
}
/**
 * @method setItemDataToLayer 设置当前页面的层级结构
 * @param currentPage 
 */
const setItemDataToLayer = (currentPage: Page | null) => {
    if (!currentPage) {
        return [];
    }
    let item = currentPage.item;
    let returnData: { layer: number, itemInfo: { index: string, type: string } }[] = [];
    if (item.count === 0) {
        return returnData;
    }
    for (let text of item.text) {
        returnData.push({
            layer: text!.style!.layer,
            itemInfo: {
                index: text.index,
                type: 'text'
            }
        })
    }
    for (let image of item.image) {
        returnData.push({
            layer: image!.style!.layer,
            itemInfo: {
                index: image.index,
                type: "image"
            }
        })
    }


    return returnData;
}
/**
 * @method generatePageImage 生成page的图片内容
 */
const generatePageImage = async (dom: any, page: number, pageImageList: any[]) => {
    function changeToBlob(blob: any) {
        let arr = blob.split(','),
            type = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            count = bstr.length,
            u8arr = new Uint8Array(count)
        while (count--) {
            u8arr[count] = bstr.charCodeAt(count)
        }
        return new Blob([u8arr], {
            type: type,
        })
    }
    let canvas = await html2canvas(dom, {
        windowHeight: dom.getBoundingClientRect().height,
        logging: false,
        useCORS: true,
        scale: 0.3,
        width: dom.getBoundingClientRect().width,
        height: dom.getBoundingClientRect().height
    })
    let dataURL = canvas.toDataURL('image/png')
    let blob = changeToBlob(dataURL)
    let url = URL.createObjectURL(blob)
    let idx = pageImageList.findIndex(v => {
        return v.page == page;
    })
    idx == -1 ? pageImageList.push({ page, image: url }) : pageImageList[idx].image = url;
    pageImageList.sort((a: any, b: any) => a.page - b.page);
}
/**
 * @method setLayerToList 设置item的layer到layerSetting中，指定层级
 * @param {itemInfo: {index: string, type: string}} itemInfo 控件信息
 * @param {number} layer 层级
 */
const setLayerToList = function (this: any, itemInfo: { index: string, type: string }, layer: number, action: string = 'add') {
    if (action == 'add') {
        this.layerSetting.setItemLayer(layer, itemInfo);
    } else {
        this.layerSetting.removeItem(layer, itemInfo.index);
    }

    return true;
}
/**
 * @method localImage 本地化图片
 * @param {string} url
 */
const localImage = (url: string) => {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (this.status === 200) {
                let blob = this.response;
                let localUrl = URL.createObjectURL(blob)
                resolve(localUrl);
            } else {
                resolve("")
            }
        }
        xhr.send()
    })
}
export {
    setItemData,
    findTypeIdx,
    setUpdateData,
    setItemTypeIndexList,
    generatePageImage,
    setItemDataToLayer,
    setLayerToList,
    localImage
}