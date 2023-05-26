import { instanceOf } from "prop-types";
import { Local } from "../../common";
import request from "./server";

export const getGameList = (data) => {
  return request("/config-client/config-client/config/tag/list", "GET", data);
};

export const getGameDetail = (data) => {
  return request("/config-client/config-client/config/detail/list", "GET", data);
};

// 获取游戏跳转地址
export const getGameJumpUrl = (url, data) => request(url, "POST", data);

//获取直播标签
export const getLiveTag = (data) => {
  return request("/config-client/config-client/config/tag", "GET", data);
};

//获取直播标签
export const getLiveList = (data) => {
  return request("/live-client/live/list", "POST", data);
};

//获取直播间房间
export const getLiveRoom = (data) => {
  return request("/live-client/live/inter/room", "POST", data);
};

//主播基本信息/live/room/anchor/base
export const GetAnchorInfo = (data) => request("/live-client/live/room/anchor/base", "post", data);

//获取房间人员/live/room/user/list
export const GetRoomPeople = (data) => request("/live-client/live/room/user/list", "post", data);

//获取房间VIP人员/live/room/user/viplist
export const GetRoomVip = (data) => request("/live-client/live/room/user/viplist", "post", data);

//获取用户名片信息
export const GetUserCard = (data) => request("/center-client/sys/user/get/card/info", "post", data);

//获取图标徽章
export const GetHz = (data) => request("/config-client/config-client/config/badge", "get", data);

//直播间发送消息
export const LiveChat = (data) => request("/live-client/live/chat", "post", data);

//获取个人投注记录/lottery/getBetHistorByUid
export const GetBtiList = (data, type = "") => request(type === "lottery" ? "/cfgame-client/user/scGame/account/orderHistory" : "/lottery-client/lottery/getBetHistorByUid", "post", data);

//获取单个投注记录
export const getBetHistorByUidAndName = (data) => request("/lottery-client/lottery/getBetHistorByUidAndName", "post", data);

//获取历史开奖记录
export const GetHisList = (data) => request("/lottery-client/lottery/getAllLotteryLatestResult", "post", data);

//获取投注历史开奖记录/lottery/getLotteryResultHistoryByName
export const LotteryBetAllHis = (data) => request("/lottery-client/lottery/getLotteryResultHistoryByName", "post", data, false);

///config-client/config/prop礼物和座驾列表
export const GetGiftList = (data) => request("/config-client/config-client/config/prop", "get", data);

//购买座驾
export const buyCar = (data) => request("/center-client/user/prop/buyCar", "post", data);

//获取用户座驾信息
export const propCar = (data) => request("/center-client/user/prop/car", "post", data);

//设置直播间展示座驾
export const setShowCar = (data) => request("/center-client/user/prop/setShowCar", "post", data);

//获取礼物分类
export const GetGiftType = (data) => request("/config-client/config-client/config/propListCategory", "get", data);

//发送礼物/live/send/gift
export const SendGift = (data) => request("/live-client/live/send/gift", "post", data, false);

// 查看转盘奖项 res=true 抽中
export const startTurntable = (data) => request("/live-client/live/startTurntable", "post", data);

// 获取正在表演节目
export const inPlayTurntable = (data) => request("/live-client/live/inPlayTurntable", "get", data);

// 获取投注分类
export const GetBtiType = (data) => request("/config-client/config-client/config/cp/list", "get", data);

// 获取彩票期号
export const Getissue = (data) => request("/lottery-client/lottery/getissue", "post", data, false);

//获取投注历史开奖记录/lottery/getHistorLottery
export const GetHistorLottery = (data, type = "") => request(type === "lottery" ? "/cfgame-client/user/scGame/account/lotteryRecord" : "/lottery-client/lottery/getHistorLottery", "post", data);

//投注
export const LotteryBet = (data) => request("/lottery-client/lottery/lotteryBet", "post", data);

//获取付费房1,2
export const GetLiveRecharge = (data) => request("/live-client/live/charge/room", "post", data);

// 获取当前直播众筹记录
export const getGiftCrowdfundingRecordByUid = (data) => request("/promotion-client/gift/getGiftCrowdfundingRecordByUid", "get", data);

// 根据订单号获取众筹进度
export const getSchedulePercentageByOrderNo = (data) => request("/promotion-client/gift/getSchedulePercentageByOrderNo", "get", data);

//获取pk状态
export const GetPkStatus = (data) => request("/live-client/pk/status", "post", data);

// 主播分享
export const GetLiveShare = (data) => request("/live-client/live/liveShare", "post", data);

