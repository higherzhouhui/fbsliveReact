//  众筹弹窗
import React, { useCallback, useEffect, useState, useRef } from 'react';
import style from './style/crowdfunding.module.scss'
import './style/crowdfunding.scss'
import { message } from "antd";
import { Swiper } from 'antd-mobile'

import closeIcon from '../../../assets/images/liveDetail/crowdfunding/close-icon.png'
import resultImg from '../../../assets/images/liveDetail/crowdfunding/result.png'
import resultCloseIcom from '../../../assets/images/liveDetail/crowdfunding/result-close.png'
import endIcon from '../../../assets/images/liveDetail/crowdfunding/end-icon.png'
import { useTranslation } from "react-i18next";
import useContextReducer from '../../../state/useContextReducer.js'
import { SendGift } from "../../../api/live";
import Draggable from 'react-draggable';

export default (props) => {
    let {
        info: { crowdfundingList: list, avatarList },
        onHiddenButton,
        onClose,
        baseInfo: { liveId, anchorId, nickname },
    } = props;
    const isFirstRun = useRef(true);
    const { fetchUtils } = useContextReducer.useContextReducer()
    const { freshUser } = fetchUtils;
    let [visible, setVisible] = useState(false)
    let [resultVisible, setResultVisible] = useState(false)
    let [buttonVisible, setButtonVisible] = useState(true)
    const sendGift = (num = 1, data) => {
        let { goldCoin, gid } = data;
        SendGift({ combo: num, count: num, liveId, gid, goldCoin, anchorId }).then((rt) => {
            if (rt) {
                // giftLoadingSet(false);
                message.success(t("ui_success"));
                freshUser()
            }
        })
    }
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        isShowResult()
    }, [list])
    const isShowResult = () => {
        let bol = list.every(item => item.num >= item.all)
        if (bol) {
            setResultVisible(true)
            setVisible(false)
            setButtonVisible(false)
            onHiddenButton()
        }
    }
    let { t } = useTranslation()
    return <>
        {
            resultVisible ? <div className={style.resultBox}>
                <img className={style.resultImg} src={resultImg} alt="" /> <br />
                <img className={style.resultClose} onClick={() => { setResultVisible(false); onClose() }} src={resultCloseIcom} alt="" />
            </div> : ''
        }
        {
            buttonVisible ? <Swiper className={style.crowdfundingButton}>
                {
                    list.map((item, index) =>
                        <Swiper.Item key={index}>
                            <div
                                onClick={() => setVisible(true)}
                                className={style.content}
                            >
                                <img src={item.cover} alt="" />
                                <div className={style.box}>
                                    <div className={style.processTxt}>
                                        <span className={style.processNum}>{item.num / item.all > 1 ? (item.all + '+') : item.num}</span>/{item.all}
                                    </div>
                                    <div className={`${style.processBox} ${list.length > 2 && style.sort}`}>
                                        <div className={style.processed} style={{ width: item.num / item.all > 1 ? '100%' : (item.num / item.all * 100 + '%') }} ></div>
                                    </div>

                                </div>
                            </div>
                        </Swiper.Item>
                    )
                }
            </Swiper> : ''
        }


        {
            visible ?
                <Draggable>
                    <div className={style.crowdfundingBox}>
                        {/* <div className={style.dragBox} onMouseMove={(e) => { dragFun(e) }} onMouseLeave={() => { setIsDown(false) }} onMouseUp={() => { setIsDown(false) }} onMouseDown={(e) => { mouseDown(e) }} ></div> */}
                        <img src={closeIcon} className={style.closeIcon} alt="" onClick={() => setVisible(false)} />
                        <div className={style.title}>{t('dezc', { name: nickname })}</div>
                        <div className={style.innerBox}>
                            <div className={style.topInfo}>
                                <div className={style.innerTitle}>{t('zblwzc')}</div>
                                <div className={style.rightInfo}>
                                    {
                                        avatarList.slice(avatarList.length - 3 > 0 ? avatarList.length - 3 : 0)
                                            .map((icon, index) => <img key={index} src={icon} className={style.avatar} alt="" />)
                                    }
                                    <div className={style.joinTxt}>
                                        {t('yyzl', { num: avatarList.length })}
                                    </div>
                                </div>
                            </div>
                            <div className={style.giftBox}>
                                {
                                    list.map((item, index) => <div key={index} className={style.giftItem}>
                                        {
                                            item.num / item.all >= 1 ? <img src={endIcon} className={style.endIcon} alt="" /> : ''
                                        }
                                        <img src={item.cover} className={`${style.giftIcon} ${list.length > 2 && style.sort}`} alt="" />
                                        <div className={style.gameName}>{item.gname}（{item.goldCoin}xu）</div>
                                        <div className={`${style.processBox} ${list.length > 2 && style.sort}`}>
                                            <div className={style.processed} style={{ width: item.num / item.all > 1 ? '100%' : (item.num / item.all * 100 + '%') }} ></div>
                                        </div>
                                        <div className={style.processTxt}>
                                            <span className={style.processNum}>{item.num / item.all > 1 ? (item.all + '+') : item.num}</span>/{item.all}
                                        </div>
                                        <div className={`${style.button} ${list.length > 2 && style.sort}`} onClick={() => sendGift(1, item)}>{t('fasong')}</div>
                                    </div>)
                                }

                                {/* <div className={style.giftItem}></div> */}
                                {/* <div className={style.giftItem}></div> */}
                            </div>
                        </div>
                        <div className={style.awardBox}>
                            <div className={style.topTitle}>{t('zcdcjl')}</div>
                            <div className={style.txtBox}>
                                <div className={style.txt}>
                                    为大家表演一个吃大香蕉
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>

                : ''
        }
    </>

}