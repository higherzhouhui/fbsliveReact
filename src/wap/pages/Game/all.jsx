import React, { useRef, useEffect, useCallback, useState, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Skeleton, Form, Input, Empty, Mask, Button, Toast, NavBar } from "antd-mobile";
import style from "./all.module.scss";
import { useTranslation } from "react-i18next";
import { getGameJumpUrl, getGameListV2, getGameCollect, addCollect, delCollect } from "../../server/home";
import { BackAllGameCoin, autoUpBalance, getBalance } from "../../server/balance";
import { Local } from "../../../common";
import { useNavigate } from "react-router-dom";
import { uuidv4 } from "../../../utils/tools";
import useContextReducer from "../../state/useContextReducer";

let timeD;
let indexD = uuidv4();
const Login = () => {
  const history = useNavigate();

  const { t } = useTranslation();
  const { state } = useLocation();
  const [allGameList, setAllGameList] = useState([]);
  const [allGameListCopy, setAllGameListCopy] = useState([]); //全部游戏

  const [allGameList2, setAllGameList2] = useState([]);
  const [allGameListCopy2, setAllGameListCopy2] = useState([]); //全部游戏
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [gameType, setGameType] = useState("");

  const [money, setMoney] = useState(null);

  const [tabsSwitch, tabsSwitchSet] = useState(0);
  const [tabsSwitch2, tabsSwitchSet2] = useState(false);

  const [cData, cDataSet] = useState([]);
  const [getBalancesD, getBalancesDSet] = useState(0);
  let goItemData = useRef();
  const { title, parentId, type, uid } = state;
  const {
    state: { user, assergoldData },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { freshUser, userGetUserAsserGold } = fetchUtils;

  // const { state: { user }, fetchUtils } = useContextReducer.useContextReducer()
  // 全部游戏
  const getList = useCallback(async () => {
    setLoading(true);
    // getSlotListData()

    getGameListV2s();
    try {
    } catch (error) {}
  }, []);
  const getGameListV2s = async () => {
    const res = await getGameListV2({ parentId: parentId, type: type, uid: uid });
    if (!(res instanceof Error)) {
      indexD = uuidv4();
      // 排除数据空的值
      let allGameList = res || []; //全部游戏
      let allGameListCopy = res || []; //全部游戏备份
      if (gameName.length > 0) {
        setLoading(false);
        // setAllGameListCopy(allGameListCopy)//设置全部游戏备份
        searchGameName(gameName, gameType, allGameListCopy);
      } else {
        setAllGameList(allGameList); //设置全部游戏
        setAllGameListCopy(allGameListCopy); //设置全部游戏备份
        setLoading(false);
      }
    }
  };

  // const GetUserInfo = async () => {
  //   const res = await getUserInfo();
  //   if (!(res instanceof Error)) {
  //     // setBaseInfo(res)
  //     Local("userInfo", res);
  //   }
  // };

  // 收藏游戏
  const getList2 = useCallback(async () => {
    indexD = uuidv4();
    setLoading(true);
    // getSlotListData()
    try {
      getGameCollects();
    } catch (error) {}
  }, []);

  const getGameCollects = async () => {
    const res = await getGameCollect({ parentId: parentId, type: type, uid: uid });
    if (!(res instanceof Error)) {
      let allGameList = res || []; //全部游戏
      let allGameListCopy = res || []; //全部游戏备份

      setAllGameList2(allGameList); //设置全部游戏
      setAllGameListCopy2(allGameListCopy); //设置全部游戏备份
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
    getList2();
  }, [getList, getList2]);

  const getBalanceF = async () => {
    const res = await getBalance({ gameType: type });
    if (!(res instanceof Error)) {
      getBalancesDSet(res.balance || 0);
      goItemData.current = {
        ...goItemData.current,
        banlance: res.balance || 0,
        type: type,
      };
    } else {
      getBalancesDSet(0);
    }
  };

  // { type, gameId, name }
  const jumpGame = async (item) => {
    goItemData.current = { type: item.type, gameId: item.gameId, name: item.name };
    // let balanceList = Local("balanceList") || [];
    // let res = balanceList.filter((e) => {
    //   return e.type == type;
    // });
    // console.log('获取数据', getBalancesD, type, item.type);
    // 判断是否开起自动转入 autoUpBalance == 1 开起自动转入
    if (getBalancesD == 0) {
      haveLook();
      const GameCoin = await BackAllGameCoin();
      if (!(GameCoin instanceof Error)) {
        if (user?.autoUpBalance == 1) {
          if (GameCoin?.allBalance >= 1) {
            //钱包余额大于等于1才一键上分
            timeD = setTimeout(() => {
              autoUpBalance({
                amount: GameCoin?.allBalance || 0,
                gameType: type,
                tradeType: 1,
              }).then((data) => {
                console.log("开起自动转入 带入金额", data);
                window.eventBus.emit("getBalances", data.balance || 0);
                // freshUser()
                userGetUserAsserGold();
                // GetUserInfo()
                clearTimeout(timeD);
                timeD = null;
              });
            }, 3500);
          }
        } else {
          goItemData.current = { ...goItemData.current, setShowTransD: true, getBalancesT: true }; //开起弹窗
          haveLook();
        }
      }
    } else {
      goItemData.current = { ...goItemData.current, getBalancesT: true };
      haveLook();
    }
  };

  const haveLook = async () => {
    history("/gameIframe", { state: goItemData.current });
  };

  const searchGameName = async (gameName, gameType, data) => {
    let allGameListCopys = data || allGameListCopy;

    setGameName(gameName);

    if (state == "Slots") {
      if (gameName) {
        if (gameType) {
          setAllGameList(
            allGameListCopys.filter((e) => {
              return e.type == gameType && e.name.indexOf(gameName) != -1;
            })
          );
          // listindexSet(2)
          indexD = 2;
        } else {
          setAllGameList(
            allGameListCopys.filter((e) => {
              return e.name.indexOf(gameName) != -1;
            })
          );
          indexD = 3;
        }
      } else {
        if (gameType) {
          setAllGameList(
            allGameListCopys.filter((e) => {
              return e.type == gameType;
            })
          );
          indexD = 4;
        } else {
          setAllGameList(allGameListCopys);
          indexD = 5;
        }
      }
    } else {
      if (gameName) {
        setAllGameList(
          allGameListCopys.filter((e) => {
            return e.name.indexOf(gameName) != -1;
          })
        );
        indexD = 6;
      } else {
        setAllGameList(allGameListCopys);
        indexD = 7;
      }
    }
  };
  const [listindex, listindexSet] = useState(0);
  // 监听改变时获取超出文字滚动
  useEffect(() => {
    if (allGameList[0] != undefined) {
      console.log("indexD", indexD);
      listindexSet(indexD);
    }
  }, [allGameList, allGameList2]);

  useEffect(() => {
    let data = [...allGameList];
    data.forEach((value, index) => {
      if (document.getElementById(`way-${index}`)?.scrollWidth > document.getElementById(`way-${index}`)?.offsetWidth) {
        value.goBeyond = true;
      } else {
        value.goBeyond = false;
      }
    });
    setAllGameList(data);

    if (indexD == 12) {
      let data = [...allGameList2];
      data.forEach((value, index) => {
        if (document.getElementById(`way2-${index}`)?.scrollWidth > document.getElementById(`way2-${index}`)?.offsetWidth) {
          value.goBeyond = true;
        } else {
          value.goBeyond = false;
        }
      });
      // console.log(data);
      setAllGameList2(data);
    }
  }, [listindex]);

  // 收藏
  const CollectionClik = async (collectFlag, data) => {
    if (collectFlag == 1) {
      // 删除收藏
      const res = await delCollect({ gameId: data.gameId, gameType: type, parentId: parentId });
      if (!(res instanceof Error)) {
        // console.log('删除收藏', res);
        indexD = uuidv4();
        getGameListV2s();
        getGameCollects();
        // getList()
        // getList2()
      }
    } else {
      // 收藏
      const res = await addCollect({ gameId: data.gameId, gameType: type, parentId: parentId });
      if (!(res instanceof Error)) {
        // console.log('收藏', res);
        indexD = uuidv4();
        getGameListV2s();
        getGameCollects();
        // getList()
        // getList2()
      }
    }
  };

  useEffect(() => {
    // freshUser()  //刷新info

    let data = JSON.parse(sessionStorage.getItem("gameNames")) || [];
    cDataSet(data);
    // GetUserInfo() //刷新info
    getBalanceF(); //游戏金额
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode == 13) {
      // SpinLoadingsSet(true)
      // liveSearchLiveLists(CheckInd)

      searchF();
    }
  };
  const searchF = (e) => {
    // 展示搜索数据
    tabsSwitchSet2(true);

    console.log(gameName);
    let gameNamed = e || gameName;
    // console.log('多少', gameNamed);
    let data = [];
    if (gameNamed.length > 0) {
      if (JSON.parse(sessionStorage.getItem("gameNames")) == null || JSON.parse(sessionStorage.getItem("gameNames")) == undefined) {
        cDataSet([gameNamed]);
        sessionStorage.setItem("gameNames", JSON.stringify([gameNamed]));
      } else {
        data = JSON.parse(sessionStorage.getItem("gameNames"));
        data.unshift(gameNamed);
        let a = new Set(data);
        cDataSet([...a]);
        sessionStorage.setItem("gameNames", JSON.stringify([...a]));
      }
    }

    // sessionStorage.setItem('gameNames', JSON.stringify(data))
    searchGameName(gameNamed, gameType);
  };
  return (
    <>
      {
        // !loading ? (
        //   <div className={style.skBody}>
        //     {Array(1)
        //       .fill("")
        //       .map((item, index) => (
        //         <Suspense key={index}>
        //           <div className={style.grid3}>
        //             {Array(12)
        //               .fill("")
        //               .map((item, index) => (
        //                 <Skeleton key={index} animated className={style.customSkeleton} />
        //               ))}
        //           </div>
        //         </Suspense>
        //       ))}
        //   </div>
        // ) :
        <>
          <div className={tabsSwitch != 3 ? style.homeBody : `${style.homeBody} ${style.homeBodyB}`}>
            {tabsSwitch != 3 ? (
              <NavBar
                back={null}
                left={<img src={require("../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px" }} onClick={() => history(-1)} />}
                onBack={() => history(-1)}
                className={style.Title}
                style={{ background: "#fff" }}
                right={
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {loading ? (
                      <Skeleton style={{ width: "22px", height: "22px", borderRadius: "4px" }} />
                    ) : (
                      <img
                        style={{ width: "18px", height: "18px" }}
                        onClick={() => {
                          tabsSwitchSet(3);
                          indexD = 9;
                        }}
                        src={require("../../assets/image/game/zx/fdj.png")}
                        alt=""
                      />
                    )}
                  </div>
                }>
                <div style={{ fontSize: "18px", fontWeight: "500" }}>{title}</div>
              </NavBar>
            ) : (
              <div className={style.addForm}>
                <Form layout="horizontal">
                  <Form.Item name="gameName" className={`${style.gameName}`} label={t("")} style={{ borderRadius: "18px", height: "34.5px", display: "flex", alignItems: "center", background: "#F1F3F7", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <img
                        onClick={() => {
                          searchF();
                        }}
                        src={require("../../assets/image/game/zx/fdjb.png")}
                        alt=""
                        style={{ width: "13.5px", height: "13px", marginRight: "11px" }}
                      />
                      <Input
                        value={gameName}
                        onKeyDown={(e) => {
                          onKeyDown(e);
                        }}
                        onClear={() => {
                          tabsSwitchSet2(false);
                        }}
                        onChange={setGameName}
                        style={{ "--text-align": "left", "--placeholder-color": "#999999;", width: "100%" }}
                        placeholder={t("qingshuruguanjianzi")}
                      />
                      {gameName.length > 0 && (
                        <img
                          className={style.imgqc}
                          onClick={() => {
                            setGameName(""), tabsSwitchSet2(false);
                          }}
                          src={require("../../assets/image/game/zx/qc.png")}
                          alt=""
                        />
                      )}
                    </div>
                  </Form.Item>
                </Form>
                <div
                  className={style.addForm_qx}
                  onClick={() => {
                    tabsSwitchSet(0);
                    tabsSwitchSet2(false);
                    getList();
                    getList2();
                    setGameName("");
                    setAllGameList([]);
                    setAllGameListCopy([]);
                    indexD = 10;
                  }}>
                  {t("btn_cancel")}
                </div>
              </div>
            )}
            {/* 切换 */}
            {tabsSwitch != 3 && (
              <div className={style.tabs}>
                <div
                  className={`${style.tabs2_div} ${tabsSwitch == 0 ? style.tabs2 : ""}`}
                  onClick={() => {
                    tabsSwitchSet(0);
                    indexD = 8;
                  }}>
                  <div className={style.tabs_position}>
                    <div className={style.tabs_index}>{allGameList?.length > 99 ? "99+" : allGameList?.length}</div>
                    {t("ui_all")}
                  </div>
                </div>
                <div
                  className={`${style.tabs2_div} ${tabsSwitch == 1 ? style.tabs2 : ""}`}
                  onClick={() => {
                    tabsSwitchSet(1);
                    indexD = 12;
                  }}>
                  <div className={style.tabs_position}>
                    <div className={style.tabs_index}>{allGameList2?.length > 99 ? "99+" : allGameList2?.length}</div>
                    {t("shou_cang")}
                  </div>
                </div>
              </div>
            )}
            {/* 搜索提示 */}
            {tabsSwitch == 3 && tabsSwitch2 == true && (
              <div className={style.big_ts}>
                {/* 共搜索到 <span style={{ color: '#733FEE' }}>{allGameList.length}</span> 条关于“{gameName}”的结果 */}
                {t("gongsousuodao", { num: allGameList.length, text: gameName })}
              </div>
            )}

            {/* 历史搜索 */}
            {tabsSwitch == 3 && tabsSwitch2 == false && (
              <div className={style.historys}>
                <div className={style.historys_title}>{t("soushuolishi")}</div>
                <div className={style.historys_center}>
                  {cData
                    .filter((i, index) => index < 10)
                    .map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setGameName(item), searchF(item);
                          }}>
                          {item}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 内容 */}
            {loading ? (
              <div className={style.skBody}>
                {Array(1)
                  .fill("")
                  .map((item, index) => (
                    <Suspense key={index}>
                      <div className={style.grid3}>
                        {Array(12)
                          .fill("")
                          .map((item, index) => (
                            <Skeleton key={index} animated className={style.customSkeleton} />
                          ))}
                      </div>
                    </Suspense>
                  ))}
              </div>
            ) : (
              <div className={`${style.gameList}  ${tabsSwitch2 == true ? style.gameList2 : ""}`}>
                {/* 全部游戏 /搜索游戏*/}
                {(tabsSwitch == 0 || tabsSwitch2 == true) && (
                  <div className={style.box}>
                    {allGameList.length > 0 ? (
                      allGameList.map((item, index) => (
                        // <div key={index} className={style.space} onClick={() => jumpGame(item)}>
                        //   <img className={style.bgImg} src={require(`../../assets/image/game/slots-0${Math.ceil(Math.random() * 9)}.png`)} alt="" />
                        //   <img className={style.icon} src={item.icon} alt="" />
                        //   <span className={style.slotsName}>{item.name}</span>
                        // </div>
                        // <div className={style.space} key={index} onClick={() => jumpGame(item)}>
                        //   <img className={style.icon} src={item.icon} alt="" />
                        //   <div className={style.slotsName}>{item.name}</div>
                        // </div>

                        <div className={style.space} key={index} onClick={() => jumpGame(item)}>
                          {/* <img className={style.bgImg} src={require(`../../assets/image/game/slots-0${key + 1}.png`)} alt="" /> */}
                          {item.hotFlag == 1 && <img className={style.rm} src={require("../../assets/image/game/zx/rmlog.png")} alt="" />}
                          <img className={style.icon} src={item.icon} alt="" />
                          {/* sclog.png */}
                          <div className={style.slotsName}>
                            <div className={style.slotsName_size}>
                              <div id={`way-${index}`} className={`${item.goBeyond ? style.slotsName_size2 : ""}`}>
                                {item.name}
                              </div>
                            </div>
                            <img
                              className={style.slotsName_img}
                              onClick={(e) => {
                                e.stopPropagation(), CollectionClik(item.collectFlag, item);
                              }}
                              src={require(`../../assets/image/game/zx/${item.collectFlag == 1 ? "sclog" : "wsclog"}.png`)}
                              alt=""
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={style.empty}>
                        {" "}
                        <Empty />
                      </div>
                    )}
                  </div>
                )}
                {/* 收藏 */}
                {tabsSwitch == 1 && (
                  <div className={style.box}>
                    {allGameList2.length > 0 ? (
                      allGameList2.map((item, index) => (
                        // <div key={index} className={style.space} onClick={() => jumpGame(item)}>
                        //   <img className={style.bgImg} src={require(`../../assets/image/game/slots-0${Math.ceil(Math.random() * 9)}.png`)} alt="" />
                        //   <img className={style.icon} src={item.icon} alt="" />
                        //   <span className={style.slotsName}>{item.name}</span>
                        // </div>
                        // <div className={style.space} key={index} onClick={() => jumpGame(item)}>
                        //   <img className={style.icon} src={item.icon} alt="" />
                        //   <div className={style.slotsName}>{item.name}</div>
                        // </div>

                        <div className={style.space} key={index} onClick={() => jumpGame(item)}>
                          {/* <img className={style.bgImg} src={require(`../../assets/image/game/slots-0${key + 1}.png`)} alt="" /> */}
                          {item.hotFlag == 1 && <img className={style.rm} src={require("../../assets/image/game/zx/rmlog.png")} alt="" />}
                          <img className={style.icon} src={item.icon} alt="" />
                          {/* sclog.png */}
                          <div className={style.slotsName}>
                            <div className={style.slotsName_size}>
                              <div id={`way2-${index}`} className={`${item.goBeyond ? style.slotsName_size2 : ""}`}>
                                {item.name}
                              </div>
                            </div>
                            <img
                              className={style.slotsName_img}
                              onClick={(e) => {
                                e.stopPropagation();
                                CollectionClik(1, item);
                              }}
                              src={require(`../../assets/image/game/zx/${"sclog"}.png`)}
                              alt=""
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={style.empty}>
                        {" "}
                        <Empty />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* 搜索内容 */}
            {/* {tabsSwitch == 3 && <div>

        </div>} */}
          </div>
        </>
      }
      {/* <Mask visible={showBalance} onMaskClick={() => setShowBalance(false)}>
        <div className={style.transBody}>
          <div className={style.titleModal}>{t("nav_modal_01")}</div>
          <div className={style.tips}>{t("nav_modal_02")}</div>
          <Input value={money} placeholder={t("nav_modal_03")} onChange={setMoney} type="number" className={style.input} />
          <div className={style.btns}>
            <Button block color="default" loading="auto" className={style.submit} onClick={() => haveLook()}>
              {t("nav_modal_04")}
            </Button>
            <Button block color="primary" loading="auto" className={style.submit} onClick={() => exchangeIn()} disabled={!money}>
              {t("nav_modal_05")}
            </Button>
          </div>
        </div>
      </Mask> */}
    </>
  );
};

export default Login;
