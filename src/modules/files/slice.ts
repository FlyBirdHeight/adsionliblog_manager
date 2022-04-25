import axios from 'axios';
let SparkMD5 = require('spark-md5');
/**
 * NOTE: 这里主要用来对文件进行分片以及hash的操作
 */
type Deadline = {
    timeRemaining: () => number,
    didTimtout: boolean
}
type UploadFile = {
    file: File,
    sliceFile?: Blob[],
    name: string,
    is_create: boolean,
    directory_id: number | null,
    status: string,
    path: string,
    hash_key?: any,
    isExist: boolean,
    uploadSuccess?: boolean,
    precentage?: number,
}
/**
 * @property {number} maxErrorCount 最大失败次数
 * @property {string} uploadUrl 上传文件url
 * @property {number} freeChannels 空闲通道数
 * @property {number} maxChannels 并发控制最大通道数
 * @property {number} minSliceSize 最小切割文件大小(单位：字节)
 * @property {number} sliceTagSize 切割文件标识大小(单位：字节)
 * @property {number[]} dataSliceNumber 数据分片份数
 */
const maxErrorCount = 3;
const uploadUrl = "/api/file/image/any";
const uploadFormData: string[] = ["file", "name", "is_create", "directory_id", "path", "hash_key"];
const freeChannels = 5;
const maxChannels = 5;
const minSliceSize = 2 * 1024 * 1024;
const sliceTagSize = 2;
const dataSliceNumber = 3;
/**
 * @method hashFile 处理文件hash
 * @param {File} file 待处理文件 
 */
const hashFileList = (file: UploadFile) => {
    return new Promise((resolve, reject) => {
        let taskCount = file.sliceFile?.length || 0;
        let currentTask = 0;
        const spark = new SparkMD5.ArrayBuffer();
        if (taskCount === 0) {
            resolve([]);
        }
        let hashAll = false;
        const doFileHash = async (deadline: Deadline) => {
            while (taskCount > 0 && deadline.timeRemaining() > 1 && !hashAll) {
                let sparkData = await hash(file?.sliceFile![currentTask], currentTask, file.sliceFile?.length || 0)
                currentTask++;
                if (taskCount == 0) {
                    resolve(sparkData)
                    hashAll = true;
                    break;
                }
            }
            if (taskCount > 0 && !hashAll) {
                window?.requestIdleCallback!(doFileHash);
            }
        }
        const hash = (sliceFile: Blob, currentIdx: number, fileSize: number) => {
            return new Promise((resolve, reject) => {
                if (fileSize == 0) {
                    return "";
                }
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(sliceFile);
                fileReader.onload = function (e) {
                    let sliceData = extractDataSlice(e.target?.result, currentIdx, fileSize);
                    if (sliceData.length === 0 && taskCount - 1 != 0) {
                        taskCount--;
                        resolve(null);
                    }
                    sliceData.forEach(v => {
                        spark.append(v);
                    })
                    taskCount--;
                    if (taskCount === 0) {
                        resolve(spark.end())
                    }
                    resolve(null);
                }
            })
        }
        window?.requestIdleCallback!(doFileHash);
    })
}
/**
 * @method sliceFile 切割文件
 * @param {File} file 待处理文件
 * @param {number} size 文件切割大小
 */
const sliceFile = (file: File, size: number = minSliceSize): Blob[] => {
    if (file.size < minSliceSize) {
        return [file];
    }
    const fileChunkList: Blob[] = [];
    let cur = 0;
    while (cur < file.size) {
        if (cur + size > file.size) {
            fileChunkList.push(file.slice(cur, file.size, file.type));
            break;
        }
        fileChunkList.push(file.slice(cur, cur + size, file.type));
        cur += size;
    }

    return fileChunkList;
}

/**
 * @method extractDataSlice 提取数据分片
 * @param {*} data 分片数据 
 * @param {number} currentIdx 当前数据分片下标
 * @param {number} fileSize 文件分片数据大小
 */
const extractDataSlice = (data: any, currentIdx: number, fileSize: number) => {
    if (!data || fileSize === 0) {
        return [];
    }
    //第一段数据分片与第二段数据分片
    if (currentIdx === 0 && fileSize !== 0) {
        return [data];
    } else if (currentIdx === fileSize - 1 && fileSize !== 0 && fileSize > 1) {
        return [data];
    }
    let returnData: ArrayBuffer[] = [];
    let iterations = dataSliceNumber;
    let size = data.byteLength;
    if (size === 0) {
        return [];
    }
    if (size < iterations * sliceTagSize) {
        return [data];
    }
    for (let i = 0; i < iterations - 1; i++) {
        let startPosition = i == 0 ? 0 : Math.ceil(size / i);

        returnData.push(data.slice(startPosition, startPosition + sliceTagSize));
    }
    //NOTE: 这里就是放入一段中间分片时的结尾片段
    returnData.push(data.slice(size - sliceTagSize, size));

    return returnData;
}
/**
 * @method verifyUpload 上传前进行判断，判断文件是否存在
 * @param {string} name 文件名称
 * @param {string} hash 文件hash值
 */
const verifyUpload = (name: string, hash: string): any => {
    return new Promise<boolean>((resolve, reject) => {
        axios({
            method: "post",
            url: "/api/file/image/verify",
            data: {
                name,
                hash
            }
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error)
        })
    })
}
/**
 * @method getFormData 获取上传的form
 * @param {UploadFile} file 等待上传文件
 */
