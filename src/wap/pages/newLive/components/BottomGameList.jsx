import React, { useCallback, useEffect } from "react";
import style from "./common.module.scss";
import useContextReducer from "../../../state/useContextReducer";

const BottomGameList = () => {
  const {
    state: {
      live: { RoomGameList },
    },
    fetchUtils: { EventOpenGame, GetLotteryGameList },
  } = useContextReducer.useContextReducer();

  const onLoad = useCallback(() => {
    if (RoomGameList.length === 0) GetLotteryGameList();
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <>
      {RoomGameList.filter((_a, index) => index < 3).map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              EventOpenGame(Object.assign(item, { open: true }));
            }}
            className={style.yxicon}>
            <img src={item.icon} alt="" />
          </div>
        );
      })}
    </>
  );
};

export default BottomGameList;
