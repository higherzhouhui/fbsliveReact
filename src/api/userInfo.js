import { Local } from "../common";
import { makeRequest } from "../utils/httpHelper";
import { getOrSetVal } from "../utils/tools";

//获取查询资产名称类型-new  查看code 10000(交易记录) 20000（投注记录） 30000 （消费记录） 40000 （时间查询）
export const queryAssetTypeList = (data) => makeRequest({ url: `/center-client/sys/user/queryAssetTypeList?pid=${data.pid}`, method: "get", data });
//用户资产详情记录-new
export const queryUserAssetList = (data) => makeRequest({ url: "/center-client/sys/user/queryUserAssetList", data });
//邀请明细数据
export const userInviteInfo = (data) => makeRequest({ url: `/promotion-client/user/inviteInfo/${data.code}` });
// 分享收益明细
export const shareIncomeDetail = (data) => makeRequest({ url: `/promotion-client/user/share/incomeDetail`, data });
// 上分和下分
export const upOrDownBalance = (data) => makeRequest({ url: `/center-client/game/upOrDownBalance`, data });
//自动上分开关
export const autoUpBalanceSwitch = (data) => makeRequest({ url: `/center-client/game/autoUpBalanceSwitch`, data });
// 一键回收
export const backAllGameCoin = (data) => makeRequest({ url: "/center-client/sys/user/backAllGameCoin", data });
// 获取用户银行卡列表
export const bankSelected = (data) => makeRequest({ url: "/center-client/sys/user/user/bank/selected", data });
// 获取用户USDT列表
export const usdtListInfo = (data) => makeRequest({ url: "/center-client/sys/user/usdtList/Info", data });
// 银行卡/usdt提现
export const userWithdraw = (data) => makeRequest({ url: "/center-client/user/withdraw", data });
// 获取分类名称信息列表
export const getTypeList = (data) => makeRequest({ url: `/service-business-center/platformMessage/v1/getTypeList/${data.uid}`, method: "get", data });
// 分页获取消息列表
export const findListByTypePage = (data) => makeRequest({ url: `/service-business-center/platformMessage/v1/findListByTypePage/${data.typeId}/${data.uid}?pageNum=${data.pageNum}&pageSize=${data.pageSize}`, method: "get", data });
// 消息已读
export const platformMessageRead = (data) => makeRequest({ url: `/service-business-center/platformMessage/v1/read?msgId=${data.msgId}`, data });
// 一键已读
export const platformMessageReadAll = (data) => makeRequest({ url: `/service-business-center/platformMessage/v1/readAll?typeId=${data.typeId}&uid=${data.uid}`, data });
// 删除消息
export const platformMessageDel = (data) => makeRequest({ url: `/service-business-center/platformMessage/v1/del?msgIds=${data.msgIds}&uid=${data.uid}`, data });
// 获取存款支付方式
export const configPayList = (data) => makeRequest({ url: "/config-client/config-client/config/pay", method: "get", data });
// 获取银行卡/usdt信息
export const bankList = (data) => makeRequest({ url: "/order/pay/bank/list1", data });
// 用户提现/usdt
export const bindUsdt = (data) => makeRequest({ url: "/center-client/sys/user/user/bank/usdt", data });
// 添加反馈
export const feedbackSave = (data) => makeRequest({ url: "/center-client/feedback/save", method: "post", data });
// 获取反馈类型
export const feedbackTypes = (data) => makeRequest({ url: "/center-client/feedback/feedbackTypes", method: "get", data });
// 我的反馈
export const feedbackAll = (data) => makeRequest({ url: "/center-client/feedback/all", method: "get", data });
// 反馈已读
export const feedbackRead = (data) => makeRequest({ url: "/center-client/feedback/read", method: "post", data });
// 获取主播信息
export const getBaseInfo = (data) => makeRequest({ url: "/config-client/config-client/base/baseInfo", method: "get", data });

export const getLotteryTypeHistory = (data) => makeRequest({ url: "/lottery-client/lottery/getLotteryTypeHistory", data });
export const getLotteryDetailsHistory = (data) => makeRequest({ url: "/lottery-client/lottery/getLotteryDetailsHistory", data });
export const getAssetType = (data) => makeRequest({ url: "/center-client/sys/user/asset/getAssetType", data });
export const record = (data) => makeRequest({ url: "/center-client/sys/user/asset/record", data });
export const withdrawLog = (data) => makeRequest({ url: "/promotion-client/user/withdraw/log", data });
export const shareLog = (data) => makeRequest({ url: "/promotion-client/user/share/log", data });
export const userIndex = (data) => makeRequest({ url: "/promotion-client/user/index", data });
export const baseInfo = (data) => makeRequest({ url: "/config-client/config-client/base/baseInfo", method: "get", data });
// export const pay = (data) => makeRequest({ url: "/config-client/config-client/config/pay", method: "get", data });
// export const pay = (data) => makeRequest({ url: "/config-client/config-client/config/pay", method: "get", data });
export const recharge = (data) => makeRequest({ url: "/order/pay/bank/recharge", data });
export const userBankList = (data) => makeRequest({ url: "/config-client/config-client/base/userBankList", data });
export const bank = (data) => makeRequest({ url: "/center-client/sys/user/user/bank", data });

