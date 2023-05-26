/**游戏相关接口
 * */
import { makeRequest } from "../utils/httpHelper";
import { Local } from "../common";

//获取游戏启动地址（点击进入游戏）
export const gameForwardGame = (data) => makeRequest({ url: "/center-client/game/forwardGame", data });
// 根据类型获取游戏列表（全部 AG电子,RSG电子,PP电子）
export const getGameListV2 = data => makeRequest({ url: `/config-client/config-client/config/game/detail/listV2?parentId=${data.parentId}&type=${data.type}&version=1.1.8&uid=${data.uid}`, method: 'get', data })
// 游戏列表 parentId 查询全部的时候
export const getGameList2 = data => makeRequest({ url: `/config-client/config-client/config/game/detail/newListV2?parentId=${data.parentId}&version=1.1.8`, method: 'get', data })
// 获取收藏列表（收藏 AG电子,RSG电子,PP电子）
export const getGameCollect = data => makeRequest({ url: `/config-client/config-client/config/game/list/collect?parentId=${data.parentId}&type=${data.type}&version=1.1.8&uid=${data.uid}`, method: 'get', data })
// 游戏添加收藏
export const addCollect = data => makeRequest({ url: `/config-client/config-client/config/game/add/collect`, method: 'post', data })
// 游戏删除收藏
export const delCollect = data => makeRequest({ url: `/config-client/config-client/config/game/del/collect`, method: 'post', data })
// 获取单个游戏余额
export const getBalance = data => makeRequest({ url: `/center-client/game/getBalance`, method: 'post', data })
// 一键回收
export const backAllGameCoin = data => makeRequest({ url: `/center-client/sys/user/backAllGameCoin`, method: 'post', data })
//自动上分 转入金额
export const autoUpBalance = data => makeRequest({ url: `/center-client/game/autoUpBalance`, method: 'post', data })



//获取游戏历史
export const GetGameHistory = (data) => makeRequest({ url: "/lottery-client/lottery/getHistorLottery", data });
//获取游戏所有历史
export const GetAllGameHistory = (data) => makeRequest({ url: "/lottery-client/lottery/getLotteryResultHistoryByName", data });
//获取所有游戏的首个纪录
export const GetSomeGameFirstHistory = (data) => makeRequest({ url: "/lottery-client/lottery/getAllLotteryLatestResult", data });
//获取游戏参与纪录
export const GetBetHistorByUid = (data) => makeRequest({ url: "/lottery-client/lottery/getBetHistorByUid", data });
//投游戏
export const LotteryBet = (data, type = "") => makeRequest({ url: type === "lottery" ? "/cfgame-client/user/scGame/account/order" : "/lottery-client/lottery/lotteryBet", data });
//获取游戏期数
export const Getissue = (data, type = "") => makeRequest({ url: type === "lottery" ? "/cfgame-client/user/scGame/account/countdownConfig" : "/lottery-client/lottery/getissue?fName=top", data });
//获取二维码链接
export const ProGetUrlPC = async (data) => {
  return new Promise((resolve, reject) => {
    // wsServiceUrl ws链接地址
    if (!Local("baseInfo")?.wsServiceUrl) {
      makeRequest({url: "/config-client/config-client/base/baseInfo?os=6", method: "GET", data}).then((res) => {
        if (res.wsServiceUrl) {
          Local("baseInfo", res, 24 * 3600);
          window.eventBus.emit("store", { type: "setBaseInfo", payload: res });
          resolve(res);
        }
      });
    } else resolve(Local("baseInfo"));
  });
};

// 查询电子游戏子类型
export const SlotList = (data) => makeRequest({ url: "/config-client/config-client/config/label/slot/list", method: "GET", data });

//越南彩类型
export const LotteryType = (data) => makeRequest({ url: "/cfgame-client/user/scGame/account/getLotteryMethodListYN", method: "post", data });

//获取开奖结果
export const LotteryResult = (data) => makeRequest({ url: "/cfgame-client/user/scGame/account/lotteryResult", method: "post", data });

// 获取当前游戏的开奖信息
export const GetissueInfo = (data) => makeRequest({ url: "/lottery-client/lottery/getissue", method: "post", data });

// 获取当前游戏的开奖结果列表
export const GetOpenRewardHistroyList = (data) => makeRequest({ url: "/lottery-client/gameRecord/queryGameRecord", method: "post", data });

// 获取当前游戏的开奖结果列表
export const GetOpenResultRatio = (data) => makeRequest({ url: "/lottery-client/gameRecord/queryResultStatistics", method: "post", data });

// 获取问路后的结果
export const GetAskWayResult = (data) => makeRequest({ url: "/lottery-client/gameRecord/queryAskWay", method: "post", data });

// 获取问路后的结果
export const GetGoodWayResult = (data) => makeRequest({ url: "/lottery-client/gameRecord/queryGoodGameRecord", method: "post", data });
// 统一获取游戏的倒计时
export const GetGameDownPc = () => makeRequest({url: `/lottery-client/lottery/queryLotteryIssueTimeVO`, method: "get"});

