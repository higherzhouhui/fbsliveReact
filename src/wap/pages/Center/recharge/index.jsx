import { Button, Dialog, Image, Input, NavBar, NoticeBar, Toast, Popup, Mask, Picker } from "antd-mobile";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GetBankWay, GoldRecharge, MoneyRecharge, RechargeWay, ustdRecharge } from "../../../server/center";
import style from "./index.module.scss";
import { useCopy } from "../../../../utils/copy";
import useContextReducer from "../../../state/useContextReducer";
import QRCode from "qrcode.react";
import { getAdvert } from "../../../server/home";
let time;
export default function Recharge() {
  const { state } = useLocation()
  const { t } = useTranslation();
  const [way, setWay] = useState([]);
  const [way2, setWay2] = useState([]);
  const [usdtList, setUsdtList] = useState([]);
  const [wayIndex, setWayIndex] = useState(0);
  const [wayType, setWayType] = useState(1); //1银行卡 2USDT
  const [goldIndex, setGoldIndex] = useState(0);
  const [card, setCard] = useState({});
  const [rechargeMoney, setSechargeMoney] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  const [bankIndex, setBankIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({});
  const [advList, advListSet] = useState("");

  const [usdtInfo, setUsdtInfo] = useState({});
  const [usdtIndex, setUsdtIndex] = useState(0);

  const [trueRmbs, trueRmbsSet] = useState("");

  const [sechargeUSDT, setSechargeUSDT] = useState("");

  const [ustdRechargeD, ustdRechargeDSet] = useState({});

  const [usdtT, usdtTSet] = useState(false);
  const [usdtTime, usdtTimeSet] = useState(0);

  const [ustdTimeD, ustdTimeDSet] = useState("00:00:00");

  const [usdtQRCode, usdtQRCodeSet] = useState(true);

  const [Pickers, PickersSet] = useState(false)

  const [modeDs, modeDsSet] = useState([])
  const [InputFocus, InputFocusSet] = useState(false)

  const usdtTimeRef = useRef(0);

  const {
    state: { user, assergoldData },
  } = useContextReducer.useContextReducer();

  const bank = useMemo(() => {
    if (way.length > 0) {
      return way[wayIndex].supportBank ? way[wayIndex].supportBank.split(",") : [];
    } else return [];
  });

  const copy = useCopy();

  const history = useNavigate();

  // 获取支付方式 type=7 银行卡， type=29 USDT
  const getWay = async () => {
    const res = await RechargeWay();
    if (!(res instanceof Error)) {
      if (res.length > 0) {
        setWay(res);
        setWay2(res);
        setWayType(res[0].type);
        setSechargeMoney(res[0].products[0].userRmb / 100);
        setItem(res[0].products[0]);
      }
    }
  };

  // 获取银行卡/usdt的信息
  const getCardInfo = async () => {
    const res = await GetBankWay();
    if (!(res instanceof Error)) {
      console.log('res-------', res);
      setCard(
        res.find((e) => {
          return e.type == 7;
        })
      );
      let usdtList =
        res.filter((e) => {
          return e.type == 29;
        }) || [];
      // console.log('这是什么数据', usdtList);
      setUsdtList(usdtList);
      if (usdtList.length > 0) {
        setUsdtInfo(usdtList[0]);
        setUsdtIndex(0);
      }
    }
  };

  // 获取公告
  const getAdv = async () => {
    const res = await getAdvert();
    if (!(res instanceof Error)) {
      const text = res
        .filter((item) => item.type === 9)
        .map((a) => a.content)
        .join(" ");
      advListSet(text);
    }
  };

  const init = useCallback(() => {
    getWay();
    getCardInfo();
    getAdv();
  }, []);
  useEffect(() => {
    init();
  }, [init]);

  // 选择方式
  const handleSelectWay = (item, index) => {
    setSechargeUSDT("");

    trueRmbsSet("");

    setWayIndex(index);
    setWayType(item.type);
    // 银行卡
    if (item.type == 7) {
      setGoldIndex(0);
      setWayType(way[index].type);
      setSechargeMoney(way[index].products[0].userRmb / 100);
      setAccountNumber("");
      setName("");
      setNotice("");
      // USDT
    } else if (item.type == 29) {
      if (usdtList.length > 0) {
        setUsdtInfo(usdtList[0]);
        setUsdtIndex(0);
      }
      // 其他
    } else {
      setBankIndex(0);


      // setGoldIndex(0);
      setGoldIndex(-1)

      // 获取默认第一个选中金额数据
      setItem(item.products[0]);
    }
  };
  // 选择金额
  const handleSelectCard = async (item, index) => {
    trueRmbsSet("");

    setSechargeMoney(item.userRmb / 100);
    setGoldIndex(index);
    // if (wayType != 7 && wayType != 29) {
    //     setShow(true)
    //     setItem(item)
    // }
    console.log("数据", item);
    setItem(item);
  };
  let Tr = true;

  const handleExchange = async () => {
    let params = {
      code: item.code,
      supportBank: bank[bankIndex] ? bank[bankIndex] : "",
    };
    if (trueRmbs.length > 0) {
      // console.log(way[wayIndex].reward);
      if (Number(trueRmbs) > Number(way[wayIndex]?.lowest || 0) && Number(trueRmbs) < Number(way[wayIndex]?.highest || 0)) {
        if (way[wayIndex]?.reward > 0) {
          params = {
            sectionGold: trueRmbs * (10 + 0.1 * way[wayIndex]?.reward),
            code: 1,
            trueRmb: trueRmbs,
            supportBank: bank[bankIndex] ? bank[bankIndex] : "",

            bizNumber: `${user?.uid},${trueRmbs / 1000}`,
            bizType: state?.bizType
          };
        } else {
          params = {
            sectionGold: trueRmbs * 10,
            code: 1,
            trueRmb: trueRmbs,
            supportBank: bank[bankIndex] ? bank[bankIndex] : "",

            bizNumber: `${user?.uid},${trueRmbs / 1000}`,
            bizType: state?.bizType
          };
        }
      } else {
        Tr = false;
        Toast.show({
          icon: "fail",
          content: t("qingshuruqujianfanweijine"),
          position: "center",
        });
      }
    } else {
      params = {
        code: item.code,
        supportBank: bank[bankIndex] ? bank[bankIndex] : "",

        bizNumber: `${user?.uid},${item?.goldCoin}`,
        bizType: state?.bizType
      };
    }
    if (Tr) {
      const url = new URL(way[wayIndex].submitUrl);

      console.log('url---', url, params, item);
      const res = await GoldRecharge(url.pathname, url.search, params);
      if (!(res instanceof Error)) {
        Toast.show(t("sys_check_pass"));
        window.open(res.payHtml);

        setShow(false)
        setItem({});
        setGoldIndex(-1)
      }
    }
  };

  //  提交way1充值
  const submitWay1 = async () => {
    if (!accountNumber) return Toast.show(t("selfBankNotice1"));
    if (!name) return Toast.show(t("selfBankNotice2"));
    // if (!notice) return Toast.show(t("selfBankNotice3"));
    let form = {
      accountNumber,
      bankId: card?.bankId,
      name,
      notice,
      rechargeMoney,

      bizNumber: `${user?.uid},${rechargeMoney / 1000}`,
      bizType: state?.bizType
    };
    const result = await Dialog.confirm({
      content: t("rechargeTxt3"),
      confirmText: t("rechargeTxt4"),
      cancelText: t("rechargeTxt5"),
    });

    if (result) {
      const res = await MoneyRecharge(form);
      if (!(res instanceof Error)) {
        Toast.show(t("sys_check_pass"));
      }
    }
  };
  // usdt提交
  const submitWayUSDT = () => {
    if (!sechargeUSDT) return Toast.show(t("ui_enter_amount"));
    ustdRechargeF();

    // ustdRecharge(form).then((item) => {
    //     setSechargeUSDT('')
    //     ustdRechargeDSet(item)
    //     // usdtTimeSet(item?.time || 0)
    //     usdtTimeSet(item?.time || 0)
    //     usdtTimeRef.current = item?.time || 0
    //     usdtTSet(true)
    // })
  };

  const ustdRechargeF = async () => {
    let form = {
      amount: sechargeUSDT,
      bankId: usdtList[0]?.bankId,
      bizNumber: `${user?.uid},${sechargeUSDT}u`,
      bizType: state?.bizType
    };

    // console.log(form, (way[wayIndex]?.rate / 1000));
    const item = await ustdRecharge(form);
    if (!(item instanceof Error)) {
      // setSechargeUSDT('')

      ustdRechargeDSet(item);
      usdtTimeSet(item?.time || 0);
      usdtTimeRef.current = item?.time || 0;
      usdtTSet(true);
      usdtQRCodeSet(true);
    }
  };

  // 判断超出文本
  useEffect(() => {
    // const element = document.getElementById(`way-0`)
    let data = [...way2];
    data.forEach((value, index) => {
      if (document.getElementById(`way-${index}`).scrollWidth > document.getElementById(`way-${index}`).offsetWidth) {
        value.goBeyond = true;
      } else {
        value.goBeyond = false;
      }
    });
    setWay(data);
  }, [way2]);

  // const wayIndexs = (e) => {
  //     const data = [...way]
  //     data.forEach((value, index, array) => {
  //         if (e == index) {
  //             if (document.getElementById(`way-${e}`).scrollWidth > document.getElementById(`way-${e}`).offsetWidth) {
  //                 value.goBeyond = true
  //             } else {
  //                 value.goBeyond = false
  //             }
  //         } else {
  //             value.goBeyond = false
  //         }
  //     })
  //     // console.log(document.getElementById(`way-${index}`).scrollWidth > document.getElementById(`way-${index}`).offsetWidth);
  //     setWay(data)
  // }
  useEffect(() => {
    //如果设置倒计时且倒计时不为0
    if (usdtTimeRef.current && usdtTimeRef.current > 0) {
      time = setTimeout(() => {
        usdtTimeSet((as) => as - 1);
        usdtTimeRef.current = usdtTimeRef.current - 1;
        ustdTimeDSet(ustdTime(usdtTimeRef.current));
      }, 1000);
    } else {
      usdtTimeSet(0);
      usdtTimeRef.current = 0;

      ustdTimeDSet("00:00:00");
      clearTimeout(time);
      // usdtTSet(false)

      usdtQRCodeSet(false);
    }
    return () => {
      clearTimeout(time);
    };
  }, [usdtTimeRef.current]);

  const ustdTime = (time) => {
    let str = "00:00:00";
    if (time != undefined) {
      // 转换为式分秒
      let h = parseInt((time / 60 / 60) % 24);
      h = h < 10 ? "0" + h : h;
      let m = parseInt((time / 60) % 60);
      m = m < 10 ? "0" + m : m;
      let s = parseInt(time % 60);
      s = s < 10 ? "0" + s : s;

      str = `${h}:${m}:${s}`;
    }
    return str;
  };

  // 判断是否滚动
  const modeF = () => {

    setTimeout(() => {
      let a = []
      if (bank.length > 0) {
        bank.forEach((value, index) => {
          a.push(document.getElementById(`box-${index}`)?.scrollWidth > document.getElementById(`box-${index}`)?.offsetWidth)
          console.log('-document.getElementById(`box-${index}`)?.scrollWidth > document.getElementById(`box-${index}`)?.offsetWidth', document.getElementById(`box-${index}`)?.scrollWidth > document.getElementById(`box-${index}`)?.offsetWidth);
          // value.roll=document.getElementById(`box-${i}`)?.scrollWidth > document.getElementById(`box-${i}`)?.offsetWidth
        })
      }
      console.log('-------------------------', a);
      modeDsSet(a)
    }, 100)

  }


  return (
    <div className={style.gbg}>
      <div className={style.title_div}>
        <NavBar back={null}
          left={<img src={require("../../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px" }} onClick={() => history(-1)} />} className={style.wbg}
          right={<img style={{ width: "23px", height: "23px" }} onClick={() => history("/service")} src={require("../../../assets/image/newImg/kficon.png")} alt="" />}>
          <div style={{ fontSize: "18px", color: "#1e1b27", fontWeight: "500" }}>{t("ui_dep")}</div>
        </NavBar>
        <NoticeBar icon={<img src={require("../../../assets/image/game/zx/ts.png")} style={{ width: "13.5px", height: "12px" }} />} content={advList} style={{ "--height": "38px", background: "#F7F7F8", border: "none", "--text-color": "#535353" }} />
      </div>
      <div className={style.bodys}>
        {way.length > 0 && (
          <div className={style.ways}>
            <div className={style.way}>
              <div className={style.rtitle}>{t("chong_zhi_fs")}</div>
              <div className={style.list}>
                {way.map((item, index) => (
                  <div
                    key={index}
                    className={`${style.box} ${wayIndex === index ? style.active : ""}`}
                    // , wayIndexs(index)
                    onClick={() => {
                      handleSelectWay(item, index);

                      PickersSet(false)
                      modeF()
                    }}>
                    <Image className={style.icon} src={item.channelImage}></Image>
                    {/*  ${item.goBeyond ? style.box_div : ""} */}
                    <div className={`${style.box_div2}`}>
                      <div id={`way-${index}`} className={`${item.goBeyond ? style.box_div : ""}`}>{item.name}</div>
                    </div>

                    {/* 推荐 */}
                    {item?.logs == 2 && <div className={style.recommend}></div>}

                    {wayIndex === index && <img className={style.Select} src={require('../../../assets/image/newImg/qbxz.png')} alt="" />}
                  </div>
                ))}
              </div>
            </div>
            {bank.length > 0 && (
              <>
                <div className={style.bankList_title}>
                  {t('xuanzezhifutongdao')}
                </div>
                <div className={style.Pickers_box} onClick={() => { PickersSet(!Pickers), modeF() }}>
                  <div className={style.Pickers_div}>
                    <div className={style.Pickers}>
                      <div>{bank[bankIndex]}</div>
                      <img src={require('../../../assets/image/newImg/qbx.png')} alt="" />
                    </div>
                  </div>
                  {Pickers && <div className={style.bankList2}>
                    <div className={style.divs}>
                      {bank.map((item, index) => {
                        return (
                          <div key={index} className={`${style.box} ${bankIndex === index ? style.active : ""}`} onClick={() => setBankIndex(index)}>
                            <div id={`box-${index}`} className={style.box_size}>
                              <span className={(modeDs != undefined && modeDs[index]) ? style.box_span : ''}>
                                {item}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>}
                </div>


                {/* <div className={style.bankList}>
                  {bank.map((item, index) => {
                    return (
                      <div key={index} className={`${style.box} ${bankIndex === index ? style.active : ""}`} onClick={() => setBankIndex(index)}>
                        {item}
                      </div>
                    );
                  })}
                </div> */}

                {/* <div className={style.bankList_bottom}></div> */}
              </>
            )}
          </div>
        )}
        <div className={style.content}>
          {/* <div className={style.balance}>
          <div className={style.title}>{t("wo_de_jb")}</div>
          <div className={style.money}>{user.goldCoin}</div>
        </div> */}
          {way.length > 0 && (
            <>
              <div className={style.rtitle}>
                {t("rp_dep_amount")}
              </div>
              <div className={style.rtitle_money}>

                <div className={style.bigs}>{t('jinbuyue')}:<img src={require("../../../assets/image/center/icon-gold.png")} alt="" />  <span>{assergoldData?.goldCoin || 0}</span></div>
                <span
                  style={{
                    color: "#FF839B",
                    // marginLeft: '9px'
                  }}>1000₫ = 1{t("jin_bi")}
                </span>
              </div>
              {/* sizeStatus */}

              {wayType !== 29 && (
                <div className={style.goldList}>
                  {way[wayIndex].products.map((item, index) => {
                    return (
                      <div key={index} className={`${style.box} ${goldIndex === index && trueRmbs.length == 0 ? style.active : ""}`} onClick={() => {
                        handleSelectCard(item, index)

                        wayType !== 7 && setShow(true)
                      }}>
                        <span>
                          <img src={require("../../../assets/image/center/icon-gold.png")} alt="" className={style.goldIcon} /> {item.goldCoin}
                        </span>
                        <p>{item.userRmb / 100}₫</p>
                      </div>
                    );
                  })}
                </div>
              )}
              {wayType !== 29 && wayType !== 7 && wayType != 19 && way[wayIndex].sizeStatus == 1 && (
                <div>
                  <div className={style.wayContent2}>
                    <div className={style.input}>
                      {/* <span>₫</span> */}
                      <Input onFocus={() => InputFocusSet(true)} onBlur={() => InputFocusSet(false)} className={`${style.input_div} ${InputFocus ? style.InputFocus : ''}`} placeholder={`${t('qingshuru')}: ${way[wayIndex].lowest} ~ ${way[wayIndex].highest} `} style={{ "--font-size": "14px", fontWeight: "600" }} type="number" value={trueRmbs} onChange={trueRmbsSet}></Input>
                    </div>
                    {/* <p>{t('moneyRange')}: {way[wayIndex].lowest} ~ {way[wayIndex].highest}</p> */}
                    <Button color="primary" onClick={() => trueRmbs.length > 0 && handleExchange()} className={`${style.submit2} ${trueRmbs.length > 0 ? style.submit2_back : ''}`} loading="auto">
                      {t("vipTxt4")}
                    </Button>
                  </div>
                </div>
              )}


              {/* 银行卡 */}
              {wayType === 7 && (
                <>
                  <div className={style.wayContent}>
                    {/* <div className={style.rtitle}>{t("rp_dep_amount")}</div> */}
                    <div className={style.input}>
                      {/* <span>₫</span> */}
                      <Input className={style.input_div} placeholder={`${t('qingshuru')}: ${way[wayIndex]?.lowest} ~ ${way[wayIndex]?.highest}`} style={{ "--font-size": "14px" }} type="number" value={rechargeMoney} onChange={setSechargeMoney}></Input>
                    </div>
                    {way[wayIndex]?.reward != 0 && <p>
                      {/* {t("moneyRange")}: {way[wayIndex].lowest} ~ {way[wayIndex].highest} */}
                      Phần thưởng nạp tiền {way[wayIndex]?.reward}%，bạn sẽ nhận {rechargeMoney * way[wayIndex]?.reward / 100}Xu
                    </p>}
                  </div>
                  <div className={style.wayContent}>
                    <div className={style.hk_fonts}>
                      {t('huikuanxinxi')}
                    </div>

                    <div className={style.rtitle}><span>＊</span>{t("selfBankTitle1")}</div>
                    <div className={style.input2}>
                      <Input className={style.input_div} placeholder={t("selfBankNotice1")} type="number" value={accountNumber} onChange={setAccountNumber} maxLength={16}></Input>
                    </div>
                    <div className={style.rtitle}><span>＊</span>{t("selfBankTitle2")}</div>
                    <div className={style.input2}>
                      <Input className={style.input_div} placeholder={t("selfBankNotice2")} value={name} onChange={setName} maxLength={16}></Input>
                    </div>
                    <div className={style.rtitle}>{t("rp_remark")}</div>
                    <div className={style.input2}>
                      <Input className={style.input_div} placeholder={t('qingshurubeizhuxinxi')} value={notice} onChange={setNotice} maxLength={16}></Input>
                    </div>
                  </div>

                  <div className={` ${style.wayCard}`}>
                    <div className={style.wayCard_title}>
                      {t('shoukuanrenxinxi')}
                    </div>
                    <div className={style.wayCard_div}>
                      <dt>
                        <span>{t("ui_bank_acc_colon")}</span>
                        <p>{card?.cardNo}</p>
                        <img src={require("../../../assets/image/newImg/qbfz.png")} alt="" onClick={() => copy(card?.cardNo)} />
                      </dt>
                      <dt>
                        <span>{t("ui_open_acc_name_colon")}</span>
                        <p>{card?.trueName}</p>
                        <img src={require("../../../assets/image/newImg/qbfz.png")} alt="" onClick={() => copy(card?.trueName)} />
                      </dt>
                      <dt>
                        <span>{t("ui_open_acc_bank_colon")}</span>
                        <p>{card?.bankName}</p>
                        <img src={require("../../../assets/image/newImg/qbfz.png")} alt="" onClick={() => copy(card?.bankName)} />
                      </dt>
                      <dt>
                        <span>{t("rechargeMsg")}</span>
                        <p>{user.uid}</p>
                        <img src={require("../../../assets/image/newImg/qbfz.png")} alt="" onClick={() => copy(user.uid)} />
                      </dt>
                      <dt style={{ marginBottom: "0px" }}>
                        <span>{t("rechargeBank")}</span>
                        <p>{card?.bankSub}</p>
                        <img src={require("../../../assets/image/newImg/qbfz.png")} alt="" onClick={() => copy(card?.bankSub)} />
                      </dt>
                    </div>
                    {/* <div className={style.notice}>{t("chong_zhi_ts")}</div> */}
                  </div>

                  <div className={style.step}>
                    <div>{t("rechargeTxt1")}</div>
                    <p>{t("rechargeTxt2")}</p>
                  </div>
                  <div className={style.disFlex}>
                    <Button color="primary" className={style.submit} loading="auto" onClick={() => submitWay1()}>
                      {t("li_ji_cz")}
                    </Button>
                  </div>
                </>
              )}
              {/* usdt */}
              {wayType === 29 && (
                <div className={style.usdtBox}>
                  {/* <div className={style.payChannel_usdt}>
                  {t("ui_dep")} <span>1000₫=1{t("ynd")}</span>
                </div> */}
                  <div className={style.payChannel2}>{t("usdt_sk_payChannel")}</div>
                  <div className={style.bankNameList}>
                    {usdtList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            {
                              setUsdtInfo(item), setUsdtIndex(index);
                            }
                          }}
                          className={`${style.bankName} ${usdtIndex == index ? style.active : ""}`}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            {/* <img style={{ width: '16px', height: '16px', marginRight: '9.5px' }} src={require('../../../assets/image/center/icon-network.png')} alt="" /> */}
                            {item.bankName}
                          </div>
                          {/* {usdtIndex == index && <img src={require('../../../assets/image/tx/xnd.png')} alt="" />} */}
                        </div>
                      );
                    })}
                  </div>
                  {/* <div className={style.usdtInfo}>
                            <div className={style.rtitle}>{t('usdt_sk_address')}</div>
                            <div className={style.rtitle2}>{t('usdt_tips4')}</div>
                            <div className={style.address}>
                                <input readOnly className={style.url} type="text" value={usdtInfo.cardNo} />
                                <img className={style.btn} src={require('../../../assets/image/tx/fz.png')} onClick={() => copy(usdtInfo.cardNo)} />
                            </div>
                            <div className={style.usdt_gold}>
                                <span className={style.rtitle}>{t('usdt_sk_code')} </span>
                                <p>{usdtInfo.goldToUsdt}</p>
                            </div>
                            <div className={style.QRCode}>
                                <QRCode className={style.code} value={usdtInfo.cardNo} size={140} />
                            </div>
                        </div> */}
                  <div className={style.wayContent}>
                    <div className={style.rtitle3}>
                      {/* {t('rp_dep_amount')} */}
                      <span>đồng USDT</span> <div>{usdtInfo?.goldToUsdt}</div>
                    </div>

                    <div className={style.input3}>
                      {/* <span>₫</span> */}
                      {/* placeholder={t('shu_ru_je')} */}
                      <Input style={{ "--font-size": "14px", fontWeight: "600" }} type="number" value={sechargeUSDT} onChange={setSechargeUSDT}></Input>
                    </div>
                    {/* <p>{t('moneyRange')}: {way[wayIndex].lowest} ~ {way[wayIndex].highest}</p> */}
                  </div>
                  <div className={style.disFlex}>
                    <Button color="primary" className={style.submit} loading="auto" onClick={() => submitWayUSDT()}>
                      {t("vipTxt4")}
                    </Button>
                  </div>
                </div>
              )}
              {/* 底部按钮 */}
              {/* {wayType != 7 && wayType != 29 && (
              <Button color="primary" onClick={() => handleExchange()} className={style.submit} loading="auto">
                {t("vipTxt4")}
              </Button>
            )} */}


              {/* 提示wayType==19 */}
              {wayType == 19 && (
                // dangerouslySetInnerHTML={{ __html:way[wayIndex].remark}}
                <div className={style.remark_font} dangerouslySetInnerHTML={{ __html: way[wayIndex].remark ? way[wayIndex].remark?.replace(/\r\n/g, "<br/>") : "" }}></div>
              )}
            </>
          )}
        </div>
      </div>
      <Mask
        showCloseButton
        onClose={() => {
          setShow(false);
        }}
        visible={show}
        onMaskClick={() => {
          setShow(false), setItem({});
        }}
        className={style.Mask_inputBody}
      >
        <div className={style.inputBody_a}>
          <div className={style.inputBody}>
            <div className={style.title}>{t("ui_prompt")}</div>
            <div className={style.duihuan}>{t("rechargeTxt6", { gold1: item.userRmb / 100, gold2: item.goldCoin })}</div>
          </div>
          <div className={style.btnGroup}>
            <Button
              className={style.btn}
              onClick={() => {
                setShow(false), setItem({});
              }}
              loading="auto">
              {t("btn_cancel")}
            </Button>
            <Button className={style.btn} onClick={() => handleExchange()} loading="auto">
              {t("btn_enter")}
            </Button>
          </div>
        </div>
      </Mask>
      {/* usdtT */}
      <Mask
        destroyOnClose
        onClose={() => {
          usdtTimeSet(0);
          usdtTimeRef.current = 0;
          ustdTimeDSet("");
          clearTimeout(time);
          usdtTSet(false);
        }}
        visible={usdtT}
        onMaskClick={() => {
          usdtTimeSet(0);
          usdtTimeRef.current = 0;

          ustdTimeDSet("");
          clearTimeout(time);
          usdtTSet(false);
        }}>
        <div className={style.usdtT}>
          <div className={style.title}>
            <div></div>
            {/* <div>USDT支付中</div> */}
            <div>{t("usdtzfz")}</div>
            <img
              src={require("../../../assets/image/center/gbicon.png")}
              alt=""
              onClick={() => {
                usdtTimeSet(0);
                usdtTimeRef.current = 0;

                ustdTimeDSet("");
                clearTimeout(time);
                usdtTSet(false);
              }}
            />
          </div>

          <div className={style.content}>
            <div className={style.djs}>
              {/*  ustdRechargeD?.time */}
              <img src={require(`../../../assets/image/center/${usdtQRCode ? "djsicon" : "djsiconred"}.png`)} alt="" />
              <span style={{ color: `${usdtQRCode == false ? "red" : ""}` }}>{ustdTimeD}</span>
            </div>

            <div className={style.usdt}>{ustdRechargeD?.amount || 0} USDT</div>
            <div className={style.QRCodes}>
              {usdtQRCode ? (
                <QRCode style={{ borderRadius: "8px" }} value={ustdRechargeD?.usdtAddress} size={175} />
              ) : (
                <div style={{ background: `url(${require("../../../assets/image/center/sxierwm.png")})`, backgroundSize: "100% 100%", width: "175px", height: "175px", position: "relative" }}>
                  <div style={{ borderRadius: "8px" }} className={style.QRCode_div}>
                    <img
                      src={require("../../../assets/image/center/sxicon.png")}
                      alt=""
                      className={style.sxIcon}
                      onClick={() => {
                        ustdRechargeF();
                      }}
                    />
                    <div className={style.sxBottom}>{t("erweimayishixiao")}</div>
                  </div>
                </div>
              )}
            </div>

            {usdtQRCode && (
              <div
                className={style.bunts}
                style={{ background: `url(${require("../../../assets/image/center/fzlj.png")})`, backgroundSize: "100% 100%" }}
                onClick={() => {
                  copy(ustdRechargeD?.usdtAddress);
                }}>
                {t("ui_copy_link")}
              </div>
            )}
          </div>
        </div>
      </Mask>

      {/* 蒙尘 */}
      {
        Pickers && <div className={style.mcPickers} onClick={() => { PickersSet(!Pickers), modeF() }}>
        </div>
      }
    </div>
  );
}
