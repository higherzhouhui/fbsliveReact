import { Toast, Skeleton, NavBar, Input, Button } from "antd-mobile";
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { t } from "i18next";
import React, { useState, useEffect, } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { GetGiftList, propCar, setShowCar } from "../../../server/live";
import { CNavBar, CEmpty, Verify } from '../../../components'
import { doBandingPhone, authCheckSms } from "../../../server/login";
import moment from 'moment'
import { Local } from "../../../../common";
import useContextReducer from "../../../state/useContextReducer";
const Index = () => {
    const {
        state: { loginForm },
        fetchUtils,
    } = useContextReducer.useContextReducer();
    const { freshUser, userGetUserAsserGold } = fetchUtils;
    const { state } = useLocation()
    const history = useNavigate()
    const [GetGiftListD, GetGiftListDSet] = useState([])
    const [propCarGid, propCarGidSet] = useState()
    const [propCarD, propCarDSet] = useState([])
    const [phones, phonesSet] = useState('')
    const [verify, verifySet] = useState('')
    const [passwords, passwordsSet] = useState('')
    const [changingOver, changingOverSet] = useState(1)

    const [visible, setVisible] = useState(false)
    const [resD, resDSet] = useState(false)
    console.log('passwords-------', passwords);
    const flagRegisterUserF = async () => {
        if (state.a != undefined && state.a) {
            if (resD) {
                Toast.show({
                    content: t('gaishoujihaoyizhuce')
                })
            } else {
                authCheckSmsF(2)
            }
        } else {
            if (resD) {
                authCheckSmsF(1)
            } else {
                authCheckSmsF(2)
            }
        }
    }
    const butF = () => {
        flagRegisterUserF()
        // 未注册用户有设置密码流程
    }
    const authCheckSmsF = async (e) => {
        let data = {
            phone: phones != null && phones != undefined && phones.length > 0 ? phones : null,
            vcode: verify
        }
        const res = await authCheckSms(data)
        if (!(res instanceof Error)) {
            console.log('res----------------验证码', res);
            if (res) {
                if (e == 2) {
                    changingOverSet(2)
                } else {
                    doBandingPhoneF()
                }
            }
        }
    }
    const doBandingPhoneF = async () => {
        let data = {
            accessToken: Local('accessToken'),
            phone: phones != null && phones != undefined && phones.length > 0 ? phones : null,
            password: passwords,
            vcode: verify
        }
        const res = await doBandingPhone(data)
        if (!(res instanceof Error)) {
            console.log('res0----------------', res);
            if (res != null && res.token != null && res.token != undefined && res.token.length > 0) {
                Local("token", res.token);
                await freshUser();
                // userGetUserAsserGold()
                window.eventBus.emit("store", { type: "handleLogin" });
                history("/live");
            }
        }
    }

    const changingOver1 = () => {
        return <div className={style.container}>
            {/* title */}
            <div className={style.title}>
                {t('bangdingshoujihao')}
                <p>
                    {t('weilnindzhanghaoanquan')}
                </p>
            </div>
            {/* input */}
            <div className={style.inputs}>
                <p>
                    {t('TelephoneNumber')}
                </p>
                <div className={style.inp}>
                    <Input type='text' placeholder={t('tip_acc_blank')} value={phones} onChange={(e) => {
                        (/^[0-9][0-9]*$/.test(e) || e == '') && e.length <= 10 && phonesSet(e)
                    }} />
                </div>
            </div>
            <div className={style.inputs}>
                <p>
                    {t('ui_code')}
                </p>
                <div className={style.inp}>
                    <Input type='text' placeholder={t('tip_code_blank')} value={verify} onChange={(e) => {
                        (/^[0-9][0-9]*$/.test(e) || e == '') && e.length <= 4 && verifySet(e)
                    }} />
                    <Verify facebookS={1} stateA={state.a} flagRegisterUsers={(res) => {
                        resDSet(res)
                        if (state.a != undefined && state.a) {
                            if (res) {
                                Toast.show({
                                    content: t('gaishoujihaoyizhuce')
                                })
                            }
                            // else {
                            //     authCheckSmsF(2)
                            // }
                        }
                        // else {
                        //     if (res) {
                        //         authCheckSmsF(1)
                        //     } else {
                        //         authCheckSmsF(2)
                        //     }
                        // }
                    }} phone={phones} type={3} className={style.Verify} Click={() => { }} sendType="1"></Verify>
                </div>
            </div>
            {/* <div className={style.inputs}>
            <p>
                设置密码
            </p>
            <div className={style.inp}>
                <Input placeholder={'设置密码'} type={visible ? 'text' : 'password'} value={passwords} onChange={passwordsSet} />
                <div className={style.eye}>
                    {!visible ? (
                        <EyeInvisibleOutline onClick={() => setVisible(true)} />
                    ) : (
                        <EyeOutline onClick={() => setVisible(false)} />
                    )}
                </div>
            </div>
        </div> */}
            <Button className={style.buts} disabled={!phones || !verify} loading='auto' onClick={() => flagRegisterUserF()}>
                {t('btn_confirm')}
            </Button>
        </div>
    }
    const changingOver2 = () => {
        return <div className={style.container}>
            {/* title */}
            <div className={style.title}>
                {t('shezhizhanghaomima')}
                <p>
                    {t('weilnindzhanghaoanquanshezhinindemima')}
                </p>
            </div>
            {/* input */}
            <div className={style.inputs}>
                <p>
                    {t('TelephoneNumber')}
                </p>
                <div className={`${style.inp} ${style.back}`}>
                    <Input disabled value={phones} onChange={phonesSet} />
                </div>
            </div>
            <div className={style.inputs}>
                <p>
                    {t('enterPass')}
                </p>
                <div className={style.inp}>
                    <Input placeholder={t('enterPass')} maxLength={16} type={visible ? 'text' : 'password'} value={passwords} onChange={passwordsSet} />
                    <div className={style.eye}>
                        {!visible ? (
                            <EyeInvisibleOutline onClick={() => setVisible(true)} />
                        ) : (
                            <EyeOutline onClick={() => setVisible(false)} />
                        )}
                    </div>
                </div>
            </div>
            <Button className={style.buts} disabled={!phones || !verify} loading='auto' onClick={() => doBandingPhoneF()}>
                {t('btn_confirm')}
            </Button>
        </div>
    }
    return <div>
        <NavBar
            className={style.wbg}
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} className={style.leftImg} onClick={() => history(-1)} />}
            onBack={() => history(-1)}
        >
        </NavBar>
        {/* 内容 */}
        <div className={style.bodys}>
            {changingOver == 1 ?
                changingOver1()
                : changingOver == 2 ?
                    changingOver2()
                    : ''}
            {/* <div className={style.container}>
                <div className={style.title}>
                    {t('bangdingshoujihao')}
                    <p>
                        {t('weilnindzhanghaoanquan')}
                    </p>
                </div>
                <div className={style.inputs}>
                    <p>
                        {t('TelephoneNumber')}
                    </p>
                    <div className={style.inp}>
                        <Input placeholder={t('tip_acc_blank')} value={phones} onChange={phonesSet} />
                    </div>
                </div>
                <div className={style.inputs}>
                    <p>
                        {t('ui_code')}
                    </p>
                    <div className={style.inp}>
                        <Input placeholder={t('tip_code_blank')} value={verify} onChange={verifySet} />
                        <Verify phone={phones} type={3} className={style.Verify} Click={() => { }} sendType="1"></Verify>
                    </div>
                </div>
                {state.i == 2 && <div className={style.inputs}>
                    <p>
                        设置密码
                    </p>
                    <div className={style.inp}>
                        <Input placeholder={'设置密码'} type={visible ? 'text' : 'password'} value={passwords} onChange={passwordsSet} />
                        <div className={style.eye}>
                            {!visible ? (
                                <EyeInvisibleOutline onClick={() => setVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setVisible(false)} />
                            )}
                        </div>
                    </div>
                </div>}
                <Button className={style.buts} disabled={!phones || !verify || (state.i == 2 && !passwords)} loading='auto' onClick={() => doBandingPhoneF()}>
                    {t('btn_confirm')}
                </Button>
            </div> */}
        </div>
    </div>
}

export default Index;
