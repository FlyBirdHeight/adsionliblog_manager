const setOrderData = function (this: any, layer: number) {
    let startIdx = findBoundary.call(this, layer);
    if (this.layerSave[startIdx] < layer) {
        this.layerSave.splice(startIdx + 1, 0, layer);
    } else {
        this.layerSave.splice(startIdx, 0, layer);
    }
}

const findBoundary = function (this: any, layer: number) {
    let len = this.layerSave.length;
    let left = 0, right = len;
    while (right > left) {
        let mid = left + (right - left) >> 1;
        if (this.layerSave[mid] == layer) {
            left = mid + 1;
        } else if (this.layerSave[mid] < layer) {
            left = mid + 1;
        } else if (this.layerSave[mid] > layer) {
            right = mid;
        }
    }

    return left - 1;
}

const deleteData = function (this: any, layer: number) {
    let idx = findIdx.call(this, layer);
    this.layerSave.splice(idx, 1);
}

const findIdx = function (this: any, layer: number) {
    return this.layerSave.findIndex((v: number) => {
        return v == layer;
    })
}

export {
    setOrderData,
    deleteData,
    findIdx
}