import { Popup } from "antd-mobile";
import React, { useState } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { nav5, game5Data } from "./gameData";

const GamePk10 = () => {
  const {
    state: {
      live: { liveIssue, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [nav5Index, setNav5Index] = useState(0);
  let [checkGame5, setCheckGame5] = useState({ list: [] });

  const handleCheckGame5 = (item) => {
    let list = checkGame5.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    setCheckGame5({ list });
  };

  return (
    <Popup
      destroyOnClose
      visible={liveIssue.open && liveIssue.name === "pk10"}
      onMaskClick={() => {
        dispatch({ type: "live/SetIssueClose" });
      }}
      bodyClassName={style.liveRoomPopup}
      className={`${style.betGame} ${"betGameZindex"}`}>
      <BetHead>
        {RoomGameHistory.length > 0 && (
          <span>
            {RoomGameHistory[0].lotteryResult.map((item, index) => (
              <i key={`guanjun${index}`} className={style.redCard}>
                {item}
              </i>
            ))}
          </span>
        )}
      </BetHead>
      {/* 分类5 */}
      <div className={style.nav}>
        {nav5.map((item, index) => (
          <div className={`${style.box} ${nav5Index === index ? style.active : ""}`} key={item.name} onClick={() => setNav5Index(index)}>
            {item.name}
          </div>
        ))}
      </div>
      {/* 游戏5 */}
      <div className={`${style.lottery} ${nav5Index == 1 ? style.lottery_pk10 : ""}`} data-layout={nav5Index != 1 ? 4 : 3}>
        {game5Data[nav5Index].map((nums, key) => (
          <div key={`game5${key}`} className={`${checkGame5.list.includes(nums) ? style.active : ""} ${style.box3} ${style.box3_pk10}`} onClick={() => handleCheckGame5(nums)}>
            {checkGame5.list.includes(nums) && <img src={require("../../../../assets/image/live/lottery/xzright.png")} alt="" className={style.rights_imgs} />}
            <div className={style.wrf}>{nums.name[0]}</div>
            {nums.value}
          </div>
        ))}
      </div>
      <BetFooter btiData={checkGame5.list} setCheckData={(list) => setCheckGame5({ list })} />
    </Popup>
  );
};

export default GamePk10;
