const isRequired = (rule: any, value: any, callback: any) => {
    if (typeof value == 'string' && value.replace(/\s/g, '') === '') {
        callback("请输入文件名称，名称不可为空！");
    } else if (typeof value == 'object' && value.value.replace(/\s/g, '') === '') {
        callback("请输入文件路径，路径不可为空！");
    } else {
        callback();
    }
}
/**
 * @property {*} setInfoReg 设置图片信息时的规则
 */
const setInfoReg = {
    name: [
        { validator: isRequired, trigger: "blur" }
    ],
    path: [
        { validator: isRequired, trigger: "blur" }
    ]
}
/**
 * @method getFindPath 获取远程搜索路径
 * @param {string} queryString 搜索词
 * @param {{value:string, id: number}[]} list 搜索表
 */
const getFindPath = (queryString: string, list: { value: string, id: number }[]) => {
    return queryString
        ? list.filter((v) => {
            return v.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        })
        : list
}
/**
 * @method judgeNewPath 判断是否是新的路径
 * @param {string} path 传入路径 
 * @param {{value: string, id: number}[]} list 路径表
 */
const judgeNewPath = (path: string, list: { value: string, id: number }[]) => {
    let returnData: { status: boolean, id?: number } = { status: true }
    list.forEach(v => {
        if (v.value === path) {
            returnData = {
                id: v.id,
                status: false
            };
        }
    })

    return returnData;
}


export {
    setInfoReg,
    getFindPath,
    judgeNewPath
}