import React, { useCallback, useEffect, useRef, useState } from "react"
import style from './style/GiftsToWX.module.scss'
// import { ProgressBar } from "antd-mobile"
import { Button, Avatar, message, Progress } from 'antd'
import { Local, getSearchData } from '../../../common'
import { getAnchorCard } from '../../../api/live'
import { useTranslation } from "react-i18next"
import Draggable from 'react-draggable';
import useContextReducer from '../../../state/useContextReducer'


const GiftsToWX = (props) => {
    const {
        state: {
            live: {
                giftData,
                liveDetail,
            },
        },
    } = useContextReducer.useContextReducer();

    const { t } = useTranslation()
    const [visible, visibleSet] = useState(false)
    const [getAnchorCardD, getAnchorCardDSet] = useState({})
    const [contactFlag, contactFlagSet] = useState(0) // -1关闭 0 未开启 1开起
    const [totalAmounts, totalAmountsSet] = useState(0)
    useEffect(() => {
        window.eventBus.addListener("contactFlagS", contactFlagS);
    }, []);
    useEffect(() => {
        contactFlagSet(liveDetail?.liveListAnchorInfoVO?.contactFlag);
    }, [liveDetail]);

    const contactFlagS = (e) => {
        contactFlagSet(e);
    };


    // 点击打开弹窗
    const onLuckBag = async () => {
        const res = await getAnchorCard({ anchorUid: liveDetail?.liveListAnchorInfoVO?.anchorId, liveId: liveDetail?.liveId, language: props.lang });
        if (!(res instanceof Error)) {
            contactFlagSet(res.contactFlag);
            let totalAmounts = ((res?.totalAmount == null ? 0 : Number(res?.totalAmount)) / Number(res?.contactAmount)) * 100;
            totalAmountsSet(totalAmounts);
            getAnchorCardDSet(res);
            visibleSet(true);
        }
    };

    // 复制
    const copy = (e) => {
        const textarea = document.createElement('textarea');
        textarea.setAttribute('readonly', 'readonly');
        textarea.value = e;
        document.body.appendChild(textarea);
        textarea.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            message.success(t('ui_successful_copy'));
        }
        document.body.removeChild(textarea);
    }

    const giftTrueF = (id) => {
        visibleSet(false)
        // let datas
        // if (id) {
        //     giftData.forEach((value, index) => {
        //         value.propBaseResponses.forEach((value_2, index_2) => {
        //             if (value_2.gid == id) {
        //                 console.log(index, index_2);
        //                 datas = { index, index_2 }
        //             }
        //         })
        //     })
        // }
        // window.eventBus.emit('GiftsToWXKLW', datas)
        window.eventBus.emit('GiftsToWXKLW')
    }

    return <div>
        {/* 入口 */}
        {
            contactFlag == 1 &&
            <div className={style.GiftsToWX} onClick={() => onLuckBag()}>
                <img src={require('../../../assets/images/live/gwx/rklog.png')} alt="" className={style.title_img} />
            </div>}
        {/* 内容 */}
        {
            visible && <div onClick={() => { visibleSet(false) }} >
                <div className={style.GiftsToWX_center} onClick={(e) => { e.stopPropagation() }}>
                    <img className={style.GiftsToWX_center_sc} src={require('../../../assets/images/live/gwx/sc.png')} alt="" onClick={() => { visibleSet(false) }} />
                    <Avatar size={70} style={{ "--border-radius": "100%" }} src={getAnchorCardD?.anchorAvatar} className={style.GiftsToWX_Avatar} />
                    <div className={style.GiftsToWX_name}>{getAnchorCardD?.nickname}</div>
                    <div className={style.GiftsToWX_qm}>{(getAnchorCardD?.signature == null || getAnchorCardD?.signature == undefined || getAnchorCardD?.signature.toString().length == 0) ? t('zhegerenhenlan') : getAnchorCardD?.signature}</div>

                    {/* 获取信息 */}
                    <div className={style.GiftsToWX_information}>
                        <Avatar size={30} src={require('../../../assets/images/live/gwx/zako.png')} style={{ "--border-radius": "100%" }} />
                        {getAnchorCardD?.isComplete == false && <div>************</div>}
                        {getAnchorCardD?.isComplete == true && <div className={style.contactInfo}>{getAnchorCardD?.contactInfo}</div>}
                        {getAnchorCardD?.isComplete == false && <Button className={style.GiftsToWX_information_but} onClick={() => {
                            giftTrueF(getAnchorCardD?.contactGiftId)
                        }}>{t('huoqu')}</Button>}
                        {getAnchorCardD?.isComplete == true && <Button className={style.GiftsToWX_information_but} onClick={() => { copy(getAnchorCardD?.contactInfo) }}>{t('copy')}</Button>}
                    </div>
                    {/* 底部信息  */}
                    {/* 累计送礼获取 */}
                    {
                        getAnchorCardD?.contactGainType == 1 && <div>
                            <div className={style.GiftsToWX_mpjd}>{t('huoqumingpianjindu')}</div>
                            {getAnchorCardD?.isComplete == false && <div className={style.GiftsToWX_zs}>{t('zengsongliwudadaoyaoqiujikehuoqu')}</div>}
                            {getAnchorCardD?.isComplete == true && <div className={style.GiftsToWX_zs}>{t('yidadaohuoquyaoqiu')}</div>}
                            <div className={style.GiftsToWX_ProgressBar}>
                                <Progress
                                    percent={totalAmounts}
                                    showInfo={false}
                                    strokeColor='#fff'
                                    trailColor='#95B6D7'
                                    type="line"
                                    strokeWidth={14}
                                    style={{ width: '180px' }} />
                                <div className={style.GiftsToWX_ProgressBar_div}>
                                    {getAnchorCardD?.totalAmount == null ? 0 : getAnchorCardD?.totalAmount}/{getAnchorCardD?.contactAmount}
                                </div>
                            </div>
                        </div>
                    }

                    {/* 指定礼物获取 */}
                    {
                        getAnchorCardD?.contactGainType == 2 && <div className={style.GiftsToWX_appoint}>
                            {/* <Avatar src={getAnchorCardD?.cover} /> */}
                            <img src={getAnchorCardD?.cover} className={style.GiftsToWX_appoint_img} alt="" />
                            {getAnchorCardD?.isComplete == false && <div className={style.divs}>{t('zengsonghuoqu', { a: getAnchorCardD?.gname })}</div>}
                            {getAnchorCardD?.isComplete == true && <div className={`${style.GiftsToWX_appoint_right} ${style.divs}`}>
                                <div className={style.getAnchorCardD_gname}>{t('yizengsongliwu', { a: getAnchorCardD?.gname })}</div>
                                <div className={style.lx}>{t('lijifuzhilianxifangshi')}</div>
                            </div>}
                        </div>}

                    <div className={style.GiftsToWX_bottom_size}>
                        1、{t('tianjiashiqingbeizhuniceng')}<br />
                        2、{t('lianxifangshiruyouxujiaketongguo')}
                    </div>
                </div>
            </div>
        }
    </div>
}

export default GiftsToWX;
