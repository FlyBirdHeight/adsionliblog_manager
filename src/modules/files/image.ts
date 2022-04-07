import axios from 'axios';

interface ImageList {
    src: string,
    name: string,
    created_at: string,
    use_count: number,
    url?: string,
    path?: string
}

interface SelectImage {
    count: number,
    orderBy: {
        attribute: string,
        sort: string
    }
}

const getMaxUse = (count: number) => {
    return getList({
        count: count,
        orderBy: {
            attribute: "use_count",
            sort: "desc"
        }
    });
}

const getCurrent = (count: number) => {
    return getList({
        count: count,
        orderBy: {
            attribute: "created_at",
            sort: "desc"
        }
    })
}

const getList = (option: SelectImage) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "post",
            url: "/api/file/image/list",
            data: option
        }).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}


export {
    ImageList,
    getMaxUse,
    getCurrent
}