import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
    GetMathList, SaveCollect, GetCollectList, GetUrl,
    GetDetail, BatchBetMatchMarketOfJumpLine, SinglePass
} from '../../../api/fbGame'
import { getBalance, gameForwardGame } from '../../../api/game'
import { upOrDownBalance } from '../../../api/userInfo'
import './style/rightGame.scss'
import { InputNumber, message } from 'antd';
import { freeTime } from "../../../utils/tools";
import { Link } from 'react-router-dom'
import FbReward from './rightGameReward'
import Draggable from 'react-draggable';
import { Button, Mask } from "antd-mobile";

let fbCollectImg = require('../../../assets/images/liveDetail/result/fb-collect.png')
let fbCollectActiveImg = require('../../../assets/images/liveDetail/result/fb-collect-active.png')
class RightGame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            saveLoading: false,
            moreLoading: false,
            matchId: 0,
            matchShow: 0,
            matchIndex: 0,
            tabIndex: 0,
            mathList: [],
            total: 0, //赛事总条数
            loading: false,
            link: '',
            betAmount: 0,
            wfIndex: 0,
            wfLoading: false,
            betLoading: false,
            page: 1,
            JumpLineIndex: -1,
            jsn: {
                dx: [],
                dy: [],
                bd: []
            },
            markDetail: {
                smax: 30000,
                smin: 50,
                op: {
                    od: 0
                }
            },
            fbShow: false,
            renovate: false,
            fbMoney: 0,
            openBalance: false
        }
        this.choiceIndex = this.choiceIndex.bind(this)
        this.wfChoice = this.wfChoice.bind(this)
        this.saveCollect = this.saveCollect.bind(this)
        this.linkTo = this.linkTo.bind(this)
        this.getDetailLun = this.getDetailLun.bind(this)
        this.showMore = this.showMore.bind(this)
        this.getBatchBetMatchMarketOfJumpLine = this.getBatchBetMatchMarketOfJumpLine.bind(this)
        this.sendSinglePass = this.sendSinglePass.bind(this)
        this.timer = null;
        this.onChangex = this.onChangex.bind(this)
        this.handleScIn = this.handleScIn.bind(this)
        this.handleScOut = this.handleScOut.bind(this)
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    onChangex() {
        this.setState({ renovate: true })
        getBalance({ gameType: 5 }).then(rt => {
            if (!(rt instanceof Error)) {
                console.log(rt)
                this.setState({ fbMoney: rt?.balance || 0 })
                this.setState({ renovate: false })
            }
        })
        //     // window.eventBus.emit("freshYnOpen"); //关闭转圈
    }
    //越南彩余额转入转出，刷新
    handleScIn(money) {
        upOrDownBalance({ amount: money, tradeType: 1, gameType: 5 }).then(rt => {
            this.onChangex()
        })
    };
    handleScOut = async (money) => {
        upOrDownBalance({ amount: money, tradeType: 2, gameType: 5 }).then(rt => {
            this.onChangex()
        })
    };
    choiceIndex(tabIndex) {
        console.log(tabIndex,"tabIndex")
        this.setState({
            tabIndex,
            matchIndex: 0,
            betAmount: 0,
            jsn: {
                dx: [],
                dy: [],
                bd: [],
            },
            page: 1
        }, () => {
            if (tabIndex == 3) return this.getUrl()
            this.getCollectList();
        })

    }
    // 投注
    sendSinglePass() {
        let { betAmount, markDetail, betLoading } = this.state;
        if (betLoading) return;
        let { t, FreshUser } = this.props;
        this.setState({
            betLoading: true
        })
        SinglePass({
            unitStake: betAmount,
            oddsChange: 1,
            betOptionList: [
                {
                    marketId: markDetail.mid,
                    odds: markDetail.op.od,
                    oddsFormat: 1,
                    optionType: markDetail.op.ty
                }
            ]
        }).then(rt => {
            if (rt) {
                message.success(t('betSuccess'));
                FreshUser()
                this.setState({
                    betLoading: false,
                    JumpLineIndex: -1
                })
            } else {
                this.setState({
                    betLoading: false,
                })
            }
            this.onChangex();
        })
    }
    getBatchBetMatchMarketOfJumpLine(JumpLineIndex, type, marketId, bol = false) {
        if (!bol) return
        this.setState({
            JumpLineIndex
        })
        BatchBetMatchMarketOfJumpLine({
            isSelectSeries: false,
            betMatchMarketList: [{
                marketId,
                type,
                matchId: this.state.matchId
            }]
        }).then(rt => {
            this.setState({
                markDetail: rt.bms[0],
                betAmount: rt.bms[0].smin
            })
        })
    }
    getDetailLun(item, index) {
        clearInterval(this.timer);
        this.setState({
            jsn: {
                dx: [],
                dy: [],
                bd: []
            },
        }, () => {
            this.getDetail(item, index);
            this.timer = setInterval(() => {
                let { rightIndex } = this.props;
                let { tabIndex, wfLoading, loading, matchIndex } = this.state;
                if (rightIndex == 0 || tabIndex == 3 || wfLoading || loading || matchIndex == -1) return
                this.getDetail(item, index, false);
            }, 10000)
        })

    }
    getDetail(obj, index, bol = true) {
        let matchId = obj.id;
        if (bol) {
            this.setState({
                matchIndex: index,
                wfLoading: true,
                matchId,
                matchShow: matchId,
                JumpLineIndex: -1,
                betAmount: 0,
                mathList: [obj]
            })
        }

        GetDetail({ matchId }).then(res => {
            const jsn = { dx: [], dy: [], bd: [] }
            const type = [1007, 1005, 1099]//亚盘大小球，独赢，波胆
            let list = res.mg.filter((item) => { return item.pe === 1001 && type.includes(item.mty) })
            for (let item of list) {
                switch (item.mty) {
                    case 1007:
                        jsn.dx = item.mks;
                        break
                    case 1005:
                        jsn.dy = item.mks;
                        break
                    case 1099:
                        jsn.bd = item.mks
                }
            }
            this.setState({ jsn, wfLoading: false })
        })
    }
    getUrl() {
        let parsms = {
            gameId: "400",
            gameType: 5,
        }
        gameForwardGame(parsms).then(rt => {
            this.setState({ link: rt.url || rt.param || rt })
        })
    }
    componentDidMount() {
        this.onChangex();
        this.getCollectList()
    }
    showMore() {
        let { total } = this.state;
        this.setState({
            page: total,
            matchIndex: -1
        }, () => {
            this.getCollectList(false);
        })
    }
    getCollectList(bol = true) {
        this.setState({ loading: true })
        GetCollectList().then(rt => {
            this.getMathList((data) => {
                let { total, records } = data;
                records.some(item => {
                    if (!rt.length) return true;
                    rt.some((iitem, index) => {
                        if (item.id == iitem.matchId) {
                            item.isCollect = true;
                            rt.splice(index, 1);
                            return true;
                        }
                    })
                })
                if (records.length && bol) {
                    this.getDetailLun(records[0], 0)
                }
                this.setState({
                    loading: false,
                    total,
                    mathList: records
                })
            })
        })
    }
    wfChoice(wfIndex) {
        this.setState(
            { wfIndex, JumpLineIndex: -1 }
        )
    }
    saveCollect(e, matchId, type, index) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ saveLoading: true })
        let { mathList } = this.state
        SaveCollect({ type: type ? 0 : 1, matchId }).then(rt => {
            if (rt) {
                mathList[index].isCollect = !mathList[index].isCollect;
                this.setState({
                    loading: false,
                    mathList,
                    saveLoading: false
                })
                console.log(mathList, index, "mathList")
            }
        })
    }
    getMathList(cb) {
        let { tabIndex, page } = this.state;
        console.log(tabIndex,"tabIndex--------")
        GetMathList({ matchType: [1, 4, 99][tabIndex], current: 1, size: page }).then(rt => {
            if (rt) {
                let { total, records } = rt
                cb && cb(rt)
                if (!records.length) {
                    clearInterval(this.timer);
                }
            }
        })
    }
    getBF(list) {
        let str = 'vs';
        if (!list || !list.length) return str
        list.some(item => {
            if (item.tyg == 5) {
                return str = `${item.sc[0]}-${item.sc[1]}`
            }
        })
        return str
    }
    linkTo() {
        window.open(this.state.link)
    }
    // 获取赛事列表组件
    getMathListContent() {
        let { t } = this.props;
        let { mathList, loading, total, matchShow, saveLoading } = this.state;
        let isOpen = !(mathList.length == 1 && total > 0)
        return <div className={'match-list-box ' + (loading && 'loading') + (isOpen && ' open')}>

            {
                mathList.length ? mathList.map((item, index) => (
                    <div key={item.id} onClick={() => this.getDetailLun(item, index)}
                        className={"match-list-box-item f-a-c " + (matchShow == item.id && 'active ') + (index == 0 && 'first')}>
                        <div className='match-list-box-item-time' style={{ fontSize: 14, color: '#999', }}>
                            <img
                                onClick={(e) => this.saveCollect(e, item.id, item.isCollect, index)}
                                className={'collect-icon ' + (item.isCollect && 'actice ') + (saveLoading && ' loading')}
                                src={item.isCollect ? fbCollectActiveImg : fbCollectImg}
                            />
                            {freeTime(item.bt, 'm-d h:i')}
                        </div>
                        <div className='match-list-box-item-content' style={{ width: '80%', margin: 'auto' }}>
                            <div className='item'>
                                <img className='icon' src={item.ts[0].lurl} alt="" />
                                <span>{item.ts[0].na}</span>
                            </div>
                            <div className='vs'>
                                <span className='icon icon-vs'></span>
                            </div>
                            <div className='item'>
                                <img className='icon' src={item.ts[1].lurl} alt="" />
                                {item.ts[1].na}
                            </div>
                        </div>
                    </div>
                )) :
                    <div className='no-data'>{t('noData')}</div>
            }
            {
                mathList.length == 1 && total > 1 && <div className={'a-more ' + (loading && 'loading')} onClick={this.showMore}>
                    <span className='cursor'><span>{t('ui_more')}{t('league__match')} {total - 1}</span><span>+</span></span>
                    {/* <br /> */}
                    {/* <img src={require('../../../assets/images/game/more-icon.png')} alt="" /> */}
                </div>
            }
        </div>

    }
    // 注单详情
    getBetContent() {
        const { t, userInfo } = this.props;
        const { markDetail, betAmount, betLoading } = this.state
        let { mathList, loading, total, matchShow, saveLoading } = this.state;
        let isOpen = !(mathList.length == 1 && total > 0)
        return (
            <div className='mask'>
                <div className='bet-detail'>
                    <div className='header'>
                        <div className='icon icon-down bet-detail-close' onClick={() => this.setState({ JumpLineIndex: -1 })}></div>
                        <div className='bet-detail-title'>{t('zd')}</div>
                    </div>

                    <div className={'match-list-box ' + (loading && 'loading') + (isOpen && ' open')}>
                        {
                            mathList.length ? mathList.map((item, index) => (
                                <div key={item.id} onClick={() => this.getDetailLun(item, index)}
                                    className={"match-list-box-item f-a-c " + (matchShow == item.id && 'active ') + (index == 0 && 'first')}>
                                    <div className='match-list-box-item-time' style={{ fontSize: 14, color: '#999', }}>
                                        <img
                                            onClick={(e) => this.saveCollect(e, item.id, item.isCollect, index)}
                                            className={'collect-icon ' + (item.isCollect && 'actice ') + (saveLoading && ' loading')}
                                            src={item.isCollect ? fbCollectActiveImg : fbCollectImg}
                                        />
                                        {freeTime(item.bt, 'm-d h:i')}
                                    </div>
                                    <div className='match-list-box-item-content' style={{ width: '80%', margin: 'auto' }}>
                                        <div className='item'>
                                            <img className='icon' src={item.ts[0].lurl} alt="" />
                                            <span>{item.ts[0].na}</span>
                                        </div>
                                        <div className='vs'>
                                            <span className='icon icon-vs'></span>
                                        </div>
                                        <div className='item'>
                                            <img className='icon' src={item.ts[1].lurl} alt="" />
                                            {item.ts[1].na}
                                        </div>
                                    </div>
                                </div>
                            )) :
                                <div className='no-data'>{t('noData')}</div>
                        }
                    </div>
                    <InputNumber value={betAmount} onChange={(e) => this.setState({ betAmount: e })} min={markDetail.smin} max={markDetail.smax} />
                    <div className={'bet-btn ' + (betLoading && 'loading')}
                        onClick={this.sendSinglePass}>{t('ui_betting')}
                    </div>
                    <div className='yjky'>
                        {t('yjky')}：{(betAmount * markDetail.op.od).toFixed(2)}
                    </div>
                </div>
            </div>
        )
    }
    render() {
        const { t, name, gamePic, onClose, userInfo } = this.props;
        let { tabIndex, jsn, wfIndex, wfLoading, JumpLineIndex, mathList, total, matchIndex, fbShow, fbMoney, renovate, openBalance } = this.state;
        let isOpen = !(mathList.length == 1 && total > 0)
        let MathListContent = this.getMathListContent()
        let wfList = jsn[['dx', 'dy', 'bd'][wfIndex]]
        let BetContent = this.getBetContent()
        return <Draggable
            scale={1}>
            <div className='right-game-box'>
                <span className="result-container-close icon-close" onClick={onClose}></span>
                {fbShow ?
                    <FbReward />
                    :
                    <div className='main'>
                        <div className='right-game-box-top'>
                            <img className='gamePic' src={gamePic} alt="" />
                            <span className='gameName'>{'FB' || name}</span>
                            <div className='right'>
                                <div className='item' onClick={()=>this.setState({fbShow:true})}><span className='icon icon-jl'></span> {t('live_jl')}</div>
                                <div className='item'>
                                    <span className='icon icon-qb'></span>
                                    <span className='text'><Link target="_blank" to="/user/deposit">{t('ui_dep')}</Link></span>
                                </div>
                            </div>
                        </div>
                        <div className='right-game-box-tab flex'>
                            <div className={'tab  ' + (tabIndex == 0 && "active")} onClick={() => this.choiceIndex(0)}>
                                <div className={'tab-in tab-' + (tabIndex == 0 ? 1 : 3)} >
                                    {t('gun_qiu')}
                                </div>
                            </div>
                            <div className={'tab  ' + (tabIndex == 1 && "active")} onClick={() => this.choiceIndex(1)}>
                                <div className={'tab-in tab-' + [2, 1, 3, 3][tabIndex]}>
                                    {t('zao_pan')}
                                </div>
                            </div>
                            <div className={'tab  ' + (tabIndex == 2 && "active")} onClick={() => this.choiceIndex(2)}>
                                <div className={'tab-in tab-' + [2, 2, 1, 3][tabIndex]}>
                                    {t('f_ui_favorites')}
                                </div>
                            </div>
                            <div className={'tab  ' + (tabIndex == 3 && "active")} onClick={() => this.choiceIndex(3)}>
                                <div className={'tab-in tab-' + (tabIndex == 3 ? 1 : 2)} >
                                    {t('wz')}
                                </div>
                            </div>
                        </div>
                        {tabIndex == 3 &&
                            <div className='no-data-record' style={{ marginTop: 50 }}>
                                <img src={require('../../../assets/images/liveDetail/result/no-data.png')} alt="" />
                                <div className='tips'>{t('gdty')}</div>
                                <div className='btn' onClick={this.linkTo}>{t('qdqw')}</div>
                            </div>
                        }
                        {tabIndex != 3 && MathListContent}
                        {matchIndex != -1 && !isOpen && tabIndex != 3 &&
                            <>
                                <div className='wf-tab-box'>
                                    <div className={'wf-tab-box-item ' + (wfIndex == 0 && 'active baseColor')}
                                        onClick={() => this.wfChoice(0)}>{t('da_xiao')}</div>
                                    <div className={'wf-tab-box-item ' + (wfIndex == 1 && 'active baseColor')}
                                        onClick={() => this.wfChoice(1)}>{t('du_ying')}</div>
                                    <div className={'wf-tab-box-item ' + (wfIndex == 2 && 'active baseColor')}
                                        onClick={() => this.wfChoice(2)}>{t('bd')}</div>
                                </div>
                                <div className='xz-box'>
                                    {wfList.length > 0 ?
                                        <div className={'flex xz-box-list ' + (wfLoading && 'loading')}>
                                            {wfList.map((item, index) =>
                                                item.op.map((val, key) => {
                                                    return <div
                                                        onClick={() => this.getBatchBetMatchMarketOfJumpLine(`${index}-${key}`, val.ty, item.id, item.ss == 1 && val.od && val.od > 0)}
                                                        className={'xz-box-item flex ' +
                                                            (!(item.ss == 1 && val.od && val.od > 0) && 'lock')
                                                            + (JumpLineIndex == `${index}-${key}` && ' baseBorder')
                                                        }
                                                        key={`point${key}`} >
                                                        <div className='value'>{val.nm} </div>
                                                        {item.ss == 1 && val.od && val.od > 0 ? <span>{val.od} </span> : <img src={require('../../../assets/images/game/fb-lock.png')} />}
                                                    </div>
                                                })

                                            )}
                                        </div>
                                        : <div className='no-data' style={{ margin: 'auto' }}>{t('noData')}</div>}
                                </div>
                            </>
                        }
                        {JumpLineIndex != -1 && BetContent}
                        <div >
                            <div className='footer'>
                                <div className='icon icon-live-gold'></div>
                                <div className='goldCoin'>{userInfo.goldCoin || 0}</div>
                                {/* <div className='change' onClick={() => this.setState({ openBalance: true })}>{t('user_zz')}</div> */}
                                <div onClick={() => this.onChangex()} className={`icon icon-live-change ${renovate && 'infinite1s loading'} `}></div>
                            </div>
                        </div>
                    </div>
                }
                {/* 越南30秒余额转账 */}
                <Mask
                    visible={openBalance}
                    getContainer={document.body}
                    onMaskClick={() => this.setState({ openBalance: false })}
                >
                    <div className="balanceMask">
                        <div className="balanceMask_title">{t('user_zz')}</div>
                        <div className="balanceMask_content">
                            <div className="balanceMask_box">
                                <div className="balanceMask_price">{userInfo.goldCoin}</div>
                                <div className="balanceMask_name">{t('zhuzhanghuyue')}</div>
                                <Button className="balanceMask_btn" onClick={() => this.handleScOut(fbMoney)} loading="auto">
                                    {t('btn_one_click_recycling')}
                                </Button>
                            </div>
                            <div className="balanceMask_box">
                                <div className="balanceMask_price">{fbMoney}</div>
                                <div className="balanceMask_name">{t('dangqianyouxiyue')}</div>
                                <Button className="balanceMask_btn" onClick={() => this.handleScIn(userInfo.goldCoin)} loading="auto">
                                    {t('btn_one_click_recycling')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Mask>
            </div>


        </Draggable>
    }
}
export default withTranslation()(RightGame)