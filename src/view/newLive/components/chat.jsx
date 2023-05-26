import React, { useCallback, useEffect, useState, useRef } from "react";
import { Input, Avatar } from "antd";
import { useTranslation } from "react-i18next";
import { LiveChat, liveFollow, GetLiveGift } from "@/api/live";
import Chat from "@/utils/Chat";
import { useNavigate } from "react-router-dom";
import useContextReducer from "@/state/useContextReducer";
import { WsEnterRoom, WsLeaveRoom } from "@/wap/util/websockets";
import { Local } from "@/common";
import "./style/chat.scss";
import VAPPC from '../../../components/vapPC'

let setTime1;
let setTime2;
export default (props) => {
  const history = useNavigate();
  let { baseInfo, onShowResult, suspends, addAni } = props;
  const { t } = useTranslation();
  const [msgHistory, setMsgHistory] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [focusVisible, setFocusVisible] = useState(false);
  const [collectLoding, setCollectLoding] = useState(false);
  const {
    state: {
      user,
      live: { liveData, liveDetail, giftData, giftList },
      common: { quickComent, Im },
    },
    dispatch
  } = useContextReducer.useContextReducer();

  const getLiveRoomRef = useRef(false);
  const [imReady, imReadySet] = useState(false);
  const publicScreenkjRef = useRef(false);
  const [publicScreenkj, publicScreenkjSet] = useState({});
  const [publicScreen, publicScreenSet] = useState({});
  const publicScreen2Ref = useRef(false);
  const hisEl = useRef(null);
  const [quickComentFlag, setQuickComentFlag] = useState(false);
  const [videoInfo2, videoInfo2Set] = useState([])
  const [videoInfo, setVideoInfo] = useState([])
  const sendLiveChat = () => {
    if (sendLoading || !msg) return;
    setSendLoading(true);
    //    return  history('/live/list')
    // return window.location.href = '/live/list'
    LiveChat({ liveId: baseInfo.liveId, msg }).then(() => {
      setSendLoading(false);
      setMsg("");
    });
  };
  const handleClickQuickComent = (e, msg) => {
    if (sendLoading || !msg) return;
    setSendLoading(true);
    setMsg(msg);
    LiveChat({ liveId: baseInfo.liveId, msg }).then(() => {
      setSendLoading(false);
      setQuickComentFlag(false);
      setMsg("");
    });
  };
  const getGiftName = (gid) => {
    const flattenedGift = giftList.reduce((acc, cur) => acc.concat(cur), []);
    let [item] = flattenedGift.filter((item) => item.gid === gid);
    return item ? item.gname : "";
  };
  const GetLiveDetailPC = (e) => {
    console.log(e, "e");
    // const { domList } = this.state
    // let data = [...domList]
    // if (e.hotSportInfo !== null && e.hotSportInfo[0] !== undefined && e.hotSportInfo.length > 0) {
    //     e.hotSportInfo.forEach((value) => {
    //         data.push({ ...value, hotSportInfo: e.hotSportInfo.length })
    //     })
    // }
    // console.log(data, "e.hotSportInfo")
    // this.setState({ domList: data })
  };
  //
  const getMsg = async (data) => {
    window.eventBus.emit("liveChatMsg", data);
    // console.log(data.protocol, `直播间推送IM类型,现在类型是-----------${data.protocol}------------`)
    // 2 退出直播间
    if (data.protocol == 2) {
    
      history('/live/list');
      // return window.location.href = '/live/list'
    }
    // 7 礼物消息
    if (data.protocol == 29 || data.protocol == 7 || data.protocol == 24 || data.protocol == 18 || data.protocol == 5 || data.protocol == 21) {
      onShowResult(data);
    }

    // if (data.protocol == 7) {
    //   console.log('giftList----------------giftDatagiftDatagiftDatagiftData', giftData, giftList);
    //   if (data.giftType !== 20 || data.giftType === 10) {
    //     addAni(data)
    //   }
    // }
    if (data.protocol == 3 && data.live === false) {
      suspends(false);
    } else if (data.protocol == 3 && data.live === true) {
      suspends(true);
    }
    // 5 欢迎，9发言消息
    let pro = [5, 9];
    // console.log(data, "data")
    setMsgHistory((msgH) => {
      if (pro.includes(data.protocol)) {
        // console.log(5, "555")
        if (data.nickname) {
          msgH.push(data);
        }
      } else {
        msgH.push(data);
      }
      // console.log(msgH);
      return [...msgH];
    });
    if (data.protocol == 5) {
      // console.log("座驾信息", data);
      // window.eventBus.emit('manTotalRps', data?.rp || 0)

      if (data.isInter == true) {
        if (user?.uid != data?.uid) {
          const zjList = Local("GetGiftListzj");
          if (zjList) {
            if (data.carId != null && data.carId != undefined) {
              let [svga] = Local("GetGiftListzj").filter((value, index, array) => {
                return data.carId == value.gid;
              });
              // let { videoUrl, videoJson } = svga;
              // if (videoUrl && videoJson) {
              //   videoInfo2Set((e) => {
              //     return [...e, { src: videoUrl, config: videoJson }];
              //   });
              // } else {
              getLiveRoomRef.current = true;
              GetGiftListzjF(svga?.resourceUrl);
              // }
            }
          } else {
            let res = await GetLiveGift();
            if (!(res instanceof Error)) {
              let list = res || [];
              let giftdata = [];
              list.forEach((value, index) => {
                if (value.type == 1 && value.isShow == 1) {
                  giftdata = [...giftdata, value];
                }
              });
              // console.log('多少座驾', giftdata);
              giftdata.sort((a, b) => {
                return a.goldCoin - b.goldCoin;
              });
              Local("GetGiftListzj", giftdata);
              if (data.carId != null && data.carId != undefined) {
                let [svga] = Local("GetGiftListzj").filter((value, index, array) => {
                  return data.carId == value.gid;
                });

                // 判断是否有mp4资源
                // let { videoUrl, videoJson } = svga;
                // if (videoUrl && videoJson) {
                //   videoInfo2Set((e) => {
                //     return [...e, { src: videoUrl, config: videoJson }];
                //   });
                // } else {
                getLiveRoomRef.current = true;
                GetGiftListzjF(svga?.resourceUrl);
                // }
              }


            }
          }
        }
        // if (data.showType == 0) {
        //   let LevelProp = Local('LevelProp_pc') || []
        //   let [res] = LevelProp?.filter((val) => val.level == data.userLevel);
        //   let { videoUrl, videoJson } = res;
        //   if (videoUrl && videoJson) {
        //     setVideoInfo((e) => {
        //       return [...e, { src: videoUrl, config: videoJson, srcTag: data?.avatar, textTag: `${data?.nickname} ${t("enterRoom")}` }];
        //     });
        //   } else {
        //     // userLevelsSet(gameResult.userLevel)
        //     // gameResultsSet(gameResult)

        //     // userLevelsRef.current = gameResult.userLevel
        //     // gameResultsRef.current = gameResult
        //   }
        // }

      }
    }
    if (data.protocol == 80) {
      // console.log("世界公屏活动", data.type);
      if (data.type == 1 && publicScreen2Ref.current == false) {
        clearTimeout(setTime1);
        publicScreen2Ref.current = true;
        publicScreenSet(data);
        // var player = new SVGA.Player("#demoCanvas22");
        // var parser = new SVGA.Parser("#demoCanvas22"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // // player.clearsAfterStop = true; //清空画布
        // // console.log(parser);cjsvg.svga  zjsvg.svga
        // parser.load(require("../../../wap/assets/image/live/sj/cjsvg.svga"), function (videoItem) {
        //   player.setVideoItem(videoItem);
        //   player.startAnimation();
        //   player.onFrame(function (i) { });
        // });
        setTime1 = setTimeout(() => {
          // player.stopAnimation()
          // publicScreen2Set(false)
          publicScreen2Ref.current = false;
          publicScreenSet({});
          clearTimeout(setTime1);
          setTime1 = null;
        }, 10000);
        // 公屏有变化更新主播榜单
        window.eventBus.emit("freshAnchorList", {});
      }

      // publicScreen2sRef.current == false
      if (data.type == 2 && publicScreenkjRef.current == false) {
        clearTimeout(setTime2);
        publicScreenkjRef.current = true;
        publicScreenkjSet(data);

        // var player2 = new SVGA.Player("#demoCanvaszj");
        // var parser2 = new SVGA.Parser("#demoCanvaszj"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // parser2.load(require("../../../wap/assets/image/live/sj/zjsvg.svga"), function (videoItem) {
        //   player2.setVideoItem(videoItem);
        //   player2.startAnimation();
        //   player2.onFrame(function (i) { });
        // });
        setTime2 = setTimeout(() => {
          // player.stopAnimation()
          publicScreenkjRef.current = false;
          publicScreenkjSet({});
          clearTimeout(setTime2); //清空定时器
          setTime2 = null; //销毁全局变量
        }, 10000);
      }
    }
    // 判断是否开起主播卡片
    if (data.protocol == 88) {
      window.eventBus.emit("contactFlagS", data.contactFlag);

      let listDataVos = liveData?.listDataVos || [];
      listDataVos.forEach((value) => {
        if (value.liveId == liveDetail?.liveId) {
          value.liveListAnchorInfoVO.contactFlag = data.contactFlag
        }
      });
      let LiveData = {
        listDataVos: listDataVos,
        tagListVOS: liveData.tagListVOS,
      };
      let LiveDetail = listDataVos.filter((value) => value.liveId == liveDetail?.liveId);
      // 当前选中数据更新
      if (LiveDetail[0] != undefined) {
        dispatch({ type: "live/SetLiveDetail", payload: LiveDetail[0] });
      }
      // 更新直播间列表
      dispatch(() => {
        return {
          type: "live/SetLiveData",
          payload: LiveData,
        };
      });

    }
    // console.log(msgHistory, "msgHistory")
    //
  };
  // 座驾播放
  const GetGiftListzjF = (url) => {
    console.log("座驾", url);
    if (url != undefined) {
      var player = new SVGA.Player("#CarSvga");
      var parser = new SVGA.Parser("#CarSvga"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
      // console.log(parser);
      player.loops = 1; //播放1次
      player.clearsAfterStop = true; //清空画布
      parser.load(url, function (videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
        player.onFrame(function () { });
        player.onFinished(() => {
          // console.log('停止', e);
          getLiveRoomRef.current = false;
        });
      });
    }
  };
  const init = useCallback(() => {
    console.log('liveDetail.liveId-----', liveDetail.liveId);
    if (liveDetail.liveId && Im.tim) {
      Im.joinRoom && Im.joinRoom(liveDetail.liveId);
      Im.on("getMsg", (msg) => {
        msg.map((e) => {
          if (e.payload && e.payload.text) {
            getMsg(JSON.parse(e.payload.text));
          }
        });
      });
      Im.on("onImReady", () => {
        imReadySet(true);
      });
    }
  }, [liveDetail.liveId, Im.tim]);
  useEffect(() => {
    if (Im.tim && liveDetail.liveId) init();
    // 拦截判断是否离开当前页面
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      window.removeEventListener("beforeunload", beforeunload);
      console.log('liveDetail.liveId-------', liveDetail.liveId);
      // liveDetail.liveId && Im.leaveRoom && 
      if (liveDetail.liveId && Im.tim && Im.leaveRoom) {
        console.log('Im.leaveRoom0---------', Im.leaveRoom);
        Im?.leaveRoom(liveDetail.liveId);
      }
    };
  }, [init, liveDetail.liveId, Im.tim]);
  //获取到礼物列表
  useEffect(() => {
    setMsgHistory([]);
    // window.eventBus.addListener('GetLiveDetailPC', GetLiveDetailPC)
    // window.eventBus.addListener("getGift", (data) => {
    //   setGift(data || []);
    // });
    window.eventBus.addListener("topFollow", () => {
      setFocusVisible(false);
    });
  }, []);
  useEffect(() => {
    hisEl.current.scrollTo(0, 9999999);
  }, [msgHistory]);
  /**
   * 1. 直播间关注卡片
   * 2. 如果未关注，10s后弹出关注卡片，16.5秒后自动隐藏关注卡片
   * 3. 关注刷新顶部的关注，卡片收起
   */
  useEffect(() => {
    if (baseInfo.isFollow) return;
    setTimeout(() => {
      setFocusVisible(true);
    }, 10000);
    setTimeout(() => {
      setFocusVisible(false);
    }, 16500);
  }, []);

  const beforeunload = (e) => {
    let confirmationMessage = "Are you sure you want to leave this page?";
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };
  //确认websocket
  const initWebSocket = useCallback((detail) => {
    try {
      let userInfo = {
        anchorId: detail.liveListAnchorInfoVO.anchorId,
        avatar: user.avatar,
        badgeList: user.badgeList,
        bimgs: user.bimgs || "",
        carId: user.carId || "",
        liveId: detail.liveId,
        nickname: user.nickname,
        resourceUrl: user.resourceUrl,
        roomHide: user.roomHide,
        sex: user.sex,
        type: detail.liveListRoomBaseVO.type,
        userExp: user.userExp,
        userLevel: user.userLevel,
      };
      let params = {
        data: userInfo,
        protocol: 2010,
      };
      // 清空卡片内容
      dispatch({
          type: "UPDATE_ANCHORCARDREQ",
          payload: {},
      });
      // 用户进房
      WsEnterRoom(params);
    } catch {
      console.error(detail, "进房");
    }
  }, []);
  const handleOnchangeInput = (e) => {
    setMsg(e.target.value);
    if (e.target.value) {
      setQuickComentFlag(false);
    } else {
      setQuickComentFlag(true);
    }
  };
  useEffect(() => {
    return () => {
      if (!baseInfo?.liveId) return;
      // 用户退房
      let params = {
        data: { liveId: baseInfo.liveId },
        protocol: 2011,
      };
      WsLeaveRoom(params);
    };
  }, [initWebSocket]);

  // useEffect(() => {
  //   if (liveDetail.liveId && imReady) {
  //     initWebSocket(liveDetail);
  //   }
  // }, [liveDetail, imReady]);
  useEffect(() => {
    if (liveDetail.liveId && Im.tim) {
      initWebSocket(liveDetail);
    }
  }, [liveDetail, Im]);



  useEffect(() => {
    if (imReady && liveDetail.liveId) {
      // 模拟推送座驾，本人进房显示座驾
      getMsg({ protocol: 5, carId: user.carId, isInter: true });
    }
  }, [imReady]);

  const rollowDom = () => {
    return (
      <div className="focus_card">
        <div className="focus_card_avatar">
          <img src={baseInfo.avatar} alt="" />
        </div>
        <div className="focus_card_info">
          <div className="focus_card_info_name">{baseInfo.nickname}</div>
          <div className="focus_card_info_tips">{t("comeFollow")}</div>
        </div>
        <div
          className={`focus_card_btn ${collectLoding && "loading"}`}
          onClick={() => {
            changeFollow();
          }}>
          + {t("guanzhu")}
        </div>
      </div>
    );
  };
  const changeFollow = async () => {
    setCollectLoding(true);
    const rt = await liveFollow({ isFollow: true, targetId: baseInfo.anchorId });
    if (!(rt instanceof Error)) {
      window.eventBus.emit("chatFollow", true);
      setTimeout(() => {
        setCollectLoding(false);
        setFocusVisible(false);
      }, 1000);
    }
  };
  return (
    <div className="live-detail-box-chat">
      <div className="baseColor">
        {t("liveNotice1")}
        {t("liveNotice2")}
        {t("liveNotice3")}
      </div>
      <div className="focusBox">
        <div className="page">
          <div className={`dialog ${focusVisible ? "dialog_visible" : ""}`}>{rollowDom()}</div>
        </div>
      </div>
      <div className="live-detail-box-chat-content" ref={hisEl}>
        {msgHistory.map((item, index) => {
          return (
            <div className="item" key={index}>
              {/* <div style={{ color: "#fff" }}>{item.protocol}---111---{item.tipType}</div> */}
              {/* 欢迎光临消息 */}
              {item.protocol == 5 && <div className="name_color"> {t("welcomeRoom").replace("$A", item.nickname)} </div>}
              {/* 送礼物消息 */}
              {item.protocol == 7 && (
                <div className="name_color">
                  {item.userLevel && <img style={{ height: 14, verticalAlign: "middle", marginTop: "-1px" }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                  <span>{item.nickname}</span> {t("songchu")}{" "}
                  <span className="gaoliang">
                    {" "}
                    {getGiftName(item.gid)}
                    {item.count > 1 && <span> x {item.count}</span>}
                  </span>
                </div>
              )}
              {/* 聊天消息 */}
              {item.protocol == 9 && item.tipType !== 2 && (
                <div className="f-a-c">
                  <div>
                    {item.userLevel && <img style={{ height: 14, verticalAlign: "middle", marginTop: "-1px" }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                    <span className="name_color" style={{ marginLeft: 5 }}>
                      {item.nickname}:{" "}
                    </span>
                    <span className="msg" style={{ color: "#fff", verticalAlign: "top", fontSize: "14", fontWeight: 400 }}>
                      {item.msg}
                    </span>
                  </div>
                </div>
              )}
              {/* 张三在五分快三投注了5金币 */}
              {item.protocol == 26 && (
                <>
                  {item.userLevel && <img style={{ height: 14, verticalAlign: "middle", marginTop: "-1px" }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                  <div className="name_color">
                    {" "}
                    {item.nickName}{" "}
                    <span className="name_color">
                      {t("zai")} {item.name} {t("tou_zhu_l")} {item.totalCoin}
                      {t("gold_coins")}
                    </span>{" "}
                  </div>
                </>
              )}
              {/* 张三在五分快三赢得了5金币 */}
              {item.protocol == 27 && (
                <>
                  {item.userLevel && <img style={{ height: 14, verticalAlign: "middle", marginTop: "-1px" }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                  <div className="name_color">
                    {item.nickName}{" "}
                    <span className="name_color">
                      {t("zai")} {item.name} {t("ying_de_l")} {item.winMoney}
                      {t("gold_coins")}
                    </span>
                  </div>
                </>
              )}
              {/* {
                            item.protocol == 999 && rollowDom(item)
                        } */}
              {/* 公屏推送 */}
              {item.protocol === 9 && item.tipType === 2 && (
                <>
                  <a
                    // liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.price}&isAd=${item.isAd}&pking=${item.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}
                    href={`/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=0&price=null&isAd=0&pking=false`}>
                    <span className="baseColor">
                      {item.nickname}{" "}
                      <span style={{ color: "#FFE762" }}>
                        {t("songchu")}
                        {item.gName} X{item.count} {t("to")}{" "}
                      </span>{" "}
                      {item.anchorNickname} <span style={{ color: "#55FFD1", textDecoration: "underline" }}>{t("LookAroundQuickly")}</span> <img src={require("../../../wap/assets/image/live/lkqw.png")} alt="" style={{ width: "16px", height: "16px" }} />
                    </span>
                  </a>
                </>
              )}
              {item.hotSportInfo > 0 && (
                <>
                  <a href={`/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=0&price=null&isAd=0&pking=false`}>
                    <div style={{ position: "relative", backgroundImage: `url("${require(`../../../assets/images/live/imty/ty${index + 1 <= 4 ? index + 1 : 4}.png`)}")`, backgroundSize: "100% 100%" }}>
                      <div style={{ display: "flex", alignItems: "center", paddingLeft: "5px", position: "relative" }}>
                        <img src={require(`../../../assets/images/live/imty/tylog${index + 1 <= 4 ? index + 1 : 4}.png`)} alt="" style={{ width: "40px", height: "22px", margin: "5px 0" }} />
                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#333", marginLeft: "5px" }}>
                          <span>
                            {t("HotD")} {item.opp1} vs {item.opp2}
                          </span>{" "}
                          <span style={{ fontSize: "10px", color: "#5E29DF" }}>{t("gatherAndWatch")}</span>
                        </div>
                        <img src={require("../../../assets/images/live/imty/right.png")} alt="" style={{ width: "16px", height: "16px" }} />
                      </div>
                      <img src={require(`../../../assets/images/live/imty/ty${index + 1 <= 4 ? index + 1 : 4}.png`)} alt="" style={{ height: "32px", position: "absolute", top: "0", left: "0" }} />
                    </div>
                  </a>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="live-detail-chatContainer">
        <div className="comments" style={{ display: quickComentFlag ? "block" : "none" }}>
          <div className="comments-title">
            <div className="right-title" onClick={() => setQuickComentFlag(false)}>
              X
            </div>
          </div>
          {quickComent.map((item, index) => {
            return (
              <div
                key={index}
                className="item"
                onClick={(e) => {
                  handleClickQuickComent(e, item.comment);
                }}>
                {index + 1 + "."}
                {item.comment}
              </div>
            );
          })}
        </div>
        <div className="live-detail-box-chat-input">
          <div className="flex">
            <Input
              onPressEnter={() => sendLiveChat()}
              onChange={(e) => {
                handleOnchangeInput(e);
              }}
              placeholder={t("liaotian_p")}
              value={msg}
              onFocus={() => setQuickComentFlag(true)}
            />
            <div onClick={() => sendLiveChat()} className={`icon icon-send ${sendLoading && "loading"}`}></div>
          </div>
        </div>
      </div>

      <div id="demoCanvas22" style={{ width: "507px", height: "87px", display: `${publicScreen2Ref.current && publicScreen?.type == 1 ? "block" : "none"}` }} className={"publicScreen4"}>
        <div className={"img1"}>
          <Avatar src={publicScreen?.avatar} className={"Avatars"} fallback={<img src={require("../../../wap/assets/image/join/logo.png")} />} />{" "}
          <div className={"fontCentre"}>
            <div className={"fontCentre2"}>
              {" "}
              <span className={"colors"}>{t("gongxi")}</span> <span>{publicScreen?.anchorNickname}</span> <span className={"colors"}>đã nhận được{publicScreen?.gname}từ user</span> <span>{publicScreen?.nickName}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="demoCanvaszj" style={{ width: "507px", height: "85px", display: `${publicScreenkjRef.current && publicScreenkj?.type == 2 ? "block" : "none"}` }} className={"publicScreen3 publicScreen"}>
        <div className={"img3"}>
          <Avatar src={publicScreenkj?.avatar} className={"Avatars"} fallback={<img src={require("../../../wap/assets/image/join/logo.png")} />} />{" "}
          <div className={"fontCentre"}>
            <div className={"fontCentre2"}>
              {" "}
              <span className={"colors"}>{t("gongxi")}</span> <span>{publicScreen?.nickName}</span> <span className={"colors"}>đã thắng{publicScreen?.amount}trong game</span> <span>{publicScreen?.lotteryName}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 座驾 */}
      <div id="CarSvga" style={{ display: `${getLiveRoomRef.current ? "block" : "none"}` }} className={"CarSvga"}></div>

      <div className={"CarSvga2_sss"}>
        <VAPPC data={videoInfo2} type="1" />
      </div>

      {/* 飘屏 */}
      <div className='FloatingScreens'>
        <VAPPC data={videoInfo} type="2" />
      </div>
    </div>
  );
};
