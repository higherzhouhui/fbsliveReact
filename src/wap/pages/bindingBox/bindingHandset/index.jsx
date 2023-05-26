import { Toast, Skeleton, NavBar } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { GetGiftList, propCar, setShowCar } from "../../../server/live";
import { CNavBar, CEmpty } from '../../../components'
import { doJumpBandingPhone } from "../../../server/login";
import moment from 'moment'
import { Local } from "../../../../common";
import useContextReducer from "../../../state/useContextReducer";

const Index = () => {
    const {
        state: { loginForm },
        fetchUtils,
    } = useContextReducer.useContextReducer();
    const { freshUser, userGetUserAsserGold } = fetchUtils;
    const history = useNavigate()
    const [GetGiftListD, GetGiftListDSet] = useState([])
    const [propCarGid, propCarGidSet] = useState()
    const [propCarD, propCarDSet] = useState([])

    const add = [
        {
            font1: t('zhuceguobangdingyiyouzhangnhu'), font2: t('yiyoufbszhanghaozhijbangd'), icon: '1'
        },
        {
            font1: t('weizhuceguoshiyongshoujihao'), font2: t('haiweifbszhanghaoshiyongsho'), icon: '2'
        },
        {
            font1: t('tiaoguozhijiejinru'), font2: null, icon: '3'
        },
    ]
    const box = (i) => {
        i == 0 && history('/bindingPhone', { state: { i: 1 } })
        // i == 1 && history('/accountSafe')
        i == 1 && history('/bindingPhone', { state: { i: 2 } })
        if (i == 2) {
            doJumpBandingPhoneF(Local('accessToken'))
            // history('/live')
        }
    }


    // 跳过登录
    const doJumpBandingPhoneF = async (token) => {
        const res = await doJumpBandingPhone({ accessToken: token })
        if (!(res instanceof Error)) {
            console.log('tiaogu1', res);
            if (res != null && res.token != null && res.token != undefined && res.token.length > 0) {
                Local("token", res.token);
                await freshUser();
                // userGetUserAsserGold()
                window.eventBus.emit("store", { type: "handleLogin" });
                history("/live");
            }
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
            <div className={style.container}>
                {/* title */}
                <div className={style.title}>
                    {t('xuanzenizhanghuliexing')}
                    <p>
                        {t('nihaohuanyingjinru')}
                    </p>
                </div>
                {add.map((value, index) => {
                    return <div key={index} className={style.box} onClick={() => box(index)}>
                        {index == 0 && <div className={style.ElderlyPeople}>{t('laoyonghuzhuanshu')}</div>}
                        <img src={require(`../../../assets/image/newImg/binding/left${value.icon || 1}.png`)} className={style.img_left} alt="" />
                        <div>
                            {value.font1}
                            {value.font2 && <p>{value.font2}</p>}
                        </div>
                        <img className={style.img_right} src={require('../../../assets/image/newImg/binding/right.png')} alt="" />
                    </div>
                })}

                {/* 提示 */}
                <div className={style.pointAut}>
                    <div>
                        {t('anquanxioazhishi')}
                    </div>
                    <p>1、{t('zhuceguobangdingyiyouzhagnhao')}</p>
                    <p className={style.fontSize}>
                        {t('ruguoyijzhucdguofbs')}
                    </p>
                    <p>2、{t('weizhuceguoshiyongshoujihao')}</p>
                    <p className={style.fontSize}>
                        {t('ruguoninxuanzegaifangshihou')}
                    </p>
                    <p>3、{t('tiaoguozhijiejinru')}</p>
                    <p className={style.fontSize}>
                        {t('ruguoninxuanzegaifangshihoufbsguanwang')}
                    </p>
                </div>
            </div>
        </div>
    </div>
}

export default Index;
