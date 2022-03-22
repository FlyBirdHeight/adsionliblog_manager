import axios from 'axios';
import { formatDate } from '@/utils/date';
interface DateSetting {
    start_time: string,
    end_time: string,
    type: number,
    creator: string,
    target: string,
    status: number
}
interface DateList {
    current: Array<DateSetting>,
    pre: Array<DateSetting>,
    next: Array<DateSetting>
}
interface DateInfo {
    currentYear: number,
    currentMonth: number,
    preYear?: number,
    preMonth?: number,
    nextMonth?: number,
    nextYear?: number,
}

enum DateType {
    NORMAL = 0,
    LEARNING = 1,
    LEETCODE = 2,
    URGENT = 3,
    FAMILY = 4,
    TRAVEL = 5,
    PALYING = 6,
    WIFE = 7,
}

const getMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const preMonth = month == 1 ? 12 : month - 1;
    const preYear = month == 1 ? (year - 1) : year;
    const nextMonth = month == 12 ? 1 : month + 1;
    const nextYear = month == 1 ? (year + 1) : year;

    return {
        currentYear: year,
        currentMonth: month,
        preYear,
        preMonth,
        nextMonth,
        nextYear
    }
}
/**
 * @method getWholeDaily 获取当前、上、下三个月的日程
 * @param {DateInfo} monthList 
 */
const getWholeDaily = async (monthList: DateInfo) => {
    try {
        const current = await getDailyList(monthList.currentYear, monthList.currentMonth);
        const pre = monthList.preYear && monthList.preMonth ? await getDailyList(monthList.preYear, monthList.preMonth) : [];
        const next = monthList.nextYear && monthList.nextMonth ? await getDailyList(monthList.nextYear, monthList.nextMonth) : [];

        return {
            current,
            pre,
            next
        }
    } catch (e) {
        throw e;
    }
}
/**
 * @method getDailyList 获取日程安排列表（按照年、月）
 * @param {number} year 
 * @param {number} month 
 */
const getDailyList = (year: number, month: number) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/daily/get?year=${year}&month=${month}`).then(res => {
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
        })
    })
}
/**
 * @method handleDailyData 处理日程数据
 * @param {DateList} data 
 */
const handleDailyData = (data: DateList, dateMap: Map<string, []>, pre: number[], next: number[]): Array<DateSetting> => {
    const getRange = (startTime: Date, endTime: Date): string[] => {
        let returnData: string[] = [];

        return returnData;
    }
    const handle = (data: DateSetting) => {
        data.start_time = data.start_time.split("T")[0];
        data.end_time = data.end_time.split("T")[0];
        let [sy, sm, sd] = data.start_time.split('-');
        let [ey, em, ed] = data.end_time.split('-');
        console.log([sy, sm, sd], [ey, em, ed])
        //NOTE: 判断一个日期的开始时间和结束时间是否在当前范围内，不在的话，需要进行调整
        sy = Number(sy) > pre[0] ? pre[0].toString() : sy;
        sm = Number(sm) > pre[1] ? pre[1].toString() : sm;
        sd = Number(sm) > pre[1] ? '01' : sd;

        ey = Number(ey) > next[0] ? next[0].toString() : ey;
        em = Number(em) > next[1] ? (next[1] + 1).toString() : em;
        ed = Number(em) > next[1] ? '00' : ed;

        let range = getRange(new Date(Number(sy), Number(sm), Number(sd)), new Date(Number(ey), Number(em), Number(ed)));
    }
    let returnData: Array<DateSetting> = [];
    if (data.pre.length != 0) {
        for (let value of data.pre) {
            handle(value);
            let startDay = value.start_time.substr(value.start_time.length - 2, 2);
            let endDay = value.end_time.substr(value.end_time.length - 2, 2);
            console.log(startDay, endDay)
        }
    }
    if (data.current.length != 0) {
        for (let value of data.current) {
            handle(value);
            let startDay = value.start_time.substr(value.start_time.length - 2, 2);
            let endDay = value.end_time.substr(value.end_time.length - 2, 2);
            console.log(startDay, endDay)
        }
    }
    if (data.next.length != 0) {
        for (let value of data.next) {
            handle(value);
            let startDay = value.start_time.substr(value.start_time.length - 2, 2);
            let endDay = value.end_time.substr(value.end_time.length - 2, 2);
            console.log(startDay, endDay)
        }
    }

    return returnData;
}
/**
 * @method generateDataList 生成当前、上、下三个月对应的Map数据
 */
const generateDataList = (year: number, month: number) => {
    let current = new Date(year, month, 0);
    let pre = new Date(month == 1 ? year - 1 : year, month == 1 ? 12 : month - 1, 0);
    let next = new Date(month == 12 ? year + 1 : year, month == 12 ? 1 : month + 1, 0);
    const currentDate = current.getDate();
    const preDate = pre.getDate();
    const nextDate = next.getDate();
    let dateMap = new Map();
    for (let i = 1; i <= preDate; i++) {
        dateMap.set(formatDate(new Date(pre.getFullYear(), pre.getMonth(), i), "yyyy-MM-dd"), []);
    }
    for (let i = 1; i <= currentDate; i++) {
        dateMap.set(formatDate(new Date(year, month - 1, i), "yyyy-MM-dd"), []);
    }
    for (let i = 1; i <= nextDate; i++) {
        dateMap.set(formatDate(new Date(next.getFullYear(), next.getMonth(), i), "yyyy-MM-dd"), []);
    }

    return dateMap;
}
export {
    DateSetting,
    DateType,
    getMonth,
    DateInfo,
    getDailyList,
    getWholeDaily,
    handleDailyData,
    generateDataList
}