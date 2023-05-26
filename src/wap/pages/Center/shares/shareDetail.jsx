import { NavBar, Avatar, Empty } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import { incomeDetail } from "../../../server/center";
const Shares = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  const [incomeDetailD, incomeDetailDSet] = useState([]);
  const [pages, pagesSet] = useState(0);
  const init = useCallback(async () => {
    const res = await incomeDetail({ page: pages });
    if (!(res instanceof Error)) {
      // setHasMore(res.length > 0)
      incomeDetailDSet(res);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className={style.Popup_body}>
      <NavBar back={null} left={<img src={require("../../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px" }} onClick={() => history(-1)} />} className={style.wbg}>
        <div style={{ fontSize: "18px", fontWeight: "500", color: "rgb(30, 27, 39)" }}>{t("shouyijilu")}</div>
      </NavBar>
      {/* 内容 */}
      <div className={style.Popup_content}>
        <div className={style.centers}>
          <div className={style.top}>
            <div className={style.aliten}>{t("yonghu")}</div>
            <div>
              {/* {t("dashangshouyi")} */}

              {t("dashang")}

            </div>
            <div>
              {/* {t("fanshuishouyi")} */}

              {t("caipiao")}

            </div>
          </div>
          {/* 内容 */}
          <div className={style.contentS}>
            {incomeDetailD.length > 0 ? (
              incomeDetailD.map((value, index) => {
                return (
                  <div className={style.content} key={index}>
                    <div className={style.aliten} style={{ display: "flex", alignItems: "center" }}>
                      <Avatar src={value?.avatar} style={{ "--size": "29px", borderRadius: "100%" }} />
                      <div>{value?.nickname}</div>
                    </div>
                    <div>{value?.giftIncome}</div>
                    <div>{value?.lotteryIncome}</div>
                    <div className={style.borderBottom}></div>
                  </div>
                );
              })
            ) : (
              <Empty className={style.Empty} image={<img className={style.Empty_img} src={require("../../../assets/image/center/xgjlnull.png")} />} description={t("noData")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shares;
