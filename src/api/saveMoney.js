import { makeRequest } from '../utils/httpHelper'
//申请领取
const giftApply = data => makeRequest({ url: '/center-client/activity/gift/apply', method: 'post', data })
//领取记录
const giftGetParticipateRecord = data => makeRequest({ url: '/center-client/activity/gift/getParticipateRecord', method: 'post', data })
//活动信息
const giftInfo = data => makeRequest({ url: '/center-client/activity/gift/info', method: 'get', data })
export {
    giftApply,
    giftGetParticipateRecord,
    giftInfo
}