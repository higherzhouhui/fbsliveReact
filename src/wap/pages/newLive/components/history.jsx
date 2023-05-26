import { InfiniteScroll, Popup, Tabs } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetBtiList, GetHisList, LotteryBetAllHis, getBetHistorByUidAndName } from "../../../server/live";
import style from "./common.module.scss";
import game1Icon1 from "../../../assets/image/live/fllu.png";
import game1Icon2 from "../../../assets/image/live/flxie.png";
import game1Icon3 from "../../../assets/image/live/frji.png";
import game1Icon4 from "../../../assets/image/live/frfish.png";
import game1Icon5 from "../../../assets/image/live/flpangxie.png";
import game1Icon6 from "../../../assets/image/live/flxia.png";
import game2Icon1 from "../../../assets/image/live/dot01.png";
import game2Icon2 from "../../../assets/image/live/dot02.png";
import game2Icon3 from "../../../assets/image/live/dot03.png";
import game2Icon4 from "../../../assets/image/live/dot04.png";
import game2Icon5 from "../../../assets/image/live/dot05.png";
import game2Icon6 from "../../../assets/image/live/dot06.png";
import noOpenIcon from "../../../assets/image/live/no-open-icon.png";

import winIcon from "../../../assets/image/live/win-icon.png";
import loseIcon from "../../../assets/image/live/lose-icon.png";
import { freeTime } from "../../../util/tool";
import _ from "lodash";
import useContextReducer from "../../../state/useContextReducer";
import { RightOutline } from "antd-mobile-icons";
import { getGlistr } from "./gameBet/common";

const Ball = React.lazy(() => import("./gameBet/ball"));

