import { Button, Input, Popup, NavBar, Toast } from "antd-mobile";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import { useCopy } from "../../../../utils/copy";
import { ProExchange, ProUser } from "../../../server/center";
import QRCode from "qrcode.react";
import useContextReducer from "../../../state/useContextReducer.js";
const PointOut = React.lazy("../../../components/pointOut/index.jsx");
export default function Friend() {
  const {
    state: { user, baseInfo },
  } = useContextReducer.useContextReducer();
  const history = useNavigate();
  const [detail, setDetail] = useState({
    allProfit: 0,
    shareCount: 0,
    balance: 0,
    bindRebate: 0,
    shareFee: 0,
    promotionTopupMin: 0,
    promotionWithdrawFee: 0,
    promotionWithdrawMin: 0,
  });

  const [pointOuts, pointOutsSet] = useState(false);

  const shareUrl = useMemo(() => {
    return `${baseInfo.shareUrl}?puid=${user.uid}`;
  });
  const copy = useCopy();
  const [showTrans, setShowTrans] = useState(false);
  const [money, setMoney] = useState("");

  const { t } = useTranslation();

  const init = useCallback(async () => {
    const res = await ProUser();
    if (!(res instanceof Error)) {
      setDetail(res);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const saveCodeImg = () => {
    let a = document.createElement("a");
    let event = new MouseEvent("click");
    a.download = "code";
    a.href = document.getElementById("vcodeCanvas").toDataURL("image/png");
    a.dispatchEvent(event);
  };

  const onSubmit = async () => {
    const res = await ProExchange({ amount: money });
    if (!(res instanceof Error)) {
      Toast.show(t("sys_check_pass"));
      setMoney("");
    }
  };
  return (
    <div className={style["body"]}>
      <NavBar back={null} left={<img src={require("../../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px", filter: "contrast(200%) invert(200%)" }} onClick={() => history(-1)} />} onBack={() => history(-1)} className={style.Title} style={{ background: "none" }}>
        <div style={{ fontSize: "18px", fontWeight: "500" }}>{t("ui_recommended_back")}</div>
      </NavBar>
      <div className={style["vcode"]}>
        <div className={style["title"]}>{t("ui_wap_text_024")}</div>
        <div className={style["vcode-img"]}>
          <QRCode value={shareUrl} id="vcodeCanvas" />
        </div>
        <Button className={style["vcode-btn"]} round hairline color="primary" onClick={() => saveCodeImg()}>
          {" "}
          {t("rebate10")}
        </Button>
      </div>
      <div className={style["yaoqing"]}>
        <div className={style["title"]}>{t("ui_wap_text_023")}</div>
        <span
          className={style.record}
          onClick={() => {
            history("/friendList2");
          }}>
          {t("rebate9")}
        </span>
        <input type="text" value={shareUrl} className={style.input} readOnly />
        <Button className={style["vcode-btn"]} round hairline color="primary" onClick={() => copy(shareUrl)}>
          {t("ui_copy_link")}
        </Button>
      </div>
      <div className={style["center"]}>
        <div className={style["title"]}>{t("tixian_data")}</div>
        <span
          className={style["jump"]}
          onClick={() => {
            history("/friendList1");
          }}>
          {t("rebate14")}
        </span>
        <div className={style.content}>
          <div>
            <dt>{detail.allProfit}</dt>
            <dd>{t("rebate6")}</dd>
            <Button hairline color="primary" className={style["center-btn"]} onClick={() => setShowTrans(true)}>
              {t("rebate7")}
            </Button>
          </div>
          <div>
            <dt>{detail.shareCount}</dt>
            <dd>{t("rebate8")}</dd>
            <Button
              hairline
              color="primary"
              className={style["center-btn"]}
              onClick={() => {
                if (user?.phone == null || user?.phone == undefined) {
                  pointOutsSet(true);
                } else {
                  history("/deposit");
                }
              }}>
              {t("ui_withdraw")}
            </Button>
          </div>
        </div>
      </div>
      <Popup
        visible={showTrans}
        showCloseButton
        onClose={() => {
          setShowTrans(false);
        }}
        onMaskClick={() => setShowTrans(false)}>
        <div className={style.friendBody}>
          <div className={style.titleModal}>{t("rebate7")}</div>
          <div className={style.money}>
            <Input value={money} placeholder="0" onChange={setMoney} type="number" className={style.input} />
            <span
              className={style.balance}
              onClick={() => {
                setMoney(detail.balance);
              }}>
              {t("rebate13")}
            </span>
          </div>
          <div className={style.notice}>
            {t("rebate12")}:{detail.balance}
          </div>
          <div>
            <Button block color="primary" loading="auto" className={style.submit} onClick={() => onSubmit()} disabled={!money}>
              {t("btn_submit")}
            </Button>
          </div>
        </div>
      </Popup>
      {/* 提示 */}
      <PointOut
        visible={pointOuts}
        type={4}
        visibleSet={() => pointOutsSet(false)}
        but2={() => {
          history("/bindingPhone", { state: { i: 2 } });
        }}
      />
    </div>
  );
}
