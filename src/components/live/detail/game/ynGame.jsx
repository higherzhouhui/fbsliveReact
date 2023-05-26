import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import style from "./style/ynGame.module.scss";
import { nav6, game6Data, game6Type, round6Type } from "./js/gameData";
import { useTranslation } from "react-i18next";
import { Button, Mask } from "antd-mobile";
import { LotteryBet, LotteryResult } from "../../../../api/game";
import { message } from "antd";
import { getGlistr } from "../../../../wap/pages/newLive/components/gameBet/common";

let LotteryNum = React.lazy(() => import("../../../../wap/pages/newLive/components/gameBet/lotteryNum"));
let LotteryIcon = React.lazy(() => import("../../../../wap/pages/newLive/components/gameBet/lotteryIcon"));

const YnGame = (props, ref) => {
  const { money, expect, method, methodIndex, lotteryName, liveId, freshBalance, downTime } = props;
  const { t } = useTranslation();
  let [checkGame6, setCheckGame6] = useState({ list: [], list1: [], list2: [] });
  let [round6Text, round6TextSet] = useState([]);
  const [nav6Index, setNav6Index] = useState(0); // 30秒彩十位数
  let [sel6Arr, sel6ArrSet] = useState([0, 0]);
  let [roundIndex, roundIndexSet] = useState(0);
  let [btiPerIndex, setBtiPerIndex] = useState(0);
  let btiPer = [1, 2, 5, 10, 20]; //投注倍率
  const [showBet, showBetSet] = useState(false); //  展示投注框
  const [showGlist, showGlistSet] = useState(false);
  const [glist, glistSet] = useState([]);

  //数字单选
  const handleCheckGame6 = (item, key) => {
    let list = key === 0 ? checkGame6.list1 : key === 1 ? checkGame6.list2 : checkGame6.list;
    if (list.includes(item)) {
      list.splice(
        list.findIndex((ar) => ar === item),
        1
      );
    } else {
      list.push(item);
    }
    let c6 = { ...checkGame6 };
    if (key === 0) c6.list1 = list;
    else if (key === 1) c6.list2 = list;
    setCheckGame6(c6);
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
  // 投注数量
  const betCount = useMemo(() => {
    if (nav6Index === 0) return checkGame6.list.length;
    if (nav6Index === 1) return checkGame6.list1.length * checkGame6.list2.length;
    if (nav6Index === 2) return round6Text.length;
  }, [checkGame6]);
  // 普通号选择
  const playNumData = useMemo(() => {
    if (nav6Index === 0) return checkGame6.list.map((v) => v.value).join(",");
    if (nav6Index === 1) return `${checkGame6.list1.map((a) => a.value).join(",")}|${checkGame6.list2.map((a) => a.value).join(",")}`;
    if (nav6Index === 2) return round6Text.join(",");
  }, [checkGame6, round6Text]);

  //计算越南彩总金额
  const getType2An = useMemo(() => {
    if (nav6Index === 0) {
      return betCount * btiPer[btiPerIndex] * money;
    }
    if (nav6Index === 1) {
      return betCount * btiPer[btiPerIndex] * money;
    }
    if (nav6Index === 2) {
      return betCount * btiPer[btiPerIndex] * money;
    }
  }, [btiPer, btiPerIndex, money, betCount]);

  const handleBet = async () => {
    let playNum = [
      {
        money: money,
        notes: 1,
        num: playNumData,
        rebate: 0, //不变
        type: nav6[nav6Index].type,
        type_text: nav6[nav6Index].type_name,
      },
    ];
    let param = {
      betCount,
      isStop: 0,
      playNum,
      liveId: liveId,
      expect: [
        {
          expect: expect,
          isLHC: false,
          multiple: 1,
        },
      ],
      methodId: method[methodIndex].methodId,
      times: btiPer[btiPerIndex],
      lotteryName,
      isHemai: 0,
      betAmount: getType2An,
    };
    const res = await LotteryBet(param, "lottery");
    if (!(res instanceof Error)) {
      if (res) {
        message.info(t("betSuccess"));
        freshBalance();
        round6TextSet([]);
        setCheckGame6({ list: [], list1: [], list2: [] });
      }
    }
  };

  //抛出本地事件
  useImperativeHandle(ref, () => {
    return {
      handleBet: () => {
        showBetSet(true);
      },
    };
  });

  const gListData = useMemo(() => {
    return getGlistr(glist);
  }, [glist]);

  useEffect(() => {
    if (Number(downTime) === 0) {
      downResult();
    }
  }, [downTime]);

  const downResult = async () => {
    const res = await LotteryResult({ issue: expect, name: lotteryName });
    if (!(res instanceof Error)) {
      showGlistSet(true);
      glistSet(res);
      setTimeout(() => {
        showGlistSet(false);
      }, 7000);
    }
  };

  return (
    <div className={style.betGame}>
      {/* 上部tab */}
      <div className={style.disFlex}>
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
      </div>
      <div className={style.gameScroll}>
        {/* 快选 */}
        {nav6Index === 0 && (
          <div className={style.lottery} data-layout={20}>
            {game6Data[0].map((nums, key) => (
              <div key={`game6${key}`} className={`${checkGame6.list.includes(nums) ? style.active : ""} ${style.box}`} onClick={() => handleCheckGame6(nums)}>
                <div className={style.wrf}>{nums.name[0]}</div>
              </div>
            ))}
          </div>
        )}
        {/* 选数字 */}
        {nav6Index === 1 && (
          <>
            <div className={style.typeName}>Chuc</div>
            <div className={style.disFlex}>
              <div className={style.game6Type}>
                {game6Type.map((val, key) => {
                  return (
                    <div key={key} className={`${style.box} ${sel6Arr[0] === key ? style.active : ""}`} onClick={() => handelSelect6Type(key, 0)}>
                      {val.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`${style.lottery} ${style.sel6Num}`} data-layout={10}>
              {game6Data[1].map((nums, key) => (
                <div key={`game6${key}`} className={`${checkGame6.list1.includes(nums) ? style.active : ""} ${style.box}`} onClick={() => handleCheckGame6(nums, 0)}>
                  <div className={style.wrf}>{nums.name[0]}</div>
                </div>
              ))}
            </div>
            <div className={style.typeName}>位数或个位数</div>
            <div className={style.disFlex}>
              <div className={style.game6Type}>
                {game6Type.map((val, key) => {
                  return (
                    <div key={key} className={`${style.box} ${sel6Arr[1] === key ? style.active : ""}`} onClick={() => handelSelect6Type(key, 1)}>
                      {val.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`${style.lottery} ${style.sel6Num}`} data-layout={10}>
              {game6Data[1].map((nums, key) => (
                <div key={`game6${key}`} className={`${checkGame6.list2.includes(nums) ? style.active : ""} ${style.box}`} onClick={() => handleCheckGame6(nums, 1)}>
                  <div className={style.wrf}>{nums.name[0]}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* 输入数字 */}
        {nav6Index === 2 && (
          <div className={style.roundNumber}>
            <div className={style.roundTitle}>{t("caipiaozongleimingc")}</div>
            <div className={style.disFlex}>
              <div className={style.roundType}>
                {round6Type.map((val, key) => {
                  return (
                    <div
                      className={`${style.box} ${roundIndex === key ? style.active : ""}`}
                      key={key}
                      onClick={() => {
                        setFixedRound(val.value);
                        roundIndexSet(key);
                      }}>
                      {val.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <textarea className={style.roundContent} value={round6Text.join(",")} onInput={handleRoundText}></textarea>
          </div>
        )}
      </div>
      {/* 倍率 */}
      <div className={style.btiTitle}>下注分数</div>
      <div className={`${style.btiPer} ${style.outSetBtiPer}`}>
        {btiPer.map((num, index) => (
          <div className={`${style.box} ${btiPerIndex === index ? style.active : ""}`} key={`bp${num}`} onClick={() => setBtiPerIndex(index)}>
            X{num}
          </div>
        ))}
      </div>
      {/* 投注确认弹框 */}
      <Mask visible={showBet}>
        <div className={style.btiWindow}>
          <div className={style.btiWindow_title}>期{expect}</div>
          <div className={style.btiWindow_list}>
            <div className={style.btiWindow_box}>
              {" "}
              <div className={style.label}>普通号</div> <div className={style.value}>{playNumData}</div>
            </div>
            <div className={style.btiWindow_box}>
              {" "}
              <div className={style.label}>倍率</div> <div className={style.value}>{btiPer[btiPerIndex]}</div>
            </div>
            {/* <div className={style.btiWindow_box}> <div className={style.label}>总流水号</div> <div className={style.value}>0，1，2，3，4，5</div></div> */}
            <div className={style.btiWindow_box}>
              {" "}
              <div className={style.label}>总金额</div> <div className={style.value}>{getType2An}</div>
            </div>
            <Button className={style.btiWindow_btn} onClick={() => handleBet()}>
              投注
            </Button>
          </div>
          <div className="globalClose" onClick={() => showBetSet(false)}></div>
        </div>
      </Mask>

      {/* 越南彩结果动画弹窗 */}
      {/* showGlist */}
      {showGlist && (
        <div className={style.lotterResult}>
          {/* <div className={style.lotteryTitle}>{t('jieshu')}-{issue.expect}</div> */}
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
    </div>
  );
};

export default forwardRef(YnGame);
