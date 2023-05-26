import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Local } from "../../common";
import { useTranslation } from "react-i18next";
import { getSearchData } from "../../common";
import { GetUserCard, GetLiveRecharge, GetCurFlagOpenGame, GetLiveList, LiveHeart } from "../../api/live";
import { message, Skeleton } from "antd";
import RankList from "./components/rankList.jsx";
import GameList from "./components/gameList.jsx";
import SuggestedList from "./components/suggestedList.jsx";
import Chat from "./components/chat";
import TopInfo from "./components/topInfo";
import BottomInfo from "./components/bottomInfo";
import Player from "./components/player2";
import Redux from "../../components/common/redux";
import "./detail.scss";
import Crowdfunding from "./components/crowdfunding";
import SVGAPlay from './components/SVGAPlay'
import ShowTypes from './components/ShowTypes'
import EnterPass from "./components/EnterPass";
import EnterPay from "./components/EnterPay";
import { useLocation, useNavigate } from "react-router-dom";
import useContextReducer from '../../state/useContextReducer'
const AnchorCard = React.lazy(() => import("./components/anchorCard/index"));
import VAPPC from '../../components/vapPC'
import { uuidv4 } from '../../utils/tools';


let heartTime = null;
let crowdfundingList = [
  { goldCoin: 2, cover: 'https://ossimg.fbs55.com/game/game_1647935596000.png', gid: 126, gname: "Quần lọt khe", num: 50, all: 51 },
  { goldCoin: 2, cover: 'https://ossimg.fbs55.com/game/game_1647935596000.png', gid: 148, gname: "Quần lọt khe", num: 9, all: 10 },
  // { goldCoin: 2, cover: 'https://ossimg.fbs55.com/game/game_1647935596000.png', gid: 126, gname: "Quần lọt khe", num: 200, all: 100 },
]
let rGiftTimer = null
let rTimer = null
let times
const LiveDetail = (props) => {
  const { t } = useTranslation();
  const history = useNavigate()
  const { state } = useLocation();
  const {
    state: State,
    dispatch,
    fetchUtils: { userGetUserAsserGold, GetPkStatus, freshUser, HandleGetGiftData },
  } = useContextReducer.useContextReducer();
  const {
    live: { liveDetail, liveData, socket, RoomPkStatus, verticalScreen, giftData, giftList },
    user,
  } = State;

  const [userInfo, userInfoSet] = useState({})
  const [live, liveSet] = useState()
  const [lsData, lsDataSet] = useState({})
  const [FreshUser, FreshUserSet] = useState(null)
  const [isAd, isAdSet] = useState(0)
  const [baseInfo, baseInfoSet] = useState({})
  // const [giftList, giftListSet] = useState([])
  const [crowdfundingData, crowdfundingDataSet] = useState({
    crowdfundingList,
    avatarList: ['http://fbslive.oss-ap-southeast-1.aliyuncs.com/3014112347_1672761391_avatar.png', 'http://fbslive.oss-ap-southeast-1.aliyuncs.com/3014112347_1672761391_avatar.png']
  })
  const [userLevels, userLevelsSet] = useState('')
  const [gameResults, gameResultsSet] = useState({})
  const [showAniList, showAniListSet] = useState([])
  const [gid, gidSet] = useState('')
  const [gameResultList, gameResultListSet] = useState([])
  const [password, passwordSet] = useState('')
  const [modalVisible, modalVisibleSet] = useState(false)
  const [modalContent, modalContentSet] = useState('')
  const [suspendDataSet, suspendDataSetSet] = useState(false)
  const [pikingResult, pikingResultSet] = useState(null)
  const [gameResult, gameResultSet] = useState(null)
  const [crowdfundingVisible, crowdfundingVisibleSet] = useState(false)
  const [waterTop, waterTopSet] = useState('24px')
  const [needPay, needPaySet] = useState(false)
  const [needPass, needPassSet] = useState(false)
  const [enterPays, enterPaysSet] = useState(true) //付费房间
  // 是否需要支付
  const [isClose, setIsClose] = useState(false);

  const [display, displaySet] = useState(false)
  const [pkingShow, pkingShowSet] = useState(false)
  const [videoInfo, setVideoInfo] = useState([])
  const [videoInfo3, videoInfo3Set] = useState([])

  const [resourceUrls, resourceUrlsSet] = useState([])

  const gidRef = useRef('')
  const userLevelsRef = useRef('')
  const gameResultsRef = useRef({})
  const baseInfoRef = useRef({})
  const dataRef = useRef({})
  const displayRef = useRef(false)
  const resourceUrlRef = useRef([])


  useEffect(() => {
    HandleGetGiftData()
  }, [])

  // console.log('giftList-------------giftList', giftList);
  const getUser = (userInfo) => {
    // console.log('userInfo---------------------datail', baseInfoRef.current, userInfo);
    userInfoSet(userInfo)
  }
  const getLive = (live) => {
    liveSet(live)
  }
  const cancelLook = () => {
    window.location.href = "/live/list";
  }
  const sureToRoom = () => {
    getLiveRecharge(lsData);
  }
  const getFreshUser = (FreshUser) => {
    FreshUserSet(FreshUser)
  }
  //初始化房间
  const initRoom = useCallback(() => {
    let { liveId } = state;
    dispatch({ type: "live/EventHandleSetLiveDetail", payload: liveId });
  }, []);
  useEffect(() => {
    if (!state) return;
    if (!liveDetail.liveId && liveData.listDataVos.length > 0) initRoom();
  }, [initRoom, liveDetail, liveData, Local('userInfo2')?.uid, socket]);

  useEffect(() => {
    // handleHeart();
    setTimeout(() => {
      window.eventBus.emit("checkTolive", true);
    }, 10);
    document.querySelector("html").scrollTo(0, 0);

    const token = Local("token2");
    if (!token) return (window.location.href = "/");
    const urlSearch = window.location.href;
    let data = getSearchData(urlSearch);
    dataRef.current = data


    isAdSet(data.isAd)


    baseInfoRefF(data) //判断是否有付费




    // handleHeart(data);
    if (data?.pking == "true") {
      setTimeout(() => {
        checkPcStatus(1);
      }, 3000);
    }
    rGiftTimer = setInterval(() => rGiftList(), 1000);
    // this.curFlagOpenGame()
    checkPking(data);
    return () => {
      window.eventBus.emit("checkTolive", false);
      clearTimeout(rTimer);
      clearInterval(rGiftTimer);
      clearTimeout(heartTime);
    }
  }, [])


  const needPassF = () => {
    if (!state) needPassSet(false);
    // let { password } = state;
    needPassSet(liveDetail.liveListRoomBaseVO.type == 3 && !state?.password)
  }
  useEffect(() => {
    needPassF()
  }, [liveDetail, state, liveDetail.liveListRoomBaseVO.type])

  const baseInfoRefF = (data) => {
    let datas = data
    if (data == undefined) {
      datas = dataRef.current
    }
    // 1按时收费 2按次数收费 3 需要密码
    if ([1, 2].includes(parseInt(datas.type))) {
      // 超管账号无需提示付费弹窗
      if (datas.manage != 1) {
        baseInfoRef.current = Object.assign({}, baseInfoRef.current, data)

      } else {
        // baseInfoSet(Object.assign({}, baseInfo, data))

        baseInfoRef.current = Object.assign({}, baseInfoRef.current, datas)
      }
    } else if (datas.isAd != 1) {
      getUserCard(datas);
    } else {
      // baseInfoSet(Object.assign({}, baseInfo, data))
      baseInfoRef.current = Object.assign({}, baseInfoRef.current, datas)
    }
  }
  // 进房心跳
  // const handleHeart = (live = {}) => {
  //   if (!live.liveId) return;
  //   LiveHeart({ liveId: live.liveId });
  //   heartTime = setTimeout(() => {
  //     handleHeart(live);
  //   }, 50000);
  // }

  useEffect(() => {
    checkPking()
  }, [liveData])

  const checkPking = async () => {
    // const res = await GetLiveList({ type: 1 });
    // if (!(res instanceof Error)) {
    //   let [data] = res.filter((item) => item.anchorId == query.anchorId);
    //   if (data?.pking && query?.pking != "true") {
    //     checkPcStatus(1);
    //   }
    // }
    const urlSearch = window.location.href;
    let query = getSearchData(urlSearch);
    if (liveData && liveData.listDataVos) {
      let [data] = liveData.listDataVos.filter((item) => item.liveListRoomBaseVO.anchorId == query.anchorId);
      if (data?.liveListRoomBaseVO?.pking && query?.pking != "true") {
        checkPcStatus(1);
      }
    }
  }
  const getGiftList = (giftList) => {
    // giftListSet(giftList)

  }

  const setCrowdFunding = ({ gid, avatar }) => {
    let { crowdfundingList, avatarList } = crowdfundingData
    let list = crowdfundingList.slice(0)
    let list2 = avatarList.slice(0)
    list.forEach(item => {
      if (item.gid == gid) {
        item.num += 1
        list2.push(avatar)
      }
    })

    crowdfundingDataSet({
      crowdfundingList: list,
      avatarList: list2
    })
  }
  // 结果分发
  const onShowResult = (gameResult) => {
    let { status, protocol, showType } = gameResult;
    if (protocol == 29) {
      kjResult(gameResult);
      // 刷礼物
    } else if (protocol == 7) {
      setCrowdFunding(gameResult)

      addAniList(gameResult);

      if (gameResult.giftType !== 20 || gameResult.giftType === 10) {
        addAni(gameResult);
      }


      // pk数据刷新
    } else if (protocol == 24) {
      pkResult(gameResult);
      // pk状态 1开启 2关闭
    } else if (protocol == 18) {
      console.log('gameResult---------------------', gameResult);
      checkPcStatus(status);
    }
    else if (protocol == 21) {
      let listDataVos = liveData?.listDataVos || [];
      listDataVos.forEach((value) => {
        if (value.liveId == gameResult.liveId) {
          console.log(1, value.liveListRoomBaseVO);
          value.liveListRoomBaseVO.type = gameResult.type;
          value.liveListRoomBaseVO.roomPwd = gameResult.roomPwd;
          value.liveListRoomBaseVO.roomPrice = gameResult.roomPrice;
        }
      });

      let LiveData = {
        listDataVos: listDataVos,
        tagListVOS: liveData.tagListVOS,
      };
      // 是否是当前直播间
      if (gameResult.liveId == liveDetail?.liveId) {
        let LiveDetail = listDataVos.filter((value) => value.liveId == gameResult.liveId);
        // 当前选中数据更新
        if (LiveDetail[0] != undefined) {
          dispatch({ type: "live/SetLiveDetail", payload: LiveDetail[0] });
          window.eventBus.emit("switchF", gameResult); //传递状态数据判断
        }
      }
      // 更新直播间列表
      dispatch(() => {
        return {
          type: "live/SetLiveData",
          payload: LiveData,
        };
      });
    }
    else if (protocol == 5) {
      if (showType == 0) {
        // let LevelProp = Local('LevelProp_pc') || []
        // let [data] = LevelProp?.filter((val) => val.level == gameResult.userLevel);
        // console.log('datasssss------', data);
        // let { videoUrl, videoJson } = data;
        // if (videoUrl && videoJson) {
        //   console.log('videoUrl', videoUrl, gameResult.avatar, gameResult?.nickname);
        //   // setVideoInfo((e) => {
        //   //   return [...e, { src: videoUrl, config: videoJson, srcTag: gameResult.avatar, textTag: `${gameResult?.nickname} ${t("enterRoom")}` }];
        //   // });
        // } else {
        userLevelsSet(gameResult.userLevel)
        gameResultsSet(gameResult)

        userLevelsRef.current = gameResult.userLevel
        gameResultsRef.current = gameResult
        // }
      }
    }
  }
  const addAni = (obj) => {
    if (Local('GiftData-pc')) {
      let [data] = Local('GiftData-pc').reduce((sum, item) => {
        sum = [...sum, ...item.propBaseResponses];
        return sum;
      }, []).filter((val) => val.gid === obj.gid)
      // let [data] = giftList.filter((val) => val.gid === obj.gid);
      console.log("当前动画", data);
      // 暂时隐藏mp4
      // let { videoUrl, videoJson } = data;
      // if (videoUrl && videoJson) {
      //   videoInfo3Set((e) => {
      //     return [...e, { src: videoUrl, config: videoJson }];
      //   });
      // } else {
      if (data) {
        resourceUrlsSet((e) => {
          return [...e, { url: data?.resourceUrl, time: uuidv4() }];
        })
        resourceUrlRef.current = [...resourceUrlRef.current, { url: data?.resourceUrl, time: uuidv4() }]
      }
      // }

    }
  }

  const addAniList = (gift) => {
    gift.timer = 4;
    gift.isShow = true;
    let bol = showAniList.some((item, index) => {
      if (item.gid == gift.gid && item.uid == gift.uid) {
        let combo = parseInt(showAniList[index].combo) + parseInt(gift.combo);
        showAniList[index].combo = combo;
        showAniList[index].timer = 4;
        return true;
      }
    });
    if (!bol) {
      showAniList.push(gift);
    }
    showAniListSet(showAniList)
  }
  const svgaPlay = (gids) => {
    // if (giftData) {
    //   let [data] = giftData.filter((val) => val.gid == gids.gid);
    //   console.log("当前动画", data);
    //   let { videoUrl, videoJson } = data;
    //   if (videoUrl && videoJson) {
    //     videoInfo3Set((e) => {
    //       return [...e, { src: videoUrl, config: videoJson }];
    //     });
    //   } else {
    //     gidSet(gids.gid)
    //     gidRef.current = gids.gid
    //   }
    // }



  }

  const rGiftList = () => {
    if (!showAniList.length) return;
    let len = showAniList.length > 10 ? 10 : showAniList.length;
    for (let i = 0; i < len; i++) {
      if (showAniList.length && showAniList[i]) {
        if (showAniList[i].timer <= 1) {
          showAniList[i].isShow = false;
        }
        if (showAniList[i].timer <= 0) {
          showAniList.splice(i, 1);
          i--;
        }
        if (showAniList.length) {
          if (showAniList[i]) {
            showAniList[i].timer--;
          }
        }
      }
    }
    showAniListSet(showAniList)
  }
  const checkPcStatus = (status) => {
    pkingShowSet(status == 1)

    let search = location.search;
    if (status == 1) {
      dispatch({ type: "live/SwitchPk", payload: true });
      // playerDom.getLiveDetail();

      // setTimeout(() => {
      //   window.eventBus.emit('getLiveDetails')
      // }, 200)

      // search = search.replace("pking=false", "pking=true");
    } else {
      dispatch({ type: "live/SwitchPk", payload: false });
      // setTimeout(() => {
      //   window.eventBus.emit('getLiveDetails')
      // }, 200)

      // search = search.replace("pking=true", "pking=false");
      // window.location.reload();
    }
    // history.pushState({}, "", search);
  }
  // 展示中奖结果
  const kjResult = (gameResult) => {
    let list = gameResultList.slice(0);
    list.push(gameResult);

    gameResultListSet(list)

    gameResultsSet(gameResult)
    gameResultsRef.current = gameResult

    clearTimeout(rTimer);
    rTimer = setTimeout(() => {
      gameResultListSet(list)
      gameResultsSet(gameResult)

      gameResultsRef.current = gameResult
    }, 16000);

  }
  // 获取pk数据
  const pkResult = (pikingResult) => {
    let timers = new Date().getTime();
    pikingResult.timers = timers;
    // playerDom && playerDom.reinitGefit(pikingResult);
    window.eventBus.emit('reinitGefits', pikingResult)

  }

  const changPassward = (password) => {
    passwordSet(password)

  }
  const getLiveRecharge = (data) => {
    GetLiveRecharge(data).then((rt) => {
      if (rt) {
        // baseInfoSet(Object.assign({}, baseInfo, data))

        baseInfoRef.current = Object.assign({}, baseInfoRef.current, data)

        modalVisibleSet(false)

        getUserCard(data)

      } else {
        window.location.href = "/live/list";
      }
    });
  }

  const getUserCard = (data, cb) => {
    GetUserCard({ uid: data.anchorId })
      .then((rt) => {
        // console.log('rt-------', rt);

        baseInfoRef.current = Object.assign({}, baseInfoRef.current, data, rt)
        // console.log('baseInfoRef.current---------', baseInfoRef.current);
        baseInfoSet(Object.assign({}, baseInfoRef.current, data, rt))

        cb && cb();
      })
      .catch(() => {
        cb && cb();
      });
  }
  const getTopSkeleton = () => {
    return (
      <div className="container-live-top" style={{ height: 80 }}>
        <div className="container-live-top-left">
          <Skeleton.Image size="small" active="true" className="avatar" />
          <div>
            <Skeleton.Input active="true" className="container-live-top-left-title" />
          </div>
        </div>
        <div className="container-live-top-right">
          <Skeleton.Input active="true" />
        </div>
      </div>
    );
  }
  const getBottomSkeleton = () => {
    return <div className="live-detail-bottom-box"></div>;
  }
  const getRightSkeleton = () => {
    return (
      <div className="live-detail-right">
        <div className="live-detail-right-top">{t("live_sl")} </div>
        <div style={{ position: "absolute", bottom: 10 }}>
          <Skeleton.Input style={{ width: "276px", height: 40, marginLeft: 0, borderRadius: 10 }} active="true" />
        </div>
      </div>
    );
  }
  const getRankListSkeleton = () => {
    return (
      <div className="rank-list-box">
        <div className="title">{t("f_ui_wap_text_028")}</div>
      </div>
    );
  }
  const getGameListSkeleton = () => {
    return (
      <div className="container-game-list">
        <div className="title">{t("live_gamelist")}</div>
      </div>
    );
  }
  const suspendDataF = () => {
    return (
      <div className="roomClosed">
        <div className="roomClosed_center">
          <img src={require("../../assets/images/live/lk.png")} alt="" style={{ width: "43px", height: "46px", marginBottom: "12px" }} />
          <div className="roomClosed_center2">{t("zhi_bo_lk")}</div>
          <div>{t("zhi_bo_xxpk")}</div>
        </div>
      </div>
    );
  }

  // 判断是否关闭直播间
  useEffect(() => {
    window.eventBus.addListener("setIsCloseF", setIsCloseF);
    window.eventBus.addListener("switchF", switchF);
    return () => {
      window.eventBus.removeListener("setIsCloseF", setIsCloseF); // 判断切换房间
      window.eventBus.removeListener("switchF", switchF);
    }
  }, [])
  const setIsCloseF = () => {
    needPassSet(false)
    enterPaysSet(false)

    setIsClose(true)
    message.warning({
      content: `${t('zhi_bo_jiesu')}`,
      duration: 3
    })
    history(-1)
  }

  // 判断切换房间
  const switchF = (e) => {
    clearTimeout(times);
    if (e.type == 0) { //普通房
      // displaySet(false)
      displayRef.current = false

      setIsClose(false)
      needPaySet(false)
      needPassSet(false)
      enterPaysSet(false)
    }
  }

  useEffect(() => {
    // console.log("timeType1F", Local("payed" + liveDetail.liveId), 1 * 60);

    //  state.timeType1F != undefined
    if (Local("payed" + liveDetail.liveId) != undefined) {
      clearTimeout(times);
      timeType1F();
    }
    return () => {
      console.log("关闭---------------------");
      clearTimeout(times);
    };
  }, [state?.timeType1F, Local("payed" + liveDetail.liveId)]);
  // type==1 计时收费
  const timeType1F = () => {
    times = setTimeout(() => {
      // console.log('Local("payed" + liveId)--------------------2', liveDetail.liveId, Local("payed" + liveDetail.liveId));
      if (Local("payed" + liveDetail.liveId) == undefined) {
        clearTimeout(times);
        GetLiveRechargeF();
      }
      timeType1F();
    }, 1000);
  };

  // 计时扣费
  const GetLiveRechargeF = async () => {
    // console.log(liveDetail.liveListRoomBaseVO?.roomPrice, Local('assergold')?.goldCoin, 'assergoldData?.goldCoin----------------');

    if (liveDetail.liveListRoomBaseVO?.roomPrice > Local("userInfo2")?.goldCoin) {
      clearTimeout(times);
      // console.log("没钱");
      setVisible2(true);
      return;
    }
    const res = await GetLiveRecharge({ anchorId: liveDetail.liveListAnchorInfoVO.anchorId, liveId: liveDetail.liveId });
    if (!(res instanceof Error)) {
      if (res?.code === 3001) {
        history(-1);
        Toast.show(res.msg);
      } else {
        // console.log("调用计时扣费");
        clearTimeout(times);

        timeType1F();
        Local("payed" + liveDetail.liveId, true, 1 * 60);
        // userGetUserAsserGold();
        freshUser()
        // assergold2
      }
    }
  };

  // 播放回调
  const unmixed = (e) => {
    let data1 = [...resourceUrlRef.current]
    data1.forEach((value, index) => {
      if (value.time == e) {
        data1.splice(index, 1)
      }
    })
    console.log('data1------', data1);
    resourceUrlsSet(data1)
    resourceUrlRef.current = data1
  }

  return (
    <div className={"live-detail-container " + (baseInfoRef.current.isAd == 1 && "w-1200")}>
      <Redux getFreshUser={getFreshUser} getUser={getUser} getLive={getLive} />

      {/* 蒙尘 */}
      {needPay && <div className='disgraceful'>
      </div>}

      {needPass && <EnterPass needPass={() => needPassSet(false)} />}
      {
        Local("userInfo2")?.manage != 1 && enterPays &&
        <EnterPay displaySetF={(e) => {
          displayRef.current = e
        }}
          // baseInfoRefF={() => baseInfoRef.current = Object.assign({}, baseInfoRef.current, dataRef.current)} 
          needPaySet={(e) => {
            needPaySet(e)
          }}
        />}

      <div className="live-detail">
        {/* 直播左边栏 */}
        <div className="live-detail-left">
          {/* 顶部 */}
          {
            !needPass && !needPay && !isClose && baseInfoRef.current.anchorId &&
              isAd != 1 ? <TopInfo onGetBase={(cb) => getUserCard(baseInfoRef.current, cb)} baseInfo={baseInfoRef.current} /> : isAd == 1 ? "" : getTopSkeleton()}
          {/* 中间 */}
          <div className="live-detail-left-con">
            <div className="live-detail-left-con-l">
              {/* 排行榜 */}
              <div className="live-detail-left-con-l-t">{!needPass && !needPay && !isClose && baseInfoRef.current.anchorId ? <RankList anchorId={baseInfoRef.current.anchorId} /> : getRankListSkeleton()}</div>
              {/* 游戏列表 */}
              <div className="live-detail-left-con-l-b">{!needPass && !needPay && !isClose && baseInfoRef.current.anchorId ? <GameList FreshUser={userGetUserAsserGold} userInfo={userInfo} getGiftList={getGiftList} baseInfo={baseInfoRef.current} /> : getGameListSkeleton()}</div>
            </div>
            <div className="live-detail-left-con-r">
              {/* 播放器 */}
              <div className="live-detail-left-con-r-t" style={{ zIndex: 3, position: "relative" }}>
                <div className="live-detail-left-con-r-t-player" style={{ position: "relative" }}>
                  {
                    // suspendDataSet ? suspendDataF() : 
                    !needPass && !needPay && !isClose && baseInfoRef.current.anchorId && <Player pkingShows={pkingShow} showAniList={showAniList} waterTop={waterTop} giftList={giftList} pikingResult={pikingResult} gameResult={gameResult} gameResultList={gameResultList} baseInfo={baseInfoRef.current} />}
                  {(needPass || needPay || isClose) && <img src={liveDetail.liveListAnchorInfoVO?.avatar} className='passBg' alt="" />}
                  {/* <GiftsToWX giftsToWX={this.state.giftsToWX} lang={i18n.language} /> */}
                  <AnchorCard />
                </div>
                {
                  crowdfundingVisible ? <Crowdfunding baseInfo={baseInfoRef.current}
                    onHiddenButton={() => waterTopSet('24px')}
                    onClose={() => {
                      crowdfundingVisibleSet(false)
                      waterTopSet('24px')
                    }
                    } info={crowdfundingData} /> : ''
                }

                {/* 礼物svga */}
                <SVGAPlay gid={gid} resourceUrlRef={resourceUrlRef.current} unmixed={unmixed} />
                {/* 进场飘屏 */}
                <ShowTypes
                  userLevels={userLevels}
                  gameResults={gameResults}
                  unmixed={() => {
                    gameResultsSet({})
                    userLevelsSet('')

                    gameResultsRef.current = {}
                    userLevelsRef.current = ''
                  }}
                />
                {/* 进场飘屏 */}
                {/* <div className='FloatingScreens'>
                  <VAPPC data={videoInfo} type="2" />
                </div> */}

                {/* 礼物mp4 */}
                <div className='videoInfo3s'>
                  <VAPPC data={videoInfo3} type="3" />
                </div>

              </div>
              {/* 礼物 */}
              <div className="live-detail-left-con-r-b">{!needPass && !needPay && !isClose && baseInfoRef.current.anchorId && isAd != 1 ? <BottomInfo FreshUser={userGetUserAsserGold} userInfo={userInfo} getGiftList={getGiftList} baseInfo={baseInfoRef.current} /> : isAd == 1 ? "" : getBottomSkeleton()}</div>
            </div>
          </div>
        </div>
        {/* 直播右边栏 */}
        {!needPass && !needPay && !isClose && baseInfoRef.current.anchorId && isAd != 1 ? (
          <div className="live-detail-right">
            <div className="live-detail-right-top">{t('live_sl')}</div>
            <Chat addAni={addAni} onShowResult={onShowResult} baseInfo={baseInfoRef.current} suspends={(e) => { suspendDataSetSet(e) }} />
          </div>
        ) : isAd == 1 ? (
          ""
        ) : (
          getRightSkeleton()
        )}
      </div>
      {/* 猜你喜欢 */}
      {!needPass && !needPay && !isClose && baseInfoRef.current.anchorId && <SuggestedList anchorId={baseInfoRef.current.anchorId} />}
    </div>
  );
}

export default LiveDetail;
