const yearArr = ['今天', '明天', '后天'];
const hourArr = ['上午9:00-11:30', '下午2:00-5:00', '晚上7:00-9:30'];

function getYtd(date) {
    // return `${withData(date.getFullYear())}-${withData(date.getMonth() + 1)}-${withData(date.getDate())} ${withData(date.getHours())}:${withData(date.getMinutes())}:${withData(date.getSeconds())}`;
    return `${withData(date.getFullYear())}-${withData(date.getMonth() + 1)}-${withData(date.getDate())}`;
}

// 根据dateTime[0]返回年月日
function getDateTimeYTD(dateTime) {
    let daySecond = 24 * 60 * 60 * 1000;
    let daySecondArr = [
        new Date(new Date().getTime() + daySecond * 0), 
        new Date(new Date().getTime() + daySecond * 1),
        new Date(new Date().getTime() + daySecond * 2)
    ];
    return getYtd(daySecondArr[dateTime[0]]);
}

// 转译
function withData(param) {
    return param < 10 ? '0' + param : '' + param;
}

function getNewDateArry() {
    // 初始数据
    const nowDate = new Date(new Date().getTime() + (30 * 60 * 1000));
    const nowDateTime = nowDate.getTime();
    
    const YTD = getYtd(nowDate);
    const hour1 = new Date(YTD + ' 11:30').getTime();
    const hour2 = new Date(YTD + ' 17:00').getTime();
    const hour3 = new Date(YTD + ' 21:30').getTime();

    let year = yearArr[0],
        hour = '';
    if (nowDateTime < hour1) {
        hour = hourArr[0]
    } else if (nowDateTime < hour2) {
        hour = hourArr[1]
    } else if (nowDateTime < hour3) {
        hour = hourArr[2]
    } else {
        year = yearArr[1],
        hour = hourArr[0];
    }

    return [year, hour];
}

function dateTimePicker() {
    // 返回默认显示的数组和联动数组的声明
    var dateTime = [], dateTimeArray = [[], []];
    // 默认开始显示数据
    var defaultDate = getNewDateArry();
    // 处理联动列表数据
    /*年月日 时分秒*/
    dateTimeArray[0] = yearArr;
    dateTimeArray[1] = hourArr;

    dateTimeArray.forEach((current, index) => {
        dateTime.push(current.indexOf(defaultDate[index]));
    });

    return {
        dateTimeArray: dateTimeArray,
        dateTime: dateTime
    }
}

// 验证
function verify(dateTime) {
    // 明天和后天不需要验证
    if (dateTime[0] > 0) return;

    // 初始数据
    const nowDate = new Date(new Date().getTime() + (30 * 60 * 1000));
    const nowDateTime = nowDate.getTime();
    
    const YTD = getYtd(nowDate);

    const selectArr = [new Date(YTD + ' 11:30').getTime(), new Date(YTD + ' 17:00').getTime(), new Date(YTD + ' 21:30').getTime()];
    
    if (nowDateTime > selectArr[dateTime[1]]) throw '预约时间已超时,请选择下一时间段';
}

module.exports = {
    dateTimePicker: dateTimePicker,
    verify: verify,
    getDateTimeYTD: getDateTimeYTD
}