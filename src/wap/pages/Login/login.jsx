import React, { useCallback, useEffect, useState, useRef } from "react";
import Langimg from "../../assets/image/login/lang.png";
import { useTranslation } from "react-i18next";
import style from "./login.module.scss";
import { Input } from "../../components";
import { ActionSheet, Button, Grid } from "antd-mobile";
import i18n from "../../lang/i18n";
import { accountLogin, doFaceBookLogin } from "../../server/login";
import { useNavigate } from "react-router-dom";
import { Local } from "../../../common";
import useContextReducer from "../../state/useContextReducer";

const Login = () => {
  const { t } = useTranslation();
  const {
    state: { loginForm },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { freshUser, userGetUserAsserGold } = fetchUtils;
  const history = useNavigate();
  // loginForm.mobile || Local("mobile") ||
  const [phone, setPhone] = useState("");
  // loginForm.password || Local("password") ||
  const [password, setPassword] = useState("");

  const [loading, loadingSet] = useState(false);
  const [loading2, loading2Set] = useState(false);
  const [facebookLoading, facebookLoadingSet] = useState(false);
  // 控制切换语言弹出
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState("");
  const actions = [
    { text: "简体中文", key: "zh" },
    // { "text": "ENGLISH", "key": "en" },
    // { "text": "ไทย", "key": "th" },
    { text: "Tiếng Việt", key: "vie" },
  ];
  // 选择语言事件
  const handleSelectLang = (e) => {
    let lang = `${e.key}`;
    Local("lang", lang);
    i18n.changeLanguage(lang);
    setLang(e.text);
    setVisible(false);
  };

  //登录事件
  const handleLogin = async () => {
    loading2Set(true);
    Local("token", null);
    Local("userInfo", null);
    const res = await accountLogin({ mobile: phone, password });
    if (!(res instanceof Error)) {
      Local("token", res.token);
      await freshUser();
      // userGetUserAsserGold();
      loading2Set(false);
      window.eventBus.emit("store", { type: "handleLogin" });
      history("/live");
    } else {
      loading2Set(false);
    }
  };

  // 点击跳转下载
  const urlD = () => {
    setTimeout(() => {
      loadingSet(false);
    }, 1000);
    console.log("推广码", sessionStorage.getItem("promoteDomain"));
    if (sessionStorage.getItem("agentId") != undefined && sessionStorage.getItem("agentId") != null) {
      window.open(`//download.fbslive.com?agentId=${sessionStorage.getItem("agentId")}`);
    } else {
      window.open(`//download.fbslive.com?agentId=${sessionStorage.getItem("agentId")}`);
    }
  };
  /* eslint-disable */
  const innit = useCallback(async () => {
    Local("userInfo", null);
    Local("token", null);
    let lang = Local("lang") || "vie";
    let [{ text }] = actions.filter((item) => item.key === lang);
    setLang(text);
  }, []);

  useEffect(() => {
    innit();
  }, [innit]);

  const clientHeight = useRef(0);
  useEffect(() => {
    clientHeight.current = document.getElementById("content").clientHeight;
    listenKeybordAndroid();
  }, []);

  // 监听Android键盘弹起
  const listenKeybordAndroid = () => {
    const originHeight = document.documentElement.clientHeight || document.body.clientHeight;

    console.log("监听键盘...", originHeight);
    window.onresize = function () {
      // 键盘弹起与隐藏都会引起窗口的高度发生变化
      const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (resizeHeight < originHeight) {
        // 当软键盘弹起，在此处操作
        if (clientHeight.current) {
          document.getElementById("content").style.height = clientHeight.current + "px";
        }
        console.log("弹出...", document.getElementById("content").style.height, document.body.clientHeight);
      } else {
        // 当软键盘收起，在此处操作
        document.getElementById("content").style.height = "calc(100vh - 60px)";
        console.log("收起...", document.getElementById("content").style.height, document.body.clientHeight);
      }
    };
  };

  // facebook登录接口
  const doFaceBookLoginF = async (token) => {
    // { token: }
    const res = await doFaceBookLogin({ accessToken: token });
    if (!(res instanceof Error)) {
      facebookLoadingSet(false);
      if (res != null && res.token != null && res.token != undefined && res.token.length > 0) {
        Local("token", res.token);
        Local("accessToken", token);
        await freshUser();
        // userGetUserAsserGold();
        history("/live");

        window.eventBus.emit("store", { type: "handleLogin" });

      } else {
        Local("accessToken", token);
        history("/bindingHandset");
      }
    } else {
      facebookLoadingSet(false);
    }
  };
  // facebook登录
  const facebookLoginF = () => {
    facebookLoadingSet(true);

    FB.getLoginStatus((response) => {
      console.log("getLoginStatus---------response", response);
      if (response.status === "connected") {
        // 进行登录
        doFaceBookLoginF(response.authResponse.accessToken);
      } else {
        FB.login(
          (response) => {
            // handle the response
            console.log("response----------", response);
            if (response.status === "connected") {
              // FB.api('/me', (response_2) => {
              //   console.log(response_2, 'Good to see you, ' + response_2.name + '.');
              // });
              doFaceBookLoginF(response.authResponse.accessToken);
              console.log("成功--登录");
            } else {
              console.log("未登录");
              facebookLoadingSet(false);
            }
            // , { scope: 'public_profile,email' }
          },
          { scope: "public_profile,email" }
        );
      }
    });

    // FB.login((response) => {
    //   // handle the response
    //   console.log('response----------', response);
    //   if (response.status === 'connected') {
    //     // FB.api('/me', (response_2) => {
    //     //   console.log(response_2, 'Good to see you, ' + response_2.name + '.');
    //     // });
    //     // doFaceBookLoginF(response.authResponse.accessToken)
    //     console.log('成功--登录');
    //   } else {
    //     console.log('未登录');
    //     facebookLoadingSet(false)
    //   }
    //   // , { scope: 'public_profile,email' }
    // }, { scope: 'public_profile,email' });
  };
  /* eslint-enable */
  return (
    <>
      <div className={style.loginWapper}>
        <div className={style.Appxz}>
          <div className={style.Appxz_left}>
            <img src={require("../../assets/image/login/logotitle.png")} alt="" />
            <div className={style.Appxz_left_font}>FBSLive</div>
          </div>
          <Button
            className={style.Appxz_Botton}
            loading={loading}
            onClick={() => {
              loadingSet(true);
              urlD();
              window.open(`//download.fbslive.com?agentId=${sessionStorage.getItem("agentId")}`);
            }}>
            {t("login_xz")}
          </Button>
        </div>
        <div className={style.bg} id={"content"}></div>
        <div className={style.headImg}>
          <img src={require("../../assets/image/login/logoz.png")} alt="" className={style.logo} />
        </div>
        {/* 标题及切换语言 */}
        {/* <div className={style.appName}>
                <div className={style.name}>{t('wel_Come')}</div>
            </div> */}
        {/* 输入表单 */}
        <form className={style.loginForm} onKeyDown={(e) => e.keyCode == 13 && handleLogin()}>
          {/* <span className={style.label}>{t('zhang_hu')}</span> */}
          <div className={style.labelS}>
            <div className={style.labelS2}>
              <img src={require("../../assets/image/login/sj.png")} alt="" />
            </div>
            <Input
              type="text"
              value={phone}
              className={style.stepInput}
              placeholderColor={true}
              placeholder={t("tip_acc_blank")}
              onChange={(e) => {
                (/^[0-9][0-9]*$/.test(e) || e == "") && e.length <= 10 && setPhone(e);
              }}></Input>
          </div>
          {/* <span className={style.label}>{t('password')}</span> */}
          <div className={style.labelS}>
            <div className={style.labelS2}>
              <img src={require("../../assets/image/login/mma.png")} alt="" />
            </div>
            <Input type="password" color1={true} value={password} className={style.stepInput} placeholderColor={true} placeholder={t("tip_pwd_blank")} onChange={setPassword}></Input>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className={style.choice}>
              <div style={{ borderRight: "1px solid #fff", paddingRight: "29px" }} onClick={() => history("/forget")}>
                {t("ui_forget_password")}
              </div>
              <div style={{ paddingLeft: "24px" }} onClick={() => history("/register")}>
                {t("ui_registered")}
              </div>
            </div>
          </div>
          <Grid columns={1} gap={15} className={style.btnGroup}>
            <Grid.Item>
              <Button className={style.btnLogin} color="primary" block={true} onClick={() => handleLogin()} loading='auto'>
                {t("btn_login")}
              </Button>
            </Grid.Item>

            {/* 是否关闭facebook 0 否 1是 */}
            {
              Local('baseInfo')?.closeFacebook == 0 &&
              <Grid.Item>
                <Button
                  className={style.facebook}
                  loading='auto'
                  onClick={() => {
                    facebookLoginF();
                  }}>
                  <img src={require("../../assets/image/newImg/binding/ficon.png")} alt="" />
                  <span>Facebook</span>
                </Button>
              </Grid.Item>}
          </Grid>

          {/* 切换语言框 */}
          {/* <div className={`${style.lang} ${style.disFlex}`} onClick={() => setVisible(true)}>
                    <img src={Langimg} alt="" />
                    <span>{lang}</span>
                </div> */}
        </form>

        <ActionSheet extra={t("ui_language_selection")} cancelText={t("cancel")} visible={visible} actions={actions} onClose={() => setVisible(false)} onAction={handleSelectLang} />

        {/* <Button onClick={() => {
          FB.logout((response) => {
            console.log('退出----------', response);
          })
        }}>
          退出
        </Button> */}
      </div>
    </>
  );
};

export default Login;
