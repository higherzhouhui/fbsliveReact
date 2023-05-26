import { Button, Form, Input, List, NavBar, Picker, Popup, Toast } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import style from './index.module.scss'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BankUsdt, GetBankList } from "../../../server/deposit";
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
            case 'cardNo':
                err = t('p_usdt_address');
                break;
            case 'phoneCode':
                err = t('tip_code_blank');
                break
            case 'cashPassword':
                err = t('ui_hint_acc_pwd');
                break
        }
        if (!value) {
            return Promise.reject(new Error(err))
        } else {
            return Promise.resolve()
        }
    }
    const handleBank = (item) => {
        setBankInfo(item)
        setShowBank(false)
    }
    const onSubmit = async (e) => {
        let params = {
            bankName: 'trc20',
            cardNo: e.cardNo,
            cashPassword: e.cashPassword,
            phoneCode: e.phoneCode,
            mobile: user.phone,
        }
        const res = await BankUsdt(params)
        if (!(res instanceof Error)) {
            Toast.show(t('live_setting_succee'))
            history(-1)
        }
    }
    return <div className={style.gbg}>
        {/* <NavBar onBack={() => history(-1)} className={style.wbg}>{t('add_usdt')}</NavBar> */}

        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            className={style.wbg}
        // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
        >
            <div style={{ fontSize: '18px', color: 'rgb(30, 27, 39)', fontWeight: '500' }}>
                {t('add_usdt')}
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
                    label={user.phone}
                >
                    <Verify phone={user.phone} type={5} noBtn={true} sendType="2"></Verify>
                </Form.Item>
                <Form.Item
                    name='phoneCode'
                    label={t('ui_code')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'phoneCode') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('enterVerify')} maxLength={4} />
                </Form.Item>
                <Form.Item
                    name='cardNo'
                    label={t('usdt_address')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'cardNo') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('p_usdt_address')} />
                </Form.Item>
                <Form.Item
                    name='cashPassword'
                    label={t('ui_bank_pwd')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'cashPassword') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('ui_hint_acc_pwd')} />
                </Form.Item>
            </Form>
        </div>

        <Popup visible={showBank} showCloseButton onClose={() => { setShowBank(false) }} onMaskClick={() => { setShowBank(false) }}>
            <div className={style.bankBody}>
                <div className={style.titleModal}>
                    {t('ui_add_bank_card')}
                </div>
                <div className={style.listbox}>
                    {bankList.map((item, index) =>
                        <div className={style.item} key={index} onClick={() => { handleBank(item) }}>
                            <img className={style.img} src={item.img} alt="" />
                            <span className={style.bankName}>{item.bankName}</span>
                        </div>)}
                </div>
            </div>
        </Popup>
    </div>
}

export default Recharge