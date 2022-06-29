const setItemData = (style: any, updateData: any) => {
    let oldData: any = {}
    
    for (let key of Reflect.ownKeys(updateData)) {
        oldData[key] = {}
        if (typeof (updateData[key]) === 'object' && Reflect.ownKeys(updateData[key]).length != 0) {
            oldData[key] = setItemData(style[key], updateData[key]);
        } else {
            oldData[key] = style[key];
            style[key] = updateData[key]
        }
    }

    return oldData;
}

const findTypeIdx = (index: any, itemList: any[]) => {
    let idx = itemList.findIndex((v: any) => {
        return v.index == index
    })
    return idx;
}

export {
    setItemData,
    findTypeIdx
}