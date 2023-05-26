import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import flvjs from 'flv.js'
import './style/player.scss'
import { GetLiveDetail } from '../../../api/live'
import { gameIconMap } from '../../../components/live/detail/game/gameShow'
import Piking from '../../../components/live/detail/player/piking2';
import GiftShow from '../../../components/live/detail/player/giftShow';
import LuckyBag from './luckBag'
import GiftsToWX from './GiftsToWX'
import { useLocation } from "react-router-dom";
import useContextReducer from '../../../state/useContextReducer'
import i18n from '../../../language/config'
import { liveListV2 } from '@/api/live'
import { Local } from '@/common'

let initTimer, flvPlayer = {}, flvPlayerDom = {}, ctx, canvas, video
const Player2 = (props) => {
    const { giftList, pikingResult, gameResultList, waterTop, showAniList, pkingShows } = props
    const { state } = useLocation();
    const { t } = useTranslation();

    const {
        state: {
            live: { liveDetail, liveData },
        },
        fetchUtils: {updateLiveTagRooms},
        dispatch
    } = useContextReducer.useContextReducer();
    const { liveListRoomBaseVO, liveId, liveListAnchorInfoVO } = liveDetail

    const [flvUrl, flvUrlSet] = useState('')
    const [pkingShow, pkingShowSet] = useState(false)
    const [qualityList, qualityListSet] = useState([
        { id: "BD", name: t('quality_BD') },
        { id: "HD", name: t('quality_HD') },
        { id: "SD", name: t('quality_SD') },
    ])
    const [activeQuality, activeQualitySet] = useState(sessionStorage.getItem('activeQuality') || 'SD')
    const [activeQualityName, activeQualityNameSet] = useState('')
    const [configBase, configBaseSet] = useState({})
    const [pikingDom, pikingDomSet] = useState()
    const [iframes, iframesSet] = useState('')

    const iframesRef = useRef('')

    const adJumpUrlRef = useRef('')
    const webRtcUrlRef = useRef('')
    // const [ctx, ctxSet] = useState()

    useEffect(() => {
        pkingShowSet(pkingShows)
    }, [pkingShows])

    const storeEvent = (e) => {
        if (e.type === 'setBaseInfo') {
            configBaseSet(e.payload)
        }
    }
    useEffect(() => {
        activeQualityNameSet(qualityList.find(e => {
            return e.id == activeQuality
        }).name)
        window.eventBus.addListener('store', storeEvent)
        window.eventBus.addListener('getLiveDetails', getLiveDetail)
        window.eventBus.addListener('reinitGefits', reinitGefit)
        return () => {
            clearInterval(initTimer)
            // 销毁player
            flvPlayerDom?.destroy && flvPlayerDom?.destroy()
            window.eventBus.removeListener('store', storeEvent)
            window.eventBus.removeListener('getLiveDetails', getLiveDetail)
            window.eventBus.removeListener('reinitGefits', reinitGefit)
        }
    }, [])
    useEffect(() => {
        if (liveListRoomBaseVO && liveListRoomBaseVO.flvUrl) {
            // if (liveListRoomBaseVO?.isAutoLive == 1) {
            //     iframesSet(`/videoOfficial.html?mp4s=${liveListRoomBaseVO?.loopVideoUrl}`)
            //     iframesRef.current = `/videoOfficial.html?mp4s=${liveListRoomBaseVO?.loopVideoUrl}`
            // } else {
            //     getLiveDetail()
            // }

            getLiveDetail()
        } else {
            freshLiveDetail()
        }
    }, [liveDetail, liveListRoomBaseVO])

    const freshLiveDetail = async () => {
        const res = await liveListV2({ uid: Local("userInfo2")?.uid || "", type: 0 });
            if (!(res instanceof Error)) {
                if (res) {
                    const tagList = res?.tagListVOS || []
                    const listData = res?.listDataVos || []
                    tagList.map(item => {
                        item.liveDetails = []
                        item.liveIds.map(liveId => {
                            listData.forEach(detail => {
                                if (liveId === detail.liveId) {
                                    item.liveDetails.push(detail)
                                }
                            })
                        })
                    })
                    updateLiveTagRooms(tagList);
                    dispatch(() => {
                        return {
                            type: "live/SetLiveData",
                            payload: res,
                        };
                    });
                }
            }
    }

    const getPkingChild = (dom) => {
        pikingDomSet(dom)
    }
    const getUrl = (url) => {
        if (!url || !url.replace) return ''
        let newUrl = url.replace('https:', '').replace('http:', '')
        return newUrl
    }
    const getLiveDetail = () => {
        console.log('liveDetail-----------------pk状态改变', liveDetail, liveListRoomBaseVO.flvUrl);

        if (liveListRoomBaseVO?.isAd == 1 && liveListRoomBaseVO?.adJumpUrl) {
            let adJumpUrl = getUrl(liveListRoomBaseVO?.adJumpUrl)
            let webRtcUrl = getUrl(liveListRoomBaseVO?.webRtcUrl)
            // adJumpUrlSet(adJumpUrl)
            // webRtcUrlSet(webRtcUrl)

            console.log('webRtcUrlRef.current------------', adJumpUrlRef.current, webRtcUrlRef.current);

            adJumpUrlRef.current = adJumpUrl
            webRtcUrlRef.current = webRtcUrl


            initVideoPlayer('videoElement')
            return
        }
        // GetLiveDetail({ liveId: baseInfo.liveId, type: baseInfo.type, anchorId: baseInfo.anchorId, password: state?.password }).then(rt => {
        //     window.eventBus.emit('GetLiveDetailPC', rt)
        //     window.eventBus.emit('contactFlagS2', rt?.contactFlag)

        //     if (!rt) {
        //         setTimeout(() => {
        //             window.location.href = '/live/list';
        //         }, 1000)
        //         return
        //     }
        //     let flvUrl = getUrl(rt.flvUrl)
        //     flvUrlSet(flvUrl)
        //     roomSet(rt)
        //     initPlayer('videoElement', rt.flvUrl)
        //     initCanvas()
        // })

        // liveDetail
        let flvUrl = getUrl(liveListRoomBaseVO?.flvUrl)
        flvUrlSet(flvUrl)

        console.log('flvUrl-----------', liveListRoomBaseVO?.flvUrl, flvUrl);

        initPlayer('videoElement', flvUrl)
        initCanvas()
    }
    const replay = () => {
        Object.keys(flvPlayer).forEach(key => {
            console.log(flvPlayer, key, "flyPlayer")
            // this.flvPlayer[key]?.load();
            // this.flvPlayer[key]?.play();
        })
    }
    const reinitGefit = (gift) => {
        // pikingDom && pikingDom.UPpkStatus(gift)
        window.eventBus.emit('UPpkStatusF', gift)
    }
    const initCanvas = () => {
        canvas = document.getElementById('videoCanvas')
        video = document.getElementById('videoElement')
        ctx = canvas.getContext('2d')
        initTimer = setInterval(() => {
            captureFrame()
        }, 20)
    }
    const captureFrame = () => {
        let playBox = document.getElementById('playerBox')
        let w = playBox?.clientWidth
        let h = playBox?.clientHeight
        ctx.fillStyle = '#000'
        canvas.width = w;
        canvas.height = h;
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(video, 0, 0, w, h)
    }
    const initPlayer = (name, url) => {
        var videoElement = document.getElementById(name);
        console.log('videoElement--------------------------------', videoElement, url);

        flvPlayerDom = flvjs.createPlayer({
            type: 'flv',
            url: url,
        })
        flvPlayerDom.attachMediaElement(videoElement);
        flvPlayerDom.load();
        flvPlayerDom.play();
        flvPlayer[name] = flvPlayerDom;
    }

    const initVideoPlayer = (name) => {
        var videoElement = document.getElementById(name);
        var flvPlayer = flvjs.createPlayer({
            type: 'mp4',
            url: adJumpUrlRef.current || webRtcUrlRef.current
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        flvPlayer[name] = flvPlayer;
    }

    return (
        <div className='player-box' id="playerBox">
            {
                !pkingShow && liveListRoomBaseVO?.isAd != 1 ?
                    <div className='shuiyin' style={{ top: waterTop }}>
                        <img src={require('../../../assets/images/live/logo.png')} alt="" /><div className='flex zooms'>
                            <div className='zoom'>{t('fangjianhao')}</div>
                            <div>{liveId}</div>
                        </div>
                    </div> : ''
            }

            {Number(configBase.isCpStart) == 0 && gameResultList.length ? gameResultList.map((item, index) => (
                <div className='run-frames-right-to-left' style={{ bottom: index * 120 + 30 }} key={index}>
                    <div className='expect'> {t('issue')} {item.expect}</div>
                    <div className='flex f-a-c'>
                        <div style={{ marginRight: 10 }}>{item.nickName}</div>
                        {
                            item.resultList.map((iitem, iindex) => <div key={iindex} className={'count-num ' + (item.name == 'yflhc' && 'yflhc-icon')}>
                                {gameIconMap[item.name] ? <img className='game-icon' src={gameIconMap[item.name].icon[iitem]} alt="" /> : <span className={'game-icon text-icon '} >{iitem}</span>}
                            </div>)
                        }
                    </div>
                </div>
            )) : ''}
            {
                // pkingShow &&
                liveListRoomBaseVO.pking &&
                <Piking
                // getPkingChild={getPkingChild}
                // pikingResult={pikingResult}
                // password={state?.password}
                // close={() => pkingShowSet(false)}
                // anchorId={liveListRoomBaseVO?.anchorId} 
                />
            }

            {/* <GiftShow giftList={giftList} showAniList={showAniList} /> */}


            {liveListRoomBaseVO?.isAd == 0 &&
                <>
                    <canvas className='bg-video' id="videoCanvas" />
                    <div className='bg-opacity'></div>
                </>
            }
            <video onClick={replay} style={{ height: 600, maxWidth: '100%' }} id="videoElement" />
            {/* isAutoLive==1 官方直播间，进行视频轮播 */}
            {
                liveListRoomBaseVO?.isAutoLive == 1 && <iframe id="videoElementMp4" className="player-box" src={`/videoOfficial.html?mp4s=${liveListRoomBaseVO?.loopVideoUrl}`} />
            }
            {/* 福袋 */}
            <div className='activity-box'>
                <LuckyBag anchorId={liveListRoomBaseVO?.anchorId} liveId={liveId} />
                {/* <GiftsToWX anchorId={liveListRoomBaseVO?.anchorId} liveId={liveId} /> */}
                <GiftsToWX
                    // giftsToWX={giftsToWX}
                    // giftsToWXF={(e) => {
                    // giftsToWXSet(e);
                    // }}
                    lang={i18n.language}
                    state={state}
                />
            </div>
        </div>
    );
}

export default Player2;
