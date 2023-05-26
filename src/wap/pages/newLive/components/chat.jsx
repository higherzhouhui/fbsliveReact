import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./common.module.scss";
import { useTranslation } from "react-i18next";
import { Input, Mask, Avatar, Toast } from "antd-mobile";
import { LiveChat, startTurntable, inPlayTurntable } from "../../../server/live";
import { LuckyWheel } from "@lucky-canvas/react";
import { blocks, buttons, prizes } from "../components/LuckyWheel";
import { useNavigate } from "react-router-dom";
import useContextReducer from "../../../state/useContextReducer";
import SVGA from "svgaplayerweb";
import LuckyBag from "./luckyBag";
import GiftsToWX from "./GiftsToWX";
import i18n from "../../../lang/i18n";
import ChatMsg from "./Layout/ChatMsg";
import CrowdFunding from "./crowdFunding";
import { Local } from "../../../../common";
// import Vap from '../../../util/vap.js'
import VAP from "../../../components/vap/index.jsx";
import { uuidv4 } from "../../../../utils/tools";
let setTime1;
let setTime2;
export default function ChatEvent(props) {
  const {
    state: {
      user,
      live: { liveDetail, giftList: gift, zjGift },
    },
    fetchUtils,
    dispatch,
  } = useContextReducer.useContextReducer();
  const {
    liveListActivityInfoVO: { isLuckBag },
  } = liveDetail;
  const history = useNavigate();
  const [msgContent, setMsgContent] = useState("");
  const [msgHistory, setMsgHistory] = useState([]);

  const [giftsToWX, giftsToWXSet] = useState();

  // 情侣头像
  const [visibleGift5, visibleGift5Set] = useState(false);
  // 获取当前情侣头像信息
  const [logData, logDataSet] = useState({});
  const [videoInfo, setVideoInfo] = useState([]);
  const [videoInfo2, setVideoInfo2] = useState([]);

  const videoInfoRef = useRef([])
  const videoInfoRef2 = useRef([])


  // 抽奖转盘
  const [prizesD, prizesDSet] = useState(prizes);
  const [prizeNameobj, prizeNameobjSet] = useState({});
  const [visibleGift2, visibleGift2Set] = useState(false);
  const myLucky = useRef(null);
  const [luckyBox, luckyBoxSet] = useState(false);

  const [more, moreSet] = useState(false);
  const [showTypes, showTypesSet] = useState(false);
  // 展示框
  const [Exhibition, ExhibitionSet] = useState(false);
  const publicScreen2Ref = useRef(false);
  const publicScreenkjRef = useRef(false);
  const getLiveRoomRef = useRef(false);
  const showTypesRef = useRef(false);
  const { t } = useTranslation();
  const hisEl = useRef(null);
  const LuckyRef = useRef(null);

  const init = useCallback(() => {
    props.chat.on("getMsg", (msg) => {
      msg.map((e) => {
        // console.log('这是神没数据啊实打实多', e, JSON.parse(e.payload.text));
        if (e.payload && e.payload.text) {
          getMsg(JSON.parse(e.payload.text));
        }
      });
    });
  }, []);

  const refInput = useRef(null);
  //获取到礼物列表
  useEffect(() => {
    // inPlayTurntables();

    getLiveRoomCarId(); //初次加载自己座驾
    window.eventBus.addListener("hotSportInfoS", hotSportInfoS); //体育数据
    window.eventBus.addListener("visibleGift5SetD", visibleGift5SetD); //关闭互动礼物
    // window.eventBus.addListener("getLiveRoomCarId", getLiveRoomCarId); //座驾svga id
    return () => {
      window.eventBus.removeListener("hotSportInfoS", hotSportInfoS);
      window.eventBus.removeListener("visibleGift5SetD", visibleGift5SetD);
      // window.eventBus.removeListener("getLiveRoomCarId", getLiveRoomCarId);
    };
  }, []);

  const getLiveRoomCarId = () => {
    getLiveRoomRef.current = true;
    let [svga] = zjGift.filter((value) => {
      return Local("userInfo")?.carId == value.gid;
    });
    svga && GetGiftListzjF(svga);
  };

  // 座驾播放
  const GetGiftListzjF = (info) => {
    // let { videoUrl, videoJson } = info;
    // if (videoUrl && videoJson) {
    //   setVideoInfo2((e) => {
    //     return [...e, { src: videoUrl, config: videoJson }];
    //   });
    //   let data = [...videoInfoRef2.current]
    //   data.push({ src: videoUrl, config: videoJson, time: uuidv4() })
    //   videoInfoRef2.current = data
    // } else {

    if (info.resourceUrl) {
      var player = new SVGA.Player("#CarSvga");
      var parser = new SVGA.Parser("#CarSvga"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
      // console.log(parser);
      player.loops = 1; //播放1次
      player.clearsAfterStop = true; //清空画布
      parser.load(info.resourceUrl + '?a=1', function (videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
        player.onFrame(function () { });
        player.onFinished(() => {
          // console.log('停止', e);
          getLiveRoomRef.current = false;
        });
      });
    }


    // }
  };

  // 进房飘屏播放
  const GetGiftListzjF2 = (info, data) => {

    // let { videoUrl, videoJson } = info;
    // if (videoUrl && videoJson) {
    //   setVideoInfo((e) => {
    //     return [...e, { src: videoUrl, config: videoJson, srcTag: data.avatar, textTag: `${data?.nickname} ${t("enterRoom")}` }];
    //   });
    //   let data = [...videoInfoRef.current]
    //   data.push({ src: videoUrl, config: videoJson, srcTag: data.avatar, textTag: `${data?.nickname} ${t("enterRoom")}`, time: uuidv4() })
    //   videoInfoRef.current = data
    // } else {
    if (info.resourceUrl) {
      if (data.avatar) {
        img2Base64(data.avatar, (e) => {
          data.avatar = e;
        });
      }
      var player = new SVGA.Player("#CarSvga2");
      var parser = new SVGA.Parser("#CarSvga2"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
      // console.log(parser);
      player.loops = 1; //播放1次
      player.clearsAfterStop = true; //清空画布
      parser.load(info.resourceUrl + '?a=1', function (videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
        player.onFrame(function () { });
        player.setImage(data?.avatar || require("../../../assets/image/login/logoz.png"), "avatar");
        player.setText(
          {
            text: `${data?.nickname} ${t("enterRoom")}`,
            family: "Arial",
            size: "24px",
            color: "#ffe0a4",
          },
          "content"
        );
        player.onFinished(() => {
          console.log("停止");
          showTypesSet(false);
          showTypesRef.current = false;
        });
      });
    }


    // }

  };

  // mp4回调
  const callbacks = (e) => {
    let data1 = [...videoInfoRef2.current]
    let data2 = [...videoInfoRef.current]
    // 座驾
    if (e.type == 1) {
      data1.forEach((value, index) => {
        if (value.time == e.time) {
          data1.splice(index, 1)
        }
      })
      setVideoInfo2(data1)
      videoInfoRef2.current = data1
    }
    // 飘屏
    if (e.type == 2) {
      data2.forEach((value, index) => {
        if (value.time == e.time) {
          data2.splice(index, 1)
        }
      })
      setVideoInfo(data2)
      videoInfoRef.current = data2
    }
  }

  // 获取当前表演节目
  const inPlayTurntables = () => {
    inPlayTurntable({ anchorUid: liveDetail.liveListAnchorInfoVO.anchorId }).then((item) => {
      prizeNameobjSet(item);
      timeRemainingSet(item === undefined ? null : item.timeRemaining * 1000);
    });
  };
  // 进度
  // 关闭互动礼物
  const visibleGift5SetD = () => {
    visibleGift5Set(false);
  };
  // 获取转盘礼物
  const startTurntables = (anchorId, turntableRecordId) => {
    startTurntable({ anchorUid: anchorId, turntableRecordId: turntableRecordId })
      .then((item) => {
        // console.log('这是多少数据23243', item);
        let data = [...prizesD];
        var i = null;
        data.forEach((item_1, index) => {
          item_1.fonts[0].text = item[index].propsName;

          if (item[index].res === true) {
            i = index;
          }
        });
        // console.log('替换数据', data, i);
        prizesDSet(data);

        visibleGift2Set(true);
        // onPrizeStart(i)

        // 调用开始
        setTimeout(() => {
          myLucky.current.play();
        }, 1000);
        // 结束
        setTimeout(() => {
          myLucky.current.stop(i);
        }, 3500);

        luckyBoxSet(true);
      })
      .catch(() => {
        visibleGift2Set(false);
      });
  };

  const hotSportInfoS = (e) => {
    // 体育信息
    if (e !== null && e !== undefined && e.length > 0) {
      e.forEach((value) => {
        msgHistory.push({ ...value, hotSportInfo: e.length, tipType: 11 });
      });
    }
  };
  const getGiftName = (gid) => {
    let [item] = gift.filter((item) => item.gid === gid);
    return item ? item.gname : "";
  };

  // 世界公屏

  const [publicScreen, publicScreenSet] = useState({});

  const [publicScreenkj, publicScreenkjSet] = useState({});

  const getMsg = (data) => {
    let pro = [5, 9]; //有用消息

    // console.log('dataim信息', data);
    //用户消息
    if (pro.includes(data.protocol)) {
      if (data.nickname) {
        msgHistory.push(data);
        setMsgHistory([...msgHistory]);
      }
    }
    if (data.protocol === 7) {
      dispatch({ type: "live/SetManTotalRps", payload: data?.rp || 0 });

      if (data.nickname) {
        if (data.giftType !== 10 && data.giftType !== 20) {
          msgHistory.push(data);
          setMsgHistory([...msgHistory]);
        }
      }
      // 1 情侣头像
      if (data.interactiveAvatar == 1) {
        logDataSet(data);
        visibleGift5Set(true);
      } else {
        visibleGift5Set(false);
      }
      // 转盘礼物
      if (data.giftType == 20) {
        giftTypesSet(data);

        // console.log('转盘大撒发顺丰', data);
        startTurntables(data.anchorId, data.turntableRecordId); //获取转盘礼物
        var player = new SVGA.Player("#demoCanvas");
        var parser = new SVGA.Parser("#demoCanvas"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // console.log(parser);
        parser.load(require("../../../assets/image/live/zp/bj.svga"), function (videoItem) {
          player.setVideoItem(videoItem);
          player.startAnimation();
          player.onFrame(function () { });
        });
      }
      // 众筹
      if (data.giftType == 10) {
        giftTypesSet(data);
      }
    }
    // 座驾
    if (data.protocol == 5) {
      dispatch({ type: "live/SetManTotalRps", payload: data?.rp || 0 });
      if (data.isInter == true) {
        if (Local("userInfo")?.uid != data?.uid) {
          if (data.carId != null && data.carId != undefined) {
            let svga = zjGift.filter((value) => {
              return data.carId == value.gid;
            });
            getLiveRoomRef.current = true;
            GetGiftListzjF(svga[0] || {});
          }
        }
        if (data.showType == 0) {
          GetGiftListzjF2(
            Local("LevelProp").filter((value) => {
              return value?.level == data?.userLevel;
            })[0],
            data
          );
        }
      }
    }
    //投注消息
    if (data.protocol === 26) {
      msgHistory.push(data);
      setMsgHistory([...msgHistory]);
    }

    //开奖消息
    if (data.protocol === 27) {
      console.log('data.protocol==27-------------------------------', data);
      msgHistory.push(data);
      setMsgHistory([...msgHistory]);
    }
    if (data.protocol === 50) {
      LuckyRef.current.imEvent(data);
      dispatch({ type: "live/HandleSwitchLuckBug", payload: true });
    }

    if (data.protocol == 80) {
      // console.log("世界公屏活动", data.type);
      if (data.type == 1 && publicScreen2Ref.current == false) {
        publicScreen2Ref.current = true;
        publicScreenSet(data);

        // var player = new SVGA.Player("#demoCanvas22");
        // var parser = new SVGA.Parser("#demoCanvas22"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // // player.clearsAfterStop = true; //清空画布
        // // console.log(parser);cjsvg.svga  zjsvg.svga
        // parser.load(require("../../../assets/image/live/sj/cjsvg.svga"), function (videoItem) {
        //   player.setVideoItem(videoItem);
        //   player.startAnimation();
        //   player.onFrame(function () { });
        // });

        setTime1 = setTimeout(() => {
          // player.stopAnimation()
          // publicScreen2Set(false)
          publicScreen2Ref.current = false;
          publicScreenSet({});
          clearTimeout(setTime1);
          setTime1 = null;
        }, 10000);
      }

      // publicScreen2sRef.current == false
      if (data.type == 2 && publicScreenkjRef.current == false) {
        publicScreenkjRef.current = true;
        publicScreenkjSet(data);

        // var player2 = new SVGA.Player("#demoCanvaszj");
        // var parser2 = new SVGA.Parser("#demoCanvaszj"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // parser2.load(require("../../../assets/image/live/sj/zjsvg.svga"), function (videoItem) {
        //   player2.setVideoItem(videoItem);
        //   player2.startAnimation();
        //   player2.onFrame(function () { });
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
    if (data.protocol == 88) {
      // console.log('88获取主播微信弹窗', data);
      giftsToWXSet(data);
    }
  };


  // 图片跨域转64位
  const getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png"); // 可选其他值 image/jpeg
    return dataURL;
  };
  // 图片跨域转64位
  const img2Base64 = (src, cb) => {
    var image = new Image();
    image.src = src + "?v=" + Math.random(); // 处理缓存
    image.crossOrigin = "*"; // 支持跨域图片
    image.onload = function () {
      var base64 = getBase64Image(image);
      cb && cb(base64);
    };
  };


  //发送消息
  const handleSendMsg = async (e, data) => {
    e.stopPropagation(0);

    if (data != undefined) {
      await LiveChat({ liveId: liveDetail.liveId, msg: data });
      setMsgContent("");
      props.showMsgInput(false);
      moreSet(false);
      return;
    }
    if (!msgContent) return;
    await LiveChat({ liveId: liveDetail.liveId, msg: msgContent });
    setMsgContent("");
    props.showMsgInput(false);
    moreSet(false);
  };

  useEffect(() => {
    // console.log('这是多少数据131232', msgHistory);
    hisEl.current.scrollTo(0, 9999999);
  }, [msgHistory]);

  useEffect(() => {
    init();
  }, [init]);

  // 倒计时
  const showtime = () => {
    if (timeRemaining === null) {
      return;
    }
    if (timeRemaining < 1000 && prizeNameobj !== undefined) {
      inPlayTurntables(); //重新获取
    }
    var lefttime = timeRemaining, //距离结束时间的毫秒数
      leftm = Math.floor((lefttime / (1000 * 60)) % 60), //计算分钟数
      lefts = Math.floor((lefttime / 1000) % 60); //计算秒数
    //返回倒计时的字符串
    // return ;
    timesDSet(`${leftm} : ${lefts >= 10 ? lefts : `0${lefts}`}`);
  };
  const [timesD, timesDSet] = useState("");
  const [timeRemaining, timeRemainingSet] = useState("");

  // 获取当前时间戳
  const [timeStamp, timeStampSet] = useState(new Date().getTime());
  useEffect(() => {
    setInterval(() => {
      timeStampSet(new Date().getTime());
    }, 1000);
  }, []);

  // useEffect(() => {
  //   timeRemainingSet(Number(timeRemaining) - 1000);
  //   // showtime();
  // }, [timeStamp]);
  // 礼物2 中奖结束
  const onPrizeEnd = (prize) => {
    Toast.show({
      content: t("winALottery") + prize.fonts[0].text + t("prize"),
      duration: 3000,
    });
    inPlayTurntables(); //获取当前表演节目
    visibleGift2Set(false);
  };

  // 众筹礼物------------------------------------------------------------------------------
  const [giftTypes, giftTypesSet] = useState({});

  return (
    <>
      {/* {visibleGift2 && <div id="#svga-wrap" style={{ position: 'fixed', top: '0', left: '0', zIndex: '99999', width: '100vw', height: '100vh' }}>11</div>} */}
      <div className={style.msgHistory} ref={hisEl}>
        {msgHistory.map((item, index) => (
          <div key={index}>
            <div>
              {/* 公屏推送是使用 */}
              <div className={item.hotSportInfo > 0 ? "" : style.protocol}>
                {item.tipType !== 2 && item.tipType !== 11 && (
                  <span>
                    {item.vipLevelId !== undefined && item.vipLevelId !== 0 && item.vipLevelId <= 5 && <img className={style.protocol_img} style={{ marginRight: "3px" }} src={require(`../../../assets/image/live/jw/jw${item.vipLevelId}.png`)} />} {<img className={style.protocol_img} src={require(`../../../assets/image/live/level_${item.userLevel || 1}.png`)} />} {item.protocol != 5 && <span className={style.protocol_name}>{item.nickname || item.nickName}</span>}
                  </span>
                )}
                {item.protocol === 5 && (
                  <>
                    <span className={style.content}>{t("welcomeRoom", { name: item.nickname })}</span>
                  </>
                )}
                {/* 公屏推送使用 */}
                {item.protocol === 9 && item.tipType !== 2 && (
                  <>
                    <span className={style.content}>
                      <ChatMsg msg={item.msg} />
                    </span>
                  </>
                )}

                {/* 体育 */}
                {item.tipType === 11 && item.hotSportInfo > 0 && (
                  <>
                    <div
                      style={{ position: "relative", marginBottom: "3px", backgroundImage: `url("${require(`../../../assets/image/live/ty/ty${index + 1 <= 4 ? index + 1 : 4}.png`)}")`, backgroundSize: "100% 100%" }}
                      onClick={() => {
                        console.log("跳转3");
                        dispatch({
                          type: "UPDATE_ANCHORCARDREQ",
                          payload: {},
                        });
                        history("/liveRoom", { state: { ...item, nickname: item.liga }, replace: true });
                      }}>
                      <div style={{ display: "flex", alignItems: "center", paddingLeft: "5px", position: "relative" }}>
                        <img src={require(`../../../assets/image/live/ty/tylog${index + 1 <= 4 ? index + 1 : 4}.png`)} alt="" style={{ width: "50px", height: "28px", margin: "5px 0" }} />
                        <div style={{ fontSize: "12px", fontWeight: "500", color: "#fff", marginLeft: "5px" }}>
                          <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "200px" }}>
                            {t("HotD")} {item.opp1} vs {item.opp2}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {" "}
                            <span style={{ fontSize: "10px", color: "#5E29DF" }}>{t("gatherAndWatch")}</span> <img src={require("../../../assets/image/live/ty/right.png")} alt="" style={{ width: "16px", height: "16px" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 公屏推送 */}
                {item.protocol === 9 && item.tipType === 2 && (
                  <>
                    <span
                      className={style.content}
                      onClick={() => {
                        console.log("跳转4");
                        dispatch({
                          type: "UPDATE_ANCHORCARDREQ",
                          payload: {},
                        });
                        history("/liveRoom", { state: { ...item, nickname: item.anchorNickname }, replace: true });
                      }}>
                      {item.nickname}{" "}
                      <span style={{ color: "#FFE762" }}>
                        {t("songchu")}
                        {item.gName} X{item.count} {t("to")}{" "}
                      </span>{" "}
                      {item.anchorNickname} <span style={{ color: "#55FFD1", textDecoration: "underline" }}>{t("LookAroundQuickly")}</span> <img src={require("../../../assets/image/live/lkqw.png")} alt="" style={{ width: "16px", height: "16px" }} />
                    </span>
                  </>
                )}
                {item.protocol === 7 && (
                  <>
                    <span className={style.content}>
                      {" "}
                      {t("songchu")} <span className={style.gaoliang}>{getGiftName(item.gid)}</span>
                    </span>
                  </>
                )}
                {item.protocol === 26 && (
                  <>
                    <span className={style.content}>
                      {" "}
                      {t("zai")} {item.name} {t("tou_zhu_l")} {item.totalCoin} {t("jin_bi")}
                    </span>
                  </>
                )}
                {item.protocol === 27 && (
                  <>
                    <span className={style.content}>
                      {" "}
                      {t("zai")} {item.name} {t("ying_de_l")} {item.winMoney} {t("jin_bi")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {props.showMsg ? (
        <div
          className={style.sendBody}
          onClick={() => {
            props.showMsgInput(false), moreSet(false);
          }}>
          <div className={style.sendInput}>
            {props.showMsg && (
              <div className={style.quick}>
                <div className={style.quick_scroll}>
                  {Local("getLiveQuickComment") &&
                    Local("getLiveQuickComment").map((value, index) => {
                      return (
                        value?.status == 1 && (
                          <div
                            key={value?.id}
                            onClick={(e) => {
                              handleSendMsg(e, value?.comment);
                            }}
                            className={style.divs}>
                            {value?.comment}
                          </div>
                        )
                      );
                    })}
                </div>
                <div
                  className={style.more}
                  onClick={(e) => {
                    e.stopPropagation(), moreSet(!more);
                  }}>
                  {t("ui_more")}
                  <img src={require(`../../../assets/image/newImg/kjpl/${more ? "top" : "bottom"}.png`)} alt="" />
                </div>
              </div>
            )}
            <div className={style.inputs}>
              <Input
                autoFocus
                type="text"
                placeholder={t("chatInput")}
                onClick={(e) => {
                  e.stopPropagation(), moreSet(false);
                }}
                onChange={setMsgContent}
                ref={refInput}
              />
              <img src={require("../../../assets/image/live/live-send.png")} alt="" onClick={handleSendMsg} className={style.sendBtn2} />
            </div>
            {/* 更多快捷 */}
            {more && (
              <div
                className={style.quick_box}
                onClick={(e) => {
                  e.stopPropagation();
                }}>
                {Local("getLiveQuickComment") &&
                  Local("getLiveQuickComment").map((value, index) => {
                    return (
                      value?.status == 1 && (
                        <div
                          key={value?.id}
                          onClick={(e) => {
                            handleSendMsg(e, value?.comment);
                          }}
                          className={style.divs}>
                          {value?.comment}
                        </div>
                      )
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={style.chatEnter}
          onClick={() => {
            props.showMsgInput(true);
          }}>
          {/* live-icon-b1.png */}
          <img src={require("../../../assets/image/live/xzb/inputs.png")} className={style.chatIcon} />
          <div className={style.fontSizes}>Chat...</div>
          {/* {t('say_something')} */}
        </div>
      )}

      {/*  情侣头像互动*/}
      <Mask opacity={0} visible={visibleGift5} className={style.gift5}>
        <div className={style.user}>
          <div className={`${style.user1} animate__animated animate__slideInLeft`}>
            <Avatar size={55} className={style.avatar} src={logData?.anchorAvatar} fallback={<img src={require("../../../assets/image/join/logo.png")} />} /> <div className={`${style.name} ${style.margin_right}`}>{logData.anchorNickname}</div>
          </div>
          <div className={`${style.user2} animate__animated animate__slideInRight`}>
            <Avatar className={style.avatar} size={55} src={logData?.avatar} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />
            <div className={style.name}>{logData.nickname}</div>
          </div>
        </div>
      </Mask>
      <div id="demoCanvas" style={{ width: "130vw", height: "130vh", position: "fixed", top: "35%", left: "50%", transform: "translate(-50%, -50%)", display: `${visibleGift2 ? "block" : "none"} ` }}>
        {" "}
      </div>
      {/* 活动2 转盘抽奖*/}
      <Mask opacity={0} visible={visibleGift2} className={style.gift2}>
        <div className={`${style.lucky_box}  ${style.lucky_box_bg1}`}>
          <div className={`${!luckyBox ? style.lucky_box_bg2sss : style.lucky_box_bg2sssbj}`}>
            <div className={`${!luckyBox ? style.lucky_box_bg2sss2 : style.lucky_box_null}`}>
              <div className={style.lucky_wheel}>
                <LuckyWheel
                  ref={myLucky}
                  blocks={blocks}
                  prizes={prizesD}
                  buttons={buttons}
                  onStart={() => {
                    luckyBoxSet(true);
                  }}
                  onEnd={(prize) => {
                    onPrizeEnd(prize);
                    ExhibitionSet(true);
                    luckyBoxSet(false);
                  }}></LuckyWheel>
              </div>
            </div>
          </div>
        </div>
      </Mask>

      <CrowdFunding giftTypes={giftTypes} display={props.display} showMsgInput={props.showMsgInput} showMsg={props.showMsg} chat={props.chat} downTime={props.downTime} />

      {/* 福袋 */}
      <LuckyBag ref={LuckyRef} />

      {/* 世界公屏、打赏、中奖 */}
      {/*  display: `${publicScreen2 && publicScreen?.type == 1 ? 'block' : 'none'}`   */}
      <div id="demoCanvas22" style={{ width: "calc(100vw - 40px)", height: "87px", display: `${publicScreen2Ref.current && publicScreen?.type == 1 ? "block" : "none"}` }} className={style.publicScreen4}>
        <div className={style.img1}>
          <Avatar src={publicScreen?.avatar} className={style.Avatars} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />{" "}
          <div className={style.fontCentre}>
            <div className={style.fontCentre2}>
              {" "}
              <span className={style.colors}>{t("gongxi")}</span> <span>{publicScreen?.anchorNickname}</span> <span className={style.colors}>đã nhận được{publicScreen?.gname}từ user</span> <span>{publicScreen?.nickName}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="demoCanvaszj" style={{ width: "calc(100vw - 40px)", height: "85px", display: `${publicScreenkjRef.current && publicScreenkj?.type == 2 ? "block" : "none"}` }} className={style.publicScreen3}>
        <div className={style.img3}>
          <Avatar src={publicScreenkj?.avatar} className={style.Avatars} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />{" "}
          <div className={style.fontCentre}>
            <div className={style.fontCentre2}>
              {" "}
              <span className={style.colors}>{t("gongxi")}</span> <span>{publicScreen?.nickName}</span> <span className={style.colors}>đã thắng{publicScreen?.amount}trong game</span> <span>{publicScreen?.lotteryName}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 获取主播wx */}
      {
        <GiftsToWX
          giftsToWX={giftsToWX}
          giftsToWXF={(e) => {
            giftsToWXSet(e);
          }}
          lang={i18n.language}
          state={props.state}
        />
      }
      {/* 飘屏 */}
      <div className={style.FloatingScreens}>
        <VAP data={videoInfoRef.current} type="2" callbacks={callbacks}></VAP>
      </div>
      {/* 座驾 */}
      <VAP data={videoInfoRef2.current} type="1" callbacks={callbacks} />


      {/* 兼容svga */}
      {/* 座驾 */}
      {/* style={{ display: `${getLiveRoomRef.current ? "block" : "none"}` }} */}
      <div id="CarSvga" className={style.CarSvga}></div>
      {/* 进房飘屏 */}
      {/* style={{ display: `${showTypesRef.current ? "block" : "none"}` }} */}
      <div id="CarSvga2" className={style.FloatingScreen}></div>
    </>
  );
}
