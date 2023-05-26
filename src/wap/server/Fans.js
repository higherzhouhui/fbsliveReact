import request from "./server";

//获取粉丝列表
const fansList = data => request('/center-client/sys/user/fans/list', 'POST', data)

// 关注/取关
const liveFollow = data => request('/center-client/live/follow', 'POST', data)

// 批量关注
const batchFollow = data => request('/center-client/live/batchFollow', 'post', data)

export {
    fansList,
    liveFollow,
    batchFollow
}