// 获取用户经验
export const GetUserExperienceInfo = (data) => request(`/center-client/live/getUserExperienceInfo?type=${data.type}&uid=${data.uid}`, "post", data, false);

// 分享批量发送私信
export const GetBatchLetter = (data) => request("/center-client/live/batchLetter", "post", data);

// 获取粉丝列表
export const GetFansList = (data) => request("/center-client/sys/user/fans/list", "post", data);

// 当前游戏是否开启
export const GetCurFlagOpenGame = (data) => request("/config-client/config-client/config/curFlagOpenGame", "get", data);

// 搜索直播间/主播
export const liveSearchLiveList = (data) => request("/live-client/live/searchLiveList", "post", data);
// 新搜索直播间/主播
export const liveSearchLiveList2 = (data) => request("/live-client/live/v2/searchLiveList", "post", data);

//获取转盘信息
export const getWheelInfo = (data) => request("/live-client/roulette/info", "post", data);

//获取我的奖励
export const getWheelGift = (data) => request("/live-client/roulette/reward", "post", data);

//获取转盘信息
export const startWheel = (data) => request("/live-client/roulette/start", "post", data);

// 获取福袋信息
export const GetGiftLuckBagRecordByUid = (data) => request("/promotion-client/luckBag/getGiftLuckBagRecordByUid", "GET", data);

//获取参与方式配置
export const GetLuckBagConfig = (data) => request("/promotion-client/luckBag/getJoinTypeConfig", "GET", data);

//查询中奖名单
export const GetLuckBagUserList = (data) => request("/promotion-client/luckBag/luckBagUserList", "post", data);

// 用户参与福袋
export const GetUserJoinLuckBag = (data) => request("/promotion-client/luckBag/userJoinLuckBag", "post", data);

//推荐视频
export const suggestedlist = (data) => request("/live-client/live/suggestedlist", "post", data);

//新增彩票接口
export const LotteryBet2 = (data) => request("/cfgame-client/user/scGame/account/order", "post", data);

//获取开奖结果
export const LotteryResult = (data) => request("/cfgame-client/user/scGame/account/lotteryResult", "post", data);

//越南彩类型
export const LotteryType = (data) => request("/cfgame-client/user/scGame/account/getLotteryMethodListYN", "post", data);

//获取主播名片
export const getAnchorCard = (data) => request("/live-client/live/getAnchorCard", "post", data);

//进房预览接口
export const roomPreview = (data) => request("/live-client/live/inter/roomPreview", "post", data);

// 获取gametype
export const gameBalanceInLiveRoom = (data) => request("/center-client/sys/user/gameBalanceInLiveRoom", "post", data);

// 设置/取消 黑名单
export const userReject = (data) => request("/center-client/sys/user/reject", "post", data);

// 黑名单列表
export const rejectList = (data) => request("/center-client/sys/user/reject/list", "post", data);

// 直播间游戏金额
export const getUserAsserGold = async (data) => {
  const res = await request("/center-client/sys/user/getUserAsserGold", "post", data, false);
  if (!(res instanceof Error)) {
    window.eventBus.emit("store", { type: "freshGoldInfo", payload: res });
  }
  return res;
};

// 接口开播列表
export const liveListV2 = (data) => request("/live-client/live/v2/list", "post", data, false);
// 等级礼物svga
export const levelProp = async (data) => {
  if (!Local("LevelProp")) {
    const res = await request("/config-client/config-client/config/level/prop", "get", data, false);
    if (!(res instanceof Error)) {
      Local("LevelProp", res || []);
    }
  }
};
// 预约开播列表
export const listLiveBooking = (data) => request("/live-client/live/booking/listLiveBooking", "post", data, false);
// 用户预约直播间
export const saveUserLiveBooking = (data) => request(`/live-client/user/live/booking/saveUserLiveBooking/${data.liveBookingId}/${data.uid}`, "get");

// 获取档位列表
export const giftList = (data) => request(`/promotion-client/promotion/recharge/gift/list`, "get");
// 背包礼物
export const giftBagList = (data) => request(`/promotion-client/promotion/recharge/gift/giftBag/list?uid=${data?.uid}`, "get");
// 判断是否开起
export const giftStatus = (data) => request(`/promotion-client/promotion/recharge/gift/status?uid=${data?.uid}`, "get");

// 统一获取游戏期号
export const GetGameDown = () => request(`/lottery-client/lottery/queryLotteryIssueTimeVO`, "get");

// 获取直播间是否关播状态0-已关播,1-直播中
export const CheckLiveStatus = (data) => request(`/live-client/live/v2/checkLiveStatus`, "post", data);
