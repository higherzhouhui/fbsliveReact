import { NavBar, Toast } from "antd-mobile";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    GameBalanceList,
    BackAllGameCoin,
    gameForwardGame,
    autoUpBalance,
    upOrDownBalance,
    getBalance
} from "../../server/balance";
import useContextReducer from "../../state/useContextReducer.js";
import { getGameJumpUrl } from "../../server/home";
import { getUserInfo } from "../../server/user";
import style from './gameIframe.module.scss'
import _ from 'lodash'
import { moneyType } from "../../../common";
import { t } from "i18next";

let timeD
let times
const TransferAccounts = React.lazy(() => import('../Center/balance/transferAccounts'))

const GameIframe = () => {
    // : { gameId, type, nameI18N, name, setShowTransD, getBalancesT }
    const { state: { gameId, type, nameI18N, name, setShowTransD, getBalancesT } } = useLocation()
    const { state: { user, assergoldData }, fetchUtils, } = useContextReducer.useContextReducer();
    const { freshUser, userGetUserAsserGold } = fetchUtils;

    const history = useNavigate()
    const [jumpUrl, setJumpUrl] = useState('')
    const [balanceList, setBalanceList] = useState([])
    const [moneyLoading, setMoneyLoading] = useState(false)
    const [getUserInfos, getUserInfosSet] = useState({})

    const [showTrans, setShowTrans] = useState(false)
    const [transformations, transformationsSet] = useState(true)
    const [getBalancesD, getBalancesDSet] = useState(0)
    const goItemData = useRef()
    // console.log(autoUpBalance, "autoUpBalance")
    const init = useCallback(() => {
        if (type != 5) {
            console.log('getBalancesT', getBalancesT);

            setShowTrans(setShowTransD || false)   //fb不要弹窗转账 
            getBalancesT && getBalanceF() //第一次刷新钱包
        }
        getJumpUrl()
        if (user.autoUpBalance != 1) {
            goItemData.current = {
                gameName: nameI18N || name,
                banlance: getBalancesD,
                type: type,
            }
        }
    }, [])
    // info
    // const getUserInfoF = () => {
    //     getUserInfo().then((item) => {
    //         // console.log('infos', item);
    //         getUserInfosSet(item)
    //         if (item.autoUpBalance != 1) {
    //             console.log('获取balance', item.goldCoin);

    //         }
    //     })
    // }
    useEffect(() => {
        init()
    }, [init])

    useEffect(() => {
        // getBalanceFs() //轮询
        window.eventBus.addListener('getBalances', getBalances)
        return () => {
            window.eventBus.removeListener('getBalances', getBalances)
            clearTimeout(times)
        }
    }, [])
    const getBalances = (e) => {
        console.log('查询余额', e);
        getBalancesDSet(e) //当前游戏余额
        // getBalance()
    }

    //获取余额
    // const getBalance = async () => {
    //     setMoneyLoading(true)
    //     const res = await GameBalanceList()
    //     console.log('获取余额', res);
    //     setBalanceList(res)
    //     setMoneyLoading(false)
    // }

    // 轮询
    // const getBalanceFs = () => {
    //     times = setTimeout(() => {
    //         getBalanceF()
    //         getBalanceFs()
    //     }, 5000)
    // }


    const getBalanceF = async () => {
        const res = await getBalance({ gameType: type })
        if (!(res instanceof Error)) {
            console.log('获取余额', res);
            getBalancesDSet(res.balance || 0)
            goItemData.current = {
                gameName: nameI18N || name,
                banlance: res.balance || 0,
                type: type,
            }
        } else {
            getBalancesDSet(0)
        }
    }

    //获取跳转地址
    const getJumpUrl = async () => {
        setMoneyLoading(true)
        // 游戏跳转
        let params = { gameId: gameId, gameType: type }
        let res = await gameForwardGame(params)
        if (!(res instanceof Error)) {
            console.log('获取跳转地址', res.url || res.param || res);
            setJumpUrl(res.url || res.param || res)

            setMoneyLoading(false)
        }

        // let res = await getGameJumpUrl(getGameUrl(), params)
        // if (!(res instanceof Error)) {
        //     setJumpUrl(res.url || res.param || res)
        // }
    }


    const balance = useMemo(() => {
        try {
            if (balanceList.length > 0) {
                let obj = _.head(balanceList.filter(v => v.type === type))
                return obj.balance
            } else return 0
        }
        catch (err) {
            return 0
        }
    }, [balanceList])

    const transMoney = async (ts) => {
        if (user?.autoUpBalance == 1) {
            const res2 = await BackAllGameCoin()
            if (!(res2 instanceof Error)) {
                if (res2?.allBalance >= 1) {  //钱包余额大于等于1才一键上分
                    // timeD = setTimeout(() => {
                    autoUpBalance({
                        amount: res2?.allBalance || 0,  //自动上分接口金额随意
                        gameType: type,
                        tradeType: 1
                    }).then((data) => {
                        console.log('接口反回金额', data);
                        // getBalance()
                        getBalancesDSet(data.balance || 0)
                        // freshUser()
                        userGetUserAsserGold()
                        Toast.show(t('sys_check_pass'))
                        // clearTimeout(timeD)
                        // timeD = null
                    }).catch(() => {
                    })
                    // }, 3500)
                }
            }
            // }
        } else {
            goItemData.current = {
                gameName: nameI18N || name,
                banlance: getBalancesD,
                type: type
            }
            if (type != 5) {
                setShowTrans(true)
                if (getBalancesD == 0) {  //当前余额为0才一键回收
                    await BackAllGameCoin()
                }
            }
            // freshUser()
            userGetUserAsserGold()
        }


    }

    // 转换
    const transformation = () => {
        // console.log('这是什么数据', info, user.goldCoin);
        // if (transformations) {
        //     setMoney2(user.goldCoin)
        // } else {
        //     setMoney2(info.balance)
        // }

        transformationsSet(!transformations)
    }
    return <div className={style.body}>
        <NavBar
            back={null}
            left={
                <div className={style.navLeft}>
                    <img src={require('../../assets/image/kf/left.png')} className={style.leftIcon} onClick={() => history('/game')} />
                    <img src={require('../../assets/image/center/fresh.png')} className={`${style.leftIcon} ${moneyLoading ? style.loading : ''}`} onClick={() => { getJumpUrl(), transMoney(1), getBalanceF() }} />
                </div>
            }
            className="iframeNav"
            // history('/balance')
            right={<div className={style.navRight} onClick={() => { transMoney(1) }}>
                {/* <div onClick={(e) => { e.stopPropagation(), transMoney('in') }}>转</div> */}
                <img src={require('../../assets/image/center/jllog2.png')} alt="" />
                {/* moneyType(balance) */}
                {getBalancesD}
            </div>}
        >
            <div style={{ fontSize: '17px', fontWeight: '500', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nameI18N || name}
            </div>
        </NavBar>
        {jumpUrl && <iframe src={jumpUrl} className={style.iframe}></iframe>}

        <TransferAccounts onMaskClick={() => {
            setShowTrans(false) //关闭弹窗
            transformationsSet(true)
        }}
            // getBalance(),
            fresh={(e) => { console.log('回调余额', e), getBalancesDSet(e) }} //游戏余额
            visible={showTrans}
            transformations={transformations} //是否切换判断
            transformation={() => transformation()} //切换转入转出
            info={goItemData.current || {}}
        />
    </div>
}

export default GameIframe