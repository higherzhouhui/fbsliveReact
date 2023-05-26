import request from "./server";

//贡献榜
const rankList = (data) => request("/live-client/rank/list", "POST", data);

//奖品排行榜
const GetAnthorGiftList = (data) => request("/live-client/rank/anchor/list", "POST", data);

//榜单详情
const rankDetail = (data) => request("/live-client/rank/rank/detail", "POST", data);

export { rankList, GetAnthorGiftList, rankDetail };
