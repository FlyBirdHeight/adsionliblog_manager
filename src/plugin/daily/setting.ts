import axios from 'axios';
import { formatDate } from '@/utils/date';
/**
 * @interface DateSetting 后端取回数据的数据格式，也被用于前端展示的时候的数据格式
 */
interface DateSetting {
    start_time: string,
    end_time: string,
    type: number,
    creator: string,
    target: string,
    status: number
}
/**
 * @interface DateInfo 在日历展示页中，需要记录当前月，上一月、下一月的日期的数据格式
 */
interface DateInfo {
    currentYear: number,
    currentMonth: number,
    preYear: number,
    preMonth: number,
    nextMonth: number,
    nextYear: number,
}

/**
 * @enum DateType 枚举类，用来枚举日程类型
 */
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
/**
 * @enum DateStatus 枚举类，用来枚举日程状态
 */
enum DateStatus {
    READY = 0,
    RUNNING = 1,
    OVERTIME = 2,
    ENDING = 3,
    NOTSTART = 4,
}

const getType = (val: number): { type: string, color: string } => {
    let type: string = '';
    let color: string = '';
    switch (val) {
        case DateType.NORMAL:
            type = '普通事件';
            color = '#00a4e4';
            break;
        case DateType.LEARNING:
            type = '学习事件';
            color = '#6a737b';
            break;
        case DateType.LEETCODE:
            type = '刷题事件';
            color = '#8a7967';
            break;
        case DateType.URGENT:
            type = '加急事件';
            color = '#ff0000';
            break;
        case DateType.FAMILY:
            type = '家庭事件';
            color = '#fd5c63';
            break;
        case DateType.TRAVEL:
            type = '出行事件';
            color = '#c1d82f';
            break;
        case DateType.PALYING:
            type = '娱乐事件';
            color = '#ffdd00';
            break;
        case DateType.WIFE:
            type = '猪哥事件';
            color = '#fbb034';
            break;
    }
    return { type, color };
}
/**
 * @method getStatus 获取列表状态
 * @param val 状态码
 */
const getStatus = (val: number): { type: string, color: string } => {
    let type = '';
    let color = '';
    switch (val) {
        case DateStatus.READY:
            type = '未确认';
            color = '#fdbd10'
            break;
        case DateStatus.RUNNING:
            type = '进行中';
            color = '#0066b2';
            break;
        case DateStatus.OVERTIME:
            type = '已延期';
            color = '#ec1c24';
            break;
        case DateStatus.ENDING:
            type = '已完成';
            color = '#00d1b2';
            break;
        case DateStatus.NOTSTART:
            type = '未开始';
            color = "rgb(110, 7, 228)";
    }
    return {
        type,
        color
    };
}
/**
 * @method getMonth 获取当前日期列表月份
 * @param {number} year 当前年份
 * @param {number} month 当前月份
 */
const getMonth = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    const cyear = date.getFullYear();
    const cmonth = date.getMonth() + 1;
    const preMonth = cmonth == 1 ? 12 : cmonth - 1;
    const preYear = cmonth == 1 ? (cyear - 1) : cyear;
    const nextMonth = cmonth == 12 ? 1 : cmonth + 1;
    const nextYear = cmonth == 1 ? (cyear + 1) : cyear;

    return {
        currentYear: cyear,
        currentMonth: cmonth,
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
        const data = await getDailyList(monthList.preYear, monthList.preMonth, monthList.nextYear, monthList.nextMonth);

        return data;
    } catch (e) {
        throw e;
    }
}
/**
 * @method getDailyList 获取日程安排列表（按照年、月）
 * @param {number} year 
 * @param {number} month 
 */
const getDailyList = (py: number, pm: number, ny: number, nm: number) => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/daily/get?py=${py}&pm=${pm}&ny=${ny}&nm=${nm}`).then(res => {
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
        })
    })
}
/**
 * @method handleDailyData 处理日程数据
 * @param {DateSetting[]} data 
 */
const handleDailyData = (data: DateSetting[], dateMap: Map<string, []>, pre: number[], next: number[]) => {
    const getRange = (startTime: Date, endTime: Date): string[] => {
        let returnData: string[] = [];
        let arr: number[] = [];
        const s: number = startTime.getTime() - 24 * 60 * 60 * 1000;
        const d: number = endTime.getTime() - 24 * 60 * 60 * 1000;
        for (let i = s; i <= d;) {
            i = i + 24 * 60 * 60 * 1000;
            arr.push(i)
        }

        // 获取每一天的时间  YY-MM-DD
        for (let j in arr) {
            let time = new Date(arr[j]);
            let year = time.getFullYear();
            let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1));
            let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate());
            let YYMMDD = year + '-' + mouth + '-' + day;
            returnData.push(YYMMDD)
        }

        return returnData;
    }
    const handle = (data: DateSetting) => {
        data.start_time = data.start_time.split("T")[0];
        data.end_time = data.end_time.split("T")[0];
        let [sy, sm, sd] = data.start_time.split('-');
        let [ey, em, ed] = data.end_time.split('-');

        //NOTE: 判断一个日期的开始时间和结束时间是否在当前范围内，不在的话，需要进行调整
        sd = Number(sy) <= pre[0] && Number(sm) < pre[1] ? '1' : sd;
        sm = Number(sy) <= pre[0] && Number(sm) < pre[1] ? pre[1].toString() : sm;
        sy = Number(sy) < pre[0] ? pre[0].toString() : sy;

        ed = Number(ey) >= next[0] && Number(em) > next[1] ? '0' : ed;
        em = Number(ey) >= next[0] && Number(em) > next[1] ? (next[1] + 1).toString() : em;
        ey = Number(ey) > next[0] ? next[0].toString() : ey;

        let range = getRange(new Date(Number(sy), Number(sm) - 1, Number(sd)), new Date(Number(ey), Number(em) - 1, Number(ed)));

        return range;
    }

    if (data.length != 0) {
        for (let value of data) {
            let range = handle(value);
            if (range.length != 0) {
                for (let v of range) {
                    if (!dateMap.has(v)) {
                        continue
                    }
                    let data: any = dateMap.get(v);
                    data[value.status.toString()].push(value);
                    data.length += 1;
                    dateMap.set(v, data);
                }
            }
        }
    }
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
        dateMap.set(formatDate(new Date(pre.getFullYear(), pre.getMonth(), i), "yyyy-MM-dd"), {
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "length": 0
        });
    }
    for (let i = 1; i <= currentDate; i++) {
        dateMap.set(formatDate(new Date(year, month - 1, i), "yyyy-MM-dd"), {
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "length": 0
        });
    }
    for (let i = 1; i <= nextDate; i++) {
        dateMap.set(formatDate(new Date(next.getFullYear(), next.getMonth(), i), "yyyy-MM-dd"), {
            "0": [],
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "length": 0
        });
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
    generateDataList,
    getType,
    getStatus
}