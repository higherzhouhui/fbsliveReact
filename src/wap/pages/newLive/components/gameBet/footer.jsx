import { Button, Input, Popover, Popup, Toast, Mask } from "antd-mobile";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import style from "./common.module.scss";
import { LotteryBet } from "../../../../server/live";
import useContextReducer from "../../../../state/useContextReducer";
import { game7Data } from "./gameData";
const PointOut = React.lazy(() => import('../../../../components/pointOut/index'))
const InitialCharge = React.lazy(() => import('../InitialCharge/index'))

export default function BetFooter(props) {
  const {
    state: {
      showRechargeGift,
      assergoldData,
      live: { liveIssue, RoomDownTime, liveDetail },
      Betting
    },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { userGetUserAsserGold, updateBetting } = fetchUtils;
  const { btiData, sType, lotteryInfo, lotteryType2, lotteryType3, method, money } = props;
  const { t } = useTranslation();
  const history = useNavigate();
  let [selectMoney, setSelectMoney] = useState(5);
  let [btiPerIndex, setBtiPerIndex] = useState(0);
  let [showMoneyList, setShowMoneyList] = useState(false);
  let [showCheckBti, setShowCheckBti] = useState(false);
  let [moneyListIndex, setMoneyListIndex] = useState(0);
  let [itemArr, setItemArr] = useState({ list: [] });
  let [setMonetValue, hdsetMonetValue] = useState("");
  let [playNumData, playNumDataSet] = useState("");
  let [betCount, betCountSet] = useState(0);
  let [freshYnOpens, freshYnOpensSet] = useState(false);
  const [opens, opensSet] = useState(false)

  const [visible2, setVisible2] = useState(false);
  // let moneyPer = [223, 272].includes(Number(issue.name)) ? 1 : 1; //某些游戏倍率需要翻倍
  /**
   * 1 272飞艇翻2倍 xyft
   * 2 223越南30S根据选择的游戏类型的倍率(method.methodMut)计算 yncp30s
   * 3 其他的还是默认1倍
   */
  let moneyPer = 0;
  switch (liveIssue.name) {
    case "272":
      moneyPer = 2;
      break;
    case "xyft":
      moneyPer = 1;
      break;
    case "223":
      moneyPer = method?.methodMut || 1;
      break;
    case "yncp30s":
      moneyPer = method?.methodMut || 1;
      break;
    default:
      moneyPer = 1;
      break;
  }
  useEffect(() => {
    if (btiData.length === 0 && lotteryInfo?.type !== "PTH_XH" && lotteryInfo?.type !== "PTH_SR") setShowCheckBti(false);
    let list = btiData || [];
    for (let i in list) {
      list[i].money = selectMoney;
    }
    setItemArr({ list });
  }, [props]);
  useEffect(() => {
    let list = [...itemArr.list];
    for (let i in list) {
      list[i].money = selectMoney;
    }
    setItemArr({ list });
  }, [selectMoney]);

  let [moneyList, setMonetList] = useState([5, 10, 20, 50, 100, 200, 500, 0]);
  let btiPer = [1, 2, 5, 10, 20]; //投注倍率

  let dataLy = useMemo(() => itemArr.list.length);
  let dataAll = useMemo(() => {
    let num = itemArr.list.reduce((sum, item) => {
      sum += item.money * btiPer[btiPerIndex];
      return sum;
    }, 0);
    return num;
  });

  useEffect(() => {
    // console.log('Betting?.[`${liveIssue?.name}Bl`]---', Betting?.[`${liveIssue?.name}Bl`]);
    // if (Betting?.[`${liveIssue?.name}Bl`] != undefined) {
    //   setBtiPerIndex(Betting?.[`${liveIssue?.name}Bl`])
    // }
    if (Betting?.[`${liveIssue?.name}ListIndex`] != undefined) {
      setMoneyListIndex(Betting?.[`${liveIssue?.name}ListIndex`]);
      setSelectMoney(Number(moneyList[Betting?.[`${liveIssue?.name}ListIndex`]]));
    }
    if (Betting?.[`${liveIssue?.name}ListIndex`] != undefined && Betting?.[`${liveIssue?.name}ListIndex`] == 7) {
      moneyList[7] = Betting?.[`${liveIssue?.name}setMonetValue`];
      setMonetList(moneyList);
      setMoneyListIndex(7);
      setSelectMoney(Betting?.[`${liveIssue?.name}setMonetValue`])
      hdsetMonetValue(Betting?.[`${liveIssue?.name}setMonetValue`])

    }

    window.eventBus.addListener("freshYnOpen", freshYnOpen); //回调关闭刷新转圈
    return () => {
      setShowMoneyList(false);
    };
  }, []);
  const freshYnOpen = () => {
    freshYnOpensSet(false);
  };

  const mTime = (time) => {
    function zoreTime(n) {
      return n > 9 ? n : "0" + n;
    }
    return `${zoreTime(Math.floor(time / 60))}:${zoreTime(time % 60)}`;
  };

  const getGame1Name = (num) => {
    num = Number(num);
    let name = "";
    switch (num) {
      case 1:
        name = t("lu");
        break;
      case 2:
        name = t("hulu");
        break;
      case 3:
        name = t("ji");
        break;
      case 4:
        name = t("yu");
        break;
      case 5:
        name = t("xie");
        break;
      case 6:
        name = t("xia");
        break;
    }
    return name;
  };
  //去投注，弹出投注框
  const toBti = () => {
    if (lotteryInfo?.type === "PTH_XH") {
      if (lotteryType2.list1.length === 0 || lotteryType2.list2.length === 0) {
        return Toast.show(t("leastOne"));
      }
    } else if (lotteryInfo?.type === "PTH_SR" && lotteryType3.length === 0) {
      return Toast.show(t("leastOne"));
    } else if (btiData.length === 0 && lotteryInfo?.type !== "PTH_XH" && lotteryInfo?.type !== "PTH_SR") {
      return Toast.show(t("leastOne"));
    }
    if (["PTH_KX", "PTH_XH", "PTH_SR"].includes(lotteryInfo?.type)) {
      let pData;
      if (lotteryInfo?.type === "PTH_KX") {
        betCountSet(itemArr.list.length);
        pData = itemArr.list.map((e) => (e.oname ? e.oname.join(e.split) : e.name.join(e.split)));
      }
      if (lotteryInfo?.type === "PTH_XH") {
        betCountSet(lotteryType2.list1.length * lotteryType2.list2.length);
        pData = [`${lotteryType2.list1.map((a) => a.value).join(",")}|${lotteryType2.list2.map((a) => a.value).join(",")}`];
      }
      if (lotteryInfo?.type === "PTH_SR") {
        betCountSet(lotteryType3.length);
        pData = [lotteryType3.join(",")];
      }
      playNumDataSet(pData);
    }
    setShowCheckBti(true);
  };
  const handleSelectMoney = (index) => {
    setMoneyListIndex(index);
    setSelectMoney(Number(moneyList[index]));

    updateBetting({ ...Betting, [`${liveIssue?.name}ListIndex`]: index })

    setShowMoneyList(false);
  };
  //删除某个投注数据
  const handleDelBetData = (index) => {
    let list = [...itemArr.list];
    if (liveIssue?.name === "272" || liveIssue?.name === "xyft") props.delFeitingGame(list[index]);
    list.splice(index, 1);
    setItemArr({ list });
    props.setCheckData(list);
  };

  // 提交投注信息
  const confirmBti = async () => {
    if ((dataAll * moneyPer) > Number(assergoldData.goldCoin)) {
      if (showRechargeGift.showRechargeGift == 1) {
        opensSet(true)
      } else {
        setVisible2(true)
      }
      return
    }
    const { liveId } = liveDetail;
    let lotteryName = liveIssue.name === "272" ? "xyft" : liveIssue.name === "223" ? "yncp30s" : liveIssue.name;
    let playNum = itemArr.list.map((e) => {
      return {
        money: e.money,
        notes: 1,
        num: e.type == "BZ" || e.type == 8 ? e.name.join(e.split).substring(0, 1) : e.oname ? e.oname.join(e.split) : e.name.join(e.split),
        rebate: 0, //不变
        type: e.type,
        type_text: e.type_text,
        name: lotteryName,
      };
    });
    let param = {
      isStop: 0,
      playNum,
      liveId: liveId,
      expect: [
        {
          expect: liveIssue.expect,
          isLHC: false,
          multiple: 1,
        },
      ],
      times: btiPer[btiPerIndex],
      lotteryName: lotteryName,
      isHemai: 0,
    };
    const res = await LotteryBet(param);
    if (!(res instanceof Error)) {
      Toast.show(t("betSuccess"));
      userGetUserAsserGold(); //查询游戏余额
      // freshUser();
      setItemArr({ list: [] });
      props.setCheckData([]);
      setShowCheckBti(false);
      if (liveIssue?.name === "272" || liveIssue?.name === "xyft") {
        window.eventBus.emit("freshYn");
        props.delFeitingGame([]);
      }
    }
  };

  // 提交投注信息
  const confirmBti2 = async () => {
    if ((getType2An * moneyPer) > Number(assergoldData.goldCoin)) {
      if (showRechargeGift.showRechargeGift == 1) {
        opensSet(true)
      } else {
        setVisible2(true)
      }

      return
    }
    let count = lotteryInfo?.type !== "PTH_KX" ? betCount : 1;
    const { liveId } = liveDetail;
    let lotteryName = liveIssue.name === "272" ? "xyft" : liveIssue.name === "223" ? "yncp30s" : liveIssue.name;
    let playNum = playNumData.map((v) => {
      return {
        money: selectMoney * count * method.methodMut,
        name: lotteryName,
        notes: 1,
        num: v,
        rebate: 0, //不变
        type: method.type,
        type_text: method.type_text,
      };
    });
    let param = {
      betCount,
      isStop: 0,
      playNum,
      liveId: liveId,
      expect: [
        {
          expect: liveIssue.expect,
          isLHC: false,
          multiple: 1,
        },
      ],
      times: btiPer[btiPerIndex],
      lotteryName: lotteryName,
      isHemai: 0,
    };
    const res = await LotteryBet(param);
    if (!(res instanceof Error)) {
      Toast.show(t("betSuccess"));
      userGetUserAsserGold(); //查询游戏余额
      // freshUser();
      setItemArr({ list: [] });
      props.setCheckData([]);
      setShowCheckBti(false);
      window.eventBus.emit("freshYn");
    }
  };

  const changeMoneyInput = () => {
    if (setMonetValue % 5 > 0) return Toast.show(t("enterFivePer"));
    if (!setMonetValue) return Toast.show(t("ui_enter_amount"));
    updateBetting({ ...Betting, [`${liveIssue?.name}ListIndex`]: 7, [`${liveIssue?.name}setMonetValue`]: Number(setMonetValue) })

    setShowMoneyList(false);
    setSelectMoney(Number(setMonetValue));
    moneyList[7] = setMonetValue;
    setMonetList(moneyList);
    setMoneyListIndex(7);


    console.log('22222---');


  };

  //计算越南彩总金额
  const getType2An = useMemo(() => {
    if (lotteryInfo?.type === "PTH_KX") {
      return btiData.length * btiPer[btiPerIndex] * selectMoney;
    }
    if (lotteryInfo?.type === "PTH_XH") {
      return betCount * btiPer[btiPerIndex] * selectMoney;
    }
    if (lotteryInfo?.type === "PTH_SR") {
      return betCount * btiPer[btiPerIndex] * selectMoney;
    }
  }, [btiData, btiPer, btiPerIndex, selectMoney, betCount]);

  return (
    <>
      <div style={{ position: "fixed", bottom: "9px", left: "0px", width: "100%" }}>
        {/* 倍率 */}
        <div className={`${style.btiPer} ${style.outSetBtiPer}`}>
          {btiPer.map((num, index) => (
            <div className={`${style.box} ${btiPerIndex === index ? style.active : ""}`} key={`bp${num}`} onClick={() => setBtiPerIndex(index)}>
              X{num}
            </div>
          ))}
        </div>
        <div className={`${style.btiFooter} ${style.disFlexb}`}>
          <div className={`${style.left} ${style.disFlex}`}>
            {/* user.goldCoin || */}
            <div className={style.money}>
              <img src={require("../../../../assets/image/center/icon-gold.png")} className={style.iconGold} /> {["223", "272"].includes(liveIssue?.name) ? (money ? money : 0) : assergoldData?.goldCoin || 0}
            </div>
            {/* 底部转账 刷新余额 */}
            {["223", "272"].includes(liveIssue?.name) ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <Button onClick={() => ynTrans()} className={style.chargeBtn}>
                  {t("transTitle")}
                </Button> */}
                {/* ynTrans() */}
                <img
                  style={{ width: "24px", height: "24px", marginLeft: "4px" }}
                  onClick={() => {
                    window.eventBus.emit("setShowTransD");
                  }}
                  src={require("../../../../assets/image/live/lottery/zzicon.png")}
                  alt=""
                />
                <img
                  onClick={() => {
                    freshYnOpensSet(true), window.eventBus.emit("freshYn");
                  }}
                  className={freshYnOpens ? style.freshYnOpen : ""}
                  src={require("../../../../assets/image/live/lottery/lotteryFresh2.png")}
                  alt=""
                  style={{ width: "24px", height: "24px", marginLeft: "4px" }}
                />
              </div>
            ) : (
              <Button onClick={() => history("/recharge")} className={style.chargeBtn}>
                {t("ui_dep")}
              </Button>
            )}
          </div>
          <div className={`${style.right} ${style.disFlex}`}>
            <div className={style.cm}>
              <Popover
                content={
                  <div className={style.moneySelectBody}>
                    <div className={style.moneyList}>
                      {moneyList.map((num, index) => {
                        if (index < 7) {
                          return (
                            <div className={`${style.moneybox} ${moneyListIndex === index ? style.active : ""}`} onClick={() => handleSelectMoney(index)} key={`cm${index}`}>
                              {num}
                            </div>
                          );
                        } else {
                          return (
                            <Input
                              placeholder={t("zidingyi")}
                              value={setMonetValue}
                              onChange={hdsetMonetValue}
                              className={style.moneyInput}
                              type="number"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") changeMoneyInput();
                              }}
                              onBlur={() => changeMoneyInput()}
                              style={{ "--color": "#fff", "--text-align": "center" }}
                              key={`cm${index}`}
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
                }
                trigger="click"
                placement="top"
                visible={showMoneyList}
                className="tmPopover">
                <div className={style.smallMoney} onClick={() => setShowMoneyList(!showMoneyList)}>
                  {selectMoney}
                  <img src={require("../../../../assets/image/live/lottery/jiantou-shang2.png")} className={`${style.jiantou} ${showMoneyList ? style.trans : ""}`} />
                </div>
              </Popover>
            </div>
            <Button
              className={style.btiBtn}
              onClick={() => {
                setShowMoneyList(false);
                toBti();
              }}>
              {" "}
              {t("bet")}
            </Button>
          </div>

          {sType === 2 ? (
            // bodyClassName={style.windowBottom}
            <Popup mask={false} visible={showCheckBti} onMaskClick={() => setShowCheckBti(false)} bodyClassName={style.windowBottom2}>
              <div style={{ width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.55)' }} onClick={() => setShowCheckBti(false)}>
                {/* 越南彩弹框 */}
                <div className={`${style.windowBottom} ${style.tipsPopUp}`} onClick={(e) => { e.stopPropagation() }}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%", padding: "0 16px" }}>
                    <img
                      onClick={() => {
                        setShowCheckBti(false);
                      }}
                      src={require("../../../../assets/image/live/fb-back.png")}
                      alt=""
                      style={{ width: "7.66px", height: "13.22px", filter: "contrast(200%) invert(200%)" }}
                    />
                    <div className={style.tipsPopUp_title}>
                      {t("issues")}
                      {liveIssue.expect}
                    </div>
                  </div>
                  <div className={`${style.marginTop} `} style={{ width: "100%", padding: "0 12px" }}>
                    <div className={style.borderBut}>
                      <div>{method?.methodName}</div>
                      <div>{playNumData}</div>
                    </div>
                  </div>
                  <div className={`${style.margins} ${style.information}`}>
                    <div style={{ background: `url(${require("../../../../assets/image/live/lottery/yltz.png")})`, backgroundSize: "100% 100%", height: "87px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div>
                        {t("beilv")} {btiPer[btiPerIndex]}x97
                      </div>
                      <div>{t("zongliushuihao")}</div>
                      <div>
                        {t("zongjine")}：{getType2An * moneyPer}
                      </div>
                    </div>
                  </div>
                  {/* 底部按钮 */}
                  <div className={style.displ_but}>
                    <Button className={style.but} onClick={() => setShowCheckBti(false)}>
                      {t("btn_cancel")}
                    </Button>
                    <Button className={`${style.but} ${style.but2}`} onClick={() => confirmBti2()}>
                      {t("btn_confirm")}
                    </Button>
                  </div>
                </div>
                {/* 首冲有礼 */}
                {
                  showRechargeGift.showRechargeGift == 1 &&
                  <InitialCharge hide={true} open={opens} close={() => opensSet(false)} />
                }
                <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/recharge')} type={2} />
              </div>
            </Popup>
          ) : (
            <Popup mask={false} visible={showCheckBti} onMaskClick={() => setShowCheckBti(false)} bodyClassName={style.windowBottom2}>
              <div style={{ width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.55)' }} onClick={() => setShowCheckBti(false)}>
                {/* 投注确认弹框 */}
                <div className={`${style.windowBottom} ${style.checkBtiForm}`} onClick={(e) => { e.stopPropagation() }}>
                  <div className={style.title}>{t("bet")}</div>
                  <div className={style.info}>
                    {liveIssue.nickName} {t("issues")}
                    {liveIssue.expect} {t("fengpan")}：{mTime(RoomDownTime)}
                  </div>
                  <div className={style.overBti}>
                    {itemArr.list.map((item, index) => (
                      <div className={style.box} key={`od${index}`}>
                        <div className={`${style.big} ${style.red}`}>
                          {liveIssue?.name === "yuxx" && (
                            <>
                              {item.name.map((num, key) => (
                                <span key={`od1${key}`}>
                                  {getGame1Name(num)}
                                  {key < item.name.length - 1 && <i>,</i>}
                                </span>
                              ))}
                            </>
                          )}
                          {liveIssue?.name === "jsks" && (
                            <>
                              {item.name.map((num, key) => (
                                <span key={`od2${key}`}>
                                  {num}
                                  {key < item.name.length - 1 && <i>,</i>}
                                </span>
                              ))}
                            </>
                          )}
                          {liveIssue?.name === "jsks5" && (
                            <>
                              {item.name.map((num, key) => (
                                <span key={`od2${key}`}>
                                  {num}
                                  {key < item.name.length - 1 && <i>,</i>}
                                </span>
                              ))}
                            </>
                          )}
                          {liveIssue?.name === "txssc" && (
                            <>
                              <span>{typeof item.name[0] === "number" ? item.name[1] : item.name[0]}</span>
                            </>
                          )}
                          {liveIssue?.name === "yflhc" && (
                            <>
                              <span>{item.name[0]}</span>
                            </>
                          )}
                          {liveIssue?.name === "pk10" && (
                            <>
                              <span>{item.name[0]}</span>
                            </>
                          )}
                          {liveIssue?.name === "223" ||
                            (liveIssue?.name === "yncp30s" && (
                              <>
                                <span>{item.name[0]}</span>
                              </>
                            ))}
                          {(liveIssue?.name === "272" || liveIssue?.name === "xyft") && (
                            <>
                              {/* game7Data[item.type_text]?.title */}
                              <span>{item.show_name}</span>
                            </>
                          )}
                        </div>
                        <div className={style.closeImg} onClick={() => handleDelBetData(index)}>
                          <img src={require("../../../../assets/image/live/lottery/sclog.png")} />
                        </div>
                        {liveIssue.name === "272" || liveIssue.name === "xyft" ? (
                          <div>
                            {/* {item.name[0]}
                          {item.show_name} */}
                            {game7Data[item.name[0] - 1].title}
                          </div>
                        ) : (
                          <div className={style.lit}>{item.type_show || item.type_text}</div>
                        )}
                        <div className={`${style.big2} ${style.red}`}>
                          {item.money}X{btiPer[btiPerIndex]}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* 倍率 */}
                  <div className={style.btiPer}>
                    {btiPer.map((num, index) => (
                      <div className={`${style.box} ${btiPerIndex === index ? style.active : ""}`} key={`bp${num}`} onClick={() => setBtiPerIndex(index)}>
                        X{num}
                      </div>
                    ))}
                  </div>
                  <div className={style.disFlexb}>
                    <div className={style.disFlex}>
                      {t("num")}:<span className={style.red}>{dataLy}</span>
                    </div>
                    <div className={style.disFlex}>
                      {t("total")}:<span className={style.red}>{dataAll * moneyPer}</span>
                    </div>
                  </div>
                  <div className={style.disFlexb}>
                    <div className={style.lit}>
                      {t("balance")}:{/* user.goldCoin || */}
                      <span className={style.red}>{["223", "272"].includes(liveIssue?.name) ? (money ? money : 0) : assergoldData?.goldCoin || 0}</span>
                    </div>
                    <Button className={style.btiBtn} onClick={() => confirmBti()} loading="auto">
                      {t("bet")}
                    </Button>
                  </div>
                </div>
                {/* 首冲有礼 */}
                {
                  showRechargeGift.showRechargeGift == 1 &&
                  <InitialCharge hide={true} open={opens} close={() => opensSet(false)} />
                }
                <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/recharge')} type={2} />
              </div>
            </Popup>
          )}
        </div>
      </div>
    </>
  );
}
