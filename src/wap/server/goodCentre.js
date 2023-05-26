import request from "./server";

//福利中心 活动配置-new  查看code 10000(交易记录) 20000（投注记录） 30000 （消费记录） 40000 （时间查询）

const activityConfig = data => request('/center-client/user/handsel/activity/activityConfig', 'get', data)

//用户资产详情记录-new
const queryCenterUserHandselActivityRecord = data => request('/center-client/user/handsel/activity/queryCenterUserHandselActivityRecord', 'post', data)

//福利中心列表

export { activityConfig, queryCenterUserHandselActivityRecord }
