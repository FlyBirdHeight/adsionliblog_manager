import { Layer } from './layer_type';
import { ItemInfo } from '../type';
import { setOrderData, deleteData, findIdx } from './order_list';

class LayerHandle {
    endLayer: number;
    startLayer: number;
    currentMinLayer: number;
    currentMaxLayer: number;
    layerList: Map<number, Layer>;
    layerLimit: number;
    layerSave: number[];
    constructor() {
        this.startLayer = 1000;
        this.endLayer = Math.pow(2, 20);
        this.layerList = new Map();
        this.currentMinLayer = Math.pow(2, 20) + 1;
        this.currentMaxLayer = 0;
        this.layerLimit = 1;
        //NOTE: 这是一个有序数组，且永远不存在相同项
        this.layerSave = [];
    }
    initLayer() {
        this.currentMinLayer = this.startLayer;
        this.currentMaxLayer = this.startLayer;
        this.layerList.set(this.startLayer, {
            layer: this.startLayer,
            item: []
        });
        this.layerSave.push(this.startLayer);
    }
    /**
     * @method removeItem 移除对应层级下的item
     * @param {number} layer
     * @param {string} index
     */
    removeItem(layer: number, index: string) {
        let layerData = this.layerList.get(layer);
        let idx = layerData!.item.findIndex((v: ItemInfo) => {
            return v.index === index
        })
        layerData!.item.splice(idx, 1);
        if (layerData!.item.length === 0) {
            this.deleteLayer(layer);
        }
    }
    /**
     * @method setItem 往对应层级下添加item
     * @param itemInfo 
     * @param idx
     */
    setItem(itemInfo: { index: string, type: string }, idx: number) {
        let newLayer = this.layerSave[idx];
        let layerData = this.layerList.get(newLayer);
        layerData?.item.push(itemInfo);
    }
    /**
     * @method setLayerSave 往有序列表中添加数据
     * @param layer 
     */
    setLayerSave(layer: number) {
        setOrderData.call(this, layer);
    }
    /**
     * @method setLayer 设置层级数据
     * @param layer 
     */
    setLayer(layer: number) {
        this.layerList.set(layer, {
            layer,
            item: []
        })
        this.setLayerSave(layer)
        return this.layerList.get(layer);
    }
    /**
     * @method deleteLayer 删除无效层级
     * @param layer 
     */
    deleteLayer(layer: number) {
        this.layerList.delete(layer);
        deleteData.call(this, layer);
    }

    /**
     * @method setTopLayer 置于顶层
     * @param {itemInfo: { index: string, type: string }} itemInfo 控件详情
     * @param {number} layer 当前层级 
     */
    setTopLayer(itemInfo: { index: string, type: string }, layer: number = 0) {
        if (this.layerList.size === 0) {
            this.initLayer();
            let layer = this.layerList.get(this.currentMaxLayer);
            layer!.item.push(itemInfo);
        } else if (layer != 0 && this.layerList.has(layer)) {
            this.removeItem(layer, itemInfo.index)
        }
        this.currentMaxLayer = this.currentMaxLayer + this.layerLimit;
        let newLayer = this.setLayer(this.currentMaxLayer);
        newLayer!.item.push(itemInfo);

        return this.currentMaxLayer;
    }
    /**
     * @method moveUpLayer 上移一层
     * @param {itemInfo: { index: string, type: string }} itemInfo 控件详情
     * @param {number} layer 当前层级 
     */
    moveUpLayer(itemInfo: { index: string, type: string }, layer: number) {
        if (layer === this.currentMaxLayer) {
            return this.setTopLayer(itemInfo, layer);
        } else {
            let idx = findIdx.call(this, layer);
            if (idx == -1) {
                return;
            }
            this.removeItem(layer, itemInfo.index);
            idx += 1;
            this.setItem(itemInfo, idx);

            return this.layerSave[idx];
        }
    }
    /**
     * @method moveDownLayer 下移一层
     * @param {itemInfo: { index: string, type: string }} itemInfo 控件详情
     * @param {number} layer 当前层级 
     */
    moveDownLayer(itemInfo: { index: string, type: string }, layer: number) {
        if (layer === this.currentMinLayer) {
            return this.setBottomLayer(itemInfo, layer);
        } else {
            let idx = findIdx.call(this, layer);
            if (idx == -1) {
                return;
            }
            this.removeItem(layer, itemInfo.index);
            idx -= 1;
            this.setItem(itemInfo, idx);

            return this.layerSave[idx];
        }
    }
    /**
     * @method setTopLayer 置于底层
     * @param {itemInfo: { index: string, type: string }} itemInfo 控件详情
     * @param {number} layer 当前层级 
     */
    setBottomLayer(itemInfo: { index: string, type: string }, layer: number) {
        if (this.layerList.size === 0) {
            this.initLayer();
            let layer = this.layerList.get(this.currentMaxLayer);
            layer!.item.push(itemInfo);
        } else if (layer != 0 && this.layerList.has(layer)) {
            this.removeItem(layer, itemInfo.index)
        }
        this.currentMinLayer = this.currentMinLayer - this.layerLimit;
        let newLayer = this.setLayer(this.currentMinLayer);
        newLayer!.item.push(itemInfo);

        return this.currentMinLayer;
    }

    /**
     * @method resetData 重置数据，当页面发生改变时，重置
     */
    resetData() {
        this.layerList.clear();
        this.currentMinLayer = this.currentMaxLayer = 0;
        this.layerSave = [];
    }
    /**
     * @method setLayerList 设置层级列表数据
     * @param itemData
     */
    setLayerList(itemData: { layer: number, itemInfo: { index: string, type: string } }[]) {
        for (let item of itemData) {
            if (this.layerList.has(item.layer)) {
                let data = this.layerList.get(item.layer);
                data!.item.push(item.itemInfo);
            } else {
                let data = this.setLayer(item.layer);
                data!.item.push(item.itemInfo)
            }
            if (item.layer > this.currentMaxLayer) {
                this.currentMaxLayer = item.layer
            }
            if (item.layer < this.currentMinLayer) {
                this.currentMinLayer = item.layer
            }
        }

        console.log(this.layerList, this.currentMinLayer, this.currentMaxLayer);
        console.log(this.layerSave);
    }
}

export default LayerHandle;