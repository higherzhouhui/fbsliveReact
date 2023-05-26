import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Local } from "../../../common";
import { CNavBar } from "../../components";
import style from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import i18n from "../../lang/i18n.js";

const Detail = () => {
  const history = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const isImg = /(\.)(PNG|png|jpg|JPG|jpeg|JPEG)/.test(state.url);

  const getLang = (language) => {
    switch (language) {
      case "th":
        return "THAI";
      case "zh":
        return "CN";
      case "en":
        return "EN";
      case "vie":
        return "YN";
      default:
        return "YN";
    }
  };

  useEffect(() => {
    window.addEventListener("message", jumpCharge);
    return () => {
      window.removeEventListener("message", jumpCharge);
    };
  }, []);

  const jumpCharge = (e) => {
    console.log('e----------------', e);
    if (e.data.type === "jumpCharge") history("/recharge");
    if (e.data.type === "closeGame") history(-1);
  }

  return (
    <div className={style.bodys2}>
      <CNavBar title={state.titles ? state.titles : t("ui_promo")} left={true} />
      {isImg ? (
        <div className={style.container} style={{ padding: "0px 0 0 0" }}>
          <img src={state.url} alt="" />
        </div>
      ) : (
        <iframe src={`${state.url}?lang=${getLang(i18n.language)}&token=${Local("token")}&udid=${Local('finger')}&device=h5`} width="100%" height="100%"></iframe>
      )}
    </div>
  );
};
export default Detail;
