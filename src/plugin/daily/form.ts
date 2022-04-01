import { getType } from "./setting"
import axios from 'axios';
enum DateConfig {
    TYPE_COUNT = 8,
    STATUS_COUNT = 5
}
/**
 * @interface DateForm 创建日成的Form表单
 */
interface DateForm {
    start_time: string,
    end_time: string,
    creator: string,
    target: string,
    type: number,
    send_email: number,
    status: number,
    email_address?: string,
    id?: number,
    real_end_time?: string,
    is_advance?: number,
    advance_time?: string,
    overtime_date?: string,
    daily_range?: number
}

const getDailyType = (): Array<{ value: number, label: string, color: string }> => {
    let res: Array<{ value: number, label: string, color: string }> = new Array(DateConfig.TYPE_COUNT);
    for (let i = 0; i < DateConfig.TYPE_COUNT; i++) {
        let label: { type: string, color: string } = getType(i);
        res[i] = {
            value: i,
            label: label.type,
            color: label.color
        }
    }

    return res;
}

const insertDailyForm = (form: DateForm) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            data: form,
            url: "/api/daily/create"
        }).then(res => {
            resolve(res.data);
        }).catch(e => {
            reject(e)
        })
    })
}

const updateDailyForm = (form: DateForm) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'put',
            data: form,
            url: "/api/daily/update"
        }).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    DateForm,
    getDailyType,
    insertDailyForm,
    updateDailyForm
}