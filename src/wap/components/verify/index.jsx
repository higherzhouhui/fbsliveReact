import { isRegister, SendSms, WyVerify, SendSms2 } from "../../server/login"
import { Button, Toast } from "antd-mobile"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Style from './index.module.scss'
import { Local } from "../../../common"
import { flagRegisterUser } from "../../server/login"

let timer
const Verify = (props) => {
    const { phone, type, noBtn, className, sendType, Click, flagRegisterUsers, facebookS, stateA } = props
    const { t } = useTranslation()
    const sendTxt = props.sendTxts === undefined ? <span className={Style.jqColor} >{t('ui_send_verification')}</span> : <span className={Style.jqColor}>{t('Reacquire')}</span>
    let [sendTime, setSendTime] = useState(0)
    let [cid, setCid] = useState('')
    let [isSend, setIsSend] = useState(false)

    const sendSms = async () => {
        if (!phone) return
        if (!((/^0\d{9}$/).test(phone))) return Toast.show(t('shu_ru_true_phone'))
        if (sendTime > 0) return
        if (isSend) return
        if (type === 1) {
            const res = await isRegister({ mobile: phone })
            if (!(res instanceof Error)) {
                if (res !== '0') return Toast.show({ content: t('yi_bei_reg') })
                if (res === '0') {
                    const res = await WyVerify()
                    if (!(res instanceof Error)) {
                        initCaptch(res.verificationNo)
                    }
                }
            }
        } else {
            // if (facebookS) flagRegisterUserF()
            if (facebookS != undefined) {
                flagRegisterUserF()
            } else {
                const res = await WyVerify()
                if (!(res instanceof Error)) {
                    initCaptch(res.verificationNo)
                }
            }

        }

    }
    //facebook 判断是否是新账号
    const flagRegisterUserF = async () => {
        const res_2 = await flagRegisterUser({ phone: phone })
        if (!(res_2 instanceof Error)) {
            flagRegisterUsers(res_2)
            if (stateA != undefined && stateA) {
                if (!res_2) {
                    const res = await WyVerify()
                    if (!(res instanceof Error)) {
                        initCaptch(res.verificationNo)
                    }
                }
            } else {
                const res = await WyVerify()
                if (!(res instanceof Error)) {
                    initCaptch(res.verificationNo)
                }
            }
        } else {
            console.log(111);
        }
    }
    // 初始化易盾
    const initCaptch = (captchaId) => {
        let lang = ''
        let langKey = Local(lang)
        switch (langKey) {
            case 'zh':
                lang = 'zh-CN'
                break
            case 'en':
                lang = 'en'
                break
            case 'th':
                lang = 'th'
                break
            case 'vie':
                lang = 'vi'
                break
            default:
                lang = 'vi'
                break
        }
        /* eslint-disable */
        initNECaptcha(
            {
                element: '#captcha',
                captchaId,
                width: '300px',
                mode: 'popup',
                lang,
                protocol: location?.protocol?.replace(/\:/g, ''),
                //验证成功
                onVerify: async (err, data) => {
                    if (!err) {
                        try {
                            let res
                            if (sendType == '1') {
                                res = await SendSms({
                                    mobile: phone,
                                    type: type,
                                    captchaValidate: data.validate,
                                    verificationNo: captchaId,
                                })
                                Click()
                            } else if (sendType == '2') {
                                res = await SendSms2({
                                    mobile: phone,
                                    type: type,
                                    captchaValidate: data.validate,
                                    verificationNo: captchaId,
                                })
                            }

                            if (!(res instanceof Error)) {
                                setSendTime(180)
                                handelSetPid(data.validate)
                                Toast.show(t('yzm_cg'))
                                setIsSend(true)
                            }
                        } catch (error) {
                            setIsSend(false)
                        }
                    }
                },
            },
            //加载成功
            (onload = (instance) => {
                setCid(captchaId)
                instance.popUp()
            }),
            (onerror = (err) => {
                console.warn(err)
            }),
        )
        /* eslint-enable */
    }

    // 获取验证id
    const handelSetPid = (id) => {
        props.onGetId(id)
    }
    useEffect(() => {
        timer && clearInterval(timer);
        return () => timer && clearInterval(timer);
    }, []);

    useEffect(() => {
        if (sendTime === 180) timer = setInterval(() => setSendTime(time => --time), 1000)
        else if (sendTime === 0) clearInterval(timer)
    }, [sendTime])
    return <>
        <div id="captcha"></div>
        <Button color="primary" size="mini" className={`${noBtn ? Style.noBtn : Style.btn} ${className}`} loading='auto' onClick={() => sendSms()}>{sendTime > 0 ? <span className={Style.jqColor}>{sendTime}</span> : sendTxt}</Button></>
}

export default Verify