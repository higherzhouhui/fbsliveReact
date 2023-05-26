import React, { useCallback, useEffect } from "react";
import useStore from "./useContextReducer";
import { Local } from "../../common";
import { webSocket } from "../util/websockets";
import { close } from "../util/websockets";
import { EventCheckToken } from "../server/user";
import MobileDetect from "mobile-detect";
import Chat from "../../utils/Chat";
const EventStore = () => {
  const {
    state: {
      live,
      baseInfo,
      common: { Im },
    },
    dispatch,
    fetchUtils: { PostLiveData, getCommonData, EventOpenGame, EventSideGameDownTime, PostBaseInfo, PostGetLiveQuickComment, setSocket, loutOut, getGameTimeOut },
  } = useStore.useContextReducer();
  const onLoad = useCallback(() => {
    // window.Im=Im
    init();
  }, []);
  const init = () => {
    if (Local("token")) {
      getLiveData(); //获取直播数据
      webSocket({ type: "h5" });
      handleCheckToken();
    }
    storeEvent({ type: "setBaseInfo" });
    storeEvent({ type: "setGetLiveQuickComment" });
  };
  useEffect(() => {
    onLoad();
    window.eventBus.addListener("store", storeEvent);
    return () => {
      window.eventBus.removeListener("store", storeEvent);
    };
  }, [onLoad]);

  // 检查token
  const handleCheckToken = async () => {
    let md = new MobileDetect(window.navigator.userAgent);
    let mobile = `${md.mobile()}-${md.userAgent()}-${md.os()}`;
    const res = await EventCheckToken({ model: mobile });
    if (!(res instanceof Error)) {
      Local("token", res.token);
      dispatch({ type: "common/SetIm", payload: new Chat(res) });
    } else {
      localStorage.clear();
      location.reload();
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", visibilitychange);
    return () => {
      document.removeEventListener("visibilitychange", visibilitychange);
    };
  }, []);

  // console.log('Im-----------------', Im);
  const visibilitychange = () => {
    if (document.visibilityState == "visible") {
      console.log("进入");
      // handleCheckToken() //请求token查看是否挤出
      getGameTimeOut(); //刷新直播侧边栏游戏倒计时
    } else {
      console.log("离开");
      // Im.logout && Im.logout()
    }
  };

  const initVerSion = useCallback((info) => {
    getVerSionData(info); //获取版本文件数据
  }, []);
  useEffect(() => {
    if (Object.keys(baseInfo).length > 0) initVerSion(baseInfo);
  }, [baseInfo, initVerSion]);

  //根据版本文件获取数据
  const getVerSionData = (info = baseInfo) => {
    // console.log(info);
    fetch(`//${info.domain}/version/client/rsv2023_1.json?t=` + new Date().getTime())
      .then((response) => response.json())
      .then((json) => {
        getCommonData(json);
      });
  };

  // 获取直播数据
  const getLiveData = (payload) => {
    // 关闭直播删除对应直播间 不用list接口刷新
    if (payload && payload.protocol == 10010 && payload?.data && payload?.data?.length > 0) {
      let listDataVos = live.liveData.listDataVos || [];
      listDataVos.forEach((value, index) => {
        payload.data.split(",").forEach((value_2) => {
          if (value.liveId == value_2) {
            if (value.liveId == live.liveDetail.liveId) {
              window.eventBus.emit("setIsCloseF");
            }
            listDataVos.splice(index, 1);
          }
        });
      });
      let data = {
        listDataVos: listDataVos,
        tagListVOS: live.liveData.tagListVOS,
      };
      dispatch(() => {
        return {
          type: "live/SetLiveData",
          payload: data,
        };
      });
    } else {
      PostLiveData(Local("userInfo")?.uid || "");
      getGameTimeOut();
    }
  };

  // 房间状态变更
  const roomChangesF = (data) => {
    console.log("data---房间状态变更", data);
    let listDataVos = live.liveData?.listDataVos || [];
    listDataVos.forEach((value) => {
      if (value.liveId == data.liveId) {
        value.liveListRoomBaseVO.type = data.type;
        value.liveListRoomBaseVO.roomPwd = data.roomPwd;
        value.liveListRoomBaseVO.roomPrice = data.roomPrice;
      }
    });
    let LiveData = {
      listDataVos: listDataVos,
      tagListVOS: live.liveData.tagListVOS,
    };

    // 是否是当前直播间
    if (data.liveId == live.liveDetail?.liveId) {
      let LiveDetail = listDataVos.filter((value) => value.liveId == data.liveId);
      // 当前选中数据更新
      if (LiveDetail[0] != undefined) {
        dispatch({ type: "live/SetLiveDetail", payload: LiveDetail[0] });
        window.eventBus.emit("switchF", data); //传递状态数据判断
      }
    }

    console.log("LiveData--------", LiveData);
    // 更新直播间列表
    dispatch(() => {
      return {
        type: "live/SetLiveData",
        payload: LiveData,
      };
    });
  };

  // 获取用户私信列表
  const storeEvent = (context) => {
    const { type, payload } = context;
    switch (type) {
      // 检查是否登录,获取用户信息
      case "setBaseInfo":
        PostBaseInfo(payload);
        break;
      case "setGetLiveQuickComment":
        PostGetLiveQuickComment(payload);
        break;
      case "handleLogin":
        init();
        break;
      // 直播间倒计时结束后重新刷新
      case "EventDownTime":
        EventOpenGame({ name: live.liveIssue.name });
        break;
      case "EventSideGameDownTime":
        console.log("刷新-------------");
        EventSideGameDownTime(payload);
        break;
      case "getLiveData":
        getLiveData(payload);
        break;
      case "setRoomMen":
        dispatch({ type: "live/setRoomMen", payload });
        break;
      case "freshVersion":
        getVerSionData();
        break;
      case "socket":
        setSocket(true);
        break;
      case "freshGoldInfo":
        dispatch({ type: "UPDATE_ASSERGOLD", payload });
        break;
      case "freshUserInfo":
        dispatch({ type: "UPDATE_USERINFO", payload });
        break;
      case "previewStatus":
        dispatch({ type: "UPDATE_PREVIEWSTATUS", payload });
        break;
      case "showRechargeGift":
        dispatch({ type: "UPDATE_SHOWRECHARGEGIFT", payload });
        break;
      case "anchorCardReq":
        dispatch({ type: "UPDATE_ANCHORCARDREQ", payload });
        break;
      case "roomChanges":
        roomChangesF(payload);
        break;
      case "setLiveData":
        // roomLiveData
        dispatch({ type: "live/setRoomLiveData", payload });
        break;
      case "loginOut":
        close();
        loutOut();
        localStorage.clear();
        location.replace("/login");
        break;
      case "EventResetDownTime":
        getGameTimeOut();
        break;
      case "WsReconnect":
        PostLiveData(Local("userInfo")?.uid || "");
        getGameTimeOut();
        break;
    }
  };

  return <></>;
};

export default EventStore;
