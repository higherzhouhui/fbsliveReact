import { Local } from "../common";
import { Toast } from "antd-mobile";
import { liveListV2, GetUserInfo, liveFollow, GetLiveDetail, getUserAsserGold, userReject, LotteryBetAllHis, GetBtiType, GetGiftType, GetLiveGift, GetUserCard, GetPkStatus, GetUserquickComment } from '../api/live';
import { Getissue, ProGetUrlPC } from '../api/game'
import i18n from "../language/config";
import { getAdvert, getGameList2, getUserActivity } from "../api/base";

const fetchContainer = (dispatch) => {
  return {
    PostBaseInfo: async (payload) => {
      if (!Local("baseInfo")) {
        const res = await ProGetUrlPC();
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
    freshUser: async (
      /** 请求参数 */
      type
    ) => {
      if (Local("token2")) {
        try {
          const res = await GetUserInfo();
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
            payload: null,
          });
        }
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

    // 获取直播列表
    PostLiveData: async (uid) => {
      const res = await liveListV2({ uid, type: 0 });
      if (!(res instanceof Error)) {
        if (res) {
          dispatch(() => {
            return {
              type: "live/SetLiveData",
              payload: res,
            };
          });
        }
      }

      // if (res) {
      //   const tagList = res.tagListVOS || []
      //   const listData = res.listDataVos || []
      //   tagList.map(item => {
      //     item.liveDetails = []
      //     item.liveIds.map(liveId => {
      //       listData.forEach(detail => {
      //         if (liveId === detail.liveId) {
      //           item.liveDetails.push(detail)
      //         }
      //       })
      //     })
      //   })
      //   dispatch(() => {
      //     return {
      //       type: "UPDATE_LIVETAG",
      //       payload: tagList,
      //     };
      //   });
      // } else {
      //   dispatch(() => {
      //     return {
      //       type: "UPDATE_LIVETAG",
      //       payload: [],
      //     };
      //   });
      // }
    },
    updateLiveTagRooms: (tagList) => {
      dispatch(() => {
        return {
          type: "UPDATE_LIVETAG",
          payload: tagList,
        };
      });
    },
    // 直播间获取房间信息
    handleGetRoom: async (params) => {
      const res = await GetLiveDetail(params);
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
      const res = await liveFollow({ isFollow: !userCard.isFollow, targetId: userCard.uid });
      if (!(res instanceof Error)) {
        userCard.isFollow = !userCard.isFollow;
        userCard.fans += userCard.isFollow ? 1 : -1;
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
            if (!Local("preGame-pc") || !Local("version-pc") || payload[item].version != Local("version-pc")[item].version) {
              const res = await getGameList2({ parentId: 11 });
              if (!(res instanceof Error)) {
                dispatch(() => {
                  return {
                    type: "common/SetGame",
                    payload: res,
                  };
                });
                Local("preGame-pc", res);
                Local("version-pc", payload);
              }
            }
            break;
          case "ad":
            if (!Local("preAd-pc") || !Local("version-pc") || payload[item].version != Local("version-pc")[item].version) {
              const res = await getAdvert();
              if (!(res instanceof Error)) {
                dispatch(() => {
                  return {
                    type: "common/SetAd",
                    payload: res,
                  };
                });
                Local("preAd-pc", res);
                Local("version-pc", payload);
              }
            }
            break;
          case "activity":
            if (!Local("preActivity-pc") || !Local("version-pc") || payload[item].version != Local("version-pc")[item].version) {
              const res = await getUserActivity();
              if (!(res instanceof Error)) {
                dispatch(() => {
                  return {
                    type: "common/SetActivity",
                    payload: res,
                  };
                });
                Local("preActivity-pc", res);
                Local("version-pc", payload);
              }
            }
            break;
          case "quickComment":
            if (!Local("prequickComment-pc") || !Local("version-pc") || payload[item].version != Local("version-pc")[item].version) {
              const res = await GetUserquickComment();
              if (!(res instanceof Error)) {
                dispatch(() => {
                  return {
                    type: "common/SetquickComment",
                    payload: res,
                  };
                });
                Local("prequickComment-pc", res);
                Local("version-pc", payload);
              }
            }
            break;
        }
      });
    },
    updateGame: (e) => {
      dispatch({
        type: "UPDATE_GAME",
        payload: e,
      });
    },
    // 打开游戏
    EventOpenGame: async (payload) => {
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
      if (!Local('GiftData-pc')) {
        const res = await GetGiftType();
        if (!(res instanceof Error)) {
          if (res) {
            Local('GiftData-pc', res)
            dispatch(() => {
              return {
                type: "live/SetGiftData",
                payload: res,
              };
            });
          }
        }
      } else {
        dispatch(() => {
          return {
            type: "live/SetGiftData",
            payload: Local('GiftData-pc'),
          };
        });
      }
    },

    // 获取座驾列表
    HandleGetZj: async () => {
      if (!Local("zjGift")) {
        const res = await GetLiveGift();
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
        console.log('res-------------GetPkStatus', anchorId, res);
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
      }
    },
    // 更新卡片位置
    updateAnchorCardReq: (e) => {
      dispatch({
        type: "UPDATE_ANCHORCARDREQ",
        payload: e,
      });
    },

    setSocket: (payload) => {
      dispatch(() => {
        return {
          type: "live/SET_SOCKET",
          payload,
        };
      });
    },
    loutOut: () => {
      Local("userInfo2", null);
      Local("token2", null);
      dispatch({
        type: "UPDATE_USERINFO",
        payload: null,
      });
      dispatch({
        type: "LOGIN",
        payload: false,
      });
    },
  };
};

export default fetchContainer;
