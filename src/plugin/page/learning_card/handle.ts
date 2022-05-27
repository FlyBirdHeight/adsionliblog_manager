import { EditCardFold, CardFoldQuestion } from "@/modules/type/cardFold";
import axios from 'axios';
import { toRaw } from 'vue';
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
    },
    submitUpdateData: {
        addQuestion: {
            method: "POST",
            url: "/api/page/question/create"
        },
        deleteQuestion: {
            method: "DELETE",
            url: "/api/page/question/delete"
        },
        updateQuestion: {
            method: "PUT",
            url: "/api/page/question/update"
        },
        updateCard: {
            method: "PUT",
            url: "/api/page/learning_card/edit"
        }
    }
}

/**
 * @method handleUpdateData 处理更新数据, 这里需要比较一下，哪一些问题需要被更新，减少后端更新数量
 * @param {CardFoldQuestion[]} oldData 
 * @param {EditCardFold} newData 
 */
const handleUpdateData = async (oldData: CardFoldQuestion[], newData: EditCardFold) => {
    let oldQuestion = oldData;
    let newQuestion = newData.questions;
    let editQuestion = [];
    let addQuestion = [];
    let deleteQuestion: number[] = [];
    for (let i = 0; i < newQuestion.length; i++) {
        if (!Reflect.has(newQuestion[i], 'id')) {
            addQuestion.push(toRaw(newQuestion[i]));
            continue;
        }
        let index = oldQuestion.findIndex(v => v.id === newQuestion[i].id);
        if (index !== -1) {
            if (oldQuestion[index].solution === newQuestion[i].solution && oldQuestion[index].title === newQuestion[i].title) {
                continue
            }
            editQuestion.push(toRaw(newQuestion[i]));
        }
    }
    let newDataIdList = newData.questions.map(v => {
        if (!Reflect.has(v, 'id')) {
            return 0;
        }
        return v.id
    }).filter(v => v != 0);
    let oldDataIdList: number[] = oldQuestion.map(v => Number(v.id));
    deleteQuestion = oldDataIdList.filter(v => !newDataIdList.includes(v));
    let status = await submitUpdateData(Object.assign({}, newData), deleteQuestion, editQuestion, addQuestion);
    return status;
}
/**
 * @method submitUpdateData 提交需要更新的闪卡
 * @param {EditCardFold} updateCardData 
 * @param {number[]} deleteQuestion 等待删除的问题
 * @param {CardFoldQuestion[]} addQuestion 新增的问题
 * @param {CardFoldQuestion[]} editQuestion 修改的问题
 */
const submitUpdateData = async (updateCardData: EditCardFold, deleteQuestion: number[], editQuestion: CardFoldQuestion[], addQuestion: CardFoldQuestion[]) => {
    updateCardData.question_count = updateCardData.questions.length;
    let apiInfo = apiList.submitUpdateData;
    Reflect.deleteProperty(updateCardData, 'questions');
    let requestList = [];
    if (deleteQuestion.length != 0) {
        requestList.push({
            info: apiInfo.deleteQuestion,
            data: deleteQuestion
        })
    }
    if (editQuestion.length != 0) {
        requestList.push({
            info: apiInfo.updateQuestion,
            data: editQuestion
        });
    }
    if (addQuestion.length != 0) {
        requestList.push({
            info: apiInfo.addQuestion,
            data: addQuestion.map(v => {
                v.learning_card_id = updateCardData.id;
                return v;
            })
        })
    }
    requestList.push({
        info: apiInfo.updateCard,
        data: updateCardData
    });
    requestList = requestList.map(v => {
        return axios({
            method: Reflect.get(v.info, 'method'),
            url: v.info.url,
            data: v.data
        })
    })
    let requestData = await Promise.all(requestList);
    let updateStatus = false;
    for (let v of requestData) {
        if (!v.data.status) {
            return updateStatus;
        }
    }

    return true;
}
/**
 * @method submitData 提交创建或修改给后端
 * @param {string} type 类型: add update 
 * @param {CardFoldQuestion[]} data 提交过来的数据
 */
const submitData = async (type: string, data: EditCardFold, oldData?: CardFoldQuestion[]) => {
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
        let apiInfo = Object.assign({}, Reflect.get(apiList.getData, type));
        if (type === 'info') {
            apiInfo.url = apiInfo.url + `?id=${options.id}`;
        } else {
            apiInfo['data'] = options;
        }
        let requestData = await axios(apiInfo);
        let cardList = requestData.data.data;
        if (type === 'info') {
            return cardList;
        }

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