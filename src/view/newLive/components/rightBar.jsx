// 右侧悬浮导航组件
import React, { useEffect, useState } from "react";
import { getCserver } from "@/api/base";
import { Popover } from "antd";
import QRCode from "qrcode.react";
import useContextReducer from "@/state/useContextReducer";
import "./style/rightBar.scss";
export default (props) => {
  const { t } = props;
  const {
    state: { serviceUrl },
    dispatch
  } = useContextReducer.useContextReducer();
  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");
  const EcodeUrl = `http://download.fbslive.com?agentId=${sessionStorage.getItem("agentId")}`;
  let scrollTimer = null;
  // 滚动到顶部
  const setScroll = (type) => {
    let scrollTopLen = window.scrollY;
    if (scrollTopLen == 0) return;
    clearInterval(scrollTimer);
    let fh = 1;
    const heightLen = document.getElementById(type).offsetTop;
    if (scrollTopLen > heightLen) {
      fh = -1;
    }
    const chaHeight = Math.abs(heightLen - scrollTopLen - 90);
    const jgHeight = Math.floor(chaHeight / 40);
    if (chaHeight >= jgHeight) {
      scrollTimer = setInterval(() => {
        if (Math.abs(heightLen - scrollTopLen - 90) <= jgHeight) {
          clearInterval(scrollTimer);
        }
        scrollTopLen += fh * jgHeight;
        window.scrollTo(0, scrollTopLen);
      }, 10);
    }
  };
  // 滚动顶部是否展示
  const addScrollAction = () => {
    let scrollTopLen = window.scrollY;
    if (scrollTopLen > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  // 获取客服链接
  const getCserverList = async () => {
    let data = await getCserver();
    let url = data[0]?.url;
    setUrl(url);
    dispatch({
      type: "UPDATE_SERVICEURL",
      payload: url,
    });
  };
  const getEcodeContent = () => {
    return (
      <div className="right-bar-ecode-box">
        <QRCode className="code" value={EcodeUrl} size={110} />
        <div className="text">
          <div>{t("bar_code_1")}</div>
          <div>{t("bar_code_2")}</div>
        </div>
        <div className="btn" onClick={() => window.open(EcodeUrl)}>
          {t("f_ui_download_theapp")}
        </div>
      </div>
    );
  };
  useEffect(() => {
    window.addEventListener("scroll", addScrollAction);
    if (serviceUrl) {
      setUrl(serviceUrl)
    } else {
      getCserverList();
    }
  }, []);
  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", addScrollAction);
    };
  }, []);
  return ( 
    <div className="right-bar">
      <Popover placement="left" content={getEcodeContent()}>
        <div className="right-bar-item">
          <img src={require("../../../assets/images/live/ecode-icon.png")} alt="" />
          <div className="text">{t("download")}</div>
        </div>
      </Popover>
      <div className="right-bar-item" onClick={() => window.open(url)}>
        <img src={require("../../../assets/images/live/kf-icon.png")} alt="" />
        <div className="text">{t("ui_cs")}</div>
      </div>
      {visible ? (
        <div className="right-bar-item" onClick={() => setScroll("header")}>
          <img src={require("../../../assets/images/live/top-icon.png")} alt="" />

          <div className="text">{t("top")}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
