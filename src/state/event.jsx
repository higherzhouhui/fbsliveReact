import React, { useCallback, useEffect } from "react";
import useStore from "./useContextReducer";
import { Local } from "../common";
import { webSocket, close } from "../wap/util/websockets";
import { EventCheckToken } from "../api/userInfo";
import Chat from "../utils/Chat";
import MobileDetect from "mobile-detect";

const EventStore = () => {
  const {
    state: { live, baseInfo, liveTag },
    dispatch,
    fetchUtils: { PostLiveData, getCommonData, EventOpenGame, EventSideGameDownTime, PostBaseInfo, setSocket, loutOut },
  } = useStore.useContextReducer();
  const onLoad = useCallback(() => {
    init();
  }, []);
  const init = () => {
    if (Local("token2")) {
      // getLiveData(); //获取直播数据
      webSocket({ type: "pc" });
      handleCheckToken();
    }
    storeEvent({ type: "setBaseInfo" });
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
    if (res) {
      Local("token", res.token);
      dispatch({ type: "common/SetIm", payload: new Chat(res) });
    } else {
      localStorage.clear();
    }
  };

  const initVerSion = useCallback((info) => {
    getVerSionData(info); //获取版本文件数据
  }, []);
  useEffect(() => {
    if (Object.keys(baseInfo).length > 0) initVerSion(baseInfo);
  }, [baseInfo, initVerSion]);

  //根据版本文件获取数据
  const getVerSionData = (info) => {
    fetch(`//${info?.domain || baseInfo?.domain}/version/client/rsv2023_1.json?t=` + new Date().getTime())
      .then((response) => response.json())
      .then((json) => {
        getCommonData(json);
      });
  };

  // 获取直播数据
  const getLiveData = (payload) => {
    // 关闭直播删除对应直播间 不用list接口刷新
    if (payload && payload.protocol == 10010 && payload?.data && payload.data.length > 0) {
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
    }
    // else if (payload && payload.protocol == 10011 && payload.data.length > 0) {
    //   let listDataVos = live.liveData.listDataVos || []
    //   let tagListVOS = live.liveData.tagListVOS || []
    //   if (JSON.parse(payload.data)[0] != undefined) {
    //     JSON.parse(payload.data).forEach((value, index, array) => {

    //       if (!JSON.stringify(listDataVos).includes(`${JSON.parse(value).liveId}`)) {
    //         listDataVos = [...listDataVos, JSON.parse(value)]
    //       }
    //       // tag判断push
    //       tagListVOS.forEach((value_2, index_2) => {
    //         JSON.parse(value).liveListAnchorInfoVO.tag.split(',').forEach((value_3, index_3) => {
    //           if (value_2.tagId == value_3) {
    //             if (!value_2.liveIds.includes(JSON.parse(value).liveId)) {
    //               value_2.liveIds = [...value_2.liveIds, JSON.parse(value).liveId]
    //             }
    //           }
    //         })
    //         // if (value_2.tagId == JSON.parse(value).liveListAnchorInfoVO.tag) {
    //         //   if (!value_2.liveIds.includes(JSON.parse(value).liveId)) {
    //         //     value_2.liveIds = [...value_2.liveIds, JSON.parse(value).liveId]
    //         //   }
    //         // }
    //       })
    //     })
    //   }
    //   let data2s = {
    //     listDataVos: listDataVos,
    //     tagListVOS: tagListVOS
    //   }

    //   // console.log('data-------------------------222222222222', data2s);
    //   dispatch(() => {
    //     return {
    //       type: "live/SetLiveData",
    //       payload: data2s,
    //     };
    //   });
    // }
    else {
      PostLiveData(Local("userInfo2")?.uid || "");
    }
  };

  // 房间状态变更
  const roomChangesF = (data) => {
    console.log("payload--------------------------房间状态变更", data);
    let listDataVos = live.liveData?.listDataVos || [];
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
      tagListVOS: live.liveData.tagListVOS,
    };
    // let LiveDetail = listDataVos.filter((value) => value.liveId == data.liveId);

    // // 当前选中数据更新
    // if (LiveDetail[0] != undefined) {
    //   dispatch({ type: "live/SetLiveDetail", payload: LiveDetail[0] });
    // }

    // 是否是当前直播间
    if (data.liveId == live.liveDetail?.liveId) {
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

    // if (data.type == 0) {
    //   dispatch({
    //     type: "UPDATE_ANCHORCARDREQ",
    //     payload: {},
    //   });
    //   console.log("跳转1");
    //   history("/liveRoom", { state: { liveId: live.liveDetail?.liveId } });
    // }
  };

  // 获取用户私信列表
  const storeEvent = (context) => {
    const { type, payload } = context;
    switch (type) {
      // 检查是否登录,获取用户信息
      case "setBaseInfo":
        PostBaseInfo(payload);
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
      case "anchorCardReq":
        dispatch({ type: "UPDATE_ANCHORCARDREQ", payload });
        break;
      case "roomChanges":
        roomChangesF(payload);
        break;
      case "loginOut":
        close();
        loutOut();
        localStorage.clear();
        location.replace("/");
        break;
    }
  };

  return <></>;
};

export default EventStore;
