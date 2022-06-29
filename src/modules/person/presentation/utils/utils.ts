import { Page } from '../type';

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

export {
    setItemData,
    findTypeIdx,
    setUpdateData,
    setItemTypeIndexList
}