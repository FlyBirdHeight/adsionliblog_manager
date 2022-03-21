import axios from 'axios';
interface DateSetting {
    start_time: string,
    end_time: string,
    type: number,
    creator: string,
    target: string,
    status: number
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
        console.log(e)
    }
}

const getDailyList = (year: number, month: number) => {
    return axios.get(`/api/daily/get?year=${year}&month=${month}`).then(res => {
        console.log(res.data);
    }).catch(error => {
        console.log(error);
    })
}

const handleDailyData = () => {

}


export {
    DateSetting,
    DateType,
    getMonth,
    DateInfo,
    getDailyList,
    getWholeDaily
}