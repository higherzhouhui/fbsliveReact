import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from "react-i18next";
import { bankSelected, usdtListInfo, userWithdraw } from '../../../api/userInfo'
import { Image, Input, InputNumber, Button, message } from 'antd';
import useContextReducer from '../../../state/useContextReducer.js'
import BindBank from './common/bindBank'
import BindUsdt from './common/bindUsdt'
import './withdraw.scss'
export default () => {
    const { t } = useTranslation()
    const { state: { user: userInfo, }, fetchUtils, } = useContextReducer.useContextReducer();
    const { freshUser } = fetchUtils;
    const way = [
        { title: t('user_withdraw_bank'), value: 7 },
        { title: t('user_withdraw_usdt'), value: 29 },
    ]
    const [wayIndex, setWayIndex] = useState(7)
    const [loading, setloading] = useState(false)
    const [bankInfo, setBankInfo] = useState({})
    const [usdtInfo, setUsdtInfo] = useState({})
    const [money, setMoney] = useState("")
    const [cashPassword, setCashPassword] = useState("")
    const [submitLoading, setSubmitLoading] = useState(false)
    const [bankShow, setBankShow] = useState(false)
    const [usdtShow, setUsdtShow] = useState(false)
    const getBankInfo = async () => {
        setloading(true)
        const rt = await bankSelected()
        if (!(rt instanceof Error)) {
            setloading(false)
            setBankInfo(rt)
        }
    }
    const getUstdInfo = async () => {
        const rt = await usdtListInfo()
        if (!(rt instanceof Error)) {
            if (rt.length > 0) {
                setUsdtInfo(rt[0])
            }
        }
    }
    const init = useCallback(() => {
        getBankInfo();
        getUstdInfo();
    }, [])
    useEffect(() => {
        init()
    }, [init])

    // 银行卡/usdt提现
    const onSubmit = async () => {
        if (wayIndex == 7) {
            if (!bankInfo.cardId) return history('/addBank')
        } else {
            if (!usdtInfo.cardId) return history('/addUsdt')
        }
        let params = {
            cardId: wayIndex == 7 ? bankInfo.cardId : usdtInfo.cardId,
            cardType: wayIndex === 7 ? 1 : 2,
            cash: money,
            cashPassword,
            type: 1,
        }
        setSubmitLoading(true)
        const res = await userWithdraw(params)
        if (!(res instanceof Error)) {
            setSubmitLoading(false)
            if (res) {
                setMoney("")
                setCashPassword('')
                freshUser();
                message.success({ content: `${t('user_withdraw_success')}`, duration: .5 })
            }
        }
    }
    // 用户卡/usdt 共用页面
    const withdrawDom = () => {
        return <>
            <div className='title'>{t('user_withdraw_txje')}</div>
            <div className='withdraw-input'>
                <InputNumber
                    placeholder={t('user_withdraw_ptxje')}
                    style={{ width: "532px", borderRadius: "10px", height: "50px" }}
                    addonAfter={
                        <span onClick={() => setMoney(Math.floor(userInfo.goldCoin * 1000))} className='primary-text cursor'>{t('all_exchange')}</span>
                    } min="0" value={money}
                    onChange={(data) => { setMoney(data) }}
                />
            </div>
            <div className='title'>{t('personal_information_lb_withdrawal_password')}</div>
            <div className='withdraw-input'>
                <Input.Password className='input' placeholder={t('personal_information_phd_withdrawal_password')} value={cashPassword}
                    onChange={(e) => { setCashPassword(e.target.value) }}
                />
            </div>
            <Button loading={submitLoading} disabled={!money || !cashPassword} onClick={() => onSubmit()} type="primary" style={{ width: '250px' }} htmlType="submit">
                {t('user_withdraw_ljck')}
            </Button>
        </>
    }
    const hideBindBank = () => {
        setBankShow(false)
        init()
    }
    const hideBindUsdt = ()=>{
        setUsdtShow(false)
        init();
    }
    return <div>
        <div className='container-withdraw' id="container-withdraw">
            {/* 取款 */}
            <div className='min-title'>{t('user_qk')}</div>
            {/* 钱包金额 */}
            <div className='wallet-box'>
                <div className="title">{t('user_transfer_qbje')}</div>
                <div className='money-box'>
                    <div className='ye'>{t('user_transfer_zhye')}</div>
                    <div className='money'>{Number(userInfo?.goldCoin || 0).toFixed(2)}</div>
                </div>
            </div>
            {/* 提现内容 */}
            <div className='withdraw-box'>
                <div className='title'>{t('user_withdraw_qkfs')}</div>
                <div className='way-box'>
                    {way.map((item, index) => {
                        return <div key={index} onClick={() => setWayIndex(item.value)} className={`way-box-item ${wayIndex == item.value && 'active'}`}>{item.title}</div>
                    })}
                </div>
                {wayIndex === 7 && <>
                    <div className='title'>{t('f_ui_bank_card_zon')}</div>
                    <div className={`bank-usdt-info ${loading && 'loading'}`}>
                        {bankInfo.cardNo ? <div className="bankInfo">
                            <Image src={bankInfo.logs || require('../../../assets/images/userInfo/icon-bank.png')} className="logs" />
                            <div className='info'>
                                <dt>{bankInfo.bankName}</dt>
                                <dd>{bankInfo.cardNo}</dd>
                            </div>
                        </div> :
                            <div className='no-data' onClick={() => setBankShow(true)}>
                                <span className='icon icon-add'></span> {t('user_withdraw_noBank')}
                            </div>
                        }
                    </div>
                </>}

                {wayIndex === 29 && <>
                    <div className='title'>USDT</div>
                    <div className={`bank-usdt-info ${loading && 'loading'}`}>
                        {usdtInfo.cardNo ?
                            <div className="bankInfo">
                                <Image src={usdtInfo.logs  || require('../../../assets/images/userInfo/icon-bank.png')} className="logs" />
                                <div className='info'>
                                    <dt>{usdtInfo.bankName}</dt>
                                    <dd>{usdtInfo.cardNo}</dd>
                                </div>
                            </div> :
                            <div className='no-data' onClick={() => setUsdtShow(true)}>
                                <span className='icon icon-add'></span> {t('user_withdraw_noUsdt')}
                            </div>
                        }
                    </div>
                </>}
                {wayIndex === 7 && bankInfo.cardId && withdrawDom()}
                {wayIndex === 29 && usdtInfo.cardId && withdrawDom()}
            </div>
        </div>
        <div className={`drawer-body ${bankShow ? 'show' : 'hide'}`}>
            <BindBank hideBindBank={() => hideBindBank()} />
        </div>
        <div className={`drawer-body ${usdtShow ? 'show' : 'hide'}`}>
            <BindUsdt hideBindUsdt={() => hideBindUsdt()} />
        </div>
    </div>
}