/**
 * @method getCutSize 将字节数目，按3个一个添加,号
 * @param {string|number} size
 */
const getCutSize = (size: string | number) => {
    let returnData = []
    let count = 0
    for (let i = String(size).length - 1; i >= 0; i--) {
        count++
        if (count == 3) {
            returnData.unshift(String(size).substr(i, 3))
            count = 0
            continue
        }
    }
    if (count != 0) {
        returnData.unshift(String(size).substr(0, count))
    }
    return returnData.join(',')
}

/**
 * @method getImageIcon 获取描述文件图片
 * @param {string} fileType 文件类型
 */
const getImageIcon = (fileType: string) => {
    switch (fileType) {
        case 'directory':
            return '/images/directory.png'
        case 'image':
            return '/images/image.png'
        case 'page':
            return '/images/page.png'
    }
}
/**
 * @method getShowSize 获取显示大小
 * @param {number} size 文件大小
 */
const getShowSize = (size: number) => {
    if (size < 1024) {
      return (Number(size) / 1024).toFixed(2) + 'KB'
    } else if (size < Math.pow(1024, 2)) {
      return Math.ceil(Number(size) / Math.pow(1024, 1)) + 'KB'
    } else if (size < Math.pow(1024, 3)) {
      return Math.ceil(Number(size) / Math.pow(1024, 2)) + 'MB'
    } else if (size < Math.pow(1024, 4)) {
      return Math.ceil(Number(size) / Math.pow(1024, 3)) + 'GB'
    } else if (size < Math.pow(1024, 5)) {
      return Math.ceil(Number(size) / Math.pow(1024, 4)) + 'TB'
    }
  }

export {
    getCutSize,
    getImageIcon,
    getShowSize
}