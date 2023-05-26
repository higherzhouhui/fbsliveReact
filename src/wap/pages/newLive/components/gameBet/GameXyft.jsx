import { Popup } from "antd-mobile";
import React, { useState } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { game7Data } from "./gameData";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const GameYncp30s = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  const {
    state: {
      live: { liveIssue, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  let [checkGame7, setCheckGame7] = useState({ list: [] });
  //幸运飞艇选中序号
  let [game7Index, game7IndexSet] = useState([]);
  const nav = [
    { name: t("rule"), icon: "gz", url: "" },
    { name: t("kaijiang"), icon: "kj", url: "" },
    { name: t("ui_dep"), icon: "cz", url: "" },
    // { name: '路单', icon: 'ld', url: '' },
  ];

  //飞艇游戏选中或取消选择事件
  const handleSelectGame7 = (index, key) => {
    let select = `${index}${key}`;
    if (game7Index.includes(select)) {
      let i = game7Index.findIndex((it) => it === select);
      game7Index.splice(i, 1);
    } else {
      game7Index.push(select);
    }
    game7IndexSet([...game7Index]);
    let list = [...checkGame7.list];
    let data = game7Data[index].list[key];
    if (list.includes(data)) {
      let index = list.findIndex((item) => JSON.stringify(item) === JSON.stringify(data));
      list.splice(index, 1);
    } else {
      list.push(data);
    }
    list.sort((a, b) => Number(`${a.type_index}${a.type_show}`) - Number(`${b.type_index}${b.type_show}`));
    setCheckGame7({ list });
  };

  const delFeitingGame = (val) => {
    if (val.length === 0) {
      game7IndexSet([]);
    } else handleSelectGame7(val.type_index, val.type_show);
  };

  return (
    <>
      <Popup
        destroyOnClose
        visible={liveIssue.open && liveIssue.name === "xyft"}
        onMaskClick={() => {
          dispatch({ type: "live/SetIssueClose" });
        }}
        bodyClassName={style.liveRoomPopup}
        className={`${style.betGame} ${"betGameZindex"}`}>
        <BetHead
          selfRight={
            <div className={style.headRight}>
              <div className={style.right}>
                {nav.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className={style.demo}
                      onClick={() => {
                        value.icon == "gz" && window.eventBus.emit("ruleEmit");
                        value.icon == "kj" && window.eventBus.emit("showH5BetResult", liveIssue);
                        value.icon == "cz" && history("/recharge");
                      }}>
                      <img src={require(`../../../../assets/image/live/lottery/${value.icon}icon.png`)} alt="" />
                      <div>{value.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          }>
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
        <div className={style.feiting}>
          {game7Data.map((item, index) => {
            return (
              <div className={style.wrap} key={`wrap${index}`}>
                <div className={`${style.title} ${index != 0 ? style.margin_top : ""}`}>{item?.title}</div>
                <div className={style.list} data-layout={item.list.length}>
                  {item.list.map((val, key) => {
                    return (
                      <div className={`${style.box} ${game7Index.includes(index.toString() + key.toString()) ? style.active : ""}`} key={`box${key}`} onClick={() => handleSelectGame7(index, key)}>
                        <div className={style.span}>{val.show_name}</div>
                        <p>1.92</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <BetFooter btiData={checkGame7.list} setCheckData={(list) => setCheckGame7({ list })} delFeitingGame={delFeitingGame} />
      </Popup>
    </>
  );
};

export default GameYncp30s;
