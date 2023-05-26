import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./common.module.scss";
import { useTranslation } from "react-i18next";
import { Input, Mask, Avatar, Toast, Popup, Stepper, Button, ProgressBar } from "antd-mobile";
// import { LiveChat, startTurntable, inPlayTurntable ,getSchedulePercentageByOrderNo} from "../../../server/live";
import { startTurntable, inPlayTurntable, getGiftCrowdfundingRecordByUid, getSchedulePercentageByOrderNo, SendGift } from "../../../server/live";

import { blocks, buttons, prizes } from "../components/LuckyWheel";
import { useNavigate } from "react-router-dom";
import useContextReducer from "../../../state/useContextReducer";
import SVGA from "svgaplayerweb";

const CrowdFunding = (props) => {
  const { giftTypes } = props;
  const {
    state: {
      user,
      assergoldData,
      live: { liveDetail, roomLiveData },
    },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { freshUser, userGetUserAsserGold } = fetchUtils;
  const history = useNavigate();
  const [msgContent, setMsgContent] = useState("");
  const [msgHistory, setMsgHistory] = useState([]);

  const [giftsToWX, giftsToWXSet] = useState();

  // 情侣头像
  const [visibleGift5, visibleGift5Set] = useState(false);
  // 获取当前情侣头像信息
  const [logData, logDataSet] = useState({});

  // 抽奖转盘
  const [prizesD, prizesDSet] = useState(prizes);
  const [prizeNameobj, prizeNameobjSet] = useState({});
  const [visibleGift2, visibleGift2Set] = useState(false);
  const myLucky = useRef(null);
  const [luckyBox, luckyBoxSet] = useState(false);

  // 展示框
  const [Exhibition, ExhibitionSet] = useState(false);

  const [visibleLuckBag, setVisibleLuckBag] = useState(true);

  const publicScreen2Ref = useRef(false);
  const publicScreenkjRef = useRef(false);

  const getLiveRoomRef = useRef(false);
  const { t } = useTranslation();
  const hisEl = useRef(null);
  const LuckyRef = useRef(null);

  const init = useCallback(() => {
    // props.chat.on("getMsg", (msg) => {
    //     msg.map((e) => {
    //         // console.log(e, "eeeeeeeeeeeeeH55555555getMsg")
    //         // console.log('这是神没数据啊实打实多', e, JSON.parse(e.payload.text));
    //         if (e.payload && e.payload.text) {
    //             getMsg(JSON.parse(e.payload.text));
    //         }
    //     });
    // });
  }, []);
  const [gift, setGift] = useState([]);

  const refInput = useRef(null);
  //获取到礼物列表
  useEffect(() => {
    // inPlayTurntables();


    // getGiftCrowdfundingRecordByUids(); //判断众筹
    window.eventBus.addListener("visibleGift5SetD", visibleGift5SetD); //关闭互动礼物

    return () => {
      window.eventBus.removeListener("visibleGift5SetD", visibleGift5SetD);
    };
  }, []);

  // 获取当前表演节目
  const inPlayTurntables = () => {
    inPlayTurntable({ anchorUid: liveDetail?.liveListAnchorInfoVO?.anchorId }).then((item) => {
      // console.log('获取正在表演节目', props.state.anchorId, item, prizeNameobj);
      // clearInterval(timeSI)
      prizeNameobjSet(item);
      timeRemainingSet(item === undefined ? null : item.timeRemaining * 1000);
      // localStorageCount(item.propsName, (item.timeRemaining*1000))
    });
  };

  // 进房ws信息判断众筹
  useEffect(() => {
    crowdFundingSet(roomLiveData.isCrowdfunding)
    if (roomLiveData.isCrowdfunding) {
      getGiftCrowdfundingRecordByUids()
    }
  }, [roomLiveData.isCrowdfunding])

  // 获取众筹当前状态
  const [status, statusSet] = useState("");
  // 比例
  const [schedulePercentageD, schedulePercentageDSet] = useState(null);
  // 进度
  // 获取当前是否开起众筹
  const getGiftCrowdfundingRecordByUids = (anchorId = liveDetail?.liveListAnchorInfoVO?.anchorId) => {
    getGiftCrowdfundingRecordByUid({ anchorId: anchorId }).then((item) => {
      trnDSet(item.crowdfundingOrderNo); //订单号
      schedulePercentageDSet(item.schedulePercentage); //比例
      statusSet(item.status); //众筹状态

      if (item.status !== -1) {
        ExhibitionSet(true);
      }
      // schedulePercentageDSetS(item.schedulePercentage) //进度
      if (item.showCrowd == true) {
        crowdFundingSet(true);
      } else if (item.showCrowd == false) {
        crowdFundingSet(false);
      }
    });
  };
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

  // 订单号
  const [trnD, trnDSet] = useState("");
  // 有无众筹
  const [crowdFunding, crowdFundingSet] = useState(false);
  // 送礼最多用户
  const [nicknames, nicknamesSet] = useState("");
  // 众筹成功失败
  const [successORFail, successORFailSet] = useState(3);
  // 提示信息
  const [contents, contentsSet] = useState("");

  useEffect(() => {
    // 转盘礼物
    if (giftTypes.giftType == 20) {
      // console.log('转盘大撒发顺丰', data);
      startTurntables(giftTypes.anchorId, giftTypes.turntableRecordId); //获取转盘礼物

      var player = new SVGA.Player("#demoCanvas");
      var parser = new SVGA.Parser("#demoCanvas"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
      // console.log(parser);
      parser.load(require("../../../assets/image/live/zp/bj.svga"), function (videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
        player.onFrame(function (i) { });
      });
    }
    // 众筹
    if (giftTypes.giftType == 10) {
      // console.log('订单号获取众筹', data, '订单号', data.trn, '状态', data.status, '提示信息', data.content);
      statusSet(giftTypes.status);
      if (giftTypes.status == -1) {
        successORFailSet(-1);
        contentsSet(giftTypes.content); //获取失败信息
        visibleGift3Set(false);
        frequencySet(1);
        ExhibitionSet(false); //关闭加减

        var player = new SVGA.Player("#demoCanvas2");
        var parser = new SVGA.Parser("#demoCanvas2"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // console.log(parser);
        parser.load(require("../../../assets/image/live/zc/sb.svga"), function (videoItem) {
          player.setVideoItem(videoItem);
          player.startAnimation();
          player.onFrame(function (i) { });
        });

        setTimeout(() => {
          successORFailSet(3);
          contentsSet(""); //获取失败信息
        }, 3000);
      }
      if (giftTypes.status == 2) {
        successORFailSet(2);
        contentsSet(`${giftTypes.content}  ${(<span style={{ color: "#57E5C1" }}>{giftTypes.nicknames}</span>)}`); //获取失败信息
        visibleGift3Set(false);
        frequencySet(1);
        ExhibitionSet(false); //关闭加减

        var player = new SVGA.Player("#demoCanvas3");
        var parser = new SVGA.Parser("#demoCanvas3"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // console.log(parser);
        parser.load(require("../../../assets/image/live/zc/cg.svga"), function (videoItem) {
          player.setVideoItem(videoItem);
          player.startAnimation();
          player.onFrame(function (i) { });
        });

        setTimeout(() => {
          successORFailSet(3);
          contentsSet(""); //获取成功
        }, 3000);
      }
      nicknamesSet(giftTypes.nickname);

      getGiftCrowdfundingRecordByUids(giftTypes.anchorId);
      trnDSet(giftTypes.trn); //获取订单号
      getSchedulePercentageByOrderNoS(giftTypes.trn); //根据订单号获取，众筹得进度
    }
  }, [giftTypes]);

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

  useEffect(() => {
    timeRemainingSet(Number(timeRemaining) - 1000);
    if (roomLiveData.isCrowdfunding) {
      showtime();
    }
  }, [timeStamp, roomLiveData.isCrowdfunding]);

  // 众筹进度
  const [speedOfProgress, speedOfProgressSet] = useState({});
  // 打开众筹弹窗
  const visibleGift3Data = () => {
    // console.log(111, trnD);
    visibleGift3Set(true);
    getSchedulePercentageByOrderNoS(trnD);
  };

  const getSchedulePercentageByOrderNoS = (trn) => {
    getSchedulePercentageByOrderNo({ trn: trn }).then((item) => {
      // console.log('获取众筹数据', item, trnD);
      loadingsSet(false);
      speedOfProgressSet(item);
      schedulePercentageDSet(item?.schedulePercentage);
    });
  };
  // 众筹
  const [visibleGift3, visibleGift3Set] = useState(false);
  // 次数
  const [frequency, frequencySet] = useState(1);
  // 赠送
  const [loadings, loadingsSet] = useState(false);
  const giveGift = async () => {
    let { anchorId } = liveDetail?.liveListAnchorInfoVO;
    let { liveId } = liveDetail;
    const res = await SendGift({
      anchorId,
      combo: 1,
      count: frequency,
      gid: speedOfProgress.configPropBaseList !== undefined && speedOfProgress.configPropBaseList !== null && speedOfProgress.configPropBaseList[0] !== undefined ? speedOfProgress.configPropBaseList[0].gid : "",
      liveId,
      trn: speedOfProgress?.crowdfundingOrderNo,
    });
    if (!(res instanceof Error)) {
      getSchedulePercentageByOrderNoS(trnD);
      userGetUserAsserGold();
    }
  };
  return (
    <div>
      {/* 众筹、抽奖展示 */}
      <div className={!props.display ? `${style.luckDraw_body_2} ${style.luckDraw_body}` : style.luckDraw_body}>
        {
          //  {/* 众筹展开加号 暂时关闭 */}
          crowdFunding && status !== -1 && status !== 0 && (
            <img
              src={require("../../../assets/image/luckDraw/jia.png")}
              style={{ display: `${!Exhibition ? "block" : "none"}` }}
              alt=""
              className={style.luckDraw_body_img}
              onClick={() => {
                ExhibitionSet(true), inPlayTurntables(), getGiftCrowdfundingRecordByUids();
              }}
            />
          )
        }
        {Exhibition && (
          <div className={style.luckDraw_body2}>
            <div>
              {/* 众筹关闭减号 暂时关闭 */}
              {crowdFunding && status !== -1 && status !== 0 && (
                <img
                  src={require("../../../assets/image/luckDraw/jian.png")}
                  alt=""
                  className={(crowdFunding && status !== -1 && status !== 0) || prizeNameobj?.propsName !== undefined ? style.luckDraw_body_img2 : style.luckDraw_body_img2_1}
                  onClick={() => {
                    ExhibitionSet(false);
                  }}
                />
              )}
              {(crowdFunding && status !== -1 && status !== 0) || prizeNameobj?.propsName !== undefined ? (
                <div>
                  <div className={style.luckDraw_body2_x}></div>
                  <div className={style.luckDraw_body2_font}>{crowdFunding && status !== -1 ? t("lwCrowdfundingGifts") : prizeNameobj?.propsName !== undefined ? t("AGiftOfDisc") : ""}</div>
                  <div className={style.luckDraw_body2_center} style={{ position: "relative", zIndex: "99" }}>
                    {crowdFunding && status !== -1 && (
                      <div className={style.luckDraw_body2_center_activity}>
                        <div className={style.luckDraw_body2_center_activity1} onClick={() => (status == 1 ? visibleGift3Data(trnD) : status == 0 || status == -1 || status == 2 ? console.log(1) : console.log(2))}>
                          {status !== -1 && <img src={status == 1 ? require("../../../assets/image/luckDraw/zcimg.png") : status == 0 || status == 2 ? require("../../../assets/image/luckDraw/zcimg2.png") : require("../../../assets/image/luckDraw/zcimg2.png")} alt="" />}
                        </div>
                        {status == 1 ? (
                          <div className={style.luckDraw_body2_center_activity2}>
                            {/* {t('CrowdfundingProgress')}:{schedulePercentageD * 100}% */}
                            <ProgressBar style={{ "--fill-color": "#ea5fd9", padding: "0px 0 0 0", marginTop: "6px", "--track-width": "3px", width: "70px" }} disabled percent={parseInt(schedulePercentageD * 100)} /> {parseInt(schedulePercentageD * 100)}%
                          </div>
                        ) : status == 0 || status == 2 ? (
                          <div className={style.luckDraw_body2_center_activity2_2}>{t("wkcrowdFunding")}</div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    )}
                    {prizeNameobj?.propsName !== undefined && (
                      <div className={style.luckDraw_body2_center_activity}>
                        <div className={style.luckDraw_body2_center_activity12}>
                          <img src={require("../../../assets/image/luckDraw/gift_down_box.png")} alt="" />
                          <div className={style.level}>{prizeNameobj?.propsName}</div>
                        </div>
                        <div className={style.luckDraw_body2_center_activity3}>
                          {/* {t('lwCountingDown')}： */}
                          {timesD}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 众筹成功、失败展示 */}
      {/* 失败动画 */}
      <div id="demoCanvas2" style={{ width: "70vw", height: "70vh", position: "fixed", top: "30%", left: "50%", transform: "translate(-50%, -50%)", display: `${successORFail == -1 ? "block" : "none"} ` }}>
        {" "}
      </div>
      {/* 成功动画 */}
      <div id="demoCanvas3" style={{ width: "70vw", height: "70vh", position: "fixed", top: "30%", left: "50%", transform: "translate(-50%, -50%)", display: `${successORFail == 2 ? "block" : "none"} ` }}>
        {" "}
      </div>
      {successORFail !== 2 && successORFail !== -1 ? (
        <div></div>
      ) : (
        <div className={style.successORFail}>
          {successORFail == 2 ? (
            // 成功
            <div>
              {/* background: `url(${require('../../../assets/image/live/zc/cgbj.png')})`, backgroundSize: '100% 100%', */}
              <div style={{ width: "243px", height: "243px", display: "flex", alignItems: "center", justifyContent: "center" }}>{/* <img src={require('../../../assets/image/live/zc/cg1.png')} alt="" style={{ width: '134px', height: '115px' }} /> */}</div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  minHeight: "37px",
                  background: "rgba(0,0,0,0.35)",
                  borderRadius: "18px",
                  // textAlign: 'center',
                  // lineHeight: '37px'
                  lineHeight: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {t("lwcontributionMax")} <span style={{ color: "#57E5C1" }}>{nicknames}</span>{" "}
              </div>
            </div>
          ) : successORFail == -1 ? (
            // 失败
            <div>
              {/*  background: `url(${require('../../../assets/image/live/zc/sbbj.png')})`, backgroundSize: '100% 100%', */}
              <div style={{ width: "243px", height: "243px", display: "flex", alignItems: "center", justifyContent: "center" }}>{/* <img src={require('../../../assets/image/live/zc/sb1.png')} alt="" style={{ width: '134px', height: '115px' }} /> */}</div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  minHeight: "37px",
                  background: "rgba(0,0,0,0.35)",
                  borderRadius: "18px",
                  // textAlign: 'center',
                  lineHeight: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {t("lwCrowdfundingFailure")}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}

      {/* 众筹弹窗 */}
      <Popup
        visible={visibleGift3}
        onMaskClick={() => {
          visibleGift3Set(false);
        }}
        onClose={() => {
          visibleGift3Set(false);
        }}
        showCloseButton
        bodyClassName={style.gift3}>
        <div className={style.content}>
          <div className={style.progress}>
            {t("CrowdfundingProgress")}：{parseInt(speedOfProgress?.schedulePercentage * 100)}%
          </div>
          {/* <Slider
                    style={{ '--fill-color': '#5E29E0', 'padding': '0px 0 0 0' }}
                    value={Number(speedOfProgress?.schedulePercentage * 100)}
                    disabled
                    icon={null}
                /> */}
          <ProgressBar style={{ "--fill-color": "#5E29E0", padding: "0px 0 0 0", marginTop: "6px", "--track-width": "4px" }} disabled percent={parseInt(speedOfProgress?.schedulePercentage * 100)} />
          <div className={style.reward}>{t("CrowdfundingAwards")}</div>
          <div className={style.reward_tips}>{speedOfProgress.crowdfundingContent}</div>
          <div className={style.count}>
            <div>{t("CrowdfundingFrequency")}</div>
            <div className={style.num}>
              <Stepper
                style={{ "--button-text-color": "#ff7690" }}
                // defaultValue={1}
                value={frequency}
                onChange={(value) => {
                  if (!value < 1) {
                    frequencySet(value);
                  }
                }}
              />
            </div>
          </div>
          <div className={style.gift_amount}>
            {t("SingleGift")}:{speedOfProgress.configPropBaseList !== undefined && speedOfProgress.configPropBaseList !== null && speedOfProgress.configPropBaseList[0] !== undefined ? speedOfProgress.configPropBaseList[0].goldCoin : ""}
          </div>
          <div className={style.recharge}>
            <div>
              {assergoldData?.goldCoin || 0}
              <span className={style.btnrecharge} onClick={() => history("/recharge")}>
                {t("ui_dep")}
              </span>
            </div>
            <Button className={style.btngive} onClick={() => giveGift()} loading="auto">
              {t("vipTxt2")}
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default CrowdFunding;
