import { authorization } from '../../../utils/tools'
import { Button, Form, Input, message } from 'antd';
import { useTranslation } from "react-i18next";
import { login } from '../../../api/login'
import React, { useState } from "react"
export default (props) => {
    let { onCheck, FreshUser, onOk } = props;
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const sponsor = [
        { index: 0, icon: 'icon-sponsor01', name: "Thänh phô Leicester", desc: "Dói tâc chinh thüc", },
        { index: 1, icon: 'icon-sponsor02', name: "Chelsea", desc: "Dói tâc chinh thic", },
        { index: 2, icon: 'icon-sponsor03', name: "Nasdag", desc: "PR trên Times Square", },
        { index: 3, icon: 'icon-sponsor04', name: "Barcelona", desc: "Dói tâc chinh thirc", },
    ]
    const onFinish = (values) => {
        onSumbit(values);
    }
    const onSumbit = (values) => {
        let params = Object.assign({}, { model: 'fake-model' }, values)
        setLoading(true)
        login(params).then(rt => {
            setLoading(false)
            if (rt && rt.token) {
                authorization(rt.token)
                FreshUser();
                onOk()
                window.eventBus.emit("store", { type: "handleLogin" });
                message.success({ content: `${t('btn_login')}${t('ui_success')}`, duration: .5 })
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    const sponsorLeft = () => {
        let sponsorDom = document.getElementById('sponsor');
        sponsorDom.scrollLeft = 0;
    }
    const sponsorRight = () => {
        let sponsorDom = document.getElementById('sponsor');
        sponsorDom.scrollLeft = 390;
    }
    return <div>
        <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={(val) => onFinish(val)}
            autoComplete="off"
        >
            <Form.Item
                name="mobile"
                rules={[{ required: true, message: t('f_ui_please_enter_phone_number') }]}
            >
                <Input maxLength={10} min={1} placeholder={t('f_ui_please_enter_phone_number')} />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: t('f_ui_hint_login_pwd') }]}
            >
                <Input.Password placeholder={t('f_ui_hint_login_pwd')} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                <Button type="primary" className={'a ' + (loading && 'loading')} style={{ width: '100%' }} htmlType="submit">
                    {t('btn_login')}
                </Button>
            </Form.Item>
        </Form>
        <div className='n-text' onClick={() => { onCheck() }}>{t('xyhzc')}</div>
        <div className='sponsor-con'>
            <div className='sponsor-left' onClick={() => sponsorLeft()}></div>
            <div className='sponsor-right' onClick={() => sponsorRight()}></div>
            <div className='title'>{t('login_1')}</div>
            <div className='content' id="sponsor">
                {sponsor.map((item, index) => {
                    return <div key={index} className="sponsor-item">
                        <div className={`icon ${item.icon}`}></div>
                        <div className="name">{item.name}</div>
                        <div className="desc">{item.desc}</div>
                    </div>
                })}
            </div>
        </div>
    </div>
}