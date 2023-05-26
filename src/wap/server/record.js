import request from "./server";

//获取查询资产名称类型-new  查看code 10000(交易记录) 20000（投注记录） 30000 （消费记录） 40000 （时间查询）
const queryAssetTypeList = data => request('/center-client/sys/user/queryAssetTypeList', 'get', data)

//用户资产详情记录-new
const queryUserAssetList = data => request('/center-client/sys/user/queryUserAssetList', 'post', data)

//用户资产详情记录-统计
const queryUserAssetCount = data => request('/center-client/sys/user/queryUserAssetCount', 'post', data)

export { queryAssetTypeList, queryUserAssetList, queryUserAssetCount }
