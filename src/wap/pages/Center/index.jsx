import { ActionSheet, Avatar, Toast } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Local } from "../../../common";
import { TabBar } from "../../components";
import useContextReducer from "../../state/useContextReducer";
import style from "./index.module.scss";
import i18n from "../../lang/i18n";
import { useCopy } from "../../../utils/copy";
import { getVipList } from "../../server/center";
import { BackAllGameCoin } from "../../server/balance";
const Share = React.lazy(() => import("./shares/index"));
const PointOut = React.lazy(() => import("../../components/pointOut/index"));
import { close } from "../../util/websockets";

let indexS = 1;
let times;
export default function Center() {
  const history = useNavigate();
  const {
    state: { user, assergoldData },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { loutOut, userGetUserAsserGold } = fetchUtils;
  const [visible, setVisible] = useState(false);
  // const [baseInfo, setBaseInfo] = useState({});
  const [backAllLodin, backAllLodinSet] = useState(false);
  const [handleAllBanks, handleAllBanksSet] = useState(false);
  // const [backAllLodinD,backAllLodinDSet]=useState({})

  const [list, setList] = useState([]);
  const [TakeIndex, TakeIndexSet] = useState(0);
  const [TakeIndex2, TakeIndexSet2] = useState(0);
  const [goldCoinT, goldCoinTSet] = useState(false);
  const [showShare, showShareSet] = useState(false);

  const [pointOuts, pointOutsSet] = useState(false);

  const copy = useCopy();
  const actions = [
    { text: "简体中文", key: "zh" },
    // { "text": "ENGLISH", "key": "en" },
    // { "text": "ไทย", "key": "th" },
    { text: "Tiếng Việt", key: "vie" },
  ];

  const nav = [
    // { name: t('ui_dep'), icon: 'center-nav1', url: '/recharge' },
    // { name: t('btn_withdraw'), icon: 'center-nav2', url: '/deposit' },
    // { name: t('ui_promo'), icon: 'center-nav3', url: '/home' },
    // { name: t('ui_vip_levels'), icon: 'center-nav4', url: '/level' },

    { name: t("reportDetailTitle"), icon: "jyjl", url: "/record", code: 10000 },
    { name: t("ui_bet_record"), icon: "tzjl", url: "/record", code: 20000 },
    // { name: '游戏记录', icon: 'yxjl', url: '/level' },
    { name: t("xiaofeijilu"), icon: "xfjl", url: "/record", code: 30000 },
    // { name: t('wodeguiz'), icon: 'wdgz', url: '/level' },
    { name: t("wodedaoju"), icon: "wddj", url: "/myProp" },
    // { name: t('wodeguanzhu'), icon: 'wdguanz', url: '/follow' },
    // { name: t('wodefenshi'), icon: 'wdfs', url: '/fans' },
    { name: t("join_07"), icon: "jrhylog", url: "/join" },
    { name: t("vipTxt4"), icon: "gm", url: "/buyProp" },
  ];

  const core = [
    { name: t("ui_withdraw"), icon: "tx", url: "/deposit" },
    { name: t("transTitle"), icon: "zz", url: "/balance" },
    { name: t("deposit"), icon: "ck", url: "/recharge" },
  ];

  const pageList = [
    {
      id: "1",
      list: [
        { name: t("gaunyuFbs"), icon: "gth", url: "/aboutFbs", f: true },
        // { name: t('btn_help'), icon: 'wh', url: '/balance', f: true },
        { name: t("yijianfankui"), icon: "fk", url: "/opinion", f: true },
      ],
    },
    {
      id: "2",
      list: [
        { name: t("ui_app_download"), icon: "icon-center-down", url: `//download.fbslive.com?agentId=${sessionStorage.getItem("agentId")}`, type: "down", f: true },
        // { name: t("ui_language_selection"), icon: "icon-center-lang", type: "lang", f: true },
        { name: t("logout"), icon: "icon-center-out", type: "out", f: false },
      ],
    },
  ];

  const backAll = async () => {
    backAllLodinSet(true);
    userGetUserAsserGold();
    setTimeout(() => {
      backAllLodinSet(false);
    }, 1000);
  };

  //一键回收
  const handleAllBank = async () => {
    const res = await BackAllGameCoin();
    if (!(res instanceof Error)) {
      // Toast.show(t('sys_check_pass'))
      // GetUserInfo()
      times = setTimeout(() => {
        handleAllBanksSet(false);
        clearTimeout(times);
        times = null;
      }, 3000);
      // freshUser();
      userGetUserAsserGold();
    }
  };

  const handleBottom = (item) => {
    if (!item.type) {
      history(item.url);
    } else {
      if (item.type === "out") {
        close();
        loutOut();
        localStorage.clear();
        location.replace("/login");
      }
      if (item.type === "lang") {
        setVisible(true);
      }
      if (item.type === "down") {
        window.open(item?.url);
      }
    }
  };

  // 选择语言事件
  const handleSelectLang = (e) => {
    let lang = `${e.key}`;
    Local("lang", lang);
    i18n.changeLanguage(lang);
    setVisible(false);
  };

  // 获取会员信息展示
  const getList = useCallback(async () => {
    const res = await getVipList();
    if (!(res instanceof Error)) {
      // console.log('这是多少数据', res);
      let list = res || [];
      list.forEach((value, index) => {
        if (index == 0) {
          value.Select = true;
        } else {
          value.Select = false;
        }
      });
      setList(list);
    }
  }, []);
  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (user?.badgeList != null && user?.badgeList != undefined) {
      if (user?.badgeList[0] != undefined) {
        user?.badgeList[1] == 6 && (TakeIndexSet(0), TakeIndexSet2(0));
        user?.badgeList[1] == 7 && (TakeIndexSet(1), TakeIndexSet2(1));
        user?.badgeList[1] == 8 && (TakeIndexSet(2), TakeIndexSet2(2));
        user?.badgeList[1] == 9 && (TakeIndexSet(3), TakeIndexSet2(3));
        user?.badgeList[1] == 10 && (TakeIndexSet(4), TakeIndexSet2(4));
      }
    }
  }, []);

  const [indesD, indexDSet] = useState(0);
  useEffect(() => {
    if (list[0] != undefined) {
      indexDSet(indexS);
    }
  }, [list]);

  useEffect(() => {
    if (list[0] != undefined) {
      getElementByIdWayIndex();
    }
  }, [indesD]);

  // 判断是否超出
  const getElementByIdWayIndex = () => {
    let data = [...list];
    // console.log(document.getElementById(`way-${0}`).scrollWidth, document.getElementById(`way-${0}`).offsetWidth);
    data.forEach((value, index) => {
      if (document.getElementById(`way-${index}`).scrollWidth > document.getElementById(`way-${index}`).offsetWidth) {
        value.goBeyond = true;
      } else {
        value.goBeyond = false;
      }
    });
    setList(data);
  };
  return (
    <div className={style.centerBody} style={{ height: window.innerHeight }}>
      <div className={style.head}>
        <div className={style.info}>
          <div
            onClick={() => {
              history("/personal");
            }}
            style={{ display: "flex", alignItems: "center" }}>
            <Avatar src={user?.avatar} alt="" className={style.avatar} style={{ "--size": "52.5px", "--border-radius": "100%" }} />
          </div>
          <div className={style.info_2}>
            <div className={style.nickname_box}>
              <div className={style.nickname}>{user?.nickname}</div>

              {/* 主播 */}
              {/* onClick={() => history("/myGrade", { state: 2 })}    我的等级页面暂时隐藏 */}
              {user?.badgeList != null && user?.badgeList != undefined && user?.badgeList[0] == 2 ? (
                <img className={style.level} style={{ marginLeft: "4.5px" }} src={require(`../../assets/image/live/level_${user?.anchorLevel ? user?.anchorLevel : 1}.png`)} />
              ) : (
                // 用户
                // onClick={() => history("/myGrade", { state: 1 })}  我的等级页面暂时隐藏
                <img className={style.level} src={require(`../../assets/image/live/level_${user?.userLevel ? user?.userLevel : 1}.png`)} />
              )}
              <img src={user?.sex == 1 ? require("../../assets/image/center/man.png") : require("../../assets/image/center/woman.png")} alt="" className={style.sex} style={{ "--size": "15.65px", "--border-radius": "100%" }} />
            </div>
            <div className={style.des} onClick={() => copy(user?.uid)}>
              {/*   <img src={require('../../assets/image/my/ID.png')} alt="" style={{ width: '14px', height: '10px' }} /> */}
              ID {user?.uid} <div style={{ width: "1px", height: "11px", background: "#999999", marginLeft: "6.5px", marginRight: "8px" }}></div>
              {/* <img src={require('../../assets/image/my/fz.png')} alt="" className={style.copy} /> */}
              {t("btn_copy")}
            </div>
            {/* 关注、粉丝 */}
            <div className={style.des2}>
              <div
                onClick={() => {
                  history("/fans");
                }}>
                {t("fensi")}：<span>{user?.fans}</span>
              </div>
              <div
                style={{ marginLeft: "18.5px" }}
                onClick={() => {
                  history("/follow");
                }}>
                {t("guanzhu")}：<span>{user?.follows}</span>
              </div>
            </div>
          </div>
          {/* 通知页面入口暂时隐藏 */}
          {/* <div className={style.rights}>
            <img src={require("../../assets/image/tx/kf1.png")} alt="" onClick={() => history("/notice")} />
          </div> */}
        </div>
        <div className={style.balance}>
          {/* vip信息 */}
          <div className={style.balance_top}>
            <div className={style.balance_cent}>
              {list.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${list.length - 1 != index ? style.pading : ""} ${style.positionR}`}
                    onClick={() => {
                      TakeIndexSet(index);
                    }}>
                    {/* onClick={() => { getElementByIdWayIndex(index), TakeIndexSet(index) }} */}
                    <div className={`${TakeIndex == index ? style.balance_cent_size : style.balance_cent_size2}`}>
                      <div style={{ overflow: "hidden" }}>
                        <div id={`way-${index}`} className={`${item?.goBeyond ? style.sizeGd : ""}`}>
                          {item?.name}
                        </div>
                      </div>
                    </div>
                    <div className={`${list.length - 1 != index ? style.border : ""} `}></div>
                  </div>
                );
              })}
            </div>
            <div className={style.bottom}>
              {
                user?.endTime != null && user?.endTime != undefined && user?.endTime.length && TakeIndex == TakeIndex2
                  ? (
                    <span>
                      {t("daoqishijian")}:{user?.endTime}
                    </span>
                  ) : (
                    <span>{t("vipTxt1", { 0: list[TakeIndex]?.price })}</span>
                  )}
              <div
                onClick={() => {
                  history("/level");
                }}>
                {t("chakanviptequan")}
                <img src={require("../../assets/image/my/gb/cktqright.png")} alt="" />
              </div>
            </div>
          </div>

          {/* 钱包中心 */}
          <div className={style.goldCoin}>
            <div onClick={() => history("/balance")} className={style.left}>
              <div className={style.goldCoin_s}>
                {t("qianbaozhongx")}
                <img
                  src={require(`../../assets/image/my/gb/${goldCoinT ? "byj" : "yj"}.png`)}
                  alt=""
                  onClick={(e) => {
                    goldCoinTSet(!goldCoinT);
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className={style.goldCoin_s2}>
                {goldCoinT ? (
                  "******"
                ) : (
                  <div style={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                    <div style={{ maxWidth: "60px", overflow: "hidden" }}>
                      <div id="goldCoinGd" className={document.getElementById(`goldCoinGd`)?.scrollWidth > 60 ? style.goldCoinGd : ""}>
                        {/* {user?.goldCoin} */}
                        {assergoldData?.goldCoin}
                      </div>
                    </div>
                    {/* <div>Xu</div> */}
                  </div>
                )}
                <img
                  src={require("../../assets/image/my/gb/sx.png")}
                  alt=""
                  className={backAllLodin ? style.xz : ""}
                  onClick={(e) => {
                    backAll();
                    e.stopPropagation();
                  }}
                />
                <img
                  style={{ marginLeft: "3.5px" }}
                  src={require("../../assets/image/my/gb/hs.png")}
                  alt=""
                  onClick={(e) => {
                    handleAllBanksSet(true);
                    handleAllBanks ? Toast.show(t("qingqiupingfan")) : handleAllBank(); //限制请求
                    e.stopPropagation();
                  }}
                />
              </div>
            </div>
            <div className={style.right}>
              {core.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (item.url == "/deposit") {
                        if (user?.phone == null || user?.phone == undefined) {
                          pointOutsSet(true);
                        } else {
                          history("/deposit");
                        }
                      } else {
                        history(item.url);
                      }
                    }}>
                    <img src={require(`../../assets/image/my/gb/${item.icon}.png`)} alt="" />
                    <div>{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={style.page}>
        {/* 首存活动 */}
        <div
          className={style.InitialDeposit}
          onClick={() => {
            history("/home");
          }}>
          {/* <div>
            {t("huodongzhongxin")}
            <span>▶</span>
          </div> */}
          {/* 待完善 切换越南语后滚动 */}
          <div className={`${style.RightBut} `}>
            <div style={{ overflow: "hidden" }}>
              {/* className={i18n.language == 'vie' ? style.RightBut2 : ''} */}
              <div>{t("btn_go_to_collect")}</div>
            </div>
          </div>
        </div>
        {/* 充值提现等 */}
        <div className={style.centerNav2}>
          {/* <div className={style.title}>{t('gengduofuwu')}</div> */}
          <div className={style.centerNav}>
            {nav.map((item) => (
              <div
                className={style.box}
                key={item.name}
                onClick={() => {
                  item.url == "/record" ? history("/record", { state: item.code }) : history(item.url);
                }}>
                <img src={require(`../../assets/image/my/gb/${item.icon}.png`)} alt="" />
                {/* className={i18n.language == 'vie' ? style.box_name : ''} */}
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 活动中心 */}
        {/* history('/friend') */}
        {Local("baseInfo")?.promotionShareIsOpen == 1 && (
          <div className={style.promition} onClick={() => showShareSet(true)}>
            <div>
              <div>{t("yaoqinghaoyouhuoqujingbi")}</div>
              <div className={style.font}>{t("hailiangjingbidengzheninna")}</div>
            </div>
            {<img src={require("../../assets/image/my/gb/yqhyhqjb.png")} alt="" />}
          </div>
        )}
        {/* 底部菜单 */}
        <div className={style.pageList} style={{ "--border-top": 0, "--border-inner": "1px solid #eee", "--border-bottom": 0 }}>
          {pageList.map((item_1, index_1) => {
            return (
              //  marginBottom: '5px',
              <div style={{ borderRadius: `${index_1 === 0 ? "8px 8px 0 0" : index_1 == pageList.length - 1 ? "0 0 8px 8px" : "0"}` }} key={item_1.id}>
                {item_1.list.map((item, index) => {
                  return (
                    <div
                      key={item?.name}
                      style={{ padding: "0 14px", background: "#fff", borderRadius: `${index == 0 && index_1 == 0 ? "8px 8px 0 0" : index_1 == pageList.length - 1 && item_1.list.length - 1 == index ? "0 0 8px 8px" : "0"}` }}
                      onClick={() => {
                        handleBottom(item);
                      }}>
                      <div style={{ borderBottom: `${item.f == false ? "0px" : "1px solid #f1f1f1"}`, height: "45.5px", display: "flex", alignItems: "center" }}>
                        <img src={require(`../../assets/image/my/gb/${item.icon}.png`)} className={style.icon} />
                        {/* borderRadius: '1px solid #f1f1f1',  */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            height: "45.5px",

                            fontSize: "12px",
                            fontFamily: "PingFang SC",
                            fontWeight: "400",
                            color: "#666666",
                          }}>
                          {item.name}
                          <img src={require("../../assets/image/my/gb/dbright.png")} className={style.right} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <TabBar active="/my" />
      <ActionSheet extra={t("ui_language_selection")} cancelText={t("cancel")} visible={visible} actions={actions} onClose={() => setVisible(false)} onAction={handleSelectLang} />
      {/* 分享弹窗开始 */}
      <Share show={showShare} onClose={() => showShareSet(false)} />
      {/* 提示 */}
      <PointOut
        visible={pointOuts}
        type={4}
        visibleSet={() => pointOutsSet(false)}
        but2={() => {
          history("/bindingPhone", { state: { i: 2 } });
        }}
      />
    </div>
  );
}
