/* eslint-disable */
import moment from 'moment'
import { Local } from '../common'

/**
 * 去除重複項
 */
Array.prototype.unique = function () {
    return Array.from(new Set(this))
}

export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
    )
}

export function stampToTimeStr(timestamp, accuracy = 'day') {
    const fmt = {
        day: 'YYYY-MM-DD',
        hour: 'YYYY-MM-DD HH',
        min: 'YYYY-MM-DD HH:mm',
        sec: 'DD-MM-YYYY HH:mm:ss',
    }

    return moment(timestamp).format(fmt[accuracy] || fmt.day)
}

export function numToStrWith2Point(num) {
    return (Math.floor(num * 100) / 100).toFixed(2)
}
export const getLang = language => {
    switch (language) {
        case 'vi':
            return 'YN'
        case 'th':
            return 'THAI'
        case 'zh':
            return 'CN'
        case 'tw':
            return 'TW'
        case 'en':
            return 'EN'
        // case 'vie':
        //     return 'VIE'
    }
    return 'YN'
}
function appStorage(key, val) {
    const k = '__app__'
    if (!Local(k)) {
        Local(k, '{}')
    }
    const data = JSON.parse(Local(k) || '{}')

    if (val === undefined) {
        return data[key]
    }

    data[key] = val
    Local(k, JSON.stringify(data))
    return val
}


export const getOrSetVal = (k, val) => {
    return val === undefined ? appStorage(k) : appStorage(k, val)
}

export function authorization(token) {
    if (token) {
        Local('token2', token)
    }
    return getOrSetVal('authorization', token)
}

export function userInfo(info) {
    return getOrSetVal('user-info', info) || {}
}

export function isLogin() {
    return !!authorization()
}

export function cleanUserInfo() {
    Local('token2', '')
    authorization('')
    userInfo({})
}


export function userAgent() {
    const ua = window.navigator.userAgent
    if (ua.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/)) {
        if (/iPhone|iPad|iPod/.test(ua)) {
            return 'ios'
        } else if (/Android/.test(ua)) {
            return 'android'
        }
    } else {
        return 'PC';
    }
}
export function freeTime(value, g = 'y-m-d') {
    let time = new Date(Number(value))
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let i = time.getMinutes()
    let s = time.getSeconds()
    return g.replace('y', y).replace('m', m > 9 ? m : '0' + m).replace('d', d > 9 ? d : '0' + d).replace('h', h > 9 ? h :
        '0' + h).replace('i', i > 9 ? i : '0' + i).replace('s', s > 9 ? s : '0' + s)
}

// 在数组中,随机生成多少个 arr,count
export function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

export function getUrlDomain() {
    return window.location.protocol + '//' + window.location.host
}




export function formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + theTime <= 9 ? `0${parseInt(theTime)}` : parseInt(theTime);
    if (theTime1 > 0) {
        console.log(theTime1, "theTime1")
        result = theTime1 <= 9 ? `0${parseInt(theTime1)}` : parseInt(theTime1) + ":" + result;
    }
    return result;
}
//转意符换成普通字符
function convertIdeogramToNormalCharacter(val) {
    const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return val.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}


export const getPlainText = (richCont) => {
    const str = richCont;
    let value = richCont;
    if (richCont) {
        // 方法一： 
        value = value.replace(/\s*/g, "");  //去掉空格
        value = value.replace(/<[^>]+>/g, ""); //去掉所有的html标记
        value = value.replace(/↵/g, "");     //去掉所有的↵符号
        value = value.replace(/[\r\n]/g, "") //去掉回车换行
        value = value.replace(/&nbsp;/g, "") //去掉空格
        value = convertIdeogramToNormalCharacter(value);
        return value;
    } else {
        return null;
    }
}

export const getParams = (url) => {
    const res = {}
    if (url.includes('?')) {
        const str = url.split('?')[1]
        const arr = str.split('&')
        arr.forEach(item => {
            const key = item.split('=')[0]
            const val = item.split('=')[1]
            res[key] = decodeURIComponent(val) // 解码
        })
    }
    return res
}

export function Money(value, num) {
    num = num > 0 && num <= 20 ? num : 2;
    value = parseFloat((value + "").replace(/[^\d.-]/g, "")).toFixed(num) + ""; //将金额转成比如 123.45的字符串
    var valueArr = value.split(".")[0].split("").reverse() //将字符串的数变成数组
    const valueFloat = value.split(".")[1]; // 取到 小数点后的值
    let valueString = "";
    for (let i = 0; i < valueArr.length; i++) {
        valueString += valueArr[i] + ((i + 1) % 3 == 0 && (i + 1) != valueArr.length ? "," : ""); //循环 取数值并在每三位加个’,’
    }
    const money = valueString.split("").reverse().join("") + "." + valueFloat; //拼接上小数位
    return money
}