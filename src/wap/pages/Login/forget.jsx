import { Verify } from "../../components"
import { Button, Toast } from "antd-mobile"
import { Input } from '../../components'
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router-dom"
import { updatePass } from "../../server/center"
import React, { useState } from "react"
import Style from './forget.module.scss'

const Register = () => {
    const { state } = useLocation()
    let [mobile, setMobile] = useState('')
    let [password, passwordSet] = useState('')
    let [repass, repassSet] = useState('')
    let [code, setCode] = useState('')
    useState(() => {
        if (state != null && state.x == true) {
            setMobile(state.phone)
        }
        console.log('这是多少数据', state);
    }, [])
    const { t } = useTranslation()
    const history = useNavigate()

    // 步骤1
    const step1 = () => {
        const handleCheckPhone = async () => {
            if (!mobile) return Toast.show(t('register_phoneNum_tips'))
            if (!code) return Toast.show(t('enterVerify'))
            if (!password) return Toast.show(t('enterPass'))
            if (password !== repass) return Toast.show(t('repassError'))
            const res = await updatePass({ mobile, vcode: code, password })
            if (!(res instanceof Error)) {
                Toast.show(t('ui_change_successful'))
                history(-1)
            }
        }
        return <>
            <div className={Style.formBody}>
                {/* <div className={Style.bg}></div> */}
                <img onClick={() => { history(-1) }} src={require('../../assets/image/login/left.png')} alt="" style={{ width: '18px', height: '18px', position: 'fixed', top: '20px', left: '16px' }} />
                <div className={Style.title} >{state != null && state.x == true ? t('ui_wap_text_097') : t('ui_forget_password')}</div>
                <div>
                    <span className={Style.label}>{t('ui_mobile_phone_number')}</span>
                    <Input
                        placeholder={t('ui_please_enter_phone_number')}
                        value={mobile}
                        onChange={val => {
                            setMobile(val)
                        }}
                        maxLength={10}
                        style={{ "--color": "#000" }}
                        type="account"
                        className={Style.stepInput}
                    />
                </div>
                <div>
                    <span className={Style.label}>{t('ui_code')}</span>
                    <div className={Style.inputGroup}>
                        <Input
                            placeholder={t('enterVerify')}
                            value={code}
                            onChange={val => {
                                setCode(val)
                            }}
                            style={{ "--color": "#000" }}
                            type="account"
                            maxLength={4}
                            className={Style.stepInput}
                        />
                        {/* <Verify phone={mobile} type={3} className={Style.Verify} sendType="1" sendTxts='123'></Verify> */}
                        {/* <Verify phone={mobile} type={3}  className={Style.Verify} sendType="1"></Verify> */}

                        <Verify phone={mobile} type={3} className={Style.Verify} Click={() => { }} sendType="1"></Verify>
                    </div>
                </div>
                <div>
                    <span className={Style.label}>{t('password')}</span>
                    <Input type="password" style={{ "--color": "#000" }} value={password} className={Style.stepInput} placeholder={t('tip_pwd_blank')} onChange={passwordSet}></Input>
                </div>
                <div>
                    <span className={Style.label}>{t('repass')}</span>
                    <Input type="password" style={{ "--color": "#000" }} value={repass} className={Style.stepInput} placeholder={t('tip_pwd_blank_again')} onChange={repassSet}></Input>
                </div>
                <Button className={Style.nextBtn1} block color="primary" size="large" loading="auto" onClick={handleCheckPhone} disabled={!mobile || !code}>{t('btn_confirm')}</Button>
            </div>
        </>
    }
    return <>
        {step1()}
    </>
}

export default Register