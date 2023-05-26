import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./room.module.scss";
import RoomBottom from "./components/bottom";
import GuidApp from "./components/guidApp";
import useContextReducer from "../../state/useContextReducer";
import EnterPass from "./components/preview/EnterPass";
import RoomClosed from "./components/preview/RoomClosed";
import EnterPay from "./components/preview/EnterPay";
import PkStatus from "./components/Pk";
import Layout from "./components/Layout";
import LivePlay from "./components/Layout/LivePlay";
import { Local } from "../../../common";
import { GetLiveRecharge } from "../../server/live";
import { WsLiveData } from "../../util/websockets";
const PointOut = React.lazy(() => import("../../components/pointOut/index"));
let HasInitSocket; //是否已初始化socket
let times;
export default () => {
  const history = useNavigate();
  const { state } = useLocation();
  const {
    state: State,
    dispatch,
    fetchUtils: { userGetUserAsserGold, GetPkStatus },
  } = useContextReducer.useContextReducer();
  const {
    live: { liveDetail, liveData, socket, RoomPkStatus, verticalScreen, roomLiveData },
    user,
  } = State;
  const [needPass, needPassSet] = useState(false);
  const [enterPays, enterPaysSet] = useState(true); //付费房间
  // 是否需要密码
  // const needPass = useMemo(() => {
  //   if (!state) return false;
  //   let { password } = state;
  //   return liveDetail.liveListRoomBaseVO.type == 3 && !password;
  // }, [liveDetail, liveDetail.liveListRoomBaseVO.type]);
  const needPassF = () => {
    if (!state) needPassSet(false);
    let { password } = state;
    needPassSet(liveDetail.liveListRoomBaseVO.type == 3 && !password);
  };
  useEffect(() => {
    needPassF();
  }, [liveDetail, liveDetail.liveListRoomBaseVO.type]);

  // 是否有转盘活动
  const isWheelActive = useMemo(() => liveDetail.liveListActivityInfoVO.isActivityRoulette === 1, [liveDetail]);
  const [needPay, needPaySet] = useState(false);
  // 是否需要支付
  const [isClose, setIsClose] = useState(false);
  // 预览时间
  const [displays, displaysSet] = useState(0);
  const [visible2, setVisible2] = useState(false);
  const [pks, pksSet] = useState(false);
  useEffect(() => {
    let { liveId } = state;
    WsLiveData({ data: { liveId } }); //获取房间信息
    if (!state) return history("/live", { replace: true });
    return () => {
      dispatch({ type: "live/clearDownTime" });
    };
  }, []);

  //初始化房间
  const initRoom = useCallback(() => {
    let { liveId } = state;
    dispatch({ type: "live/EventHandleSetLiveDetail", payload: liveId });
  }, []);

  //确认websocket

  useEffect(() => {
    if (!state) return;
    if (!liveDetail.liveId && liveData.listDataVos.length > 0) initRoom();
  }, [initRoom, liveDetail, liveData, user.uid, socket]);

  // 房间内容
  const roomBody = () => {
    return (
      <>
        {/* {showLeaveRoom && <Leave />} */}
        {/* {!showLeaveRoom && } */}
        <LivePlay />
        {
          // pks ||
          liveDetail.liveListRoomBaseVO.pking && <PkStatus />
        }
        <Layout />
        <GuidApp />
        {isWheelActive && (
          <div
            className={style.wheelIcon}
            onClick={() => {
              history("/prize", { state: { anchorId: liveDetail.liveListAnchorInfoVO.anchorId } });
            }}>
            <img src={require("../../assets/image/prize/wheelIcon.png")} alt="" />
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    //  state.timeType1F != undefined
    if (Local("payed" + liveDetail.liveId) != undefined) {
      clearTimeout(times);
      timeType1F();
    }
    return () => {
      console.log("关闭---------------------");
      clearTimeout(times);
    };
  }, [state.timeType1F]);

  // type==1 计时收费
  const timeType1F = () => {
    times = setTimeout(() => {
      // console.log('Local("payed" + liveId)--------------------2', liveDetail.liveId, Local("payed" + liveDetail.liveId));
      if (Local("payed" + liveDetail.liveId) == undefined) {
        clearTimeout(times);
        GetLiveRechargeF();
      }
      timeType1F();
    }, 1000);
  };

  // 计时扣费
  const GetLiveRechargeF = async () => {
    // console.log(liveDetail.liveListRoomBaseVO?.roomPrice, Local('assergold')?.goldCoin, 'assergoldData?.goldCoin----------------');

    if (liveDetail.liveListRoomBaseVO?.roomPrice > Local("assergold")?.goldCoin) {
      clearTimeout(times);
      console.log("没钱");
      setVisible2(true);
      return;
    }
    const res = await GetLiveRecharge({ anchorId: liveDetail.liveListAnchorInfoVO.anchorId, liveId: liveDetail.liveId });
    if (!(res instanceof Error)) {
      if (res.code === 3001) {
        history("/live");
        Toast.show(res.msg);
      } else {
        console.log("调用计时扣费");
        clearTimeout(times);

        timeType1F();
        Local("payed" + liveDetail.liveId, true, 1 * 60);
        userGetUserAsserGold();
      }
    }
  };

  // 判断是否关闭直播间
  useEffect(() => {
    window.eventBus.addListener("setIsCloseF", setIsCloseF);
    return () => {
      window.eventBus.removeListener("setIsCloseF", setIsCloseF);
    };
  }, []);
  const setIsCloseF = () => {
    clearTimeout(times);
    needPassSet(false);
    enterPaysSet(false);

    setIsClose(true);
  };

  // 判断切换房间
  useEffect(() => {
    window.eventBus.addListener("switchF", switchF);
    return () => {
      window.eventBus.removeListener("switchF", switchF);
    };
  }, []);
  const switchF = (e) => {
    clearTimeout(times);
    // localStorage.removeItem("payed" + liveDetail.liveId)
    // localStorage.removeItem("preTimeOver" + liveDetail.liveId)

    if (e.type == 0) {
      //普通房
      displaysSet(0);

      setIsClose(false);
      needPaySet(false);
      needPassSet(false);
      enterPaysSet(false);
    }

    if (e.type == 1 || e.type == 2) {
      needPassSet(false);
    }
    if (e.type == 3) {
      setIsClose(false);
      enterPaysSet(false);
      needPaySet(false);
    }
  };

  return (
    <>
      {/* style={{ background: `url(${liveDetail?.liveListAnchorInfoVO?.avatar || require("../../assets/image/join/logo.png")}) no-repeat`, backgroundSize: "cover", backgroundPosition: "center" }} */}
      <div className={`${style.liveRoom} ${!verticalScreen.verticalScreens && verticalScreen.click ? style.liveRoom_h : ""}`} >
        <img className={style.liveRoom_imgBj} src={liveDetail?.liveListAnchorInfoVO?.avatar || require('../../assets/image/join/logo.png')} alt="" />

        {/* 查看是否有输入密码 */}
        {needPass && <EnterPass />}
        {isClose && <RoomClosed />}
        {Local("userInfo")?.manage != 1 && enterPays && <EnterPay displaysSet={(e) => displaysSet(e)} needPaySet={needPaySet} />}
        {!needPass && !needPay && !isClose && (
          <>
            {roomBody()}
            <RoomBottom
              displays={displays}
              closeRoom={() => {
                setIsClose(true);

                needPassSet(false);
                enterPaysSet(false);

                window.history.replaceState({}, "", "/live");
              }}
            />
          </>
        )}

        <PointOut visible={visible2} visibleSet={() => history("/live")} but2={() => history("/recharge")} type={2} />
      </div>
    </>
  );
};
