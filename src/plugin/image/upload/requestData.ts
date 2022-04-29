import axios from 'axios';
const findPathList = {
    select: 'id, full_path as path',
    where: {
        full_path: {
            type: 'like',
            data: '%%',
        }
    },
}
/**
 * @method getFilePath 获取文件夹列表
 */
const getFilePath = async () => {
    let fullPath: { path: string, id: number }[] = []
    fullPath = await getInfo(findPathList);
    if (fullPath.length == 0) {
        return []
    }
    return fullPath.map(v => {
        if (v.id == 1) {
            return {
                value: "/",
                id: v.id
            }
        }
        return {
            value: v.path.replace('/file', ''),
            id: v.id
        };
    })
}
/**
 * @method getInfo 获取文件信息
 * @param {*} options 检索条件 
 */
const getInfo = async (options: any) => {
    try {
        let resData = await axios({
            method: "post",
            url: "/api/file/files/get/info",
            data: options
        });
        let returnData = resData.data.data;
        return returnData;
    } catch (e) {
        console.log(e);
    }
}


export {
    getFilePath
}