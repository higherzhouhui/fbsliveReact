// 直播详情
import React, { Component } from "react";
import { Local } from "../../common";
import { withTranslation } from "react-i18next";
import { getSearchData } from "../../common";
import { GetUserCard, GetLiveRecharge, GetCurFlagOpenGame, GetLiveList, LiveHeart } from "../../api/live";
import { Modal, Button, Skeleton } from "antd";
import RankList from "./components/rankList.jsx";
import GameList from "./components/gameList.jsx";
import SuggestedList from "./components/suggestedList.jsx";
import Chat from "./components/chat";
import TopInfo from "./components/topInfo";
import BottomInfo from "./components/bottomInfo";
import Player from "./components/player";
import Redux from "../../components/common/redux";
import "./detail.scss";

let heartTime = null;
class LiveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseInfo: {},
      mask: false,
      password: "",
      gameResult: null,
      giftResult: null,
      pikingResult: null,
      showAniList: [],
      giftList: [],
      userInfo: {},
      FreshUser: null,
      modalVisible: false,
      modalContent: "",
      lsData: {},
      gameResultList: [],
      isAd: 0,
      fbIsShow: false,
      suspendDataSet: false,
      urlSearchD: {},
      giftsToWX: null,
    };
    this.getUserCard = this.getUserCard.bind(this);
    this.changPassward = this.changPassward.bind(this);
    this.onShowResult = this.onShowResult.bind(this);
    this.getPlayerDom = this.getPlayerDom.bind(this);
    this.getGiftList = this.getGiftList.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getFreshUser = this.getFreshUser.bind(this);
    this.cancelLook = this.cancelLook.bind(this);
    this.sureToRoom = this.sureToRoom.bind(this);
    this.closeAll = this.closeAll.bind(this);

    // this.curFlagOpenGame = this.curFlagOpenGame.bind(this)
    this.checkPking = this.checkPking.bind(this);
    this.handleHeart = this.handleHeart.bind(this);
  }
  getUser(userInfo) {
    this.setState({ userInfo });
  }
  cancelLook() {
    window.location.href = "/live/list";
  }
  sureToRoom() {
    this.getLiveRecharge(this.state.lsData);
  }
  getFreshUser(FreshUser) {
    this.setState({ FreshUser });
  }
  closeAll() {
    this.setState({ fbShow: false });
  }
  componentDidMount() {
    this.handleHeart();
    window.eventBus.addListener("closeAll", this.closeAll);
    setTimeout(() => {
      window.eventBus.emit("checkTolive", true);
    }, 10);
    document.querySelector("html").scrollTo(0, 0);
    const token = Local("token2");
    if (!token) return (window.location.href = "/");
    const urlSearch = window.location.href;
    let data = getSearchData(urlSearch);
    this.setState({ isAd: data.isAd });
    // 1按时收费 2按次数收费 3 需要密码
    if ([1, 2].includes(parseInt(data.type))) {
      this.spacialFun(data);
    } else if (data.isAd != 1) {
      this.getUserCard(data);
    } else {
      this.setState({
        baseInfo: Object.assign({}, this.state.baseInfo, data),
      });
    }
    this.handleHeart(data);
    if (data?.pking == "true") {
      setTimeout(() => {
        this.checkPcStatus(1);
      }, 3000);
    }
    this.rGiftTimer = setInterval(() => this.rGiftList(), 1000);
    // this.curFlagOpenGame()
    this.checkPking(data);
  }
  componentWillUnmount() {
    clearTimeout(heartTime);
  }
  handleHeart(live = {}) {
    if (!live.liveId) return;
    LiveHeart({ liveId: live.liveId });
    heartTime = setTimeout(() => {
      this.handleHeart(live);
    }, 50000);
  }
  async checkPking(query) {
    const res = await GetLiveList({ type: 1 });
    if (!(res instanceof Error)) {
      let [data] = res.filter((item) => item.anchorId == query.anchorId);
      if (data?.pking && query?.pking != "true") {
        this.checkPcStatus(1);
      }
    }
  }
  getGiftList(giftList) {
    this.setState({ giftList });
  }

  componentWillUnmount() {
    window.eventBus.removeListener("closeAll", this.closeAll);
    window.eventBus.emit("checkTolive", false);
    clearTimeout(this.rTimer);
    clearInterval(this.rGiftTimer);
  }
  getPlayerDom(playerDom) {
    this.playerDom = playerDom;
  }
  // 结果分发
  onShowResult(gameResult) {
    let { status, protocol } = gameResult;
    if (protocol == 29) {
      this.kjResult(gameResult);
      // 刷礼物
    } else if (protocol == 7) {
      this.addAniList(gameResult);
      // pk数据刷新
    } else if (protocol == 24) {
      this.pkResult(gameResult);
      // pk状态 1开启 2关闭
    } else if (protocol == 18) {
      this.checkPcStatus(status);
    }
  }
  addAniList(gift) {
    gift.timer = 4;
    gift.isShow = true;
    let { showAniList } = this.state;
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
    this.setState({
      showAniList,
    });
    this.playerDom.setState({ showAniList });
  }
  rGiftList() {
    let { showAniList } = this.state;
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
    this.setState({ showAniList });
    this.playerDom.setState({ showAniList });
  }
  checkPcStatus(status) {
    this.playerDom.setState({
      pkingShow: status == 1,
    });
    let search = location.search;
    if (status == 1) {
      this.playerDom.getLiveDetail();
      search = search.replace("pking=false", "pking=true");
    } else {
      search = search.replace("pking=true", "pking=false");
      window.location.reload();
    }
    history.pushState({}, "", search);
  }
  // 展示中奖结果
  kjResult(gameResult) {
    let list = this.state.gameResultList.slice(0);
    list.push(gameResult);
    this.setState(
      {
        gameResultList: list,
        gameResult,
      },
      () => {
        clearTimeout(this.rTimer);
        this.rTimer = setTimeout(() => {
          this.setState({
            gameResult: null,
            gameResultList: [],
          });
        }, 16000);
      }
    );
  }
  // 获取pk数据
  pkResult(pikingResult) {
    let timers = new Date().getTime();
    pikingResult.timers = timers;
    this.playerDom && this.playerDom.reinitGefit(pikingResult);
    // this.setState({
    //     pikingResult
    // })
  }

  changPassward(password) {
    this.setState({ password });
  }
  getLiveRecharge(data) {
    GetLiveRecharge(data).then((rt) => {
      if (rt) {
        this.setState(
          {
            baseInfo: Object.assign({}, this.state.baseInfo, data),
            modalVisible: false,
          },
          () => {
            this.getUserCard(data);
          }
        );
      } else {
        window.location.href = "/live/list";
      }
    });
  }
  // curFlagOpenGame() {
  //     GetCurFlagOpenGame({ "type": 5 }).then(rt => {
  //         this.setState({ fbIsShow: rt })
  //     })
  // }

  spacialFun(data) {
    let { t } = this.props;
    let { type } = data;
    let content = null;
    switch (type * 1) {
      case 1: {
        content = (
          <div>
            {t("enterNeed")}
            {data.price}
            {t("goldPer")}
          </div>
        );
        break;
      }
      case 2: {
        content = (
          <div>
            {t("fukuan")}
            {data.price}
            {t("showNeed")}
          </div>
        );
        break;
      }
    }
    this.setState({ lsData: data, modalVisible: true, modalContent: content });
  }
  getUserCard(data, cb) {
    GetUserCard({ uid: data.anchorId })
      .then((rt) => {
        this.setState({
          baseInfo: Object.assign({}, this.state.baseInfo, data, rt),
        });
        cb && cb();
      })
      .catch(() => {
        cb && cb();
      });
  }
  getTopSkeleton() {
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
  getBottomSkeleton() {
    return <div className="live-detail-bottom-box"></div>;
  }
  getRightSkeleton() {
    let { t } = this.props;
    return (
      <div className="live-detail-right">
        <div className="live-detail-right-top">{t("live_sl")} </div>
        <div style={{ position: "absolute", bottom: 10 }}>
          <Skeleton.Input style={{ width: "276px", height: 40, marginLeft: 0, borderRadius: 10 }} active="true" />
        </div>
      </div>
    );
  }
  getRankListSkeleton() {
    let { t } = this.props;
    return (
      <div className="rank-list-box">
        <div className="title">{t("f_ui_wap_text_028")}</div>
      </div>
    );
  }
  getGameListSkeleton() {
    let { t } = this.props;
    return (
      <div className="container-game-list">
        <div className="title">{t("live_gamelist")}</div>
      </div>
    );
  }
  suspendDataF() {
    let { t } = this.props;
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

  render() {
    let { baseInfo, gameResult, pikingResult, giftList, userInfo, FreshUser, modalVisible, modalContent, fbShow, fbIsShow, gameResultList, isAd, urlSearchD } = this.state;
    let { t } = this.props;
    let TopSkeleton = this.getTopSkeleton();
    let BottomSkeleton = this.getBottomSkeleton();
    let RightSkeleton = this.getRightSkeleton();
    return (
      <div className={"live-detail-container " + (baseInfo.isAd == 1 && "w-1200")}>
        <Redux getFreshUser={this.getFreshUser} getUser={this.getUser} />
        <Modal
          onCancel={this.cancelLook}
          title={t("ui_prompt")}
          footer={[
            <Button onClick={this.cancelLook}>{t("cancel")}</Button>,
            <Button type="primary" onClick={this.sureToRoom}>
              {t("confirm")}
            </Button>,
          ]}
          className="small-alert"
          visible={modalVisible}
          width={340}>
          {modalContent}
        </Modal>
        <div className="live-detail">
          {/* 直播左边栏 */}
          <div className="live-detail-left">
            {/* 顶部 */}
            {baseInfo.anchorId && isAd != 1 ? <TopInfo onGetBase={(cb) => this.getUserCard(baseInfo, cb)} baseInfo={baseInfo} /> : isAd == 1 ? "" : TopSkeleton}
            {/* 中间 */}
            <div className="live-detail-left-con">
              <div className="live-detail-left-con-l">
                {/* 排行榜 */}
                <div className="live-detail-left-con-l-t">{baseInfo.anchorId ? <RankList anchorId={baseInfo.anchorId} /> : this.getRankListSkeleton()}</div>
                {/* 游戏列表 */}
                <div className="live-detail-left-con-l-b">{baseInfo.anchorId ? <GameList FreshUser={FreshUser} userInfo={userInfo} getGiftList={this.getGiftList} baseInfo={baseInfo} /> : this.getGameListSkeleton()}</div>
              </div>
              <div className="live-detail-left-con-r">
                {/* 播放器 */}
                <div className="live-detail-left-con-r-t">
                  <div className="live-detail-left-con-r-t-player" style={{ position: "relative" }}>
                    {this.state.suspendDataSet ? suspendDataF() : baseInfo.anchorId && <Player giftList={giftList} pikingResult={pikingResult} getPlayerDom={this.getPlayerDom} gameResult={gameResult} gameResultList={gameResultList} baseInfo={baseInfo} />}
                    {/* <GiftsToWX giftsToWX={this.state.giftsToWX} lang={i18n.language} /> */}
                  </div>
                </div>
                {/* 礼物 */}
                <div className="live-detail-left-con-r-b">{baseInfo.anchorId && isAd != 1 ? <BottomInfo FreshUser={FreshUser} userInfo={userInfo} getGiftList={this.getGiftList} baseInfo={baseInfo} /> : isAd == 1 ? "" : BottomSkeleton}</div>
              </div>
            </div>
          </div>
          {/* 直播右边栏 */}
          {baseInfo.anchorId && isAd != 1 ? (
            <div className="live-detail-right">
              <div className="live-detail-right-top">{t('live_sl')}</div>
              <Chat onShowResult={this.onShowResult} baseInfo={baseInfo} suspends={(e) => { this.setState({ suspendDataSet: e }); }} />
            </div>
          ) : isAd == 1 ? (
            ""
          ) : (
            RightSkeleton
          )}
        </div>
        {/* 猜你喜欢 */}
        {baseInfo.anchorId && <SuggestedList anchorId={baseInfo.anchorId} />}
      </div>
    );
  }
}
export default withTranslation()(LiveDetail);
