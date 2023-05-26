import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { TabBar, CEmpty } from "../../components";
import style from "./index.module.scss";
import useContextReducer from "../../state/useContextReducer";

const Home = () => {
  const history = useNavigate();
  const { t } = useTranslation();
  const {
    state: {
      common: { activity },
    },
  } = useContextReducer.useContextReducer();
  const listDom = () => {
    return activity.map((item, index) => {
      return (
        <div
          key={index}
          className={style.item}
          onClick={() => {
            item.activityType == 1001 ? history("/saveMoney") : item.activityType == 1006 ? history("/promisionDetail", { state: { url: item.activityDetail, tokens: true } }) : history("/promisionDetail", { state: { url: item.activityDetail } });
          }}>
          <img src={item.activityHomePage} alt="" lazy="true" className={style.icon} />
        </div>
      );
    });
  };

  return (
    <div className={style.bodys}>
      <NavBar back={null} left={null} className={style.wbg} right={null}>
        <div style={{ fontSize: "18px", fontWeight: "500", color: "#fff" }}>{t("ui_promo")}</div>
      </NavBar>
      <div className={style.container}>{activity.length > 0 ? listDom() : <CEmpty className={style.liveList} description={t("noData")} />}</div>
      {/* <img src={require("../../assets/image/center/flzx/rkLog.png")} alt="" className={style.rkLogS} onClick={() => history("/goodCentre")} /> */}
      <TabBar active="/home" />
    </div>
  );
};
export default Home;
