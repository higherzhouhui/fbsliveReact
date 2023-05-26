import React, { useEffect, useState, Suspense } from "react";
import style from "./index.module.scss";
import { Skeleton, Button } from "antd-mobile";
import { useTranslation } from "react-i18next";
import logoImg from "../../../assets/image/join/logo.png";
import backImg from "../../../assets/image/join/back.png";
import backImg2 from "../../../assets/image/kf/left.png";

import icon1Img from "../../../assets/image/join/icon1.png";
import icon2Img from "../../../assets/image/join/icon2.png";
import { useCopy } from "../../../../utils/copy";
import { getCserver } from "../../../server/user";
import { Local } from "../../../../common";

// console.log(getCserver, "getCserver")

const Join = () => {
  const { t } = useTranslation();
  const [kefu, setKefu] = useState([]);
  const copy = useCopy();
  const [loading, setLoading] = useState(false);
  // 获取客服链接
  const getCserverList = async () => {
    setLoading(false);
    getCserver({ type: 3 }).then((res) => {
      if (!(res instanceof Error)) {
        setKefu(res);
        setLoading(true);
      }
    });
  };

  useEffect(() => {
    getCserverList();
  }, []);

  return (
    <div className={style.join_content}>
      <img className={style.back} src={backImg2} alt="" />
      <img
        onClick={() => {
          window.history.back(-1);
        }}
        className={style.logo}
        src={logoImg}
        alt=""
      />
      <div className={style.kefu_box}>
        <div className={style.tips}>
          <div>{t("join_01")}</div>
        </div>
        <div className={style.list}>
          {loading
            ? kefu.map((item, index) => {
              return (
                <div key={index} className={style.item}>
                  <img className={style.icon} src={item.icon} />
                  <div className={style.info}>
                    <span className={style.name}>{item.nickname}</span>
                    <span className={style.value}>{item.phone}</span>
                  </div>
                  <div className={style.copy_btn} onClick={() => copy(item.phone)}>
                    {t("btn_copy")}
                  </div>
                </div>
              );
            })
            : Array(4)
              .fill("")
              .map((item, index) => (
                <Suspense key={index}>
                  <Skeleton.Title className={style.item} />
                </Suspense>
              ))}
        </div>
      </div>
      <div className={style.join_desc}>
        <div className={style.title}>
          <span>{t("join_02")}</span>
        </div>
        <div className={style.other}>
          <div className={style.desc_item}>
            <div className={style.item}>
              <img src={icon1Img} alt="" />
              <span>{t("join_03")}</span>
            </div>
            <div className={style.item}>
              <img src={icon2Img} alt="" />
              <span>{t("join_04")}</span>
            </div>
          </div>
          <div className={style.tips}>
            <span>{t("join_05")}</span>
          </div>
          <div className={style.desc}>{t("join_06")}</div>
        </div>
      </div>
      <div className={style.jrhyBottom}>
        <Button
          className={style.butns}
          onClick={() => {
            // copy("https://agent.fbslive.com");
            window.open(Local('baseInfo')?.agentUrl)
          }}>
          {t("join_07")}
        </Button>
      </div>
    </div>
  );
};

export default Join;
