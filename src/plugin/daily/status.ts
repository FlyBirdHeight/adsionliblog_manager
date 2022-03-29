import { DateSetting, DateStatus } from '@/plugin/daily/setting';
import { formatDate } from '@/utils/date';
import axios from 'axios';

interface UpdateDaily {
    id: number,
    status?: number,
    real_end_time?: string,
    is_advance?: number,
    advance_time?: string,
    target?: string,
    send_email?: number,
    email_address?: string,
    overtime_date?: string,
    daily_range?: number
}

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
/**
 * @method handleOvertime 处理延期日程
 * @param {number} id 延期日程id
 * @param {string} time 延期完成时间
 */
const handleOvertime = (id: number, time: string) => {
    return updateData(id, DateStatus.OVERTIME, { overtime_date: time })
}
/**
 * @method compareDaily 比较日期大小
 * @param {string} date1 
 * @param {string} date2 
 */
const compareDaily = (date1: string, date2: string) => {
    return Number(date1.split('-').join('')) <= Number(date2.split('-').join(''))
}
/**
 * @method updateData 更新日程状态
 * @param {number} id 日程id 
 * @param {number} status 日程状态
 * @param {}
 */
const updateData = (id: number, status: number, option: any = {}) => {
    let updateData: UpdateDaily = {
        id,
        status
    }
    if (Reflect.ownKeys(option).length != 0) {
        updateData = Object.assign(option, updateData)
    }
    if (status === DateStatus.ENDING) {
        updateData['real_end_time'] = formatDate(new Date(), "yyyy-MM-dd");
    }

    return new Promise((resolve, reject) => {
        axios({
            method: "put",
            url: "/api/daily/update",
            data: updateData
        }).then(res => {
            resolve(res);
        }).catch(error => {
            console.log(error);
            reject(error);
        })
    })
}
/**
 * @method advancedDaily 提前开始
 * @param {number} id 日程id 
 */
const advancedDaily = (id: number) => {
    return updateData(id, DateStatus.RUNNING, { is_advance: 1, advance_time: formatDate(new Date(), "yyyy-MM-dd") })
}

export {
    getStatusList,
    updateData,
    advancedDaily,
    handleOvertime,
    compareDaily
}