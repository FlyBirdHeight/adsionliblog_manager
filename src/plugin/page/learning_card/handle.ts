import { EditCardFold } from "@/modules/type/cardFold";
import axios from 'axios';
const apiList = {
    submitData: {
        update: {
            method: "PUT",
            url: "/api/page/learning_card/edit"
        },
        add: {
            method: "POST",
            url: "/api/page/learning_card/create"
        }
    },
    getData: {
        info: {
            method: "GET",
            url: "/api/page/learning_card/get/info"
        },
        list: {
            method: "POST",
            url: "/api/page/learning_card/get/list"
        }
    },
    delete: {
        method: "DELETE",
        url: "/api/page/learning_card/delete"
    }
}

/**
 * @method handleUpdateData 处理更新数据, 这里需要比较一下，哪一些问题需要被更新，减少后端更新数量
 * @param {EditCardFold} oldData 
 * @param {EditCardFold} newData 
 */
const handleUpdateData = (oldData: EditCardFold, newData: EditCardFold) => {
    let oldQuestion = oldData.questions;
    let newQuestion = oldData.questions;
    let editQuestion = [];
    let addQuestion = [];
    let deleteQuestion = [];
    for(let i = 0; i < newQuestion.length; i++){
        if(!Reflect.has(newQuestion[i], 'id')){
            addQuestion.push(newQuestion[i]);
            continue;
        }
        
    }
}
/**
 * @method submitData 提交创建或修改给后端
 * @param {string} type 类型: add update 
 * @param {EditCardFold} data 提交过来的数据
 */
const submitData = async (type: string, data: EditCardFold, oldData?: EditCardFold) => {
    try {
        if (type === 'update') {
            handleUpdateData(oldData!, data)
        }
        let apiInfo = Reflect.get(apiList.submitData, type);
        let requestData = await axios({
            method: apiInfo.method,
            url: apiInfo.url,
            data: data
        })
        let status = requestData.data;
        return status;
    } catch (e) {
        console.log(e);
        return false;
    }
}
/**
 * @method getData 获取闪卡信息
 * @param {string} type 获取类型：info 单个， list 列表
 * @param {*} options 获取参数
 */
const getData = async (type: string, options: any) => {
    try {
        let apiInfo = Reflect.get(apiList.getData, type);
        if (type === 'info') {
            apiInfo.url = apiInfo.url + `?id=${options.id}`;
        } else {
            apiInfo['data'] = options;
        }
        let requestData = await axios(apiInfo);
        let cardList = requestData.data.data;

        return {
            data: cardList,
            total: requestData.data.total
        };
    } catch (e) {
        console.log(e);
        return [];
    }
}
/**
 * @method deleteCard 删除删除
 * @param {number} id 删除闪卡的id
 */
const deleteCard = async (id: number) => {
    try {
        let apiInfo = apiList.delete;
        apiInfo.url = apiInfo.url;
        let requestData = await axios({
            method: Reflect.get(apiInfo, 'method'),
            url: apiInfo.url,
            data: {
                id
            }
        });
        let status = requestData.data.status;

        return status;
    } catch (e) {
        console.log(e);
        return false;
    }
}



export {
    submitData,
    getData,
    deleteCard,
    handleUpdateData
}