import React, { useState, useEffect } from "react";
import style from "./style.module.scss";
import { useLocation, useNavigate } from "react-router";
import { Button, Input, Space } from "antd-mobile";
import { useTranslation } from "react-i18next";
import useContextReducer from "../../../../state/useContextReducer";
import { Local } from "../../../../../common";

//密码房输入框
const EnterPass = () => {
  const { state } = useLocation();
  const {
    state: {
      live: { liveDetail },
    },
    dispatch
  } = useContextReducer.useContextReducer();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [passError, passErrorSet] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    if (Local('userInfo')?.manage == 1) {
      dispatch({
        type: "UPDATE_ANCHORCARDREQ",
        payload: {},
      });
      history("/liveRoom", { state: { ...state, password: liveDetail?.liveListRoomBaseVO?.roomPwd }, replace: true });
    }
  }, []);

  return (
    <div className={style.passBody}>
      {/* <img src={liveDetail?.liveListAnchorInfoVO?.avatar} className={style.passBg} alt="" /> */}
      <div className={style.passForm}>
        <Space direction="vertical" style={{ "--gap": "20px" }}>
          <div className={style.title}>{t("fang_jian_mm")}</div>
          <Input type="text" placeholder={t("tip_pwd_blank")} onChange={setPassword} className={`${style.passInput} ${passError ? style.passError : ""}`} />
          <div className={style.btnGroup}>
            <Button block onClick={() => history('/live')} className={style.lbtn}>
              {t("cancel")}
            </Button>
            <Button
              block
              color="primary"
              onClick={() => {
                if (password == liveDetail.liveListRoomBaseVO.roomPwd) {
                  console.log("跳转6");
                  dispatch({
                    type: "UPDATE_ANCHORCARDREQ",
                    payload: {},
                  });
                  history("/liveRoom", { state: { ...state, password }, replace: true });
                } else passErrorSet(true);
              }}
              loading="auto"
              className={style.rbtn}>
              {t("enterRoom")}
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default EnterPass;
