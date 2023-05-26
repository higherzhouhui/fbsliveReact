import React, { useEffect, useState } from "react";
import { isRegister, SendSms, WyVerify, SendSms2 } from "../../api/login";
import { Button, Toast } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { Local, loadScript } from "../../common/index";
import Style from "./index.module.scss";
let timer;
const Verify = (props) => {
  const { phone, type, noBtn, className, sendType, Click } = props;
  const { t } = useTranslation();
  const sendTxt = props.sendTxts === undefined ? <span className={Style.jqColor}>{t("ui_send_verification")}</span> : <span className={Style.jqColor}>{t("Reacquire")}</span>;
  let [sendTime, setSendTime] = useState(0);
  let [cid, setCid] = useState("");
  let [isSend, setIsSend] = useState(false);

  const sendSms = async () => {
    if (!phone) return;
    if (!/^0\d{9}$/.test(phone)) return Toast.show(t("shu_ru_true_phone"));
    if (sendTime > 0) return;
    if (isSend) return;
    if (type === 1) {
      const res = await isRegister({ mobile: phone });
      if (!(res instanceof Error)) {
        if (res !== "0") return Toast.show({ content: t("yi_bei_reg") });
        if (res === "0") {
          const res = await WyVerify();
          if (!(res instanceof Error)) {
            initCaptch(res.verificationNo);
          }
        }
      }
    } else {
      const res = await WyVerify();
      console.log(res, "res");
      if (!(res instanceof Error)) {
        initCaptch(res.verificationNo);
      }
    }
  };
  const getTimestamp = (msec) => {
    msec = !msec && msec !== 0 ? msec : 1;
    return parseInt(new Date().valueOf() / msec, 10);
  };
  // 初始化易盾
  const initCaptch = (captchaId) => {
    let lang = "";
    let langKey = Local(lang);
    switch (langKey) {
      case "zh":
        lang = "zh-CN";
        break;
      case "en":
        lang = "en";
        break;
      case "th":
        lang = "th";
        break;
      case "vie":
        lang = "vi";
        break;
      default:
        lang = "vi";
        break;
    }
    const url = window.location.protocol + "//cstaticdun.126.net/load.min.js" + "?t=" + getTimestamp(60 * 1000); // 时长1分钟，建议时长分钟级别

    loadScript(url, () => {
      /* eslint-disable */
      initNECaptcha(
        {
          element: "#captcha",
          captchaId,
          width: "300px",
          mode: "popup",
          lang,
          protocol: location?.protocol?.replace(/\:/g, ""),
          //验证成功
          onVerify: async (err, data) => {
            if (!err) {
              try {
                let res;
                if (sendType == "1") {
                  res = await SendSms({
                    mobile: phone,
                    type: type,
                    captchaValidate: data.validate,
                    verificationNo: captchaId,
                  });
                  Click();
                } else if (sendType == "2") {
                  res = await SendSms2({
                    mobile: phone,
                    type: type,
                    captchaValidate: data.validate,
                    verificationNo: captchaId,
                  });
                }
                if (!(res instanceof Error)) {
                  setSendTime(180);
                  handelSetPid(data.validate);
                  Toast.show(t("yzm_cg"));
                  setIsSend(true);
                }
              } catch (error) {
                setIsSend(false);
              }
            }
          },
        },
        //加载成功
        (onload = (instance) => {
          setCid(captchaId);
          instance.popUp();
        }),
        (onerror = (err) => {
          console.warn(err);
        })
      );
      /* eslint-enable */
    });
  };

  // 获取验证id
  const handelSetPid = (id) => {
    props.onGetId(id);
  };
  useEffect(() => {
    timer && clearInterval(timer);
    return () => timer && clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sendTime === 180) timer = setInterval(() => setSendTime((time) => --time), 1000);
    else if (sendTime === 0) clearInterval(timer);
  }, [sendTime]);
  return (
    <>
      <div id="captcha"></div>
      <Button
        color="primary"
        size="mini"
        className={`${noBtn ? Style.noBtn : Style.btn} ${className}`}
        onClick={() => {
          sendSms();
        }}>
        {sendTime > 0 ? <span className={Style.jqColor}>{sendTime}</span> : sendTxt}
      </Button>
    </>
  );
};

export default Verify;
