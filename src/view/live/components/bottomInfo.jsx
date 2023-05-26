// 直播详情底部详情

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, Tabs } from "antd-mobile";
import { Popover, message, Button, InputNumber } from "antd";
import { GetGameList, GetLiveGift, SendGift, GetLiverDetail, GetGiftType } from "../../../api/live";
import { Getissue } from "../../../api/game";
import RewardResult from "../../../components/live/detail/game/rewardResult";
import AllResult from "../../../components/live/detail/game/allResult";
import Result from './result'
import { UpOutlined } from "@ant-design/icons";
import GameDetail from "../../../components/live/detail/game/detail";
import "./style/bottomInfo.scss";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import i18n from "../../../language/config";
import _ from "lodash";
import useContextReducer from '../../../state/useContextReducer.js'

let gameComp = null;
let timer = null;
let timer2 = null;

const BottomInfo = (props) => {
  const [gameList, gameListSet] = useState([]);
  const [giftList, giftListSet] = useState([]);
  const [giftLoading, giftLoadingSet] = useState(false);
  const [num, numSet] = useState(8);
  const [gameName, gameNameSet] = useState("yuxx");
  const [gamePic, gamePicSet] = useState("");
  const [gameShow, gameShowSet] = useState(false);
  const [baseGameList, baseGameListSet] = useState([]);
  const [issuData, issuDataSet] = useState({});
  const [down_time, down_timeSet] = useState(60);
  const [configBase, configBaseSet] = useState({});
  const [typeIndex, typeIndexSet] = useState("0");
  const [active, activeSet] = useState({ key: -1, index: -1 });
  const [typeGiftList, typeGiftListSet] = useState([]);
  const [hotGift, setHotGift] = useState([])
  const [giftGroup, giftGroupSet] = useState([]);
  const detailRef = useRef(null);

  const { t } = useTranslation();
  const {
    FreshUser,
    baseInfo: { liveId, anchorId },
    getGiftList,
    userInfo,
  } = props;
  const { fetchUtils } = useContextReducer.useContextReducer()
  const { freshUser } = fetchUtils;


  const init = useCallback(() => {
    getGameList();
    getGiftType();
    getLiveGift();
    getLiverDetail();
    // getissue();
    window.eventBus.addListener("store", storeEvent);
  }, []);
  useEffect(() => {
    init();
    return () => {
      clearInterval(timer);
      clearInterval(timer2);
      window.eventBus.removeListener("store", storeEvent);
    };
  }, [init]);

  const [visible, visibleSet] = useState(false);

  useEffect(() => {
    window.eventBus.addListener("GiftsToWXKLW", GiftsToWXKLW); //开起礼物弹窗
  }, []);

  const GiftsToWXKLW = () => {
    visibleSet(true);
  };
  const getGameComp = (value) => {
    gameComp = value;
  };

  const sendGift = (num = 0, data) => {
    // if (giftLoading) return;
    let { goldCoin, gid } = data;
    // giftLoadingSet(true);
    SendGift({ combo: num, count: num, liveId, gid, goldCoin, anchorId }).then((rt) => {
      if (rt) {
        // giftLoadingSet(false);
        message.success(t("ui_success"));
        freshUser()
      }
    })
  };

  const gameChoice = (data) => {
    gameNameSet(data.name);
    gamePicSet(data.icon);
    gameShowSet(true);
    getissue(data.name);
  };

  //游戏倒计时
  const getissue = (name = "yuxx") => {
    Getissue({ name }, ["223", "272"].includes(name) ? "lottery" : "").then((rt) => {
      detailRef.current && detailRef.current.getIssueHandle(rt);
      let newCount = rt.down_time;
      if (newCount < 10) newCount = "0" + newCount;
      if (gameShow && rt.down_time > 50 && rt.down_time <= 55) {
        gameComp && gameComp.getGameHistory && gameComp.getGameHistory();
      }
      issuDataSet(Object.assign({}, { ...issuData }, rt));
      down_timeSet(newCount);
      djsFun(rt.down_time, name);
    });
    clearInterval(timer);
    // timer = setInterval(() => getissue(name), 5000);
  };

  // 处理游戏倒计时
  const djsFun = (downTime, typeName) => {
    clearTimeout(timer2);
    timer2 = setTimeout(() => {
      let newCount = downTime - 1;
      if (newCount <= 0) {
        newCount = 0;
        getissue(typeName);
      }
      if (newCount < 10) newCount = "0" + newCount;
      down_timeSet(newCount);
      djsFun(Number(newCount), typeName);
    }, 1000);
  };

  const storeEvent = (e) => {
    if (e.type === "setBaseInfo") {
      configBaseSet(e.payload);
    }
  };

  const getLiverDetail = () => {
    GetLiverDetail({ liveId, anchorId }).then((rt) => {
      rt.liveStartLottery.forEach((item) => {
        item.icon = item.lorretyIcon;
        item.name = item.lotteryName;
      });
      baseGameListSet(rt.liveStartLottery.length ? rt.liveStartLottery : []);
    });
  };

  // 游戏列表
  const getGameList = () => {
    GetGameList().then((rt) => {
      let gameList = rt.filter((item) => {
        //过滤番摊游戏（未开发完）
        return !["allgame", "ft"].includes(item.name);
      });
      gameListSet(gameList);
    });
  };

  // 最新获取礼物数据
  const getGiftType = () => {
    GetGiftType().then((res) => {
      // 礼物内容数据
      giftGroupF(res, typeIndex);
      typeGiftListSet(res);
    });
  };

  // 获取内容数据
  const giftGroupF = (res, indexs) => {
    let data = [];
    if (res.length < 1) {
      data = [];
    } else {
      let key = 0;
      let list = _.cloneDeep(res[indexs].propBaseResponses)
        .sort((a, b) => a.goldCoin - b.goldCoin)
        .reduce((arr, item) => {
          if (!arr[key]) arr[key] = [];
          arr[key].push(item);
          if (arr[key].length === 100) {
            key += 1;
          }
          return arr;
        }, []);
      data = list;
    }
    giftGroupSet(data);
    window.eventBus.emit('getGift', res)
  };

  const getLiveGift = () => {
    GetLiveGift().then((res) => {
      giftListSet(res.sort((a, b) => a.goldCoin - b.goldCoin));
      getGiftList(res);
    });
  };

  const getGiftInputGroup = (item) => {
    return (
      <div className="ds-alert-box" style={{ color: "#fff" }}>
        <div className="flex f-a-c f-j-sb top-info">
          <div className="flex f-a-c">
            <img style={{ height: 50, marginRight: 10 }} src={item.cover} alt="" />
            <div className="gift-info">
              <span className="gname">{item.gname}</span>
              <div className="goldCoin">{item.goldCoin * num} {t('gold_coins')}</div>
            </div>
          </div>
        </div>
        <div className="bottom-info-box">
          <div className="flex f-a-c" style={{ gap: 10, marginTop: 10 }}>
            <div className={"btn " + (num == 8 && "hover-btn")} onClick={() => numSet(8)}>
              8
            </div>
            <div className={"btn " + (num == 38 && "hover-btn")} onClick={() => numSet(38)}>
              38
            </div>
            <div className={"btn " + (num == 88 && "hover-btn")} onClick={() => numSet(88)}>
              88
            </div>
            <InputNumber
              value={num}
              precision={0}
              min={1}
              onChange={(num) => {
                numSet(num);
              }}
            />
            <Button style={{ background: "#fff", color: "#000" }} type="primary" onClick={() => sendGift(num, item)} loading={giftLoading}>
              {t("btn_send")}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  // 展示其他礼物
  const getHotGift = () => {
    // 获取热门的礼物
    if (typeGiftList.length == 0) return
    let hotGift = _.cloneDeep(typeGiftList[0].propBaseResponses)
      .sort((a, b) => a.goldCoin - b.goldCoin);
    return <div className="gift-group">
      {hotGift.length > 0 && hotGift.slice(0, 8).map((item, index) => {
        return <Popover overlayClassName="gift-popover" color="rgba(23, 23, 35)" onOpenChange={() => numSet(8)} placement="topRight" content={getGiftInputGroup(item)} key={index}>
          <div key={index} className="gift-item" onClick={() => { sendGift(1, item) }}>
            <img className="icon " src={item.cover} key={index} alt="" />
            <div className="title">{item.goldCoin} xu</div>
          </div>
        </Popover>
      })}
    </div>
  }

  const getAllListDom2 = () => {
    return (
      <div className="all-game-list">
        <div key={typeIndex} className="giftTypeList"
        >
          {typeGiftList.map((item, index) => {
            return <div onClick={() => {
              giftGroupF(typeGiftList, index);
              typeIndexSet(index);
              activeSet({ key: -1, index: -1 });
            }} className={`title ${typeIndex == index && 'active'}`} title={i18n.language === "vie" ? item.ynLan : item.chLan} key={index}>
              {i18n.language === "vie" ? item.ynLan : item.chLan}</div>;
          })}
        </div>
        {giftGroup.length ? (
          // <Swiper>
          giftGroup.map((val, key) => {
            return (
              // <Swiper.Item key={`group${key}`}>
              <div className="giftGroup">
                {val.map((item, index) => {
                  return (
                    <div key={item.gid} className={active.key === key && active.index === index ? "actives2" : "giftBox"} onClick={() => { }}>
                      <Popover overlayClassName="gift-popover" color="rgba(23, 23, 35)" onOpenChange={() => numSet(8)} placement="topRight" content={getGiftInputGroup(item)} key={index}>
                        <div className="all-game-list-item gift-item" onClick={() => sendGift(1, item)}>
                          <img className="game-icon " src={item.cover} key={index} alt="" />
                          <div className="g-name">
                            <div className={document.getElementById(`way-${item.gid}`)?.scrollWidth > document.getElementById(`way-${item.gid}`)?.offsetWidth ? "g-name2" : ""} id={`way-${item.gid}`}>
                              {item.goldCoin} xu
                            </div>
                          </div>
                        </div>
                      </Popover>
                    </div>
                  );
                })}
              </div>
              // </Swiper.Item>
            );
          })
          // </Swiper>
        ) : (
          <>{t("noData")}</>
        )}
      </div>
    );
  };

  return (
    <div className="live-detail-bottom-container">
      {/* 左侧记录 */}
      <div className="live-detail-bottom-container-record" >
        {/* <div className="icon icon-live-record"></div>
        <div className="title">记录</div> */}
        {/* <AllResult />
        <RewardResult /> */}
        <Result />
      </div>
      {/* 中间礼物 */}
      <div className="live-detail-bottom-container-gift">
        <div className="fast-box">
          {getHotGift()}
          {/* {getAllListDom(giftList)} */}
        </div>
        <div className={`${giftLoading && "loading"}`}>
          {/* 全部礼物 */}
          <Popover
            color="#36373C"
            placement="top"
            visible={visible}
            onVisibleChange={(e) => { e == true && window.eventBus.emit("GiftsToWXGb"), visibleSet(e) }}
            content={getAllListDom2(giftList, 2)}
            trigger="click"
            className="gift-box"
            overlayClassName="giftall-popover"
          >
            <div className="icon icon-live-gift"></div>
            <span className="title">{t('live_slw')}</span>
          </Popover>
        </div>
      </div>
      {/* 右侧充值 */}
      <Link to="/user/deposit">
        <div className="live-detail-bottom-container-recharge" >
          <div className="icon icon-live-recharge"></div>
          <div className="title">{t('ui_dep')}</div>
        </div>
      </Link>

      {/* <CSSTransition in={gameShow} timeout={500} classNames="fade" unmountOnExit appear={true}>
        <GameDetail ref={detailRef} getGameComp={getGameComp} issuData={issuData} down_time={down_time} FreshUser={FreshUser} userInfo={userInfo} onClose={() => gameShowSet(false)} liveId={liveId} name={gameName} gamePic={gamePic} />
      </CSSTransition> */}
    </div>
  );
};

export default BottomInfo;
