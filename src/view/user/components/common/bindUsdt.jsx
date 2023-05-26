import React, { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import { bindUsdt } from "../../../../api/userInfo";
import { Local } from "../../../../common";
import useContextReducer from "../../../../state/useContextReducer.js";
import Verify from "../../../../components/verify";
import "./bindUsdt.scss";
export default (props) => {
  let { hideBindUsdt } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const {
    state: { user: userInfo },
  } = useContextReducer.useContextReducer();
  const [loading, setLoading] = useState(false);
  const ValidDom = <Verify phone={userInfo.phone} type={5} noBtn={true} sendType="2"></Verify>;
  const onFinish = async (data) => {
    let params = {
      bankName: "trc20",
      cardNo: data.cardNo,
      cashPassword: data.cashPassword,
      phoneCode: data.phoneCode,
      mobile: userInfo.phone,
    };
    setLoading(true);
    const rt = await bindUsdt(params);
    if (!(rt instanceof Error)) {
      setLoading(false);
      if (rt) {
        hideBindUsdt();
        message.success(t("ui_success"));
      }
    }
  };
  const onHideBind = () => {
    form.resetFields();
    hideBindUsdt();
  };
  return (
    <div className="container-bind">
      <div className="header">
        <span onClick={() => onHideBind()} className="icon icon-back"></span>
        <span className="title">{t("user_withdraw_addusdt")}</span>
      </div>
      <div style={{ marginTop: 25 }}>
        <Form form={form} name="basic" initialValues={{ mobile: userInfo.phone || Local("userInfo2")?.phone }} autoComplete="off" labelWrap onFinish={(val) => onFinish(val)}>
          <Form.Item className="mb15" rules={[{ required: true, message: t("personal_information_phd_phone") }]} label={t("personal_information_lb_phone")} name="mobile">
            <Input addonAfter={ValidDom} disabled={true} placeholder={t("personal_information_phd_phone")} />
          </Form.Item>
          <Form.Item className="mb15" rules={[{ required: true, message: t("personal_information_phd_vcode") }]} label={t("personal_information_lb_vcode")} name="phoneCode">
            <Input placeholder={t("personal_information_phd_vcode")} />
          </Form.Item>
          <Form.Item className="mb15" label={t("user_withdraw_usdtAddress")} rules={[{ required: true, message: t("user_withdraw_pusdtAddress") }]} name="cardNo">
            <Input placeholder={t("user_withdraw_pusdtAddress")} />
          </Form.Item>
          <Form.Item className="mb15" rules={[{ required: true, message: t("personal_information_phd_withdrawal_password") }]} label={t("personal_information_lb_withdrawal_password")} name="cashPassword">
            <Input.Password style={{ borderRadius: "5px" }} placeholder={t("personal_information_phd_withdrawal_password")} />
          </Form.Item>
          <Form.Item label=" ">
            <div style={{ textAlign: "left" }}>
              <Button loading={loading} htmlType="submit" type="primary" style={{ width: 108 }} className="btn-submit">
                {t("f_btn_submit")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
