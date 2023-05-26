import React, { useEffect, useState } from 'react';
import { gameBalanceList, backAllGameCoin } from '../../../api/userInfo';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'
import useContextReducer from '../../../state/useContextReducer.js'
import './wallet.scss'
export default () => {
    const history = useNavigate()
    const { t } = useTranslation()
    const { state: { user: userInfo }, fetchUtils } = useContextReducer.useContextReducer()
    const { freshUser } = fetchUtils;
    const [recycleLoading, setRecycleLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [walletList, setWalletList] = useState([])
    // 一键回收
    const getBackAllGameCoin = async () => {
        setRecycleLoading(true)
        const rt = await backAllGameCoin();
        if (!(rt instanceof Error)) {
            freshUser();
            getGameBalanceList()
            // alert(1)
            setRecycleLoading(false)
        }
    }
    // 获取全部的游戏余额
    const getGameBalanceList = async () => {
        setLoading(true)
        const rt = await gameBalanceList();
        if (!(rt instanceof Error)) {
            setWalletList(rt || [])
            setLoading(false)
            window.eventBus.emit('balance', true)
        }
    }

    useEffect(() => {
        getGameBalanceList()
    }, [])
    return <div className='wallet-box'>
        <div style={{ padding: 20 }}>
            <div className='main-title'>{t('ui_my_wallet')}</div>
            <div className='wallet-box-card'>
                <div className='wallet-box-card-money'>
                    <div className='icon-box'>
                        <span className='icon icon-wallet-ye'></span>
                    </div>
                    <div className='money-ye'>
                        <div className='wallet-box-card-title'>{t('user_transfer_zhye')}</div>
                        <div className='wallet-box-card-value'>{(Number(userInfo?.goldCoin || 0)).toFixed(2)}</div>
                    </div>
                    <div className={`btn-box ${recycleLoading && 'loading'}`} onClick={() => getBackAllGameCoin()}>
                        <div className='icon icon-wallet-yjhs'></div>
                        <div className='btn' loading={recycleLoading} >{t('btn_one_click_recycling')}</div>
                    </div>
                </div>
                <div className='flex wallet-box-card-btn-group'>
                    <div className='item' onClick={() => { history(`/user/deposit`), window.eventBus.emit('userInfoLink', 'deposit') }}>
                        <span className='icon icon-wallet-ck'></span>
                        <span className='title'>{t('btn_dep')}</span>
                    </div>
                    <div className='item' onClick={() => { history(`/user/transfer`), window.eventBus.emit('userInfoLink', 'transfer') }}>
                        <span className='icon icon-wallet-zz'></span>
                        <span className='title'>{t('user_zz')}</span>
                    </div>
                    <div className='item' onClick={() => { history(`/user/withdraw`), window.eventBus.emit('userInfoLink', 'withdraw') }}>
                        <span className='icon icon-wallet-qk'></span>
                        <span className='title'>{t('user_qk')}</span>
                    </div>
                </div>
            </div>
            <div className='wallet-box-bottom'>
                <div className='wallet-box-bottom-title'>{t('ui_wallet_detail')}</div>
                <div className={'wallet-box-bottom-list ' + (loading && 'loading')}>
                    {walletList.map((item, index) => (<div key={index} className='wallet-box-bottom-item'>
                        <div className='wallet-box-bottom-item-left'>
                            <div className='wallet-box-bottom-item-left-name'>{item.gameName}</div>
                            <div className='wallet-box-bottom-item-left-count'>{(Number(item.balance)).toFixed(2)}</div>
                        </div>
                        <div className='wallet-box-bottom-item-change' onClick={() => { history(`/user/transfer`, { state: { ...item } }), window.eventBus.emit('userInfoLink', 'transfer') }}>{t('wallet_btn_cvt')}</div>
                    </div>))}
                </div>
            </div>
        </div>
    </div>
}