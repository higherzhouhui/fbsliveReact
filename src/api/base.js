import { makeRequest } from "../utils/httpHelper";
// 图片上传
const getOssToken = (data) => makeRequest({ url: "/config-client/config-client/base/ossToken", method: "get", data });
// 首页banner接口
const getAdvert = (data) => makeRequest({ url: "/config-client/config-client/config/advert", method: "get", data });
// 获取活动接口
const getUserActivity = (data) => makeRequest({ url: "/config-client/config-client/base/userActivity", method: "get", data });


const getCserver = (data) => makeRequest({ url: "/config-client/config-client/config/cserver", method: "get", data });
const getTopList = (data) => makeRequest({ url: `/config-client/config-client/config/game/detail/newList?parentId=${data.parentId}`, method: "get", data });
const getAdList = (data) => makeRequest({ url: "/config-client/config-client/config/detail/list?parentId=" + data.parentId, method: "get", data });
// const getUserActivity = (data) => makeRequest({ url: "/config-client/config-client/base/userActivity?uid=" + data.uid, method: "get", data });

// 游戏列表 parentId 查询全部的时候
const getGameList2 = (data) => makeRequest({ url: `/config-client/config-client/config/game/detail/newListV2?parentId=${data.parentId}`, method: "get", data });

// 根据类型获取游戏列表
const getGameListV2 = (data) => makeRequest({ url: `/config-client/config-client/config/game/detail/listV2?parentId=${data.parentId}&type=${data.type}&version=1.1.8&uid=${data.uid}`, method: "get", data });

// 获取收藏列表
const getGameCollect = (data) => makeRequest({ url: `/config-client/config-client/config/game/list/collect?parentId=${data.parentId}&type=${data.type}&version=1.1.8&uid=${data.uid}`, method: "get", data });

// 添加收藏
const addCollect = (data) => makeRequest({ url: `/config-client/config-client/config/game/add/collect`, method: "post", data });

// 删除收藏
const delCollect = (data) => makeRequest({ url: `/config-client/config-client/config/game/del/collect`, method: "post", data });
//获取游戏启动地址（点击进入游戏）
export const gameForwardGame = (data) => makeRequest({ url: "/center-client/game/forwardGame", data });

//活动信息
const giftInfo = (data) => makeRequest({ url: "/center-client/activity/gift/info", method: "get", data });

// const getAdvert = (data) => makeRequest({ url: "/config-client/config-client/config/advert", method: "get", data });
const info = (data) => makeRequest({ url: "/center-client/sys/user/modify/user/info", data });
const getUserInfo = (data) => makeRequest({ url: "/center-client/sys/user/get/info", data });
const getBankList = (data) => makeRequest({ url: "/order/pay/bank/list1", data });
const getBankSelected = (data) => makeRequest({ url: "/center-client/sys/user/user/bank/selected", data });
const getWebGetAppDownloadUrl = (data) => makeRequest({ url: "/config-client/config-client/base/webGetAppDownloadUrl", method: "get", data });
const getAgentInfo = (data) => makeRequest({ url: `/agent-server/api/promotionDoMain/getAgentInfo?promoteDomain=${data.promoteDomain}`, method: "get", data, PROXY: "/agentApi" });

export { 
    getCserver,
    getTopList, 
    getAdList, 
    info, 
    getUserInfo, 
    getBankList, 
    getBankSelected,
    getWebGetAppDownloadUrl, 
    getAgentInfo, 
    giftInfo, 
    getGameList2, 
    getGameListV2, 
    getGameCollect, 
    addCollect, 
    delCollect,
    getUserActivity,
    getAdvert,
    getOssToken
};
