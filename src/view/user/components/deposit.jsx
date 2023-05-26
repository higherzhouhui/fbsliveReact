import React, { useState, useEffect } from 'react';
import { configPayList, bankList, recharge, ustdRecharge } from '../../../api/userInfo'
import { InputNumber, Form, Input, Button, message, Modal } from 'antd';
import { makeRequest } from '../../../utils/httpHelper'
import { useTranslation } from "react-i18next";
import Copy from '../../../components/common/copy'
import QRCode from 'qrcode.react';
const { TextArea } = Input;
import './deposit.scss'
let timer
export default () => {
    const { t } = useTranslation()
    const [payList, setPayList] = useState([])//支付方式list
    const [bankInfo, setBankInfo] = useState({})//type7 银行卡信息
    const [payIndex, setPayIndex] = useState(0)//支付方式的下标
    const [payType, setPayType] = useState(0)//支付方式类型 7银行卡 29是USDT

    const [bankIndex, setBankIndex] = useState(0)
    const [usdtList, setUsdtList] = useState([])//usdt列表
    const [usdtInfo, setUsdtInfo] = useState({})//当前的usdt信息
    const [usdtIndex, setUsdtIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)

    const [goldInfo, setGoldInfo] = useState({}) //当前选中的金额列
    const [goldIndex, setGoldIndex] = useState(0) //选中金额索引
    const [trueRmbs, setTrueRmbs] = useState(0) //选中索引
    const [rechargeMoneyUSDT, setRechargeMoneyUSDT] = useState("")
    const [ustdRechargeD, setUstdRechargeD] = useState({})
    const [usdtTime, setUsdtTime] = useState(0)
    const [usdtT, setUsdtT] = useState(false)
    const [usdtQRCode, setUsdtQRCode] = useState(true)
    const [msg, setMsg] = useState("00:00:00")
    const [rechargeMoney, setRechargeMoney] = useState(0)
    const [accountNumber, setAccountNumber] = useState("")
    const [name, setName] = useState("")
    const [notice, setNotice] = useState("")

    // 获取支付方式
    const getPayList = async () => {
        setLoading(true)
        const rt = await configPayList();
        if (!(rt instanceof Error)) {
            setLoading(false)
            setPayType(rt.length > 0 ? rt[0].type : 0)
            setPayList(rt || [])
            setGoldInfo(rt.length > 0 ? rt[0].products[0] : {})
        }
    }
    // 获取银行卡/usdt信息
    const getBankList = async () => {
        setLoading2(true)
        const rt = await bankList();
        if (!(rt instanceof Error)) {
            setLoading2(false)
            // 银行卡信息
            if (!rt) return
            let bankInfo = rt.find(e => { return e.type == 7 })
            setBankInfo(bankInfo)
            // usdt信息
            let usdtList = rt.filter(e => { return e.type == 29 })
            if (usdtList.length > 0) {
                setUsdtList(usdtList)
                setUsdtInfo(usdtList[0])
            }
        }
    }
    // 点击支付方式
    const handlePay = ({ type, products }, index) => {
        setGoldInfo(products[0])
        setPayIndex(index)
        setPayType(type)
        setGoldIndex(0)
        setBankIndex(0)
    }
    // 点击银行卡
    const handleBank = (index) => {
        setBankIndex(index)
    }
    // 点击金币
    const handGold = (item, index) => {
        setTrueRmbs('')
        setGoldInfo(item)
        setGoldIndex(index)
    }
    // 
    const coinChoice2 = () => {
        let { submitUrl, supportBank } = payList[payIndex];
        supportBank = supportBank.split(',')[bankIndex]
        let { code } = goldInfo;
        const url = new URL(submitUrl)
        let params = { code, supportBank, }
        let tempTag = true
        if (trueRmbs > 0) {
            if ((Number(trueRmbs) >= Number(payList[payIndex]?.lowest || 0)) && (Number(trueRmbs) <= Number(payList[payIndex]?.highest || 0))) {
                if (payList[payIndex]?.reward > 0) {
                    params = {
                        sectionGold: (trueRmbs * (10 + 0.1 * payList[payIndex]?.reward)),
                        code: 1,
                        trueRmb: trueRmbs,
                        supportBank,
                    }
                } else {
                    params = {
                        sectionGold: trueRmbs * 10,
                        code: 1,
                        trueRmb: trueRmbs,
                        supportBank,
                    }
                }
            } else {
                tempTag = false
                message.error(t('qingshuruqujianfanweijine'));
            }
        } else {
            params = {
                code,
                supportBank,
            }
        }
        if (tempTag) {
            makeRequest({
                url: url.pathname + url.search,
                data: params,
            }).then(({ payHtml }) => {
                if (!payHtml) return message.error(t('tip_hint_sys_err'))
                window.open(payHtml, '_blank')
            })
        }
    }

    const disabledBank = () => {
        return !trueRmbs || !accountNumber || !name || !notice
    }
    // 银行卡提交
    const onFinish = () => {
        Modal.confirm({
            className: "depositAlert",
            width: 340,
            title: t('important_notice'),
            content: t('please_transfer_before_bill_of_lading'),
            okText: t('has_recharged'),
            cancelText: t('not_recharged'),
            onOk: () => setRecharge({ accountNumber, name, notice, trueRmbs, bankId: bankInfo?.bankId })
        })
    }
    // usdt提交
    const onFinishUsdt = (data) => {
        let { rechargeMoney = payList[payIndex].lowest } = data;
        if (Number(rechargeMoney) <= 0) {
            return message.error(t('shu_ru_je'))
        }
        setRechargeMoneyUSDT(rechargeMoney)
        ustdRechargeF(rechargeMoney)
    }

    const setRecharge = async (data) => {
        const rt = await recharge(data)
        if (!(rt instanceof Error)) {
            if (rt) message.success(t('ui_success'))
        }
    }
    const ustdRechargeF = async (amount) => {
        let form = {
            amount: amount || rechargeMoneyUSDT,
            bankId: usdtInfo?.bankId,
        }
        const rt = await ustdRecharge(form)
        if (!(rt instanceof Error)) {
            timeTransition(rt?.time || 0)
            setUstdRechargeD(rt)
            setUsdtTime(rt?.time || 0)
            setUsdtT(true)
            setUsdtQRCode(true)
        }
    }
    const timeTransition = (ms) => {
        let maxtime = ms; //按秒计算
        let _this = this;
        setTimeout(function f() {
            if (maxtime >= 0) {
                let msg = '00:00:00'
                if (maxtime != undefined) {
                    // 转换为式分秒
                    let h = parseInt(maxtime / 60 / 60 % 24)
                    h = h < 10 ? '0' + h : h
                    let m = parseInt(maxtime / 60 % 60)
                    m = m < 10 ? '0' + m : m
                    let s = parseInt(maxtime % 60)
                    s = s < 10 ? '0' + s : s
                    msg = `${h}:${m}:${s}`;
                }
                setMsg(msg)
                --maxtime;
            } else {
                setUsdtQRCode(false)
                setMsg('00:00:00')
                clearTimeout(timer);
                timer = null;
                return;
            }
            timer = setTimeout(f, 1000);
        }, 1000);
    }
    const handlePercentMatch = (value) => {
        const isInteger = /^[0-9]+$/;
        if (value === '' || isInteger.test(value)) {
            setTrueRmbs(value)
        }
    };


    useEffect(() => {
        getPayList();
        getBankList();
    }, [])
    return <div className='container-deposit'>
        {/* 存款 */}
        <div className='min-title'>{t('btn_dep')}</div>
        {/* 充值方式 */}
        <div className='recharge-way-box'>
            <div className='title'>{t('f_ui_dep_method')}</div>
            <div className={'way-box ' + (loading && 'loading')}>
                {payList.map((item, index) => {
                    return <div key={index} className={`way-item ${payIndex == index && 'active'}`}
                        onClick={() => { setTrueRmbs(''), handlePay(item, index) }} >
                        <img className='icon' src={item?.channelImage || require('../../../assets/images/userInfo/icon-deposit.png')} alt="" />
                        <span className='name'>{item.name}</span>
                    </div>
                })}
            </div>
        </div>
        {/* 充值银行 */}
        {(payList[payIndex]?.supportBank && payList[payIndex]?.supportBank !== "") &&
            <div className='recharge-bank-box'>
                <div className='title'>{t('f_rp_dep_bank')}</div>
                <div className={'bank-box'}>
                    {payList[payIndex]?.supportBank.split(',').map((item, index) => (
                        <div key={index} className={`bank-item ${bankIndex == index && 'active'}`} onClick={() => { handleBank(index) }}>{item}</div>
                    ))}
                </div>
            </div>}
        {/* 银行卡输入金额 */}
        {
            payType == 7 &&
            <div className='recharge-gold-box bank-money-box'>
                <div className='title'>{t('user_deposit_ckje')}</div>
                <div className='recharge-gold-input'>
                    <InputNumber
                        className='money-input'
                        placeholder={`Số tiền nạp tối thiểu :${payList.length ? payList[payIndex].lowest : 0}, Tối đa :${payList.length ? payList[payIndex].highest : 0}`}
                        addonAfter={
                            <span className='cursor'>xu</span>
                        } min="0" value={trueRmbs}

                        onChange={(data) => { setTrueRmbs(data) }}
                    />
                    <span className='gold-tips'>1000₫ = 1xu</span>
                </div>
                <div className='container-deposit-des'>{t('recharge_amount_range')} {payList.length ? `${payList[payIndex].lowest} ~ ${payList[payIndex].highest}` : ''}</div>
            </div>
        }
        <div className='recharge-gold-box' >
            {/* 7 银行卡 / 29 usdt */}
            {payType != 7 && payType != 29 &&
                <>
                    <div className='title'> {t('recharge_gold_coin')} </div>
                    <div className={'gold-box ' + (loading && 'loading')}>
                        {payList.length > 0 && payList[payIndex].products.map((item, index) => (
                            <div onClick={() => handGold(item, index)} key={index} className={`gold-item ${(goldIndex == index && trueRmbs == 0) ? 'active' : ''}`}>
                                <div className='text'>{item.goldCoin} {t('gold_coins')}</div>
                                <div className='gold'>{item.userRmb ? (item.userRmb / 100) : 0} {t('monetary_unit')}</div>
                            </div>))}
                    </div>
                </>}
            {payType == 7 && <>
                <div className='bankInfo'>
                    <div className='bankInfo-left'>
                        <div className='title'>{t('user_deposit_hkxx')}</div>
                        <div className='deposit-box-pay-hk'>
                            <Form
                                labelWrap
                                name="basic"
                                autoComplete="off"
                                onFinish={(val) => onFinish(val)}
                                initialValues={{
                                    'rechargeMoney': payList[payIndex].lowest
                                }}
                            >
                                <Form.Item
                                    label={t('selfBankTitle1')}
                                    name="accountNumber"
                                >
                                    <Input placeholder={t('selfBankNotice1')} value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value) }} />
                                </Form.Item>
                                <Form.Item
                                    label={t('selfBankTitle2')}
                                    name="name"
                                >
                                    <Input placeholder={t('selfBankNotice2')} value={name} onChange={(e) => { setName(e.target.value) }} />
                                </Form.Item>
                                <Form.Item
                                    label={t('selfBankTitle3')}
                                    name="notice"
                                >
                                    <TextArea rows={2} placeholder={t('selfBankNotice3')} value={notice} onChange={(e) => { setNotice(e.target.value) }} />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div className='bankInfo-right'>
                        <div className='title'>{t('user_deposit_skxx')}</div>
                        <div className={'deposit-box-pay-sk ' + (loading2 && 'loading2')} >
                            <Form
                                labelWrap
                                name="basic"
                                autoComplete="off"
                            >
                                <Form.Item
                                    label={t('name_of_payee')}>
                                    <Input disabled value={bankInfo?.trueName} suffix={
                                        <Copy text={bankInfo?.trueName || '-'}>
                                            <span className='icon icon-copy'></span>
                                        </Copy>
                                    } />
                                </Form.Item>
                                <Form.Item
                                    label={t('ui_bank_card')}
                                >
                                    <Input disabled value={bankInfo?.cardNo} suffix={
                                        <Copy text={bankInfo?.cardNo || '-'}>
                                            <span className='icon icon-copy'></span>
                                        </Copy>
                                    } />
                                </Form.Item>
                                <Form.Item
                                    label={t('ui_bank_colon')}
                                >
                                    <Input disabled value={bankInfo?.bankName} suffix={
                                        <Copy text={bankInfo?.bankName || '-'}>
                                            <span className='icon icon-copy'></span>
                                        </Copy>
                                    } />
                                </Form.Item>
                                <Form.Item
                                    label={t('f_rp_dep_bank')}
                                >
                                    <Input disabled value={bankInfo?.bankSub} suffix={
                                        <Copy text={bankInfo?.bankSub || '-'}>
                                            <span className='icon icon-copy'></span>
                                        </Copy>
                                    } />
                                </Form.Item>
                                <Form.Item
                                    label={t('remittance_message')}
                                >
                                    <Input disabled value={bankInfo?.remark || '-'} suffix={
                                        <Copy text={bankInfo?.remark || '-'}>
                                            <span className='icon icon-copy'></span>
                                        </Copy>
                                    } />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className='tips'>
                    <div>{t('tip_recharge_steps')}</div>
                </div>
                <Button disabled={disabledBank()} style={{ marginTop: '30px', width: "250px" }} type="primary" onClick={() => onFinish()}>
                    {t('user_withdraw_ljck')}
                </Button>
            </>}
            {/* usdt */}
            {
                payType == 29 &&
                <div className='usdtBox'>
                    <div className='payChannel'>{t('usdt_sk_payChannel')}</div>
                    <div className='bankNameList'>
                        {usdtList.map((item, index) => {
                            return <div key={index}
                                className={`bankName ${usdtIndex == index ? 'active' : ""}`}
                                onClick={() => {
                                    setUsdtInfo(item), setUsdtIndex(index)
                                }}>{item.bankName}</div>
                        })}
                    </div>
                    {payList.length ? <Form
                        labelWrap
                        name="basic"
                        autoComplete="off"
                        onFinish={(val) => onFinishUsdt(val)}
                    >
                        <Form.Item
                            extra={<div className='container-deposit-des'>{t('recharge_amount_range')} {payList.length ? `${payList[payIndex].lowest} ~ ${payList[payIndex].highest}` : ''}</div>}
                            name="rechargeMoney">
                            <InputNumber
                                style={{ marginTop: '10px' }}
                                className='money-input'
                                placeholder={t('shu_ru_je')}
                                min={payList.length ? payList[payIndex].lowest : 0}
                                addonAfter={<span className='cursor'>{t('f_ui_each')}</span>}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                            <Button style={{ width: 250, marginTop: 30, }} type="primary" size="large" htmlType="submit">
                                {t('recharge_now')}
                            </Button>
                        </Form.Item>
                    </Form> : ''}
                </div>
            }
            {/* 7 银行卡 / 29 usdt / 19 电话卡充值提示*/}
            {/* 自定义输入金额区间 */}
            {
                payType != 7 && payType != 29 && payType != 19 && payList[payIndex]?.sizeStatus == 1 &&
                <div className='recharge-gold-input'>
                    <InputNumber
                        className='money-input'
                        placeholder={`Số tiền nạp tối thiểu :${payList.length ? payList[payIndex].lowest : 0}, Tối đa :${payList.length ? payList[payIndex].highest : 0}`}
                        addonAfter={
                            <span className='cursor'>xu</span>
                        } min="0" value={trueRmbs}
                        onChange={(data) => { setTrueRmbs(data) }}
                    />
                    <span className='gold-tips'>1000 {t('gold_coins')} = 1 {t('monetary_unit')}</span>
                </div>
            }
            {/* 底部提交按钮 */}
            {
                payType != 7 && payType != 29 && !loading &&
                <Button onClick={() => coinChoice2()} type="primary" style={{ width: '250px' }} htmlType="submit">
                    {t('vipTxt4')}
                </Button>
            }
            {/* 电话卡充值提示 */}
            {
                payType == 19 &&
                <div className='container-deposit-des' dangerouslySetInnerHTML={{ __html: payList[payIndex].remark.replace(/\r\n/g, '<br/>') }}></div>
            }
        </div>
        {/* 弹窗 */}
        {usdtT && <div className='usdtT'>
            <div className='usdtT_div'>
                <div className='usdtT_title'>
                    <div>
                        {t('usdtzfz')}
                    </div>
                    <img src={require('../../../assets/images/header/gb2.png')} alt="" onClick={() => {
                        clearTimeout(timer)
                        setUsdtTime(0)
                        setUsdtT(false)
                        setUsdtQRCode(false)
                        setMsg('00:00:00')
                    }} />
                </div>
                <div className='usdtT_time'>
                    <img src={require(`../../../assets/images/header/${usdtQRCode ? 'timeicon' : 'timeicon2'}.png`)} alt="" />
                    <span style={{ color: `${usdtQRCode == false ? 'red' : ''}` }}>
                        {msg}
                    </span>
                </div>
                <div className='usdtT_q'>
                    {ustdRechargeD?.amount || 0} USDT
                </div>
                <div className='usdtT_ewm'>
                    {
                        usdtQRCode ? <QRCode style={{ borderRadius: '8px' }} value={ustdRechargeD?.usdtAddress} size={175} /> :
                            <div style={{ position: 'relative', background: `url(${require('../../../assets/images/header/sxewm.png')})`, backgroundSize: '100% 100%', width: '175px', height: '175px', borderRadius: '8px' }}>
                                <div className='usdtT_ewm_sx'>
                                    <img src={require('../../../assets/images/header/usdtsx.png')} alt="" className='usdtT_ewm_sximg' onClick={() => { ustdRechargeF() }} />
                                    <div className='usdtT_ewm_sx_font'>
                                        {t('erweimayishixiao')}
                                    </div>
                                </div>
                            </div>}
                </div>
                {usdtQRCode && <div className="address">
                    <Input className="address_url" disabled value={ustdRechargeD?.usdtAddress} />
                    <Copy text={ustdRechargeD?.usdtAddress || '-'}>
                        <img src={require('../../../assets/images/common/copy-icon.png')} alt="" />
                    </Copy>
                </div>}
            </div>
        </div>}
    </div>
}