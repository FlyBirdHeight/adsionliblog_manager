import axios from 'axios';
const apiList = {
    rename: {
        file: {
            url: "/api/file/image/update/rename",
            method: "PUT"
        },
        directory: {
            url: "/api/file/files/update/rename",
            method: "PUT"
        },
    },
    deleteData: {
        file: {
            url: "/api/file/image/delete",
            method: "DELETE"
        },
        directory: {
            url: "/api/file/files/delete",
            method: "DELETE"
        },
    },
    editPath: {
        file: {
            url: "/api/file/image/update/path",
            method: "PUT"
        },
        directory: {
            url: "/api/file/files/update/path",
            method: "PUT"
        },
    },
    createDirectory: {
        url: "/api/file/files/create",
        method: "POST"
    }
}

/**
 * @method rename 修改文件/目录名称
 * @param {string} type 文件类型
 * @param {{id: number, name: string}} options 重命名相关数据内容
 */
const rename = async (type: string = 'file', options: { id: number, name: string, oldName: string }) => {
    try {
        let apiInfo = Reflect.get(apiList.rename, type);
        let responseData = await axios({
            method: apiInfo.method,
            url: apiInfo.url,
            data: options
        })

        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}
/**
 * @method deleteData 删除文件/目录
 * @param {string} type 文件类型
 * @param {number} id 删除内容的id
 */
const deleteData = (type: string, id: number) => {

}
/**
 * @method deleteData 修改文件/目录位置
 * @param {string} type 文件类型
 * @param {{id: number, path: string}} options 路径内容
 */
const editPath = (type: string, options: { id: number, path: string }) => {

}
/**
 * @method createDirectory 创建文件目录
 * @param {{path: string, name: string}} options 目录内容
 */
const createDirectory = (options: { path: string, name: string }) => {

}

export {
    rename,
    deleteData,
    editPath,
    createDirectory
}