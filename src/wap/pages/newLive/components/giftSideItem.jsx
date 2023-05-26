import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./common.module.scss";
import useContextReducer from "../../../state/useContextReducer";

export default function GiftSideItem(props) {
  const {
    state: {
      live: { giftList },
    },
  } = useContextReducer.useContextReducer();
  const { t } = useTranslation();
  const { item } = props;
  const giftCover = useMemo(() => {
    let [data] = giftList.filter((val) => val.gid === item.gid);
    return data?.cover;
  });
  const [isCombo, setIsCombo] = useState(false);

  //展示出礼物动画
  const isShow = useMemo(() => {
    return new Date().getTime() - props.item.timestamp < 8000 && new Date().getTime() - props.item.timestamp > 500;
  });

  const hideItem = () => {
    if (!isShow) props.handleDelAni(props.index);
    setTimeout(() => {
      hideItem();
    }, 10000);
  };

  useEffect(() => {
    if (!isShow && new Date().getTime() - props.item.timestamp > 5000) {
      setTimeout(() => {
        hideItem();
      }, 2000);
    }
  }, [isShow]);

  useEffect(() => {
    setIsCombo(true);
    setTimeout(() => {
      setIsCombo(false);
    }, 500);
  }, [item.combo]);

  return (
    <div className={style.giftSideBox} style={{ left: isShow ? "16px" : "-100vw" }} data-time={new Date().getTime() - props.item.timestamp}>
      <img src={item?.avatar} className={style.headImg} />
      <div className={style.name}>{item.nickname}</div>
      <div className={style.giftname}>
        {t("songchu")}
        {item.gname}
      </div>
      <img src={giftCover} className={style.giftImg} />
      <div className={style.combo}>
        <i className={style.fuhao}>x</i> <span className={isCombo ? style.isCombo : ""}>{_.max([item.combo, item.count])}</span>
      </div>
    </div>
  );
}
