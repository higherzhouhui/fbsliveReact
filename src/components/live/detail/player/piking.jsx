
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Progress } from 'antd'
import { GetPkStatus } from '../../../../api/live';
import { formatSeconds } from '../../../../utils/tools'
import './piking.scss'
class Piking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: false,
            CF_TIME: -1800, // 惩罚时间3min
            PK_TIME: 300, //pk时间3min
            pkTime: 0,
            pkStatus: {
                listA: [],
                listB: [],
                scoreA: 0,
                scoreB: 0,
                startTime: 0
            },
            index: 0,
        }
        this.pkPer = this.pkPer.bind(this)
    }
    pkPer() {
        let { pkStatus } = this.state
        let num = pkStatus.scoreA * 100 / (pkStatus.scoreA + pkStatus.scoreB)
        return isNaN(num) ? 50 : num
    }
    // 获取数据
    getPkStatus() {
        let { anchorId } = this.props;
        GetPkStatus({ anchorId }).then(res => {
            if (res) {
                this.setState({
                    pkStatus: Object.assign({}, this.state.pkStatus, res),
                    status: true
                })
                this.beginPk();
            } else {
                this.checkPkStatus(false);
            }
        })
    }

    // 更新数据
    UPpkStatus(data) {
        this.setState({
            pkStatus: Object.assign({}, this.state.pkStatus, data)
        })
    }
    componentDidMount() {
        this.getPkStatus()
        this.props.getPkingChild(this)
    }
    componentWillUnmount() {
        clearTimeout(this.setPkTimer)
    }
    //开始pk
    beginPk() {
        let { CF_TIME, pkStatus, PK_TIME, pkTime } = this.state
        if (pkStatus.startTime == 0) {
            setTimeout(() => {
                this.beginPk()
            }, 200)

            return
        }
        pkTime = PK_TIME - parseInt((new Date().getTime() - pkStatus.startTime) / 1000);
        this.setState({
            pkTime
        }, () => {
            if (this.state.pkTime > CF_TIME) {
                this.setPkTimer = setTimeout(() => {
                    this.beginPk()
                }, 1000)
            } else {
                //pk结束，更改当前pk状态
                this.checkPkStatus(false);
            }
        })
    }
    // 切换状态
    checkPkStatus(status) {
        this.setState({ status })
        if (!status) {
            let search = location.search;
            search = search.replace('pking=true', 'pking=false')
            history.pushState({}, '', search)
            this.props.close()
        }
    }
    render() {
        let { pkStatus, pkTime, status } = this.state
        let { t } = this.props
        let val = this.pkPer()
        return (
            <div className='piking-box'>
                {
                    status && <>
                        <div className='processing flex f-a-c'>
                            {pkTime < 0 && val != 50 ? <>
                                <img className={'s-icon ' + (val > 50 ? 'left-cf' : 'right-cf')} src={require('../../.../../../../assets/images/live/pk/win.png')} />
                                <img className={'s-icon ' + (val < 50 ? 'left-cf' : 'right-cf')} src={require('../../.../../../../assets/images/live/pk/lose.png')} />
                            </> : ''} 
                            <div className='s-icon left'> {t('wofang')} {pkStatus.scoreA}</div>
                            <div className='s-icon right'>{pkStatus.scoreB}  {t('duifang')}</div>
                            <Progress className='left-align' strokeWidth={30} gapPosition="left" percent={val} />
                        </div>
                        <div className='djs-box'>
                            {
                                pkTime > 0 ? <div><img style={{ height: 12 }} src={require('../../.../../../../assets/images/live/pk/pk.png')} /> {pkTime}</div>
                                    : val != 50 ? <div>{t('chenfa')} {pkTime > -180 ? 180 + pkTime : 0}</div>
                                        : <img style={{ height: 25 }} src={require('../../.../../../../assets/images/live/pk/he.png')} />
                            }
                        </div>
                        <div className='flex head-icon-box'>
                            <div className='left-head head-icon flex'>
                                {
                                    pkStatus.listA.slice(0, 3).map((item, index) => <img key={index} src={item.avatar || defaultImg} />)
                                }
                            </div>
                            <img src={require('../../../../assets/images/live/pk/pk.png')} alt="" />
                            <div className='right-head head-icon flex'>
                                {
                                    pkStatus.listB.slice(0, 3).map((item, index) => <img key={index} src={item.avatar || defaultImg} />)
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        )
    }
}

export default withTranslation()(Piking)