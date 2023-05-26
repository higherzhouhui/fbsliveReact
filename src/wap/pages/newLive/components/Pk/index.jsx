import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import style from "./index.module.scss";
import winImg from "../../../../assets/image/live/pk-win.png";
import heImg from "../../../../assets/image/live/pk-he.png";
import loseImg from "../../../../assets/image/live/pk-lose.png";
import { ProgressBar } from "antd-mobile";
import { useTranslation } from "react-i18next";
import useContextReducer from "../../../../state/useContextReducer";

let startTime = false;
let times
const PkStatus = () => {
  const {
    dispatch,
    state: {
      live: { liveDetail, RoomPkStatus },
    },
    fetchUtils: { GetPkStatus },
  } = useContextReducer.useContextReducer();
  const { t } = useTranslation();
  const [pkTime, setPkTime] = useState(180);
  const pkTimeRef = useRef(180)
  const scord = useMemo(() => {
    return RoomPkStatus.scoreA - RoomPkStatus.scoreB;
  }, [RoomPkStatus]);

  const init = useCallback(() => {
    console.log('请求GetPkStatus');
    GetPkStatus(liveDetail.liveListRoomBaseVO.anchorId);
  }, []);

  useEffect(() => {
    console.log('RoomPkStatus.startTime', RoomPkStatus, RoomPkStatus.startTime);
    if (startTime) return;
    if (RoomPkStatus.startTime) {
      // startTime = true;
      setPkTimeStatus();
    }
  }, [RoomPkStatus]);

  useEffect(() => {
    init();
    return () => {
      clearTimeout(times)
    }

  }, [init]);
  useEffect(() => {

  }, [])
  //计算pk剩余时间
  const setPkTimeStatus = () => {
    try {
      console.log('setPkTimeStatus计算pk剩余时间', 300 - parseInt((new Date().getTime() - RoomPkStatus.startTime) / 1000), 'pkTimeRef.current', pkTimeRef.current, 'pkTime----------', pkTime);
      clearTimeout(times)
      // 300
      setPkTime(300 - parseInt((new Date().getTime() - RoomPkStatus.startTime) / 1000));
      pkTimeRef.current = 300 - parseInt((new Date().getTime() - RoomPkStatus.startTime) / 1000)
      // pkTime
      if (pkTimeRef.current > -180) {
        times = setTimeout(() => {
          setPkTimeStatus();
        }, 1000);
      } else {
        dispatch({ type: "live/SwitchPk", payload: false });
        //pk结束，更改当前pk状态
        clearTimeout(times)
      }
    } catch (error) {
      // console.log(error);
    }
  };

  //pk进度条
  const pkPer = useMemo(() => {
    let num = (RoomPkStatus.scoreA * 100) / (RoomPkStatus.scoreA + RoomPkStatus.scoreB);
    return isNaN(num) ? 50 : num;
  });

  return (
    <div className={style.pkStatus}>
      <div className={style.progress}>
        <ProgressBar
          percent={pkPer}
          style={{
            "--track-width": "20px",
            "--track-color": "#FF839B",
            "--fill-color": "#20c0b5",
          }}
        />
        <div className={style.self}>
          {t("wofang")} {RoomPkStatus.scoreA}
        </div>
        <div className={style.other}>
          {RoomPkStatus.scoreB} {t("duifang")}
        </div>
        {pkTime < 0 && (
          <div className={style.statusImg}>
            <div>
              <img src={scord > 0 ? winImg : scord < 0 ? loseImg : ""} alt="" />
            </div>
            <div className={scord == 0 ? style.chenfa : ''}>
              <img src={scord == 0 ? heImg : ""} alt="" />
              {/* <p> {t("chenfa")} {pkTime > -180 ? 180 + pkTime : 0}</p> */}
            </div>
            <div>
              <img src={scord < 0 ? winImg : scord > 0 ? loseImg : ""} alt="" />
            </div>
          </div>
        )}
      </div>
      <div className={style.pkGroup}>
        <div className={`${style.side} ${style.left}`}>
          {RoomPkStatus.listA.map((it) => {
            return <img key={it.uid} src={it?.avatar || require('../../../../assets/image/center/gyfbstitle.png')} className={style.headImg} />;
          })}
        </div>
        <img src={require("../../../../assets/image/live/pk.png")} className={style.pkicon} />
        <div className={style.side}>
          {RoomPkStatus.listB.map((it) => {
            return <img key={it.uid} src={it?.avatar || require('../../../../assets/image/center/gyfbstitle.png')} className={style.headImg} />;
          })}
        </div>
      </div>
      {pkTime > 0 ? (
        <div className={style.pkTime}>Pk {pkTime}</div>
      ) :
        //  scord == 0 ?
        (
          <div className={style.pkTime}>
            {t("chenfa")} {pkTime > -180 ? 180 + pkTime : 0}
          </div>
        )
        // : (
        //   <>

        //   </>
        // )
      }
    </div>
  );
};

export default PkStatus;
