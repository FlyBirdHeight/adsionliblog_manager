import { DateSetting } from '@/plugin/daily/setting';
import axios from 'axios';
const getStatusList = async (status: number, page: number, count: number) => {
    let returnData: DateSetting[] = [];
    returnData = await new Promise<DateSetting[]>((resolve, reject) => {
        axios({
            method: "GET",
            url: `/api/daily/statusList?status=${status}&page=${page}&count=${count}`
        }).then(res => {
            if (res.data.data.length != 0) {
                for (let v of res.data.data) {
                    v.start_time = v.start_time.substr(0, 10)
                    v.end_time = v.end_time.substr(0, 10)
                }
                resolve(res.data.data)
            } else {
                resolve([])
            }
        }).catch(e => {
            console.log(e)
            reject(e)
        });
    })

    return returnData;
}

export {
    getStatusList
}