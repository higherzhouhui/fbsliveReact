import React from "react";
import style from "./style/switchRoom.module.scss";
import { useTranslation } from "react-i18next";
import useContextReducer from "../../../state/useContextReducer";
import chat from "../../../../utils/Chat";
import { useNavigate } from "react-router";

const SwitchRoom = (props) => {
  const { Im } = props;
  const { t } = useTranslation();
  const {
    state: {
      live: {
        liveData,
        liveDetail: { liveListRoomBaseVO, liveId },
        verticalScreen,
      },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const history = useNavigate();

  //切换直播间
  const handleSwitch = () => {
    if (liveListRoomBaseVO.isAutoLive == 1) {
      let index = liveData.listDataVos.findIndex((v) => v.liveId === liveListRoomBaseVO.liveId);
      let next = (index + 1) % liveData.listDataVos.length;
      let nextData = liveData.listDataVos[next];
      dispatch({
        type: "UPDATE_ANCHORCARDREQ",
        payload: {},
      });
      dispatch({ type: "live/EventInitState" });
      dispatch({ type: "live/SetLiveDetail", payload: nextData });
      // setTimeout(() => {
      //   history("/liveRoom", { state: { liveId: nextData.liveId }, replace: true });
      // }, 400);
      history("/liveRoom", { state: { liveId: nextData.liveId }, replace: true });
      return
    }
    Im.leaveRoom(liveId).then((e) => {
      let index = liveData.listDataVos.findIndex((v) => v.liveId === liveListRoomBaseVO.liveId);
      let next = (index + 1) % liveData.listDataVos.length;
      let nextData = liveData.listDataVos[next];
      dispatch({
        type: "UPDATE_ANCHORCARDREQ",
        payload: {},
      });
      dispatch({ type: "live/EventInitState" });
      dispatch({ type: "live/SetLiveDetail", payload: nextData });
      // setTimeout(() => {
      //   history("/liveRoom", { state: { liveId: nextData.liveId }, replace: true });
      // }, 400);
      history("/liveRoom", { state: { liveId: nextData.liveId }, replace: true })
    });
  };
  return (
    <div className={`${verticalScreen.verticalScreens ? style.box : style.box_h} ${liveData.listDataVos.length < 2 ? style.hide : ""}`} onClick={() => handleSwitch()}>
      <img src={require("../../../assets/image/live/switchRoom.png")} alt="" />
      <div className={style.text}>{t("switchRoom")}</div>
    </div>
  );
};

export default SwitchRoom;
