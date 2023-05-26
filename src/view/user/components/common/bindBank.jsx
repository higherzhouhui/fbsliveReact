import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import { userBankList, bank } from "../../../../api/userInfo";
import { Local } from "../../../../common";
const { Option } = Select;
import useContextReducer from "../../../../state/useContextReducer.js";
import Verify from "../../../../components/verify";
import "./bindBank.scss";
export default (props) => {
  let { hideBindBank } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const {
    state: { user: userInfo },
  } = useContextReducer.useContextReducer();
  const [loading, setLoading] = useState(false);
  const [bankList, setBankList] = useState([]);
  const getUserBankList = async () => {
    const rt = await userBankList();
    if (!(rt instanceof Error)) {
      setBankList(rt || []);
    }
  };
  const ValidDom = <Verify phone={userInfo.phone} type={5} noBtn={true} sendType="2"></Verify>;
  const onFinish = async (data) => {
    let info = {};
    bankList.some((item) => {
      if (item.id == data.bankId) return (info = item);
    });
    let sendData = {
      bankCity: "unknow",
      bankProvince: "unknow",
      bankSub: "unknow",
    };
    setLoading(true);
    const rt = await bank(Object.assign({}, data, info, sendData));
    if (!(rt instanceof Error)) {
      setLoading(false);
      if (rt) message.success(t("ui_success"));
      hideBindBank();
    }
  };
  const onHideBind = () => {
    form.resetFields();
    hideBindBank();
  };
  useEffect(() => {
    getUserBankList();
  }, []);

  return (
    <div className="container-bind">
      <div className="header">
        <span onClick={() => onHideBind()} className="icon icon-back"></span>
        <span className="title">{t("user_withdraw_addbank")}</span>
      </div>
      <div style={{ marginTop: 25 }}>
        <div id="captcha2"></div>
        <Form form={form} name="basic" initialValues={{ mobile: userInfo.phone || Local("userInfo2")?.phone }} autoComplete="off" labelWrap onFinish={(val) => onFinish(val)}>
          <Form.Item className="mb0" label={t("ui_bank_card")} rules={[{ required: true, message: t("personal_information_phd_bk_num") }]} name="cardNo">
            <Input placeholder={t("personal_information_phd_bk_num")} />
          </Form.Item>
          <Form.Item className="mb0" label={t(" ")}>
            <div className="tips">{t("user_withdraw_tips1")}</div>
          </Form.Item>
          <Form.Item className="mb15" label={t("personal_information_lb_select_bank")} rules={[{ required: true, message: t("personal_information_phd_select_bank") }]} name="bankId">
            <Select style={{ textAlign: "left" }} placeholder={t("personal_information_phd_select_bank")}>
              {bankList.length > 0 &&
                bankList.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.bankName}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb0" rules={[{ required: true, message: t("personal_information_phd_real_name") }]} label={t("personal_information_lb_real_name")} name="trueName">
            <Input placeholder={t("personal_information_phd_real_name")} />
          </Form.Item>
          <Form.Item className="mb0" label={t(" ")}>
            <div className="tips">{t("user_withdraw_tips2")}</div>
          </Form.Item>
          <Form.Item className="mb15" rules={[{ required: true, message: t("personal_information_phd_phone") }]} label={t("personal_information_lb_phone")} name="mobile">
            <Input addonAfter={ValidDom} disabled={true} placeholder={t("personal_information_phd_phone")} />
          </Form.Item>
          <Form.Item className="mb15" rules={[{ required: true, message: t("personal_information_phd_vcode") }]} label={t("personal_information_lb_vcode")} name="phoneCode">
            <Input placeholder={t("personal_information_phd_vcode")} />
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
