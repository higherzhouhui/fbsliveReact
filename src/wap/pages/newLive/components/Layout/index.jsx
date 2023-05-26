import React, { useEffect, useMemo, useState } from "react";
import style from "./index.module.scss";
import { Avatar, Button, Popup, Space } from "antd-mobile";
import { useLocation, useNavigate } from "react-router";
import useContextReducer from "../../../../state/useContextReducer";
import { useTranslation } from "react-i18next";
import { useCopy } from "../../../../../utils/copy";
import { GetUserCard } from "../../../../server/live";
const RankingListZb = React.lazy(() => import("../rankingListZb/index"));
const FollowAnchor = React.lazy(() => import("../FollowAnchor/index"));
let times, followsTime1, followsTime2;
const Layout = () => {
  const { state } = useLocation()
  const {
    state: {
      user,
      live: {
        userCard,
        liveDetail: { liveListAnchorInfoVO, liveListRoomBaseVO },
        RoomMenList,
        followLists
      },
    },
    fetchUtils: { liveFollow, SetUserReject, GetUserCards },
    dispatch,
  } = useContextReducer.useContextReducer();
  const { isFollow: follow } = liveListAnchorInfoVO;
  const { onUserEnterRoomReqs } = RoomMenList;
  const history = useNavigate();
  const { t } = useTranslation();
  const copy = useCopy();
  //展示用户卡片
  const [showUser, setShowUser] = useState(false);

  const [follows, followsSet] = useState(false); //主播关注卡片
  // 头像点击获取uid比较
  const [uids, uidsSet] = useState();
  // 顶部显示人员
  const topManList = useMemo(() => {
    let showIndex = 3;
    screen.width < 400 ? (showIndex = 3) : (showIndex = 4);
    return onUserEnterRoomReqs.filter((_item, index) => index < showIndex);
  });
  //获取主播信息
  // useEffect(() => {
  //   if (liveListAnchorInfoVO.anchorId > 0) {
  //     GetUserCard({ uid: liveListAnchorInfoVO.anchorId }).then((res) => {
  //       dispatch({ type: "live/SetAnchorInfoFollow", payload: { fid: liveListAnchorInfoVO.anchorId, isFollow: res.isFollow } });
  //     });
  //   }
  // }, [liveListAnchorInfoVO.anchorId]);


  // 主播关注卡片展示
  useEffect(() => {
    followsSet(liveListAnchorInfoVO?.follow);
    followsF();
    return () => {
      clearTimeout(followsTime1);
      clearTimeout(followsTime2);
    };
  }, [liveListAnchorInfoVO?.follow]);

  //获取人员信息
  const getAvaInfo = async (uid) => {
    uidsSet(uid);
    // dispatch({ type: "live/SetUserCard", payload: liveListAnchorInfoVO });
    GetUserCards(uid);
    setShowUser(true);
  };

  const followsF = () => {
    if (liveListAnchorInfoVO?.follow == false) {
      clearTimeout(followsTime1);

      followsTime1 = setTimeout(() => {
        followsSet(true);
        clearTimeout(followsTime2);

        followsTime2 = setTimeout(() => {
          followsF();
          followsSet(false);
        }, 20000);
      }, 8000);
    }
  };
  //遮罩窗口
  const windowContent = () => {
    const userCardBody = () => (
      <>
        {showUser && (
          <div className={style.cardBody}>
            <div className={style.cardContent}>
              <Avatar src={userCard?.avatar} style={{ "--border-radius": "100%" }} className={style.avatar} fallback={<img src={require("../../../../assets/image/join/logo.png")} />} />
              {/* 拉黑 如果是自己不展示拉黑*/}
              {user.uid != userCard.uid && (
                <div className={style.pullBlack} onClick={() => SetUserReject(userCard)}>
                  {userCard.isReject ? <span className={style.blocked}>{t("pullBlack2")}</span> : t("pullBlack1")}
                </div>
              )}
              <div className={style.disFlexs}>
                <div className={style.name}>{userCard.nickname}</div>
                <div className={style.disFlex}>
                  <img src={require(`../../../../assets/image/live/level_${userCard.userLevel || 1}.png`)} className={style.bimg} />
                  <img src={require(`../../../../assets/image/live/sex_${userCard.sex === 1 ? "nan" : "nv"}.png`)} className={style.bimg} />
                </div>
              </div>
              <div className={style.useCopy}>
                ID: {userCard.uid}
                <img src={require("../../../../assets/image/live/icon-copy.png")} className={style.copy} onClick={() => copy(userCard.uid)} />
              </div>
              <div className={style.cardBottom}>
                <div className={style.box}>
                  {userCard.follows}
                  <span>{t("guanzhu")}</span>
                </div>
                <div className={style.box}>
                  {userCard.fans}
                  <span>{t("fensi")}</span>
                </div>
                <div className={style.box}>
                  {userCard.sendCoin}
                  <span>{t("songchu")}</span>
                </div>
                <div className={style.box}>
                  {userCard.receiveCoin}
                  <span>{t("shoudao")}</span>
                </div>
              </div>
              {uids != user.uid && (
                <Button
                  className={style.bottomBtn}
                  color="primary"
                  onClick={() => {
                    liveFollow({ ...userCard, type: userCard.uid === liveListAnchorInfoVO.anchorId ? "anchor" : "", fid: user.uid });
                  }}>
                  {userCard.isFollow ? t("yiguanzhu") : t("guanzhu")}
                </Button>
              )}
            </div>
          </div>
        )}
      </>
    );

    return (
      <>
        <Popup bodyClassName="noBgPop" visible={showUser} onMaskClick={() => setShowUser(false)} opacity="0">
          {userCardBody()}
        </Popup>
      </>
    );
  };

  return (
    <>
      <div className={style.topLeft}>
        <Space align="center" justify="between" className={style.topMan}>
          <div className={style.liver}>
            <Space align="center" onClick={() => getAvaInfo(liveListAnchorInfoVO.anchorId)}>
              <img className={style.avatar} src={liveListAnchorInfoVO.avatar || require("../../../../assets/image/login/logotitle.png")} />
              <span className={style.nickname}>{liveListRoomBaseVO.liveTitle}</span>
              <div
                className={style.guanzhu}
                loading="auto"
                onClick={(e) => {
                  e.stopPropagation();
                  return liveFollow({ isFollow: JSON.stringify(followLists).includes(liveListAnchorInfoVO.anchorId), uid: liveListRoomBaseVO.anchorId, type: "anchor", fid: user.uid });
                }}>
                {
                  // follow
                  JSON.stringify(followLists).includes(liveListAnchorInfoVO.anchorId) ? <img src={require("../../../../assets/image/live/live-icon-followed.png")} alt="" /> : <img src={require("../../../../assets/image/live/live-icon-follow.png")} alt="follow" />}
              </div>
            </Space>
          </div>
          <Space className={style.topRight} align="center" style={{ "--gap": "0" }}>
            {topManList.map((item) => (
              <div key={item.uid} className={style.manIcon} onClick={() => getAvaInfo(item.uid)}>
                <Avatar src={item?.avatar} style={{ "--size": "27px", "--border-radius": "100%" }} fallback={<img src={require("../../../../assets/image/join/logo.png")} />}></Avatar>
              </div>
            ))}
            {<div className={style.manTotal}>{Number(RoomMenList.rq) >= 1000 ? `${(Number(RoomMenList.rq) / 1000).toFixed(1)}k` : Number(RoomMenList.rq)}</div>}
            <div className={style.logout_s}
              onClick={() => {
                clearTimeout(times), history('/live');
              }}>
              <img
                src={require("../../../../assets/image/live/live-icon-out2.png")}
                alt=""
                className={style.logout}
              />
            </div>
          </Space>
        </Space>
        <Space align="center" style={{ marginTop: "8px" }}>
          <RankingListZb anchorInfo={liveListAnchorInfoVO} uid={liveListRoomBaseVO.anchorId} />
        </Space>
      </div>
      {liveListRoomBaseVO.anchorId != user.uid && follow == false && follows == false && <FollowAnchor />}
      {windowContent()}
    </>
  );
};

export default Layout;
