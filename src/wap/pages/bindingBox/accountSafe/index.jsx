import { Toast, Skeleton, NavBar } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { GetGiftList, propCar, setShowCar } from "../../../server/live";
import { CNavBar, CEmpty } from '../../../components'
import moment from 'moment'
import { queryCenterUserThirdInfoVOList, doBandingThird } from '../../../server/login'
import useContextReducer from "../../../state/useContextReducer.js";

const PointOut = React.lazy(() => import('../../../components/pointOut/index.jsx'))

const Index = () => {
    const { state: { user, assergoldData }, fetchUtils, } = useContextReducer.useContextReducer();
    const { freshUser, } = fetchUtils;
    const history = useNavigate()
    const [datas, datasSet] = useState([
        // { icon: '2', name: 'Apple ID', binding: false },
        // { icon: '3', name: 'Google ID', binding: false },
        // { icon: '4', name: 'Twitter ID', binding: false },
        // { icon: '5', name: 'Facebook ID', binding: true },
        // { icon: '6', name: 'WhatsAPP ID', binding: false },
    ])
    const [pointOuts, pointOutsSet] = useState(false)

    useEffect(() => {
        queryCenterUserThirdInfoVOListF()
    }, [])
    const queryCenterUserThirdInfoVOListF = async () => {
        const res = await queryCenterUserThirdInfoVOList({ uid: user?.uid })
        if (!(res instanceof Error)) {
            console.log('获取三方信息', res);
            datasSet(res || [])
        }
    }

    //已绑定
    const binding = (i) => {
        console.log('已绑定', i);
        if (i == 'facebook') {
            if (user?.phone != null && user?.phone != undefined) {
                history('/Unbinding', { state: i })
            } else {
                pointOutsSet(true)
            }
        }

    }
    // 未绑定
    const Unbounds = (i) => {
        console.log('未绑定', i);
        if (i == 'facebook') {
            // if (user?.phone != null && user?.phone != undefined) {
            //     history('/Unbinding')
            // } else {
            //     pointOutsSet(true)
            // }
            FB.getLoginStatus((response) => {
                console.log('getLoginStatus---------response', response);
                if (response.status === 'connected') {
                    // 进行登录
                    doBandingThirdF(response.authResponse.accessToken)
                } else {
                    console.log(222);
                    FB.login((response) => {
                        // handle the response 
                        console.log('response----------', response);
                        if (response.status === 'connected') {
                            // Logged into your webpage and Facebook.
                            // FB.api('/me', (response_2) => {
                            //   console.log(response_2, 'Good to see you, ' + response_2.name + '.');
                            // });
                            // history('/bindingHandset')
                            doBandingThirdF(response.authResponse.accessToken)
                            console.log('成功--登录');
                        } else {
                            // The person is not logged into your webpage or we are unable to tell. 
                            console.log('未登录');
                        }
                        // , { scope: 'public_profile,email' }
                    }, { scope: 'public_profile,email' });
                }
            })

        }

    }

    // 绑定三方账号
    const doBandingThirdF = async (token) => {
        console.log('token---------', token);
        const res = await doBandingThird({ accessToken: token })
        if (!(res instanceof Error)) {
            console.log('绑定', res);
            queryCenterUserThirdInfoVOListF()

        }
    }
    return <div>
        <NavBar
            className={style.wbg}
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} className={style.leftImg} onClick={() => history(-1)} />}
            onBack={() => history(-1)}
        >
            <div className={style.wbg_title}>{t('zhagnhaoyuanquan')}</div>
        </NavBar>
        {/* 内容 */}
        <div className={style.bodys}>
            <div className={style.scrolls}>
                <div className={style.box} onClick={() => {
                    if (user?.phone == null || user?.phone == undefined) {
                        history('/bindingPhone', { state: { i: 2, a: true } })
                    }
                }}>
                    <div className={style.box_div}>
                        <div className={style.lefts}><img src={require('../../../assets/image/newImg/binding/aq0.png')} alt="" />{t('shou_ji_hao')}</div>
                        <div className={style.colors}>{(user?.phone != null && user?.phone != undefined) ? user?.phone : <span className={style.colorRed}>{t('weibangding')}</span>}</div>
                    </div>
                    {
                        (user?.phone != null && user?.phone != undefined) ?
                            <div className={style.box_div} >
                                <div className={style.lefts}><img src={require('../../../assets/image/newImg/binding/aq1.png')} alt="" />{t('btn_login_password')}</div>
                                <div className={style.Unbounds} onClick={() => history('/forget', { state: { x: true, phone: user?.phone } })}>{t('quxiugai')}<img src={require('../../../assets/image/newImg/binding/aqright.png')} alt="" /></div>
                            </div>
                            :
                            <div className={style.passwords}>
                                <img src={require('../../../assets/image/newImg/binding/gth.png')} alt="" />
                                <div>
                                    {t('youyuweibangdingshoujihao')}
                                </div>
                            </div>
                    }
                </div>
                <div className={style.box}>
                    {datas.map((value, index) => {
                        return <div key={value?.type} className={style.box_div}>
                            <div className={style.lefts}><img src={
                                // require(`../../../assets/image/newImg/binding/aq${value.icon}.png`)
                                value?.icon
                            } alt="" />{value?.name}</div>
                            {value?.flagBanging ?
                                <div className={style.Unbounds} onClick={() => binding(value?.type)}>{t('yibangding')}<img src={require('../../../assets/image/newImg/binding/aqright.png')} alt="" /></div>
                                : <div className={style.binding} onClick={() => Unbounds(value?.type)}>{t('bangding')}<img src={require('../../../assets/image/newImg/binding/aqright.png')} alt="" /></div>}
                        </div>
                    })}
                </div>
                {/* 提示 */}
                <div className={style.pointAut}>
                    <div>
                        {t('anquanxioazhishi')}
                    </div>
                    <p>1、{t('weishenmeyaobangdingshoujihao')}</p>
                    <p className={style.fontSize}>
                        {t('bangdingshoujihaokeyizaizhanghaoshezhigenggaishi')}
                    </p>
                    <p>2、{t('weishenmeyaobangdingqitazhanghao')}</p>
                    <p className={style.fontSize}>
                        {t('zhanghaobangdinghou')}
                    </p>
                </div>
            </div>
        </div>
        <PointOut visible={pointOuts} type={4} visibleSet={() => pointOutsSet(false)} but2={() => { history('/bindingPhone', { state: { i: 2 } }) }} />
    </div>
}

export default Index;
