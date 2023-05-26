const { Local } = require("../../common");

let reTryTimes = 0; //重连次数
let isReTry = false;
const createHash = (hashLength = 24) => {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join("");
};
//全局定义一个变量，用于打开关闭连接
const getWsUrl = () => {
  switch (LocalEnv) {
    case "development":
    case "test":
      return "wss://fbs-wss.testlive.vip";
    case "demo":
      return "wss://wss.fbs98.com";
    case "production":
      return "wss://wss.fbslive.com";
    default:
      return "";
  }
};
let ws;
//定义打开连接的方法
const webSocket = (data) => {
  return new Promise((resolve, reject) => {
    // 测试
    // wss://fbs-wss.testlive.vip
    // 预发布环境
    // wss://wss.fbs98.com
    // 正式
    // wss://wss.fbslive.com

    // getWsUrl()
    ws = new WebSocket(`${Local("baseInfo")?.wsServiceUrl}?token=${data?.type != "pc" ? Local("token") : Local("token2")}`);
    // let res = [];
    ws.onopen = () => {
      if (ws.readyState === 1) {
        isReTry = false;
        console.log("websocket连接成功...");
        resolve(ws);
        heartCheck.reset().start();
        window.eventBus.emit("store", { type: "socket", payload: true });

        window.eventBus.emit('store', { type: 'WsReconnect' }) //断线重连ws刷新list、直播游戏倒计时
      }
    };
    ws.onmessage = (e) => {
      let res = JSON.parse(e.data);
      // 10010 关播  10011开播
      if (res.protocol == 10010 || res.protocol == 10011) {
        window.eventBus.emit("store", { type: "getLiveData", payload: res });
      }
      if (res.protocol === 2010 && res.data) {
        // console.log("进房-----soket", JSON.parse(res.data)?.anchorCardReq, JSON.parse(res.data));
        window.eventBus.emit("store", { type: "setRoomMen", payload: JSON.parse(res.data) });

        if (JSON.parse(res.data)?.anchorCardReq) {
          window.eventBus.emit("store", { type: "anchorCardReq", payload: JSON.parse(res.data)?.anchorCardReq });
        } else {
          window.eventBus.emit("store", { type: "anchorCardReq", payload: {} });
        }
      }
      // 进房信息获取
      if (res.protocol === 2012 && res.data) {
        window.eventBus.emit("store", { type: "setLiveData", payload: JSON.parse(res.data) });
      }
      if (res.protocol === 2022 && res.data) {
        if (JSON.parse(res.data)) {
          window.eventBus.emit("store", { type: "anchorCardReq", payload: JSON.parse(res.data) });
        } else {
          window.eventBus.emit("store", { type: "anchorCardReq", payload: {} });
        }

        console.log("res---------------主播小卡片", res);
      }
      // 房间变更
      if (res.protocol === 10013) {
        window.eventBus.emit("store", { type: "roomChanges", payload: JSON.parse(res.data) });
      }
      if (res.protocol === 20000) {
        window.eventBus.emit("store", { type: "freshVersion" });
      }

      // 预约推送
      if (res.protocol === 20002) {
        console.log("res----预约推送", JSON.parse(res.data));
        if (JSON.parse(res.data).businessType == "liveReservation") {
          window.eventBus.emit("store", { type: "previewStatus", payload: JSON.parse(res.data) });
        }
      }
      // 存款活动
      if (res.protocol === 20003) {
        console.log("res----存款活动", JSON.parse(res.data));
        if (JSON.parse(res.data).businessType == "rechargeGift") {
          window.eventBus.emit("store", { type: "showRechargeGift", payload: JSON.parse(res.data) });
          // alert('存款活动-----')
        }
      }
      // 首次链接推送
      if (res.protocol === 10009) {
        let data = JSON.parse(res.data);
        data.forEach((value) => {
          // //liveReservation 预约开关
          if (JSON.parse(value).businessType == "liveReservation") {
            window.eventBus.emit("store", { type: "previewStatus", payload: JSON.parse(value) });
          }
          // if (JSON.parse(value).businessType == 'rechargeGift') {
          //   window.eventBus.emit("store", { type: "showRechargeGift", payload: JSON.parse(value) });
          // }
        });
      }

      if (res.protocol === 4000) {
        console.log("socket token失效");
        window.eventBus.emit("store", { type: "loginOut" });
      }
    };
    ws.onclose = () => {
      console.log("websocket连接关闭...");
      reLink();
    };
    ws.onerror = (err) => {
      reLink();
      reject(err);
    };
  });
};
// 断线重连
const reLink = () => {
  if (isReTry) return;
  isReTry = true;
  if (!Local("token")) return;
  setTimeout(() => {
    isReTry = false;
    reTryTimes += 1;
    heartCheck.reset();
    heartCheck2.reset();
    webSocket({ type: "h5" });
    console.log('------reTryTimes--------------断线重连-----', reTryTimes);
  }, countTime() * 1000);
};
const countTime = () => {
  if (reTryTimes < 3) {
    return 3;
  } else if (reTryTimes < 6) {
    return 10;
  } else if (reTryTimes < 10) {
    return 30;
  } else return 60;
};
// 心跳倒计时
const heartCheck = {
  timeout: 20000, //20秒
  timeoutObj: null,
  reset: function () {
    clearInterval(this.timeoutObj);
    return this;
  },
  start: function () {
    this.timeoutObj = setInterval(function () {
      console.log('--心跳--');
      ws.send(1);
    }, this.timeout);
  },
};

//定义关闭连接的方法
const close = () => {
  ws.close();
};

// 直播间心跳倒计时
const heartCheck2 = {
  timeout: 40000, //40秒
  timeoutObj: null,
  reset: function () {
    clearInterval(this.timeoutObj);
    return this;
  },
  start: function () {
    this.timeoutObj = setInterval(function () {
      ws.send(
        JSON.stringify({
          messageId: new Date().getTime(),
          protocol: 1001,
          data: {},
        })
      );
    }, this.timeout);
  },
};

// 进入直播间
const WsEnterRoom = (data) => {
  data.messageId = createHash();
  if (ws?.readyState === 1) {
    ws.send(JSON.stringify(data));

    heartCheck2.reset().start();
  }
};

// 获取房间信息 2012
const WsLiveData = (data) => {
  data.messageId = createHash();
  data.protocol = "2012";
  if (ws?.readyState === 1) {
    ws.send(JSON.stringify(data));
  }
};

// 退出直播间
const WsLeaveRoom = (data) => {
  data.messageId = createHash();
  if (ws?.readyState === 1) {
    ws.send(JSON.stringify(data));
    heartCheck2.reset();
  }
};

export { webSocket, close, WsEnterRoom, WsLeaveRoom, WsLiveData };
