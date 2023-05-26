import request from "./server";

// 在线客服
export const getCserver = (data) => {
  return request(`/config-client/config-client/config/cserver`, "GET", data, true);
};

export const getAgentInfo = (data) => {
  return request(`/agent-server/api/promotionDoMain/getAgentInfo`, "GET", data, true, "/agentApi");
};

//登录
export const getUserInfo = async (data) => {
  const res = await request("/center-client/sys/user/get/info", "POST", data);
  if (!(res instanceof Error)) {
    window.eventBus.emit("store", { type: "freshUserInfo", payload: res });
  }
  return res;
};

/**
 * 关注与取消关注
 * @param {isFollow:true|false} data
 * @returns
 */
export const handleFollow = (data) => {
  return request("/center-client/live/follow", "POST", data);
};
// 查询交易记录的类型
export const GetAssetType = (data) => {
  return request("/center-client/sys/user/asset/getAssetType", "POST", data);
};
// 根据类型/日期 查询交易记录
export const GetRecord = (data) => {
  return request("/center-client/sys/user/asset/record", "POST", data);
};

//投注记录
export const GetGameHisRecord = (data) => request("/lottery-client/lottery/getLotteryTypeHistory", "post", data);

//投注记录详情
export const GetGameHisRecordDetail = (data) => request("/lottery-client/lottery/getLotteryDetailsHistory", "post", data);

// 重置资金密码
export const GetResetCashPwd = (data) => {
  return request("/center-client/sys/user/reset/cashPwd", "POST", data);
};

// checktoken
export const EventCheckToken = (data) => request("/center-client/sys/auth/check/token", "post", data);
