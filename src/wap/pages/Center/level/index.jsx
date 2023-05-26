import { Button, Input, NavBar, Tabs, Grid, Image, Dialog, Toast, Mask, Swiper } from "antd-mobile";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import style from './index.module.scss'
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { BuyVip, getVipList } from "../../../server/center";
import i18n from '../../../lang/i18n'
import useContextReducer from "../../../state/useContextReducer";

const PointOut = React.lazy(() => import('../../../components/pointOut/index'))

export default function Recharge() {
    const history = useNavigate()
    const {
        state: { user, assergoldData },
        fetchUtils,
    } = useContextReducer.useContextReducer();

    const { freshUser, userGetUserAsserGold } = fetchUtils;
    const [list, setList] = useState([{}])
    const [activeIndex, setActiveIndex] = useState(0)
    const [showDetail, showDetailSet] = useState(false)
    const [showDetailIndex, showDetailIndexSet] = useState(0)
    const [visible2, setVisible2] = useState(false)
    const getList = useCallback(async () => {
        const res = await getVipList()
        if (!(res instanceof Error)) {
            console.log('这是多少数据', res);
            setList(res)
        }
    }, [])

    const items = useMemo(() => {
        return list.length > 0 ? list[activeIndex] : {}
    })

    const vipData = [
        { text: t('vipbTitle1'), index: 1, des: [t('vipbdes1-1'), t('vipbdes1-2'), t('vipbdes1-3')] },
        { text: t('vipbTitle2'), index: 2, des: [t('vipbdes2-1')] },
        { text: t('vipbTitle3'), index: 3, des: [t('vipbdes3-1')] },
        { text: t('vipbTitle4'), index: 4, des: [t('vipbdes4-1')] },
        { text: t('vipbTitle5'), index: 5, des: [t('vipbdes5-1')] },
        { text: t('vipbTitle6'), index: 6, des: [t('vipbdes6-1')] },
        { text: t('vipbTitle7'), index: 7, des: [t('vipbdes7-1')] },
        { text: t('vipbTitle8'), index: 8, des: [t('vipbdes8-1'), t('vipbdes8-2'), t('vipbdes8-3')] },
    ]

    const vip = useMemo(() => {
        let show = 0
        switch (Number(activeIndex)) {
            case 0:
                show = 4
                break;
            case 1:
                show = 5
                break;
            case 2:
                show = 7
                break;
            case 3:
                show = 8
                break;
            case 4:
                show = 8
                break;
        }
        return vipData.filter((item, index) => index < show)
    })

    useEffect(() => {
        if (user.badgeList != null && user.badgeList != undefined) {
            if (user?.badgeList[0] != undefined) {
                user?.badgeList[1] == 6 && (setActiveIndex(0));
                user?.badgeList[1] == 7 && (setActiveIndex(1));
                user?.badgeList[1] == 8 && (setActiveIndex(2));
                user?.badgeList[1] == 9 && (setActiveIndex(3));
                user?.badgeList[1] == 10 && (setActiveIndex(4));
            }
        }
    }, []);

    useEffect(() => {
        getList()
    }, [getList])

    const submit = () => {
        console.log({ levelId: items.id }, items?.price);
        Dialog.confirm({
            content: `${t('vipTxt5', { 0: items?.price })}？`,
            confirmText: t('ui_confirm'),
            cancelText: t('btn_cancel'),
            onConfirm: async () => {
                if (assergoldData?.goldCoin < items?.price) {
                    setVisible2(true)
                    return
                }
                const res = await BuyVip({ levelId: items.id })
                if (!(res instanceof Error)) {
                    Toast.show(t('tip_receive_success'))

                    freshUser() //购买成功刷新info
                    userGetUserAsserGold()
                }
            },
        })
    }

    return <div className={style.gbg}>
        {/* 顶部 */}
        {/* <NavBar onBack={() => history(-1)} className={style.wbg}>{t('vipTitle')}</NavBar> */}
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px', filter: 'contrast(200%) invert(200%)' }} onClick={() => history(-1)} />}
            className={style.wbg}
        // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
        >
            <div style={{ fontSize: '18px', color: '#fff', fontWeight: '500' }}>
                {t('vipTitle')}
            </div>
        </NavBar>
        {/* <CNavBar
            title={t('vipTitle')}
            left={require('../../../assets/image/kf/left.png')}
            leftStyles={{ width: '22px', height: '26px', filter: 'contrast(200%) invert(200%)' }}
            background={'transparent'}
            styles={{ background: 'transparent', color: "#fff" }} /> */}
        {/* tab切换 */}
        <Tabs activeKey={activeIndex} className={`${style.levelTabs} noTabLine`} style={{
            '--title-font-size': '17px',
            '--active-line-height': '3px',
            '--active-line-border-radius': '1px',
            '--fixed-active-line-width': '100%',
            "--active-title-color": "#FAD7BC",
            "--active-line-color": "#FAD7BC",
        }} onChange={setActiveIndex}>
            {
                list.map((item, index) => {
                    return <Tabs.Tab title={item?.name} key={`${index}`} />
                })
            }
        </Tabs>
        <div className={style.levelImg}>
            <div className={style.left}>
                <dt>{items?.name}</dt>
                {/* <dd>{t('wkt_gui_zu')}</dd> */}
            </div>
            <Image
                src={require(`../../../assets/image/live/jw/jw${Number(activeIndex) + 1 > 5 ? 5 : Number(activeIndex) + 1}.png`)}
                // src={list[Number(activeIndex)]?.logoUrl}
                fit='contain'
                className="bgImg"
            />
        </div>
        <div className={style.main}>
            <div className={`${style.tips} ${i18n.language == 'vie' ? style.vie : ''}`}>{t('zhuan_shu_tq')}</div>
            <Grid columns={3} gap={8} className={style.levelGroup}>
                {vip.map((item, index) => {
                    return <Grid.Item className={style.item} key={index} onClick={() => {
                        showDetailIndexSet(index)
                        showDetailSet(true)
                    }}>
                        <Image className={`${style.icon} bgImg`} src={require(`../../../assets/image/vip/icon${index + 1}.png`)} width={30} height={30} fit="contain" />
                        <span className={style.text}>{item.text}</span>
                    </Grid.Item>
                })
                }
            </Grid>
        </div>
        {/* 底部 */}
        <div className={style.footer}>
            <Button className={style.btnBuy} onClick={() => submit()}>
                <div>{t('vipTxt4')}</div>
                <div className={style.span}>{t('vipTxt1', { 0: items?.price })}</div>
            </Button>
            <div className={style.zengsong}>
                {t('vipTxt2')}: <span>{t('viptips', { 0: items?.renewPrice || 0, 1: items?.returnPrice || 0 })}</span>
            </div>
        </div>
        <Mask visible={showDetail} onMaskClick={() => showDetailSet(false)}>
            <Swiper
                indicatorProps={{
                    color: 'white',
                }}
                defaultIndex={showDetailIndex}
                className={`${style.centerSwiper} vipSwiper`}
                slideSize={80}
                trackOffset={10}
                indicator={() => <></>}
            >
                {vip.map((item, index) => {
                    return <Swiper.Item key={index}>
                        <div className={style.swiperContent2} >
                            <div className={style.swiperContent} >
                                <img src={require(`../../../assets/image/vip/icon${item.index}.png`)} alt="" />
                                <div className={style.text}>
                                    <dt>{item.text}</dt>
                                    <dd>
                                        {item.des.map((val, key) => {
                                            return <span key={key}>{val}</span>
                                        })}
                                    </dd>
                                </div>
                                <img src={require('../../../assets/image/vip/gb.png')} onClick={() => { showDetailSet(false) }} alt="" className={style.gbs} />
                            </div>
                        </div>
                    </Swiper.Item>
                })
                }
            </Swiper>
        </Mask>

        <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/recharge')} type={2} />
    </div>
}