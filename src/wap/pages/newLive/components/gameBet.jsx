import { Popup } from "antd-mobile";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import style from "./common.module.scss";
import RemindPopUp from "./gameBet/remindPopUp";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import useContextReducer from "../../../state/useContextReducer";
import i18n from "../../../lang/i18n";
import { Local } from "../../../../common";
import GameYuxx from "./gameBet/GameYuxx";
import GameJsks from "./gameBet/GameJsks";
import GameJsks5 from "./gameBet/GameJsks5";
import GameTxssc from "./gameBet/GameTxssc";
import GameYflhc from "./gameBet/GameYflhc";
import GamePk10 from "./gameBet/GamePk10";
import GameYncp30s from "./gameBet/GameYncp30s";
import GameXyft from "./gameBet/GameXyft";
import { BackAllGameCoin } from "../../../server/balance";
import { giftStatus } from "../../../server/live";

const PointOut = React.lazy(() => import("../../../components/pointOut/index"));
const InitialCharge = React.lazy(() => import('./InitialCharge/index'))

const GameBet = (_props, ref) => {
  const history = useNavigate();
  const {
    state,
    dispatch,
    fetchUtils: { EventOpenGame, userGetUserAsserGold },
  } = useContextReducer.useContextReducer();
  const [showBetType, setShowBetType] = useState(false);
  const [rules, rulesSet] = useState(false);
  const [opens, opensSet] = useState(false)
  const {
    showRechargeGift,
    user,
    baseInfo,
    assergoldData,
    live: { liveIssue, liveDetail, RoomGameList },
  } = state;
  const [visible2, setVisible2] = useState(false)
  useEffect(() => {
    window.addEventListener("message", jumpCharge);
    return () => {
      window.removeEventListener("message", jumpCharge);
    };
  }, []);



  useEffect(() => {
    if (showBetType) {
      giftStatusF() //判断首存活动状态
    }
  }, [showBetType])

  const giftStatusF = async () => {
    const res = await giftStatus({ uid: Local('userInfo')?.uid })
    if (!(res instanceof Error)) {
      window.eventBus.emit("store", { type: "showRechargeGift", payload: { showRechargeGift: res } });
    }
  }


  const jumpCharge = (e) => {
    if (e.data.type === "jumpCharge") history("/recharge");
    if (e.data.type === "openRule") {
      rulesSet(true);
    }
    if (e.data.type === "funcShowRecord") {
      window.eventBus.emit("showH5BetResult", liveIssue);
    }
    if (e.data.type === "leadRecharge") {
      console.log('没钱');


      if (showRechargeGift.showRechargeGift == 1) {
        opensSet(true)
      } else {
        setVisible2(true)
      }

    }
  };

  const showIssue = async (item) => {
    if (item.name === "allgame") return history("/game");
    else if (item.name === "ft") {
      item.open = true;
      dispatch({ type: "live/SetIssue", payload: item });
      setShowBetType(false)
    } else {
      EventOpenGame(Object.assign(item, { open: true }));
      // 判断是否金额小于等于1 进行回收
      if (assergoldData?.goldCoin <= 1) {
        await BackAllGameCoin();
        userGetUserAsserGold();
      } else {
        userGetUserAsserGold();
      }

      setShowBetType(false)
    }
  };

  // 规则
  useEffect(() => {
    window.eventBus.addListener("ruleEmit", ruleEmit);
    document.addEventListener("visibilitychange", visibilitychange);
    return () => {
      document.removeEventListener("visibilitychange", visibilitychange);
    };
  }, []);

  const ruleEmit = () => {
    rulesSet(true);
  };

  // 监听浏览器隐藏
  const visibilitychange = () => {
    if (document.visibilityState == "visible") {
    } else {
      setVisible2(false)
      dispatch({ type: "live/SetIssueClose" });
      opensSet(false)
    }
  };

  //获取彩票类型
  const typeBody = () => {
    return (
      <div className={style.betType} ref={ref}>
        {RoomGameList.map((item, index) => (
          <div
            className={style.box}
            key={index}
            data-name={item.name}
            onClick={() => {
              showIssue(item, index);
            }}>
            <img src={item.icon} alt="" />
            {item?.chinese}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <img
        src={require("../../../assets/image/live/xzb/sgd.png")}
        alt=""
        onClick={() => {
          setShowBetType(true);
        }}
      />
      <Popup
        visible={showBetType}
        onMaskClick={() => {
          setShowBetType(false);
        }}
        bodyClassName={style.liveRoomPopup1}>
        {typeBody()}
      </Popup>

      {/* 共用规则居中弹窗 */}
      <RemindPopUp
        tipsPopUp2={rules}
        tipsPopUpSet2={() => {
          rulesSet(false);
        }}
      />
      {/* typeList[betIndex]?.playMethod   规则*/}
      {/* yuxx */}
      {liveIssue.open && liveIssue.name === "yuxx" && <GameYuxx />}
      {/* jsks */}
      {liveIssue.open && liveIssue.name === "jsks" && <GameJsks />}
      {/* jsks5 */}
      {liveIssue.open && liveIssue.name === "jsks5" && <GameJsks5 />}
      {/* fast 5d */}
      {liveIssue.open && liveIssue.name === "txssc" && <GameTxssc />}
      {/* 特码 */}
      {liveIssue.open && liveIssue.name === "yflhc" && <GameYflhc />}
      {/* 猜冠军 */}
      {liveIssue.open && liveIssue.name === "pk10" && <GamePk10 />}
      {/* 越南30秒彩 */}
      {liveIssue.open && liveIssue.name === "yncp30s" && <GameYncp30s rulesSet={rulesSet} />}
      {/* 幸运飞艇游戏 */}
      {liveIssue.open && liveIssue.name === "xyft" && <GameXyft rulesSet={rulesSet} />}

      {/* 番摊游戏接入 */}
      <Popup visible={liveIssue.open && liveIssue.name === "ft"} onMaskClick={() => {
        setVisible2(false)
        dispatch({ type: "live/SetIssueClose" })
        opensSet(false)
      }}
        bodyClassName={style.PopupBjs}
      >
        <div style={{ width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.55)' }} onClick={() => {
          setVisible2(false)
          dispatch({ type: "live/SetIssueClose" })
          opensSet(false)
        }}>
          <div className={style.positionPopup} onClick={(e) => { e.stopPropagation() }}>
            {/*http://192.168.50.166:4000     ${baseInfo.ftUrl?.replace("https:", "")?.replace("http:", "")}*/}
            {liveIssue.open && liveIssue.name === "ft" && <iframe src={`${baseInfo.ftUrl?.replace("https:", "")?.replace("http:", "")}/ft?udid=${Local("finger")}&os=${5}&liveId=${liveDetail.liveId}&userId=${user.uid}&lang=${i18n.language === "zh" ? "CN" : "YN"}`} width="100%" height="420px"></iframe>}
          </div>

          {/* 首冲有礼 */}
          {
            showRechargeGift.showRechargeGift == 1 &&
            <InitialCharge hide={true} open={opens} close={() => opensSet(false)} />
          }
          {/* 提示 */}
          <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/recharge')} type={2} />
        </div>
      </Popup>

      {/* 赛车游戏接入 */}
      <Popup visible={liveIssue.open && liveIssue.name === "race1m"} bodyStyle={{ background: "none" }} onMaskClick={() => {
        setVisible2(false)
        dispatch({ type: "live/SetIssueClose" })
      }}>
        <div style={{ width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.55)' }} onClick={() => {
          setVisible2(false)
          dispatch({ type: "live/SetIssueClose" })
          opensSet(false)
        }}>
          <div className={style.positionPopup} onClick={(e) => { e.stopPropagation() }}>
            {/*http://192.168.50.166:4000     */}
            {liveIssue.open && liveIssue.name === "race1m" && <iframe src={`${baseInfo.ftUrl?.replace("https:", "")?.replace("http:", "")}/race1m?udid=${Local("finger")}&os=${5}&liveId=${liveDetail.liveId}&userId=${user.uid}&lang=${i18n.language === "zh" ? "CN" : "YN"}&token=${Local("token")}`} width="100%" height="420px"></iframe>}

          </div>
          {/* 首冲有礼 */}
          {
            showRechargeGift.showRechargeGift == 1 &&
            <InitialCharge hide={true} open={opens} close={() => opensSet(false)} />
          }
          {/* 提示 */}
          <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/recharge')} type={2} />
        </div>
      </Popup>

      {/* 骰子游戏接入 */}
      <Popup visible={liveIssue.open && liveIssue.name === "tz"} bodyStyle={{ background: "none" }} onMaskClick={() => {
        setVisible2(false)
        dispatch({ type: "live/SetIssueClose" })
      }}>
        <div style={{ width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.55)' }} onClick={() => {
          setVisible2(false)
          dispatch({ type: "live/SetIssueClose" })
          opensSet(false)
        }}>
          <div className={style.positionPopup} onClick={(e) => { e.stopPropagation() }}>
            {/*http://192.168.50.166:4000*/}
            {liveIssue.open && liveIssue.name === "tz" && <iframe src={`${baseInfo.ftUrl?.replace("https:", "")?.replace("http:", "")}/tz?udid=${Local("finger")}&os=${5}&liveId=${liveDetail.liveId}&userId=${user.uid}&lang=${i18n.language === "zh" ? "CN" : "YN"}&token=${Local("token")}`} width="100%" height="420px"></iframe>}
          </div>
          {/* 首冲有礼 */}
          {
            showRechargeGift.showRechargeGift == 1 &&
            <InitialCharge hide={true} open={opens} close={() => opensSet(false)} />
          }
          {/* 提示 */}
          <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/recharge')} type={2} />
        </div>
      </Popup>
    </>
  );
};

export default forwardRef(GameBet);
