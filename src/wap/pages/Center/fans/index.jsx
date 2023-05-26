import React, { useEffect, useState } from "react";
import { Avatar, Button, Skeleton } from "antd-mobile";
import { fansList, liveFollow } from "../../../server/Fans";
import { useTranslation } from "react-i18next";
import { CNavBar, CEmpty } from '../../../components'
import style from "./index.module.scss";
import useContextReducer from "../../../state/useContextReducer";

const Fans = () => {
  const {
    state: {
      user, assergoldData
    }, fetchUtils,
    dispatch
  } = useContextReducer.useContextReducer()
  const { freshUser, } = fetchUtils
  const { t } = useTranslation();
  const [list, listSet] = useState([]);
  const [Loading, LoadingSet] = useState(false);
  useEffect(() => {
    LoadingSet(true);
    fansLists();
  }, []);
  const fansLists = () => {
    fansList({ page: 0 }).then((item) => {
      LoadingSet(false);
      listSet(item || []);
    });
  };

  const follow = async (d) => {
    const res = await liveFollow({ isFollow: !d.isFollow, targetId: d.uid })
    if (!(res instanceof Error)) {
      fansLists();
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
    return list.map((item, index) => {
      return <div key={index} className={style.list}>
        <div className={style.item}>
          <Avatar className={style.avatar} src={item?.avatar || require('../../../assets/image/login/logoz.png')} style={{}} />
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
        {item.isFollow ?
          <Button
            className={style.Swipers_But2}
            loading="auto"
            onClick={() => follow(item)}>
            {t("yiguanzhu")}
          </Button>
          :
          <Button
            className={style.Swipers_But}
            loading="auto"
            onClick={() => follow(item)}>
            + {t("guanzhu")}
          </Button>
        }
      </div>
    })
  }
  return <div>
    <CNavBar title={t('fensi')} left={true} />
    <div className={style.container}>
      {list.length > 0 ? listDom() : Loading ? itemSK() : <CEmpty description={t("dangqianmeiyouxiangguanjiluo")} />}
    </div>
  </div>
};

export default Fans;
