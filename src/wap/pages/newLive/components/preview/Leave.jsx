import React from "react";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";

const Leave = () => {
  const { t } = useTranslation();
  return (
    <div className={style.roomClosed_2}>
      <div className={style.roomClosed_center}>
        <img src={require("../../../../assets/image/live/lk/lk.png")} alt="" style={{ width: "43px", height: "46px", marginBottom: "12px" }} />
        <div className={style.roomClosed_center2}>{t("zhi_bo_lk")}</div>
        <div>{t("zhi_bo_xxpk")}</div>
      </div>
    </div>
  );
};

export default Leave;