export const ustdRecharge = (data) => makeRequest({ url: "/order/pay/ustd/recharge", data });

export const inSABA = (data) => makeRequest({ url: "/sbgame-client/user/sbGame/creditIn", data });
export const outSABA = (data) => makeRequest({ url: "/sbgame-client/user/sbGame/creditOut", data });

export const inBTI = (data) => makeRequest({ url: "/btigame-client/user/btiGame/creditIn", data });
export const outBTI = (data) => makeRequest({ url: "/btigame-client/user/btiGame/creditOut", data });

export const inMp = (data) => makeRequest({ url: "/kygame-client/user/balanceUp", data });
export const outMp = (data) => makeRequest({ url: "/kygame-client/user/balanceDown", data });

export const inAWC = (data) => makeRequest({ url: "/awcgame-client/user/awcGame/creditIn", data });
export const outAWC = (data) => makeRequest({ url: "/awcgame-client/user/awcGame/creditOut", data });

export const inAG = (data) => makeRequest({ url: "/aggame-client/user/prepareTransferCreditIn", data });
export const outAG = (data) => makeRequest({ url: "/aggame-client/user/prepareTransferCreditOut", data });

export const inKY = (data) => makeRequest({ url: "/kygame-client/user/balanceUp", data });
export const outKY = (data) => makeRequest({ url: "/kygame-client/user/balanceDown", data });

export const inBG = (data) => makeRequest({ url: "/bggame-client/user/bGame/creditIn", data });
export const outBG = (data) => makeRequest({ url: "/bggame-client/user/bGame/creditOut", data });

export const inXG = (data) => makeRequest({ url: "/xggame-client/user/xgGame/creditIn", data });
export const outXG = (data) => makeRequest({ url: "/xggame-client/user/xgGame/creditOut", data });

export const inOB = (data) => makeRequest({ url: "/obgame-client/user/obGame/creditIn", data });
export const outOB = (data) => makeRequest({ url: "/obgame-client/user/obGame/creditOut", data });

export const inRSG = (data) => makeRequest({ url: "/rsggame-client/user/rsgGame/creditIn", data });
export const outRSG = (data) => makeRequest({ url: "/rsggame-client/user/rsgGame/creditOut", data });

export const inPP = (data) => makeRequest({ url: "/ppgame-client/user/ppGame/creditIn", data });
export const outPP = (data) => makeRequest({ url: "/ppgame-client/user/ppGame/creditOut", data });

export const inCf = (data) => makeRequest({ url: "/cfgame-client/user/cfGame/creditIn", data });
export const outCf = (data) => makeRequest({ url: "/cfgame-client/user/cfGame/creditOut", data });

export const inWw = (data) => makeRequest({ url: "/cfgame-client/user/wwGame/creditIn", data });
export const outWw = (data) => makeRequest({ url: "/cfgame-client/user/wwGame/creditOut", data });

export const getScBanlance = (data) => makeRequest({ url: "/cfgame-client/user/scGame/account/getbalance", data });
export const inSc = (data) => makeRequest({ url: "/cfgame-client/user/scGame/account/creditIn", data });
export const outSc = (data) => makeRequest({ url: "/cfgame-client/user/scGame/account/creditOut", data });

export const exchange = (data) => makeRequest({ url: "/promotion-client/user/exchange", data });
export const selected = (data) => makeRequest({ url: "/center-client/sys/user/user/bank/selected", data });
export const withdraw = (data) => makeRequest({ url: "/center-client/user/withdraw", data });
export const systemLetterList = (data) => makeRequest({ url: "/center-client/live/systemLetter/list", data });
export const noticeList = (data) => makeRequest({ url: "/config-client/config-client/config/system/notice", method: "get", data });
// 三方游戏余额list
export const gameBalanceList = (data) => makeRequest({ url: "/center-client/sys/user/gameBalanceList", data });
// 三方游戏余额redis
export const GameBalanceRedisList = (data) => makeRequest({ url: "/center-client/sys/user/gameBalanceRedisList", data });

export const userInfo = (info) => {
  return getOrSetVal("user-info", info) || {};
};

export async function updateUserInfo() {
  const user = await makeRequest({ url: "/center-client/sys/user/get/info" });
  if (!(user instanceof Error)) {
    if (user.imToken != undefined) {
      Local("userInfo2", user);
      userInfo(user);
      return user;
    }
  }
}

// checktoken
export const EventCheckToken = (data) => makeRequest({ url: "/center-client/sys/auth/check/token", data });
