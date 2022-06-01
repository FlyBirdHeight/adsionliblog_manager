import axios from 'axios';
import { DailySetting } from '@/modules/type/daily_learning';
const apiList = {
    hasPlan: {
        method: "GET",
        url: "/api/daily/learning/today/has"
    },
    getTodayPlan: {
        method: "GET",
        url: "/api/daily/learning/today/plan"
    },
    settingPlan: {
        method: "POST",
        url: "/api/daily/learning/today/setting"
    }
}
/**
 * @method hasPlan 判断当日是否已经新建计划
 * @return {boolean}
 */
const hasPlan = async () => {
    try {
        let apiInfo = apiList.hasPlan;
        let requestData = await axios({
            method: Reflect.get(apiInfo, 'method'),
            url: apiInfo.url
        })

        return requestData.data.status;
    } catch (e) {
        console.log(e)
    }
}

/**
 * @method getTodayPlan 获取当日计划
 */
const getTodayPlan = async () => {
    try {
        let apiInfo = apiList.hasPlan;
        let requestData = await axios({
            method: Reflect.get(apiInfo, 'method'),
            url: apiInfo.url
        })
        return requestData.data.data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * @method settingPlan 设置计划
 * @param {DailySetting} plan 计划内容
 */
const settingPlan = async (plan: DailySetting) => {
    try {
        let apiInfo = apiList.settingPlan;
        let requestData = await axios({
            method: Reflect.get(apiInfo, 'method'),
            url: apiInfo.url,
            data: plan
        })
        return requestData.data.status;
    } catch (e) {
        console.log(e);
    }
}


export {
    hasPlan,
    getTodayPlan,
    settingPlan
}