import { Button, Image, Input, NavBar, Toast, Popup } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import { t } from "i18next";
import style from './index.module.scss'
import { GetUserBank, GetUserUsdt, Statement, WithDraw } from "../../../server/deposit";
import { useNavigate } from "react-router-dom";
import useContextReducer from '../../../state/useContextReducer.js'
import { Local } from "../../../../common";

const MoneyBeLeft = React.lazy(() => import('./moneyBeLeft/index'))

export default function Recharge() {
    const history = useNavigate()
    const { fetchUtils } = useContextReducer.useContextReducer()
    const { freshUser, userGetUserAsserGold } = fetchUtils
    const [balance, setBalance] = useState({})
    const [money, setMoney] = useState(0)
    const [cashPassword, setCashPassword] = useState('')
    const [cardInfo, setCardInfo] = useState({})
    const [usdtIsNull, setUsdtIsNull] = useState(false)
    const [usdtInfo, setUsdtInfo] = useState({})
    const [rateMoney, setRateMoney] = useState(0)
    const [activeKey, setActiveKey] = useState(1)
    const [visible, visibleSet] = useState(false)

    const fee = Local('baseInfo')?.fee || 0;

    // 获取用户银行信息
    const getBank = async () => {
        const res = await GetUserBank()
        if (!(res instanceof Error)) {
            setCardInfo(res)
        }
    }
    const getUstd = async () => {
        const res = await GetUserUsdt()
        if (!(res instanceof Error)) {
            if (res.length > 0) {
                setUsdtIsNull(true)
                setUsdtInfo(res[0])
            } else {
                setUsdtIsNull(false)
            }
        }
    }
    const getBanlance = async () => {
        const res = await Statement()
        if (!(res instanceof Error)) {
            setBalance(res)
        }
    }
    const init = useCallback(() => {
        getBank();
        getUstd();
        getBanlance()
        if (sessionStorage.getItem('depType')) wayTypeSet(Number(sessionStorage.getItem('depType')))
    }, [])
    useEffect(() => {
        init()
    }, [init])
    useEffect(() => {
        if (fee != 0) {
            setRateMoney(money ? (parseFloat(money) / parseFloat(fee)).toFixed(2) : 0)
        } else {
            setRateMoney(0)
        }
    }, [money])
    const submit = async () => {
        if (activeKey == 1) {
            if (!cardInfo.cardId) return history('/addBank')
        } else {
            if (!usdtInfo.cardId) return history('/addUsdt')
        }
        let params = {
            cardId: activeKey == 1 ? cardInfo.cardId : usdtInfo.cardId,
            cardType: activeKey,
            cash: money,
            cashPassword,
            type: 1,
        }
        const res = await WithDraw(params)
        if (!(res instanceof Error)) {
            Toast.show(t('withdrawals_status.0'))
            // freshUser()
            userGetUserAsserGold()

            getBanlance();
            setMoney(0)
            setCashPassword('')
        }
    }

    const [wayType, wayTypeSet] = useState(7)
    // 切换
    const handleSelectWay = (i) => {
        wayTypeSet(i)
        sessionStorage.setItem('depType', i)
    }

    return <div className={style.gbg}>
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            onBack={() => history(-1)} className={style.wbg}
            // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
            right={<img style={{ width: "23px", height: "23px" }} onClick={() => history("/service")} src={require("../../../assets/image/newImg/kficon.png")} alt="" />}
        >
            <div style={{ fontSize: '18px', color: '#1e1b27', fontWeight: '500' }}>
                {t('ui_withdraw')}
            </div>
        </NavBar>

        {/* title */}
        {/* <div className={style.deposit_title}>
            <div className={style.bg}>
                <div className={style.bg_moneys}>
                    <div className={style.moneys_xu}>金币余额</div>
                    <div className={style.money_div}>
                        <span>{1233}</span>
                        <div className={style.retrieve}>
                            <img src={require('../../../assets/image/newImg/tx/hs.png')} alt="" />{t('btn_one_click_recycling')}
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
        <div className={style.content}>
            <div className={style.scrolls}>
                <MoneyBeLeft />
                <div className={style.way}>
                    <div className={style.rtitle2}>{t('qukuanfangshi')}</div>
                    <div className={style.list}>
                        <div
                            className={`${style.box} ${wayType === 7 ? style.active : ''}`}
                            onClick={() => { handleSelectWay(7), setActiveKey(1) }}>
                            {/* <Image className={style.icon} src={require('../../../assets/image/tx/yh.png')}></Image> */}
                            {t('ui_bank_card_zon')}
                            {
                                wayType === 7 && <img src={require('../../../assets/image/newImg/qbxz.png')} alt="" />
                            }
                        </div>

                        <div
                            className={`${style.box} ${wayType === 29 ? style.active : ''}`}
                            onClick={() => { handleSelectWay(29), setActiveKey(2) }}>
                            {/* <Image className={style.icon} src={require('../../../assets/image/tx/usdt.png')}></Image> */}
                            {'USDT'}
                            {
                                wayType === 29 && <img src={require('../../../assets/image/newImg/qbxz.png')} alt="" />
                            }
                        </div>
                    </div>
                </div>
                {/* 银行卡 */}
                {wayType === 7 && <div className={style.bigs}>
                    <div className={style.rtitle3}>{t('xuanzheyinhangka')}</div>
                    {/* {balanceDom()} */}
                    <div className={style.bBody}>
                        {/* {cardInfo.cardId ? <div className={style.cardInfo}>
            <Image src={cardInfo.logs} className={style.img} />
            <dt>{cardInfo.bankName}</dt>
            <dd>{cardInfo.cardNo}</dd>
        </div>
            : <div className={style.noBindUsbt} onClick={() => history('/addBank')}>
                <ReceivePaymentOutline color='#1ba27a' fontSize={24} className={style.icon} />
                <span>{t('btn_go_to_bind_card')}</span>
            </div>
        } */}
                        {cardInfo.cardNo && <div className={style.select_yh}>
                            <div className={style.cardInfo}>
                                {/* <Image src={cardInfo.logs || require('../../../assets/image/center/icon-bank.png')} className={style.img} /> */}
                                <div>
                                    <dt style={{ paddingBottom: '10px' }}>{cardInfo.bankName}</dt>
                                    <dd>{cardInfo.cardNo}</dd>
                                </div>
                                <img src={require('../../../assets/image/newImg/qbxz.png')} alt="" className={style.right_img} />
                            </div>
                            <div className={style.select_j} onClick={() => history('/addBank')}>
                                <img src={require('../../../assets/image/newImg/tx/jia.png')} alt="" />
                                <p>{t('tianjiayinhangka')}</p>
                            </div>
                        </div>}

                        {!cardInfo.cardNo && <div className={style.noBindUsbt} onClick={() => history('/addBank')}>
                            {/* <ReceivePaymentOutline color='#1ba27a' fontSize={24} className={style.icon} /> */}
                            {/* <img src={require('../../../assets/image/tx/jia.png')} alt="" className={style.icon} /> */}
                            <span>+{t('tianjiayinhanka')}</span>
                        </div>}
                        {
                            cardInfo.cardId && <>
                                <div className={style.Content}>
                                    <div className={style.rtitle}>
                                        {t('rp_withdraw_amount')}
                                    </div>
                                    <div className={style.inputBox}>
                                        <Input className={`${style.input}`} placeholder={t('qingshuruzhuanzhangjine')} type="number" value={money} onChange={setMoney}></Input>
                                        <div className={style.bigs}>
                                            <div className={style.unit}>₫</div><div className={style.goinCoins} onClick={() => setMoney(balance.goinCoin * 1000)}>{t('ui_all')}</div>
                                        </div>
                                    </div>
                                    <div className={style.notice}>
                                        {/* {t('ui_today_withdrawal_amount')}: {balance.goinCoin * 1000 || 0} ₫ */}
                                        <div>
                                            1{t('ynd')}=1000₫,{t('dangqianketixian')}{balance.goinCoin * 1000 || 0}₫
                                        </div>
                                        <div className={style.help} onClick={() => visibleSet(true)}>
                                            {t('cahkanbangzhu')}<img src={require('../../../assets/image/center/left.png')} alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className={style.Content}>
                                    <div className={style.rtitle}>
                                        {/* {t('ui_bank_pwd_colon')} */}
                                        {t('tixianmima')}
                                    </div>
                                    <div className={style.inputBox}>
                                        <Input className={style.input} placeholder={t('tip_pwd_blank')} value={cashPassword} maxLength={16} onChange={setCashPassword}></Input>
                                        <div className={style.goinCoins} onClick={() => history('/fundPassword')}>{t('ui_forget_password')}</div>
                                    </div>
                                </div>
                                <div className={style.disFlex}>
                                    <Button className={style.submit_yh} color="primary" disabled={!cashPassword || !money} onClick={() => submit()}>
                                        {t('ui_withdraw')}
                                    </Button>
                                </div>

                                <div className={style.manMade} onClick={() => history('/service')}>
                                    {t('ruxibangzhu')} <span>{t('lianxikefu')}</span>
                                </div>
                            </>
                        }
                    </div>
                </div>}
                {/* usdt */}
                {
                    wayType === 29 &&
                    <div >
                        <div className={style.uBody}>
                            <div className={style.backgrd}></div>
                            {
                                !usdtIsNull ?
                                    // <div className={style.noBindUsbt2} onClick={() => history('/addUsdt')}>
                                    //     <img src={require('../../../assets/image/center/icon-usdt.png')} alt="" />
                                    //     <span>{t('qianwangbangding')}</span>
                                    // </div>
                                    <div className={style.paddings}>
                                        <div className={style.noBindUsbt} onClick={() => history('/addUsdt')}>
                                            {/* <ReceivePaymentOutline color='#1ba27a' fontSize={24} className={style.icon} /> */}
                                            {/* <img src={require('../../../assets/image/tx/jia.png')} alt="" className={style.icon} /> */}
                                            <span>+{t('qianwangbangding')}</span>
                                        </div>
                                    </div>

                                    :
                                    <div className={style.noBindUsbts}>
                                        {/* <div className={style.Content}>
                                        <div className={style.rtitle}>
                                            {t('select_network')}
                                        </div>
                                        <div className={style.network}>
                                            <img className={style.icon1} src={require('../../../assets/image/center/icon-network.png')} alt="" />
                                            <span className={style.networkName}>{usdtInfo.bankName}</span>
                                            <img className={style.icon2} src={require('../../../assets/image/tx/xnd.png')} alt="" />
                                        </div>
                                    </div> */}
                                        <div className={style.rtitle}>
                                            {t('select_network')}
                                        </div>
                                        <div className={`${style.select_yh} ${style.margin_top14}`} >
                                            <div className={style.cardInfo}>
                                                {/* <Image src={cardInfo.logs || require('../../../assets/image/center/icon-bank.png')} className={style.img} /> */}
                                                <div>
                                                    {/* <dt style={{ paddingBottom: '10px' }}>{usdtInfo.bankName}</dt> */}
                                                    <dd>{usdtInfo.bankName}</dd>
                                                </div>
                                                <img src={require('../../../assets/image/newImg/qbxz.png')} alt="" className={style.right_img} />
                                            </div>
                                            <div className={style.select_j} onClick={() => history('/addUsdt')}>
                                                <img src={require('../../../assets/image/newImg/tx/jia.png')} alt="" />
                                                <p>{t("tianjiaUSDT")}</p>
                                            </div>
                                        </div>

                                        <div className={style.Content}>
                                            <div className={style.rtitle}>
                                                {t('usdt_account')}
                                            </div>
                                            <div className={style.inputBox}>
                                                <div>{usdtInfo.cardNo}</div>
                                            </div>
                                        </div>
                                        {/* <div className={style.Content}>
                                        <div className={style.rate}>
                                            <div>{rateMoney}</div>
                                            <span>{t('exchange_rate')}：{fee}</span>
                                        </div>
                                    </div> */}

                                        <div className={style.Content}>
                                            <div className={style.rtitle}>
                                                {t('rp_withdraw_amount')}
                                            </div>
                                            <div className={style.inputBox}>
                                                <Input className={`${style.input}`} placeholder={t('qingshuruzhuanzhangjine')} type="number" value={money} onChange={setMoney}></Input>
                                                <div className={style.bigs}>
                                                    <div className={style.unit}>₫</div><div className={style.goinCoins} onClick={() => setMoney(balance.goinCoin * 1000)}>{t('ui_all')}</div>
                                                </div>
                                            </div>
                                            <div className={style.notice}>
                                                {/* {t('ui_today_withdrawal_amount')}: {balance.goinCoin * 1000 || 0} ₫ */}
                                                <div>
                                                    1USDT≈{fee / 1000}{t('ynd')},{t('dangqianketixian')}{balance.goinCoin * 1000 || 0}₫
                                                </div>
                                                <div className={style.help} onClick={() => visibleSet(true)}>
                                                    {t('cahkanbangzhu')}<img src={require('../../../assets/image/center/left.png')} alt="" />
                                                </div>
                                            </div>

                                        </div>
                                        <div className={style.Content}>
                                            <div className={style.rtitle}>
                                                {t('tixianmima')}
                                            </div>
                                            <div className={style.inputBox}>
                                                <Input className={style.input} placeholder={t('ui_hint_acc_pwd')} maxLength={16} value={cashPassword} onChange={setCashPassword}></Input>
                                                <div className={style.goinCoins} onClick={() => history('/fundPassword')}>{t('ui_forget_password')}</div>
                                            </div>
                                        </div>
                                        <div className={style.desc}>
                                            <p>{t('ui_tips')}</p>
                                            <p>{t('usdt_tips1')}</p>
                                            <p>{t('usdt_tips2')}</p>
                                            <p>{t('usdt_tips3')}</p>
                                            {/* <p>3.USDT最低提款金额5-10000；</p> */}
                                        </div>
                                        <div className={style.disFlex}>
                                            <Button className={style.submit_yh} disabled={!cashPassword || !money} color="primary" onClick={() => submit()}>
                                                {t('ui_withdraw')}
                                            </Button>
                                        </div>
                                        <div className={style.manMade} onClick={() => history('/service')}>
                                            {t('ruxibangzhu')} <span>{t('lianxikefu')}</span>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>

        <Popup
            visible={visible}
            onMaskClick={() => {
                visibleSet(false)
            }}
            position='bottom'
            bodyStyle={{ height: '264px' }}
        >

            <div className={style.helpPopup}>
                <div className={style.tops}>

                    <div className={style.box}>
                        {t('dangqianyouxiaoliushui')}：
                        <p>
                            {(balance?.allNowStatement || 0) * 1000}₫
                        </p>
                    </div>
                    <div className={`${style.box} ${style.borders}`}>
                        {t('leijiyouxiaoliushui')}：
                        <p>
                            {(balance?.allStatement || 0) * 1000}₫
                        </p>
                    </div>
                </div>
                <div className={style.content_bot}>
                    <div>{t('tixianshuoming')}</div>
                    <div>1.{t('dangqianhuilu')}1000₫=1{t('glod')}</div>
                    {/* 仅当金额大于{balance.needStatement * 1000}₫时才能提现 */}
                    <div>2.{t('jindangjinedayucainengtixian', { 1: `${balance.needStatement * 1000}₫` })}</div>
                </div>
            </div>
        </Popup>
    </div>
}