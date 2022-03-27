import axios from "axios"
interface CategoryForm {
    name: string,
    id?: number,
    des?: string,
    is_show?: boolean,
    is_recommend?: boolean,
    sort?: number
}
interface TagForm {
    name: string,
    des?: string,
    is_show?: boolean,
    sort?: number
}

const validateName = {
    type: 'string',
    required: true,
    message: '请输入分类名称',
    trigger: 'blur',
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
const insertTag = function (val: TagForm): Promise<any> {
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

const deleteCategory = function (val: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        axios({
            method: "delete",
            url: "/api/page/tag_category/delete/category",
            data: {
                id: val
            }
        }).then(res => {
            resolve(res.data.status)
        }).catch(error => {
            reject(error)
        })
    })
}
const deleteTag = function (val: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        axios({
            method: "delete",
            url: "/api/page/tag_category/delete/tag",
            data: {
                id: val
            }
        }).then(res => {
            resolve(true)
        }).catch(error => {
            console.log(error);
            reject(error)
        })
    })
}

const getInfo = function (type: string, id: number) {
    return new Promise<any>((resolve, reject) => {
        let url = '/api/page/tag_category/getInfo/';
        if (type == 'category') {
            url += 'category/' + id;
        } else {
            url += 'tag/' + id;
        }
        axios.get(url).then(res => {
            if (res.data.status) {
                resolve(res.data.data)
            } else {
                reject('未查询到该数据id内容')
            }
        }).catch(e => {
            reject(e)
        })
    })
}

const update = function (data: CategoryForm, type: string = 'category') {
    console.log(data);
    return new Promise((resolve, reject) => {
        let url = "/api/page/tag_category/update/" + type;
        axios({
            method: "put",
            url: url,
            data: data,
        }).then(res => {
            resolve(res);
        }).catch(error => {
            reject(error)
        })
    })
}

export {
    TagForm,
    CategoryForm,
    validateName,
    insertCategory,
    deleteCategory,
    deleteTag,
    insertTag,
    getInfo,
    update
}