export default function History() {
  //中奖结果图标
  const lotterResultIconList = [{ icon: noOpenIcon }, { icon: loseIcon }, { icon: winIcon }];
  // yuxx图标库
  const game1IconList = [{ icon: game1Icon1 }, { icon: game1Icon2 }, { icon: game1Icon3 }, { icon: game1Icon4 }, { icon: game1Icon5 }, { icon: game1Icon6 }];
  // jsks图标库
  const game2IconList = [{ icon: game2Icon1 }, { icon: game2Icon2 }, { icon: game2Icon3 }, { icon: game2Icon4 }, { icon: game2Icon5 }, { icon: game2Icon6 }];
  // race1m 赛车 图标库

  const getGame1Icon = (index) => {
    return game1IconList[index - 1] ? game1IconList[index - 1].icon : "";
  };
  const getGame2Icon = (index) => {
    return game2IconList[index - 1] ? game2IconList[index - 1].icon : "";
  };
  const { t } = useTranslation();
  const [showTab1, setShowTab1] = useState(false);
  const [tabKey, setTabKey] = useState("his");

  const [tabKey2, setTabKey2] = useState("his");

  const [showTab2, setShowTab2] = useState(false); //直播间开起投注记录弹窗

  //开奖记录
  const [hisList, setHisList] = useState([]);

  //历史投注记录
  const [betList, setBetList] = useState([]);
  const [betPage, setBetPage] = useState(0);

  const [showDetail1, setShowDetail1] = useState(false);
  const [detail1, setDetail1] = useState([]);
  const [showDetail2, setShowDetail2] = useState(false);
  const [detail2, setDetail2] = useState({ playNumReq: {}, resultList: [] });
  const [liveIssue, setIssue] = useState({});
  const [Starts, StartsSet] = useState(false);
  const {
    state: {
      user,
      live: { liveIssue: LIsu, verticalScreen },
    },
  } = useContextReducer.useContextReducer();

  const showH5BetResult = (e) => {
    setIssue(e ? e : LIsu);
    setTabKey2("his");
    getHis(11, { lotteryName: LIsu.name });
  };
  useEffect(() => {
    window.eventBus.addListener("showH5BetResult", showH5BetResult);
    return () => {
      window.eventBus.removeListener("showH5BetResult", showH5BetResult);
    };
  });
  useEffect(() => {
    setBetPage(0);
    setBetList([]);
    setHasMore(true);
  }, [tabKey]);

  useEffect(() => {
    if (showTab2) {
      setBetPage(0);
      setBetList([]);
      setHasMore(true);
      tabKey2 === "his" && getInitList2();
    }
  }, [tabKey2]);

  useEffect(() => {
    // 监听第一次进入时候
    setBetPage(0);
    if (showTab1) getInitList(0);
  }, [showTab1]);

  useEffect(() => {
    // 监听第一次进入时候
    setBetPage(0);
    // if (showTab2) getInitList2(0);
  }, [showTab2]);

  const [hasMore, setHasMore] = useState(true);
  const getInitList = async (page) => {
    // debugger
    switch (tabKey) {
      case "his":
        const res = await GetHisList();
        if (!(res instanceof Error)) {
          setHisList(res);
        }
        break;
      case "bet":
        if (page === 0) {
          setBetList([]);
          setHasMore(true);
        }
        const res2 = await GetBtiList({ uid: user.uid, page: page === 0 ? 0 : betPage });
        if (!(res2 instanceof Error)) {
          if (res2.length > 0) {
            let arr = _.concat(betList, res2);
            setBetList(arr);
            setBetPage(betPage + 1);
          } else {
            setHasMore(false);
          }
        }
        break;
    }
  };
  // 直播间 投注记录
  const getInitList2 = async (page) => {
    // debugger
    switch (tabKey2) {
      case "his":
        getHis(11, { lotteryName: liveIssue.name });
        break;
      case "bet":
        if (page === 0) {
          setBetList([]);
          setHasMore(true);
        }
        const res2 = await getBetHistorByUidAndName({
          uid: user.uid,
          page: page === 0 ? 0 : betPage,
          lotteryName: liveIssue.name,
        });
        if (!(res2 instanceof Error)) {
          if (res2.length > 0) {
            let arr = _.concat(betList, res2);
            setBetList(arr);
            setBetPage(betPage + 1);
          } else {
            setHasMore(false);
          }
        }
        break;
    }
  };

  const hisListBody = () => {
    return (
      <div className={style.myHisBody}>
        <div className={style["list-gift"]}>
          {hisList.map((item, index) => {
            return (
              <div className={style.list} key={index} onClick={() => getHis(1, item)}>
                <dt className={`${style.lname} ${item.lotteryName == 223 || item.lotteryName == "yncp30s" ? style.btLname : ""}`}>
                  {/* 判断left展示 */}
                  {/* {item.nickName} */}
                  {item.nickName}
                  <span> {item.expect}</span>
                </dt>
                {item.lotteryName === "yuxx" ? (
                  <dd className={style.disDD}>
                    {item.lotteryResult.map((val, key) => {
                      return (
                        <i key={`yuxx${key}`}>
                          <img src={getGame1Icon(val)} />
                        </i>
                      );
                    })}
                  </dd>
                ) : item.lotteryName === "jsks" || item.lotteryName === "jsks5" || item.lotteryName === "tz" ? (
                  <dd className={style.disDD}>
                    {item.lotteryResult.map((val, key) => {
                      return (
                        <i className={style.jsks} key={`jsks${key}`}>
                          <img src={getGame2Icon(val)} />
                        </i>
                      );
                    })}
                  </dd>
                ) : item.lotteryName === "yflhc" ? (
                  <dd className={style.disDD}>
                    {item.lotteryResult
                      .filter((v, i) => i < 6)
                      .map((val, key) => {
                        return (
                          <i key={`yflhc${key}`} className={style.redCard}>
                            {val}
                          </i>
                        );
                      })}
                    +{item.lotteryResult[7] == 2 ? <i className={style.greenCard}>{item.lotteryResult[6]}</i> : item.lotteryResult[7] == 3 ? <i className={style.blueCard}>{item.lotteryResult[6]}</i> : <i>{item.lotteryResult[6]}</i>}
                  </dd>
                ) : // 临时添加判断223
                  item.lotteryName == "223" || item.lotteryName == "yncp30s" ? (
                    <dd className={style.disDD2}>
                      {getGlistr(item.lotteryResult)
                        .filter((a, v) => v < 3)
                        .map((val, key) => {
                          return (
                            <div className={style.disDD2_div} key={key}>
                              <img src={require(`../../../assets/image/sclog/${val.name.toLowerCase()}.png`)} alt="" /> <span className={val.name === "DB" ? style.colorRed : ""}>{val.value.join(" ")}</span>
                            </div>
                          );
                        })}
                      {/* ${style.disDD3} */}
                    </dd>
                  ) : item.lotteryName == "272" ? (
                    <dd className={`${style.disDD} `}>
                      {item.lotteryResult.map((val, key) => {
                        return <i key={`other${key}`}>{val}</i>;
                      })}
                    </dd>
                  ) : item.lotteryName == "ft" ? (
                    <div style={{ display: "flex", marginTop: "10px" }}>
                      <Ball list={item.lotteryResult} />
                    </div>
                  ) : item.lotteryName == "race1m" ? (
                    <dd className={style.race1m}>
                      {item.lotteryResult.map((val, key) => {
                        // return <i className={style[`color_${key}`]} key={`other${key}`}>{val}</i>
                        // { gameRace1m(val)}
                        // gameRace1m(val)
                        return <img src={require(`../../../assets/image/newRankingList/day${val}.png`)} key={`other${key}`}></img>;
                      })}
                    </dd>
                  ) : (
                    <dd className={style.disDD}>
                      {item.lotteryResult.map((val, key) => {
                        return <i key={`other${key}`}>{val}</i>;
                      })}
                    </dd>
                  )}
                {item.lotteryName == "223" || item.lotteryName == "yncp30s" ? <img src={require("../../../assets/image/sclog/bh.png")} className={style.rightImgs} /> : <RightOutline className={style.rightIcon} fontSize={10} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const betListBody = () => {
    async function loadMore() {
      return getInitList();
    }
    return (
      <>
        <div className={style.myHisBody}>
          <div className={style["list-body"]}>
            {betList.map((item, index) => (
              <div className={style.list} key={`bet${index}`} onClick={() => getHis(2, item)}>
                <div className={style.myHisTop}>
                  <dd>{item.nickName}</dd>
                  <dt>{freeTime(item.createTime, "y-m-d h:i")}</dt>
                </div>
                <div className={style.myHisTop2}>
                  <img src={lotterResultIconList[item.awardStatus]?.icon} alt="" />
                  <span>{t("bet")}</span>
                  <span className={style.num}>{item.betAmount}</span>
                </div>
              </div>
            ))}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
          </div>
        </div>
      </>
    );
  };
  // 直播间开奖投注记录
  const betListBody2 = () => {
    async function loadMore() {
      return getInitList2();
    }
    return (
      <>
        <div className={`${style.myHisBody} ${style.myHisBody2}`}>
          <div className={style["list-body"]}>
            {betList.map((item, index) => (
              <div className={style.list} key={`bet${index}`} onClick={() => getHis(2, item)}>
                <div className={style.myHisTop}>
                  <dd>{item.nickName}</dd>
                  <dt>{freeTime(item.createTime, "y-m-d h:i")}</dt>
                </div>
                <div className={style.myHisTop2}>
                  <img src={lotterResultIconList[item.awardStatus]?.icon} alt="" />
                  <span>{t("bet")}</span>
                  <span className={style.num}>{item.betAmount}</span>
                </div>
              </div>
            ))}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
          </div>
        </div>
      </>
    );
  };

  const getHis = async (type, item) => {
    if (!item.lotteryName) return;
    else {
      setIssue(item);
    }
    if (type === 11) {
      const res = await LotteryBetAllHis({ lotteryName: item.lotteryName, page: 0 });
      if (!(res instanceof Error)) {
        setDetail1(res);
        setShowTab2(true);
      }
    } else if (type === 1) {
      const res = await LotteryBetAllHis({ lotteryName: item.lotteryName, page: 0 });
      if (!(res instanceof Error)) {
        setDetail1(res);
        setShowDetail1(true);
      }
    } else if (type === 22) {
      const res = await LotteryBetAllHis({ lotteryName: item.lotteryName, page: 0 });
      if (!(res instanceof Error)) {
        setDetail1(res);
      }
    } else {
      setDetail2(item);
      setShowDetail1(false);
      setShowDetail2(true);
    }
  };

  // 越南彩30秒详情定位
  // 开奖详细
  const detail1Body = () => {
    const Start = (e, t) => {
      let data = [...detail1];
      data.forEach((item) => {
        // 添加个Select字段判断是否展开
        if (item.id == e.id) {
          item.Select = !t;
        } else {
          item.Select = false;
        }
      });
      setDetail1(data);
    };

    return (
      <div className={style.windowBottom}>
        <div className={style.title}>{liveIssue.nickName}</div>
        {detail1.map((item) => {
          if (liveIssue.lotteryName && !liveIssue.name) liveIssue.name = liveIssue.lotteryName;
          return (
            // 临时判断233
            liveIssue.name === "223" || liveIssue.name == "yncp30s" ? (
              <div className={style.recordBordy} key={item.id}>
                <div className={style.recordBordy_bottom}>
                  <div className={style.recordBordy_title}>
                    {item.expect}{" "}
                    {
                      <img
                        src={item.Select != undefined && item.Select == true ? require("../../../assets/image/sclog/zk.png") : require("../../../assets/image/sclog/bh.png")}
                        alt=""
                        onClick={() => {
                          Start(item, item.Select);
                        }}
                      />
                    }
                    {/* <img src={require('../../../assets/image/sclog/zk.png')} alt="" /> */}
                  </div>
                  <div className={style.recordBordy_content}>
                    {getGlistr(item.lotteryResult)
                      .filter((a, v) => v < 3)
                      .map((val, key) => {
                        return (
                          <div className={style.disDD2_div} key={key}>
                            <img src={require(`../../../assets/image/sclog/${val.name.toLowerCase()}.png`)} alt="" /> <span className={val.name === "DB" ? style.colorRed : ""}>{val.value.join(" ")}</span>
                          </div>
                        );
                      })}
                  </div>
                  <div className={style.recordBordy_detailed} style={{ height: `${item.Select != undefined && item.Select == true ? "auto" : "0"}`, overflow: "hidden" }}>
                    {getGlistr(item.lotteryResult)
                      .filter((a, v) => v > 2)
                      .map((val) => {
                        return (
                          <div className={style.disDD2_div2}>
                            <img src={require(`../../../assets/image/sclog/${val.name.toLowerCase()}.png`)} alt="" />
                            <div className={style.size}>
                              {val.value.map((va, le) => {
                                return <span key={le}>{va}</span>;
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div className={style.box} key={item.id}>
                {item.expect}
                {liveIssue.name === "yuxx" ? (
                  <span>
                    {item.lotteryResult.map((val, key) => (
                      <img src={getGame1Icon(val)} key={`yuxxd1${key}`} />
                    ))}
                  </span>
                ) : liveIssue.name === "jsks" || liveIssue.name === "jsks5" || liveIssue.name === "tz" ? (
                  <span>
                    {item.lotteryResult.map((val, key) => (
                      <img src={getGame2Icon(val)} key={`jsksd1${key}`} />
                    ))}
                  </span>
                ) : liveIssue.name === "yflhc" ? (
                  <span>
                    {item.lotteryResult
                      .filter((v, i) => i < 6)
                      .map((val, key) => (
                        <i key={`yflhcd1${key}`} className={style.redCard}>
                          {val}
                        </i>
                      ))}
                    +{item.lotteryResult[7] == 2 ? <i className={style.greenCard}>{item.lotteryResult[6]}</i> : item.lotteryResult[7] == 3 ? <i className={style.blueCard}>{item.lotteryResult[6]}</i> : <i>{item.lotteryResult[6]}</i>}
                  </span>
                ) : liveIssue.name === "ft" ? (
                  <div style={{ display: "flex" }}>
                    <Ball list={item.lotteryResult} />
                  </div>
                ) : liveIssue.name === "race1m" ? (
                  <div className={style.race1m}>
                    {/* {item.lotteryResult.map((val, key) => <i className={style[`color_${key}`]} key={`otherd1${key}`}>{val}</i>)} */}
                    {item.lotteryResult.map((val, key) => (
                      <img src={require(`../../../assets/image/newRankingList/day${val}.png`)} style={{ width: "28px", height: "28px", margin: "0px 5px 0 0" }} key={`otherd1${key}`}></img>
                    ))}
                  </div>
                ) : (
                  <span>
                    {item.lotteryResult.map((val, key) => (
                      <i key={`otherd1${key}`}>{val}</i>
                    ))}
                  </span>
                )}
              </div>
            )
          );
        })}
      </div>
    );
  };
  // 开奖详细
  const detail1Body2 = () => {
    const Start = (e, t) => {
      let data = [...detail1];
      data.forEach((item) => {
        // 添加个Select字段判断是否展开
        if (item.id == e.id) {
          item.Select = !t;
        } else {
          item.Select = false;
        }
      });
      setDetail1(data);
    };

    return (
      <div className={`${style.windowBottom} ${style.windowBottom2}`}>
        {/* <div className={style.title}>{liveIssue.nickName}</div> */}
        {detail1.map((item, indexs) => {
          return (
            // 临时判断233
            liveIssue.name === "223" || liveIssue.name == "yncp30s" ? (
              <div className={style.recordBordy} key={item.id}>
                <div className={style.recordBordy_bottom}>
                  <div className={style.recordBordy_title}>
                    {item.expect}{" "}
                    {
                      <img
                        src={item.Select != undefined && item.Select == true ? require("../../../assets/image/sclog/zk.png") : require("../../../assets/image/sclog/bh.png")}
                        alt=""
                        onClick={() => {
                          Start(item, item.Select);
                        }}
                      />
                    }
                    {/* <img src={require('../../../assets/image/sclog/zk.png')} alt="" /> */}
                  </div>
                  <div className={style.recordBordy_content}>
                    {getGlistr(item.lotteryResult)
                      .filter((a, v) => v < 3)
                      .map((val, key) => {
                        return (
                          <div className={style.disDD2_div} key={key}>
                            <img src={require(`../../../assets/image/sclog/${val.name.toLowerCase()}.png`)} alt="" /> <span className={val.name === "DB" ? style.colorRed : ""}>{val.value.join(" ")}</span>
                          </div>
                        );
                      })}
                  </div>
                  <div className={style.recordBordy_detailed} style={{ height: `${item.Select != undefined && item.Select == true ? "auto" : "0"}`, overflow: "hidden" }}>
                    {getGlistr(item.lotteryResult)
                      .filter((a, v) => v > 2)
                      .map((val) => {
                        return (
                          <div className={style.disDD2_div2}>
                            <img src={require(`../../../assets/image/sclog/${val.name.toLowerCase()}.png`)} alt="" />
                            <div className={style.size}>
                              {val.value.map((va, le) => {
                                return <span key={le}>{va}</span>;
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div className={`${style.box} ${detail1?.length - 1 != indexs ? style.box2 : ""}`} key={item.id}>
                {item.expect}
                {liveIssue.name === "yuxx" ? (
                  <span>
                    {item.lotteryResult.map((val, key) => (
                      <img src={getGame1Icon(val)} key={`yuxxd1${key}`} />
                    ))}
                  </span>
                ) : liveIssue.name === "jsks" || liveIssue.name === "jsks5" || liveIssue.name === "tz" ? (
                  <span>
                    {item.lotteryResult.map((val, key) => (
                      <img src={getGame2Icon(val)} key={`jsksd1${key}`} />
                    ))}
                  </span>
                ) : liveIssue.name === "yflhc" ? (
                  <span>
                    {item.lotteryResult
                      .filter((v, i) => i < 6)
                      .map((val, key) => (
                        <i key={`yflhcd1${key}`} className={style.redCard}>
                          {val}
                        </i>
                      ))}
                    +{item.lotteryResult[7] == 2 ? <i className={style.greenCard}>{item.lotteryResult[6]}</i> : item.lotteryResult[7] == 3 ? <i className={style.blueCard}>{item.lotteryResult[6]}</i> : <i>{item.lotteryResult[6]}</i>}
                  </span>
                ) : liveIssue.name === "ft" ? (
                  <div style={{ display: "flex" }}>
                    <Ball list={item.lotteryResult} />
                  </div>
                ) : liveIssue.name === "race1m" ? (
                  <div className={style.race1m}>
                    {item.lotteryResult.map((val, key) => (
                      <img style={{ width: "28px", height: "28px" }} src={require(`../../../assets/image/newRankingList/day${val}.png`)} key={`otherd1${key}`} />
                    ))}
                  </div>
                ) : (
                  <span>
                    {item.lotteryResult.map((val, key) => (
                      <i key={`otherd1${key}`}>{val}</i>
                    ))}
                  </span>
                )}
              </div>
            )
          );
        })}
      </div>
    );
  };
  //投注详细
  const detail2Body = () => {
    return (
      <div className={`${style.windowBottom} ${style.windowBottom3} ${style.detail2BodyStyle}`}>
        {/* 投注详情顶部 */}
        <div className={style.detail2BodyStyle_title}>
          <img
            src={require("../../../assets/image/kf/left.png")}
            alt=""
            onClick={() => {
              setShowDetail2(false), StartsSet(false);
            }}
          />
          <div>{t("touzhuxiangqing")}</div>
        </div>
        <div className={style.detail2BodyStyle_title_icons}>
          <img src={detail2?.icon} alt="" />
          <div>{detail2.nickName}</div>
          <div className={style.detail2BodyStyle_q}>{detail2.playNumReq?.expect || detail2.expect}</div>
        </div>
        <div className={style[("glist-body", "glist-body2")]}>
          <div className={style["glist-box"]}>
            <div className={style.glist}>
              <div className={style.label}>{t("rp_bet_amount")}:</div>
              <div className={style.content}>{detail2.betAmount}</div>
            </div>
            <div className={style.glist}>
              <div className={style.label}>{t("beishu")}:</div>
              <div className={style.content}>{detail2.times}</div>
            </div>
            <div className={style.glist}>
              <div className={style.label}>{t("xzsj")}:</div>
              <div className={style.content}>{freeTime(detail2.createTime, "h:i d-m-y")}</div>
            </div>
            <div className={style.glist}>
              <div className={style.label}>{t("xzxq")}:</div>
              <div className={style.content}>{detail2.playNumReq.num}</div>
            </div>
            <div className={style.glist}>
              <div className={style.label}>{t("ui_win_amount_colon")}</div>
              <div className={style.content}>{detail2.realProfitAmount || 0}</div>
            </div>

            <div className={style.glist}>
              <div className={style.label}>{t("pjfs")}:</div>
              <div className={style.content}>{detail2.payMethd == 0 ? t("weipaijiang") : detail2.payMethd == 1 ? t("zidongpaijiang") : t("buchongpaijiang")}</div>
            </div>
            <div className={style.glist}>
              <div className={style.label}>{t("ui_time_amount")}:</div>
              <div className={style.content}>{detail2.updateTime != null ? freeTime(detail2.updateTime, "h:i d-m-y") : ""}</div>
            </div>
          </div>
          <div className={style["glist-box"]}>
            <div className={`${style.glist} ${style.glist2} ${detail2.lotteryName == "yncp30s" ? style.glist3 : ""}`}>
              {detail2.lotteryName != "yncp30s" && <div className={style.label}>{t("ui_result_colon")}</div>}
              {(detail2.resultList || detail2.lotteryName === "ft") && (
                <div className={style.content}>
                  {detail2.lotteryName === "yuxx" ? (
                    <span>
                      {detail2.resultList.map((val, key) => (
                        <img src={getGame1Icon(val)} key={`yuxxd2${key}`} />
                      ))}
                    </span>
                  ) : detail2.lotteryName === "jsks" || detail2.lotteryName === "jsks5" || detail2.lotteryName === "tz" ? (
                    <span>
                      {detail2.resultList.map((val, key) => (
                        <img src={getGame2Icon(val)} key={`jsksd2${key}`} />
                      ))}
                    </span>
                  ) : detail2.lotteryName === "yflhc" ? (
                    <span>
                      {detail2.resultList
                        .filter((v, i) => i < 6)
                        .map((val, key) => (
                          <i key={`yflhcd2${key}`} className={style.redCard}>
                            {val}
                          </i>
                        ))}
                      +{detail2.resultList[7] == 2 ? <i className={style.greenCard}>{detail2.resultList[6]}</i> : detail2.resultList[7] == 3 ? <i className={style.blueCard}>{detail2.resultList[6]}</i> : <i>{detail2.resultList[6]}</i>}
                    </span>
                  ) : detail2.lotteryName === "223" || detail2.lotteryName == "yncp30s" ? (
                    // YnLottery(detail2)

                    <div className={style.recordBordy2}>
                      <div className={style.recordBordy_bottom}>
                        <div className={style.recordBordy_title}>
                          {/* {detail2.expect}{" "} */}
                          <div className={style.label}>{t("ui_result_colon")}</div>
                          {
                            <img
                              src={Starts != undefined && Starts == true ? require("../../../assets/image/sclog/zk.png") : require("../../../assets/image/sclog/bh.png")}
                              alt=""
                              onClick={() => {
                                // Start(detail2, detail2.Select);
                                StartsSet(!Starts);
                              }}
                            />
                          }
                          {/* <img src={require('../../../assets/image/sclog/zk.png')} alt="" /> */}
                        </div>
                        <div className={style.recordBordy_content}>
                          {getGlistr(detail2.resultList)
                            .filter((a, v) => v < 3)
                            .map((val, key) => {
                              return (
                                <div className={style.disDD2_div} key={key}>
                                  <img src={require(`../../../assets/image/sclog/${val.name.toLowerCase()}.png`)} alt="" /> <span className={val.name === "DB" ? style.colorRed : ""}>{val.value.join(" ")}</span>
                                </div>
                              );
                            })}
                        </div>
                        <div className={style.recordBordy_detailed} style={{ height: `${Starts != undefined && Starts == true ? "auto" : "0"}`, overflow: "hidden" }}>
                          {getGlistr(detail2.resultList)
                            .filter((a, v) => v > 2)
                            .map((val) => {
                              return (
                                <div className={style.disDD2_div2}>
                                  <img src={require(`../../../assets/image/sclog/${val.name.toLowerCase()}.png`)} alt="" />
                                  <div className={style.size}>
                                    {val.value.map((va, le) => {
                                      return <span key={le}>{va}</span>;
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div></div>
                      </div>
                    </div>
                  ) : detail2.lotteryName === "ft" ? (
                    <div style={{ display: "flex" }}>
                      <Ball list={detail2.resultList} />
                    </div>
                  ) : detail2.lotteryName === "race1m" ? (
                    <div>
                      {/* {item.lotteryResult.map((val, key) => <i className={style[`color_${key}`]} key={`otherd1${key}`}>{val}</i>)} */}
                      {detail2.resultList.map((val, key) => (
                        <img src={require(`../../../assets/image/newRankingList/day${val}.png`)} style={{ width: "28px", height: "28px" }} key={`otherd1${key}`}></img>
                      ))}
                    </div>
                  ) : (
                    <span>
                      {detail2.resultList.map((val, key) => (
                        <i key={`otherd2${key}`}>{val}</i>
                      ))}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={style.resultIcon}>
          <img src={lotterResultIconList[detail2.awardStatus]?.icon} alt="" />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`${style.right_img} ${!verticalScreen.verticalScreens ? style.right_img_h : ''}`}>
        <img src={require("../../../assets/image/live/xzb/lssj.png")} alt="" onClick={() => setShowTab1(true)} />
      </div>
      {/* 右侧边栏 点击统计弹窗 */}
      <Popup
        visible={showTab1}
        onMaskClick={() => {
          setBetPage(0);
          setShowTab1(false);
          setBetList([]);
          setHasMore(true);
        }}
        position="bottom"
        bodyClassName={style.windowBottom}>
        <img
          src={require("../../../assets/image/kf/left.png")}
          alt=""
          onClick={() => {
            setBetPage(0);
            setShowTab1(false);
            setBetList([]);
            setHasMore(true);
          }}
          className={style.imgs_left}
        />
        <Tabs onChange={setTabKey} className={`zdyTab`}>
          <Tabs.Tab title={t("kjjl")} key="his">
            {hisListBody()}
          </Tabs.Tab>
          <Tabs.Tab title={t("ui_bet_record")} key="bet">
            {betListBody()}
          </Tabs.Tab>
        </Tabs>
      </Popup>
      <Popup
        visible={showDetail1}
        onMaskClick={() => {
          setShowDetail1(false);
        }}
        className={`${style.showDetail} noBg`}>
        <img
          src={require("../../../assets/image/kf/left.png")}
          alt=""
          onClick={() => {
            setShowDetail1(false);
          }}
          className={style.imgs_left2}
        />
        {detail1Body()}
      </Popup>
      <Popup
        visible={showDetail2}
        onMaskClick={() => {
          setShowDetail2(false);
          StartsSet(false);
        }}
        className={`${style.showDetail} noBg`}>
        {detail2Body()}
      </Popup>

      {/* 直播间点击开奖弹窗 */}
      <Popup
        style={{ "--z-index": "1002" }}
        visible={showTab2}
        onMaskClick={() => {
          setBetPage(0);
          setShowTab2(false);
          setBetList([]);
          setHasMore(true);
        }}
        position="bottom"
        bodyClassName={`${style.windowBottom3}`}>
        <img
          src={require("../../../assets/image/kf/left.png")}
          alt=""
          onClick={() => {
            setBetPage(0);
            setShowTab2(false);
            setBetList([]);
            setHasMore(true);
          }}
          className={style.imgs_left}
        />
        <Tabs activeKey={tabKey2} onChange={setTabKey2} className={`zdyTab`}>
          <Tabs.Tab title={t("kjjl")} key="his">
            {/* {hisListBody()} */}
            <div className={`${style.showDetail}`}>{detail1Body2()}</div>
          </Tabs.Tab>
          <Tabs.Tab title={t("ui_bet_record")} key="bet">
            {betListBody2()}
          </Tabs.Tab>
        </Tabs>
      </Popup>
    </>
  );
}
