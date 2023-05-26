import React, { useEffect, useState } from "react";
import { Avatar, Button, Skeleton } from "antd-mobile";
import { liveFollow } from "../../../server/Follow";
import { useTranslation } from "react-i18next";
import { CNavBar, CEmpty } from '../../../components'
import style from "../fans/index.module.scss";
import useContextReducer from "../../../state/useContextReducer";

const Follow = () => {
  const {
    state: {
      live,
      user, assergoldData
    }, fetchUtils,
    dispatch
  } = useContextReducer.useContextReducer()
  const { freshUser, userGetUserAsserGold } = fetchUtils
  const { t } = useTranslation();
  const [Loading, LoadingSet] = useState(false);

  const cancel = async (d) => {
    const res = await liveFollow({ isFollow: false, targetId: d.uid })
    if (!(res instanceof Error)) {
      if (res) {
        dispatch(() => {
          return {
            type: "live/SetFollowLists",
            payload: res,
          };
        });
      }
      freshUser()//刷新粉丝关注
    }
  };

  const itemSK = () => {
    return <div className={style.fansSk}>
      {Array(4).fill().map((value, index, array) => {
        return <Skeleton animated key={index} className={style.customSkeleton} />;
      })}
    </div>
  }
  const listDom = () => {
    return live.followLists.map((item, index) => {
      return <div key={index} className={style.list}>
        <div className={style.item} >
          <Avatar className={style.avatar} src={item?.avatar || require('../../../assets/image/login/logoz.png')} />
          <div className={style.info}>
            <div className={style.left}>
              <div className={style.nickname}>{item.nickname}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.sex !== 0 && <img className={style.imgs} src={item.sex == 2 ? require("../../../assets/image/center/woman.png") : item.sex == 1 ? require("../../../assets/image/center/man.png") : ""} alt="" />}
                <img className={style.level} src={require(`../../../assets/image/live/level_${item.userLevel ? item.userLevel : 1}.png`)} />
              </div>
            </div>
            <div className={style.right}>{item.signature?.length > 0 ? item.signature : t("zhegeyonghuhenlanshenmedoumeiyouliuxia")}</div>
          </div>
        </div>
        <Button
          className={style.Swipers_But}
          loading="auto"
          onClick={() => cancel(item)}>
          {t("yiguanzhu")}
        </Button>
      </div>
    })
  }
  return <div>
    <CNavBar title={t('guanzhu')} left={true} />
    <div className={style.container}>
      {live.followLists.length > 0 ? listDom() : Loading ? itemSK() : <CEmpty type={1} description={t("nizanshihaimeiyouguanzhurenheren")} subtitleDescription={t('ganjinqugaunzhuyigeba')} />}
    </div>
  </div>
};

export default Follow;
