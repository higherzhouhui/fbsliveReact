import request from "./server";

//获取充值
const RechargeWay = (data) => request("/config-client/config-client/config/pay", "get", data);

//获取充值通道/pay/bank/list1
const GetBankWay = (data) => request("/order/pay/bank/list1", "post", data);

//点击充值按钮/pay/bank/recharge
const MoneyRecharge = (data) => request("/order/pay/bank/recharge", "post", data);

// usdt充值接口
const ustdRecharge = (data) => request("/order/pay/ustd/recharge", "post", data);

//兑换金币按钮/pay/trueWallet
const GoldRecharge = (pathname, channel, data) => request(pathname + channel, "post", data);

//查询余额及分享人数
const ProUser = (data) => request("/promotion-client/user/v1/index", "POST", data);

//兑换金币
const ProExchange = (data) => request("/promotion-client/user/exchange", "POST", data);

//查看邀请人记录
const ProShareLog = (data) => request("/promotion-client/user/share/log", "POST", data);

// 分享收益明细
const incomeDetail = (data) => request("/promotion-client/user/share/incomeDetail", "POST", data);

// 邀请明细
const inviteInfo = (data) => request(`/promotion-client/user/inviteInfo/${data}`, "POST");

//查看提现记录
const ProWithdrawLog = (data) => request("/promotion-client/user/withdraw/log", "POST", data);

//获取所有vip列表
const getVipList = (data) => request("/config-client/config-client/config/vip", "GET", data);

//忘记密码
const updatePass = (data) => request("/center-client/sys/auth/reset/pwd", "post", data);

//购买vip
const BuyVip = (data) => {
  return request("/live-client/vip/buyVip", "POST", data);
};

export { RechargeWay, GetBankWay, MoneyRecharge, GoldRecharge, ProUser, ProExchange, ProShareLog, ProWithdrawLog, getVipList, BuyVip, updatePass, ustdRecharge, incomeDetail, inviteInfo };
