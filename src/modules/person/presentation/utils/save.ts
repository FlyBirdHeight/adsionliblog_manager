import axios from 'axios';
/**
 * @method generatePageKey 为没有page_key的页面生成page_key标识
 */
const concatItem = function (itemData: any) {
    let item: any[] = [];
    for (let key in itemData) {
        if (key === 'count') {
            continue
        }
        item = item.concat(itemData[key])
    }
    let page_item_list = item.map((v: any) => {
        return v.index
    })
    return {
        item,
        page_item_list
    };
}

/**
 * @method save 保存数据，放入后端中
 */
const save = async function (this: any) {
    let requestData = [];
    for (let [key, value] of this.pageList) {
        if (!Reflect.has(value, 'page_key')) {
            value.page_key = this.guid();
        }
        let { item, page_item_list } = concatItem(value.item);
        requestData.push({
            item,
            page_item_list,
            page_key: value.page_key,
            config: {
                style: value.setting,
                animate: value.animate
            }
        });
    }

    let status = await axios.post("/api/setting/presentation/create/presentation", requestData);
    console.log(status);
    
}


export default save;