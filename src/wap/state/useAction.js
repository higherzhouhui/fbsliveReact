import { Local } from "../../common";
import { getUserInfo, handleFollow } from "../server/user";
import { Getissue, getLiveRoom, getUserAsserGold, liveListV2, userReject, LotteryBetAllHis, GetBtiType, GetGiftType, GetGiftList, GetUserCard, GetPkStatus, GetGameDown } from "../server/live";
import { Toast } from "antd-mobile";
import i18n from "../lang/i18n";
import { getAdvert, getGameList2, getPromission } from "../server/home";
import { ProGetUrl, getLiveQuickComment } from "../server/promotion";
import { followList } from "../server/Follow";

const fetchContainer = (dispatch) => {
  return {
    PostBaseInfo: async (payload) => {
      if (!Local("baseInfo")) {
        const res = await ProGetUrl();
        if (!(res instanceof Error)) {
          dispatch(() => {
            return {
              type: "SET_BASE_INFO",
              payload: res,
            };
          });
        }
      } else if (payload) {
        dispatch(() => {
          return {
            type: "SET_BASE_INFO",
            payload,
          };
        });
      }
    },
    PostGetLiveQuickComment: async (payload) => {
      if (!Local("getLiveQuickComment")) {
        const res = await getLiveQuickComment();
        if (!(res instanceof Error)) {
          dispatch(() => {
            return {
              type: "GET_LIVE_QUICK_COMMENT",
              payload: res,
            };
          });
        }
      } else if (payload) {
        dispatch(() => {
          return {
            type: "GET_LIVE_QUICK_COMMENT",
            payload,
          };
        });
      }
    },
    freshUser: async (
      /** 请求参数 */
      type
    ) => {
      try {
        const res = await getUserInfo();
        // 修改状态
        dispatch((s) => {
          return {
            type: "UPDATE_USERINFO",
            payload: res,
          };
        });
      } catch (error) {
        dispatch({
          type: "UPDATE_USERINFO",
          payload: {},
        });
      }
    },
    userGetUserAsserGold: async (
      /** 请求参数 */
      type
    ) => {
      try {
        const res = await getUserAsserGold();
        // 修改状态
        dispatch((s) => {
          return {
            type: "UPDATE_ASSERGOLD",
            payload: res,
          };
        });
      } catch (error) {
        dispatch({
          type: "UPDATE_ASSERGOLD",
          payload: {},
        });
      }
    }, //直播间余额接口
    loutOut: () => {
      Local("userInfo", null);
      Local("assergold", null);
      Local("token", null);
      dispatch({
        type: "UPDATE_USERINFO",
        payload: {},
      });
      dispatch({
        type: "LOGIN",
        payload: false,
      });
    },
    updateLiveList: (e) => {
      dispatch({
        type: "UPDATE_LIVELIST",
        payload: e,
      });
    },
    updateLiveTag: (e) => {
      dispatch({
        type: "UPDATE_LIVETAG",
        payload: e,
      });
    },
    updateLiveBanner: (e) => {
      dispatch({
        type: "UPDATE_LIVEBANNER",
        payload: e,
      });
    },
    updateBetting: (e) => {
      dispatch({
        type: "UPDATE_BETTING",
        payload: e,
      });
    },
    updatePreviewStatus: (e) => {
      dispatch({
        type: "UPDATE_PREVIEWSTATUS",
        payload: e,
      });
    },
    updateShowRechargeGift: (e) => {
      dispatch({
        type: "UPDATE_SHOWRECHARGEGIFT",
        payload: e,
      });
    },
    updateAnchorCardReq: (e) => {
      dispatch({
        type: "UPDATE_ANCHORCARDREQ",
        payload: e,
      });
    },
    // 获取直播列表
    PostLiveData: async (uid) => {
      const res = await liveListV2({ uid, type: 0 });
      if (!(res instanceof Error)) {
        dispatch(() => {
          return {
            type: "live/SetLiveData",
            payload: res,
          };
        });
      }
    },
    // 直播间获取房间信息
    handleGetRoom: async (params) => {
      const res = await getLiveRoom(params);
      window.eventBus.emit("hotSportInfoS", res.hotSportInfo); // 展示热门体育信息
      window.eventBus.emit("contactFlagS", res.contactFlag); //主播微信
      // window.eventBus.emit("getLiveRoomCarId", res.carId); //座驾svga id
      if (!(res instanceof Error)) {
        dispatch(() => {
          return {
            type: "live/handleGetRoom",
            payload: res,
          };
        });
      } else {
        dispatch({
          type: "live/handleGetRoom",
          payload: [],
        });
      }
    },

    // 展示房间人员详细信息
    GetUserCards: async (uid) => {
      const res = await GetUserCard({ uid });
      if (!(res instanceof Error)) {
        dispatch(() => {
          return {
            type: "live/SetUserCard",
            payload: res,
          };
        });
      } else {
        dispatch({
          type: "live/SetUserCard",
          payload: {},
        });
      }
    },

    // 直播间关注
    liveFollow: async (userCard) => {
      const res = await handleFollow({ isFollow: !userCard.isFollow, targetId: userCard.uid });
      if (!(res instanceof Error)) {
        userCard.isFollow = !userCard.isFollow;
        userCard.fans += userCard.isFollow ? 1 : -1;

        if (res) {
          dispatch(() => {
            return {
              type: "live/SetFollowLists",
              payload: res,
            };
          });
        }

        dispatch(() => {
          return {
            type: "live/SetUserCard",
            payload: userCard,
          };
        });
        if (userCard.type === "anchor") {
          dispatch(() => {
            return {
              type: "live/SetAnchorInfoFollow",
              payload: { fid: userCard.fid, isFollow: userCard.isFollow },
            };
          });
        }
      }
    },
    // 关注列表
    FollowList: async () => {
      const res = await followList();
      if (!(res instanceof Error)) {
        if (res) {
          dispatch(() => {
            return {
              type: "live/SetFollowLists",
              payload: res,
            };
          });
        }
      }
    },
    //直播间拉黑/取消
    SetUserReject: async (userCard) => {
      const res = await userReject({ isReject: !userCard.isReject, uid: userCard.uid });
      if (!(res instanceof Error)) {
        userCard.isReject = !userCard.isReject;
        if (userCard.isReject) {
          Toast.show(i18n.t("pullBlack3"));
        } else {
          Toast.show(i18n.t("pullBlack4"));
        }
        dispatch(() => {
          return {
            type: "live/SetUserCard",
            payload: userCard,
          };
        });
      }
    },

    // 获取公共数据
    getCommonData: (payload) => {
      Object.keys(payload).map(async (item) => {
        switch (item) {
          case "game":
            if (!Local("preGame") || !Local("version") || payload[item].version != Local("version")[item].version) {
              const res = await getGameList2({ parentId: 11 });
              if (!(res instanceof Error)) {
                dispatch(() => {
                  return {
                    type: "common/SetGame",
                    payload: res,
                  };
                });
                Local("preGame", res);
                Local("version", payload);
              }
            }
            break;
          case "ad":
            if (!Local("preAd") || !Local("version") || payload[item].version != Local("version")[item].version) {
              const res = await getAdvert();
              if (!(res instanceof Error)) {
                dispatch(() => {
                  return {
                    type: "common/SetAd",
                    payload: res,
                  };
                });
                Local("preAd", res);
                Local("version", payload);
              }
            }
            break;
          case "activity":
            if (!Local("preActivity") || !Local("version") || payload[item].version != Local("version")[item].version) {
              const res = await getPromission();
              if (!(res instanceof Error)) {
                dispatch(() => {
                  return {
                    type: "common/SetActivity",
                    payload: res,
                  };
                });
                Local("preActivity", res);
                Local("version", payload);
              }
            }
            break;
          case "quickComment":
            if (!Local("getLiveQuickComment") || !Local("version") || payload[item].version != Local("version")[item].version) {
              console.log("getLiveQuickComment-------更新");

              const res = await getLiveQuickComment();
              if (!(res instanceof Error)) {
                console.log("res------getLiveQuickComment", res);
                dispatch(() => {
                  return {
                    type: "GET_LIVE_QUICK_COMMENT",
                    payload: res,
                  };
                });
                Local("getLiveQuickComment", res);
                Local("version", payload);
              }
            }
            break;
        }
      });
    },

    // 打开游戏
    EventOpenGame: async (payload) => {
      console.log(' payload.name', payload.name);
      //获取期号
      Getissue({ name: payload.name }).then((res) => {
        if (!(res instanceof Error)) {
          dispatch(() => {
            return {
              type: "live/SetIssue",
              payload: {
                ...res,
                open: payload.open || false,
              },
            };
          });
          console.log(' payload.name', res.down_time);

          if (payload.name != 'jsks5' && payload.name != 'yncp30s') {
            dispatch(() => {
              return {
                type: "live/setDownTimeRenew",
                payload: res.down_time,
              };
            });
          }
        }
      });


      //获取历史记录
      LotteryBetAllHis({ lotteryName: payload.name, page: 0 }).then((res) => {
        if (!(res instanceof Error)) {
          if (payload.name == "yncp30s") {
            window.eventBus.emit("showGlistK");
            setTimeout(() => {
              window.eventBus.emit("showGlistG");
            }, 7000);
          }
          dispatch(() => {
            return {
              type: "live/SetRoomGameHistory",
              payload: res,
            };
          });
        }
      });
    },

    GetLotteryGameList: async () => {
      const res = await GetBtiType();
      if (!(res instanceof Error)) {
        dispatch(() => {
          return {
            type: "live/SetLotteryGameList",
            payload: res,
          };
        });
      }
    },

    // 获取礼物
    HandleGetGiftData: async () => {
      const res = await GetGiftType();
      if (!(res instanceof Error)) {
        dispatch(() => {
          return {
            type: "live/SetGiftData",
            payload: res,
          };
        });
      }
    },

    // 获取座驾列表
    HandleGetZj: async () => {
      if (!Local("zjGift")) {
        const res = await GetGiftList();
        if (!(res instanceof Error)) {
          dispatch(() => {
            return {
              type: "live/SetZjGift",
              payload: res,
            };
          });
        }
      }
    },
    // 获取pk信息
    GetPkStatus: async (anchorId) => {
      const res = await GetPkStatus({ anchorId });
      if (!(res instanceof Error)) {
        if (res != undefined) {
          dispatch(() => {
            return {
              type: "live/SetRoomPkStatus",
              payload: res,
            };
          });
        } else {
          dispatch(() => {
            return {
              type: "live/SetRoomPkStatus",
              payload: {
                anchorA: 0,
                anchorB: 0,
                listA: [],
                listB: [],
                protocol: 0,
                scoreA: 0,
                scoreB: 0,
              },
            };
          });
        }
      } else {
        dispatch(() => {
          return {
            type: "live/SetRoomPkStatus",
            payload: {
              anchorA: 0,
              anchorB: 0,
              listA: [],
              listB: [],
              protocol: 0,
              scoreA: 0,
              scoreB: 0,
            },
          };
        });
        console.log(2);
      }
    },
    setSocket: (payload) => {
      dispatch(() => {
        return {
          type: "live/SET_SOCKET",
          payload,
        };
      });
    },
    // 统一获取游戏期号
    getGameTimeOut: async () => {
      const res = await GetGameDown();
      if (!(res instanceof Error)) {
        // 设置x次重置时间后重新调用接口
        res.downOnce = 3;
        dispatch(() => {
          return {
            type: "live/setDownTime",
            payload: res,
          };
        });
      }
    },
  };
};

export default fetchContainer;
