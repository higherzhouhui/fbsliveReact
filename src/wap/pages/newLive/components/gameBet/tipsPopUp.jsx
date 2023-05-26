import React, { useEffect, useState } from "react";
import style from './common.module.scss'
import { Button, Popup, SpinLoading } from "antd-mobile";
import { useTranslation } from 'react-i18next'
import { accountGetbalance, accountCreditIn, accountCreditOut } from "../../../../server/tipsPopUp";
import { getUserInfo } from "../../../../server/user"
import { Local } from "../../../../../common";
import useContextReducer from "../../../../state/useContextReducer";
// props.type==1 提示信息
// props.type==2 转账

const TipsPopUp = (props) => {
    const { tipsPopUp, tipsPopUpSet, cancel, moneySet } = props
    const { t } = useTranslation()
    const [loading1, loading1Set] = useState(false)
    const [loading2, loading2Set] = useState(false)

    const [recoveryMoney, recoveryMoneySet] = useState(0)
    const [toChangeIntoMoney, toChangeIntoMoneySet] = useState(0)

    const {
        state: { user },
        fetchUtils,
    } = useContextReducer.useContextReducer();
    const { freshUser } = fetchUtils;

    const [GetUserInfos, GetUserInfosSet] = useState({})
    useEffect(() => {
        accountGetbalances()
        // GetUserInfo()
        freshUser()
        // window.eventBus.addListener('freshYn', accountGetbalances)
        return () => {
            // window.eventBus.removeListener('freshYn', accountGetbalances)
        }
    }, [])
    // 查询用户信息 获取金额
    // const GetUserInfo = async () => {
    //     const res = await getUserInfo()
    //     if (!(res instanceof Error)) {
    //         // setBaseInfo(res)
    //         GetUserInfosSet(res)
    //         if (res != undefined && res.goldCoin != undefined) {
    //             recoveryMoneySet(res?.goldCoin)
    //         } else {
    //             recoveryMoneySet(0)
    //         }
    //         //   GetUserInfosSet(res)
    //         Local('userInfo', res)
    //     }
    // }


    // 查询游戏余额
    const accountGetbalances = () => {
        accountGetbalance().then((item) => {
            window.eventBus.emit('freshYnOpen')
            console.log('dsadasdasdsads', item);
            if (item != undefined) {
                toChangeIntoMoneySet(item?.money)
                moneySet(item.money)
            } else {
                toChangeIntoMoneySet(0)
                moneySet(0)
            }
        })
    }
    // 回收
    const recovery = () => {
        console.log('回收');
        loading1Set(true)

        // backAllGameCoin({ uid: state.anchorId }).then((item) => {
        //     console.log(item);

        // })

        accountCreditOut({ money: toChangeIntoMoney }).then(() => {
            loading1Set(false)
            accountGetbalances()
            // GetUserInfo()
            freshUser()
        })
    }
    //    转入
    const toChangeInto = async () => {
        // loading2Set(true)
        console.log('转入');
        // const res = await accountCreditIn({ money: recoveryMoney })
        // if (!(res instanceof Error)) {
        //     // loading2Set(false)
        //     console.log('res转入', res, res.money);
        //     toChangeIntoMoneySet(res.money)

        //     accountGetbalances()
        //     GetUserInfo()
        // } else {
        //     console.log('aaaa', res);
        // }
        accountCreditIn({ money: user?.goldCoin }).then((res) => {
            // console.log('转入成功', res);
            // toChangeIntoMoneySet(res.money)
            accountGetbalances()
            // GetUserInfo()
            freshUser()
        }).catch((err) => {
            console.log('errs', err);
        })
    }

    return (
        <>
            <Popup visible={tipsPopUp} onMaskClick={() => {
                tipsPopUpSet()
            }} bodyStyle={{ minHeight: '245px' }} style={{ zIndex: '9999' }}>
                <div className={style.tipsPopUp2}>
                    {/* title */}
                    <div className={style.tipsPopUp_title}>{t('transTitle')}</div>
                    {/* 转账 */}
                    <div className={`${style.marginTop} ${style.displ} ${style.bottoms}`} style={{ position: 'relative' }}>
                        <div className={` ${style.displ2}`}>
                            <div>{t('zhuzhanghuyue')}</div>
                            <div className={style.Tcmoney}>{loading1 ? <SpinLoading style={{ '--size': '20px' }} /> : (user?.goldCoin || 0)}</div>
                            <Button className={`${style.but} ${style.butBackgrun}`} loading={loading1} onClick={() => recovery()}>{t('zhuzhanghuhuishou')}</Button>
                        </div>

                        <div className={style.border_position}></div>

                        <div className={` ${style.displ2}`}>
                            <div>{t('dangqianyouxiyue')}</div>
                            <div className={`${style.Tcmoney} ${style.Tcmoney_color}`}>{loading2 ? <SpinLoading style={{ '--size': '20px' }} /> : (toChangeIntoMoney || 0)}</div>
                            <Button className={`${style.but} ${style.butBackgrun}`} loading='auto' onClick={() => toChangeInto()}>{t('yijianzhuanuru')}</Button>
                        </div>
                    </div>



                    {/* 底部按钮 */}
                    <div className={style.displ}>
                        <Button className={style.but} onClick={() => cancel()}>{t('btn_cancel')}</Button>
                    </div>
                </div>
            </Popup>
        </>
    );
}

export default TipsPopUp;
