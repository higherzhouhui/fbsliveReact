import { ActionSheet, Popup } from "antd-mobile";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BetHead from "./head";
import BetFooter from "./footer";
import useContextReducer from "../../../../state/useContextReducer";
import style from "../common.module.scss";
import { nav6, game6Data, game6Type, round6Type } from "./gameData";
import { useTranslation } from "react-i18next";
import { LotteryType, LotteryBetAllHis } from "../../../../server/live";
import { useNavigate } from "react-router";
import { getGlistr } from "./common";
import LotteryIcon from "./lotteryIcon";
import LotteryNum from "./lotteryNum";

const GameYncp30s = (props) => {
  const { t } = useTranslation();
  const history = useNavigate();
  const {
    state: {
      live: { liveIssue, RoomDownTime, RoomGameHistory },
    },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [nav6Index, setNav6Index] = useState(0);
  let [checkGame6, setCheckGame6] = useState({ list: [], list1: [], list2: [] });
  const [selectAction, selectActionSet] = useState([]);
  const [selectActionIndex, selectActionIndexSet] = useState(0);
  const [showSelect, showSelectSet] = useState(false); //越南类型选择
  const [sel6Arr, sel6ArrSet] = useState([0, 0]);
  let [round6Text, round6TextSet] = useState([]);
  const [showGlist, showGlistSet] = useState(false);
  const [glist, glistSet] = useState([]);
  const [expects, expectsSet] = useState('');
  const [RoomDownTimes, RoomDownTimesSet] = useState(false)
  const RoomDownTimesRef = useRef(false)
  const nav = [
    { name: t("rule"), icon: "gz", url: "" },
    { name: t("kaijiang"), icon: "kj", url: "" },
    { name: t("ui_dep"), icon: "cz", url: "" },
    // { name: '路单', icon: 'ld', url: '' },
  ];

  const onLoad = useCallback(() => {
    getLotteryType();
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const handleCheckGame6 = (item) => {
    let list = checkGame6.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    setCheckGame6({ list });
  };

  //获取彩票类型
  const getLotteryType = async () => {
    let res = await LotteryType();
    if (!(res instanceof Error)) {
      res = res.map((item, key) => {
        return Object.assign(item, { text: item?.methodName, key: item?.methodId, index: key });
      });
      let textArray = [
        { methodId: "2230003", type: "T", type_text: "头" },
        { methodId: "2230004", type: "W", type_text: "尾" },
        { methodId: "2230005", type: "TW", type_text: "头尾" },
        { methodId: "2230006", type: "BZ", type_text: "包组" },
        { methodId: "2230007", type: "BZ7", type_text: "包组7" },
      ];
      selectActionSet(() => _.merge(textArray, res));
    }
  };

  // 数字类型选择
  const handelSelect6Type = (key, index) => {
    let arr = { ...sel6Arr };
    arr[index] = key;
    sel6ArrSet(arr);
    let c6 = { ...checkGame6 };
    if (index === 0) c6.list1 = game6Data[1].filter((val) => game6Type[key].value.includes(val.value));
    else c6.list2 = c6.list2 = game6Data[1].filter((val) => game6Type[key].value.includes(val.value));
    setCheckGame6(c6);
  };

  //自定义数字
  const handleRoundText = (e) => {
    let textList = [...round6Text];
    let n = e.nativeEvent.data;
    let last = _.last(textList);
    //判断退格键
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      // 最后为两位数字时删除一位，否则去掉最后一个元素
      if (last.length > 1) {
        last = last.substr(0, 1);
        textList[textList.length - 1] = last;
      } else {
        textList = _.initial(textList);
      }
    } else {
      // 先判断是否为数字
      if (/[0-9]/.test(n)) {
        if (!last || last.length > 1) {
          textList.push(n);
        } else {
          textList[textList.length - 1] = last + n;
        }
      }
      //判断为逗号时，若最后一位为个位数字，其前面加上字符0
      if (/[\,]/.test(n)) {
        if (last.length == 1) {
          last = 0 + last;
          textList[textList.length - 1] = last;
        }
      }
    }
    round6TextSet(textList);
  };

  // 输入数字时自动生成固定位数随机数
  const setFixedRound = (len) => {
    let arr = [];
    for (let i = 0; i < len; i++) {
      let num = creatRound(arr);
      arr.push(num);
    }
    round6TextSet(arr);
  };

  //根据传入数组生成,非重复随机数字数组
  const creatRound = (arr) => {
    const checkNum = (num) => {
      if (arr.includes(num)) {
        num = (num + 1) % 100;
        return checkNum(num);
      } else return num;
    };
    return checkNum(Math.ceil(Math.random() * 99));
  };

  const gListData = useMemo(() => {
    return getGlistr(RoomGameHistory[0]?.lotteryResult || []);
  }, [RoomGameHistory]);

  useEffect(() => {
    console.log(RoomDownTime);
    if (RoomDownTime == 0 || RoomDownTime > 25) {
      // LotteryBetAllHisF();
      RoomDownTimesRef.current = true
    } else {
      RoomDownTimesRef.current = false
    }
  }, [RoomDownTime]);

  useEffect(() => {
    window.eventBus.addListener("showGlistK", showGlistK);
    window.eventBus.addListener("showGlistG", showGlistG);
    return () => {
      window.eventBus.removeListener("showGlistK", showGlistK);
      window.eventBus.removeListener("showGlistG", showGlistG);
    };
  }, [])
  const showGlistK = () => {
    if (RoomDownTimesRef.current) {
      showGlistSet(true)
    }
  }
  const showGlistG = () => {
    showGlistSet(false)
  }

  // const LotteryBetAllHisF = async () => {
  //   let res = await LotteryBetAllHis({ lotteryName: liveIssue.name, page: 0 });
  //   if (!(res instanceof Error)) {
  //     console.log('res--------', res[0].expect);
  //     expectsSet(res[0].expect)
  //     glistSet(res[0].lotteryResult);
  //     showGlistSet(true);
  //     setTimeout(() => {
  //       showGlistSet(false);
  //     }, 7000);
  //   }
  // };

  return (
    <>
      <Popup
        destroyOnClose
        visible={liveIssue.open && liveIssue.name === "yncp30s"}
        onMaskClick={() => {
          dispatch({ type: "live/SetIssueClose" });
        }}
        bodyClassName={style.liveRoomPopup}
        className={`${style.betGame} ylPositionBottom betGameZindex ${style.ynGame}`}>
        <BetHead
          nameEmpty
          selfRight={
            <div className={style.headRight}>
              <div className={style.left}>
                <div onClick={() => showSelectSet(true)} className={style.disFlex}>
                  {selectAction[selectActionIndex]?.text}
                  <img src={require("../../../../assets/image/live/lottery/down-jiantou.png")} alt="" className={style.licon} />
                </div>
                <ActionSheet
                  visible={showSelect}
                  actions={selectAction}
                  onClose={() => showSelectSet(false)}
                  onAction={(e) => {
                    selectActionIndexSet(e.index);
                    showSelectSet(false);
                  }}
                />
              </div>
              <div className={style.right}>
                {nav.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className={style.demo}
                      onClick={() => {
                        value.icon == "gz" && props.rulesSet(true);
                        value.icon == "kj" && window.eventBus.emit("showH5BetResult", liveIssue);
                        value.icon == "cz" && history("/recharge");
                      }}>
                      <img src={require(`../../../../assets/image/live/lottery/${value.icon}icon.png`)} alt="" />
                      <div>{value.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          }></BetHead>
        <div className={style.nav}>
          {nav6.map((item, index) => (
            <div
              className={`${style.box} ${nav6Index === index ? style.active : ""}`}
              key={item.name}
              onClick={() => {
                setNav6Index(index);
                setCheckGame6({ list: [], list1: [], list2: [] });
              }}>
              {item.name}
            </div>
          ))}
        </div>
        {/* 快选 */}
        {nav6Index === 0 && (
          <div className={`${style.lottery} ${style.alignContentNone}`} data-layout={10}>
            {game6Data[0].map((nums, key) => (
              <div key={`game6${key}`} className={`${checkGame6.list.includes(nums) ? style.active : ""} ${style.box3}`} onClick={() => handleCheckGame6(nums)}>
                <div className={style.wrf}>{nums.name[0] <= 9 ? `0${nums.name[0]}` : nums.name[0]}</div>
              </div>
            ))}
          </div>
        )}
        {/* 选数字 */}
        {nav6Index === 1 && (
          <>
            <div className={style.top_s}>
              <div>{t("Betnav4Title3")}</div>
            </div>
            <div style={{ padding: "0 12px" }}>
              <div style={{ background: "#474747", borderRadius: "0 0 4px 4px" }}>
                <div className={style.game6Type}>
                  {game6Type.map((val, key) => {
                    return (
                      <div key={key} className={`${style.box} ${sel6Arr[0] === key ? style.active : ""}`} onClick={() => handelSelect6Type(key, 0)}>
                        {val.name}
                      </div>
                    );
                  })}
                </div>
                <div className={`${style.lottery} ${style.sel6Num}`} data-layout={10}>
                  {game6Data[1].map((nums, key) => (
                    <div key={`game6${key}`} className={`${checkGame6.list1?.includes(nums) ? style.active : ""} ${style.box3}`} onClick={() => handleCheckGame6(nums, 0)}>
                      <div className={style.wrf}>{nums.name[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={style.top_s} style={{ marginTop: "8px" }}>
              <div>{t("Betnav4Title1")}</div>
            </div>
            <div style={{ padding: " 0 12px" }}>
              <div style={{ background: "#474747", borderRadius: "0 0 4px 4px" }}>
                <div className={style.game6Type}>
                  {game6Type.map((val, key) => {
                    return (
                      <div key={key} className={`${style.box} ${sel6Arr[1] === key ? style.active : ""}`} onClick={() => handelSelect6Type(key, 1)}>
                        {val.name}
                      </div>
                    );
                  })}
                </div>
                <div className={`${style.lottery} ${style.sel6Num}`} data-layout={10}>
                  {game6Data[1].map((nums, key) => (
                    <div key={`game6${key}`} className={`${checkGame6.list2?.includes(nums) ? style.active : ""} ${style.box3}`} onClick={() => handleCheckGame6(nums, 1)}>
                      <div className={style.wrf}>{nums.name[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {nav6Index === 2 && (
          <div className={style.roundNumber}>
            <div style={{ background: "#474747", borderRadius: "4px" }}>
              <div className={style.top_s2}>{t("caipiaozongleimingc")}</div>
              <div className={style.roundType}>
                {round6Type.map((val, key) => {
                  return (
                    <div className={style.box} key={key} onClick={() => setFixedRound(val.value)}>
                      {val.name}
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "8px", position: "relative" }}>
                <textarea className={style.roundContent} value={round6Text.join(",")} onInput={handleRoundText}></textarea>

                <div
                  onClick={() => setFixedRound(0)}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "17px",
                    background: "#737373",
                    borderRadius: "4px",
                    border: "1px solid #C7C7C7",
                    padding: "5px 16px",
                    color: "#fff",
                  }}>
                  {t("delete")}
                </div>
              </div>
            </div>
          </div>
        )}
        <BetFooter btiData={checkGame6.list} setCheckData={(list) => setCheckGame6({ list })} sType={2} lotteryInfo={nav6[nav6Index]} lotteryType2={checkGame6} lotteryType3={round6Text} method={selectAction[selectActionIndex]} />
      </Popup>

      <Popup
        visible={showGlist}
        bodyClassName={`${style.liveRoomPopup} ${style.transPop}`}
        className={`${style.betGame} ylPositionBottom`}
        onMaskClick={() => {
          showGlistSet(false);
        }}
        style={{ "--z-index": "1002" }}
        mask={false}>
        {showGlist && (
          <div className={style.lotterResult}>
            <div className={style.lotteryTitle}>
              {t("jieshu")}-{RoomGameHistory[0]?.expect}
            </div>
            <div className={style.lotterList}>
              {gListData.map((val, key) => {
                return (
                  <div className={style.lotteryRow} data-lay={val.value.length} key={`l-${key}`}>
                    <div className={style.box}>
                      <LotteryIcon type={val.name === "DB" ? "red" : ""}>{val.name}</LotteryIcon>
                      {val.value.map((va, ke) => {
                        return (
                          <LotteryNum key={`lb-${ke}`} className={`${style.span} ${val.name === "DB" ? "dbNum" : ""}`} index={key + 1}>
                            {va}
                          </LotteryNum>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Popup>
    </>
  );
};

export default GameYncp30s;
