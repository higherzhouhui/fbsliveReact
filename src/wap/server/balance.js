import request from "./server";

//获取bti余额
const GetBtiBalance = (data) => request("/btigame-client/user/btiGame/getbalance", "POST", data);
//bti转入
const BtiIn = (data) => request("/btigame-client/user/btiGame/creditIn", "POST", data);
//bti转出
const BtiOut = (data) => request("/btigame-client/user/btiGame/creditOut", "POST", data);

//获取bti余额
const GetSbBalance = (data) => request("/sbgame-client/user/sbGame/getbalance", "POST", data);
//bti转入
const SbIn = (data) => request("/sbgame-client/user/sbGame/creditIn", "POST", data);
//bti转出
const SbOut = (data) => request("/sbgame-client/user/sbGame/creditOut", "POST", data);

//获取bti余额
const GetKylance = (data) => request("/kygame-client/user/balance", "POST", data);
//ky转入
const KyIn = (data) => request("/kygame-client/user/balanceUp", "POST", data);
//ky转出
const KyOut = (data) => request("/kygame-client/user/balanceDown", "POST", data);

//获取bti余额
const GetAwclance = (data) => request("/awcgame-client/user/awcGame/getbalance", "POST", data);
//awc转入
const AwcIn = (data) => request("/awcgame-client/user/awcGame/creditIn", "POST", data);
//bti转出
const AwcOut = (data) => request("/awcgame-client/user/awcGame/creditOut", "POST", data);

//获取bti余额
const GetCmdlance = (data) => request("/cmdgame-client/user/cmdGame/getbalance", "POST", data);
//bti转入
const CmdIn = (data) => request("/cmdgame-client/user/cmdGame/creditIn", "POST", data);
//bti转出
const CmdOut = (data) => request("/cmdgame-client/user/cmdGame/creditOut", "POST", data);

//ob转入
const ObIn = (data) => request("/obgame-client/user/obGame/creditIn", "POST", data);
//ob转出
const ObOut = (data) => request("/obgame-client/user/obGame/creditOut", "POST", data);

//xg转入
const XgIn = (data) => request("/xggame-client/user/xgGame/creditIn", "POST", data);
//xg转出
const XgOut = (data) => request("/xggame-client/user/xgGame/creditOut", "POST", data);

// ag 预备转出 代入
const AgIn = (data) => request("/aggame-client/user/prepareTransferCreditIn", "POST", data);
// ag 预备转出 代出
const AgOut = (data) => request("/aggame-client/user/prepareTransferCreditOut", "POST", data);

// bg 代入
const BgIn = (data) => request("/bggame-client/user/bGame/creditIn", "POST", data);
// bg 代出
const BgOut = (data) => request("/bggame-client/user/bGame/creditOut", "POST", data);

// rsg 代入
const RsgIn = (data) => request("/rsggame-client/user/rsgGame/creditIn", "POST", data);
// rsg 代出
const RsgOut = (data) => request("/rsggame-client/user/rsgGame/creditOut", "POST", data);

// pp 代入
const PpIn = (data) => request("/ppgame-client/user/ppGame/creditIn", "POST", data);
// pp 代出
const PpOut = (data) => request("/ppgame-client/user/ppGame/creditOut", "POST", data);

// cf 代入
const CfIn = (data) => request("/cfgame-client/user/cfGame/creditIn", "POST", data);
// cf 代出
const CfOut = (data) => request("/cfgame-client/user/cfGame/creditOut", "POST", data);

// ww 代入
const WwIn = (data) => request("/cfgame-client/user/wwGame/creditIn", "POST", data);
// ww 代出
const WwOut = (data) => request("/cfgame-client/user/wwGame/creditOut", "POST", data);

// sc代入
const ScIn = (data) => request("/cfgame-client/user/scGame/account/creditIn", "POST", data);
// sc代出
const ScOut = (data) => request("/cfgame-client/user/scGame/account/creditOut", "POST", data);

// 一键回收
const BackAllGameCoin = (data) => request("/center-client/sys/user/backAllGameCoin", "POST", data);
// 三方游戏余额list
const GameBalanceList = (data) => request("/center-client/sys/user/gameBalanceList", "POST", data, false);

//三方游戏余额redis
const GameBalanceRedisList = (data) => request("/center-client/sys/user/gameBalanceRedisList", "POST", data, false);

//自动上分开关
const autoUpBalanceSwitch = (data) => request("/center-client/game/autoUpBalanceSwitch", "POST", data);

//获取游戏启动地址
const gameForwardGame = (data) => request("/center-client/game/forwardGame", "POST", data);

//上分和下分
const upOrDownBalance = (data) => request("/center-client/game/upOrDownBalance", "POST", data);
//自动上分 转入金额
const autoUpBalance = (data) => request("/center-client/game/autoUpBalance", "POST", data);

// 获取单个游戏余额
const getBalance = (data) => request('/center-client/game/getBalance', 'POST', data)

export { GetBtiBalance, BtiIn, BtiOut, GetSbBalance, SbIn, SbOut, GetKylance, KyIn, KyOut, GetAwclance, AwcIn, AwcOut, GetCmdlance, CmdIn, CmdOut, ObIn, ObOut, XgIn, XgOut, AgIn, AgOut, BgIn, BgOut, RsgIn, RsgOut, PpIn, PpOut, CfIn, CfOut, WwIn, WwOut, ScIn, ScOut, BackAllGameCoin, GameBalanceList, GameBalanceRedisList, autoUpBalanceSwitch, autoUpBalance, gameForwardGame, upOrDownBalance, getBalance };
