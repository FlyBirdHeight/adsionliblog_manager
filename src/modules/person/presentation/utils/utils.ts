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
 * @method generatePageImage 生成page的图片内容
 */
const generatePageImage = (dom: any) => {
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
    html2canvas(dom, {
        height: dom.getBoundingClientRect().height,
        windowHeight: dom.getBoundingClientRect().height,
    }).then((canvas) => {
        let dataURL = canvas.toDataURL('image/png')
        let blob = changeToBlob(dataURL)
        let url = URL.createObjectURL(blob)
        window.open(url)
    })
}


export {
    setItemData,
    findTypeIdx,
    setUpdateData,
    setItemTypeIndexList,
    generatePageImage
}