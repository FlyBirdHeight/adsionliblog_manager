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

export {
    setItemData,
    findTypeIdx,
    setUpdateData
}