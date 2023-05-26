import React, { useEffect, useState, useRef, useMemo } from "react";
import { TabBar } from "../../components";
import { Grid, Skeleton, Empty, Image, CapsuleTabs, Popup, Input, Swiper, Avatar, Button, SpinLoading } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { liveSearchLiveList2 } from "../../server/live";
import { useNavigate } from "react-router-dom";
import { liveFollow } from "../../server/Fans";
import useContextReducer from "../../state/useContextReducer";
import style from "./index.module.scss";

const Advance = React.lazy(() => import("./advance/index"));

const Live = () => {
  const history = useNavigate();
  const { t } = useTranslation();
  const {
    state: {
      liveBanner: StateLiveBanner,
      common: { ad },
      live: { liveData },
      previewStatus,
    },
    fetchUtils: { updateLiveBanner },
    dispatch,
  } = useContextReducer.useContextReducer();
  const [tag, setTag] = useState(1);
  const [banner, setBanner] = useState(StateLiveBanner);
  const [cData, cDataSet] = useState([]);
  // 获取座驾信息存本地
  // 搜索
  const [search, searchSet] = useState(false);
  // 顶部弹窗
  const [visible1, setVisible1] = useState(false);
  // 搜索数据
  const [searchText, searchTextSet] = useState("");
  // 搜索结果
  const [searchData, searchDataSet] = useState({
    anchorResponses: undefined,
    liveResponses: undefined,
  });
  // 搜索中
  const [SpinLoadings, SpinLoadingsSet] = useState(false);
  // 切换
  const [CheckInd, CheckIndSet] = useState(0);

  const [confirms, confirmsSet] = useState(false);

  const searchTextRef = useRef("");
  // console.log(liveData, 'liveData----------');
  const loading = useMemo(() => liveData.tagListVOS == undefined, [liveData.tagListVOS]);
  const liveList = useMemo(() => {
    if (liveData.listDataVos != undefined && liveData.listDataVos[0] != undefined) {
      // return liveData[tag].listDataVos;
      let listDataVosD = [];
      if (liveData.tagListVOS[tag].liveIds != undefined && liveData.tagListVOS[tag].liveIds[0] != undefined) {
        liveData.tagListVOS[tag].liveIds.forEach((value) => {
          liveData.listDataVos.forEach((value_2) => {
            if (value == value_2.liveId) {
              listDataVosD = [...listDataVosD, value_2];
            }
          });
        });
      }
      return listDataVosD;
    } else return [];
  }, [liveData, tag]);

  useEffect(() => {
    let data = JSON.parse(sessionStorage.getItem("HistoryS")) || [];
    cDataSet(data);
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode == 13) {
      SpinLoadingsSet(true);
      liveSearchLiveLists(CheckInd);
    }
  };
  // 清空
  const onKeyDown2 = () => {
    confirmsSet(false); //取消清除状态
    SpinLoadingsSet(false);
    CheckIndSet(0);
    searchDataSet({
      anchorResponses: undefined,
      liveResponses: undefined,
    });
    searchTextSet("");
    searchTextRef.current = "";
  };

  const liveSearchLiveLists = (i) => {
    let data = [];
    if (searchTextRef.current.length > 0) {
      if (JSON.parse(sessionStorage.getItem("HistoryS")) == null || JSON.parse(sessionStorage.getItem("HistoryS")) == undefined) {
        cDataSet([searchTextRef.current]);
        sessionStorage.setItem("HistoryS", JSON.stringify([searchTextRef.current]));
      } else {
        data = JSON.parse(sessionStorage.getItem("HistoryS"));
        data.unshift(searchTextRef.current);
        let a = new Set(data);
        cDataSet([...a]);
        sessionStorage.setItem("HistoryS", JSON.stringify([...a]));
      }
    }
    if (i == 2) {
      SpinLoadingsSet(false);
      let b = [];
      if (liveData.listDataVos != undefined && liveData.listDataVos[0] != undefined) {
        b = liveData.listDataVos.filter((item, index) => {
          return item.liveListAnchorInfoVO.anchorId.toString().indexOf(searchTextRef.current) != -1 || item.liveListAnchorInfoVO.nickname.toString().indexOf(searchTextRef.current) != -1;
        });
      }
      searchDataSet({ anchorResponses: searchData.anchorResponses || [], liveResponses: b || [] });

      return;
    }

    liveSearchLiveList2({ text: searchTextRef.current }).then((item) => {
      console.log("获取itme-------搜索", item, liveData.listDataVos);
      SpinLoadingsSet(false);
      let a = [...item.anchorResponses];
      let b = [];
      if (liveData.listDataVos != undefined && liveData.listDataVos[0] != undefined) {
        b = liveData.listDataVos.filter((item, index) => {
          return item.liveListAnchorInfoVO.anchorId.toString().indexOf(searchTextRef.current) != -1 || item.liveListAnchorInfoVO.nickname.toString().indexOf(searchTextRef.current) != -1;
        });
      }
      if (i == 0) {
        searchDataSet({ anchorResponses: a.splice(0, 4), liveResponses: b.splice(0, 4) });
        return;
      }
      searchDataSet({ anchorResponses: a || [], liveResponses: b || [] });
    });
  };
  // 关注、取关
  const follow = async (d) => {
    liveFollow({ isFollow: !d.isFollow, targetId: d.anchorId }).then(() => {
      liveSearchLiveLists(CheckInd);
    });
  };
  //列表
  const listItem = () => {
    return (
      <Grid columns={2} gap={15} className={style.liveList}>
        {liveList.map((item, index) => {
          return (
            <Grid.Item key={index}>
              {/* {JSON.stringify(item)} */}
              {item?.liveListRoomBaseVO?.isAd === 1 ? (
                // 视频播放 体育流
                <div className={style.sportItem} onClick={() => history("/liveSport", { state: item })}>
                  <img src={item?.liveListRoomBaseVO?.livePicUrl || require("../../assets/image/live/sportBg.png")} alt="" />
                  <div className={style.text}>{item?.liveListAnchorInfoVO?.nickname}</div>
                </div>
              ) : (
                // 直播间
                <div
                  className={style.liveItem}
                  onClick={() => {
                    dispatch({
                      type: "UPDATE_ANCHORCARDREQ",
                      payload: {},
                    });
                    dispatch({ type: "live/SetLiveDetail", payload: item });
                    history("/liveRoom", { state: { liveId: item.liveId } });
                  }}>
                  {item?.liveListRoomBaseVO?.liveRoomLabel && (
                    <div className={style.liveLabel}>
                      <div className={style.liveLabel2}>
                        <span>{item?.liveListRoomBaseVO?.liveRoomLabel}</span>
                      </div>
                    </div>
                  )}
                  {/* 顶部游戏log */}
                  {item?.liveListRoomLotterys && item?.liveListRoomLotterys[0] != undefined && (
                    <div className={style.topsyx}>
                      {item?.liveListRoomLotterys.map((item_2) => {
                        return <img src={item_2.lorretyIcon} alt="" key={`${item_2.lorretyIcon}_${item_2.lotteryName}`} />;
                      })}
                    </div>
                  )}

                  {/* {item?.pking && <img src={require('../../assets/image/live/newPk.png')} className={style.pking} />} */}
                  {/* 图标 */}
                  {
                    <div className={style.pking}>
                      {item?.liveListRoomBaseVO?.pking && <img src={require("../../assets/image/live/newPk.png")} />}
                      {/* 福袋 */}
                      {item?.liveListActivityInfoVO?.isLuckBag == 1 && <img src={require("../../assets/image/live/fudai.png")} alt="" />}
                      {/* 转盘 */}
                      {item?.liveListActivityInfoVO?.isActivityRoulette == 1 && <img src={require("../../assets/image/live/zhuanpan.png")} alt="" />}
                      {/* 跳到 */}
                      {item?.liveListRoomBaseVO?.toy == 1 && <img src={require("../../assets/image/live/tiaodan.png")} alt="" />}
                    </div>
                  }
                  {/* 钱包 */}
                  {(item?.liveListRoomBaseVO?.type == 1 || item?.liveListRoomBaseVO?.type == 2) && (
                    <div className={style.liveRight}>
                      <img src={require("../../assets/image/live/roomprice.png")} alt="" style={{ borderRadius: "100%" }} />
                    </div>
                  )}
                  {/*锁 */}
                  {item?.liveListRoomBaseVO?.type == 3 && (
                    <div className={style.liveRight}>
                      <img src={require("../../assets/image/live/roompass.png")} alt="" style={{ borderRadius: "100%" }} />
                    </div>
                  )}
                  {/* 主播直播间/官方直播间取不同的封面字段 */}
                  {/* {item?.liveListRoomBaseVO?.isAutoLive == 1 ? <Image src={item?.liveListRoomBaseVO?.livePicUrl ? item?.liveListRoomBaseVO?.livePicUrl : require("../../assets/image/center/gyfbstitle.png")} alt="" className={style.backUrl} fit="cover" lazy="true" /> : <Image src={item?.liveListAnchorInfoVO?.avatar ? item?.liveListAnchorInfoVO?.avatar : require("../../assets/image/center/gyfbstitle.png")} alt="" className={style.backUrl} fit="cover" lazy="true" />} */}
                  <Image src={item?.liveListRoomBaseVO?.livePicUrl ? item?.liveListRoomBaseVO?.livePicUrl : require("../../assets/image/center/gyfbstitle.png")} fallback={<img src={require("../../assets/image/center/gyfbstitle.png")} alt="" />} alt="" className={style.backUrl} fit="cover" lazy="true" />
                  <div className={style.itemName}>
                    {/* 主播昵称，官方直播间昵称 */}
                    <div className={`${style.nickname} ${item?.liveListRoomBaseVO?.isAutoLive == 1 && style.auto}`}>
                      <div className={style.nickname_d1}>{item?.liveListAnchorInfoVO?.nickname}</div>
                      <div className={style.nickname_d2}>{item?.liveListAnchorInfoVO?.signature || t("jingwozhibojianbidingying")}</div>
                    </div>
                    {/* <TeamFill color='#fff' /> */}
                    <div className={style.right}>
                      <img src={require("../../assets/image/RankingList/zbz2s.png")} alt="" style={{ width: "24px", height: "12px" }} />
                      {item?.liveListRoomBaseVO?.rq}
                    </div>
                  </div>
                </div>
              )}
            </Grid.Item>
          );
        })}
      </Grid>
    );
  };

  // 骨架屏
  const listSk = () => {
    return (
      <Grid columns={2} gap={10}>
        <Grid.Item>
          <Skeleton animated className={style.customSkeleton} />
        </Grid.Item>
        <Grid.Item>
          <Skeleton animated className={style.customSkeleton} />
        </Grid.Item>
        <Grid.Item>
          <Skeleton animated className={style.customSkeleton} />
        </Grid.Item>
        <Grid.Item>
          <Skeleton animated className={style.customSkeleton} />
        </Grid.Item>
        <Grid.Item>
          <Skeleton animated className={style.customSkeleton} />
        </Grid.Item>
        <Grid.Item>
          <Skeleton animated className={style.customSkeleton} />
        </Grid.Item>
      </Grid>
    );
  };

  //banner
  useEffect(() => {
    let data = [];
    ad.forEach((value) => {
      // value.type!=11 不展示签到页面
      if (value.jumpUrl.length > 0 && value.jumpUrl != 1 && value.type != 11 && value.type != 16) {
        data = [...data, value];
      }
    });
    setBanner(data);
    updateLiveBanner(data);
  }, [ad]);
  // 首页第一个轮播
  const SwiperD = () => {
    const bannerClick = (data) => {
      if (data.type != 1001) {
        data.type == 1006 ? history("/promisionDetail", { state: { url: data.jumpUrl, tokens: true } }) : history("/promisionDetail", { state: { url: data.jumpUrl } });
      } else {
        history("/saveMoney");
      }
    };

    return (
      <Swiper className={style.banner} autoplay>
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
  // 首页头部
  const homeTop = () => {
    return (
      <>
        <div className={style.titles}>
          <div className={style.titles_left}>
            <img src={require("../../assets/image/live/fbslog.png")} alt="" />
            <div className={style.titles_left_font}>
              <div>FBSLIVE</div>
              <div className={style.font2}>fbslive.com</div>
            </div>
          </div>
          <div className={style.titles_right}>
            <img
              src={require("../../assets/image/live/home/ss.png")}
              alt=""
              onClick={() => {
                searchSet(true);
              }}
              style={{ marginRight: "14px" }}
            />
            <img src={require("../../assets/image/tx/kf.png")} alt="" onClick={() => history("/service")} />
          </div>
        </div>
      </>
    );
  };
  // 首页列表信息
  const homeAssembly = () => {
    return (
      <>
        <div className={style.liveBody}>
          {!loading ? (
            <div className={style.capBody}>
              <CapsuleTabs activeKey={tag.toString()} onChange={setTag} className={`${style.tap} noBor2`}>
                {liveData.tagListVOS != undefined &&
                  liveData.tagListVOS.map((item, index) => {
                    // item.tagId
                    return <CapsuleTabs.Tab title={item.tagName} key={index}></CapsuleTabs.Tab>;
                  })}
              </CapsuleTabs>
              {!loading && liveData.tagListVOS != undefined && liveData.tagListVOS.length > 0 && (
                <div
                  onClick={() => setVisible1(true)}
                  style={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    zIndex: "9",
                    right: "7px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: `url(${require("../../assets/image/live/home/morebj.png")})`,
                    backgroundSize: "100% 100%",
                    height: "38px",
                    width: "60px",
                  }}>
                  <img src={require("../../assets/image/live/home/more.png")} alt="" style={{ width: "19px", height: "19px" }} />
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "0 8px 6px" }}>
              <Skeleton animated className={[style.tagSkeleton, style.tap]} />
            </div>
          )}
          <div className={style.homeBody} style={{ position: "relative" }}>
            {liveList.length > 0 ? (
              tag == 1 ? (
                <div>
                  {SwiperD()}
                  {listItem()}
                </div>
              ) : (
                listItem()
              )
            ) : loading ? (
              listSk()
            ) : tag == 1 ? (
              <div>
                {SwiperD()} <Empty image={<img className="emptyImg" src={require("../../assets/image/center/xgjlnull.png")} />} description={t("noData")} />
              </div>
            ) : (
              <Empty image={<img className="emptyImg" src={require("../../assets/image/center/xgjlnull.png")} />} description={t("noData")} />
            )}
          </div>
          {/* 预约 */}
          {previewStatus.previewStatus == 1 && <Advance />}
          <TabBar active="/live" />
        </div>
      </>
    );
  };
  // 搜索框
  const inputAssembly = () => {
    return (
      <>
        <div>
          <div className={style.titles2}>
            <img
              src={require("../../assets/image/live/home/ss2.png")}
              alt=""
              onClick={() => {
                SpinLoadingsSet(true);
                liveSearchLiveLists(CheckInd);
              }}
            />
            <Input
              clearable
              onChange={(e) => {
                searchTextRef.current = e;
                searchTextSet(e);
              }}
              value={searchTextRef.current}
              onClear={() => {
                onKeyDown2();
              }}
              onKeyDown={(e) => {
                onKeyDown(e);
              }}
              placeholder={t("qingshuruIDhuonichen")}
              className={style.inputs}
              autoFocus></Input>{" "}
            <div
              onClick={() => {
                searchSet(false);

                onKeyDown2(); //清空
              }}>
              {t("btn_cancel")}
            </div>
          </div>
          {/* 切换tabs */}
          {searchData.anchorResponses !== undefined && searchData.liveResponses !== undefined && (searchData.anchorResponses[0] !== undefined || searchData.liveResponses[0] !== undefined) ? (
            <div className={style.titles3}>
              <div
                className={`${style.titles3_div} ${CheckInd == 0 ? style.Check_color : ""}`}
                onClick={() => {
                  CheckIndSet(0), SpinLoadingsSet(true), liveSearchLiveLists(0);
                }}>
                {t("searchAll")}
                <div className={`${CheckInd == 0 ? style.titles3_div2 : style.titles3_div3}`}></div>
              </div>
              <div
                className={`${style.titles3_div} ${CheckInd == 1 ? style.Check_color : ""}`}
                onClick={() => {
                  CheckIndSet(1), SpinLoadingsSet(true), liveSearchLiveLists(1);
                }}>
                {t("searchAnchor")}
                <div className={`${CheckInd == 1 ? style.titles3_div2 : style.titles3_div3}`}></div>
              </div>
              <div
                className={`${style.titles3_div} ${CheckInd == 2 ? style.Check_color : ""}`}
                onClick={() => {
                  CheckIndSet(2), SpinLoadingsSet(true), liveSearchLiveLists(2);
                }}>
                {t("live")}
                <div className={`${CheckInd == 2 ? style.titles3_div2 : style.titles3_div3}`}></div>
              </div>
            </div>
          ) : (
            // 历史记录
            cData.length > 0 && (
              <div className={style.HistoryD}>
                <div className={style.HistoryD_title}>
                  {t("lishisousuo")}:
                  {confirms ? (
                    <div
                      className={style.confirms}
                      onClick={() => {
                        confirmsSet(false);
                        cDataSet([]);
                        sessionStorage.setItem("HistoryS", JSON.stringify([]));
                      }}>
                      xóa
                    </div>
                  ) : (
                    <img
                      src={require("../../assets/image/live/home/sc.png")}
                      alt=""
                      className={style.HistoryD_img}
                      onClick={() => {
                        confirmsSet(true);
                      }}
                    />
                  )}
                </div>
                {/* 内容 */}
                <div className={style.HistoryD_content}>
                  {cData
                    .filter((i, index) => index < 10)
                    .map((value, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            (searchTextRef.current = value), searchTextSet(value), liveSearchLiveLists(0);
                          }}>
                          {value}
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          )}
        </div>
      </>
    );
  };
  // 搜索内容
  const searchFor = () => {
    return (
      <>
        {searchData.anchorResponses == undefined && searchData.liveResponses == undefined ? (
          SpinLoadings ? (
            <SpinLoading style={{ "--size": "48px" }} className={style.SpinLoading} />
          ) : (
            ""
          )
        ) : // SpinLoading ? <SpinLoading style={{ '--size': '48px' }} /> :
          SpinLoadings ? (
            <SpinLoading style={{ "--size": "48px" }} className={style.SpinLoading} />
          ) : searchData.anchorResponses[0] !== undefined || searchData.liveResponses[0] !== undefined ? (
            <div className={style.searchData}>
              {/* 标题 */}
              {CheckInd == 0 && (
                <div className={style.searchData_title}>
                  <div>{t("RelatedAnchors")}</div>
                  <div
                    className={style.searchData_title_right}
                    onClick={() => {
                      CheckIndSet(1), SpinLoadingsSet(true), liveSearchLiveLists(1);
                    }}>
                    {t("ui_more")} <img src={require("../../assets/image/live/home/right.png")} alt="" />
                  </div>
                </div>
              )}

              {((searchData.anchorResponses !== undefined && searchData.liveResponses !== undefined && searchData.anchorResponses[0] !== undefined && CheckInd == 0) || CheckInd == 1) && (
                <div className={style.OutermostLayer}>
                  {searchData.anchorResponses !== undefined && searchData.anchorResponses[0] !== undefined ? (
                    searchData.anchorResponses.map((value) => {
                      return (
                        <div
                          key={value.anchorId}
                          className={style.Swipers}
                          onClick={() => {
                            follow(value);
                          }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Avatar src={value?.avatar} style={{ "--border-radius": "100%", width: "44px", height: "44px", marginRight: "12px" }} fallback={<img src={require("../../assets/image/join/logo.png")} />} />
                            <div className={style.Swipers_font1B}>
                              <div className={style.Swipers_font12}>
                                <div>{value.nickname}</div>{" "}
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <img className={style.level} src={require(`../../assets/image/live/level_${value.userLevel ? value.userLevel : 1}.png`)} />
                                  {value.sex !== 0 && <img className={style.imgs} src={value.sex == 2 ? require("../../assets/image/center/woman.png") : value.sex == 1 ? require("../../assets/image/center/man.png") : ""} alt="" />}
                                </div>{" "}
                              </div>
                              <div className={style.Swipers_font1}>{value.signature?.length > 0 ? value.signature : t("zhegeyonghuhenlanshenmedoumeiyouliuxia")}</div>
                            </div>
                          </div>
                          {/* <div className={style.Swipers_font2}><img src={require('../../assets/image/live/home/ID.png')} alt="" />3241231242</div> */}

                          {/* <div className={style.Swipers_But} onClick={() => { console.log('关注') }}>+关注</div> */}

                          {/* <div className={style.Swipers_But} >+关注</div> */}
                          {value?.isFollow ? <Button className={style.Swipers_But2}>{t("yiguanzhu")}</Button> : <Button className={style.Swipers_But}>+{t("guanzhu")}</Button>}
                        </div>
                      );
                    })
                  ) : (
                    <Empty className={style.EmptyD} image={<img className="emptyImg" src={require("../../assets/image/center/wssnull.png")} />} description={t("meiyouzhaodaoxiangguanjieguo")} />
                  )}
                </div>
              )}

              {/* 标题 */}
              {CheckInd == 0 && (
                <div className={style.searchData_title}>
                  <div>{t("xingguanzhibo")}</div>
                  <div
                    className={style.searchData_title_right}
                    onClick={() => {
                      CheckIndSet(2), SpinLoadingsSet(true), liveSearchLiveLists(2);
                    }}>
                    {t("ui_more")} <img src={require("../../assets/image/live/home/right.png")} alt="" />
                  </div>
                </div>
              )}
              {((searchData.anchorResponses !== undefined && searchData.liveResponses !== undefined && searchData.liveResponses[0] !== undefined && CheckInd == 0) || CheckInd == 2) && (
                <Grid columns={2} gap={15} className={style.liveList}>
                  {searchData.liveResponses !== undefined && searchData.liveResponses[0] !== undefined ? (
                    searchData.liveResponses.map((item, index) => {
                      return (
                        <Grid.Item key={index}>
                          {/* {JSON.stringify(item)} */}
                          {item?.liveListRoomBaseVO?.isAd === 1 ? (
                            // 视频播放 体育流
                            <div className={style.sportItem} onClick={() => history("/liveSport", { state: item })}>
                              <img src={item?.liveListRoomBaseVO?.livePicUrl || require("../../assets/image/live/sportBg.png")} alt="" />
                              <div className={style.text}>{item?.liveListAnchorInfoVO?.nickname}</div>
                            </div>
                          ) : (
                            // 直播间
                            <div
                              className={style.liveItem}
                              onClick={() => {
                                dispatch({
                                  type: "UPDATE_ANCHORCARDREQ",
                                  payload: {},
                                });
                                dispatch({ type: "live/SetLiveDetail", payload: item });
                                console.log("跳转2");
                                history("/liveRoom", { state: { liveId: item.liveId } });
                              }}>
                              {item?.liveListRoomBaseVO?.liveRoomLabel && (
                                <div className={style.liveLabel}>
                                  <div className={style.liveLabel2}>
                                    <span>{item?.liveListRoomBaseVO?.liveRoomLabel}</span>
                                  </div>
                                </div>
                              )}
                              {/* 顶部游戏log */}
                              {item?.liveListRoomLotterys && item?.liveListRoomLotterys[0] != undefined && (
                                <div className={style.topsyx}>
                                  {item?.liveListRoomLotterys.map((item_2) => {
                                    return <img src={item_2.lorretyIcon} alt="" key={`${item_2.lorretyIcon}_${item_2.lotteryName}`} />;
                                  })}
                                </div>
                              )}

                              {/* {item?.pking && <img src={require('../../assets/image/live/newPk.png')} className={style.pking} />} */}
                              {/* 图标 */}
                              {
                                <div className={style.pking}>
                                  {item?.liveListRoomBaseVO?.pking && <img src={require("../../assets/image/live/newPk.png")} />}
                                  {/* 福袋 */}
                                  {item?.liveListActivityInfoVO?.isLuckBag == 1 && <img src={require("../../assets/image/live/fudai.png")} alt="" />}
                                  {/* 转盘 */}
                                  {item?.liveListActivityInfoVO?.isActivityRoulette == 1 && <img src={require("../../assets/image/live/zhuanpan.png")} alt="" />}
                                  {/* 跳到 */}
                                  {item?.liveListRoomBaseVO?.toy == 1 && <img src={require("../../assets/image/live/tiaodan.png")} alt="" />}
                                </div>
                              }
                              {/* 钱包 */}
                              {(item?.liveListRoomBaseVO?.type == 1 || item?.liveListRoomBaseVO?.type == 2) && (
                                <div className={style.liveRight}>
                                  <img src={require("../../assets/image/live/roomprice.png")} alt="" style={{ borderRadius: "100%" }} />
                                </div>
                              )}
                              {/*锁 */}
                              {item?.liveListRoomBaseVO?.type == 3 && (
                                <div className={style.liveRight}>
                                  <img src={require("../../assets/image/live/roompass.png")} alt="" style={{ borderRadius: "100%" }} />
                                </div>
                              )}
                              {/* 主播直播间/官方直播间取不同的封面字段 */}
                              {/* {item?.liveListRoomBaseVO?.isAutoLive == 1 ? <Image src={item?.liveListRoomBaseVO?.livePicUrl ? item?.liveListRoomBaseVO?.livePicUrl : require("../../assets/image/center/gyfbstitle.png")} alt="" className={style.backUrl} fit="cover" lazy="true" /> : <Image src={item?.liveListAnchorInfoVO?.avatar ? item?.liveListAnchorInfoVO?.avatar : require("../../assets/image/center/gyfbstitle.png")} alt="" className={style.backUrl} fit="cover" lazy="true" />} */}
                              {/* <Image src={item?.liveListRoomBaseVO?.livePicUrl || require("../../assets/image/center/gyfbstitle.png")} alt="" className={style.backUrl} fit="cover" lazy="true" /> */}
                              <Image src={item?.liveListRoomBaseVO?.livePicUrl ? item?.liveListRoomBaseVO?.livePicUrl : require("../../assets/image/center/gyfbstitle.png")} fallback={<img src={require("../../assets/image/center/gyfbstitle.png")} alt="" />} alt="" className={style.backUrl} fit="cover" lazy="true" />
                              <div className={style.itemName}>
                                {/* 主播昵称，官方直播间昵称 */}
                                <div className={`${style.nickname} ${item?.liveListRoomBaseVO?.isAutoLive == 1 && style.auto}`}>
                                  <div className={style.nickname_d1}>{item?.liveListAnchorInfoVO?.nickname}</div>
                                  <div className={style.nickname_d2}>{item?.liveListAnchorInfoVO?.signature || t("jingwozhibojianbidingying")}</div>
                                </div>
                                {/* <TeamFill color='#fff' /> */}
                                <div className={style.right}>
                                  <img src={require("../../assets/image/RankingList/zbz2s.png")} alt="" style={{ width: "24px", height: "12px" }} />
                                  {item?.liveListRoomBaseVO?.rq}
                                </div>
                              </div>
                            </div>
                          )}
                        </Grid.Item>
                      );
                    })
                  ) : (
                    <Empty className={style.EmptyD} image={<img className="emptyImg" src={require("../../assets/image/center/wssnull.png")} />} description={t("meiyouzhaodaoxiangguanjieguo")} />
                  )}
                </Grid>
              )}
            </div>
          ) : (
            <Empty className={style.EmptyD} image={<img className="emptyImg" src={require("../../assets/image/center/wssnull.png")} />} description={t("meiyouzhaodaoxiangguanjieguo")} />
          )}
      </>
    );
  };

  return (
    <div className={style.liveBody}>
      {!search
        ? // 首页头部
        homeTop()
        : // input框
        inputAssembly()}
      <div style={{ position: "relative", minHeight: "calc(100vh - 55px)" }}>
        {!search
          ? // 首页内容
          homeAssembly()
          : // 搜索内容
          searchFor()}
      </div>

      <Popup
        position="top"
        visible={visible1}
        destroyOnClose={true}
        onMaskClick={() => {
          setVisible1(false);
        }}
        bodyStyle={{ minHeight: "20vh", borderRadius: "0 0 18px 18px" }}
      // style={{ borderRadius: '0 0 18px 18px' }}
      >
        <div className={style.Popup_title}>
          <div>{t("biaoqian")}</div>
          <img
            onClick={() => {
              setVisible1(false);
            }}
            src={require("../../assets/image/live/home/close.png")}
            alt=""
          />
        </div>
        {/* 内容标签选择 */}
        <div className={style.Popup_center}>
          {liveData.tagListVOS != undefined &&
            liveData.tagListVOS.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${style.Popup_center_div}  ${tag == index ? style.Check : ""}`}
                  onClick={() => {
                    setTag(index);
                    setVisible1(false);
                  }}>
                  {item.tagName}
                </div>
              );
            })}
        </div>
      </Popup>
    </div>
  );
};

export default Live;
