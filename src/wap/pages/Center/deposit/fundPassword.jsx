import { Button, Form, Input, NavBar, Toast } from "antd-mobile";
import React, { useState } from "react";
import style from './index.module.scss'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GetResetCashPwd } from "../../../server/user";
import { Verify } from "../../../components";
import useContextReducer from "../../../state/useContextReducer";
const FundPassword = () => {

    const {
        state: { user }
    } = useContextReducer.useContextReducer()
    const history = useNavigate()
    const { t } = useTranslation()
    //校验
    const checkValue = (_, value, p) => {
        let err = ''
        switch (p) {
            case 'vcode':
                err = t('enterVerify');
                break;
            case 'password':
                err = t('p_newPassword');
                break;
            case 'cashPassword':
                err = t('p_confimPassword');
                break
        }
        if (!value) {
            return Promise.reject(new Error(err))
        } else {
            return Promise.resolve()
        }
    }

    const onSubmit = async ({ vcode, password, cashPassword, }) => {
        if (password != cashPassword) {
            return Toast.show(t('password_atypism'))
        }
        let params = {
            vcode,
            password,
            mobile: user.phone,
        }
        const res = await GetResetCashPwd(params)
        if (!(res instanceof Error)) {
            history(-1)
        }
    }
    return <div className={style.gbg}>
        {/* <NavBar onBack={() => history(-1)} className={style.wbg}>{t('update_capital')}</NavBar> */}

        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            className={style.wbg}
        // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
        >
            <div style={{ fontSize: '18px', color: 'rgb(30, 27, 39)', fontWeight: '500' }}>
                {t('update_capital')}
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
                    name='vcode'
                    label={t('ui_code')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'vcode') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('enterVerify')} maxLength={4} />
                </Form.Item>
                <Form.Item
                    name='password'
                    label={t('new_password')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'password') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('p_newPassword')} maxLength={16} />
                </Form.Item>
                <Form.Item
                    name='cashPassword'
                    label={t('confim_new_password')}
                    rules={[{ validator: (_, value) => checkValue(_, value, 'cashPassword') }]}
                >
                    <Input style={{ '--text-align': 'right' }} placeholder={t('confim_new_password')} maxLength={16} />
                </Form.Item>
            </Form>
        </div>
    </div>
}

export default FundPassword