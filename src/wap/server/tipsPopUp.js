import request from "./server";

// 查询余额
const accountGetbalance = (data) => {
    return request("/cfgame-client/user/scGame/account/getbalance", 'POST', data)
}
// 回收余额
const backAllGameCoin = (data) => {
    return request("/cfgame-client/user/scGame/account/backAllGameCoin", 'GET', data)
}
// 代入
const accountCreditIn = (data) => {
    return request("/cfgame-client/user/scGame/account/creditIn", 'POST', data)
}
//代出
const accountCreditOut = (data) => {
    return request("/cfgame-client/user/scGame/account/creditOut", 'POST', data)
}





export {
    accountGetbalance, backAllGameCoin, accountCreditIn,
    accountCreditOut
}