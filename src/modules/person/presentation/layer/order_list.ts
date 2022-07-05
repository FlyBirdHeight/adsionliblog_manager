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
    if (len == 0) {
        return 0;
    }
    let left = 0, right = len - 1;
    if (this.layerSave[left] > layer) {
        return 0;
    }
    if (layer > this.layerSave[len - 1]) {
        return len;
    }
    let mid;
    while (left < right && left != right) {
        mid = left - (left + right) >> 1;
        if (this.layerSave[mid] >= layer) {
            right = mid - 1;
        } else {
            left = mid;
        }
    }

    return left;

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