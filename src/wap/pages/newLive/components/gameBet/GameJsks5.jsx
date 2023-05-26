import { Popup } from "antd-mobile";
import React, { useState } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { nav9, game9Data } from "./gameData";
import game2Icon1 from "../../../../assets/image/live/dot01.png";
import game2Icon2 from "../../../../assets/image/live/dot02.png";
import game2Icon3 from "../../../../assets/image/live/dot03.png";
import game2Icon4 from "../../../../assets/image/live/dot04.png";
import game2Icon5 from "../../../../assets/image/live/dot05.png";
import game2Icon6 from "../../../../assets/image/live/dot06.png";

const GameJsks5 = () => {
  const {
    state: {
      live: { liveIssue, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [nav9Index, setNav9Index] = useState(0);
  let [checkGame9, setCheckGame9] = useState({ list: [] });

  const handleCheckGame9 = (item) => {
    let list = checkGame9.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    setCheckGame9({ list });
  };

  // yuxx图标库
  const game9IconList = [{ icon: game2Icon1 }, { icon: game2Icon2 }, { icon: game2Icon3 }, { icon: game2Icon4 }, { icon: game2Icon5 }, { icon: game2Icon6 }];
  const getGame9Icon = (index) => {
    return game9IconList[index - 1]?.icon;
  };

  return (
    <Popup
      destroyOnClose
      visible={liveIssue.open && liveIssue.name === "jsks5"}
      onMaskClick={() => {
        dispatch({ type: "live/SetIssueClose" });
      }}
      bodyClassName={style.liveRoomPopup}
      className={`${style.betGame} ${"betGameZindex"}`}>
      <BetHead>
        {RoomGameHistory.length > 0 && (
          <span>
            {RoomGameHistory[0].lotteryResult.map((item, index) => (
              <img src={getGame9Icon(item)} key={`topHis${index}`} />
            ))}
          </span>
        )}
      </BetHead>
      {/* 分类2 */}
      <div className={style.nav}>
        {nav9.map((item, index) => (
          <div className={`${style.box} ${nav9Index === index ? style.active : ""}`} key={item.name} onClick={() => setNav9Index(index)}>
            {item.name}
          </div>
        ))}
      </div>
      {/* 游戏 5分快三 */}
      <div className={`${style.lottery} ${nav9Index === 0 ? style.small3 : ""}  ${nav9Index === 2 ? style.small : ""} ${nav9Index === 3 ? style.small2 : ""}`} data-layout={nav9Index === 0 ? 3 : 3}>
        {game9Data[nav9Index].map((nums, key) => (
          <div key={`game2${key}`} className={`${checkGame9.list.includes(nums) ? style.active : ""}   ${style.box} ${nav9Index === 0 ? style.box1 : ""} `} onClick={() => handleCheckGame9(nums)}>
            {checkGame9.list.includes(nums) && <img src={require("../../../../assets/image/live/lottery/xzright.png")} alt="" className={style.rights_imgs} />}
            {nav9Index == 0 && <div className={style.wrf}>{nums.name.join(",")}</div>}
            {nav9Index !== 0 && (
              <div className={style.img}>
                {nums.name.map((num, ins) => (
                  <img src={getGame9Icon(num)} key={`game1${ins}`} />
                ))}
              </div>
            )}
            {nums.value}
          </div>
        ))}
      </div>
      <BetFooter btiData={checkGame9.list} setCheckData={(list) => setCheckGame9({ list })} />
    </Popup>
  );
};

export default GameJsks5;
