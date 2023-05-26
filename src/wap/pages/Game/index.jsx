import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, NoticeBar, DotLoading, SideBar, Popover, Empty } from "antd-mobile";
import { getBalance, BackAllGameCoin, autoUpBalance, gameForwardGame } from "../../server/balance";
import { TabBar } from "../../components";
import { useThrottleFn } from "ahooks";
import style from "./index.module.scss";
import _ from "lodash";
import useContextReducer from "../../state/useContextReducer";
const PointOut = React.lazy(() => import("../../components/pointOut/index"));
let setTime;
const Index = () => {
  const {
    state: { user, assergoldData, common },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { userGetUserAsserGold } = fetchUtils;
  const history = useNavigate();
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [banner, setBanner] = useState([]);
  const [listindex, listindexSet] = useState(0);
  const [NoticeBarD, NoticeBarDSet] = useState([]);
  const [DotLoadings, DotLoadingsSet] = useState(false);
  const [isSideClick, isSideClickSet] = useState(false);
  const [pointOuts, pointOutsSet] = useState(false);
  let goItemData = useRef();

  useEffect(() => {
    // 排除数据空的值
    const { game, ad } = common;
    let newResult = game.filter((e) => {
      return e.list?.length > 0 && e.uiType != 0;
    });
    for (let i = 0; i < newResult?.length; i++) {
      newResult[i].typeId = newResult[i].typeId.toString();
      const temp = newResult[i];
      if (temp.uiType == 2) {
        temp.listData = _.slice(_.chunk(temp.list, 12), 0, 3);
      }
    }
    if (newResult.length > 0) {
      setActiveKey(newResult[0].typeId);
    }
    console.log('newResult-----', newResult);

    setList(newResult);

    setBanner(() => {
      return ad.filter((a) => a.type === 16);
    });
    NoticeBarDSet(() => {
      return ad.filter((a) => a.pid === 3);
    });
  }, [common]);

  //一键回收
  const handleAllBank = async () => {
    DotLoadingsSet(true);
    const res = await BackAllGameCoin();
    if (!(res instanceof Error)) {
      DotLoadingsSet(false);
      // Toast.show(t("sys_check_pass"));
      // freshUser();
      userGetUserAsserGold();
    } else {
      DotLoadingsSet(false);
    }
  };

  const bannerClick = (data) => {
    window.open(data.jumpUrl, "_blank");
  };
  // 1. 查询游戏余额，游戏余额是否大于【i.大于0直接进入游戏，ii.等于0一键回收到】
  // 2. 调用一键回收
  // 3. 自动转账开关是否开启，开启的话自动上分，没开启弹出手动上分
  const jumpGame = async ({ type, gameId, name, nameI18N }, datas) => {
    // AG RSG PP
    if (datas.isMore == 1) {
      history("/gameAll", { state: { title: name, parentId: datas.typeId, type: type, uid: user?.uid } });
    } else {
      goItemData.current = { type, gameId, nameI18N };
      //
      // let balanceList = Local("balanceList") || [];
      // // 获取点击的游戏数据
      // let res = balanceList.filter((e) => {
      //   return e.type == type;
      // });

      const res = await getBalance({ gameType: type });
      if (!(res instanceof Error)) {
        console.log("获取余额", res.balance);
        goItemData.current = {
          ...goItemData.current,
          banlance: res.balance || 0,
        };

        // 1. 查询游戏余额
        // res && res.length > 0 && res[0].balance > 0
        if (res.balance > 0) {
          goItemData.current = { ...goItemData.current, getBalancesT: true };
          haveLook();
        } else {
          haveLook();
          // goItemData.current = { ...goItemData.current, setShowTransD: true, getBalancesT: true }; //开起弹窗
          // 2. 调用一键回收
          const GameCoin = await BackAllGameCoin();
          if (!(GameCoin instanceof Error)) {
            // 3.判断是否开起自动转入 autoUpBalance == 1 开起自动转入
            if (user?.autoUpBalance == 1) {
              if (GameCoin?.allBalance >= 1) {
                //钱包余额大于等于1才一键上分
                setTimeout(() => {
                  autoUpBalance({
                    amount: GameCoin?.allBalance,
                    gameType: type,
                    tradeType: 1,
                  }).then((data) => {
                    console.log("开起自动转入 带入金额", data);

                    // freshUser()
                    userGetUserAsserGold();
                    window.eventBus.emit("getBalances", data.balance || 0);
                  });
                }, 3500);
              }
            } else {
              goItemData.current = { ...goItemData.current, setShowTransD: true, getBalancesT: true }; //开起弹窗
              haveLook();
            }
          }
        }
      }
    }
  };

  const haveLook = async () => {
    console.log("vgoItemData.current", goItemData.current);
    // 某些游戏不支持iframe嵌入
    if ([31].includes(goItemData.current.type)) {
      let { gameId, type } = goItemData.current;
      let params = { gameId: gameId, gameType: type };
      let res = await gameForwardGame(params);
      if (!(res instanceof Error)) {
        location.href = res.url;
      }
    } else history("/gameIframe", { state: goItemData.current });
  };

  const listData = [
    { id: "3", title: t("ui_withdraw"), icon: "tx", history: "/deposit" },
    { id: "2", title: t("transTitle"), icon: "zz", history: "/balance" },
    { id: "1", title: t("deposit"), icon: "ck", history: "/recharge" },
  ];

  // 游戏菜单
  const [activeKey, setActiveKey] = useState();
  const { run: handleScroll } = useThrottleFn(
    () => {
      if (isSideClick) return;
      let currentKey = list[0].typeId;
      let height = 0;
      let key = 0;
      for (const item of list) {
        const element = document.getElementById(`anchor-${item.typeId}`);
        if (!element) continue;
        let centers = document.getElementById("centers");
        height += element.scrollHeight;
        //底部激活状态
        // if (document.getElementById("container").clientHeight + centers.scrollTop == centers.scrollHeight) {
        //   currentKey = list[list.length - 1].typeId;
        // } else
        if (centers.scrollTop + 5 > height) {
          currentKey = list[key + 1].typeId;
        } else {
          break;
        }
        document.getElementsByClassName("adm-side-bar-item")[key]?.scrollIntoView();
        clearTimeout(setTime);
        setTime = setTimeout(() => {
          document.getElementsByClassName("adm-side-bar-item")[key - 1]?.scrollIntoView();
        }, 500);
        key += 1;
      }
      setActiveKey(currentKey);
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    }
  );

  const mainElementRef = useRef(null);
  useEffect(() => {
    if (list[0] != undefined) {
      listindexSet(1);
    }

    const mainElement = mainElementRef.current;
    if (!mainElement) return;
    mainElement.addEventListener("scroll", handleScroll);
    return () => {
      mainElement.removeEventListener("scroll", handleScroll);
    };
  }, [list]);

  useEffect(() => {
    if (listindex == 1) {
      let data = [...list];
      list.forEach((value, index) => {
        if (document.getElementById(`way-${index}`)?.scrollWidth > 41) {
          value.goBeyond = true;
        } else {
          value.goBeyond = false;
        }
      });
      setList(data);
    }
  }, [listindex]);

  const swiperDom = () => {
    return (
      <Swiper className={style.banner}>
        {banner.map((item, index) => {
          return (
            <Swiper.Item key={index} className={style.bannerItem}>
              <img onClick={() => bannerClick(item)} className={style.bannerImg} src={item.content} alt="" />
            </Swiper.Item>
          );
        })}
      </Swiper>
    );
  };

  return (
    <div className={style.gameBody} style={{ height: window.innerHeight }}>
      {/* 顶部 */}
      <div className={style.titles}>
        <div className={style.titleleft}>
          <img className={style.titleImg} src={require("../../assets/image/game/zx/titlelog.png")} alt="" />
          <div className={style.titleleft_size}>
            <img src={require("../../assets/image/game/zx/titlesize.png")} alt="" />
            <div>{"fbslive.com"}</div>
          </div>
        </div>
        <img className={style.NavBar_img} onClick={() => history("/service")} src={require("../../assets/image/tx/kf1.png")} alt="" />
      </div>

      <div className={style.homeBody}>
        <div className={style.gameList}>
          {/* banner */}
          {banner.length > 0 ? swiperDom() : <Empty className={style.banner} description={t("noData")} />}
          {/* 公告 交易记录 */}
          <div className={style.NoticeBarDspl}>
            <NoticeBar icon={<img src={require("../../assets/image/game/zx/ts.png")} style={{ width: "13.5px", height: "12px" }} />} content={NoticeBarD[0] !== undefined ? NoticeBarD[0]?.content : ""} style={{ paddingLeft: 0, paddingRight: "84px", height: "44px", width: "100%", marginTop: "2px", background: "#fff", borderRadius: "4px", marginBottom: "2px", border: "none", "--text-color": "#FC708B" }} />
            <div
              className={style.NoticeBarDspl_right}
              onClick={() => {
                history("/record", { state: 10000 });
              }}>
              <img src={require("../../assets/image/game/zx/czjllog.png")} /> {t("reportDetailTitle")}
            </div>
          </div>
          <div className={style.gameInfo}>
            <div className={style.infoL}>
              <div className={style.top} style={{ display: "flex" }}>
                <div className={style.name}>{user?.nickname}</div>
                <img className={style.level} src={require(`../../assets/image/live/level_${user?.userLevel ? user?.userLevel : 1}.png`)} />
              </div>
              {!DotLoadings ? (
                <div className={style.moneys}>
                  <div style={{ maxWidth: "70px", overflow: "hidden" }}>
                    <div id="goldCoinGd" className={document.getElementById(`goldCoinGd`)?.scrollWidth > 70 ? style.centent_left_2_size : ""}>
                      {assergoldData?.goldCoin || 0}
                    </div>
                  </div>
                  <Popover content={t("qianbaozhongx")} trigger="click" placement="bottom" mode="dark">
                    <img src={require("../../assets/image/game/zx/wh.png")} alt="" />
                  </Popover>
                  <img
                    src={require("../../assets/image/my/gb/hs.png")}
                    onClick={() => {
                      handleAllBank();
                    }}
                  />
                </div>
              ) : (
                <DotLoading />
              )}
            </div>

            {/* 提现 游戏 转账*/}
            <div className={style.infoR}>
              {listData.map((item) => {
                return (
                  <div
                    className={style.item}
                    key={item.id}
                    onClick={() => {
                      if (item.history == "/deposit") {
                        if (user?.phone == null || user?.phone == undefined) {
                          pointOutsSet(true);
                        } else {
                          history("/deposit");
                        }
                      } else {
                        history(item.history);
                      }
                    }}>
                    <img src={require(`../../assets/image/my/gb/${item.icon}.png`)} />
                    <div className={style.title}>{item.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 内容 */}
          <div className={style.container} id="container">
            <div className={style.side}>
              <SideBar
                activeKey={activeKey}
                onChange={(key) => {
                  setActiveKey(key);
                  isSideClickSet(true);
                  setTimeout(() => {
                    isSideClickSet(false);
                  }, 500);
                  document.getElementById(`anchor-${key}`)?.scrollIntoView();
                  let index = list.findIndex((v) => v.typeId === key);
                  document.getElementsByClassName("adm-side-bar-item")[index - 1 < 0 ? 0 : index - 1].scrollIntoView();
                }}
                className="noBor5">
                {list.map((item, index) => (
                  <SideBar.Item
                    key={item.typeId}
                    title={
                      <div className={style.centent_left_2}>
                        <div style={{ width: "100%", paddingLeft: "5px", paddingRight: "12px", whiteSpace: "nowrap", display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: "100%", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img src={activeKey == item.typeId ? item?.iconActive : item?.icon} alt="" style={{ width: "24px", height: "24px" }} />
                            <div id={`way-${index}`} style={{ width: "100%", textAlign: "center", marginTop: "6.5px" }} className={item?.goBeyond ? style.centent_left_2_size : ""}>
                              {item.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  />
                ))}
              </SideBar>
            </div>
            <div className={style.centers} ref={mainElementRef} id="centers">
              {list.map((val) => (
                <div key={val.typeId} id={`anchor-${val.typeId}`}>
                  <div className={style.live}>
                    {
                      val.id == 23 && <div className={style.rm_style}>
                        {
                          val.list.map((item, index) => {
                            return <div className={style.icons}
                              onClick={() => {
                                console.log('热门游戏-----', item, item.gameUrl);
                                history("/promisionDetail", { state: { url: item.gameUrl, titles: item.name } })
                              }}>
                              <img src={item?.bgUrl} alt="" />
                              <p>{item?.name}</p>
                            </div>
                          })
                        }
                      </div>
                    }
                    {val.id != 23 && val.list.map((item_1, index) => {
                      return (
                        <div
                          className={` ${style.spaces}`}
                          key={index}
                          onClick={() => {
                            jumpGame(item_1, val);
                          }}
                        >
                          {/* 热门 */}
                          {item_1.hotFlag == 1 && <img className={style.syrm_img} src={require("../../assets/image/game/zx/rmsylog.png")} alt="" />}
                          {/* 置顶log */}
                          {/* <img src={require(`../../assets/image/game/zx/${item_1?.Top ? 'sctrue' : 'scfalse'}.png`)} alt="" className={style.sc} onClick={(e) => { e.stopPropagation(), CollectionClik(item_1, val) }} /> */}
                          {/* 官方推荐 */}
                          {item_1.official == 1 && <div className={style.spaces_img} style={{ background: `url(${require("../../assets/image/game/zx/gfrz.png")})`, backgroundSize: "100% 100%" }}></div>}
                          {/* 昵称 */}
                          <div className={style.name}>{item_1.nameI18N}</div>
                          <div className={style.name2}>{item_1.name}</div>
                          <img src={item_1?.bgUrl} alt="" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 提示 */}
      <PointOut
        visible={pointOuts}
        type={4}
        visibleSet={() => pointOutsSet(false)}
        but2={() => {
          history("/bindingPhone", { state: { i: 2 } });
        }}
      />
      <TabBar active="/game" />
    </div>
  );
};
export default Index;
