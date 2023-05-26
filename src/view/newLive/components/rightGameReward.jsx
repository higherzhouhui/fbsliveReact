// 投注记录
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { betRecord, statistics } from '../../../api/fbGame'
import { freeTime } from '../../../utils/tools';
import { Local } from '../../../common';
import { Collapse } from 'antd'
const { Panel } = Collapse;
import InfiniteScroll from 'react-infinite-scroll-component';
import Copy from '../../../components/common/copy'
import './style/rightRewardResult.scss'

class RewardResult extends Component {
    constructor(props) {
        super(props)
        let { t } = props
        this.state = {
            list: [],
            page: 0,
            detail: {},
            visible: false,
            detailVisible: false,
            loading: false,
            type: 0,
            betAmountData: {
                betAmount: 0,
                betNum: 0
            },
            tab: [
                { index: 0, title: t('ui_unsettlement') },
                { index: 5, title: t('ui_settled') },
            ],
            tabIndex: 0
        }
        this.getBetHistorByUid = this.getBetHistorByUid.bind(this)
        this.listShow = this.listShow.bind(this)
        this.checkTab = this.checkTab.bind(this)
        this.getStatusIcon = this.getStatusIcon.bind(this)
        this.esCenter = this.esCenter.bind(this)
    }
    componentDidMount() {
        this.listShow()
    }

    listShow() {
        this.setState({
            page: 0,
            list: [],
            visible: true,
        }, () => {
            this.getBetHistorByUid()
        })
    }
    checkTab(tabIndex) {
        this.setState({ tabIndex, page: 0, list: [] }, () => {
            this.getBetHistorByUid()
        })

    }
    esCenter(e) {
        if (!e) return ""
        return `${e.substr(0, 7)}...${e.substr(e.length - 2, e.length - 1)}`
    }
    getContent() {
        let { list, tabIndex } = this.state
        let { t } = this.props
        return (<div id="scrollableDiv" style={{ height: 470, overflowY: 'scroll', margin: "10px" }}>
            <InfiniteScroll
                next={this.getBetHistorByUid}
                scrollableTarget="scrollableDiv"
                hasMore={list.length < 50}
                dataLength={list.length}>
                <Collapse>
                    {list.map((item, index) => {
                        return <Collapse.Panel key={index}
                            header={
                                <div className='award-result-item' key={index}>
                                    <div className='top'>
                                        <div className='left'>
                                            <span className='orderNum'>{this.esCenter(item.orderNum)}</span>
                                            <Copy style={{ marginLeft: 19 }} text={item.orderNum}>
                                                <span className='icon icon-copy1'></span>
                                            </Copy>
                                        </div>
                                        <div className='right'>
                                            <div className='green' style={{ marginRight: 5 }}>{t('yi_que_ren')}</div>
                                        </div>
                                    </div>
                                    <div className='timer'>{freeTime(item.createTime, 'y-m-d h:i')}</div>
                                    <div className='bottom'>
                                        <div >{t('ben_jin')}： {item.stakeAmount}</div>
                                        <div className='flex '>
                                            {tabIndex == 0 ? t('ke_ying') : t('f_huan')}：
                                            <span className='amount-value'>
                                                {tabIndex == 0 ? (item.maxWinAmount || 0) : (item.settleAmount || 0)}
                                            </span>
                                            {/* <span className='icon icon-down'></span> */}
                                        </div>
                                    </div>
                                </div>
                            }
                            arrow={<img src={require('../../../assets/images/icon/down.png')} />}
                        >
                            {item.details && item.details.map((val, key) => <div className='status-img' style={{ 'background-image': this.getStatusIcon(item, val) }} key={key} >
                                <p>{val.matchName}2</p>
                                <p>{val.optionName} @{val.betOdds}2</p>
                            </div>
                            )}
                            {item.details == null && <div className='status-img'>{t('noData')}</div>}
                        </Collapse.Panel>
                    })}
                </Collapse>
            </InfiniteScroll>
            {!list.length && <div className='no-data'>{t('noData')}</div>}
        </div>)
    }
    getStatusIcon(item, val) {
        const lang = Local('lang') || 'vie'
        let url = ''
        if (item.orderStatus === 2) url = require(`../../../wap/assets/image/fb/${lang}/icon-status2.png`);
        if (item.orderStatus === 3) url = require(`../../../wap/assets/image/fb/${lang}/icon-status3.png`)
        if (item.orderStatus === 5 && val.settleResult) url = require(`../../../wap/assets/image/fb/${lang}/icon${val.settleResult}.png`)
        return url ? `url(${url})` : 'auto'
    }
    getBetHistorByUid() {
        let { page, list, tabIndex } = this.state
        this.setState({ loading: true })
        this.getStatistics()
        betRecord({ page, type: tabIndex }).then(rt => {
            this.setState({
                page: page + 1,
                list: list.concat(rt),
                loading: false
            })
        })
    }
    getStatistics() {
        let { tabIndex, betAmountData } = this.state
        statistics({ type: tabIndex }).then(rt => {
            this.setState({
                betAmountData: Object.assign({}, betAmountData, rt)
            })
        })
    }

    render() {
        let { t, close } = this.props
        let { detailVisible, loading, betAmountData, tab, tabIndex } = this.state
        let content = this.getContent()
        return <div className='fb-reward-container'>
            {
                !detailVisible && <div className='fb-reward-container-alert' >
                    <span className="fb-reward-container-goback icon-goback" onClick={close}></span>
                    <span className="close icon-close" onClick={close}></span>
                    <div className='result-container-tab'>
                        {tab.map((item, index) => {
                            return <div key={index} onClick={() => this.checkTab(item.index)} className={`tabs ${tabIndex === item.index && 'active'}`}>{item.title}
                            </div>
                        })}
                    </div>
                    <div className={'a ' + (loading && 'loading')}>
                        {content}
                        <div className={'bet-amount f-j-sb flex ' + (loading && 'loading')}>
                            <div>{t('report__allTotal')}：{betAmountData.betNum}</div>
                            <div>{t('rp_bet')}：{betAmountData.betAmount}</div>
                        </div>
                    </div>
                </div>
            }

        </div>
    }
}
export default withTranslation()(RewardResult)