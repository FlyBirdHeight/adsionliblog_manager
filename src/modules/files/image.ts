import axios from 'axios';

interface Image {
    src: string,
    name: string,
    created_at: string,
    use_count: number,
    updated_at: string | undefined,
    url: string,
    path: string,
    size: number,
    id: number,
    directory_id: number,
    download_count: number,
    type: number
}
const getLastestImage = {
    select: "*",
    count: 8,
    where: {
        type: 0
    },
    sort: {
        name: "created_at",
        type: "desc"
    }
}

const getMoreUseImage = {
    select: "*",
    count: 8,
    where: {
        type: 0
    },
    sort: {
        name: "use_count",
        type: "desc"
    }
}

/**
 * @method getMaxUse 获取最多被使用的图片
 */
const getMaxUse = async () => {
    try {
        let resData = await getList(getMoreUseImage);

        return resData;
    } catch (error) {
        console.log(error);
    }
}
/**
 * @method getCurrent 获取最新上传的图片
 */
const getCurrent = async () => {
    try {
        let resData = await getList(getLastestImage);

        return resData;
    } catch (error) {
        console.log(error);
    }
}

const getList = (option: any) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "post",
            url: "/api/file/image/get/list",
            data: option
        }).then(res => {
            resolve(res.data.data)
        }).catch(e => {
            reject(e)
        })
    })
}
/**
 * @method getDownLoadImage 获取下载图片
 * @param {number} id 图片id 
 */
const getDownLoadImage = (id: number) => {
    return axios({
        method: "get",
        url: "/api/file/image/download?id=" + id,
        responseType: 'blob'
    })
}
/**
 * @method downloadFile 下载文件
 * @param {*} file 文件数据
 * @param {string} fileName 图片名称
 */
const downloadFile = (file: any, fileName: string) => {
    let blob = new Blob([file])
    // 生成a标签
    let downloadElement = document.createElement('a')
    // 创建下载的链接
    let href = window.URL.createObjectURL(blob)
    // a的下载链接
    downloadElement.href = href
    // 设置下载后文件名
    downloadElement.download = fileName
    // 添加a标签
    document.body.appendChild(downloadElement)
    // 点击下载
    downloadElement.click()
    // 下载完成移除元素
    document.body.removeChild(downloadElement)
    // 释放掉blob对象
    window.URL.revokeObjectURL(href)
}
export {
    Image,
    getMaxUse,
    getCurrent,
    getDownLoadImage,
    downloadFile
}