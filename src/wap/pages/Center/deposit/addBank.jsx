import { Button, Form, Input, List, NavBar, Picker, Popup } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import style from './index.module.scss'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AddBank, GetBankList } from "../../../server/deposit";
import { Verify } from "../../../components";
import useContextReducer from "../../../state/useContextReducer";

const Recharge = () => {

    const {
        state: { user }
    } = useContextReducer.useContextReducer()

    const history = useNavigate()
    const { t } = useTranslation()

    const [bankList, setBankList] = useState([])
    const [showBank, setShowBank] = useState(false)
    const [bankInfo, setBankInfo] = useState(false)

    const getBank = async () => {
        const res = await GetBankList()
        if (!(res instanceof Error)) {
            setBankList(res)
        }
    }

    const init = useCallback(() => {
        getBank()
    }, [])

    useEffect(() => {
        init()
    }, [init])
    //校验密码
    const checkValue = (_, value, p) => {
        console.log(_, value, p)
        let err = ''
        switch (p) {
            case 'trueName':
                err = t('ui_input_firstname');
                break
            case 'cardNo':
                err = t('ui_please_enter_the_bank_card_number');
                break;
            case 'bankName':
                if (!bankInfo.bankName) {
                    err = t('ui_wap_text_105');
                }
                break;
            case 'phoneCode':
                err = t('tip_code_blank');
                break
            case 'cashPassword':
                err = t('ui_hint_acc_pwd');
                break
        }
        if (p == "bankName") {
            if (!bankInfo.bankName) {
                return Promise.reject(new Error(t('ui_wap_text_105')))
            } else {
                return Promise.resolve()
            }
        } else {
            if (!value) {
                return Promise.reject(new Error(err))
            } else {
                return Promise.resolve()
            }
        }
    }
    const handleBank = (item) => {
        setBankInfo(item)
        setShowBank(false)
    }

    const onSubmit = async (e) => {
        let params = {
            bankCity: "unknow",
            bankCode: bankInfo.bankCode,
            bankName: bankInfo.bankName,
            bankProvince: "unknow",
            bankSub: "unknow",
            cardNo: e.cardNo,
            cashPassword: e.cashPassword,
            mobile: user.phone,
            phoneCode: e.phoneCode,
            trueName: e.trueName,
        }
        const res = await AddBank(params)
        if (!(res instanceof Error)) {
            history(-1)
        }
    }
    return <div className={style.gbg}>
        {/* <NavBar onBack={() => history(-1)} className={style.wbg}>{t('ui_add_bank_card')}</NavBar> */}
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            className={style.wbg}
        // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
        >
            <div style={{ fontSize: '18px', color: 'rgb(30, 27, 39)', fontWeight: '500' }}>
                {t('ui_add_bank_card')}
            </div>
        </NavBar>
        <div className={style.addForm}>
            <Form
                layout='horizontal'
                footer={
                    <Button className={style.submitBtn} block type='submit' color='primary' size='large' style={{ "--border-radius": "1000px", }} loading="auto">
                        {t('btn_submit')}
                    </Button>
                }
                onFinish={onSubmit}
            >
                <Form.Item
                    name='trueName'
                    label={t('ui_open_acc_name_colon')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'trueName') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('ui_input_firstname')} />
                </Form.Item>
                <Form.Item
                    name='cardNo'
                    label={t('ui_bank_acc_colon')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'cardNo') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('ui_please_enter_the_bank_card_number')} />
                </Form.Item>
                <Form.Item
                    name='bankName'
                    label={t('ui_open_acc_bank_colon')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'bankName') }]}
                    onClick={(e, picker) => {
                        setShowBank(true)
                    }}
                >
                    <div>
                        {bankInfo.bankName ? bankInfo.bankName : <div className={style.placeholder}> {t('ui_wap_text_105')}</div>}
                    </div>
                </Form.Item>
                <Form.Item
                    label={user.phone}
                >
                    <Verify phone={user.phone} type={5} noBtn={true} sendType="2"></Verify>
                </Form.Item>
                <Form.Item
                    name='phoneCode'
                    label={t('ui_sms_verification_code')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'phoneCode') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('tip_code_blank')} maxLength={6} />
                </Form.Item>
                <Form.Item
                    name='cashPassword'
                    label={t('ui_bank_pwd_colon')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'cashPassword') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('ui_hint_acc_pwd')} maxLength={16} />
                </Form.Item>
            </Form>
        </div>

        <Popup showCloseButton onClose={() => { setShowBank(false) }} onMaskClick={() => setShowBank(false)}
            visible={showBank}
            bodyClassName={style.Popup_bankBody}
        >
            <div className={style.bankBody}>
                <div className={style.titleModal}>
                    {t('ui_add_bank_card')}
                </div>
                <div className={style.listbox}>
                    {bankList.map((item, index) =>
                        <div className={style.item} key={index} onClick={() => { handleBank(item) }}>
                            {/* e.className = `${style.img} ${style.imgss}` */}
                            <img className={style.img} src={item.img} alt="" onError={(e) => { e.target.style = 'display: none' }} />
                            <span className={style.bankName}>{item.bankName}</span>
                        </div>)}
                </div>
            </div>
        </Popup>
    </div>
}

export default Recharge