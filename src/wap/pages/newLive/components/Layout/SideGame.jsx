import React from "react";
import style from "../common.module.scss";
import useContextReducer from "../../../../state/useContextReducer";
const SideGame = () => {
  const {
    state: {
      baseInfo,
      live: {
        liveDetail: { liveListRoomLotterys },
        verticalScreen,
        commonDownTime: {
          oneMinuteLotteryGameInfo: { curDownTimeS },
        },
      },
    },
    fetchUtils: { EventOpenGame, userGetUserAsserGold },
  } = useContextReducer.useContextReducer();

  const mTime = (time, name) => {
    if (name == "yncp30s") {
      if (time > 22) {
        // return t('fengpan')
        return <img src={require("../../../../assets/image/live/dsfp.png")} alt="" style={{ width: "14px", height: "14px", marginTop: "10px" }} />;
      } else {
        function zoreTime(n) {
          return n > 9 ? n : "0" + n;
        }
        return time > 0 ? `${zoreTime(time)}` : "";
      }
    } else if (name == "jsks5") {
      if (time > 285) {
        // return t('fengpan')
        return <img src={require("../../../../assets/image/live/dsfp.png")} alt="" style={{ width: "14px", height: "14px", marginTop: "10px" }} />;
      } else {
        function zoreTime(n) {
          return n > 9 ? n : "0" + n;
        }
        return time > 0 ? `${zoreTime(time)}` : "";
      }
    } else {
      if (time > 55) {
        // return t('fengpan')
        return <img src={require("../../../../assets/image/live/dsfp.png")} alt="" style={{ width: "14px", height: "14px", marginTop: "10px" }} />;
      } else {
        function zoreTime(n) {
          return n > 9 ? n : "0" + n;
        }
        return time > 0 ? `${zoreTime(time)}` : "";
      }
    }
  };

  return (
    Number(baseInfo.isCpButton) === 0 && (
      <div className={`${style.roomGame} ${!verticalScreen.verticalScreens ? style.roomGame_h : ""}`}>
        {liveListRoomLotterys.map((item, index) => {
          return (
            <div
              key={`${item.lotteryName}${index}`}
              className={style.lottery}
              onClick={() => {
                userGetUserAsserGold()
                EventOpenGame({ name: item.lotteryName, open: true });
              }}>
              <div className={style.lorretyIconBox}>
                <img src={item.lorretyIcon} alt="" />
              </div>
              <div className={style.downTime} style={{ background: `url(${require("../../../../assets/image/live/lzds.png")})`, backgroundSize: "100% 100%" }}>
                {mTime(curDownTimeS || 999999, item.lotteryName)}
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export default SideGame;
