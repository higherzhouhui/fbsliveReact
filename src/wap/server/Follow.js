import request from "./server";

//获取关注列表
const followList = data => request('/center-client/sys/user/follow/list', 'POST', data)

// 关注/取关
const liveFollow = data => request('/center-client/live/follow', 'POST', data)
export {
    followList,
    liveFollow
}
