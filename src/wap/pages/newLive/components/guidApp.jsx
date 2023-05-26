import { Checkbox, Popup } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style/guidApp.module.scss";
import { CloseOutline } from "antd-mobile-icons";
import { Local } from "../../../../common";

export default function GuidApp() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  const init = useCallback(() => {
    checkWindow();
  }, []);
  useEffect(() => {
    init();
  }, [init]);

  const checkWindow = () => {
    if (Local("hasCheck")) return;
    setTimeout(() => {
      setShow(true);
    }, 10000);
  };

  useEffect(() => {
    if (!show) checkWindow();
  }, [show]);
  return (
    <Popup visible={show} onMaskClick={() => setShow(false)} bodyClassName={style.downWindow}>
      <img src={require("../../../assets/image/center/gyfbstitle.png")} className={style.logo} />
      <div className={style.content}>
        <CloseOutline className={style.close} onClick={() => setShow(false)} color="#000" />
        <div className={style.disFlexs}>
          {t("xia_zai_content")}
          <Checkbox
            style={{
              "--icon-size": "18px",
              "--font-size": "14px",
              "--gap": "6px",
            }}
            checked={checked}
            onChange={(e) => {
              if (e) Local("hasCheck", true);
              else Local("hasCheck", null);
              setChecked(e);
            }}
            className={style.checkbox}>
            {t("no_chuang_kou")}
          </Checkbox>
        </div>
        <div
          className={style.button}
          onClick={() => {
            setShow(false);
            window.open(`http://download.fbslive.com?agentId=${sessionStorage.getItem("agentId")}`);
          }}>
          {t("ui_app_download")}
        </div>
      </div>
    </Popup>
  );
}
