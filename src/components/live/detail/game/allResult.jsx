// 全部记录
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { GetSomeGameFirstHistory, GetAllGameHistory } from '../../../../api/game'
import { gameIconMap } from './gameShow'

// import './style/allResult.scss'
class AllResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            page: 0,
            detail: {},
            visible: false,
            detailVisible: false,
            loading: false,
            allHistoryLoading: false,
            allHistory: [],
            name: '',
            gameName: ''
        }
        this.choice = this.choice.bind(this)
        this.getIMG = this.getIMG.bind(this)
        this.listShow = this.listShow.bind(this)
        this.closeAll = this.closeAll.bind(this)
    }
    componentDidMount() {
        window.eventBus.addListener('closeAll', this.closeAll)
    }
    componentWillUnmount() {
        window.eventBus.removeListener('closeAll', this.closeAll)
    }
    choice(detail) {
        let { lotteryName, nickName } = detail;
        this.setState({ detailVisible: true, name: nickName, gameName: lotteryName }, () => {
            this.getAllGameHistory(lotteryName);
        })
    }
    // 获取所有历史
    getAllGameHistory(lotteryName) {
        this.setState({ allHistoryLoading: true, allHistory: [] })
        GetAllGameHistory({ lotteryName, page: 0 }).then(rt => {
            this.setState({
                allHistory: rt,
                allHistoryLoading: false,
            })
        })
    }
    getContent() {
        let { list } = this.state
        let { t } = this.props
        return (<div>

            {
                list.map((item, index) => (<div onClick={() => this.choice(item)} className='award-result-item' key={index}>
                    <div className='flex f-j-sb'>
                        <div>{item.nickName}</div>
                        <div className='timer'>{item.expect}</div>
                    </div>
                    <img className='xjt-icon' src={require('../../../../assets/images/common/xjt-icon.png')} alt="" />
                    <div className='flex f-j-sb b-t-i' style={{ alignItems: 'end' }}>
                        <div className='flex'>{
                            item.lotteryResult && item.lotteryResult.map((iitem, index) => {
                                return (gameIconMap[item.lotteryName] ?
                                    <img className='icon' key={index} src={gameIconMap[item.lotteryName].icon[iitem]} /> :
                                    <div className={'item ' + (item.lotteryName == 'yflhc' && 'lhc')} key={index}>{iitem}</div>)
                            })
                        }
                        </div>
                    </div>
                </div>))
            }
        </div>)
    }
    closeAll() {
        this.setState({ visible: false, detailVisible: false })
    }
    listShow() {
        window.eventBus.emit('closeAll')
        if (this.state.visible) {
            return this.setState({
                visible: false
            })
        }
        this.setState({
            list: [],
            visible: true
        }, () => {
            this.getSomeGameFirstHistory()
        })
    }
    getSomeGameFirstHistory() {
        this.setState({ loading: true })
        GetSomeGameFirstHistory().then(rt => {
            this.setState({
                list: rt,
                loading: false
            })
        })
    }

    getIMG(name, list) {
        let map = gameIconMap.yuxx.icon
        return <>{
            list.map((item, index) => (
                <>
                    {
                        name == 'yuxx' ? <img key={index} src={map[item]} /> : <div key={index} className='icon'>{item}</div>
                    }
                </>
            ))

        }</>
    }
    getAllHistoryContent() {
        let { t } = this.props;
        let { allHistory, allHistoryLoading, gameName } = this.state;
        let iconData = gameIconMap[gameName] && gameIconMap[gameName].icon
        return (
            <div className={'all-history-box2 ' + (allHistoryLoading && 'loading')}>
                {
                    allHistory.map(item => (
                        <div className='all-history-box2-item' key={item.id}>
                            <div>{t('f_ui_num_period').replace(num, item.expect)}</div>
                            <div className='flex'>
                                {item.lotteryResult && item.lotteryResult.map((iitem, index) => (
                                    <>
                                        {
                                            iconData ? <img key={index} src={iconData[iitem]} /> :
                                                <div className={'text-icon ' + (gameName == 'yflhc' && 'lhc')} key={index}>{iitem}</div>
                                        }
                                    </>
                                ))}
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
    render() {
        let { t } = this.props
        let { visible, detailVisible, loading, name } = this.state
        let content = this.getContent()
        let historyContent = this.getAllHistoryContent();
        return (

            <div className='reward-result-box-out'>
                <div className='reward-result-box-left'>
                    <div className='s-btn flex f-a-c' onClick={this.listShow}>
                        <img src={require('../../../../assets/images/common/wj-icon.png')} alt="" />
                        <span style={{ marginLeft: 5 }}>{t('kjjl')}</span></div>
                </div>
                {
                    visible && !detailVisible && <div className='reward-result-box-left-alert'>
                        <img className='close' onClick={() => this.setState({ visible: false })}
                            src={require('../../../../assets/images/liveDetail/rank/pink-close.png')} alt="" />
                        <div className='record-name'>{t('kjjl')}</div>
                        <div style={{ height: 500, overflow: 'scroll' }} className={'a ' + (loading && 'loading')}>
                            {content}
                        </div>

                    </div>
                }
                {
                    detailVisible && <div className='reward-result-box-left-alert'>
                        <div className='lottery-name'>{name}</div>
                        <img className='back-icon' onClick={() => this.setState({ detailVisible: false })}
                            src={require('../../../../assets/images/common/back-icon.png')} alt="" />
                        <img className='close' onClick={() => this.setState({ detailVisible: false, visible: false })}
                            src={require('../../../../assets/images/liveDetail/rank/pink-close.png')} alt="" />
                        <div className='reward-result-box-alert-list'>
                            {historyContent}
                        </div>
                    </div>
                }

            </div>)
    }
}
export default withTranslation()(AllResult)