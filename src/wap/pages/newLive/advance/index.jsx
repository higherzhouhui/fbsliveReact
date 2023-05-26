import { Popup, Button, Swiper, NavBar, Avatar } from 'antd-mobile';
import React, { useState, useEffect, useRef } from 'react';
import style from './index.module.scss'
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { listLiveBooking, saveUserLiveBooking } from '../../../server/live';
import useContextReducer from "../../../state/useContextReducer";
import { liveFollow } from '../../../server/Fans';
import { CEmpty } from '../../../components';
const Index = () => {
    const history = useNavigate();
    const {
        state: {
            user,
            live: {
                liveData,
                followLists
            },
        },
        dispatch,
        fetchUtils: { freshUser }
    } = useContextReducer.useContextReducer();


    const [visible, visibleSet] = useState()
    const [listLiveBookingD, listLiveBookingDSet] = useState([])
    const [clickD, clickDSet] = useState(0)
    const SwiperRef = useRef()
    const listLiveBookingDRef = useRef([])
    const [follows, followsSet] = useState(false)
    const click = (e) => {
        // 父级标签
        const element = document.getElementById('tabBig')
        //可视屏幕宽度
        let clientWidth = document.querySelector('body').offsetWidth;
        //可视屏幕中心点（减去的30是列表两边的15像素的留白）
        let center = (clientWidth + 24) / 2;
        const element2 = document.getElementById(`anchor-${e}`)
        //计算当前标签到最左侧的宽度
        let valLeft = element2.offsetLeft;
        //计算当前标签本身的宽度
        let valWidth = element2.clientWidth;
        //当前标签中心点到最左侧的距离
        let valCenter = valLeft + valWidth / 2;

        if (valCenter > center) {
            element.scrollTo({
                left: valCenter - center,
                behavior: 'smooth'
            });
        } else {
            element.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    useEffect(() => {
        if (visible) {
            listLiveBookingF()
        }
    }, [visible])

    // 预约活动列表
    const listLiveBookingF = async () => {
        const res = await listLiveBooking()
        if (!(res instanceof Error)) {
            console.log('res----', res);
            if (liveData.listDataVos != undefined && liveData.listDataVos[0] != undefined) {
                res.forEach((value) => {
                    liveData?.listDataVos.forEach((value_2) => {
                        if (value.uid == value_2?.liveListRoomBaseVO?.anchorId) {
                            value.debut = true
                            value.liveD = value_2
                            value.liveId = value_2.liveId
                        }
                    })
                })
            }
            listLiveBookingDSet(res || [])
            listLiveBookingDRef.current = res || []
        }
    }
    // 预约
    const saveUserLiveBookingF = async (e) => {
        const res = await saveUserLiveBooking({ liveBookingId: e.liveBookingId, uid: e.uid })
        if (!(res instanceof Error)) {
            console.log('res---', res);
            listLiveBookingF()
        }
    }

    // 关注
    const follow = async (d) => {
        const res = await liveFollow({ isFollow: true, targetId: d.uid });
        if (!(res instanceof Error)) {
            freshUser();

            if (res) {
                dispatch(() => {
                    return {
                        type: "live/SetFollowLists",
                        payload: res,
                    };
                });
            }


        }
    };

    useEffect(() => {
        let a = followLists.filter((value) => {
            return value.uid == listLiveBookingDRef.current[clickD]?.uid
        })
        if (a[0] != undefined) {
            followsSet(true)
        } else {
            followsSet(false)
        }
    }, [listLiveBookingDRef.current, followLists, clickD])



    return (
        <div>
            <div className={style.inlet}>
                <img onClick={() => visibleSet(true)} src={require('../../../assets/image/newImg/yg/rukou.png')} alt="" />
            </div>
            <Popup position='right' bodyStyle={{ width: '100vw' }} visible={visible} destroyOnClose onMaskClick={() => visibleSet(false)}>
                <div className={style.bodys}>

                    <NavBar
                        back={null}
                        left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => visibleSet(false)} />}
                        className={style.wbg}
                    >
                        <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                            {t('zhiboyugao')}
                        </div>
                    </NavBar>
                    {/* 只有一个预约铺满展示 */}
                    <div className={style.content}>
                        <div className={style.content_tops} id={'tabBig'}>
                            {
                                listLiveBookingDRef.current.length > 1 && listLiveBookingDRef.current.map((value, index) => {
                                    return <div id={`anchor-${index}`} onClick={() => { click(index), clickDSet(index), SwiperRef.current.swipeTo(index) }} key={index} className={`${style.box} ${clickD == index ? style.box_zb : ''}`}>
                                        <Avatar fallback={<img src={require("../../../assets/image/join/logo.png")} />} src={value?.avatarAddress} style={{ '--border-radius': "100%", '--size': '48px' }} />
                                        {/* 是否直播中 */}
                                        {
                                            value.debut && <div className={style.lives}>
                                                <img src={require("../../../assets/image/RankingList/zbz2s.png")} alt="" />
                                                <div className={style.fonts}>
                                                    {/* t('zhengzaizhibo') */}
                                                    <div className={style.gd_font}>{t("zhengzaizhibo")}</div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                })
                            }
                        </div>
                        {/* swipeTo  切换到指定索引 ref */}
                        <div className={`${style.box_imgs} ${listLiveBookingDRef.current.length <= 1 ? style.box_imgs2 : ''}`}>
                            <Swiper indicator={() => null} ref={SwiperRef} onIndexChange={(e) => { click(e), clickDSet(e) }} className={style.box_imgs_Swiper} defaultIndex={0} >
                                {
                                    listLiveBookingDRef.current.map((value, index) => {
                                        return <Swiper.Item key={index}>
                                            <div className={style.box2_demo}>
                                                <img src={value?.url} alt="" />
                                            </div>
                                        </Swiper.Item>
                                    })
                                }
                            </Swiper>
                        </div>
                    </div>
                    {
                        listLiveBookingDRef.current[0] != undefined && <div className={`${style.bottoms} ${follows ? style.bottoms2 : ''}`}>
                            {!follows && <Button className={style.but} loading='auto' onClick={() => follow({ uid: listLiveBookingD[clickD]?.uid })}
                            >
                                {t('guanzhuzhubo')}
                            </Button>}
                            {
                                listLiveBookingDRef.current[clickD]?.debut ?
                                    <Button className={`${style.but} ${style.but2}`} onClick={() => {
                                        dispatch({
                                            type: "UPDATE_ANCHORCARDREQ",
                                            payload: {},
                                        });
                                        dispatch({ type: "live/SetLiveDetail", payload: listLiveBookingDRef.current[clickD]?.liveD });
                                        history("/liveRoom", { state: { liveId: listLiveBookingDRef.current[clickD]?.liveId } });

                                    }}>
                                        {t('jinruzhiboj')}
                                    </Button>
                                    : listLiveBookingDRef.current[clickD]?.status == 2 ? <Button loading='auto' className={`${style.but} ${style.but2}`} onClick={() => saveUserLiveBookingF({ liveBookingId: listLiveBookingDRef.current[clickD]?.id, uid: user?.uid })}>
                                        {t('yuyuetixing')}
                                    </Button> : <Button className={`${style.but} ${style.but3}`} >
                                        {t('yiyuyue')}
                                    </Button>
                            }
                        </div>
                    }

                    {listLiveBookingDRef.current[0] == undefined && <CEmpty description={t("noData")} />}
                </div>
            </Popup>

        </div>
    );
}

export default Index;
