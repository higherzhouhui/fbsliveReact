import React from "react";
import { Popup, Tabs, Avatar, Empty, Button, NavBar } from "antd-mobile";
import { useState, useEffect } from "react";
import GiftIcon from "../../../../assets/image/live/gift.png";
import style from "./index.module.scss";
import { liveFollow } from "../../../../server/Fans";
import { t } from "i18next";
import { GetAnthorGiftList } from "../../../../server/RankingList";
import useContextReducer from "../../../../state/useContextReducer";

const Index = (props) => {
  const {
    state: { user },
    fetchUtils,
    dispatch
  } = useContextReducer.useContextReducer();
  const { freshUser } = fetchUtils;
  const { anchorInfo, uid } = props;
  const [anchorInfozb, anchorInfozbSet] = useState(false);

  const [rankDetailssD, rankDetailssDSet] = useState({})
  const [rankDetailss, rankDetailssSet] = useState([]);
  const [rankDetailD, rankDetailDSet] = useState([]);
  const [rankTypes, rankTypesSet] = useState(1);

  const GetAnthorGiftLists = (i) => {
    GetAnthorGiftList({ anchorId: uid }).then((item) => {
      console.log("这是直播排行榜------------------", item);
      rankDetailssDSet(item)

      TabsF(i, item)
    });
  };

  const TabsF = (i, data) => {
    if (i == 1) {
      rankDetailssSet(data?.dayList || []);
      if (data?.dayList[0] != undefined) {
        if (data?.dayList[3] !== undefined) {
          let datas = [...data?.dayList];
          datas.splice(0, 3);
          console.log("截取后数据", datas);
          rankDetailDSet(datas || []);
        } else {
          rankDetailDSet([]);
        }
      } else {
        rankDetailDSet([]);
      }
    } else if (i == 4) {
      rankDetailssSet(data?.allList || []);
      if (data?.allList[0] != undefined) {
        if (data?.allList[3] !== undefined) {
          let datas = [...data?.allList];
          datas.splice(0, 3);
          console.log("截取后数据", datas);
          rankDetailDSet(datas || []);
        } else {
          rankDetailDSet([]);
        }
      } else {
        rankDetailDSet([]);
      }
    }
  }


  const times = [
    { id: "1", code: "1", title: t("rb") },
    { id: "2", code: "4", title: t("yb") },
  ];
  // 关注
  const follow = async (d) => {
    const res = await liveFollow({ isFollow: !d.isFollow, targetId: d.uid });
    if (!(res instanceof Error)) {
      // rankDetails(types, rankTypes);
      console.log('res--------', res);
      if (res) {
        dispatch(() => {
          return {
            type: "live/SetFollowLists",
            payload: res,
          };
        });
      }
      freshUser();
      GetAnthorGiftLists(rankTypes);
    }
  };

  return (
    <div>
      <div
        className={style.gift}
        onClick={() => {
          anchorInfozbSet(true);
          rankTypesSet(1)
          GetAnthorGiftLists(rankTypes);
        }}>
        <img src={GiftIcon} alt="" />
        {anchorInfo.zb || 0}
      </div>

      {/* 排行榜 */}
      <Popup visible={anchorInfozb} onMaskClick={() => anchorInfozbSet(false)} position="right" bodyStyle={{ width: "100vw" }}>
        <div className={style.bodys}>
          <NavBar back={null} left={<img src={require("../../../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px", filter: "contrast(200%) invert(200%)" }} onClick={() => anchorInfozbSet(false)} />} className={style.wbg}>
            <div style={{ fontSize: "18px", fontWeight: "500", color: "#fff" }}>{t("ui_wap_text_028")}</div>
          </NavBar>

          {/* tabs */}
          <div style={{ padding: "0 13px" }}>
            <Tabs
              activeLineMode="fixed"
              className="noBor4"
              defaultActiveKey={"1"}
              onChange={(e) => {
                // GetAnthorGiftLists(e);
                TabsF(e, rankDetailssD)
                rankTypesSet(e);
              }}
              style={{ "--fixed-active-line-width": "14px", "--active-title-color": "#fff ", "--active-line-color": "#fff ", "--title-font-size": "14px" }}>
              {times.map((value, index, array) => {
                return <Tabs.Tab key={value.code} title={value.title}></Tabs.Tab>;
              })}
            </Tabs>
          </div>
          {/* 排行榜 */}
          <div style={{ width: "100%", height: "265px", position: "relative" }}>
            <div style={{ display: "flex", padding: "0 22px" }}>
              <div className={style.boxs} style={{ marginTop: "28px" }}>
                <div>
                  {/* 第二名 */}
                  {/*  background: `url(${require('../../assets/image/RankingList/pm2.png')})`, backgroundSize: '100% 100%', */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }} className={style.boxs_div}>
                    <img src={require("../../../../assets/image/newRankingList/pm2.png")} alt="" className={style.boxs_div2} />
                    {/* 判断是否开播 */}
                    {rankDetailss[0] !== undefined && rankDetailss[1] !== undefined && rankDetailss[1].liveId !== null && rankDetailss[1].liveId !== 0 && (
                      <div
                        style={{
                          width: "24px",
                          height: "12px",
                          display: "flex",
                          background: `url(${require("../../../../assets/image/RankingList/zbz4.png")})`,
                          backgroundSize: "100% 100%",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          right: "20px",
                          top: "20px",
                          zIndex: "3",
                        }}>
                        <img src={require("../../../../assets/image/RankingList/zbz2s.png")} alt="" style={{ width: "15px", height: "10px" }} />
                      </div>
                    )}
                    <Avatar src={rankDetailss[0] !== undefined && rankDetailss[1] !== undefined ? rankDetailss[1]?.avatar : require("../../../../assets/image/default_img.png")} style={{ "--size": "50px", borderRadius: "100%", marginTop: "-30px", marginLeft: "5px" }} />
                  </div>
                  <div className={style.font_size_p}>
                    <div className={style.boxs_font1}>
                      <div>{rankDetailss[0] !== undefined && rankDetailss[1] !== undefined ? rankDetailss[1].nickname : ""}</div>
                      {/* user?.anchorLevel ? user?.anchorLevel : */}
                      <div className={style.imgsDiv}>
                        {rankDetailss[0] !== undefined && rankDetailss[1] !== undefined && <img src={require(`../../../../assets/image/live/level_${(rankDetailss[1]?.isAnchor ? rankDetailss[1]?.anchorLevel : rankDetailss[1]?.userLevel) || 1}.png`)} alt="" />}
                        {rankDetailss[0] !== undefined && rankDetailss[1] !== undefined && rankDetailss[1]?.vipLevel != null && rankDetailss[1]?.vipLevel != undefined && rankDetailss[1]?.vipLevel != 0 && <img className={style.hzImg} src={require(`../../../../assets/image/live/jw/jw${rankDetailss[1]?.vipLevel}.png`)} alt="" />}
                      </div>
                    </div>
                    <div className={style.boxs_font2}>
                      <img src={require("../../../../assets/image/RankingList/xdlog1.png")} alt="" />
                      {/* style={{ overflow: "hidden", maxWidth: "70px" }} */}
                      <div>
                        {/* id="boxs_font2_g" className={document.getElementById(`boxs_font2_g`)?.scrollWidth > 70 ? style.boxs_font2_g : ""} */}
                        <div>
                          {rankDetailss[1]?.rankValue || 0}
                          {/* {rankDetailss[0] !== undefined && rankDetailss[1] !== undefined ? Number(rankDetailss[1].rankValue) > 10000 ? <span>{`${(Number(rankDetailss[1].rankValue) / 10000).toFixed(1)}w`}</span> : Number(rankDetailss[1].rankValue) > 1000 ? <span>{`${Number(rankDetailss[1].rankValue / 1000).toFixed(1)}k`}</span> : rankDetailss[1].rankValue : 0} */}
                        </div>
                      </div>
                    </div>
                    {/* 关注 */}
                    {rankDetailss[0] !== undefined && rankDetailss[1] !== undefined && rankDetailss[1]?.uid != user?.uid && (
                      <Button loading="auto" onClick={() => follow(rankDetailss[1])} className={`${style.follow_big} ${rankDetailss[1]?.isFollow ? style.follow_bigs : ""}`}>
                        {rankDetailss[1]?.isFollow ? t("yiguanzhu") : t("guanzhu")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className={style.boxs}>
                {/* 第一名 */}
                <div>
                  {/* background: `url(${require('../../assets/image/RankingList/pm1.png')})`, backgroundSize: '100% 100%', */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }} className={style.boxs_div}>
                    <img src={require("../../../../assets/image/newRankingList/pm1.png")} alt="" className={style.boxs_div2} />
                    {/* 判断是否开播 */}
                    {rankDetailss[0] !== undefined && rankDetailss[0].liveId !== null && rankDetailss[0].liveId !== 0 && (
                      <div
                        style={{
                          width: "24px",
                          height: "12px",
                          display: "flex",
                          background: `url(${require("../../../../assets/image/RankingList/zbz4.png")})`,
                          backgroundSize: "100% 100%",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          right: "20px",
                          top: "20px",
                          zIndex: "3",
                        }}>
                        <img src={require("../../../../assets/image/RankingList/zbz2s.png")} alt="" style={{ width: "15px", height: "10px" }} />
                      </div>
                    )}

                    <Avatar src={rankDetailss[0] !== undefined ? rankDetailss[0]?.avatar : require("../../../../assets/image/default_img.png")} style={{ "--size": "50px", borderRadius: "100%", marginTop: "-25px", marginLeft: "5px" }} />
                  </div>
                  <div className={style.font_size_p2}>
                    {/* <div className={style.boxs_font1}>{rankDetailss[0] !== undefined ? rankDetailss[0].nickname : ""}</div> */}
                    <div className={style.boxs_font1}>
                      <div>{rankDetailss[0] !== undefined ? rankDetailss[0].nickname : ""}</div>
                      {/* user?.anchorLevel ? user?.anchorLevel : */}

                      <div className={style.imgsDiv}>
                        {rankDetailss[0] !== undefined && <img src={require(`../../../../assets/image/live/level_${(rankDetailss[0]?.isAnchor ? rankDetailss[0]?.anchorLevel : rankDetailss[0]?.userLevel) || 1}.png`)} alt="" />}
                        {rankDetailss[0] !== undefined && rankDetailss[0]?.vipLevel != null && rankDetailss[0]?.vipLevel != undefined && rankDetailss[0]?.vipLevel != 0 && <img className={style.hzImg} src={require(`../../../../assets/image/live/jw/jw${rankDetailss[0]?.vipLevel}.png`)} alt="" />}
                      </div>
                    </div>

                    <div className={style.boxs_font2}>
                      <img src={require("../../../../assets/image/RankingList/xdlog1.png")} alt="" />
                      {/* <div>
                                        {rankDetailss[0] !== undefined ? rankDetailss[0].rankValue : 0}
                                    </div> */}
                      {/* style={{ overflow: "hidden", maxWidth: "70px" }}*/}
                      <div>
                        {/*  id="boxs_font2_g2" className={document.getElementById(`boxs_font2_g2`)?.scrollWidth > 70 ? style.boxs_font2_g : ""} */}
                        <div>
                          {rankDetailss[0]?.rankValue || 0}
                          {/* {rankDetailss[0] !== undefined ? Number(rankDetailss[0].rankValue) > 10000 ? <span>{`${(Number(rankDetailss[0].rankValue) / 10000).toFixed(1)}w`}</span> : Number(rankDetailss[0].rankValue) > 1000 ? <span>{`${Number(rankDetailss[0].rankValue / 1000).toFixed(1)}k`}</span> : rankDetailss[0].rankValue : 0} */}
                        </div>
                      </div>
                    </div>
                    {/* 关注 */}
                    {rankDetailss[0] !== undefined && rankDetailss[0]?.uid != user?.uid && (
                      <Button loading="auto" onClick={() => follow(rankDetailss[0])} className={`${style.follow_big} ${rankDetailss[0]?.isFollow ? style.follow_bigs : ""}`}>
                        {rankDetailss[0]?.isFollow ? t("yiguanzhu") : t("guanzhu")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className={style.boxs} style={{ marginTop: "35px" }}>
                <div>
                  {/* 第三名 */}
                  {/* background: `url(${require('../../assets/image/RankingList/pm3.png')})`, backgroundSize: '100% 100%', */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }} className={style.boxs_div}>
                    <img src={require("../../../../assets/image/newRankingList/pm3.png")} alt="" className={style.boxs_div2} />
                    {/* 判断是否开播 */}
                    {rankDetailss[0] !== undefined && rankDetailss[2] !== undefined && rankDetailss[2].liveId !== null && rankDetailss[2].liveId !== 0 && (
                      <div
                        style={{
                          width: "24px",
                          height: "12px",
                          display: "flex",
                          background: `url(${require("../../../../assets/image/RankingList/zbz4.png")})`,
                          backgroundSize: "100% 100%",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          right: "20px",
                          top: "20px",
                          zIndex: "3",
                        }}>
                        <img src={require("../../../../assets/image/RankingList/zbz2s.png")} alt="" style={{ width: "15px", height: "10px" }} />
                      </div>
                    )}
                    <Avatar src={rankDetailss[0] !== undefined && rankDetailss[2] !== undefined ? rankDetailss[2]?.avatar : require("../../../../assets/image/default_img.png")} style={{ "--size": "50px", borderRadius: "100%", marginTop: "-30px", marginLeft: "5px" }} />
                  </div>
                  <div className={style.font_size_p3}>
                    <div className={style.boxs_font1}>
                      <div>{rankDetailss[0] !== undefined && rankDetailss[2] !== undefined ? rankDetailss[2].nickname : ""}</div>
                      {/* user?.anchorLevel ? user?.anchorLevel : */}

                      <div className={style.imgsDiv}>
                        {rankDetailss[0] !== undefined && rankDetailss[2] !== undefined && <img src={require(`../../../../assets/image/live/level_${(rankDetailss[2]?.isAnchor ? rankDetailss[2]?.anchorLevel : rankDetailss[2]?.userLevel) || 1}.png`)} alt="" />}
                        {rankDetailss[0] !== undefined && rankDetailss[2] !== undefined && rankDetailss[2]?.vipLevel != null && rankDetailss[2]?.vipLevel != undefined && rankDetailss[2]?.vipLevel != 0 && <img className={style.hzImg} src={require(`../../../../assets/image/live/jw/jw${rankDetailss[2]?.vipLevel}.png`)} alt="" />}
                      </div>
                    </div>

                    <div className={style.boxs_font2}>
                      <img src={require("../../../../assets/image/RankingList/xdlog1.png")} alt="" />
                      {/* <div>
                                        {(rankDetailss[0] !== undefined && rankDetailss[2] !== undefined) ? rankDetailss[2].rankValue : 0}
                                    </div> */}
                      {/* style={{ overflow: "hidden", maxWidth: "70px" }} */}
                      <div>
                        {/* id="boxs_font2_g3" className={document.getElementById(`boxs_font2_g3`)?.scrollWidth > 70 ? style.boxs_font2_g : ""} */}
                        <div>
                          {/* {(rankDetailss[0] !== undefined && rankDetailss[2] !== undefined) ? rankDetailss[2].rankValue : 0} */}
                          {rankDetailss[2]?.rankValue || 0}
                          {/* {rankDetailss[0] !== undefined && rankDetailss[2] !== undefined ? Number(rankDetailss[2].rankValue) > 10000 ? <span>{`${(Number(rankDetailss[2].rankValue) / 10000).toFixed(1)}w`}</span> : Number(rankDetailss[2].rankValue) > 1000 ? <span>{`${Number(rankDetailss[2].rankValue / 1000).toFixed(1)}k`}</span> : rankDetailss[2].rankValue : 0} */}
                        </div>
                      </div>
                    </div>
                    {/* 关注 */}
                    {/* style.follow_bigs */}
                    {rankDetailss[0] !== undefined && rankDetailss[2] !== undefined && rankDetailss[2]?.uid != user?.uid && (
                      <Button loading="auto" onClick={() => follow(rankDetailss[2])} className={`${style.follow_big} ${rankDetailss[2]?.isFollow ? style.follow_bigs : ""}`}>
                        {rankDetailss[2]?.isFollow ? t("yiguanzhu") : t("guanzhu")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "calc(100% - 24px)",
                height: "118px",
                background: `url(${require("../../../../assets/image/RankingList/phb.png")})`,
                backgroundSize: "100% 100%",
                position: "absolute",
                left: "12px",
                top: "85px",
              }}></div>
          </div>
          {/* 排行榜其他 */}
          <div className={style.RankingLists2}>
            <div className={style.RankingLists}>
              {rankDetailD.length > 0 ? (
                rankDetailD.map((value, index, array) => {
                  return (
                    <div key={`${index}_${value.nickname}`} className={style.RankingLists_div}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "15px", color: "#8C8C8C", width: "30px", textAlign: "center" }}>{index + 4}</div>
                        {/* 内容 */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ marginRight: "8px", position: "relative" }}>
                            {/* {
                                                (value.liveId !== null && value.liveId !== 0) && <img src={require('../../assets/image/RankingList/zbz.png')} alt="" style={{ width: '45px', height: '45px', position: 'absolute', top: '0px', left: '0px' }} />
                                            } */}
                            <Avatar src={value?.avatar} style={{ "--size": "49.5px", borderRadius: "100%" }} />
                            {value.liveId !== null && value.liveId !== 0 && (
                              <div className={style.zbLog} style={{ background: `url(${require("../../../../assets/image/RankingList/zbzlog.png")})`, backgroundSize: "100% 100%" }}>
                                <div
                                  style={{
                                    height: "14px",
                                    position: "absolute",
                                    bottom: "0px",
                                    left: "2px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}>
                                  <img src={require("../../../../assets/image/RankingList/zbz2s.png")} alt="" style={{ width: "15px", height: "10px" }} />
                                  <div
                                    style={{
                                      fontSize: "9px",
                                      color: "#fff",
                                      fontWeight: "normal",
                                      whiteSpace: "nowrap",
                                      // display: "table"
                                      overflow: "hidden",
                                      width: "30px",
                                    }}>
                                    {/* t('zhengzaizhibo') */}
                                    <div className={style.gd_font}>{t("zhengzaizhibo")}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className={style.RankingLists_div_center}>
                            <div className={style.RankingLists_div_name}>
                              <div>{value.nickname}</div>
                              {/* anchorLevel主播等级  userLevel用户等级 */}

                              <div className={style.imgsDiv}>
                                <img src={require(`../../../../assets/image/live/level_${(value?.isAnchor ? value?.anchorLevel : value?.userLevel) || 1}.png`)} alt="" />
                                {value?.vipLevel != null && value?.vipLevel != undefined && value?.vipLevel != 0 && <img className={style.hzImg} src={require(`../../../../assets/image/live/jw/jw${value?.vipLevel}.png`)} alt="" />}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                              <img src={require("../../../../assets/image/RankingList/xdlog2.png")} alt="" style={{ width: "11px", height: "10px", marginRight: "5px" }} />
                              <div className={style.rankValue}>{value.rankValue}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* 关注 */}
                      {/* style.follow_big2s */}
                      {value?.uid != user?.uid && (
                        <Button loading="auto" onClick={() => follow(value)} className={`${style.follow_big2} ${value?.isFollow ? style.follow_big2s : ""}`}>
                          {value?.isFollow ? t("yiguanzhu") : t("guanzhu")}
                        </Button>
                      )}
                    </div>
                  );
                })
              ) : (
                <Empty className={style.Empty} image={<img className="emptyImg" src={require("../../../../assets/image/center/xgjlnull.png")} />} description={t("noData")}></Empty>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Index;
