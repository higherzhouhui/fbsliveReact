import { Space, Toast } from "antd-mobile";
import { Button } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./style/style.module.scss";
import { useTranslation } from "react-i18next";
import { GetLiveRecharge } from "../../../api/live";
import useContextReducer from "../../../state/useContextReducer";
import { useLocation, useNavigate } from "react-router";
import { Local } from "../../../common";
import PointOut from '../../../components/pointOut/index'
// const PointOut = React.lazy(() => import("../../../../components/pointOut/index"));
let preTime = 10; // 预览时间,10秒
// 3 * 60
let preTimeOver = 3 * 60; //预览过期时间，过期后才能再次预览
let timeType1 = 1 * 60; //计时付费过期时间
let timeType2 = 5 * 60; //记次付费过期时间


let times, roomPreviewEventTime, timeout
const EnterPay = (props) => {
    const now = Date.parse(new Date()) / 1000;
    const history = useNavigate();
    const { state } = useLocation();
    const { needPaySet, displaySetF } = props;
    const [displays, displaysSet] = useState(0)
    const [display, displaySet] = useState(false)
    const timesDRef = useRef('')
    const [timesD, timesDSet] = useState('')
    const {
        state: {
            live: {
                liveDetail: { liveListRoomBaseVO, liveId, liveListAnchorInfoVO },
            },
        },
        fetchUtils: { freshUser },
    } = useContextReducer.useContextReducer();
    const { t } = useTranslation();
    const [showPay, showPaySet] = useState(false);
    const [visible2, setVisible2] = useState(false)
    const onLoad = useCallback((base, liveIds) => {
        // console.log(liveIds, 'liveId');
        if (base.type == 2 || base.type == 1) {
            let preTime = Local("preTimeOver" + liveIds) ? 0 : 10; //能够预览的时间,单位秒

            // console.log("preTime---", preTime);
            // window.eventBus.emit("displayDSet", preTime); //体育数据
            roomPreviewEventTime = setTimeout(() => {
                roomPreviewEvent(liveIds);
            }, preTime * 1000);
            // console.log('数据------------------------', state.hasPay, Local("payed" + liveIds), Local("preTimeOver" + liveIds));
            if (state?.hasPay) return;
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
            // console.log("liveId", liveId, Local("preTimeOver" + liveId));
            onLoad(liveListRoomBaseVO, liveId);
        }
    }, [onLoad, liveId, liveListRoomBaseVO.type]);

    // 切换普通房判断
    useEffect(() => {
        window.eventBus.addListener("switchF", switchF);
        return () => {
            window.eventBus.removeListener("switchF", switchF);
        }
    }, [])
    const switchF = (e) => {
        if (e.type == 0) { //普通房
            displaySetF(false)
            displaySet(false);
            showPaySet(false)
            needPaySet(false);

            clearTimeout(roomPreviewEventTime)
            clearTimeout(timeout);
        }
    }

    // 进入付费房
    const enterPayRoom = async () => {
        if (liveListRoomBaseVO?.roomPrice > Local("userInfo2")?.goldCoin) {
            setVisible2(true)
            return
        }
        const res = await GetLiveRecharge({ anchorId: liveListAnchorInfoVO.anchorId, liveId: liveId });
        if (!(res instanceof Error)) {
            if (res.code === 3001) {
                history('/live/list');
                Toast.show(res.msg);
            } else {
                if (liveListRoomBaseVO.type === 1) Local("payed" + liveId, true, timeType1);
                if (liveListRoomBaseVO.type === 2) Local("payed" + liveId, true, timeType2);
                showPaySet(false);
                needPaySet(false);

                displaySetF(false)
                displaySet(false);
                clearTimeout(timeout);

                freshUser()

                let url = `/live/detail?hasPay=${true}&timeType1F=${liveListRoomBaseVO.type == 1 ? { liveId: liveId, timeType1: timeType1, t: true } : undefined}}&replace=${true}&avatar=${liveListAnchorInfoVO.avatar}&liveId=${liveId}&anchorId=${liveListAnchorInfoVO.anchorId}&type=${liveListRoomBaseVO.type}&manage=${Local('userInfo2')?.manage}&price=${liveListRoomBaseVO.roomPrice}&isAd=${liveListRoomBaseVO.isAd}&pking=${liveListRoomBaseVO.pking}&flvUrl=${liveListRoomBaseVO.flvUrl}&adJumpUrl=${liveListRoomBaseVO.adJumpUrl}&webRtcUrl=${liveListRoomBaseVO.webRtcUrl}&isAutoLive=${liveListRoomBaseVO.isAutoLive}&loopVideoUrl=${liveListRoomBaseVO.loopVideoUrl}`
                history(url, { state: { ...state, hasPay: true, timeType1F: liveListRoomBaseVO.type === 1 ? { liveId: liveId, timeType1: timeType1, t: true } : undefined }, replace: true })

                // dispatch({
                //     type: "UPDATE_ANCHORCARDREQ",
                //     payload: {},
                // });
                // history("/liveRoom", { state: { ...state, hasPay: true, timeType1F: liveListRoomBaseVO.type === 1 ? { liveId: liveId, timeType1: timeType1, t: true } : undefined }, replace: true });
            }
        }
    };
    const roomPreviewEvent = async (liveIds) => {
        // console.log('showPay------------------------', showPay);
        // console.log("state.hasPay", liveIds, state.hasPay, 'Local("payed" + liveId)', Local("payed" + liveIds), Local("preTimeOver" + liveIds));
        if (state?.hasPay) return;
        if (Local("payed" + liveIds)) return;
        if (!Local("preTimeOver" + liveIds)) Local("preTimeOver" + liveIds, true, preTimeOver);
        showPaySet(true);
        needPaySet(true);
    };

    useEffect(() => {
        displayDSet(displays);
        return () => {
            clearTimeout(timeout)
        }
    }, [displays]);
    const displayDSet = (e) => {
        // console.log(e);
        if (e != undefined && e > 0) {
            displaySetF(true)

            displaySet(true);
            timesDRef.current = e;
            timesDSet(e)
            timesF();
        } else {
            displaySetF(false)

            displaySet(false);
        }
    };
    const timesF = () => {
        if (timesDRef.current > 0) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                timesDRef.current = timesDRef.current - 1;
                timesDSet((e) => e - 1)
                timesF();
            }, 1000);
        } else {
            displaySetF(false)

            displaySet(false);
            clearTimeout(timeout);
        }
    };
    return (
        <>
            {
                display &&
                <div className={style.Preview}>
                    <div className={style.Preview_top}>
                        <img src={require('../../../assets/images/live/Preview.png')} alt="" />
                        <div>
                            <p>trả phí xem trước live</p>
                            <p className={style.sizes}>
                                {
                                    liveListRoomBaseVO.type == 1 &&
                                    <span>{liveListRoomBaseVO.roomPrice ? liveListRoomBaseVO.roomPrice : 110} {t("goldPer")}</span>
                                }
                                {
                                    liveListRoomBaseVO.type == 2 &&
                                    (
                                        <span>{liveListRoomBaseVO.roomPrice ? liveListRoomBaseVO.roomPrice : 0}  {t("gold_coins")}</span>
                                    )}
                            </p>

                        </div>
                    </div>
                    <div className={style.times}>
                        {timesD}s
                    </div>
                    <div className={style.buts} onClick={() => enterPayRoom()}>
                        thanh toán{liveListRoomBaseVO.roomPrice ? liveListRoomBaseVO.roomPrice : 0}xu
                    </div>
                </div>
            }

            {
                showPay &&
                (
                    <div className={style.passBody}>
                        {/* <img src={liveListAnchorInfoVO?.avatar} className={style.passBg} alt="" /> */}
                        <div className={style.passForm}>
                            <Space direction="vertical" style={{ "--gap": "25px", }}>
                                <div className={style.title}>{t("fu_fei_fj")}</div>
                                {liveListRoomBaseVO.type == 1 && (
                                    <div className={style.tCenter}>
                                        {t("enterNeed")}
                                        <span className={style.red}>{liveListRoomBaseVO.roomPrice ? liveListRoomBaseVO.roomPrice : 0}</span>
                                        {t("goldPer")}
                                    </div>
                                )}
                                {
                                    liveListRoomBaseVO.type == 2 &&
                                    (
                                        <div className={style.tCenter}>
                                            {t("fukuan")}
                                            <span className={style.red}>{liveListRoomBaseVO.roomPrice ? liveListRoomBaseVO.roomPrice : 0}</span>
                                            {t("showNeed")}
                                        </div>
                                    )}
                                {
                                    liveListRoomBaseVO.type == 2 && <div className={style.tCenter_bottom}>
                                        Thoát ra 5 phút sau vào lại không thu phí
                                    </div>
                                }
                                <div className={style.btnGroup}>
                                    <Button block onClick={() => history('/live/list')} className={style.lbtn}>
                                        {t("cancel")}
                                    </Button>
                                    {/* loading="auto" */}
                                    <Button block color="primary" onClick={() => enterPayRoom()} className={style.rbtn}>
                                        {t("enterRoom")}
                                    </Button>
                                </div>
                            </Space>
                        </div>
                        < PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/user/deposit')} type={2} />
                    </div>
                )
            }

        </>
    );
};

export default EnterPay;
