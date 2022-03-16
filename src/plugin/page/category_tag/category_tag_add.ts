import axios from "axios"
interface CategoryForm {
    name: string,
    des?: string,
    is_show?: boolean,
    is_recommend?: boolean,
    sort?: number
}

const validateName = {
    type: 'string',
    required: true,
    message: '请输入分类名称',
    trigger: 'change',
}

const insertCategory = function (val: CategoryForm): Promise<any> {
    return new Promise((resolve, reject) => {
        axios({
            method: "post",
            url: `/api/page/tag_category/create/category`,
            data: val
        }).then(res => {
            resolve(res);
        }).catch(error => {
            reject(error)
        })
    })
}

export {
    CategoryForm,
    validateName,
    insertCategory
}