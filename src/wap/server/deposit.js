import request from "./server";

//获取银行卡列表
const GetBankList = data => request('/config-client/config-client/base/userBankList', 'post', data)

//添加银行卡
const AddBank = data => request('/center-client/sys/user/user/bank', 'post', data)

//获取用户银行卡列表
const GetUserBank = data => request('/center-client/sys/user/user/bank/selected', 'post', data)

// 获取用户USDT列表
const GetUserUsdt = data => request('/center-client/sys/user/usdtList/Info', 'post', data)

//用户提现/user/withdraw
const WithDraw = data => request('/center-client/user/withdraw', 'post', data)

//用户提现/usdt
const BankUsdt = data => request('/center-client/sys/user/user/bank/usdt', 'post', data)

//获取用户流水/user/statement
const Statement = data => request('/center-client/user/statement', 'post', data)

//提现记录列表
const WthdrawList = data => request('/center-client/user/withdraw/list', 'post', data)


export {
    AddBank,
    GetUserBank,
    WithDraw,
    BankUsdt,
    Statement,
    GetBankList,
    GetUserUsdt,
    WthdrawList
}