import { Popup } from "antd-mobile";
import React, { useState } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { nav4, game4Data } from "./gameData";

const GameYflhc = () => {
  const {
    state: {
      live: { liveIssue, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [nav4Index, setNav4Index] = useState(0);
  let [checkGame4, setCheckGame4] = useState({ list: [] });

  const handleCheckGame4 = (item) => {
    let list = checkGame4.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    setCheckGame4({ list });
  };

  return (
    <Popup
      destroyOnClose
      visible={liveIssue.open && liveIssue.name === "yflhc"}
      onMaskClick={() => {
        dispatch({ type: "live/SetIssueClose" });
      }}
      bodyClassName={style.liveRoomPopup}
      className={`${style.betGame} ${"betGameZindex"}`}>
      <BetHead>
        {RoomGameHistory.length > 0 && (
          <span>
            {RoomGameHistory[0].lotteryResult
              .filter((v, i) => i < 6)
              .map((item, index) => (
                <i key={`tm${index}`} className={style.redCard}>
                  {item}
                </i>
              ))}
            <span style={{ color: "#fff" }}>+</span>
            {RoomGameHistory[0].lotteryResult[7] == 2 ? <i className={style.greenCard}>{RoomGameHistory[0].lotteryResult[6]}</i> : RoomGameHistory[0].lotteryResult[7] == 3 ? <i className={style.blueCard}>{RoomGameHistory[0].lotteryResult[6]}</i> : <i className={style.redCard2}>{RoomGameHistory[0].lotteryResult[6]}</i>}
          </span>
        )}
      </BetHead>
      {/* 分类4 */}
      <div className={style.nav}>
        {nav4.map((item, index) => (
          <div className={`${style.box} ${nav4Index === index ? style.active : ""}`} key={item.name} onClick={() => setNav4Index(index)}>
            {item.name}
          </div>
        ))}
      </div>
      {/* 游戏4 */}
      <div className={style.lottery} data-layout={nav4Index != 1 ? 4 : 3}>
        {game4Data[nav4Index].map((nums, key) => (
          <div key={`game4${key}`} className={`${checkGame4.list.includes(nums) ? style.active : ""} ${style.box}`} onClick={() => handleCheckGame4(nums)}>
            {checkGame4.list.includes(nums) && <img src={require("../../../../assets/image/live/lottery/xzright.png")} alt="" className={style.rights_imgs} />}
            <div className={style.wrf}>{nums.name[0]}</div>
            {nums.value}
          </div>
        ))}
      </div>
      <BetFooter btiData={checkGame4.list} setCheckData={(list) => setCheckGame4({ list })} />
    </Popup>
  );
};

export default GameYflhc;