const getFormData = (file: UploadFile): FormData => {
    const formData = new FormData();
    for (let key of uploadFormData) {
        if (!Reflect.has(file, key)) {
            throw new Error("当前文件中存在未指定内容，文件名:" + file.name + "未传入内容:" + key)
        }
        if (key === 'file') {
            formData.append(key, Reflect.get(file, key), file.name);
            continue;
        }
        formData.append(key, Reflect.get(file, key));
    }

    return formData;
}
/**
 * @method mergeFile 当文件全部上传完成之后，就可以进行文件合并了
 * @param {UploadFile} file 等待合并的文件 
 */
const mergeFile = (file: UploadFile) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "post",
            url: "/api/file/image/merge",
            data: {
                name: file.name,
                size: file.file.size,
                path: file.path,
                hash_key: file.hash_key,
                directory_id: file.directory_id,
                is_create: file.is_create
            }
        }).then(res => {
            console.log(res.data);
            resolve(res.data);
        }).catch(error => {
            reject(error)
        })
    })
}
/**
 * @method requestFile 上传文件分片
 * @param {Blob} sliceFile 分片文件数据 
 * @param {number} sliceIdx 分片下标 
 * @param {UploadFile} file 总文件内容 
 * @param {*} errorQueue 等待重传队列
 * @param {number} sliceCount 分片个数
 * @param {number} uploadSuccess 分片上传成功个数
 */
const requestFile = (sliceFile: Blob, sliceIdx: number, file: UploadFile, errorQueue: any, sliceCount: number, uploadSuccess: number): Promise<{ status: boolean, data: any }> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData;
        formData.append('file', sliceFile, `${file.name}_${sliceIdx}`);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.send(formData);
        xhr.responseType = 'json';
        xhr.onload = (e) => {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status < 200 && xhr.status >= 300 || xhr.status != 304) {
                    //NOTE: 如果失败了就放入到失败队列并记录失败次数
                    errorQueue.set(sliceIdx, {
                        errorCount: errorQueue.has(sliceIdx) ? 1 : errorQueue.get(sliceCount).errorCount++,
                        file: sliceFile
                    })
                    reject({
                        status: false,
                        data: xhr.statusText
                    });
                }
                file.precentage = uploadSuccess / sliceCount * 100;
                uploadSuccess++;
                console.log(xhr.responseType);
                console.log(xhr.responseXML);
                console.log(xhr.responseText);
                resolve({
                    status: true,
                    data: xhr.response
                });
            }
        }
    })
}
/**
 * @method uploadFile 上传文件(分片形式)
 * @param {UploadFile} file 等待上传文件
 */
const uploadFile = async (file: UploadFile) => {
    let sliceCount = file.sliceFile?.length || 1;
    let uploadSuccess = 0;
    let sliceFile = file.sliceFile;
    //NOTE: 失败队列，如果分片上传失败，进入此队列，记录失败次数，一旦超过次数，整个文件上传失败，并删除服务器上文件内容
    const errorQueue = new Map();
    //TODO: 创建同步线程，直接发起多重http请求，暂不优化，可以优化
    let requestSlice = sliceFile?.map(async (v, index) => {
        return await requestFile(v, index, file, errorQueue, sliceCount, uploadSuccess);
    });
    await Promise.all(requestSlice || []);
    //NOTE: 这里依然要判断是否上传失败
    let uploadError = false;
    //NOTE: 失败重传队列的执行
    while (errorQueue.size > 0 || !uploadError) {
        for (let [key, value] of errorQueue.entries()) {
            if (value.errorCount >= maxErrorCount) {
                uploadError = true;
                file.precentage = 0;
                break;
            }
            try {
                let status = await requestFile(value.file, key, file, errorQueue, sliceCount, uploadSuccess);
                status.status && errorQueue.delete(key);
            } catch (e) {
                console.log(e);
            }
        }
    }
    if (uploadError) {
        throw new Error(`文件上传失败，文件名称: ${file.name}!`)
    }
    let mergeData = await mergeFile(file);
    return mergeData;
}

/**
 * @method handleAndUpload 处理并上传文件
 * @param {File[]} fileList 文件列表
 */
const handleAndUpload = async (fileList: UploadFile[]) => {
    const fileListSlice = fileList.map(v => {
        v.sliceFile = sliceFile(v.file);
        return v;
    })
    let verifyData = fileListSlice.map(async v => {
        v.hash_key = await hashFileList(v);
        let verifyData = await verifyUpload(v.name, v.hash_key);
        v.isExist = verifyData.exist;
        if (!v.isExist) {
            v.uploadSuccess = false;
            v.precentage = 0;
        } else {
            v.uploadSuccess = true;
            v.precentage = 100;
        }
        return v;
    });
    let uploadData = (await Promise.all(verifyData)).filter(v => {
        v.uploadSuccess == true;
    })
    console.log(uploadData);

    // await uploadData.forEach(async v => {
    //     try {
    //         let responseData = await uploadFile(v);
    //         console.log(v);
    //         console.log(responseData);
    //     } catch (e) {
    //         console.log(e);

    //     }
    // })

    return true;
}



export {
    handleAndUpload
}