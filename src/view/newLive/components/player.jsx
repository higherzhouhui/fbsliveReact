
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import flvjs from 'flv.js'
import './style/player.scss'
import { GetLiveDetail } from '../../../api/live'
import { gameIconMap } from '../../../components/live/detail/game/gameShow'
import Piking from '../../../components/live/detail/player/piking';
import GiftShow from '../../../components/live/detail/player/giftShow';
import LuckyBag from './luckBag'
import GiftsToWX from './GiftsToWX'

class Player extends Component {
    constructor(props) {
        super(props)
        let { t } = props;
        this.state = {
            flvUrl: '',
            adJumpUrl: '',
            webRtcUrl: '',
            pkingShow: false,
            showAniList: [],
            qualityList: [
                { id: "BD", name: t('quality_BD') },
                { id: "HD", name: t('quality_HD') },
                { id: "SD", name: t('quality_SD') },
            ],
            activeQuality: sessionStorage.getItem('activeQuality') || 'SD',
            activeQualityName: '',
            room: {},
            configBase: {}
        }
        this.replay = this.replay.bind(this)
        this.getPkingChild = this.getPkingChild.bind(this)
        this.flvPlayer = {}
        this.flvPlayerDom = {}
        this.storeEvent = this.storeEvent.bind(this)
    }

    storeEvent(e) {
        if (e.type === 'setBaseInfo') {
            this.setState({ configBase: e.payload })
        }
    }
    componentWillUnmount() {
        clearInterval(this.initTimer)
        window.eventBus.removeListener('store', this.storeEvent)
    }
    componentDidMount() {
        setTimeout(() => {
            this.getLiveDetail()
            this.props && this.props.getPlayerDom(this)
        }, 10)
        let { qualityList, activeQuality } = this.state;
        this.setState({
            activeQualityName: qualityList.find(e => {
                return e.id == activeQuality
            }).name
        })
        window.eventBus.addListener('store', this.storeEvent)
    }
    getPkingChild(dom) {
        this.pikingDom = dom
    }
    getUrl(url) {
        if (!url || !url.replace) return ''
        let newUrl = url.replace('https:', '').replace('http:', '')
        return newUrl
    }
    getLiveDetail() {
        let { baseInfo } = this.props;
        if (baseInfo.isAd == 1 && baseInfo.adJumpUrl) {
            let adJumpUrl = this.getUrl(baseInfo.adJumpUrl)
            let webRtcUrl = this.getUrl(baseInfo.webRtcUrl)
            this.setState({
                adJumpUrl,
                webRtcUrl,
            }, () => {
                this.initVideoPlayer('videoElement')
            })
            return
        }
        GetLiveDetail({ liveId: baseInfo.liveId, type: baseInfo.type, anchorId: baseInfo.anchorId, password: baseInfo.password }).then(rt => {
            window.eventBus.emit('GetLiveDetailPC', rt)
            window.eventBus.emit('contactFlagS2', rt.contactFlag)

            if (!rt) {
                setTimeout(() => {
                    window.location.href = '/live/list';
                }, 1000)
                return
            }
            let flvUrl = this.getUrl(rt.flvUrl)
            this.setState({
                flvUrl,
                room: rt
            }, () => {
                this.initPlayer('videoElement', rt.flvUrl)
                this.initCanvas()
            })
        })
    }
    replay() {
        Object.keys(this.flvPlayer).forEach(key => {
            console.log(this.flvPlayer, key, "flyPlayer")
            // this.flvPlayer[key]?.load();
            // this.flvPlayer[key]?.play();
        })
    }
    reinitGefit(gift) {
        this.pikingDom && this.pikingDom.UPpkStatus(gift)
    }
    initCanvas() {
        this.canvas = document.getElementById('videoCanvas')
        this.video = document.getElementById('videoElement')
        this.ctx = this.canvas.getContext('2d')
        this.initTimer = setInterval(() => {
            this.captureFrame()
        }, 20)
    }
    captureFrame() {
        let playBox = document.getElementById('playerBox')
        let w = playBox.clientWidth
        let h = playBox.clientHeight
        this.ctx.fillStyle = '#000'
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx.fillRect(0, 0, w, h)
        this.ctx.drawImage(this.video, 0, 0, w, h)
    }
    initPlayer(name, url) {
        var videoElement = document.getElementById(name);
        this.flvPlayerDom = flvjs.createPlayer({
            type: 'flv',
            url: url,
        });
        this.flvPlayerDom.attachMediaElement(videoElement);
        this.flvPlayerDom.load();
        this.flvPlayerDom.play();
        this.flvPlayer[name] = this.flvPlayerDom;
    }

    initVideoPlayer(name) {
        let { adJumpUrl, webRtcUrl } = this.state;
        var videoElement = document.getElementById(name);
        var flvPlayer = flvjs.createPlayer({
            type: 'mp4',
            url: adJumpUrl || webRtcUrl
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        this.flvPlayer[name] = flvPlayer;
    }
    render() {
        let { t, baseInfo, giftList, pikingResult, gameResultList, waterTop } = this.props;
        let { pkingShow, showAniList, qualityList, activeQuality, activeQualityName, configBase } = this.state
        return (
            <div className='player-box' id="playerBox">
                {
                    !pkingShow && baseInfo.isAd != 1 ?
                        <div className='shuiyin' style={{ top: waterTop }}>
                            <img src={require('../../../assets/images/live/logo.png')} alt="" /><div className='flex zooms'>
                                <div className='zoom'>{t('fangjianhao')}</div>
                                <div>{baseInfo.liveId}</div>
                            </div>
                        </div> : ''
                }

                {Number(configBase.isCpStart) === 0 && gameResultList.length ? gameResultList.map((item, index) => (
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
                    pkingShow && baseInfo.anchorId ? <Piking
                        getPkingChild={this.getPkingChild}
                        pikingResult={pikingResult}
                        password={baseInfo.password}
                        close={() => this.setState({ pkingShow: false })}
                        anchorId={baseInfo.anchorId} /> : ''
                }
                <GiftShow giftList={giftList} showAniList={showAniList} />
                {baseInfo.isAd == 0 &&
                    <>
                        <canvas className='bg-video' id="videoCanvas" />
                        <div className='bg-opacity'></div>
                    </>
                }
                <video onClick={this.replay} style={{ height: 600, maxWidth: '100%' }} id="videoElement" />
                {/* isAutoLive==1 官方直播间，进行视频轮播 */}
                {
                    baseInfo.isAutoLive == 1 && <iframe id="videoElementMp4" className="player-box" src={`/videoOfficial.html?mp4s=${baseInfo.loopVideoUrl}`} />
                }
                {/* 福袋 */}
                <div className='activity-box'>
                    <LuckyBag anchorId={baseInfo.anchorId} liveId={baseInfo.liveId} />
                    <GiftsToWX anchorId={baseInfo.anchorId} liveId={baseInfo.liveId} />
                </div>
            </div>
        )
    }
}
export default withTranslation()(Player)