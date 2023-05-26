import React, { useCallback, useEffect, useState } from "react";
import { t } from "i18next";
import style from './index.module.scss'
import { GetUserBank, GetUserUsdt, Statement, WithDraw } from "../../../../server/deposit";
import { BackAllGameCoin, getBalance, GameBalanceRedisList, GameBalanceList } from "../../../../server/balance";
import { useNavigate } from "react-router-dom";
import useContextReducer from '../../../../state/useContextReducer.js'
import { Local } from "../../../../../common";
import { Button, Switch } from "antd-mobile";
import { useRef } from "react";


const Index = (props) => {
    const [cardList, setCardList] = useState([]);
    const [cardList2, setCardList2] = useState([]);
    const [Switchs, SwitchsSet] = useState(true)

    const SwitchsSetRef = useRef(true)

    const {
        state: { user, assergoldData },
        fetchUtils,
    } = useContextReducer.useContextReducer();
    const { freshUser, userGetUserAsserGold } = fetchUtils;

    useEffect(() => {
        window.eventBus.addListener("goItemDataYe", goItemDataYe);
        return () => {
            window.eventBus.removeListener("goItemDataYe", goItemDataYe);
        }
    }, [])

    // 刷新余额
    const goItemDataYe = (e) => {
        console.log('刷新余额----------', e);
        let data = [...e]
        if (SwitchsSetRef.current) {
            data = data.filter((value) => Number(value.balance) > 0)
        }


        console.log('data----------', data);

        setCardList(data); //关闭刷新
        setCardList2(e)
        Local("balanceList", e);
    }

    //一键回收
    const handleAllBank = async () => {
        const res = await BackAllGameCoin();
        if (!(res instanceof Error)) {
            // Toast.show(t("sys_check_pass"));
            // GetUserInfo()

            // freshUser();
            userGetUserAsserGold()

            getGameBalanceList()
        }
    };
    useEffect(() => {
        GameBalanceRedisListF()

        getGameBalanceList()
    }, [])
    // 缓存接口
    const GameBalanceRedisListF = async () => {
        // setLoading(true);
        const res = await GameBalanceRedisList();
        if (!(res instanceof Error)) {

            let data = [...res];
            if (SwitchsSetRef.current) {
                data = data.filter((value) => Number(value.balance) > 0)
            }
            window.eventBus.emit('GameBalanceListD', res)
            setCardList(data); //关闭刷新
            setCardList2(res)
            Local("balanceList", res);
        }
    };
    // 余额接口
    const getGameBalanceList = async () => {
        const res = await GameBalanceList();
        // freshLoadingSet(-1);
        if (!(res instanceof Error)) {
            console.log("res游戏余额", res);
            let data = [...res];
            if (SwitchsSetRef.current) {
                data = data.filter((value) => Number(value.balance) > 0)
            }
            console.log('余额接口', data);
            window.eventBus.emit('GameBalanceListD', res)
            setCardList(data); //关闭刷新
            setCardList2(res)

            // setLoading(false);
            Local("balanceList", res);


        } else {
        }
    };

    // 单个刷新
    const getBalanceF = async (ty, index) => {
        let type = ty;
        // SpinLoadingsSet(index);
        const res = await getBalance({ gameType: type });
        // SpinLoadingsSet(-1);

        if (!(res instanceof Error)) {
            console.log("获取余额", res, cardList);
            let data = [...cardList];
            data.forEach((value) => {
                if (value.type == type) {
                    value.balance = res.balance || 0;
                }
            });
            setCardList(data);
            setCardList2(data)
            // getBalancesDSet(res.balance || 0)
        } else {
            // getBalancesDSet(0)
        }
    };

    useEffect(() => {
        console.log('------------', cardList, Switchs);
        let data = [...cardList2]

        if (Switchs) {
            let da = []
            data.forEach((value, index) => {
                if (Number(value.balance) > 0) {
                    da = [...da, value]
                }
            })
            setCardList(da)
        } else {
            setCardList(data)
        }

    }, [Switchs])

    return (
        <>
            <div className={style.deposit_title}>
                <div className={style.qbs}>
                    <div className={style.bg}>
                        <div className={style.bg_moneys}>
                            <div className={style.moneys_xu}>{t('jinbuyue')}</div>
                            <div className={style.money_div}>
                                <span className={style.spans}>
                                    {/* {user?.goldCoin} */}
                                    {assergoldData?.goldCoin || 0}
                                </span>
                                <Button loading='auto' className={style.retrieves} onClick={() => handleAllBank()}>
                                    <div className={style.retrieves_div}>
                                        <img src={require('../../../../assets/image/newImg/tx/hs.png')} alt="" className={style.imgs} />
                                        <div className={style.fonts}>{t('btn_one_click_recycling')}</div>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* 展示、隐藏 */}
                    <div className={style.contents}>
                        <div className={`${style.contents_title} ${cardList.length > 0 ? style.contents_title_bot : ''}`}>
                            <Switch checked={Switchs} onChange={(e) => {
                                SwitchsSet(e)
                                SwitchsSetRef.current = e
                            }} style={{ "--width": '26px', "--height": '16px', marginRight: '5px' }} />
                            <div>
                                {t('yinchangwuyueqianbaoyouxi')}
                            </div>
                        </div>
                        {/* 游戏余额展示 */}
                        <div className={`${style.game_div} ${cardList.length > 0 ? style.marginTop23 : ''}`}>
                            {
                                cardList.map((item, index) => {
                                    return <div className={`${style.bigs} ${style.margin_bot} ${index % 2 == 0 ? style.left : style.right}`} key={item?.type}>
                                        <div className={style.tops}>{item?.gameName}</div>
                                        <div className={style.bottom}>
                                            <span>{item?.balance}</span>
                                            {/* onClick={() => getBalanceF(item.type, index)} */}
                                            <Button className={style.trans} loading="auto" onClick={() => getBalanceF(item.type, index)} loadingIcon={<img className={style.sxz} src={require("../../../../assets/image/newImg/tx/sx.png")} alt="" />}>
                                                <img src={require("../../../../assets/image/newImg/tx/sx.png")} alt="" />
                                            </Button>
                                        </div>

                                        {index % 2 != 0 && <div className={style.borderLeft}>
                                        </div>}
                                    </div>

                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
