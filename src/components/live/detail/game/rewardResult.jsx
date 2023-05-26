// 投注记录
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GetBetHistorByUid } from '../../../../api/game'
import { stampToTimeStr } from '../../../../utils/tools';
import { gameIconMap, getGameName } from './gameShow'
import { Local } from '../../../../common';
import { Empty } from 'antd';
import './style/rewardResult.scss'
class RewardResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            page: 0,
            detail: {},
            visible: false,
            detailVisible: false,
            loading: false
        }
        this.getBetHistorByUid = this.getBetHistorByUid.bind(this)
        this.choice = this.choice.bind(this)
        this.getIMG = this.getIMG.bind(this)
        this.listShow = this.listShow.bind(this)
        this.closeAll = this.closeAll.bind(this)
    }
    closeAll() {
        this.setState({ visible: false, detailVisible: false })
    }
    componentDidMount() {
        window.eventBus.addListener('closeAll', this.closeAll)
    }
    componentWillUnmount() {
        window.eventBus.removeListener('closeAll', this.closeAll)
    }
    choice(detail) {
        this.setState({ detailVisible: true, detail: Object.assign({}, this.state.detail, detail) })
    }
    listShow() {
        window.eventBus.emit('closeAll')
        if (this.state.visible) {
            return this.setState({
                visible: false
            })
        }
        this.setState({
            visible: true
        }, () => {
            this.getBetHistorByUid()
        })
    }
    getContent() {
        let { list } = this.state
        let { t } = this.props
        let lang = Local('lang') || 'vie'
        let loseImg = require(`../../../../assets/images/liveDetail/jfail-${lang}.png`)
        let winImg = require(`../../../../assets/images/liveDetail/jsuccess-${lang}.png`)
        return (<div id="scrollableDiv" style={{ height: 560, width: 400, overflowY: 'auto' }}>
            <InfiniteScroll
                next={this.getBetHistorByUid}
                scrollableTarget="scrollableDiv"
                hasMore={list.length < 50}
                dataLength={list.length}>
                {
                    list.map((item, index) => (<div onClick={() => this.choice(item)} className='award-result-item' key={index}>
                        <div className='flex f-j-sb'>
                            <div>{item.nickName}</div>
                            <div className='timer'>{stampToTimeStr(item.createTime, 'sec')}</div>
                        </div>
                        <img className='xjt-icon' src={require('../../../../assets/images/common/xjt-icon.png')} alt="" />
                        <div className='flex f-j-sb b-t-i' style={{ alignItems: 'end' }}>
                            <div>{t('rp_bet_amount')} <span className='value'>{item.betAmount}</span></div>
                            {
                                item.awardStatus != 0 ? <img className='result-img' src={item.awardStatus == 1 ? loseImg : winImg} alt="" /> : ''
                            }


                        </div>
                    </div>))
                }
                {
                    !list.length ? <Empty style={{ color: '#fff', marginTop: '200px' }} description={t('noData')} /> : ''
                }
            </InfiniteScroll></div>)
    }
    getBetHistorByUid() {
        let { page, list } = this.state
        this.setState({ loading: true })
        GetBetHistorByUid({ page }).then(rt => {
            this.setState({
                page: page + 1,
                list: list.concat(rt),
                loading: false
            })
        })
    }
    getIMG(name, list) {
        let map = gameIconMap[name] && gameIconMap[name].icon
        return <>{
            list.map((item, index) => (
                <>
                    {
                        map ? <img key={index} src={map[item]} /> : <div key={index} className={'icon ' + (name == 'yflhc' && 'lhc')}>{item}</div>
                    }
                </>
            ))

        }</>
    }
    render() {
        let { t } = this.props
        let { visible, detailVisible, detail, loading } = this.state
        let content = this.getContent()
        let lang = Local('lang') || 'vie'

        return (

            <div className='reward-result-box-out'>
                <div className='reward-result-box-right'>
                    <div className='s-btn flex f-a-c' onClick={this.listShow}>
                        <img src={require('../../../../assets/images/common/wj-icon.png')} alt="" />
                        <span style={{ marginLeft: 5 }}>{t('ui_bet_record')}</span></div>
                </div>
                {
                    visible && !detailVisible && <div className='reward-result-box-right-alert' >
                        <img className='close' onClick={() => this.setState({ visible: false, page: 0, list: [] })}
                            src={require('../../../../assets/images/liveDetail/rank/pink-close.png')} alt="" />
                        <div className='record-name'>{t('btn_bet_record')}</div>
                        <div className={'a ' + (loading && 'loading')}>
                            {content}
                        </div>

                    </div>
                }
                {
                    detailVisible && <div className='reward-result-box-right-alert'>
                        <img className='back-icon' onClick={() => this.setState({ detailVisible: false })}
                            src={require('../../../../assets/images/common/back-icon.png')} alt="" />
                        <img className='close' onClick={() => this.setState({ detailVisible: false, visible: false })}
                            src={require('../../../../assets/images/liveDetail/rank/pink-close.png')} alt="" />
                        <div className='reward-result-box-right-alert-list'>
                            <div className='flex f-j-sb'><div>{t('czmc')}</div> <div className='value'>{detail.nickName}</div></div>
                            <div className='flex f-j-sb'><div>{t('rp_number_num')}</div> <div className='value'>{detail.playNumReq && detail.playNumReq.expect}</div></div>
                            <div className='flex f-j-sb'><div>{t('rp_bet_amount')}</div> <div className='value'>{detail.betAmount}</div></div>
                            <div className='flex f-j-sb'><div>{t('beishu')}</div> <div className='value'>{detail.times}</div></div>
                            <div className='flex f-j-sb'><div>{t('xzsj')}</div> <div className='value'>{stampToTimeStr(detail.createTime, 'sec')}</div></div>
                            <div className='flex f-j-sb'><div>{t('xzxq')}</div> <div className='value'>{detail.playNumReq && detail.playNumReq.num}</div></div>
                            <div className='flex f-j-sb'><div>{t('ui_result_colon')}</div>
                                {detail.resultList && detail.resultList.length ? <div className='value flex'>{this.getIMG(detail.lotteryName, detail.resultList)}</div> : ''}
                            </div>
                            <div className='flex f-j-sb'><div>{t('ui_status')}</div> <div className='value'>{detail.realProfitAmount ? `${t('win')}(${t('bet_status_id.2')})` : `${t('lose')}(${t('bet_status_id.3')})`}</div></div>
                        </div>
                    </div>
                }

            </div>)
    }
}
export default withTranslation()(RewardResult)