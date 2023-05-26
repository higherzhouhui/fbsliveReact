import React, { useCallback, useEffect, useState } from "react"
import { Toast } from "antd-mobile"
import { Button, Modal, } from 'antd';
import { useTranslation } from 'react-i18next';
import { liveFollow, GetGiftLuckBagRecordByUid, GetLuckBagUserList, GetUserJoinLuckBag, LiveChat } from '../../../api/live';
import { Local } from '../../../common';
import './style/luckBag.scss';

let setTime = null
// 福袋交互流程
// 1. app创建福袋活动
// 2. im监听推送type = 50 
// 3. 福袋倒计时
// 4. 未参与状态，点击进去可以参与福袋，根据类型不同不同参与方式
// 5. 已参与状态，点击进去弹窗，显示福袋信息。展示 "已参与"，"倒计时" 信息
// 6. im监听福袋结束，推送中奖/未中奖福袋状态
// 7. 根据福袋状态可以查询其他中奖人员信息数据
export default function LuckyBag(props) {
    let { anchorId, liveId } = props
    const [showLuckBag, showLuckBagSet] = useState(false)//是否展示福袋 
    const [visibleLuckyBag, setVisibleLuckyBag] = useState(false)//主页面弹窗显隐
    const [rules, setRules] = useState(false)//规格显隐
    const [visible, setVisible] = useState(false)   //参与后等待开奖
    const [showRes1, setShowRes1] = useState(false)   //中奖结果 中奖
    const [showRes2, setShowRes2] = useState(false)   //中奖结果 未中奖
    const [resData, resDataSet] = useState({ detailStatus: 2 })
    const [recordVisible, setRecordVisible] = useState(false)//中奖记录显隐
    const [luckBag, setLuckBag] = useState({ giftLuckBagDetailVO: {} })//福袋信息
    const [downTime, setDownTime] = useState('00:00')//倒计时
    const [luckMan, luckManSet] = useState([])//幸运观众列表
    const { t } = useTranslation()
    const onJoin = async () => {
        switch (Number(luckBag.joinType)) {
            case 10:
                await LiveChat({ liveId, msg: luckBag.joinCase })
                break
            case 20:
                await liveFollow({ isFollow: true, targetId: anchorId })
                window.eventBus.emit('handleFollow')
                break
        }
        let { giftLuckBagConfigId, giftLuckBagDetailId } = luckBag.giftLuckBagDetailVO
        let res = await GetUserJoinLuckBag({
            giftLuckBagConfigId,
            giftLuckBagDetailId,
        })
        if (!(res instanceof Error)) {
            Toast.show(t('fudai_chenggong'))
            getLuckBagInfo()
            setVisibleLuckyBag(false)
            clearTimeout(setTime)
        } else {
            Toast.show(t('fudai_shibai'))
        }
        // setVisible(true)
    }
    // 获取福袋信息
    const getLuckBagInfo = async () => {
        if (!anchorId) {
            return
        }
        let res = await GetGiftLuckBagRecordByUid({
            anchorId: anchorId,
            uid: Local('userInfo2').uid,
        })
        if (!(res instanceof Error)) {
            if (res?.curIsHasLuckBag) {
                setLuckBag(res)
                handleDownTime(res.giftLuckBagDetailVO.betweenTime) //倒计时 giftLuckBagDetailVO.betweenTime
                showLuckBagSet(true)
            } else {
                showLuckBagSet(false)
                clearTimeout(setTime)
            }
        }
    }

    // 处理游戏倒计时
    const handleDownTime = (time) => {
        setDownTime(formatSeconds(time))
        if (time < 1) {
            init()
        } else {
            setTime = setTimeout(() => {
                handleDownTime(time - 1 > 0 ? time - 1 : 0)
            }, 1000);
        }
    }
    // 补0
    const formatBit = (val) => {
        val = +val
        return val > 9 ? val : '0' + val
    }
    // 秒转时分秒，求模很重要，数字的下舍入
    const formatSeconds = (time) => {
        let min = Math.floor(time % 3600)
        return formatBit(Math.floor(min / 60)) + ':' + formatBit(time % 60)
    }


    // 点击福袋
    const onLuckBag = () => {
        clearTimeout(setTime)
        getLuckBagInfo()
        if (luckBag.giftLuckBagDetailVO.flagJoin) {
            setVisible(true)
            showLuckBagSet(false)
        } else {
            setVisibleLuckyBag(true)
        }
    }

    const init = useCallback(() => {
        getLuckBagInfo()
        setVisibleLuckyBag(false)
        setVisible(false)
        setRules(false)
        clearTimeout(setTime)
    }, [])


    useEffect(() => {
        init()
        window.eventBus.addListener('liveChatMsg', liveChatMsg)
        return () => {
            window.eventBus.removeListener('liveChatMsg', liveChatMsg)
        }
    }, [init])


    const liveChatMsg = (data) => {
        if (data.protocol === 50) {
            // 发布福袋
            if (data.status == 1) {
                getLuckBagInfo()

            }
            // 福袋开奖
            if (data.status == 2) {
                // 福袋中奖
                if (data.detailStatus == 1) {
                    setShowRes1(true)
                    resDataSet(data)
                }
                // 福袋未中奖
                if (data.detailStatus == 2) {
                    setShowRes2(true)
                    resDataSet(data)
                }
            }
        }
    }

    return <>
        {/* 福袋 */}
        {/*  */}
        {!recordVisible && !visible && showLuckBag && <div className="lucky_bag" onClick={() => {
            onLuckBag()
        }}>
            <div className="fd"></div>
            <div className="time">{downTime}</div>
        </div>}
        {/* 福袋主窗口 */}
        <Modal destroyOnClose="true"
            bodyStyle={{ "padding": "0", "margin": "0", }}
            className="fd-modal"
            width={420}
            onCancel={() => setVisibleLuckyBag(false)}
            title={name}
            closable={false}
            visible={visibleLuckyBag}
            centered={true}
            footer={[
                <Button type="primary" className='btn_submit' onClick={() => onJoin(-1)}>{t('fudai_yjcy')}</Button>,
            ]}>
            <div className="header">
                <div className="header_t">
                    <span className="icon icon-help" onClick={() => { setRules(true) }}></span>
                    <div onClick={() => { setRules(true) }} className="title">{t('fu_dai')}</div>
                    <span className="icon icon-close" onClick={() => { setVisibleLuckyBag(false) }}></span>
                </div>
                <div className="header_b">{luckBag?.giftLuckBagDetailVO?.joinNum || 0}{t('fu_dai_num')}</div>
            </div>
            <div className="body">
                <div className="body_box">
                    <div className="body_box_l">
                        <span>{downTime}</span>
                        <span>{t('dao_ji_shi')}</span>
                    </div>
                    <div className="body_box_r">
                        <span>{t('zong_mei_li')}</span>
                        <span>{t('fudai_syfd', { num: luckBag.peopleNum })}</span>
                    </div>
                </div>
                <div className="content">
                    <div className="condition">
                        {t('fudai_canyu')}
                        <span className="comment_status">{luckBag.giftLuckBagDetailVO?.flagJoin ? t('fudai_dacheng') : t('fudai_weidacheng')}</span>
                    </div>
                    <div className="comment">
                        {luckBag.joinType == 10 && <span className="comment_text">{t('fudai_fasong')}：{luckBag.joinCase}</span>}
                        {luckBag.joinType == 20 && <span className="comment_text">{t('fudai_fensi')}</span>}
                        {luckBag.joinType == 30 && <span className="comment_text">{t('fudai_wutj')}</span>}
                        {luckBag.joinType == 40 && <span className="comment_text">{luckBag.joinCase}{t('glod')}</span>}
                    </div>
                </div>
                <div className="tips">{t('fudai_wulikai')}</div>
            </div>
        </Modal>
        {/* 规则说明 */}
        <Modal destroyOnClose="true"
            bodyStyle={{ "padding": "0", "margin": "0", }}
            className="fd-modal"
            width={420}
            onCancel={() => setRules(false)}
            title={name}
            centered={true}
            closable={false}
            visible={rules}
            footer={null}>
            <div className="header">
                <div className="header_t">
                    <div className="title">{t('fudai_guize')}</div>
                    <span className="icon icon-close" onClick={() => { setRules(false) }}></span>
                </div>
            </div>
            <div className="rules" dangerouslySetInnerHTML={{ __html: luckBag.agreement }}></div>
        </Modal>

        {/* 中奖状态 待开奖*/}
        <Modal destroyOnClose="true"
            bodyStyle={{ "padding": "0", "margin": "0", }}
            className="fd-modal-overlayContent"
            width={280}
            onCancel={() => setVisible(false)}
            title={name}
            closable={false}
            visible={visible}
            centered={true}
            footer={null}>
            <div className="overlayContent">
                <div className="unset">
                    <div className="title">{t('fudai_syjb', { num: luckBag.totalAnchorGold })}{JSON.parse(JSON.stringify(showLuckBag))}</div>
                    <div className="tips">{t('fudai_syfd', { num: luckBag.peopleNum })}  |  {t('fudai_sycy', { num: luckBag?.giftLuckBagDetailVO?.joinNum || 0 })}</div>
                    <div className="statusImg">
                        <img src={require('../../../assets/images/live/lucky_bag/status02.png')} alt="" />
                    </div>
                    <div className="look">
                        {t('lwCountingDown')} {downTime}
                    </div>
                    <span className="icon icon-close" onClick={() => {
                        setVisible(false)
                        showLuckBagSet(true)
                    }}></span>
                </div>
            </div>
        </Modal>

        {/* 中奖状态 中奖 1*/}
        <Modal destroyOnClose="true"
            bodyStyle={{ "padding": "0", "margin": "0", }}
            className="fd-modal-overlayContent"
            width={280}
            onCancel={() => setShowRes1(false)}
            title={name}
            closable={false}
            visible={showRes1}
            centered={true}
            footer={null}>
            <div className="overlayContent">
                <span className="icon icon-close" onClick={() => { setShowRes1(false) }}></span>
                <div className="unset">
                    <div className="title">{t('fudai_gongxi')}</div>
                    <div className="tips">{t('fudai_huodejinbi', { num: resData.averageGold })}</div>
                    <div className="statusImg">
                        <img src={require('../../../assets/images/live/lucky_bag/status02.png')} alt="" />
                    </div>
                    <div className="look" onClick={async () => {
                        const res = await GetLuckBagUserList({
                            luckBagConfigId: resData.luckBagConfigId,
                            luckBagDetailId: resData.luckBagDetailId
                        })
                        if (!(res instanceof Error)) {
                            luckManSet(res)
                            setRecordVisible(true)
                        }
                    }}>
                        {t('fudai_chakanxinyun')}
                        <img src={require('../../../assets/images/live/lucky_bag/right-icon.png')} alt="" />
                    </div>
                </div>
            </div>
        </Modal>

        {/* 中奖状态 未中奖2*/}
        <Modal destroyOnClose="true"
            bodyStyle={{ "padding": "0", "margin": "0", }}
            className="fd-modal-overlayContent"
            width={280}
            onCancel={() => setShowRes2(false)}
            title={name}
            closable={false}
            visible={showRes2}
            centered={true}
            footer={null}>
            <div className="overlayContent">
                <span className="icon icon-close" onClick={() => { setShowRes2(false) }}></span>
                <div className="unset">
                    <div className="title">{t('fudai_meiyouchouzhong')}</div>
                    <div className="tips">{t('fudai_songniyunqi')}</div>
                    <div className="statusImg">
                        <img src={require('../../../assets/images/live/lucky_bag/status01.png')} alt="" />
                    </div>
                    <div className="look" onClick={async () => {
                        const res = await GetLuckBagUserList({
                            luckBagConfigId: resData.luckBagConfigId,
                            luckBagDetailId: resData.luckBagDetailId
                        })
                        if (!(res instanceof Error)) {
                            luckManSet(res)
                            setRecordVisible(true)
                        }
                    }}>
                        {t('fudai_chakanxinyun')}
                        <img src={require('../../../assets/images/live/lucky_bag/right-icon.png')} alt="" />
                    </div>
                </div>
            </div>
        </Modal>

        {/* 中奖记录 */}
        <Modal destroyOnClose="true"
            bodyStyle={{ "padding": "0", "margin": "0", }}
            className="fd-modal-overlayContent"
            width={280}
            onCancel={() => serRecordVisible(false)}
            title={name}
            closable={false}
            visible={recordVisible}
            centered={true}
            footer={null}>
            <div className="overlayContent">
                <span className="icon icon-close" onClick={() => { setRecordVisible(false) }}></span>
                <div className="unset">
                    <div className="title">{t('fudai_xinyunmingdan')}</div>
                    <div className="tips">{t('fudai_syren', { num: luckMan.length })}</div>
                    <div className="list">
                        {luckMan.map((e, i) => {
                            return <div key={i} className="item">
                                <div className="avatar"><img src={e.avatar} alt="" /></div>
                                <div className="name">{e.nickname}</div>
                                <div className="gold">{e.awardGold} {t('gold_coins')}</div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    </>
}