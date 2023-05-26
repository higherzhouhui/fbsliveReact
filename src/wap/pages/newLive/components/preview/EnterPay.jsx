import { Button, Space, Toast } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";
import { GetLiveRecharge } from "../../../../server/live";
import useContextReducer from "../../../../state/useContextReducer";
import { useLocation, useNavigate } from "react-router";
import { Local } from "../../../../../common";
const PointOut = React.lazy(() => import("../../../../components/pointOut/index"));
let preTime = 10; // 预览时间,10秒
// 3 * 60
let preTimeOver = 3 * 60; //预览过期时间，过期后才能再次预览
let timeType1 = 1 * 60; //计时付费过期时间
let timeType2 = 5 * 60; //记次付费过期时间

let times, roomPreviewEventTime;
const EnterPay = (props) => {
  const now = Date.parse(new Date()) / 1000;
  const history = useNavigate();
  const { state } = useLocation();
  const { needPaySet, displaysSet } = props;
  const {
    state: {
      assergoldData,
      live: {
        liveDetail: { liveListRoomBaseVO, liveId, liveListAnchorInfoVO },
      },
    },
    fetchUtils: { userGetUserAsserGold },
    dispatch,
  } = useContextReducer.useContextReducer();
  const { t } = useTranslation();
  const [showPay, showPaySet] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const onLoad = useCallback((base, liveIds) => {
    // console.log(liveIds, 'liveId');
    if (base.type == 2 || base.type == 1) {
      let preTime = Local("preTimeOver" + liveIds) ? 0 : 10; //能够预览的时间,单位秒
      console.log("preTime---", Local("preTimeOver" + liveIds), preTime);
      // window.eventBus.emit("displayDSet", preTime); //体育数据
      roomPreviewEventTime = setTimeout(() => {
        roomPreviewEvent(liveIds);
      }, preTime * 1000);
      // console.log('数据------------------------', state.hasPay, Local("payed" + liveIds), Local("preTimeOver" + liveIds));
      if (state.hasPay) return;
      if (Local("payed" + liveIds)) return;
      if (!Local("preTimeOver" + liveIds)) {
        // console.log('preTimeOver', Local("preTimeOver" + liveIds));
        Local("preTimeOver" + liveIds, now + preTime, preTimeOver);
        displaysSet(preTime);
      }
    }
  }, []);
  useEffect(() => {
    if (liveId != undefined) {
      onLoad(liveListRoomBaseVO, liveId);
    }
  }, [onLoad, liveId, liveListRoomBaseVO.type]);
  // 切换普通房判断
  useEffect(() => {
    window.eventBus.addListener("switchF", switchF);
    return () => {
      window.eventBus.removeListener("switchF", switchF);
    };
  }, []);
  const switchF = (e) => {
    localStorage.removeItem("payed" + liveId)
    localStorage.removeItem("preTimeOver" + liveId)
    if (e.type == 0) {
      //普通房
      clearTimeout(roomPreviewEventTime);

      showPaySet(false);
      needPaySet(false);
    }
    if (e.type == 1 || e.type == 2) {

      dispatch({
        type: "UPDATE_ANCHORCARDREQ",
        payload: {},
      });
      // replace 跳转当前页刷新路由
      history("/liveRoom", { state: { liveId: liveId }, replace: true });

    }
  };

  // return () => {
  //   clearTimeout(times)
  // }

  // 进入付费房
  const enterPayRoom = async () => {
    console.log("liveListRoomBaseVO.type", liveListRoomBaseVO.type);
    if (liveListRoomBaseVO.type == 0) {
      dispatch({
        type: "UPDATE_ANCHORCARDREQ",
        payload: {},
      });
      history("/liveRoom", { state: { liveId: liveId } });
      return;
    }

    if (liveListRoomBaseVO?.roomPrice > assergoldData?.goldCoin) {
      setVisible2(true);
      return;
    }

    const res = await GetLiveRecharge({ anchorId: liveListAnchorInfoVO.anchorId, liveId: liveId });
    if (!(res instanceof Error)) {
      if (res.code === 3001) {
        history('/live');
        Toast.show(res.msg);
      } else {
        if (liveListRoomBaseVO.type === 1) Local("payed" + liveId, true, timeType1);
        if (liveListRoomBaseVO.type === 2) Local("payed" + liveId, true, timeType2);
        showPaySet(false);
        needPaySet(false);
        // console.log("跳转7");

        userGetUserAsserGold();

        dispatch({
          type: "UPDATE_ANCHORCARDREQ",
          payload: {},
        });
        history("/liveRoom", { state: { ...state, hasPay: true, timeType1F: liveListRoomBaseVO.type === 1 ? { liveId: liveId, timeType1: timeType1, t: true } : undefined }, replace: true });
      }
    }
  };
  const roomPreviewEvent = async (liveIds) => {
    console.log("showPay------------------------", showPay);

    // console.log("state.hasPay", liveIds, state.hasPay, 'Local("payed" + liveId)', Local("payed" + liveIds), Local("preTimeOver" + liveIds));
    if (state.hasPay) return;
    if (Local("payed" + liveIds)) return;
    if (!Local("preTimeOver" + liveIds)) Local("preTimeOver" + liveIds, true, preTimeOver);
    showPaySet(true);
    needPaySet(true);
  };

  return (
    showPay && (
      <div className={style.passBody}>
        {/* <img src={liveListAnchorInfoVO?.avatar} className={style.passBg} alt="" /> */}
        <div className={style.passForm}>
          <Space direction="vertical" style={{ "--gap": "25px" }}>
            <div className={style.title}>{t("fu_fei_fj")}</div>
            {liveListRoomBaseVO.type == 1 && (
              <div className={style.tCenter}>
                {t("enterNeed")}
                <span className={style.red}>{liveListRoomBaseVO.roomPrice ? liveListRoomBaseVO.roomPrice : 0}</span>
                {t("goldPer")}
              </div>
            )}
            {liveListRoomBaseVO.type == 2 && (
              <div className={style.tCenter}>
                {t("fukuan")}
                <span className={style.red}>{liveListRoomBaseVO.roomPrice ? liveListRoomBaseVO.roomPrice : 0}</span>
                {t("showNeed")}
              </div>
            )}
            {liveListRoomBaseVO.type == 2 && <div className={style.tCenter_bottom}>Thoát ra 5 phút sau vào lại không thu phí</div>}
            <div className={style.btnGroup}>
              <Button block onClick={() => history('/live')} className={style.lbtn}>
                {t("cancel")}
              </Button>
              <Button block color="primary" onClick={() => enterPayRoom()} loading="auto" className={style.rbtn}>
                {t("enterRoom")}
              </Button>
            </div>
          </Space>
        </div>

        <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history("/recharge")} type={2} />
      </div>
    )
  );
};

export default EnterPay;
