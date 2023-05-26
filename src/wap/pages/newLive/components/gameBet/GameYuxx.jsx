import { Popup } from "antd-mobile";
import React, { useState } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { nav1, game1Data } from "./gameData";
import game1Icon1 from "../../../../assets/image/live/fllu.png";
import game1Icon2 from "../../../../assets/image/live/flxie.png";
import game1Icon3 from "../../../../assets/image/live/frji.png";
import game1Icon4 from "../../../../assets/image/live/frfish.png";
import game1Icon5 from "../../../../assets/image/live/flpangxie.png";
import game1Icon6 from "../../../../assets/image/live/flxia.png";

const GameYuxx = () => {
  const {
    state: {
      live: { liveIssue, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [nav1Index, setNav1Index] = useState(0);
  let [checkGame1, setCheckGame1] = useState({ list: [] });

  const handleCheckGame1 = (item) => {
    let list = checkGame1.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    setCheckGame1({ list });
  };

  // yuxx图标库
  const game1IconList = [{ icon: game1Icon1 }, { icon: game1Icon2 }, { icon: game1Icon3 }, { icon: game1Icon4 }, { icon: game1Icon5 }, { icon: game1Icon6 }];
  const getGame1Icon = (index) => {
    return game1IconList[index - 1]?.icon;
  };

  return (
    <Popup
      destroyOnClose
      visible={liveIssue.open && liveIssue.name === "yuxx"}
      onMaskClick={() => {
        dispatch({ type: "live/SetIssueClose" });
      }}
      bodyClassName={style.liveRoomPopup}
      className={`${style.betGame} ${"betGameZindex"}`}>
      <BetHead>
        {RoomGameHistory.length > 0 && (
          <span>
            {RoomGameHistory[0].lotteryResult.map((item, index) => (
              <img src={getGame1Icon(item)} key={`topHis${index}`} />
            ))}
          </span>
        )}
      </BetHead>
      {/* 分类1 */}
      <div className={style.nav}>
        {nav1.map((item, index) => (
          <div className={`${style.box} ${nav1Index === index ? style.active : ""}`} key={item.name} onClick={() => setNav1Index(index)}>
            {item.name}
          </div>
        ))}
      </div>
      {/* 游戏1 */}
      <div className={`${style.lottery} ${nav1Index === 2 ? style.smallYuxx : ""} ${nav1Index === 3 ? style.small2 : ""}`}>
        {game1Data[nav1Index].map((nums, key) => (
          <div key={`game1${key}`} className={`${checkGame1.list.includes(nums) ? style.active : ""} ${style.box}`} onClick={() => handleCheckGame1(nums)}>
            {checkGame1.list.includes(nums) && <img src={require("../../../../assets/image/live/lottery/xzright.png")} alt="" className={style.rights_imgs} />}
            <div className={style.img}>
              {nums.name.map((num, ins) => (
                <img src={getGame1Icon(num)} key={`game1${ins}`} />
              ))}
            </div>
            {nums.value}
          </div>
        ))}
      </div>
      <BetFooter btiData={checkGame1.list} setCheckData={(list) => setCheckGame1({ list })} />
    </Popup>
  );
};

export default GameYuxx;
