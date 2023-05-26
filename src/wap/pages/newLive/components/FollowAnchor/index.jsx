import React from "react";
import style from "./index.module.scss";
import { Avatar } from "antd-mobile";
import { useTranslation } from "react-i18next";
import useContextReducer from "../../../../state/useContextReducer";

const Index = () => {
  const { t } = useTranslation();
  const {
    state: {
      user,
      live: {
        liveDetail: { liveListAnchorInfoVO, liveListRoomBaseVO },
      },
    },
    fetchUtils: { liveFollow },
  } = useContextReducer.useContextReducer();

  return (
    <>
      <div className={style.follow}>
        <Avatar src={liveListAnchorInfoVO.avatar || require("../../../../assets/image/login/logoz.png")} style={{ "--size": "32px", borderRadius: "100%" }} />
        <div className={style.content}>
          <p>{liveListRoomBaseVO.avatar}</p>
          <div>{t("kuailaiguanzhuwoba")}</div>
        </div>
        <div className={style.but} onClick={() => liveFollow({ isFollow: liveListAnchorInfoVO.follow, uid: liveListRoomBaseVO.anchorId, type: "anchor", fid: user.uid })}>
          {liveListAnchorInfoVO.follow ? t("yiguanzhu") : `+${t("guanzhu")}`}
        </div>
      </div>
    </>
  );
};

export default Index;
