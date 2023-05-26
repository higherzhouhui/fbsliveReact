import axios from "axios";
import request from "./server";

//登录
export const getPromission = (data) => {
  return request("/config-client/config-client/base/userActivity", "GET", data);
};

export const getGameList = (data) => {
  // return request("/config-client/config-client/config/tag/list", 'GET', data)
  data.version = "1.1.8";
  return request("/config-client/config-client/config/game/detail/newList", "GET", data);
};
// 游戏列表 parentId 查询全部的时候
export const getGameList2 = async (data) => {
  data.version = "1.1.8";
  const res = await request("/config-client/config-client/config/game/detail/newListV2", "GET", data);
  return res;
};
// 根据类型获取游戏列表
export const getGameListV2 = (data) => {
  // return request("/config-client/config-client/config/tag/list", 'GET', data)
  data.version = "1.1.8";
  return request("/config-client/config-client/config/game/detail/listV2", "GET", data);
};

// 获取收藏列表
export const getGameCollect = (data) => {
  // return request("/config-client/config-client/config/tag/list", 'GET', data)
  data.version = "1.1.8";
  return request("/config-client/config-client/config/game/list/collect", "GET", data);
};
// 添加收藏
export const addCollect = (data) => {
  return request("/config-client/config-client/config/game/add/collect", "POST", data);
};
// 删除收藏
export const delCollect = (data) => {
  return request("/config-client/config-client/config/game/del/collect", "POST", data);
};

export const getGameDetail = (data) => {
  return request("/config-client/config-client/config/detail/list", "GET", data, false);
};
// 获取游戏跳转地址
export const getGameJumpUrl = (url, data) => request(url, "POST", data);

export const getSlotList = (data) => {
  return request("/config-client/config-client/config/label/slot/list", "GET", data, false);
};

// 游戏banner type=16
export const getAdvert = (data) => {
  return request("/config-client/config-client/config/advert", "GET", data, false);
};
