import { Button, NavBar, Toast, Empty, Grid, Skeleton, Popover, SpinLoading } from "antd-mobile";
import React, { useCallback, useEffect, useState, useRef } from "react";
import style from "./index.module.scss";
import { BackAllGameCoin, GameBalanceList, GameBalanceRedisList, getBalance } from "../../../server/balance";
import useContextReducer from "../../../state/useContextReducer.js";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
const MoneyBeLeft = React.lazy(() => import('../deposit/moneyBeLeft/index'))
const TransferAccounts = React.lazy(() => import("./transferAccounts"));

let freshDataFtime
export default function Balance() {
    const [showTrans, setShowTrans] = useState(false);
    const [info, setInfo] = useState({});
    const [money, setMoney] = useState("");
    const [money2, setMoney2] = useState(0);
    const history = useNavigate();
    const [cardList, setCardList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [freshLoading, freshLoadingSet] = useState(-1);
    const [SpinLoadings, SpinLoadingsSet] = useState(-1);

    const goItemData = useRef();

    const {
        state: { user, assergoldData },
        fetchUtils,
    } = useContextReducer.useContextReducer();
    const { freshUser, userGetUserAsserGold } = fetchUtils;


    useEffect(() => {
        // GameBalanceRedisListF();
        window.eventBus.addListener("GameBalanceListD", GameBalanceListD);
        return () => {
            // clearTimeout(freshDataFtime)
            window.eventBus.removeListener("GameBalanceListD", GameBalanceListD);
        }
    }, []);

    const GameBalanceListD = (res) => {
        console.log('多少数据GameBalanceListD-----', res);
        setCardList(res)
    }


    // const GameBalanceRedisListF = async () => {
    //     setLoading(true);
    //     const res = await GameBalanceRedisList();
    //     if (!(res instanceof Error)) {
    //         setCardList(res);
    //         setLoading(false);
    //         Local("balanceList", res);
    //     }
    // };


    // const getGameBalanceList = async () => {
    //     const res = await GameBalanceList();
    //     freshLoadingSet(-1);
    //     if (!(res instanceof Error)) {
    //         console.log("res游戏余额", res);

    //         let data = [...res];
    //         data.forEach((value, index) => {
    //             value.sx = false;
    //         });

    //         setCardList(data); //关闭刷新

    //         setLoading(false);
    //         Local("balanceList", res);
    //     } else {
    //     }
    // };
    // const getEach = () => {
    //     getGameBalanceList();
    // };

    // const init = useCallback(() => {
    //     getEach();
    // }, []);
    // useEffect(() => {
    //     init();
    // }, [init]);


    const [transformations, transformationsSet] = useState(true);
    // 转换
    const transformation = () => {

        transformationsSet(!transformations);
    };

    const getBalanceF = async (ty, index) => {
        let type = ty || goItemData.current.type;
        SpinLoadingsSet(index);
        const res = await getBalance({ gameType: type });
        SpinLoadingsSet(-1);

        if (!(res instanceof Error)) {
            console.log("获取余额", res, cardList);
            let data = [...cardList];
            data.forEach((value) => {
                if (value.type == type) {
                    value.balance = res.balance || 0;
                }
            });
            setCardList(data);
            // getBalancesDSet(res.balance || 0)
        } else {
            // getBalancesDSet(0)
        }
    };

    // 接收回调金额
    const freshDataF = (e) => {
        let data = [...cardList];
        data.forEach((value) => {
            if (value.type == e.type) {
                value.balance = e?.balance || 0;
            }
        });
        setCardList(data);
        window.eventBus.emit('goItemDataYe', data)

        freshDataFtime = setTimeout(() => {
            getBalanceF()
            clearTimeout(freshDataFtime)
        }, 2000)
    }

    // 骨架屏
    const listSk = () => {
        return (
            <Grid columns={1} gap={12}>
                <Grid.Item>
                    <Skeleton animated className={style.customSkeleton} />
                </Grid.Item>
                <Grid.Item>
                    <Skeleton animated className={style.customSkeleton} />
                </Grid.Item>
            </Grid>
        );
    };

    return (
        <div className={style.gbg}>
            <NavBar
                back={null}
                left={<img src={require("../../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px", }} onClick={() => history(-1)} />}
                onBack={() => history(-1)}
                className={style.wbg}
                right={<img style={{ width: "23px", height: "23px" }} onClick={() => history("/service")} src={require("../../../assets/image/newImg/kficon.png")} alt="" />}
            >
                <div style={{ fontSize: "18px", fontWeight: "500" }}>{t("transTitle")}</div>
            </NavBar>
            <div className={style.bodys}>

                {/* <div className={style.wbgs}>
                <NavBar
                    back={null}
                    left={<img src={require("../../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px", filter: "contrast(200%) invert(200%)" }} onClick={() => history(-1)} />}
                    onBack={() => history(-1)}
                    className={style.wbg}
                >
                    <div style={{ fontSize: "18px", fontWeight: "500" }}>{t("transTitle")}</div>
                </NavBar>
                <div style={{ padding: "0 16px", marginTop: "41px" }}>
                    <div className={style.wtitle}>
                        {t("balance")} <span>({t("glod")})</span>
                    </div>
                    <div className={style.head}>
                        <div className={style.money}>{user?.goldCoin || 0}</div>{" "}
                        <div>
                            <Popover
                                className="Popovers"
                                content={
                                    <div className={style.Popover}>
                                        {t("yijianhuishouzhanghuyue")}
                                        <img
                                            src={require("../../../assets/image/center/gbts.png")}
                                            alt=""
                                            onClick={() => {
                                                visibleSet(false);
                                            }}
                                            className={style.Popover_imgs}
                                        />
                                    </div>
                                }
                                placement="bottom-start"
                                mode="dark"
                                // trigger='click'
                                visible={visible}>
                                <Button className="emptyUiBtn" loading="auto" onClick={() => handleAllBank()} loadingIcon={<img src={require("../../../assets/image/center/moneyhs.png")} alt="" />}>
                                    <img src={require("../../../assets/image/center/moneyhs.png")} alt="" />
                                </Button>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div> */}
                <MoneyBeLeft goItemData={goItemData.current} />
                {/* <div className={style.Content}>
                <div className={style.cardList}>
                    {cardList.length > 0 ? (
                        <div className={style.cardList2}>
                            {cardList.map((item, index) => (
                                <div key={index} className={style.box}>
                                    <div className={style.top}>
                                        <img src={item.gameLogo} alt="" />
                                        {item.gameName}
                                    </div>
                                    <div style={{ padding: "0 8px" }}>
                                        <div className={style.center}>
                                            <div style={{ display: "flex", alignItems: "center" }}>{SpinLoadings === index ? <SpinLoading style={{ "--size": "20px" }} /> : Math.floor((item?.balance || 0) * 100) / 100}</div>
                                        </div>
                                        <div className={style.bottom}>
                                            <div className={style.left}>
                                                <Button className={style.trans} loading="auto" onClick={() => getBalanceF(item.type, index)} loadingIcon={<img src={require("../../../assets/image/center/shuaxin.png")} alt="" />}>
                                                    <img src={require("../../../assets/image/center/shuaxin.png")} alt="" />
                                                </Button>
                                            </div>
                                            <div className={style.right}>
                                                <Button className={style.trans_btn} loading="auto" onClick={() => handleTrans(item)}>
                                                    {t("trans")}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : loading ? (
                        listSk()
                    ) : (
                        <Empty />
                    )}
                </div>
            </div> */}

                <TransferAccounts
                    onMaskClick={() => {
                        setShowTrans(false); //关闭弹窗
                        transformationsSet(true);
                    }}
                    fresh={(e) => {
                        console.log("asdasdsa", e)
                        goItemData.current = { ...goItemData.current, type: e.type, balance: e.balance }
                        freshDataF(e)
                        // getBalanceF();

                    }} //游戏余额
                    visible={showTrans}
                    transformations={transformations} //是否切换判断
                    transformation={() => transformation()} //切换转入转出
                    info={goItemData.current || {}}

                    balance={cardList} //是否是转账页面
                />
            </div>
        </div>
    );
}
