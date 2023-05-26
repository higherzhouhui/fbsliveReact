import React, { useState, useEffect } from "react";
import { Button, NavBar, Toast, Popup, Skeleton } from "antd-mobile";
import { t } from "i18next";
import { GetGiftList, buyCar } from "../../../server/live";
import { CNavBar, CEmpty } from "../../../components";
import style from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import useContextReducer from "../../../state/useContextReducer.js";
import VAP from "../../../components/vap";

const PointOut = React.lazy(() => import("../../../components/pointOut/index"));

const Index = () => {
  const history = useNavigate();
  const {
    state: { user, assergoldData },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { freshUser, userGetUserAsserGold } = fetchUtils;
  const [GetGiftListD, GetGiftListDSet] = useState([]);
  const [indesD, indexDSet] = useState(0);
  const [GetGiftListI, GetGiftListISet] = useState(-1);
  const [Popup1CenterI, Popup1CenterISet] = useState(0);

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [svg, svgSet] = useState(false);
  const [videoInfo2, videoInfo2Set] = useState([])
  const [playMP4, playMP4Set] = useState(false)

  const [Loading, LoadingSet] = useState(false);
  useEffect(() => {
    LoadingSet(true);
    GetGiftListF();
  }, []);

  const data = [{ demo1: 1 }, { demo1: 7 }, { demo1: 30 }, { demo1: 90 }, { demo1: 180 }];
  const GetGiftListF = async () => {
    let res = await GetGiftList();
    if (!(res instanceof Error)) {
      LoadingSet(false);
      let list = res || [];
      let data = [];
      list.forEach((value, index) => {
        if (value.type == 1 && value.isShow == 1) {
          data = [...data, value];
        }
      });
      data.sort((a, b) => {
        return a.sort - b.sort;
      });
      let da = data.filter((a) => a.gid !== 41);
      GetGiftListDSet(da);
    } else {
      LoadingSet(false);
    }
  };

  useEffect(() => {
    if (GetGiftListD[0] != undefined) {
      indexDSet(1);
    }
  }, [GetGiftListD]);

  useEffect(() => {
    if (GetGiftListD[0] != undefined) {
      getElementByIdWayIndex();
    }
  }, [indesD]);
  // 判断是否超出
  const getElementByIdWayIndex = (i) => {
    let data = [...GetGiftListD];
    data.forEach((value, index) => {
      if (document.getElementById(`way-${index}`)?.scrollWidth > document.getElementById(`way-${index}`)?.offsetWidth) {
        value.goBeyond = true;
      } else {
        value.goBeyond = false;
      }
    });
    GetGiftListDSet(data);
  };
  // svg
  const resourceUrlF = (url) => {
    url = url?.replace("http:", "")?.replace("https:", "");
    var player = new SVGA.Player("#demoCanvas");
    var parser = new SVGA.Parser("#demoCanvas"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
    parser.load(url + '?a=1', function (videoItem) {
      player.setVideoItem(videoItem);
      player.startAnimation();
      player.onFrame(function (i) { });
    });

    svgSet(true);
    setVisible(true);
  };
  // 购买接口
  const buyCarF = async () => {
    console.log(GetGiftListD[GetGiftListI]?.carConfigResponseList[Popup1CenterI]?.totalPrice);
    // 判断金额
    if (assergoldData?.goldCoin < GetGiftListD[GetGiftListI]?.carConfigResponseList[Popup1CenterI]?.totalPrice) {
      setVisible2(true);
      return;
    }
    let res = await buyCar({ gid: GetGiftListD[GetGiftListI]?.gid, days: data[Popup1CenterI].demo1 });
    if (!(res instanceof Error)) {
      setVisible(false);
      svgSet(false);
      playMP4Set(false)
      Popup1CenterISet(0);
      freshUser();
      userGetUserAsserGold();

      Toast.show({
        position: "center",
        icon: "success",
        content: t("goumaichenggongkeyiqianwangwodedaoju"),
      });
    }
  };

  const videoInfo2F = (info) => {
    console.log(info);
    // let { videoUrl, videoJson } = info;
    // if (videoUrl && videoJson) {
    //   playMP4Set(true)
    //   videoInfo2Set((e) => {
    //     return [...e, { src: videoUrl, config: videoJson }];
    //   });
    // } else {

    resourceUrlF(info?.resourceUrl);


    // }
  }

  return (
    <div className={style.bodys}>
      <CNavBar title={t("shangcheng")} left={true} />
      <div className={style.container}>
        {Loading ? (
          <div className={style.center}>
            {Array(6)
              .fill("")
              .map((item, index) => (
                <Skeleton key={index} animated className={style.customSkeleton} />
              ))}
          </div>
        ) : GetGiftListD.length ? (
          <div className={style.center}>
            {GetGiftListD.filter((a) => a.gid !== 41).map((value, index) => {
              return (
                <div
                  key={value.gid}
                  className={`${style.center_div} ${GetGiftListI == index ? style.center_border : ""}`}
                  onClick={() => {
                    videoInfo2F(value)

                    setVisible(true);
                    GetGiftListISet(index);
                    getElementByIdWayIndex(index);
                  }}>
                  <img
                    className={style.img}
                    src={value.cover}
                    alt=""
                  // onClick={() => {
                  //   resourceUrlF(value.resourceUrl);
                  // }}
                  />
                  <div className={style.bottom}>
                    <div style={{ overflow: "hidden" }}>
                      <div id={`way-${index}`} className={value.goBeyond ? style.bottom2 : ""}>
                        {value.gname}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <CEmpty description={t("zanwuzuojia")} />
        )}
        {GetGiftListI != -1 && GetGiftListD.length > 0 && (
          <div className={style.btnBox}>
            <Button
              className={style.buts}
              onClick={() => {
                setVisible(true);


                svgSet(true);

                // if (GetGiftListD[GetGiftListI].videoUrl && GetGiftListD[GetGiftListI].videoJson) {
                //   playMP4Set(true)
                // } else {
                //   svgSet(true);
                // }
              }}>
              {t("vipTxt4")}
            </Button>
          </div>
        )}
        <Popup
          visible={visible}
          onMaskClick={() => {
            Popup1CenterISet(0);
            setVisible(false);
            svgSet(false);
            playMP4Set(false)
            videoInfo2Set([])
          }}
          position="bottom"
          bodyClassName={style.windowBottom2}
        >
          <div style={{ width: '100vw', height: '100vh', }} onClick={() => {
            Popup1CenterISet(0);
            setVisible(false);
            svgSet(false);
            playMP4Set(false)
            videoInfo2Set([])
          }}>
            <div className={style.Popup1} onClick={(e) => e.stopPropagation()}>
              <div className={style.titles}>
                <div className={style.imgs}></div>
                <div>
                  {t("vipTxt4")} <span style={{ color: "#FF839B" }}>{GetGiftListD[GetGiftListI]?.gname}</span>
                </div>
                <div
                  className={style.imgs}
                  onClick={() => {
                    Popup1CenterISet(0);
                    setVisible(false);
                    svgSet(false);
                    playMP4Set(false)
                    videoInfo2Set([])
                  }}>
                  <img src={require("../../../assets/image/center/sc.png")} alt="" />
                </div>
              </div>
              <div className={style.Popup1Center}>
                {GetGiftListD[GetGiftListI]?.carConfigResponseList.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className={`${style.Popup1_center_div} ${Popup1CenterI == index ? style.Popup1_border : ""}`}
                      onClick={() => {
                        Popup1CenterISet(index);
                      }}>
                      <div>
                        {value.day}
                        {t("tian")}
                      </div>
                      <div className={style.Popup1_center_div_money}>
                        {value.totalPrice}
                        {t("ynd")}
                      </div>
                    </div>
                  );
                })}
              </div>
              {
                <div className={style.btnBox2}>
                  <Button
                    className={style.buts2}
                    loading='auto'
                    onClick={() => buyCarF()}>
                    {t("vipTxt4")}
                  </Button>
                </div>
              }
            </div>
          </div>
        </Popup>

        {/* 播放svg */}
        <div id="demoCanvas" style={{ width: "100vw", height: "calc(100vh - 390px)", pointerEvents: 'none', background: "rgba(0,0,0,0.5)", position: "fixed", top: "0px", left: "0", zIndex: "1200", display: `${svg ? "block" : "none"}` }}>
          {/* <div onClick={() => { svgSet(false) }} className={style.sclog}>
          <img src={require("../../../assets/image/center/cha.png")} alt="" />
        </div> */}
        </div>
        <div className={style.videoInfo2F} style={{ width: "100vw", height: "calc(100vh - 390px)", background: "rgba(0,0,0,0.5)", position: "fixed", top: "0px", left: "0", zIndex: "1200", display: `${playMP4 ? "block" : "none"}` }}>
          <VAP data={videoInfo2} type="1" loop={true} />
        </div>



        <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history("/recharge")} type={2} />
      </div>
    </div>
  );
};

export default Index;
