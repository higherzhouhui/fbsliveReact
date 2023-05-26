import { Toast, Skeleton, NavBar, Button, Mask, Input } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { GetGiftList, propCar, setShowCar } from "../../../server/live";
import { CNavBar, CEmpty, Verify } from '../../../components'
import moment from 'moment'
import { doUnBandingThird } from "../../../server/login";
import useContextReducer from "../../../state/useContextReducer.js";
import { Local } from "../../../../common";

const Index = () => {
    const { state } = useLocation()
    const { state: { user, assergoldData }, fetchUtils, } = useContextReducer.useContextReducer();
    const { freshUser, userGetUserAsserGold } = fetchUtils;
    const history = useNavigate()
    const [visible, visibleSet] = useState(false)
    const [verify, verifySet] = useState('')
    // 确认解绑
    const affirmUnbinding = async () => {
        let data = {
            phone: user?.phone,
            vcode: verify,
            type: state
        }
        const res = await doUnBandingThird(data)
        if (!(res instanceof Error)) {
            console.log('解除绑定', res);
            Local("accessToken", null);
            history(-1)
        }
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
            <div className={style.center}>
                <img src={require('../../../assets/image/newImg/binding/facebookicon.png')} alt="" />
                <p>{t('nigyijingbangdingl')}</p>
            </div>

            <Button className={style.buts} onClick={() => {
                visibleSet(true)
            }}>
                {t('jeichubangding')}
            </Button>
        </div>
        {/* visible */}
        <Mask visible={visible} destroyOnClose onMaskClick={() => visibleSet(false)}>
            <div className={style.Masks}>
                <div className={style.title}>
                    {t('zhanghaojiebang')}
                </div>
                <div className={style.fonts}>
                    {t("jeibangfacebookzhanghao")}
                </div>
                <div className={style.inputs}>
                    <Input value={verify} onChange={verifySet} placeholder={t('enterVerify')} />
                    <Verify phone={user?.phone} type={3} className={style.Verify} Click={() => { }} sendType="1"></Verify>
                </div>
                <div className={style.phone}>
                    {t('yanzhengmayifasongdao', { 1: user?.phone })}
                </div>

                <div className={style.box_but}>
                    <Button className={style.left_but} onClick={() => {
                        visibleSet(false)
                    }}>{t('wozaixiangxiang')}</Button>
                    {/* t('querenbangding') */}
                    <Button className={style.right_but} loading='auto' onClick={() => affirmUnbinding()}>{t('querenjiebang')}</Button>
                </div>
            </div>
        </Mask>
    </div>
}

export default Index;
