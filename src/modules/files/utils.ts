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
    getInfo: {
        file: {
            url: "/api/file/image/get/info",
            method: 'GET'
        },
        directory: {
            url: "/api/file/files/get/infoById",
            method: 'GET'
        }
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
    },
    verifyHasDirectory: {
        url: "/api/file/files/get/info",
        method: "POST",
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
    } catch (e) {
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
/**
 * @method getInfo 获取详情
 * @param {number} id 
 * @param {string} type
 */
const getInfo = async (id: number, type: string) => {
    try {
        let apiInfo = Reflect.get(apiList.getInfo, type);
        let responseData = await axios({
            method: apiInfo.method,
            url: apiInfo.url + `?id=${id}`,
        })

        return responseData.data.data
    } catch (e) {
        console.log(e);
        throw e;
    }
}

/**
 * @method verifyHasDirectory 验证当前目录下是否存在同名文件
 * @param {number} parent_id 父级Id
 * @param {string} name 文件夹名称
 */
const verifyHasDirectory = async (parent_id: number, name: string) => {
    try {
        let apiInfo = apiList.verifyHasDirectory;
        let isExist = await axios({
            method: 'POST',
            url: apiInfo.url,
            data: {
                where: {
                    parent_id: parent_id,
                    name: name
                }
            }
        })
        if (isExist.data.data.length != 0) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(e);
        throw e;
    }
}
export {
    rename,
    deleteData,
    editPath,
    createDirectory,
    getInfo,
    verifyHasDirectory
}