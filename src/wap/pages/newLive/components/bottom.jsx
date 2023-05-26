import React, { useCallback, useEffect, useRef, useState } from "react";
import Chat from "../../../../utils/Chat";
import ChatEvent from "./chat";
import style from "./common.module.scss";
import History from "./history";
import SwitchRoom from "./SwitchRoom";
import Gift from "./gift";
import GameBet from "./gameBet";
import FbBet from "./fbBet";
import Setting from "./setting";
import FloatWindow from "./gameBet/floatWindow";
import { useTranslation } from "react-i18next";
import { GetCurFlagOpenGame, LotteryBetAllHis } from "../../../server/live";
import useContextReducer from "../../../state/useContextReducer";
import { Local } from "../../../../common";
import BottomGameList from "./BottomGameList";
import SideGame from "./Layout/SideGame";
import { WsEnterRoom, WsLeaveRoom } from "../../../util/websockets";
import { useLocation } from "react-router";
const AnchorCard = React.lazy(() => import("./AnchorCard/index"));
let times;
let setTime;
let setTime1 = {}; //定义定时器对象
let timeout;
export default function RoomBottom(props) {
  const { state } = useLocation();
  const {
    state: {
      user,
      live: { liveDetail, liveData, verticalScreen,
        commonDownTime: {
          oneMinuteLotteryGameInfo: { curDownTimeS },
        },
      },
      common: { Im },

    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const { liveListRoomBaseVO, liveListRoomLotterys } = liveDetail;
  const { t } = useTranslation();
  const float = useRef(null);
  const [chat, setChat] = useState(null);
  const [downTime, setDownTime] = useState(0);
  const [fbIsShow, setFbIsShow] = useState(false);
  const LotteryBetAllHisTRef = useRef(true);
  const gameRef = useRef(null);
  const init = useCallback((liveId, Im) => {
    Im.joinRoom(liveId);
    Im.on("getMsg", (msg) => {
      msg.map((e) => {
        if (e.payload && e.payload.text) {
          getMsg(JSON.parse(e.payload.text));
        }
      });
    });
    setChat(Im);
    clearTimeout(setTime);
    // curFlagOpenGame();
  }, []);

  useEffect(() => {
    if (liveDetail.liveId && Im.tim) {
      initWebSocket(liveDetail);
    }
  }, [liveDetail, Im]);

  //确认websocket
  const initWebSocket = useCallback((detail) => {
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
    // console.log(params);
    // 用户进房
    WsEnterRoom(params);
  }, []);

  useEffect(() => {
    return () => {
      if (!state) return;
      let { liveId } = state;
      // 用户退房
      let params = {
        data: { liveId },
        protocol: 2011,
      };
      WsLeaveRoom(params);
    };
  }, [initWebSocket]);

  useEffect(() => {
    if (liveListRoomBaseVO.liveId > 0 && Im.tim) {
      init(liveListRoomBaseVO.liveId, Im);
    }
    return () => {
      state.liveId && Im.leaveRoom && Im?.leaveRoom(state.liveId);

      // clearTimeout(setTime1);
      clearTimeoutTime1()
    };
  }, [init, liveListRoomBaseVO, Im]);

  useEffect(() => {
    // console.log('curDownTimeS----', curDownTimeS);
    if (curDownTimeS == 55) {
      LotteryBetAllHisD()
    }
  }, [curDownTimeS])

  const LotteryBetAllHisD = (e) => {
    console.log('liveDetail--------------', liveListRoomLotterys);
    // LotteryBetAllHisTRef.current = true;
    if (LotteryBetAllHisTRef.current && liveListRoomLotterys && liveListRoomLotterys[0] != undefined) {
      setTime1 = {}
      liveListRoomLotterys.forEach((value) => {
        if (value.lotteryName != undefined && value.lotteryName.length > 0) {
          // if (value.down_time < 2 || value.down_time > 55) {
          setTime1[value.lotteryName] = setTimeout(() => {
            console.log('执行-------');
            // if (LotteryBetAllHisTRef.current) {
            //获取历史记录
            LotteryBetAllHis({ lotteryName: value.lotteryName, page: 0 }).then((res) => {
              if (!(res instanceof Error)) {
                console.log("获取历史记录----------", res);
                if (res && res[0] != undefined) {
                  float.current?.addList({
                    expect: res[0]?.expect,
                    protocol: 29,
                    nickName: value.cpName,
                    name: value.lotteryName,
                    liveId: "",
                    resultList: res[0]?.lotteryResult || [],
                    time: Date.parse(new Date()) / 1000,
                  });
                }
              }
            });
            // }
          }, 5000);
          // }
        }
      });
    }
  };

  // 循环清除定时器
  const clearTimeoutTime1 = () => {
    for (var each in setTime1) {
      console.log('each--------------------------------', setTime1, each, setTime1[each]);
      clearTimeout(setTime1[each]);
    }
  }

  const handleDownTime = (time, lang) => {
    setDownTime(time);
    clearTimeout(setTime);
    setTime = setTimeout(() => {
      handleDownTime(time - 1 > 0 ? time - 1 : lang, lang);
    }, 1000);
  };

  // fb开关接口
  const curFlagOpenGame = async () => {
    const res = await GetCurFlagOpenGame({ type: 5 });
    setFbIsShow(res);
  };

  const getMsg = (data) => {
    //接收到礼物消息
    //  && data.expect === EXP
    if (data.protocol === 29) {
      data.time = Date.parse(new Date()) / 1000;
      console.log("接收到礼物消息data", data);
      float.current?.addList(data);


      LotteryBetAllHisTRef.current = false;
      setTimeout(() => {
        LotteryBetAllHisTRef.current = true;
      }, 20000)


      // clearTimeoutTime1()
      // clearTimeout(setTime1[data?.name]);

    }

    //直播间已关闭
    if (data.protocol === 2 && !data.isKick) {
      props.closeRoom();
    }

    //pk数据
    if (data.protocol === 24) {
      console.log("SetRoomPkStatus--------------------------------------------------data", data);
      dispatch({ type: "live/SetRoomPkStatus", payload: data });
      // GetPkStatus()
      // PostLiveData()
    }

    // 21 房间收费消息变动
    if (data.protocol == 21) {
      console.log("直播间房间消息变动", data);

      let listDataVos = liveData?.listDataVos || [];
      listDataVos.forEach((value) => {
        if (value.liveId == data.liveId) {
          console.log(1, value.liveListRoomBaseVO);
          value.liveListRoomBaseVO.type = data.type;
          value.liveListRoomBaseVO.roomPwd = data.roomPwd;
          value.liveListRoomBaseVO.roomPrice = data.roomPrice;
        }
      });

      let LiveData = {
        listDataVos: listDataVos,
        tagListVOS: liveData.tagListVOS,
      };


      // let LiveDetail = listDataVos.filter((value) => value.liveId == data.liveId);

      // // 当前选中数据更新
      // if (LiveDetail[0] != undefined) {
      //   dispatch({ type: "live/SetLiveDetail", payload: LiveDetail[0] });
      // }


      // 是否是当前直播间
      if (data.liveId == liveDetail?.liveId) {
        let LiveDetail = listDataVos.filter((value) => value.liveId == data.liveId);
        // 当前选中数据更新
        if (LiveDetail[0] != undefined) {
          dispatch({ type: "live/SetLiveDetail", payload: LiveDetail[0] });
          window.eventBus.emit("switchF", data); //传递状态数据判断
        }
      }



      // 更新直播间列表
      dispatch(() => {
        return {
          type: "live/SetLiveData",
          payload: LiveData,
        };
      });
      console.log("房间收费消息变动----im", data, LiveData, listDataVos, "新");
    }
    //protocol: 18,status: 2 结束pk,status:1,开始pk
    // protocol: 23 pk进入惩罚时间
    if (data.protocol === 18 && data.status === 1) {
      console.log("pk-------------------------------------开", data);
      dispatch({ type: "live/SwitchPk", payload: true });
    }
    if (data.protocol === 18 && data.status === 2) {
      console.log("pk结束-------------------------------------关", data);
      dispatch({ type: "live/SwitchPk", payload: false });
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
    // 有人加入、离开房间
    if (data.protocol === 5) {
      dispatch({ type: "live/changeRoomMen", payload: data });
    }
  };
  const [showMsg, setShowMsg] = useState(false);

  const [display, displaySet] = useState(false);

  useEffect(() => {
    displayDSet(props.displays);
  }, [props.displays]);
  const displayDSet = (e) => {
    // console.log(e);
    if (e != undefined && e > 0) {
      displaySet(true);
      timesDRef.current = e;
      timesF();
    } else {
      displaySet(false);
    }
  };
  const timesF = () => {
    console.log("多少数据", timesD);
    if (timesDRef.current > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timesDRef.current = timesDRef.current - 1;
        timesF();
      }, 1000);
    } else {
      displaySet(false);
      clearTimeout(timeout);
    }
  };

  // 判断切换房间
  useEffect(() => {
    window.eventBus.addListener("switchF", switchF);
    return () => {
      window.eventBus.removeListener("switchF", switchF);
    };
  }, []);
  const switchF = (e) => {
    if (e.type == 0) {
      //普通房
      displaySet(false);
      clearTimeout(timeout);
    }
  };

  const [timesD, timesDSet] = useState("");
  const timesDRef = useRef("");
  // 获取当前时间戳
  const [timeStamp, timeStampSet] = useState(new Date().getTime());
  useEffect(() => {
    times = setInterval(() => {
      timeStampSet(new Date().getTime());
    }, 1000);
  }, []);

  // useEffect(() => {
  //   timeRemainingSet(Number(timeRemaining) - 1000);
  //   showtime();
  // }, [timeStamp]);

  return (
    <>
      <FloatWindow ref={float} />
      <div className={showMsg ? style.showMsg : style.bottom}>
        {Local("baseInfo")?.isCpButton == 0 && !showMsg && <>{chat ? <GameBet chat={chat} ref={gameRef} downTime={downTime} freshTime={handleDownTime} /> : <div />}</>}
        {!showMsg && <BottomGameList />}
        {/* fbIsShow */}
        {!showMsg && <>{Local('baseInfo')?.fbGameSwitch && <FbBet />}</>}

        {/* im区、礼物 */}
        <div className={style.planRight}>
          {chat ? <ChatEvent display={display} showMsgInput={setShowMsg} showMsg={showMsg} chat={chat} downTime={downTime} /> : <div />}
          <div className={style.planRight_Gift}>{!showMsg && <>{chat ? <Gift chat={chat} /> : <div />}</>}</div>
        </div>
        {/* 侧边 */}
        <div className={`${style.right_position} ${!verticalScreen.verticalScreens ? style.right_position_h : ""}`}>
          <SwitchRoom Im={Im} />
          {/* 开奖到时间 */}
          <SideGame />
          {/* 开奖记录 */}
          <History />
          {/* 分享 */}
          {Local("baseInfo")?.promotionShareIsOpen != 0 && <Setting />}
        </div>
      </div>
      {/* 直播预览10秒 */}
      {display ? (
        <div style={{ background: `url(${require("../../../assets/image/live/zbyl.png")})`, backgroundSize: "100% 100%", minWidth: "100px", height: "26px" }} className={style.previews}>
          <img src={require("../../../assets/image/live/zbyllz.png")} alt="" style={{ width: "16px", height: "15px", marginRight: "2px" }} />
          <div>
            {t("PreviewCountdown")}:{" "}
            <span className={style.previews_span} style={{ margin: "0 4px" }}>
              {timesDRef.current}s
            </span>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* 直播间小卡片 */}
      <AnchorCard />
    </>
  );
}
