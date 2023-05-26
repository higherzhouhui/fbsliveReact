// 游戏详情
import React, { forwardRef, Suspense, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import "./style/detail.scss";
import { LotteryBet, GetGameHistory, GetAllGameHistory, LotteryType } from "../../../../api/game";
import { Popover, message, InputNumber, Dropdown } from "antd";
import { json, Link } from "react-router-dom";
import { gameIconMap, GameObj, NumMap } from "./gameShow";
import YnGame from "./ynGame";
import FtGame from "./ftGame";
import { getScBanlance, inSc, outSc } from "../../../../api/userInfo";
import { Button, DotLoading, Mask } from "antd-mobile";
import { getGlistr } from "../../../../wap/pages/newLive/components/gameBet/common";
import { useTranslation } from "react-i18next";

const GameDetail = (props, ref) => {
  const [tabIndex, tabIndexSet] = useState(0);
  const [money, moneySet] = useState(5);
  const [count, countSet] = useState(1);
  const [choiceList, choiceListSet] = useState({});
  const [langList, langListSet] = useState({});
  const [history, historySet] = useState({});
  const [allHistory, allHistorySet] = useState([]);
  const [historyLoding, historyLodingSet] = useState(false);
  const [allHistoryLoading, allHistoryLoadingSet] = useState(false);
  const [betLoading, betLoadingSet] = useState(false);
  const [nickName, nickNameSet] = useState("");
  const [betVisible, betVisibleSet] = useState(false);
  const [scBanlance, scBanlanceSet] = useState(0);
  const [openBalance, openBalanceSet] = useState(false);
  const [banlanceLoading, banlanceLoadingSet] = useState(false);
  const [expect, expectSet] = useState("");
  const [actionList, actionListSet] = useState([]);
  const [actionIndex, actionIndexSet] = useState(0);
  let [checkGame7, setCheckGame7] = useState({ list: [] });
  const YnRef = useRef(null);
  const FtRef = useRef(null);

  const { getGameComp, name, FreshUser, liveId, issuData, userInfo, down_time: downTime, onClose, gamePic } = props;
  // console.log(getGameComp, name, FreshUser, liveId, issuData, userInfo, downTime, onClose, gamePic, "1111")
  console.log(GameObj, "GameObj", name, "name");
  const { t } = useTranslation();

  useImperativeHandle(ref, () => {
    return {
      getIssueHandle: (rt) => {
        nickNameSet(rt.nickName);
        expectSet(rt.expect);
        if (["223", "272"].includes(name)) handleGetAction();
      },
    };
  });

  const consInit = useCallback(() => {
    getGameHistory();
    getGameComp();
    GetScBanlance();
  }, []);

  useEffect(() => {
    consInit();
  }, [consInit]);

  useEffect(() => {
    getGameHistory();
    init();
  }, [name]);

  const iconData = useMemo(() => {
    return gameIconMap[name] && gameIconMap[name].icon;
  }, [name]);
  const iconActiveData = useMemo(() => {
    return gameIconMap[name] && gameIconMap[name].active;
  }, [name]);

  //获取越南彩类型
  const handleGetAction = async () => {
    const res = await LotteryType();
    actionListSet(res);
  };

  //越南彩余额转入转出，刷新
  const handleScIn = async (money) => {
    await inSc({ money: money.toString().replace(/[\,]/g, "") });
    freshBalance();
  };
  const handleScOut = async (money) => {
    await outSc({ money: money.toString().replace(/[\,]/g, "") });
    freshBalance();
  };
  const freshBalance = async () => {
    banlanceLoadingSet(true);
    GetScBanlance();
    await FreshUser();
    banlanceLoadingSet(false);
  };
  const getGameHistory = () => {
    historyLodingSet(true);
    GetGameHistory({ name: name }).then((rt) => {
      historySet(rt[0]);
      historyLodingSet(false);
    });
  };
  // 获取所有历史
  const getAllGameHistory = () => {
    allHistoryLoadingSet(true);
    GetAllGameHistory({ lotteryName: name, page: 0 }).then((rt) => {
      allHistorySet(rt);
      allHistoryLoadingSet(false);
    });
  };
  const GetScBanlance = () => {
    getScBanlance().then((e) => {
      scBanlanceSet(e.money);
    });
  };
  //打开越南彩详情
  const openDetail = (item) => {
    let list = [...allHistory];
    let index = list.findIndex((val) => val.id === item.id);
    list[index].Select = !item.Select;
    allHistorySet(list);
  };

  const setMoney = () => {
    let ye = money % 5;
    let count = 5;
    if (!money) {
      count = 5;
    } else if (ye == 0) {
      count = money;
    } else {
      let realM = Math.ceil(money / 5) * 5;
      count = realM;
      message.error(t("enterFivePer"));
    }
    moneySet(count);
  };

  const getAllHistoryContent = () => {
    return (
      <div className={"all-history-box " + (allHistoryLoading && "loading")}>
        {allHistory.map((item) => {
          return (
            <div className={name === "223" ? "all-his-th" : `all-history-box-item`} key={item.id}>
              <div className="all-his-th-title">{t("f_ui_num_period", { num: item.expect })}</div>
              {name === "223" ? (
                <>
                  <div className="recordBordy_content">
                    {getGlistr(item.lotteryResult)
                      .filter((a, v) => v < 3)
                      .map((val, key) => {
                        return (
                          <div className="disDD2_div" key={key}>
                            <img src={require(`../../../../assets/images/sclog/${val.name.toLowerCase()}.png`)} alt="" /> <span className={val.name === "DB" ? style.colorRed : ""}>{val.value.join(" ")}</span>
                          </div>
                        );
                      })}
                    <div className={`openIcon ${item.Select ? "on" : ""}`} onClick={() => openDetail(item)}>
                      <img src={require("../../../../assets/images/sclog/jiantou.png")} alt="" />
                    </div>
                  </div>
                  <div className="recordBordy_detailed" style={{ height: `${item.Select != undefined && item.Select == true ? "auto" : "0"}`, overflow: "hidden", marginTop: item.Select ? "6px" : "" }}>
                    {getGlistr(item.lotteryResult)
                      .filter((a, v) => v > 2)
                      .map((val, key) => {
                        return (
                          <div className="disDD2_div2" key={key}>
                            <img src={require(`../../../../assets/images/sclog/${val.name.toLowerCase()}.png`)} alt="" />
                            <div className="size">
                              {val.value.map((va, le) => {
                                return <span key={le}>{va}</span>;
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : (
                <div className="flex">
                  {item.lotteryResult.map((iitem, index) => {
                    return <Suspense key={index}>{iconData ? <img src={iconData[iitem]} /> : <div className={"text-icon baseBackground w-color " + (name == "yflhc" && "lhc")}>{iitem}</div>}</Suspense>;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getFirstHistoryContent = () => {
    let iconMap = gameIconMap[name];
    if (!history || !history.code || !history.code.split) return null;
    return (
      <div className={"flex history-box " + (historyLoding && "loading")}>
        {history.code.split(",").map((item, index) => (
          <div key={history.expect + "-" + index} className={"item " + (name == "yflhc" && "lhc")}>
            {iconMap && iconMap.icon ? <img className="" src={iconMap.icon[item]} /> : <div className={"baseBackground"}>{item}</div>}
          </div>
        ))}
      </div>
    );
  };

  // 确认投注
  const bet = (arr, typeData) => {
    if (arr.length == 0) return message.error(t("leastOne"));
    let sendData = {
      isStop: 0,
      playNum: typeData.map((item, index) => {
        let num = "";
        let numArr = arr[index].split(",");
        numArr.forEach((value) => {
          if (NumMap[value]) arr[index] = arr[index].replace(value, NumMap[value]);
          if (item.name == "十位") arr[index] += ",";
          if (item.name == "个位") arr[index] = "," + arr[index];
        });
        num = arr[index].replace(/,/gi, item.split);
        return {
          num,
          name: item.name,
          rebate: 0,
          type: item.type,
          type_text: item.type_text,
          money,
          notes: 1,
        };
      }),
      liveId,
      expect: [
        {
          expect: issuData.expect,
          isLHC: false,
          multiple: 1,
        },
      ],
      times: count,
      lotteryName: name,
      isHemai: 0,
    };
    sendLotteryBet(sendData);
  };

  const sendLotteryBet = (data) => {
    betLoadingSet(true);
    LotteryBet(data).then((rt) => {
      betLoadingSet(false);
      betVisibleSet(false);
      if (rt) {
        init(tabIndex);
        FreshUser();
        return message.success(t("betSuccess"));
      }
    });
  };

  const init = (tabIndex = 0) => {
    tabIndexSet(tabIndex);
    choiceListSet({});
    langListSet({});
    countSet(1);
  };
  const gameBetChoice = (data, type) => {
    console.log(data, type);
    if (choiceList[data]) {
      choiceList[data] = "";
      langList[data] = "";
    } else {
      choiceList[data] = data;
      langList[data] = type;
    }
    console.log(choiceList, "choiceList");
    choiceListSet(Object.assign({}, choiceList));
    langListSet(Object.assign({}, langList));
  };
  const getCoinChoiceContent = () => {
    return (
      <div className="coin-main-box">
        <div className="flex f-j-sb" style={{ marginBottom: 10 }}>
          {[5, 10, 20, 50].map((item) => (
            <div key={item} onClick={() => moneySet(item)} className={"btn " + (money == item && "active baseBackground")}>
              {item}
            </div>
          ))}
        </div>
        <div className="flex f-j-sb" style={{ marginBottom: 10 }}>
          {[100, 200, 500].map((item) => (
            <div key={item} onClick={() => moneySet(item)} className={"btn big " + (money == item && "active baseBackground")}>
              {item}
            </div>
          ))}
        </div>
        <div>
          <InputNumber step={5} precision={0} min={1} size="small" value={money} onBlur={setMoney} onChange={(money) => moneySet(money)} placeholder={`${t("ui_input")}${t("ui_other")}${t("num")}`} style={{ width: "100%" }} />
        </div>
      </div>
    );
  };
  const mTime = (time) => {
    function zoreTime(n) {
      return n > 9 ? n : "0" + n;
    }
    return `${zoreTime(Math.floor(time / 60))}:${zoreTime(time % 60)}`;
  };

  // 投注确认内容
  const getBetContent = () => {
    let lList = [];
    let arr = Object.keys(choiceList).filter((key) => {
      if (choiceList[key]) {
        lList.push(langList[key]);
      }
      return choiceList[key];
    });
    if (betVisible && name === "272" && checkGame7.list.length === 0) betVisibleSet(false);

    return (
      <div className="bet-sure-box">
        <div className="bet-sure-box-title">{t("ui_betting")}</div>
        <img
          className="pink-close"
          onClick={() => {
            betVisibleSet(false);
          }}
          src={require("../../../../assets/images/common/pink-close.png")}
        />
        <div style={{ marginTop: 10 }}>
          {t("fpdjs")}：{mTime(downTime)}
        </div>
        {name === "272" ? (
          <div className="bet-sure-box-list">
            {checkGame7.list.map((item, index) => (
              <div className="flex bet-sure-box-item" key={index}>
                <div className="flex bet-sure-box-item-left">{t(`feitingType${item.type_text}`)} </div>
                <div className="bet-sure-box-item-center">
                  <div>
                    {money} x {count}
                  </div>
                  <div>{item.name.join(item.split)}</div>
                </div>
                <div
                  className="cursor"
                  onClick={() => {
                    FtRef.current.handleSelectGameFt(item.type_text, item.type_show);
                  }}>
                  <img style={{ width: 16 }} src={require("../../../../assets/images/liveDetail/deal-icon.png")} alt="" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bet-sure-box-list">
            {arr.map((item, index) => (
              <div className="flex bet-sure-box-item" key={index}>
                <div className="flex bet-sure-box-item-left">{getValue(item)} </div>
                <div className="bet-sure-box-item-center">
                  <div>
                    {money} x {count}
                  </div>
                  <div>{t(lList[index].lang)}</div>
                </div>
                <div className="cursor" onClick={() => gameBetChoice(item)}>
                  <img style={{ width: 16 }} src={require("../../../../assets/images/liveDetail/deal-icon.png")} alt="" />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="line"></div>
        <div className="bei-list f-j-sb flex">
          {[1, 2, 5, 10, 20].map((item) => (
            <div key={item} onClick={() => countSet(item)} className={"bei-list-item cursor " + (count == item && "active baseBackground")}>
              {item}X
            </div>
          ))}
        </div>
        <div className="f-j-sb flex" style={{ marginTop: 10 }}>
          <div>
            {t("num")}： <span className="">{name === "272" ? checkGame7.list.length : arr.length}</span>
          </div>
          <div>
            {t("rp_bet_amount")}：<span className="">{name === "272" ? count * checkGame7.list.length * money : count * arr.length * money}</span>{" "}
          </div>
        </div>
        <div className="f-j-sb flex f-a-c" style={{ marginTop: 10 }}>
          <div>
            {t("rp_balance")}：{name === "272" ? <span className="">{scBanlance}</span> : <span className="">{userInfo && userInfo.goldCoin}</span>}
          </div>
          <div
            onClick={() => {
              if (name === "272") {
                FtRef.current.handleBet(count);
              } else bet(arr, lList);
            }}
            className={"bet-btn baseBackground " + (betLoading && "loading")}>
            {t("ui_betting")}
          </div>
        </div>
      </div>
    );
  };

  const getValue = (str) => {
    let arr = str.split(",");
    return (
      <>
        {arr.map((item, index) =>
          name == "yuxx" ? (
            <img src={iconData[item]} key={item + "-" + index} />
          ) : (
            <div key={item}>
              {index != 0 && ","}
              {isNaN(item) ? t(item) : item}
            </div>
          )
        )}
      </>
    );
  };
  return (
    <div className="game-detail-info flex" style={{ color: "#fff" }}>
      <img onClick={onClose} className="game-detail-info-close" src={require("../../../../assets/images/liveDetail/close-icon.png")} alt="" />
      <div className="game-detail-info-left">
        <div className="game-detail-info-left-game-info">
          <img src={gamePic} alt="" /> <span>{nickName}</span>
        </div>
        <div className="left-info">
          {/* 越南彩选择 */}
          {name === "223" && (
            <div className="actionSheel">
              {actionList.length > 0 && (
                <Dropdown
                  overlay={
                    <div className="disFlex">
                      <div className="actionList">
                        {actionList.map((val, key) => {
                          return (
                            <div
                              className="actionBox"
                              key={key}
                              onClick={() => {
                                actionIndexSet(key);
                              }}>
                              {val.methodName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  }>
                  <div className="actionSheelActive">
                    {actionList[actionIndex].methodName} <img src={require("../../../../assets/images/header/down-active.png")} alt="" />
                  </div>
                </Dropdown>
              )}
            </div>
          )}
          <div className="djs">{downTime > 0 ? mTime(downTime) : <DotLoading />}</div>
          <div className="djs-text">{t("fpdjs")}</div>
          <div className="sqkp">
            {t("sqkp")}
            <Popover color="rgba(51, 51, 51, .9)" trigger="click" content={getAllHistoryContent()} overlayInnerStyle={{ borderRadius: "8px" }}>
              <img
                onClick={() => {
                  getAllGameHistory(), getGameHistory();
                }}
                src={require("../../../../assets/images/liveDetail/tzjl-icon.png")}
                alt=""
              />
            </Popover>
          </div>
        </div>
        {getFirstHistoryContent()}
      </div>
      <div className="game-detail-info-center" id="game-detail-info-center">
        {/* {name} */}
        {name === "yncp30s" ? (
          <YnGame ref={YnRef} money={money} liveId={liveId} expect={expect} method={actionList} methodIndex={actionIndex} lotteryName={name} freshBalance={freshBalance} downTime={downTime} />
        ) : name === "272" ? (
          <FtGame ref={FtRef} issue={issuData} liveId={liveId} money={money} freshBalance={freshBalance} checkGame7={checkGame7} setCheckGame7={setCheckGame7} />
        ) : (
          <>
            <div className="game-detail-info-center-tab flex">
              {GameObj[name].map((item, index) => (
                <div className={"game-detail-info-center-tab-item " + (tabIndex == index && "active")} onClick={() => tabIndexSet(index)} key={index}>
                  {t(item.lang)}
                </div>
              ))}
            </div>
            <div className="game-detail-info-center-game-list flex">
              {GameObj[name][tabIndex] &&
                (name == "yuxx"
                  ? GameObj[name][tabIndex].data.map((item, index) => (
                      <div className="game-choice-box" onClick={() => gameBetChoice(item, GameObj[name][tabIndex])} key={index}>
                        {item.map((iitem, iindex) => (
                          <img className="icon" src={choiceList[item] ? iconActiveData[iitem] : iconData[iitem]} key={iindex} />
                        ))}
                        <div>{GameObj[name][tabIndex].value}</div>
                      </div>
                    ))
                  : GameObj[name][tabIndex].dataLang.map((item, index) => (
                      <div onClick={() => gameBetChoice(item, GameObj[name][tabIndex])} className="game-choice-box" key={index}>
                        <div className="flex">
                          {item.map((iitem, iindex) => (
                            <div className={"icon txt " + (choiceList[item] && "w-color baseBackground ")} key={iindex}>
                              {t(iitem)}
                            </div>
                          ))}
                        </div>
                        <div>{GameObj[name][tabIndex].valueList ? GameObj[name][tabIndex].valueList[index] : GameObj[name][tabIndex].value}</div>
                      </div>
                    )))}
            </div>
          </>
        )}
        <div className="game-detail-info-center-bet f-a-c flex f-j-sb">
          {["223", "272"].includes(name) ? (
            <div className="f-a-c flex">
              {t("gold_coins")}：{scBanlance}
              <div
                className="trans-btn"
                onClick={() => {
                  openBalanceSet(true);
                }}>
                {t("transTitle")}
              </div>
              <img src={require("../../../../assets/images/live/refresh.png")} alt="" className={`refreshBtn ${banlanceLoading ? "active" : ""}`} onClick={() => freshBalance()} />
            </div>
          ) : (
            <div className="f-a-c flex">
              {t("gold_coins")}：{userInfo && userInfo.goldCoin}
              <Link to="/user/deposit">
                <div className="bet-btn baseBackground">{t("ui_dep")}</div>
              </Link>
            </div>
          )}
          <div className="bet-btn-pi f-a-c flex">
            <Popover color="rgba(51, 51, 51, .9)" overlayInnerStyle={{ borderRadius: "8px" }} placement="top" trigger="click" content={getCoinChoiceContent()}>
              <div className="bet-num">
                {money} <img src={require("../../../../assets/images/liveDetail/jt-down-icon.png")} alt="" />
              </div>
            </Popover>
            {name === "223" ? (
              // 飞艇、越南投注按钮
              <div
                className="bet-btn baseBackground"
                onClick={() => {
                  YnRef.current.handleBet();
                }}
                style={{ marginLeft: 10 }}>
                {t("ui_betting")}
              </div>
            ) : (
              // 其他游戏投注按钮
              <Popover visible={betVisible} color="rgba(51, 51, 51, .9)" overlayInnerStyle={{ borderRadius: "8px" }} placement="top" content={getBetContent()}>
                <div className="bet-btn baseBackground" onClick={() => betVisibleSet(true)} style={{ marginLeft: 10 }}>
                  {t("ui_betting")}
                </div>
              </Popover>
            )}
          </div>
        </div>
      </div>

      {/* 越南30秒余额转账 */}
      <Mask
        visible={openBalance}
        getContainer={document.body}
        onMaskClick={() => {
          openBalanceSet(false);
        }}>
        <div className="balanceMask">
          <div className="balanceMask_title">{t("user_zz")}</div>
          <div className="balanceMask_content">
            <div className="balanceMask_box">
              <div className="balanceMask_price">{userInfo.goldCoin}</div>
              <div className="balanceMask_name">{t("zhuzhanghuyue")}</div>
              <Button className="balanceMask_btn" onClick={() => handleScOut(scBanlance)} loading="auto">
                {t("btn_one_click_recycling")}
              </Button>
            </div>
            <div className="balanceMask_box">
              <div className="balanceMask_price">{scBanlance}</div>
              <div className="balanceMask_name">{t("dangqianyouxiyue")}</div>
              <Button className="balanceMask_btn" onClick={() => handleScIn(userInfo.goldCoin)} loading="auto">
                {t("btn_one_click_recycling")}
              </Button>
            </div>
          </div>
        </div>
      </Mask>
    </div>
  );
};

export default forwardRef(GameDetail);
