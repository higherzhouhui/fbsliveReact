import React, { useEffect, useState, useCallback } from "react";
import { Dropdown, Avatar, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import { Local } from "../../common/index.js";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";
import { getAgentInfo } from "../../api/base";
import useContextReducer from "../../state/useContextReducer.js";
import UserInfo from "./userInfo.jsx";
import Activity from "./activity.jsx";
import App from "./app.jsx";
import Game from "./components/game.jsx";
import Language from "./language";
import LogoImg from "../../assets/images/header/logo.png";
import LiveLogoImg from "../../assets/images/live/logo.png";
import LoginBase from "./login/index";
import AOS from "aos";
import _ from "lodash";
import "aos/dist/aos.css";
import "./index.scss";
export default () => {
  const history = useNavigate();
  const { t } = useTranslation();
  const {
    state: { user: userInfo, common: { game }, assergoldData },
    fetchUtils: { freshUser, updateGame },
  } = useContextReducer.useContextReducer();
  const rightItem = [
    { index: 0, title: t("home_1"), icon: "yh", overlay: <Activity />, arrow: true, isShow: !userInfo },
    { index: 1, title: t("home_2"), icon: "app", overlayClassName: "app-overlay", overlay: <App />, arrow: false, isShow: false, click: "/downLoad" },
    { index: 2, title: t("home_3"), icon: "hy", overlay: <div />, arrow: false, isShow: false, click: "//agent.fbslive.com/" },
    { index: 3, title: t("home_4"), icon: "yy", overlay: <Language />, arrow: true, isShow: false },
  ];
  const [topList, setTopList] = useState([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const [pathname, setPathname] = useState("/");
  const [loginType, loginTypeSet] = useState(0);
  const loginSuccess = ({ type }) => {
    // if (type == 'handleLogin') init()
  };
  // 获取app下载二维码地址
  const webGetAppDownloadUrl = () => {
    getAgentInfo({
      promoteDomain: window.location.href,
    }).then((rt) => {
      if (!rt) return;
      sessionStorage.setItem("agentId", rt.agentId);
    });
  };
  useEffect(() => {
    // webGetAppDownloadUrl();
    freshUser();
    AOS.init({
      duration: 1000,
      easing: "ease-out-back",
      delay: 600,
    });
    window.eventBus.addListener("store", loginSuccess);
    return () => {
      window.eventBus.removeListener("store", loginSuccess);
    };
  }, []);

  useEffect(() => {
    let data = game.filter((e) => { return e.list.length > 0 && e.uiType != 0 });
    data = data.filter((e) => { return e.title !== 'Hot' });
    setTopList(data);
    updateGame(data);
  }, [game]);

  const rightItemClick = (item) => {
    switch (item.icon) {
      case "hy":
        window.open(item?.click, "_blank");
        break;
      case "app":
        history(item?.click);
        break;
      default:
        history(item?.click);
        break;
    }
  };
  useEffect(() => {

  }, []);
  const changeBackground = () => {
    let header = document.getElementById("headerBg");
    if (window.location.pathname != "/download") {
      if (window.pageYOffset >= 80) {
        header.style = "background: #fff;box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);zIndex:999";
      } else {
        header.style = "linear-gradient(180deg, #E2E2E2 0%, rgba(250,250,250,0.5) 100%);box-shadow: none;zIndex:999";
      }
    }
  };
  useEffect(() => {
    let pathname = window.location.pathname;
    setPathname(pathname);
    let header = document.getElementById("headerBg");
    if (pathname !== '/live/detail') {
      header.style = "linear-gradient(180deg, #E2E2E2 0%, rgba(250,250,250,0.5) 100%);box-shadow: none;zIndex:999";
      const watchScroll = () => window.addEventListener("scroll", changeBackground);
      watchScroll();
      return () => window.removeEventListener("scroll", changeBackground);
    } else {
      header.style = "background: #161722;box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);zIndex:999";
    }
  }, [window.location.href]);

  return <div className={`header-container ${pathname == "/live/detail" && "live-bg"}`} id="headerBg">
    <div className="header-box" id="header">
      <Modal
        centered="true"
        destroyOnClose="true"
        width={380}
        className="login-modal"
        onCancel={() => {
          setLoginVisible(false);
        }}
        visible={loginVisible}
        footer={null}>
        <LoginBase type={loginType} FreshUser={freshUser} onOk={() => setLoginVisible(false)} />
      </Modal>
      <div className="inner">
        {/* 顶部左侧 */}
        <div className="top-left" data-aos="fade-right" data-aos-delay="400" data-aos-easing="ease">
          {/* logo */}
          <Link to="/">
            <img className="logo-icon" src={pathname != "/live/detail" ? LogoImg : LiveLogoImg} alt="" />
          </Link>
          {/* 首页 */}
          <Link to="/">
            <div className={"top-item " + (pathname == "/" && "active")}>{t("home_5")}</div>
          </Link>
          {/* 游戏 */}
          {topList.map((item, index) => (
            <Dropdown overlayClassName={"app-overlay"} key={index} open={false} overlay={<Game data={item} />} placement="bottom">
              <div className="top-item" key={`${item.typeId}__${index}`}>
                {item.title}
              </div>
            </Dropdown>
          ))}
          {/* 直播 */}
          <Link to="/live/list">
            <div className={"top-item " + (pathname != "/" && "active")}>Live</div>
          </Link>
        </div>
        {/* 顶部右侧 */}
        <div className="top-right" data-aos="fade-left" data-aos-delay="400" data-aos-easing="ease">
          <div className="right-info">
            {/* 优惠 APP 合营 语言 */}
            <div className="function_box">
              {rightItem.map((item, index) => {
                return (
                  !item.isShow && <Dropdown key={index} overlayClassName={item.overlayClassName} destroyPopupOnHide overlay={item.overlay} placement="bottom" arrow={item.arrow} style={{ top: "80px" }}>
                    <div
                      className={`item ${item.hoverClass}`}
                      onClick={() => {
                        rightItemClick(item);
                      }}>
                      <ReactSVG className="icon" src={require(`../../assets/images/svg/${item.icon}.svg`)} />
                      <span className="title">{item.title}</span>
                    </div>
                  </Dropdown>
                );
              })}
            </div>
            {/* 个人中心 */}
            {userInfo?.nickname ?
              <Dropdown overlay={<UserInfo />} placement="bottomRight" arrow>
                <div
                  className="user-info"
                >
                  <div className="user-basic"
                    onClick={() => { history("/user/wallet"), window.eventBus.emit("userInfoLink", "wallet") }}
                  >
                    <div title={userInfo?.nickname} className="user-name">
                      {userInfo?.nickname}
                    </div>
                    <div className="gold-box">
                      <div className="gold-coin">{(Number(assergoldData?.goldCoin || 0)).toFixed(2)}</div>
                      <div className="icon icon-down2"></div>
                    </div>
                  </div>
                  <Avatar className="user-logo" src={userInfo.avatar} onClick={() => {
                    history("/user/info"), window.eventBus.emit("userInfoLink", "info");
                  }} />
                </div>
              </Dropdown>
              : <div className="user-logo-no">
                <Button
                  className="user-logo-box"
                  onClick={() => {
                    loginTypeSet(0), setLoginVisible(true);
                  }}>
                  {t("ui_login")}
                </Button>
                <Button
                  className="user-logo-box register"
                  onClick={() => {
                    loginTypeSet(1), setLoginVisible(true);
                  }}>
                  {t("ui_registered")}
                </Button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  </div>
};
