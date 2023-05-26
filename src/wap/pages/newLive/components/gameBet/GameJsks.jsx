import { Popup } from "antd-mobile";
import React, { useState, useEffect } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { nav2, game2Data } from "./gameData";
import game2Icon1 from "../../../../assets/image/live/dot01.png";
import game2Icon2 from "../../../../assets/image/live/dot02.png";
import game2Icon3 from "../../../../assets/image/live/dot03.png";
import game2Icon4 from "../../../../assets/image/live/dot04.png";
import game2Icon5 from "../../../../assets/image/live/dot05.png";
import game2Icon6 from "../../../../assets/image/live/dot06.png";
import { Local } from "../../../../../common";

const GameJsks = () => {
  const {
    state: {
      live: { liveIssue, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [nav2Index, setNav2Index] = useState(0);
  let [checkGame2, setCheckGame2] = useState({ list: [] });
  const handleCheckGame2 = (item) => {
    let list = checkGame2.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    setCheckGame2({ list });
  };

  // yuxx图标库
  const game2IconList = [{ icon: game2Icon1 }, { icon: game2Icon2 }, { icon: game2Icon3 }, { icon: game2Icon4 }, { icon: game2Icon5 }, { icon: game2Icon6 }];
  const getGame2Icon = (index) => {
    return game2IconList[index - 1]?.icon;
  };

  return (
    <Popup
      destroyOnClose
      visible={liveIssue.open && liveIssue.name === "jsks"}
      onMaskClick={() => {
        dispatch({ type: "live/SetIssueClose" });
      }}
      bodyClassName={style.liveRoomPopup}
      className={`${style.betGame} ${"betGameZindex"}`}>
      <BetHead>
        {RoomGameHistory.length > 0 && (
          <span>
            {RoomGameHistory[0].lotteryResult.map((item, index) => (
              <img src={getGame2Icon(item)} key={`topHis${index}`} />
            ))}
          </span>
        )}
      </BetHead>
      {/* 分类2 */}
      <div className={style.nav}>
        {nav2.map((item, index) => (
          <div className={`${style.box} ${nav2Index === index ? style.active : ""}`} key={item.name} onClick={() => setNav2Index(index)}>
            {item.name}
          </div>
        ))}
      </div>
      {/* 游戏2 */}
      <div className={`${style.lottery} ${nav2Index === 0 ? style.small3 : ""}  ${nav2Index === 2 ? style.small : ""} ${nav2Index === 3 ? style.small2 : ""}`} data-layout={nav2Index === 0 ? 3 : 3}>
        {game2Data[nav2Index].map((nums, key) => (
          <div key={`game2${key}`} className={`${checkGame2.list.includes(nums) ? style.active : ""}   ${style.box} ${nav2Index === 0 ? style.box1 : ""} `} onClick={() => handleCheckGame2(nums)}>
            {checkGame2.list.includes(nums) && <img src={require("../../../../assets/image/live/lottery/xzright.png")} alt="" className={style.rights_imgs} />}
            {nav2Index == 0 && <div className={style.wrf}>{nums.name.join(",")}</div>}
            {nav2Index !== 0 && (
              <div className={style.img}>
                {nums.name.map((num, ins) => (
                  <img src={getGame2Icon(num)} key={`game1${ins}`} />
                ))}
              </div>
            )}
            {nums.value}
          </div>
        ))}
      </div>
      <BetFooter btiData={checkGame2.list} setCheckData={(list) => { setCheckGame2({ list }) }} />
    </Popup>
  );
};

export default GameJsks;
