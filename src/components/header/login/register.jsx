import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Button, Form, Input, Select, message, Spin } from "antd";
import { makeRequest } from "../../../utils/httpHelper";
import { authorization } from "../../../utils/tools";
import "./index.scss";

class RegisterIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "left",
      timer: 60,
      showTimer: false,
      loading: false,
      showTimerLoading: false,
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
    console.log(keyMap[lang]);
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
          this.setState({
            showTimerLoading: false,
          });
          instance.popUp();
        },
        (err) => {
          console.error(err);
        }
      );
    });
  }
  async checkRegiste() {
    if (this.state.showTimer == false) {
      this.setState({ showTimerLoading: true });
    }
    const { t } = this.props;
    if (this.state.showTimer) return;
    if (!this.refs.forms.getFieldsValue().mobile) {
      this.setState(
        {
          showTimerLoading: false,
        },
        () => {
          message.error({
            content: `${t("ui_input_mobile")}`,
            duration: 0.5,
          });
        }
      );
      return;
    }
    if (!/^0\d{9}$/.test(this.refs.forms.getFieldsValue().mobile)) {
      this.setState(
        {
          showTimerLoading: false,
        },
        () => {
          message.error({
            content: `${t("sysmsg_please_input_correct_mobile")}`,
            duration: 0.5,
          });
        }
      );
      return;
    }
    const da = await makeRequest({
      url: "/center-client/sys/user/phone/isRegiste",
      data: {
        mobile: this.refs.forms.getFieldsValue().mobile,
      },
    });
    if (!da) return;
    if (da === "1") {
      this.setState(
        {
          showTimerLoading: false,
        },
        () => {
          message.error(t("mobile_number_already_exists"));
        }
      );
      throw new Error("mobile number already exists");
    }
    this.sendVcodeCaptcha = await makeRequest({
      url: "/center-client/sys/user/captcha",
    });
    this.initCaptch();
  }

  sendVcodeStartCnt() {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.setState(
        {
          showTimerLoading: false,
          showTimer: true,
          timer: this.state.timer - 1,
        },
        () => {
          if (this.state.timer > 0) {
            this.sendVcodeStartCnt();
          } else {
            this.clearTimer();
            this.setState({
              showTimerLoading: false,
              timer: 60,
              showTimer: false,
            });
          }
        }
      );
    }, 1000);
  }
  handleModeChange() {
    this.props.onTypeChange(1);
  }
  async codeValidate(data) {
    let { mobile, vcode } = data;
    const res = await makeRequest({
      url: "/center-client/sys/auth/phone/reg/codeValidate",
      data: {
        mobile,
        vcode,
      },
    });
    // 添加判断是否通过验证
    if (res == 1) {
      this.register(data);
    }
  }
  register(data) {
    let { loading } = this.state;
    if (loading) return;
    let { mobile, sex = 1, username, password, vcode, agentId } = data;
    // let agentId = sessionStorage.getItem('agentId')
    let md = new MobileDetect(window.navigator.userAgent);
    let mobiles = `${md.mobile()}-${md.userAgent()}-${md.os()}`;

    this.setState({ loading: true });
    makeRequest({
      url: "/center-client/sys/auth/phone/reg/info",
      data: {
        mobile,
        model: mobiles,
        puid: "fake-puid",
        sex,
        nickname: username,
        password,
        vcode,
        agentId: (agentId !== null && agentId?.length) > 0 ? agentId : null,
      },
    })
      .then((rt) => {
        this.setState({ loading: false });
        if (rt && rt.token) {
          let { FreshUser, onOk } = this.props;
          authorization(rt.token);
          FreshUser();
          onOk();
          // window.eventBus.emit("loginSuc");
          window.eventBus.emit("store", { type: "handleLogin" });
          message.success({
            content: `${t("ui_registered")}${t("ui_success")}`,
            duration: 0.5,
          });
          // window.location.href = '/'
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }
  async onSumbit(values) {
    this.codeValidate(values);
  }
  // changeEvent=(e)=>{
  //     let value = e.target.value.replace(/[^\d]/, '')
  //     // this.setState({ checkCode: value })
  // }
  render() {
    const { t, i18n, onCheck } = this.props;
    const lang = i18n.language;
    let { showTimer, timer, loading, showTimerLoading } = this.state;
    const ValidDom = (
      <div
        className="volid-name"
        onClick={() => {
          this.checkRegiste();
        }}>
        {this.state.showTimerLoading ? <Spin /> : showTimer ? timer + "s" : t("ui_send_verification")}
      </div>
    );
    return (
      <div className="header-register">
        <div id="captcha" />
        <Form ref="forms" name="basic" initialValues={{ sex: 1, agentId: JSON.parse(sessionStorage.getItem("agentId")) }} onFinish={(val) => this.onFinish(val)} autoComplete="off">
          <div className="scroll-box">
            <Form.Item name="username" rules={[{ required: true, message: t("ui_hint_user_acc") }]}>
              <Input prefix="*" placeholder={t("ui_hint_user_acc")} />
            </Form.Item>
            <Form.Item
              name="mobile"
              rules={[
                {
                  required: true,
                  message: t("f_ui_please_enter_phone_number"),
                },
              ]}>
              <Input className="mobile-input" maxLength="10" prefix="*" addonAfter={ValidDom} placeholder={t("f_ui_please_enter_phone_number")} />
            </Form.Item>
            <Form.Item
              name="vcode"
              rules={[
                {
                  required: true,
                  message: t("personal_information_phd_vcode"),
                },
              ]}>
              <Input maxLength={4} prefix="*" placeholder={t("personal_information_phd_vcode")} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: t("f_ui_hint_login_pwd") }]}>
              <Input.Password prefix="*" placeholder={t("f_ui_hint_login_pwd")} />
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
              <Input.Password prefix="*" placeholder={t("login__tipPwdBlankagn")} />
            </Form.Item>

            {/* <Form.Item name="sex">
                        <Select size='large'>
                            <Select.Option value={1}>{t('personal_information_val_man')}</Select.Option>
                            <Select.Option value={2}>{t('personal_information_val_woman')}</Select.Option>
                        </Select>
                    </Form.Item> */}
          </div>

          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <Button type="primary" className={"a " + (loading && "loading")} style={{ width: "100%" }} htmlType="submit">
              {t("btn_reg")}
            </Button>
          </Form.Item>
        </Form>
        <div className="n-text" onClick={onCheck}>
          {t("btn_login")}
        </div>
      </div>
    );
  }
}
export default withTranslation()(RegisterIndex);
