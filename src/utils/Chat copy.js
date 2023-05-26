import { ProGetUrl } from "../wap/server/promotion";
import { ProGetUrlPC } from "../api/game";
import TIM from "tim-js-sdk";
import { userAgent } from "../utils/tools";
import { Local } from "../common";

/**
 * 消息接受
 * chat.on('getMsg', (msg) => {
        console.log(msg);
        let {protocol，status} = JSON.parse(msg.text)
    })
 *@protocol 为5进入房间，9用户消息,7刷礼物，29开奖，2退出房间，24pk数据，
    protocol: 18,status: 2 结束pk,status:1 开始pk
    protocol: 23 pk进入惩罚时间

*其他功能按格式自定义添加
 */

class Chat {
  tim = null;
  /**
   *
   * @param liveId 初始化时传入liveId
   */
  constructor(obj) {
    this.eventMap = {};
    let method = userAgent() == "PC" ? ProGetUrlPC : ProGetUrl;
    method().then(async (base) => {
      this.tim = TIM.create({ SDKAppID: Number(base.sdkappid) });
      if (userAgent() == "PC") this.tim.login({ userID: `${Local("userInfo2").uid}`, userSig: Local("userInfo2").imToken });
      else this.tim?.login({ userID: `${Local("userInfo").uid}`, userSig: Local("userInfo").imToken });
      let onSdkReady = (event) => {
        this.tim.joinGroup({ groupID: String(obj.liveId) });
        let onMessageReceived = (event) => {
          this.emit("getMsg", event.data);
        };
        this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
        this.emit("onImReady");
        this.tim.on(TIM.EVENT.KICKED_OUT, () => {
          console.log("------------被踢出房间----------------------------------------");
        });
      };
      this.tim.on(TIM.EVENT.SDK_READY, onSdkReady);
    });
  }

  /**
   * 注册事件
   * @param {String} event 事件名称
   * @param {Function}  fn 回调函数
   */
  on(event, fn) {
    const map = this.eventMap;
    if (!map[event]) {
      map[event] = [];
    }
    map[event].push(fn);
  }
  /**
   * 触发事件
   */
  emit(event, ...args) {
    const map = this.eventMap;
    if (map[event].length) {
      map[event].forEach((fn) => {
        fn.apply(null, args);
      });
    } else {
      console.error("无待执行函数");
    }
  }
  /**
   * 移除事件
   */
  off(event, fn) {
    const map = this.eventMap;
    const index = map[event]?.indexOf(fn);
    if (index > -1) {
      map[event].splice(index, 1);
    } else {
      console.error("目标函数不存在");
    }
  }
  /**
   * 注册只执行一次的事件
   */
  onOnce(event, fn) {
    const self = this;
    function on() {
      fn.apply(null, arguments); // 先执行fn
      self.off(event, on); // 立刻移除fn
    }
    this.on(event, on); // 注册代理函数
  }
  logout() {
    return this.tim?.destroy();
  }
}

export default Chat;
