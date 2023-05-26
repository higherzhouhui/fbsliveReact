import style from "./common.module.scss";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Button, Mask, Popup, Toast, Input } from "antd-mobile";
import { GetGiftLuckBagRecordByUid, GetUserJoinLuckBag, LiveChat } from "../../../server/live";
import { Local } from "../../../../common";
import { useTranslation } from "react-i18next";
import useContextReducer from "../../../state/useContextReducer";
let setTime = null;
// 福袋流程
// 1. app创建福袋活动
// 2. im监听推送type = 50
// 3. 福袋倒计时
// 4. 未参与状态，点击进去可以参与福袋，根据类型不同不同参与方式
// 5. 已参与状态，点击进去弹窗，显示福袋信息。展示 "已参与"，"倒计时" 信息
// 6. im监听福袋结束，推送中奖/未中奖福袋状态
// 7. 根据福袋状态可以查询其他中奖人员信息数据
const LuckyBag = (props, ref) => {
  const {
    state: {
      user,
      live: { liveDetail, roomLiveData },
    },
    fetchUtils: { liveFollow },
  } = useContextReducer.useContextReducer();
  const { liveListAnchorInfoVO } = liveDetail;
  const [showLuckBag, showLuckBagSet] = useState(false); //是否展示福袋
  const [visibleLuckyBag, setVisibleLuckyBag] = useState(false); //主页面弹窗显隐
  const [rules, setRules] = useState(false); //规格显隐
  const [visible, setVisible] = useState(false); //参与后等待开奖
  const [showRes, showResSet] = useState(false); //中奖结果
  const [resData, resDataSet] = useState({});
  const [recordVisible, setRecordVisible] = useState(false); //中奖记录显隐
  const [luckBag, setLuckBag] = useState({ giftLuckBagDetailVO: {} }); //福袋信息
  const [downTime, setDownTime] = useState("00:00"); //倒计时
  const [luckMan, luckManSet] = useState([]); //幸运观众列表
  const { t } = useTranslation();
  //获取父组件的im消息
  useImperativeHandle(ref, () => {
    return {
      imEvent: imEvent,
    };
  });
  const imEvent = (data) => {
    if (data.protocol === 50) {
      if (data.status == 1) {
        getLuckBagInfo();
      }
      if (data.status == 2) {
        showResSet(true);
        resDataSet(data);
      }
    }
  };
  const onJoin = async () => {
    switch (Number(luckBag.joinType)) {
      case 10:
        await LiveChat({ liveId: liveDetail.liveId, msg: luckBag.joinCase });
        break;
      case 20:
        liveFollow({ isFollow: false, uid: liveListAnchorInfoVO.anchorId, type: "anchor", fid: user.uid });
        break;
    }
    let { giftLuckBagConfigId, giftLuckBagDetailId } = luckBag.giftLuckBagDetailVO;
    let res = await GetUserJoinLuckBag({
      giftLuckBagConfigId,
      giftLuckBagDetailId,
    });
    if (!(res instanceof Error)) {
      Toast.show(t("fudai_chenggong"));
      getLuckBagInfo();
      setVisibleLuckyBag(false);
      clearTimeout(setTime);
    } else {
      Toast.show(t("fudai_shibai"));
    }
    // setVisible(true)
  };
  // 获取福袋信息
  const getLuckBagInfo = async () => {
    let res = await GetGiftLuckBagRecordByUid({
      anchorId: liveListAnchorInfoVO.anchorId,
      uid: Local("userInfo").uid,
    });
    if (!(res instanceof Error)) {
      if (res.curIsHasLuckBag) {
        setLuckBag(res);
        handleDownTime(res.giftLuckBagDetailVO.betweenTime); //倒计时 giftLuckBagDetailVO.betweenTime
        showLuckBagSet(true);
      } else {
        showLuckBagSet(false);
        clearTimeout(setTime);
      }
    }
  };

  const init = useCallback(() => {
    // getLuckBagInfo();
    setVisibleLuckyBag(false);
    clearTimeout(setTime);
    setVisible(false);
    return () => {
      clearTimeout(setTime);
    };
  }, []);

  // 处理游戏倒计时
  const handleDownTime = (time) => {
    setDownTime(formatSeconds(time));
    if (time < 1) {
      init();
    } else {
      setTime = setTimeout(() => {
        handleDownTime(time - 1 > 0 ? time - 1 : 0);
      }, 1000);
    }
  };
  // 补0
  const formatBit = (val) => {
    val = +val;
    return val > 9 ? val : "0" + val;
  };
  // 秒转时分秒，求模很重要，数字的下舍入
  const formatSeconds = (time) => {
    let min = Math.floor(time % 3600);
    return formatBit(Math.floor(min / 60)) + ":" + formatBit(time % 60);
  };
  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    showLuckBagSet(roomLiveData.isLuckBag);
    if (roomLiveData.isLuckBag) {
      getLuckBagInfo()
    }
  }, [roomLiveData, roomLiveData.isLuckBag])

  // 点击福袋
  const onLuckBag = () => {
    clearTimeout(setTime);
    getLuckBagInfo();
    if (luckBag.giftLuckBagDetailVO.flagJoin) {
      setVisible(true);
    } else {
      setVisibleLuckyBag(true);
    }
  };

  return (
    <>
      {/* 福袋 */}
      {
        showLuckBag &&
        (
          <div className={style.lucky_bag} onClick={() => onLuckBag()}>
            <div className={style.fd}></div>
            <div className={style.time}>{downTime}</div>
          </div>
        )}
      {/* 领取福袋主窗口 */}
      <Popup
        visible={visibleLuckyBag}
        onMaskClick={() => {
          setVisibleLuckyBag(false);
        }}
        position="bottom"
        bodyClassName={style.fdBody}>
        <div className={style.header}>
          <div className={style.header_t}>
            <img
              onClick={() => {
                setVisibleLuckyBag(false);
              }}
              src={require("../../../assets/image/live/lucky_bag/close-icon.png")}
              alt=""
            />
            <div
              onClick={() => {
                setRules(true);
              }}
              className={style.title}>
              {t("fu_dai")}
            </div>
            <img
              onClick={() => {
                setRules(true);
              }}
              src={require("../../../assets/image/live/lucky_bag/help-icon.png")}
              alt=""
            />
          </div>
          <div className={style.header_b}>
            {luckBag?.giftLuckBagDetailVO?.joinNum || 0}
            {t("fu_dai_num")}
          </div>
        </div>
        <div className={style.body}>
          <div className={style.body_box}>
            <div className={style.body_box_l}>
              <span>{downTime}</span>
              <span>{t("dao_ji_shi")}</span>
            </div>
            <div className={style.body_box_r}>
              {/* luckBag.totalAnchorGold */}
              <span>{t("zong_mei_li")}</span>
              <span>{t("fudai_syfd", { num: luckBag.peopleNum })}</span>
            </div>
          </div>
          <div className={style.condition}>{t("fudai_canyu")}</div>
          <div className={style.comment}>
            {luckBag.joinType == 10 && (
              <div className={style.comment_text}>
                <div className={style.comment_text_box}>
                  <span>{t("fudai_fasong")}:</span>
                  <Input type="text" value={luckBag.joinCase} readOnly className={style.msgInput} />
                </div>
              </div>
            )}
            {luckBag.joinType == 20 && <div>{t("fudai_fensi")}</div>}
            {luckBag.joinType == 30 && <div>{t("fudai_wutj")}</div>}
            {luckBag.joinType == 40 && (
              <div>
                {luckBag.joinCase}
                {t("glod")}
              </div>
            )}
            <span className={style.comment_status}>{luckBag.giftLuckBagDetailVO?.flagJoin ? t("fudai_dacheng") : t("fudai_weidacheng")}</span>
          </div>
          <div className={style.tips}>{t("fudai_wulikai")}</div>
          <Button className={style.btn_submit} block onClick={() => onJoin(-1)}>
            {t("fudai_yjcy")}
          </Button>
        </div>
      </Popup>

      {/* 规则说明 */}
      <Popup
        visible={rules}
        onMaskClick={() => {
          setRules(false);
        }}
        position="bottom"
        bodyClassName={style.fdBody}>
        <div className={style.header}>
          <div className={style.header_t}>
            <img
              className={style.title}
              onClick={() => {
                setRules(false);
              }}
              src={require("../../../assets/image/live/lucky_bag/close-icon.png")}
              alt=""
            />
            <div className={style.title}>{t("fudai_guize")}</div>
            <span></span>
          </div>
          <div className={style.header_b}></div>
        </div>
        <div className={style.rules} dangerouslySetInnerHTML={{ __html: luckBag.agreement }}></div>
      </Popup>

      {/* 中奖状态 待开奖*/}
      <Mask visible={visible}>
        <div className={style.overlayContent}>
          <div className={style.title}>{t("fudai_syjb", { num: luckBag.totalAnchorGold })}</div>
          <div className={style.tips}>
            {t("fudai_syfd", { num: luckBag.peopleNum })} | {t("fudai_sycy", { num: luckBag?.giftLuckBagDetailVO?.joinNum || 0 })}
          </div>
          <div className={style.statusImg}>
            <img src={require("../../../assets/image/live/lucky_bag/status02.png")} alt="" />
          </div>
          <div className={style.countDown}>
            {t("lwCountingDown")} {downTime}
          </div>
          <Button className={style.btn_submit} block disabled={true}>
            {t("fudai_yicanyu")}
          </Button>
          <div className={style.close} onClick={() => setVisible(false)}>
            <img src={require("../../../assets/image/live/lucky_bag/close-icon.png")} alt="" />
          </div>
        </div>
      </Mask>

      {/* 中奖状态 中奖*/}
      <Mask visible={showRes} onMaskClick={() => showResSet(false)}>
        {resData.detailStatus == 1 && (
          <div className={style.overlayContent}>
            <div className={style.title}>{t("fudai_gongxi")}</div>
            <div className={style.tips}>{t("fudai_huodejinbi", { num: resData.averageGold })}</div>
            <div className={style.statusImg}>
              <img src={require("../../../assets/image/live/lucky_bag/status02.png")} alt="" />
            </div>
            <Button className={style.btn_submit} block onClick={() => showResSet(false)}>
              {t("fudai_zengsongliwu")}
            </Button>
          </div>
        )}
        {resData.detailStatus == 2 && (
          <div className={style.overlayContent}>
            <div className={style.title}>{t("fudai_meiyouchouzhong")}</div>
            <div className={style.tips}>{t("fudai_songniyunqi")}</div>
            <div className={style.statusImg}>
              <img src={require("../../../assets/image/live/lucky_bag/status01.png")} alt="" />
            </div>
            <Button className={style.btn_submit} block onClick={() => showResSet(false)}>
              {t("wo_zhi_dao")}
            </Button>
          </div>
        )}
      </Mask>

      {/* 中奖记录 */}
      <Mask
        visible={recordVisible}
        onMaskClick={() => {
          setRecordVisible(false);
        }}>
        <div className={`${style.overlayContent} ${style.overlayBg}`}>
          <div className={style.title}>{t("fudai_xinyunmingdan")}</div>
          <div className={style.tips}>{t("fudai_syren", { num: luckMan.length })}</div>
          <div className={style.list}>
            {luckMan.map((e, i) => {
              return (
                <div key={i} className={style.item}>
                  <div className={style.avatar}>
                    <img src={e?.avatar || require("../../../assets/image/default_img.png")} alt="" />
                  </div>
                  <div className={style.name}>{e?.nickname}</div>
                  <div className={style.gold}>
                    {e?.awardGold}
                    {t("ynd")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Mask>
    </>
  );
};

export default forwardRef(LuckyBag);
