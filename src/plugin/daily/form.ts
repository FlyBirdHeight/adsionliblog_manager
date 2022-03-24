import { getType } from "./setting"
import axios from 'axios';
enum DateConfig {
    TYPE_COUNT = 8,
    STATUS_COUNT = 4
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
    email_address?: string
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
    console.log(form)
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

export {
    DateForm,
    getDailyType,
    insertDailyForm
}