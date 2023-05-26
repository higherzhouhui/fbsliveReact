import React, { useEffect, useState } from "react";
import style from "./index.module.scss";
import useContextReducer from "../../../../state/useContextReducer";
import ToPlay from "../../../../assets/image/live/toPlay.png";
import { useLocation } from "react-router-dom";
import { CheckLiveStatus } from "../../../../server/live";
//屏幕方向标识，0横屏，其他值竖屏
var orientation = 0;
var innerWidthTmp = window.innerWidth;
let time;
let canPlayTime;
const LivePlay = () => {
  const {
    state: {
      live: { liveDetail, verticalScreen },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const {
    state: { liveId },
  } = useLocation();

  const [canplay, canplaySet] = useState(false);

  useEffect(() => {
    //启动横竖屏事件监听
    screenOrientationListener();
    window.addEventListener("message", receiveMsg, false);
    return () => {
      clearTimeout(time);
      window.removeEventListener("message", receiveMsg, false);
    };
  }, []);

  useEffect(() => {
    clearTimeout(canPlayTime);
    if (!canplay) {
      handleTimePlay(1);
    }
  }, [canplay]);

  const handleTimePlay = (step) => {
    let time = 3000;
    if (step > 0) time = 3000;
    if (step > 1) time = 4000;
    if (step > 2) time = 23000;
    if (step > 3) time = 30000;
    canPlayTime = setTimeout(() => {
      try {
        CheckLiveStatus({ liveId }).then((res) => {
          if (res.liveStatus == 1) {
            // console.log("正常直播");
          } else {
            window.eventBus.emit("setIsCloseF");
            console.log("--------已关播---------");
          }
        });
      } catch (error) {
        handleTimePlay(step + 1);
      }
    }, time);
  };

  // 接收到iframe消息
  const receiveMsg = (e) => {
    if (e.data.type === "canplay") {
      // console.log('canplay', e.data);
      canplaySet(true);
    }
  };

  //转屏事件，内部功能可以自定义
  const screenOrientationEvent = () => {
    if (orientation == 0) {
      dispatch(() => {
        return {
          type: "live/SetVerticalScreen",
          payload: { verticalScreens: true, click: false },
        };
      });
    } else {
      dispatch(() => {
        return {
          type: "live/SetVerticalScreen",
          payload: { verticalScreens: false, click: false },
        };
      });
    }
  };
  //横竖屏事件监听方法
  const screenOrientationListener = () => {
    try {
      var iw = window.innerWidth;
      //屏幕方向改变处理
      if (iw != innerWidthTmp) {
        if (iw > window.innerHeight) orientation = 90;
        else orientation = 0;
        //调用转屏事件
        screenOrientationEvent();
        innerWidthTmp = iw;
      }
    } catch (e) {
      console.log("eeee--", e);
    }
    //间隔固定事件检查是否转屏，默认500毫秒
    time = setTimeout(() => {
      screenOrientationListener();
    }, 500);
  };
  // 设置官方视频直播间轮播
  // const url2 = state?.isAutoLive == 1 ? state.loopVideoUrl || null : null;
  const url2 = liveDetail?.liveListRoomBaseVO?.isAutoLive == 1 ? liveDetail?.liveListRoomBaseVO?.loopVideoUrl || null : null;
  return (
    <>
      {!url2 && liveDetail.liveListRoomBaseVO.hlsUrl && (
        // ${!verticalScreen.verticalScreens && verticalScreen.click ? style.liveVideo_h : ''}
        <iframe src={`/video.html?hlsUrl=${liveDetail.liveListRoomBaseVO.hlsUrl}&playIcon=${ToPlay}`} className={`${style.liveVideo} ${!verticalScreen.verticalScreens && verticalScreen.click ? style.liveVideo_h : ""} ${liveDetail.liveListRoomBaseVO.pking ? style.pkVideo : ""}`}></iframe>
      )}
      {/* 是否横屏 */}
      {/* {verticalScreen.verticalScreens && <div onClick={() => {
        dispatch(() => {
          return {
            type: "live/SetVerticalScreen",
            payload: { verticalScreens: false, click: true },
          };
        });
      }} className={style.hp_img}>
        <img src={require('../../../../assets/image/newImg/hp/hp.png')} alt="" />
        全屏播放
      </div>
      } */}

      {/* 视频轮播 */}
      {url2 && (
        <iframe
          id="dplayer2"
          className={`${style.liveVideo2}`}
          src={`/videoOfficial.html?mp4s=${url2}`}
          onLoad={(e) => {
            e.target.setAttribute("style", `top:${(innerHeight - e.target.clientHeight) / 2}px`);
          }}
        />
      )}
    </>
  );
};

export default LivePlay;
