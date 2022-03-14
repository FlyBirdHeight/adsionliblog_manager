import axios from "axios"
//简略的文章列表
interface PageList {
    id: number,
    title: string,
    created_at: string,
    is_show: boolean
}
//文章列表
interface CategoryList {
    id: number,
    name: string,
    page_count: number,
    is_show: boolean,
    is_recommend: boolean,
    created_at: string,
    pageList?: PageList[]
}
//标签列表
interface TagList {
    id: number,
    name: string,
    page_count: number,
    is_show: boolean,
    created_at: string,
    pageList?: PageList[]
}
/**
 * @method getCategoryList 获取分类列表
 * @param {number} page 
 * @param {number} count
 * @returns {Promise<CategoryList[]>} 
 */
const getCategoryList = function (page: number, count: number): Promise<CategoryList[]> {
    let categroyList: CategoryList[] = [];
    return new Promise<CategoryList[]>((resolve, reject) => {
        axios.get(`/api/page/tag_category/get/categoryList?page=${page}&count=${count}`).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error)
        })
    });
}

/**
 * @method getTagList 获取标签列表
 * @param {number} page 
 * @param {number} count
 * @returns {Promise<TagList[]>} 
 */
const getTagList = function (page: number, count: number): Promise<TagList[]> {
    let tagList: TagList[] = [];

    return new Promise<TagList[]>((resolve, reject) => {
        axios.get(`/api/page/tag_category/get/tagList?page=${page}&count=${count}`).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error)
        })
    });
}



export { CategoryList, TagList, getCategoryList, getTagList }