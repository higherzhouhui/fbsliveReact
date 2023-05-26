import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Input } from 'antd';
import { useTranslation } from "react-i18next";
import { LiveChat, liveFollow } from '../../../api/live'
import Chat from "../../../utils/Chat"
import { useNavigate } from 'react-router-dom'

import './style/chat.scss'
let Im = null
export default (props) => {
    const history = useNavigate()
    let { baseInfo, onShowResult, suspends } = props
    const { t } = useTranslation()
    const [msgHistory, setMsgHistory] = useState([])
    const [sendLoading, setSendLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [gift, setGift] = useState([])
    const [focusVisible, setFocusVisible] = useState(false)
    const [collectLoding, setCollectLoding] = useState(false)

    const hisEl = useRef(null);
    const sendLiveChat = () => {
        if (sendLoading || !msg) return
        setSendLoading(true)
    //    return  history('/live/list')
        // return window.location.href = '/live/list'
        LiveChat({ liveId: baseInfo.liveId, msg }).then(() => {
            setSendLoading(false)
            setMsg('')
        })
    }
    const getGiftName = (gid) => {
        let tempGift = gift.map(e => {
            return e.propBaseResponses
        })
        const flattenedGift = tempGift.reduce((acc, cur) => acc.concat(cur), []);
        let [item] = flattenedGift.filter((item) => item.gid === gid);
        return item ? item.gname : "";
    }
    const GetLiveDetailPC = (e) => {
        console.log(e, "e")
        // const { domList } = this.state
        // let data = [...domList]
        // if (e.hotSportInfo !== null && e.hotSportInfo[0] !== undefined && e.hotSportInfo.length > 0) {
        //     e.hotSportInfo.forEach((value) => {
        //         data.push({ ...value, hotSportInfo: e.hotSportInfo.length })
        //     })
        // }
        // console.log(data, "e.hotSportInfo")
        // this.setState({ domList: data })
    }
    // 
    const getMsg = (data) => {
        window.eventBus.emit('liveChatMsg', data)
        console.log(data.protocol, `直播间推送IM类型,现在类型是-----------${data.protocol}------------`)
        // 2 退出直播间
        if (data.protocol == 2) {
            return window.location.href = '/live/list'
        }
        // 7 礼物消息
        if (data.protocol == 29 || data.protocol == 7 || data.protocol == 24 || data.protocol == 18) {
            onShowResult(data)
        }
        if (data.protocol == 3 && data.live === false) {
            suspends(false)
        } else if (data.protocol == 3 && data.live === true) {
            suspends(true)
        }
        // 5 欢迎，9发言消息
        let pro = [5, 9];
        console.log(data, "data")
        setMsgHistory((msgH) => {
            if (pro.includes(data.protocol)) {
                // console.log(5, "555")
                if (data.nickname) {
                    msgH.push(data)
                }
            } else {
                msgH.push(data)
            }
            // console.log(msgH);
            return [...msgH]
        })
        // console.log(msgHistory, "msgHistory")
// 
    }

    const init = useCallback(() => {
        Im = new Chat({ liveId: baseInfo.liveId })
        Im.on('getMsg', (msg) => {
            msg.map(e => {
                if (e.payload && e.payload.text) {
                    getMsg(JSON.parse(e.payload.text))
                }
            })
        })
    }, []);
    useEffect(() => {
        init();
    }, [init]);
    //获取到礼物列表
    useEffect(() => {
        setMsgHistory([])
        // window.eventBus.addListener('GetLiveDetailPC', GetLiveDetailPC)
        window.eventBus.addListener("getGift", (data) => {
            setGift(data || [])
        });
        window.eventBus.addListener("topFollow", () => {
            setFocusVisible(false)
        })
    }, []);
    useEffect(() => {
        hisEl.current.scrollTo(0, 9999999);
    }, [msgHistory]);
    /**
     * 1. 直播间关注卡片
     * 2. 如果未关注，10s后弹出关注卡片，16.5秒后自动隐藏关注卡片
     * 3. 关注刷新顶部的关注，卡片收起
     */
    useEffect(() => {
        if (baseInfo.isFollow) return
        setTimeout(() => { setFocusVisible(true) }, 10000);
        setTimeout(() => { setFocusVisible(false) }, 16500);
    }, [])

    const beforeunload = (e) => {
        let confirmationMessage = '你确定离开此页面吗?';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }
    useEffect(() => {
        return () => {
            window.removeEventListener("beforeunload", beforeunload)
            // 这里写离开页面的后续操作
            // 项目中这个页面使用了im。所以在页面离开的时候，需要将im关闭掉
            // 关闭IM
            Im.logout()
        }
    }, [])
    useEffect(() => {
        // 拦截判断是否离开当前页面
        window.addEventListener('beforeunload', beforeunload);
    }, [])


    const rollowDom = () => {
        return <div className='focus_card'>
            <div className='focus_card_avatar'>
                <img src={baseInfo.avatar} alt="" />
            </div>
            <div className='focus_card_info'>
                <div className='focus_card_info_name'>{baseInfo.nickname}</div>
                <div className='focus_card_info_tips'>{t('comeFollow')}</div>
            </div>
            <div className={`focus_card_btn ${collectLoding && 'loading'}`} onClick={() => { changeFollow() }}>+ {t('guanzhu')}</div>
        </div>
    }
    const changeFollow = async () => {
        setCollectLoding(true)
        const rt = await liveFollow({ isFollow: true, targetId: baseInfo.anchorId })
        if (!(rt instanceof Error)) {
            window.eventBus.emit('chatFollow', true)
            setTimeout(() => {
                setCollectLoding(false)
                setFocusVisible(false)
            }, 1000);
        }
    }
    return <div className='live-detail-box-chat'>
        <div className='baseColor'>{t('liveNotice1')}{t('liveNotice2')}{t('liveNotice3')}</div>
        <div className='focusBox'>
            <div className="page">
                <div className={`dialog ${focusVisible ? "dialog_visible" : ''}`}>
                    {rollowDom()}
                </div>
            </div>
        </div>
        <div className='live-detail-box-chat-content' ref={hisEl}>
            {
                msgHistory.map((item, index) => {
                    return <div className='item' key={index}>
                        {/* <div style={{ color: "#fff" }}>{item.protocol}---111---{item.tipType}</div> */}
                        {/* 欢迎光临消息 */}
                        {
                            item.protocol == 5 && <div className='name_color'> {t('welcomeRoom').replace('$A', item.nickname)} </div>
                        }
                        {/* 送礼物消息 */}
                        {
                            item.protocol == 7 && <div className='name_color'>
                                {item.userLevel && <img style={{ height: 14, verticalAlign: 'middle', marginTop: '-1px' }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                                <span>{item.nickname}</span> {t('songchu')} <span className="gaoliang"> {getGiftName(item.gid)}
                                    {item.count > 1 && <span> x {item.count}</span>}
                                </span>
                            </div>
                        }
                        {/* 聊天消息 */}
                        {
                            item.protocol == 9 && item.tipType !== 2 && <div className='f-a-c'>
                                <div>
                                    {item.userLevel && <img style={{ height: 14, verticalAlign: 'middle', marginTop: '-1px' }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                                    <span className='name_color' style={{ marginLeft: 5 }}>{item.nickname}: </span>
                                    <span className='msg' style={{ color: '#fff', verticalAlign: 'top', fontSize: '14', fontWeight: 400 }}>{item.msg}</span></div>
                            </div>
                        }
                        {/* 张三在五分快三投注了5金币 */}
                        {
                            item.protocol == 26 &&
                            <>
                                {item.userLevel && <img style={{ height: 14, verticalAlign: 'middle', marginTop: '-1px' }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                                <div className='name_color'> {item.nickName} <span className='name_color'>{t('zai')} {item.name} {t('tou_zhu_l')} {item.totalCoin}{t('gold_coins')}</span> </div>
                            </>
                        }
                        {/* 张三在五分快三赢得了5金币 */}
                        {
                            item.protocol == 27 &&
                            <>
                                {item.userLevel && <img style={{ height: 14, verticalAlign: 'middle', marginTop: '-1px' }} src={require(`../../../assets/images/liveDetail/level_icon/level_${item.userLevel}.png`)} />}
                                <div className='name_color'>{item.nickName} <span className='name_color'>{t('zai')} {item.name} {t('ying_de_l')} {item.winMoney}{t('gold_coins')}</span></div>
                            </>
                        }
                        {/* {
                            item.protocol == 999 && rollowDom(item)
                        } */}
                        {/* 公屏推送 */}
                        {item.protocol === 9 && item.tipType === 2 && <>
                            <a
                                // liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.price}&isAd=${item.isAd}&pking=${item.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}
                                href={`/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=0&price=null&isAd=0&pking=false`}>
                                <span className='baseColor' >{item.nickname} <span style={{ color: '#FFE762' }}>{t('songchu')}{item.gName} X{item.count} {t('to')} </span> {item.anchorNickname} <span style={{ color: '#55FFD1', textDecoration: 'underline' }}>{t('LookAroundQuickly')}</span> <img src={require('../../../wap/assets/image/live/lkqw.png')} alt="" style={{ width: '16px', height: '16px' }} /></span>
                            </a>
                        </>}
                        {
                            item.hotSportInfo > 0 && <>
                                <a href={`/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=0&price=null&isAd=0&pking=false`}>
                                    <div style={{ position: 'relative', backgroundImage: `url("${require(`../../../assets/images/live/imty/ty${(index + 1) <= 4 ? index + 1 : 4}.png`)}")`, backgroundSize: '100% 100%' }} >
                                        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '5px', position: 'relative' }}>
                                            <img src={require(`../../../assets/images/live/imty/tylog${(index + 1) <= 4 ? index + 1 : 4}.png`)} alt="" style={{ width: '40px', height: '22px', margin: '5px 0' }} />
                                            <div style={{ fontSize: '12px', fontWeight: '500', color: '#333', marginLeft: '5px', }}>
                                                <span>{t('HotD')} {item.opp1} vs {item.opp2}</span> <span style={{ fontSize: '10px', color: '#5E29DF' }}>{t('gatherAndWatch')}</span>
                                            </div>
                                            <img src={require('../../../assets/images/live/imty/right.png')} alt="" style={{ width: '16px', height: '16px' }} />
                                        </div>
                                        <img src={require(`../../../assets/images/live/imty/ty${(index + 1) <= 4 ? index + 1 : 4}.png`)} alt="" style={{ height: '32px', position: 'absolute', top: '0', left: '0' }} />
                                    </div>
                                </a>
                            </>
                        }
                    </div>
                })
            }
        </div>
        <div className='live-detail-box-chat-input'>
            <div className='flex'>
                <Input onPressEnter={() => sendLiveChat()} onChange={(e) => setMsg(e.target.value)} placeholder={t('liaotian_p')} value={msg} />
                <div onClick={() => sendLiveChat()}
                    className={`icon icon-send ${sendLoading && 'loading'}`}></div>
            </div>
        </div>
    </div >
}