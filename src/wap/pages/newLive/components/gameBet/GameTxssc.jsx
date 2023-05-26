import { Popup } from "antd-mobile";
import React, { useState, useEffect } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { nav3, game3Data } from "./gameData";

const GameTxssc = () => {
  const {
    state: {
      live: { liveIssue, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [nav3Index, setNav3Index] = useState(0);
  let [checkGame3, setCheckGame3] = useState({ list: [] });

  const handleCheckGame3 = (item) => {
    let list = checkGame3.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    setCheckGame3({ list });
  };

  return (
    <Popup
      destroyOnClose
      visible={liveIssue.open && liveIssue.name === "txssc"}
      onMaskClick={() => {
        dispatch({ type: "live/SetIssueClose" });
      }}
      bodyClassName={style.liveRoomPopup}
      className={`${style.betGame} ${"betGameZindex"}`}>
      <BetHead>
        {RoomGameHistory.length > 0 && (
          <span>
            {RoomGameHistory[0].lotteryResult.map((item, index) => (
              <i key={`fast${index}`} className={style.redCard}>
                {item}
              </i>
            ))}
          </span>
        )}
      </BetHead>
      {/* 分类3 */}
      <div className={style.nav}>
        {nav3.map((item, index) => (
          <div className={`${style.box} ${nav3Index === index ? style.active : ""}`} key={item.name} onClick={() => setNav3Index(index)}>
            {item.name}
          </div>
        ))}
      </div>
      {/* 游戏3 */}
      <div className={style.lottery} data-layout={nav3Index != 1 ? 4 : 3}>
        {game3Data[nav3Index].map((nums, key) => (
          <div key={`game3${key}`} className={`${checkGame3.list.includes(nums) ? style.active : ""} ${style.box3}`} onClick={() => handleCheckGame3(nums)}>
            {checkGame3.list.includes(nums) && <img src={require("../../../../assets/image/live/lottery/xzright.png")} alt="" className={style.rights_imgs} />}
            {nav3Index === 0 ? <div className={style.wrf}>{nums.name[1]}</div> : <div className={style.wrf}>{nums.name[0]}</div>}
            {nums.value}
          </div>
        ))}
      </div>
      <BetFooter btiData={checkGame3.list} setCheckData={(list) => setCheckGame3({ list })} />
    </Popup>
  );
};

export default GameTxssc;
