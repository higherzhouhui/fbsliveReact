import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Button, Form, Input, Radio, message } from "antd";
import "../../assets/style/login/register.scss";
import { makeRequest } from "../../utils/httpHelper";
import { authorization } from "../../utils/tools";
import MobileDetect from "mobile-detect";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "left",
      timer: 60,
      showTimer: false,
    };
  }
  componentWillUnmount() {
    this.clearTimer();
  }
  clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }
  onFinish(values) {
    this.onSumbit(values);
  }
  getTimestamp(msec) {
    msec = !msec && msec !== 0 ? msec : 1;
    return parseInt(new Date().valueOf() / msec, 10);
  }
  loadScript(src, cb) {
    const head = document.head || document.getElementsByTagName("head")[0];
    const script = document.createElement("script");

    cb = cb || function () { };

    script.type = "text/javascript";
    script.src = src;

    if (!("onload" in script)) {
      script.onreadystatechange = function () {
        if (this.readyState !== "complete" && this.readyState !== "loaded") return;
        this.onreadystatechange = null;
        cb(script);
      };
    }

    script.onload = function () {
      this.onload = null;
      cb(script);
    };

    head.appendChild(script);
  }
  async runSendCode(verificationNo, captchaValidate) {
    // ！！这里要区分！！
    let url = "/center-client/sys/auth/send/vcode";
    try {
      this.sendVcodeBusing = true;
      await makeRequest({
        url,
        data: {
          verificationNo,
          captchaValidate,
          mobile: this.refs.forms.getFieldsValue().mobile,
          type: 1,
        },
      });
      this.sendVcodeStartCnt();
    } finally {
      this.sendVcodeBusing = false;
    }
  }
  initCaptch() {
    let lang = this.props.i18n.language;
    const url = window.location.protocol + "//cstaticdun.126.net/load.min.js" + "?t=" + this.getTimestamp(60 * 1000); // 时长1分钟，建议时长分钟级别
    const verificationNo = this.sendVcodeCaptcha.verificationNo;
    const keyMap = {
      zh: "zh-CN",
      en: "en",
      th: "th",
      vie: "vi",
    };

    this.loadScript(url, () => {
      window.initNECaptcha(
        {
          lang: keyMap[lang],
          element: "#captcha",
          captchaId: verificationNo,
          protocol: window.location.protocol.replace(":", ""),
          width: "300px",
          mode: "popup",
          //验证成功
          onVerify: async (err, data) => {
            if (!err) {
              const captchaValidate = data.validate;
              await this.runSendCode(verificationNo, captchaValidate);
            }
          },
        },
        (instance) => {
          instance.popUp();
        },
        (err) => {
          console.error(err);
        }
      );
    });
  }
  async checkRegiste() {
    const { t } = this.props;
    const da = await makeRequest({
      url: "/center-client/sys/user/phone/isRegiste",
      data: {
        mobile: this.refs.forms.getFieldsValue().mobile,
      },
    });
    if (da === "1") {
      message.error(t("mobile_number_already_exists"));
      throw new Error("mobile number already exists");
    }
    this.sendVcodeCaptcha = await makeRequest({
      url: "/center-client/sys/user/captcha",
    });
    this.initCaptch();
  }

  sendVcodeStartCnt() { }
  handleModeChange() {
    this.props.onTypeChange(1);
  }
  async codeValidate(data) {
    let { mobile, vcode } = data;
    const res = await makeRequest({
      url: "center-client/sys/auth/phone/reg/codeValidate",
      data: {
        mobile,
        vcode,
      },
    });
    if (res) this.register(data);
  }
  async register(data) {
    let { mobile, sex = 1, username, password, vcode } = data;
    let md = new MobileDetect(window.navigator.userAgent);
    let mobiles = `${md.mobile()}-${md.userAgent()}-${md.os()}`;

    const { token } = await makeRequest({
      url: "/center-client/sys/auth/phone/reg/info",
      data: {
        mobile,
        model: mobiles,
        puid: "fake-puid",
        sex,
        nickname: username,
        password,
        vcode,
        agentId: sessionStorage.getItem("agentId") || null,
      },
    });
    // this.$emit('success', 0)
    authorization(token);
    window.location.href = "/";
  }
  async onSumbit(values) {
    this.codeValidate(values);
  }
  render() {
    const { t, i18n } = this.props;
    const lang = i18n.language;
    let { mode, showTimer, timer } = this.state;
    let IMG = require(`../../assets/images/login/${lang}/man2.png`);
    let BGIMG = require("../../assets/images/login/bgicon.png");
    const ValidDom = (
      <div
        className="volid-name"
        onClick={() => {
          this.checkRegiste();
        }}>
        {showTimer ? timer + "s" : t("personal_information_btn_send_vcode")}
      </div>
    );
    const IMGDOM = <img className="playerImg" alt="1" src={IMG} />;
    const BGDOM = <img className="bgImg" alt="1" src={BGIMG} />;
    return (
      <div className="login-dom">
        {BGDOM}
        <div className="gy_login--flex u_p--t50 ">{IMGDOM}</div>
        <div id="captcha" />
        <Form ref="forms" name="basic" initialValues={{ sex: 1 }} onFinish={(val) => this.onFinish(val)} autoComplete="off">
          <Radio.Group size="large" onChange={(e, value) => this.handleModeChange(e, value)} value={mode} style={{ marginBottom: 20 }}>
            <Radio.Button value="top">{t("btn_login")}</Radio.Button>
            <Radio.Button value="left">{t("btn_reg")}</Radio.Button>
          </Radio.Group>
          <div className="form-bpx">
            <Form.Item name="mobile" rules={[{ required: true, message: t("f_ui_please_enter_phone_number") }]}>
              <Input maxLength="10" prefix="*" size="large" addonAfter={ValidDom} placeholder={t("f_ui_please_enter_phone_number")} />
            </Form.Item>
            <Form.Item name="vcode" rules={[{ required: true, message: t("personal_information_phd_vcode") }]}>
              <Input size="large" prefix="*" placeholder={t("personal_information_phd_vcode")} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: t("f_ui_hint_login_pwd") }]}>
              <Input.Password prefix="*" size="large" placeholder={t("f_ui_hint_login_pwd")} />
            </Form.Item>
            <Form.Item
              name="repassword"
              rules={[
                { required: true, message: t("login__tipPwdBlankagn") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("register_confirm_password_verify")));
                  },
                }),
              ]}>
              <Input.Password prefix="*" size="large" placeholder={t("login__tipPwdBlankagn")} />
            </Form.Item>
            <Form.Item name="username" rules={[{ required: true, message: t("ui_hint_user_acc") }]}>
              <Input size="large" prefix="*" placeholder={t("ui_hint_user_acc")} />
            </Form.Item>
            <Form.Item name="sex">
              <Radio.Group>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" size="lang" htmlType="submit">
              {t("btn_reg")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default withTranslation()(Login);
