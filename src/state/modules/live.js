import { Local } from "../../common";
import _ from "lodash";

let DownTimeOut; //倒计时timeout

const InitState = {
  userCard: {}, //用户卡片
  room: {},
  showLeaveRoom: false, // 展示离开房间的弹窗
  // liveData: [],
  liveData: {
    listDataVos: [],
    tagListVOS: [],
  },
  liveDetail: {
    liveListRoomBaseVO: { isAd: 0, adJumpUrl: "", livePicUrl: "", liveId: 0, anchorId: 0, type: 0, price: null, pking: false, rq: 0, toy: 0, liveStatus: 0, videoType: 0, webRtcUrl: "", flvUrl: "", hlsUrl: "", pullStreamUrl: "", loopVideoUrl: "", isAutoLive: 0, hotSportInfo: null, isHotSports: 0, liveRoomLabel: "", liveTitle: "" },
    liveListActivityInfoVO: { isActivityRoulette: 0, isLuckBag: 0 },
    liveListAnchorInfoVO: { anchorId: 0, nickname: "", avatar: "", signature: "", tag: "", contactFlag: 0, follow: 1, followList: [], isFollow: false },
    liveListRoomUsers: [],
    liveListRoomLotterys: [],
  },
  // 游戏状态
  liveIssue: {
    down_time: 0,
    expect: "",
    name: "",
    nickName: "",
    timelong: "",
  },
  RoomDownTime: 0, //直播间倒计时
  RoomDownTimeInfo: "", //直播间倒计时状态
  RoomGameHistory: [],
  RoomGameList: [],
  RoomMenList: { contactFlag: 0, isActivityRoulette: 0, onUserEnterRoomReqs: [], rq: 0, zb: 0 },
  giftData: [], //礼物原始数据
  giftList: [], //礼物过滤后数据
  zjGift: Local("zjGift") || [], //座驾列表
  RoomPkStatus: {
    anchorA: 0,
    anchorB: 0,
    listA: [],
    listB: [],
    protocol: 0,
    scoreA: 0,
    scoreB: 0,
  },
  socket: false,
};
const state = _.cloneDeep(InitState);
const model = {
  // 初始化信息
  EventInitState() {
    state = _.cloneDeep(InitState);
  },
  // 获取房间信息
  async handleGetRoom(payload) {
    state.room = payload;
  },
  //设置人气值
  SetManTotalRps(payload) {
    if (payload > 0) state.RoomMenList.rq = payload;
  },
  SetAnchorInfoFollow(payload) {
    const { fid, isFollow } = payload;
    state.liveDetail.liveListAnchorInfoVO.isFollow = isFollow;
  },
  SetUserCard(payload) {
    state.userCard = payload;
  },
  SetFlLoading(payload) {
    state.flLoading = payload;
  },
  SetShowLeaveRoom(payload) {
    state.showLeaveRoom = payload;
  },
  SetLiveData(payload) {
    state.liveData = payload;
  },
  SetLiveDetail(payload) {
    // console.log('payload-------liveDetail', payload);
    state.liveDetail = payload;
    if (payload.liveListRoomBaseVO.rq > 0) state.RoomMenList.rq = payload.liveListRoomBaseVO.rq;
  },
  // 设置期号信息
  SetIssue(payload) {
    if (payload.down_time) this.EventDownTime(payload.down_time);
    if (state.liveIssue.open) payload.open = true;
    state.liveIssue = payload;
  },
  SetIssueClose() {
    state.liveIssue.open = false;
  },
  // 获取倒计时状态
  GetRoomDownTimeInfo(downTime) {
    // let downTime = state.RoomDownTime;
    if (state.liveIssue.name === "yncp30s") {
      if (downTime <= 0 || downTime > 22) {
        state.RoomDownTimeInfo = "封盘";
      } else {
        state.RoomDownTimeInfo = downTime;
      }
    } else if (state.liveIssue.name === "xyft") {
      if (downTime <= 0 || (downTime > 55 && downTime <= 300)) {
        state.RoomDownTimeInfo = "封盘";
      } else {
        state.RoomDownTimeInfo = downTime;
      }
    } else if (state.liveIssue.name === "jsks5") {
      if (downTime <= 0 || downTime > 285) {
        state.RoomDownTimeInfo = "封盘";
      } else {
        state.RoomDownTimeInfo = downTime;
      }
    } else {
      if (downTime <= 0 || downTime > 55) {
        state.RoomDownTimeInfo = "封盘";
      } else {
        state.RoomDownTimeInfo = downTime;
      }
    }
  },
  SetRoomGameHistory(payload) {
    state.RoomGameHistory = payload;
  },
  SetLotteryGameList(payload) {
    state.RoomGameList = payload;
  },
  // 直播间游戏通用倒计时
  EventDownTime(time) {
    state.RoomDownTime = time;
    clearTimeout(DownTimeOut);
    DownTimeOut = setTimeout(() => {
      if (time - 1 >= 0) {
        this.GetRoomDownTimeInfo(time - 1);
        this.EventDownTime(time - 1);
      } else {
        window.eventBus.emit("store", { type: "EventDownTime" });
      }
    }, 1000);
  },
  // 去除倒计时
  clearDownTime() {
    clearTimeout(DownTimeOut);
  },
  // 在直播间中刷新页面，重新从接口中获取detail
  EventHandleSetLiveDetail(liveId) {
    const [detail] = state?.liveData?.listDataVos.filter((item) => item.liveId == liveId);
    if (detail) {
      state.liveDetail = detail;
      if (detail.liveListRoomBaseVO.rq > 0) state.RoomMenList.rq = detail.liveListRoomBaseVO.rq;
    }
  },

  //设置福袋活动显隐
  HandleSwitchLuckBug(data) {
    state.liveDetail.liveListActivityInfoVO.isLuckBag = data;
  },

  //设置礼物相关数据
  SetGiftData(payload) {
    state.giftData = payload;
    state.giftList = payload
      .reduce((sum, item) => {
        sum = [...sum, ...item.propBaseResponses];
        return sum;
      }, [])
      .sort((a, b) => a.goldCoin - b.goldCoin);
  },

  // 设置座驾信息
  SetZjGift(payload) {
    state.zjGift = payload;
    Local("zjGift", payload, 3600 * 24); //储存一天
  },

  // 有人加入、离开房间
  changeRoomMen(payload) {
    const { onUserEnterRoomReqs } = state.RoomMenList;
    const index = onUserEnterRoomReqs.findIndex((a) => a.uid === payload.uid);
    // 进入房间
    if (payload.isInter) {
      if (index < 0) {
        state.RoomMenList.onUserEnterRoomReqs.push(payload);
      }
    } else {
      if (index >= 0) {
        state.RoomMenList.onUserEnterRoomReqs.splice(index, 1);
      }
      //离开房间
    }
    if (payload.rq > 0) state.RoomMenList.rq = payload.rq;
  },

  // 房间人员初始化
  setRoomMen(payload) {
    state.liveDetail.liveListActivityInfoVO.isActivityRoulette = payload.isActivityRoulette;
    state.RoomMenList = payload;
    if (payload.rq > 0) state.RoomMenList.rq = payload.rq;
  },

  //切换pk状态
  SwitchPk(payload) {
    state.liveDetail.liveListRoomBaseVO.pking = payload;
  },
  //变更pk信心
  SetRoomPkStatus(payload) {
    state.RoomPkStatus = payload;
  },
  SET_SOCKET(payload) {
    state.socket = payload;
  },
};
export default {
  state,
  model,
};
