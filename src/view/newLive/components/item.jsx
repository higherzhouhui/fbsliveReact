import React, { Component } from 'react';
let defaultImg = require('../../../assets/images/live/default_img_s.png')
let defaultLiverImg = require('../../../assets/images/default_img.png')
let pkImg = require('../../../assets/images/live/pk/pk.png')
let roompassImg = require('../../../assets/images/live/roompass.png')
let roompriceImg = require('../../../assets/images/live/roomprice.png')
let sockImg = require('../../../assets/images/live/sock-icon.png')
let phbImg = require('../../../assets/images/live/phb.png')
import { t } from "i18next"
class Item extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { info } = this.props;
        return (<div className='live-item'>
            {/* {
                info?.pking ? <img className={'pk ' + ([1, 2, 3, 4].includes(info.type) && 'two')} src={pkImg} /> : ''
            } */}
            {
                info?.type == 1 || info.type == 2 ? <img className='pk' src={roompriceImg} /> : ''
            }
            {
                info?.type == 4 ? <img className='pk' src={roompassImg} /> : ''
            }
            {
                info?.type == 3 ? <img className='pk' src={sockImg} /> : ''
            }
            {
                info?.liveStartLottery[0] != undefined && (
                    <div className="game-icon">
                        {info?.liveStartLottery.map((item_2) => {
                            return <img src={item_2.lorretyIcon} alt="" key={`${item_2.lorretyIcon}_${item_2.lotteryName}`} />;
                        })}
                    </div>
                )
            }
            {/* 图标 */}
            {
                <div className='activity-icon'>
                    {info?.pking && <img src={require("../../../assets/images/live/newPk.png")} />}
                    {/* 福袋 */}
                    {info?.isLuckBag == 1 && <img src={require("../../../assets/images/live/fudai.png")} alt="" />}
                    {/* 转盘 */}
                    {info?.isActivityRoulette == 1 && <img src={require("../../../assets/images/live/zhuanpan.png")} alt="" />}
                    {/* 跳到 */}
                    {info?.toy == 1 && <img src={require("../../../assets/images/live/tiaodan.png")} alt="" />}
                </div>
            }

            <div className='top-info'>
                <div className="logo">
                    {/* isAd 判断是视频直播还在主播 */}
                    <img className='logo-img' src={info.isAd ? info.livePicUrl || defaultImg : (info.avatar || defaultLiverImg)} alt="" />
                    {/* isAutoLive == 1 官方直播间 */}
                    {
                        info.isAutoLive == 1 && <img className='logo-img' src={info.livePicUrl || defaultImg} alt="" />
                    }
                    {info.liveRoomLabel &&
                        <span className='liveLabel'>
                            <img className='phbImg' src={phbImg} alt="" />
                            <span>{info.liveRoomLabel} </span>
                        </span>}
                </div>
            </div>
            <div className='bottom-info'>
                <div className='bottom-info-t'>
                    <div className='nickname'>{info.nickname}</div>
                    <div className='right'>
                        <img src={require('../../../assets/images/live/zb.png')} alt="" />
                        <span className='num'>{info.rq}</span>
                    </div>
                </div>
                <div className='bottom-info-b'> {info.signature || t('live_stitle')} </div>
            </div>
        </div>)
    }
}
export default Item