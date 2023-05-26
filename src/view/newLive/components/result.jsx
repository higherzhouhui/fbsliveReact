// 开奖记录/投注记录
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { GetSomeGameFirstHistory, GetAllGameHistory, GetBetHistorByUid } from '../../../api/game'
import { gameIconMap } from './js/gameShow'
import { Empty } from 'antd';
import { stampToTimeStr } from '../../../utils/tools';
import InfiniteScroll from 'react-infinite-scroll-component';

import Draggable from 'react-draggable';
import './style/result.scss'
let loseImg = require(`../../../assets/images/liveDetail/jlose.png`)//输
let winImg = require(`../../../assets/images/liveDetail/jwin.png`)//赢
let noOpenImg = require(`../../../assets/images/liveDetail/jnoopen.png`)//未开奖
export default () => {
    const { t } = useTranslation()
    const [list, setList] = useState([])
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [allHistoryLoading, setAllHistoryLoading] = useState(false)
    const [allHistory, setAllHistory] = useState([])
    const [gameName, setGameName] = useState('')
    const tab = [
        { index: 0, title: t('kjjl') },
        { index: 1, title: t('ui_bet_record') },
    ]
    const [tabIndex, setTabIndex] = useState(0)
    const [tab0DetailVisible, setTab0DetailVisible] = useState(false)
    const [tab1DetailVisible, setTab1DetailVisible] = useState(false)
    const [name, setName] = useState('')
    const [list1, setList1] = useState([])
    const [page, setPage] = useState(0)
    const [detail, setDetail] = useState({})
    const onTab = (index) => {
        setTabIndex(index)
        if (index == 0) {
            setTab0DetailVisible(false)
            getSomeGameFirstHistory();
        } else {
            setTab1DetailVisible(false)
            setPage(0)
            setList1([])
            getBetHistorByUid(0);
        }
    }
    const listShow = () => {
        window.eventBus.emit('closeAll')
        if (visible) setVisible(false)
        setList([])
        setVisible(!visible)
        setTab0DetailVisible(false)
        setTab1DetailVisible(false)
        onTab(0)
    }
    const getSomeGameFirstHistory = () => {
        setLoading(true)
        GetSomeGameFirstHistory().then(rt => {
            setList(rt || [])
            setLoading(false)
        })
    }
    const getBetHistorByUid = (page1) => {
        setLoading(true)
        let pageTag = page1 ? page1 : page
        GetBetHistorByUid({ page: pageTag, }).then(rt => {
            setLoading(false)
            if (rt.length > 0) {
                setPage(page + 1)
            }
            if (page == 0) {
                setList1(rt || [])
            } else {
                setList1(list1.concat(rt || []))
            }
        })
    }
    // 开奖记录
    const getContent0 = () => {
        return <div>
            {list.map((item, index) => (<div onClick={() => choice0(item)} className='result-item' key={index}>
                <div className='flex f-j-sb'>
                    <div className='nickName'>{item.nickName}</div>
                    <div className='timer'>{item.expect}</div>
                </div>
                <div className='flex f-j-sb b-t-i' style={{ alignItems: 'end' }}>
                    <div className='flex'>{
                        item.lotteryResult && item.lotteryResult.map((iitem, index) => {
                            return (gameIconMap[item.lotteryName] ?
                                <img className='result-icon' key={index} src={gameIconMap[item.lotteryName].icon[iitem]} /> :
                                <div className={'item ' + (item.lotteryName == 'yflhc' && 'lhc')} key={index}>{iitem}</div>)
                        })
                    }
                    </div>
                </div>
            </div>))}
            {!list.length ? <Empty style={{ color: '#fff', marginTop: '150px' }} description={t('noData')} /> : ''}
        </div>
    }
    // 开奖记录-detail
    const getAllHistoryContent = () => {
        let iconData = gameIconMap[gameName] && gameIconMap[gameName].icon
        return <div className={'all-history-box2 ' + (allHistoryLoading && 'loading')}>
            {allHistory.map((item, index) => (
                <div className='all-history-box2-item' key={`${item.id}_${index}`}>
                    <div>{t("f_ui_num_period", { num: item.expect })}</div>
                    <div className='flex' style={{ width: '100%', overflowX: 'auto' }}>
                        {item.lotteryResult && item.lotteryResult.map((iitem, index) => (
                            iconData ? <img key={index} src={iconData[iitem]} /> :
                                <div className={'text-icon ' + (gameName == 'yflhc' && 'lhc')} key={index}>{iitem}</div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    }

    // 投注记录
    // height: 470, overflow: 'auto', margin: "0 10px" 
    const getContent1 = () => {
        return <div>
            {/* <InfiniteScroll hasMore={listHasMore} loadMore={() => getMatchList()}></InfiniteScroll> */}
            <InfiniteScroll
                next={() => getBetHistorByUid()}
                hasMore={list1.length < 1000}
                dataLength={list1.length}
                scrollableTarget="scrollableDiv"
            >
                {/* {list1.length < 1000 ? 1 : 2} */}
                {
                    list1.map((item, index) => (<div onClick={() => choice1(item)} className='betting-item' key={`${item.icon}_${index}`}>
                        <img className='game-icon' src={item.icon} alt="" />
                        <div className='betting-info'>
                            <div>{item.nickName}</div>
                            <div className='timer'>{stampToTimeStr(item.createTime, 'sec')}</div>
                        </div>
                        <div className='right'>
                            <img className='result-img' src={item.awardStatus == 0 ? noOpenImg : item.awardStatus == 1 ? loseImg : winImg} alt="" />
                            <div >{t('bet')} <span>{item.betAmount}</span></div>
                        </div>
                    </div>))
                }
                {!list1.length ? <Empty style={{ color: '#fff', marginTop: '150px' }} description={t('noData')} /> : ''}
            </InfiniteScroll>
        </div>
    }

    const getDetail = () => {
        return <div>
            <div className='betting-detail-container'>
                <img className='game-icon' src={detail.icon} alt="" />
                <div className='nickName'>{detail.nickName}</div>
                <div className='expect'>
                    {detail.playNumReq?.expect || detail.expect}
                </div>
                <div style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }} className='flex f-j-sb'><div>{t('bet_history_lab_bet_amount')}</div> <div className='value'>{detail.betAmount}</div></div>
                <div className='flex f-j-sb'><div>{t('beishu')}</div> <div className='value'>{detail.times}</div></div>
                <div className='flex f-j-sb'><div>{t('rp_bet_amount')}</div> <div className='value'>{detail.betAmount}</div></div>
                <div style={{ borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }} className='flex f-j-sb'><div>{t('xzsj')}</div> <div className='value'>{stampToTimeStr(detail.createTime, 'sec')}</div></div>
                <div className='flex f-j-sb'><div>{t('xzxq')}</div> <div className='value'>{detail.playNumReq && detail.playNumReq.num}</div></div>
                <div className='flex f-j-sb'><div>{t('bet_history_lab_winning_amount')}</div> <div className='value'>{detail.realProfitAmount}</div></div>
                <div className='flex f-j-sb'><div>{t('live_pjfs')}</div> <div className='value'>{detail.payMethd == 0 ? t('live_wpj') : detail.payMethd == 1 ? t('live_zdpj') : t('live_bcpj')}</div></div>
                <div className='flex f-j-sb'><div>{t('live_pjsj')}</div> <div className='value'>{stampToTimeStr(detail.updateTime, 'sec')}</div></div>
                <div style={{ marginTop: '8px', borderRadius: '5px' }} className='flex f-j-sb'><div>{t('live_kjdh')}</div>
                    <div className='result'>{detail.resultList && detail.resultList.length ? <div className='value flex'>{getIMG(detail.lotteryName, detail.resultList)}</div> : ''}</div>
                </div>
                <img className='result-img' src={detail.awardStatus == 0 ? noOpenImg : detail.awardStatus == 1 ? loseImg : winImg} alt="" />
            </div>
        </div>
    }
    const getIMG = (name, list) => {
        let map = gameIconMap[name] && gameIconMap[name].icon
        return list.map((item, index) => (
            map ? <img key={`${map[item]}_${index}`} src={map[item]} /> : <div key={`${item}_${index}`} className={'iconNum ' + (name == 'yflhc' && 'lhc')}>{item}</div>
        ))
    }
    const choice0 = (detail) => {
        let { lotteryName, nickName } = detail;
        setName(nickName)
        setTab0DetailVisible(true)
        setGameName(lotteryName)
        getAllGameHistory(lotteryName);
    }
    const choice1 = (detail) => {
        setTab1DetailVisible(true)
        setDetail(detail)
    }
    // 获取所有历史
    const getAllGameHistory = (lotteryName) => {
        setAllHistoryLoading(true)
        setAllHistory([])
        GetAllGameHistory({ lotteryName, page: 0 }).then(rt => {
            setAllHistory(rt)
            setAllHistoryLoading(false)
        })
    }
    return <div>
        <div className="result-container">
            <div onClick={() => listShow()}>
                <div className="icon icon-live-record"></div>
                <div className="title">{t('live_jl')}</div>
            </div>
            {visible && <Draggable>
                <div className="result-container-alert">
                    <span className="result-container-close icon-close" onClick={() => setVisible(false)}></span>
                    <div className='result-container-tab'>
                        {(!tab0DetailVisible && !tab1DetailVisible) && tab.map((item, index) => {
                            return <div onClick={() => onTab(index)} className={`tabs ${tabIndex === index && 'active'}`}>{item.title}</div>
                        })}
                        {tab0DetailVisible && <span className='tabs'>{name}</span>}
                        {tab1DetailVisible && <span className='tabs'>{t('live_tzxq')}</span>}
                    </div>
                    {/* 开奖记录 */}
                    {tabIndex == 0 && <div style={{ height: 470, overflow: 'auto', margin: "0 10px" }} className={'a ' + (loading && 'loading')}>
                        {tab0DetailVisible == true && <span className="result-container-goback icon-goback" onClick={() => setTab0DetailVisible(false)}></span>}
                        {tab0DetailVisible ? getAllHistoryContent() : getContent0()}
                    </div>}
                    {/* 投注记录 */}
                    {tabIndex == 1 && <div id="scrollableDiv" style={{ height: 470, overflow: 'auto', margin: "0 10px" }} className={'a ' + (loading && 'loading')}>
                        {tab1DetailVisible == true && <span className="result-container-goback icon-goback" onClick={() => setTab1DetailVisible(false)}></span>}
                        {tab1DetailVisible ? getDetail() : getContent1()}
                    </div>}
                </div>
            </Draggable>}
        </div>
    </div>
}