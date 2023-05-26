// 直播相关接口
import { Local } from '../common';
import { makeRequest } from '../utils/httpHelper'

// 关注/取消关注
const liveFollow = data => makeRequest({ url: '/center-client/live/follow', data })
// 打赏礼物排行榜
const rankAnchorList = data => makeRequest({ url: '/live-client/rank/anchor/list', data });
// 推荐视频/猜你喜欢
const suggestedlist = data => makeRequest({ url: '/live-client/live/suggestedlist', data });
//获取主播名片
const getAnchorCard = data => makeRequest({ url: '/live-client/live/getAnchorCard', data, method: 'post' })
// 主播分享
const getLiveShare = data => makeRequest({ url: '/live-client/live/liveShare', data, method: 'post' })
// 接口开播列表
const liveListV2 = data => makeRequest({ url: '/live-client/live/v2/list', data, method: 'post' });

//获取直播列表
const GetLiveList = data => makeRequest({ url: '/live-client/live/list', data });
const LiveHeart = data => makeRequest({ url: '/live-client/live/heart', data });
//获取礼物
const GetLiveGift = data => makeRequest({ url: '/config-client/config-client/config/prop', data, method: 'get' });
//获取直播详情
const GetLiveDetail = data => makeRequest({ url: '/live-client/live/inter/room', data });
////获取付费房1,2
const GetLiveRecharge = data => makeRequest({ url: '/live-client/live/charge/room', data })

//获取主播基本信息
const GetLiverDetail = data => makeRequest({ url: '/live-client/live/room/anchor/base', data });

//房间观看人员列表
const GetUserList = data => makeRequest({ url: '/live-client/live/room/user/list', data })
//房间贵族列表
const GetVIPUserList = data => makeRequest({ url: '/live-client/live/room/user/viplist', data })
//发送礼物
const SendGift = data => makeRequest({ url: '/live-client/live/send/gift', data })
//获取游戏列表
const GetGameList = data => makeRequest({ url: '/config-client/config-client/config/cp/list', data, method: 'get' })

//获取礼物分类
const GetGiftType = data => makeRequest({ url: '/config-client/config-client/config/propListCategory', data, method: 'get' })


//获取直播类型
const GetLiveTag = data => makeRequest({ url: '/config-client/config-client/config/tag', data, method: 'get' })
//获取用户详情
const GetUserCard = data => makeRequest({ url: '/center-client/sys/user/get/card/info', data })
const GetUserInfo = data => makeRequest({ url: '/center-client/sys/user/get/info', data })
//获取pk状态
const GetPkStatus = data => makeRequest({ url: '/live-client/pk/status', data })
const LiveChat = data => makeRequest({ url: '/live-client/live/chat', data })
// 当前游戏是否开启
const GetCurFlagOpenGame = data => makeRequest({ url: `/config-client/config-client/config/curFlagOpenGame?type=${data.type}`, data, method: 'get' })

// 获取福袋信息
const GetGiftLuckBagRecordByUid = data => makeRequest({ url: `/promotion-client/luckBag/getGiftLuckBagRecordByUid?anchorId=${data.anchorId}&uid=${data.uid}`, data, method: 'get' })

//获取参与方式配置
const GetLuckBagConfig = data => makeRequest({ url: '/promotion-client/luckBag/getJoinTypeConfig', data, method: 'get' })

//查询中奖名单
const GetLuckBagUserList = data => makeRequest({ url: '/promotion-client/luckBag/luckBagUserList', data, method: 'post' })

// 用户参与福袋
const GetUserJoinLuckBag = data => makeRequest({ url: '/promotion-client/luckBag/userJoinLuckBag', data, method: 'post' })

// 直播间游戏金额
const getUserAsserGold = async (data) => {
    const res = await makeRequest({ url: "/center-client/sys/user/getUserAsserGold", method: "post", data });
    if (res) {
        window.eventBus.emit("store", { type: "freshGoldInfo", payload: res });
    }
    return res;
};
// 设置/取消 黑名单
const userReject = (data) => makeRequest({ url: "/center-client/sys/user/reject", method: "post", data });

//获取投注历史开奖记录/lottery/getLotteryResultHistoryByName
const LotteryBetAllHis = (data) => makeRequest({ url: "/lottery-client/lottery/getLotteryResultHistoryByName", method: "post", data });

// 获取投注分类
const GetBtiType = (data) => makeRequest({ url: "/config-client/config-client/config/cp/list", method: "get", data });

// 快捷评论

const GetUserquickComment = (data) => makeRequest({ url: "/live-client/live/getLiveQuickComment", method: "get", data });

// 等级礼物svga
const levelProp = async (data) => {
    if (!Local('LevelProp_pc')) {
        const res = await makeRequest({ url: "/config-client/config-client/config/level/prop", method: "get", data });
        if (!(res instanceof Error)) {
            Local('LevelProp_pc', res || [])
        }
    }
}

export {
    LiveChat,
    GetPkStatus,
    GetLiveList,
    GetLiveGift,
    GetLiveDetail,
    GetLiverDetail,
    GetUserList,
    GetVIPUserList,
    SendGift,
    GetGameList,
    GetGiftType,
    GetLiveTag,
    GetUserInfo,
    GetLiveRecharge,
    GetUserCard,
    GetCurFlagOpenGame,
    GetGiftLuckBagRecordByUid,
    GetLuckBagConfig,
    GetLuckBagUserList,
    GetUserJoinLuckBag,
    LiveHeart,
    getUserAsserGold,
    userReject,
    LotteryBetAllHis,
    GetBtiType,
    liveFollow,
    rankAnchorList,
    suggestedlist,
    getAnchorCard,
    getLiveShare,
    liveListV2,
    GetUserquickComment,
    levelProp
}
