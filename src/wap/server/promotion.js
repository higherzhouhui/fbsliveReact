import { Local } from "../../common";
import request from "./server";

//兑换金币
const ProExchange = (data) => doFetch("/promotion-client/user/exchange", "POST", data);

//查询余额及分享人数
const ProUser = (data) => doFetch("/promotion-client/user/index", "POST", data);

//查看邀请人记录
const ProShareLog = (data) => doFetch("/promotion-client/user/share/log", "POST", data);

//分享收益提现
const ProWithdraw = (data) => doFetch("/promotion-client/user/withdraw", "POST", data);

//查看提现记录
const ProWithdrawLog = (data) => doFetch("/promotion-client/user/withdraw/log", "POST", data);

//获取二维码链接
const ProGetUrl = async (data) => {
  return new Promise((resolve, reject) => {
    // wsServiceUrl ws链接地址
    if (!Local("baseInfo")?.wsServiceUrl) {
      request("/config-client/config-client/base/baseInfo?os=5", "GET", data).then((res) => {
        if (res.wsServiceUrl) {
          Local("baseInfo", res, 24 * 3600);
          window.eventBus.emit("store", { type: "setBaseInfo", payload: res });
          resolve(res);
        }
      });
    } else resolve(Local("baseInfo"));
  });
};

// 获取快捷评论内容
const getLiveQuickComment = async (data) => {
  console.log('-------------------------Local("getLiveQuickComment")', Local("getLiveQuickComment"), !Local("getLiveQuickComment"));

  return new Promise((resolve, reject) => {
    // if (!Local("getLiveQuickComment")) {
    request("/live-client/live/getLiveQuickComment", "GET", data).then((res) => {
      Local("getLiveQuickComment", res);
      window.eventBus.emit("store", { type: "setGetLiveQuickComment", payload: res });
      resolve(res);
    });
    // } else resolve(Local("getLiveQuickComment"));
  });
};
// const getLiveQuickComment = (data) => request("/live-client/live/getLiveQuickComment", "post", data, false);

export { ProExchange, ProUser, ProShareLog, ProWithdraw, ProWithdrawLog, ProGetUrl, getLiveQuickComment };
