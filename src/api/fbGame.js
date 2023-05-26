/**
 * FB游戏相关接口
 * */
import { makeRequest } from '../utils/httpHelper'
// 获取赛事列表
export const GetMathList = data => makeRequest({ url: '/fb-client/user/fbGame/match/list', data });
// 赛事收藏
export const SaveCollect = data => makeRequest({ url: '/fb-client/collect/save', data });
// 查询收藏游戏列表
export const GetCollectList = data => makeRequest({ url: '/fb-client/collect/getList', data });
// export const GetUrl = data => makeRequest({ url: '/fb-client/user/fbGame/match/getUrl', data });
// 获取赛事详情
export const GetDetail = data => makeRequest({ url: '/fb-client/user/fbGame/match/detail', data });
export const BatchBetMatchMarketOfJumpLine = data => makeRequest({ url: '/fb-client/user/fbGame/match/batchBetMatchMarketOfJumpLine', data });
export const SinglePass = data => makeRequest({ url: '/fb-client/user/fbGame/singlePass', data });
export const betRecord = data => makeRequest({ url: '/fb-client/user/fbGame/betRecord', data });
export const statistics = data => makeRequest({ url: '/fb-client/user/fbGame/statistics', data });