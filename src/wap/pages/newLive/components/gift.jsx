import { Popup, Space, Swiper, ProgressBar, Tabs, Toast, Mask } from "antd-mobile";
import _ from "lodash";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SendGift, GetUserExperienceInfo, giftBagList, giftStatus } from "../../../server/live";
import GiftSideItem from "./giftSideItem";
import style from "./common.module.scss";
import useContextReducer from "../../../state/useContextReducer";
import { useNavigate } from "react-router-dom";
import { BackAllGameCoin } from "../../../server/balance";
import { useTranslation } from "react-i18next";
import VAP from "../../../components/vap";

const PointOut = React.lazy(() => import("../../../components/pointOut/index"));
const InitialCharge = React.lazy(() => import("./InitialCharge/index"));
const DeliverNum = React.lazy(() => import("./deliverNum/index"));
import i18n from "../../../lang/i18n";
import { Local } from "../../../../common";
import { uuidv4 } from "../../../../utils/tools";
let times, times2, times3;
export default function Gift(props) {
  const { t } = useTranslation();
  const {
    state: { user, assergoldData, live, showRechargeGift },
    fetchUtils,
    dispatch,
  } = useContextReducer.useContextReducer();
  const { giftData, giftList, liveDetail } = live;
  const { userGetUserAsserGold, HandleGetGiftData } = fetchUtils;
  const history = useNavigate();
  const [showGift, setShowGift] = useState(false); //是否展示礼物
  // const [active, setActive] = useState({ key: -1, index: -1 })//选中的礼物
  // const [active, setActive] = useState({ index: -1 }); //选中的礼物
  const [active, setActive] = useState({ index: 0 }); //选中的礼物
  const [experienceInfo, setExperienceInfo] = useState({}); //升级经验条
  const [typeIndex, typeIndexSet] = useState("0"); //礼物当前选中分类

  const [deliverApis, deliverApisSet] = useState(0);
  const [deliverApis2, deliverApis2Set] = useState(0);

  const [deliverApis3, deliverApisSet3] = useState(0);
  const [onTouchStartTim, onTouchStartTimSet] = useState();
  const [onTouchStarts, onTouchStartsSet] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const [opens, opensSet] = useState(false);
  const [videoInfo3, videoInfo3Set] = useState([]);
  const videoInfo3Ref = useRef([])

  const deliverApisRef = useRef(0);
  const deliverApisRef2 = useRef(0);
  const stopTtRef = useRef(false); //判断是否立即执行送礼
  const SwiperRef = useRef();
  const showScreenGiftRef = useRef([])
  const playHaveRef = useRef(false)

  const longPressInterval = 600; //长按的毫秒数
  //左侧动画
  const [giftSideList, setGiftSideList] = useState({ list: [] });

  useEffect(() => {
    if (showGift) {
      console.log("giftData----------------------", giftData);
      giftStatusF(); //判断首存活动状态

      giftBagListF() //判断首存活动背包

      getUserExperienceInfo() //获取经验
    }
  }, [showGift]);

  const giftBagListF = async () => {
    let data = [...giftData];
    const res = await giftBagList({ uid: Local("userInfo")?.uid });
    if (!(res instanceof Error)) {
      console.log("----------------背包礼物", res, JSON.stringify(giftData).includes("背包"));
      if (!JSON.stringify(giftData).includes("背包")) {
        data = [
          ...giftData,
          {
            chLan: "背包",
            code: "9999",
            propBaseResponses: res || [],
            ynLan: "ba lô",
          },
        ];
      } else {
        data.forEach((value) => {
          if (value.chLan == "背包") {
            value.propBaseResponses = res || [];
          }
        });
      }
      dispatch(() => {
        return {
          type: "live/SetGiftData",
          payload: data,
        };
      });
    }
  };

  const giftStatusF = async () => {
    const res = await giftStatus({ uid: Local("userInfo")?.uid });
    if (!(res instanceof Error)) {
      window.eventBus.emit("store", { type: "showRechargeGift", payload: { showRechargeGift: res } });
    }
  };

  const giftGroup2 = useMemo(() => {
    if (giftData.length < 1) {
      return [];
    } else {
      let list = giftData[typeIndex]?.propBaseResponses || [];
      return list;
    }
  }, [giftData, typeIndex]);

  // 获取用户等级信息
  const getUserExperienceInfo = async () => {
    const res = await GetUserExperienceInfo({ type: 2, uid: Local("userInfo")?.uid });
    if (!(res instanceof Error)) {
      setExperienceInfo(res);
    }
  };

  const getMsg = (data) => {
    // console.log(data);
    //接收到礼物消息
    if (data.protocol === 7) {
      if (data.giftType !== 20 || data.giftType === 10) {
        let sarr = giftSideList.list;
        let obj = _.pick(data, ["gid", "uid"]);
        let arr = sarr.map((e) => _.pick(e, ["gid", "uid"]));
        if (!JSON.stringify(arr).includes(JSON.stringify(obj))) {
          data.timestamp = new Date().getTime();
          sarr.push(data);
        } else {
          let index = arr.findIndex((item) => JSON.stringify(item) === JSON.stringify(obj));
          sarr[index].combo += 1;
          sarr[index].timestamp = new Date().getTime(); //data.timestamp
        }
        setGiftSideList({ list: sarr });

        // console.log('送礼im------------', data);
        addAni(data);
      }
    }
  };

  const init = useCallback(() => {
    // getUserExperienceInfo();
    // HandleGetGiftData();

    props.chat.on("getMsg", (msg) => {
      msg.map((e) => {
        if (e.payload && e.payload.text) {
          getMsg(JSON.parse(e.payload.text));
        }
      });
    });
  }, []);
  useEffect(() => {
    init();
  }, [init]);

  const handleSendGift = async () => {
    // 判断是否是背包礼物
    if (giftGroup2[active.index].num != undefined) {
      if (giftGroup2[active.index].num >= deliverApisRef2.current) {
        // console.log('deliverApisRef2.current--', giftGroup2[active.index].num, deliverApisRef2.current);
        if (active.index == -1) return;
        let gift = giftGroup2[active.index];
        let {
          liveListAnchorInfoVO: { anchorId },
          liveId,
        } = liveDetail;
        let gid = gift.gid;
        const res = await SendGift({
          anchorId,
          combo: 1,
          count: deliverApisRef2.current, //送礼次数
          gid,
          liveId,
          bagProp: 1, //背包道具  1 是背包道具 , 0 不是
        });
        getUserExperienceInfo();
        stopTtRef.current = false;
        if (!(res instanceof Error)) {
          giftBagListF(); //刷新背包数量

          onTouchStartsSet(false);
          // // 控制开起轮盘、情侣头像
        }
      } else {
        Toast.show({
          content: t("liwushuliangbuzu"),
        });
      }
      return;
    }

    if (Number(giftGroup2[active.index]?.goldCoin) * deliverApisRef2.current > Number(assergoldData?.goldCoin)) {
      if (showRechargeGift.showRechargeGift == 1) {
        opensSet(true);
      } else {
        setVisible2(true);
      }
      return;
    }
    if (active.index == -1) return;
    let gift = giftGroup2[active.index];
    let {
      liveListAnchorInfoVO: { anchorId },
      liveId,
    } = liveDetail;
    let gid = gift.gid;
    const res = await SendGift({
      anchorId,
      combo: 1,
      count: deliverApisRef2.current, //送礼次数
      gid,
      liveId,
      bagProp: 0, //背包道具  1 是背包道具 , 0 不是
    });
    getUserExperienceInfo();
    stopTtRef.current = false;
    if (!(res instanceof Error)) {
      onTouchStartsSet(false);
      if (res.data.code == 4003) {
        if (showRechargeGift.showRechargeGift == 1) {
          opensSet(true);
        } else {
          setVisible2(true);
        }
        return
      }
      if (res.data.data) {
        res.data.data = Math.floor(res.data.data * 100) / 100
        console.log('res.data.data', res.data.data);
        dispatch(() => {
          return {
            type: "UPDATE_ASSERGOLD",
            payload: { ...assergoldData, goldCoin: res.data.data },
          };
        });
      }

      // // 控制开起轮盘、情侣头像
      // userGetUserAsserGold();
      // 清除记录
    }
  };
  useEffect(() => {
    window.eventBus.addListener("giftTrue", giftTrue);
  }, []);
  const giftTrue = (e) => {
    console.log("礼物ids----------------------------", giftData, e);
    if (e) {
      setTimeout(() => {
        console.log("SwiperRef.current---", e);
        typeIndexSet(e.index);
        SwiperRef.current.swipeTo(e.index);

        setTimeout(() => {
          setActive({ index: e.index_2 });
        }, 200);
      }, 200);
    }
    setShowGift(true);
  };
  //左侧动画播放完成，删除动画
  const handleDelAni = (index) => {
    let sarr = giftSideList.list;
    sarr.splice(index, 1);
    setGiftSideList({ list: sarr });
  };

  //全屏动画效果
  const addAni = (obj) => {
    const { giftList } = live;
    let [data] = giftList.filter((val) => val.gid === obj.gid);
    showScreenGiftRef.current = [...showScreenGiftRef.current, { url: data?.resourceUrl, time: uuidv4() }]

    // showScreenGift(data?.resourceUrl);

    // console.log("当前动画", data);

    // 暂时隐藏mp4
    // let { videoUrl, videoJson } = data;
    // if (videoUrl && videoJson) {
    //   videoInfo3Set((e) => {
    //     return [...e, { src: videoUrl, config: videoJson, time: uuidv4() }];
    //   });
    //   let data = [...videoInfo3Ref.current]
    //   data.push({ src: videoUrl, config: videoJson, time: uuidv4() })
    //   videoInfo3Ref.current = data
    // } else {
    //   showScreenGift(data?.resourceUrl);
    // }
  };

  const onLoad = useCallback((val) => {
    console.log('val---', val);
    if (!playHaveRef.current) {
      const item = _.head(val);
      if (!item) return
      showScreenGift(item)
    }

  }, [])

  useEffect(() => {
    onLoad(showScreenGiftRef.current)
  }, [onLoad, showScreenGiftRef.current])

  const showScreenGift = (item) => {
    let { url, time } = item
    if (url != undefined) {
      playHaveRef.current = true
      url = url?.replace("http:", "")?.replace("https:", "");
      var player = new SVGA.Player("#svga-wrap");
      var parser = new SVGA.Parser("#svga-wrap");
      parser.load(url + '?a=1', (videoItem) => {
        player.loops = 1; // 循环次数
        player.setVideoItem(videoItem);
        player.startAnimation();
        player.onFinished(() => {
          //动画结束
          //删除当前播放列表
          window.eventBus.emit("visibleGift5SetD"); //关闭互动礼物
          playHaveRef.current = false

          deletesF(time)
        });
      });
    }

  };

  const deletesF = (e) => {
    let data1 = [...showScreenGiftRef.current]
    data1.forEach((value, index) => {
      if (value.time == e) {
        data1.splice(index, 1)
      }
    })
    console.log('data1------', data1);
    // resourceUrlsSet(data1)
    showScreenGiftRef.current = data1
  }

  const setShowGiftF = async () => {
    setShowGift(true);
    // user?.goldCoin <= 1
    if (assergoldData?.goldCoin <= 1) {
      const res = await BackAllGameCoin();
      if (!(res instanceof Error)) {
        console.log("ressssss", res);
        // freshUser();
        userGetUserAsserGold();
      }
    }
  };
  //连击的时候
  const deliverApi = () => {
    times2 = setTimeout(() => {
      if (Number(assergoldData?.goldCoin) > Number(giftGroup2[active.index]?.goldCoin)) {
        deliverApisSetAdd(); //加一
        handleSendGift(); //请求送礼
        deliverApi();
      } else {
        Toast.show({
          content: t("sysmsg_amount_not_enough"),
        });
      }
    }, 500);
  };

  // 加1
  const deliverApisSetAdd = () => {
    clearTimeout(times3);
    deliverApisSet((a) => a + 1);
    deliverApis2Set((a) => a + 1);
    deliverApisSet3((a) => a + 1);

    deliverApisRef.current = deliverApisRef.current + 1;

    times3 = setTimeout(() => {
      // console.log('deliverApis2-------------', stopTtRef.current, deliverApisRef.current, deliverApisRef2.current);
      if (!stopTtRef.current) {
        deliverApisRef2.current = _.cloneDeep(deliverApisRef.current);
        handleSendGift();
      }
      deliverApisSetResetting(); //重置
      onTouchStartsSet(false);
      clearTimeout(times3);
    }, 1500);
  };

  // 重置
  const deliverApisSetResetting = async () => {
    deliverApisSet(0);
    deliverApis2Set(0);
    deliverApisRef.current = 0;
  };

  // 立即执行
  const immediately = () => {
    stopTtRef.current = true;
    deliverApisRef2.current = _.cloneDeep(deliverApisRef.current);
    deliverApisRef2.current != 0 ? (clearTimeout(times3), handleSendGift()) : (stopTtRef.current = false);
  };


  // mp4回调
  const callbacks = (e) => {
    let data1 = [...videoInfo3Ref.current]
    // console.log('data1--', data1);
    if (e.type == 3) {
      data1.forEach((value, index) => {
        if (value.time == e.time) {
          data1.splice(index, 1)
        }
      })
      videoInfo3Set(data1)
      videoInfo3Ref.current = data1
    }
  }


  return (
    <>
      <img
        style={{ width: "46px", height: "46px" }}
        src={require("../../../assets/image/live/xzb/lw.png")}
        alt=""
        onClick={() => {
          setShowGiftF();
        }}
      />
      <div id="svga-wrap" className={style["svga-wrap"]}></div>
      <div className={style.sideAni}>
        {/* 送出礼物im区提示 */}
        {giftSideList.list.map((item, index) => {
          return giftList.length > 0 ? <GiftSideItem key={`${item.uid}-${item.gid}`} item={item} index={index} handleDelAni={handleDelAni} /> : <Suspense key={`${item.uid}-${item.gid}`}></Suspense>;
        })}
      </div>
      <Mask
        visible={showGift}
        destroyOnClose
        onMaskClick={() => {
          setShowGift(false);
          typeIndexSet('0')
          setActive({ index: 0 })
        }}>
        <div className={`${style.giftList} ${style.giftList_fixed}`} style={{ background: "rgba(51,51,51,.9)" }}>
          <div className={style.giftBody}>
            {/* 首冲有礼 */}
            {showRechargeGift.showRechargeGift == 1 && <InitialCharge open={opens} close={() => opensSet(false)} />}
            <div className={style.level}>
              <div className={style.userLevel}>{experienceInfo.curLevel && <img src={require(`../../../assets/image/live/level_${experienceInfo.curLevel}.png`)} alt="" />}</div>
              <img className={style.iconLevel} src={require("../../../assets/image/live/icon-level.png")} alt="" />
              <div className={style.center}>
                <ProgressBar
                  className={style.line}
                  percent={experienceInfo.downExp}
                  style={{
                    "--track-width": "3px",
                    "--track-color": "#C7C7C8",
                    "--fill-color": "#FF839B",
                  }}
                />
                <span className={style.desc}>{experienceInfo.copyWriting}</span>
              </div>
              <img onClick={() => history("/level")} className={style.iconVip} src={require("../../../assets/image/live/icon-vip.png")} alt="" />
            </div>
            {/* 礼物分类 */}
            <Tabs
              activeKey={typeIndex.toString()}
              className="giftTypeList"
              onChange={(e) => {
                typeIndexSet(e);
                // immediately(); //立即执行请求
                // deliverApisSetResetting();

                // setActive({ index: -1 });
                setActive({ index: 0 });

                SwiperRef.current.swipeTo(e); //切换到指定索引
              }}>
              {giftData.map((item, index) => {
                return <Tabs.Tab title={i18n.language === "vie" ? item.ynLan : item.chLan} key={index}></Tabs.Tab>;
              })}
            </Tabs>
            <Swiper
              indicator={() => null}
              onIndexChange={(e) => {
                // setActive({ index: -1 });
                setActive({ index: 0 });
                // immediately(); //立即执行请求

                // deliverApisSetResetting();

                typeIndexSet(e);
              }}
              ref={SwiperRef}>
              {giftData.map((val, key) => {
                // key={`group${key}`}
                return (
                  <Swiper.Item key={key} className={style.SwiperItem}>
                    <div className={style.giftGroup}>
                      {giftGroup2.map((item, index) => {
                        // ${active.index === index ? style.active : ''}
                        return (
                          <div
                            key={item.gid}
                            className={`${style.giftBox} `}
                            onClick={() => {
                              setActive({ index });
                              // active.index == -1 ||
                              //   (active.index != index &&
                              //     (immediately(), //立即执行请求
                              //       console.log("Swiper.Item"),
                              //       deliverApisSetResetting()));
                            }}>
                            {active.index == index && deliverApis != 0 ? (
                              ""
                            ) : (
                              <Space direction="vertical" align="center" style={{ "--gap-vertical": "4px", pointerEvents: "none", position: "relative", zIndex: "2" }}>
                                <img src={item?.cover} alt="" className={style.giftCover} />
                                <div className={style.name}>{item.gname}</div>
                                <span>{giftData[typeIndex].chLan == "背包" ? `${item?.num}${t("ge")}` : item.goldCoin}</span>
                              </Space>
                            )}
                            {active.index == index && deliverApis == 0 && (
                              <div
                                className={style.giveAsAPresent}
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   if (Number(assergoldData?.goldCoin) > Number(giftGroup2[active.index]?.goldCoin)) {
                              //     onTouchStartsSet(true);
                              //     setTimeout(() => {
                              //       onTouchStartsSet(false);
                              //     }, 50);
                              //     active.index != -1 && active.index == index ? deliverApisSetAdd() : deliverApisSetResetting();
                              //     // clearTimeout(times3);

                              //     // handleSendGift(); //点击送礼
                              //   } else {
                              //     // Toast.show({
                              //     //   content: t("sysmsg_amount_not_enough"),
                              //     // });
                              //     setVisible2(true);
                              //   }
                              // }}
                              >
                                {/* <div>{t("vipTxt2")}</div> */}
                              </div>
                            )}
                            {/* 连击 */}
                            {/* {active.index == index && deliverApis != 0 && (
                              <div
                                className={`${style.continuation} ${!onTouchStarts ? style.continuation2 : style.continuation3}`}
                                onClick={() => {
                                  // 背包礼物判断
                                  if (giftGroup2[active.index].num != undefined) {
                                    console.log(11, '===-----------222222', deliverApisRef.current);
                                    if (giftGroup2[active.index].num > deliverApisRef.current) {
                                      onTouchStartsSet(true);
                                      setTimeout(() => {
                                        onTouchStartsSet(false);
                                      }, 50);
                                      active.index != -1 && active.index == index ? deliverApisSetAdd() : deliverApisSetResetting();
                                    } else {
                                      Toast.show({
                                        content: t('liwushuliangbuzu'),
                                      });
                                    }
                                    return
                                  }

                                  // 金额送礼
                                  if (Number(assergoldData?.goldCoin) > Number(giftGroup2[active.index]?.goldCoin)) {
                                    // onTouchStartsSet(true)
                                    onTouchStartsSet(true);
                                    setTimeout(() => {
                                      onTouchStartsSet(false);
                                    }, 50);

                                    active.index != -1 && active.index == index ? deliverApisSetAdd() : deliverApisSetResetting();
                                    // clearTimeout(times3);
                                    // handleSendGift(); //点击送礼
                                  } else {
                                    // Toast.show({
                                    //   content: t("sysmsg_amount_not_enough"),
                                    // });
                                    setVisible2(true);
                                  }
                                }}>
                                <div className={`${style.hand} ${!onTouchStarts ? style.hand_x : ""}`}>
                                  <img src={require("../../../assets/image/newImg/zblw/ljz.png")} alt="" />
                                </div>
                                <div className={style.continuation_content}>
                                  {t("lianji")}x{deliverApis}
                                </div>
                              </div>
                            )} */}
                          </div>
                        );
                      })}
                      {val?.chLan == "背包" && giftGroup2[0] == undefined && (
                        <div className={style.CEmptys}>
                          <p>{t("nindebeibaoshikongde")}</p>
                        </div>
                      )}
                    </div>
                  </Swiper.Item>
                );
              })}
            </Swiper>

            {/* <Space className={style.giftBottom} justify="between" align="center">



            </Space> */}

            <div className={style.giftBottom}>
              <span className={`${style.gold}`}>
                <img src={require("../../../assets/image/center/icon-gold.png")} className={style.goldImg} />
                {assergoldData?.goldCoin || 0}
                <img className={style.dep} onClick={() => history("/recharge")} src={require("../../../assets/image/live/gift_gold_dep.png")} />
              </span>

              {active.index != -1 && (
                <DeliverNum
                  deliver={(e) => {
                    console.log("e----回调个数", e);
                    deliverApisRef2.current = e;
                    handleSendGift();
                  }}
                />
              )}
            </div>
          </div>
          {/* 提示 */}
          <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history("/recharge")} type={2} />
        </div>
      </Mask>

      {/* 礼物mp4 */}
      <VAP data={videoInfo3Ref.current} type="3" callbacks={callbacks} />
    </>
  );
}
