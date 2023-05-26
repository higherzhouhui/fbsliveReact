import request from "./server";

//申请领取
const giftApply = data => request('/center-client/activity/gift/apply', 'POST', data)
//领取记录
const giftGetParticipateRecord = data => request('/center-client/activity/gift/getParticipateRecord', 'POST', data)
//活动信息
const giftInfo = data => request('/center-client/activity/gift/info', 'GET', data)


export {
    giftApply,
    giftGetParticipateRecord,
    giftInfo
}