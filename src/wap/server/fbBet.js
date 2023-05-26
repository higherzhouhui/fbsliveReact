import request from "./server";

//获取赛事列表
const getBetMatchList = (data) => {
  return request("/fb-client/user/fbGame/match/list", 'POST', data)
}


// 获取单个赛事详情及玩法
const getBetMatchDetail = (data) => {
  return request("/fb-client/user/fbGame/match/detail", 'POST', data)
}


// 获取单个赛事详情及玩法
const fbBet = (data) => {
  return request("/fb-client/user/fbGame/singlePass", 'POST', data)
}

// 获取单个赛事详情及玩法
const collectBet = (data) => {
  return request("/fb-client/collect/save", 'POST', data)
}

const getOtherUrl = () => {
  return request("/fb-client/user/fbGame/match/getUrl", 'POST', {})
}

// 获取收藏列表
const getCollectList = () => {
  return request("/fb-client/collect/getList", 'POST', {})
}

//获取fb投注列表
const getRecordList = (data) => {
  return request("/fb-client/user/fbGame/betRecord", 'POST', data)
}

const getUnRes = () => {
  return request("/fb-client/user/fbGame/countUnSettle", 'POST', {})
}

//投注钱查询指定玩法
const getBetOdds = (data) => {
  return request("/fb-client/user/fbGame/match/batchBetMatchMarketOfJumpLine", 'POST', data)
}


const getHisTotal = (data) => {
  return request("/fb-client/user/fbGame/statistics", 'POST', data)
}
export {
  getBetMatchList, getBetMatchDetail, fbBet, collectBet, getOtherUrl, getCollectList, getRecordList, getUnRes, getBetOdds, getHisTotal
}