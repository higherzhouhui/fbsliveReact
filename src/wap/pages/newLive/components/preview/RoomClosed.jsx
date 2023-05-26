import React, { useEffect, useState, useMemo } from "react";
import style from "./style.module.scss";
import { Grid, Image } from "antd-mobile";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useContextReducer from "../../../../state/useContextReducer";
import _ from "lodash";

const RoomClosed = () => {
  const history = useNavigate();
  const { t } = useTranslation();
  const {
    state: {
      user,
      live: {
        liveData,
        liveDetail: { liveListAnchorInfoVO, liveListRoomBaseVO },
      },
    },
    dispatch,
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { liveFollow } = fetchUtils;
  const { isFollow: follow } = liveListAnchorInfoVO;
  const [pages, pagesSet] = useState(1);
  const [trans, transSet] = useState(false);

  const liveDataD = useMemo(() => {
    if (liveData.listDataVos != undefined && liveData.listDataVos[0] != undefined) {
      // return liveData[tag].listDataVos;
      let listDataVosD = _.sortBy(liveData.listDataVos, (a) => Math.floor(Math.random() * 10));
      listDataVosD = _.slice(listDataVosD, 0 * pages, 4 * pages);
      return _.sortBy(listDataVosD, (a) => Math.floor(Math.random() * 10));
    } else return [];
  }, [liveData, trans]);

  return (
    <div className={style.roomClosed}>
      {/* <img src={liveListAnchorInfoVO?.avatar} className={style.passBg} alt="" /> */}
      <div className={style.content}>
        <p>{t("zhi_bo_jiesu")}</p>
        <div className={style.zhubo}>
          <img className={style.avatar} src={liveListAnchorInfoVO?.avatar || require("../../../../assets/image/login/logotitle.png")} alt="" />
          <div className={style.nickname}>{liveListAnchorInfoVO.nickname}</div>
          <div style={{ marginTop: "10px", marginBottom: "30px" }} className={style.nickname2}>
            {liveListRoomBaseVO.rq} {t("kanguo")}
          </div>
          <div className={style.Swipers_But} onClick={() => liveFollow({ isFollow: follow, uid: liveListAnchorInfoVO.anchorId, type: "anchor", fid: user.uid })}>
            {follow ? (
              t("yiguanzhu")
            ) : (
              <div className={style.Swipers_clid}>
                <img src={require("../../../../assets/image/live/jia.png")} alt="" /> {t("guanzhu")}
              </div>
            )}
          </div>
        </div>
        <div className={style.xihuan}>
          <div className={style.xihuan_title}>
            <div className={style.demo1}></div>
            <div>{t("YouMightLikeIt")}</div>
            <div
              className={style.demo1}
              onClick={() => {
                let max = Math.floor(liveData.listDataVos.length / 4) + 1;
                if (pages < max) {
                  pagesSet((a) => a + 1);
                } else {
                  pagesSet(1);
                }
                if (max < 2) {
                  transSet((a) => !a);
                }
              }}>
              <img src={require("../../../../assets/image/live/sx.png")} alt="" className={""} />
            </div>
          </div>
          {/* liveResponses */}
          <Grid columns={2} gap={15} className={style.liveList}>
            {liveDataD.map((item, index) => {
              return (
                <Grid.Item key={index}>
                  {/* {JSON.stringify(item)} */}
                  {item?.liveListRoomBaseVO?.isAd === 1 ? (
                    // 视频播放 体育流
                    <div className={style.sportItem} onClick={() => history("/liveSport", { state: item })}>
                      <img src={item?.liveListRoomBaseVO?.livePicUrl || require("../../../../assets/image/live/sportBg.png")} alt="" />
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
                        console.log("跳转8");
                        history("/liveRoom", { state: { liveId: item.liveId }, replace: true });
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
                          {item?.liveListRoomBaseVO?.pking && <img src={require("../../../../assets/image/live/newPk.png")} />}
                          {/* 福袋 */}
                          {item?.liveListActivityInfoVO?.isLuckBag == 1 && <img src={require("../../../../assets/image/live/fudai.png")} alt="" />}
                          {/* 转盘 */}
                          {item?.liveListActivityInfoVO?.isActivityRoulette == 1 && <img src={require("../../../../assets/image/live/zhuanpan.png")} alt="" />}
                          {/* 跳到 */}
                          {item?.liveListRoomBaseVO?.toy == 1 && <img src={require("../../../../assets/image/live/tiaodan.png")} alt="" />}
                        </div>
                      }
                      {/* 钱包 */}
                      {(item?.liveListRoomBaseVO?.type == 1 || item?.liveListRoomBaseVO?.type == 2) && (
                        <div className={style.liveRight}>
                          <img src={require("../../../../assets/image/live/roomprice.png")} alt="" style={{ borderRadius: "100%" }} />
                        </div>
                      )}
                      {/*锁 */}
                      {item?.liveListRoomBaseVO?.type == 3 && (
                        <div className={style.liveRight}>
                          <img src={require("../../../../assets/image/live/roompass.png")} alt="" style={{ borderRadius: "100%" }} />
                        </div>
                      )}
                      {/* 主播直播间/官方直播间取不同的封面字段 */}
                      {/* {item?.liveListRoomBaseVO?.isAutoLive == 1 ? <Image src={item?.liveListRoomBaseVO?.livePicUrl ? item?.liveListRoomBaseVO?.livePicUrl : require("../../../../assets/image/center/gyfbstitle.png")} alt="" className={style.backUrl} fit="cover" lazy="true" /> : <Image src={item?.liveListAnchorInfoVO?.avatar ? item?.liveListAnchorInfoVO?.avatar : require("../../../../assets/image/center/gyfbstitle.png")} alt="" className={style.backUrl} fit="cover" lazy="true" />} */}
                      {/* <Image src={item?.liveListRoomBaseVO?.livePicUrl} alt="" className={style.backUrl} fit="cover" lazy="true" /> */}
                      <Image src={item?.liveListRoomBaseVO?.livePicUrl ? item?.liveListRoomBaseVO?.livePicUrl : require("../../../../assets/image/center/gyfbstitle.png")} fallback={<img src={require("../../../../assets/image/center/gyfbstitle.png")} alt="" />} alt="" className={style.backUrl} fit="cover" lazy="true" />
                      <div className={style.itemName}>
                        {/* 主播昵称，官方直播间昵称 */}
                        <div className={`${style.nickname} ${item?.liveListRoomBaseVO?.isAutoLive == 1 && style.auto}`}>
                          <div className={style.nickname_d1}>{item?.liveListAnchorInfoVO?.nickname}</div>
                          <div className={style.nickname_d2}>{item?.liveListAnchorInfoVO?.signature || t("jingwozhibojianbidingying")}</div>
                        </div>
                        {/* <TeamFill color='#fff' /> */}
                        <div className={style.right}>
                          <img src={require("../../../../assets/image/RankingList/zbz2s.png")} alt="" style={{ width: "24px", height: "12px" }} />
                          {item?.liveListRoomBaseVO?.rq}
                        </div>
                      </div>
                    </div>
                  )}
                </Grid.Item>
              );
            })}
          </Grid>
        </div>
      </div>
      <div
        onClick={() => {
          history('/live');
        }}
        className={style.closeBtn}>
        {" "}
        <img src={require("../../../../assets/image/live/livegb.png")} alt="" />
      </div>
    </div>
  );
};

export default RoomClosed;
