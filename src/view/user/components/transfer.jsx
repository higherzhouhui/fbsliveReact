import React, { useEffect, useState } from 'react';
import { gameBalanceList, upOrDownBalance, autoUpBalanceSwitch } from '../../../api/userInfo';
import { message, Popover, Switch, Input, InputNumber, Button, Select } from 'antd';
import { useTranslation } from "react-i18next";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import useContextReducer from '../../../state/useContextReducer.js'

import './transfer.scss'
const { Option } = Select;
export default () => {
    const { state } = useLocation();
    const history = useNavigate()
    const { t } = useTranslation()
    const { state: { user: userInfo, }, fetchUtils, } = useContextReducer.useContextReducer();
    const { freshUser } = fetchUtils;
    const [loading, setLoading] = useState(false)
    const [balanceList, setBalanceList] = useState([])
    const [switchLoading, setWitchLoading] = useState(false)
    const [type, setType] = useState(1);//1中心钱包转入游戏 2游戏转入中心钱包
    const [info, setInfo] = useState({} || state)

    const moneyList = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];
    const [money, setMoney] = useState("")
    const [submitLoading, setSubmitLoading] = useState(false)
    // 获取全部的游戏余额
    const getGameBalanceList = async () => {
        setLoading(true)
        const rt = await gameBalanceList();
        if (!(rt instanceof Error)) {
            setBalanceList(rt || [])
            setLoading(false)
            window.eventBus.emit('balance', true)
        }
    }
    // 开启/关闭 自动转账
    const onChangeAuto = async (data) => {
        let autoUpBalance = data ? 1 : 0;
        setWitchLoading(true)
        const rt = await autoUpBalanceSwitch({ autoUpBalance });
        if (!(rt instanceof Error)) {
            freshUser();
            setTimeout(() => {
                setWitchLoading(false)
            }, 1000);
        }
    }
    // 获取选中的游戏
    const onChangeGame = (type) => {
        let info = balanceList.find((item) => {
            return item.type == type
        })
        setInfo(info)
    }
    //立即转账
    const transMoney = async () => {
        let newArr = balanceList.filter(g => {
            return g.type == info.type
        })
        if (!newArr) return
        let gameInfo = newArr[0]
        if (type == 1 && Number(money) > Number(userInfo?.goldCoin || 0)) return message.error({ content: `${t('user_transfer_yebz')}`, duration: .5 })
        if (type == 2 && Number(money) > Number(gameInfo?.balance || 0)) return message.error({ content: `${t('user_transfer_yebz')}`, duration: .5 })
        let params = {
            amount: money,
            gameType: gameInfo?.type,
            tradeType: type,
        };
        setSubmitLoading(true)
        const rt = await upOrDownBalance(params);
        if (!(rt instanceof Error)) {
            setSubmitLoading(false)
            setMoney("");
            if (rt) {
                message.success({ content: `${t('sys_check_pass')}`, duration: .5 })
                freshUser();
                getGameBalanceList();
            }
        }
    }
    useEffect(() => {
        getGameBalanceList()
        if (state) {
            setInfo(state)
        }
    }, [])
    return <div className='container-transfer'>
        <div className='min-title'>{t('user_zz')}</div>
        {/* 钱包金额 */}
        <div className='transfer-money'>
            <div className='title'>{t('user_transfer_qbje')}</div>
            <div className='money-box'>
                <div className='ye'>{t('user_transfer_zhye')}</div>
                <div className='money'>{Number(userInfo?.goldCoin || 0).toFixed(2)}</div>
            </div>
            <div className='game-box'>
                <div className='game-box-title'>{t('ui_wallet_detail')}</div>
                <div className={'game-box-list ' + (loading && 'loading')}>
                    {balanceList.map((item, index) => (<div key={index} onClick={() => history(`/user/transfer`)} className='game-box-item'>
                        <div className='game-box-item-left'>
                            <div className='game-box-item-left-name'>{item.gameName}</div>
                            <div className='game-box-item-left-count'>{(Number(item.balance)).toFixed(2)}</div>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>
        {/* 自动转账 */}
        <div className='transfer-auto'>
            <div className='top'>
                <span>{t('user_transfer_zzzz')}
                    <Popover content={t('user_transfer_tips')}>
                        <QuestionCircleOutlined className='icon' style={{ color: "#FC708B" }} />
                    </Popover>
                </span>
                <Switch loading={switchLoading} className='autoSwitch' size="small" checked={userInfo.autoUpBalance == 0 ? false : true} onChange={(data) => onChangeAuto(data)} />
            </div>
            {userInfo.autoUpBalance == 0 && <div className={'in-out ' + (loading && 'loading')}>
                <div className='box1'>
                    <span className='transfer-out'>{t('wallet_btn_out')}</span>
                    {type == 1 ? t('user_transfer_zxqb') :
                        <Select placeholder={t('header_game_plase_gameType')} style={{ width: '70%' }} defaultValue={info.type} onChange={(data) => onChangeGame(data)}>
                            {balanceList.map(item => (<Option value={item.type} key={item.type}>{item.gameName}</Option>))}
                        </Select>}
                </div>
                <div className='icon icon-transfer' onClick={() => { type == 1 ? setType(2) : setType(1) }}></div>
                <div className='box2'>
                    <span className='transfer-in'>{t('wallet_btn_in')}</span>
                    {type == 1 ? <Select placeholder={t('header_game_plase_gameType')} style={{ width: '70%' }} value={info.type} onChange={(data) => onChangeGame(data)}>
                        {balanceList.map(item => (<Option value={item.type} key={item.type}>{item.gameName}</Option>))}
                    </Select> : t('user_transfer_zxqb')}
                </div>
            </div>}

        </div>
        {userInfo.autoUpBalance == 0 && <div className={'transfer-money '}>
            <div className='title'>{t('user_transfer_zzje')}</div>
            <div className='money-list'>
                {moneyList.map((item, index) => {
                    return <div key={index} className={`money-item ${money == item ? 'active' : ""}`}
                        onClick={() => { setMoney(item) }}>
                        {item}
                    </div>
                })}
            </div>
            <div className='transfer-input'>
                <InputNumber
                    className='money-input'
                    placeholder={t('user_transfer_pzzje')}
                    addonAfter={
                        <span onClick={() => setMoney(Math.floor(userInfo.goldCoin))} className='cursor'>{t('f_ui_all2')}</span>
                    } min="0" value={money}
                    onChange={(data) => { setMoney(data) }}
                />
                {info.gameName && <span className='gold-tips'>1{t('gold_coins')} = {info.gameName}</span>}
            </div>
            <Button loading={submitLoading} disabled={!money || !info.type} onClick={() => transMoney()} type="primary" style={{ width: '250px' }} htmlType="submit">
                {t('user_transfer_ljzz')}
            </Button>
        </div>}
    </div>
}