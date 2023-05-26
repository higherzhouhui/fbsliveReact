import React, { useState, useEffect, useCallback } from "react";
import { Button, Select, Form, message, Input, Tabs } from "antd";
import { info } from "../../../api/base";
import { useTranslation } from "react-i18next";
import { bankSelected, usdtListInfo } from "../../../api/userInfo";
const { Option } = Select;
const { TabPane } = Tabs;
import useContextReducer from "../../../state/useContextReducer.js";
import BindBank from "./common/bindBank";
import BindUsdt from "./common/bindUsdt";
import "./info.scss";
export default () => {
  const { t } = useTranslation();
  const {
    state: { user: userInfo },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { freshUser } = fetchUtils;
  const [loading, setLoading] = useState(false);
  const [bankAndUsdtLoading, setBankAndUsdtLoading] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [usdtList, setUsdtList] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [level, setLevel] = useState(0); //0低，1中，2高
  const tabList = [
    { id: 0, name: t("user_info_bank") },
    { id: 1, name: t("user_info_usdt") },
  ];
  const [bankShow, setBankShow] = useState(false);
  const [usdtShow, setUsdtShow] = useState(false);
  // 修改个人信息
  const onFinish = async (data) => {
    try {
      let params = {
        sex: data.sex,
        signature: data.signature,
      };
      if (userInfo.nickname != data.nickname) params.nickname = data.nickname;
      setLoading(true);
      const rt = await info(params);
      if (!(rt instanceof Error)) {
        setLoading(false);
        if (rt) {
          message.success(`${t("btn_save")}${t("ui_success")}`);
          freshUser();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const init = useCallback(() => {
    try {
      setBankAndUsdtLoading(true);
      Promise.all([bankSelected(), usdtListInfo()]).then((rt) => {
        if (!(rt instanceof Error)) {
          let bankData = rt[0];
          let usdtData = rt[1];
          setBankList(bankData.cardNo ? [bankData] : []);
          setUsdtList(usdtData);
          setBankAndUsdtLoading(false);
          getLevel(bankData.cardNo ? [bankData] : [], usdtData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  const getLevel = (bankData, usdtData) => {
    let tempLevel = 1;

    if (userInfo.sex || userInfo.signature || userInfo.nickname) {
      tempLevel = tempLevel + 1;
    }
    if (bankData.length > 0) {
      tempLevel = tempLevel + 1;
    }
    if (usdtData.length > 0) {
      tempLevel = tempLevel + 1;
    }
    setLevel(tempLevel);
  };
  const onChangeTab = (index) => {
    setTabIndex(index);
  };
  const hideBindBank = () => {
    setBankShow(false);
    init();
  };
  const hideBindUsdt = () => {
    setUsdtShow(false);
    init();
  };
  useEffect(() => {
    init();
  }, [init]);
  return (
    <div className="container-info">
      <div className="user-box-top">
        <div className="min-title">{t("user_info_grzl")}</div>
        <div className="user-box-top-detail">
          <div className="level-desc">
            {t("user_info_leveltips")}：<i className={`level${level}`}>{level == 1 ? t("user_info_level1") : level == 2 ? t("user_info_level2") : level == 3 ? t("user_info_level2") : level == 4 ? t("user_info_level3") : "-"}</i>
          </div>
          <div className="desc">{t("user_info_tips")}</div>
          <div className="content">
            <div className="item">
              <span className="icon icon-jb-01"></span>
              <span className="title">{t("user_info_phone")}</span>
            </div>
            <div className="item">
              <span className={`icon ${userInfo.sex || userInfo.signature || userInfo.nickname ? "icon-jb-02-active" : "icon-jb-02"}`}></span>
              <span className="title">{t("user_info_injbzl")}</span>
            </div>
            <div className="item">
              <span className={`icon ${bankList.length > 0 ? "icon-jb-03-active" : "icon-jb-03"}`}></span>
              <span className="title">{t("user_withdraw_addbank")}</span>
            </div>
            <div className="item">
              <span className={`icon ${usdtList.length > 0 ? "icon-jb-04-active" : "icon-jb-04"}`}></span>
              <span className="title">{t("user_withdraw_addusdt")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="user-box-bottom">
        <div className="left">
          <div className="min-title">{t("user_info_jbzl")}</div>
          <div>
            {userInfo && (
              <Form onFinish={(val) => onFinish(val)} initialValues={{ remember: true, sex: userInfo.sex < 1 ? 1 : userInfo.sex, signature: userInfo.signature, nickname: userInfo.nickname }} autoComplete="off" className={loading && "loading"}>
                <Form.Item label="ID">
                  <Input className="item" disabled={true} type="text" value={userInfo.uid} />
                </Form.Item>
                <Form.Item label={t("f_rp_nickname")} name="nickname">
                  <Input className="item" type="text" value={userInfo.nickname} />
                </Form.Item>
                <Form.Item label={t("personal_information_lb_sex")} name="sex">
                  <Select className="item" style={{ textAlign: "left" }}>
                    <Option value={1}>{t("personal_information_val_man")}</Option>
                    <Option value={2}>{t("personal_information_val_woman")}</Option>
                  </Select>
                </Form.Item>
                <Form.Item label={t("user_info_gxqm")} name="signature">
                  <Input.TextArea showCount maxLength={30} className="item" type="text" value={userInfo.signature} />
                </Form.Item>
                <Form.Item label=" ">
                  <div style={{ textAlign: "left" }}>
                    <Button loading={loading} htmlType="submit" type="primary" className="user-detail-box-btn">
                      {t("recharge_now")}
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
        <div className="right">
          <Tabs activeKey={String(tabIndex)} onChange={(data) => onChangeTab(data)}>
            {tabList.map((item) => (
              <TabPane key={item.id} tab={item.name} />
            ))}
          </Tabs>
          <div className={`bind-content ${bankAndUsdtLoading && "loading"}`}>
            {tabIndex == 0 && (
              <>
                {bankList.map((item, index) => {
                  return (
                    <div key={index} className="bankInfo">
                      {/* item.logs ||  */}
                      <img src={require("../../../assets/images/userInfo/icon-bank.png")} className="logs" />
                      <div className="info">
                        <dt>{item.bankName}</dt>
                        <dd>{item.cardNo}</dd>
                      </div>
                    </div>
                  );
                })}
                {bankList.length == 0 && (
                  <div className="tips">
                    {t("user_info_nobindbank")} <span onClick={() => setBankShow(true)}>{t("user_info_add")}</span>
                  </div>
                )}
                {/* <div className="bankInfo" onClick={() => setBankShow(true)}>
                            <div className='logs icon-add2'></div>
                            <div className='info'>
                                <dt>添加银行卡</dt>
                            </div>
                        </div> */}
              </>
            )}
            {/* item.logs || */}
            {tabIndex == 1 && (
              <>
                {usdtList.map((item, index) => {
                  return (
                    <div key={index} className="bankInfo">
                      <img src={require("../../../assets/images/userInfo/icon-usdt.png")} className="logs" />
                      <div className="info">
                        <dt>{item.bankName}</dt>
                        <dd>{item.cardNo}</dd>
                      </div>
                    </div>
                  );
                })}
                {usdtList.length == 0 && (
                  <div className="tips">
                    {t("user_info_nobindusdt")} <span onClick={() => setUsdtShow(true)}>{t("user_info_add")}</span>
                  </div>
                )}
                {/* <div className="bankInfo" onClick={() => setUsdtShow(true)}>
                            <div className='logs icon-add2'></div>
                            <div className='info'>
                                <dt>添加虚拟账户</dt>
                            </div>
                        </div> */}
              </>
            )}
          </div>
        </div>
      </div>
      <div className={`drawer-body ${bankShow ? "show" : "hide"}`}>
        <BindBank hideBindBank={() => hideBindBank()} />
      </div>
      <div className={`drawer-body ${usdtShow ? "show" : "hide"}`}>
        <BindUsdt hideBindUsdt={() => hideBindUsdt()} />
      </div>
    </div>
  );
};
