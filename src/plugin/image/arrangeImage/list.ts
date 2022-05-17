import axios from 'axios';
const apiList = {
    getList: {
        url: "/api/file/image/get/list",
        method: "post"
    },
}
type FindList = {
    page: number,
    count: number,
    sort?: {
        name: string,
        type: string
    }
}
/**
 * @method getList 获取文件列表
 * @param {FindList} options 
 * @param {boolean} total 是否返回total
 */
const getList = async (options: FindList, total: boolean = false) => {
    try {
        const apiInfo = apiList.getList;
        let responseData = await axios({
            method: Reflect.get(apiInfo, 'method'),
            url: apiInfo.url,
            data: options
        });
        let returnData = responseData.data;
        if (returnData.data.length == 0 || !returnData.data) {
            return []
        }
        if (total) {
            return {
                data: returnData.data,
                total: returnData.total[0].count
            }
        }
        return returnData.data;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export {
    getList
}